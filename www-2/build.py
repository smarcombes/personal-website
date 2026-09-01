#!/usr/bin/env python3
"""Build the static site in www-2/.

Sources:
  ../data-2/projects/*.md   -> www-2/projects/<slug>.html  + www-2/projects/index.html
  www-2/pages/home.html     -> www-2/index.html            (hand-authored body fragment)
  www-2/thoughts/*.md       -> www-2/thoughts/*.html        (only when THOUGHTS_ENABLED)

Usage:
  python3 build.py

Every page shares one HEAD/FOOT shell so the nav, fonts, and colors never drift.
Links are root-absolute (/projects/foo.html), so preview with a static server:
  python3 -m http.server   # run from inside www-2/
"""
import re
import sys
import urllib.parse
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Flip to True to bring the whole Thoughts feature back: the nav links reappear
# and every www-2/thoughts/*.md is rebuilt into a page + index. Nothing else
# needs to change.
THOUGHTS_ENABLED = False

ROOT = Path(__file__).parent
DATA = ROOT.parent / "data-2"
PROJECTS_SRC = DATA / "projects"
PROJECTS_OUT = ROOT / "projects"
THOUGHTS_DIR = ROOT / "thoughts"
HOME_FRAGMENT = ROOT / "pages" / "home.html"

# Ordered manifest that drives projects/index.html. Every slug must have a
# matching ../data-2/projects/<slug>.md. Add a project by dropping the markdown
# file in that folder and adding one line here.
GROUPS = [
    ("Recent work", [
        "interagentic",
        "skills-dev",
        "keychains-dev",
        "botparty",
        "layouts-dev",
    ]),
    ("Open source & fun projects", [
        "protean",
        "ux-morph",
        "ollama-pool",
        "tailwind-motion-native",
        "streambin",
        "github-filesystem",
        "react-electron",
    ]),
    ("In a previous life", [
        "lima",
        "seafront",
    ]),
]

EMOJI = {
    "interagentic": "🌐", "skills-dev": "🧰", "keychains-dev": "🔑",
    "botparty": "🎉", "layouts-dev": "📐", "protean": "🦠", "ux-morph": "🌊",
    "ollama-pool": "🦙", "tailwind-motion-native": "🎨", "streambin": "📡",
    "github-filesystem": "🗂️", "react-electron": "⚛️", "lima": "☁️",
    "seafront": "⛵",
}

KNOWN_SLUGS = {slug for _, slugs in GROUPS for slug in slugs}
MISSING_LINKS = set()  # ./foo.md links whose target slug does not exist

# ---------------------------------------------------------------------------
# Shared shell
# ---------------------------------------------------------------------------

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <title>{title}</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="{description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            background: '#F5F4EF', 'background-hover': '#EBEAE5', foreground: '#000000',
            muted: '#E5E4DC', 'muted-foreground': '#686868', link: '#595959',
            button: {{ DEFAULT: '#D9D8D3', hover: '#C4C3BB', foreground: '#403E37' }},
            divider: '#E5E4DC', 'card-border': '#D4D3CB', 'card-border-hover': '#C0BDAD', highlight: '#FBD45B',
          }},
          fontFamily: {{
            serif: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
          }},
          boxShadow: {{
            card: '3px 3px 0px #000000', 'card-hover': '5px 5px 0px #000000',
            'card-soft': '3px 3px 0px #C0BDAD', btn: '2px 2px 0px #403E37',
          }},
        }},
      }},
    }};
  </script>
</head>
<body class="bg-background text-foreground font-mono text-sm leading-5 antialiased">
  <div class="p-4 md:p-12 overflow-hidden">
    <div class="w-full {maxw}">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <span><a href="/index.html" class="text-3xl font-serif">Séverin Marcombes</a></span>
        <nav class="flex gap-6">
          {nav}
        </nav>
      </header>
"""

FOOT = """
      <footer>
        <div class="w-full flex flex-col md:flex-row justify-between py-6 items-baseline gap-4 border-t border-black mt-16">
          <p class="font-serif text-lg">Séverin Marcombes</p>
          <div class="flex gap-4">
            {nav}
          </div>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>
"""

NAV_ITEMS = [
    ("/index.html", "Home", "home"),
    ("/thoughts/index.html", "Thoughts", "thoughts"),
    ("/projects/index.html", "Projects", "projects"),
]


def nav_html(active: str) -> str:
    out = []
    for href, label, key in NAV_ITEMS:
        hidden = " hidden" if (key == "thoughts" and not THOUGHTS_ENABLED) else ""
        if active == key:
            cls = "underline underline-offset-8 decoration-2 hover:decoration-foreground hover:text-foreground"
        else:
            cls = "underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70"
        out.append(f'<a href="{href}" class="{cls}{hidden}">{label}</a>')
    return "\n          ".join(out)


def page(title: str, description: str, body: str, active: str, maxw: str = "max-w-xl") -> str:
    head = HEAD.format(title=esc(title), description=esc(description), maxw=maxw, nav=nav_html(active))
    foot = FOOT.format(nav=nav_html(active))
    return head + body + foot

# ---------------------------------------------------------------------------
# Markdown -> HTML
# ---------------------------------------------------------------------------

BADGE_RE = re.compile(r"\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)")
BADGE_LINE_RE = re.compile(r"^(?:\s*\[!\[.*?\]\(.*?\)\]\(.*?\)\s*)+$")


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _link_sub(m: re.Match) -> str:
    text, href = m.group(1), m.group(2)
    if href.endswith(".md"):
        slug = href.rsplit("/", 1)[-1][:-3]
        if slug in KNOWN_SLUGS:
            href = f"/projects/{slug}.html"
        else:
            MISSING_LINKS.add(slug)
            return text  # drop the dead link, keep the words
    return f'<a href="{href}" class="text-link underline hover:decoration-2">{text}</a>'


def inline(s: str) -> str:
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r'<strong class="font-semibold">\1</strong>', s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"`(.+?)`", r'<code class="font-mono text-[13px] bg-white border border-divider px-1">\1</code>', s)
    s = re.sub(r"\[(.+?)\]\((.+?)\)", _link_sub, s)
    return s


def _badge_label(url: str) -> str:
    """Extract the readable message from a shields.io badge URL."""
    if "/badge/" not in url:
        return ""
    path = url.split("/badge/", 1)[1].split("?", 1)[0]
    parts = [p.replace("\x00", "-") for p in path.replace("--", "\x00").split("-")]

    def dec(x: str) -> str:
        x = urllib.parse.unquote(x)
        return x.replace("__", "\x01").replace("_", " ").replace("\x01", "_")

    parts = [dec(p) for p in parts]
    # shields: 3 fields = label-message-color; 2 fields = message-color; 1 = message
    if len(parts) >= 3:
        return parts[1].strip()
    return parts[0].strip()


def render_badges(line: str) -> str:
    pills = []
    for alt, img, _link in BADGE_RE.findall(line):
        label = _badge_label(img) or alt
        pills.append(
            f'<span class="inline-flex items-center px-2 py-0.5 bg-muted border border-divider '
            f'text-[11px] text-muted-foreground">{esc(label)}</span>'
        )
    return '<div class="flex flex-wrap gap-1.5 my-6">' + "".join(pills) + "</div>"


def _cells(row: str) -> list:
    return [c.strip() for c in row.strip().strip("|").split("|")]


def render_table(rows: list) -> str:
    header = _cells(rows[0])
    body = [_cells(r) for r in rows[2:]]
    thtml = ""
    if any(header):
        ths = "".join(
            f'<th class="text-left font-semibold px-3 py-1.5 border border-divider bg-muted">{inline(c)}</th>'
            for c in header
        )
        thtml = f"<thead><tr>{ths}</tr></thead>"
    trs = ""
    for r in body:
        tds = "".join(f'<td class="px-3 py-1.5 border border-divider align-top">{inline(c)}</td>' for c in r)
        trs += f"<tr>{tds}</tr>"
    return (
        '<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-divider text-xs">'
        f"{thtml}<tbody>{trs}</tbody></table></div>"
    )


def _is_separator(line: str) -> bool:
    line = line.strip()
    return line.startswith("|") and set(line) <= set("|-: ") and "-" in line


def md_to_html(md: str) -> str:
    lines = md.split("\n")
    out, i, n = [], 0, len(lines)
    while i < n:
        line = lines[i].rstrip()
        stripped = line.strip()

        # fenced code block
        if stripped.startswith("```"):
            i += 1
            code = []
            while i < n and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1  # consume closing fence
            out.append(
                '<pre class="bg-white border border-divider p-4 my-6 overflow-x-auto '
                f'text-[13px] leading-5"><code>{esc(chr(10).join(code))}</code></pre>'
            )
            continue

        # table (current line + a separator on the next line)
        if line.startswith("|") and i + 1 < n and _is_separator(lines[i + 1]):
            tbl = []
            while i < n and lines[i].strip().startswith("|"):
                tbl.append(lines[i])
                i += 1
            out.append(render_table(tbl))
            continue

        # badge line
        if BADGE_LINE_RE.match(line):
            out.append(render_badges(line))
            i += 1
            continue

        # trailing arrow / source line
        if stripped.startswith("→"):
            out.append(
                '<p class="mt-8 pt-4 border-t border-divider text-muted-foreground text-xs">'
                f"{inline(stripped)}</p>"
            )
            i += 1
            continue

        # unordered list
        if stripped.startswith("- "):
            items = []
            while i < n and lines[i].strip().startswith("- "):
                items.append(inline(lines[i].strip()[2:]))
                i += 1
            lis = "".join(
                '<li class="flex gap-3"><span class="size-[7px] bg-gray-900 rounded-sm mt-2.5 '
                f'shrink-0"></span><span>{it}</span></li>'
                for it in items
            )
            out.append(f'<ul class="list-none space-y-3 my-6">{lis}</ul>')
            continue

        # ordered list
        if re.match(r"^\d+\.\s", stripped):
            items = []
            while i < n and re.match(r"^\d+\.\s", lines[i].strip()):
                items.append(inline(re.sub(r"^\d+\.\s", "", lines[i].strip())))
                i += 1
            lis = "".join(f'<li class="pl-1">{it}</li>' for it in items)
            out.append(f'<ol class="list-decimal ml-6 space-y-2 my-6 marker:text-muted-foreground">{lis}</ol>')
            continue

        # headings
        if stripped.startswith("### "):
            out.append(f'<h4 class="font-semibold mt-8 mb-3">{inline(stripped[4:])}</h4>')
            i += 1
            continue
        if stripped.startswith("## "):
            out.append(f'<h3 class="text-2xl font-normal mt-12 mb-4 font-sans">{inline(stripped[3:])}</h3>')
            i += 1
            continue
        if stripped.startswith("# "):
            out.append(f'<h3 class="text-2xl font-normal mt-12 mb-4 font-sans">{inline(stripped[2:])}</h3>')
            i += 1
            continue

        # blockquote
        if stripped.startswith("> "):
            out.append(
                '<p class="border-l-2 border-foreground/30 pl-4 my-6 text-muted-foreground italic">'
                f"{inline(stripped[2:])}</p>"
            )
            i += 1
            continue

        # paragraph / blank
        if stripped:
            out.append(f'<p class="mb-4">{inline(stripped)}</p>')
        i += 1
    return "\n".join(out)

# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------


def parse_project(path: Path):
    """Return (title, tagline, body_markdown). Contract: '# Title' then '> tagline'."""
    lines = path.read_text().split("\n")
    title, tagline, body = None, None, []
    started = False
    for line in lines:
        s = line.strip()
        if title is None:
            if s.startswith("# "):
                title = s[2:].strip()
                started = True
            continue
        if tagline is None and s.startswith("> "):
            tagline = s[2:].strip()
            continue
        body.append(line)
    if title is None:
        title = path.stem
    return title, tagline or "", "\n".join(body).strip()


def build_projects():
    PROJECTS_OUT.mkdir(exist_ok=True)
    meta = {}
    for slug in KNOWN_SLUGS:
        src = PROJECTS_SRC / f"{slug}.md"
        if not src.exists():
            print(f"  WARNING: manifest slug '{slug}' has no {src}")
            continue
        title, tagline, body = parse_project(src)
        meta[slug] = (title, tagline)
        article = f"""
      <article>
        <a href="/projects/index.html" class="text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground">← Projects</a>
        <h1 class="text-5xl md:text-6xl font-serif leading-tight text-balance mb-4 mt-8">{esc(EMOJI.get(slug, ''))} {esc(title)}</h1>
        <p class="text-lg text-muted-foreground mb-2">{inline(tagline)}</p>
        <div class="font-sans text-lg leading-relaxed">
{md_to_html(body)}
        </div>
      </article>
      <div class="mt-16">
        <a href="/projects/index.html" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium px-3 py-1.5 bg-button text-button-foreground border border-button-foreground shadow-btn relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground after:pointer-events-none hover:bg-button-hover hover:text-black active:shadow-none active:translate-y-0.5 transition-colors font-mono">← All projects</a>
      </div>
"""
        html = page(f"{title} — Séverin Marcombes", tagline, article, "projects", maxw="max-w-2xl")
        (PROJECTS_OUT / f"{slug}.html").write_text(html)
        print(f"  built projects/{slug}.html")

    # index
    sections = []
    for group_name, slugs in GROUPS:
        rows = []
        for slug in slugs:
            if slug not in meta:
                continue
            title, tagline = meta[slug]
            rows.append(
                f"""        <a href="/projects/{slug}.html" class="flex flex-col gap-1 py-3 px-1 -mx-1 border-b border-divider hover:bg-background-hover">
          <div class="font-semibold">{esc(EMOJI.get(slug, ''))} {esc(title)}</div>
          <p class="text-xs text-muted-foreground">{inline(tagline)}</p>
        </a>"""
            )
        sections.append(
            f"""      <h2 class="font-bold tracking-[-0.01em] mt-12 mb-2">{esc(group_name)}</h2>
      <div class="border-t border-divider">
{chr(10).join(rows)}
      </div>"""
        )

    body = f"""
      <h1 class="text-5xl md:text-6xl font-serif leading-tight mt-12 mb-6">Projects</h1>
      <p class="mt-8 mb-8 text-muted-foreground">Things I've built — from a hardware personal cloud to infrastructure for AI agents. Each one has a write-up; I'm iterating on them over time.</p>
{chr(10).join(sections)}
"""
    html = page("Projects — Séverin Marcombes",
                "Projects by Séverin Marcombes — agent infrastructure, self-evolving software, and fifteen years of shipped products.",
                body, "projects")
    (PROJECTS_OUT / "index.html").write_text(html)
    print("  built projects/index.html")

# ---------------------------------------------------------------------------
# Home
# ---------------------------------------------------------------------------


def build_home():
    fragment = HOME_FRAGMENT.read_text()
    html = page("Séverin Marcombes",
                "Séverin Marcombes — repeat founder and product builder. I build software systems around AI models so they make a real difference for people in the field.",
                fragment, "home")
    (ROOT / "index.html").write_text(html)
    print("  built index.html")

# ---------------------------------------------------------------------------
# Thoughts (only when enabled)
# ---------------------------------------------------------------------------


def parse_thought(path: Path):
    text = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    fm_raw, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_raw.split("\n"):
        k, _, v = line.partition(":")
        fm[k.strip()] = v.strip().strip('"')
    return fm, body.strip()


def fmt_date(iso: str) -> str:
    return date.fromisoformat(iso).strftime("%B %-d, %Y")


def build_thoughts():
    posts = []
    for md_file in sorted(THOUGHTS_DIR.glob("*.md")):
        fm, body = parse_thought(md_file)
        posts.append((fm, body, md_file.stem))
    posts.sort(key=lambda p: p[0]["date"], reverse=True)

    for fm, body, stem in posts:
        article = f"""
      <article>
        <h1 class="text-5xl md:text-6xl font-serif leading-tight text-balance mb-6 mt-12">{esc(fm["title"])}</h1>
        <div class="grid md:grid-cols-[120px_1fr] gap-0.5 font-mono text-sm mb-12">
          <div class="text-muted-foreground">Published</div>
          <div>{fmt_date(fm["date"])}</div>
          <div class="text-muted-foreground">Author</div>
          <div>Séverin Marcombes</div>
        </div>
        <div class="font-sans text-lg leading-relaxed">
{md_to_html(body)}
        </div>
      </article>
      <div class="mt-16">
        <a href="/thoughts/index.html" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium px-3 py-1.5 bg-button text-button-foreground border border-button-foreground shadow-btn relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground after:pointer-events-none hover:bg-button-hover hover:text-black active:shadow-none active:translate-y-0.5 transition-colors font-mono">← All thoughts</a>
      </div>
"""
        html = page(f'{fm["title"]} — Séverin Marcombes', fm.get("description", ""), article, "thoughts", maxw="max-w-2xl")
        (THOUGHTS_DIR / f"{stem}.html").write_text(html)
        print(f"  built thoughts/{stem}.html")

    items = []
    for i, (fm, body, stem) in enumerate(posts):
        d = fmt_date(fm["date"])
        if i == 0:
            style = "bg-white border border-black shadow-card hover:shadow-card-hover"
            tsz = "text-sm"
        elif i < 4:
            style = "bg-white/60 border border-card-border hover:border-card-border-hover hover:shadow-card-soft hover:bg-white"
            tsz = "text-xs"
        else:
            style = "hover:bg-background-hover"
            tsz = "text-xs"
        items.append(
            f"""        <a href="/thoughts/{stem}.html" class="relative flex flex-col gap-2 px-3 py-2 ml-6 group cursor-pointer {style} transition-all">
          <div class="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background"></div>
          <div class="flex items-baseline gap-1.5 justify-between">
            <div class="{tsz} font-semibold leading-5">{esc(fm["title"])}</div>
            <div class="text-xs text-muted-foreground shrink-0 ml-1 whitespace-nowrap">{d}</div>
          </div>
          <p class="text-xs text-muted-foreground">{esc(fm.get("description", ""))}</p>
        </a>"""
        )

    body = f"""
      <h1 class="text-5xl md:text-6xl font-serif leading-tight mt-12 mb-6">Thoughts</h1>
      <p class="mt-8 mb-8 text-muted-foreground">Theses on AI, agents, and where software goes next. Written from the inside — every one of these is backed by something I shipped.</p>
      <div class="relative flex flex-col space-y-4 border-l border-gray-300 py-4 ml-4
                  before:h-6 before:w-px before:bg-gradient-to-t before:from-transparent before:to-background before:absolute before:-left-px before:top-0
                  after:h-6 after:w-px after:bg-gradient-to-b after:from-transparent after:to-background after:absolute after:-left-px after:bottom-0">
{chr(10).join(items)}
      </div>
"""
    html = page("Thoughts — Séverin Marcombes",
                "Essays on AI, agents, and the living software stack — by Séverin Marcombes.",
                body, "thoughts")
    (THOUGHTS_DIR / "index.html").write_text(html)
    print("  built thoughts/index.html")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print("Building www-2 ...")
    build_home()
    build_projects()
    if THOUGHTS_ENABLED:
        build_thoughts()
    else:
        print("  thoughts: skipped (THOUGHTS_ENABLED = False)")

    if MISSING_LINKS:
        print("\nWARNING: markdown links point to projects with no page (rendered as plain text):")
        for slug in sorted(MISSING_LINKS):
            print(f"  - {slug}.md")
    print("\nDone.")


if __name__ == "__main__":
    sys.exit(main())
