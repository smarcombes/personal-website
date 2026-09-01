# Why — two agents need to talk without you running a server

## The pains
- Two agents (or an agent and a human) need to exchange tasks and results.
- You don't want to stand up and operate infrastructure just for that.
- You *really* don't want the relay in the middle to see your data.

## The underlying design problem

The usual options force a bad trade: either you run your own backend, or you hand your plaintext to someone else's. There's no drop-in, zero-setup channel that is also zero-knowledge. Streambin is a public relay (`streambin.xyz`) that stores only opaque ciphertext — the SDKs encrypt before sending and decrypt after reading, so the server never sees plaintext.

# Design decisions

## The ideal
- **Zero-knowledge by construction.** The relay stores ciphertext and nothing else; the passphrase never leaves the client.
- **Firebase-shaped ergonomics without Firebase.** Reactive docs, real-time streams, file handoff — via familiar primitives.
- **Ephemeral by default.** Short-lived shared state that auto-evaporates (3-day lifecycle on files).
- **Upgradeable crypto.** Every payload is a versioned ciphertext envelope so the cipher can change without breaking old data.

## How the system works

```
Client (browser/CLI)
  │  encrypted payloads
  ▼
Next.js API (Vercel)
  ├── Streams → Upstash Redis RPUSH/LRANGE + TTL
  ├── Docs    → Upstash Redis SET/GET, dot-path merge server-side
  └── Files   → S3 presigned, sha256 key, 3-day lifecycle
```

Share a passphrase, and two parties exchange tasks/results over an encrypted stream. An agent appends its run-log; a human tails it from any machine.

# The tech onion

1. **Cryptography** — Web Crypto API (no native deps): PBKDF2 (passphrase + salt) → AES-GCM, wrapped in a versioned envelope. The server never sees the passphrase.
2. **Primitives** — Streams (append-only logs, SSE listeners, cursor pagination), Documents (reactive JSON with dot-path merges), Files (S3 presigned, addressed by `sha256(namespace + "/" + path)`, multipart).
3. **Client surface** — React hooks (`useStream`, `useObject`, `useFileUpload`, …) as drop-in replacements for Firebase primitives, plus an agent CLI (`npx streambin.xyz`).
4. **Transport detail** — SSE connections rotate around Vercel's ~790s edge limit; the client auto-reconnects from its last cursor.

## The hard parts
- Doing genuinely useful reactive/streaming features while the server stays blind to content.
- Keeping long-lived SSE connections alive across serverless edge limits.

## The good parts
- No infrastructure to run, no plaintext exposure, and an API that feels like Firebase.

## Stack
Next.js (Vercel) · Upstash Redis · S3 · Web Crypto · TypeScript. Published as `@streambin/sdk` and `@streambin/react-sdk`.

# Recognition
Shipped and active on npm; no formal recognition.
