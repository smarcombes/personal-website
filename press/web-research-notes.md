# Web press research notes — Séverin Marcombes / Lima / Creative Robots

Run 2026-09-14. Output: `web-findings.csv` (23 rows: 19 confirmed, 4 mentioned). No rate-limit errors encountered; all planned searches completed.

## Queries run

1. `"Séverin Marcombes" Lima` / `"Severin Marcombes" Lima Kickstarter` — core hits: Maddyness, Innovators Under 35, So Digital.
2. `Lima Technology Kickstarter personal cloud storage` — general campaign coverage (Crowdfund Insider, SLR Lounge, American Entrepreneurship Today).
3. `"meetlima.com" OR "meet Lima" Kickstarter` — mostly Lima's own press.meetlima.com press-release mirror (used only where no independent outlet URL could be verified, e.g. the CES award release).
4. Outlet-specific `site:` searches:
   - `site:techcrunch.com` — **5 solid hits**, all confirmed (2013 Kickstarter surge, 2014 Partech raise, 2015 CES app demo, 2015 shipping, 2016 Lima Ultra). TechCrunch is by far the strongest single-outlet coverage.
   - `site:theverge.com`, `site:engadget.com`, `site:wired.com`, `site:forbes.com`, `site:pcworld.com`, `site:mashable.com`, `site:cnet.com` — **nothing found**. These major outlets appear not to have covered Lima at all, or it's not indexed/searchable.
   - `site:01net.com`, `site:numerama.com` — nothing found.
   - `site:frenchweb.fr` — 2 hits (Partech raise, MIT Innovators Under 35 mention), both confirmed.
   - `site:usine-digitale.fr` — 2 hits (portrait slideshow card, Partech raise); portrait card confirmed only via search snippet (403 on fetch), Partech piece 403'd on fetch too (mentioned).
   - `site:challenges.fr`, `site:latribune.fr`, `site:lesechos.fr` — nothing found in these searches.
5. `MIT Innovator Under 35 2015 Marcombes` — confirmed official profile page, plus FrenchWeb, Usine Digitale, and Industrie & Technologies coverage of the same 2015 France cohort.
6. `CES Innovation Award Lima storage` — confirmed 2015 CES Innovation Awards Honoree (two categories); only reachable via a 403'd Business Wire URL and a mirrored press.meetlima.com copy of the same release (logged as "mentioned").
7. `"Huawei Pulse" contest Lima Marcombes` / `Pulse Contest gagnants Lima` — confirmed via Clubic: Lima placed 3rd in the Connected Objects category plus a press special prize (2014).
8. `Futur en Seine 2014 Lima gold medal` — confirmed via 3DVF's festival results roundup (Jury Prize gold, June 2014).
9. Recent work: `Creative Robots layouts.dev`, `Interagentic Marcombes`, `Keychains.dev Marcombes`, `keychains.dev launch press TechCrunch/VentureBeat/Product Hunt` — **no independent editorial press coverage found** for any of Creative Robots, Layouts.dev, Interagentic, or Keychains.dev. Only self-published/aggregator sources turned up: Crunchbase, Tracxn, Product Hunt (his own listing), BetaList, G2, RocketReach, LinkedIn/X profiles, GitHub. None of these qualify as editorial press per the task's exclusion rules, so none were added.
10. Generic `"Séverin Marcombes"` and `"Severin Marcombes"` alone, plus `2023/2024/2025 article news`, `podcast/interview AI agents` — turned up only profile/directory pages (Crunchbase, Comparably, Verif.com, Innovators Under 35, LinkedIn, X, GitHub, startupluxembourg directory) and one YouTube video (local "Ma Pub Ici" contest, not really editorial coverage of Lima/Séverin — skipped as it's a promotional local-ad contest listing, not press).

## Shutdown coverage (2019)

Good, independent French-outlet coverage of Lima's 2019 closure: MacGeneration, Next (ex-NextINpact), Rude Baguette, and Clubic all ran their own pieces (not syndicated wire copy), each confirmed by direct fetch. All quote Marcombes' same public statement about "problèmes de financement," consistent across outlets — this is the best-documented single event in Lima's press history besides the original 2013 Kickstarter campaign.

## Things found but not included

- **Huffington Post feature on Marcombes** ("why consumers are making their own clouds") — referenced by a Lima-owned Medium post (`medium.com/meet-lima/...`), but the actual live HuffPost URL could not be located via search, so it was left out per the no-guessed-URL rule. Worth a follow-up direct search on HuffPost's site if this is wanted.
- **BPI France profile** ("Séverin Marcombes invente le « cloud » à domicile !") — found via search, but WebFetch returned HTTP 403 and I could not extract enough of a specific quote from the snippet to log it responsibly (the search snippet only echoed data already captured elsewhere). Skipped rather than logged as a weak duplicate.
- **bonusnachos.com "Lima's Clouds Have Silver Linings"** — false positive, a 2024 travel blog about a trip to Lima, Peru. Not related.
- Generic Kickstarter "most funded of all time" listicles (Time, Inc., ReferralCandy, Hyperstarter, etc.) were checked but did not specifically name Lima in the retrieved text, so excluded — except Crowdfund Insider's "50 Biggest Kickstarters" piece, which does name Lima specifically and counts as real editorial coverage from a trade outlet.
- Product Hunt, Crunchbase, Tracxn, RocketReach, Comparably, GitHub, LinkedIn/X profile pages — all excluded per task instructions (own properties / aggregators, not press).

## Overall read

**Lima (2011–2019) has substantial, real editorial press**, concentrated in two moments:
1. **The 2013 Kickstarter campaign and its 2014–2016 aftermath** — TechCrunch covered it start to finish (5 separate pieces over 3 years), and French tech/business outlets (Maddyness, FrenchWeb, Usine Digitale/Usine Nouvelle/Industrie & Technologies, Journal du Geek, So Digital, ITespresso, Les Objets Connectés) ran founder interviews and milestone pieces. This is genuine campaign-cycle-plus coverage, not just launch-day noise — outlets followed up years later (the 2015 shipping delay, the 2016 Lima Ultra relaunch, the 2016 "where are they now" piece).
2. **The 2019 shutdown** — four independent French outlets covered the closure on their own, not just re-running a press release.

Coverage from major English-language consumer tech press beyond TechCrunch (Verge, Engadget, Wired, CNET, Mashable, PCWorld, Forbes) appears to be **absent or unfindable** via search — this is a real gap, either because those outlets genuinely skipped it or because search indexing/site: operators aren't surfacing older (2013–2016) archived pieces. Given TechCrunch alone ran 5 pieces, it's plausible some of these other outlets covered it too but the coverage isn't surfacing in search; a manual site-search or Wayback Machine check of Verge/Engadget/CNET archives around Sept 2013 could be a worthwhile follow-up if more completeness is wanted.

**Séverin Marcombes' recent work (Creative Robots / Layouts.dev / Interagentic / Keychains.dev, 2021–now) has essentially no independent editorial press** found. The only qualifying piece is Maddyness's September 2022 "ten years later" retrospective, which mentions Creative Robots in passing as his new venture. Everything else surfaced for the recent ventures was self-published (Product Hunt, own landing pages, X/LinkedIn posts) or directory/aggregator listings (Crunchbase, Tracxn, BetaList, G2, RocketReach) — none of which meet the task's press bar.

**Confidence breakdown:** 19 confirmed (directly fetched and read), 4 mentioned (search-snippet only, due to HTTP 403 blocks on Business Wire, Usine Digitale, L'Usine Nouvelle, and Industrie & Technologies — all real outlets, just not fetchable by this tool).
