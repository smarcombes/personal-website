import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Code } from "@/components/content";

const OSS: {
  name: string;
  desc: React.ReactNode;
  github?: string;
}[] = [
  {
    name: "🦠 protean",
    desc: "Self-evolving agent. Writes new tools for itself, modifies its own code, migrates across machines over P2P. No artificial constraints except budget.",
    github: "https://github.com/smarcombes/protean",
  },
  {
    name: "🌊 ux-morph",
    desc: "Apps whose UI rewrites itself per-user. Chat → AI edits → hot-swap → real Git commit on your personal branch.",
  },
  {
    name: "🦙 ollama-pool",
    desc: "Distribute LLM inference across your machines. One globally-accessible, OpenAI-compatible endpoint for all your Ollama hardware.",
  },
  {
    name: "🎨 tailwind-motion-native",
    desc: "Tailwind Motion animation primitives ported to React Native via Moti.",
    github: "https://github.com/smarcombes/tailwind-motion-native",
  },
  {
    name: "📡 streambin",
    desc: "E2E-encrypted streams, docs & files for agents and humans. Zero-knowledge relay. Drop-in Firebase-style primitives.",
    github: "https://github.com/smarcombes/streambin",
  },
  {
    name: "🗂️ github-filesystem",
    desc: (
      <>
        GitHub repos as a Node.js <Code>fs</Code>. <Code>writeFile</Code> commits
        to Git. Agents treat remote repos like local disk.
      </>
    ),
    github: "https://github.com/smarcombes/github-filesystem",
  },
  {
    name: "⚛️ react-electron",
    desc: "Custom React 15 renderer for Electron. Managing multi-window apps from a single component tree. (2017)",
    github: "https://github.com/smarcombes/react-electron",
  },
];

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold underline underline-offset-2 decoration-foreground/20 hover:decoration-foreground"
    >
      {label}
    </a>
  );
}

export default function Home() {
  return (
    <Shell active="home">
      <p className="mt-8 mb-6">
        I&apos;m a repeat founder and product builder.<br />
        I&apos;m working on AI apps since before the ChatGPT era.
      </p>

      <p className="font-serif text-[18px] font-[500] leading-snug my-10 text-balance">
        I don&apos;t make models. I build the software systems around them, so
        they can make a real difference for people in the field.
      </p>

      {/* ============ RECENT WORK ============ */}
      <h2 className="font-bold tracking-[-0.01em] mt-16 mb-4">Recent work</h2>
      <div className="space-y-4">
        {/* Creative Robots */}
        <div className="bg-white border border-black shadow-card px-4 py-3">
          <div className="flex items-baseline gap-1.5 justify-between mb-2">
            <a
              href="https://layouts.dev"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-5 underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground"
            >
              Creative Robots
            </a>
            <div className="text-xs text-muted-foreground shrink-0 ml-1">
              2021 — now
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Experimenting at the intersection of design × app development ×
            AI-powered tools. It started as a vibe-coding app (before ChatGPT
            launched), then became a search for an approach better suited to
            designers and developers in the field. I call it{" "}
            <em>rail-coding</em>.
          </p>
          <p className="text-xs text-muted-foreground">
            Its main output is{" "}
            <a
              href="https://layouts.dev"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 decoration-foreground/20 hover:decoration-foreground text-foreground"
            >
              Layouts.dev
            </a>{" "}
            — pure software that outputs complete Next.js and Expo projects from a
            simple DSL: intuitive enough for designers to use in place of Figma,
            and text-based so AI agents can easily play with it.
          </p>
        </div>

        {/* Interagentic */}
        <div className="bg-white border border-black shadow-card px-4 py-3">
          <div className="flex items-baseline gap-1.5 justify-between mb-2">
            <a
              href="https://interagentic.inc"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-5 underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground"
            >
              Interagentic
            </a>
            <div className="text-xs text-muted-foreground shrink-0 ml-1">
              2025 — now
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            A company focused on giving agents more qualitative tools, with better
            environment boundaries and fewer humans in the loop. People have been
            making LLMs use tools{" "}
            <a
              href="https://x.com/sharifshameem/status/1405462642936799247"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 decoration-foreground/20 hover:decoration-foreground text-foreground"
            >
              since 2021
            </a>
            , yet the industry is very slow at providing the tools that will
            unleash the power of AI agents — so much that, five years later, I
            think model intelligence is no longer the bottleneck. Tools and
            harnesses are.
          </p>
          <ul className="list-none space-y-2 mt-3 border-t border-divider pt-3">
            <li className="flex gap-2 text-xs">
              <span className="size-[6px] bg-gray-900 rounded-sm mt-1.5 shrink-0" />
              <span>
                <span className="font-semibold">Skills.dev (not released)</span>{" "}
                <span className="text-muted-foreground">
                  — a skill system letting agents learn by sharing
                  auto-optimizing, auto-repairing software snippets (before
                  Claude&apos;s Agent Skills).
                </span>
              </span>
            </li>
            <li className="flex gap-2 text-xs">
              <span className="size-[6px] bg-gray-900 rounded-sm mt-1.5 shrink-0" />
              <span>
                <ExtLink
                  href="https://keychains.dev"
                  label="Keychains.dev (deprecated)"
                />{" "}
                <span className="text-muted-foreground">
                  — credentials management letting agents contact any API in the
                  world, fully audited, without ever touching the user&apos;s
                  credentials.
                </span>
              </span>
            </li>
            <li className="flex gap-2 text-xs">
              <span className="size-[6px] bg-gray-900 rounded-sm mt-1.5 shrink-0" />
              <span>
                <ExtLink href="https://botparty.club" label="Botparty.club" />{" "}
                <span className="text-muted-foreground">
                  — agents forming teams to build entire companies from the ground
                  up: the perfect test field for removing humans from the loop
                  entirely.
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ============ SELECTED OPEN SOURCE & FUN PROJECTS ============ */}
      <h2 className="font-bold tracking-[-0.01em] mt-16 mb-2">
        Selected open source &amp; fun projects
      </h2>
      <div className="border-t border-divider">
        {OSS.map((p) => (
          <div
            key={p.name}
            className="flex items-baseline justify-between gap-4 py-3 border-b border-divider"
          >
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-0 hover:text-foreground transition-colors"
              >
                <span className="font-semibold">{p.name}</span>
                <span className="text-muted-foreground"> — {p.desc}</span>
              </a>
            ) : (
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{p.name}</span>
                <span className="text-muted-foreground"> — {p.desc}</span>
              </div>
            )}
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground shrink-0"
              >
                GitHub ↗
              </a>
            ) : (
              <span className="text-xs text-muted-foreground shrink-0">(soon)</span>
            )}
          </div>
        ))}
      </div>

      {/* ============ IN A PREVIOUS LIFE ============ */}
      <h2 className="font-bold tracking-[-0.01em] mt-16 mb-2">
        In a previous life
      </h2>
      <div
        className="relative flex flex-col space-y-4 border-l border-gray-300 py-4 ml-4 mt-6
          before:h-6 before:w-px before:bg-gradient-to-t before:from-transparent before:to-background before:absolute before:-left-px before:top-0
          after:h-6 after:w-px after:bg-gradient-to-b after:from-transparent after:to-background after:absolute after:-left-px after:bottom-0"
      >
        <Link
          href="/projects/lima"
          className="relative flex flex-col gap-2 px-3 py-2 ml-6 group cursor-pointer bg-white border border-black shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background" />
          <div className="flex items-baseline gap-1.5 justify-between">
            <div className="text-sm truncate font-semibold leading-5">
              Lima — notes on building a personal cloud
            </div>
            <div className="text-xs text-muted-foreground shrink-0 ml-1">
              2011 — 2019
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            A company I founded to redesign file storage from first principles.
            6th biggest Kickstarter tech campaign of 2013. Gone now — this is the
            recollection.
          </p>
        </Link>

        <div className="relative flex flex-col gap-1 px-3 py-2 ml-6">
          <div className="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background" />
          <div className="flex items-baseline gap-1.5 justify-between">
            <div className="text-xs font-semibold leading-5">
              Marketing &amp; product mentoring — ESCP Europe
            </div>
            <div className="text-xs text-muted-foreground shrink-0 ml-1">
              Paris
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Mentoring at the ESCP Europe business school in Paris.
          </p>
        </div>

        <div className="relative flex flex-col gap-1 px-3 py-2 ml-6">
          <div className="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background" />
          <div className="flex items-baseline gap-1.5 justify-between">
            <div className="text-xs font-semibold leading-5">
              Seafront — 0-to-1 product &amp; tech consultancy
            </div>
            <div className="text-xs text-muted-foreground shrink-0 ml-1">
              2019 — 2022
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Building startup products from 0-to-1, with clients as small as Adok
            and as big as Intuit.
          </p>
        </div>
      </div>

      {/* ============ LET'S TALK ============ */}
      <h2 className="font-bold tracking-[-0.01em] mt-16 mb-4">Let&apos;s talk!</h2>
      <div className="flex flex-wrap gap-3">
        {[
          { href: "https://github.com/smarcombes", label: "GitHub" },
          { href: "https://x.com/severin__", label: "𝕏" },
          { href: "https://linkedin.com/in/marcombes", label: "LinkedIn" },
        ].map((b) => (
          <a
            key={b.label}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium px-3 py-1.5 bg-button text-button-foreground border border-button-foreground shadow-btn relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground after:pointer-events-none hover:bg-button-hover hover:text-black active:shadow-none active:translate-y-0.5 transition-colors"
          >
            {b.label}
          </a>
        ))}
      </div>
    </Shell>
  );
}
