/**
 * Sanity-check dist/ before deploying.
 *
 * The site is hand-written HTML with root-absolute paths, so the two ways it
 * breaks in practice are (a) a link or asset pointing at a file that isn't
 * there, and (b) a committed styles.css that no longer matches the markup.
 * This catches both without a framework.
 */
import { readdir, readFile, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

/** Every .html file under dist/, recursively. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Resolve a root-absolute href to a file on disk, allowing /foo/ -> /foo/index.html. */
function resolveLocal(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return null; // external, mailto:, relative — skip
  const candidates = [path.join(DIST, clean)];
  if (clean.endsWith("/")) candidates.push(path.join(DIST, clean, "index.html"));
  else candidates.push(path.join(DIST, `${clean}.html`), path.join(DIST, clean, "index.html"));
  return candidates.find((c) => existsSync(c)) ?? null;
}

const problems = [];
const pages = await htmlFiles(DIST);

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const rel = path.relative(ROOT, page);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!ref.startsWith("/")) continue; // only root-absolute refs are ours
    if (!resolveLocal(ref)) problems.push(`${rel}: dead reference -> ${ref}`);
  }
}

// Is the committed styles.css what Tailwind would produce right now?
// Compare content, not mtimes: Tailwind skips rewriting unchanged output, and
// `mv`/`git checkout` preserve timestamps, so mtimes lie in both directions.
const cssPath = path.join(DIST, "styles.css");
if (!existsSync(cssPath)) {
  problems.push("dist/styles.css is missing — run `npm run build:css`");
} else {
  const tmp = await mkdtemp(path.join(tmpdir(), "sm-css-"));
  const probe = path.join(tmp, "styles.css");
  const res = spawnSync(
    "npx",
    ["tailwindcss", "-i", "./src/input.css", "-o", probe, "--minify"],
    { cwd: ROOT, stdio: "pipe" },
  );
  if (res.status !== 0) {
    problems.push(`could not verify styles.css — tailwindcss failed:\n${res.stderr}`);
  } else if ((await readFile(probe, "utf8")) !== (await readFile(cssPath, "utf8"))) {
    problems.push("dist/styles.css is out of date — run `npm run build:css`");
  }
  await rm(tmp, { recursive: true, force: true });
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) in dist/:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ dist/ looks good (${pages.length} page(s) checked)`);
