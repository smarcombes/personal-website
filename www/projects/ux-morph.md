# ux-morph

> Apps whose UI rewrites itself per-user. Chat → AI edits → hot-swap → permanent.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://github.com/smarcombes/ux-morph)
[![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=next.js&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-research%20preview-blue?style=flat-square)](#)

Most SaaS products are one-size-fits-all. If the UI is wrong for you, you're stuck. UXMorph is an experiment: what if every user could reshape the interface to their needs, permanently, through chat?

A user taps the floating chat bubble, asks for "make the todo list look like a kanban board." A few seconds later, their UI is a kanban board. On every reload. Just for them. Every change is a real Git commit — scrollable like undo/redo.

## How It Works

### Per-user Git branches

Every user gets a `user/<uid>` branch forked from `main`. All AI edits commit there. Version history *is* Git history — free undo, free forking, free audit log.

### Runtime ESM hot-swap

The shell page doesn't serve a static bundle. It dynamically `import()`s a content-hashed bundle URL at runtime. Switching versions is:

```js
import(newUrl) + root.render(<NewApp />)
```

No page reload. React doesn't unmount. The customizer keeps running.

### The agent loop

`/api/chat/start` spawns a Modal sandbox with Claude and a tool surface that covers the full loop:

| Tool | What it does |
|------|-------------|
| `commit_changes` | `git add -A && git commit && git push` |
| `trigger_build` | esbuild in a Modal sandbox, uploads `dist/app.js` |
| `switch_commit` | SSE event → client-side `window.__switchVersion(hash)` |
| `get_console_logs` | Sentry-style grouped logs from the live tab |
| `get_dom_snapshot` | Asks the live tab to serialize its DOM |

The agent ships, observes, and fixes in one loop.

### Co-located backend

Drop a file at `services/<name>/index.ts` in the frontend repo — it becomes an authenticated REST endpoint scoped to the calling user. The agent ships full-stack features in a single commit.

### Customizer drawer

Zero-deps vanilla-JS ESM. Floating chat button, slide-out drawer, version timeline with `< prev / next >` arrows. Self-heals via `MutationObserver` — if user code removes the drawer, it remounts.

## Stack

Next.js · Firebase Auth (anon) + RTDB · Upstash Redis · Modal · Anthropic Claude · esbuild (runtime ESM)

## Status

Research preview. The idea works — the UX of *morphing* rather than coding is the interesting thing.

→ [github.com/smarcombes/ux-morph](https://github.com/smarcombes/ux-morph)
