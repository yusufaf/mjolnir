import type { TargetDef } from "./types";

// Catalog of themeable targets in the Xbox PC app.
//
// `confirmed: true`  => selector verified working in the live app.
// `confirmed: false` => region known, selector is a best-guess placeholder
//                       pending UWPSpy recon (see recon/automationids.md).
//
// Keep this in sync with recon/automationids.md.

export const TARGETS: TargetDef[] = [
  {
    id: "nav-label",
    label: "Navigation labels",
    region: "Navigation",
    selector:
      "Windows.UI.Xaml.Controls.TextBlock[AutomationProperties.AutomationId=NavItem_ButtonLabel]",
    confirmed: true,
    props: [{ name: "Foreground", label: "Text color", kind: "color", baseline: "#FFFFFFFF" }],
  },
  {
    id: "all-text",
    label: "All text (global)",
    region: "Global",
    selector: "Windows.UI.Xaml.Controls.TextBlock",
    confirmed: true,
    note: "Affects every text element in the app. Use sparingly.",
    props: [{ name: "Foreground", label: "Text color", kind: "color" }],
  },

  // --- Pending recon (selectors are placeholders / guesses) ---
  {
    id: "nav-container",
    label: "Sidebar background",
    region: "Navigation",
    selector: "",
    confirmed: false,
    note: "Selector TBD — capture the left-nav container in UWPSpy.",
    props: [{ name: "Background", label: "Background", kind: "color" }],
  },
  {
    id: "nav-selected",
    label: "Selected nav highlight",
    region: "Navigation",
    selector: "",
    confirmed: false,
    note: "Selector TBD — the highlighted (purple) selected item.",
    props: [{ name: "Background", label: "Highlight", kind: "color" }],
  },
  {
    id: "search-bar",
    label: "Search bar",
    region: "Header",
    selector: "",
    confirmed: false,
    note: "Selector TBD.",
    props: [
      { name: "Background", label: "Background", kind: "color" },
      { name: "BorderBrush", label: "Border", kind: "color" },
    ],
  },
  {
    id: "game-tile",
    label: "Game tile / card",
    region: "Content",
    selector: "",
    confirmed: false,
    note: "Selector TBD.",
    props: [{ name: "Background", label: "Card background", kind: "color" }],
  },
  {
    id: "page-bg",
    label: "App / page background",
    region: "Global",
    selector: "",
    confirmed: false,
    note: "Selector TBD.",
    props: [{ name: "Background", label: "Background", kind: "color" }],
  },
];

export const REGION_ORDER = ["Global", "Navigation", "Header", "Content"];
