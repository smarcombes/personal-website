import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, P, Pre, Section } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["interagentic"];
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
        Agents can call APIs, but they can&apos;t do the things a business needs
        to exist. Deploy a website. Register a domain. Accept payments. Spin up a
        database. Every one of those requires a human clicking through a
        dashboard.
      </P>
      <P>
        Interagentic removes that dependency. Each service is designed API-first,
        assuming the caller is a machine.
      </P>

      <Section>What agents can do</Section>
      <Pre>{`POST /deploy        → send code, get a live URL
POST /domain        → pick a name, get a registered domain
POST /payment       → set up payment flows, no Stripe dashboard
POST /database      → spin up storage on demand
POST /email         → send transactional or marketing email
POST /upload        → get permanent file download URLs`}</Pre>
      <P>No dashboards. No click-through setup. Pure programmatic access.</P>

      <Section>Context</Section>
      <P>
        After building Samantha and Agent One, the bottleneck became clear:
        agents could reason and act, but they couldn&apos;t provision the
        infrastructure that makes a business real. Interagentic is the missing
        layer.
      </P>
      <P>
        The <Code>interagentic-galaxy</Code> (43K LOC) is the coordination
        platform — where multiple agents discover each other, negotiate
        capabilities, and collaborate on shared tasks.
      </P>

      <Section>Built alongside</Section>
      <P>
        <A href="/projects/botparty">BotParty</A> uses Interagentic to give
        agent-run companies real-world capabilities.{" "}
        <A href="/projects/skills-dev">skills.dev</A> provides the skill layer
        that agents use to call these services.
      </P>

      <Section>Status</Section>
      <P>Active · Creative Robots → Interagentic Inc. · May 2026</P>
    </ProjectPage>
  );
}
