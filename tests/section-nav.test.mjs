import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = readFileSync(new URL('../assets/section-nav.js', import.meta.url), 'utf8');
function fixture({ reducedMotion = false, mobile = false } = {}) {
  const elements = [], jumps = [], haptics = [], events = new Map(), timers = new Map();
  let time = 0, serial = 0;
  class Element {
    constructor(tag = '') {
      this.tag = tag; this.children = []; this.attributes = {}; this.events = new Map();
      this.textContent = ''; this.id = ''; this.classes = new Set();
      this.classList = { add: x => this.classes.add(x), remove: x => this.classes.delete(x), toggle: (x, yes) => yes ? this.classes.add(x) : this.classes.delete(x) };
      this.style = { setProperty() {} };
      elements.push(this);
    }
    append(...children) { this.children.push(...children); }
    setAttribute(key, value) { this.attributes[key] = value; }
    removeAttribute(key) { delete this.attributes[key]; }
    addEventListener(name, callback) { this.events.set(name, callback); }
    emit(name, values = {}) { return this.events.get(name)?.({ pointerId: 1, isPrimary: true, button: 0, clientX: 10, preventDefault() {}, ...values }); }
    getBoundingClientRect() { return { left: 0, width: 400, height: 45, top: this.top ?? 0 }; }
    setPointerCapture(id) { this.capture = id; }
    hasPointerCapture(id) { return this.capture === id; }
    releasePointerCapture() { this.capture = null; }
    scrollIntoView(options) { jumps.push({ id: this.id, options }); }
    scrollTo(options) { jumps.push({ scroller: this, options }); }
    focus() {}
    contains(el) { return this === el || this.children.some(child => child.contains(el)); }
  }
  const headings = ['Research', 'Primitives', 'Experience', 'Contact'].map((title, i) => {
    const el = new Element('h2'); el.textContent = title; el.top = i * 1000; return el;
  });
  const content = new Element();
  content.clientHeight = 700; content.scrollTop = 0; content.scrollHeight = 4000;
  let audioStarts = 0;
  const parameter = { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} };
  class AudioContext {
    state = "running"; currentTime = 0; destination = {};
    resume() { return Promise.resolve(); }
    createOscillator() { return { frequency: parameter, connect() {}, disconnect() {}, start() { audioStarts++; }, stop() {} }; }
    createGain() { return { gain: parameter, connect() {}, disconnect() {} }; }
  }
  const document = {
    body: new Element('body'), documentElement: { scrollHeight: 5000 }, hidden: false,
    querySelectorAll: () => headings, querySelector: () => content,
    createElement: tag => new Element(tag), getElementById: id => elements.find(el => el.id === id),
    addEventListener: (name, fn) => events.set(`document:${name}`, fn),
  };
  const context = {
    document, navigator: { vibrate: duration => { haptics.push(duration); return true; } },
    location: { hash: '' }, history: { replaceState() {} }, window: { AudioContext },
    innerHeight: 800, scrollY: 0,
    matchMedia: query => ({ matches: query.includes('reduced-motion') ? reducedMotion : query.includes('max-width') && mobile, addEventListener() {} }),
    addEventListener: (name, fn) => events.set(name, fn),
    ResizeObserver: class { observe() {} },
    setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: time + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { fn(); },
  };
  vm.runInNewContext(source, context);
  const slider = elements.find(el => el.type === 'range');
  const title = elements.find(el => el.className === 'section-scrubber-title');
  function advance(ms) {
    const end = time + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      time = next[1].at; timers.delete(next[0]); next[1].fn();
    }
    time = end;
  }
  return { slider, title, jumps, haptics, advance, events, context, content, elements, audioStarts: () => audioStarts };
}

test('drag previews without scrolling; release commits the final section smoothly', () => {
  const f = fixture();
  f.slider.emit('pointerdown', { clientX: 150 });
  f.slider.emit('pointermove', { clientX: 270 });
  assert.equal(f.title.textContent, 'Experience');
  assert.equal(f.jumps.length, 0);
  f.slider.emit('pointerup');
  assert.equal(f.jumps[0].id, 'experience');
  assert.equal(f.jumps[0].options.behavior, 'smooth');
  f.advance(1000);
  assert.equal(f.jumps.length, 1);
});

test('one-second dwell resets on movement, commits while held, and does not repeat on release', () => {
  const f = fixture();
  f.slider.emit('pointerdown', { clientX: 150 });
  f.advance(800);
  f.slider.emit('pointermove', { clientX: 160 });
  f.advance(999);
  assert.equal(f.jumps.length, 0);
  f.advance(1);
  assert.equal(f.jumps[0].id, 'primitives');
  f.slider.emit('pointermove', { clientX: 390 });
  f.advance(1000);
  assert.equal(f.jumps[1].id, 'contact');
  f.slider.emit('pointerup');
  assert.equal(f.jumps.length, 2);
});

test('cancellation, capture loss and backgrounding cancel pending jumps', () => {
  for (const signal of ['pointercancel', 'lostpointercapture', 'blur']) {
    const f = fixture();
    f.slider.emit('pointerdown', { clientX: 270 });
    if (signal === 'blur') f.events.get('blur')(); else f.slider.emit(signal);
    f.advance(2000);
    assert.equal(f.jumps.length, 0, signal);
  }
});

test('haptics occur only on section changes; a second pointer is ignored', () => {
  const f = fixture();
  f.slider.emit('pointerdown', { clientX: 150 });
  f.slider.emit('pointermove', { clientX: 170 });
  f.slider.emit('pointermove', { clientX: 390, pointerId: 2 });
  assert.equal(f.haptics.length, 1);
  assert.equal(f.title.textContent, 'Primitives');
});

test('accessible slider input navigates and respects reduced motion', () => {
  const f = fixture({ reducedMotion: true });
  f.slider.value = '3';
  f.slider.emit('input');
  assert.equal(f.jumps[0].id, 'contact');
  assert.equal(f.jumps[0].options.behavior, 'instant');
  assert.equal(f.slider.attributes['aria-valuetext'], '4 of 4: Contact');
});


test('audio starts on the first gesture without a toggle and ticks on new selections', () => {
  const f = fixture();
  f.slider.emit('pointerdown', { clientX: 10 });
  assert.equal(f.audioStarts(), 1);
  f.slider.emit('pointermove', { clientX: 150 });
  assert.equal(f.audioStarts(), 2);
  f.slider.emit('pointermove', { clientX: 170 });
  assert.equal(f.audioStarts(), 2);
  assert.equal(f.elements.filter(el => el.tag === 'button').length, 0);
});

test('bar stays expanded until navigation finishes, then collapses', () => {
  const f = fixture();
  const bar = f.elements.find(el => el.className === 'section-scrubber');
  f.slider.emit('pointerdown');
  assert.ok(bar.classes.has('is-expanded'));
  f.advance(1500);
  assert.ok(bar.classes.has('is-expanded'));
  f.slider.emit('pointerup');
  f.advance(900);
  assert.ok(bar.classes.has('is-expanded'));
  f.content.emit('scrollend');
  f.advance(900);
  assert.ok(!bar.classes.has('is-expanded'));
});

test('mobile jumps scroll only the content viewport with a heading offset', () => {
  const f = fixture({ mobile: true });
  f.content.scrollTop = 200;
  f.slider.emit('pointerdown', { clientX: 270 });
  f.slider.emit('pointerup');
  assert.equal(f.jumps.length, 1);
  assert.equal(f.jumps[0].scroller, f.content);
  assert.equal(f.jumps[0].options.top, 2168);
  assert.equal(f.jumps[0].options.behavior, 'smooth');
});

test('mobile position follows the content scroller rather than the window', () => {
  const f = fixture({ mobile: true });
  f.content.scrollTop = 3300;
  f.content.emit('scroll');
  assert.equal(f.title.textContent, 'Contact');
  assert.equal(f.audioStarts(), 0);
});
