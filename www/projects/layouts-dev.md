# layouts.dev

> A visual coding tool for designers. Custom DSL, cross-platform web + React Native, AI backend.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![React Native](https://img.shields.io/badge/-React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![Year](https://img.shields.io/badge/2024–2025-lightgrey?style=flat-square)](#)

The problem: 80% of UI work is the same things (inputs, buttons, auth, payments) rebuilt from scratch every time. AI coding assistants had to re-invent a date picker on every request. And even a simple "Google login" takes weeks to get right because the edge cases eat the time.

The thesis: what if there was a headless, cross-platform component library with feature-level primitives — not just components, but features — combined with a DSL that was 10x more concise than React, readable by designers who can't code?

## The language

```
/hstack gap-4 p-8
    /avatar
        @src=https://example.com/photo.jpg
    /vstack
        Hello World
        /button
            @variant=outline
            Click me
```

Same parse tree compiles to React Web, Next.js, or React Native. Line-by-line, regex-driven parser. Tailwind tokens on the component line. Tab indentation for nesting.

The language was genuinely good for designers. Alex (the designer on the team, couldn't code) could prototype in about an hour using just keywords for functionality and style.

## The editor

Monaco with a custom `layouts` language definition, AI copilot, live preview in an iframe, bidirectional hover linking (hover over a preview element → editor highlights the source line), and Liveblocks + Yjs multiplayer.

## What we learned

**1. Component creation is a titanesque bottleneck.** Every component needed to work on React Web and React Native, be headless, composable, Tailwind-styled. Open-source components aren't homogeneous. We recoded each one. 40+ repos, 543K LOC.

**2. Models got too good at standard React.** Our DSL had lower error rates than React early on. As models improved, they got very good at standard React — and hadn't been trained on our syntax. The advantage eroded.

**3. Lovable launched one week after us.** The market shifted to "generate everything from a prompt." Our tool asked users to think about structure.

**4. Designers loved it.** The signal was there — we didn't have runway to pursue it.

## Scale

40+ repos · 543K LOC core product · 2 cross-platform component registries · Figma integration · multiplayer editing · AI backend · subscriptions · federated auth · backoffice

## Stack

Next.js · React Native / Expo · Monaco · Liveblocks + Yjs · Clerk · Firebase · Stripe · Tailwind

→ [layouts.dev](https://layouts.dev) · 2024–2025
 