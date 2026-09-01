# react-electron

> Multi-window Electron apps from a single React component tree.

[![npm](https://img.shields.io/badge/npm-@lima--technology%2Freact--electron-CB3837?style=flat-square&logo=npm&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![Year](https://img.shields.io/badge/built-2017-lightgrey?style=flat-square)](#)

Built at [Lima Technology](./lima.md) to solve a problem that had no clean solution: managing multiple Electron windows with shared state, from one codebase, without going insane.

Standard Electron makes each `BrowserWindow` an isolated world. This custom React 15 renderer makes them children in a single component tree.

## The API

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

Cross-window state is just React state. Click in Window A → `setState` → re-render → Window B updates. No IPC boilerplate, no event bus.

## Architecture

A two-process hybrid renderer built on React 15's injection API:

**Main process** — custom host renderer. When it encounters `<Window>`, it creates a `BrowserWindow`, serializes the window's React children into a global, and loads `index.html#<id>`. The reconciler runs here; Electron window lifecycle is managed by `WindowUIComponent`.

**Renderer process** — each `BrowserWindow` loads a shell that reads the serialized tree from `remote.getGlobal`, reconstructs it with `React.createElement`, and renders with standard ReactDOM. It subscribes to `ipcRenderer.on("ReactElectron.update")` — when main re-renders, it re-serializes and pushes an IPC update.

**Cross-window state**: all windows are children of one tree on main. Changing state re-renders the tree → updates serialize → IPC to affected windows → ReactDOM re-renders.

## Context

This was 2017. React custom renderers weren't yet documented. Fiber wasn't out yet. The injection API was internal. We needed it to work, so we made it work.

React 16+ Fiber makes custom renderers much cleaner (`react-reconciler`). The architecture concept — multi-window React from a single tree — remains sound.

→ published as `@lima-technology/react-electron` · v0.0.25
