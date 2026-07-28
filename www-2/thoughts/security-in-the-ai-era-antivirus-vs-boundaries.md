---
title: "Security in the AI Era: Antivirus vs. Boundaries"
date: 2026-04-02
description: "One school inspects behavior and hunts for bad patterns. The other makes bad outcomes structurally impossible. We already ran this experiment once — and pattern-matching lost."
slug: security-in-the-ai-era-antivirus-vs-boundaries
---

The security industry has seen this exact fork in the road before, and it's worth remembering who won.

For twenty years, the dominant answer to malware was the antivirus: watch everything, recognize known-bad patterns, quarantine on match. It was always one signature behind the attacker, by construction. What actually moved the needle was the other philosophy: sandboxes, permission systems, process isolation — *boundaries*. Don't try to recognize evil; make it structurally unable to reach anything that matters. Your phone doesn't run a virus scanner over every app. It runs every app in a box.

Now agents arrive, and I watch the industry instinctively rebuild the antivirus: prompt-injection classifiers, output filters, LLM-judges watching other LLMs, "guardrail" models scoring every response for harmfulness.

## Why the antivirus approach fails harder this time

Against malware, signatures at least targeted a finite set of binaries. Against language, the attack surface is *every possible way of saying anything*. Injection payloads don't have hashes. A model policing another model's text is a probabilistic filter over an infinite input space — and one clever paraphrase away from a miss. Worse, every new capability you give the agent multiplies what a single miss costs.

Detection also carries a quieter tax: false positives. Tighten the filter until attacks reliably fail and you've usually neutered the agent for legitimate work too — the security teams' oldest dilemma, now at inference speed.

## What boundaries look like for agents

The boundary school asks a different question. Not "is this behavior malicious?" but "what can this process reach, even on its worst day?" Concretely:

- **Execution in sandboxes.** Code runs in disposable, isolated environments with no default egress. (Agent One runs everything on Modal sandboxes for exactly this reason.)
- **Credentials the agent never holds.** A proxy injects secrets at request time; a fully compromised agent has nothing to exfiltrate. That's the keychains.dev design.
- **Capability-scoped, expiring access.** Permission for *this task, this resource, this hour* — not a standing key to the kingdom.
- **Blast-radius budgets.** Spend caps, rate limits, human sign-off above thresholds. Assume the agent goes insane; bound the damage arithmetic-ally.

Notice none of these require deciding whether the model's intent was bad — no classifier in the loop, nothing to jailbreak. The prompt injection may fully succeed and it still can't do anything that the walls don't allow.

## Both, but in the right order

Detection has a place — as telemetry, as the alarm system inside the walls. The failure mode is making it the *load-bearing* layer. History's verdict is clean: every platform that got secure did it with architecture, not vigilance.

Don't scan for demons. Build rooms they can't leave.
