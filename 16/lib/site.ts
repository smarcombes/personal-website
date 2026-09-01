/**
 * Single source of truth for site-wide config and the project manifest.
 *
 * Flip SHOW_THOUGHTS to true to bring the Thoughts nav link back.
 * /projects redirects home; /projects/lima is the only project page kept live.
 */
export const SHOW_THOUGHTS = false;

export type NavKey = "home" | "projects" | "thoughts";

export const NAV: { href: string; label: string; key: NavKey }[] = [
  { href: "/thoughts", label: "Thoughts", key: "thoughts" },
];

export type ProjectGroup =
  | "Recent work"
  | "Open source & fun projects"
  | "In a previous life";

export interface ProjectMeta {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
  /** Primary link for the simplified site: domain, GitHub, or internal page. */
  href?: string;
  github?: string;
}

/**
 * Ordered per group. This drives /projects. Detail pages live in
 * app/projects/<slug>/page.tsx and are authored by hand as React.
 */
export const PROJECT_GROUPS: { name: ProjectGroup; slugs: string[] }[] = [
  {
    name: "Recent work",
    slugs: ["interagentic", "skills-dev", "keychains-dev", "botparty", "layouts-dev"],
  },
  {
    name: "Open source & fun projects",
    slugs: [
      "protean",
      "ux-morph",
      "ollama-pool",
      "tailwind-motion-native",
      "streambin",
      "github-filesystem",
      "react-electron",
    ],
  },
  { name: "In a previous life", slugs: ["lima", "seafront"] },
];

export const PROJECTS: Record<string, ProjectMeta> = {
  interagentic: {
    slug: "interagentic",
    emoji: "🌐",
    title: "Interagentic",
    tagline:
      "AWS for agents — deploy, domains, payments, databases. All programmatic. No dashboards.",
    href: "https://interagentic.inc",
  },
  "skills-dev": {
    slug: "skills-dev",
    emoji: "🧰",
    title: "skills.dev (not released)",
    tagline:
      "An app store for agent capabilities. Agents search a registry of TypeScript skills, execute them, or auto-generate new ones on the fly.",
  },
  "keychains-dev": {
    slug: "keychains-dev",
    emoji: "🔑",
    title: "keychains.dev (deprecated)",
    tagline:
      "One proxy that handles all API authentication for agents. Agents call APIs without ever seeing credentials.",
    href: "https://keychains.dev",
  },
  botparty: {
    slug: "botparty",
    emoji: "🎉",
    title: "BotParty",
    tagline:
      "A framework for companies run entirely by AI — agent employees managed by an agent CEO.",
    href: "https://botparty.club",
  },
  "layouts-dev": {
    slug: "layouts-dev",
    emoji: "📐",
    title: "layouts.dev",
    tagline:
      "A visual coding tool for designers. Custom DSL, cross-platform web + React Native, AI backend.",
    href: "https://layouts.dev",
  },
  protean: {
    slug: "protean",
    emoji: "🦠",
    title: "protean",
    tagline: "A self-evolving AI agent with no artificial limits except budget.",
    href: "https://github.com/smarcombes/protean",
    github: "https://github.com/smarcombes/protean",
  },
  "ux-morph": {
    slug: "ux-morph",
    emoji: "🌊",
    title: "ux-morph (soon)",
    tagline:
      "Apps whose UI rewrites itself per-user. Chat → AI edits → hot-swap → permanent.",
  },
  "ollama-pool": {
    slug: "ollama-pool",
    emoji: "🦙",
    title: "ollama-pool (soon)",
    tagline:
      "Distribute LLM inference across your machines. One OpenAI-compatible endpoint, any model, all your hardware.",
  },
  "tailwind-motion-native": {
    slug: "tailwind-motion-native",
    emoji: "🎨",
    title: "tailwind-motion-native",
    tagline:
      "Tailwind Motion animation utilities ported to React Native via Moti.",
    href: "https://github.com/smarcombes/tailwind-motion-native",
    github: "https://github.com/smarcombes/tailwind-motion-native",
  },
  streambin: {
    slug: "streambin",
    emoji: "📡",
    title: "streambin",
    tagline:
      "E2E-encrypted streams, docs, and files for agents and humans. Zero-knowledge relay.",
    href: "https://github.com/smarcombes/streambin",
    github: "https://github.com/smarcombes/streambin",
  },
  "github-filesystem": {
    slug: "github-filesystem",
    emoji: "🗂️",
    title: "github-filesystem",
    tagline: "GitHub repos as a Node.js fs. writeFile commits to Git.",
    href: "https://github.com/smarcombes/github-filesystem",
    github: "https://github.com/smarcombes/github-filesystem",
  },
  "react-electron": {
    slug: "react-electron",
    emoji: "⚛️",
    title: "react-electron",
    tagline: "Multi-window Electron apps from a single React component tree.",
    href: "https://github.com/smarcombes/react-electron",
    github: "https://github.com/smarcombes/react-electron",
  },
  lima: {
    slug: "lima",
    emoji: "☁️",
    title: "Lima Technology",
    tagline: "Notes on building a personal cloud — 2011–2019.",
    href: "/projects/lima",
  },
  seafront: {
    slug: "seafront",
    emoji: "⛵",
    title: "SeaFront",
    tagline:
      "Product and dev agency. 0-to-1 MVPs for startups — business model through shipped code.",
  },
};
