---
title: "Building Software That Morphs Itself"
date: 2026-04-20
description: "Every user gets the same pixels because changing software used to require an engineer. It doesn't anymore. Notes from shipping UI that rewrites itself per user."
slug: building-software-that-morphs-itself
---

Here's an assumption so old it's invisible: software ships as one shape for everyone. The accountant with three monitors and the student on a phone get the same layout, same flows, same features — take it or leave it, or dig through a settings page that covers 4% of what you actually want changed.

The assumption existed for one reason: changing software required an engineer, and engineers don't scale to one-per-user. That reason just expired.

## What morphing means (and doesn't)

I built UXMorph to test the strongest version of this idea: an app whose UI rewrites itself per user. You chat with the app — "move the filters into a sidebar, I use them constantly" — an AI edits the actual component code, hot-swaps it live, and commits the change to *your personal branch* of the app.

That last detail is the load-bearing one. Morphing is not the same as generating UI on the fly, and the difference is everything:

- **Runtime generation** re-improvises the interface per session. Non-deterministic, unauditable, latency in the render path — and your muscle memory dies every morning.
- **Morphing** produces a real, persistent artifact. The change is a Git commit: reviewable, revertible, diffable against the upstream app. Your version is *stable* — it just happens to be yours.

Morphing is evolution with a fossil record. Generation is a hallucination with good intentions.

## The hard problems are old problems wearing new clothes

Shipping this taught me that the challenges aren't mysterious — they're classical software engineering, relocated:

- **Divergence is a merge problem.** Ten thousand users means ten thousand branches. When the upstream app updates, every personal branch needs to reconcile. Git semantics turn out to be exactly the right machinery — this problem is why UXMorph commits rather than patching in memory.
- **Safety is a test problem.** A morph that breaks checkout is worse than no morph. Every self-modification runs the app's test suite before it lands, like any other commit from any other contributor. The AI is just a contributor with a very fast keyboard.
- **Legibility is a review problem.** Changes must be inspectable after the fact — what changed, when, prompted by what. The commit log *is* the audit log.

## Settings pages were the apology

Every settings page is an admission: "we couldn't know what you needed, so here are forty toggles." Morphing replaces the apology with a conversation. The long tail of preferences that no product manager could ever prioritize — one user's wish, absurd to build for everyone — becomes servable, because no human has to build it.

Software used to be a sculpture: finished, signed, identical in every gallery. It's becoming a garden — same seeds, different shape in every yard, and something tends it while you sleep.
