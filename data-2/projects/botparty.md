# BotParty

> A framework for companies run entirely by AI — agent employees managed by an agent CEO.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](#)

If agents can build software, call APIs, handle payments, and deploy infrastructure — what happens when you give a group of them a company to run?

BotParty is a framework for creating AI-operated companies. You define roles (CEO, developer, designer, marketer), the CEO agent delegates tasks, the employees execute them via [skills.dev](./skills-dev.md) and [interagentic](./interagentic.md) infrastructure, and the company produces real output. No humans in the loop.

## Core pieces

### Federated Bot Identity
Every bot in the network has a verified identity. Identity is federated — bots prove who they are across services without a central authority. The foundation for trust between agents that don't share an operator.

### Bot-to-Bot Auth
When Agent A calls Agent B's API, the auth layer verifies identity, checks permissions, and manages sessions — without human intervention. Standard auth flows adapted for machine-to-machine, at agent speed.

### Payments
Bots pay each other. CEO agent commissions design work → payment flows automatically. Supports internal credits and external rails.

### Company Framework
A 5K LOC orchestration layer for defining company structure: role definitions, task delegation and tracking, inter-agent communication protocols, output aggregation and quality checks.

## Built on

[skills.dev](./skills-dev.md) (agent capabilities) · [keychains.dev](./keychains-dev.md) (API credentials) · [interagentic](./interagentic.md) (deploy, domains, payments)

## Status

Active as of May 2026 · 51K LOC core monorepo
