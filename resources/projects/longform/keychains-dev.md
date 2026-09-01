# Why — auth is the wall between agents and real APIs

## The pains
- Every provider's auth is different, and most of it is poorly documented.
- Users don't want to create developer accounts just so an agent can act for them.
- Agents shouldn't ever hold raw credentials.
- Almost no API tells you which scopes a given endpoint actually needs.

## The underlying design problem

API authentication was designed for a human developer setting up an application once: OAuth consent screens, client secrets pasted into a dashboard, a token stored on a server. That model breaks for agents, which call thousands of different APIs on the fly and must **never** touch a secret.

The context before: while building [skills.dev](./skills-dev.md), auth turned out to be the single hardest part of making agents reliable. So it was pulled out into its own layer. The approach now: a credential proxy that stands between the agent and every provider.

# Design decisions

## The ideal
- **The agent sends a placeholder, not a secret.** Keychains resolves the provider, obtains the token, injects it, and forwards the request.
- **The agent never sees the OAuth flow, the client secret, or the token.** Ever.
- **Scopes are inferred, not memorized.** A knowledge base maps endpoints to the scopes they need.
- **Remove even the API-key step** with pay-as-you-go credits and X402 crypto micropayments.

## How the system works

The agent makes an ordinary request with a placeholder where the token would go:

```bash
curl https://api.github.com/user/repos \
  -H "Authorization: Bearer {{OAUTH2_TOKEN}}"
```

Keychains scans for the `{{placeholder}}`, resolves GitHub from the domain, fetches (and if needed refreshes) the user's token, substitutes it, and forwards the call — streaming the response back.

# The tech onion

1. **Proxy layer** — an open-source "satellite" proxy scans requests for `{{placeholders}}`, resolves and substitutes credentials, forwards, streams the response, and retries on `401` with a forced token refresh.
2. **Resolution + scope inference** — DNS domain → provider mapping, per-endpoint scope overrides, and AI-derived defaults across 6,000+ APIs, backed by an L1 in-memory + L2 Redis stale-while-revalidate cache to keep per-request latency low.
3. **Payments** — pay-as-you-go credits with an HTTP `402` top-up flow across 28+ providers, plus an X402 crypto micropayment proxy so an agent can pay per call with no account at all.

## The hard parts
- Inferring the right scopes for endpoints that document none.
- Keeping the added per-request latency small (hence the aggressive multi-layer caching).

## The good parts
- Agents call any API without ever touching a secret.
- Users don't have to create developer accounts or manage keys.

# Recognition
The first component released independently out of [skills.dev](./skills-dev.md). Active. No public awards yet.
