---
title: "We're Missing a Feedback Loop Platform for Normal Users"
date: 2026-06-25
description: "AI researchers get RLHF pipelines and eval suites. The people who actually use AI all day get a thumbs-up icon. This asymmetry is a product gap, not a technical one."
slug: we-are-missing-a-feedback-platform-for-normal-users
---

Inside AI labs, feedback is treated as the most precious substance in the world. Armies of annotators rank completions. Eval suites run on every checkpoint. RLHF pipelines turn human judgment into gradient updates. Entire careers exist to close the loop between "the model did something" and "the model does better next time."

Outside the labs, here's the feedback interface we gave everyone else: 👍 👎

That's it. That's the pipeline. The accountant who spends four hours a day with an assistant, the support team living inside a copilot, the founder whose agents run half the back office — their accumulated knowledge of exactly *where* the system fails and *what* it should have done goes into a thumbs-down icon that, as far as they can tell, falls into the void.

## The people with the best data have no instrument

This is backwards in a specific way: the most valuable feedback signal doesn't come from researchers or annotators. It comes from domain experts using AI on their real work, every day. They know things no eval suite knows — that the model's tone is wrong for French business email, that it always mangles this vendor's invoice format, that step three of the workflow needs a confirmation.

But that knowledge has no home. It can't be expressed (one bit of sentiment can't carry "wrong format, right idea"), it doesn't accumulate (each thumbs-down is an isolated event, not a growing case file), and it never comes back (the user can't see that their correction changed anything — so they rationally stop giving it).

A feedback loop with no visible return leg isn't a loop. It's a suggestion box nailed shut.

## What the missing platform looks like

Concretely, a feedback platform for non-researchers needs four properties:

- **Rich capture at the point of failure.** Not sentiment — corrections. "Here's what it produced, here's what it should have been," attached to full context, in one gesture.
- **Accumulation into assets.** Corrections should compile into something durable — a preference profile, a test case, a skill, a rule — owned by the user or team, not vaporized into a training queue they'll never hear from.
- **Immediate local effect.** The system should behave differently *for that user, that day*. Runtime learning — memory, skills, morphing behavior — makes this possible without touching a single weight. The loop can close in minutes, locally, even if the model never retrains.
- **A visible ledger.** Show people what their feedback changed. The return leg is what keeps humans participating; it's also what makes them *better* at giving feedback over time.

## Why I keep circling this

Almost everything I build turns out to be a piece of this: runtime skill creation is feedback becoming capability; morphing UI is feedback becoming interface; context loops are feedback becoming memory. The pattern underneath is always the same — **normal users are the largest untapped training signal on earth**, and they're being interviewed through a two-button survey.

The lab loop made models smart. The user loop will make them *right* — right for this team, this workflow, this Tuesday. It doesn't exist yet. It's overdue.
