// Core data model for the Mjolnir theme editor.

/** A XAML property that can be themed on a target element. */
export interface ThemeableProp {
  /** XAML property name used in the styler, e.g. "Foreground". */
  name: string;
  /** Human label shown in the UI. */
  label: string;
  /** Only color props for now; room to grow (number, enum, ...). */
  kind: "color";
  /** Baseline value observed in the Xbox app (#AARRGGBB), if known. */
  baseline?: string;
}

/** A targetable element in the Xbox app UI. */
export interface TargetDef {
  /** Stable id used as the key in a Theme's values map. */
  id: string;
  /** Human label, e.g. "Navigation labels". */
  label: string;
  /** UI region grouping, e.g. "Navigation". */
  region: string;
  /**
   * The styler Target selector, e.g.
   * `Windows.UI.Xaml.Controls.TextBlock[AutomationProperties.AutomationId=NavItem_ButtonLabel]`.
   * Empty when the selector is not yet known (needs UWPSpy recon).
   */
  selector: string;
  /** Properties that can be themed on this target. */
  props: ThemeableProp[];
  /** True once verified working in the live app. */
  confirmed: boolean;
  /** Optional caveat shown in the UI. */
  note?: string;
}

/** propName -> "#AARRGGBB" */
export type PropValues = Record<string, string>;

/** targetId -> { propName -> value } */
export type ThemeValues = Record<string, PropValues>;

/** A complete, shareable theme. */
export interface Theme {
  name: string;
  /** Mjolnir mod version this theme targets. */
  modVersion?: string;
  values: ThemeValues;
}

export const THEME_FILE_VERSION = 1 as const;

/** On-disk JSON shape for import/export. */
export interface ThemeFile {
  mjolnirThemeFileVersion: typeof THEME_FILE_VERSION;
  name: string;
  modVersion?: string;
  values: ThemeValues;
}
