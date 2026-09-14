/**
 * Renders the /press/ page from press/articles.csv at build time. Only rows
 * with hidden !== "true" are shown — articles.csv keeps the full archive,
 * this is the curated subset. Grouped by publication, ordered by pub_rank
 * (lower = shown first); each section is headed by a clickable logo chip
 * (an in-page anchor, no JS needed) that the top logo strip also links to.
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

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Domain used for the favicon-as-logo lookup, keyed by publication name. */
const PUB_DOMAIN = {
  "MIT Technology Review (Innovators Under 35)": "technologyreview.com",
  TechCrunch: "techcrunch.com",
  Forbes: "forbes.com",
  "The Economist": "economist.com",
  "Business Insider France": "businessinsider.fr",
  "Crowdfund Insider": "crowdfundinsider.com",
  "Les Echos": "lesechos.fr",
  "Le Figaro": "lefigaro.fr",
  "La Tribune": "latribune.fr",
  RTL: "rtl.fr",
  "20 Minutes": "20minutes.fr",
  Challenges: "challenges.fr",
  Maddyness: "maddyness.com",
  FrenchWeb: "frenchweb.fr",
  Clubic: "clubic.com",
  MacGeneration: "macg.co",
  "Next (ex-Next INpact)": "next.ink",
  "Rude Baguette": "rudebaguette.com",
  ZDNet: "zdnet.com",
  "J'aime les Startups": "jaimelesstartups.fr",
};

/** Approximate brand colour per publication, for the fallback thumbnail. */
const PUB_COLOR = {
  "MIT Technology Review (Innovators Under 35)": "#A31621",
  TechCrunch: "#0ABF53",
  Forbes: "#002868",
  "The Economist": "#E3120B",
  "Business Insider France": "#1877C9",
  "Crowdfund Insider": "#1B3A5C",
  "Les Echos": "#A6192E",
  "Le Figaro": "#003D7C",
  "La Tribune": "#C8102E",
  RTL: "#D50032",
  "20 Minutes": "#0057B8",
  Challenges: "#C8102E",
  Maddyness: "#111111",
  FrenchWeb: "#2D2E83",
  Clubic: "#FF6600",
  MacGeneration: "#0A84FF",
  "Next (ex-Next INpact)": "#6E44FF",
  "Rude Baguette": "#2B6CB0",
  ZDNet: "#C8161D",
  "J'aime les Startups": "#F5A623",
};

function logoUrl(publication, size = 64) {
  const domain = PUB_DOMAIN[publication];
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

function articleCard(a) {
  const dateLabel = esc(formatDate(a.date));
  // Both the image and its fallback are always in the markup; if the image
  // 404s (hotlinked og:images from decade-old articles do, sometimes),
  // onerror just swaps which one is visible — no embedded HTML in the
  // handler. The fallback is the publication's own logo on its brand
  // colour, not a generic grey box.
  const brandColor = PUB_COLOR[a.publication] || "#403e37";
  const bigLogo = logoUrl(a.publication, 128);
  const fallbackInner = bigLogo
    ? `<img src="${attr(bigLogo)}" alt="" class="w-10 h-10" loading="lazy" />`
    : `<span class="font-serif text-3xl text-white/80">${esc(a.publication.slice(0, 1))}</span>`;
  const image = `<div class="press-thumb overflow-hidden border-b border-black relative">
              ${
                a.image
                  ? `<img
                src="${attr(a.image)}"
                alt=""
                loading="lazy"
                class="w-full h-full object-cover"
                onerror="this.hidden=true;this.nextElementSibling.hidden=false"
              />`
                  : ""
              }
              <div class="absolute inset-0 flex items-center justify-center" style="background-color:${brandColor}"${a.image ? " hidden" : ""}>
                ${fallbackInner}
              </div>
            </div>`;
  return `<a
            href="${attr(a.link || a.url)}"
            target="_blank"
            rel="noreferrer"
            data-id="${attr(a.id)}"
            data-lang="${attr(a.language)}"
            class="press-card group block bg-white border border-black shadow-card hover:shadow-card-hover transition-all overflow-hidden"
          >${image}
            <div class="px-3 py-2.5">
              <p class="press-card-title text-xs font-semibold leading-snug line-clamp-3 group-hover:underline decoration-foreground/30" data-original="${attr(a.title)}">${esc(a.title)}</p>
              <p class="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-1.5">${dateLabel}</p>
            </div>
          </a>`;
}

const I = " ".repeat(8);

export async function buildPressSection(csvPath) {
  const text = await readFile(csvPath, "utf8");
  const all = rowsToObjects(parseCsv(text));
  const rows = all.filter((r) => r.hidden !== "true");

  const byPub = new Map();
  for (const r of rows) {
    if (!byPub.has(r.publication)) byPub.set(r.publication, []);
    byPub.get(r.publication).push(r);
  }
  const pubs = [...byPub.keys()].sort((a, b) => {
    const ra = parseInt(byPub.get(a)[0].pub_rank, 10) || 999;
    const rb = parseInt(byPub.get(b)[0].pub_rank, 10) || 999;
    return ra - rb || a.localeCompare(b);
  });

  const logoStrip = pubs
    .map((pub) => {
      const id = `pub-${slug(pub)}`;
      const logo = logoUrl(pub);
      const icon = logo
        ? `<img src="${attr(logo)}" alt="" class="w-4 h-4 shrink-0" loading="lazy" />`
        : `<span class="w-4 h-4 shrink-0 rounded-full bg-muted-foreground/30"></span>`;
      return (
        `${I}    <a href="#${id}" class="inline-flex items-center gap-1.5 border border-divider hover:border-foreground bg-white px-2 py-1 transition-colors">\n` +
        `${I}      ${icon}\n` +
        `${I}      <span class="text-[11px] text-muted-foreground group-hover:text-foreground">${esc(pub)}</span>\n` +
        `${I}    </a>`
      );
    })
    .join("\n");

  const sections = pubs
    .map((pub) => {
      const id = `pub-${slug(pub)}`;
      const articles = byPub.get(pub).sort((a, b) => (a.date < b.date ? 1 : -1));
      const logo = logoUrl(pub);
      const icon = logo
        ? `<img src="${attr(logo)}" alt="" class="w-5 h-5" loading="lazy" />`
        : `<span class="w-5 h-5 rounded-full bg-muted-foreground/30"></span>`;
      const cards = articles.map(articleCard).join("\n" + I + "  ");
      return (
        `${I}<div id="${id}" class="mb-10 scroll-mt-24">\n` +
        `${I}  <div class="flex items-center gap-2 mb-3">\n` +
        `${I}    ${icon}\n` +
        `${I}    <h3 class="text-sm font-semibold">${esc(pub)}</h3>\n` +
        `${I}    <span class="text-xs text-muted-foreground">· ${articles.length}</span>\n` +
        `${I}  </div>\n` +
        `${I}  <div class="press-grid">\n` +
        `${I}    ${cards}\n` +
        `${I}  </div>\n` +
        `${I}</div>`
      );
    })
    .join("\n\n");

  const strip =
    `${I}<div class="flex flex-wrap gap-1.5 mb-10">\n` + logoStrip + `\n${I}</div>\n\n`;

  return strip + sections + "\n";
}

/**
 * A pre-translated table of every curated article's title, one entry per
 * dropdown language — built by hand, not a live translation API call,
 * so changing the language on /press/ is instant and needs no network
 * request. Embedded as JSON; the page's own script reads it by article id.
 */
export async function buildTranslationsScript(jsonPath) {
  const text = await readFile(jsonPath, "utf8");
  JSON.parse(text); // fail the build loudly if the table is malformed
  return (
    `${I}<script type="application/json" id="press-translations">\n` +
    text.trim().replace(/</g, "\\u003c") +
    `\n${I}</script>\n`
  );
}
