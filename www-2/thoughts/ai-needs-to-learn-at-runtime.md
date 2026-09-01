---
title: "From Copying, to Reasoning, to Trying: AI Needs to Learn at Runtime"
date: 2025-08-21
description: "The third era of machine learning won't happen in a training run. And the surprising part: it doesn't need AI to work."
slug: ai-needs-to-learn-at-runtime
---

Machine intelligence has gone through two eras and is stalling at the gate of the third.

**Era one: learn by copying.** Pretraining. Show the model everything humanity has written and let it absorb the patterns. This gave us fluency and knowledge — a compressed civilization.

**Era two: learn by reasoning.** Chain-of-thought, test-time compute. Let the model think longer, explore branches, check itself. This gave us competence on problems no single web page answers.

Both eras share a ceiling: everything the system learns, it learns *before* it meets your problem. At deployment, the weights are frozen and every insight gained during work evaporates when the context window closes.

**Era three is learn by trying and iterating** — and it barely exists in products today.

## Your agent is Sisyphus

Watch an agent work for a week — I have, many times, across my own products. Monday it debugs its way to your API's auth quirks: twenty minutes, eventually solves it. Tuesday, same task, same twenty minutes, because Monday's discovery lived and died in a context window.

We've built workers with perfect anterograde amnesia and we keep compensating with a bigger hippocampus — longer contexts, cleverer RAG. But retrieving a transcript of last Monday is not the same as *having the skill*. Reading someone's debugging log isn't knowing how to debug.

## The unlock: learning doesn't need AI

Here's the part I find genuinely underappreciated: runtime learning doesn't require any new model capability. No fine-tuning, no gradient updates, no research breakthrough.

Because there's already a perfect medium for storing procedural knowledge: **software**.

When an agent solves a problem, the solution can be captured as code — tested against reality, saved, indexed, callable. The next encounter with the same problem isn't a re-derivation; it's a function call. Instant, deterministic, free. The trying-and-iterating loop happens in the world, and the *result* of the loop is an artifact, not a memory.

That's the whole thesis behind skills.dev: first execution takes six to ninety seconds while the skill gets written and verified; every execution after that is instant, for every agent, forever. The learning is real, it compounds, and not a single weight changed.

## The era-three stack

What it takes is unglamorous: a safe place to try things, a way to promote successes into permanent capabilities, a registry to share them, and a feedback signal on what works. Plumbing.

Pretraining taught AI what we know. Reasoning taught it to think. The systems that matter next will be the ones that come back tomorrow better than they were today — and they'll do it with software, not gradients.
