/* IngredientModals.jsx — Create + Edit ingredient modals */

/* ============ CREATE INGREDIENT MODAL ============ */

const CreateIngredientModal = ({ initialName, onSave, onClose }) => {
  const [name, setName] = React.useState(initialName || "");
  const [category, setCategory] = React.useState("Vegetables");
  const [color, setColor] = React.useState(window.CATEGORY_DEFAULTS.Vegetables.color);
  const [swatch, setSwatch] = React.useState(window.CATEGORY_DEFAULTS.Vegetables.swatch);
  const [touchedColor, setTouchedColor] = React.useState(false);

  // When category changes, auto-update color/swatch unless user customized.
  React.useEffect(() => {
    if (!touchedColor) {
      const def = window.CATEGORY_DEFAULTS[category] || window.CATEGORY_DEFAULTS.Other;
      setColor(def.color);
      setSwatch(def.swatch);
    }
  }, [category, touchedColor]);

  const nameTrimmed = name.trim();
  const exists = !!window.ingData(nameTrimmed);
  const canSave = nameTrimmed.length > 0 && !exists;

  const COLOR_PRESETS = [
    { color: "#E94F37", swatch: "#FBE1DA", name: "Tomato" },
    { color: "#FFD166", swatch: "#FFF1CC", name: "Butter" },
    { color: "#2A9D8F", swatch: "#D4ECE9", name: "Basil" },
    { color: "#E89A4B", swatch: "#FFE7C8", name: "Carrot" },
    { color: "#8B5A2B", swatch: "#E8C5A0", name: "Brown" },
    { color: "#8A857D", swatch: "#E7DEC8", name: "Neutral" },
  ];

  const submit = (e) => {
    if (e) e.preventDefault();
    if (!canSave) return;
    onSave({ name: nameTrimmed, cat: category, color, swatch });
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>Create ingredient</h2>
            <p className="sub">Add something to your pantry that's not in our library yet.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
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
                dangerouslySetInnerHTML={{ __html: window.ingredientIcon(nameTrimmed || "?") }}
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
              {window.ING_CATEGORIES_LIST.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={"pref-option" + (category === c ? " active" : "")}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Color</label>
            <div className="color-swatch-row">
              {COLOR_PRESETS.map((p) => {
                const active = color === p.color;
                return (
                  <button
                    type="button"
                    key={p.color}
                    className={"color-swatch" + (active ? " active" : "")}
                    onClick={() => { setColor(p.color); setSwatch(p.swatch); setTouchedColor(true); }}
                    aria-label={p.name}
                    title={p.name}
                  >
                    <span className="bg" style={{ background: p.swatch }}>
                      <span className="dot" style={{ background: p.color }}></span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!canSave}>
              <Icon n="check" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              Create ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============ EDIT INGREDIENT MODAL ============ */

const LOCATION_OPTIONS = ["Fridge", "Pantry", "Freezer", "Counter"];
const UNIT_OPTIONS = ["", "pieces", "cups", "tbsp", "tsp", "lb", "oz", "g", "kg", "ml", "L", "cans", "jars", "bunches"];

const EditIngredientModal = ({ item, onSave, onRemove, onClose }) => {
  const [name, setName] = React.useState(item.name);
  const [qty, setQty] = React.useState(item.qty || "");
  const [unit, setUnit] = React.useState(item.unit || "");
  const [location, setLocation] = React.useState(item.location || "Pantry");
  const [expires, setExpires] = React.useState(item.expiresInDays === 999 ? 999 : (item.expiresInDays ?? 14));
  const [notes, setNotes] = React.useState(item.notes || "");

  const initialData = window.ingData(item.name) || { cat: "Other", color: "#8A857D", swatch: "#E7DEC8" };
  const [category, setCategory] = React.useState(initialData.cat || "Other");
  const [color, setColor] = React.useState(initialData.color);
  const [swatch, setSwatch] = React.useState(initialData.swatch);

  const isStaple = expires >= 999;
  // For the preview icon, reflect the live category/color choice
  const previewData = { cat: category, color, swatch };

  const COLOR_PRESETS = [
    { color: "#E94F37", swatch: "#FBE1DA", name: "Tomato" },
    { color: "#FFD166", swatch: "#FFF1CC", name: "Butter" },
    { color: "#2A9D8F", swatch: "#D4ECE9", name: "Basil" },
    { color: "#E89A4B", swatch: "#FFE7C8", name: "Carrot" },
    { color: "#8B5A2B", swatch: "#E8C5A0", name: "Brown" },
    { color: "#8A857D", swatch: "#E7DEC8", name: "Neutral" },
  ];

  const expiringDesc = (days) => {
    if (days >= 999) return "Pantry staple — never expires";
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    if (days <= 7) return `Expires in ${days} days`;
    if (days <= 30) return `Expires in ~${Math.round(days / 7)} weeks`;
    return `Expires in ~${Math.round(days / 30)} months`;
  };

  const submit = (e) => {
    if (e) e.preventDefault();
    const updated = { ...item, name: name.trim() || item.name, qty: qty.trim(), unit, location, expiresInDays: expires, notes: notes.trim() };
    // Only push an override if values actually changed from what ingData currently returns
    const orig = window.ingData(item.name) || {};
    const ingChanges = {};
    if (category !== orig.cat) ingChanges.cat = category;
    if (color !== orig.color) ingChanges.color = color;
    if (swatch !== orig.swatch) ingChanges.swatch = swatch;
    onSave(updated, Object.keys(ingChanges).length ? ingChanges : null);
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span
            className="form-preview-ico"
            style={{ background: swatch, color, width: 48, height: 48, borderRadius: 12 }}
            dangerouslySetInnerHTML={{ __html: window.ingredientIcon(item.name) }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 24 }}>{item.name}</h2>
            <p className="sub">Edit how you're tracking this.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label">Quantity</label>
              <input
                className="form-input bare"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 2"
                inputMode="decimal"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Unit</label>
              <select
                className="form-input bare"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="">— none —</option>
                {UNIT_OPTIONS.filter((u) => u).map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Storage</label>
            <div className="pref-options">
              {LOCATION_OPTIONS.map((l) => (
                <button
                  type="button"
                  key={l}
                  className={"pref-option" + (location === l ? " active" : "")}
                  onClick={() => setLocation(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Category</label>
            <p className="form-helper">Used for grouping in Pantry and routing to Grocery sections.</p>
            <div className="pref-options">
              {window.ING_CATEGORIES_LIST.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={"pref-option" + (category === c ? " active" : "")}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Color</label>
            <div className="color-swatch-row">
              {COLOR_PRESETS.map((p) => {
                const active = color === p.color;
                return (
                  <button
                    type="button"
                    key={p.color}
                    className={"color-swatch" + (active ? " active" : "")}
                    onClick={() => { setColor(p.color); setSwatch(p.swatch); }}
                    aria-label={p.name}
                    title={p.name}
                  >
                    <span className="bg" style={{ background: p.swatch }}>
                      <span className="dot" style={{ background: p.color }}></span>
                    </span>
                  </button>
                );
              })}
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
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={Math.min(60, expires)}
                  onChange={(e) => setExpires(Number(e.target.value))}
                />
                <div className="v" style={{ minWidth: 64, fontSize: 18 }}>{Math.min(60, expires)}<span style={{ fontSize: 12, color: "var(--ps-charcoal-3)" }}> d</span></div>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className={"chip" + (isStaple ? " staple-active" : " suggest")}
                onClick={() => setExpires(isStaple ? 14 : 999)}
                style={{ cursor: "pointer", background: isStaple ? "var(--ps-basil)" : undefined, color: isStaple ? "#fff" : undefined, borderColor: isStaple ? "var(--ps-basil)" : undefined }}
              >
                <Icon n={isStaple ? "check" : "infinity"} style={{ width: 14, height: 14 }} />
                <span>Pantry staple</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input bare"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Brand, recipe note, who bought it…"
            />
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost danger" onClick={() => { if (confirm(`Remove ${item.name} from pantry?`)) { onRemove(item.name); } }}>
              <Icon n="trash-2" style={{ width: 14, height: 14 }} />
              Remove
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
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
};

window.CreateIngredientModal = CreateIngredientModal;
window.EditIngredientModal = EditIngredientModal;
window.LOCATION_OPTIONS = LOCATION_OPTIONS;
window.UNIT_OPTIONS = UNIT_OPTIONS;
