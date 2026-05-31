import { useState } from "react";
import type { Theme } from "../types";
import { toControlStylesText, toCppTheme, toThemeFile, unresolvedTargets } from "../generate";

type Tab = "controls" | "json" | "cpp";

const TABS: { id: Tab; label: string }[] = [
  { id: "controls", label: "Control styles" },
  { id: "json", label: "Theme JSON" },
  { id: "cpp", label: "C++ (bake into mod)" },
];

export function OutputPanel({ theme }: { theme: Theme }) {
  const [tab, setTab] = useState<Tab>("controls");

  const text =
    tab === "controls"
      ? toControlStylesText(theme)
      : tab === "json"
        ? toThemeFile(theme)
        : toCppTheme(theme);

  const unresolved = unresolvedTargets(theme);

  return (
    <section className="output">
      <div className="output__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "tab tab--active" : "tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <button className="copy" onClick={() => navigator.clipboard.writeText(text)}>
          Copy
        </button>
      </div>

      {tab === "controls" && (
        <p className="hint">
          In Windhawk → Mjolnir → Settings → <b>Control styles</b>, add one entry per Target
          below and paste its Styles lines.
        </p>
      )}

      {unresolved.length > 0 && (
        <p className="warn">
          Not exported (selector unknown — needs recon): {unresolved.join(", ")}.
        </p>
      )}

      <pre className="output__code">{text}</pre>
    </section>
  );
}
