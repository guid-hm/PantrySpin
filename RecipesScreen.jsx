/* RecipesScreen.jsx — full recipe library + create-new flow */

const RecipesScreen = ({ recipes, saved, pantry, onPickRecipe, onToggleSave, onOpenCreate, onDeleteUserRecipe }) => {
  const [cat, setCat] = React.useState("All");
  const [q, setQ] = React.useState("");

  const pantryNames = pantry.map((p) => p.name);
  const cats = ["All", ...window.WHEEL_CATEGORIES.map((c) => c.label)];

  let filtered = recipes;
  if (cat !== "All") {
    const key = window.WHEEL_CATEGORIES.find((c) => c.label === cat)?.key;
    filtered = filtered.filter((r) => r.category === key);
  }
  if (q.trim()) {
    const ql = q.toLowerCase();
    filtered = filtered.filter((r) =>
      r.name.toLowerCase().includes(ql) ||
      r.needs.some((n) => n.toLowerCase().includes(ql)) ||
      (r.tags || []).some((t) => t.toLowerCase().includes(ql))
    );
  }

  // Sort by match score (best first)
  filtered = filtered.map((r) => {
    const ms = window.matchScore(r, pantryNames);
    return { ...r, _ms: ms };
  }).sort((a, b) => b._ms.pct - a._ms.pct);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>All recipes</h1>
          <p className="sub">{recipes.length} recipes in your menu — built-ins and the ones you've added.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Create recipe
          </button>
        </div>
      </div>

      <div className="recipes-toolbar">
        <div className="add-search" style={{ marginBottom: 0, flex: 1, maxWidth: 340 }}>
          <Icon n="search" style={{ width: 18, height: 18, color: "var(--ps-charcoal-3)" }} />
          <input
            placeholder="Search recipes, tags, ingredients…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button type="button" className="modal-close" style={{ width: 24, height: 24 }} onClick={() => setQ("")}>
              <Icon n="x" style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
        <div className="filter-row" style={{ marginBottom: 0 }}>
          {cats.map((c) => (
            <button
              key={c}
              className={"filter-pill" + (cat === c ? " active" : "")}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="ico"><Icon n="utensils" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">No recipes match</div>
          <div className="sub">Try a different category, or create a new recipe.</div>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Create recipe
          </button>
        </div>
      ) : (
        <div className="saved-grid">
          {filtered.map((r) => {
            const { pct } = r._ms;
            const isSaved = saved.includes(r.id);
            const isUser = !!r.userCreated;
            return (
              <div key={r.id} className="recipe-card" onClick={() => onPickRecipe(r)}>
                <div className="card-illus" style={{ background: window.thumbStyle(r.illusKey) }}>
                  <div dangerouslySetInnerHTML={{ __html: window.recipeIllustration(r.illusKey) }}></div>
                  <button
                    className={"card-heart" + (isSaved ? " saved" : "")}
                    onClick={(e) => { e.stopPropagation(); onToggleSave(r.id); }}
                    aria-label="Save recipe"
                  >
                    <Heart saved={isSaved} size={16} />
                  </button>
                  {isUser && (
                    <span className="card-user-tag">Yours</span>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-name">{r.name}</h3>
                  <div className="card-meta">
                    <span className="badge">{r.time} min</span>
                    <span style={{ color: "var(--ps-charcoal-3)" }}>·</span>
                    <span style={{ fontWeight: 600, color: pct >= 80 ? "var(--ps-basil-deep)" : pct >= 50 ? "var(--ps-charcoal-2)" : "var(--ps-tomato-deep)" }}>{pct}% match</span>
                  </div>
                </div>
                {isUser && (
                  <button
                    className="card-delete"
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${r.name}"?`)) onDeleteUserRecipe(r.id); }}
                    aria-label="Delete recipe"
                  >
                    <Icon n="trash-2" style={{ width: 13, height: 13 }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============ CREATE RECIPE MODAL ============ */

const CreateRecipeModal = ({ onSave, onClose, onCreateIngredient }) => {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("pasta");
  const [time, setTime] = React.useState(25);
  const [difficulty, setDifficulty] = React.useState("Easy");
  const [servings, setServings] = React.useState(2);
  const [tags, setTags] = React.useState([]);
  const [tagInput, setTagInput] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [needs, setNeeds] = React.useState([]);
  const [optional, setOptional] = React.useState([]);
  const [steps, setSteps] = React.useState([""]);
  const [showIngPicker, setShowIngPicker] = React.useState(false); // 'needs' | 'optional' | false

  const COMMON_TAGS = ["Vegetarian", "Vegan", "Gluten-free", "Quick", "High protein", "Healthy", "Comfort", "One pan", "Budget", "No cook"];

  const valid = name.trim().length > 0 && needs.length > 0 && steps.some((s) => s.trim().length > 0);

  const submit = () => {
    if (!valid) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
    const wheelCat = window.WHEEL_CATEGORIES.find((c) => c.key === category);
    onSave({
      id: slug,
      name: name.trim(),
      category,
      time: Number(time),
      difficulty,
      servings: Number(servings),
      tags,
      needs,
      optional,
      diet: tags.includes("Vegetarian") ? ["vegetarian"] : [],
      blurb: blurb.trim() || `A ${category} recipe you created.`,
      illusKey: {
        pasta: "pasta-tomato", rice: "rice-beans", soup: "soup", skillet: "skillet",
        wrap: "wrap", salad: "salad", breakfast: "eggs-toast", surprise: "fried-rice",
      }[category] || "pasta-tomato",
      steps: steps.filter((s) => s.trim().length > 0),
      userCreated: true,
    });
  };

  const addTag = (t) => {
    const v = t.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
  };
  const addStep = () => setSteps([...steps, ""]);
  const updateStep = (i, v) => setSteps(steps.map((s, idx) => idx === i ? v : s));
  const removeStep = (i) => setSteps(steps.length === 1 ? [""] : steps.filter((_, idx) => idx !== i));

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>Create recipe</h2>
            <p className="sub">Save a recipe to your menu. It'll show up in the wheel and recipe library.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="form-row">
          <label className="form-label">Recipe name</label>
          <input
            className="form-input bare"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma's Sunday Pasta"
            autoFocus
            style={{ fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700 }}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Short description</label>
          <textarea
            className="form-input bare"
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            rows={2}
            placeholder="One sentence about why this recipe is great…"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Wheel category</label>
          <p className="form-helper">Where this recipe lands when the wheel stops.</p>
          <div className="wheel-cat-picker">
            {window.WHEEL_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.key}
                className={"wheel-cat-tile" + (category === c.key ? " active" : "")}
                onClick={() => setCategory(c.key)}
                style={{ borderColor: category === c.key ? c.color : "var(--ps-line)" }}
              >
                <span className="dot" style={{ background: c.color }}></span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-row">
            <label className="form-label">Time</label>
            <div className="form-input-wrap">
              <input
                type="number"
                className="form-input bare"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min={5}
                max={300}
                style={{ flex: 1 }}
              />
              <span style={{ color: "var(--ps-charcoal-3)", fontSize: 13, paddingRight: 10 }}>min</span>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Difficulty</label>
            <select
              className="form-input bare"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Servings</label>
            <input
              type="number"
              className="form-input bare"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min={1}
              max={12}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Tags</label>
          <div className="chips-row" style={{ marginBottom: 8 }}>
            {tags.map((t) => (
              <span key={t} className="chip" style={{ background: "var(--ps-basil-soft)", borderColor: "var(--ps-basil)" }}>
                <span style={{ fontSize: 12, color: "var(--ps-basil-deep)", fontWeight: 600 }}>{t}</span>
                <button type="button" className="chip-x" onClick={() => setTags(tags.filter((x) => x !== t))}>
                  <Icon n="x" style={{ width: 12, height: 12 }} />
                </button>
              </span>
            ))}
          </div>
          <div className="chips-row">
            {COMMON_TAGS.filter((t) => !tags.includes(t)).map((t) => (
              <button
                type="button"
                key={t}
                className="chip suggest"
                onClick={() => addTag(t)}
              >
                <Icon n="plus" style={{ width: 11, height: 11 }} />
                <span style={{ fontSize: 12 }}>{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Ingredients you need</label>
          <p className="form-helper">Pick from your library, or create new ones.</p>
          <div className="chips-row" style={{ marginBottom: 10 }}>
            {needs.map((n) => (
              <span key={n} className="chip">
                <IngIcon name={n} size={22} />
                <span>{n}</span>
                <button type="button" className="chip-x" onClick={() => setNeeds(needs.filter((x) => x !== n))}>
                  <Icon n="x" style={{ width: 12, height: 12 }} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="chip suggest"
              onClick={() => setShowIngPicker("needs")}
            >
              <Icon n="plus" style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 12 }}>Add ingredient</span>
            </button>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Optional ingredients</label>
          <div className="chips-row">
            {optional.map((n) => (
              <span key={n} className="chip">
                <IngIcon name={n} size={22} />
                <span>{n}</span>
                <button type="button" className="chip-x" onClick={() => setOptional(optional.filter((x) => x !== n))}>
                  <Icon n="x" style={{ width: 12, height: 12 }} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="chip suggest"
              onClick={() => setShowIngPicker("optional")}
            >
              <Icon n="plus" style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 12 }}>Add optional</span>
            </button>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Steps</label>
          <p className="form-helper">Use **double asterisks** around an ingredient to highlight it in cooking mode.</p>
          <div className="steps-editor">
            {steps.map((s, i) => (
              <div key={i} className="step-edit-row">
                <span className="step-edit-num">{i + 1}</span>
                <textarea
                  className="form-input bare"
                  value={s}
                  onChange={(e) => updateStep(i, e.target.value)}
                  rows={2}
                  placeholder={i === 0 ? "Bring a pot of salted water to a boil. Add **pasta**…" : "Next step…"}
                />
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => removeStep(i)}
                  style={{ width: 28, height: 28, opacity: steps.length === 1 ? 0.5 : 1 }}
                  disabled={steps.length === 1 && !s}
                >
                  <Icon n="x" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addStep} style={{ marginTop: 8 }}>
              <Icon n="plus" style={{ width: 14, height: 14 }} />
              Add step
            </button>
          </div>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" disabled={!valid} onClick={submit}>
            <Icon n="check" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Save recipe
          </button>
        </div>

        {showIngPicker && (
          <IngredientPicker
            selected={showIngPicker === "needs" ? needs : optional}
            onAdd={(name) => {
              if (showIngPicker === "needs") setNeeds([...needs, name]);
              else setOptional([...optional, name]);
            }}
            onCreate={() => {
              setShowIngPicker(false);
              onCreateIngredient((newName) => {
                // After creating, push to current list and reopen picker
                if (showIngPicker === "needs") setNeeds((n) => [...n, newName]);
                else setOptional((o) => [...o, newName]);
              });
            }}
            onClose={() => setShowIngPicker(false)}
          />
        )}
      </div>
    </div>
  );
};

/* ============ Ingredient Picker (inline mini-modal) ============ */

const IngredientPicker = ({ selected, onAdd, onCreate, onClose }) => {
  const [q, setQ] = React.useState("");
  const all = window.allIngredientNames();
  const filtered = all
    .filter((n) => !selected.includes(n))
    .filter((n) => !q || n.toLowerCase().includes(q.toLowerCase()))
    .sort();

  return (
    <div className="modal-scrim" style={{ background: "rgba(45,42,38,0.5)" }} onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22 }}>Pick an ingredient</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon n="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="add-search">
          <Icon n="search" style={{ width: 18, height: 18, color: "var(--ps-charcoal-3)" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            autoFocus
          />
        </div>

        <div className="picker-list">
          {filtered.length === 0 && q && (
            <div style={{ padding: "16px 12px", color: "var(--ps-charcoal-3)", fontSize: 13, textAlign: "center" }}>
              No ingredients match "{q}".
            </div>
          )}
          {filtered.map((n) => (
            <button
              key={n}
              className="picker-item"
              onClick={() => { onAdd(n); }}
            >
              <IngIcon name={n} size={28} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>{n}</span>
              <Icon n="plus" style={{ width: 14, height: 14, color: "var(--ps-charcoal-3)" }} />
            </button>
          ))}
          <button className="picker-item picker-create" onClick={onCreate}>
            <span className="picker-create-ico">
              <Icon n="plus" style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
            </span>
            <span style={{ flex: 1, textAlign: "left", fontWeight: 600, color: "var(--ps-tomato-deep)" }}>
              Create new ingredient{q ? ` "${q}"` : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

window.RecipesScreen = RecipesScreen;
window.CreateRecipeModal = CreateRecipeModal;
window.IngredientPicker = IngredientPicker;
