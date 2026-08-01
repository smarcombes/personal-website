# Why — we build UIs at the wrong level of abstraction

## The pains
- Roughly 80% of UI work is the same primitives rebuilt from scratch, project after project.
- AI assistants re-invent the same components — a date picker, a modal — on every request.
- Even a "simple" Google login takes weeks once you account for all the edge cases.
- Designers can't code, and React is far too verbose for them to touch.

## The underlying design problem

We build interfaces at the level of *components* when we should be building at the level of *features*, and we do it in a language — React/JSX — that is too verbose for designers and too unconstrained for a model to generate reliably. So everyone, human and AI alike, keeps rebuilding the same 80% and burning their attention on boilerplate instead of the actual product.

The approach now: a headless, cross-platform component library exposed through a DSL that's an order of magnitude more concise than React — concise enough for a designer to read and constrained enough for an AI to get right.

# Design decisions

## The ideal
- **Feature-level primitives**, not just components — the library should hand you the whole feature, not the Lego brick.
- **A DSL ~10× more concise than React**, readable by designers who don't code.
- **One source, many targets.** The same parse tree compiles to React Web, Next.js, and React Native.
- **"Rail-coding," not vibe-coding.** Constrained enough to be reliable for AI *and* intuitive for designers — the reliability that pure prompt-to-code lacks.

## How the system works

You write layouts in a terse, indentation-based DSL:

```
/hstack gap-4 p-6
  /avatar src="..."
  /vstack
    /text weight-bold "Séverin"
    /text muted "Building things"
```

A regex-driven, line-by-line parser (Tailwind tokens, tab-nesting) turns that into a parse tree that compiles to Web, Next.js, or React Native. It lives in a Monaco editor with a custom language mode, an AI copilot, a live iframe preview with bidirectional hover-linking between code and render, and Liveblocks + Yjs multiplayer.

# The tech onion

1. **The DSL + parser** — regex-driven, line-by-line, Tailwind-token-based, tab-nested; compiles the same tree to React Web / Next.js / React Native.
2. **Component registries** — two cross-platform, headless, composable, Tailwind-styled libraries (40+ repos, ~543K LOC) that the DSL renders.
3. **The editor** — Monaco with a custom language, AI copilot, live preview, code↔render hover linking, and real-time multiplayer.
4. **The backend** — AI, subscriptions, federated auth, a backoffice, and a Figma integration.

## The hard parts
- Component creation was a titanic bottleneck — each primitive had to work on Web *and* React Native, stay headless, and remain composable.
- Models kept getting better at plain React, steadily eroding the DSL's advantage.

## The good parts
- Designers genuinely loved it — a non-coding designer prototyped a real screen in about an hour.
- Early on, error rates were meaningfully lower than hand-written React.

# The road
- Lovable launched about a week after we did.
- The market swung hard toward "generate the whole app from a prompt," away from a structured designer-facing tool.
- There wasn't enough runway to chase the strong designer signal, so the effort wound down.

# Recognition
No formal awards — but the clearest signal was designers reaching for it and being fast and happy in it, which is the audience it was built for.
