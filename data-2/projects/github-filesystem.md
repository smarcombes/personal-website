# github-filesystem

> GitHub repos as a Node.js `fs`. `writeFile` commits to Git.

[![npm](https://img.shields.io/badge/npm-github--filesystem-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/github-filesystem)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)

AI agents need to read and write code in remote repos without cloning locally. This library gives them the standard Node.js `fs.promises` API — backed by the GitHub Contents API and Git Data API.

## Usage

```typescript
import { GitHubFS } from 'github-filesystem';

const fs = new GitHubFS({ repo: 'owner/repo', branch: 'main' });

await fs.readFile('src/index.ts');           // Buffer
await fs.writeFile('src/index.ts', code);   // commits immediately
await fs.readdir('src/');                    // string[]
await fs.stat('src/index.ts');              // Stats
await fs.rm('src/old.ts');
await fs.rename('src/a.ts', 'src/b.ts');
await fs.appendFile('src/log.txt', 'line\n');
await fs.exists('src/index.ts');            // boolean
```

## Two modes

**Instant mode** (default) — every `writeFile` or `deleteFile` creates a commit immediately via the Contents API. Simple, one commit per operation.

**Commit mode** — batch multiple changes into a single Git commit:

```typescript
await fs.startWork();
await fs.writeFile('a.ts', '...');
await fs.writeFile('b.ts', '...');
await fs.deleteFile('c.ts');
await fs.commitWork('refactor: reorganize modules');
// → one commit, three file changes
```

In commit mode, staged changes are buffered in Upstash Redis. Reads merge staged state with GitHub so the view stays consistent mid-batch.

The commit uses GitHub's Git Data API (not Contents API): `getRef` → `getCommit` → `createTree` → `createCommit` → `updateRef`. This handles deletions correctly (the Contents API can't delete and modify atomically).

## Notes

- `mkdir` creates `.gitkeep` (Git has no empty directories)
- `rename` = read → write → delete (not a native Git operation)
- `stat` tries `readFile`, falls back to `readdir` to determine file vs directory
- Sync methods exist but throw — remote filesystems can't be synchronous

## Install

```bash
npm install github-filesystem
```

→ [github.com/smarcombes/github-filesystem](https://github.com/smarcombes/github-filesystem)
