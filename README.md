# Mjolnir

Theming / customization for the **Xbox PC app** (`XboxPcApp.exe`) — like [Millennium/SteamBrew](https://steambrew.app/) is for Steam, but for Xbox.

Named after the Halo Spartan armor system: reskinning the armor = retheming the app.

## How it works

The Xbox PC app is built on **React Native for Windows** — a thin `Windows.UI.Xaml` shell hosting a `ReactRootView` that renders the UI as XAML primitives. There is no web layer to inject CSS/JS into, so Mjolnir works at the XAML visual-tree level via a [Windhawk](https://windhawk.net/) mod: it hooks XAML diagnostics, watches visual-tree changes, and overrides element properties (`Foreground`, `Background`, `BorderBrush`, …), targeting elements by their `AutomationId`.

This approach is forked from the [Windows 11 Taskbar Styler](https://windhawk.net/mods/windows-11-taskbar-styler) mod, which solves the same problem for the taskbar.

## Components

| Path | What |
|------|------|
| `mods/mjolnir-xbox-styler.wh.cpp` | The Windhawk mod (canonical source). |
| `theme-editor/` | Web app (Vite + React + TS) that generates mod config visually. |
| `recon/automationids.md` | Discovered AutomationIds + baseline color values. |

## Status

Early development. See the plan for phased milestones.

## License

MIT
