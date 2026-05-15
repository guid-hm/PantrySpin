import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Icon } from "./Icon";

export function AccountMenu() {
  const { user, isAnonymous } = useAuth();
  const [open,        setOpen]        = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState("");
  const [savingName,  setSavingName]  = useState(false);

  // For anonymous → sign-in flow inside the menu
  const [signInMode,  setSignInMode]  = useState(false);
  const [email,       setEmail]       = useState("");
  const [sending,     setSending]     = useState(false);
  const [linkSent,    setLinkSent]    = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  const displayName = user?.user_metadata?.display_name
    || (isAnonymous ? "Guest" : (user?.email?.split("@")[0] ?? "My Kitchen"));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingName(false);
        setSignInMode(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const openMenu = () => {
    setOpen((o) => !o);
    setEditingName(false);
    setSignInMode(false);
    setLinkSent(false);
    setEmail("");
  };

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    await supabase.auth.updateUser({ data: { display_name: nameInput.trim() } });
    setSavingName(false);
    setEditingName(false);
  };

  const signOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleSendLink = async () => {
    if (!email.trim()) return;
    setSending(true);

    // Try upgrade first (anonymous → email), fall back to sign-in if already registered
    const { error } = await supabase.auth.updateUser({ email: email.trim() });

    if (!error) {
      setSending(false);
      setLinkSent(true);
      return;
    }

    const alreadyExists = error.message.toLowerCase().includes("already") || error.status === 422;
    if (alreadyExists) {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      setSending(false);
      if (!otpError) setLinkSent(true);
    } else {
      setSending(false);
    }
  };

  return (
    <div className="acm-wrap" ref={wrapRef}>
      {open && (
        <div className="acm-dropdown">
          {isAnonymous ? (
            <>
              <div className="acm-header">
                <span className="acm-name">Guest</span>
                <span className="acm-status">Not signed in</span>
              </div>
              <div className="acm-divider" />

              {signInMode ? (
                linkSent ? (
                  <div className="acm-sent">
                    <Icon n="mail-check" style={{ width: 14, height: 14 }} />
                    Link sent — check your email.
                  </div>
                ) : (
                  <div className="acm-signin-form">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendLink(); }}
                      autoFocus
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSendLink}
                      disabled={sending || !email.trim()}
                      style={{ width: "100%" }}
                    >
                      {sending ? "Sending…" : "Send magic link"}
                    </button>
                    <p className="acm-hint">Your guest data will be merged when you sign in.</p>
                  </div>
                )
              ) : (
                <button className="acm-action" onClick={() => setSignInMode(true)}>
                  <Icon n="log-in" style={{ width: 14, height: 14 }} />
                  Sign in or create account
                </button>
              )}
            </>
          ) : (
            <>
              <div className="acm-header">
                <span className="acm-name">{user?.user_metadata?.display_name || "My Kitchen"}</span>
                <span className="acm-status">{user?.email}</span>
              </div>
              <div className="acm-divider" />

              {editingName ? (
                <div className="acm-name-edit">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")  saveName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    placeholder="Your display name"
                    autoFocus
                  />
                  <button onClick={saveName} disabled={savingName || !nameInput.trim()}>
                    {savingName ? "…" : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  className="acm-action"
                  onClick={() => { setNameInput(user?.user_metadata?.display_name ?? ""); setEditingName(true); }}
                >
                  <Icon n="pencil" style={{ width: 14, height: 14 }} />
                  {user?.user_metadata?.display_name ? "Edit name" : "Set your name"}
                </button>
              )}

              <div className="acm-divider" />
              <button className="acm-action acm-danger" onClick={signOut}>
                <Icon n="log-out" style={{ width: 14, height: 14 }} />
                Sign out
              </button>
            </>
          )}
        </div>
      )}

      <button className="sidebar-foot" onClick={openMenu}>
        <div className="av" />
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <div className="name">{displayName}</div>
          <div className="sub">{isAnonymous ? "Guest" : "Signed in"}</div>
        </div>
        <Icon
          n="chevrons-up-down"
          style={{ width: 14, height: 14, color: "var(--ps-charcoal-3)", flexShrink: 0 }}
        />
      </button>
    </div>
  );
}
