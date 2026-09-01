# Why — agents can reason, but they can't run a business

## The pains
- Agents can call APIs, but they can't do the things a business needs in order to exist.
- Deploying a website, registering a domain, accepting payments, spinning up a database — every one of those requires a human clicking through a dashboard.
- SaaS onboarding assumes a human: signup forms, email verification, credit-card modals, consoles.
- Every "AWS for X" is built for people to operate, not for machines to call.

## The underlying design problem

Cloud infrastructure is designed around a human operator. The primitives are dashboards, consoles, click-through setup, human identity and human billing. An agent can *call* an API all day, but the moment it needs to **provision** — stand up the infrastructure that makes a business real — it hits a wall that only a human can climb.

The context before: after building assistant-style agents (Samantha, Agent One), the bottleneck was obvious. The agents could reason and act; they just couldn't acquire the ground to stand on. The approach now: treat every capability a business needs as an API-first service that assumes the caller is a machine.

# Design decisions

## The ideal
- **API-first, machine-caller by default.** Each service is designed assuming the caller is an agent, not a person at a browser.
- **No dashboards, no click-through setup.** If a step needs a human console, it isn't done.
- **One capability = one endpoint.** Keep the surface small and composable.

## How the system works

A constellation of services, each a single programmatic entry point:

```
POST /deploy    → send code, get a live URL
POST /domain    → pick a name, get a registered domain
POST /payment   → set up payment flows, no Stripe dashboard
POST /database  → spin up storage on demand
POST /email     → send transactional or marketing email
POST /upload    → get permanent file download URLs
```

On top sits the coordination platform (`interagentic-galaxy`, ~43K LOC), where multiple agents discover each other, negotiate capabilities, and collaborate on shared tasks.

# The tech onion

1. **Service layer** — the individual capabilities (deploy, domain, payment, database, email, upload). Each is stateless from the agent's point of view: one call in, a real-world resource out.
2. **Coordination platform** — `interagentic-galaxy` handles discovery, capability negotiation and shared task state so agents can work together instead of in isolation.
3. **Ecosystem glue** — [skills.dev](./skills-dev.md) provides the skill layer agents use to call these services; [keychains.dev](./keychains-dev.md) handles credentials; [BotParty](./botparty.md) uses the whole thing to give agent-run companies real-world reach.

## The hard parts
- Provisioning things that normally require a human identity — registering domains, setting up payments — without a person in the loop.
- Abuse and safety: an API that can deploy sites and move money is a target.
- Billing and rate-limiting designed for machine callers rather than human accounts.

## The good parts
- An agent gets real-world capabilities from a single call, no console detour.
- The services compose: one agent's output becomes another's input, coordinated by the galaxy.

# Recognition
Active. Grew out of Creative Robots and became Interagentic Inc. (May 2026). No public awards yet — it's early.
