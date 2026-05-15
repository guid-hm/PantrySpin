/* OtherScreens.jsx — Pantry, Saved, Grocery, Preferences, Onboarding */

/* ========== PANTRY SCREEN (full inventory) ========== */

const PantryScreen = ({ pantry, onRemove, onOpenAddModal, onSpin, onEditItem, expiring }) => {
  const [filter, setFilter] = React.useState("All");

  const counts = {
    All: pantry.length,
    Expiring: expiring.length,
    Fridge: pantry.filter((p) => p.location === "Fridge").length,
    Pantry: pantry.filter((p) => p.location === "Pantry").length,
    Freezer: pantry.filter((p) => p.location === "Freezer").length,
  };

  const filtered = pantry.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Expiring") return p.expiresInDays <= 3;
    return p.location === filter;
  });

  // Group by category
  const grouped = {};
  filtered.forEach((p) => {
    const data = window.ingData(p.name) || { cat: "Other" };
    if (!grouped[data.cat]) grouped[data.cat] = [];
    grouped[data.cat].push(p);
  });
  const order = ["Vegetables", "Protein", "Grains", "Dairy", "Pantry", "Spices", "Other"];

  const expiringDesc = (days) => {
    if (days <= 1) return days === 0 ? "Expires today" : "Expires tomorrow";
    if (days <= 3) return `Expires in ${days} days`;
    if (days >= 999) return "Staple";
    return `${days}d left`;
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My pantry</h1>
          <p className="sub">Everything you have on hand — {pantry.length} items.</p>
        </div>
        <div className="page-head-actions">
          {expiring.length > 0 && (
            <button className="btn btn-secondary" onClick={onSpin}>
              <Icon n="alarm-clock" style={{ width: 16, height: 16 }} />
              Spin with expiring
            </button>
          )}
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Add ingredient
          </button>
        </div>
      </div>

      {expiring.length > 0 && (
        <div className="panel" style={{ marginBottom: 20, background: "linear-gradient(135deg, var(--ps-tomato-soft) 0%, var(--ps-paper) 70%)", borderLeft: "4px solid var(--ps-tomato)" }}>
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
            <button className="btn btn-primary btn-sm" onClick={onSpin}>
              Spin recipes
              <Icon n="chevron-right" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
            </button>
          </div>
        </div>
      )}

      <div className="filter-row">
        {["All", "Expiring", "Fridge", "Pantry", "Freezer"].map((f) => (
          <button
            key={f}
            className={"filter-pill" + (filter === f ? " active" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="count">{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {order.map((catKey) => {
        const items = grouped[catKey];
        if (!items || items.length === 0) return null;
        return (
          <div key={catKey} className="category-section">
            <div className="category-head">
              <h3>{catKey}</h3>
              <span className="count">{items.length}</span>
            </div>
            <div className="pantry-grid">
              {items.map((item) => (
                <div
                  key={item.name}
                  className={"pantry-card clickable" + (item.expiresInDays <= 3 ? " expiring" : "")}
                  onClick={() => onEditItem && onEditItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEditItem && onEditItem(item); } }}
                >
                  <span
                    className="ico-lg"
                    style={{
                      background: (window.ingData(item.name) || {}).swatch || "var(--ps-cream-deep)",
                      color: (window.ingData(item.name) || {}).color || "var(--ps-charcoal)",
                    }}
                    dangerouslySetInnerHTML={{ __html: window.ingredientIcon(item.name) }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="name">{item.name}</div>
                    <div className="meta">
                      {item.qty ? `${item.qty}${item.unit ? " " + item.unit : ""} · ` : ""}
                      {item.location} · {expiringDesc(item.expiresInDays)}
                    </div>
                  </div>
                  <button className="x" onClick={(e) => { e.stopPropagation(); onRemove(item.name); }}>
                    <Icon n="x" style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="empty">
          <div className="ico"><Icon n="package" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">No ingredients here</div>
          <div className="sub">Add some pantry staples and the wheel will start matching recipes.</div>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Add ingredient
          </button>
        </div>
      )}
    </div>
  );
};

/* ========== SAVED SCREEN ========== */

const SavedScreen = ({ saved, pantry, onPickRecipe, onToggleSave, onGoSpin }) => {
  const [filter, setFilter] = React.useState("All");
  const pantryNames = pantry.map((p) => p.name);

  const savedRecipes = window.RECIPES.filter((r) => saved.includes(r.id));

  const filters = ["All", "Quick (<25 min)", "Vegetarian", "High protein"];
  const filtered = savedRecipes.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Quick (<25 min)") return r.time < 25;
    if (filter === "Vegetarian") return r.tags.includes("Vegetarian");
    if (filter === "High protein") return r.tags.includes("High protein");
    return true;
  });

  if (savedRecipes.length === 0) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1>Saved recipes</h1>
            <p className="sub">Your favorites — tap the heart anywhere to save.</p>
          </div>
        </div>
        <div className="empty">
          <div className="ico"><Icon n="heart" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">No saved recipes yet</div>
          <div className="sub">Spin the wheel and tap the heart on anything that catches your eye.</div>
          <button className="btn btn-primary" onClick={onGoSpin}>
            <Icon n="sparkles" style={{ width: 16, height: 16 }} />
            Spin a recipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Saved recipes</h1>
          <p className="sub">{savedRecipes.length} favorite{savedRecipes.length === 1 ? "" : "s"} you can spin into anytime.</p>
        </div>
      </div>

      <div className="filter-row">
        {filters.map((f) => (
          <button
            key={f}
            className={"filter-pill" + (filter === f ? " active" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="saved-grid">
        {filtered.map((r) => {
          const { pct } = window.matchScore(r, pantryNames);
          return (
            <div key={r.id} className="recipe-card" onClick={() => onPickRecipe(r)}>
              <div className="card-illus" style={{ background: window.thumbStyle(r.illusKey) }}>
                <div dangerouslySetInnerHTML={{ __html: window.recipeIllustration(r.illusKey) }}></div>
                <button
                  className="card-heart saved"
                  onClick={(e) => { e.stopPropagation(); onToggleSave(r.id); }}
                  aria-label="Remove from saved"
                >
                  <Heart saved={true} size={16} />
                </button>
              </div>
              <div className="card-body">
                <h3 className="card-name">{r.name}</h3>
                <div className="card-meta">
                  <span className="badge">{r.time} min</span>
                  <span style={{ color: "var(--ps-charcoal-3)" }}>·</span>
                  <span style={{ fontWeight: 600, color: pct >= 80 ? "var(--ps-basil-deep)" : pct >= 50 ? "var(--ps-charcoal-2)" : "var(--ps-tomato-deep)" }}>{pct}% match</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ========== GROCERY SCREEN ========== */

const GroceryScreen = ({ grocery, onToggle, onAddManual, onClear, onMoveToPantry, onCreateIngredient }) => {
  const [newItem, setNewItem] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef(null);

  const grocerySet = new Set(grocery.map((g) => g.name.toLowerCase()));
  const allIngs = window.allIngredientNames();
  const ql = newItem.trim().toLowerCase();
  const suggestions = allIngs
    .filter((n) => !grocerySet.has(n.toLowerCase()))
    .filter((n) => !ql || n.toLowerCase().includes(ql))
    .sort((a, b) => {
      // Items starting with the query first
      const as = a.toLowerCase().startsWith(ql) ? 0 : 1;
      const bs = b.toLowerCase().startsWith(ql) ? 0 : 1;
      if (as !== bs) return as - bs;
      return a.localeCompare(b);
    })
    .slice(0, 8);

  const exact = ql && allIngs.some((n) => n.toLowerCase() === ql);
  const showDropdown = focused;

  const groups = { Produce: [], Dairy: [], Pantry: [], Protein: [], Other: [] };
  grocery.forEach((g) => {
    const key = groups[g.cat] ? g.cat : "Other";
    groups[key].push(g);
  });
  const checkedCount = grocery.filter((g) => g.checked).length;
  const total = grocery.length;

  // Pick from suggestion
  const choose = (name) => {
    if (!name) return;
    const data = window.ingData(name) || { cat: "Other" };
    const groceryCat = data.cat === "Vegetables" || data.cat === "Fruits" ? "Produce" : data.cat === "Protein" ? "Protein" : data.cat === "Dairy" ? "Dairy" : data.cat === "Other" ? "Other" : "Pantry";
    onAddManual({ name, qty: "", cat: groceryCat, checked: false, src: "manual" });
    setNewItem("");
    setHighlight(0);
    if (inputRef.current) inputRef.current.focus();
  };

  const onKeyDown = (e) => {
    if (!showDropdown) return;
    const total = suggestions.length + 1; // +1 for "Create new"
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(total - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(0, h - 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight < suggestions.length) {
        choose(suggestions[highlight]);
      } else {
        // "Create new ingredient" row
        onCreateIngredient(newItem.trim(), (createdName) => {
          if (createdName) choose(createdName);
        });
        setFocused(false);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Grocery list</h1>
          <p className="sub">{total - checkedCount} item{(total - checkedCount) === 1 ? "" : "s"} left to buy{checkedCount > 0 ? ` · ${checkedCount} checked off` : ""}.</p>
        </div>
        <div className="page-head-actions">
          {checkedCount > 0 && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={onClear}>
                <Icon n="trash-2" style={{ width: 14, height: 14 }} />
                Clear checked
              </button>
              <button className="btn btn-basil btn-sm" onClick={onMoveToPantry}>
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

        {showDropdown && (
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
                <span className="ac-cat">{(window.ingData(n) || {}).cat || ""}</span>
              </button>
            ))}
            <button
              type="button"
              className={"autocomplete-item autocomplete-create" + (highlight === suggestions.length ? " hl" : "")}
              onMouseEnter={() => setHighlight(suggestions.length)}
              onMouseDown={(e) => {
                e.preventDefault();
                onCreateIngredient(newItem.trim(), (createdName) => {
                  if (createdName) choose(createdName);
                });
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
            <h4>
              {cat}
              <span className="ct">{items.length}</span>
            </h4>
            {items.map((g, idx) => (
              <div key={`${cat}-${idx}-${g.name}`} className={"grocery-row" + (g.checked ? " checked" : "")}>
                <button
                  className={"grocery-check" + (g.checked ? " checked" : "")}
                  onClick={() => onToggle(g)}
                  aria-label={g.checked ? "Uncheck" : "Check off"}
                >
                  {g.checked && <Icon n="check" style={{ width: 14, height: 14, strokeWidth: 3 }} />}
                </button>
                <span className="grocery-row-ico">
                  <IngIcon name={g.name} size={24} />
                </span>
                <span className="name">{g.name}</span>
                {g.qty && <span className="qty">{g.qty}</span>}
                {g.src !== "manual" && (
                  <span className="src">from {g.src}</span>
                )}
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
};

/* ========== PREFERENCES SCREEN ========== */

const PreferencesScreen = ({ prefs, onChange, onResetOnboarding, onResetAll }) => {
  const set = (k, v) => onChange({ ...prefs, [k]: v });
  const toggle = (k, v) => {
    const arr = prefs[k] || [];
    set(k, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <h1>Preferences</h1>
          <p className="sub">Tell us what kind of meals you want. We'll match the wheel to your taste.</p>
        </div>
      </div>

      <div className="pref-group">
        <h3>Diet</h3>
        <p className="pref-sub">Recipes we should prioritize.</p>
        <div className="pref-options">
          {["No preference", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free", "Low-carb", "High-protein"].map((d) => (
            <button
              key={d}
              className={"pref-option" + (prefs.diet === d ? " active" : "")}
              onClick={() => set("diet", d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Avoid these</h3>
        <p className="pref-sub">Allergies or ingredients you never want suggested.</p>
        <div className="pref-options">
          {["Peanuts", "Shellfish", "Dairy", "Mushrooms", "Cilantro", "Eggs", "Soy", "Tree nuts"].map((a) => (
            <button
              key={a}
              className={"pref-option" + ((prefs.avoid || []).includes(a) ? " active" : "")}
              onClick={() => toggle("avoid", a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Max cook time</h3>
        <p className="pref-sub">We won't suggest anything that takes longer.</p>
        <div className="pref-slider">
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={prefs.maxTime || 30}
            onChange={(e) => set("maxTime", Number(e.target.value))}
          />
          <div className="v">{prefs.maxTime || 30} <span style={{ fontSize: 13, color: "var(--ps-charcoal-3)" }}>min</span></div>
        </div>
      </div>

      <div className="pref-group">
        <h3>Difficulty</h3>
        <p className="pref-sub">How much effort you're up for tonight.</p>
        <div className="pref-options">
          {["Easy", "Medium", "Anything"].map((d) => (
            <button
              key={d}
              className={"pref-option" + (prefs.difficulty === d ? " active" : "")}
              onClick={() => set("difficulty", d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Default servings</h3>
        <p className="pref-sub">Recipes scale automatically.</p>
        <div className="pref-slider">
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={prefs.servings || 2}
            onChange={(e) => set("servings", Number(e.target.value))}
          />
          <div className="v">{prefs.servings || 2}</div>
        </div>
      </div>

      <div className="pref-group">
        <h3>Spin priority</h3>
        <p className="pref-sub">What we should optimize for when matching recipes.</p>
        <div className="pref-options">
          {[
            { k: "use-what-i-have",  l: "Use what I have" },
            { k: "use-expiring",     l: "Use expiring food" },
            { k: "cheapest",         l: "Cheapest meal" },
            { k: "healthiest",       l: "Healthiest" },
            { k: "highest-protein",  l: "Highest protein" },
          ].map((o) => (
            <button
              key={o.k}
              className={"pref-option" + (prefs.priority === o.k ? " active" : "")}
              onClick={() => set("priority", o.k)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group" style={{ background: "transparent", boxShadow: "none", border: "1px dashed var(--ps-line-strong)" }}>
        <h3>Prototype actions</h3>
        <p className="pref-sub">Reset state to explore the app from a different starting point.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={onResetOnboarding}>
            <Icon n="play-circle" style={{ width: 14, height: 14 }} />
            Replay onboarding
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onResetAll}>
            <Icon n="rotate-ccw" style={{ width: 14, height: 14 }} />
            Reset all data
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========== ONBOARDING ========== */

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [picked, setPicked] = React.useState(["Tomato", "Pasta", "Garlic", "Olive Oil", "Spinach", "Cheese", "Eggs", "Onion"]);
  const [diet, setDiet] = React.useState("No preference");
  const [maxTime, setMaxTime] = React.useState(30);

  const togglePick = (n) => {
    setPicked((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]);
  };

  const next = () => {
    if (step >= 3) {
      onComplete({ picked, diet, maxTime });
    } else {
      setStep(step + 1);
    }
  };

  const skip = () => onComplete({ picked: window.INITIAL_PANTRY.map((p) => p.name), diet: "No preference", maxTime: 30 });

  return (
    <div className="onb-page">
      <div className="onb-card">
        <div className="onb-progress">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={"dot " + (i < step ? "done" : i === step ? "current" : "")}></div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="onb-illus spinning">
              <img src="assets/pantryspin-mark.png" alt="" />
            </div>
            <h1 className="onb-headline">
              Welcome to <span className="tomato">PantrySpin</span>.
            </h1>
            <p className="onb-sub">
              Turn random ingredients into tonight's dinner. Add what you have, spin the wheel, and get recipe ideas you can make right now.
            </p>
            <div className="onb-actions">
              <button className="btn btn-primary btn-lg" onClick={next}>
                Get started
                <Icon n="chevron-right" style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip intro</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="eyebrow">Step 1 of 3</div>
            <h1 className="onb-headline" style={{ fontSize: 36 }}>
              What do you have <span className="basil">right now</span>?
            </h1>
            <p className="onb-sub">Tap a few staples you've got in the kitchen. You can add more later.</p>
            <div className="add-grid" style={{ marginTop: 8 }}>
              {window.QUICK_ADD.slice(0, 12).map((n) => {
                const on = picked.includes(n);
                return (
                  <button
                    key={n}
                    className={"add-tile" + (on ? " added" : "")}
                    onClick={() => togglePick(n)}
                  >
                    <span className="tile-ico">
                      {on
                        ? <Icon n="check" style={{ width: 18, height: 18, color: "#fff" }} />
                        : <IngIcon name={n} size={28} />}
                    </span>
                    <span className="tile-name">{n}</span>
                  </button>
                );
              })}
            </div>
            <div className="onb-actions">
              <button className="btn btn-secondary" onClick={() => setStep(0)}>
                <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
                Back
              </button>
              <button className="btn btn-primary" onClick={next} disabled={picked.length < 2}>
                Continue ({picked.length} added)
                <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="eyebrow">Step 2 of 3</div>
            <h1 className="onb-headline" style={{ fontSize: 36 }}>
              Any <span className="basil">diet</span> we should know about?
            </h1>
            <p className="onb-sub">We'll prioritize recipes that fit.</p>
            <div className="pref-options" style={{ marginTop: 12 }}>
              {["No preference", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free", "Low-carb", "High-protein"].map((d) => (
                <button
                  key={d}
                  className={"pref-option" + (diet === d ? " active" : "")}
                  onClick={() => setDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <div className="section-label" style={{ marginTop: 0 }}>How much time do you usually want to cook?</div>
              <div className="pref-slider">
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                />
                <div className="v">{maxTime} <span style={{ fontSize: 13, color: "var(--ps-charcoal-3)" }}>min</span></div>
              </div>
            </div>
            <div className="onb-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
                Back
              </button>
              <button className="btn btn-primary" onClick={next}>
                Continue
                <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div className="onb-illus">
              <img src="assets/pantryspin-mark.png" alt="" />
            </div>
            <h1 className="onb-headline">
              Ready to <span className="tomato">spin</span>?
            </h1>
            <p className="onb-sub" style={{ margin: "0 auto 32px" }}>
              You've got {picked.length} ingredients in your pantry. Let's see what you can cook.
            </p>
            <button className="btn btn-primary btn-lg" onClick={next}>
              Spin my first recipe
              <Icon n="sparkles" style={{ width: 18, height: 18 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

window.PantryScreen = PantryScreen;
window.SavedScreen = SavedScreen;
window.GroceryScreen = GroceryScreen;
window.PreferencesScreen = PreferencesScreen;
window.Onboarding = Onboarding;
