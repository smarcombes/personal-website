import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { A, Code, P, Pre, Section, Src } from "@/components/content";
import { PROJECTS } from "@/lib/site";

const meta = PROJECTS["react-electron"];
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
      badges={["@lima-technology/react-electron", "JavaScript", "2017"]}
    >
      <P>
        Built at <A href="/projects/lima">Lima Technology</A> to solve a problem
        that had no clean solution: managing multiple Electron windows with shared
        state, from one codebase, without going insane.
      </P>
      <P>
        Standard Electron makes each <Code>BrowserWindow</Code> an isolated world.
        This custom React 15 renderer makes them children in a single component
        tree.
      </P>

      <Section>The API</Section>
      <Pre>{`<Container>
  <Window title="Main" width={800} height={600}>
    <MyApp onChange={this.handleChange} />
  </Window>
  <Window title="Settings" width={400} height={300}>
    <SettingsPanel value={this.state.value} />
  </Window>
  <Tray icon="icon.png" />
</Container>`}</Pre>
      <P>
        Cross-window state is just React state. Click in Window A →{" "}
        <Code>setState</Code> → re-render → Window B updates. No IPC boilerplate,
        no event bus.
      </P>

      <Section>Architecture</Section>
      <P>
        A two-process hybrid renderer built on React 15&apos;s injection API:
      </P>
      <P>
        <strong className="font-semibold">Main process</strong> — custom host
        renderer. When it encounters <Code>{"<Window>"}</Code>, it creates a{" "}
        <Code>BrowserWindow</Code>, serializes the window&apos;s React children
        into a global, and loads <Code>{"index.html#<id>"}</Code>. The reconciler
        runs here; Electron window lifecycle is managed by{" "}
        <Code>WindowUIComponent</Code>.
      </P>
      <P>
        <strong className="font-semibold">Renderer process</strong> — each{" "}
        <Code>BrowserWindow</Code> loads a shell that reads the serialized tree
        from <Code>remote.getGlobal</Code>, reconstructs it with{" "}
        <Code>React.createElement</Code>, and renders with standard ReactDOM. It
        subscribes to <Code>{'ipcRenderer.on("ReactElectron.update")'}</Code> —
        when main re-renders, it re-serializes and pushes an IPC update.
      </P>
      <P>
        <strong className="font-semibold">Cross-window state</strong>: all windows
        are children of one tree on main. Changing state re-renders the tree →
        updates serialize → IPC to affected windows → ReactDOM re-renders.
      </P>

      <Section>Context</Section>
      <P>
        This was 2017. React custom renderers weren&apos;t yet documented. Fiber
        wasn&apos;t out yet. The injection API was internal. We needed it to work,
        so we made it work.
      </P>
      <P>
        React 16+ Fiber makes custom renderers much cleaner (
        <Code>react-reconciler</Code>). The architecture concept — multi-window
        React from a single tree — remains sound.
      </P>

      <Src>
        published as <Code>@lima-technology/react-electron</Code> · v0.0.25
      </Src>
    </ProjectPage>
  );
}
