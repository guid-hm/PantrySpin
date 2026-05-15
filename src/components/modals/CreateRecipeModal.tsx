import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useCreateRecipe } from "@/lib/api/recipes";
import { useIngredients } from "@/lib/api/ingredients";
import { WHEEL_CATEGORIES } from "@/data/recipes";
import { allIngredientNames } from "@/lib/ingData";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";

const COMMON_TAGS = ["Vegetarian", "Vegan", "Gluten-free", "Quick", "High protein", "Healthy", "Comfort", "One pan", "Budget", "No cook"];

const ILLUS_BY_CAT: Record<string, string> = {
  pasta: "pasta-tomato", rice: "rice-beans", soup: "soup", skillet: "skillet",
  wrap: "wrap", salad: "salad", breakfast: "eggs-toast", surprise: "fried-rice",
};

function IngredientPicker({
  selected,
  onAdd,
  onCreate,
  onClose,
}: {
  selected: string[];
  onAdd: (name: string) => void;
  onCreate: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const { data: ingState } = useIngredients();
  const customIngs = ingState?.customs ?? {};
  const all = allIngredientNames(customIngs);
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
            <button key={n} className="picker-item" onClick={() => onAdd(n)}>
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
}

export function CreateRecipeModal() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("pasta");
  const [time, setTime] = useState(25);
  const [difficulty, setDifficulty] = useState("Easy");
  const [servings, setServings] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [blurb, setBlurb] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [optional, setOptional] = useState<string[]>([]);
  const [steps, setSteps] = useState([""]);
  const [showIngPicker, setShowIngPicker] = useState<"needs" | "optional" | false>(false);

  const showCreateRecipe    = useAppStore((s) => s.showCreateRecipe);
  const setShowCreateRecipe = useAppStore((s) => s.setShowCreateRecipe);
  const openCreateIngredient = useAppStore((s) => s.openCreateIngredient);
  const showToast            = useAppStore((s) => s.showToast);
  const createRecipeMutation = useCreateRecipe();

  if (!showCreateRecipe) return null;

  const valid = name.trim().length > 0 && needs.length > 0 && steps.some((s) => s.trim().length > 0);

  const submit = () => {
    if (!valid) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
    createRecipeMutation.mutate({
      id: slug,
      name: name.trim(),
      category,
      time: Number(time),
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
      servings: Number(servings),
      tags,
      needs,
      optional,
      diet: tags.includes("Vegetarian") ? ["vegetarian"] : [],
      blurb: blurb.trim() || `A ${category} recipe you created.`,
      illusKey: ILLUS_BY_CAT[category] ?? "pasta-tomato",
      steps: steps.filter((s) => s.trim().length > 0),
      isUserCreated: true,
    }, {
      onSuccess: () => {
        showToast(`Recipe "${name.trim()}" saved`);
        setShowCreateRecipe(false);
      },
    });
  };

  const addTag = (t: string) => {
    const v = t.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
  };
  const addStep = () => setSteps([...steps, ""]);
  const updateStep = (i: number, v: string) => setSteps(steps.map((s, idx) => idx === i ? v : s));
  const removeStep = (i: number) => setSteps(steps.length === 1 ? [""] : steps.filter((_, idx) => idx !== i));

  return (
    <div className="modal-scrim" onClick={() => setShowCreateRecipe(false)}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>Create recipe</h2>
            <p className="sub">Save a recipe to your menu. It'll show up in the wheel and recipe library.</p>
          </div>
          <button className="modal-close" onClick={() => setShowCreateRecipe(false)}>
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
            {WHEEL_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.key}
                className={"wheel-cat-tile" + (category === c.key ? " active" : "")}
                onClick={() => setCategory(c.key)}
                style={{ borderColor: category === c.key ? c.color : "var(--ps-line)" }}
              >
                <span className="dot" style={{ background: c.color }} />
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
                onChange={(e) => setTime(Number(e.target.value))}
                min={5}
                max={300}
                style={{ flex: 1 }}
              />
              <span style={{ color: "var(--ps-charcoal-3)", fontSize: 13, paddingRight: 10 }}>min</span>
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Difficulty</label>
            <select className="form-input bare" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
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
              onChange={(e) => setServings(Number(e.target.value))}
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
              <button type="button" key={t} className="chip suggest" onClick={() => addTag(t)}>
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
            <button type="button" className="chip suggest" onClick={() => setShowIngPicker("needs")}>
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
            <button type="button" className="chip suggest" onClick={() => setShowIngPicker("optional")}>
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
          <button type="button" className="btn btn-ghost" onClick={() => setShowCreateRecipe(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" disabled={!valid} onClick={submit}>
            <Icon n="check" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Save recipe
          </button>
        </div>

        {showIngPicker && (
          <IngredientPicker
            selected={showIngPicker === "needs" ? needs : optional}
            onAdd={(n) => {
              if (showIngPicker === "needs") setNeeds([...needs, n]);
              else setOptional([...optional, n]);
            }}
            onCreate={() => {
              const which = showIngPicker;
              setShowIngPicker(false);
              openCreateIngredient("", (newName) => {
                if (which === "needs") setNeeds((p) => [...p, newName]);
                else setOptional((p) => [...p, newName]);
              });
            }}
            onClose={() => setShowIngPicker(false)}
          />
        )}
      </div>
    </div>
  );
}
