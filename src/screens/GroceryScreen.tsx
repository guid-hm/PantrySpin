import { useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useGrocery, useAddGroceryItems, useToggleGroceryItem, useClearCheckedGrocery, useMoveCheckedToPantry } from "@/lib/api/grocery";
import { useIngredients } from "@/lib/api/ingredients";
import { ingData, allIngredientNames } from "@/lib/ingData";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";
import { SkeletonGroceryRow } from "@/components/Skeleton";
import type { GroceryRow } from "@/lib/api/grocery";

export function GroceryScreen() {
  const [newItem,   setNewItem]   = useState("");
  const [focused,   setFocused]   = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: grocery = [], isLoading } = useGrocery();
  const { data: ingState }               = useIngredients();

  const addGroceryItems     = useAddGroceryItems();
  const toggleGroceryItem   = useToggleGroceryItem();
  const clearChecked        = useClearCheckedGrocery();
  const moveCheckedToPantry = useMoveCheckedToPantry();
  const openCreateIngredient = useAppStore((s) => s.openCreateIngredient);
  const showToast            = useAppStore((s) => s.showToast);

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};

  const grocerySet  = new Set(grocery.map((g) => g.name.toLowerCase()));
  const allIngs     = allIngredientNames(customIngs);
  const ql          = newItem.trim().toLowerCase();

  const suggestions = allIngs
    .filter((n) => !grocerySet.has(n.toLowerCase()))
    .filter((n) => !ql || n.toLowerCase().includes(ql))
    .sort((a, b) => {
      const as = a.toLowerCase().startsWith(ql) ? 0 : 1;
      const bs = b.toLowerCase().startsWith(ql) ? 0 : 1;
      if (as !== bs) return as - bs;
      return a.localeCompare(b);
    })
    .slice(0, 8);

  const groups: Record<string, GroceryRow[]> = { Produce: [], Dairy: [], Pantry: [], Protein: [], Other: [] };
  grocery.forEach((g) => {
    const key = groups[g.cat] ? g.cat : "Other";
    groups[key].push(g);
  });
  const checkedCount = grocery.filter((g) => g.checked).length;
  const total        = grocery.length;
  const checkedItems = grocery.filter((g) => g.checked);

  const choose = (name: string) => {
    if (!name) return;
    const data = ingData(name, customIngs, ingOverrides);
    const cat  = data?.cat;
    const groceryCat =
      cat === "Vegetables" || cat === "Fruits" ? "Produce"
      : cat === "Protein" ? "Protein"
      : cat === "Dairy"   ? "Dairy"
      : cat === "Other"   ? "Other"
      : "Pantry";
    addGroceryItems.mutate([{ name, qty: "", cat: groceryCat, checked: false, src: "manual" }]);
    showToast("Added to grocery list");
    setNewItem("");
    setHighlight(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused) return;
    const len = suggestions.length + 1;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(len - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(0, h - 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight < suggestions.length) {
        choose(suggestions[highlight]);
      } else {
        openCreateIngredient(newItem.trim(), (createdName) => { if (createdName) choose(createdName); });
        setFocused(false);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="page-head"><div><h1>Grocery list</h1><p className="sub">Loading…</p></div></div>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonGroceryRow key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Grocery list</h1>
          <p className="sub">
            {total - checkedCount} item{(total - checkedCount) === 1 ? "" : "s"} left to buy
            {checkedCount > 0 ? ` · ${checkedCount} checked off` : ""}.
          </p>
        </div>
        <div className="page-head-actions">
          {checkedCount > 0 && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { clearChecked.mutate(); showToast("Checked items cleared"); }}
              >
                <Icon n="trash-2" style={{ width: 14, height: 14 }} />
                Clear checked
              </button>
              <button
                className="btn btn-basil btn-sm"
                onClick={() => { moveCheckedToPantry.mutate(checkedItems); showToast("Moved to pantry"); }}
              >
                <Icon n="package-plus" style={{ width: 14, height: 14 }} />
                Move to pantry
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel grocery-add" style={{ marginBottom: 20, padding: 16, position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Icon n="search" style={{ width: 18, height: 18, color: "var(--ps-charcoal-3)" }} />
          <input
            ref={inputRef}
            placeholder="Start typing to find an ingredient…"
            value={newItem}
            onChange={(e) => { setNewItem(e.target.value); setHighlight(0); setFocused(true); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onKeyDown={onKeyDown}
            style={{ flex: 1, border: 0, background: "transparent", outline: 0, fontSize: 14 }}
          />
          {newItem && (
            <button
              type="button"
              className="modal-close"
              style={{ width: 28, height: 28 }}
              onClick={() => { setNewItem(""); inputRef.current?.focus(); }}
            >
              <Icon n="x" style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {focused && (
          <div className="autocomplete-dropdown">
            {suggestions.length === 0 && !ql && (
              <div className="autocomplete-empty">Type to search the ingredient library.</div>
            )}
            {suggestions.length === 0 && ql && (
              <div className="autocomplete-empty">No matches for "{newItem}".</div>
            )}
            {suggestions.map((n, i) => (
              <button
                key={n}
                type="button"
                className={"autocomplete-item" + (i === highlight ? " hl" : "")}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(n); }}
              >
                <IngIcon name={n} size={26} />
                <span className="ac-name">{n}</span>
                <span className="ac-cat">{ingData(n, customIngs, ingOverrides)?.cat ?? ""}</span>
              </button>
            ))}
            <button
              type="button"
              className={"autocomplete-item autocomplete-create" + (highlight === suggestions.length ? " hl" : "")}
              onMouseEnter={() => setHighlight(suggestions.length)}
              onMouseDown={(e) => {
                e.preventDefault();
                openCreateIngredient(newItem.trim(), (createdName) => { if (createdName) choose(createdName); });
                setFocused(false);
              }}
            >
              <span className="picker-create-ico" style={{ width: 26, height: 26, borderRadius: 8 }}>
                <Icon n="plus" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              </span>
              <span className="ac-name" style={{ color: "var(--ps-tomato-deep)", fontWeight: 600 }}>
                {newItem.trim() ? `Create "${newItem.trim()}"` : "Create new ingredient"}
              </span>
            </button>
          </div>
        )}
      </div>

      {Object.entries(groups).map(([cat, items]) => {
        if (items.length === 0) return null;
        return (
          <div key={cat} className="grocery-section">
            <h4>{cat}<span className="ct">{items.length}</span></h4>
            {items.map((g) => (
              <div key={g.id} className={"grocery-row" + (g.checked ? " checked" : "")}>
                <button
                  className={"grocery-check" + (g.checked ? " checked" : "")}
                  onClick={() => toggleGroceryItem.mutate({ id: g.id, checked: g.checked })}
                  aria-label={g.checked ? "Uncheck" : "Check off"}
                >
                  {g.checked && <Icon n="check" style={{ width: 14, height: 14, strokeWidth: 3 }} />}
                </button>
                <span className="grocery-row-ico"><IngIcon name={g.name} size={24} /></span>
                <span className="name">{g.name}</span>
                {g.qty && <span className="qty">{g.qty}</span>}
                {g.src !== "manual" && <span className="src">from {g.src}</span>}
              </div>
            ))}
          </div>
        );
      })}

      {grocery.length === 0 && (
        <div className="empty">
          <div className="ico"><Icon n="shopping-cart" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">Grocery list is empty</div>
          <div className="sub">Missing recipe ingredients get added here automatically. You can also add things by hand.</div>
        </div>
      )}
    </div>
  );
}
