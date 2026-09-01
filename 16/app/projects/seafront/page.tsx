import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, P, Section } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["seafront"];
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
      badges={["TypeScript", "React Native", "2019–2022"]}
    >
      <P>
        Solo-operated boutique that I built to take &quot;time off&quot; after my
        years at Lima Technology. Specialized in taking startup ideas from zero to
        a working MVP. Generally started working with clients on business model
        and strategy, before diving in on product definition and delivering the
        first version of the product for them. Lot of 0-to-1 fun.
      </P>

      <Section>Adok Meetings (2019)</Section>
      <P>
        Smart meeting room device — a physical touchscreen for conference rooms. I
        did the OS of that. Touch screen interface with voice commands. Able to
        open any web app, start video conference while interacting touch-first with
        most business SaaS. Did a recap of meeting actions at the end (a bit clunky
        as it was pre-AI era, but working). Bill Gates saw that at CES and asked
        for a personal demo of this one.
      </P>
      <p className="mb-4 text-muted-foreground">
        →{" "}
        <A href="https://www.youtube.com/watch?v=iLVEbixkdfk">Product video</A>
      </p>

      <Section>EzDrive (2021–2022)</Section>
      <P>
        Full electric-vehicle charging platform deployed in production. 2.4M LOC.
        Mobile &amp; web app (React Native + React DOM) to see the map of
        compatible charging stations and control them. Backoffice for operating the
        fleet of stations + fully documented REST API.
      </P>

      <Section>QuickBooks France — Export feature (2021)</Section>
      <P>
        Built &amp; owned a feature for the French version of Quickbooks, so users
        could export their data to all major French legacy accountant software
        providers. Service directly integrated into Quickbooks. Operated by us.
      </P>

      <Section>Busea (2019–2022)</Section>
      <P>
        Bus ticketing platform deployed in Ecuador (React Native + web + embedded
        IoT hardware, 3.4M LOC). Selling up to 4k tickets/month at the time.
      </P>

      <Section>Other</Section>
      <P>
        Lots of analytics / marketing / tracking software for multiple businesses.
        Tech &amp; marketing mentoring at{" "}
        <A href="https://escp.eu/">ESCP Europe Business school</A> and others.
      </P>
    </ProjectPage>
  );
}
