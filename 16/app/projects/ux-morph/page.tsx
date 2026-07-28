import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, DataTable, P, Pre, Section, Src, Sub } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["ux-morph"];
export const metadata: Metadata = {
  title: `${meta.title} — Séverin Marcombes`,
  description: meta.tagline,
};

export default function Page() {
  return (
    <ProjectPage
      emoji={meta.emoji}
      title={meta.title}
      tagline={meta.tagline}
      badges={["TypeScript", "Next.js", "research preview"]}
    >
      <P>
        Most SaaS products are one-size-fits-all. If the UI is wrong for you,
        you&apos;re stuck. UXMorph is an experiment: what if every user could
        reshape the interface to their needs, permanently, through chat?
      </P>
      <P>
        A user taps the floating chat bubble, asks for &quot;make the todo list
        look like a kanban board.&quot; A few seconds later, their UI is a kanban
        board. On every reload. Just for them. Every change is a real Git commit —
        scrollable like undo/redo.
      </P>

      <Section>How It Works</Section>
      <Sub>Per-user Git branches</Sub>
      <P>
        Every user gets a <Code>{"user/<uid>"}</Code> branch forked from{" "}
        <Code>main</Code>. All AI edits commit there. Version history{" "}
        <em>is</em> Git history — free undo, free forking, free audit log.
      </P>

      <Sub>Runtime ESM hot-swap</Sub>
      <P>
        The shell page doesn&apos;t serve a static bundle. It dynamically{" "}
        <Code>import()</Code>s a content-hashed bundle URL at runtime. Switching
        versions is:
      </P>
      <Pre>{`import(newUrl) + root.render(<NewApp />)`}</Pre>
      <P>
        No page reload. React doesn&apos;t unmount. The customizer keeps running.
      </P>

      <Sub>The agent loop</Sub>
      <P>
        <Code>/api/chat/start</Code> spawns a Modal sandbox with Claude and a tool
        surface that covers the full loop:
      </P>
      <DataTable
        head={["Tool", "What it does"]}
        rows={[
          [<Code key="c">commit_changes</Code>, <Code key="v">git add -A && git commit && git push</Code>],
          [<Code key="c">trigger_build</Code>, <>esbuild in a Modal sandbox, uploads <Code>dist/app.js</Code></>],
          [<Code key="c">switch_commit</Code>, <>SSE event → client-side <Code>{"window.__switchVersion(hash)"}</Code></>],
          [<Code key="c">get_console_logs</Code>, "Sentry-style grouped logs from the live tab"],
          [<Code key="c">get_dom_snapshot</Code>, "Asks the live tab to serialize its DOM"],
        ]}
      />
      <P>The agent ships, observes, and fixes in one loop.</P>

      <Sub>Co-located backend</Sub>
      <P>
        Drop a file at <Code>{"services/<name>/index.ts"}</Code> in the frontend
        repo — it becomes an authenticated REST endpoint scoped to the calling
        user. The agent ships full-stack features in a single commit.
      </P>

      <Sub>Customizer drawer</Sub>
      <P>
        Zero-deps vanilla-JS ESM. Floating chat button, slide-out drawer, version
        timeline with <Code>{"< prev / next >"}</Code> arrows. Self-heals via{" "}
        <Code>MutationObserver</Code> — if user code removes the drawer, it
        remounts.
      </P>

      <Section>Stack</Section>
      <P>
        Next.js · Firebase Auth (anon) + RTDB · Upstash Redis · Modal · Anthropic
        Claude · esbuild (runtime ESM)
      </P>

      <Section>Status</Section>
      <P>
        Research preview. The idea works — the UX of <em>morphing</em> rather than
        coding is the interesting thing.
      </P>

      <Src>
        <A href="https://github.com/smarcombes/ux-morph">
          github.com/smarcombes/ux-morph
        </A>
      </Src>
    </ProjectPage>
  );
}
