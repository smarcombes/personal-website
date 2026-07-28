/**
 * Single source of truth for site-wide config and the project manifest.
 *
 * To bring the Thoughts section back, flip SHOW_THOUGHTS to true. The nav links
 * (header + footer) reappear immediately; add the /thoughts route to complete it.
 */
export const SHOW_THOUGHTS = false;

export type NavKey = "home" | "projects" | "thoughts";

export const NAV: { href: string; label: string; key: NavKey }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/thoughts", label: "Thoughts", key: "thoughts" },
  { href: "/projects", label: "Projects", key: "projects" },
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
  },
  "skills-dev": {
    slug: "skills-dev",
    emoji: "🧰",
    title: "skills.dev",
    tagline:
      "An app store for agent capabilities. Agents search a registry of TypeScript skills, execute them, or auto-generate new ones on the fly.",
  },
  "keychains-dev": {
    slug: "keychains-dev",
    emoji: "🔑",
    title: "keychains.dev",
    tagline:
      "One proxy that handles all API authentication for agents. Agents call APIs without ever seeing credentials.",
  },
  botparty: {
    slug: "botparty",
    emoji: "🎉",
    title: "BotParty",
    tagline:
      "A framework for companies run entirely by AI — agent employees managed by an agent CEO.",
  },
  "layouts-dev": {
    slug: "layouts-dev",
    emoji: "📐",
    title: "layouts.dev",
    tagline:
      "A visual coding tool for designers. Custom DSL, cross-platform web + React Native, AI backend.",
  },
  protean: {
    slug: "protean",
    emoji: "🦠",
    title: "protean",
    tagline: "A self-evolving AI agent with no artificial limits except budget.",
    github: "https://github.com/smarcombes/protean",
  },
  "ux-morph": {
    slug: "ux-morph",
    emoji: "🌊",
    title: "ux-morph",
    tagline:
      "Apps whose UI rewrites itself per-user. Chat → AI edits → hot-swap → permanent.",
    github: "https://github.com/smarcombes/ux-morph",
  },
  "ollama-pool": {
    slug: "ollama-pool",
    emoji: "🦙",
    title: "ollama-pool",
    tagline:
      "Distribute LLM inference across your machines. One OpenAI-compatible endpoint, any model, all your hardware.",
    github: "https://github.com/smarcombes/ollama-pool",
  },
  "tailwind-motion-native": {
    slug: "tailwind-motion-native",
    emoji: "🎨",
    title: "tailwind-motion-native",
    tagline:
      "Tailwind Motion animation utilities ported to React Native via Moti.",
    github: "https://github.com/smarcombes/tailwind-motion-native",
  },
  streambin: {
    slug: "streambin",
    emoji: "📡",
    title: "streambin",
    tagline:
      "E2E-encrypted streams, docs, and files for agents and humans. Zero-knowledge relay.",
    github: "https://github.com/smarcombes/streambin",
  },
  "github-filesystem": {
    slug: "github-filesystem",
    emoji: "🗂️",
    title: "github-filesystem",
    tagline: "GitHub repos as a Node.js fs. writeFile commits to Git.",
    github: "https://github.com/smarcombes/github-filesystem",
  },
  "react-electron": {
    slug: "react-electron",
    emoji: "⚛️",
    title: "react-electron",
    tagline: "Multi-window Electron apps from a single React component tree.",
    github: "https://github.com/smarcombes/react-electron",
  },
  lima: {
    slug: "lima",
    emoji: "☁️",
    title: "Lima Technology",
    tagline:
      "Personal cloud before Dropbox won. P2P distributed filesystem, custom Linux firmware, FUSE kernel extension.",
  },
  seafront: {
    slug: "seafront",
    emoji: "⛵",
    title: "SeaFront",
    tagline:
      "Product and dev agency. 0-to-1 MVPs for startups — business model through shipped code.",
  },
};
