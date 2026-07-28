import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Bullet, Bullets, Code, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["github-filesystem"];
export const metadata: Metadata = {
  title: `${meta.title} — Séverin Marcombes`,
  description: meta.tagline,
};

export default function Page() {
  return (
    <ProjectPage
      emoji={meta.emoji}
      title={meta.title}
      tagline={
        <>
          GitHub repos as a Node.js <Code>fs</Code>. <Code>writeFile</Code>{" "}
          commits to Git.
        </>
      }
      badges={["github-filesystem", "TypeScript"]}
    >
      <P>
        AI agents need to read and write code in remote repos without cloning
        locally. This library gives them the standard Node.js{" "}
        <Code>fs.promises</Code> API — backed by the GitHub Contents API and Git
        Data API.
      </P>

      <Section>Usage</Section>
      <Pre>{`import { GitHubFS } from 'github-filesystem';

const fs = new GitHubFS({ repo: 'owner/repo', branch: 'main' });

await fs.readFile('src/index.ts');           // Buffer
await fs.writeFile('src/index.ts', code);   // commits immediately
await fs.readdir('src/');                    // string[]
await fs.stat('src/index.ts');              // Stats
await fs.rm('src/old.ts');
await fs.rename('src/a.ts', 'src/b.ts');
await fs.appendFile('src/log.txt', 'line\\n');
await fs.exists('src/index.ts');            // boolean`}</Pre>

      <Section>Two modes</Section>
      <P>
        <strong className="font-semibold">Instant mode</strong> (default) — every{" "}
        <Code>writeFile</Code> or <Code>deleteFile</Code> creates a commit
        immediately via the Contents API. Simple, one commit per operation.
      </P>
      <P>
        <strong className="font-semibold">Commit mode</strong> — batch multiple
        changes into a single Git commit:
      </P>
      <Pre>{`await fs.startWork();
await fs.writeFile('a.ts', '...');
await fs.writeFile('b.ts', '...');
await fs.deleteFile('c.ts');
await fs.commitWork('refactor: reorganize modules');
// → one commit, three file changes`}</Pre>
      <P>
        In commit mode, staged changes are buffered in Upstash Redis. Reads merge
        staged state with GitHub so the view stays consistent mid-batch.
      </P>
      <P>
        The commit uses GitHub&apos;s Git Data API (not Contents API):{" "}
        <Code>getRef</Code> → <Code>getCommit</Code> → <Code>createTree</Code> →{" "}
        <Code>createCommit</Code> → <Code>updateRef</Code>. This handles deletions
        correctly (the Contents API can&apos;t delete and modify atomically).
      </P>

      <Section>Notes</Section>
      <Bullets>
        <Bullet>
          <Code>mkdir</Code> creates <Code>.gitkeep</Code> (Git has no empty
          directories)
        </Bullet>
        <Bullet>
          <Code>rename</Code> = read → write → delete (not a native Git operation)
        </Bullet>
        <Bullet>
          <Code>stat</Code> tries <Code>readFile</Code>, falls back to{" "}
          <Code>readdir</Code> to determine file vs directory
        </Bullet>
        <Bullet>
          Sync methods exist but throw — remote filesystems can&apos;t be
          synchronous
        </Bullet>
      </Bullets>

      <Section>Install</Section>
      <Pre>{`npm install github-filesystem`}</Pre>

      <Src>
        <A href="https://github.com/smarcombes/github-filesystem">
          github.com/smarcombes/github-filesystem
        </A>
      </Src>
    </ProjectPage>
  );
}
