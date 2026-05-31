import { useMemo, useRef, useState } from "react";
import type { Theme } from "./types";
import { TARGETS, REGION_ORDER } from "./targets";
import { ColorField } from "./components/ColorField";
import { OutputPanel } from "./components/OutputPanel";
import { fromThemeFile, toThemeFile } from "./generate";

const EMPTY: Theme = { name: "My Xbox Theme", values: {} };

export default function App() {
  const [theme, setTheme] = useState<Theme>(EMPTY);
  const fileInput = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => {
    const byRegion = new Map<string, typeof TARGETS>();
    for (const t of TARGETS) {
      const arr = byRegion.get(t.region) ?? [];
      arr.push(t);
      byRegion.set(t.region, arr);
    }
    const ordered = [...byRegion.keys()].sort(
      (a, b) => (REGION_ORDER.indexOf(a) + 1 || 99) - (REGION_ORDER.indexOf(b) + 1 || 99),
    );
    return ordered.map((region) => ({ region, targets: byRegion.get(region)! }));
  }, []);

  function setProp(targetId: string, prop: string, next: string | undefined) {
    setTheme((prev) => {
      const values = { ...prev.values };
      const t = { ...(values[targetId] ?? {}) };
      if (next === undefined) delete t[prop];
      else t[prop] = next;
      if (Object.keys(t).length) values[targetId] = t;
      else delete values[targetId];
      return { ...prev, values };
    });
  }

  function exportTheme() {
    const blob = new Blob([toThemeFile(theme)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.name.replace(/[^A-Za-z0-9]+/g, "-") || "theme"}.mjolnir.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importTheme(file: File) {
    file.text().then((txt) => {
      try {
        setTheme(fromThemeFile(txt));
      } catch (e) {
        alert(`Could not import theme: ${(e as Error).message}`);
      }
    });
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__mark" aria-hidden>⬡</span>
          <div>
            <h1>Mjolnir</h1>
            <p>Xbox App theme editor</p>
          </div>
        </div>
        <div className="app__actions">
          <input
            className="name"
            value={theme.name}
            aria-label="Theme name"
            onChange={(e) => setTheme((p) => ({ ...p, name: e.target.value }))}
          />
          <button onClick={() => fileInput.current?.click()}>Import</button>
          <button onClick={exportTheme}>Export</button>
          <button className="ghost" onClick={() => setTheme(EMPTY)}>Reset</button>
          <input
            ref={fileInput}
            type="file"
            accept=".json"
            hidden
            onChange={(e) => e.target.files?.[0] && importTheme(e.target.files[0])}
          />
        </div>
      </header>

      <main className="app__main">
        <div className="editor">
          {groups.map(({ region, targets }) => (
            <section className="group" key={region}>
              <h2>{region}</h2>
              {targets.map((t) => (
                <article className="target" key={t.id} data-pending={!t.confirmed}>
                  <div className="target__head">
                    <span className="target__label">{t.label}</span>
                    {t.confirmed ? (
                      <span className="badge badge--ok">verified</span>
                    ) : (
                      <span className="badge badge--todo">needs recon</span>
                    )}
                  </div>
                  {t.note && <p className="target__note">{t.note}</p>}
                  {t.selector && <code className="target__sel">{t.selector}</code>}
                  <div className="target__props">
                    {t.props.map((p) => (
                      <ColorField
                        key={p.name}
                        label={p.label}
                        baseline={p.baseline}
                        value={theme.values[t.id]?.[p.name]}
                        onChange={(v) => setProp(t.id, p.name, v)}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>

        <OutputPanel theme={theme} />
      </main>

      <footer className="app__footer">
        Generates config for the{" "}
        <a href="https://github.com/yusufaf/mjolnir" target="_blank" rel="noreferrer">
          Mjolnir
        </a>{" "}
        Windhawk mod. Selectors marked “needs recon” are not exported until verified.
      </footer>
    </div>
  );
}
