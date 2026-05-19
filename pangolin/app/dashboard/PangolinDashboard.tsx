// @ts-nocheck
"use client";

import { useState } from "react";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { shortenAddress } from "@/lib/format";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Client Dashboard
   Dark #0D0D0F · Coral #FF6B35 · Inter font · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:        "#0D0D0F",
  surface:     "#111115",
  elevated:    "#18181F",
  card:        "#1C1C26",
  border:      "#242430",
  borderLight: "#2E2E3E",
  coral:       "#FF6B35",
  coralDark:   "#D9521A",
  coralGlow:   "rgba(255,107,53,0.22)",
  blue:        "#3B82F6",
  blueGlow:    "rgba(59,130,246,0.2)",
  green:       "#10B981",
  amber:       "#F59E0B",
  purple:      "#8B5CF6",
  red:         "#EF4444",
  text:        "#F0F0F5",
  textSub:     "#8888A0",
  textMuted:   "#4A4A5E",
  font:        "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

function go(path) {
  window.location.href = path;
}

// ── Tiny hooks & helpers ──────────────────────────────────────────────────────
function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function Avatar({ initials, size = 34, color = C.coral }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg,${color}28,${color}0E)`,
      border: `1.5px solid ${color}45`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 700, color,
    }}>{initials}</div>
  );
}

function StatusPill({ status }) {
  const map = {
    "In Progress":        { bg: "rgba(59,130,246,.14)",  border: "rgba(59,130,246,.35)",  text: "#60A5FA", dot: "#3B82F6" },
    "Awaiting Delivery":  { bg: "rgba(245,158,11,.14)",  border: "rgba(245,158,11,.35)",  text: "#FCD34D", dot: "#F59E0B" },
    "Delivered · Review": { bg: "rgba(255,107,53,.14)",  border: "rgba(255,107,53,.35)",  text: "#FF8C5A", dot: "#FF6B35" },
    "Completed":          { bg: "rgba(16,185,129,.14)",  border: "rgba(16,185,129,.35)",  text: "#34D399", dot: "#10B981" },
    "Disputed":           { bg: "rgba(239,68,68,.14)",   border: "rgba(239,68,68,.35)",   text: "#F87171", dot: "#EF4444" },
  };
  const s = map[status] || map["In Progress"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 11px", borderRadius: "100px", fontSize: "11.5px", fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: s.dot,
        boxShadow: `0 0 6px ${s.dot}`,
        animation: status === "In Progress" ? "pulse-dot 2s ease-in-out infinite" : "none",
        display: "inline-block",
      }} />
      {status}
    </span>
  );
}

function Btn({ variant = "coral", size = "md", children, onClick, style: sx = {} }) {
  const [h, hov] = useHover();
  const sizes = {
    sm:  { padding: "7px 16px",  fontSize: "12.5px", borderRadius: "10px" },
    md:  { padding: "10px 20px", fontSize: "13.5px", borderRadius: "11px" },
    lg:  { padding: "14px 30px", fontSize: "15px",   borderRadius: "13px" },
    xl:  { padding: "16px 38px", fontSize: "16px",   borderRadius: "14px" },
    pill:{ padding: "13px 32px", fontSize: "15px",   borderRadius: "100px" },
  };
  const variants = {
    coral: {
      background: h ? `linear-gradient(135deg,#FF7C48,${C.coralDark})` : `linear-gradient(135deg,${C.coral},${C.coralDark})`,
      color: "#fff", border: "none",
      boxShadow: h ? "0 10px 36px rgba(255,107,53,.5),0 0 0 1px rgba(255,107,53,.35)"
                   : "0 5px 20px rgba(255,107,53,.32),0 0 0 1px rgba(255,107,53,.22)",
    },
    ghost: {
      background: h ? "rgba(255,107,53,.09)" : "transparent",
      color: h ? C.coral : C.textSub,
      border: `1px solid ${h ? "rgba(255,107,53,.3)" : C.border}`,
      boxShadow: "none",
    },
    subtle: {
      background: h ? C.card : C.elevated,
      color: C.text, border: `1px solid ${h ? C.borderLight : C.border}`,
      boxShadow: h ? "0 4px 16px rgba(0,0,0,.35)" : "none",
    },
    blue: {
      background: h ? "linear-gradient(135deg,#5A9BFF,#3B82F6)" : "linear-gradient(135deg,#3B82F6,#2563EB)",
      color: "#fff", border: "none",
      boxShadow: h ? "0 8px 28px rgba(59,130,246,.45)" : "0 4px 16px rgba(59,130,246,.28)",
    },
  };
  return (
    <button onClick={onClick} {...hov} style={{
      display: "inline-flex", alignItems: "center", gap: "7px",
      fontFamily: C.font, fontWeight: 650, cursor: "pointer",
      transition: "all .17s cubic-bezier(.4,0,.2,1)",
      transform: h ? "translateY(-1px)" : "none",
      whiteSpace: "nowrap", letterSpacing: "-.01em",
      ...sizes[size], ...variants[variant], ...sx,
    }}>{children}</button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  icon: "⊞",  label: "Dashboard" },
  { id: "projects",   icon: "📁", label: "Projects / Escrows", badge: 3 },
  { id: "messages",   icon: "💬", label: "Messages",           badge: 2 },
  { id: "reputation", icon: "⭐", label: "Reputation" },
  { id: "disputes",   icon: "⚖️", label: "Disputes" },
  { id: "settings",   icon: "⚙️", label: "Settings" },
];

function Sidebar({ collapsed, onToggle, active, setActive, wallet, onConnect, onDisconnect }) {
  const W = collapsed ? 64 : 228;
  return (
    <aside style={{
      width: W, minWidth: W, maxWidth: W,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      transition: "width .22s cubic-bezier(.4,0,.2,1), min-width .22s, max-width .22s",
      overflow: "hidden", flexShrink: 0, position: "relative",
      zIndex: 20,
    }}>
      {/* Logo row */}
      <div style={{
        height: 62, display: "flex", alignItems: "center",
        padding: collapsed ? "0 0 0 16px" : "0 16px",
        borderBottom: `1px solid ${C.border}`,
        gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>🐧</span>
        {!collapsed && (
          <span style={{
            fontSize: 17, fontWeight: 800, letterSpacing: "-.03em",
            background: "linear-gradient(135deg,#FF6B35,#FF9A6C)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            whiteSpace: "nowrap",
          }}>Pangolin</span>
        )}
        <button onClick={onToggle} style={{
          marginLeft: "auto", background: "transparent", border: "none",
          color: C.textMuted, cursor: "pointer", fontSize: 16, flexShrink: 0,
          padding: "4px 6px", borderRadius: 8,
          transition: "color .15s",
        }}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ id, icon, label, badge }) => (
          <SidebarItem key={id} icon={icon} label={label} badge={badge}
            active={active === id} collapsed={collapsed}
            onClick={() => setActive(id)} />
        ))}
      </nav>

      {/* Wallet */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        {collapsed ? (
          <div style={{
            width: 40, height: 40, borderRadius: 12, margin: "0 auto",
            background: `linear-gradient(135deg,${C.coral}22,${C.coral}0A)`,
            border: `1px solid ${C.coral}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, cursor: "pointer",
          }}>🔗</div>
        ) : wallet?.status === "connected" && wallet.address ? (
          <div style={{
            background: `linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))`,
            border: `1px solid rgba(255,107,53,.28)`,
            borderRadius: 13, padding: "11px 14px",
          }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 5 }}>Connected Wallet</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{shortenAddress(wallet.address)}</span>
            </div>
            <Btn variant="coral" size="sm" onClick={onDisconnect} sx={{ width: "100%", justifyContent: "center" }}>Disconnect</Btn>
          </div>
        ) : (
          <div style={{
            background: `linear-gradient(135deg,rgba(255,107,53,.06),rgba(255,107,53,.02))`,
            border: `1px solid rgba(255,107,53,.18)`,
            borderRadius: 13, padding: "11px 14px",
          }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 8 }}>Wallet</div>
            <Btn variant="coral" size="sm" onClick={onConnect} sx={{ width: "100%", justifyContent: "center" }}>🔗 Connect Freighter</Btn>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, badge, active, collapsed, onClick }) {
  const [h, hov] = useHover();
  const lit = active || h;
  return (
    <button onClick={onClick} {...hov} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: collapsed ? "10px 12px" : "10px 13px",
      borderRadius: 11, border: "none", cursor: "pointer",
      background: active ? `linear-gradient(135deg,rgba(255,107,53,.16),rgba(255,107,53,.06))`
                         : h ? "rgba(255,255,255,.04)" : "transparent",
      boxShadow: active ? `inset 0 0 0 1px rgba(255,107,53,.25)` : "none",
      transition: "all .15s ease", width: "100%", textAlign: "left",
      justifyContent: collapsed ? "center" : "flex-start",
      position: "relative",
    }}>
      <span style={{ fontSize: 17, flexShrink: 0, filter: active ? "none" : "grayscale(30%)" }}>{icon}</span>
      {!collapsed && (
        <>
          <span style={{
            fontSize: 13.5, fontWeight: active ? 700 : 500,
            color: active ? C.coral : h ? C.text : C.textSub,
            transition: "color .15s", whiteSpace: "nowrap",
          }}>{label}</span>
          {badge && (
            <span style={{
              marginLeft: "auto", background: C.coral, color: "#fff",
              borderRadius: "100px", fontSize: 10.5, fontWeight: 800,
              padding: "2px 7px", minWidth: 20, textAlign: "center",
              boxShadow: "0 2px 8px rgba(255,107,53,.4)",
            }}>{badge}</span>
          )}
        </>
      )}
      {/* Collapsed badge dot */}
      {collapsed && badge && (
        <div style={{
          position: "absolute", top: 6, right: 6,
          width: 8, height: 8, borderRadius: "50%", background: C.coral,
          boxShadow: `0 0 6px ${C.coral}`,
        }} />
      )}
    </button>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = C.coral, trend }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      background: h
        ? "linear-gradient(135deg,rgba(28,28,38,.98),rgba(22,22,32,.98))"
        : "linear-gradient(135deg,rgba(24,24,32,.96),rgba(18,18,26,.96))",
      border: `1px solid ${h ? color + "45" : C.border}`,
      borderRadius: 17, padding: "22px 24px",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
      transform: h ? "translateY(-3px)" : "none",
      boxShadow: h ? `0 16px 48px rgba(0,0,0,.5),0 0 32px ${color}10` : "0 4px 20px rgba(0,0,0,.3)",
      position: "relative", overflow: "hidden", flex: "1 1 180px", minWidth: 160,
    }}>
      {/* BG glow */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 100, height: 100,
        background: `radial-gradient(circle,${color}14,transparent 70%)`,
        opacity: h ? 1 : 0.5, transition: "opacity .22s",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}16`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>{icon}</div>
        {trend && (
          <span style={{
            fontSize: 11.5, fontWeight: 700, color: trend > 0 ? C.green : C.red,
            background: trend > 0 ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
            border: `1px solid ${trend > 0 ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`,
            padding: "3px 9px", borderRadius: "100px",
          }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>
        )}
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 5, position: "relative" }}>{label}</div>
      <div style={{
        fontSize: 28, fontWeight: 900, letterSpacing: "-.04em", color: C.text,
        marginBottom: 4, position: "relative",
        background: `linear-gradient(135deg,${C.text},${color})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.textMuted, position: "relative" }}>{sub}</div>}
    </div>
  );
}

// ── Escrow Table ──────────────────────────────────────────────────────────────
const ESCROWS = [
  {
    id:         4821,
    project:    "Brand Identity Suite",
    freelancer: { initials: "AK", name: "Ana Kalaw",    color: "#8B5CF6" },
    status:     "In Progress",
    amount:     "₱14,500",
    milestone:  "UI Kit (2/3)",
    action:     { label: "View Details", variant: "subtle" },
  },
  {
    id:         4822,
    project:    "Mobile App UI Design",
    freelancer: { initials: "MR", name: "Marco Reyes",  color: "#3B82F6" },
    status:     "Awaiting Delivery",
    amount:     "₱8,200",
    milestone:  "Prototype (1/2)",
    action:     { label: "Send Reminder", variant: "ghost" },
  },
  {
    id:         4823,
    project:    "Explainer Video Edit",
    freelancer: { initials: "LC", name: "Liza Cruz",    color: "#10B981" },
    status:     "Delivered · Review",
    amount:     "₱5,800",
    milestone:  "Final Cut (3/3)",
    action:     { label: "Release Payment", variant: "coral" },
  },
];

function EscrowTable() {
  const cols = ["Project", "Freelancer", "Status", "Amount", "Milestone", "Action"];
  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(24,24,32,.97),rgba(18,18,26,.97))",
      border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden",
    }}>
      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.6fr 1.5fr 1fr 1.2fr 1.3fr",
        padding: "13px 24px",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(255,255,255,.02)",
      }}>
        {cols.map(c => (
          <div key={c} style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".06em", textTransform: "uppercase" }}>{c}</div>
        ))}
      </div>

      {/* Rows */}
      {ESCROWS.map((row, i) => (
        <EscrowRow key={i} row={row} last={i === ESCROWS.length - 1} />
      ))}
    </div>
  );
}

function EscrowRow({ row, last }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      display: "grid",
      gridTemplateColumns: "2fr 1.6fr 1.5fr 1fr 1.2fr 1.3fr",
      padding: "15px 24px", alignItems: "center",
      borderBottom: last ? "none" : `1px solid rgba(36,36,48,.7)`,
      background: h ? "rgba(255,255,255,.018)" : "transparent",
      transition: "background .15s",
    }}>
      {/* Project */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2 }}>{row.project}</div>
        <div style={{ fontSize: 11.5, color: C.textMuted }}>Contract #PGL-{row.id}</div>
      </div>
      {/* Freelancer */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials={row.freelancer.initials} size={32} color={row.freelancer.color} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{row.freelancer.name}</span>
      </div>
      {/* Status */}
      <div><StatusPill status={row.status} /></div>
      {/* Amount */}
      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>{row.amount}</div>
      {/* Milestone */}
      <div>
        <div style={{ fontSize: 12.5, color: C.textSub, marginBottom: 4 }}>{row.milestone}</div>
        <div style={{ height: 4, background: "rgba(255,255,255,.07)", borderRadius: "100px", overflow: "hidden", width: 80 }}>
          <div style={{
            height: "100%", borderRadius: "100px",
            background: `linear-gradient(90deg,${C.coral},#FF9A6C)`,
            boxShadow: `0 0 8px ${C.coralGlow}`,
            width: row.status === "Completed" ? "100%"
                 : row.status === "Delivered · Review" ? "95%"
                 : row.status === "In Progress" ? "66%" : "40%",
            transition: "width .3s",
          }} />
        </div>
      </div>
      {/* Action */}
      <div><Btn variant={row.action.variant} size="sm" onClick={() => go("/escrow")}>{row.action.label}</Btn></div>
    </div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { icon: "💸", color: C.green,  title: "Payment Released",     desc: "₱5,800 sent to Liza Cruz for Explainer Video Edit", time: "2 min ago" },
  { icon: "⭐", color: C.amber,  title: "Review Received",      desc: "Ana Kalaw left a 5-star review on your Brand Identity project", time: "1 hr ago" },
  { icon: "🔒", color: C.blue,   title: "Escrow Created",       desc: "New contract with Marco Reyes — ₱8,200 locked in escrow", time: "3 hrs ago" },
];

function ActivityFeed() {
  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(24,24,32,.97),rgba(18,18,26,.97))",
      border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden",
    }}>
      <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Recent Activity</span>
        <span style={{ fontSize: 12, color: C.coral, fontWeight: 600, cursor: "pointer" }}>View all →</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {ACTIVITIES.map((a, i) => <ActivityItem key={i} {...a} last={i === ACTIVITIES.length - 1} />)}
      </div>
    </div>
  );
}

function ActivityItem({ icon, color, title, desc, time, last }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      display: "flex", gap: 14, padding: "14px 22px",
      borderBottom: last ? "none" : `1px solid rgba(36,36,48,.5)`,
      background: h ? "rgba(255,255,255,.016)" : "transparent",
      transition: "background .15s", cursor: "default",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{title}</span>
          <span style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{time}</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}

// ── Notification Bell ─────────────────────────────────────────────────────────
function NotifBell() {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      position: "relative", cursor: "pointer",
      width: 40, height: 40, borderRadius: 12,
      background: h ? C.elevated : "transparent",
      border: `1px solid ${h ? C.borderLight : C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", fontSize: 18,
    }}>
      🔔
      <div style={{
        position: "absolute", top: 6, right: 6,
        width: 9, height: 9, borderRadius: "50%",
        background: C.coral, border: `2px solid ${C.surface}`,
        boxShadow: `0 0 8px ${C.coral}`,
      }} />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function PangolinDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const { wallet, connectWallet, disconnectWallet } = useFreighterWallet();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${C.base}; color: ${C.text};
          -webkit-font-smoothing: antialiased;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(.75); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.base}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.base }}>

        {/* ── Sidebar ── */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(p => !p)}
          active={active}
          setActive={setActive}
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />

        {/* ── Main ── */}
        <main style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          background: `radial-gradient(ellipse 60% 40% at 70% 10%, rgba(255,107,53,.05) 0%, transparent 60%),
                       radial-gradient(ellipse 50% 40% at 20% 80%, rgba(59,130,246,.04) 0%, transparent 60%),
                       ${C.base}`,
          animation: "slide-in .35s ease",
        }}>
          {/* Inner padding wrapper */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 60px" }}>

            {/* ── Top Bar ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
              {/* Greeting */}
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>
                  Client Dashboard
                </div>
                <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text }}>
                  Welcome back, Juan Miguel 👋
                </h1>
              </div>

              {/* Right actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <NotifBell />
                {/* Create Escrow CTA */}
                <Btn variant="coral" size="lg" onClick={() => go("/create-escrow")}>
                  <span style={{ fontSize: 16 }}>+</span> Create New Escrow
                </Btn>
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard icon="💰" label="Total Escrowed" value="₱28,500"  sub="Across 3 active projects"   color={C.coral}  trend={12} />
              <StatCard icon="📁" label="Active Projects" value="3"        sub="2 awaiting your action"     color={C.blue}              />
              <StatCard icon="✅" label="Completed"       value="17"       sub="Since Jan 2025"             color={C.green}  trend={8}  />
              <StatCard icon="⭐" label="Trust Score"     value="4.9 / 5"  sub="Based on 17 transactions"  color={C.amber}             />
            </div>

            {/* ── Active Escrows ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Active Escrows</h2>
                  <p style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>3 contracts currently in progress</p>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => go("/escrow")}>View All →</Btn>
              </div>
              <EscrowTable />
            </div>

            {/* ── Bottom row: Activity + Quick Tips ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, flexWrap: "wrap" }}>
              <ActivityFeed />
              <QuickTips />
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

// ── Quick Tips / CTA card ─────────────────────────────────────────────────────
function QuickTips() {
  return (
    <div style={{
      background: `linear-gradient(145deg,rgba(255,107,53,.1),rgba(255,107,53,.04))`,
      border: `1px solid rgba(255,107,53,.25)`,
      borderRadius: 18, padding: 22,
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 24 }}>🐧</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 5, letterSpacing: "-.02em" }}>Ready for your next project?</div>
          <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6 }}>Set milestones, lock funds, and get blockchain receipts — in under 2 minutes.</div>
        </div>
      </div>

      <Btn variant="coral" size="md" onClick={() => go("/create-escrow")} sx={{ width: "100%", justifyContent: "center" }}>
        🔒 Start a New Escrow
      </Btn>

      <div style={{ borderTop: `1px solid rgba(255,107,53,.18)`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { icon: "⚡", text: "3–5 second Stellar settlements" },
          { icon: "💎", text: "2.5% flat — no hidden fees" },
          { icon: "⛓️", text: "Immutable on-chain receipts" },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15 }}>{icon}</span>
            <span style={{ fontSize: 12.5, color: C.textSub }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
