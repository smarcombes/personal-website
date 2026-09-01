---
title: "Permissions Are the Main Brake on Useful AI. Treat Them as a Live System"
date: 2026-02-10
description: "The capability ceiling of today's agents isn't intelligence — it's authorization. Static grants can't govern dynamic workers."
slug: permissions-as-a-live-system
---

Ask anyone running agents in production what actually limits them. It's not reasoning. It's not context length. It's the moment the agent needs to touch something real — an inbox, a repo, a payment — and the whole system slams into a wall of *no*.

Permissions are the main brake on a more useful AI. And we're trying to solve them with machinery designed for a world that no longer exists.

## Static grants, dynamic workers

Every permission model we have assumes the actor is predictable. A human employee gets a role; the role rarely changes; an admin reviews it quarterly. OAuth scopes, IAM policies, API keys — all snapshots taken once, then trusted for months.

Agents break every assumption in that sentence. An agent's task list changes by the minute. The scope it needs at 9:00 (read one calendar event) has nothing in common with 9:05 (draft an email to your lawyer). Confronted with this, we pick one of two bad options: grant everything up front — the classic paste-your-API-key-into-the-prompt move, a standing violation of least privilege — or gate every action on human approval, at which point the agent is a very expensive confirmation dialog.

Notice what both options share: they treat permission as a *document*. Written once, enforced dumbly.

## Permission as a process

The fix, I think, is a reframe: authorization shouldn't be a snapshot, it should be a **live system** — something with state, feedback, and a lifecycle, running alongside the agent for as long as it works:

- **Scopes that follow the task.** Authorization derived from what the agent is doing right now, expiring the moment the task completes. Not "access to Gmail" — "send this one email, in the next ten minutes."
- **Trust that accretes.** A hundred clean runs of the same workflow should mechanically widen autonomy for *that* workflow; an anomaly should shrink it. Like a credit score, not a badge.
- **Escalation as a first-class primitive.** "I need something unusual, here's why" should be a structured, auditable request a human resolves in one tap — not a crash, not a workaround.
- **Custody as architecture.** The agent should never hold the credential at all. This is the principle behind keychains.dev: a proxy holds the secrets across 6,000+ APIs, injects them at request time, and the agent only ever sees the door open — never the key.

## The lock and the corridor

A door that's locked for everyone is safe and useless; a door that's open for everyone is useful and dangerous. Every real building solves this with something dynamic — badges, escorts, hours, revocation. Live authorization *is* the third option, and buildings figured it out a century before we did.

Whoever builds this layer well doesn't just make agents safer. They make them *allowed* — and allowed is the feature every enterprise is actually waiting for.
