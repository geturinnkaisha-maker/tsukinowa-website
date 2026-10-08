(() => {
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const validId = id => typeof id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(id);
  // Explicit provenance AND the case's own real-photo paths are required.
  // This guard prevents accidental mixing; maintainers still verify photo provenance.
  const isPublishedReal = work => work && validId(work.id) && work.published === true &&
    work.imageType === 'real' && typeof work.title === 'string' && work.title.trim() &&
    typeof work.category === 'string' && work.category.trim() &&
    work.beforeImage === `assets/images/works/real/${work.id}/before.webp` && work.afterImage === `assets/images/works/real/${work.id}/after.webp`;
  const dateKey = value => {
    if (typeof value !== 'string') return '';
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return `${value}-01`;
    if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) return value;
    return '';
  };
  const publishedWorks = data => {
    const ids = new Set();
    return (Array.isArray(data) ? data : []).filter(work => {
      if (!isPublishedReal(work) || ids.has(work.id)) return false;
      ids.add(work.id);
      return true;
    }).sort((a, b) => {
      const key = work => dateKey(work.date) || dateKey(work.publishedAt);
      return key(b).localeCompare(key(a)) || dateKey(b.publishedAt).localeCompare(dateKey(a.publishedAt)) || a.id.localeCompare(b.id);
    });
  };
  window.WORKS = { publishedWorks }; // Shared selection rule for both pages and validation.
  let works = [];
  let revealCurrent = () => {};
  let activeCategory = '';
  const redraws = [];
  // Verify both actual images before rendering, so an incomplete case never gets a card.
  const imageReady = src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0 && image.naturalHeight > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  });
  const completeWorks = async data => {
    const candidates = publishedWorks(data);
    const ready = await Promise.all(candidates.map(async work => {
      const pair = await Promise.all([imageReady(work.beforeImage), imageReady(work.afterImage)]);
      return pair.every(Boolean);
    }));
    return candidates.filter((work, index) => ready[index]);
  };
  function renderWork(work, preview) {
    const article = node('article', null, 'work');
    article.id = work.id;
    article.dataset.imageType = 'real';
    article.dataset.category = work.category;
    const pair = node('div', null, 'comparison');
    [['BEFORE', work.beforeImage], ['AFTER', work.afterImage]].forEach(([label, src]) => {
      const figure = node('figure');
      const image = node('img');
      image.alt = `${work.title} ${label}の実際の施工写真`;
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        // Also hide the whole case if a previously verified image becomes unavailable.
        works = works.filter(item => item.id !== work.id);
        redraws.forEach(draw => draw());
      }, { once: true });
      image.src = src;
      if (preview) figure.append(image);
      else {
        const original = node('a', null, 'work-photo-link');
        original.href = src;
        original.target = '_blank';
        original.rel = 'noopener';
        original.setAttribute('aria-label', `${work.title} ${label}の写真を大きく見る（新しいタブ）`);
        original.append(image);
        figure.append(original);
      }
      figure.append(node('figcaption', label));
      pair.append(figure);
    });
    const heading = node('div', null, 'work-heading');
    const title = node('h3');
    if (preview) {
      const link = node('a', work.title);
      link.href = `works.html#${work.id}`;
      title.append(link);
    } else title.textContent = work.title;
    heading.append(title);
    const tags = node('div', null, 'work-tags');
    tags.append(node('span', work.category, 'work-tag'));
    if (preview) {
      const link = node('a', null, 'work-preview-link');
      link.href = `works.html#${work.id}`;
      link.setAttribute('aria-label', `${work.title}の施工事例を見る`);
      link.append(pair);
      article.append(link, heading, tags);
    } else {
      article.append(pair, heading, tags);
      const details = node('dl');
      [['施工年月', dateKey(work.date) ? work.date : ''], ['地区', work.area], ['物件', work.propertyType]].forEach(([label, value]) => {
        if (value) details.append(node('dt', label), node('dd', value));
      });
      if (details.childElementCount) article.append(details);
      if (work.description) article.append(node('p', work.description));
    }
    return article;
  }
  document.querySelectorAll('[data-works]').forEach(grid => {
    const preview = grid.hasAttribute('data-work-preview');
    const draw = category => {
      const limit = Number.parseInt(grid.dataset.workLimit || '4', 10);
      const featured = works.filter(work => work.homeFeatured === true).sort((a, b) => (a.homeOrder || 0) - (b.homeOrder || 0));
      const visible = preview ? (featured.length ? featured : works).slice(0, Number.isFinite(limit) && limit > 0 ? limit : 4) : works;
      const selected = category ? visible.filter(work => work.category === category) : visible;
      grid.replaceChildren(...selected.map(work => renderWork(work, preview)));
    };
    const filters = !preview && document.querySelector('[data-work-filters]');
    const update = () => {
      if (filters) {
        filters.replaceChildren();
        const categories = ['', ...new Set(works.map(work => work.category))];
        if (!categories.includes(activeCategory)) activeCategory = '';
        categories.forEach(category => {
          const button = node('button', category || 'すべて', 'work-filter');
          button.type = 'button';
          button.setAttribute('aria-pressed', String(category === activeCategory));
          button.addEventListener('click', () => {
            activeCategory = category;
            filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
            draw(category);
          });
          filters.append(button);
        });
      }
      draw(preview ? '' : activeCategory);
    };
    redraws.push(update);
    if (!preview) {
      const reveal = () => {
        let id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        if (!works.some(work => work.id === id)) return;
        activeCategory = ''; update();
        document.getElementById(id)?.scrollIntoView();
      };
      revealCurrent = reveal;
      window.addEventListener('hashchange', reveal);
    }
  });
  // Single data boundary: a future same-origin server can supply this array.
  if (redraws.length) completeWorks(window.WORKS_DATA).then(complete => {
    works = complete;
    redraws.forEach(draw => draw()); revealCurrent();
  });
})();
