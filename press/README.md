# Press — working folder

Not published. Source data for the `/press/` page on severin-marcombes.fr.

## Files

- `articles.csv` — the master list. One row per article/mention.
  Columns:
  - `id` — short slug, unique (e.g. `2013-09-techcrunch-lima-kickstarter`)
  - `date` — `YYYY-MM-DD` (or `YYYY-MM`/`YYYY` if that's all that's known)
  - `publication` — outlet name
  - `title` — article headline, as published
  - `url` — live URL if online; blank if print-only or the URL is dead
  - `type` — `online` or `print`
  - `language` — `en`, `fr`, etc.
  - `person_or_company` — `severin-marcombes`, `lima`, or both (`;`-separated)
  - `source` — how we found it: `web-search`, `rumeur-publique-email`, `direct`
  - `thread_id` — Gmail thread id, if found via a Rumeur Publique press-review email
  - `attachment_note` — filename of a print clipping attached to that email, if any (not yet downloaded)
  - `confidence` — `confirmed` (we've seen the actual article/clipping) or `mentioned` (referenced in an email/list but not yet verified)
  - `notes` — anything else worth keeping (e.g. "clipping only, not online", "byline vs. company mention")

- `archive/online/` — local copies of online articles worth preserving in case the source goes down (empty for now — add PDFs/screenshots as `<id>.pdf` or `<id>.png`).
- `archive/print/` — scanned/PDF print clippings, named `<id>.pdf`. Several are still sitting as Gmail attachments (see `attachment_note` in the CSV) and haven't been pulled down yet.

## Provenance

Two sources, both logged in `source`:
1. **`rumeurpublique.fr` emails**, 2012–2019 — Lima's PR agency (Rumeur Publique) sent periodic press-review emails during the Kickstarter campaign and afterward. These are the best source for **print** mentions, which don't otherwise show up in a web search.
2. **Web search** — for online coverage, including anything from before/after the agency relationship and any more recent mentions.

## Status

Being assembled. `confidence: mentioned` rows need a human check (open the thread / find the actual article) before they're solid enough to put on the public page.
