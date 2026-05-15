/* SpinScreen.jsx — wheel-hero layout */

const SPIN_MODES = [
  { key: "any",      label: "Anything",  icon: "sparkles" },
  { key: "quick",    label: "Under 20m", icon: "zap" },
  { key: "healthy",  label: "Healthy",   icon: "leaf" },
  { key: "comfort",  label: "Comfort",   icon: "flame" },
  { key: "veg",      label: "Veg",       icon: "salad" },
  { key: "expiring", label: "Expiring",  icon: "alarm-clock" },
];

const SpinScreen = ({
  pantry, onAddPantry, onRemovePantry, onOpenAddModal,
  saved, onToggleSave,
  rotation, spinning, result, spinMode, onSpinModeChange, onSpin,
  onPickRecipe, expiring,
  recipes,
}) => {
  const pantryNames = pantry.map((p) => p.name);
  const recipeList = recipes || window.RECIPES;

  // Ranked recipes by match
  const ranked = recipeList.map((r) => {
    const score = window.matchScore(r, pantryNames);
    return { ...r, ...score };
  }).sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    return b.have.length - a.have.length;
  });
  const topMatches = ranked.slice(0, 4);

  return (
    <div className="spin-stack">
      {/* ============ WHEEL HERO ============ */}
      <div className="wheel-hero">
        <div className="wheel-hero-copy">
          <div className="eyebrow">Recipe roulette</div>
          <h1 className="wheel-headline">
            {result
              ? <>Tonight's pick — <span className="tomato">{result.name}</span>.</>
              : spinning
                ? <>Matching what you have<span className="basil">…</span></>
                : <>Turn what you have into <span className="tomato">tonight's dinner</span>.</>
            }
          </h1>
          <p className="wheel-sub">
            {result
              ? `${result.have.length} of ${result.needs.length} ingredients on hand · ${result.time} min.`
              : "Spin the wheel and we'll match a recipe that uses what's in your pantry."}
          </p>

          <div className="wheel-modes">
            {SPIN_MODES.map((m) => (
              <button
                key={m.key}
                className={"wheel-mode" + (spinMode === m.key ? " active" : "")}
                onClick={() => onSpinModeChange(m.key)}
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
            onClick={onSpin}
            disabled={spinning || pantry.length < 2}
          >
            {spinning ? "Spinning…" : result ? "Spin again" : "Spin the wheel"}
            {!spinning && (
              <Icon n={result ? "refresh-cw" : "chevron-right"} className="ico" />
            )}
          </button>

          {result && !spinning && (
            <button
              className="result-pill"
              onClick={() => onPickRecipe(result)}
            >
              <Icon n="sparkles" style={{ width: 14, height: 14, color: "var(--ps-basil-deep)" }} />
              <span>View full recipe</span>
              <Icon n="chevron-right" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
            </button>
          )}
        </div>

        <div className="wheel-canvas-wrap">
          <div className="wheel-canvas">
            <WheelPointer bobbing={!spinning && !result} />
            <Wheel rotation={rotation} spinning={spinning} />
            <div className="wheel-hub"></div>
          </div>
        </div>
      </div>

      {/* ============ MATCHES ROW ============ */}
      <div className="matches-row">
        <div className="matches-head">
          <h2 className="matches-title">
            {result ? "Other ideas with what you have" : "Recipes that match your pantry"}
          </h2>
          <span className="matches-meta">Sorted by match</span>
        </div>
        <div className="matches-grid">
          {topMatches.map((r) => (
            <button
              key={r.id}
              className={"match-card" + (result && result.id === r.id ? " active" : "")}
              onClick={() => onPickRecipe(r)}
            >
              <div className="match-card-illus" style={{ background: window.thumbStyle(r.illusKey) }}>
                <div dangerouslySetInnerHTML={{ __html: window.recipeIllustration(r.illusKey) }}></div>
                <span
                  className={"match-heart" + (saved.includes(r.id) ? " saved" : "")}
                  onClick={(e) => { e.stopPropagation(); onToggleSave(r.id); }}
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

      {/* ============ PANTRY STRIP ============ */}
      <div className="pantry-strip">
        <div className="matches-head">
          <h2 className="matches-title">My pantry</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="matches-meta">{pantry.length} items</span>
            <button className="btn btn-secondary btn-sm" onClick={onOpenAddModal}>
              <Icon n="plus" style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              Add ingredient
            </button>
          </div>
        </div>

        {expiring.length > 0 && (
          <button
            className="expiring-tile wide"
            onClick={() => { onSpinModeChange("expiring"); onSpin(); }}
          >
            <span className="ex-icon">
              <Icon n="alarm-clock" style={{ width: 14, height: 14 }} />
            </span>
            <span className="ex-body">
              <span className="ex-l">{expiring.length} expiring soon</span>
              <span className="ex-s">{expiring.map((e) => e.name).slice(0, 5).join(", ")}{expiring.length > 5 ? "…" : ""}</span>
            </span>
            <span className="ex-cta">
              Spin with expiring
              <Icon n="chevron-right" style={{ width: 14, height: 14 }} />
            </span>
          </button>
        )}

        <div className="pantry-strip-chips">
          {pantry.map((item) => {
            const expSoon = item.expiresInDays <= 3;
            return (
              <span key={item.name} className={"chip" + (expSoon ? " expiring" : "")}>
                <IngIcon name={item.name} size={22} />
                <span>{item.name}</span>
                <button className="chip-x" onClick={() => onRemovePantry(item.name)} aria-label={`Remove ${item.name}`}>
                  <Icon n="x" style={{ width: 12, height: 12 }} />
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

window.SpinScreen = SpinScreen;
window.SPIN_MODES = SPIN_MODES;
