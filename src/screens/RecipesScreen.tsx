import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { usePantry } from "@/lib/api/pantry";
import { useRecipes, useDeleteRecipe } from "@/lib/api/recipes";
import { useSaved, useToggleSaved } from "@/lib/api/saved";
import { WHEEL_CATEGORIES } from "@/data/recipes";
import { matchScore } from "@/lib/matchScore";
import { Icon } from "@/components/Icon";
import { Heart } from "@/components/Heart";
import { SkeletonCard } from "@/components/Skeleton";
import { thumbStyle } from "@/data/recipes";
import { recipeIllustration } from "@/data/illustrations";

export function RecipesScreen() {
  const [cat, setCat] = useState("All");
  const [q,   setQ]   = useState("");

  const { data: pantry  = [] }              = usePantry();
  const { data: recipes = [], isLoading }   = useRecipes();
  const { data: saved   = [] }              = useSaved();

  const deleteRecipe        = useDeleteRecipe();
  const toggleSaved         = useToggleSaved();
  const setShowCreateRecipe = useAppStore((s) => s.setShowCreateRecipe);
  const setEditingRecipe    = useAppStore((s) => s.setEditingRecipe);
  const showToast           = useAppStore((s) => s.showToast);
  const navigate            = useNavigate();

  const pantryNames = pantry.map((p) => p.name);
  const cats        = ["All", ...WHEEL_CATEGORIES.map((c) => c.label)];

  let filtered = recipes;
  if (cat !== "All") {
    const key = WHEEL_CATEGORIES.find((c) => c.label === cat)?.key;
    filtered = filtered.filter((r) => r.category === key);
  }
  if (q.trim()) {
    const ql = q.toLowerCase();
    filtered = filtered.filter((r) =>
      r.name.toLowerCase().includes(ql) ||
      r.needs.some((n) => n.toLowerCase().includes(ql)) ||
      r.tags.some((t) => t.toLowerCase().includes(ql))
    );
  }

  const withMatch = filtered
    .map((r) => ({ ...r, _ms: matchScore(r, pantryNames) }))
    .sort((a, b) => b._ms.pct - a._ms.pct);

  if (isLoading) {
    return (
      <div>
        <div className="page-head"><div><h1>All recipes</h1><p className="sub">Loading…</p></div></div>
        <div className="saved-grid" style={{ marginTop: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>All recipes</h1>
          <p className="sub">{recipes.length} recipes in your menu — built-ins and the ones you've added.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateRecipe(true)}>
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
            <button key={c} className={"filter-pill" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {withMatch.length === 0 ? (
        <div className="empty">
          <div className="ico"><Icon n="utensils" style={{ width: 28, height: 28 }} /></div>
          <div className="ttl">No recipes match</div>
          <div className="sub">Try a different category, or create a new recipe.</div>
          <button className="btn btn-primary" onClick={() => setShowCreateRecipe(true)}>
            <Icon n="plus" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            Create recipe
          </button>
        </div>
      ) : (
        <div className="saved-grid">
          {withMatch.map((r) => {
            const { pct } = r._ms;
            const isSaved = saved.includes(r.id);
            const isUser  = !!r.isUserCreated;
            return (
              <div key={r.id} className="recipe-card" onClick={() => navigate(`/recipe/${r.id}`)}>
                <div className="card-illus" style={{ background: thumbStyle(r.illusKey) }}>
                  <div dangerouslySetInnerHTML={{ __html: recipeIllustration(r.illusKey) }} />
                  <button
                    className={"card-heart" + (isSaved ? " saved" : "")}
                    onClick={(e) => { e.stopPropagation(); toggleSaved.mutate({ id: r.id, isSaved }); }}
                    aria-label="Save recipe"
                  >
                    <Heart saved={isSaved} size={16} />
                  </button>
                  {isUser && <span className="card-user-tag">Yours</span>}
                </div>
                <div className="card-body">
                  <h3 className="card-name">{r.name}</h3>
                  <div className="card-meta">
                    <span className="badge">{r.time} min</span>
                    <span style={{ color: "var(--ps-charcoal-3)" }}>·</span>
                    <span style={{ fontWeight: 600, color: pct >= 80 ? "var(--ps-basil-deep)" : pct >= 50 ? "var(--ps-charcoal-2)" : "var(--ps-tomato-deep)" }}>
                      {pct}% match
                    </span>
                  </div>
                </div>
                {isUser && (
                  <div className="card-user-actions">
                    <button
                      className="card-action-btn"
                      onClick={(e) => { e.stopPropagation(); setEditingRecipe(r); }}
                      aria-label="Edit recipe"
                      title="Edit"
                    >
                      <Icon n="pencil" style={{ width: 13, height: 13 }} />
                    </button>
                    <button
                      className="card-action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${r.name}"?`)) {
                          deleteRecipe.mutate(r.id);
                          showToast("Recipe deleted");
                        }
                      }}
                      aria-label="Delete recipe"
                      title="Delete"
                    >
                      <Icon n="trash-2" style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
