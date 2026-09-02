/**
 * Mirror assets/ into dist/.
 *
 * Fonts, favicons and article images are hand-managed source files, not build
 * output. They used to live in dist/ directly, where nothing could restore
 * them: one stray deletion and the site shipped with dead references that
 * `check` could only report, never fix. Keeping them in assets/ and copying on
 * every build means dist/ heals itself.
 *
 * assets/ mirrors the deployed layout exactly — assets/fonts/x.woff2 is served
 * at /fonts/x.woff2 — so there is no path mapping to keep in sync.
 */
import { readdir, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "assets");
const DIST = path.join(ROOT, "dist");

if (!existsSync(ASSETS)) {
  console.error("✗ assets/ is missing — the fonts, favicons and article images live there");
  process.exit(1);
}

let copied = 0;

/** Copy a tree, skipping dotfiles so a stray .DS_Store never reaches the site. */
async function mirror(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) await mirror(src, dest);
    else {
      await copyFile(src, dest);
      copied += 1;
    }
  }
}

await mirror(ASSETS, DIST);
console.log(`✓ copied ${copied} asset(s)`);
