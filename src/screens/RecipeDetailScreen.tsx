import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { usePantry } from "@/lib/api/pantry";
import { useRecipes } from "@/lib/api/recipes";
import { useSaved, useToggleSaved } from "@/lib/api/saved";
import { useIngredients } from "@/lib/api/ingredients";
import { useAddGroceryItems } from "@/lib/api/grocery";
import { SUBSTITUTIONS } from "@/data/ingredients";
import { ingData } from "@/lib/ingData";
import { matchScore } from "@/lib/matchScore";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";
import { Heart } from "@/components/Heart";
import { RecipeIllusFull } from "@/components/RecipeIllusFull";
import type { Recipe } from "@/types";

function renderStepText(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

export function RecipeDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pantry  = [] } = usePantry();
  const { data: recipes = [] } = useRecipes();
  const { data: saved   = [] } = useSaved();
  const { data: ingState }     = useIngredients();

  const toggleSaved    = useToggleSaved();
  const addGrocery     = useAddGroceryItems();
  const showToast      = useAppStore((s) => s.showToast);
  const setCookRecipeId = useAppStore((s) => s.setRevealRecipeId);

  const [cookingOpen, setCookingOpen] = useState(false);

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="empty">
        <div className="ttl">Recipe not found</div>
        <button className="btn btn-primary" onClick={() => navigate("/recipes")}>Browse recipes</button>
      </div>
    );
  }

  const pantryNames     = pantry.map((p) => p.name);
  const { have, need, pct } = matchScore(recipe, pantryNames);
  const isSaved         = saved.includes(recipe.id);
  const subTip          = need.find((n) => SUBSTITUTIONS[n]) ?? null;

  const handleAddMissing = () => {
    if (need.length === 0) { showToast("You have everything!"); return; }
    const items = need.map((n) => {
      const data = ingData(n, customIngs, ingOverrides);
      const cat  = data?.cat;
      const groceryCat = cat === "Vegetables" || cat === "Fruits" ? "Produce"
        : cat === "Protein" ? "Protein" : cat === "Dairy" ? "Dairy" : cat === "Other" ? "Other" : "Pantry";
      return { name: n, qty: "", cat: groceryCat, checked: false, src: recipe.name };
    });
    addGrocery.mutate(items);
    showToast(`Added ${need.length} item${need.length === 1 ? "" : "s"} to grocery list`);
  };

  return (
    <>
      <div className="detail-page">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
          Back
        </button>

        <div className="detail-hero">
          <div className="detail-illus">
            <RecipeIllusFull illusKey={recipe.illusKey} height={360} radius={24} />
          </div>
          <div>
            <div className="detail-tags">
              <span className="detail-tag basil">
                <Icon n="clock" style={{ width: 13, height: 13 }} />
                {recipe.time} min
              </span>
              {recipe.tags.map((t) => (
                <span key={t} className="detail-tag">{t}</span>
              ))}
            </div>
            <h1 className="detail-title">{recipe.name}</h1>
            <p className="detail-sub">{recipe.blurb}</p>

            <div className="detail-stats">
              <div className="detail-stat"><div className="l">Cook time</div><div className="v">{recipe.time}<span className="unit"> min</span></div></div>
              <div className="detail-stat"><div className="l">Difficulty</div><div className="v">{recipe.difficulty}</div></div>
              <div className="detail-stat"><div className="l">Serves</div><div className="v">{recipe.servings}</div></div>
              <div className="detail-stat"><div className="l">Match</div><div className="v" style={{ color: "var(--ps-basil-deep)" }}>{pct}%</div></div>
            </div>

            <div className="detail-ctas">
              <button className="btn btn-primary" onClick={() => setCookingOpen(true)}>
                <Icon n="chef-hat" style={{ width: 16, height: 16 }} />
                Start cooking
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => toggleSaved.mutate({ id: recipe.id, isSaved })}
                style={isSaved ? { background: "var(--ps-tomato-soft)", borderColor: "var(--ps-tomato)" } : {}}
              >
                <span style={{ color: isSaved ? "var(--ps-tomato)" : "currentColor", display: "inline-flex" }}>
                  <Heart saved={isSaved} size={16} />
                </span>
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div>
            <div className="match-summary">
              <div className="pct">{have.length}/{recipe.needs.length}</div>
              <div className="lbl">ingredients on hand</div>
              <div className="match-bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
            </div>

            <div className="section-label" style={{ marginTop: 0 }}>You have</div>
            <div className="ing-list">
              {have.map((n) => (
                <div key={n} className="ing-row have">
                  <IngIcon name={n} size={22} />
                  <span className="name">{n}</span>
                  <Icon n="check-circle-2" className="check" style={{ width: 18, height: 18 }} />
                </div>
              ))}
            </div>

            {need.length > 0 && (
              <>
                <div className="section-label">You'll need</div>
                <div className="ing-list">
                  {need.map((n) => (
                    <div key={n} className="ing-row need">
                      <IngIcon name={n} size={22} />
                      <span className="name">{n}</span>
                      <span className="sub">to buy</span>
                    </div>
                  ))}
                </div>
                {subTip && (
                  <div className="sub-tip">
                    <Icon n="lightbulb" style={{ width: 16, height: 16, strokeWidth: 2 }} />
                    <div><b>No {subTip}?</b> {SUBSTITUTIONS[subTip]}</div>
                  </div>
                )}
                <button className="btn btn-secondary" style={{ width: "100%", marginTop: 12 }} onClick={handleAddMissing}>
                  <Icon n="shopping-cart" style={{ width: 14, height: 14 }} />
                  Add missing to grocery list
                </button>
              </>
            )}

            {recipe.optional.length > 0 && (
              <>
                <div className="section-label">Optional</div>
                <div className="chips-row">
                  {recipe.optional.map((n) => (
                    <span key={n} className="chip">
                      <IngIcon name={n} size={20} />
                      <span style={{ fontSize: 12 }}>{n}</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="section-label" style={{ marginTop: 0 }}>How to make it</div>
            <div className="steps-list">
              {recipe.steps.map((s, i) => (
                <div key={i} className="step-row">
                  <span className="num">{i + 1}</span>
                  <div className="body">{renderStepText(s)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {cookingOpen && (
        <CookingMode recipe={recipe} onClose={() => setCookingOpen(false)} />
      )}
    </>
  );
}

function CookingMode({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [step,         setStep]         = useState(0);
  const [timer,        setTimer]        = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const total = recipe.steps.length;
  const isLast = step >= total - 1;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="cook-page">
      <div className="cook-head">
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ps-butter)", textTransform: "uppercase", marginBottom: 4 }}>
            Cooking mode
          </div>
          <div className="ttl">{recipe.name}</div>
        </div>
        <button className="cook-close" onClick={onClose}>
          <Icon n="x" style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div className="cook-progress">
        {recipe.steps.map((_, i) => (
          <div key={i} className={"bar" + (i < step ? " done" : i === step ? " current" : "")}>
            <div className="fill" />
          </div>
        ))}
      </div>

      <div className="cook-stage">
        <div className="cook-step-num">Step {step + 1} of {total}</div>
        <p className="cook-step-body">{renderStepText(recipe.steps[step])}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div className="cook-timer">
            <Icon n="timer" style={{ width: 18, height: 18 }} />
            {fmt(timer)}
          </div>
          <button className="cook-btn" onClick={() => setTimerRunning((r) => !r)} style={{ padding: "10px 18px" }}>
            <Icon n={timerRunning ? "pause" : "play"} style={{ width: 14, height: 14 }} />
            {timerRunning ? "Pause" : "Start timer"}
          </button>
          {timer > 0 && (
            <button className="cook-btn" onClick={() => { setTimer(0); setTimerRunning(false); }} style={{ padding: "10px 18px" }}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="cook-nav">
        <button className="cook-btn" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={step === 0 ? { opacity: 0.4, cursor: "not-allowed" } : {}}>
          <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
          Previous
        </button>
        <button className={"cook-btn " + (isLast ? "success" : "primary")} onClick={() => { if (isLast) onClose(); else setStep(step + 1); }}>
          {isLast
            ? <><Icon n="check" style={{ width: 16, height: 16 }} />Done cooking</>
            : <>Next step<Icon n="chevron-right" style={{ width: 16, height: 16 }} /></>}
        </button>
      </div>
    </div>
  );
}
