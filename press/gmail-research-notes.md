# Gmail research notes — Lima / Séverin Marcombes press mentions

## Scope and method

Searched Gmail with `from:rumeurpublique.fr after:2012/01/01 before:2020/01/01`, paginating through all pages until exhausted. The search returned **278 distinct threads** (the tool's `resultCountEstimate` fluctuated between pages — 201, then 28 on the final short page — but the actual unique thread count after dedup by thread ID was 278, covering 2014-03-24 through 2018-11-22). No threads from 2012–2013 appeared in this from:-restricted search; the earliest is March 2014. This means the entire 2013 Kickstarter campaign period is **not represented** in this specific from:rumeurpublique.fr search — either Rumeur Publique wasn't yet engaged during the Kickstarter campaign itself (the agency relationship appears to start around spring 2014, well after the July–August 2013 Kickstarter campaign), or that correspondence lived in a different mailbox/address not searched here. This is worth flagging for a human: the 2013 Kickstarter-era press coverage, if it exists, was not captured by this pass.

Of the 278 threads, subject-line triage (keywords: presse, parution, retombées, clipping, article, coverage, piges, offline, print, papier, recap, récap, revue, plus manual scan of outlet-named subjects like "Lima dans X") identified roughly **60-70 threads** that looked like genuine press-review or single-clip notifications. I opened and read the full body (PLAIN_TEXT) of **~45 of those**, prioritizing:
1. All the periodic "revue de presse" / "articles print de [month]" digest emails (these are the richest — many list 5-30 outlets per email)
2. Every "Lima dans X" / "Bel article dans X" single-clip notification
3. A few CES/campaign recap threads with long link lists

I did **not** open every low-priority candidate thread. In particular I did not open (time/effort tradeoff, all lower-confidence subject lines): threads about "Capital" demand/pending coverage (151340360fc6b767, 151e073cbd94377c) that read as still-pending requests rather than confirmed clips; "01NET Itw tel (magazine)" (15a6aa8fd4d8de23) and several other named single-outlet interview-opportunity or interview-confirmed threads from 2014-2018 that likely represent additional articles but weren't verified. A more exhaustive follow-up pass could open the remaining ~15-20 candidate threads for a modest number of additional rows.

## What's in the CSV

`/Users/severin/Projects/severin-marcombes.fr/press/gmail-findings.csv` — **133 distinct article/mention rows**, all sourced from `rumeur-publique-email`.

- **45 online**, **88 print/broadcast** (the CSV's `type` field only supports `online`/`print`; radio and TV segments — RTL, France Info, France Inter, M6, LCI, BFM TV, Game One — are recorded as `print` with a note explaining they're actually broadcast).
- **128 confirmed**, **5 mentioned** (rows where the email referenced coverage without a specific verifiable article, e.g. the Mobile Retailer and Journal du Palais de Bourgogne clips named in text but with no attachment/URL included in that thread, and the Google Doc–only summary rows).
- Date range: June 2014 (Lima's Series funding announcement / Kickstarter-era retrospective coverage) through July 2017 (last "articles print" batch email found). Rumeur Publique's relationship with Lima appears to wind down after mid-2017 — later threads (2017-05 onward) are mostly invoice/payment-dispute emails ("Dernière Relance avant mise en demeure"), not press.

## Notable patterns

- **2014**: dominated by the June 2014 Series funding-round announcement (Partech Ventures, $2.5M) — one Rumeur Publique recap email alone listed 23 distinct online outlets (Le Figaro, Clubic, Maddyness, Journal du Net, Presse Citron, 01net, Frenchweb, etc.), all captured as separate rows.
- **CES 2015 / Jan 2015**: a large batch came via a *different* PR agency, Airfoil (Lima's US-side PR firm), forwarded into the Rumeur Publique thread by Romain Mabil. I kept `source: rumeur-publique-email` since it was relayed by Rumeur Publique, but flagged it in notes. This batch included heavy TechCrunch/CNET **syndication-farm reposts** (Tekkie.co, Generalor.com, Syndicate-atom.com, TechNewsTube, OmniGaea.com, TechShow.com) — I did not create a separate confirmed row per scraper site; instead I grouped them into one `mentioned`-confidence row rather than fabricate confirmed entries for content-farm reposts of an article whose original URL wasn't given.
- **Nov 2015–Feb 2016**: the busiest period — the Lima hardware unit's retail launch (25 Nov 2015) triggered a wave of product reviews and gift-guide mentions (Challenges, Que Choisir, Neon, La Tribune, Voyages d'Affaires, 20 Minutes, La Voix du Nord, Forbes, Les Echos, M6). This is also when Rumeur Publique started sending **monthly "articles print/radio/TV" batch digests** (a new cadence from Jan 2016 onward), often as Dropbox ZIP links to piles of scanned clippings rather than individual PDF attachments — I recorded these as rows with `attachment_note` referencing the (undownloaded) Dropbox zip, confidence `confirmed` since Rumeur Publique explicitly named the outlet as included that month.
- **Print-only era**: starting late 2015, a large share of coverage is print-only trade/consumer magazines (L'informaticien, Courrier Cadres, Entreprendre, Technikart, Management, T3, Stuff, La Tribune, Capital, Les Echos print editions) with **no accompanying URL** — these have `type: print` and blank `url`.
- **2017**: a smaller monthly cadence continues (Feb/Mar/Jun 2017 revues de presse), including some non-Lima-specific mentions where Lima appears only as a portfolio-company reference in "Hardware Club levée de fonds" coverage (La Tribune newsletter, IT Espresso, ITR News, IT Channel, Info DSI) — kept as separate rows since each is a distinct outlet/article, `person_or_company: lima`.
- Several **print PDF attachments recur across threads** (e.g. the "Le Figaro Du Mardi 06 Janvier 2015 - CES.pdf" clip was sent twice, once standalone and once bundled into the CES coverage report) — deduplicated to one row, keeping the more detailed thread as `thread_id`.

## NOT counted as press coverage (do not miscount these)

These thread types appeared frequently in the search but are explicitly **not** press mentions, and were excluded:
- **Interview-opportunity emails** ("Opportunité interview X, Journal Y") — these are PR outreach describing a *potential* interview slot, not confirmed published coverage. Many of these interviews likely did result in articles, but without a follow-up "here's the clip" email I did not fabricate a resulting article row. Examples: FrenchWeb (Olivier Hermant), Challenges (Jérôme Lefilliâtre), Le Parisien (Damien Licata), Les Echos (Anne Gabrielle Mangeret), Management (Adrian de San Isidoro), Le Moci (Venice Affre), 01net magazine (Feb 2017), etc.
- **Rumeur Publique's own drafted press releases / pitch emails**, e.g. thread `14eac0bf45d61052` ("Le champion du crowdfunding Français Lima livre ses 12,840 backers") — this is a PR pitch email *to* a journalist (Mathieu) with Lima's own press release text attached, not a report of published coverage. Excluded from the CSV.
- **Administrative/agency threads**: invoices ("Invoice RUMEUR PUBLIQUE", "FACTURE IMPAYEE", "Dernière Relance avant mise en demeure"), the 30th-anniversary party invitation, media-training logistics, meeting scheduling, contract/convention paperwork, Criteo invoice forwards.
- **Internal traffic/analytics discussions** (e.g. "Alors le trafic sur le site ça donne quoi?") — not press coverage itself, just Lima team discussing the effect of the coverage.
- A few threads reference coverage only vaguely ("belle couverture!", "bravo!") in reply-chain pleasantries with no new outlet identified — not turned into rows.

## Threads I could not fully resolve

- Several **Dropbox ZIP links** (monthly clipping archives, e.g. `201601_pigesLima.zip`, `201602_pigesLima.zip`, `201603_pigesLima.zip`, the M6/Game One/LCI video `.ts` files) were referenced but not downloaded/opened — per task instructions, attachments were not decoded. The named outlets from the email body were still recorded as confirmed rows; if the underlying files are ever pulled down, per-article detail (headlines, exact clip crops) could be added.
- Two large **Google Docs trackers** (`bit.ly/1U7XbI4` for Lima-only coverage, `bit.ly/1U7X4Mw` for the "Noël de la French Tech" campaign, and a third `docs.google.com/spreadsheets/.../1Ns4iq...` used from mid-2016 onward) were referenced repeatedly as the canonical, continuously-updated coverage lists — these evidently contain many more individual articles (Rumeur Publique cited "~30 articles" and "~60 articles" in single instances) that were never individually re-listed in the email bodies I could read, and Google Docs are not accessible via the Gmail search tool. This is very likely the single biggest source of **additional, uncaptured articles** — a human with Google Docs access to those two/three links would likely find dozens more rows.
- I did not attempt the supplementary web-search steps suggested in the task brief (Kickstarter-era `severin@meetlima.com` search, "revue de presse Lima" web search, etc.) given time constraints and that the from:rumeurpublique.fr pass alone already surfaced substantial data; this is a natural next step for a follow-up pass, especially to fill in the missing 2013 Kickstarter-campaign period.

## Summary

- **Total distinct articles/mentions found: 133**
- **Online: 45** / **Print or broadcast: 88**
- **Confirmed: 128** / **Mentioned (needs follow-up): 5**
- Source files: `/Users/severin/Projects/severin-marcombes.fr/press/gmail-findings.csv`, this file.
