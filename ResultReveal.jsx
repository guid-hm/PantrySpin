/* ResultReveal.jsx — modal overlay shown after a spin lands */

const ResultReveal = ({ recipe, pantry, saved, onSave, onView, onSpinAgain, onAddMissingToGrocery, onClose }) => {
  if (!recipe) return null;
  const { have, need, pct } = window.matchScore(recipe, pantry.map((p) => p.name));
  const isSaved = saved.includes(recipe.id);

  return (
    <div className="modal-scrim" onClick={onClose} style={{ alignItems: "center" }}>
      <div className="reveal-card" onClick={(e) => e.stopPropagation()}>
        <div className="reveal-hero">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="reveal-eyebrow">
              <Icon n="sparkles" style={{ width: 12, height: 12 }} />
              Tonight's pick
            </span>
            <button
              className="modal-close"
              onClick={onClose}
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
              <>
                <br />
                <b>You'll need:</b> {need.join(", ")}.
              </>
            )}
          </p>
        </div>

        <div className="reveal-actions">
          <button className="btn btn-secondary" onClick={onSpinAgain}>
            <Icon n="refresh-cw" style={{ width: 16, height: 16 }} />
            Spin again
          </button>
          {need.length > 0 && (
            <button className="btn btn-secondary" onClick={() => onAddMissingToGrocery(recipe)} title="Add missing to grocery list">
              <Icon n="shopping-cart" style={{ width: 16, height: 16 }} />
              Add missing
            </button>
          )}
          <button className="btn btn-primary" onClick={() => onView(recipe)}>
            View recipe
            <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

window.ResultReveal = ResultReveal;
