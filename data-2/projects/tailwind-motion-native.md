# tailwind-motion-native

> [Tailwind Motion](https://rombo.co/tailwind-motion/) animation utilities ported to React Native via Moti.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![React Native](https://img.shields.io/badge/-React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)](#)

Tailwind Motion adds animation utility classes to Tailwind CSS (`motion-scale-in`, `motion-preset-fade`, etc.). It's web-only. This project ports those animation primitives to React Native by translating the same class strings into Moti animation props.

## Usage

```tsx
<MotiView classes="motion-preset-fade motion-duration-500">
  <Text>Fades in</Text>
</MotiView>
```

Same class strings as the web, same presets, same timing — just rendered through Reanimated on native.

## How it works

The library reimplements Tailwind's plugin API surface as a mock engine (`matchUtilities`, `matchComponents`, `addBase`, `theme`). The same `pluginCreator` function that Tailwind Motion uses for web runs against this mock and produces CSS-like declarations (`--motion-*` variables + animation shorthand).

From there:
1. CSS variables are resolved via PostCSS + postcss-calc
2. The `animation` shorthand is parsed into `name`, `duration`, `timingFunction`, `delay`, `direction`
3. The animation name is looked up in a keyframes registry → `{ from, animate, exit? }` objects
4. Those map to Moti `transition` config and animation props

Multiple animations (comma-separated classes) are merged: per-key transitions are built, shared transition fields are hoisted.

## Supported

Scale in/out · Translate in/out · Rotate in/out · Opacity in/out · Blur in/out · Background/text color in/out

Presets: fade, slide variants, blur+slide combos, bounce, expand/shrink, pop/compress, shake, wiggle, and more.

## Stack

Bun · PostCSS · Moti (React Native Reanimated)

→ spun out from [layouts.dev](./layouts-dev.md) · 2024
