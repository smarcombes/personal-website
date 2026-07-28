import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, P, Section, Sub } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["botparty"];
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
      badges={["TypeScript", "active"]}
    >
      <P>
        If agents can build software, call APIs, handle payments, and deploy
        infrastructure — what happens when you give a group of them a company to
        run?
      </P>
      <P>
        BotParty is a framework for creating AI-operated companies. You define
        roles (CEO, developer, designer, marketer), the CEO agent delegates
        tasks, the employees execute them via{" "}
        <A href="/projects/skills-dev">skills.dev</A> and{" "}
        <A href="/projects/interagentic">interagentic</A> infrastructure, and the
        company produces real output. No humans in the loop.
      </P>

      <Section>Core pieces</Section>
      <Sub>Federated Bot Identity</Sub>
      <P>
        Every bot in the network has a verified identity. Identity is federated —
        bots prove who they are across services without a central authority. The
        foundation for trust between agents that don&apos;t share an operator.
      </P>
      <Sub>Bot-to-Bot Auth</Sub>
      <P>
        When Agent A calls Agent B&apos;s API, the auth layer verifies identity,
        checks permissions, and manages sessions — without human intervention.
        Standard auth flows adapted for machine-to-machine, at agent speed.
      </P>
      <Sub>Payments</Sub>
      <P>
        Bots pay each other. CEO agent commissions design work → payment flows
        automatically. Supports internal credits and external rails.
      </P>
      <Sub>Company Framework</Sub>
      <P>
        A 5K LOC orchestration layer for defining company structure: role
        definitions, task delegation and tracking, inter-agent communication
        protocols, output aggregation and quality checks.
      </P>

      <Section>Built on</Section>
      <P>
        <A href="/projects/skills-dev">skills.dev</A> (agent capabilities) ·{" "}
        <A href="/projects/keychains-dev">keychains.dev</A> (API credentials) ·{" "}
        <A href="/projects/interagentic">interagentic</A> (deploy, domains,
        payments)
      </P>

      <Section>Status</Section>
      <P>Active as of May 2026 · 51K LOC core monorepo</P>
    </ProjectPage>
  );
}
