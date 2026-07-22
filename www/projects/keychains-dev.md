# keychains.dev

> One proxy that handles all API authentication for agents. Agents call APIs without ever seeing credentials.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](#)

Authentication is the hardest part of building agents that call real APIs. Every provider uses a different auth method, often poorly documented. Users don't want to create developer accounts. Agents shouldn't hold raw credentials.

Keychains solves this as a proxy. The agent sends a request with placeholder credentials; keychains figures out the auth method, obtains the token, injects it, and forwards the request.

## How it works

```bash
# agent sends this
curl -H "Authorization: Bearer {{OAUTH2_TOKEN}}" https://api.github.com/user

# keychains:
# 1. resolves domain → GitHub provider
# 2. checks if user has connected GitHub (returns connect URL if not)
# 3. infers required scopes from the endpoint
# 4. obtains a fresh token
# 5. substitutes {{OAUTH2_TOKEN}} and forwards the request
```

The agent never sees the OAuth flow, the client secret, or the token.

## Scope inference

One of the genuinely hard problems: most APIs don't document which scopes a specific endpoint needs. Keychains builds this from a provider knowledge base of 6,000+ APIs — DNS-based domain → provider resolution, endpoint-level scope overrides, AI-inferred defaults for undocumented cases.

L1 in-memory cache + L2 Redis with SWR-style background revalidation, because agents call this on every request.

## Pay-as-you-go

For APIs where usage is token-based (image generation, translation, etc.) and user data isn't involved: keychains uses its own credentials, charges the user in credits, and returns HTTP 402 + top-up URL if balance runs out. 28+ providers. No API key setup required from the user.

## X402 payment proxy

Some newer APIs use X402 (crypto micropayments). Keychains acts as intermediary — pays upstream with its wallet, charges the user in regular credits. Eliminates the crypto UX while keeping X402 compatibility.

## Satellite proxy (open source)

Self-hostable proxy that scans requests for `{{placeholder}}` tokens, calls the resolution service, substitutes credentials, and forwards. Supports streaming. Retries once with `forceRefresh` on 401.

```bash
# open source
github.com/smarcombes/keychains-proxy
```

## Spun out from

[skills.dev](./skills-dev.md) — authentication was the hardest sub-problem, so it became its own service.

## Status

Active · first component released from skills.dev
