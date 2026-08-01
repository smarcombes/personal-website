# Why — your models are scattered across your machines

## The pains
- You have a MacBook, a desktop, maybe a home server — all running Ollama, all with different models loaded.
- To use a model you first have to remember which machine has it, then hit the right IP.
- Each machine is its own island; nothing pools their capacity or their model libraries.

## The underlying design problem

Local inference is per-machine by default: each box runs its own Ollama with its own models on its own address. There's no unified endpoint, so the human has to hold the topology in their head. Ollama Pool turns all of those machines into a single OpenAI-compatible endpoint that routes to whichever machine can serve the request.

# Design decisions

## The ideal
- **One endpoint, any model, all your hardware.** The caller shouldn't know or care which machine runs the model.
- **Drop-in OpenAI compatibility.** Point any existing client at it — no bespoke client.
- **A bridge instead of open ports.** Machines shouldn't need inbound connectivity; coordinate through a shared database.
- **Ephemeral by default** — job data is deleted after completion.

## How the system works

```
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌────────┐
│   CLI   │────▶│  Server  │────▶│  Firebase DB  │◀────│Desktop │──▶ Ollama
│ or app  │◀────│ (Next.js)│◀────│   (bridge)    │────▶│  App   │
└─────────┘ SSE └──────────┘     └───────────────┘ SSE └────────┘
```

You ask via CLI, `curl`, or any OpenAI client → the server creates a job in Firebase and picks the best available machine → that machine's desktop app runs Ollama → tokens stream back Ollama → Desktop → Firebase → Server → you. Streams use OpenAI `ChatCompletionChunk` format, including thinking traces and tool calls.

# The tech onion

1. **Server** — Next.js 15 API + dashboard; speaks OpenAI format and coordinates jobs.
2. **Bridge** — Firebase Realtime Database carries jobs and SSE both directions, so no machine needs an open inbound port.
3. **Desktop app** — an Electron tray app on each machine that picks up jobs, runs Ollama, and streams tokens back.
4. **CLI** — an interactive terminal client for chatting through the pool.

Identity and JWT are handled via [BotParty](./botparty.md).

## The hard parts
- Streaming tokens reliably across a DB-as-bridge without direct connections.
- Picking the right machine when models and capacity differ across the fleet.

## The good parts
- Any OpenAI-compatible tool instantly sees every model on every machine you own, behind one URL.

## Stack
Next.js 15 · Electron + Vite + React · Firebase Realtime Database · Turborepo · BotParty · Ollama.

# Recognition
An open-source utility; no formal recognition.
