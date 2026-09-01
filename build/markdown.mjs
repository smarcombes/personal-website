/**
 * The tiny slice of Markdown these essays actually use: ## headings,
 * paragraphs, - and 1. lists, **bold** and *italic*. No links, no code
 * fences, no HTML passthrough — verified against every file in
 * src/content/thoughts before this was written.
 *
 * Everything is escaped first, so a stray < or & in an essay cannot inject
 * markup into the page.
 */
const P = "mb-7 text-[1.125rem] leading-[1.75]";
const PDROP =
  P +
  " first-letter:float-left first-letter:font-serif first-letter:text-[4.25rem]" +
  " first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:font-medium";
const H2 = "font-serif text-[1.75rem] md:text-[2rem] leading-tight mt-20 mb-6 text-balance";
const UL = "list-none space-y-3 mb-8 border-t border-divider pt-5";
const LI = "flex gap-3 text-[1.0625rem] leading-[1.7]";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Bold before italic, so **x** is not eaten by the single-asterisk rule. */
const inline = (s) =>
  escape(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

/** Split "---\nkey: value\n---\nbody" into [meta, body]. */
export function frontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error("missing front matter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return [meta, raw.slice(m[0].length)];
}

export function toHtml(body, indent = " " * 0) {
  const I = " ".repeat(12);
  const out = [];
  let list = null;
  let firstPara = true;

  const flushList = () => {
    if (!list) return;
    const items = list
      .map(
        (it) =>
          `${I}  <li class="${LI}">\n${I}    <span class="shrink-0">→</span>\n` +
          `${I}    <span>${inline(it)}</span>\n${I}  </li>`,
      )
      .join("\n");
    out.push(`${I}<ul class="${UL}">\n${items}\n${I}</ul>`);
    list = null;
  };

  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const li = line.match(/^(?:[-*]|\d+\.)\s+(.*)$/);
    if (li) {
      (list ??= []).push(li[1]);
      continue;
    }
    flushList();
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      out.push(`${I}<h2\n${I}  class="${H2}"\n${I}>\n${I}  ${inline(h[2])}\n${I}</h2>`);
      continue;
    }
    const cls = firstPara ? PDROP : P;
    firstPara = false;
    out.push(`${I}<p\n${I}  class="${cls}"\n${I}>\n${I}  ${inline(line)}\n${I}</p>`);
  }
  flushList();
  return out.join("\n");
}
