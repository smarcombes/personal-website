---
title: "MCPs Are Dog Shit. We Need a Better Way to Teach AI How to Do Things"
date: 2025-11-05
description: "The Model Context Protocol standardized the wrong thing. Tool lists are not knowledge, and context-window stuffing is not teaching."
slug: mcps-are-dog-shit
---

Strong words, deliberately chosen, from someone who has implemented OAuth 2.1 for MCP and shipped agents that depend on it daily. I'm not dunking from the sidelines; I'm reporting from inside the building.

MCP solved a real problem — everyone was writing bespoke tool integrations, and a common wire format was overdue. Credit where due. But we've mistaken a plumbing standard for an answer to the actual question: **how does an AI learn to do things?**

## What's actually wrong

**It burns context on inventory.** Connect a few MCP servers and you've spent thousands of tokens on tool descriptions before the user says a word. The agent reads the entire toolbox catalog on every single task. No human works this way; we look tools up when we need them.

**Descriptions are not competence.** A tool's docstring tells the model what the tool *is*, not when to reach for it, how to sequence it with others, what its failure modes are, or what "good output" looks like. That knowledge — the actual skill — has nowhere to live in the protocol. So it gets re-improvised, stochastically, on every run.

**Nothing accumulates.** An agent uses a tool successfully today and retains *nothing*. Tomorrow it re-reasons the same workflow from the same descriptions, with a fresh chance of failing differently. A junior employee who worked like this would be let go.

**Composition is manual.** Real tasks are pipelines — fetch, transform, cross-reference, publish. MCP gives you isolated tool calls with the model as the only integrator, gluing JSON blobs together in its head, at inference prices.

## Teaching, not listing

The unit of AI capability shouldn't be a tool description. It should be a **skill**: executable code that encodes a working solution, discoverable on demand, improvable over time.

The flow I keep converging on across skills.dev and Agent One: the agent hits a novel task, *searches* for a skill instead of scanning a preloaded catalog. If one exists, it executes — deterministic, instant, no reasoning tax. If none exists, the agent writes one, tests it against reality, and publishes it. The intelligence cost is paid once; every subsequent call — by that agent or any other — is just software.

That's the difference between teaching and listing. Teaching produces an asset. Listing produces a vocabulary quiz before every task.

## Where this goes

MCP will keep its place as a transport, the way HTTP kept its place under the web. But humanity is about to spend decades transferring procedural knowledge into machines, and the interface for that transfer cannot be a JSON list of function signatures re-read on every request.

We need libraries, not inventories. Skills, not descriptions. Learning, not lookup.
