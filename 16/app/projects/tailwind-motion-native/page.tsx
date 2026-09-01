import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, Ordered, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["tailwind-motion-native"];
export const metadata: Metadata = {
  title: `${meta.title} — Séverin Marcombes`,
  description: meta.tagline,
};

export default function Page() {
  return (
    <ProjectPage
      emoji={meta.emoji}
      title={meta.title}
      tagline={
        <>
          <A href="https://rombo.co/tailwind-motion/">Tailwind Motion</A>{" "}
          animation utilities ported to React Native via Moti.
        </>
      }
      badges={["TypeScript", "React Native"]}
    >
      <P>
        Tailwind Motion adds animation utility classes to Tailwind CSS (
        <Code>motion-scale-in</Code>, <Code>motion-preset-fade</Code>, etc.).
        It&apos;s web-only. This project ports those animation primitives to React
        Native by translating the same class strings into Moti animation props.
      </P>

      <Section>Usage</Section>
      <Pre>{`<MotiView classes="motion-preset-fade motion-duration-500">
  <Text>Fades in</Text>
</MotiView>`}</Pre>
      <P>
        Same class strings as the web, same presets, same timing — just rendered
        through Reanimated on native.
      </P>

      <Section>How it works</Section>
      <P>
        The library reimplements Tailwind&apos;s plugin API surface as a mock
        engine (<Code>matchUtilities</Code>, <Code>matchComponents</Code>,{" "}
        <Code>addBase</Code>, <Code>theme</Code>). The same{" "}
        <Code>pluginCreator</Code> function that Tailwind Motion uses for web runs
        against this mock and produces CSS-like declarations (
        <Code>--motion-*</Code> variables + animation shorthand).
      </P>
      <P>From there:</P>
      <Ordered>
        <li className="pl-1">
          CSS variables are resolved via PostCSS + postcss-calc
        </li>
        <li className="pl-1">
          The <Code>animation</Code> shorthand is parsed into <Code>name</Code>,{" "}
          <Code>duration</Code>, <Code>timingFunction</Code>, <Code>delay</Code>,{" "}
          <Code>direction</Code>
        </li>
        <li className="pl-1">
          The animation name is looked up in a keyframes registry →{" "}
          <Code>{"{ from, animate, exit? }"}</Code> objects
        </li>
        <li className="pl-1">
          Those map to Moti <Code>transition</Code> config and animation props
        </li>
      </Ordered>
      <P>
        Multiple animations (comma-separated classes) are merged: per-key
        transitions are built, shared transition fields are hoisted.
      </P>

      <Section>Supported</Section>
      <P>
        Scale in/out · Translate in/out · Rotate in/out · Opacity in/out · Blur
        in/out · Background/text color in/out
      </P>
      <P>
        Presets: fade, slide variants, blur+slide combos, bounce, expand/shrink,
        pop/compress, shake, wiggle, and more.
      </P>

      <Section>Stack</Section>
      <P>Bun · PostCSS · Moti (React Native Reanimated)</P>

      <Src>
        spun out from <A href="/projects/layouts-dev">layouts.dev</A> · 2024
      </Src>
    </ProjectPage>
  );
}
