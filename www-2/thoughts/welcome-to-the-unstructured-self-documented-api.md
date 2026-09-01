---
title: "Welcome to the Unstructured, Self-Documented API"
date: 2026-07-02
description: "API contracts are rigid because the consumer used to be dumb. When the caller can read, negotiate, and adapt, the interface itself can finally loosen up."
slug: welcome-to-the-unstructured-self-documented-api
---

Every API you've ever integrated is built on one unstated assumption: **the consumer is an idiot.** Not the developer — the *client program*. It can't read prose, can't infer intent, can't handle a renamed field without crashing. So we built accordingly: rigid schemas, versioned endpoints, OpenAPI specs frozen like legal contracts, breaking-change ceremonies with migration guides and deprecation calendars.

All of that machinery exists to protect a consumer that cannot think. That consumer is retiring.

## The caller can read now

An agent consuming your API is a fundamentally different animal. It reads documentation — actual English. It can try a request, read the error, and adjust. A renamed field isn't an outage; it's a moment of mild confusion resolved in one retry. The defensive architecture of the REST era protects against a fragility that the new consumer simply doesn't have.

Which opens a door that's been welded shut for twenty years: the interface can loosen. Describe what you offer in prose and examples. Accept requests that express *intent* rather than conform to a schema. Return answers shaped for the question rather than a fixed resource envelope. When something's ambiguous, say so in the response and let the caller clarify — a *negotiation*, not a 400.

## Self-documented means self-describing, live

"Self-documented" here doesn't mean "we generated docs from annotations." It means the API describes itself *to the caller, at call time*: what it can do, what it needs, what changed since last week. Documentation stops being a website humans forget to update and becomes part of the protocol — always as current as the implementation because it *is* the implementation, explained.

I've built this pattern into everything recent. skills.dev endpoints are discovered and read by agents, never browsed by humans. Keychains.dev infers what an API needs — OAuth flows, scopes — rather than requiring hand-written integration for each of 6,000+ services. The design center in both cases: assume the consumer is intelligent, and the integration work approaches zero.

## The objections, honestly

Determinism still matters — payments and medical records shouldn't ride on vibes. The answer isn't to reject structure; it's to *scope* it. Keep hard contracts on the narrow paths where a mistake is catastrophic, and let the long tail of interactions — the 90% of endpoints that are "fetch, transform, report" — run soft. We already do this in human systems: contracts for the house purchase, conversation for everything else.

And yes, inference at the boundary costs more than parsing JSON. But compare it to the real baseline: the person-months of integration work per API, the versioning bureaucracy, the outages from breaking changes. The expensive part of APIs was never the compute.

For twenty years we wrote interfaces for the dumbest consumer imaginable, and the discipline was suffocating. The consumer just got smart. Time the interface did too.
