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
  const controls = document.createElement('div');
  controls.className = 'section-scrubber-controls';
  const sound = document.createElement('button');
  sound.type = 'button';
  sound.className = 'section-scrubber-sound';
  sound.textContent = 'Sound off';
  sound.setAttribute('aria-label', 'Enable section tick sounds');
  sound.setAttribute('aria-pressed', 'false');
  controls.append(help, sound);
  mobile.append(title, count, track, controls);
  document.body.append(mobile);

  let audio;
  let soundEnabled = false;
  function audioTick() {
    if (!soundEnabled || !audio || audio.state !== 'running') return;
    // A short, quiet pulse with a steep pitch drop, like a click wheel detent.
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1800, now);
    oscillator.frequency.exponentialRampToValueAtTime(550, now + 0.018);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.03);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  sound.addEventListener('click', async () => {
    soundEnabled = !soundEnabled;
    try {
      if (soundEnabled) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        audio ||= new Audio();
        await audio.resume();
        if (audio.state !== 'running') soundEnabled = false;
      }
    } catch { soundEnabled = false; }
    sound.textContent = soundEnabled ? 'Sound on' : 'Sound off';
    sound.setAttribute('aria-pressed', String(soundEnabled));
    sound.setAttribute('aria-label', soundEnabled ? 'Mute section tick sounds' : 'Enable section tick sounds');
    audioTick();
  });

  // Native vibration on supporting browsers; older WebKit versions can tick
  // a native switch. Newer iOS versions may suppress this fallback entirely.
  // Never play audio or interfere with the scrub gesture to simulate haptics.
  let hapticLabel;
  function tickHaptic() {
    try {
      if (typeof navigator.vibrate === 'function' && navigator.vibrate(8)) return;
      if (!hapticLabel) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        if (!('switch' in input)) return;
        input.setAttribute('switch', '');
        input.tabIndex = -1;
        hapticLabel = document.createElement('label');
        hapticLabel.className = 'section-haptic';
        hapticLabel.setAttribute('aria-hidden', 'true');
        hapticLabel.append(input);
        document.body.append(hapticLabel);
      }
      hapticLabel.click();
    } catch { /* Haptic support must never block navigation. */ }
  }

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
    if (soundEnabled && audio?.state === 'suspended') audio.resume().catch(() => {});
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
    if (slider.hasPointerCapture(captured)) slider.releasePointerCapture(captured);
    schedule();
  }
  slider.addEventListener('pointerup', event => endGesture(event, true));
  slider.addEventListener('pointercancel', event => endGesture(event, false));
  slider.addEventListener('lostpointercapture', event => endGesture(event, false));
  // Native range semantics preserve keyboard and screen-reader adjustment.
  slider.addEventListener('input', () => {
    if (pointer !== null) return;
    paint(Number(slider.value), true);
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
  document.addEventListener('pointerdown', event => {
    if (!mobile.contains(event.target)) finishScroll();
  }, { passive: true });
  addEventListener('wheel', finishScroll, { passive: true });
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
    if (pointer === null && !navigating) paint(active);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('.site-content'));
  paint(0);
  update();
  // IDs are generated on load, so restore deep links after building the outline.
  const target = headings.find(heading => `#${heading.id}` === location.hash);
  if (target) target.scrollIntoView();
})();
