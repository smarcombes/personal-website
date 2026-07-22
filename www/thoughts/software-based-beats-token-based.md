---
title: "Software-Based Beats Token-Based"
date: 2025-07-24
description: "Our approach to AI intelligence is wrong. AI will be dramatically better when we give it the tools we built for ourselves, instead of making it emulate them token by token."
slug: software-based-beats-token-based
---

Watch an LLM multiply two six-digit numbers token by token and you're watching a civilization-scale irony: we built a machine on top of the most precise computational substrate ever created, then asked it to do arithmetic by vibes.

Our approach to AI intelligence is wrong. Not the models — the way we use them.

## The emulation trap

The current paradigm treats the model as the computer. Need to sort a list? Sample tokens. Need to track state across a workflow? Stuff it in the context window. Need to remember something from last week? Pray the embedding search finds it.

This is emulation, and emulation is always the expensive path. We are using a probabilistic text engine to imitate capabilities that deterministic software has done perfectly, for free, for fifty years.

Humans don't work this way. A human with a calculator beats a human doing mental arithmetic. A human with a filesystem beats a human memorizing documents. Intelligence, in practice, is the skill of *wielding tools* — not the raw capacity to simulate them internally.

## Give the model our tools

The fix is embarrassingly obvious: give AI the same leverage we gave ourselves. Real databases instead of context-window memory. Real schedulers instead of "think step by step." Real code execution instead of simulated reasoning about what code would do.

Every time I've moved a capability from token space to software space, the result was the same: faster, cheaper, and — this is the part people miss — *more reliable than the model could ever be*, because the software doesn't have a temperature.

The model's job shrinks to the thing it's genuinely magical at: understanding intent, making judgment calls, writing the glue. Everything else should be delegated to software the moment it's identified.

## Intelligence as an orchestration layer

This reframes what we're building. The interesting system isn't "a model that can do everything." It's a thin layer of judgment sitting on top of a deep stack of deterministic capabilities — with the crucial property that the layer can *extend the stack itself*, writing new tools when it hits a gap.

That's what I keep converging on across my projects: the agent that writes a skill once and calls it forever beats the agent that re-reasons the task every single time. Token-based intelligence is a demo. Software-based intelligence is a product.

We spent seventy years building the best toolbox in history. The most valuable thing we can do with AI is hand it over.
