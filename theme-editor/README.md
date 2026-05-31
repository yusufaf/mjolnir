# Mjolnir Theme Editor

Visual editor that generates config for the [Mjolnir Xbox App Styler](../mods/mjolnir-xbox-styler.wh.cpp) Windhawk mod.

**Live:** https://yusufaf.github.io/mjolnir/ (auto-deploys from `main` via GitHub Actions).

Pick colors per UI target → get copy-paste **Control styles** config, a shareable **theme JSON**, or a **C++ Theme block** to bake a preset into the mod.

## Dev

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## Structure

- `src/targets.ts` — catalog of themeable Xbox-app targets. `confirmed: true` = selector verified in the live app; `false` = pending UWPSpy recon. Keep in sync with [`../recon/automationids.md`](../recon/automationids.md).
- `src/generate.ts` — emits Control styles / JSON / C++ from a theme.
- `src/components/` — `ColorField` (`#AARRGGBB` editor), `OutputPanel` (tabbed output).

## Adding a target

Add a `TargetDef` to `src/targets.ts` with its styler `selector`, set `confirmed: true` once tested. It appears in the editor automatically.
