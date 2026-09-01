---
title: "The Tech Stack Is Too Complex for AI — Because It Was Already Too Complex for Us"
date: 2025-05-08
description: "AI didn't break software engineering. It exposed how broken it already was. Tech teams were inefficient long before the first token was sampled."
slug: the-tech-stack-is-too-complex-for-ai
---

Everyone is asking why AI agents struggle to ship production software. Wrong question. The right one: why does a team of ten senior engineers need six months to ship a CRUD app?

AI didn't break software engineering. It exposed it.

## We normalized the absurd

Look at what it takes to put a button on the internet in 2025: a package manager on top of a package manager, a bundler configured by a meta-framework, a CI pipeline that re-installs the world on every commit, three environments that never quite match, and a YAML file whose indentation can take down production.

None of this complexity comes from the problem being solved. It comes from decades of accretion — every layer patching the layer below instead of replacing it. Humans adapted to this the way you adapt to a chronic pain: we stopped noticing. We built entire careers around navigating the scar tissue.

Then we handed this stack to a language model and acted surprised when it got lost. Of course it got lost. *We* are lost. We just have meetings about it.

## Tech teams were the original inefficiency

I've built engineering teams since 2011 — hired from Oracle, Ubuntu, Dropbox. Great people. And still, at Lima, I watched brilliant engineers spend most of their week on things that produced zero user value: fighting builds, syncing environments, re-explaining context that lived in someone's head, coordinating who touches which file.

The dirty secret of our industry is that a "10x engineer" is mostly someone who has memorized more of the accidental complexity. That's not leverage. That's hostage negotiation with our own tooling.

## AI is the forcing function

Here's what makes this moment interesting: an LLM has no ego investment in the stack. It won't pretend the complexity is fine. When an agent fails to set up your dev environment, it's giving you a legibility score — and most codebases fail it.

So we have two options. Keep fine-tuning models to survive our mess — teach them Webpack the way we teach interns Webpack. Or take the hint and simplify the substrate itself: fewer layers, self-describing systems, environments that are constructed rather than configured.

I'm betting on the second. The winners of the AI era won't be the teams with the best agents on top of the old stack. They'll be the teams who rebuilt the stack so that *anyone* — human or model — can be productive in it in minutes.

The tech stack was never designed. It happened. Now we get to design it.
