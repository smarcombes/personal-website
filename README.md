# severin-marcombes.com

Personal website of Séverin Marcombes. Pure static HTML — no framework, no
client-side JavaScript, no build step required to deploy.

Live at **severin-marcombes.com** (and severin-marcombes.fr). Deployed on Vercel
as project `severin-marcombes.com`.

## Layout

```
src/input.css      Tailwind v4 source: @theme design tokens + @font-face rules
dist/              ← deploy THIS folder, as-is
build/             build + verification scripts
resources/         written source material (not deployed) — see below
package.json
```

### `dist/` — what actually ships

```
dist/
├── index.html                 home page
├── projects/lima/
│   ├── index.html             Lima article
│   └── media/*.jpg            article images, beside the page that uses them
├── styles.css                 compiled Tailwind — committed, so no build to deploy
├── fonts/*.woff2              self-hosted Newsreader + Source Sans 3
├── site.webmanifest
└── favicon.ico, apple-touch-icon.png, android-chrome-*.png, favicon-*.png
```

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
| `thoughts/` | 19 essays on AI, agents, tooling and infrastructure |
| `design-system/` | `DESIGN_SYSTEM.md` + standalone HTML component references |
| `notes/` | Working briefs (project-rewrite template, registry task) |
| `legacy-build/` | The Python generators that built the earlier site versions |

## Working on it

```bash
npm install          # first time only
npm run dev          # watch + recompile styles.css on change
npm run serve        # http://localhost:4318
npm run build        # compile styles.css, then verify dist/
npm run check        # verify dist/ only (dead links, stale styles.css)
```

`dist/styles.css` is committed. Re-run `npm run build:css` (or `npm run build`)
after editing `src/input.css` **or** after adding/changing classes in any page —
Tailwind only emits the classes it finds in the files listed as `@source` in
`src/input.css`, so a new page must be added there too.

`npm run check` catches the two ways this site actually breaks: a link or asset
pointing at a file that isn't there, and a `styles.css` older than the markup.

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
