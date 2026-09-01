# Why — SaaS is one-size-fits-all, and you're stuck with it

## The pains
- Most SaaS products ship one interface for everyone.
- If the UI is wrong for how *you* work, there's nothing you can do about it.
- Requesting a change means filing feedback and waiting quarters — if it happens at all.

## The underlying design problem

Interfaces are authored once, by the vendor, for an imaginary average user. The person actually using the product every day — who knows exactly what's in their way — has no lever to change it. UXMorph is the experiment that flips this: what if every user could reshape the interface to their own needs, permanently, just by asking in chat?

Tap the floating bubble, say "make the todo list look like a kanban board," and a few seconds later your UI *is* a kanban board — on every reload, just for you. Every change is a real Git commit, scrollable like undo/redo.

# Design decisions

## The ideal
- **Per-user Git branches.** Every user gets a `user/<uid>` branch forked from `main`; all AI edits commit there. Version history *is* Git history — free undo, forking, and audit log.
- **No page reload when the UI changes.** Switching versions should feel like morphing, not rebuilding.
- **The agent ships full-stack**, not just cosmetics — a co-located backend so features are real.
- **Self-healing UI** — if user code removes the customizer, it must remount itself.

## How the system works

The shell page dynamically `import()`s a content-hashed bundle URL at runtime instead of serving a static build, so switching versions is `import(newUrl) + root.render(<NewApp />)` — no reload, React never unmounts, the customizer keeps running. A Modal sandbox runs Claude with a tool surface that covers the whole loop: commit → build → switch → observe → fix.

# The tech onion

1. **Per-user versioning** — Git branches per user; the commit graph is the version timeline.
2. **Runtime ESM hot-swap** — dynamic import of a hashed bundle, swapped in without a reload.
3. **The agent loop** — a Modal sandbox with tools: `commit_changes`, `trigger_build` (esbuild → `dist/app.js`), `switch_commit` (SSE → `window.__switchVersion`), `get_console_logs`, `get_dom_snapshot`. The agent ships, observes the live tab, and fixes in one loop.
4. **Co-located backend** — drop `services/<name>/index.ts` and it becomes an authenticated per-user REST endpoint, so a feature ships full-stack in a single commit.
5. **Customizer drawer** — zero-dependency vanilla-JS ESM that self-heals via `MutationObserver`.

## The hard parts
- Hot-swapping bundles at runtime while keeping React state and the customizer alive.
- Giving the agent enough observability (logs, DOM snapshots) to fix what it just shipped.

## The good parts
- The interesting UX isn't "coding" — it's *morphing*: describe the change, watch it happen, keep or roll back.

## Stack
Next.js · Firebase Auth (anon) + RTDB · Upstash Redis · Modal · Anthropic Claude · esbuild (runtime ESM).

# Recognition
Research preview. No formal recognition — the payoff is the demonstration that per-user, chat-driven UI morphing actually works.
