# Why — agents need to edit remote repos without cloning

## The pains
- AI agents need to read and write code in remote repos, but cloning locally is heavy and stateful.
- The GitHub API is a different mental model than the file operations agents already know.
- Deleting and modifying in the same commit isn't something the simple API path handles cleanly.

## The underlying design problem

Agents already "think" in `fs` terms — `readFile`, `writeFile`, `readdir`. But acting on a GitHub repo means learning the Contents API and the Git Data API, and reconciling their quirks. github-filesystem removes that gap: it exposes the standard Node.js `fs.promises` API and, underneath, `writeFile` is a Git commit.

# Design decisions

## The ideal
- **Be `fs.promises`, exactly.** `readFile`, `writeFile`, `readdir`, `stat`, `rm`, `rename`, `appendFile`, `exists` — the familiar surface, so agents (and humans) need no new mental model.
- **Two write modes.** *Instant* (one commit per operation, simple) and *Commit* (batch many changes into a single Git commit).
- **Be honest about the remote.** Sync methods exist but throw — a remote filesystem can't pretend to be synchronous.

## How the system works

```typescript
const fs = new GitHubFS({ repo: 'owner/repo', branch: 'main' });
await fs.writeFile('src/index.ts', code);   // commits immediately

await fs.startWork();
await fs.writeFile('a.ts', '...');
await fs.deleteFile('c.ts');
await fs.commitWork('refactor: reorganize modules');   // one commit, many changes
```

# The tech onion

1. **`fs` facade** — the `fs.promises`-shaped API agents call.
2. **Instant mode** — every write/delete is a commit via the Contents API; one commit per operation.
3. **Commit mode** — staged changes buffer in Upstash Redis; reads merge staged state with GitHub so the view stays consistent mid-batch; the final commit uses the Git Data API (`getRef → getCommit → createTree → createCommit → updateRef`), which handles atomic deletes + modifies the Contents API can't.
4. **Edge cases handled** — `mkdir` writes a `.gitkeep` (Git has no empty dirs), `rename` = read → write → delete, `stat` probes `readFile` then falls back to `readdir`.

## The hard parts
- Making a batched commit that correctly deletes *and* modifies in one atomic operation.
- Keeping reads consistent while changes are only staged, not yet committed.

## The good parts
- Any code that knows `fs` can operate a GitHub repo with no clone and no new API to learn.

## Stack
TypeScript · GitHub Contents API + Git Data API · Upstash Redis. Published on npm as `github-filesystem`.

# Recognition
A published open-source library; no formal recognition.
