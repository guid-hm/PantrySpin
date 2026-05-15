import { useState } from "react";
import { useBulkAddPantry } from "@/lib/api/pantry";
import { useUpdatePrefs } from "@/lib/api/prefs";
import { useIngredients } from "@/lib/api/ingredients";
import { QUICK_ADD } from "@/data/ingredients";
import { INITIAL_PANTRY } from "@/data/defaults";
import { ingData } from "@/lib/ingData";
import { Icon } from "@/components/Icon";
import { IngIcon } from "@/components/IngIcon";
import type { PantryItem } from "@/types";

export function OnboardingScreen() {
  const [step,    setStep]    = useState(0);
  const [picked,  setPicked]  = useState([
    "Tomato", "Pasta", "Garlic", "Olive Oil", "Spinach", "Cheese", "Eggs", "Onion",
  ]);
  const [diet,    setDiet]    = useState("No preference");
  const [maxTime, setMaxTime] = useState(30);

  const bulkAddPantry = useBulkAddPantry();
  const updatePrefs   = useUpdatePrefs();
  const { data: ingState } = useIngredients();

  const customIngs   = ingState?.customs   ?? {};
  const ingOverrides = ingState?.overrides ?? {};

  const togglePick = (n: string) => {
    setPicked((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]);
  };

  const complete = async (data: { picked: string[]; diet: string; maxTime: number }) => {
    const newPantry: PantryItem[] = data.picked.map((name) => {
      const existing = INITIAL_PANTRY.find((p) => p.name === name);
      if (existing) return existing;
      const d   = ingData(name, customIngs, ingOverrides);
      const cat = d?.cat;
      return {
        name,
        expiresInDays: cat === "Vegetables" ? 5 : cat === "Dairy" || cat === "Protein" ? 10 : 30,
        location:      cat === "Dairy" || cat === "Protein" || cat === "Vegetables" ? "Fridge" : "Pantry",
      };
    });
    await bulkAddPantry.mutateAsync(newPantry);
    await updatePrefs.mutateAsync({ diet: data.diet, maxTime: data.maxTime, onboarded: true });
  };

  const skip = () => complete({
    picked: INITIAL_PANTRY.map((p) => p.name),
    diet: "No preference",
    maxTime: 30,
  });

  const next = () => {
    if (step >= 3) complete({ picked, diet, maxTime });
    else setStep(step + 1);
  };

  return (
    <div className="onb-page">
      <div className="onb-card">
        <div className="onb-progress">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={"dot " + (i < step ? "done" : i === step ? "current" : "")} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="onb-illus spinning">
              <span className="ps-wordmark" style={{ fontSize: 64 }}>P<span className="spin">S</span></span>
            </div>
            <h1 className="onb-headline">
              Welcome to <span className="tomato">PantrySpin</span>.
            </h1>
            <p className="onb-sub">
              Turn random ingredients into tonight's dinner. Add what you have, spin the wheel, and get recipe ideas you can make right now.
            </p>
            <div className="onb-actions">
              <button className="btn btn-primary btn-lg" onClick={next}>
                Get started
                <Icon n="chevron-right" style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip intro</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="eyebrow">Step 1 of 3</div>
            <h1 className="onb-headline" style={{ fontSize: 36 }}>
              What do you have <span className="basil">right now</span>?
            </h1>
            <p className="onb-sub">Tap a few staples you've got in the kitchen. You can add more later.</p>
            <div className="add-grid" style={{ marginTop: 8 }}>
              {QUICK_ADD.slice(0, 12).map((n) => {
                const on = picked.includes(n);
                return (
                  <button
                    key={n}
                    className={"add-tile" + (on ? " added" : "")}
                    onClick={() => togglePick(n)}
                  >
                    <span className="tile-ico">
                      {on
                        ? <Icon n="check" style={{ width: 18, height: 18, color: "#fff" }} />
                        : <IngIcon name={n} size={28} />}
                    </span>
                    <span className="tile-name">{n}</span>
                  </button>
                );
              })}
            </div>
            <div className="onb-actions">
              <button className="btn btn-secondary" onClick={() => setStep(0)}>
                <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
                Back
              </button>
              <button className="btn btn-primary" onClick={next} disabled={picked.length < 2}>
                Continue ({picked.length} added)
                <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="eyebrow">Step 2 of 3</div>
            <h1 className="onb-headline" style={{ fontSize: 36 }}>
              Any <span className="basil">diet</span> we should know about?
            </h1>
            <p className="onb-sub">We'll prioritize recipes that fit.</p>
            <div className="pref-options" style={{ marginTop: 12 }}>
              {["No preference", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free", "Low-carb", "High-protein"].map((d) => (
                <button
                  key={d}
                  className={"pref-option" + (diet === d ? " active" : "")}
                  onClick={() => setDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <div className="section-label" style={{ marginTop: 0 }}>How much time do you usually want to cook?</div>
              <div className="pref-slider">
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                />
                <div className="v">
                  {maxTime} <span style={{ fontSize: 13, color: "var(--ps-charcoal-3)" }}>min</span>
                </div>
              </div>
            </div>
            <div className="onb-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <Icon n="chevron-left" style={{ width: 16, height: 16 }} />
                Back
              </button>
              <button className="btn btn-primary" onClick={next}>
                Continue
                <Icon n="chevron-right" style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              </button>
              <button className="onb-skip" onClick={skip}>Skip</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div className="onb-illus">
              <span className="ps-wordmark" style={{ fontSize: 64 }}>P<span className="spin">S</span></span>
            </div>
            <h1 className="onb-headline">
              Ready to <span className="tomato">spin</span>?
            </h1>
            <p className="onb-sub" style={{ margin: "0 auto 32px" }}>
              You've got {picked.length} ingredients in your pantry. Let's see what you can cook.
            </p>
            <button className="btn btn-primary btn-lg" onClick={next}>
              Spin my first recipe
              <Icon n="sparkles" style={{ width: 18, height: 18 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
