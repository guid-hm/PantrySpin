import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useUpsertIngredient } from "@/lib/api/ingredients";
import { useIngredients } from "@/lib/api/ingredients";
import { ingData } from "@/lib/ingData";
import { ingredientIcon, CATEGORY_DEFAULTS, ING_CATEGORIES_LIST } from "@/data/ingredients";
import { Icon } from "@/components/Icon";

const COLOR_PRESETS = [
  { color: "#E94F37", swatch: "#FBE1DA", name: "Tomato" },
  { color: "#FFD166", swatch: "#FFF1CC", name: "Butter" },
  { color: "#2A9D8F", swatch: "#D4ECE9", name: "Basil" },
  { color: "#E89A4B", swatch: "#FFE7C8", name: "Carrot" },
  { color: "#8B5A2B", swatch: "#E8C5A0", name: "Brown" },
  { color: "#8A857D", swatch: "#E7DEC8", name: "Neutral" },
];

export function CreateIngredientModal() {
  const createIngState       = useAppStore((s) => s.createIngState);
  const closeCreateIngredient = useAppStore((s) => s.closeCreateIngredient);
  const showToast            = useAppStore((s) => s.showToast);

  const { data: ingState } = useIngredients();
  const upsertIng = useUpsertIngredient();

  const [name,         setName]         = useState(createIngState?.initialName ?? "");
  const [category,     setCategory]     = useState<(typeof ING_CATEGORIES_LIST)[number]>("Vegetables");
  const [color,        setColor]        = useState(CATEGORY_DEFAULTS.Vegetables.color);
  const [swatch,       setSwatch]       = useState(CATEGORY_DEFAULTS.Vegetables.swatch);
  const [touchedColor, setTouchedColor] = useState(false);

  useEffect(() => {
    if (!touchedColor) {
      const def = CATEGORY_DEFAULTS[category] ?? CATEGORY_DEFAULTS.Other;
      setColor(def.color);
      setSwatch(def.swatch);
    }
  }, [category, touchedColor]);

  if (!createIngState) return null;

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};
  const nameTrimmed  = name.trim();
  const exists       = !!ingData(nameTrimmed, customIngs, ingOverrides);
  const canSave      = nameTrimmed.length > 0 && !exists;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSave) return;
    await upsertIng.mutateAsync({ name: nameTrimmed, cat: category, color, swatch, isCustom: true });
    showToast(`Created "${nameTrimmed}"`);
    const cb = createIngState.callback;
    closeCreateIngredient();
    cb?.(nameTrimmed);
  };

  return (
    <div className="modal-scrim" onClick={closeCreateIngredient}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>Create ingredient</h2>
            <p className="sub">Add something to your pantry that's not in our library yet.</p>
          </div>
          <button className="modal-close" onClick={closeCreateIngredient}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label className="form-label">Name</label>
            <div className="form-input-wrap">
              <span
                className="form-preview-ico"
                style={{ background: swatch, color }}
                dangerouslySetInnerHTML={{ __html: ingredientIcon(nameTrimmed || "?") }}
              />
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pickled jalapeños"
                autoFocus
                maxLength={40}
              />
            </div>
            {exists && (
              <div className="form-helper warn">
                <Icon n="alert-circle" style={{ width: 13, height: 13 }} />
                <span>"{nameTrimmed}" is already in your library.</span>
              </div>
            )}
          </div>

          <div className="form-row">
            <label className="form-label">Category</label>
            <div className="pref-options">
              {ING_CATEGORIES_LIST.map((c) => (
                <button type="button" key={c} className={"pref-option" + (category === c ? " active" : "")} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Color</label>
            <div className="color-swatch-row">
              {COLOR_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.color}
                  className={"color-swatch" + (color === p.color ? " active" : "")}
                  onClick={() => { setColor(p.color); setSwatch(p.swatch); setTouchedColor(true); }}
                  aria-label={p.name}
                  title={p.name}
                >
                  <span className="bg" style={{ background: p.swatch }}>
                    <span className="dot" style={{ background: p.color }} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={closeCreateIngredient}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!canSave}>
              <Icon n="check" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              Create ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
