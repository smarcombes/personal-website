import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["keychains-dev"];
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
        Authentication is the hardest part of building agents that call real
        APIs. Every provider uses a different auth method, often poorly
        documented. Users don&apos;t want to create developer accounts. Agents
        shouldn&apos;t hold raw credentials.
      </P>
      <P>
        Keychains solves this as a proxy. The agent sends a request with
        placeholder credentials; keychains figures out the auth method, obtains
        the token, injects it, and forwards the request.
      </P>

      <Section>How it works</Section>
      <Pre>{`# agent sends this
curl -H "Authorization: Bearer {{OAUTH2_TOKEN}}" https://api.github.com/user

# keychains:
# 1. resolves domain → GitHub provider
# 2. checks if user has connected GitHub (returns connect URL if not)
# 3. infers required scopes from the endpoint
# 4. obtains a fresh token
# 5. substitutes {{OAUTH2_TOKEN}} and forwards the request`}</Pre>
      <P>
        The agent never sees the OAuth flow, the client secret, or the token.
      </P>

      <Section>Scope inference</Section>
      <P>
        One of the genuinely hard problems: most APIs don&apos;t document which
        scopes a specific endpoint needs. Keychains builds this from a provider
        knowledge base of 6,000+ APIs — DNS-based domain → provider resolution,
        endpoint-level scope overrides, AI-inferred defaults for undocumented
        cases.
      </P>
      <P>
        L1 in-memory cache + L2 Redis with SWR-style background revalidation,
        because agents call this on every request.
      </P>

      <Section>Pay-as-you-go</Section>
      <P>
        For APIs where usage is token-based (image generation, translation, etc.)
        and user data isn&apos;t involved: keychains uses its own credentials,
        charges the user in credits, and returns HTTP 402 + top-up URL if balance
        runs out. 28+ providers. No API key setup required from the user.
      </P>

      <Section>X402 payment proxy</Section>
      <P>
        Some newer APIs use X402 (crypto micropayments). Keychains acts as
        intermediary — pays upstream with its wallet, charges the user in regular
        credits. Eliminates the crypto UX while keeping X402 compatibility.
      </P>

      <Section>Satellite proxy (open source)</Section>
      <P>
        Self-hostable proxy that scans requests for{" "}
        <Code>{"{{placeholder}}"}</Code> tokens, calls the resolution service,
        substitutes credentials, and forwards. Supports streaming. Retries once
        with <Code>forceRefresh</Code> on 401.
      </P>
      <Pre>{`# open source
github.com/smarcombes/keychains-proxy`}</Pre>

      <Section>Spun out from</Section>
      <P>
        <A href="/projects/skills-dev">skills.dev</A> — authentication was the
        hardest sub-problem, so it became its own service.
      </P>

      <Section>Status</Section>
      <P>Active · first component released from skills.dev</P>
    </ProjectPage>
  );
}
