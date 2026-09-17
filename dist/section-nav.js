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
  const mobile = document.createElement('nav');
  mobile.className = 'section-scrubber';
  mobile.setAttribute('aria-label', 'Browse page sections');
  const title = document.createElement('div');
  title.className = 'section-scrubber-title';
  title.setAttribute('aria-hidden', 'true');
  const count = document.createElement('span');
  count.className = 'section-scrubber-count';
  count.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'section-scrubber-track';
  const ticks = headings.map(() => {
    const tick = document.createElement('span');
    tick.className = 'section-scrubber-tick';
    tick.setAttribute('aria-hidden', 'true');
    track.append(tick);
    return tick;
  });
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = String(headings.length - 1);
  slider.step = '1';
  slider.value = '0';
  slider.setAttribute('aria-label', 'Page section');
  slider.setAttribute('aria-describedby', 'section-scrubber-help');
  track.append(slider);
  const help = document.createElement('span');
  help.id = 'section-scrubber-help';
  help.className = 'section-scrubber-help';
  help.textContent = 'Slide to explore · release or hold to jump';
  mobile.append(title, count, track, help);
  document.body.append(mobile);
  const content = document.querySelector('.site-content');
  const mobileQuery = matchMedia('(max-width: 767px)');
  let audio;
  let audioReady;
  let collapseTimer;
  function expand() {
    clearTimeout(collapseTimer);
    mobile.classList.add('is-expanded');
  }
  function collapseLater() {
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(() => mobile.classList.remove('is-expanded'), 900);
  }
  function unlockAudio() {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      // Playback routing avoids WebKit's ambient/silent-switch audio category
      // where Audio Session is available. Hardware volume still applies.
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
      audio ||= new Audio();
      audioReady = audio.resume().catch(() => {});
    } catch { /* Navigation also works without Web Audio. */ }
  }
  function audioTick() {
    if (!audio) return;
    if (audio.state !== 'running') {
      audioReady?.then(() => { if (audio.state === 'running') audioTick(); });
      return;
    }
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(2200, now);
    oscillator.frequency.exponentialRampToValueAtTime(700, now + 0.025);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.045);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  // iOS does not expose drag-triggered haptics. Do not overlay an unrelated
  // native switch: that would consume the gesture without providing ticks.
  function tickHaptic() {
    try { navigator.vibrate?.(8); } catch { /* Optional hardware feedback. */ }
  }
  slider.addEventListener('touchstart', unlockAudio, { passive: true });
  slider.addEventListener('touchend', unlockAudio, { passive: true });
  slider.addEventListener('keydown', () => { unlockAudio(); expand(); });
  slider.addEventListener('focus', expand);
  slider.addEventListener('blur', collapseLater);
  let selected = 0;
  let pointer = null;
  let holdTimer;
  let settleTimer;
  let navigating = false;
  let lastJump = -1;
  let lastX = 0;
  function paint(index, haptic = false) {
    if (haptic && index !== selected) { tickHaptic(); audioTick(); }
    selected = index;
    slider.value = String(index);
    const label = headings[index].textContent.trim();
    slider.setAttribute('aria-valuetext', `${index + 1} of ${headings.length}: ${label}`);
    title.textContent = label;
    count.textContent = `${index + 1} / ${headings.length}`;
    ticks.forEach((tick, i) => {
      const distance = Math.abs(i - index);
      tick.style.setProperty('--tick-height', `${distance === 0 ? 28 : distance === 1 ? 19 : distance === 2 ? 12 : 7}px`);
      tick.classList.toggle('is-selected', i === index);
    });
  }
  function finishScroll() {
    clearTimeout(settleTimer);
    navigating = false;
    schedule();
  }
  function jump() {
    clearTimeout(holdTimer);
    if (selected === lastJump) return;
    lastJump = selected;
    navigating = true;
    clearTimeout(settleTimer);
    history.replaceState(null, '', `#${headings[selected].id}`);
    headings[selected].scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
    // scrollend is not available in every mobile browser.
    settleTimer = setTimeout(finishScroll, 1500);
  }
  function preview(x) {
    const bounds = track.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (x - bounds.left) / bounds.width));
    paint(Math.min(headings.length - 1, Math.floor(fraction * headings.length)), true);
    clearTimeout(holdTimer);
    holdTimer = setTimeout(jump, 1000);
  }
  slider.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || pointer !== null) return;
    event.preventDefault();
    pointer = event.pointerId;
    lastX = event.clientX;
    lastJump = -1;
    slider.setPointerCapture(pointer);
    unlockAudio();
    expand();
    audioTick();
    mobile.classList.add('is-scrubbing');
    preview(lastX);
  });
  slider.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointer || event.clientX === lastX) return;
    lastX = event.clientX;
    preview(lastX);
  });
  function endGesture(event, commit) {
    if (event.pointerId !== pointer) return;
    clearTimeout(holdTimer);
    if (commit) jump();
    const captured = pointer;
    pointer = null;
    mobile.classList.remove('is-scrubbing');
    collapseLater();
    if (slider.hasPointerCapture(captured)) slider.releasePointerCapture(captured);
    schedule();
  }
  slider.addEventListener('pointerup', event => endGesture(event, true));
  slider.addEventListener('pointercancel', event => endGesture(event, false));
  slider.addEventListener('lostpointercapture', event => endGesture(event, false));
  // Native range semantics preserve keyboard and screen-reader adjustment.
  slider.addEventListener('input', () => {
    if (pointer !== null) return;
    unlockAudio();
    expand();
    paint(Number(slider.value), true);
    collapseLater();
    lastJump = -1;
    jump();
  });
  function cancelGesture() {
    if (pointer !== null) endGesture({ pointerId: pointer }, false);
    clearTimeout(holdTimer);
    finishScroll();
  }
  addEventListener('blur', cancelGesture);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelGesture();
  });
  matchMedia('(min-width: 768px)').addEventListener('change', cancelGesture);
  addEventListener('scrollend', finishScroll);
  content.addEventListener('scrollend', finishScroll);
  document.addEventListener('pointerdown', event => {
    if (!mobile.contains(event.target)) finishScroll();
  }, { passive: true });
  addEventListener('wheel', finishScroll, { passive: true });
  let pending = false;
  function update() {
    pending = false;
    let active = 0;
    const viewHeight = mobileQuery.matches ? content.clientHeight : innerHeight;
    const offset = mobileQuery.matches ? content.scrollTop : scrollY;
    const totalHeight = mobileQuery.matches ? content.scrollHeight : document.documentElement.scrollHeight;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= viewHeight * 0.25) active = index;
    });
    if (offset + viewHeight >= totalHeight - 2) active = headings.length - 1;
    links.forEach((link, index) => {
      const distance = Math.abs(index - active);
      link.style.setProperty('--bar-width', `${distance === 0 ? 24 : distance === 1 ? 16 : distance === 2 ? 10 : 6}px`);
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (pointer === null && !navigating) paint(active);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  content.addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('.site-content'));
  paint(0);
  update();
  // IDs are generated on load, so restore deep links after building the outline.
  const target = headings.find(heading => `#${heading.id}` === location.hash);
  if (target) target.scrollIntoView();
})();
