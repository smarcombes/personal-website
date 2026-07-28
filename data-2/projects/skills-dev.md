# skills.dev

> An app store for agent capabilities. Agents search a registry of TypeScript skills, execute them, or auto-generate new ones on the fly.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-components%20releasing-blue?style=flat-square)](#)

The problem: agents have a 30–60% success rate on tasks like "list my emails" because they re-invent the integration from scratch every time. They don't remember what worked. They burn tokens re-coding the same boilerplate.

The fix: a shared registry of proven, tested capabilities. Search → find → execute. If it doesn't exist, generate it once, test it, publish it — and every future call is instant.

## How a skill looks

```typescript
export default async function run(inputParams) {
  const token = await getOAuthCredentials('slack');
  // full Node.js, any npm package
  return { success: true, result: { ... }, errors: [] };
}

export const metadata = {
  skillName: "Send Slack Message",
  slug: "send-slack-message",
  description: "...",
  inputParams: { /* JSON Schema */ },
  outputParams: { /* JSON Schema */ },
  testCases: [{ input: {...}, validateOutput: "..." }],
};
```

Skills have access to LLMs, key-value storage, databases, and a credential system ([keychains.dev](./keychains-dev.md)) that injects secrets at runtime without the skill code ever seeing them.

## The auto-generation loop

When no skill exists for a task:

1. **Generate** — Cerebras (`gpt-oss-120b`) writes the initial TypeScript (fast, cheap)
2. **Pipeline** — extract code → inject credentials → clean imports → compile → run → extract deps
3. **On failure** — error appended to context, retry (up to 25 iterations)
4. **Escalate** — after 10 fails, switch to Claude with web search for harder problems
5. **Publish** — working skill goes into the registry; next call is instant

First request: 6s (simple) to 90s (complex). Every subsequent call: instant.

## Search

Upstash Vector Search index. Semantic search with LLM reranking. Cerebras handles the filter step — fast enough that search feels synchronous.

## What happened

Claude published their own skills system. OpenClaw launched with a similar vision. We paused the full launch and started releasing components independently. First: [keychains.dev](./keychains-dev.md).

## Scale

288K LOC · 109K LOC pre-made skills library · 1.88M LOC provider documentation scraped for scope inference

## Status

Unreleased as a product. Components being open-sourced independently.
 