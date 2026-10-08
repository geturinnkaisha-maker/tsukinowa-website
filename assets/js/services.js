(() => {
  const services = (window.SERVICES_DATA || []).filter(service => service && typeof service.title === 'string');
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  document.querySelectorAll('[data-services]').forEach(list => {
    list.replaceChildren(...services.map(service => {
      const article = node('article', null, 'service-row');
      if (Array.isArray(service.caseIds)) {
        const examples = node('div', null, 'service-repair-examples');
        service.caseIds.forEach(id => {
          const work = (window.WORKS_DATA || []).find(item => item.id === id && item.published === true && item.imageType === 'real' &&
            item.beforeImage === `assets/images/works/real/${id}/before.webp` && item.afterImage === `assets/images/works/real/${id}/after.webp`);
          if (!work) return;
          const example = node('section', null, 'service-repair-example');
          example.append(node('h4', work.title));
          const pair = node('div', null, 'service-repair-pair');
          [['Before', work.beforeImage], ['After', work.afterImage]].forEach(([label, src]) => {
            const figure = node('figure');
            const img = node('img');
            img.src = src; img.alt = `${work.title} ${label}`; img.loading = 'lazy';
            figure.append(img, node('figcaption', label));
            pair.append(figure);
          });
          example.append(pair);
          examples.append(example);
        });
        article.append(examples);
      } else if (typeof service.image === 'string' && /^assets\/images\/[a-zA-Z0-9/_.-]+$/.test(service.image) && !service.image.includes('..')) {
        const figure = node('figure');
        const img = node('img');
        img.src = service.image; img.alt = service.alt || service.title;
        img.width = 800; img.height = 600; img.loading = 'lazy';
        figure.append(img);
        if (service.caption) figure.append(node('figcaption', service.caption));
        article.append(figure);
      } else article.classList.add('service-text-only');
      const copy = node('div', null, 'service-copy');
      const link = node('a', '詳しく見る', 'text-link service-detail');
      link.href = `contact.html?service=${encodeURIComponent(service.title)}`;
      const arrow = node('span', ' →'); arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow, node('span', `：${service.title}の相談・見積り案内`, 'sr-only'));
      copy.append(node('h3', service.title), node('p', service.description), link);
      article.append(copy);
      return article;
    }));
  });
  document.querySelectorAll('[data-service-options]').forEach(select => {
    select.replaceChildren(...[...new Set(services.map(service => service.title)), 'その他・ご相談'].map(title => {
      const option = node('option', title); option.value = title; return option;
    }));
    const requested = new URLSearchParams(location.search).get('service');
    select.value = services.some(service => service.title === requested) ? requested : 'その他・ご相談';
  });
})();
