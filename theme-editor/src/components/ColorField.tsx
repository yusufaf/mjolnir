// Color editor producing #AARRGGBB strings (Windhawk styler format).

interface Props {
  label: string;
  baseline?: string;
  value: string | undefined; // #AARRGGBB or undefined when unset
  onChange: (next: string | undefined) => void;
}

const HEX8 = /^#([0-9a-fA-F]{8})$/;

function parse(value: string | undefined): { a: number; rgb: string } {
  if (value && HEX8.test(value)) {
    const a = parseInt(value.slice(1, 3), 16);
    const rgb = "#" + value.slice(3);
    return { a, rgb };
  }
  return { a: 255, rgb: "#ffffff" };
}

function compose(a: number, rgb: string): string {
  const aa = Math.max(0, Math.min(255, a)).toString(16).padStart(2, "0");
  return ("#" + aa + rgb.slice(1)).toUpperCase();
}

export function ColorField({ label, baseline, value, onChange }: Props) {
  const set = !!value;
  const { a, rgb } = parse(value);

  return (
    <div className="color-field">
      <div className="color-field__top">
        <span className="color-field__label">{label}</span>
        {set ? (
          <button className="link" onClick={() => onChange(undefined)} title="Clear override">
            clear
          </button>
        ) : baseline ? (
          <button className="link" onClick={() => onChange(baseline)} title="Start from baseline">
            set
          </button>
        ) : (
          <button className="link" onClick={() => onChange("#FF000000")} title="Add override">
            set
          </button>
        )}
      </div>

      <div className="color-field__controls" data-disabled={!set}>
        <input
          type="color"
          aria-label={`${label} color`}
          value={rgb}
          disabled={!set}
          onChange={(e) => onChange(compose(a, e.target.value))}
        />
        <input
          className="hex"
          aria-label={`${label} hex (AARRGGBB)`}
          value={value ?? ""}
          placeholder={baseline ?? "#FFRRGGBB"}
          disabled={!set}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChange(v === "" ? undefined : v.toUpperCase());
          }}
        />
        <label className="alpha" title="Alpha (opacity)">
          α
          <input
            type="range"
            min={0}
            max={255}
            value={a}
            disabled={!set}
            onChange={(e) => onChange(compose(Number(e.target.value), rgb))}
          />
        </label>
      </div>
    </div>
  );
}
