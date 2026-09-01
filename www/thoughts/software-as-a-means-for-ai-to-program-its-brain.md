---
title: "Software as a Means for AI to Program Its Own Brain"
date: 2025-09-11
description: "Weights are read-only at runtime. Code isn't. The most practical form of self-improvement is an agent writing the software it will think with tomorrow."
slug: software-as-a-means-for-ai-to-program-its-brain
---

When people hear "self-improving AI" they picture something exotic and slightly menacing: models rewriting their own weights, recursive fine-tuning, intelligence explosions.

There's a much more boring and much more available version, and it's been sitting in front of us the whole time: **an agent that writes software for itself is programming its own brain.**

## The brain isn't just the weights

We talk as if an agent's capability lives entirely in the model. But sit down and trace where a working agent's competence actually comes from: the model provides judgment and language; everything else — what it can touch, what it remembers, what it can do reliably — comes from the software scaffold around it. Tools, memory stores, retrieval pipelines, validation loops.

The scaffold *is* cognition, externalized. And unlike the weights, the scaffold is writable at runtime.

That asymmetry is the whole opportunity. The model can't retrain itself mid-task. But it can absolutely write a parser, save it, and be a system that now parses. It can write a retry wrapper around a flaky API and be a system that now handles that flakiness forever. Each artifact is a permanent cognitive upgrade, achieved with zero gradient updates.

## I watched this work

My most extreme experiment with this idea is Protean: a self-evolving agent with no artificial constraints except a budget. It writes new tools for itself, modifies its own source, and migrates across machines over P2P. The unnerving thing isn't any single capability — it's the trajectory. Version N writes the code that defines what version N+1 *is*.

The same principle, domesticated, powers my commercial work: agents that generate a missing skill on first use (skills.dev), software whose UI rewrites itself per user (UXMorph). The pattern is identical everywhere — the model's flashes of intelligence get crystallized into code, and the code becomes the system's new baseline.

## Why code is the right substrate

Three properties make software the ideal medium for machine self-modification, better than anything neural:

1. **It's inspectable.** You can read what your agent taught itself. Try auditing a weight delta.
2. **It's testable.** New capabilities can be verified against reality before adoption — a safety property, not just an engineering nicety.
3. **It's transferable.** One agent's self-improvement is every agent's improvement, instantly, via a registry. Brains that can copy their upgrades to each other.

Self-improving AI doesn't arrive with a research paper and a scary press release. It arrives as a commit log — an agent's brain, growing one reviewed pull request at a time. It's already happening; we should build the rails for it deliberately.
