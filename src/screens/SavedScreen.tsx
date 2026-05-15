import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePantry } from "@/lib/api/pantry";
import { useRecipes } from "@/lib/api/recipes";
import { useSaved, useToggleSaved } from "@/lib/api/saved";
import { matchScore } from "@/lib/matchScore";
import { Icon } from "@/components/Icon";
import { Heart } from "@/components/Heart";
import { SkeletonCard } from "@/components/Skeleton";
import { thumbStyle } from "@/data/recipes";
import { recipeIllustration } from "@/data/illustrations";

const FILTERS = ["All", "Quick (<25 min)", "Vegetarian", "High protein"] as const;

export function SavedScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const { data: pantry  = [] }            = usePantry();
  const { data: recipes = [], isLoading } = useRecipes();
  const { data: saved   = [] }            = useSaved();
  const toggleSaved = useToggleSaved();
  const navigate    = useNavigate();

  const pantryNames    = pantry.map((p) => p.name);
  const savedRecipes   = recipes.filter((r) => saved.includes(r.id));
  const filtered       = savedRecipes.filter((r) => {
    if (filter === "All")            return true;
    if (filter === "Quick (<25 min)") return r.time < 25;
    if (filter === "Vegetarian")     return r.tags.includes("Vegetarian");
    if (filter === "High protein")   return r.tags.includes("High protein");
    return true;
  });

  if (isLoading) {
    return (
      <div>
        <div className="page-head"><div><h1>Saved recipes</h1><p className="sub">Loading…</p></div></div>
        <div className="saved-grid" style={{ marginTop: 24 }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

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
          <button className="btn btn-primary" onClick={() => navigate("/")}>
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
        {FILTERS.map((f) => (
          <button key={f} className={"filter-pill" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="saved-grid">
        {filtered.map((r) => {
          const { pct } = matchScore(r, pantryNames);
          return (
            <div key={r.id} className="recipe-card" onClick={() => navigate(`/recipe/${r.id}`)}>
              <div className="card-illus" style={{ background: thumbStyle(r.illusKey) }}>
                <div dangerouslySetInnerHTML={{ __html: recipeIllustration(r.illusKey) }} />
                <button
                  className="card-heart saved"
                  onClick={(e) => { e.stopPropagation(); toggleSaved.mutate({ id: r.id, isSaved: true }); }}
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
                  <span style={{ fontWeight: 600, color: pct >= 80 ? "var(--ps-basil-deep)" : pct >= 50 ? "var(--ps-charcoal-2)" : "var(--ps-tomato-deep)" }}>
                    {pct}% match
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
