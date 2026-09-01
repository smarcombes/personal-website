# protean

> A self-evolving AI agent with no artificial limits except budget.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://github.com/smarcombes/protean)
[![Bun](https://img.shields.io/badge/-Bun-000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh)
[![Status](https://img.shields.io/badge/status-active%20experiment-orange?style=flat-square)](#)

Most AI agents hit a wall when they need a capability they weren't given. Protean asks what happens if you remove that wall entirely.

The agent can:
- **Write new tools for itself** — asks for a camera, doesn't have one, writes the tool from scratch, restarts, now has one
- **Modify its own source code** — branches, tests, merges, restarts via a crash-safe supervisor
- **Migrate to another machine** — tell it you have a Raspberry Pi on the network; it clones itself there and keeps running after you close the laptop

The only real constraint is token budget.

## How It Works

```
bootstrap → supervisor → main runtime
                ↓
        crash ladder + git rollback
                ↓
        agent (Claude) + tool system
                ↓
    built-in MCPs + external tools (~/tools/)
```

**Self-modification**: the agent's working directory is its own source code. It can `Write` / `Edit` / `Bash` on its repo, commit to a branch, run tests, merge, then call `restart_runtime`. The supervisor catches the exit code and pulls + relaunches.

**P2P migration**: Iroh transport between peers. Distributed state via Yjs CRDT — conversation history, task state, master assignment. Master election is deterministic (lowest peer ID wins). Transferring your "brain" to another machine is one tool call.

**External tools**: anything in `~/.protean/tools/<name>/` becomes an MCP server. The agent creates new tools by writing code into that directory — they're available on the next turn.

## The crash ladder

The supervisor won't let it brick itself:

```
crash → main → safe-mode → git rollback HEAD~1 → HEAD~2 → ...
```

Has saved it from itself multiple times.

## Stack

Bun · TypeScript · Anthropic Claude SDK · Iroh (P2P) · Yjs (CRDT) · Ink (TUI) · MCP

## Status

Active experiment. Dangerous but illuminating.

→ [github.com/smarcombes/protean](https://github.com/smarcombes/protean)
