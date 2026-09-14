/**
 * Renders the /press/ carousel from press/articles.csv at build time. The
 * page itself (src/pages/press.html) is static — the dropdown, the legend,
 * the click-to-translate script — only the year rows of cards come from
 * here, dropped into a {{press}} placeholder the same way {{writing}} works.
 */
import { readFile } from "node:fs/promises";

/** Minimal RFC4180 parser: quoted fields, embedded commas/quotes/newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") continue;
    else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function rowsToObjects(rows) {
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2016-03-05" -> "5 Mar 2016"; "2016-03" -> "Mar 2016"; "2016" -> "2016". */
function formatDate(d) {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(d);
  if (!m) return d;
  const [, y, mo, day] = m;
  if (day) return `${parseInt(day, 10)} ${MONTHS[parseInt(mo, 10) - 1]} ${y}`;
  if (mo) return `${MONTHS[parseInt(mo, 10) - 1]} ${y}`;
  return y;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

function card(a) {
  const clickable = a.type === "online" && a.url;
  const icon = a.type === "online" ? "🌐" : "🗞️";
  const unverified =
    a.confidence === "mentioned"
      ? `<span class="inline-block font-mono text-[8px] uppercase tracking-[0.1em] border border-dashed border-divider text-muted-foreground px-1 py-0.5 mt-1.5">unverified</span>`
      : "";
  const body = `
              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <span class="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground truncate">${icon} ${esc(a.publication)}</span>
                <span class="font-mono text-[9px] text-muted-foreground shrink-0">${esc(formatDate(a.date))}</span>
              </div>
              <p class="text-xs font-semibold leading-snug line-clamp-4">${esc(a.title)}</p>
              ${unverified}`;
  if (clickable) {
    return `<a
              href="${attr(a.url)}"
              target="_blank"
              rel="noreferrer"
              data-lang="${attr(a.language)}"
              class="press-card shrink-0 w-56 snap-start bg-white border border-black shadow-card hover:shadow-card-hover transition-all p-3 flex flex-col"
            >${body}
            </a>`;
  }
  return `<div
              class="press-card--static shrink-0 w-56 snap-start bg-muted/40 border border-divider p-3 flex flex-col"
            >${body}
            </div>`;
}

const I = " ".repeat(8);

export async function buildPressSection(csvPath) {
  const text = await readFile(csvPath, "utf8");
  const rows = rowsToObjects(parseCsv(text));
  const online = rows.filter((r) => r.type === "online").length;
  const print = rows.length - online;

  const byYear = new Map();
  for (const r of rows) {
    const y = r.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }
  const years = [...byYear.keys()].sort((a, b) => (a < b ? 1 : -1));

  const rowsHtml = years
    .map((y) => {
      const articles = byYear.get(y).sort((a, b) => (a.date < b.date ? 1 : -1));
      const id = `press-${y}`;
      const cards = articles.map(card).join("\n" + I + "  ");
      return (
        `${I}<div class="mb-8">\n` +
        `${I}  <div class="flex items-baseline justify-between mb-2">\n` +
        `${I}    <h3 class="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">\n` +
        `${I}      ${y} <span class="text-foreground">· ${articles.length}</span>\n` +
        `${I}    </h3>\n` +
        `${I}    <div class="flex gap-1.5">\n` +
        `${I}      <button type="button" class="press-nav font-mono text-xs w-6 h-6 border border-divider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors" data-target="${id}" data-dir="prev" aria-label="Scroll ${y} left">‹</button>\n` +
        `${I}      <button type="button" class="press-nav font-mono text-xs w-6 h-6 border border-divider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors" data-target="${id}" data-dir="next" aria-label="Scroll ${y} right">›</button>\n` +
        `${I}    </div>\n` +
        `${I}  </div>\n` +
        `${I}  <div id="${id}" class="press-row no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">\n` +
        `${I}    ${cards}\n` +
        `${I}  </div>\n` +
        `${I}</div>`
      );
    })
    .join("\n\n");

  const stats =
    `${I}<p class="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-8">\n` +
    `${I}  ${rows.length} mentions · ${online} online · ${print} print &amp; broadcast · ${years[years.length - 1]}–${years[0]}\n` +
    `${I}</p>\n\n`;

  return stats + rowsHtml + "\n";
}
