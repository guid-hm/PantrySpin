import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { usePantry, useRemovePantry } from "@/lib/api/pantry";
import { useIngredients } from "@/lib/api/ingredients";
import { useRecipes } from "@/lib/api/recipes";
import { usePrefs } from "@/lib/api/prefs";
import { ingData } from "@/lib/ingData";
import { Icon } from "@/components/Icon";
import { SkeletonPantryCard } from "@/components/Skeleton";
import { ingredientIcon } from "@/data/ingredients";
import type { IngredientCategory } from "@/types";

const CAT_ORDER: IngredientCategory[] = [
  "Vegetables", "Protein", "Grains", "Dairy", "Pantry", "Spices", "Other",
];

function expiringDesc(days: number): string {
  if (days <= 0)   return "Expires today";
  if (days === 1)  return "Expires tomorrow";
  if (days <= 3)   return `Expires in ${days} days`;
  if (days >= 999) return "Staple";
  return `${days}d left`;
}

export function PantryScreen() {
  const [filter, setFilter] = useState("All");

  const { data: pantry = [], isLoading } = usePantry();
  const { data: ingState }         = useIngredients();
  const { data: recipes     = [] } = useRecipes();
  const { data: prefs }            = usePrefs();

  const removePantry    = useRemovePantry();
  const spin            = useAppStore((s) => s.spin);
  const setSpinMode     = useAppStore((s) => s.setSpinMode);
  const setShowAddModal = useAppStore((s) => s.setShowAddModal);
  const setEditingItem  = useAppStore((s) => s.setEditingItem);
  const showToast       = useAppStore((s) => s.showToast);

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};

  const expiring = pantry.filter((p) => p.expiresInDays <= 3);

  const counts = {
    All:      pantry.length,
    Expiring: expiring.length,
    Fridge:   pantry.filter((p) => p.location === "Fridge").length,
    Pantry:   pantry.filter((p) => p.location === "Pantry").length,
    Freezer:  pantry.filter((p) => p.location === "Freezer").length,
  };

  const filtered = pantry.filter((p) => {
    if (filter === "All")      return true;
    if (filter === "Expiring") return p.expiresInDays <= 3;
    return p.location === filter;
  });

  const grouped: Partial<Record<string, typeof filtered>> = {};
  filtered.forEach((p) => {
    const data = ingData(p.name, customIngs, ingOverrides);
    const cat  = data?.cat ?? "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(p);
  });

  const handleSpinExpiring = () => {
    setSpinMode("expiring");
    if (prefs) spin(pantry, recipes, prefs);
  };

  if (isLoading) {
    return (
      <div>
        <div className="page-head"><div><h1>My pantry</h1><p className="sub">Loading…</p></div></div>
        <div className="pantry-grid" style={{ marginTop: 24 }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonPantryCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My pantry</h1>
          <p className="sub">Everything you have on hand — {pantry.length} items.</p>
        </div>
        <div className="page-head-actions">
          {expiring.length > 0 && (
            <button className="btn btn-secondary" onClick={handleSpinExpiring}>
              <Icon n="alarm-clock" style={{ width: 16, height: 16 }} />
              Spin with expiring
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Add ingredient
          </button>
        </div>
      </div>

      {expiring.length > 0 && (
        <div
          className="panel"
          style={{
            marginBottom: 20,
            background: "linear-gradient(135deg, var(--ps-tomato-soft) 0%, var(--ps-paper) 70%)",
            borderLeft: "4px solid var(--ps-tomato)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--ps-tomato)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 44px" }}>
              <Icon n="alarm-clock" style={{ width: 22, height: 22 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
                {expiring.length} ingredient{expiring.length === 1 ? "" : "s"} expiring soon
              </div>
              <div style={{ fontSize: 13, color: "var(--ps-charcoal-2)", marginTop: 2 }}>
                {expiring.map((e) => e.name).join(", ")} — use these before they go bad.
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSpinExpiring}>
              Spin recipes
              <Icon n="chevron-right" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
            </button>
          </div>
        </div>
      )}

      <div className="filter-row">
        {(["All", "Expiring", "Fridge", "Pantry", "Freezer"] as const).map((f) => (
          <button
            key={f}
            className={"filter-pill" + (filter === f ? " active" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="count">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {CAT_ORDER.map((catKey) => {
        const items = grouped[catKey];
        if (!items || items.length === 0) return null;
        return (
          <div key={catKey} className="category-section">
            <div className="category-head">
              <h3>{catKey}</h3>
              <span className="count">{items.length}</span>
            </div>
            <div className="pantry-grid">
              {items.map((item) => {
                const data = ingData(item.name, customIngs, ingOverrides);
                return (
                  <div
                    key={item.name}
                    className={"pantry-card clickable" + (item.expiresInDays <= 3 ? " expiring" : "")}
                    onClick={() => setEditingItem(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEditingItem(item); } }}
                  >
                    <span
                      className="ico-lg"
                      style={{ background: data?.swatch ?? "var(--ps-cream-deep)", color: data?.color ?? "var(--ps-charcoal)" }}
                      dangerouslySetInnerHTML={{ __html: ingredientIcon(item.name) }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="name">{item.name}</div>
                      <div className="meta">
                        {item.qty ? `${item.qty}${item.unit ? " " + item.unit : ""} · ` : ""}
                        {item.location} · {expiringDesc(item.expiresInDays)}
                      </div>
                    </div>
                    <button
                      className="x"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePantry.mutate(item.name);
                        showToast(`Removed ${item.name}`);
                      }}
                    >
                      <Icon n="x" style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="empty">
          <div className="ico"><Icon n="package" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">No ingredients here</div>
          <div className="sub">Add some pantry staples and the wheel will start matching recipes.</div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Add ingredient
          </button>
        </div>
      )}
    </div>
  );
}
