import { useAppStore } from "@/store/useAppStore";
import { usePantry, useRemovePantry } from "@/lib/api/pantry";
import { useRecipes } from "@/lib/api/recipes";
import { useSaved, useToggleSaved } from "@/lib/api/saved";
import { usePrefs } from "@/lib/api/prefs";
import { matchScore } from "@/lib/matchScore";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";
import { Heart } from "@/components/Heart";
import { Wheel, WheelPointer } from "@/components/Wheel";
import { thumbStyle } from "@/data/recipes";
import { recipeIllustration } from "@/data/illustrations";
import { useNavigate } from "react-router-dom";

const SPIN_MODES = [
  { key: "any",      label: "Anything",  icon: "sparkles" },
  { key: "quick",    label: "Under 20m", icon: "zap" },
  { key: "healthy",  label: "Healthy",   icon: "leaf" },
  { key: "comfort",  label: "Comfort",   icon: "flame" },
  { key: "veg",      label: "Veg",       icon: "salad" },
  { key: "expiring", label: "Expiring",  icon: "alarm-clock" },
] as const;

export function SpinScreen() {
  const { data: pantry  = [] } = usePantry();
  const { data: recipes = [] } = useRecipes();
  const { data: saved   = [] } = useSaved();
  const { data: prefs }        = usePrefs();

  const removePantry  = useRemovePantry();
  const toggleSaved   = useToggleSaved();

  const rotation    = useAppStore((s) => s.rotation);
  const spinning    = useAppStore((s) => s.spinning);
  const spinResult  = useAppStore((s) => s.spinResult);
  const spinMode    = useAppStore((s) => s.spinMode);
  const spin        = useAppStore((s) => s.spin);
  const setSpinMode = useAppStore((s) => s.setSpinMode);
  const setShowAddModal = useAppStore((s) => s.setShowAddModal);
  const showToast   = useAppStore((s) => s.showToast);

  const navigate = useNavigate();

  const pantryNames = pantry.map((p) => p.name);
  const expiring    = pantry.filter((p) => p.expiresInDays <= 3);

  const ranked = recipes
    .map((r) => ({ ...r, ...matchScore(r, pantryNames) }))
    .sort((a, b) => b.pct !== a.pct ? b.pct - a.pct : b.have.length - a.have.length);
  const topMatches = ranked.slice(0, 4);

  const resultRecipe    = spinResult ? recipes.find((r) => r.id === spinResult) : null;
  const resultWithMatch = resultRecipe
    ? { ...resultRecipe, ...matchScore(resultRecipe, pantryNames) }
    : null;

  const handleSpin = () => {
    if (prefs) spin(pantry, recipes, prefs);
  };

  const handleSpinExpiring = () => {
    setSpinMode("expiring");
    if (prefs) spin(pantry, recipes, prefs);
  };

  return (
    <div className="spin-stack">
      <div className="wheel-hero">
        <div className="wheel-hero-copy">
          <div className="eyebrow">Recipe roulette</div>
          <h1 className="wheel-headline">
            {resultWithMatch
              ? <>Tonight's pick — <span className="tomato">{resultWithMatch.name}</span>.</>
              : spinning
                ? <>Matching what you have<span className="basil">…</span></>
                : <>Turn what you have into <span className="tomato">tonight's dinner</span>.</>
            }
          </h1>
          <p className="wheel-sub">
            {resultWithMatch
              ? `${resultWithMatch.have.length} of ${resultWithMatch.needs.length} ingredients on hand · ${resultWithMatch.time} min.`
              : "Spin the wheel and we'll match a recipe that uses what's in your pantry."}
          </p>

          <div className="wheel-modes">
            {SPIN_MODES.map((m) => (
              <button
                key={m.key}
                className={"wheel-mode" + (spinMode === m.key ? " active" : "")}
                onClick={() => setSpinMode(m.key)}
                disabled={spinning}
                title={m.label}
              >
                <Icon n={m.icon} className="mode-ic" />
                {m.label}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary spin-cta"
            onClick={handleSpin}
            disabled={spinning || pantry.length < 2}
          >
            {spinning ? "Spinning…" : resultWithMatch ? "Spin again" : "Spin the wheel"}
            {!spinning && (
              <Icon n={resultWithMatch ? "refresh-cw" : "chevron-right"} className="ico" />
            )}
          </button>

          {resultWithMatch && !spinning && (
            <button className="result-pill" onClick={() => navigate(`/recipe/${resultWithMatch.id}`)}>
              <Icon n="sparkles" style={{ width: 14, height: 14, color: "var(--ps-basil-deep)" }} />
              <span>View full recipe</span>
              <Icon n="chevron-right" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
            </button>
          )}
        </div>

        <div className="wheel-canvas-wrap">
          <div className="wheel-canvas">
            <WheelPointer bobbing={!spinning && !resultWithMatch} />
            <Wheel rotation={rotation} spinning={spinning} />
            <div className="wheel-hub"></div>
          </div>
        </div>
      </div>

      <div className="matches-row">
        <div className="matches-head">
          <h2 className="matches-title">
            {resultWithMatch ? "Other ideas with what you have" : "Recipes that match your pantry"}
          </h2>
          <span className="matches-meta">Sorted by match</span>
        </div>
        <div className="matches-grid">
          {topMatches.map((r) => (
            <button
              key={r.id}
              className={"match-card" + (resultWithMatch?.id === r.id ? " active" : "")}
              onClick={() => navigate(`/recipe/${r.id}`)}
            >
              <div className="match-card-illus" style={{ background: thumbStyle(r.illusKey) }}>
                <div dangerouslySetInnerHTML={{ __html: recipeIllustration(r.illusKey) }} />
                <span
                  className={"match-heart" + (saved.includes(r.id) ? " saved" : "")}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaved.mutate({ id: r.id, isSaved: saved.includes(r.id) });
                  }}
                >
                  <Heart saved={saved.includes(r.id)} size={14} />
                </span>
                <span className={"match-pct " + (r.pct >= 80 ? "good" : r.pct >= 50 ? "okay" : "low")}>
                  {r.pct}%
                </span>
              </div>
              <div className="match-card-body">
                <div className="match-name">{r.name}</div>
                <div className="match-meta">
                  <span>{r.time} min</span>
                  <span className="dot">·</span>
                  <span>{r.have.length}/{r.needs.length} ingredients</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pantry-strip">
        <div className="matches-head">
          <h2 className="matches-title">My pantry</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="matches-meta">{pantry.length} items</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
              <Icon n="plus" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              Add ingredient
            </button>
          </div>
        </div>

        {expiring.length > 0 && (
          <button className="expiring-tile wide" onClick={handleSpinExpiring}>
            <span className="ex-icon">
              <Icon n="alarm-clock" style={{ width: 14, height: 14 }} />
            </span>
            <span className="ex-body">
              <span className="ex-l">{expiring.length} expiring soon</span>
              <span className="ex-s">
                {expiring.slice(0, 5).map((e) => e.name).join(", ")}
                {expiring.length > 5 ? "…" : ""}
              </span>
            </span>
            <span className="ex-cta">
              Spin with expiring
              <Icon n="chevron-right" style={{ width: 14, height: 14 }} />
            </span>
          </button>
        )}

        {pantry.length === 0 && (
          <div className="empty" style={{ margin: "12px 0 4px", padding: "28px 20px" }}>
            <div className="ico"><Icon n="package" style={{ width: 22, height: 22 }} /></div>
            <div className="ttl" style={{ fontSize: 15 }}>Pantry is empty</div>
            <div className="sub" style={{ fontSize: 13 }}>Add a few ingredients so we can match recipes for you.</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
              <Icon n="plus" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              Add ingredients
            </button>
          </div>
        )}

        <div className="pantry-strip-chips">
          {pantry.map((item) => {
            const expSoon = item.expiresInDays <= 3;
            return (
              <span key={item.name} className={"chip" + (expSoon ? " expiring" : "")}>
                <IngIcon name={item.name} size={22} />
                <span>{item.name}</span>
                <button
                  className="chip-x"
                  onClick={() => {
                    removePantry.mutate(item.name);
                    showToast(`Removed ${item.name}`);
                  }}
                  aria-label={`Remove ${item.name}`}
                >
                  <Icon n="x" style={{ width: 12, height: 12 }} />
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
