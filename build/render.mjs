/**
 * Render src/pages/**.html into dist/.
 *
 * Each page is a body fragment preceded by a JSON front-matter comment. The
 * shell — head, meta, header, footer — lives once in src/layout.html, so a new
 * page cannot drift on its canonical URL, its OG tags or its nav.
 *
 * Output is plain HTML with no runtime, exactly as before: dist/ stays
 * committed and deployable on its own.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { frontMatter, toHtml } from "./markdown.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = path.join(ROOT, "src/pages");
const ESSAYS = path.join(ROOT, "src/content/thoughts");
const DIST = path.join(ROOT, "dist");
const SITE = "https://severin-marcombes.com";

const FRONT_MATTER = /^<!--(\{[\s\S]*?\})-->\n/;

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

const layout = await readFile(path.join(ROOT, "src/layout.html"), "utf8");
const files = (await pageFiles(PAGES)).sort();
const written = [];

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const fm = raw.match(FRONT_MATTER);
  if (!fm) throw new Error(`${path.relative(ROOT, file)}: missing front matter`);

  const meta = JSON.parse(fm[1]);
  const content = raw.slice(fm[0].length).replace(/\s+$/, "");
  for (const key of ["title", "description", "path"]) {
    if (!meta[key]) throw new Error(`${path.relative(ROOT, file)}: missing "${key}"`);
  }

  // Article pages preload the body font too — they are the ones with enough
  // running prose for a late swap to be visible.
  const isArticle = (meta.ogType ?? "website") === "article";

  const html = layout
    .replace(/\{\{title\}\}/g, attr(meta.title))
    .replace(/\{\{description\}\}/g, attr(meta.description))
    .replace(/\{\{url\}\}/g, SITE + meta.path)
    .replace(/\{\{ogType\}\}/g, meta.ogType ?? "website")
    .replace(/\{\{twitterCard\}\}/g, meta.ogImage ? "summary_large_image" : "summary")
    .replace(
      /\{\{ogImage\}\}/g,
      meta.ogImage
        ? `    <meta\n      property="og:image"\n      content="${SITE}${attr(meta.ogImage)}"\n    />\n`
        : "",
    )
    .replace(
      /\{\{preloadBodyFont\}\}/g,
      isArticle
        ? `    <link\n      rel="preload"\n      href="/fonts/source-sans-3-normal.woff2"\n      as="font"\n      type="font/woff2"\n      crossorigin\n    />\n`
        : "",
    )
    .replace(/\{\{width\}\}/g, meta.width ?? (isArticle ? "max-w-2xl" : "max-w-xl"))
    .replace(/\{\{content\}\}/g, `\n${content}\n`);

  const out = path.join(DIST, meta.path, "index.html");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  written.push(path.relative(ROOT, out));
}

// ---------------------------------------------------------------- essays
// Written as Markdown because they are prose, not layout. Same shell, same
// article idiom as the project pages.
const I = " ".repeat(8);

const essays = [];
for (const name of (await readdir(ESSAYS)).filter((f) => f.endsWith(".md")).sort()) {
  const [meta, body] = frontMatter(await readFile(path.join(ESSAYS, name), "utf8"));
  essays.push({ ...meta, slug: meta.slug ?? name.replace(/\.md$/, ""), body });
}
// Newest first — the reader wants the current thinking, not the oldest.
essays.sort((a, b) => (a.date < b.date ? 1 : -1));

const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

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

  const html = layout
    .replace(/\{\{title\}\}/g, attr(`${essay.title} — Séverin Marcombes`))
    .replace(/\{\{description\}\}/g, attr(essay.description))
    .replace(/\{\{url\}\}/g, `${SITE}/thoughts/${essay.slug}/`)
    .replace(/\{\{ogType\}\}/g, "article")
    .replace(/\{\{twitterCard\}\}/g, "summary")
    .replace(/\{\{ogImage\}\}/g, "")
    .replace(
      /\{\{preloadBodyFont\}\}/g,
      `    <link\n      rel="preload"\n      href="/fonts/source-sans-3-normal.woff2"\n      as="font"\n      type="font/woff2"\n      crossorigin\n    />\n`,
    )
    .replace(/\{\{width\}\}/g, "max-w-2xl")
    .replace(/\{\{content\}\}/g, `\n${article}\n`);

  const out = path.join(DIST, "thoughts", essay.slug, "index.html");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  written.push(path.relative(ROOT, out));
}

// The index over them.
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

const indexArticle =
  `${I}<a\n${I}  href="/"\n` +
  `${I}  class="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground"\n` +
  `${I}>\n${I}  ← Home\n${I}</a>\n\n` +
  `${I}<h1 class="font-serif text-[2.5rem] leading-[1.1] tracking-[-0.02em] mt-10 mb-4">\n${I}  Writing\n${I}</h1>\n` +
  `${I}<p class="text-muted-foreground mb-10 max-w-lg">\n` +
  `${I}  Notes on where I think AI tooling is going, written between 2025 and\n` +
  `${I}  2026. Most of what I am building now started as one of these.\n${I}</p>\n\n` +
  `${I}<div class="border-t border-divider">\n${rows}\n${I}</div>`;

await writeFile(
  path.join(DIST, "thoughts", "index.html"),
  layout
    .replace(/\{\{title\}\}/g, "Writing — Séverin Marcombes")
    .replace(/\{\{description\}\}/g, `${essays.length} notes on agents, tooling and the infrastructure AI actually needs.`)
    .replace(/\{\{url\}\}/g, `${SITE}/thoughts/`)
    .replace(/\{\{ogType\}\}/g, "website")
    .replace(/\{\{twitterCard\}\}/g, "summary")
    .replace(/\{\{ogImage\}\}/g, "")
    .replace(/\{\{preloadBodyFont\}\}/g, "")
    .replace(/\{\{width\}\}/g, "max-w-xl")
    .replace(/\{\{content\}\}/g, `\n${indexArticle}\n`),
);
written.push("dist/thoughts/index.html");

console.log(`✓ rendered ${written.length} page(s)`);
