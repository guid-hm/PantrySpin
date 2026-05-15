/* RecipeDetail.jsx — full recipe view + cooking mode */

const renderStepText = (s) => {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
};

const RecipeDetail = ({ recipe, pantry, saved, onSave, onBack, onStartCooking, onAddMissingToGrocery }) => {
  if (!recipe) return null;
  const pantryNames = pantry.map((p) => p.name);
  const { have, need, pct } = window.matchScore(recipe, pantryNames);
  const isSaved = saved.includes(recipe.id);

  // Show substitution tip for the most "interesting" missing ingredient
  const subTip = need.find((n) => window.SUBSTITUTIONS[n]) || null;

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={onBack}>
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
            <div className="detail-stat">
              <div className="l">Cook time</div>
              <div className="v">{recipe.time}<span className="unit"> min</span></div>
            </div>
            <div className="detail-stat">
              <div className="l">Difficulty</div>
              <div className="v">{recipe.difficulty}</div>
            </div>
            <div className="detail-stat">
              <div className="l">Serves</div>
              <div className="v">{recipe.servings}</div>
            </div>
            <div className="detail-stat">
              <div className="l">Match</div>
              <div className="v" style={{ color: "var(--ps-basil-deep)" }}>{pct}%</div>
            </div>
          </div>

          <div className="detail-ctas">
            <button className="btn btn-primary" onClick={() => onStartCooking(recipe)}>
              <Icon n="chef-hat" style={{ width: 16, height: 16 }} />
              Start cooking
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onSave(recipe.id)}
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
            <div className="match-bar"><div className="fill" style={{ width: `${pct}%` }}></div></div>
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
                  <div>
                    <b>No {subTip}?</b> {window.SUBSTITUTIONS[subTip]}
                  </div>
                </div>
              )}
              <button
                className="btn btn-secondary"
                style={{ width: "100%", marginTop: 12 }}
                onClick={() => onAddMissingToGrocery(recipe)}
              >
                <Icon n="shopping-cart" style={{ width: 14, height: 14 }} />
                Add missing to grocery list
              </button>
            </>
          )}

          {recipe.optional && recipe.optional.length > 0 && (
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
  );
};

// ===== Cooking mode (fullscreen overlay) =====

const CookingMode = ({ recipe, onClose }) => {
  const [step, setStep] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  React.useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  if (!recipe) return null;

  const total = recipe.steps.length;
  const isLast = step >= total - 1;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="cook-page">
      <div className="cook-head">
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ps-butter)", textTransform: "uppercase", marginBottom: 4 }}>Cooking mode</div>
          <div className="ttl">{recipe.name}</div>
        </div>
        <button className="cook-close" onClick={onClose}>
          <Icon n="x" style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div className="cook-progress">
        {recipe.steps.map((_, i) => (
          <div key={i} className={"bar" + (i < step ? " done" : i === step ? " current" : "")}>
            <div className="fill"></div>
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
          <button
            className="cook-btn"
            onClick={() => setTimerRunning((r) => !r)}
            style={{ padding: "10px 18px" }}
          >
            <Icon n={timerRunning ? "pause" : "play"} style={{ width: 14, height: 14 }} />
            {timerRunning ? "Pause" : "Start timer"}
          </button>
          {timer > 0 && (
            <button
              className="cook-btn"
              onClick={() => { setTimer(0); setTimerRunning(false); }}
              style={{ padding: "10px 18px" }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="cook-nav">
        <button
          className="cook-btn"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={step === 0 ? { opacity: 0.4, cursor: "not-allowed" } : {}}
        >
          <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
          Previous
        </button>
        <button
          className={"cook-btn " + (isLast ? "success" : "primary")}
          onClick={() => {
            if (isLast) onClose();
            else setStep(step + 1);
          }}
        >
          {isLast ? <><Icon n="check" style={{ width: 16, height: 16 }} />Done cooking</> : <>Next step<Icon n="chevron-right" style={{ width: 16, height: 16 }} /></>}
        </button>
      </div>
    </div>
  );
};

window.RecipeDetail = RecipeDetail;
window.CookingMode = CookingMode;
