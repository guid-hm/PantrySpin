import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useUpdatePantry, useRemovePantry } from "@/lib/api/pantry";
import { useUpsertIngredient } from "@/lib/api/ingredients";
import { useIngredients } from "@/lib/api/ingredients";
import { ingData } from "@/lib/ingData";
import { ingredientIcon, ING_CATEGORIES_LIST } from "@/data/ingredients";
import { Icon } from "@/components/Icon";
import type { IngredientCategory } from "@/types";

const LOCATION_OPTIONS = ["Fridge", "Pantry", "Freezer", "Counter"] as const;
const UNIT_OPTIONS = ["", "pieces", "cups", "tbsp", "tsp", "lb", "oz", "g", "kg", "ml", "L", "cans", "jars", "bunches"];

const COLOR_PRESETS = [
  { color: "#E94F37", swatch: "#FBE1DA", name: "Tomato" },
  { color: "#FFD166", swatch: "#FFF1CC", name: "Butter" },
  { color: "#2A9D8F", swatch: "#D4ECE9", name: "Basil" },
  { color: "#E89A4B", swatch: "#FFE7C8", name: "Carrot" },
  { color: "#8B5A2B", swatch: "#E8C5A0", name: "Brown" },
  { color: "#8A857D", swatch: "#E7DEC8", name: "Neutral" },
];

function expiringDesc(days: number): string {
  if (days >= 999) return "Pantry staple — never expires";
  if (days === 0)  return "Expires today";
  if (days === 1)  return "Expires tomorrow";
  if (days <= 7)   return `Expires in ${days} days`;
  if (days <= 30)  return `Expires in ~${Math.round(days / 7)} weeks`;
  return `Expires in ~${Math.round(days / 30)} months`;
}

export function EditIngredientModal() {
  const editingItem     = useAppStore((s) => s.editingItem);
  const setEditingItem  = useAppStore((s) => s.setEditingItem);
  const showToast       = useAppStore((s) => s.showToast);

  const { data: ingState } = useIngredients();
  const updatePantry = useUpdatePantry();
  const removePantry = useRemovePantry();
  const upsertIng    = useUpsertIngredient();

  const item         = editingItem;
  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};
  const initialData  = item
    ? (ingData(item.name, customIngs, ingOverrides) ?? { cat: "Other" as IngredientCategory, color: "#8A857D", swatch: "#E7DEC8" })
    : null;

  const [name] = useState(item?.name ?? "");
  const [qty,      setQty]      = useState(item?.qty      ?? "");
  const [unit,     setUnit]     = useState(item?.unit     ?? "");
  const [location, setLocation] = useState<(typeof LOCATION_OPTIONS)[number]>((item?.location as (typeof LOCATION_OPTIONS)[number]) ?? "Pantry");
  const [expires,  setExpires]  = useState(item?.expiresInDays === 999 ? 999 : (item?.expiresInDays ?? 14));
  const [notes,    setNotes]    = useState(item?.notes    ?? "");
  const [category, setCategory] = useState<IngredientCategory>((initialData?.cat as IngredientCategory) ?? "Other");
  const [color,    setColor]    = useState(initialData?.color  ?? "#8A857D");
  const [swatch,   setSwatch]   = useState(initialData?.swatch ?? "#E7DEC8");

  if (!item || !initialData) return null;

  const isStaple = expires >= 999;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const updated = {
      ...item,
      name:          name.trim() || item.name,
      qty:           qty.trim(),
      unit,
      location,
      expiresInDays: expires,
      notes:         notes.trim(),
    };
    const ingChanges: { cat?: string; color?: string; swatch?: string } = {};
    if (category !== initialData.cat)   ingChanges.cat    = category;
    if (color    !== initialData.color)  ingChanges.color  = color;
    if (swatch   !== initialData.swatch) ingChanges.swatch = swatch;

    updatePantry.mutate({ oldName: item.name, updated });
    if (Object.keys(ingChanges).length) {
      upsertIng.mutate({ name: updated.name, ...ingChanges, isCustom: false });
    }
    showToast(`Updated ${updated.name}`);
    setEditingItem(null);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${item.name} from pantry?`)) {
      removePantry.mutate(item.name);
      showToast(`Removed ${item.name}`);
      setEditingItem(null);
    }
  };

  return (
    <div className="modal-scrim" onClick={() => setEditingItem(null)}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span
            className="form-preview-ico"
            style={{ background: swatch, color, width: 48, height: 48, borderRadius: 12 }}
            dangerouslySetInnerHTML={{ __html: ingredientIcon(item.name) }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 24 }}>{item.name}</h2>
            <p className="sub">Edit how you're tracking this.</p>
          </div>
          <button className="modal-close" onClick={() => setEditingItem(null)}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label">Quantity</label>
              <input className="form-input bare" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 2" inputMode="decimal" />
            </div>
            <div className="form-row">
              <label className="form-label">Unit</label>
              <select className="form-input bare" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="">— none —</option>
                {UNIT_OPTIONS.filter(Boolean).map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Storage</label>
            <div className="pref-options">
              {LOCATION_OPTIONS.map((l) => (
                <button type="button" key={l} className={"pref-option" + (location === l ? " active" : "")} onClick={() => setLocation(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Category</label>
            <p className="form-helper">Used for grouping in Pantry and routing to Grocery sections.</p>
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
                  onClick={() => { setColor(p.color); setSwatch(p.swatch); }}
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

          <div className="form-row">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span>Expiration</span>
              <span style={{ color: expires <= 3 ? "var(--ps-tomato-deep)" : "var(--ps-charcoal-2)", fontWeight: 600, fontSize: 12 }}>
                {expiringDesc(expires)}
              </span>
            </label>
            {!isStaple && (
              <div className="pref-slider" style={{ marginTop: 4 }}>
                <input type="range" min={0} max={60} step={1} value={Math.min(60, expires)} onChange={(e) => setExpires(Number(e.target.value))} />
                <div className="v" style={{ minWidth: 64, fontSize: 18 }}>
                  {Math.min(60, expires)}<span style={{ fontSize: 12, color: "var(--ps-charcoal-3)" }}> d</span>
                </div>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className={"chip" + (isStaple ? " staple-active" : " suggest")}
                onClick={() => setExpires(isStaple ? 14 : 999)}
                style={isStaple ? { cursor: "pointer", background: "var(--ps-basil)", color: "#fff", borderColor: "var(--ps-basil)" } : { cursor: "pointer" }}
              >
                <Icon n={isStaple ? "check" : "infinity"} style={{ width: 14, height: 14 }} />
                <span>Pantry staple</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Notes</label>
            <textarea className="form-input bare" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Brand, recipe note, who bought it…" />
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost danger" onClick={handleRemove}>
              <Icon n="trash-2" style={{ width: 14, height: 14 }} />
              Remove
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setEditingItem(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Icon n="check" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
                Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
