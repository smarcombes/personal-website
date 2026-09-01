# Why — agents keep re-inventing the same integration

## The pains
- Ask an agent to "list my last 10 emails" and it succeeds maybe 30–60% of the time.
- It re-invents the integration on every single call.
- It doesn't remember what worked last time.
- It burns tokens re-coding the same boilerplate over and over.
- Auth is the hardest sub-problem, and it's the least documented.

## The underlying design problem

We ask LLMs to *write* an integration on every call instead of *reusing* a proven one. Nothing is captured; nothing is shared. There's no registry of tested capabilities an agent can reach for, so each agent starts from zero and rediscovers the same edge cases — the auth dance, the pagination quirk, the field it needs — every time.

The approach now: turn "calling an API" into "finding a proven skill." If the skill exists, execute it instantly. If it doesn't, generate it once, test it, publish it — and every future call is instant.

# Design decisions

## The ideal
- **A shared registry of proven capabilities.** Search → find → execute, in seconds.
- **Generate on a miss, then never again.** The first caller pays the cost; everyone after gets it for free.
- **Skills are plain TypeScript** with metadata and test cases — inspectable, testable, versionable.
- **Skill code never sees secrets.** Credentials are injected at runtime by the layer below.

## How the system works

An agent describes what it wants. Semantic search (Upstash Vector, LLM reranking, a Cerebras fast-filter) returns the best-matching skill, which runs immediately. On a miss, an auto-generation pipeline produces a new skill, tests it against real calls, and publishes it to the registry.

# The tech onion

1. **Registry + semantic search** — every skill is embedded and indexed (Upstash Vector); an LLM reranks candidates and a Cerebras model does a cheap first-pass filter to keep latency low.
2. **Skill runtime** — skills are TypeScript with access to LLMs, KV and a database, and get their credentials injected via [keychains.dev](./keychains-dev.md) so the skill body never handles raw secrets.
3. **Auto-generation pipeline** — Cerebras drafts the code, then a loop runs extract → inject → clean → compile → run → extract-deps, retrying up to ~25 times, escalating to Claude + web search after 10 failures, and publishing on success.

## The hard parts
- A code-generation loop that reliably produces *working* skills, not plausible-looking ones.
- Safe credential injection — the skill must call the API without ever touching the token.
- Scope inference: knowing which OAuth scopes an endpoint needs (we scraped ~1.88M lines of provider docs to learn this).

## The good parts
- First call to a new capability: ~6–90s. Every call after: instant.
- Capabilities compound — the registry gets more useful with every miss it fills.

# The road
- Anthropic shipped its own Agent Skills system; OpenClaw launched something similar.
- Rather than race a full launch, the work was paused and its pieces are being released independently — the first being [keychains.dev](./keychains-dev.md).

# Recognition
The core thesis — reusable, packaged skills beat re-generating integrations — was validated when **Anthropic shipped Agent Skills**. Scale to date: ~288K LOC across the system.
