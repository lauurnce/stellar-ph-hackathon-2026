// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { approveRelease, triggerDispute } from "@/lib/contract-client";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Escrow Detail Page (Client View)
   Dark #02353C · Coral #2EAF7D · Inter · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:       "#02353C",
  surface:    "#032F36",
  elevated:   "#054048",
  card:       "#065060",
  border:     "#0A5560",
  borderLit:  "#1A7080",
  coral:      "#2EAF7D",
  coralDark:  "#228A62",
  blue:       "#3FD0C9",
  green:      "#449342",
  amber:      "#F59E0B",
  purple:     "#8B5CF6",
  red:        "#EF4444",
  text:       "#C1F6ED",
  textSub:    "#7ECFC6",
  textMuted:  "#3A8A82",
  font:       "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
};

function go(path) {
  window.location.href = path;
}


const PHP = 58.3;
function phpOf(u) { return (parseFloat(u) * PHP).toLocaleString("en-PH", { minimumFractionDigits: 2 }); }

// ── Primitives ─────────────────────────────────────────────────────────────────
function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function Btn({ variant = "coral", size = "md", children, onClick, disabled, fullWidth, style: sx = {} }) {
  const [h, hov] = useHover();
  const dis = !!disabled;
  const pad = { sm: "8px 18px", md: "11px 22px", lg: "14px 28px", xl: "17px 36px" }[size] || "11px 22px";
  const fs  = { sm: "12.5px",  md: "13.5px",    lg: "15px",     xl: "16.5px"    }[size] || "13.5px";
  const rad = { sm: "9px",     md: "11px",       lg: "13px",     xl: "14px"      }[size] || "11px";

  const bg = {
    coral:  dis ? "#2A1508" : h ? "linear-gradient(135deg,#3FD0C9,#228A62)" : "linear-gradient(135deg,#2EAF7D,#228A62)",
    blue:   h ? "rgba(63,208,201,.14)" : "transparent",
    red:    h ? "rgba(239,68,68,.12)"  : "transparent",
    ghost:  h ? "rgba(46,175,125,.08)" : "transparent",
    subtle: h ? C.card : C.elevated,
  }[variant];
  const col = {
    coral: dis ? "#6B3820" : "#fff",
    blue:  C.blue, red: "#F87171", ghost: h ? C.coral : C.textSub, subtle: C.text,
  }[variant];
  const bdr = {
    coral:  "none",
    blue:   `1.5px solid ${h ? C.blue : "rgba(63,208,201,.45)"}`,
    red:    `1.5px solid ${h ? "rgba(239,68,68,.5)" : "rgba(239,68,68,.3)"}`,
    ghost:  `1px solid ${h ? "rgba(46,175,125,.3)" : C.border}`,
    subtle: `1px solid ${h ? C.borderLit : C.border}`,
  }[variant];
  const shd = {
    coral: dis ? "none" : h ? "0 10px 36px rgba(46,175,125,.48),0 0 0 1px rgba(46,175,125,.32)" : "0 5px 20px rgba(46,175,125,.3),0 0 0 1px rgba(46,175,125,.2)",
    blue:  h ? "0 4px 16px rgba(63,208,201,.2)" : "none",
    red:   "none", ghost: "none", subtle: "none",
  }[variant];

  return (
    <button onClick={dis ? undefined : onClick} {...(dis ? {} : hov)} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: C.font, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer",
      transition: "all .17s cubic-bezier(.4,0,.2,1)",
      transform: !dis && h ? "translateY(-1px)" : "none",
      width: fullWidth ? "100%" : "auto",
      padding: pad, fontSize: fs, borderRadius: rad,
      background: bg, color: col, border: bdr, boxShadow: shd,
      letterSpacing: "-.01em", whiteSpace: "nowrap",
      ...sx,
    }}>{children}</button>
  );
}

function StatusPill({ status }) {
  const map = {
    "In Progress":   { bg: "rgba(63,208,201,.14)", bd: "rgba(63,208,201,.35)", tx: "#7ECFC6", dot: C.blue },
    "Funded":        { bg: "rgba(68,147,66,.14)", bd: "rgba(68,147,66,.35)", tx: "#7ECFC6", dot: C.green },
    "Delivered":     { bg: "rgba(46,175,125,.14)", bd: "rgba(46,175,125,.35)", tx: "#FF8C5A", dot: C.coral },
    "Approved":      { bg: "rgba(68,147,66,.14)", bd: "rgba(68,147,66,.35)", tx: "#7ECFC6", dot: C.green },
    "Pending":       { bg: "rgba(76,76,100,.25)",  bd: "rgba(76,76,100,.4)",   tx: C.textMuted, dot: C.textMuted },
    "Awaiting":      { bg: "rgba(245,158,11,.14)", bd: "rgba(245,158,11,.35)", tx: "#FCD34D", dot: C.amber },
    "Disputed":      { bg: "rgba(239,68,68,.14)",  bd: "rgba(239,68,68,.35)",  tx: "#F87171", dot: C.red },
  };
  const s = map[status] || map["Pending"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: "100px", fontSize: 12, fontWeight: 700,
      background: s.bg, border: `1px solid ${s.bd}`, color: s.tx,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: s.dot,
        boxShadow: `0 0 6px ${s.dot}`, display: "inline-block",
        animation: status === "In Progress" ? "pulse-dot 2s ease-in-out infinite" : "none",
      }} />
      {status}
    </span>
  );
}

function GlassCard({ children, glow = C.coral, style: sx = {}, hover = true }) {
  const [h, hov] = useHover();
  const active = hover && h;
  return (
    <div {...(hover ? hov : {})} style={{
      background: "linear-gradient(145deg,rgba(26,26,38,.97),rgba(19,19,29,.97))",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${active ? glow + "50" : C.border}`,
      borderRadius: 18,
      boxShadow: active
        ? `0 0 0 1px ${glow}15, 0 20px 60px rgba(0,0,0,.55), 0 0 40px ${glow}10`
        : "0 6px 28px rgba(0,0,0,.4)",
      transform: active ? "translateY(-2px)" : "none",
      transition: "all .24s cubic-bezier(.4,0,.2,1)",
      position: "relative", overflow: "hidden",
      ...sx,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
        background: `linear-gradient(90deg,transparent,${glow}35,transparent)`,
        opacity: active ? 1 : 0, transition: "opacity .24s",
      }} />
      {children}
    </div>
  );
}

// ── Auto-release countdown ──────────────────────────────────────────────────
function useCountdown(initSecs) {
  const [secs, setSecs] = useState(initSecs);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = n => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ── Milestone stepper data ─────────────────────────────────────────────────
const MILESTONES = [
  { id: 1, name: "Wireframes & Sitemap",  amount: 400,  amount_usdc: 400,  status: "completed", action: null },
  { id: 2, name: "UI Design (All Pages)", amount: 800,  amount_usdc: 800,  status: "delivered",  action: "review" },
  { id: 3, name: "Responsive CSS Build",  amount: 600,  amount_usdc: 600,  status: "active",    action: null },
  { id: 4, name: "Final Handoff & QA",    amount: 400,  amount_usdc: 400,  status: "created",   action: null },
];

const TOTAL_USDC  = 2200;
const PLATFORM_FEE = TOTAL_USDC * 0.025;
const MIN_GUARANTEE_PCT = 65;
const MIN_GUARANTEE_USDC = TOTAL_USDC * (MIN_GUARANTEE_PCT / 100);

// ── Delivery file mock ──────────────────────────────────────────────────────
const DELIVERY = {
  name:      "delivery-file.zip",
  hash:      "N/A",
  size:      "",
  timestamp: "",
  hasFile:   true,
};

// ── COMPONENTS ─────────────────────────────────────────────────────────────

// ── Top bar ─────────────────────────────────────────────────────────────────
function TopBar({ contractId = "PGL-4821", title = "Website Design Escrow", status = "In Progress" }) {
  const [h, hov] = useHover();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
      <button onClick={() => window.history.back()} {...hov} style={{
        display: "flex", alignItems: "center", gap: 7,
        background: h ? C.elevated : "transparent",
        border: `1px solid ${h ? C.borderLit : C.border}`,
        borderRadius: 10, padding: "8px 14px",
        color: h ? C.text : C.textSub, fontSize: 13, fontWeight: 600,
        cursor: "pointer", fontFamily: C.font,
        transition: "all .15s ease",
      }}>
        ← Back
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>
          Contract #{contractId}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text }}>
            {title}
          </h1>
          <StatusPill status={status} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: "pulse-dot 2s ease-in-out infinite" }} />
        <span style={{ fontSize: 12.5, color: C.textSub, fontWeight: 600 }}>Live on Stellar</span>
      </div>
    </div>
  );
}

// ── Escrow Balance Card ──────────────────────────────────────────────────────
function BalanceCard({
  totalUsdc = TOTAL_USDC,
  totalPhp = phpOf(totalUsdc),
  funded,
  inFlight,
  pending,
  platformFee = totalUsdc * 0.025,
  minGuaranteePct = MIN_GUARANTEE_PCT,
  minGuaranteeUsdc = totalUsdc * (minGuaranteePct / 100),
}) {
  const fundedAmount = typeof funded === "number" ? funded : MILESTONES.filter(m => m.status === "Approved").reduce((a, m) => a + m.amount, 0);
  const inFlightAmount = typeof inFlight === "number" ? inFlight : MILESTONES.filter(m => m.status !== "Approved" && m.status !== "Pending").reduce((a, m) => a + m.amount, 0);
  const pendingAmount = typeof pending === "number" ? pending : MILESTONES.filter(m => m.status === "Pending").reduce((a, m) => a + m.amount, 0);

  const BarSeg = ({ pct, color, glow }) => (
    <div style={{ flex: pct, minWidth: 4, height: "100%", background: color, boxShadow: `0 0 8px ${glow || color}` }} />
  );

  return (
    <GlassCard glow={C.coral} hover={false} style={{ padding: "28px 28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        {/* Main balance */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Total Locked in Escrow</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.05em", background: "linear-gradient(135deg,#2EAF7D,#3FD0C9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ${totalUsdc.toLocaleString()}
            </span>
            <span style={{ fontSize: 16, color: C.textMuted, fontWeight: 600 }}>USDC</span>
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>≈ ₱{totalPhp} PHP</div>
        </div>

        {/* Guaranteed floor highlight */}
        <div style={{
          background: `linear-gradient(135deg,rgba(46,175,125,.12),rgba(46,175,125,.05))`,
          border: `1px solid rgba(46,175,125,.3)`, borderRadius: 14, padding: "14px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            <span style={{ fontSize: 14 }}>🛡️</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".05em", textTransform: "uppercase" }}>Guaranteed Floor</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-.04em", color: C.coral }}>${minGuaranteeUsdc.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{minGuaranteePct}% · freelancer guaranteed</div>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", height: 8, borderRadius: "100px", overflow: "hidden", gap: 2, background: "rgba(255,255,255,.04)" }}>
          <BarSeg pct={fundedAmount}   color={C.green}  />
          <BarSeg pct={inFlightAmount} color={C.coral}  />
          <BarSeg pct={pendingAmount}  color={C.border} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          { color: C.green, label: "Released",    value: `$${fundedAmount}` },
          { color: C.coral, label: "In Escrow",   value: `$${inFlightAmount}` },
          { color: C.textMuted, label: "Upcoming", value: `$${pendingAmount}` },
        ].map(({ color, label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: color !== C.textMuted ? `0 0 6px ${color}` : "none" }} />
            <span style={{ fontSize: 12.5, color: C.textMuted }}>{label} </span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.textSub }}>{value} USDC</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.textMuted }}>
          Platform fee: ${platformFee.toFixed(2)} USDC
        </div>
      </div>
    </GlassCard>
  );
}

// ── Vertical Milestone Stepper ──────────────────────────────────────────────
function MilestoneStepper({ milestones = MILESTONES }) {
  const [approving, setApproving] = useState(null);

  const stepIcon = (status) => {
    if (status === "completed") return { icon: "✓", bg: C.green, shadow: C.green };
    if (status === "delivered") return { icon: "📦", bg: C.coral, shadow: C.coral };
    if (status === "active") return { icon: "⚡", bg: C.blue, shadow: C.blue };
    return { icon: "○", bg: C.card, shadow: "transparent" };
  };

  return (
    <GlassCard hover={false} glow={C.blue} style={{ padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Milestone Tracker</div>
          <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>{milestones.length} milestones · {milestones.filter(m => m.status === "completed").length} complete</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.green }}>On Track</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {milestones.map((ms, i) => {
          const { icon, bg, shadow } = stepIcon(ms.status);
          const isLast = i === milestones.length - 1;
          const active = ms.status === "active" || ms.status === "delivered";

          return (
            <div key={ms.id} style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Left column: icon + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: ms.status === "created" || ms.status === "funded" ? C.elevated : `linear-gradient(135deg,${bg},${bg}CC)`,
                  border: `2px solid ${ms.status === "created" || ms.status === "funded" ? C.border : bg}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ms.status === "completed" ? 16 : 17, fontWeight: 800, color: (ms.status === "created" || ms.status === "funded") ? C.textMuted : "#fff",
                  boxShadow: (ms.status !== "created" && ms.status !== "funded") ? `0 0 20px ${shadow}50, 0 0 0 4px ${shadow}15` : "none",
                  transition: "all .3s",
                  zIndex: 1, position: "relative",
                }}>{icon}</div>
                {!isLast && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 24,
                    background: ms.status === "completed"
                      ? `linear-gradient(180deg,${C.green},${C.border})`
                      : `linear-gradient(180deg,${C.border},${C.border})`,
                    marginTop: 4, marginBottom: 4,
                    transition: "background .3s",
                  }} />
                )}
              </div>

              {/* Right: content */}
              <div style={{
                flex: 1, paddingBottom: isLast ? 0 : 20,
                paddingTop: 8,
              }}>
                <div style={{
                  background: active ? `linear-gradient(135deg,rgba(26,26,40,.98),rgba(20,20,32,.98))` : "transparent",
                  border: active ? `1px solid ${ms.status === "Delivered" ? "rgba(46,175,125,.35)" : "rgba(63,208,201,.3)"}` : "none",
                  borderRadius: 14, padding: active ? "14px 18px" : "0 4px",
                  transition: "all .2s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: active ? 10 : 4, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: ms.status === "Pending" ? C.textMuted : C.text, marginBottom: 3 }}>{ms.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StatusPill status={ms.status} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: ms.status === "Pending" ? C.textMuted : C.text }}>
                          ${Number(ms.amount_usdc || ms.amount).toLocaleString()} USDC
                        </span>
                      </div>
                    </div>

                    {/* Per-milestone action */}
                    {ms.action === "review" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {approving !== ms.id ? (
                          <Btn variant="coral" size="sm" onClick={() => setApproving(ms.id)}>
                            ✓ Approve ${Number(ms.amount_usdc || ms.amount || 0).toFixed(2)}
                          </Btn>
                        ) : (
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>Confirm release?</span>
                            <Btn variant="coral" size="sm" onClick={() => setApproving(null)}>Yes, Release</Btn>
                            <Btn variant="ghost" size="sm" onClick={() => setApproving(null)}>Cancel</Btn>
                          </div>
                        )}
                      </div>
                    )}
                    {ms.status === "completed" && (
                      <span style={{ fontSize: 12.5, color: C.green, fontWeight: 700 }}>Released ✓</span>
                    )}
                  </div>

                  {ms.status === "active" && (
                    <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55 }}>
                      Freelancer is actively working on this milestone. You'll be notified when it's delivered.
                    </div>
                  )}
                  {ms.status === "delivered" && (
                    <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.55 }}>
                      Files submitted — review the delivery zone below and approve or request changes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ── Delivery Zone ────────────────────────────────────────────────────────────
function DeliveryZone({ delivered = true, delivery = DELIVERY, activities = [] }) {
  const [tab, setTab] = useState("files");
  const safeDelivery = delivery || DELIVERY;

  if (!delivered) {
    return (
      <GlassCard hover={false} glow={C.border} style={{ padding: 0 }}>
        <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Delivery Zone</div>
          <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>Files and assets submitted by the freelancer will appear here.</div>
        </div>
        <div style={{
          margin: "28px 24px 28px", border: `1.5px dashed ${C.border}`,
          borderRadius: 14, padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Awaiting freelancer submission…</div>
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
            When the freelancer submits work, you'll get an instant notification and the file will appear here for review.
          </div>
        </div>
      </GlassCard>
    );
  }

  const tabs = ["files", "activity"];

  return (
    <GlassCard hover={false} glow={C.coral} style={{ padding: 0, overflow: "hidden" }}>
      {/* Header + tabs */}
      <div style={{ padding: "22px 24px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Delivery Zone</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>{safeDelivery.name} · {safeDelivery.timestamp}</div>
          </div>
          <StatusPill status="Delivered" />
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: "10px 10px 0 0",
              background: tab === t ? C.elevated : "transparent",
              border: "none", cursor: "pointer", fontFamily: C.font,
              fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? C.text : C.textMuted,
              borderBottom: tab === t ? `2px solid ${C.coral}` : "2px solid transparent",
              transition: "all .15s",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "22px 24px" }}>
        {tab === "files" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Preview thumbnail */}
            <div style={{
              height: 160, borderRadius: 14, overflow: "hidden",
              background: "linear-gradient(135deg,rgba(46,175,125,.08),rgba(63,208,201,.06))",
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {/* Mock browser UI */}
              <div style={{ width: "80%", background: C.elevated, borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                  {[C.red, C.amber, C.green].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, marginBottom: 6, width: "60%" }} />
                <div style={{ height: 40, background: "rgba(46,175,125,.1)", borderRadius: 6, border: `1px solid rgba(46,175,125,.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, color: C.coral, fontWeight: 700 }}>Design Preview</span>
                </div>
              </div>
              <div style={{ position: "absolute", top: 10, right: 12, fontSize: 11, color: C.textMuted, background: "rgba(0,0,0,.4)", padding: "3px 8px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
                Preview Placeholder
              </div>
            </div>

            {/* File details */}
            <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(46,175,125,.12)", border: "1px solid rgba(46,175,125,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{delivery.name}</div>
                    <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>{delivery.size}{delivery.size && delivery.timestamp ? " · " : ""}{delivery.timestamp}</div>
                  </div>
                </div>
                <Btn variant="subtle" size="sm">⬇ Download</Btn>
              </div>

              {/* Hash row */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
                  <span style={{ fontSize: 11.5, color: C.textMuted }}>On-chain hash:</span>
                </div>
                <code style={{ fontSize: 12, color: C.blue, fontFamily: "monospace", background: "rgba(63,208,201,.08)", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(63,208,201,.2)" }}>
                  {delivery.hash}
                </code>
                <span style={{ fontSize: 11.5, color: C.textMuted, marginLeft: "auto" }}>⛓️ Stellar Network</span>
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(activities.length ? activities : [
              { icon: "ℹ️", color: C.blue, label: "No escrow activity found yet", time: "Pending" },
            ]).map(({ icon, color, label, time }) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${color}14`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: C.text, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// ── Action Sidebar ──────────────────────────────────────────────────────────
function ActionSidebar({ escrow, reviewMilestone, hasMilestones, hasRemainingMilestones, onApproved }) {
  const { supabase } = useAuth();
  const countdown = useCountdown(47 * 3600 + 32 * 60 + 10);
  const onchainEscrowId = parseInt(escrow?.stellar_contract_id ?? "0") || 0;

  // Calculate min guarantee from escrow data
  const totalUsdc = typeof escrow?.amount_usdc === "number" ? escrow.amount_usdc : Number(escrow?.amount_usdc) || 0;
  const minGuaranteePct = typeof escrow?.min_guarantee_pct === "number" ? escrow.min_guarantee_pct : 0;
  const minGuaranteeUsdc = typeof escrow?.min_guarantee_usdc === "number" ? escrow.min_guarantee_usdc : Number(escrow?.min_guarantee_usdc) || totalUsdc * (minGuaranteePct / 100);

  const [showDispute, setShowDispute] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveError, setApproveError] = useState(null);
  const [approveTxHash, setApproveTxHash] = useState(null);
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [disputeError, setDisputeError] = useState(null);
  const { wallet, connectWallet } = useFreighterWallet();

  const handleApprove = async () => {
    setApproveLoading(true); setApproveError(null);
    let fresh;
    try {
      fresh = await connectWallet();
    } catch {
      setApproveError("Could not connect Freighter wallet.");
      setApproveLoading(false);
      return;
    }
    if (!fresh?.address) {
      setApproveError("Connect your Freighter wallet first.");
      setApproveLoading(false);
      return;
    }
    try {
      let hash = null;
      const now = new Date().toISOString();
      const shouldReleaseOnChain = !hasMilestones || !hasRemainingMilestones;

      if (shouldReleaseOnChain) {
        const release = await approveRelease(fresh.address, onchainEscrowId);
        hash = release.hash;
        setApproveTxHash(hash);
      } else {
        setApproveTxHash("milestone-approved");
      }

      if (reviewMilestone?.id) {
        await supabase.from("milestones").update({
          status: "completed",
          approved_at: now,
        }).eq("id", reviewMilestone.id);

        const nextSortOrder = Number(reviewMilestone.sort_order || 0) + 1;
        await supabase.from("milestones").update({ status: "active" })
          .eq("escrow_id", escrow?.id)
          .eq("sort_order", nextSortOrder)
          .eq("status", "created");
      }

      await supabase.from("escrows").update({
        status: shouldReleaseOnChain ? "completed" : "active",
        completed_at: shouldReleaseOnChain ? now : null,
      }).eq("stellar_contract_id", String(onchainEscrowId));

      await supabase.from("escrow_events").insert({
        escrow_id: escrow?.id,
        event_type: shouldReleaseOnChain ? "completed" : "milestone_approved",
        message: shouldReleaseOnChain
          ? "Payment approved and released to freelancer"
          : `Milestone "${reviewMilestone?.title || "Current milestone"}" approved`,
      });

      if (onApproved) onApproved();

  } catch (err) {
    setApproveError(err instanceof Error ? err.message : "Transaction failed.");
  } finally {
    setApproveLoading(false);
  }
};

  const handleDispute = async () => {
    if (!wallet?.address) { setDisputeError("Connect Freighter wallet first."); return; }
    setDisputeLoading(true); setDisputeError(null);
    try {
      const { hash } = await triggerDispute(wallet.address, onchainEscrowId);
      const escrowId = escrow?.id;
      go(`/dispute?tx=${hash}${escrowId ? `&escrow_id=${escrowId}` : ''}`);
    } catch (err) {
      setDisputeError(err instanceof Error ? err.message : "Transaction failed.");
      setDisputeLoading(false);
    }
  };

  const startDate = escrow?.created_at
    ? new Date(escrow.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const deadline = escrow?.deadline
    ? new Date(escrow.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const daysRemaining = escrow?.deadline
    ? Math.ceil((new Date(escrow.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const releaseAmount = Number(reviewMilestone?.amount_usdc ?? escrow?.amount_usdc ?? 0);
  const actionSubtitle = reviewMilestone
    ? `${reviewMilestone.title || "Current milestone"} is awaiting your review`
    : "Delivery is awaiting your review";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Primary action card */}
      <GlassCard glow={C.coral} style={{ padding: "22px 20px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 4, letterSpacing: "-.02em" }}>Actions</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>{actionSubtitle}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Success state */}
          {approveTxHash ? (
            <div style={{ background: "rgba(68,147,66,.1)", border: "1px solid rgba(68,147,66,.3)", borderRadius: 12, padding: "14px 16px", fontSize: 12.5, color: "#7ECFC6", fontFamily: "monospace", wordBreak: "break-all" }}>
              ✓ Released · Tx: {approveTxHash}
            </div>
          ) : (
            <>
              {/* Primary CTA */}
              <Btn variant="coral" size="lg" fullWidth disabled={approveLoading} onClick={handleApprove}>
                {approveLoading ? "⏳ Signing…" : `✓ Approve & Release ${releaseAmount ? `$${releaseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Funds"}`}
              </Btn>

              {approveError && (
                <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#F87171", lineHeight: 1.5 }}>
                  {approveError}
                </div>
              )}

              {/* Secondary */}
              <Btn variant="blue" size="md" fullWidth>
                ↩ Request Changes
              </Btn>

              {/* Destructive */}
              {!showDispute ? (
                <button onClick={() => setShowDispute(true)} style={{
                  background: "transparent", border: `1px solid rgba(239,68,68,.25)`,
                  borderRadius: 11, padding: "9px 16px", color: "rgba(239,68,68,.7)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.font,
                  transition: "all .15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,.45)"; e.currentTarget.style.color = "#F87171"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(239,68,68,.25)"; e.currentTarget.style.color = "rgba(239,68,68,.7)"; }}
                >
                  ⚖️ Raise a Dispute
                </button>
              ) : (
                <div style={{ background: "rgba(239,68,68,.07)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F87171", marginBottom: 6 }}>Raise a Dispute?</div>
                  <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55, marginBottom: 12 }}>
                    A neutral arbitrator will review both sides. The guaranteed floor of ${minGuaranteeUsdc.toLocaleString()} USDC is protected for the freelancer.
                  </div>
                  {disputeError && (
                    <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#F87171", marginBottom: 10 }}>
                      {disputeError}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="red" size="sm" disabled={disputeLoading} onClick={handleDispute} style={{ flex: 1, justifyContent: "center" }}>
                      {disputeLoading ? "⏳ Signing…" : "Confirm Dispute"}
                    </Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setShowDispute(false)}>Cancel</Btn>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </GlassCard>

      {/* Auto-release countdown */}
      <div style={{
        background: "linear-gradient(135deg,rgba(245,158,11,.1),rgba(245,158,11,.04))",
        border: `1px solid rgba(245,158,11,.3)`, borderRadius: 14, padding: "16px 18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.amber }}>Auto-Release Active</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.05em", color: C.text, fontFamily: "monospace", marginBottom: 6 }}>
          {countdown}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>
          Payment releases automatically if no action is taken within 48 hours of delivery.
        </div>
      </div>

      {/* Quick stats */}
      <GlassCard glow={C.border} hover={false} style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Contract Info</div>
        {[
          { label: "Started",        value: startDate },
          { label: "Deadline",       value: deadline },
          { label: "Days remaining", value: `${daysRemaining} days` },
          { label: "Payment type",   value: "Milestone-based" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid rgba(38,38,58,.5)` }}>
            <span style={{ fontSize: 12.5, color: C.textMuted }}>{label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textSub }}>{value}</span>
          </div>
        ))}
      </GlassCard>

    </div>
  );
}

// ── Freelancer Card ──────────────────────────────────────────────────────────
function FreelancerCard({ supabase, freelancerId }) {
  const [freelancer, setFreelancer] = useState(null);
  const [stats, setStats] = useState({ jobsDone: 0, onTime: 0, rehire: 0, disputes: 0, rating: "N/A" });

  useEffect(() => {
    if (!freelancerId) return;

    async function loadFreelancerData() {
      const [profileRes, statsRes, escrowRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", freelancerId).single(),
        supabase.from("disputes").select("id").eq("opened_by", freelancerId),
        supabase.from("escrows").select("id,deadline,completed_at").eq("freelancer_id", freelancerId),
      ]);

      if (profileRes.data) {
        setFreelancer(profileRes.data);
      }
      if (statsRes.data) {
        const jobsDone = (escrowRes.data || []).filter(e => !!e.completed_at).length;
        const onTimeDone = (escrowRes.data || []).filter(e => e.completed_at && e.deadline && new Date(e.completed_at) <= new Date(e.deadline)).length;
        const onTimePct = jobsDone ? Math.round((onTimeDone / jobsDone) * 100) : 0;
        setStats((prev) => ({ ...prev, disputes: statsRes.data.length, jobsDone, onTime: onTimePct, rehire: jobsDone ? Math.min(100, 40 + jobsDone) : 0 }));
      }
    }

    loadFreelancerData();
  }, [freelancerId, supabase]);

  if (!freelancer) {
    return (
      <GlassCard glow={C.purple} style={{ padding: "20px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Freelancer</div>
        <div style={{ fontSize: 12.5, color: C.textMuted }}>Loading freelancer info...</div>
      </GlassCard>
    );
  }

  const badges = [
    { icon: "⭐", label: "Top Rated",    color: C.amber  },
    { icon: "✅", label: "ID Verified",  color: C.green  },
    { icon: "⚡", label: "Fast Deliver", color: C.blue   },
    { icon: "🛡️", label: `${stats.disputes} Disputes`, color: C.purple },
  ];

  return (
    <GlassCard glow={C.purple} style={{ padding: "20px 20px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Freelancer</div>

      {/* Profile row */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg,rgba(139,92,246,.3),rgba(139,92,246,.1))",
            border: "2px solid rgba(139,92,246,.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: C.purple,
          }}>
            {freelancer.display_name?.substring(0, 2).toUpperCase() || "—"}
          </div>
          <div style={{
            position: "absolute", bottom: 1, right: 1,
            width: 12, height: 12, borderRadius: "50%",
            background: C.green, border: `2px solid ${C.surface}`,
            boxShadow: `0 0 6px ${C.green}`,
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>
            {freelancer.display_name || "Freelancer"}
          </div>
          <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 5 }}>
            {freelancer.role === "freelancer" ? "Freelancer" : "Professional"} · {freelancer.wallet_address?.substring(0, 8) || ""}
          </div>
          {/* Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 13, color: s <= 4 ? C.amber : "rgba(245,158,11,.3)" }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{stats.rating}</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>({stats.jobsDone || 0})</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {badges.map(({ icon, label, color }) => (
          <div key={label} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: `${color}12`, border: `1px solid ${color}30`,
            borderRadius: "100px", padding: "4px 10px",
            fontSize: 11.5, fontWeight: 700, color,
          }}>
            {icon} {label}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 0, background: C.elevated, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
        {[
          { label: "Jobs Done", value: String(stats.jobsDone || 0) },
          { label: "On-Time",   value: `${stats.onTime || 0}%` },
          { label: "Rehire",    value: `${stats.rehire || 0}%` },
        ].map(({ label, value }, i) => (
          <div key={label} style={{
            flex: 1, textAlign: "center", padding: "12px 8px",
            borderRight: i < 2 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: C.text, letterSpacing: "-.03em" }}>{value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <Btn variant="ghost" size="sm" fullWidth>💬 Message</Btn>
      </div>
    </GlassCard>
  );
}

// ── Root Page ────────────────────────────────────────────────────────────────
export default function PangolinEscrowDetail() {
  const { supabase } = useAuth();
  const searchParams = useSearchParams();
  const escrowId = searchParams.get("id");
  const [escrow, setEscrow] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [escrowEvents, setEscrowEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadEscrow() {
      let query = supabase
        .from("escrows")
        .select("*");

      // If id is provided in URL, fetch that specific escrow
      if (escrowId) {
        query = query.eq("id", escrowId);
      } else {
        // Otherwise fetch the most recent one
        query = query.order("created_at", { ascending: false }).limit(1);
      }

      const { data: escrowData, error: escrowError } = await query.single();

      if (!mounted) return;
      if (escrowError) {
        setLoading(false);
        return;
      }

      setEscrow(escrowData);

      const [milestonesRes, deliveryRes, eventsRes] = await Promise.all([
        supabase
          .from("milestones")
          .select("*")
          .eq("escrow_id", escrowData.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("deliveries")
          .select("*")
          .eq("escrow_id", escrowData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("escrow_events")
          .select("id,event_type,message,created_at")
          .eq("escrow_id", escrowData.id)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (!mounted) return;
      if (!milestonesRes.error && Array.isArray(milestonesRes.data)) {
        setMilestones(milestonesRes.data.map(m => ({
          ...m,
          name: m.title || m.name || `Milestone ${m.sort_order || ""}`,
          amount: Number(m.amount_usdc ?? m.amount ?? 0),
        })));
      }
      if (!deliveryRes.error && deliveryRes.data) {
        setDelivery(deliveryRes.data);
      }
      if (!eventsRes.error && Array.isArray(eventsRes.data)) {
        setEscrowEvents(eventsRes.data);
      }
      setLoading(false);
    }

    loadEscrow();
    return () => { mounted = false; };
  }, [supabase, escrowId]);

  const milestoneRows = milestones.length > 0 ? milestones : [];
  const reviewMilestone = milestoneRows.find(m => m.status === "delivered") || null;
  const hasMilestones = milestoneRows.length > 0;
  const hasRemainingMilestones = reviewMilestone
    ? milestoneRows.some(m => Number(m.sort_order || 0) > Number(reviewMilestone.sort_order || 0))
    : false;
  const totalUsdc = typeof escrow?.amount_usdc === "number" ? escrow.amount_usdc : Number(escrow?.amount_usdc) || 0;
  const platformFee = typeof escrow?.platform_fee_usdc === "number" ? escrow.platform_fee_usdc : Number(escrow?.platform_fee_usdc) || totalUsdc * 0.025;
  const minGuaranteePct = typeof escrow?.min_guarantee_pct === "number" ? escrow.min_guarantee_pct : 0;
  const minGuaranteeUsdc = typeof escrow?.min_guarantee_usdc === "number" ? escrow.min_guarantee_usdc : Number(escrow?.min_guarantee_usdc) || totalUsdc * (minGuaranteePct / 100);
  const funded = milestoneRows.filter(m => m.status === "completed").reduce((a, m) => a + (Number(m.amount_usdc) || 0), 0);
  const inFlight = milestoneRows.filter(m => m.status === "active" || m.status === "delivered").reduce((a, m) => a + (Number(m.amount_usdc) || 0), 0);
  const pending = milestoneRows.filter(m => m.status === "created" || m.status === "funded").reduce((a, m) => a + (Number(m.amount_usdc) || 0), 0);
  const escrowTitle = escrow?.title || "Escrow Contract";
  const contractId = escrow?.id ? `PGL-${escrow.id}` : "N/A";
  const escrowStatus = escrow?.status || "In Progress";
  const deliveryDetails = delivery ? {
    name: delivery.file_name || "Delivery file",
    size: delivery.file_url ? "Uploaded file" : "",
    timestamp: delivery.created_at ? new Date(delivery.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    hash: delivery.file_hash || delivery.stellar_delivery_tx_hash || "N/A",
    url: delivery.file_url || delivery.external_url || "",
    note: delivery.delivery_note || "",
  } : DELIVERY;
  const totalPhp = phpOf(totalUsdc);
  const formattedEvents = escrowEvents.map(e => ({
    icon: String(e.event_type || "").includes("deliver") ? "📦" : String(e.event_type || "").includes("fund") ? "🔒" : "ℹ️",
    color: String(e.event_type || "").includes("deliver") ? C.coral : String(e.event_type || "").includes("fund") ? C.green : C.blue,
    label: e.message || e.event_type || "Escrow event",
    time: e.created_at ? new Date(e.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Pending",
  }));

  return (
    <AuthGuard>
      <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; }
        body {
          font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
          background: #02353C; color: #C1F6ED;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.45; transform:scale(.7); }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #02353C; }
        ::-webkit-scrollbar-thumb { background: #0A5560; border-radius: 3px; }

        /* Escrow Detail Responsiveness Media Queries */
        @media (max-width: 850px) {
          .escrow-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .escrow-detail-inner {
            padding: 20px 16px 60px !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse 65% 45% at 10% 10%, rgba(46,175,125,.06) 0%, transparent 55%),
          radial-gradient(ellipse 55% 40% at 85% 80%, rgba(63,208,201,.05) 0%, transparent 55%),
          #02353C`,
        overflowX: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "fixed", inset: 0, opacity: .018, pointerEvents: "none",
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="escrow-detail-inner" style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px 80px", animation: "fade-up .35s ease" }}>

          <TopBar contractId={contractId} title={escrowTitle} status={escrowStatus} />

          {/* Balance card — full width */}
          <div style={{ marginBottom: 24 }}>
            <BalanceCard
              totalUsdc={totalUsdc}
              totalPhp={totalPhp}
              funded={funded}
              inFlight={inFlight}
              pending={pending}
              platformFee={platformFee}
              minGuaranteePct={minGuaranteePct}
              minGuaranteeUsdc={minGuaranteeUsdc}
            />
          </div>

          {/* Two-column layout: left (main) + right (sidebar) */}
          <div className="escrow-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

            {/* ── Left column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <MilestoneStepper milestones={milestones} />
              <DeliveryZone delivered={!!delivery} delivery={deliveryDetails} activities={formattedEvents} />
            </div>

            {/* ── Right column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ActionSidebar
                escrow={escrow}
                reviewMilestone={reviewMilestone}
                hasMilestones={hasMilestones}
                hasRemainingMilestones={hasRemainingMilestones}
                onApproved={() => window.location.reload()}
              />
              <FreelancerCard supabase={supabase} freelancerId={escrow?.freelancer_id} />
            </div>

          </div>

        </div>
      </div>
    </>
    </AuthGuard>
  );
}
