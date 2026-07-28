# severin-marcombes.fr

Personal website of Séverin Marcombes. Same "scientific lab notebook" design
across every version — warm paper background, monospace UI text, serif titles,
hard 1-bit offset shadows.

Site versions in this repo, newest first:

| Folder | What it is | Status |
|---|---|---|
| **`16/`** | Current site — a Next.js 16 app. Pages are hand-written React. **Edit this one.** | Live |
| `www-2/` | Previous version — static HTML generated from markdown by a Python script. | Superseded |
| `www/` | Original v1. Richer (career timeline, highlights, thoughts). | Archived, do not edit |

`16/` is the source of truth going forward. `www-2/` and `www/` are kept only as
references of the content and the fuller design; leave them untouched.

## `16/` — the current site (Next.js)

Next.js 16 (App Router) + React 19 + Tailwind v4. Every page is authored by hand
as React — no markdown build step. The content was ported from `www-2` /
`data-2` and the design is intentionally identical, with a few small polish
fixes.

```
16/
  app/
    layout.tsx              Root layout: fonts (Newsreader serif, Source Sans 3), <body> classes
    globals.css             Tailwind v4 @theme — all the design tokens (colors, shadows, fonts)
    page.tsx                Home page
    projects/page.tsx       Projects index (grouped directory, driven by lib/site.ts)
    projects/<slug>/page.tsx  One hand-written React page per project (14 of them)
  components/
    Shell.tsx               Shared header + nav + footer wrapper (used by every page)
    ProjectPage.tsx         Article layout for a project detail page
    content.tsx             Prose primitives: P, Section, Sub, Bullets, Code, Pre, DataTable, Badges, ...
  lib/site.ts               SHOW_THOUGHTS flag, nav items, and the project manifest (titles/taglines/groups)
```

Run it:

```bash
cd 16
npm install      # first time only
npm run dev      # http://localhost:3000
npm run build    # production build (all routes are static)
```

### Common tasks (`16/`)

- **Design tokens** (colors, shadows, fonts): edit the `@theme` block in
  `app/globals.css`. Everything on the site derives from there.
- **Add / edit a project**: create `app/projects/<slug>/page.tsx` (copy an
  existing one — they use `ProjectPage` + the prose primitives in
  `components/content.tsx`), then register the slug + title/tagline/emoji/group
  in `lib/site.ts` so it shows up on `/projects` and the home page.
- **Re-enable Thoughts**: set `SHOW_THOUGHTS = true` in `lib/site.ts` to unhide
  the nav links, then add the `/thoughts` route. The nav wiring is already in
  `components/Shell.tsx`.

The sections below document the older `www-2` static pipeline, kept for
reference.

---

## `www-2/` (previous, static-HTML pipeline)

Plain static HTML styled with the Tailwind CDN — a tiny Python script turns
markdown content into the final HTML pages.

## Repository layout

```
data-2/                  Content source (what you edit day to day)
  home.txt               Homepage messaging draft, in plain prose
  projects/*.md          One markdown file per project (the write-ups)

www-2/                   The current site
  build.py               Generator: markdown + fragments -> HTML
  pages/home.html        Hand-authored homepage body (design lives here)
  index.html             GENERATED from pages/home.html
  projects/*.html        GENERATED from ../data-2/projects/*.md
  projects/index.html    GENERATED directory of all projects
  thoughts/*.md          Blog-post drafts (feature currently hidden)
  thoughts/*.html        GENERATED, only when Thoughts is enabled

www/                     Archived v1 (ignore)
design-system/           Reference for the visual language ("lab notebook")
```

Anything marked GENERATED is overwritten by `build.py` — never hand-edit those
files. Edit the source (`data-2/`, `pages/home.html`) and rebuild.

## Build & preview

```bash
cd www-2
python3 build.py                 # regenerate all HTML
python3 -m http.server 8000      # then open http://localhost:8000
```

Use a server (not `file://`): links are root-absolute (e.g. `/projects/lima.html`).

No dependencies — standard-library Python 3 only.

## How the site is generated

```
data-2/home.txt        --(you keep in sync by hand)-->  www-2/pages/home.html
www-2/pages/home.html  --build.py-->  www-2/index.html
data-2/projects/*.md   --build.py-->  www-2/projects/<slug>.html + index.html
www-2/thoughts/*.md    --build.py-->  www-2/thoughts/*.html   (only if enabled)
```

`build.py` wraps every page in one shared header/footer shell, so the nav,
fonts, and colors stay identical across the whole site.

## Common tasks

### Edit a project write-up

Just edit the markdown in `data-2/projects/<slug>.md` and rebuild. The page
title comes from the first `# Heading`, and the lead/subtitle from the first
`> blockquote` line right under it. Keep that contract:

```markdown
# Project Name

> One-sentence tagline shown as the page subtitle and in the projects list.

Body goes here...
```

Supported markdown: headings (`#`/`##`/`###`), paragraphs, bullet and numbered
lists, fenced code blocks, tables (with or without a header row), blockquotes,
inline bold/italic/`code`/links, and shields.io badge lines (rendered as small
text pills). Links to `./other-project.md` are rewritten to the right page
automatically.

### Add a new project

1. Add `data-2/projects/<slug>.md` (follow the title + `> tagline` contract above).
2. Register it in `build.py` — add the `<slug>` to the right group in the
   `GROUPS` list, and an icon in the `EMOJI` dict. `GROUPS` controls the order
   and section headings on `projects/index.html`.
3. If it should appear on the homepage, also add it to `www-2/pages/home.html`
   by hand (the homepage is curated, not auto-generated from the manifest).
4. Rebuild.

If a project links to another project that has no page yet, the build prints a
warning and renders that link as plain text (no dead link ships).

### Edit the homepage

The homepage is hand-authored in `www-2/pages/home.html` (this is where the
layout/design decisions live). `data-2/home.txt` is the plain-prose draft the
markup is based on — when you rework the message, update `home.txt` first, then
mirror it into `pages/home.html`, then rebuild.

### Re-enable Thoughts (blog)

The Thoughts section is fully built but hidden for now. To bring it back:

1. Open `www-2/build.py` and set `THOUGHTS_ENABLED = True`.
2. Rebuild.

That single flag restores the "Thoughts" nav links (header + footer) and
regenerates a page per `www-2/thoughts/*.md` plus `thoughts/index.html`. The
markup and generator for it are already in place — nothing else to change.

## Design language

Warm paper background, monospace UI text, a classic serif for titles, hard 1-bit
offset shadows, almost no rounded corners, minimal color — "a scientific lab
notebook that happens to be interactive." The full reference (colors, fonts,
components) is in `design-system/DESIGN_SYSTEM.md`. The Tailwind theme is defined
inline in the `HEAD` template inside `build.py`; change it there to affect every
page at once.
