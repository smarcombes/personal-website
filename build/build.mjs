/**
 * Full build: compile Tailwind, then sanity-check dist/.
 *
 * dist/styles.css is committed, so deploying never *requires* this — run it
 * after editing src/input.css or any page markup.
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

run("compiling styles.css", ["build:css"]);
run("checking dist/", ["check"]);
