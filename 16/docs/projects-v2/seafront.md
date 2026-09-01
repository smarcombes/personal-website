# Why — startups need someone who can go from idea to shipped

## The pains
- A startup has an idea and momentum, but no one who can take it all the way from strategy to a working product.
- Business model, product definition, and delivery usually live in three different people (or three different agencies).
- 0-to-1 is the riskiest, least templated part of building — and the easiest to get wrong.

## The underlying design problem

Most agencies plug in at one layer: strategy decks *or* design *or* engineering. But an MVP lives or dies on the seams between those layers — the business model has to survive contact with the product, and the product has to survive contact with shipped code. SeaFront (2019–2022) was a solo-operated boutique built to own the whole span: start on business model and strategy, move into product definition, then deliver the first real version.

The context: it was the "time off" I took after the Lima years — which turned into a lot of 0-to-1 fun across very different domains.

# Design decisions

## The ideal
- **Own the full arc.** Strategy → product definition → shipped MVP, so nothing is lost in a handoff.
- **Business model through shipped code.** The deliverable is a working product, not a document.
- **Stay boutique and solo-operated.** Depth on a few 0-to-1 bets over breadth.
- **Pick hard, real problems** — physical devices, production platforms, embedded hardware — not just landing pages.

## How it worked

Engage clients on business model and strategy first, then define the product, then build and deliver v1. Some engagements were operated on an ongoing basis (running the feature/service after launch), not just handed off.

# The tech onion

The layers here are the range of stacks the work spanned:

1. **Device / OS** — *Adok Meetings* (2019): the OS for a smart meeting-room touchscreen. Touch-first UI with voice commands, able to open any web app and run video conferences while interacting with business SaaS, plus a (pre-AI, clunky-but-working) end-of-meeting action recap.
2. **Cross-platform apps + fleet backends** — *EzDrive* (2021–2022): a full EV-charging platform in production, ~2.4M LOC — React Native + React DOM apps to find and control charging stations, a fleet backoffice, and a documented REST API.
3. **Integrations into legacy ecosystems** — *QuickBooks France export* (2021): an owned, operated feature letting users export their data to all major French legacy accounting software, integrated directly into QuickBooks.
4. **Apps + embedded IoT hardware** — *Busea* (2019–2022): a bus-ticketing platform in Ecuador, ~3.4M LOC across React Native + web + embedded hardware, selling up to ~4k tickets/month.
5. **Analytics / growth + mentoring** — assorted analytics, marketing and tracking software, plus tech & marketing mentoring (ESCP Europe and others).

## The hard parts
- Context-switching across wildly different domains and stacks, solo.
- Shipping and *operating* real production systems (millions of LOC, physical hardware) without a standing team.

## The good parts
- Enormous range: OS work, production platforms, legacy integrations, embedded IoT — all genuine 0-to-1.

# Recognition
- **Bill Gates** saw *Adok Meetings* at CES and asked for a personal demo of it. ([Product video](https://www.youtube.com/watch?v=iLVEbixkdfk))
- Production scale as its own proof: EzDrive (~2.4M LOC) and Busea (~3.4M LOC, up to ~4k tickets/month) both ran in the real world.
