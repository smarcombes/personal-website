# streambin

> E2E-encrypted streams, docs, and files for agents and humans. Zero-knowledge relay.

[![npm](https://img.shields.io/badge/npm-@streambin%2Fsdk-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/@streambin/sdk)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](#)

Two agents need to exchange tasks and results. You don't want to run infrastructure. You don't want the relay server to see your data. Streambin is the answer.

The server (`streambin.xyz`) is a public relay that stores opaque ciphertext. The SDKs encrypt before sending, decrypt after reading. The server never sees plaintext.

## What it provides

**Streams** — append-only event logs with SSE real-time listeners and cursor pagination. Agent pipes its run-log to a stream; human tails it from any device.

**Documents** — reactive JSON with dot-path merges. `{ "user.profile.name": "Alice" }` updates a single nested field. Firebase-style reactivity without Firebase.

**Files** — S3 presigned uploads addressed by `sha256(namespace + "/" + path)`. Multipart. 3-day lifecycle.

**React hooks** — `useStream`, `useSendToStream`, `useObject`, `useObjectActions`, `useFileUpload`. Drop-in replacements for Firebase SDK primitives.

**Agent CLI** — `npx streambin.xyz`. Generate a bucket, tail a stream, manage docs, upload files.

```bash
# agent side
streambin.xyz append agents/run-log '{"step": "fetching data"}'

# human side, any machine
streambin.xyz tail agents/run-log
```

## Cryptography

Web Crypto API — no native deps. PBKDF2 (passphrase + salt) → AES-GCM. Each payload is a versioned ciphertext envelope so the cipher can be upgraded without breaking old payloads. Server never sees the passphrase.

## Architecture

```
Client (browser/CLI)
  │  encrypted payloads
  ▼
Next.js API (Vercel)
  ├── Streams → Upstash Redis RPUSH/LRANGE + TTL
  ├── Docs    → Upstash Redis SET/GET, dot-path merge server-side
  └── Files   → S3 presigned, sha256 key, 3-day lifecycle
```

SSE connections rotate around 790s (Vercel edge limit); client auto-reconnects with last cursor.

## Use cases

- Agent ↔ agent communication: share a passphrase, exchange tasks/results over an encrypted stream
- Agent run-log: agent appends progress, human tails from any machine
- Ephemeral shared state: short-lived session data that auto-evaporates in 3 days
- Cross-machine file handoff: no server setup needed

## Monorepo

```
apps/server/          Next.js API (Vercel)
packages/shared/      types, envelope format
packages/crypto/      Web Crypto logic
packages/sdk/         @streambin/sdk
packages/react-sdk/   @streambin/react-sdk (React 19+)
packages/cli/         streambin.xyz agent CLI
```

## Install

```bash
npm install @streambin/sdk
# or
npm install @streambin/react-sdk
```

→ [github.com/smarcombes/streambin](https://github.com/smarcombes/streambin) · [streambin.xyz](https://streambin.xyz)
