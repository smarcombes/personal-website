#!/usr/bin/env python3
"""Build www/thoughts/*.html from www/thoughts/*.md (frontmatter + simple markdown).

Usage: python3 build_thoughts.py
Regenerates one HTML page per post and thoughts/index.html.
"""
import re
from datetime import date
from pathlib import Path

THOUGHTS = Path(__file__).parent / "thoughts"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <title>{title} — Séverin Marcombes</title>
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
    <div class="w-full max-w-2xl">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <span><a href="/index.html" class="text-3xl font-serif">Séverin Marcombes</a></span>
        <nav class="flex gap-6">
          <a href="/index.html" class="underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70">Home</a>
          <a href="/thoughts/index.html" class="underline underline-offset-8 decoration-2 hover:decoration-foreground hover:text-foreground">Thoughts</a>
          <a href="/projects/index.html" class="underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70">Projects</a>
        </nav>
      </header>
"""

FOOT = """
      <footer>
        <div class="w-full flex flex-col md:flex-row justify-between py-6 items-baseline gap-4 border-t border-black mt-16">
          <p class="font-serif text-lg">Séverin Marcombes</p>
          <div class="flex gap-4">
            <a href="/index.html" class="underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70">Home</a>
            <a href="/thoughts/index.html" class="underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70">Thoughts</a>
            <a href="/projects/index.html" class="underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70">Projects</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>
"""


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(s: str) -> str:
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r'<strong class="font-semibold">\1</strong>', s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"`(.+?)`", r'<code class="font-mono text-[15px] bg-white border border-divider px-1">\1</code>', s)
    s = re.sub(
        r"\[(.+?)\]\((.+?)\)",
        r'<a href="\2" class="text-link underline hover:decoration-2">\1</a>',
        s,
    )
    return s


def md_to_html(md: str) -> str:
    out, in_list = [], False
    for raw in md.split("\n"):
        line = raw.rstrip()
        if line.startswith("- "):
            if not in_list:
                out.append('<ul class="list-none space-y-3 my-6">')
                in_list = True
            out.append(
                '<li class="flex gap-3"><span class="size-[7px] bg-gray-900 rounded-sm mt-2.5 shrink-0"></span><span>'
                + inline(line[2:])
                + "</span></li>"
            )
            continue
        if in_list:
            out.append("</ul>")
            in_list = False
        if line.startswith("## "):
            out.append(f'<h3 class="text-2xl font-normal mt-12 mb-4 font-sans">{inline(line[3:])}</h3>')
        elif line.startswith("# "):
            out.append(f'<h3 class="text-2xl font-normal mt-12 mb-4 font-sans">{inline(line[2:])}</h3>')
        elif line:
            out.append(f'<p class="mb-4">{inline(line)}</p>')
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def parse(path: Path):
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


posts = []
for md_file in sorted(THOUGHTS.glob("*.md")):
    fm, body = parse(md_file)
    posts.append((fm, body, md_file.stem))

posts.sort(key=lambda p: p[0]["date"], reverse=True)

for fm, body, stem in posts:
    page = HEAD.format(title=esc(fm["title"]), description=esc(fm["description"]))
    page += f"""
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
    page += FOOT
    (THOUGHTS / f"{stem}.html").write_text(page)
    print("built", stem + ".html")

# ---- index page: timeline feed of all posts ----
items = []
for i, (fm, body, stem) in enumerate(posts):
    d = fmt_date(fm["date"])
    if i == 0:
        card = f"""        <a href="/thoughts/{stem}.html" class="relative flex flex-col gap-2 px-3 py-2 ml-6 group cursor-pointer bg-white border border-black shadow-card hover:shadow-card-hover transition-all">
          <div class="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background"></div>
          <div class="flex items-baseline gap-1.5 justify-between">
            <div class="text-sm font-semibold leading-5">{esc(fm["title"])}</div>
            <div class="text-xs text-muted-foreground shrink-0 ml-1 whitespace-nowrap">{d}</div>
          </div>
          <p class="text-xs text-muted-foreground">{esc(fm["description"])}</p>
        </a>"""
    elif i < 4:
        card = f"""        <a href="/thoughts/{stem}.html" class="relative flex flex-col gap-2 px-3 py-2 ml-6 group cursor-pointer bg-white/60 border border-card-border hover:border-card-border-hover hover:shadow-card-soft hover:bg-white transition-all">
          <div class="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background"></div>
          <div class="flex items-baseline gap-1.5 justify-between">
            <div class="text-xs font-semibold leading-5">{esc(fm["title"])}</div>
            <div class="text-xs text-muted-foreground shrink-0 ml-1 whitespace-nowrap">{d}</div>
          </div>
          <p class="text-xs text-muted-foreground">{esc(fm["description"])}</p>
        </a>"""
    else:
        card = f"""        <a href="/thoughts/{stem}.html" class="relative flex flex-col gap-1 px-3 py-2 ml-6 group cursor-pointer hover:bg-background-hover">
          <div class="absolute size-[7px] bg-gray-900 rounded-sm -left-[37px] top-[15px] outline outline-2 outline-background"></div>
          <div class="flex items-baseline gap-1.5 justify-between">
            <div class="text-xs font-semibold leading-5">{esc(fm["title"])}</div>
            <div class="text-xs text-muted-foreground shrink-0 ml-1 whitespace-nowrap">{d}</div>
          </div>
          <p class="text-xs text-muted-foreground">{esc(fm["description"])}</p>
        </a>"""
    items.append(card)

index = HEAD.format(title="Thoughts", description="Essays on AI, agents, and the living software stack — by Séverin Marcombes.")
index += f"""
      <h1 class="text-5xl md:text-6xl font-serif leading-tight mt-12 mb-6">Thoughts</h1>
      <p class="mt-8 mb-8 text-muted-foreground">Theses on AI, agents, and where software goes next. Written from the inside — every one of these is backed by something I shipped.</p>
      <div class="relative flex flex-col space-y-4 border-l border-gray-300 py-4 ml-4
                  before:h-6 before:w-px before:bg-gradient-to-t before:from-transparent before:to-background before:absolute before:-left-px before:top-0
                  after:h-6 after:w-px after:bg-gradient-to-b after:from-transparent after:to-background after:absolute after:-left-px after:bottom-0">
{chr(10).join(items)}
      </div>
"""
index += FOOT
(THOUGHTS / "index.html").write_text(index)
print("built index.html")
