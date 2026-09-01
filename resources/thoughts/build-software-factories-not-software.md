---
title: "Don't Use AI to Build Software. Use It to Build Software Factories"
date: 2025-10-09
description: "AI at build time beats AI at run time. The most leveraged thing an LLM can produce isn't an app — it's the machine that produces apps."
slug: build-software-factories-not-software
---

There are two ways to use a model that can write code, and they lead to completely different companies.

The first: put the model in the request path. User asks, model thinks, tokens stream out. Every interaction costs inference, takes seconds, and carries a nonzero chance of nonsense. This is AI at **run time**.

The second: use the model to *produce an artifact* — code, a pipeline, a generator — and then serve the artifact. The model works once; the output runs forever, deterministic and effectively free. This is AI at **build time**.

Almost everyone defaults to the first because it demos well. Almost all the durable value is in the second.

## The factory argument

A factory beats artisanal production not because the factory is smarter than the artisan, but because the intelligence is *embedded in the machine* and then amortized over every unit produced.

LLMs can produce software — fine, everyone knows that now. The under-explored fact is that they're even better at producing software *factories*: code generators, schema-to-app pipelines, test harnesses, migration machines. Things with a crank. You pay the intelligence cost once, at design time, and the marginal unit costs nothing.

I learned this the hard way at Creative Robots. We built vibe-coding in early 2022 — before the term existed — and watched users churn. Generating an app from a prompt thrilled people for a day; then the app was 80% right and they had no way to close the last 20%, because the "factory" was a slot machine. So we pivoted to what we called rail-coding: constrain the generation, make the output inspectable and regenerable, put the intelligence into the rails rather than every pull of the lever.

## The compounding difference

Run-time AI has flat economics: the thousandth request costs what the first did, and fails in the same ways. Build-time AI compounds: every artifact the model produces becomes a permanent asset. Every skill written is a capability you never pay to re-derive.

That's the principle behind skills.dev: the first time an agent needs a capability, it takes six to ninety seconds to generate it. Every call after that is instant, because it's not AI anymore — it's software. The agent's job is to *extend the factory*, not to be the factory.

## Where the model belongs

Run-time inference is right where genuine novelty lives: understanding a user's intent, making a judgment call, handling the case no one anticipated. That's maybe 5% of a working system.

For the other 95%, ask the question that separates demos from companies: *am I using AI to do the work, or to build the thing that does the work?*

Build the factory.
