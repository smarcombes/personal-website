/**
 * Render src/pages/**.html and src/content/thoughts/*.md into dist/.
 *
 * Each page is a body fragment preceded by a JSON front-matter comment. The
 * shell — head, meta, header, footer — lives once in src/layout.html, so a new
 * page cannot drift on its canonical URL, its OG tags or its nav.
 *
 * Essays are Markdown because they are prose, not layout. They are optional:
 * with none present, no essay pages, no /thoughts/ index and no Writing section
 * on the home page are emitted at all. That is the current state — the drafts
 * are being reworked in the writing-review tool and come back one at a time.
 *
 * Output is plain HTML with no runtime: dist/ stays committed and deployable
 * on its own.
 */
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { frontMatter, toHtml } from "./markdown.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = path.join(ROOT, "src/pages");
const ESSAYS = path.join(ROOT, "src/content/thoughts");
const DIST = path.join(ROOT, "dist");
const SITE = "https://severin-marcombes.com";

const FRONT_MATTER = /^<!--(\{[\s\S]*?\})-->\n/;
const I = " ".repeat(8);

/** Directories under dist/ that hold hand-managed assets, never generated pages. */
const NEVER_PRUNE = new Set(["media", "fonts", ".vercel"]);

async function pageFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await pageFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** HTML-escape a value destined for an attribute. */
const attr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

/** Fill the shell. `over` supplies the per-page values. */
const render = (layout, over) =>
  layout
    .replace(/\{\{title\}\}/g, attr(over.title))
    .replace(/\{\{description\}\}/g, attr(over.description))
    .replace(/\{\{url\}\}/g, SITE + over.path)
    .replace(/\{\{ogType\}\}/g, over.ogType ?? "website")
    .replace(/\{\{twitterCard\}\}/g, over.ogImage ? "summary_large_image" : "summary")
    .replace(
      /\{\{ogImage\}\}/g,
      over.ogImage
        ? `    <meta\n      property="og:image"\n      content="${SITE}${attr(over.ogImage)}"\n    />\n`
        : "",
    )
    .replace(
      /\{\{preloadBodyFont\}\}/g,
      over.preloadBodyFont
        ? `    <link\n      rel="preload"\n      href="/fonts/source-sans-3-normal.woff2"\n      as="font"\n      type="font/woff2"\n      crossorigin\n    />\n`
        : "",
    )
    .replace(/\{\{width\}\}/g, over.width)
    .replace(/\{\{content\}\}/g, `\n${over.content}\n`);

const layout = await readFile(path.join(ROOT, "src/layout.html"), "utf8");
const written = new Set();

const emit = async (relDir, html) => {
  const out = path.join(DIST, relDir, "index.html");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  written.add(out);
};

// ---------------------------------------------------------------- essays
// Loaded before the pages, because the home page's Writing section is built
// from them and has to be empty when there are none.
const essays = [];
for (const name of (await readdir(ESSAYS)).filter((f) => f.endsWith(".md")).sort()) {
  const [meta, body] = frontMatter(await readFile(path.join(ESSAYS, name), "utf8"));
  essays.push({ ...meta, slug: meta.slug ?? name.replace(/\.md$/, ""), body });
}
// Newest first — the reader wants the current thinking, not the oldest.
essays.sort((a, b) => (a.date < b.date ? 1 : -1));

/** The home page's Writing section — nothing at all when there are no essays. */
function writingSection() {
  if (!essays.length) return "";
  const featured = essays.slice(0, 4);
  const rows = featured
    .map(
      (e) =>
        `${I}  <a\n${I}    href="/thoughts/${e.slug}/"\n` +
        `${I}    class="flex items-baseline justify-between gap-4 py-3 border-b border-divider group"\n${I}  >\n` +
        `${I}    <span class="flex-1 min-w-0">\n` +
        `${I}      <span class="font-semibold underline underline-offset-4 decoration-foreground/20 group-hover:decoration-foreground">${attr(e.title)}</span>\n` +
        `${I}      <span class="text-muted-foreground"> — ${attr(e.description)}</span>\n` +
        `${I}    </span>\n` +
        `${I}    <span class="text-xs text-muted-foreground shrink-0">${e.date.slice(0, 4)}</span>\n` +
        `${I}  </a>`,
    )
    .join("\n");

  const more =
    essays.length > featured.length
      ? `\n${I}<p class="text-xs text-muted-foreground mt-4">\n` +
        `${I}  <a\n${I}    href="/thoughts/"\n` +
        `${I}    class="underline underline-offset-2 decoration-foreground/20 hover:decoration-foreground text-foreground"\n` +
        `${I}    >All ${essays.length} notes&nbsp;→</a\n${I}  >\n${I}</p>\n`
      : "\n";

  return (
    `${I}<!-- ============ WRITING ============ -->\n` +
    `${I}<h2 class="font-bold tracking-[-0.01em] mt-16 mb-2">Writing</h2>\n` +
    `${I}<p class="text-xs text-muted-foreground mb-4">\n` +
    `${I}  Where I think AI tooling is going.\n${I}</p>\n` +
    `${I}<div class="border-t border-divider">\n${rows}\n${I}</div>\n${more}`
  );
}

const writing = writingSection();

// ----------------------------------------------------------------- pages
for (const file of (await pageFiles(PAGES)).sort()) {
  const raw = await readFile(file, "utf8");
  const fm = raw.match(FRONT_MATTER);
  if (!fm) throw new Error(`${path.relative(ROOT, file)}: missing front matter`);

  const meta = JSON.parse(fm[1]);
  for (const key of ["title", "description", "path"]) {
    if (!meta[key]) throw new Error(`${path.relative(ROOT, file)}: missing "${key}"`);
  }

  // Article pages preload the body font too — they are the ones with enough
  // running prose for a late swap to be visible.
  const isArticle = (meta.ogType ?? "website") === "article";
  const content = raw
    .slice(fm[0].length)
    .replace(/^[ \t]*\{\{writing\}\}[ \t]*\n/m, writing)
    .replace(/\s+$/, "");

  await emit(meta.path, render(layout, {
    ...meta,
    preloadBodyFont: isArticle,
    width: meta.width ?? (isArticle ? "max-w-2xl" : "max-w-xl"),
    content,
  }));
}

// ----------------------------------------------------- essay pages + index
for (const essay of essays) {
  const article =
    `${I}<article>\n` +
    `${I}  <a\n${I}    href="/thoughts/"\n` +
    `${I}    class="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground"\n` +
    `${I}  >\n${I}    ← Writing\n${I}  </a>\n\n` +
    `${I}  <header class="mt-10">\n` +
    `${I}    <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">\n` +
    `${I}      ${longDate(essay.date)}\n${I}    </p>\n` +
    `${I}    <h1\n${I}      class="font-serif text-[2.75rem] md:text-[3.75rem] leading-[1.05] tracking-[-0.02em] text-balance"\n` +
    `${I}    >\n${I}      ${attr(essay.title)}\n${I}    </h1>\n` +
    `${I}    <p class="font-mono text-xs text-muted-foreground border-y border-divider py-3 mt-8 mb-12 tracking-wide">\n` +
    `${I}      By Séverin Marcombes\n${I}    </p>\n` +
    `${I}  </header>\n\n` +
    `${I}  <div class="font-sans">\n${toHtml(essay.body)}\n` +
    `${I}    <footer class="mt-16 pt-8 border-t border-foreground">\n` +
    `${I}      <p class="font-mono text-xs text-muted-foreground leading-relaxed">\n` +
    `${I}        <a href="/thoughts/" class="text-link underline hover:decoration-2">All writing</a>\n` +
    `${I}        ·\n` +
    `${I}        <a href="/" class="text-link underline hover:decoration-2">Home</a>\n` +
    `${I}      </p>\n${I}    </footer>\n${I}  </div>\n${I}</article>`;

  await emit(`/thoughts/${essay.slug}/`, render(layout, {
    title: `${essay.title} — Séverin Marcombes`,
    description: essay.description,
    path: `/thoughts/${essay.slug}/`,
    ogType: "article",
    preloadBodyFont: true,
    width: "max-w-2xl",
    content: article,
  }));
}

if (essays.length) {
  const rows = essays
    .map(
      (e) =>
        `${I}  <a\n${I}    href="/thoughts/${e.slug}/"\n` +
        `${I}    class="block py-4 border-b border-divider group"\n${I}  >\n` +
        `${I}    <div class="flex items-baseline justify-between gap-4">\n` +
        `${I}      <span class="font-semibold underline underline-offset-4 decoration-foreground/20 group-hover:decoration-foreground">${attr(e.title)}</span>\n` +
        `${I}      <span class="text-xs text-muted-foreground shrink-0">${e.date}</span>\n` +
        `${I}    </div>\n` +
        `${I}    <p class="text-xs text-muted-foreground mt-1.5">${attr(e.description)}</p>\n` +
        `${I}  </a>`,
    )
    .join("\n");

  await emit("/thoughts/", render(layout, {
    title: "Writing — Séverin Marcombes",
    description: `${essays.length} notes on agents, tooling and the infrastructure AI actually needs.`,
    path: "/thoughts/",
    width: "max-w-xl",
    content:
      `${I}<a\n${I}  href="/"\n` +
      `${I}  class="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground"\n` +
      `${I}>\n${I}  ← Home\n${I}</a>\n\n` +
      `${I}<h1 class="font-serif text-[2.5rem] leading-[1.1] tracking-[-0.02em] mt-10 mb-4">\n${I}  Writing\n${I}</h1>\n` +
      `${I}<p class="text-muted-foreground mb-10 max-w-lg">\n` +
      `${I}  Where I think AI tooling is going.\n${I}</p>\n\n` +
      `${I}<div class="border-t border-divider">\n${rows}\n${I}</div>`,
  }));
}

// ----------------------------------------------------------------- prune
// dist/ is a build output, so a page deleted from src/ must disappear from it
// rather than linger. A directory is prunable only if it *directly* holds an
// index.html this run did not write; anything in NEVER_PRUNE is left alone, so
// fonts, favicons and article media are safe.
const pruned = [];
async function prune(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const index = path.join(dir, "index.html");

  if (entries.some((e) => e.isFile() && e.name === "index.html") && !written.has(index)) {
    await rm(dir, { recursive: true, force: true });
    pruned.push(path.relative(ROOT, dir));
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory() && !NEVER_PRUNE.has(entry.name)) {
      await prune(path.join(dir, entry.name));
    }
  }
}
await prune(DIST);

console.log(`✓ rendered ${written.size} page(s)`);
if (pruned.length) {
  console.log(`✓ pruned ${pruned.length} stale director(y/ies):`);
  for (const p of pruned) console.log(`  ${p}`);
}
