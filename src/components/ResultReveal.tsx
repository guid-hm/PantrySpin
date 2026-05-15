import { useAppStore } from "@/store/useAppStore";
import { usePantry } from "@/lib/api/pantry";
import { useRecipes } from "@/lib/api/recipes";
import { useSaved } from "@/lib/api/saved";
import { usePrefs } from "@/lib/api/prefs";
import { useAddGroceryItems } from "@/lib/api/grocery";
import { useIngredients } from "@/lib/api/ingredients";
import { ingData } from "@/lib/ingData";
import { matchScore } from "@/lib/matchScore";
import { Icon } from "./Icon";
import { RecipeIllusFull } from "./RecipeIllusFull";
import { useNavigate } from "react-router-dom";

export function ResultReveal() {
  const revealRecipeId    = useAppStore((s) => s.revealRecipeId);
  const spinning          = useAppStore((s) => s.spinning);
  const spin              = useAppStore((s) => s.spin);
  const setRevealRecipeId = useAppStore((s) => s.setRevealRecipeId);
  const showToast         = useAppStore((s) => s.showToast);
  const navigate          = useNavigate();

  const { data: pantry  = [] } = usePantry();
  const { data: recipes = [] } = useRecipes();
  const { data: prefs }        = usePrefs();
  const { data: ingState }     = useIngredients();
  const addGrocery             = useAddGroceryItems();

  if (!revealRecipeId || spinning) return null;

  const recipe = recipes.find((r) => r.id === revealRecipeId);
  if (!recipe) return null;

  const pantryNames     = pantry.map((p) => p.name);
  const { have, need, pct } = matchScore(recipe, pantryNames);

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};

  const handleView = () => {
    setRevealRecipeId(null);
    navigate(`/recipe/${recipe.id}`);
  };

  const handleSpinAgain = () => {
    setRevealRecipeId(null);
    if (prefs) setTimeout(() => spin(pantry, recipes, prefs), 150);
  };

  const handleAddMissing = () => {
    const items = need.map((n) => {
      const data = ingData(n, customIngs, ingOverrides);
      const cat  = data?.cat;
      const groceryCat = cat === "Vegetables" || cat === "Fruits" ? "Produce"
        : cat === "Protein" ? "Protein" : cat === "Dairy" ? "Dairy" : "Pantry";
      return { name: n, qty: "", cat: groceryCat, checked: false, src: recipe.name };
    });
    addGrocery.mutate(items);
    showToast(`Added ${need.length} item${need.length === 1 ? "" : "s"} to grocery list`);
  };

  return (
    <div className="modal-scrim" onClick={() => setRevealRecipeId(null)} style={{ alignItems: "center" }}>
      <div className="reveal-card" onClick={(e) => e.stopPropagation()}>
        <div className="reveal-hero">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="reveal-eyebrow">
              <Icon n="sparkles" style={{ width: 12, height: 12 }} />
              Tonight's pick
            </span>
            <button
              className="modal-close"
              onClick={() => setRevealRecipeId(null)}
              style={{ background: "transparent", color: "var(--ps-charcoal-3)" }}
            >
              <Icon n="x" style={{ width: 18, height: 18 }} />
            </button>
          </div>

          <h2 className="reveal-name">{recipe.name}</h2>

          <div className="reveal-meta">
            <span className="tag">
              <Icon n="clock" style={{ width: 13, height: 13 }} />
              {recipe.time} min
            </span>
            <span className="tag">
              <Icon n="users" style={{ width: 13, height: 13 }} />
              {recipe.servings} serving{recipe.servings === 1 ? "" : "s"}
            </span>
            <span className="tag match">
              <Icon n="check-circle-2" style={{ width: 13, height: 13 }} />
              {pct}% pantry match
            </span>
          </div>

          <div className="reveal-illus">
            <RecipeIllusFull illusKey={recipe.illusKey} height={200} radius={18} />
          </div>

          <p className="reveal-uses">
            <b>You have:</b> {have.join(", ")}.
            {need.length > 0 && (
              <><br /><b>You'll need:</b> {need.join(", ")}.</>
            )}
          </p>
        </div>

        <div className="reveal-actions">
          <button className="btn btn-secondary" onClick={handleSpinAgain}>
            <Icon n="refresh-cw" style={{ width: 16, height: 16 }} />
            Spin again
          </button>
          {need.length > 0 && (
            <button className="btn btn-secondary" onClick={handleAddMissing} title="Add missing to grocery list">
              <Icon n="shopping-cart" style={{ width: 16, height: 16 }} />
              Add missing
            </button>
          )}
          <button className="btn btn-primary" onClick={handleView}>
            View recipe
            <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
