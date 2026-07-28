import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, DataTable, P, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["lima"];
export const metadata: Metadata = {
  title: `${meta.title} — Séverin Marcombes`,
  description: meta.tagline,
};

export default function Page() {
  return (
    <ProjectPage
      emoji={meta.emoji}
      title={meta.title}
      tagline={meta.tagline}
      badges={["C", "Linux", "Electron", "2011–2019"]}
    >
      <P>
        Lima made all your storage accessible from all your devices — without
        uploading anything to someone else&apos;s servers. Plug a Lima device into
        your router, connect a USB drive. Every file appears on every device you
        own: Mac, Windows, Linux, iOS, Android. Like iCloud Drive, but
        peer-to-peer, cross-platform, and years earlier.
      </P>

      <Section>Five technical layers, all built from scratch</Section>
      <P>
        <strong className="font-semibold">P2P mesh network</strong> — devices
        communicate directly. No central server routing traffic. Lima dynamically
        adapts to LAN, internet, or mixed. Torrent-style multi-source transfers:
        all your devices that have a file send pieces in parallel.
      </P>
      <P>
        <strong className="font-semibold">Decentralized FUSE filesystem</strong> —
        files appear in your normal Finder/Explorer as local. Metadata-first: sync
        file names/sizes/dates instantly. Contents fetched on demand — you see
        everything, download only what you open. &quot;Hologram files&quot; — zero
        local storage until opened. Similar to what iCloud does today; we shipped
        it years earlier, cross-OS.
      </P>
      <P>
        <strong className="font-semibold">Deep OS integration</strong> — macOS
        Finder status badges (<Code>osxfuse-kext</Code> +{" "}
        <Code>liferay-nativity</Code>), right-click menus to pin files offline,
        Windows Explorer integration. Before Apple made their API public.
      </P>
      <P>
        <strong className="font-semibold">Unification layer</strong> — sync your
        entire user space (Documents, Desktop, Pictures, Music) across Mac +
        Windows + Linux. Cross-platform iCloud, before iCloud.
      </P>
      <P>
        <strong className="font-semibold">AI-based cache management</strong> — the
        Lima device learned which files you&apos;d need on which device and
        pre-cached them. Mobile gets recent photos; desktop gets work files. Gets
        smarter with usage.
      </P>

      <Section>The hardware</Section>
      <P>
        2.7cm × 6.9cm × 3.7cm · 30g · silent · 6W. Transforms any USB drive into a
        storage pod. Lima Original (USB2, 16 Mbps remote) and Lima Ultra (USB3,
        240 Mbps remote).
      </P>
      <P>
        AES-256 end-to-end on all communications. 2048-bit public/private key
        device auth. Zero data on Lima&apos;s servers.
      </P>

      <Section>Results</Section>
      <DataTable
        rows={[
          ["Kickstarter 2013", "$1.2M — 6th biggest Tech campaign at the time"],
          ["Team", "30+ people from Oracle, Canonical, Apple, Dropbox"],
          ["Devices shipped", "80,000+ across five continents"],
          ["Raised", "$10M+ in VC and government grants"],
          [
            "Awards",
            "4× CES Innovation, Futur en Seine Gold, Huawei Pulse, MIT Innovator Under 35",
          ],
        ]}
      />

      <Section>Stack</Section>
      <P>
        Custom OpenEmbedded Linux (Allwinner SoC ARM) · libsodium · lz4 · lmdb ·
        msgpack · Lua · osxfuse-kext · liferay-nativity · Electron +{" "}
        <A href="/projects/react-electron">react-electron</A>
      </P>

      <Src>
        <A href="https://lima-technology.com">lima-technology.com</A> · 2011–2019 ·
        Paris
      </Src>
    </ProjectPage>
  );
}
