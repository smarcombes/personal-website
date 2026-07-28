import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Bullet, Bullets, Code, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["streambin"];
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
      badges={["@streambin/sdk", "TypeScript", "active"]}
    >
      <P>
        Two agents need to exchange tasks and results. You don&apos;t want to run
        infrastructure. You don&apos;t want the relay server to see your data.
        Streambin is the answer.
      </P>
      <P>
        The server (<Code>streambin.xyz</Code>) is a public relay that stores
        opaque ciphertext. The SDKs encrypt before sending, decrypt after
        reading. The server never sees plaintext.
      </P>

      <Section>What it provides</Section>
      <P>
        <strong className="font-semibold">Streams</strong> — append-only event
        logs with SSE real-time listeners and cursor pagination. Agent pipes its
        run-log to a stream; human tails it from any device.
      </P>
      <P>
        <strong className="font-semibold">Documents</strong> — reactive JSON with
        dot-path merges. <Code>{'{ "user.profile.name": "Alice" }'}</Code> updates
        a single nested field. Firebase-style reactivity without Firebase.
      </P>
      <P>
        <strong className="font-semibold">Files</strong> — S3 presigned uploads
        addressed by <Code>{'sha256(namespace + "/" + path)'}</Code>. Multipart.
        3-day lifecycle.
      </P>
      <P>
        <strong className="font-semibold">React hooks</strong> —{" "}
        <Code>useStream</Code>, <Code>useSendToStream</Code>,{" "}
        <Code>useObject</Code>, <Code>useObjectActions</Code>,{" "}
        <Code>useFileUpload</Code>. Drop-in replacements for Firebase SDK
        primitives.
      </P>
      <P>
        <strong className="font-semibold">Agent CLI</strong> —{" "}
        <Code>npx streambin.xyz</Code>. Generate a bucket, tail a stream, manage
        docs, upload files.
      </P>
      <Pre>{`# agent side
streambin.xyz append agents/run-log '{"step": "fetching data"}'

# human side, any machine
streambin.xyz tail agents/run-log`}</Pre>

      <Section>Cryptography</Section>
      <P>
        Web Crypto API — no native deps. PBKDF2 (passphrase + salt) → AES-GCM.
        Each payload is a versioned ciphertext envelope so the cipher can be
        upgraded without breaking old payloads. Server never sees the passphrase.
      </P>

      <Section>Architecture</Section>
      <Pre>{`Client (browser/CLI)
  │  encrypted payloads
  ▼
Next.js API (Vercel)
  ├── Streams → Upstash Redis RPUSH/LRANGE + TTL
  ├── Docs    → Upstash Redis SET/GET, dot-path merge server-side
  └── Files   → S3 presigned, sha256 key, 3-day lifecycle`}</Pre>
      <P>
        SSE connections rotate around 790s (Vercel edge limit); client
        auto-reconnects with last cursor.
      </P>

      <Section>Use cases</Section>
      <Bullets>
        <Bullet>
          Agent ↔ agent communication: share a passphrase, exchange tasks/results
          over an encrypted stream
        </Bullet>
        <Bullet>
          Agent run-log: agent appends progress, human tails from any machine
        </Bullet>
        <Bullet>
          Ephemeral shared state: short-lived session data that auto-evaporates in
          3 days
        </Bullet>
        <Bullet>Cross-machine file handoff: no server setup needed</Bullet>
      </Bullets>

      <Section>Monorepo</Section>
      <Pre>{`apps/server/          Next.js API (Vercel)
packages/shared/      types, envelope format
packages/crypto/      Web Crypto logic
packages/sdk/         @streambin/sdk
packages/react-sdk/   @streambin/react-sdk (React 19+)
packages/cli/         streambin.xyz agent CLI`}</Pre>

      <Section>Install</Section>
      <Pre>{`npm install @streambin/sdk
# or
npm install @streambin/react-sdk`}</Pre>

      <Src>
        <A href="https://github.com/smarcombes/streambin">
          github.com/smarcombes/streambin
        </A>{" "}
        · <A href="https://streambin.xyz">streambin.xyz</A>
      </Src>
    </ProjectPage>
  );
}
