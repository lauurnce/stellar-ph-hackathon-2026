// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Dispute Center (Screens A · B · C)
   Dark #0D0D0F · Coral #FF6B35 · Red #EF4444 · Inter · Self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:      "#0D0D0F",
  surface:   "#111116",
  elevated:  "#17171F",
  card:      "#1D1D28",
  border:    "#26263A",
  borderLit: "#363650",
  coral:     "#FF6B35",
  coralDk:   "#D9521A",
  red:       "#EF4444",
  redMuted:  "rgba(239,68,68,0.12)",
  amber:     "#F59E0B",
  blue:      "#3B82F6",
  green:     "#10B981",
  purple:    "#8B5CF6",
  text:      "#F0F0F8",
  textSub:   "#8888A8",
  textMuted: "#4C4C64",
  font:      "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
};

function go(path) {
  window.location.href = path;
}

function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

// ── Primitives ─────────────────────────────────────────────────────────────
function Btn({ variant = "coral", size = "md", children, onClick, disabled, fullWidth, style: sx = {} }) {
  const [h, hov] = useHover();
  const dis = !!disabled;
  const S = {
    sm:  { p: "8px 18px",  f: "13px",   r: "10px" },
    md:  { p: "11px 22px", f: "14px",   r: "12px" },
    lg:  { p: "14px 28px", f: "15.5px", r: "13px" },
    xl:  { p: "17px 36px", f: "16.5px", r: "14px" },
  }[size] || { p: "11px 22px", f: "14px", r: "12px" };

  const V = {
    red: {
      bg:  dis ? "#2A0A0A" : h ? "linear-gradient(135deg,#F87171,#DC2626)" : "linear-gradient(135deg,#EF4444,#DC2626)",
      col: dis ? "#7A2020" : "#fff", bd: "none",
      shd: dis ? "none" : h ? "0 10px 36px rgba(239,68,68,.5)" : "0 5px 20px rgba(239,68,68,.3)",
    },
    coral: {
      bg:  dis ? "#2A1508" : h ? "linear-gradient(135deg,#FF7C48,#D9521A)" : "linear-gradient(135deg,#FF6B35,#D9521A)",
      col: dis ? "#6B3820" : "#fff", bd: "none",
      shd: dis ? "none" : h ? "0 10px 36px rgba(255,107,53,.5)" : "0 5px 20px rgba(255,107,53,.3)",
    },
    ghost: {
      bg:  h ? "rgba(255,107,53,.07)" : "transparent",
      col: h ? C.coral : C.textSub,
      bd: `1px solid ${h ? "rgba(255,107,53,.28)" : C.border}`, shd: "none",
    },
    subtle: {
      bg: h ? C.card : C.elevated, col: C.text,
      bd: `1px solid ${h ? C.borderLit : C.border}`, shd: "none",
    },
    blue: {
      bg:  h ? "linear-gradient(135deg,#5A9BFF,#3B82F6)" : "linear-gradient(135deg,#3B82F6,#2563EB)",
      col: "#fff", bd: "none",
      shd: h ? "0 8px 28px rgba(59,130,246,.45)" : "0 4px 16px rgba(59,130,246,.28)",
    },
    green: {
      bg:  h ? "linear-gradient(135deg,#34D399,#059669)" : "linear-gradient(135deg,#10B981,#059669)",
      col: "#fff", bd: "none",
      shd: h ? "0 8px 28px rgba(16,185,129,.45)" : "0 4px 16px rgba(16,185,129,.28)",
    },
  }[variant] || {};

  return (
    <button onClick={dis ? undefined : onClick} {...(dis ? {} : hov)} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      fontFamily: C.font, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer",
      transition: "all .17s cubic-bezier(.4,0,.2,1)",
      transform: !dis && h ? "translateY(-1px)" : "none",
      width: fullWidth ? "100%" : "auto",
      padding: S.p, fontSize: S.f, borderRadius: S.r,
      background: V.bg, color: V.col, border: V.bd || "none", boxShadow: V.shd || "none",
      letterSpacing: "-.01em", whiteSpace: "nowrap", ...sx,
    }}>{children}</button>
  );
}

function GlassCard({ children, glow, style: sx = {}, nohover }) {
  const [h, hov] = useHover();
  const g = glow || C.border;
  const active = !nohover && h;
  return (
    <div {...(nohover ? {} : hov)} style={{
      background: "linear-gradient(145deg,rgba(26,26,38,.97),rgba(18,18,28,.97))",
      border: `1px solid ${active ? g + "55" : C.border}`,
      borderRadius: 18,
      boxShadow: active ? `0 0 0 1px ${g}18,0 20px 60px rgba(0,0,0,.5),0 0 40px ${g}10` : "0 6px 28px rgba(0,0,0,.4)",
      transform: active ? "translateY(-2px)" : "none",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
      position: "relative", overflow: "hidden", ...sx,
    }}>
      {glow && <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg,transparent,${g}35,transparent)`, opacity: active ? 1 : 0, transition: "opacity .22s" }} />}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", background: C.elevated, outline: "none", fontFamily: C.font,
        border: `1.5px solid ${focused ? "rgba(239,68,68,.6)" : C.border}`,
        borderRadius: 12, padding: "12px 16px", color: C.text, fontSize: 14,
        boxShadow: focused ? "0 0 0 3px rgba(239,68,68,.1)" : "none",
        transition: "all .18s ease", caretColor: C.red,
      }} />
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: C.elevated, appearance: "none",
          border: `1.5px solid ${focused ? "rgba(239,68,68,.6)" : C.border}`,
          borderRadius: 12, padding: "12px 40px 12px 16px",
          color: value ? C.text : C.textMuted, fontSize: 14, fontFamily: C.font,
          cursor: "pointer", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(239,68,68,.1)" : "none",
          transition: "all .18s ease",
        }}>
        <option value="" disabled style={{ background: C.card }}>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: C.card }}>{o}</option>)}
      </select>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.textMuted, pointerEvents: "none", fontSize: 13 }}>▾</div>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", background: C.elevated, outline: "none", resize: "vertical",
        border: `1.5px solid ${focused ? "rgba(239,68,68,.6)" : C.border}`,
        borderRadius: 12, padding: "12px 16px", color: C.text, fontSize: 14,
        fontFamily: C.font, lineHeight: 1.65, caretColor: C.red,
        boxShadow: focused ? "0 0 0 3px rgba(239,68,68,.1)" : "none",
        transition: "border-color .18s, box-shadow .18s",
      }} />
  );
}

function Label({ children, hint }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{children}</span>
      {hint && <span style={{ fontSize: 11.5, color: C.textMuted }}>{hint}</span>}
    </div>
  );
}

function StatusPill({ status, color = C.red }) {
  const configs = {
    "Frozen":      { bg: "rgba(239,68,68,.14)",  bd: "rgba(239,68,68,.35)",  tx: "#F87171",  dot: C.red   },
    "Under Review":{ bg: "rgba(245,158,11,.14)", bd: "rgba(245,158,11,.35)", tx: "#FCD34D",  dot: C.amber },
    "Resolved":    { bg: "rgba(16,185,129,.14)",  bd: "rgba(16,185,129,.35)", tx: "#34D399",  dot: C.green },
    "Filed":       { bg: "rgba(239,68,68,.14)",  bd: "rgba(239,68,68,.35)",  tx: "#F87171",  dot: C.red   },
  };
  const s = configs[status] || { bg: `${color}14`, bd: `${color}35`, tx: color, dot: color };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: "100px", fontSize: 12, fontWeight: 700,
      background: s.bg, border: `1px solid ${s.bd}`, color: s.tx,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: s.dot,
        boxShadow: `0 0 6px ${s.dot}`, display: "inline-block",
        animation: status === "Under Review" ? "pulse-dot 2s ease-in-out infinite" : "none",
      }} />
      {status}
    </span>
  );
}

// ── Nav tabs ────────────────────────────────────────────────────────────────
function NavTabs({ active, setActive }) {
  const tabs = [
    { id: "A", label: "Raise Dispute",    icon: "⚠️" },
    { id: "B", label: "Active Dispute",   icon: "🔒" },
    { id: "C", label: "Resolved",         icon: "✅" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, padding: "6px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 32 }}>
      {tabs.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => setActive(id)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
            background: isActive ? "linear-gradient(135deg,rgba(239,68,68,.18),rgba(239,68,68,.08))" : "transparent",
            boxShadow: isActive ? "inset 0 0 0 1px rgba(239,68,68,.3)" : "none",
            color: isActive ? "#F87171" : C.textMuted,
            fontSize: 13.5, fontWeight: isActive ? 700 : 500, fontFamily: C.font,
            transition: "all .15s ease",
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── SCREEN A — Raise Dispute ─────────────────────────────────────────────────
function ScreenA({ onSubmit }) {
  const [reason, setReason] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef();

  const reasons = ["Non-delivery of work", "Quality issues", "Missed deadline", "Communication breakdown", "Scope creep", "Other"];
  const valid = reason && desc.trim().length > 20 && confirm;

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).slice(0, 5 - files.length);
    addFiles(dropped);
  };
  const addFiles = newFiles => {
    const mapped = newFiles.map(f => ({
      name: f.name, size: (f.size / 1024).toFixed(1) + " KB",
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "…" + Math.random().toString(16).slice(2, 6),
      id: Math.random(),
    }));
    setFiles(prev => [...prev, ...mapped].slice(0, 5));
  };
  const handleFileInput = e => addFiles(Array.from(e.target.files));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Amber warning header */}
      <div style={{
        background: "linear-gradient(135deg,rgba(245,158,11,.14),rgba(245,158,11,.06))",
        border: `1px solid rgba(245,158,11,.35)`, borderRadius: "18px 18px 0 0",
        padding: "18px 24px", display: "flex", gap: 14, alignItems: "flex-start",
        borderBottom: "none",
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245,158,11,.2)", border: "1px solid rgba(245,158,11,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#FCD34D", marginBottom: 4 }}>Raising a dispute will freeze the escrow</div>
          <div style={{ fontSize: 13, color: "rgba(252,211,77,.7)", lineHeight: 1.6 }}>
            All funds are locked immediately. Neither party can withdraw until arbiters reach a resolution. The freelancer's guaranteed minimum of <strong style={{ color: "#FCD34D" }}>60% ($120 USDC)</strong> is protected regardless of outcome.
          </div>
        </div>
      </div>

      {/* Form body */}
      <GlassCard nohover style={{ borderRadius: "0 0 18px 18px", borderTop: `1px solid rgba(239,68,68,.2)`, padding: "28px 28px 24px" }}>

        {/* Escrow ref */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26, padding: "12px 16px", background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔒</div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>Escrow Contract</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Website Design — $200 USDC · #PGL-4821</div>
          </div>
          <StatusPill status="Frozen" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Reason */}
          <div>
            <Label>Dispute Reason</Label>
            <Select value={reason} onChange={e => setReason(e.target.value)}
              options={reasons} placeholder="Select the primary reason..." />
          </div>

          {/* Evidence upload */}
          <div>
            <Label hint="(max 5 files · screenshots, contracts, messages)">Evidence</Label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragging ? C.red : C.border}`,
                borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(239,68,68,.07)" : "rgba(255,255,255,.01)",
                transition: "all .18s ease",
              }}>
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.zip" onChange={handleFileInput} style={{ display: "none" }} />
              <div style={{ fontSize: 28, marginBottom: 10 }}>📎</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: dragging ? "#F87171" : C.textSub, marginBottom: 4 }}>
                {dragging ? "Drop files here" : "Drag & drop or click to upload"}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Each file receives a SHA-256 hash stored on Stellar for tamper-proof evidence</div>
            </div>

            {/* Uploaded file list */}
            {files.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {files.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
                    <span style={{ fontSize: 16 }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{f.size} · hash: <code style={{ fontSize: 11, color: C.blue, fontFamily: "monospace" }}>{f.hash}</code></div>
                    </div>
                    <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} style={{ background: "rgba(239,68,68,.1)", border: "none", borderRadius: 7, color: "#F87171", cursor: "pointer", padding: "4px 8px", fontSize: 12 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label hint={`(${desc.length}/500)`}>Detailed Description</Label>
            <Textarea value={desc} onChange={e => setDesc(e.target.value.slice(0, 500))}
              placeholder="Describe the issue in detail — include dates, what was agreed, and what went wrong. Be specific and factual." />
          </div>

          {/* Confirm checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div onClick={() => setConfirm(!confirm)} style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: confirm ? C.red : "transparent",
              border: `2px solid ${confirm ? C.red : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s", cursor: "pointer",
              boxShadow: confirm ? "0 0 12px rgba(239,68,68,.4)" : "none",
            }}>
              {confirm && <span style={{ fontSize: 12, color: "#fff", fontWeight: 800 }}>✓</span>}
            </div>
            <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>
              I understand that raising a dispute freezes all funds and initiates a formal arbitration process. I confirm the information above is accurate.
            </span>
          </label>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" size="lg" onClick={() => go("/dashboard")}>Cancel</Btn>
            <Btn variant="red" size="xl" fullWidth disabled={!valid} onClick={onSubmit}>
              ⚖️ Submit Dispute
            </Btn>
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted }}>
            Neutral arbiters are assigned within 2 hours · Resolution within 72 hours
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ── SCREEN B — Active Dispute ────────────────────────────────────────────────
function useCountdown(initSecs) {
  const [secs, setSecs] = useState(initSecs);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const p = n => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

function AnonAvatar({ color, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: `${color}18`, border: `2px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>🎭</div>
      <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
    </div>
  );
}

const TIMELINE_STEPS = [
  { id: 1, label: "Dispute Filed",       sub: "May 18 · 11:32 AM", done: true,    active: false },
  { id: 2, label: "Evidence Submitted",  sub: "May 18 · 12:05 PM", done: true,    active: false },
  { id: 3, label: "Under Review",        sub: "In progress…",      done: false,   active: true  },
  { id: 4, label: "Resolution",          sub: "Est. within 72 hrs", done: false,  active: false },
];

function ScreenB() {
  const countdown = useCountdown(68 * 3600 + 14 * 60 + 22);

  const EvidencePane = ({ side, name, color, items }) => (
    <div style={{
      flex: 1, background: C.elevated, border: `1px solid ${side === "client" ? "rgba(239,68,68,.28)" : "rgba(59,130,246,.28)"}`,
      borderRadius: 14, padding: "18px", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color }}>{name.slice(0, 2).toUpperCase()}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{name}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{side === "client" ? "Complainant" : "Respondent"}</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "3px 9px", borderRadius: "100px", fontSize: 11, fontWeight: 700, background: `${color}14`, border: `1px solid ${color}30`, color }}>{side === "client" ? "Filed" : "Responded"}</div>
      </div>

      <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.65, marginBottom: 14 }}>{items.desc}</div>

      {items.files.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 12px", marginBottom: 6 }}>
          <span style={{ fontSize: 14 }}>📄</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace" }}>{f.hash}</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 5px ${C.green}` }} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Frozen banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(239,68,68,.16),rgba(239,68,68,.06))",
        border: `1px solid rgba(239,68,68,.4)`, borderRadius: 16, padding: "16px 22px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 22 }}>🔒</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F87171" }}>Escrow Frozen — Dispute Under Review</div>
          <div style={{ fontSize: 12.5, color: "rgba(248,113,113,.7)", marginTop: 2 }}>All funds are locked. No withdrawals until arbiters reach a decision.</div>
        </div>
        <StatusPill status="Under Review" />
      </div>

      {/* Guaranteed minimum note */}
      <div style={{
        background: "linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))",
        border: `1px solid rgba(255,107,53,.28)`, borderRadius: 14, padding: "14px 18px",
        display: "flex", gap: 12, alignItems: "center",
      }}>
        <span style={{ fontSize: 18 }}>🛡️</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>Guaranteed minimum protected: </span>
          <span style={{ fontSize: 13, color: C.textSub }}>Regardless of outcome, freelancer receives at least </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>60% ($120 USDC)</span>
          <span style={{ fontSize: 13, color: C.textSub }}> · Smart contract enforced.</span>
        </div>
      </div>

      {/* Two-panel evidence */}
      <GlassCard nohover glow={C.red} style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Evidence Submissions</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>All files hashed on-chain ⛓️</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <EvidencePane side="client" name="Juan Miguel" color={C.red}
            items={{
              desc: "Freelancer delivered work that does not match the agreed-upon design brief. Multiple revisions were requested but the core layout issues remain unresolved.",
              files: [
                { name: "design-brief-v1.pdf", hash: "0xA4f3…c9B2" },
                { name: "client-revision-notes.png", hash: "0x77B1…D3F4" },
              ],
            }} />
          <EvidencePane side="freelancer" name="Ana Kalaw" color={C.blue}
            items={{
              desc: "All deliverables match the original brief. Client requested out-of-scope changes after sign-off. Screenshots of the approved wireframes are attached.",
              files: [
                { name: "approved-wireframes.png", hash: "0xC2D9…11AE" },
                { name: "scope-agreement.pdf", hash: "0xF8A2…90CC" },
              ],
            }} />
        </div>
      </GlassCard>

      {/* Arbiters */}
      <GlassCard nohover glow={C.purple} style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 3, letterSpacing: "-.02em" }}>Arbitration Panel</div>
            <div style={{ fontSize: 12.5, color: C.textMuted }}>Identities revealed only after resolution to prevent bias</div>
          </div>
          <div style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(139,92,246,.14)", border: "1px solid rgba(139,92,246,.3)", fontSize: 12, fontWeight: 700, color: C.purple }}>2 of 3 Assigned</div>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <AnonAvatar color={C.purple} label="Arbiter #1 ✓" />
          <AnonAvatar color={C.purple} label="Arbiter #2 ✓" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.elevated, border: `2px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.textMuted, animation: "pulse-dot 2s ease-in-out infinite" }} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Assigning…</div>
          </div>
        </div>
        <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 12.5, color: C.textMuted, lineHeight: 1.65 }}>
          Each arbiter independently reviews the evidence. A majority decision is required (2 of 3). Arbiters are chosen from Pangolin's vetted pool and have no prior relationship with either party.
        </div>
      </GlassCard>

      {/* Timeline */}
      <GlassCard nohover glow={C.amber} style={{ padding: "22px 24px" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 20, letterSpacing: "-.02em" }}>Dispute Timeline</div>
        <div style={{ display: "flex", position: "relative" }}>
          {/* Connector */}
          <div style={{ position: "absolute", top: 20, left: "12.5%", right: "12.5%", height: 2, background: `linear-gradient(90deg,${C.green} 0%,${C.green} 50%,${C.amber} 50%,${C.border} 75%)` }} />
          {TIMELINE_STEPS.map(({ id, label, sub, done, active }) => (
            <div key={id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", zIndex: 1, position: "relative",
                background: done ? `linear-gradient(135deg,${C.green},#059669)` : active ? `linear-gradient(135deg,${C.amber},#D97706)` : C.elevated,
                border: `2px solid ${done ? C.green : active ? C.amber : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 16 : 14, color: (done || active) ? "#fff" : C.textMuted,
                boxShadow: done ? `0 0 20px rgba(16,185,129,.4)` : active ? `0 0 20px rgba(245,158,11,.4),0 0 0 4px rgba(245,158,11,.12)` : "none",
                transition: "all .3s",
              }}>{done ? "✓" : active ? "⚡" : id}</div>
              <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: done || active ? 700 : 500, color: done ? C.green : active ? C.amber : C.textMuted }}>{label}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>Estimated Resolution</div>
            <div style={{ fontSize: 13, color: C.textSub }}>within 72 hours of filing</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>Time remaining</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.05em", color: C.amber, fontFamily: "monospace" }}>{countdown}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ── SCREEN C — Dispute Resolved ──────────────────────────────────────────────
function StarRating({ label }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 12.5, color: C.textMuted }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, transition: "transform .1s", transform: hover >= s || rating >= s ? "scale(1.2)" : "none" }}>
            <span style={{ color: hover >= s || rating >= s ? C.amber : C.border }}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenC() {
  const [submitted, setSubmitted] = useState(false);

  const Payout = ({ party, amount, pct, color, note }) => (
    <div style={{
      flex: 1, background: C.elevated, border: `1px solid ${color}30`,
      borderRadius: 14, padding: "18px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 10 }}>{party}</div>
      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-.05em", background: `linear-gradient(135deg,${color},${color}AA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        ${amount}
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>USDC ({pct}%)</div>
      <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>{note}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Resolution banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(16,185,129,.14),rgba(16,185,129,.05))",
        border: `1px solid rgba(16,185,129,.35)`, borderRadius: 18, padding: "24px 28px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>⚖️</div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginBottom: 6 }}>Dispute Resolved</div>
        <div style={{ fontSize: 13.5, color: C.textSub, lineHeight: 1.7, maxWidth: 460, margin: "0 auto", marginBottom: 14 }}>
          The arbitration panel reached a <strong style={{ color: C.green }}>majority decision</strong>. Partial payment was awarded based on work completed. Both parties have been notified.
        </div>
        <StatusPill status="Resolved" />
      </div>

      {/* Outcome card */}
      <GlassCard nohover glow={C.green} style={{ padding: "24px 26px" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 20, letterSpacing: "-.02em" }}>Resolution Summary</div>

        {/* Decision note */}
        <div style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#34D399", marginBottom: 5 }}>Arbiter Decision (2-1 majority)</div>
          <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.65 }}>
            Work completed to approximately 75% of scope. Client's concerns about quality partially upheld. Freelancer received partial payment proportional to deliverables accepted.
          </div>
        </div>

        {/* Payouts */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <Payout party="Ana Kalaw (Freelancer)" amount="150" pct={75} color={C.green}
            note="Includes guaranteed minimum of $120 + awarded partial completion" />
          <Payout party="Juan Miguel (Client)" amount="50" pct={25} color={C.blue}
            note="Refund for undelivered scope, minus platform arbitration fee" />
        </div>

        {/* Fee note */}
        <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", marginBottom: 20 }}>
          Platform arbitration fee: <strong style={{ color: C.textSub }}>$5 USDC</strong> deducted from escrow · Arbiters compensated from fee pool
        </div>

        {/* Stellar link */}
        <div style={{
          background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.25)",
          borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
            <span style={{ fontSize: 13, color: C.textSub }}>Transaction confirmed on Stellar</span>
          </div>
          <code style={{ fontSize: 12, color: C.blue, fontFamily: "monospace", background: "rgba(59,130,246,.08)", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(59,130,246,.2)" }}>
            0xA4f3B2…9c1E
          </code>
          <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 13, fontWeight: 700, fontFamily: C.font, display: "flex", alignItems: "center", gap: 6 }}>
            View on Stellar ↗
          </button>
        </div>
      </GlassCard>

      {/* Arbiter rating */}
      {!submitted ? (
        <GlassCard nohover glow={C.amber} style={{ padding: "24px 26px" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4, letterSpacing: "-.02em" }}>Rate the Arbitration</div>
          <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 22 }}>Your feedback improves the Pangolin dispute system and helps us maintain arbiter quality.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>
            <StarRating label="Fairness of decision" />
            <StarRating label="Speed of resolution" />
            <StarRating label="Clarity of communication" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label hint="(optional)">Additional comments</Label>
            <Textarea placeholder="Anything else about the arbitration process..." rows={3} value="" onChange={() => {}} />
          </div>
          <Btn variant="green" size="lg" fullWidth onClick={() => setSubmitted(true)}>Submit Feedback</Btn>
        </GlassCard>
      ) : (
        <div style={{
          background: "linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.04))",
          border: "1px solid rgba(16,185,129,.25)", borderRadius: 16, padding: "24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 4 }}>Feedback submitted</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Thank you for helping improve Pangolin arbitration.</div>
        </div>
      )}

      {/* Return */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn variant="coral" size="lg" onClick={() => go("/create-escrow")}>Create New Escrow</Btn>
        <Btn variant="ghost" size="lg" onClick={() => go("/dashboard")}>Back to Dashboard</Btn>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function PangolinDisputeCenter() {
  const [screen, setScreen] = useState("A");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; }
        body { font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background: #0D0D0F; color: #F0F0F8; -webkit-font-smoothing: antialiased; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        select option { background: #1D1D28; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D0D0F; }
        ::-webkit-scrollbar-thumb { background: #26263A; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh", overflowX: "hidden",
        background: `
          radial-gradient(ellipse 65% 45% at 10% 10%, rgba(239,68,68,.06) 0%, transparent 55%),
          radial-gradient(ellipse 55% 40% at 85% 80%, rgba(255,107,53,.05) 0%, transparent 55%),
          #0D0D0F`,
        padding: "36px 16px 80px",
      }}>
        {/* Grid texture */}
        <div style={{ position: "fixed", inset: 0, opacity: .017, pointerEvents: "none", backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "44px 44px" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 12 }}>
            <button onClick={() => go("/dashboard")} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "8px 14px",
              color: C.textSub, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: C.font,
              transition: "all .15s ease", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.elevated; e.currentTarget.style.borderColor = C.borderLit; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
            >
              ← Dashboard
            </button>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#1D1D28,#17171F)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 20px", boxShadow: "0 0 0 1px rgba(255,107,53,.08)" }}>
              <span style={{ fontSize: 22 }}>🐧</span>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-.03em", background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pangolin</span>
              <span style={{ fontSize: 13, color: C.textMuted, marginLeft: 4 }}>Dispute Center</span>
            </div>

            {/* spacer to keep logo centered */}
            <div style={{ width: 120 }} />
          </div>

          <NavTabs active={screen} setActive={setScreen} />

          <div key={screen} style={{ animation: "fade-up .3s ease" }}>
            {screen === "A" && <ScreenA onSubmit={() => setScreen("B")} />}
            {screen === "B" && <ScreenB />}
            {screen === "C" && <ScreenC />}
          </div>
        </div>
      </div>
    </>
  );
}
