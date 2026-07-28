import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { PROJECT_GROUPS, PROJECTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects — Séverin Marcombes",
  description:
    "Projects by Séverin Marcombes — agent infrastructure, self-evolving software, and fifteen years of shipped products.",
};

export default function ProjectsIndex() {
  return (
    <Shell active="projects">
      <h1 className="text-5xl md:text-6xl font-serif leading-tight mt-12 mb-6">
        Projects
      </h1>
      <p className="mt-8 mb-8 text-muted-foreground text-pretty">
        Things I&apos;ve built — from a hardware personal cloud to infrastructure
        for AI agents. Each one has a write-up; I&apos;m iterating on them over
        time.
      </p>

      {PROJECT_GROUPS.map((group) => (
        <section key={group.name}>
          <h2 className="font-bold tracking-[-0.01em] mt-12 mb-2">
            {group.name}
          </h2>
          <div className="border-t border-divider">
            {group.slugs.map((slug) => {
              const p = PROJECTS[slug];
              return (
                <Link
                  key={slug}
                  href={`/projects/${slug}`}
                  className="flex flex-col gap-1 py-3 px-1 -mx-1 border-b border-divider hover:bg-background-hover transition-colors"
                >
                  <div className="font-semibold">
                    {p.emoji} {p.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </Shell>
  );
}
