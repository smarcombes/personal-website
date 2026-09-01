/**
 * Full build: render pages, compile Tailwind, then sanity-check dist/.
 *
 * Order matters — Tailwind scans the rendered HTML in dist/, so pages have to
 * exist before styles.css is compiled from them.
 *
 * dist/ is committed, so deploying never *requires* this — run it after
 * editing anything under src/.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const run = (label, args) => {
  console.log(`→ ${label}`);
  const res = spawnSync("npm", ["run", ...args], { cwd: ROOT, stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
};

run("rendering pages", ["render"]);
run("compiling styles.css", ["build:css"]);
run("checking dist/", ["check"]);
