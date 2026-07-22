---
title: "A DSL for GenUI Is So Much Better Than Pure React"
date: 2025-04-14
description: "Letting a model emit raw React is handing a firehose to a calligrapher. Constrain the language and generation gets faster, safer, and dramatically more correct."
slug: a-dsl-for-genui-beats-pure-react
---

When you ask a model to generate UI, the default move is obvious: it knows React, React renders interfaces, so let it write React. I've now spent years on the other side of that decision — layouts.dev is built on a custom DSL, 543K lines of conviction — and I'll defend the unpopular position flatly: for generative UI, a purpose-built DSL beats raw React by an order of magnitude.

## The case against the firehose

React is a general-purpose programming surface. When a model emits it, the model can express *anything* — which sounds like power and behaves like variance:

- **The failure space is unbounded.** Arbitrary JS means hooks misused, effects looping, state mutated mid-render, imports hallucinated. Every generation is a small code review with a nonzero chance of a crash — and you can't statically guarantee much about it without solving the halting problem.
- **Tokens are spent on ceremony.** Imports, prop drilling, className soup, closing tags. A huge share of the output budget goes to syntax that carries no design intent — slower, costlier, and more surface for errors.
- **Iteration is regeneration.** "Make the sidebar wider" against freeform code means the model re-emits (and risks re-breaking) things that were fine. There's no stable structure to make a *surgical* edit against.

## What a DSL buys you

A DSL inverts every one of those properties, because it constrains expression to the domain:

- **Invalid states become unrepresentable.** The grammar simply has no way to write an infinite loop or a side effect. Validation is parsing, not linting — a malformed generation is rejected in microseconds, before anything renders.
- **Every token is signal.** The language encodes columns, cards, actions, bindings — design decisions and nothing else. Generations are shorter, cheaper, and land inside the distribution the model handles best: structured, repetitive, predictable.
- **Edits become diffs.** A stable tree with addressable nodes means "wider sidebar" is a one-node mutation. This is what makes conversational iteration feel instant instead of feeling like a re-roll.
- **Rendering stays yours.** The DSL compiles to whatever you want — layouts.dev targets web *and* React Native from the same source. The model describes intent; battle-tested code you wrote once decides how intent becomes pixels.

The pattern is ancient, of course: we don't generate Postgres internals, we generate SQL. Constrained languages are how you let an unreliable author drive a reliable machine.

## The objection that matters

"But a DSL can't express everything!" Correct — that's the feature. GenUI doesn't need everything; it needs the 95% of interfaces that are lists, forms, cards, and flows, delivered with near-zero failure rate. For the last 5%, add an escape hatch to custom components — authored by humans, *referenced* by the model.

Give the model a language where the only thing it can say is valid UI, and suddenly it speaks fluently. Vocabulary, it turns out, was never the problem. Grammar was.
