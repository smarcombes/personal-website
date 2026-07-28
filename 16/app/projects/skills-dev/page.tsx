import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, Ordered, P, Pre, Section } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["skills-dev"];
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
      badges={["TypeScript", "components releasing"]}
    >
      <P>
        The problem: agents have a 30–60% success rate on tasks like &quot;list
        my emails&quot; because they re-invent the integration from scratch every
        time. They don&apos;t remember what worked. They burn tokens re-coding the
        same boilerplate.
      </P>
      <P>
        The fix: a shared registry of proven, tested capabilities. Search → find
        → execute. If it doesn&apos;t exist, generate it once, test it, publish it
        — and every future call is instant.
      </P>

      <Section>How a skill looks</Section>
      <Pre>{`export default async function run(inputParams) {
  const token = await getOAuthCredentials('slack');
  // full Node.js, any npm package
  return { success: true, result: { ... }, errors: [] };
}

export const metadata = {
  skillName: "Send Slack Message",
  slug: "send-slack-message",
  description: "...",
  inputParams: { /* JSON Schema */ },
  outputParams: { /* JSON Schema */ },
  testCases: [{ input: {...}, validateOutput: "..." }],
};`}</Pre>
      <P>
        Skills have access to LLMs, key-value storage, databases, and a
        credential system (<A href="/projects/keychains-dev">keychains.dev</A>)
        that injects secrets at runtime without the skill code ever seeing them.
      </P>

      <Section>The auto-generation loop</Section>
      <P>When no skill exists for a task:</P>
      <Ordered>
        <li className="pl-1">
          <strong className="font-semibold">Generate</strong> — Cerebras (
          <Code>gpt-oss-120b</Code>) writes the initial TypeScript (fast, cheap)
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Pipeline</strong> — extract code →
          inject credentials → clean imports → compile → run → extract deps
        </li>
        <li className="pl-1">
          <strong className="font-semibold">On failure</strong> — error appended
          to context, retry (up to 25 iterations)
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Escalate</strong> — after 10 fails,
          switch to Claude with web search for harder problems
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Publish</strong> — working skill goes
          into the registry; next call is instant
        </li>
      </Ordered>
      <P>
        First request: 6s (simple) to 90s (complex). Every subsequent call:
        instant.
      </P>

      <Section>Search</Section>
      <P>
        Upstash Vector Search index. Semantic search with LLM reranking. Cerebras
        handles the filter step — fast enough that search feels synchronous.
      </P>

      <Section>What happened</Section>
      <P>
        Claude published their own skills system. OpenClaw launched with a similar
        vision. We paused the full launch and started releasing components
        independently. First:{" "}
        <A href="/projects/keychains-dev">keychains.dev</A>.
      </P>

      <Section>Scale</Section>
      <P>
        288K LOC · 109K LOC pre-made skills library · 1.88M LOC provider
        documentation scraped for scope inference
      </P>

      <Section>Status</Section>
      <P>Unreleased as a product. Components being open-sourced independently.</P>
    </ProjectPage>
  );
}
