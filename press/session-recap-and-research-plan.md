# Personal website + CV — handoff and research plan

Reviewed 14 September 2026 against the local Claude transcript and current files.

## Session located

- Title: **Personal website + CV** (formerly **Portfolio restructuring by thesis**).
- Session ID: `880fec0c-0231-47c0-81f5-47a7f77b6735`.
- Transcript: `/Users/severin/.claude/projects/-Users-severin-Projects-severin-marcombes-fr/880fec0c-0231-47c0-81f5-47a7f77b6735.jsonl`.
- Last recorded response: 14 September 2026, 11:29:55 UTC, weekly usage limit.
- Website branch on inspection: `feat/theses`. Latest commit: `d83305b` (`Working on press`). Numerous press changes were already staged before this handoff.

## Work that was not finished

1. **Final press-page visual review and commit.** The session had built 32 cards and 13-language title translations and verified title switching and restoration. It stopped immediately before the final visual/Arabic layout review. The redesign, OG card, CSS cache-busting changes and translations remained uncommitted. A full disk briefly blocked staging, but the transcript subsequently reported 3.2 GiB free; its final blocker was the weekly limit, not disk space. Deployment was expressly deferred by the user, so this is an intentional hold rather than a failed task.
2. **Ars Technica coverage.** The user explicitly requested it alongside a ZDNet article. ZDNet was added; no Ars Technica row exists. The later additions were ZDNet, Rude Baguette and J’aime les Startups, not Ars Technica.
3. **ForgetBox coverage.** The final request was for the earlier product, especially articles naming Séverin. Only one earlier file-transfer product profile had been added; the Rude Baguette addition was about the Plug hardware Kickstarter. This handoff adds six verified supplied references, with the 2013 Maddyness Plug piece tagged separately as also Lima-related. Eight unverified references are held in `forgetbox-pending.md`, outside the master dataset and public page, following the user's latest instruction.
4. **Layouts.dev / Keychains mentions and videos.** The old search excluded directories, founder launch posts and aggregators. Its lack of editorial results did not establish lack of mentions. The video pass found no confirmed video and could not inspect the X timeline. Both remain open research tracks under the broader brief.
5. **Press archive gaps.** The PR-email pass listed 278 threads but read roughly 45 selected threads. It did not open the canonical Google Docs trackers, download the monthly Dropbox clipping ZIPs or retrieve print/broadcast attachments. Follow up `bit.ly/1U7XbI4`, `bit.ly/1U7X4Mw` and the mid-2016 tracker recorded in the emails. The 2013 Kickstarter period needs additional searches beyond the `from:rumeurpublique.fr` filter. Existing `mentioned` records need verification; some older `confirmed` flags mean an agency email reported publication, not that the actual clipping was inspected. See `gmail-research-notes.md` and `web-research-notes.md`.
6. **CV consistency and factual review.** The OpenAI CVs were produced, including the general two-page OpenAI version; they were not left unwritten. The Thinking Machines Markdown still lists Interagentic as a 2025–present employer and Creative Robots as ending in 2025, contradicting the agreed company/product framing. The CV README retains checks for dates and factual claims. The Layouts token-savings benchmark was proposed, never completed; configured reliability thresholds must not be described as observed adoption or production reliability. A visual check of the regenerated Thinking Machines PDF was also left to the user.

Earlier suggestions to change hiring copy, project status labels, naming or project domains were recommendations, not completed commitments. Do not automatically implement them. Preserve the session's instruction not to identify the buyer of the sold domain.

## Search plan: articles and even brief mentions

### 1. Establish product identity and search vocabulary

Use exact domains first to avoid generic CSS layouts and physical/security keychain results. Capture historical names, handles, repository/package URLs and launch dates from each product's own pages and existing launch posts. Use `Layouts.dev`, `layoutsdev`, `Keychains.dev`, `keychain.dev`, Séverin/Severin Marcombes and Creative Robots. Treat singular `keychain.dev` only as a search alias until identity is established. Do not assume all products with similar names belong to Séverin.

### 2. Run broad discovery without the old editorial-only exclusion

Start with `"layouts.dev" -site:layouts.dev` and `"keychains.dev" -site:keychains.dev`, then repeat with founder/handle variants. Search combinations with review, tutorial, demo, walkthrough, newsletter, podcast, interview, avis, présentation and tutoriel. Search headlines and distinctive product taglines to find mentions that omit the domain. Repeat with date ranges around verified launches; keep a query log, including no-result searches.

### 3. Follow these initial leads

These are search leads, not additions to the public press page. Open and inspect each source before promoting a record; determine whether its author is independent, a founder, a directory or a syndicator.

| Product | Lead | Initial classification |
| --- | --- | --- |
| Layouts | [SoftRankings LinkedIn article](https://www.linkedin.com/pulse/layoutsdev-notebook-interfaces-turns-tailwind-shadcnui-flow-6goef) | Article-style product overview; search result dates it 18 September 2025. Check provenance and editorial substance. |
| Layouts | [BetaList](https://betalist.com/startups/layouts-dev) | Launch/directory feature; result displays 9 October 2024. |
| Layouts | [Product Hunt](https://www.producthunt.com/posts/layouts-dev) | Founder launch plus user comments/reviews; examine gallery and outbound links. |
| Layouts | [Reddit SideProject discussion](https://www.reddit.com/r/SideProject/comments/1fv33gk) | Founder launch with possible third-party reactions and demo links. |
| Layouts | [Reddit alphaandbetausers discussion](https://www.reddit.com/r/alphaandbetausers/comments/1gjk7ym) | Founder launch; inspect comments and attachments. |
| Keychains | [Product Hunt](https://www.producthunt.com/products/keychain-dev) | Product listing under singular URL slug; founder launch and comments. |
| Keychains | [Reddit OpenClawDevs discussion](https://www.reddit.com/r/OpenClawDevs/comments/1r9z0ei/ive_built_keychains_a_way_to_add_6754_apis_to/) | Founder announcement; inspect responses and video links. |
| Keychains | [HaloTool](https://halotool.com/tool/keychains-dev) | Directory profile. |
| Keychains | [ProductDirs](https://productdirs.com/projects/keychains-dev) | Directory profile. |
| Keychains | [AItoolnet](https://www.aitoolnet.com/keychainsdev) | Directory profile. |
| Keychains | [SaaSHub](https://www.saashub.com/keychains-dev) | Directory/reviews lead; distinguish actual reviews from generated description. |

### 4. Search video and community sources directly

Use platform-native YouTube search as well as web `site:youtube.com` queries for both exact domains, product aliases and founder name. Inspect descriptions, captions/transcripts and chapters for short mentions inside larger tool roundups; save a timestamp and the identifying excerpt for every video hit. Search X, LinkedIn, Reddit, Hacker News, Indie Hackers, newsletters/Substack, podcasts and Loom/Vimeo. Follow links from Product Hunt galleries, founder posts and third-party replies. Use available signed-in browser access where necessary; do not treat a blocked timeline as evidence of absence. No posting or outreach is needed.

### 5. Verify, classify and deduplicate

For each candidate, capture canonical URL, outlet/author, exact title, published date (leave unknown if absent), product, source category, founder-name mention, short supporting excerpt or video timestamp, verification date, and accessibility/archive status. Separate independent editorial coverage, brief third-party mentions, institutional posts, founder announcements, community reactions and directory/package listings. Keep reposts linked to one original; count comments separately only when they contain substantive additional evidence. A fetchable page with no matching product evidence does not count as verified.

For dead pages, seek a specific archived snapshot or a credible contemporaneous reference. Record a secondary reference as such; never present it as the missing original. Keep unresolved leads in research notes, outside `articles.csv` and the public page per the latest instruction.

### 6. Deliver and publish locally

Produce a ranked findings list with evidence: strongest independent pieces first, then worthwhile brief mentions and videos, then directories/founder launches. Add only verified, relevant records selected for the page, with original titles and all 13 pre-translations. Rebuild and check the site. Stop the discovery pass after the source categories above and two successive query-expansion rounds yield no new unique verified mentions; document access gaps rather than claiming exhaustive absence. Deployment stays deferred.
