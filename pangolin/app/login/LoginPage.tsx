// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Login / Sign-up Page
   Dark #02353C · Mint #C1F6ED · Teal #3FD0C9 · Green #2EAF7D
   Inline styles — fully self-contained.
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:        "#02353C",
  surface:     "#032F36",
  elevated:    "#054048",
  border:      "#0A5560",
  borderHover: "#1A7080",
  primary:     "#2EAF7D",
  primaryDark: "#228A62",
  teal:        "#3FD0C9",
  mint:        "#C1F6ED",
  text:        "#C1F6ED",
  textSub:     "#7ECFC6",
  textMuted:   "#3A8A82",
  error:       "#EF4444",
  font:        "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function Input({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontSize: "13px", fontWeight: 600,
        color: C.textSub, marginBottom: "6px", letterSpacing: "-.01em",
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 16px",
          background: focused ? C.elevated : C.surface,
          border: `1px solid ${error ? C.error : focused ? C.teal : C.border}`,
          borderRadius: "12px", color: C.text, fontSize: "15px",
          fontFamily: C.font, outline: "none",
          transition: "all .15s ease", boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ fontSize: "12px", color: C.error, marginTop: "5px" }}>{error}</p>
      )}
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading, style = {} }) {
  const [h, hov] = useHover();
  return (
    <button
      onClick={onClick}
      disabled={loading}
      {...hov}
      style={{
        width: "100%", padding: "14px", borderRadius: "100px",
        background: loading ? C.elevated
          : h ? `linear-gradient(135deg,#3FD0C9,${C.primary})`
              : `linear-gradient(135deg,${C.primary},${C.primaryDark})`,
        color: loading ? C.textMuted : "#02353C",
        fontSize: "15px", fontWeight: 700, border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        transform: h && !loading ? "translateY(-1px)" : "none",
        boxShadow: h && !loading
          ? "0 12px 40px rgba(46,175,125,.5)"
          : "0 6px 24px rgba(46,175,125,.3)",
        transition: "all .18s ease",
        fontFamily: C.font,
        ...style,
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function RoleCard({ role, label, icon, desc, selected, onSelect }) {
  const [h, hov] = useHover();
  const active = selected === role;
  return (
    <div
      onClick={() => onSelect(role)}
      {...hov}
      style={{
        flex: "1 1 0", padding: "16px",
        border: `2px solid ${active ? C.primary : h ? C.borderHover : C.border}`,
        borderRadius: "14px",
        background: active ? `${C.primary}14` : h ? C.elevated : C.surface,
        cursor: "pointer", textAlign: "center",
        transition: "all .18s ease",
        transform: (h || active) ? "translateY(-2px)" : "none",
        boxShadow: active ? `0 8px 24px rgba(46,175,125,.25)` : "none",
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "6px" }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: active ? C.primary : C.text, marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [globalError, setGlobalError] = useState("");

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    if (mode === "signup") {
      if (!displayName.trim()) e.displayName = "Display name is required";
      if (!role) e.role = "Pick your role";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setGlobalError("");

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setGlobalError(error.message);
        setLoading(false);
        return;
      }
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      const userRole = profileData?.role;
      router.replace(userRole === "freelancer" ? "/freelancer" : "/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setGlobalError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          role,
          display_name: displayName.trim(),
        });
      }
      router.replace(role === "freelancer" ? "/freelancer" : "/dashboard");
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: #02353C; -webkit-font-smoothing: antialiased; }
        input::placeholder { color: #3A8A82; }
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-16px); }
        }
        @keyframes mascot-glow {
          0%, 100% { opacity: .5; transform: scale(1); }
          50%       { opacity: 1;  transform: scale(1.1); }
        }
        .login-right { display: flex !important; }
        @media (max-width: 768px) {
          .login-right { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex",
        background: `radial-gradient(ellipse 60% 50% at 0% 50%, rgba(63,208,201,.06) 0%, transparent 60%),
                     radial-gradient(ellipse 80% 60% at 100% 50%, rgba(46,175,125,.08) 0%, transparent 60%),
                     #02353C`,
        fontFamily: C.font,
      }}>

        {/* ── Left: form panel ─────────────────────────────────────── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 24px",
        }}>
          <div style={{ width: "100%", maxWidth: "420px" }}>

            {/* Back arrow button */}
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "44px", height: "44px",
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "10px", cursor: "pointer",
                fontSize: "20px", color: C.teal,
                marginBottom: "24px", transition: "all .18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.elevated;
                e.currentTarget.style.borderColor = C.borderHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.surface;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              ←
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "36px" }}>
              <img src="/pangolin-logo.png" alt="Pangolin" style={{ width: 36, height: 36, objectFit: "contain" }} />
              <span style={{
                fontSize: "22px", fontWeight: 800,
                background: "linear-gradient(135deg,#3FD0C9,#C1F6ED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Pangolin</span>
            </div>

            <div style={{
              display: "flex", background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: "12px",
              padding: "4px", marginBottom: "28px",
            }}>
              {["login", "signup"].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setErrors({}); setGlobalError(""); }}
                  style={{
                    flex: 1, padding: "10px",
                    borderRadius: "9px", border: "none",
                    background: mode === m
                      ? `linear-gradient(135deg,${C.primary},${C.primaryDark})`
                      : "transparent",
                    color: mode === m ? "#02353C" : C.textMuted,
                    fontSize: "14px", fontWeight: 700,
                    cursor: "pointer", transition: "all .18s ease",
                    fontFamily: C.font,
                  }}
                >{m === "login" ? "Log In" : "Sign Up"}</button>
              ))}
            </div>

            <h1 style={{
              fontSize: "24px", fontWeight: 900, color: C.text,
              letterSpacing: "-.04em", marginBottom: "6px",
            }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontSize: "14px", color: C.textSub, marginBottom: "28px" }}>
              {mode === "login"
                ? "Log in to manage your escrows and payments."
                : "Join Pangolin to protect your freelance work."}
            </p>

            {globalError && (
              <div style={{
                padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
                background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)",
                fontSize: "13px", color: "#EF4444",
              }}>{globalError}</div>
            )}

            {mode === "signup" && (
              <Input
                label="Display Name"
                value={displayName}
                onChange={setDisplayName}
                placeholder="e.g. Maria Santos"
                error={errors.displayName}
              />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 6 characters"
              error={errors.password}
            />

            {mode === "signup" && (
              <div style={{ marginBottom: "22px" }}>
                <label style={{
                  display: "block", fontSize: "13px", fontWeight: 600,
                  color: C.textSub, marginBottom: "10px",
                }}>I am a…</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <RoleCard
                    role="freelancer"
                    label="Freelancer"
                    icon="💼"
                    desc="I do the work and need payment protection"
                    selected={role}
                    onSelect={setRole}
                  />
                  <RoleCard
                    role="client"
                    label="Client"
                    icon="🏢"
                    desc="I hire talent and fund escrows"
                    selected={role}
                    onSelect={setRole}
                  />
                </div>
                {errors.role && (
                  <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "6px" }}>{errors.role}</p>
                )}
              </div>
            )}

            <PrimaryBtn onClick={handleSubmit} loading={loading}>
              {mode === "login" ? "Log In →" : "Create Account →"}
            </PrimaryBtn>

            <p style={{
              textAlign: "center", fontSize: "13px", color: C.textMuted, marginTop: "20px",
            }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); setGlobalError(""); }}
                style={{
                  background: "none", border: "none", color: C.teal,
                  cursor: "pointer", fontWeight: 600, fontSize: "13px",
                  fontFamily: C.font,
                }}
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>

          </div>
        </div>

        {/* ── Right: mascot panel (desktop only) ───────────────────── */}
        <div className="login-right" style={{
          flex: "0 0 480px", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 48px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(63,208,201,.07) 0%, transparent 70%)",
          }} />

          <div style={{ position: "relative", marginBottom: "36px" }}>
            <div style={{
              position: "absolute", inset: "10%",
              background: "radial-gradient(ellipse, rgba(63,208,201,.15) 0%, transparent 70%)",
              borderRadius: "50%", filter: "blur(16px)",
              animation: "mascot-glow 6s ease-in-out infinite",
            }} />
            <img
              src="/pangolin-mascot.png"
              alt="Pangolin mascot"
              style={{
                width: "260px", height: "auto",
                objectFit: "contain", position: "relative", zIndex: 1,
                filter: "drop-shadow(0 8px 32px rgba(63,208,201,.3))",
                animation: "mascot-float 6s ease-in-out infinite",
              }}
            />
          </div>

          <div style={{ textAlign: "center", position: "relative" }}>
            <h2 style={{
              fontSize: "26px", fontWeight: 900, letterSpacing: "-.04em",
              color: C.text, marginBottom: "12px", lineHeight: 1.2,
            }}>
              Your work is{" "}
              <span style={{
                background: "linear-gradient(135deg,#2EAF7D,#3FD0C9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>safe with us.</span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: "0", marginTop: "36px", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: C.textMuted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "14px" }}>
              Built on
            </p>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <img
                src="/stellar-logo.png"
                alt="Stellar"
                style={{
                  height: "40px", objectFit: "contain",
                  filter: "brightness(0) invert(1) drop-shadow(0 0 10px rgba(63,208,201,.35))",
                  opacity: 1,
                }}
              />
              <div style={{ width: 1, height: 32, background: "rgba(63,208,201,.25)" }} />
              <img
                src="/risein-logo.png"
                alt="Rise In"
                style={{
                  height: "34px", objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  opacity: 1,
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
