# Interagentic

> AWS for agents — deploy, domains, payments, databases. All programmatic. No dashboards.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](#)

Agents can call APIs, but they can't do the things a business needs to exist. Deploy a website. Register a domain. Accept payments. Spin up a database. Every one of those requires a human clicking through a dashboard.

Interagentic removes that dependency. Each service is designed API-first, assuming the caller is a machine.

## What agents can do

```
POST /deploy        → send code, get a live URL
POST /domain        → pick a name, get a registered domain
POST /payment       → set up payment flows, no Stripe dashboard
POST /database      → spin up storage on demand
POST /email         → send transactional or marketing email
POST /upload        → get permanent file download URLs
```

No dashboards. No click-through setup. Pure programmatic access.

## Context

After building [Samantha](./samantha.md) and [Agent One](./agent-one.md), the bottleneck became clear: agents could reason and act, but they couldn't provision the infrastructure that makes a business real. Interagentic is the missing layer.

The `interagentic-galaxy` (43K LOC) is the coordination platform — where multiple agents discover each other, negotiate capabilities, and collaborate on shared tasks.

## Built alongside

[BotParty](./botparty.md) uses Interagentic to give agent-run companies real-world capabilities. [skills.dev](./skills-dev.md) provides the skill layer that agents use to call these services.

## Status

Active · Creative Robots → Interagentic Inc. · May 2026
