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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = path.join(ROOT, "src/pages");
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

console.log(`✓ rendered ${written.length} page(s)`);
for (const w of written) console.log(`  ${w}`);
