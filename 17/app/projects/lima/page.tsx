import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { A } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["lima"];
export const metadata: Metadata = {
  title: `${meta.title} — Séverin Marcombes`,
  description: meta.tagline,
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
      {children}
    </p>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-[1.35rem] md:text-[1.55rem] leading-[1.45] text-pretty mt-6 mb-10">
      {children}
    </p>
  );
}

function Byline({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-muted-foreground border-y border-divider py-3 mb-12 tracking-wide">
      {children}
    </p>
  );
}

function Chapter({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[1.75rem] md:text-[2rem] leading-tight mt-20 mb-6 text-balance">
      {children}
    </h2>
  );
}

function Graf({
  children,
  dropCap = false,
}: {
  children: React.ReactNode;
  dropCap?: boolean;
}) {
  return (
    <p
      className={
        dropCap
          ? "mb-7 text-[1.125rem] leading-[1.75] first-letter:float-left first-letter:font-serif first-letter:text-[4.25rem] first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:font-medium"
          : "mb-7 text-[1.125rem] leading-[1.75]"
      }
    >
      {children}
    </p>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-14 md:my-16 border-y border-foreground py-8 md:py-10">
      <p className="font-serif text-[1.65rem] md:text-[2.15rem] leading-[1.25] text-balance text-center italic">
        {children}
      </p>
    </blockquote>
  );
}

function Figure({
  src,
  alt,
  caption,
  wide = false,
}: {
  src: string;
  alt: string;
  caption: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <figure className={wide ? "my-12 -mx-0" : "my-12"}>
      <div className="border border-divider bg-muted overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={wide ? 1600 : 1000}
          height={wide ? 1000 : 1000}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function Pair({
  left,
  right,
}: {
  left: { src: string; alt: string; caption: string };
  right: { src: string; alt: string; caption: string };
}) {
  return (
    <div className="my-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[left, right].map((photo) => (
        <figure key={photo.src}>
          <div className="border border-divider bg-muted overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={800}
              className="w-full h-auto object-cover aspect-square"
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Shell active="home" maxWidth="max-w-2xl">
      <article>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 decoration-foreground/20 hover:text-foreground"
        >
          ← Home
        </Link>

        <header className="mt-10">
          <Kicker>Recollection · Paris · 2011–2019</Kicker>
          <h1 className="font-serif text-[2.75rem] md:text-[3.75rem] leading-[1.05] tracking-[-0.02em] text-balance">
            Lima Technology
          </h1>
          <Lede>
            Notes on building a personal cloud: liquid storage, no sync, private
            by design — and what it cost to try.
          </Lede>
          <Byline>
            By Séverin Marcombes · Founder &amp; CEO, Lima Technology
          </Byline>
        </header>

        <div className="font-sans">
          <Graf dropCap>
            Between 2011 and 2019 I founded and ran Lima — a company that tried
            to redesign personal file storage from first principles. We built a
            peer-to-peer filesystem, a zero-setup NAS dongle, and clients for
            every major platform. The company is gone. What follows is a
            recollection of the problem we were chasing, the bets we made, and
            how the road actually went.
          </Graf>

          <div className="my-14 border border-divider bg-black overflow-hidden">
            <div className="relative w-full aspect-video">
              <iframe
                src="https://player.vimeo.com/video/127921141?title=0&byline=0&portrait=0"
                title="Discover Lima"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="px-3 py-2.5 text-[11px] text-muted-foreground font-mono bg-background border-t border-divider">
              The product film —{" "}
              <A href="https://vimeo.com/127921141">Discover Lima</A>, 2015.
            </p>
          </div>

          <Chapter>The problem, as I saw it then</Chapter>
          <Graf>
            In 2011, personal storage still mirrored the hardware underneath it.
            Every device was a shoebox: your Mac had its drive, your PC had
            another, your phone a third. To have the same things in two places,
            you copied files by hand and hoped the organization stayed identical.
            Buy another drive, a cloud bucket, a Dropbox plan — each one was just
            another shoebox.
          </Graf>
          <Graf>
            Sync products papered over a corner of that mess. They let you keep a
            folder the size of a USB key roughly in sync — not your whole life.
            And they asked you to rent your files to someone else&apos;s servers,
            at a moment when privacy anxiety around cloud storage was still very
            real.
          </Graf>

          <PullQuote>
            The files were mine. I didn&apos;t want to rent them.
          </PullQuote>

          <Graf>
            The pains were mundane and everywhere: storage was a mess; sync was a
            pain; backup was never something you wanted to think about. Cloud sync
            covered a small folder — not the shape of a real library. I wanted my
            files across my devices without handing them over.
          </Graf>
          <Graf>
            Meanwhile the ingredients for something better already existed:
            decentralized filesystems, fast home internet, ubiquitous Wi-Fi. The
            constraint wasn&apos;t physics. It was that software still pretended
            each hard drive was a separate universe.
          </Graf>

          <Figure
            src="/lima/device-branded.jpg"
            alt="The original Lima dongle, held in hand"
            caption={
              <>
                The original Lima — imagined in Paris, assembled in China. Plug
                it into your router, attach a drive: that was the whole setup.
              </>
            }
            wide
          />

          <Chapter>What we believed the answer looked like</Chapter>
          <Graf>
            We were opinionated about the end state. Three principles guided
            everything. <em>One storage space:</em> N devices should show the
            same files, regardless of OS or capacity — a file on my Mac desktop
            should be on my Windows desktop too. <em>Liquid capacity:</em> buying
            a hard drive should expand the space available to you, not hand you
            another silo to sync into. <em>Location as a choice:</em> prefer
            cloud? Plug in a bucket. Prefer privacy at home? Plug in a drive.
            Same system either way.
          </Graf>

          <PullQuote>
            Buying a hard drive should expand the space available to you — not
            hand you another silo.
          </PullQuote>

          <Graf>
            The architectural move was to split presentation from storage. Every
            device showed the same tree — the full set of files and folders —
            whether or not the bytes lived locally. &quot;Transferring&quot; a
            file between devices became mostly metadata: a name, a size, a
            pointer to where the content could be fetched. That made the UI feel
            instant, even when the payload hadn&apos;t moved yet.
          </Graf>
          <Graf>
            The source of truth was a backend pool — one or more NAS devices
            and/or cloud buckets — holding every file, replicated so we could
            survive failures. Each device&apos;s local disk was only a cache: it
            kept what you were likely to open next. Cached files behaved like
            local ones; the rest streamed in. Devices cooperated — a fully
            decentralized mesh — when you reached for something that wasn&apos;t
            already nearby.
          </Graf>
          <Graf>
            If that sounds a little like what iCloud Drive does today: yes. We
            were shipping a cross-platform version of that idea years earlier,
            without putting the canonical copy on our servers.
          </Graf>

          <Pair
            left={{
              src: "/lima/device-logo.jpg",
              alt: "Lima device showing the infinity logo",
              caption: "The infinity mark — files that felt local, wherever they lived.",
            }}
            right={{
              src: "/lima/lifestyle-device.jpg",
              alt: "Hand holding a Lima Ultra with travel photos",
              caption: "Lima Ultra marketing — your library, not someone else's cloud.",
            }}
          />

          <Chapter>What we had to build</Chapter>
          <Graf>
            Making that vision real meant inventing more of the stack than
            I&apos;d like to admit. Looking back, these were the layers.
          </Graf>
          <Graf>
            <strong className="font-semibold">
              A decentralized P2P virtual filesystem
            </strong>{" "}
            — written in C, running on Android, iOS, Linux, macOS, and Windows.
            Same eventually-consistent tree on every device; torrent-like
            multi-source transfers; rules that kept every file in the backend
            pool and on at least two nodes; end-to-end encryption throughout.
          </Graf>
          <Graf>
            <strong className="font-semibold">A mobile filesystem UI</strong> —
            because phones couldn&apos;t just grow a Finder.{" "}
            <strong className="font-semibold">
              Deep Finder and Explorer integration
            </strong>{" "}
            — files you could see that weren&apos;t physically on disk; progress
            on the icon when you opened one; pinned files that stayed available
            offline; grayed-out entries when you were offline and the bytes
            weren&apos;t cached. Apple&apos;s public APIs for that kind of thing
            came later.
          </Graf>
          <Graf>
            And{" "}
            <strong className="font-semibold">a zero-setup NAS dongle</strong> —
            designed, built, and productized. Plug it into the router, plug a
            drive into it — suddenly you had more liquid storage. That little box
            was the product people could hold; the filesystem was the product that
            made it make sense.
          </Graf>

          <Figure
            src="/lima/app-phone.jpg"
            alt="Lima mobile app on an iPhone"
            caption="The mobile client — holographic files, progress on open, the same tree as desktop."
            wide
          />

          <Chapter>How the road went</Chapter>
          <Graf>
            We launched on Kickstarter in 2013 — at the time, the 6th biggest
            campaign ever in the tech category, about $1.2M raised. We raised Seed
            and Series A. We shipped the device late: backers waited roughly a
            year and a half while the software finally came together. We shipped a
            second generation with roughly 40× more powerful hardware and much
            more reliable software. Sales were finally starting to look great —
            until funding problems forced us to kill all distribution channels.
          </Graf>
          <Graf>
            I had always thought the biggest risk on the project was technical.
            What bit me was underpreparedness on fundraising and investor
            relations. We made a pre-acquisition deal with another startup; they
            didn&apos;t honor their end. We ran out of cash. By 2019 the project
            was closed, and the company was acquired by one of our clients.
          </Graf>

          <PullQuote>
            We could have happily made much more margin just selling privacy.
          </PullQuote>

          <Graf>
            I still think the design problem was real. In some aspects, it still
            is. Apple and Microsoft have since opened APIs that make similar
            solutions easier to build; iCloud has shifted toward syncing the
            user&apos;s whole library. But sync, from my point of view, is still a
            pain in the ass.
          </Graf>
          <Graf>
            We were early, and we paid for that with complexity. My inexperience
            at the time also pushed us to aim at the stars, when I think we could
            have happily made much more margin just selling privacy. This
            isn&apos;t a complete overview — just the record of what we were
            trying to do.
          </Graf>

          <Pair
            left={{
              src: "/lima/multi-device.jpg",
              alt: "Phone, tablet and laptop showing the same library",
              caption: "One library, every screen — the presentation layer made real.",
            }}
            right={{
              src: "/lima/privacy-sign.jpg",
              alt: "Lima brand message about privacy",
              caption: "The pitch that aged best: keep your files safe at home.",
            }}
          />

          <footer className="mt-16 pt-8 border-t border-foreground">
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Paris · 2011–2019
              <br />
              <A href="https://web.archive.org/web/20180904102425/https://meetlima.com/index.php?lang=en">
                meetlima.com (archive)
              </A>
              {" · "}
              <A href="https://www.instagram.com/meetlima/">@meetlima</A>
              {" · "}
              <A href="https://vimeo.com/127921141">Discover Lima</A>
            </p>
          </footer>
        </div>
      </article>

      <div className="mt-16">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium px-3 py-1.5 bg-button text-button-foreground border border-button-foreground shadow-btn relative after:absolute after:inset-0.5 after:border after:border-dashed after:border-button-foreground after:pointer-events-none hover:bg-button-hover hover:text-black active:shadow-none active:translate-y-0.5 transition-colors font-mono"
        >
          ← Home
        </Link>
      </div>
    </Shell>
  );
}
