const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = process.cwd();
const requests = [], failures = [], errors = [];
const screenshots = process.env.SCREENSHOT_DIR;
if (screenshots) fs.mkdirSync(screenshots,{recursive:true});
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'};
const server = http.createServer((req,res) => {
  requests.push({method:req.method,url:req.url});
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true});
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400) failures.push(`${response.status()} ${response.url()}`);});
    page.on('requestfailed',request=>failures.push(request.url()));
    async function load(file) {
      await page.goto(`${base}/${file}`,{waitUntil:'networkidle'});
      await page.evaluate(async () => {
        for (const image of document.images) image.loading='eager';
        await Promise.all(Array.from(document.images,image=>image.decode().catch(()=>{})));
      });
    }
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      for (const file of ['index.html','works.html','contact.html','company.html','privacy.html','legal.html']) {
        await load(file);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), `${file} overflows at ${width}`);
        assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
        assert.ok(!/くらしのマーケット|暮らしのマーケット|外部サービスにも掲載/.test(await page.locator('body').innerText()));
        if (['index.html','works.html'].includes(file)) {
          assert.ok(await page.locator('.comparison img').evaluateAll(images => images.every(img => {
            const css = getComputedStyle(img), rect = img.getBoundingClientRect();
            return css.objectFit === 'contain' && css.aspectRatio === 'auto' &&
              Math.abs(rect.width / rect.height - img.naturalWidth / img.naturalHeight) < 0.005;
          })), `complete image ratio: ${file} at ${width}`);
          assert.equal(await page.locator('[data-works] .work').count(), file === 'index.html' ? 4 : 7);
          if (file === 'works.html') {
            const pet = page.locator('#wallpaper-restoration');
            assert.equal(await pet.locator('h3').innerText(),'ペットによる壁面破損の補修');
            assert.equal(await pet.locator('.work-tag').innerText(),'壁面補修');
          }
          const expected = [['tile-carpet-replacement','タイルカーペット張替え','CF・床施工'],['cat-scratch-wallpaper','猫の引っかき傷によるクロス張替え','クロス張替え'],['screen-replacement','網戸張替え','その他内装補修']];
          for (const [id,title,category] of expected) {
            const item = page.locator('#'+id);
            assert.equal(await item.locator('h3').innerText(),title);
            assert.equal(await item.locator('.work-tag').innerText(),category);
            assert.equal(await item.locator('p').count(),0);
          }
        }
        if (['index.html','contact.html'].includes(file)) {
          assert.equal(await page.locator('[data-line-qr-placeholder]').isVisible(),false);
          assert.equal(await page.locator('[data-line-qr-image]').isVisible(),true);
          assert.equal(await page.locator('[data-line-qr-image]').getAttribute('src'),'assets/images/line/line-qr.png');
          assert.ok(await page.locator('[data-line-qr-image]').evaluate(img=>img.naturalWidth===900 && img.naturalHeight===900));
        }
        if (file === 'index.html') {
          assert.equal(await page.locator('.advantage').count(),3);
          assert.match(await page.locator('#personal-pricing .price').innerText(),/1,400円\/㎡/);
          assert.match(await page.locator('#personal-pricing h3').innerText(),/材工込み/);
        }
        if (file === 'contact.html') {
          assert.equal(await page.locator('button[type="submit"]').isDisabled(),true);
          assert.ok(await page.locator('#form-availability').evaluate(note => note.compareDocumentPosition(document.getElementById('name')) & Node.DOCUMENT_POSITION_FOLLOWING));
          assert.ok(await page.locator('.contact-methods').evaluate(options => options.compareDocumentPosition(document.getElementById('contact-form')) & Node.DOCUMENT_POSITION_FOLLOWING));
        }
        assert.ok(await page.locator('[data-phone]').evaluateAll(links=>links.every(link=>link.getAttribute('href')==='tel:070-3887-7789')));
        assert.ok(await page.locator('[data-email]').evaluateAll(links=>links.every(link=>link.getAttribute('href')==='mailto:geturinnkaisha@gmail.com')));
        assert.ok(await page.locator('[data-line]').evaluateAll(links=>links.every(link=>link.getAttribute('href')==='contact.html#line')));
        assert.ok(await page.evaluate(()=>Array.from(document.images).every(image=>image.naturalWidth>0 || image.hidden)));
        if(screenshots) await page.screenshot({path:path.join(screenshots,`${file.replace('.html','')}-${width}.png`),fullPage:true});
        if(width<=600) assert.ok(await page.locator('.mobile-contact').evaluate(el=>el.getBoundingClientRect().height<=65));
      }
    }
    await load('index.html');
    assert.equal(await page.locator('[data-works] .work').count(),4);
    assert.equal(await page.locator('[data-services] .service-row').count(),4);
    assert.equal(await page.locator('#pet-wall-repair').count(),0);
    assert.ok(!/AI生成・施工事例ではありません/.test(await page.locator('body').innerText()));
    await load('works.html');
    assert.equal(await page.locator('[data-works] .work').count(),7);
    assert.equal(await page.locator('.comparison img').count(),14);
    for(const [label,count] of [['ドア補修',2],['壁面補修',2],['クロス張替え',1],['CF・床施工',1],['その他内装補修',1],['すべて',7]]) {
      await page.getByRole('button',{name:label,exact:true}).click();
      assert.equal(await page.locator('[data-works] .work').count(),count);
    }
    const original = page.locator('#white-grain-door .work-photo-link').first();
    assert.equal(await original.getAttribute('href'), 'assets/images/works/real/white-grain-door/before.webp');
    const [photoPage] = await Promise.all([context.waitForEvent('page'), original.click()]);
    await photoPage.waitForLoadState();
    assert.match(photoPage.url(),/white-grain-door\/before.webp$/);
    await photoPage.close();
    await page.getByRole('button',{name:'壁面補修',exact:true}).click();
    await page.evaluate(()=>location.hash='wood-grain-door');
    await page.waitForFunction(()=>document.getElementById('wood-grain-door'));
    assert.equal(await page.locator('[data-works] .work').count(),7);
    await load('contact.html?service=内装補修');
    assert.equal(await page.locator('#service').inputValue(),'内装補修');
    for(const [selector,value] of [['#name','テスト'],['#phone','070-0000-0000'],['#email','test@example.com'],['#area','板橋区'],['#message','ドアの補修を相談したいです。'],['#timing','11月頃']]) await page.locator(selector).fill(value);
    await page.locator('#photos').setInputFiles('assets/images/works/real/wood-grain-door/before.webp');
    await page.waitForFunction(()=>document.querySelector('#photo-previews img')?.naturalWidth>0);
    assert.equal(await page.locator('#photo-previews img').count(),1);
    assert.equal(await page.locator('button[type="submit"]').isDisabled(),true);
    const requestCount=requests.length;
    await page.evaluate(()=>document.querySelector('#contact-form').requestSubmit());
    assert.equal(requests.length,requestCount);
    assert.match(await page.locator('#submit-note').innerText(),/送信されません/);
    await page.locator('#photos').setInputFiles([]);
    assert.equal(await page.locator('#photo-previews img').count(),0);
    await page.locator('#photos').setInputFiles({name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')});
    assert.equal(await page.locator('#photo-previews img').count(),0);
    assert.match(await page.locator('#photo-status').innerText(),/JPEG/);
    assert.equal(await page.locator('[data-line-direct]').isVisible(),false);
    await page.setViewportSize({width:1440,height:900});
    assert.equal(await page.locator('[data-line-qr]').isVisible(),true);
    assert.equal(await page.locator('[data-line-qr-image]').isVisible(),true);
    // Configured LINE uses only a supplied URL and QR; never generate one.
    await page.route('**/assets/js/data.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync('assets/js/data.js','utf8').replace('"lineUrl": ""','"lineUrl": "https://line.me/R/ti/p/test-fixture"').replace('"lineQrReady": false','"lineQrReady": true')}));
    // Fixture bytes validate the image loading mechanics; never a production QR.
    await page.route('**/assets/images/line/line-qr.png',route=>route.fulfill({contentType:'image/webp',body:fs.readFileSync('assets/images/works/real/wood-grain-door/after.webp')}));
    await load('contact.html');
    assert.equal(await page.locator('[data-line-qr-image]').isVisible(),true);
    await load('index.html');
    assert.equal(await page.locator('[data-line-qr-image]').isVisible(),true);
    await load('contact.html');
    await page.setViewportSize({width:390,height:900});
    assert.equal(await page.locator('[data-line-direct]').isVisible(),true);
    assert.equal(await page.locator('[data-line-direct]').getAttribute('href'),'https://line.me/R/ti/p/test-fixture');
    // Broken/unavailable uploaded image falls back to the same visible slot.
    await page.unroute('**/assets/images/line/line-qr.png');
    await page.route('**/assets/images/line/line-qr.png',route=>route.fulfill({contentType:'image/png',body:'invalid image fixture'}));
    await load('contact.html');
    assert.equal(await page.locator('[data-line-qr-image]').isVisible(),false);
    assert.equal(await page.locator('[data-line-qr-placeholder]').isVisible(),true);
    await page.unroute('**/assets/images/line/line-qr.png');
    await page.unroute('**/assets/js/data.js');
    // Five/six synthetic records expose the latest-four cap and all-items behavior.
    // Reuse only real paired fixture bytes for deterministic local test requests.
    await page.route('**/assets/js/works-data.js',route=>route.fulfill({contentType:'text/javascript',body:`window.WORKS_DATA=Array.from({length:6},(_,i)=>({id:'fixture-'+i,title:'Fixture '+i,category:'追加カテゴリ',date:'2026-0'+(i+1),publishedAt:'2026-10-05',imageType:'real',published:true,beforeImage:'assets/images/works/real/fixture-'+i+'/before.webp',afterImage:'assets/images/works/real/fixture-'+i+'/after.webp'}));`}));
    await page.route('**/works/real/fixture-*/*.webp',route=>route.fulfill({contentType:'image/webp',body:fs.readFileSync('assets/images/works/real/wood-grain-door/before.webp')}));
    await load('index.html');
    assert.deepEqual(await page.locator('[data-works] .work').evaluateAll(items=>items.map(item=>item.id)),['fixture-5','fixture-4','fixture-3','fixture-2']);
    await load('works.html'); assert.equal(await page.locator('[data-works] .work').count(),6);
    await page.getByRole('button',{name:'追加カテゴリ'}).click();assert.equal(await page.locator('[data-works] .work').count(),6);
    // A failed image hides its entire case and the homepage fills from the next complete case.
    await page.route('**/works/real/fixture-5/after.webp',route=>route.fulfill({contentType:'image/webp',body:'unavailable-image-fixture'}));
    await load('index.html');
    assert.deepEqual(await page.locator('[data-works] .work').evaluateAll(items=>items.map(item=>item.id)),['fixture-4','fixture-3','fixture-2','fixture-1']);
    await load('works.html');
    assert.equal(await page.locator('[data-works] .work').count(),5);
    assert.equal(await page.locator('#fixture-5').count(),0);
    assert.ok(!/写真を確認中|施工写真は掲載準備中/.test(await page.locator('[data-works]').innerText()));
    await page.unroute('**/works/real/fixture-5/after.webp');
    await page.unroute('**/assets/js/works-data.js');
    // Drafts with absent files, missing Before/After, and blank metadata request no images.
    await page.route('**/assets/js/works-data.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync('assets/js/works-data.js','utf8')+`
      const base={id:'hidden-fixture',title:'Hidden',category:'穴補修',imageType:'real',published:true,beforeImage:'assets/images/works/real/hidden-fixture/before.webp',afterImage:'assets/images/works/real/hidden-fixture/after.webp'};
      window.WORKS_DATA.push({...base,published:false},{...base,afterImage:''},{...base,beforeImage:''},{...base,title:' '},{...base,category:''});
    `}));
    for (const file of ['index.html','works.html']) {
      await load(file);
      assert.equal(await page.locator('[data-works] .work').count(),file === 'index.html' ? 4 : 7);
      assert.equal(await page.locator('#hidden-fixture').count(),0);
      assert.ok(!/施工準備中|施工写真は掲載準備中/.test(await page.locator('[data-works]').innerText()));
    }
    assert.equal(await page.getByRole('button',{name:'穴補修',exact:true}).count(),0);
    assert.equal(requests.filter(request=>request.url.includes('hidden-fixture') || request.url.includes('/_template/')).length,0);
    await page.unroute('**/assets/js/works-data.js');
    await page.route('**/assets/js/works-data.js',route=>route.fulfill({contentType:'text/javascript',body:'window.WORKS_DATA=[];'}));
    await load('works.html');
    assert.equal(await page.locator('[data-works]').innerText(),'');
    assert.equal(await page.locator('[data-works] .work').count(),0);
    await page.unroute('**/assets/js/works-data.js');
    await page.route('**/assets/js/services-data.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync('assets/js/services-data.js','utf8')+'window.SERVICES_DATA.push({title:"内装デザイン",description:"テスト用追加サービス"});'}));
    await load('index.html');assert.equal(await page.locator('[data-services] .service-row').count(),5);
    await load('contact.html?service=内装デザイン');assert.equal(await page.locator('#service').inputValue(),'内装デザイン');
    assert.equal(requests.filter(request=>request.method!=='GET').length,0);
    assert.ok(requests.some(request=>request.url.includes('/assets/images/line/line-qr.png')));
    assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
    assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);
    console.log('PASS: 6 pages × 4 widths, noindex, contacts, LINE, full photo ratios, latest 4/all/filter/hash, hidden drafts/incomplete/failed-image cases, no empty cards or future category filters, no resource errors.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
