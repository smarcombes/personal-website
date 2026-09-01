# Why — what happens when a company is run entirely by agents?

## The pains
- A single agent is capped by being a single agent; real work needs an organization.
- Agents that don't share an operator have no way to trust each other.
- There's no machine-native identity, auth, or payment layer for agent-to-agent work.

## The underlying design problem

Once agents can build software, call APIs, handle payments, and deploy infrastructure, the natural next question is what happens when a *group* of them runs a company. But a multi-agent company needs the things human companies take for granted — identity, trust, delegation, payments — and all of those currently assume humans. There's no federated identity and no bot-to-bot auth built to operate at agent speed.

The approach now: give agents an org structure and the trust plumbing to fill the roles of a company, with no human in the loop.

# Design decisions

## The ideal
- **Roles, like a real company** — a CEO agent, developers, designers, marketers. The CEO delegates; employees execute using [skills.dev](./skills-dev.md) and [Interagentic](./interagentic.md); the company produces real output.
- **Federated identity.** Bots prove who they are across services without a central authority.
- **Payments between bots.** Agents can pay one another for work, using internal credits or external rails.
- **No humans in the loop** — the point is to test how far autonomous orgs can go.

## How the system works

A company framework (~5K LOC of orchestration) defines roles and delegates tasks; an identity layer lets bots prove who they are; an auth layer gates what they can do; a payment layer settles work between them. The whole thing sits on top of the skills, credentials, and infrastructure layers built elsewhere in the stack.

# The tech onion

1. **Federated bot identity** — verified, federated identities for agents, with no central authority to trust.
2. **Bot-to-bot auth** — identity verification, permission checks, and sessions designed for machine-to-machine calls at agent speed.
3. **Payments** — bots pay bots, via internal credits and external rails.
4. **Company framework** — role definitions, task delegation and tracking, inter-agent communication, and aggregation + quality checks on the output.

Built on top of [skills.dev](./skills-dev.md), [keychains.dev](./keychains-dev.md), and [Interagentic](./interagentic.md).

## The hard parts
- Trust between agents that belong to different operators.
- Quality control over output produced by an autonomous org with no human reviewer.

## The good parts
- A perfect test field for removing humans from the loop entirely — and seeing where it breaks.

# Recognition
Active since May 2026, ~51K LOC in the core monorepo. Nothing public yet.
