# Why — the animation utilities I liked were web-only

## The pains
- [Tailwind Motion](https://rombo.co/tailwind-motion/) gives you lovely animation utility classes (`motion-scale-in`, `motion-preset-fade`, …) — but only on the web.
- On React Native you rewrite the same animations by hand in a different API (Reanimated/Moti).
- The mental model and the class vocabulary don't carry across platforms.

## The underlying design problem

Tailwind Motion is implemented as a Tailwind plugin that emits CSS — and CSS animations don't exist on native. So the same design intent has to be expressed twice, in two different idioms. The fix is to make the *same class strings* mean the same thing on native by translating them into Moti props, rather than reimplementing each animation.

# Design decisions

## The ideal
- **Identical class strings across web and native.** `motion-preset-fade motion-duration-500` should behave the same everywhere.
- **Reuse Tailwind Motion's own logic**, don't fork it — run its real plugin against a mock engine so presets and timing stay in sync.
- **Render through Moti/Reanimated** so animations are native, not JS-thread hacks.

## How the system works

```tsx
<MotiView classes="motion-preset-fade motion-duration-500">
  <Text>Fades in</Text>
</MotiView>
```

The library reimplements Tailwind's plugin API surface (`matchUtilities`, `matchComponents`, `addBase`, `theme`) as a mock engine. Tailwind Motion's own `pluginCreator` runs against that mock and produces CSS-like declarations (`--motion-*` variables + an `animation` shorthand), which are then translated into Moti config.

# The tech onion

1. **Mock Tailwind engine** — stands in for Tailwind so the upstream plugin runs unchanged and emits its declarations.
2. **Resolver** — CSS variables resolved via PostCSS + `postcss-calc`; the `animation` shorthand parsed into `name`, `duration`, `timingFunction`, `delay`, `direction`.
3. **Keyframes registry → Moti** — animation names map to `{ from, animate, exit? }` objects that become Moti `transition` config and props. Multiple comma-separated animations are merged (per-key transitions built, shared fields hoisted).

## The hard parts
- Faithfully emulating enough of Tailwind's plugin API for the real plugin to run.
- Mapping CSS keyframe semantics onto Moti's from/animate/exit model.

## The good parts
- Supports scale, translate, rotate, opacity, blur, and color in/out, plus presets (fade, slides, blur+slide, bounce, expand/shrink, pop/compress, shake, wiggle, …) — the same vocabulary as the web.

## Stack
Bun · PostCSS · Moti (React Native Reanimated).

# Recognition
No formal recognition — a focused utility spun out of [layouts.dev](./layouts-dev.md) (2024).
