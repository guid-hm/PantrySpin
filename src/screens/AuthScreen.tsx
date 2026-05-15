import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function AuthScreen() {
  const [email,       setEmail]       = useState("");
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [guestBusy,   setGuestBusy]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const sendLink = async () => {
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setSending(false);
    if (e) setError(e.message);
    else    setSent(true);
  };

  const continueAsGuest = async () => {
    setGuestBusy(true);
    await supabase.auth.signInAnonymously();
    // onAuthStateChange in AuthProvider picks this up automatically
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="wm ps-wordmark" style={{ fontSize: 28, letterSpacing: "-0.02em", fontFamily: "var(--font-display)", fontWeight: 800 }}>
            Pantry<span style={{ color: "var(--ps-tomato)" }}>Spin</span>
          </div>
          <p className="auth-tagline">Spin your pantry into tonight's dinner.</p>
        </div>

        {sent ? (
          <div className="auth-sent">
            <div>Check your inbox</div>
            <p>We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.</p>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => { setSent(false); setEmail(""); }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div className="auth-email-section">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendLink(); }}
                autoFocus
              />
              {error && <p className="auth-error">{error}</p>}
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 10 }}
                onClick={sendLink}
                disabled={sending || !email.trim()}
              >
                {sending ? "Sending…" : "Continue with email"}
              </button>
              <p className="auth-hint">Works for both new and existing accounts — we'll email you a magic link.</p>
            </div>

            <div className="auth-divider"><span>or</span></div>

            <button
              className="btn btn-secondary"
              style={{ width: "100%" }}
              onClick={continueAsGuest}
              disabled={guestBusy}
            >
              {guestBusy ? "Loading…" : "Continue as guest"}
            </button>
            <p className="auth-hint" style={{ textAlign: "center", marginTop: 8 }}>
              Your data stays on this device only. You can add an email later.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
