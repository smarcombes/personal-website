import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["layouts-dev"];
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
      badges={["TypeScript", "React Native", "2024–2025"]}
    >
      <P>
        The problem: 80% of UI work is the same things (inputs, buttons, auth,
        payments) rebuilt from scratch every time. AI coding assistants had to
        re-invent a date picker on every request. And even a simple
        &quot;Google login&quot; takes weeks to get right because the edge cases
        eat the time.
      </P>
      <P>
        The thesis: what if there was a headless, cross-platform component
        library with feature-level primitives — not just components, but features
        — combined with a DSL that was 10x more concise than React, readable by
        designers who can&apos;t code?
      </P>

      <Section>The language</Section>
      <Pre>{`/hstack gap-4 p-8
    /avatar
        @src=https://example.com/photo.jpg
    /vstack
        Hello World
        /button
            @variant=outline
            Click me`}</Pre>
      <P>
        Same parse tree compiles to React Web, Next.js, or React Native.
        Line-by-line, regex-driven parser. Tailwind tokens on the component line.
        Tab indentation for nesting.
      </P>
      <P>
        The language was genuinely good for designers. Alex (the designer on the
        team, couldn&apos;t code) could prototype in about an hour using just
        keywords for functionality and style.
      </P>

      <Section>The editor</Section>
      <P>
        Monaco with a custom <Code>layouts</Code> language definition, AI copilot,
        live preview in an iframe, bidirectional hover linking (hover over a
        preview element → editor highlights the source line), and Liveblocks +
        Yjs multiplayer.
      </P>

      <Section>What we learned</Section>
      <P>
        <strong className="font-semibold">
          1. Component creation is a titanesque bottleneck.
        </strong>{" "}
        Every component needed to work on React Web and React Native, be headless,
        composable, Tailwind-styled. Open-source components aren&apos;t
        homogeneous. We recoded each one. 40+ repos, 543K LOC.
      </P>
      <P>
        <strong className="font-semibold">
          2. Models got too good at standard React.
        </strong>{" "}
        Our DSL had lower error rates than React early on. As models improved,
        they got very good at standard React — and hadn&apos;t been trained on our
        syntax. The advantage eroded.
      </P>
      <P>
        <strong className="font-semibold">
          3. Lovable launched one week after us.
        </strong>{" "}
        The market shifted to &quot;generate everything from a prompt.&quot; Our
        tool asked users to think about structure.
      </P>
      <P>
        <strong className="font-semibold">4. Designers loved it.</strong> The
        signal was there — we didn&apos;t have runway to pursue it.
      </P>

      <Section>Scale</Section>
      <P>
        40+ repos · 543K LOC core product · 2 cross-platform component registries
        · Figma integration · multiplayer editing · AI backend · subscriptions ·
        federated auth · backoffice
      </P>

      <Section>Stack</Section>
      <P>
        Next.js · React Native / Expo · Monaco · Liveblocks + Yjs · Clerk ·
        Firebase · Stripe · Tailwind
      </P>

      <Src>
        <A href="https://layouts.dev">layouts.dev</A> · 2024–2025
      </Src>
    </ProjectPage>
  );
}
