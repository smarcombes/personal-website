import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import {
  A,
  Bullet,
  Bullets,
  Code,
  P,
  Pre,
  Section,
  Src,
} from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["protean"];
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
      badges={["TypeScript", "Bun", "active experiment"]}
    >
      <P>
        Most AI agents hit a wall when they need a capability they weren&apos;t
        given. Protean asks what happens if you remove that wall entirely.
      </P>
      <P>The agent can:</P>
      <Bullets>
        <Bullet>
          <strong className="font-semibold">Write new tools for itself</strong>{" "}
          — asks for a camera, doesn&apos;t have one, writes the tool from
          scratch, restarts, now has one
        </Bullet>
        <Bullet>
          <strong className="font-semibold">Modify its own source code</strong>{" "}
          — branches, tests, merges, restarts via a crash-safe supervisor
        </Bullet>
        <Bullet>
          <strong className="font-semibold">Migrate to another machine</strong>{" "}
          — tell it you have a Raspberry Pi on the network; it clones itself
          there and keeps running after you close the laptop
        </Bullet>
      </Bullets>
      <P>The only real constraint is token budget.</P>

      <Section>How It Works</Section>
      <Pre>{`bootstrap → supervisor → main runtime
                ↓
        crash ladder + git rollback
                ↓
        agent (Claude) + tool system
                ↓
    built-in MCPs + external tools (~/tools/)`}</Pre>
      <P>
        <strong className="font-semibold">Self-modification</strong>: the
        agent&apos;s working directory is its own source code. It can{" "}
        <Code>Write</Code> / <Code>Edit</Code> / <Code>Bash</Code> on its repo,
        commit to a branch, run tests, merge, then call{" "}
        <Code>restart_runtime</Code>. The supervisor catches the exit code and
        pulls + relaunches.
      </P>
      <P>
        <strong className="font-semibold">P2P migration</strong>: Iroh transport
        between peers. Distributed state via Yjs CRDT — conversation history,
        task state, master assignment. Master election is deterministic (lowest
        peer ID wins). Transferring your &quot;brain&quot; to another machine is
        one tool call.
      </P>
      <P>
        <strong className="font-semibold">External tools</strong>: anything in{" "}
        <Code>{"~/.protean/tools/<name>/"}</Code> becomes an MCP server. The agent
        creates new tools by writing code into that directory — they&apos;re
        available on the next turn.
      </P>

      <Section>The crash ladder</Section>
      <P>The supervisor won&apos;t let it brick itself:</P>
      <Pre>{`crash → main → safe-mode → git rollback HEAD~1 → HEAD~2 → ...`}</Pre>
      <P>Has saved it from itself multiple times.</P>

      <Section>Stack</Section>
      <P>
        Bun · TypeScript · Anthropic Claude SDK · Iroh (P2P) · Yjs (CRDT) · Ink
        (TUI) · MCP
      </P>

      <Section>Status</Section>
      <P>Active experiment. Dangerous but illuminating.</P>

      <Src>
        <A href="https://github.com/smarcombes/protean">
          github.com/smarcombes/protean
        </A>
      </Src>
    </ProjectPage>
  );
}
