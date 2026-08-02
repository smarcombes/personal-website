# severin-marcombes.fr — static build

A pure-HTML port of folder `17` (Next.js). No framework, no JavaScript, no build
step required to deploy.

## Layout

```
18/
├── dist/                      ← deploy THIS folder, as-is
│   ├── index.html             home page
│   ├── projects/lima/
│   │   ├── index.html         Lima article
│   │   └── media/*.jpg        article images, beside the page that uses them
│   ├── styles.css             compiled Tailwind (committed)
│   ├── fonts/*.woff2          self-hosted Newsreader + Source Sans 3
│   ├── site.webmanifest       PWA manifest
│   ├── favicon.ico            48×48
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png   180×180
│   ├── android-chrome-192x192.png
│   └── android-chrome-512x512.png
├── src/input.css              Tailwind source + design tokens
├── package.json               only needed to regenerate styles.css
└── README.md
```

Everything outside `dist/` is tooling and is not deployed.

## Deploying

Upload the contents of `dist/` to any static host. The site expects to be served
from the domain root, since assets and links use root-absolute paths
(`/styles.css`, `/projects/lima/`, `/projects/lima/media/…`).

```sh
npx vercel deploy --prod dist      # or
netlify deploy --prod --dir dist   # or
rsync -av dist/ user@host:/var/www/severin-marcombes.fr/
```

No build command. No output directory setting beyond `dist`.

## Local preview

Because links are root-absolute, preview over HTTP rather than opening the files
directly from disk:

```sh
npm run serve      # http://localhost:4318
```

## Editing

Edit the HTML in `dist/` directly. If you add, remove, or change any Tailwind
class, regenerate the stylesheet:

```sh
npm install        # first time only
npm run build:css  # or: npm run watch:css
```

`src/input.css` holds the design tokens (colors, fonts, the hard 1-bit offset
shadows) and restricts Tailwind's class scanning to the two pages in `dist/`.

## Icons

The favicon set (and the globe-and-sparkle mark) comes from
`skills.dev/apps/shortcuts.dev/frontend`. `site.webmanifest` was re-pointed at
this site: name "Séverin Marcombes", `background_color` `#f5f4ef` to match the
paper background, `theme_color` `#000000`.

Both pages declare the full set: `favicon.ico`, 16/32 PNGs, `apple-touch-icon`,
and the manifest.

## Fonts

Newsreader and Source Sans 3 are self-hosted in `dist/fonts/` (4 variable
woff2 files, ~180KB total, latin subset, one file per family+style covering
both weights used on the site via the `wght` axis) rather than loaded from
Google Fonts. Each page preloads the 1–2 files it needs above the fold. All
four `@font-face` rules use `font-display: optional`, so the page never
flashes fallback-font-then-swaps-to-webfont on load — it either has the
webfont in time for first paint or commits to the fallback for that view.
This also drops the external Google Fonts request entirely (previously two
extra round trips: `fonts.googleapis.com` for the CSS, `fonts.gstatic.com`
for the files), which was the site's font flicker on load.

To refresh these files (e.g. adding a weight), regenerate the Google Fonts
CSS with a real UA, take the `/* latin */` block's URL for each face, and
save under `dist/fonts/`. See git history on `src/input.css` for how the
`@font-face` rules were derived.

## Notes on the port

- Fonts: see "Fonts" above — self-hosted, not loaded from Google Fonts. This
  replaces `next/font`, which we can't use outside of Next.js.
- `next/image` became plain `<img>` with intrinsic `width`/`height` and
  `loading="lazy"`.
- The nav was empty in `17` (`SHOW_THOUGHTS = false`), so no nav is rendered.
- `/projects` in `17` redirected home and has no static equivalent; link
  straight to `/projects/lima/`.
- Rendering was verified against `17`: identical accessibility trees and
  identical element geometry, fonts, colors, and shadows.
