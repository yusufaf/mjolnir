import type { Theme, ThemeFile } from "./types";
import { THEME_FILE_VERSION } from "./types";
import { TARGETS } from "./targets";

export interface ControlStyleEntry {
  target: string;
  styles: string[];
}

const targetById = new Map(TARGETS.map((t) => [t.id, t]));

/** Collapse theme values into styler control-style entries (skips empty). */
export function toControlStyles(theme: Theme): ControlStyleEntry[] {
  const entries: ControlStyleEntry[] = [];
  for (const def of TARGETS) {
    const vals = theme.values[def.id];
    if (!vals || !def.selector) continue;
    const styles = Object.entries(vals)
      .filter(([, v]) => v && v.trim())
      .map(([prop, v]) => `${prop}=${v.trim()}`);
    if (styles.length) entries.push({ target: def.selector, styles });
  }
  return entries;
}

/** True if a target has at least one value set but no known selector yet. */
export function unresolvedTargets(theme: Theme): string[] {
  return TARGETS.filter((def) => {
    if (def.selector) return false;
    const vals = theme.values[def.id];
    return vals && Object.values(vals).some((v) => v && v.trim());
  }).map((def) => def.label);
}

/** Human-readable block to paste into Windhawk's Control styles UI. */
export function toControlStylesText(theme: Theme): string {
  const entries = toControlStyles(theme);
  if (!entries.length) return "// No styles set yet — pick some colors above.";
  return entries
    .map((e) => {
      const label = targetById.get(findIdBySelector(e.target))?.label;
      const head = label ? `// ${label}` : "";
      const styleLines = e.styles.map((s) => `  ${s}`).join("\n");
      return `${head}\nTarget:\n  ${e.target}\nStyles:\n${styleLines}`;
    })
    .join("\n\n");
}

/** C++ ThemeTargetStyles block for baking a preset into the mod source. */
export function toCppTheme(theme: Theme): string {
  const entries = toControlStyles(theme);
  const safe = theme.name.replace(/[^A-Za-z0-9]/g, "") || "Custom";
  if (!entries.length) return `// No styles set — nothing to bake.`;
  const body = entries
    .map((e) => {
      const styles = e.styles.map((s) => `        L"${s}"`).join(",\n");
      return `    ThemeTargetStyles{L"${e.target}", {\n${styles}}},`;
    })
    .join("\n");
  return `const Theme g_theme${safe} = {{\n${body}\n}};`;
}

/** Serialize to a shareable JSON file string. */
export function toThemeFile(theme: Theme): string {
  const file: ThemeFile = {
    mjolnirThemeFileVersion: THEME_FILE_VERSION,
    name: theme.name,
    modVersion: theme.modVersion,
    values: theme.values,
  };
  return JSON.stringify(file, null, 2);
}

/** Parse + validate an imported theme file. Throws on bad input. */
export function fromThemeFile(json: string): Theme {
  const data = JSON.parse(json) as Partial<ThemeFile>;
  if (data.mjolnirThemeFileVersion !== THEME_FILE_VERSION) {
    throw new Error("Unrecognized or unsupported theme file version.");
  }
  if (typeof data.name !== "string" || typeof data.values !== "object" || !data.values) {
    throw new Error("Theme file is missing required fields.");
  }
  return { name: data.name, modVersion: data.modVersion, values: data.values };
}

function findIdBySelector(selector: string): string {
  return TARGETS.find((t) => t.selector === selector)?.id ?? "";
}
