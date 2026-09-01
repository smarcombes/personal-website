# Design System — "Physical Intelligence" Language

A complete reference of the design language used by [pi.website](https://www.pi.website/), extracted from live computed styles, CSS custom properties, and Tailwind class inspection (July 2026).

The overall personality: **a scientific lab notebook**. Warm paper-like background, monospace UI text, a classic serif reserved for titles, hard 1-bit offset shadows, almost no border radius, no gratuitous color. Everything reads like a printed research memo that happens to be interactive.

---

## 1. Color Tokens

All colors come from CSS custom properties on `:root` (stored as raw RGB triplets, consumed as `rgb(var(--token))`).

| Token | RGB | Hex | Usage |
|---|---|---|---|
| `--background` | 245 244 239 | `#F5F4EF` | Page background (warm paper off-white) |
| `--background-hover` | 235 234 229 | `#EBEAE5` | Hover state for plain list rows |
| `--foreground` | 0 0 0 | `#000000` | Primary text, borders on featured cards |
| `--muted` | 229 228 220 | `#E5E4DC` | Muted surfaces |
| `--muted-foreground` | 104 104 104 | `#686868` | Secondary text: dates, descriptions, captions |
| `--link` | 89 89 89 | `#595959` | Long-form article links |
| `--button` | 217 216 211 | `#D9D8D3` | Button background |
| `--button-hover` | 196 195 187 | `#C4C3BB` | Button hover background |
| `--button-foreground` | 64 62 55 | `#403E37` | Button text + button border (warm dark gray) |
| `--border` | 64 62 55 | `#403E37` | Strong borders |
| `--divider` | 229 228 220 | `#E5E4DC` | Hairline dividers between list rows |
| `--infographic-card` | 230 224 203 | `#E6E0CB` | Diagram/infographic card fill |
| `--infographic-card-elevation` | 245 244 239 | `#F5F4EF` | Infographic elevation layer |
| `--infographic-card-highlight` | 251 212 91 | `#FBD45B` | **The only accent color** — a mustard yellow, used sparingly inside diagrams |

Additional literal colors found in markup:

| Value | Usage |
|---|---|
| `#FFFFFF` | Card surfaces (featured card is solid white; boxed card is `white/60`, becomes solid white on hover) |
| `#D4D3CB` | Subtle card border (boxed card, resting state) |
| `#C0BDAD` | Subtle card border + soft offset shadow (boxed card, hover state) |
| `rgb(17 24 39)` (`gray-900`) | Timeline dots |
| `gray-300` | Timeline vertical rule |

**Rules of thumb**
- Pure black on warm paper. No blues, no brand colors on text.
- White is a *surface elevation* color, not a page color.
- Yellow `#FBD45B` appears only inside illustrative content, never in chrome.

---

## 2. Typography

### Font families

| Role | Stack | Where |
|---|---|---|
| **Serif (display)** | `signifier` (Klim Type Foundry "Signifier", weight 400 only) → fallback serif | Wordmark, page titles (`h1`), footer wordmark. Never bolded. |
| **Mono (UI / default)** | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | **The body default.** Nav, feed items, dates, buttons, captions, metadata, footers. The site *defaults to monospace* — this is the defining typographic choice. |
| **Sans (long-form)** | `"Source Sans 3"` (variable 200–900) | Article/blog body copy and article `h3` subheads only. |

> Signifier is a commercial font. Closest free approximations for a replica: **Newsreader** (Google Fonts) or Georgia. Source Sans 3 is freely available on Google Fonts.

### Type scale (only 6 sizes exist on the site)

| Size | Line height | Usage |
|---|---|---|
| `9px` | — | Micro annotations inside diagrams |
| `12px` (`text-xs`) | `20px` (`leading-5`) | Feed descriptions, dates, captions |
| `14px` (`text-sm`) | `20px` | **Default body.** Mono UI text, nav, buttons, metadata |
| `18px` (`text-lg`) | `29.25px` (`leading-relaxed`, 1.625) | Article body (Source Sans 3), footer wordmark, accordion `+` glyph |
| `24px` (`text-2xl`) | — | Article subheads (`h3`, Source Sans, weight 400) |
| `30px` (`text-3xl`) | `36px` | Header wordmark (serif) |
| `48–60px` (`text-5xl md:text-6xl`) | `leading-tight` | Page titles (serif, weight 400, `text-balance`) |

### Weights

Only **400** and **600/bold** are used. Serif is always 400. Emphasis in mono context = `font-semibold` or `font-bold` (often with `tracking-[-0.01em]`).

---

## 3. Layout & Containers

```
<body class="font-mono text-sm bg-background text-foreground">
  <div class="p-4 md:p-12 overflow-hidden">      ← page padding (16px mobile / 48px desktop)
    <div class="w-full max-w-xl">…</div>         ← content column
  </div>
</body>
```

| Page type | Column width |
|---|---|
| Home / feed | `max-w-xl` (576px) |
| Index pages (e.g. Papers) | `max-w-2xl` (672px) |
| Footer inner row | `max-w-3xl` (768px), centered |
| Articles | full width wrapper; prose column constrained per-block (~672px) |

Content is **left-aligned to the page padding**, not centered on the home page. Narrow columns keep mono text at a readable measure.

### Spacing system

Standard Tailwind 4px scale. Recurring values:
- `mb-6` (24px) below the header block
- `mt-8 mb-8` (32px) between intro paragraphs
- `space-y-4` (16px) between feed items
- `px-3 py-2` (12px / 8px) inside cards
- `mt-12` (48px) above article subheads, `mb-4` (16px) below
- `py-6` + `mt-12` around the footer row

---

## 4. Borders, Radius, Shadows

- **Radius: effectively zero.** Everything is square. The only rounding on the site is `rounded-sm` (2px) on 7px timeline dots.
- **Shadows are hard, offset, and un-blurred** — 1-bit print aesthetic:

| Shadow | Value | Usage |
|---|---|---|
| Featured card | `3px 3px 0px #000` | resting |
| Featured card hover | `5px 5px 0px #000` | grows on hover |
| Boxed card hover | `3px 3px 0px #C0BDAD` | appears on hover only |
| Button | `2px 2px 0px #403E37` | resting; disappears on `:active` while button translates down `0.5` (2px) |

- Hairline dividers: `border-b border-divider` (`#E5E4DC`).
- Strong rules: `border-t border-black` (footer), `border border-black` (featured card).

---

## 5. Components

### 5.1 Site header
- Wordmark: `<a class="text-3xl font-serif">` — serif, 30px, weight 400.
- Layout: `flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4`.
- Nav links (mono 14px): `underline underline-offset-8` — the underline sits 8px below like a tab indicator.
  - Active: `decoration-2` (2px underline)
  - Inactive hover: `hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70`

### 5.2 Timeline feed
The signature component of the home page.

- Wrapper: `relative flex flex-col space-y-4 border-l border-gray-300 py-4` plus gradient fade-outs at both ends:
  `before:h-6 before:w-px before:bg-gradient-to-t before:from-transparent before:to-background before:absolute before:-left-px before:top-0` (and mirrored `after:` at the bottom).
- Every item is indented `ml-6` and carries an absolutely-positioned dot:
  `absolute size-[7px] bg-gray-900 rounded-sm -left-[40px] top-[7px] outline outline-background outline-2` — a square-ish dot punched out of the line by a background-colored outline.

### 5.3 Feed cards (3 elevation tiers)

| Tier | Classes |
|---|---|
| **Featured** (newest item) | `bg-white border border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all px-3 py-2` |
| **Boxed** (notable) | `bg-white/60 border border-[#D4D3CB] hover:border-[#C0BDAD] hover:shadow-[3px_3px_0px_#C0BDAD] hover:bg-white transition-all px-3 py-2` |
| **Plain** (default row) | `hover:bg-background-hover px-3 py-2` |

Inner anatomy (identical across tiers):
```
flex flex-col gap-1..2
├─ row: flex items-baseline justify-between
│   ├─ title:  text-xs (→ text-sm on featured) font-semibold leading-5 truncate
│   └─ date:   text-xs text-muted-foreground shrink-0 ml-1
└─ description: text-xs text-muted-foreground
```

### 5.4 Buttons
Mono-labeled, tactile, with a **dashed inner keyline**:

```
inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5
bg-button text-button-foreground border border-button-foreground
shadow-[2px_2px_0px_#403E37]
relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground
hover:bg-button-hover hover:text-black
active:shadow-none active:translate-y-0.5
```
Often prefixed with a small icon or emoji (14–16px).

### 5.5 Accordion (Join Us)
- Row: `flex w-full items-start justify-between gap-2 py-0.5 text-left` inside `border-b border-divider` sections with generous `py-4+`.
- Title: `font-bold tracking-[-0.01em]` (mono 14px).
- Indicator: text glyph `+` — `text-lg leading-none text-foreground/50`. No chevron icons.

### 5.6 Links
| Context | Classes |
|---|---|
| Nav | `underline underline-offset-8` (+ `decoration-2` when active) |
| Inline, mono context | `underline underline-offset-2 decoration-foreground/20 hover:decoration-foreground/5` |
| Article body | `text-link underline hover:decoration-2 inline-flex items-center gap-1` (color `#595959`), external ones carry a small inline icon |

### 5.7 Article header (metadata block)
```
h1: text-5xl md:text-6xl font-serif leading-tight text-balance mb-6
meta grid: grid md:grid-cols-[120px_1fr] gap-0.5 font-mono text-sm
   "Published" / "January 16, 2025"
   "Email"     / underlined mailto link
```
Followed by a row of buttons (§5.4) for Paper / code links.

### 5.8 Article body
- `font-sans` (Source Sans 3) `text-lg` (18px), `leading-relaxed`, paragraphs `mb-4`.
- Subheads: `h3` `text-2xl font-normal mt-12 mb-4` (sans, not serif).
- Figure captions: `text-xs italic font-mono px-2 mt-10 text-center`.
- Code blocks: `bg-white font-mono border-2` (double-line inset feel), square corners.

### 5.9 Footer
```
<footer>
  <div class="max-w-3xl w-full mx-auto flex justify-between py-6 items-baseline border-t border-black mt-12">
    <p class="font-serif text-lg">Wordmark</p>
    <div class="flex gap-4">…nav links (underline underline-offset-8)…</div>
  </div>
</footer>
```

---

## 6. Iconography

- Almost none. The site prefers **text glyphs** (`+`, `𝕏`, `π`) and small emoji (🤗) over icon fonts.
- Where SVG icons appear (external-link arrows, GitHub mark) they are 14–16px (`size-4`), single-color, inline with text.
- Timeline dots and diagram marks are plain colored squares.

---

## 7. Motion

- `transition-all` / `transition-colors` with default duration (150ms) only.
- Hover = shadow grows, border darkens, background lightens. No scale, no fade-ins, no scroll animations.
- Buttons physically depress: `active:translate-y-0.5` + shadow removal.

---

## 8. Tailwind CDN config used by the component library

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          background: '#F5F4EF',
          'background-hover': '#EBEAE5',
          foreground: '#000000',
          muted: '#E5E4DC',
          'muted-foreground': '#686868',
          link: '#595959',
          button: { DEFAULT: '#D9D8D3', hover: '#C4C3BB', foreground: '#403E37' },
          divider: '#E5E4DC',
          'card-border': '#D4D3CB',
          'card-border-hover': '#C0BDAD',
          highlight: '#FBD45B',
        },
        fontFamily: {
          serif: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
          mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
          sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        },
        boxShadow: {
          card: '3px 3px 0px #000000',
          'card-hover': '5px 5px 0px #000000',
          'card-soft': '3px 3px 0px #C0BDAD',
          btn: '2px 2px 0px #403E37',
        },
      },
    },
  };
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
```

Base body classes: `bg-background text-foreground font-mono text-sm leading-5 antialiased`.

---

## 9. Component library

See `./components/`:

| File | Contents |
|---|---|
| `index.html` | Gallery of all components |
| `site-header.html` | Wordmark + tab-underline nav |
| `typography.html` | Full type scale specimens |
| `timeline-feed.html` | Timeline with all 3 card tiers |
| `cards.html` | Featured / boxed / plain cards in isolation |
| `buttons.html` | Buttons with dashed keyline, icon variants |
| `links.html` | All 3 link styles |
| `accordion.html` | Plus-glyph accordion (native `<details>`) |
| `article-header.html` | Serif title + metadata grid + action buttons |
| `article-body.html` | Long-form prose specimen |
| `footer.html` | Footer bar |
