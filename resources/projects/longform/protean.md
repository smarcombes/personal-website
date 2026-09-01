# Why — agents hit a wall at the edge of the tools they were given

## The pains
- The moment an agent needs a capability it wasn't handed, it's stuck.
- It can't change its own behavior — the code that runs it is off-limits to it.
- It's tied to the one machine it was started on.

## The underlying design problem

Every agent ships with a fixed tool set and a fixed body of code, so the boundary of what it can do is drawn by whoever built it — not by the problem in front of it. Protean is the experiment that removes that wall entirely: what happens if an agent can write its own tools, edit its own source, and even move itself to another machine? The only real constraint left is token budget.

# Design decisions

## The ideal
- **Its working directory is its own source code.** It can `Write` / `Edit` / `Bash` on its repo, commit to a branch, run tests, merge, then restart into the new version.
- **New tools are just files.** Anything in `~/.protean/tools/<name>/` becomes an MCP server, available on the next turn — so "I don't have a camera" is solved by writing one.
- **It can migrate.** Tell it there's a Raspberry Pi on the network and it clones itself there and keeps running after you close the laptop.
- **It must not be able to brick itself** — hence a supervisor and a crash ladder that always has a way back.

## How the system works

```
bootstrap → supervisor → main runtime
                ↓
        crash ladder + git rollback
                ↓
        agent (Claude) + tool system
                ↓
    built-in MCPs + external tools (~/tools/)
```

The agent modifies itself and calls `restart_runtime`; the supervisor catches the exit, pulls, and relaunches. Distributed state (conversation history, task state, master assignment) rides on a Yjs CRDT over an Iroh P2P transport.

# The tech onion

1. **Supervisor + crash ladder** — the safety layer. On a crash it walks `main → safe-mode → git rollback HEAD~1 → HEAD~2 → …` until it boots. It has saved the agent from itself multiple times.
2. **Runtime + agent** — Claude plus the tool system that can read and rewrite the repo.
3. **Tool system** — built-in MCPs plus external tools discovered from `~/.protean/tools/`, so the agent extends itself by writing code.
4. **P2P layer** — Iroh transport between peers, Yjs CRDT for shared state, deterministic master election (lowest peer ID wins) — so transferring its "brain" is one tool call.

## The hard parts
- Preventing self-destruction while still granting full self-modification.
- Keeping distributed state consistent as the agent moves between machines.

## The good parts
- Genuinely open-ended: the agent's capabilities are bounded by budget, not by its author.

## Stack
Bun · TypeScript · Anthropic Claude SDK · Iroh (P2P) · Yjs (CRDT) · Ink (TUI) · MCP.

# Recognition
No formal recognition — an active, deliberately dangerous experiment. Dangerous but illuminating.
