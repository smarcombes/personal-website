import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, Ordered, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["ollama-pool"];
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
      badges={["TypeScript", "Electron", "Next.js"]}
    >
      <P>
        You have a MacBook, a desktop, maybe a home server — all running Ollama,
        all with different models loaded. Normally you&apos;d have to know which
        machine has which model and hit the right IP. Ollama Pool turns all of
        them into one endpoint.
      </P>
      <Pre>{`┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌────────┐
│   CLI   │────▶│  Server  │────▶│  Firebase DB  │◀────│Desktop │──▶ Ollama
│ or app  │◀────│ (Next.js)│◀────│   (bridge)    │────▶│  App   │
└─────────┘ SSE └──────────┘     └───────────────┘ SSE └────────┘`}</Pre>

      <Section>How it works</Section>
      <Ordered>
        <li className="pl-1">
          <strong className="font-semibold">You ask</strong> via CLI,{" "}
          <Code>curl</Code>, or any OpenAI-compatible client
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Server</strong> creates a job in
          Firebase, picks the best available machine
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Desktop app</strong> on that machine
          picks up the job, runs Ollama inference
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Tokens stream back</strong> — Ollama →
          Desktop → Firebase → Server → You (SSE)
        </li>
        <li className="pl-1">
          <strong className="font-semibold">Cleanup</strong> — job data deleted
          from Firebase after completion
        </li>
      </Ordered>
      <P>
        Streams are stored in OpenAI <Code>ChatCompletionChunk</Code> format with
        support for content, thinking/reasoning traces, and tool calls.
      </P>

      <Section>API</Section>
      <P>
        Drop-in OpenAI replacement. Point any compatible client at the server:
      </P>
      <Pre>{`# Chat
curl http://localhost:3000/api/v1/chat/completions \\
  -H "Authorization: Bearer any-key" \\
  -d '{"model":"llama3.2","messages":[{"role":"user","content":"Hi"}],"stream":true}'

# List all models across all machines
curl http://localhost:3000/api/v1/models -H "Authorization: Bearer any-key"`}</Pre>

      <Section>Components</Section>
      <P>
        <strong className="font-semibold">Server</strong> — Next.js 15 API +
        dashboard. Speaks OpenAI format, coordinates jobs via Firebase.
      </P>
      <P>
        <strong className="font-semibold">Desktop app</strong> — Electron tray
        app. Runs on each machine with Ollama, picks up jobs, streams tokens back.
      </P>
      <P>
        <strong className="font-semibold">CLI</strong> — Interactive terminal
        client for chatting through the pool.
      </P>

      <Section>Stack</Section>
      <P>
        Next.js 15 · Electron + Vite + React · Firebase Realtime Database (job
        bridge + SSE) · Turborepo · BotParty (identity + JWT) · Ollama
      </P>

      <Src>
        <A href="https://github.com/smarcombes/ollama-pool">
          github.com/smarcombes/ollama-pool
        </A>
      </Src>
    </ProjectPage>
  );
}
