# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Theming for the **Xbox PC app** (`XboxPcApp.exe`) — what Millennium/SteamBrew is for Steam, but for Xbox. Named after the Halo Spartan armor system.

The Xbox app is React Native for Windows: a thin `Windows.UI.Xaml` shell hosting a `ReactRootView` that renders UI as XAML primitives. **There is no web layer** — no DOM, no CSS, nothing to inject JS into. So theming happens at the XAML visual-tree level via a [Windhawk](https://windhawk.net/) mod that hooks XAML diagnostics, watches visual-tree changes, and overrides element properties, targeting elements by `AutomationId`.

## Components

| Path | What |
|------|------|
| `mods/mjolnir-xbox-styler.wh.cpp` | The Windhawk mod — canonical source, ~7000 lines |
| `theme-editor/` | Vite + React + TS web app that generates mod config visually; deploys to GitHub Pages |
| `recon/automationids.md` | Discovered AutomationIds + baseline color values |
| `.reference/` | Upstream mods kept for diffing — **not ours, do not edit** |

## Provenance and licensing — read before editing the mod

`mjolnir-xbox-styler.wh.cpp` is a derivative of the **Windows 11 Start Menu Styler** by m417z, retargeted to the Xbox app. The styling engine (XAML diagnostics visual-tree watcher, `Class#Name[Property=Value]` selectors, CoreWindow discovery) is reused wholesale. Consequences:

- The mod is **GPL v3**, unlike the repo's MIT `LICENSE` which covers the editor and the rest.
- Some Start-menu-specific engine code remains in the file, inert on this target. It's intentionally left in place to keep diffs against upstream readable. Don't delete it as "dead code" — that permanently forks the engine and makes pulling upstream fixes painful.
- `.reference/start-menu-styler.wh.cpp` and `.reference/taskbar-styler.wh.cpp` are the upstream files. Diff against them before changing engine internals.
- The attribution comment block at the top of the mod must stay intact.

## Workflow

There is no build step in this repo for the mod. Windhawk compiles it.

1. Edit and compile inside the Windhawk app ("Create new mod" / mod editor).
2. Keep `mods/mjolnir-xbox-styler.wh.cpp` here as the source of truth — copy changes back.
3. To publish: copy into a fork of `ramensoftware/windhawk-mods` at `mods/mjolnir-xbox-styler.wh.cpp` and open a PR.

The mod's `@github` metadata must be `yusufaf` — Windhawk's PR checks require it to match the PR author.

Theme editor:

```bash
cd theme-editor
pnpm install
pnpm dev       # vite
pnpm build     # tsc && vite build
```

`.github/workflows/deploy-pages.yml` publishes it to https://yusufaf.github.io/mjolnir/.

## Mod structure

The file is one Windhawk mod with four metadata blocks up top, each parsed by Windhawk rather than the compiler:

- `==WindhawkMod==` — id, version, `@include XboxPcApp.exe`, compiler options
- `==WindhawkModReadme==` — user-facing docs shown in the Windhawk UI
- `==WindhawkModSettings==` — the settings schema (`controlStyles`, `styleConstants`, `themeResourceVariables`, `webContentStyles`, `webContentCustomJs`)

Bumping `@version` in the first block is what ships an update to users.

**Target syntax** (this is the core user-facing concept, mirrored in `theme-editor/src/targets.ts`):

```
Class#Name[Property=Value][Property2=Value2]
Class#Name@VisualStateGroup
```

`Class` is the XAML type (`Windows.UI.Xaml.Controls.TextBlock`, or short `TextBlock`, or `*`). `#Name` is x:Name. `[Property=Value]` matches any property — in practice `[AutomationProperties.AutomationId=...]` is the reliable one, since React Native generates names. Styles are `Property=Value`, colors `#AARRGGBB`. `:=` sets a XAML value/binding; `:=` with empty RHS clears it.

## Finding new targets

Use [UWPSpy](https://ramensoftware.com/uwpspy) against a running Xbox app to inspect the live visual tree, read AutomationIds, and see current property values. Record anything new in `recon/automationids.md` — that file is the accumulated map of the app and is the main asset for adding coverage. AutomationIds survive app updates far better than element names or tree positions, so prefer them when writing targets.

## Conventions

- Keep the theme editor's `targets.ts` in sync with what the mod actually supports — it's the discoverability layer for users who won't run UWPSpy.
- Status is early development; `README.md` links the live editor and should stay accurate.
- `theme-editor/dist/` is committed (Pages deploy artifact). Don't hand-edit it; rebuild.
