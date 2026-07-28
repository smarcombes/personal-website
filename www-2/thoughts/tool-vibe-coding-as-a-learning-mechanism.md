---
title: "Tool Vibe-Coding as a Learning Mechanism"
date: 2025-12-02
description: "Vibe-coding apps for humans churned. Vibe-coding tools for agents is a different animal entirely: the output has a spec, a test, and a user that never gets bored."
slug: tool-vibe-coding-as-a-learning-mechanism
---

I have an unusual relationship with vibe-coding: I built one of the first vibe-coding platforms in early 2022 at Creative Robots, watched it churn, and pivoted away from it. So when I say vibe-coding has found its killer application, I'm not late to the hype — I'm returning to the scene with notes.

The killer application isn't humans vibe-coding apps. It's **agents vibe-coding their own tools**.

## Why human vibe-coding churned

Our users loved the first five minutes: describe an app, watch it appear. Then reality: the app was 80% right, and the remaining 20% was a wall. They couldn't debug what they couldn't read. Regenerating rolled the dice on everything they liked. The medium gave them power without a feedback loop — thrilling, then frustrating, then gone.

The lesson wasn't "generation is bad." It was: *generation without a tight verification loop produces artifacts nobody can finish.*

## Why agent tool-generation is different

Now change both the producer and the consumer. An agent needs a capability — say, "convert this bank's CSV export into structured transactions." It writes a quick-and-dirty tool for itself. Consider what changed:

- **The spec is concrete.** Not "an app for my bakery, but make it pop" — a precise input, a precise output, defined by the task at hand.
- **Verification is immediate and objective.** Run the tool. Did the CSV parse? There's no taste involved; there's a test.
- **The 80% problem inverts.** A human abandons a mostly-working app. An agent iterates on a mostly-working tool until the test passes — it doesn't get frustrated, and each iteration takes seconds.
- **The artifact compounds.** A vibe-coded app was a dead end. A vibe-coded tool enters a registry and becomes infrastructure — for that agent and every other one.

Vibe-coding's weaknesses — looseness, disposability, trial-and-error — are *features* when the output is a small, testable function instead of a product.

## The learning loop, closed

Put it together and you get something that deserves to be called learning: encounter a novel task, improvise (slow, exploratory, token-hungry), crystallize the improvisation into a tool, verify it against reality, keep it. Next encounter: instant recall. That's the skills.dev loop — six to ninety seconds the first time, milliseconds forever after.

Every failed vibe-coded app taught me the same thing: generation needs a loop that closes. Agents close it. Humans vibe-coding apps was the rehearsal. Agents vibe-coding tools is the show.
