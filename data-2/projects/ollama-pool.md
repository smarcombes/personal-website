# ollama-pool

> Distribute LLM inference across your machines. One OpenAI-compatible endpoint, any model, all your hardware.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Electron](https://img.shields.io/badge/-Electron-47848F?style=flat-square&logo=electron&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=next.js&logoColor=white)](#)

You have a MacBook, a desktop, maybe a home server — all running Ollama, all with different models loaded. Normally you'd have to know which machine has which model and hit the right IP. Ollama Pool turns all of them into one endpoint.

```
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌────────┐
│   CLI   │────▶│  Server  │────▶│  Firebase DB  │◀────│Desktop │──▶ Ollama
│ or app  │◀────│ (Next.js)│◀────│   (bridge)    │────▶│  App   │
└─────────┘ SSE └──────────┘     └───────────────┘ SSE └────────┘
```

## How it works

1. **You ask** via CLI, `curl`, or any OpenAI-compatible client
2. **Server** creates a job in Firebase, picks the best available machine
3. **Desktop app** on that machine picks up the job, runs Ollama inference
4. **Tokens stream back** — Ollama → Desktop → Firebase → Server → You (SSE)
5. **Cleanup** — job data deleted from Firebase after completion

Streams are stored in OpenAI `ChatCompletionChunk` format with support for content, thinking/reasoning traces, and tool calls.

## API

Drop-in OpenAI replacement. Point any compatible client at the server:

```bash
# Chat
curl http://localhost:3000/api/v1/chat/completions \
  -H "Authorization: Bearer any-key" \
  -d '{"model":"llama3.2","messages":[{"role":"user","content":"Hi"}],"stream":true}'

# List all models across all machines
curl http://localhost:3000/api/v1/models -H "Authorization: Bearer any-key"
```

## Components

**Server** — Next.js 15 API + dashboard. Speaks OpenAI format, coordinates jobs via Firebase.

**Desktop app** — Electron tray app. Runs on each machine with Ollama, picks up jobs, streams tokens back.

**CLI** — Interactive terminal client for chatting through the pool.

## Stack

Next.js 15 · Electron + Vite + React · Firebase Realtime Database (job bridge + SSE) · Turborepo · BotParty (identity + JWT) · Ollama

→ [github.com/smarcombes/ollama-pool](https://github.com/smarcombes/ollama-pool)
 