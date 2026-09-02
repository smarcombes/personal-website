# severin-marcombes.com

Personal website of Séverin Marcombes. Pure static HTML — no framework, no
client-side JavaScript, no build step required to deploy.

Live at **severin-marcombes.com** (and severin-marcombes.fr). Deployed on Vercel
as project `severin-marcombes.com`.

## Layout

```
src/
  layout.html      the shell every page shares: head, meta, header, footer
  pages/**.html    page bodies + a JSON front-matter block
  content/thoughts/*.md   essays, as Markdown (currently empty — see below)
  input.css        Tailwind v4: @theme design tokens + @font-face rules
assets/            fonts, favicons, article images — copied into dist/ verbatim
build/
  build.mjs        copy assets → render → compile CSS → check
  copy-assets.mjs  assets/ → dist/
  render.mjs       src/ → dist/
  markdown.mjs     the small Markdown subset the essays use
  check-dist.mjs   dead links + stale styles.css
dist/              ← deploy THIS folder, as-is (generated, but committed)
resources/         written source material, never deployed — see below
package.json
```

Pages are generated, but `dist/` stays plain HTML with no runtime and is
committed, so deploying still needs no build step.

### `assets/` — everything that isn't rendered

Fonts, favicons and article images are hand-managed source files. They live in
`assets/`, and `npm run build` copies them into `dist/` before anything else
runs. The tree mirrors the deployed layout exactly — `assets/fonts/x.woff2` is
served at `/fonts/x.woff2` — so adding one is just dropping it in the matching
folder and rebuilding.

They used to sit in `dist/` directly, with nothing able to put them back. One
stray deletion and every page shipped with dead references to its fonts and
favicons, which `npm run check` could report but never fix. Now `dist/` heals
itself: delete the whole lot and `npm run build` restores it.

### Adding a page

Drop an HTML file under `src/pages/` with a front-matter comment:

```html
<!--{
  "title": "Thing — Séverin Marcombes",
  "description": "One sentence.",
  "path": "/projects/thing/",
  "ogType": "article"
}-->
<article>…</article>
```

`ogType: "article"` widens the column to `max-w-2xl` and preloads the body
font. `ogImage` (a root-absolute path) upgrades the Twitter card. Then
`npm run build`. Essays are simpler still: add a Markdown file under
`src/content/thoughts/` with `title`, `date`, `description` and `slug`, and it
appears on `/thoughts/` automatically, newest first.

**There are currently no essays.** The 19 AI-drafted originals sit in
`resources/thoughts/` and are being reworked one at a time in the `writing-review`
tool, which exports approved ones back into `src/content/thoughts/`. The whole essay
pipeline is conditional on that directory: with nothing in it, no essay pages, no
`/thoughts/` index and no Writing section on the home page are emitted. Drop one file
in and all three reappear.

### `dist/` — what actually ships

```
dist/
├── index.html                 home page                     ← rendered
├── projects/lima/index.html   the Lima article              ← rendered
├── thoughts/…                 only when essays exist        ← rendered
├── styles.css                 compiled Tailwind             ← build:css
├── fonts/*.woff2              Newsreader + Source Sans 3    ← assets/
├── projects/lima/media/*.jpg  article images                ← assets/
├── site.webmanifest           PWA manifest                  ← assets/
└── favicon.ico + 5 icon PNGs  apple-touch, android-chrome   ← assets/
```

Everything in `dist/` is committed, so the folder deploys as-is — but nothing
in it is authored there. Edit `src/` or `assets/` and rebuild.

Pages use root-absolute paths (`/styles.css`, `/projects/lima/`), so the site
must be served from a domain root.

### `resources/` — written material, never deployed

Everything written for the site across its versions, kept so no copy is lost:

| Folder | Contents |
|---|---|
| `bio/` | Long-form about/home copy (`about.txt`, `about-v2.txt`, `home.txt`) |
| `projects/longform/` | 14 project write-ups in the templated form — *Why / Design decisions / The tech onion / Recognition* |
| `projects/briefs/` | 17 shorter project descriptions, incl. agent-one, hiphop, samantha |
| `projects/archive/` | Superseded variants worth keeping (`lima-technical.md`) |
| `archive/pages/` | Four project pages written then pulled from the site — Slices, ExtraOrbital, BotParty, design-system-stealer. Front matter intact, so moving one back into `src/pages/projects/` republishes it as-is |
| `thoughts/` | The 19 AI-drafted essays. None is published; they are the input to the `writing-review` tool, and approved rewrites land in `src/content/thoughts/` |
| `design-system/` | `DESIGN_SYSTEM.md` + standalone HTML component references |
| `notes/` | Working briefs (project-rewrite template, registry task) |
| `legacy-build/` | The Python generators that built the earlier site versions |

## Working on it

```bash
npm install          # first time only
npm run dev          # watch + recompile styles.css on change
npm run serve        # http://localhost:4318
npm run build        # copy assets, render, compile styles.css, verify dist/
npm run check        # verify dist/ only (dead links, stale styles.css)
```

`dist/` is committed in full. Re-run `npm run build` after editing anything
under `src/` — Tailwind only emits the classes it finds in the rendered HTML,
which is why `render` runs before `build:css`.

`npm run check` catches the two ways this site actually breaks: a link or asset
pointing at a file that isn't there, and a `styles.css` that no longer matches the
markup.

`render` also **prunes**: any directory under `dist/` holding a generated
`index.html` that the run did not write is deleted. So removing a page from `src/`
removes it from the site, and `dist/` can't accumulate pages nobody meant to ship.
`fonts/`, `media/` and `.vercel/` are never touched. Assets are copied in
*before* the render, so removing a page deletes its images in the same run
instead of the copy re-creating them as orphans.

## Design

Same "scientific lab notebook" look across every version — warm paper
background, monospace UI text, serif titles, hard 1-bit offset shadows, almost
no border radius, minimal color. All tokens live in the `@theme` block of
`src/input.css`; everything on the site derives from there. See
`resources/design-system/DESIGN_SYSTEM.md` for the full rationale.

## Deploying

```bash
npm run deploy       # vercel deploy --prod dist
```

Or upload the contents of `dist/` to any static host.

## History

This repo previously kept every version of the site side by side (`www/`,
`www-2/`, `web/`, `16/`, `17/`, `18/`). Version `18/` — the static port of the
Next.js `17/` — was promoted to the repo root; the rest were removed. All their
markup and content is either in `resources/` or recoverable from git history at
commit `20cce96`.
