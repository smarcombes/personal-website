import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badges } from "@/components/content";

export function ProjectPage({
  emoji,
  title,
  tagline,
  badges,
  children,
}: {
  emoji: string;
  title: string;
  tagline: React.ReactNode;
  badges: string[];
  children: React.ReactNode;
}) {
  return (
    <Shell active="projects" maxWidth="max-w-2xl">
      <article>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif leading-[1.1] text-balance mb-3 mt-6">
          {emoji} {title}
        </h1>
        {tagline && (
          <p className="text-lg text-muted-foreground text-pretty">{tagline}</p>
        )}
        <Badges items={badges} />
        <div className="font-sans text-lg leading-relaxed">{children}</div>
      </article>

      <div className="mt-16">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium px-3 py-1.5 bg-button text-button-foreground border border-button-foreground shadow-btn relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground after:pointer-events-none hover:bg-button-hover hover:text-black active:shadow-none active:translate-y-0.5 transition-colors font-mono"
        >
          ← All projects
        </Link>
      </div>
    </Shell>
  );
}
