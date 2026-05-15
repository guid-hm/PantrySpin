import { useState, useEffect } from "react";
import { usePrefs, useUpdatePrefs } from "@/lib/api/prefs";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "@/components/Icon";

export function PreferencesScreen() {
  const { data: prefs } = usePrefs();
  const updatePrefs = useUpdatePrefs();
  const { user, isAnonymous } = useAuth();
  const showToast = useAppStore((s) => s.showToast);

  const [email,    setEmail]    = useState("");
  const [sending,  setSending]  = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [linkMode, setLinkMode] = useState<"upgrade" | "signin">("upgrade");

  // Local state for sliders — prevents a mutation on every pixel of drag
  const [localMaxTime,  setLocalMaxTime]  = useState(prefs?.maxTime  ?? 30);
  const [localServings, setLocalServings] = useState(prefs?.servings ?? 2);

  // Sync once when prefs first load from server
  useEffect(() => {
    if (prefs) {
      setLocalMaxTime(prefs.maxTime);
      setLocalServings(prefs.servings);
    }
  }, [prefs?.maxTime, prefs?.servings]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = prefs ?? {
    diet: "No preference", avoid: [], maxTime: 30, difficulty: "Easy", servings: 2, priority: "use-what-i-have" as const,
  };

  const toggle = (value: string) => {
    const arr = p.avoid;
    updatePrefs.mutate({ avoid: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] });
  };

  const handleUpgrade = async () => {
    if (!email.trim()) return;
    setSending(true);

    const { error } = await supabase.auth.updateUser({ email: email.trim() });

    if (!error) {
      setSending(false);
      setLinkMode("upgrade");
      setLinkSent(true);
      return;
    }

    // "User already registered" — this device is anonymous but the email already
    // has an account. Fall back to a magic-link sign-in so they can recover it.
    const alreadyExists = error.message.toLowerCase().includes("already") || error.status === 422;
    if (alreadyExists) {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      setSending(false);
      if (otpError) {
        showToast("Error: " + otpError.message);
      } else {
        setLinkMode("signin");
        setLinkSent(true);
      }
    } else {
      setSending(false);
      showToast("Error: " + error.message);
    }
  };

  const handleResetOnboarding = () => {
    updatePrefs.mutate({ onboarded: false });
  };

  const handleResetAll = async () => {
    if (!window.confirm("Reset all your data? This cannot be undone.")) return;
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <h1>Preferences</h1>
          <p className="sub">Tell us what kind of meals you want. We'll match the wheel to your taste.</p>
        </div>
      </div>

      <div className="pref-group">
        <h3>Account</h3>
        {isAnonymous ? (
          <div className="account-callout">
            <div className="account-callout-ico">
              <Icon n="shield-alert" style={{ width: 18, height: 18 }} />
            </div>
            <div className="account-callout-body">
              <strong>Your data is saved on this device only</strong>
              <p>Add an email to keep your pantry, recipes, and grocery list safe across devices.</p>
              {linkSent ? (
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--ps-basil-deep)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon n="mail-check" style={{ width: 15, height: 15 }} />
                  {linkMode === "signin"
                    ? "Sign-in link sent — check your email. Your data will be restored when you click it."
                    : "Confirmation link sent — check your email to secure your account."}
                </div>
              ) : (
                <div className="account-email-row">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUpgrade(); }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleUpgrade} disabled={sending || !email.trim()}>
                    {sending ? "Sending…" : "Send link"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="account-callout secure">
            <div className="account-callout-ico">
              <Icon n="shield-check" style={{ width: 18, height: 18 }} />
            </div>
            <div className="account-callout-body">
              <strong>Account secured</strong>
              <p>Signed in as <strong>{user?.email}</strong>. Your data syncs across all your devices.</p>
            </div>
          </div>
        )}
      </div>

      <div className="pref-group">
        <h3>Diet</h3>
        <p className="pref-sub">Recipes we should prioritize.</p>
        <div className="pref-options">
          {["No preference", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free", "Low-carb", "High-protein"].map((d) => (
            <button
              key={d}
              className={"pref-option" + (p.diet === d ? " active" : "")}
              onClick={() => updatePrefs.mutate({ diet: d })}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Avoid these</h3>
        <p className="pref-sub">Allergies or ingredients you never want suggested.</p>
        <div className="pref-options">
          {["Peanuts", "Shellfish", "Dairy", "Mushrooms", "Cilantro", "Eggs", "Soy", "Tree nuts"].map((a) => (
            <button
              key={a}
              className={"pref-option" + (p.avoid.includes(a) ? " active" : "")}
              onClick={() => toggle(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Max cook time</h3>
        <p className="pref-sub">We won't suggest anything that takes longer.</p>
        <div className="pref-slider">
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={localMaxTime}
            onChange={(e) => setLocalMaxTime(Number(e.target.value))}
            onPointerUp={(e) => updatePrefs.mutate({ maxTime: Number((e.target as HTMLInputElement).value) })}
          />
          <div className="v">{localMaxTime} <span style={{ fontSize: 13, color: "var(--ps-charcoal-3)" }}>min</span></div>
        </div>
      </div>

      <div className="pref-group">
        <h3>Difficulty</h3>
        <p className="pref-sub">How much effort you're up for tonight.</p>
        <div className="pref-options">
          {(["Easy", "Medium", "Anything"] as const).map((d) => (
            <button
              key={d}
              className={"pref-option" + (p.difficulty === d ? " active" : "")}
              onClick={() => updatePrefs.mutate({ difficulty: d === "Anything" ? "Easy" : d })}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <h3>Default servings</h3>
        <p className="pref-sub">Recipes scale automatically.</p>
        <div className="pref-slider">
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={localServings}
            onChange={(e) => setLocalServings(Number(e.target.value))}
            onPointerUp={(e) => updatePrefs.mutate({ servings: Number((e.target as HTMLInputElement).value) })}
          />
          <div className="v">{localServings}</div>
        </div>
      </div>

      <div className="pref-group">
        <h3>Spin priority</h3>
        <p className="pref-sub">What we should optimize for when matching recipes.</p>
        <div className="pref-options">
          {[
            { k: "use-what-i-have" as const, l: "Use what I have" },
            { k: "quick"           as const, l: "Quick meals" },
            { k: "healthy"         as const, l: "Healthiest" },
          ].map((o) => (
            <button
              key={o.k}
              className={"pref-option" + (p.priority === o.k ? " active" : "")}
              onClick={() => updatePrefs.mutate({ priority: o.k })}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div
        className="pref-group"
        style={{ background: "transparent", boxShadow: "none", border: "1px dashed var(--ps-line-strong)" }}
      >
        <h3>Dev actions</h3>
        <p className="pref-sub">Reset state to explore the app from a different starting point.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleResetOnboarding}>
            <Icon n="play-circle" style={{ width: 14, height: 14 }} />
            Replay onboarding
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleResetAll}>
            <Icon n="rotate-ccw" style={{ width: 14, height: 14 }} />
            Reset all data
          </button>
        </div>
      </div>
    </div>
  );
}
