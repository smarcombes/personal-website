---
title: "Building Context as a Background Live Loop"
date: 2026-03-05
description: "Agents assemble their understanding of you from scratch, per request, under time pressure. Real assistants never work this way — context should be built continuously, in the background."
slug: building-context-as-a-background-live-loop
---

Every agent request today begins with a frantic scavenger hunt. Search the vector store, skim recent messages, guess which facts matter, cram whatever fits into the window — all in the seconds before answering, all discarded the moment the answer ships.

We've accepted this as normal. It's deeply weird. Imagine a chief of staff who, every time you asked a question, sprinted to the archives, speed-read your files, answered, and then *forgot everything*. You wouldn't call that person well-informed. You'd call them permanently unprepared.

## Retrieval at request time is too late

The flaw isn't retrieval itself — it's *when* the understanding gets built. Request time is the worst possible moment: latency budget of seconds, attention consumed by the actual task, and no chance to notice anything that wasn't explicitly searched for.

Human context doesn't work this way. Your colleague understands your project because they've been *absorbing* it for months — in meetings, in passing remarks, in noticing what you complained about last week. The understanding was built continuously, in the background, when nobody needed it yet. By the time you ask a question, the context already exists.

## The background loop

So flip the architecture: context construction becomes a **live background process**, decoupled from requests entirely.

While the agent is idle, the loop runs: ingest new signals (emails, commits, documents, decisions), *distill* them — not into raw embeddings but into structured understanding: entities, relationships, open threads, preferences — reconcile contradictions with what's already known, decay what's stale, and pre-shape the digest the agent will need for its likely next tasks.

I built a version of this into Samantha, my multi-device assistant: it turns your email into a knowledge graph of the people in your life, in the background, and injects entity context on every turn of conversation. The difference is not subtle. Ask about "the Lyon situation" and there's no search — the assistant already knows, because knowing was its idle job. Request-time work drops to a lookup.

## Cost, and what it buys

Yes, a background loop burns tokens while nobody's watching, and naive versions are wasteful. But the economics run in its favor: idle-time compute is schedulable on cheap models and off-peak capacity, while request-time compute is the most expensive kind — a user is waiting. Trading the former for the latter is buying latency, quality, and even *proactivity*: a loop that continuously reconciles understanding is also the thing that can notice "these two commitments conflict" before you ask.

Memory isn't a database you query at the last second. It's a process that never stops running. Build the loop.
