---
title: "Bye, User Signup. Hello Self-Registration"
date: 2026-06-08
description: "The signup form assumes your user has an email inbox, a phone, and fingers. Your next million users will have none of these."
slug: bye-user-signup-hello-self-registration
---

The signup flow is one of the most polished artifacts in all of software. Twenty years of A/B tests went into that email field, that OAuth button, that verification loop. And all of it rests on assumptions nobody ever wrote down: the thing signing up has an inbox, a phone number, a browser, and fingers.

A growing share of your future users has none of these. They have a runtime, a key pair, and a budget.

## The robot in the lobby

Today, when an agent needs your service, one of two things happens. Either a human pre-registers on its behalf — hand-carrying the API key like a parent enrolling a child in school — or the agent tries the front door and meets a CAPTCHA, which is a machine politely being asked to prove it isn't one.

Both paths share the same flaw: a human in the loop of an interaction that has no other humans in it. That's tolerable for one agent. It's absurd for a fleet of ten thousand, spun up this morning, gone by Friday.

## Identity without an inbox

The email-verification loop was never really about email — it was a cheap proof of a stable, reachable identity. Agents can offer a *stronger* proof directly: a cryptographic key pair. Sign a challenge, own the identity. No inbox, no SMS, no "click the link."

What does the service actually need to know about a new account? That requests come from the same actor over time (a signature does this better than a password), that there's someone accountable behind it (a delegation chain to a human or an organization — verifiable, unlike a burner Gmail), and that it can pay (a funded wallet or payment mandate settles this more honestly than a free-tier email ever did).

Every one of these is *more* verifiable for an agent than for a human. The signup form isn't just unusable for machines — it's beneath what machines can prove.

## Self-registration as an architecture

So the flow inverts. Nobody fills a form; the actor *declares itself*: here is my public key, my delegation chain, my payment mandate, the scopes I request. The service evaluates the claims — programmatically, in milliseconds — and issues a scoped tenancy. Trust starts narrow and widens with track record, the way it should have worked all along.

I've built both halves of this. In BotParty, agents carry federated identities and authenticate to each other — bot-to-bot auth and payments with no human ceremony anywhere. In Interagentic, self-registration is the front door: an agent establishes identity and gets infrastructure in the same breath.

Onboarding funnels were how we welcomed the last billion users. The next billion won't fill out the form — they'll introduce themselves.
