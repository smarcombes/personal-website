(() => {
  const headings = [...document.querySelectorAll('.site-content h1, .site-content h2, .site-content h3')];
  if (headings.length < 2) return;
  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', 'Page sections');
  const links = headings.map((heading, index) => {
    if (!heading.id) {
      const base = heading.textContent.trim().toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      let id = base;
      for (let suffix = 2; document.getElementById(id); suffix++) id = `${base}-${suffix}`;
      heading.id = id;
    }
    heading.classList.add('section-target');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.setAttribute('aria-label', heading.textContent.trim());
    const bar = document.createElement('span');
    bar.className = 'section-nav-bar';
    bar.setAttribute('aria-hidden', 'true');
    const tooltip = document.createElement('span');
    tooltip.className = 'section-nav-tooltip';
    tooltip.textContent = heading.textContent.trim();
    tooltip.setAttribute('aria-hidden', 'true');
    link.append(bar, tooltip);
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.replaceState(null, '', link.hash);
      heading.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });
    nav.append(link);
    return link;
  });
  document.body.append(nav);
  document.body.classList.add('has-section-nav');
  let pending = false;
  function update() {
    pending = false;
    let active = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= innerHeight * 0.25) active = index;
    });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = headings.length - 1;
    links.forEach((link, index) => {
      const distance = Math.abs(index - active);
      link.style.setProperty('--bar-width', `${distance === 0 ? 24 : distance === 1 ? 16 : distance === 2 ? 10 : 6}px`);
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('.site-content'));
  update();
  // IDs are generated on load, so restore deep links after building the outline.
  const target = headings.find(heading => `#${heading.id}` === location.hash);
  if (target) target.scrollIntoView();
})();
