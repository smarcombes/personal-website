# Agent One

> A Telegram-native AI agent backed by the entire skills.dev registry — reliably executes tasks, handles auth transparently, runs on Modal VMs.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Year](https://img.shields.io/badge/2025–2026-lightgrey?style=flat-square)](#)

The synthesis of [Samantha](./samantha.md) (the vision) and [skills.dev](./skills-dev.md) (the tooling): a background AI agent connected to Telegram, with access to the full skills registry, that could reliably execute any task.

## What it was

Telegram bot backed by the Vercel AI SDK (streaming, tool calling). Every user action — text, photo, voice, document — routes through the AI runner. The agent resolves the user's identity to a skills.dev account, searches the registry for the right capability, executes it, and handles the auth flow transparently if credentials are missing.

## Architecture

**Telegram layer**: Telegraf v4 webhook. Photos downloaded + JPEG'd. Voice/audio transcribed. Inline keyboard callbacks. MarkdownV2 output with 4096-char chunking.

**Skill resolution**: search skills.dev by semantic query → LLM filter → best match → execute via `run.a1.inc` (sandboxed Node.js). If credentials missing → returns a keychains.dev permission URL to the user.

**OAuth 2.1 for MCP**: full OAuth 2.1 discovery at `.well-known/oauth-authorization-server`. Authorization code + refresh, PKCE (S256), dynamic client registration, progressive scope consent. Standard-compliant — any MCP client can connect.

**Sandboxed execution**: Modal VMs per session. A1FS (Agent One Filesystem) mounted at `/mnt/parent-fs/`. Callbacks to main app for subagent coordination.

**Hardware**: ESP32/M5Stack device registry via Vercel KV. `ping` for presence, `list` for discovery. Physical voice agent on M5Stack Atom S3R.

**Provider knowledge base**: 1.88M LOC of scraped API documentation. Domain → provider resolution. Scope inference per endpoint. Auth method detection.

## What it proved

The skills.dev approach worked in practice. Hundreds of APIs, transparent auth, multi-step tasks — powered by a shared registry rather than per-request code generation. Repeatability went from 30–60% to near-deterministic.

Shelved when OpenClaw launched with a similar vision.

→ Multiple repos · ~500K total LOC across the ecosystem
