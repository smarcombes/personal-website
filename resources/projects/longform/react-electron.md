# Why — multi-window Electron with shared state was a nightmare

## The pains
- Standard Electron makes each `BrowserWindow` an isolated world.
- Sharing state across windows means hand-writing IPC and an event bus.
- Keeping several windows in sync from one codebase, without going insane, had no clean solution.

## The underlying design problem

Electron treats windows as separate processes with separate DOMs, so the developer has to manually marshal state between them. But conceptually, multiple windows of one app are just different views of the *same* application state. react-electron (built at [Lima Technology](./lima.md), 2017) makes that literal: all windows are children of a single React component tree, and cross-window state is just React state.

# Design decisions

## The ideal
- **One component tree, many windows.** Declare `<Window>` (and `<Tray>`) as children of a `<Container>`; each becomes a real `BrowserWindow`.
- **Cross-window state is React state.** Click in Window A → `setState` → re-render → Window B updates. No IPC boilerplate, no event bus in user code.

## How the system works

```jsx
<Container>
  <Window title="Main" width={800} height={600}>
    <MyApp onChange={this.handleChange} />
  </Window>
  <Window title="Settings" width={400} height={300}>
    <SettingsPanel value={this.state.value} />
  </Window>
  <Tray icon="icon.png" />
</Container>
```

# The tech onion

A two-process hybrid renderer built on React 15's injection API.

1. **Main process (host renderer)** — the custom reconciler runs here. On a `<Window>` it creates a `BrowserWindow`, serializes that window's React children into a global, and loads `index.html#<id>`; `WindowUIComponent` manages the Electron lifecycle.
2. **Renderer process (per window)** — a shell reads the serialized tree via `remote.getGlobal`, reconstructs it with `React.createElement`, and renders with standard ReactDOM.
3. **State propagation** — each window subscribes to `ipcRenderer.on("ReactElectron.update")`; when main re-renders, it re-serializes and pushes an IPC update to the affected windows.

## The hard parts
- This was 2017: custom renderers weren't documented, Fiber wasn't out, and the injection API was internal. It had to be made to work against undocumented internals.
- Serializing a live React tree across the process boundary and reconstructing it faithfully.

## The good parts
- The core idea — multi-window React from a single tree — is sound and aged well. React 16+ Fiber (`react-reconciler`) makes the same architecture much cleaner today.

## Stack
JavaScript · React 15 custom renderer · Electron · IPC. Published as `@lima-technology/react-electron` (v0.0.25).

# Recognition
An early open-source renderer from the Lima era; no formal recognition.
