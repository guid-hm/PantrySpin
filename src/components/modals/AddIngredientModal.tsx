import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { usePantry, useAddPantry } from "@/lib/api/pantry";
import { useIngredients } from "@/lib/api/ingredients";
import { allIngredientNames, ingData } from "@/lib/ingData";
import { QUICK_ADD } from "@/data/ingredients";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";

const ING_CATEGORIES = ["All", "Vegetables", "Protein", "Grains", "Dairy", "Pantry", "Spices"];

export function AddIngredientModal() {
  const [q,          setQ]          = useState("");
  const [cat,        setCat]        = useState("All");
  const [addedFlash, setAddedFlash] = useState<string | null>(null);

  const { data: pantry   = [] } = usePantry();
  const { data: ingState }      = useIngredients();

  const addPantry            = useAddPantry();
  const setShowAddModal      = useAppStore((s) => s.setShowAddModal);
  const openCreateIngredient = useAppStore((s) => s.openCreateIngredient);
  const showToast            = useAppStore((s) => s.showToast);

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};
  const pantryNames  = new Set(pantry.map((p) => p.name));
  const allIngs      = allIngredientNames(customIngs);

  const filtered = allIngs.filter((n) => {
    if (q && !n.toLowerCase().includes(q.toLowerCase())) return false;
    const data = ingData(n, customIngs, ingOverrides);
    if (cat !== "All" && data?.cat !== cat) return false;
    return true;
  });

  const handleAdd = (name: string) => {
    if (pantryNames.has(name)) return;
    addPantry.mutate({ name, customIngs, ingOverrides });
    showToast(`Added ${name}`);
    setAddedFlash(name);
    setTimeout(() => setAddedFlash(null), 800);
  };

  return (
    <div className="modal-scrim" onClick={() => setShowAddModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>Add to pantry</h2>
            <p className="sub">What else do you have? Tap to add — quantities are optional.</p>
          </div>
          <button className="modal-close" onClick={() => setShowAddModal(false)}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="add-search">
          <Icon n="search" style={{ width: 18, height: 18, color: "var(--ps-charcoal-3)" }} />
          <input
            placeholder="Search ingredients…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {q && (
            <button className="modal-close" style={{ width: 28, height: 28 }} onClick={() => setQ("")}>
              <Icon n="x" style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <div className="add-cats">
          {ING_CATEGORIES.map((c) => (
            <button key={c} className={"add-cat" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {!q && cat === "All" && (
          <>
            <div className="section-label" style={{ marginTop: 0 }}>Quick-add staples</div>
            <div className="add-grid" style={{ marginBottom: 18 }}>
              {QUICK_ADD.slice(0, 12).map((name) => {
                const added = pantryNames.has(name);
                return (
                  <button key={name} className={"add-tile" + (added ? " added" : "")} onClick={() => handleAdd(name)} disabled={added}>
                    <span className="tile-ico">
                      {added ? <Icon n="check" style={{ width: 18, height: 18, color: "#fff" }} /> : <IngIcon name={name} size={28} />}
                    </span>
                    <span className="tile-name">{name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="section-label">
          {q ? `Matches for "${q}"` : cat === "All" ? "All ingredients" : cat}
        </div>
        <div className="add-grid">
          {filtered.map((name) => {
            const added    = pantryNames.has(name);
            const flashing = addedFlash === name;
            return (
              <button
                key={name}
                className={"add-tile" + (added ? " added" : "") + (flashing ? " flash" : "")}
                onClick={() => handleAdd(name)}
                disabled={added}
                style={flashing ? { transform: "scale(0.96)" } : {}}
              >
                <span className="tile-ico">
                  {added ? <Icon n="check" style={{ width: 18, height: 18, color: "#fff" }} /> : <IngIcon name={name} size={28} />}
                </span>
                <span className="tile-name">{name}</span>
              </button>
            );
          })}
          <button
            type="button"
            className="add-tile create-tile"
            onClick={() => openCreateIngredient(q.trim() || "", (name) => {
              if (name) {
                addPantry.mutate({ name, customIngs, ingOverrides });
                showToast(`Added ${name}`);
              }
              setShowAddModal(false);
            })}
          >
            <span className="tile-ico create-ico">
              <Icon n="plus" style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
            </span>
            <span className="tile-name">{q.trim() ? `Create "${q.trim()}"` : "Create new"}</span>
          </button>
          {filtered.length === 0 && !q && (
            <div style={{ gridColumn: "1/-1", padding: "40px 0", textAlign: "center", color: "var(--ps-charcoal-3)" }}>
              No matches. Try a different search.
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--ps-line)" }}>
          <span style={{ fontSize: 13, color: "var(--ps-charcoal-2)" }}>{pantry.length} items in pantry</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(false)}>Done</button>
        </div>
      </div>
    </div>
  );
}
