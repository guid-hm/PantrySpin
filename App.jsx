/* App.jsx — main app state + routing */

const App = () => {
  // ===== Persistent state =====
  const [onboarded, setOnboarded] = React.useState(() => localStorage.getItem("ps_onboarded") !== "0");
  const [route, setRoute] = React.useState("spin");
  const [pantry, setPantry] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_pantry");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return window.INITIAL_PANTRY;
  });
  const [saved, setSaved] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_saved");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return window.INITIAL_SAVED;
  });
  const [grocery, setGrocery] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_grocery");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return window.INITIAL_GROCERY;
  });
  // Custom (user-created) ingredients. Keyed by name.
  const [customIngs, setCustomIngs] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_custom_ings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  });
  // User-created recipes (built-ins remain in code)
  const [userRecipes, setUserRecipes] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_user_recipes");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });
  // Per-ingredient overrides (category/color/swatch) — works for built-ins too
  const [ingOverrides, setIngOverrides] = React.useState(() => {
    try {
      const stored = localStorage.getItem("ps_ing_overrides");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  });
  const [prefs, setPrefs] = React.useState({
    diet: "No preference",
    avoid: [],
    maxTime: 30,
    difficulty: "Easy",
    servings: 2,
    priority: "use-what-i-have",
  });

  // Sync custom ingredients to window so ingData() can find them
  React.useEffect(() => {
    window.__customIngs = customIngs;
  }, [customIngs]);
  React.useEffect(() => {
    window.__ingOverrides = ingOverrides;
  }, [ingOverrides]);
  // Initialize window globals on first render
  if (typeof window.__customIngs === "undefined") {
    window.__customIngs = customIngs;
  }
  if (typeof window.__ingOverrides === "undefined") {
    window.__ingOverrides = ingOverrides;
  }

  React.useEffect(() => { localStorage.setItem("ps_pantry", JSON.stringify(pantry)); }, [pantry]);
  React.useEffect(() => { localStorage.setItem("ps_saved", JSON.stringify(saved)); }, [saved]);
  React.useEffect(() => { localStorage.setItem("ps_grocery", JSON.stringify(grocery)); }, [grocery]);
  React.useEffect(() => { localStorage.setItem("ps_custom_ings", JSON.stringify(customIngs)); }, [customIngs]);
  React.useEffect(() => { localStorage.setItem("ps_user_recipes", JSON.stringify(userRecipes)); }, [userRecipes]);
  React.useEffect(() => { localStorage.setItem("ps_ing_overrides", JSON.stringify(ingOverrides)); }, [ingOverrides]);

  // ===== UI state =====
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [activeRecipe, setActiveRecipe] = React.useState(null);
  const [revealRecipe, setRevealRecipe] = React.useState(null);
  const [cookRecipe, setCookRecipe] = React.useState(null);
  const [rotation, setRotation] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [spinResult, setSpinResult] = React.useState(null);
  const [spinMode, setSpinMode] = React.useState("any");
  // Editing / creating
  const [editingItem, setEditingItem] = React.useState(null);
  const [createIngState, setCreateIngState] = React.useState(null); // { initialName, callback }
  const [showCreateRecipe, setShowCreateRecipe] = React.useState(false);

  const [toastMsg, setToastMsg] = React.useState(null);
  const toastTimer = React.useRef();
  const toast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  };

  // ===== Derived =====
  const expiring = pantry.filter((p) => p.expiresInDays <= 3).sort((a, b) => a.expiresInDays - b.expiresInDays);
  // Combined recipe list (built-in + user-created)
  const allRecipes = React.useMemo(() => [...userRecipes, ...window.RECIPES], [userRecipes]);

  // ===== Actions =====
  const addPantry = (name) => {
    setPantry((p) => {
      if (p.find((x) => x.name === name)) return p;
      const cat = (window.ingData(name) || {}).cat;
      const location = (cat === "Dairy" || cat === "Protein" || cat === "Vegetables") ? "Fridge" : "Pantry";
      return [...p, { name, expiresInDays: 14, location }];
    });
    toast(`Added ${name}`);
  };
  const removePantry = (name) => {
    setPantry((p) => p.filter((x) => x.name !== name));
  };
  const updatePantryItem = (oldName, updated) => {
    setPantry((p) => p.map((x) => x.name === oldName ? updated : x));
    toast(`Updated ${updated.name}`);
  };
  // Set a category/color override for an ingredient. Pass null to clear.
  const updateIngredient = (name, override) => {
    setIngOverrides((cur) => {
      const next = { ...cur };
      if (!override || (override.cat == null && override.color == null && override.swatch == null)) {
        delete next[name];
      } else {
        next[name] = { ...(cur[name] || {}), ...override };
      }
      window.__ingOverrides = next;
      return next;
    });
  };
  const createIngredient = (data) => {
    // data: { name, cat, color, swatch }
    setCustomIngs((cur) => ({ ...cur, [data.name]: { cat: data.cat, color: data.color, swatch: data.swatch } }));
    // Update window immediately so any consumer can find it before rerender
    window.__customIngs = { ...(window.__customIngs || {}), [data.name]: { cat: data.cat, color: data.color, swatch: data.swatch } };
    toast(`Created "${data.name}"`);
  };
  const toggleSave = (id) => {
    setSaved((s) => {
      const isOn = s.includes(id);
      toast(isOn ? "Removed from saved" : "Saved");
      return isOn ? s.filter((x) => x !== id) : [...s, id];
    });
  };
  const createRecipe = (recipe) => {
    setUserRecipes((rs) => [recipe, ...rs]);
    toast(`Recipe "${recipe.name}" saved`);
  };
  const deleteUserRecipe = (id) => {
    setUserRecipes((rs) => rs.filter((r) => r.id !== id));
    setSaved((s) => s.filter((x) => x !== id));
    toast("Recipe deleted");
  };
  const addMissingToGrocery = (recipe) => {
    const pantryNames = new Set(pantry.map((p) => p.name));
    const missing = recipe.needs.filter((n) => !pantryNames.has(n));
    if (missing.length === 0) {
      toast("You have everything!");
      return;
    }
    setGrocery((g) => {
      const existing = new Set(g.map((x) => x.name));
      const additions = missing.filter((n) => !existing.has(n)).map((n) => {
        const cat = (window.ingData(n) || {}).cat;
        const groceryCat = cat === "Vegetables" || cat === "Fruits" ? "Produce" : cat === "Protein" ? "Protein" : cat === "Dairy" ? "Dairy" : cat === "Other" ? "Other" : "Pantry";
        return { name: n, qty: "", cat: groceryCat, checked: false, src: recipe.name };
      });
      return [...g, ...additions];
    });
    toast(`Added ${missing.length} item${missing.length === 1 ? "" : "s"} to grocery list`);
  };

  // Open the create-ingredient modal. `callback` (optional) receives the new ingredient
  // name once it's created — used by autocomplete flows to immediately select it.
  const openCreateIngredient = (initialName, callback) => {
    setCreateIngState({ initialName: initialName || "", callback: callback || null });
  };

  // ===== Wheel spin =====
  const filterRecipes = (mode) => {
    const pantryNames = new Set(pantry.map((p) => p.name));
    let candidates = allRecipes.map((r) => {
      const score = window.matchScore(r, [...pantryNames]);
      return { ...r, _score: score };
    });
    // Apply mode filter
    if (mode === "quick") candidates = candidates.filter((r) => r.time < 20);
    else if (mode === "healthy") candidates = candidates.filter((r) => r.tags.includes("Vegetarian") || r.tags.includes("Healthy"));
    else if (mode === "comfort") candidates = candidates.filter((r) => r.tags.includes("Comfort") || r.tags.includes("Cozy"));
    else if (mode === "veg") candidates = candidates.filter((r) => r.diet.includes("vegetarian"));
    else if (mode === "expiring") {
      const expNames = new Set(expiring.map((e) => e.name));
      candidates = candidates.filter((r) => r.needs.some((n) => expNames.has(n)));
    }
    // Fall back to all if filter empty
    if (candidates.length === 0) {
      candidates = allRecipes.map((r) => ({ ...r, _score: window.matchScore(r, [...pantryNames]) }));
    }
    // Diet pref
    if (prefs.diet === "Vegetarian") {
      const veg = candidates.filter((r) => (r.diet || []).includes("vegetarian"));
      if (veg.length) candidates = veg;
    }
    // Avoid
    if (prefs.avoid && prefs.avoid.length) {
      const lower = prefs.avoid.map((x) => x.toLowerCase());
      const filtered = candidates.filter((r) => !r.needs.some((n) => lower.includes(n.toLowerCase())));
      if (filtered.length) candidates = filtered;
    }
    // Rank by match score, take top 3-4
    candidates.sort((a, b) => b._score.pct - a._score.pct);
    return candidates.slice(0, Math.min(4, candidates.length));
  };

  const spin = () => {
    if (spinning) return;
    if (pantry.length < 2) {
      toast("Add a few ingredients first");
      return;
    }
    setSpinning(true);
    setSpinResult(null);
    setRevealRecipe(null);

    const candidates = filterRecipes(spinMode);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    // Find category index in wheel
    const cats = window.WHEEL_CATEGORIES;
    let catIdx = cats.findIndex((c) => c.key === chosen.category);
    if (catIdx === -1) catIdx = Math.floor(Math.random() * cats.length);
    // Pointer is at top (0 deg in wheel-frame). Wedge i is centered at angle -90 + i*slice
    // After rotation by R, wedge i is at -90 + i*slice + R in screen coords.
    // For the pointer at top (-90), we want -90 + i*slice + R = -90 (mod 360)
    // => R = -i*slice (mod 360)
    const slice = 360 / cats.length;
    const target = ((-catIdx * slice) % 360 + 360) % 360;
    // Add 720 base + nudge so it's a natural-looking spin
    const fullSpins = 4 + Math.floor(Math.random() * 2); // 4-5 full rotations
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((target - currentMod) + 360) % 360;
    // Tiny offset inside the wedge for variety
    const jitter = (Math.random() - 0.5) * (slice * 0.6);
    const newRotation = rotation + fullSpins * 360 + delta + jitter;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const pantryNames = pantry.map((p) => p.name);
      const withMatch = { ...chosen, ...window.matchScore(chosen, pantryNames) };
      setSpinResult(withMatch);
      setRevealRecipe(withMatch);
    }, 2500);
  };

  const onPickRecipe = (r) => {
    const pantryNames = pantry.map((p) => p.name);
    setActiveRecipe({ ...r, ...window.matchScore(r, pantryNames) });
    setRevealRecipe(null);
  };

  const closeReveal = () => setRevealRecipe(null);

  // ===== Onboarding =====
  if (!onboarded) {
    return (
      <window.Onboarding
        onComplete={(data) => {
          if (data.picked && data.picked.length) {
            const newPantry = data.picked.map((name) => {
              const exists = window.INITIAL_PANTRY.find((p) => p.name === name);
              if (exists) return exists;
              const cat = (window.ingData(name) || {}).cat;
              return {
                name,
                expiresInDays: cat === "Vegetables" ? 5 : cat === "Dairy" || cat === "Protein" ? 10 : 30,
                location: cat === "Dairy" || cat === "Protein" || cat === "Vegetables" ? "Fridge" : "Pantry",
              };
            });
            setPantry(newPantry);
          }
          if (data.diet) setPrefs((p) => ({ ...p, diet: data.diet }));
          if (data.maxTime) setPrefs((p) => ({ ...p, maxTime: data.maxTime }));
          localStorage.setItem("ps_onboarded", "1");
          setOnboarded(true);
        }}
      />
    );
  }

  // ===== If a recipe is open in detail mode, render only that =====
  if (activeRecipe) {
    return (
      <>
        <div className="app-root">
          <Sidebar
            active={route}
            onNav={(k) => { setActiveRecipe(null); setRoute(k); }}
            savedCount={saved.length}
            groceryCount={grocery.filter((g) => !g.checked).length}
            pantryCount={pantry.length}
            recipesCount={allRecipes.length}
          />
          <main className="main">
            <window.RecipeDetail
              recipe={activeRecipe}
              pantry={pantry}
              saved={saved}
              onSave={toggleSave}
              onBack={() => setActiveRecipe(null)}
              onStartCooking={(r) => setCookRecipe(r)}
              onAddMissingToGrocery={addMissingToGrocery}
            />
          </main>
        </div>
        {cookRecipe && (
          <window.CookingMode recipe={cookRecipe} onClose={() => setCookRecipe(null)} />
        )}
        {toastMsg && (
          <div className="toast">
            <Icon n="check-circle-2" style={{ width: 16, height: 16, color: "var(--ps-butter)" }} />
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // ===== Main routing =====
  return (
    <>
      <div className="app-root">
        <Sidebar
          active={route}
          onNav={setRoute}
          savedCount={saved.length}
          groceryCount={grocery.filter((g) => !g.checked).length}
          pantryCount={pantry.length}
          recipesCount={allRecipes.length}
        />
        <main className="main">
          {route === "spin" && (
            <window.SpinScreen
              pantry={pantry}
              onAddPantry={addPantry}
              onRemovePantry={removePantry}
              onOpenAddModal={() => setShowAddModal(true)}
              saved={saved}
              onToggleSave={toggleSave}
              rotation={rotation}
              spinning={spinning}
              result={spinResult}
              spinMode={spinMode}
              onSpinModeChange={setSpinMode}
              onSpin={spin}
              onPickRecipe={onPickRecipe}
              expiring={expiring}
              recipes={allRecipes}
            />
          )}
          {route === "pantry" && (
            <window.PantryScreen
              pantry={pantry}
              onRemove={removePantry}
              onOpenAddModal={() => setShowAddModal(true)}
              onEditItem={(item) => setEditingItem(item)}
              onSpin={() => { setSpinMode("expiring"); setRoute("spin"); setTimeout(spin, 100); }}
              expiring={expiring}
            />
          )}
          {route === "recipes" && (
            <window.RecipesScreen
              recipes={allRecipes}
              saved={saved}
              pantry={pantry}
              onPickRecipe={onPickRecipe}
              onToggleSave={toggleSave}
              onOpenCreate={() => setShowCreateRecipe(true)}
              onDeleteUserRecipe={deleteUserRecipe}
            />
          )}
          {route === "saved" && (
            <window.SavedScreen
              saved={saved}
              pantry={pantry}
              onPickRecipe={onPickRecipe}
              onToggleSave={toggleSave}
              onGoSpin={() => setRoute("spin")}
            />
          )}
          {route === "grocery" && (
            <window.GroceryScreen
              grocery={grocery}
              onToggle={(g) => setGrocery((gs) => gs.map((x) => x === g ? { ...x, checked: !x.checked } : x))}
              onAddManual={(item) => { setGrocery((gs) => [...gs, item]); toast("Added to grocery list"); }}
              onClear={() => { setGrocery((gs) => gs.filter((g) => !g.checked)); toast("Checked items cleared"); }}
              onMoveToPantry={() => {
                setGrocery((gs) => {
                  const moved = gs.filter((g) => g.checked);
                  moved.forEach((item) => {
                    if (window.ingData(item.name)) {
                      addPantry(item.name);
                    }
                  });
                  return gs.filter((g) => !g.checked);
                });
                toast("Moved to pantry");
              }}
              onCreateIngredient={openCreateIngredient}
            />
          )}
          {route === "prefs" && (
            <window.PreferencesScreen
              prefs={prefs}
              onChange={setPrefs}
              onResetOnboarding={() => {
                localStorage.setItem("ps_onboarded", "0");
                setOnboarded(false);
              }}
              onResetAll={() => {
                localStorage.clear();
                location.reload();
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddModal && (
        <window.AddIngredientModal
          pantry={pantry}
          onAdd={addPantry}
          onClose={() => setShowAddModal(false)}
          onCreateIngredient={(initialName) => {
            openCreateIngredient(initialName, (name) => {
              if (name) addPantry(name);
            });
          }}
        />
      )}

      {editingItem && (
        <window.EditIngredientModal
          item={editingItem}
          onSave={(updated, ingChanges) => {
            updatePantryItem(editingItem.name, updated);
            if (ingChanges) updateIngredient(updated.name, ingChanges);
            setEditingItem(null);
          }}
          onRemove={(name) => {
            removePantry(name);
            setEditingItem(null);
            toast(`Removed ${name}`);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {createIngState && (
        <window.CreateIngredientModal
          initialName={createIngState.initialName}
          onSave={(data) => {
            createIngredient(data);
            const cb = createIngState.callback;
            setCreateIngState(null);
            if (cb) cb(data.name);
          }}
          onClose={() => setCreateIngState(null)}
        />
      )}

      {showCreateRecipe && (
        <window.CreateRecipeModal
          onSave={(recipe) => {
            createRecipe(recipe);
            setShowCreateRecipe(false);
          }}
          onClose={() => setShowCreateRecipe(false)}
          onCreateIngredient={(callback) => {
            openCreateIngredient("", callback);
          }}
        />
      )}

      {revealRecipe && !spinning && (
        <window.ResultReveal
          recipe={revealRecipe}
          pantry={pantry}
          saved={saved}
          onSave={toggleSave}
          onView={(r) => { onPickRecipe(r); closeReveal(); }}
          onSpinAgain={() => { closeReveal(); setTimeout(spin, 150); }}
          onAddMissingToGrocery={(r) => { addMissingToGrocery(r); }}
          onClose={closeReveal}
        />
      )}

      {cookRecipe && (
        <window.CookingMode recipe={cookRecipe} onClose={() => setCookRecipe(null)} />
      )}

      {toastMsg && (
        <div className="toast">
          <Icon n="check-circle-2" style={{ width: 16, height: 16, color: "var(--ps-butter)" }} />
          {toastMsg}
        </div>
      )}
    </>
  );
};

window.App = App;
