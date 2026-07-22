# HipHop

> AI image generation as a meta-API. One endpoint, one query language, any model. Plus `<ImageOf of="a sunset over Barcelona" />`.

[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![Year](https://img.shields.io/badge/2023-lightgrey?style=flat-square)](#)

Three layers: a unified image generation API with a pipe-based query language, a React component library, and a Figma plugin.

## The query language

```
<generator>: <prompt> %<variant> | <transform1> | <transform2>

a sunset over Barcelona
realistic: a portrait of a cat
a dog in a park | resize 512 512 | remove background
civitai/12345: cyberpunk cityscape %3
```

Generators: Stable Diffusion, DALL-E, or any CivitAI model — given a CivitAI image URL, the backend fetched the model, prompt, all corresponding LoRAs, and reproduced the image with identical configuration. ~1TB of cached CivitAI models on RunPod.

Pipe transforms: resize, format, color adjustments (classic) + add element, remove person, change background (AI).

Presets: model + prompt template with variables. Designers create "styles" without knowing about models.

## React component library

```jsx
<ImageOf of="a sunset over Barcelona" />
<ImageOf of="realistic: a portrait of a woman reading" />
```

If `of` is a URL → plain `<img>`. Otherwise → calls `useImageSrcOf()` hook → skeleton → resolved image. `localStorage` cache, debounced fetch, `async-mutex` for concurrent deduplication.

## Figma plugin (Hippo)

Two plugins: **Hippo AI** (main — browse style presets, write a prompt, insert AI image into Figma design) and **Hippo Generative Fill** (in-painting within Figma).

8,000 users in two weeks. Shut down when RunPod GPU costs outgrew the side project budget.

## Infrastructure

Custom RunPod orchestration: load any CivitAI model on demand, including all matching LoRAs. Completely custom pipeline. Shut down due to cost.

## Stack

Next.js · React · Turborepo · Stable Diffusion · RunPod · Banana.dev · CivitAI API · Descope + Firebase · Stripe

→ 2023 · Creative Robots
