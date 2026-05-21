// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { shortenAddress } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Client Dashboard
   Dark #02353C · Coral #2EAF7D · Inter font · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:        "#02353C",
  surface:     "#032F36",
  elevated:    "#054048",
  card:        "#065060",
  border:      "#0A5560",
  borderLight: "#1A7080",
  coral:       "#2EAF7D",
  coralDark:   "#228A62",
  coralGlow:   "rgba(46,175,125,0.22)",
  blue:        "#3FD0C9",
  blueGlow:    "rgba(63,208,201,0.2)",
  green:       "#449342",
  amber:       "#F59E0B",
  purple:      "#8B5CF6",
  red:         "#EF4444",
  text:        "#C1F6ED",
  textSub:     "#7ECFC6",
  textMuted:   "#3A8A82",
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
    "In Progress":        { bg: "rgba(63,208,201,.14)",  border: "rgba(63,208,201,.35)",  text: "#7ECFC6", dot: "#3FD0C9" },
    "Awaiting Delivery":  { bg: "rgba(245,158,11,.14)",  border: "rgba(245,158,11,.35)",  text: "#FCD34D", dot: "#F59E0B" },
    "Delivered · Review": { bg: "rgba(46,175,125,.14)",  border: "rgba(46,175,125,.35)",  text: "#FF8C5A", dot: "#2EAF7D" },
    "Completed":          { bg: "rgba(68,147,66,.14)",  border: "rgba(68,147,66,.35)",  text: "#7ECFC6", dot: "#449342" },
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
      background: h ? `linear-gradient(135deg,#3FD0C9,${C.coralDark})` : `linear-gradient(135deg,${C.coral},${C.coralDark})`,
      color: "#fff", border: "none",
      boxShadow: h ? "0 10px 36px rgba(46,175,125,.5),0 0 0 1px rgba(46,175,125,.35)"
                   : "0 5px 20px rgba(46,175,125,.32),0 0 0 1px rgba(46,175,125,.22)",
    },
    ghost: {
      background: h ? "rgba(46,175,125,.09)" : "transparent",
      color: h ? C.coral : C.textSub,
      border: `1px solid ${h ? "rgba(46,175,125,.3)" : C.border}`,
      boxShadow: "none",
    },
    subtle: {
      background: h ? C.card : C.elevated,
      color: C.text, border: `1px solid ${h ? C.borderLight : C.border}`,
      boxShadow: h ? "0 4px 16px rgba(0,0,0,.35)" : "none",
    },
    blue: {
      background: h ? "linear-gradient(135deg,#3FD0C9,#3FD0C9)" : "linear-gradient(135deg,#3FD0C9,#2AADA7)",
      color: "#fff", border: "none",
      boxShadow: h ? "0 8px 28px rgba(63,208,201,.45)" : "0 4px 16px rgba(63,208,201,.28)",
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
const getNavItems = (escrowCount = 0, messageCount = 0) => [
  { id: "dashboard",  icon: "⊞",  label: "Dashboard" },
  { id: "projects",   icon: "📁", label: "Projects / Escrows", badge: escrowCount > 0 ? escrowCount : undefined },
  { id: "messages",   icon: "💬", label: "Messages",           badge: messageCount > 0 ? messageCount : undefined },
  { id: "reputation", icon: "⭐", label: "Reputation" },
  { id: "disputes",   icon: "⚖️", label: "Disputes" },
  { id: "settings",   icon: "⚙️", label: "Settings" },
];

function Sidebar({ collapsed, onToggle, active, setActive, wallet, onConnect, onDisconnect, escrowCount = 0, messageCount = 0, isMobile, onClose }) {
  const W = collapsed ? 64 : 228;
  const navItems = getNavItems(escrowCount, messageCount);
  return (
    <aside className={isMobile ? "mobile-sidebar-inner" : "desktop-sidebar"} style={{
      width: isMobile ? "240px" : W,
      minWidth: isMobile ? "240px" : W,
      maxWidth: isMobile ? "240px" : W,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      transition: isMobile ? "none" : "width .22s cubic-bezier(.4,0,.2,1), min-width .22s, max-width .22s",
      overflow: "hidden", flexShrink: 0, position: "relative",
      zIndex: 20,
      height: "100%",
    }}>
      {/* Logo row */}
      <div style={{
        height: 62, display: "flex", alignItems: "center",
        padding: (collapsed && !isMobile) ? "0 0 0 16px" : "0 16px",
        borderBottom: `1px solid ${C.border}`,
        gap: 10, flexShrink: 0,
      }}>
        <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain",flexShrink:0 }} />
        {(!collapsed || isMobile) && (
          <span style={{
            fontSize: 17, fontWeight: 800, letterSpacing: "-.03em",
            background: "linear-gradient(135deg,#3FD0C9,#C1F6ED)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            whiteSpace: "nowrap",
          }}>Pangolin</span>
        )}
        <button onClick={isMobile ? onClose : onToggle} style={{
          marginLeft: "auto", background: "transparent", border: "none",
          color: C.textMuted, cursor: "pointer", fontSize: 16, flexShrink: 0,
          padding: "4px 6px", borderRadius: 8,
          transition: "color .15s",
        }}>
          {isMobile ? "✕" : collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ id, icon, label, badge }) => (
          <SidebarItem key={id} icon={icon} label={label} badge={badge}
            active={active === id} collapsed={isMobile ? false : collapsed}
            onClick={() => { setActive(id); if (isMobile && onClose) onClose(); }} />
        ))}
      </nav>

      {/* Wallet */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        {(collapsed && !isMobile) ? (
          <div style={{
            width: 40, height: 40, borderRadius: 12, margin: "0 auto",
            background: `linear-gradient(135deg,${C.coral}22,${C.coral}0A)`,
            border: `1px solid ${C.coral}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, cursor: "pointer",
          }}>🔗</div>
        ) : wallet?.status === "connected" && wallet.address ? (
          <div style={{
            background: `linear-gradient(135deg,rgba(46,175,125,.1),rgba(46,175,125,.04))`,
            border: `1px solid rgba(46,175,125,.28)`,
            borderRadius: 13, padding: "11px 14px",
          }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 5 }}>Connected Wallet</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{shortenAddress(wallet.address)}</span>
            </div>
            <Btn variant="coral" size="sm" onClick={() => { onDisconnect(); if (isMobile && onClose) onClose(); }} sx={{ width: "100%", justifyContent: "center" }}>Disconnect</Btn>
          </div>
        ) : (
          <div style={{
            background: `linear-gradient(135deg,rgba(46,175,125,.06),rgba(46,175,125,.02))`,
            border: `1px solid rgba(46,175,125,.18)`,
            borderRadius: 13, padding: "11px 14px",
          }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 8 }}>Wallet</div>
            <Btn variant="coral" size="sm" onClick={() => { onConnect(); if (isMobile && onClose) onClose(); }} sx={{ width: "100%", justifyContent: "center" }}>🔗 Connect Freighter</Btn>
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
      background: active ? `linear-gradient(135deg,rgba(46,175,125,.16),rgba(46,175,125,.06))`
                         : h ? "rgba(255,255,255,.04)" : "transparent",
      boxShadow: active ? `inset 0 0 0 1px rgba(46,175,125,.25)` : "none",
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
              boxShadow: "0 2px 8px rgba(46,175,125,.4)",
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
            background: trend > 0 ? "rgba(68,147,66,.12)" : "rgba(239,68,68,.12)",
            border: `1px solid ${trend > 0 ? "rgba(68,147,66,.3)" : "rgba(239,68,68,.3)"}`,
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
function formatWallet(wallet) {
  if (!wallet) return "Invite pending";
  if (wallet.length <= 12) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function statusLabel(status) {
  const map = {
    created: "Awaiting Delivery",
    funded: "In Progress",
    active: "In Progress",
    delivered: "Delivered · Review",
    approved: "Completed",
    completed: "Completed",
    disputed: "Disputed",
  };
  return map[status] || "In Progress";
}

function toDisplayEscrow(escrow) {
  const wallet = escrow.freelancer_wallet || "";
  const amount = Number(escrow.amount_usdc || 0);
  const status = statusLabel(escrow.status);

  return {
    id: escrow.id,
    project: escrow.title || "Untitled Escrow",
    freelancer: {
      initials: wallet ? wallet.slice(0, 2).toUpperCase() : "IP",
      name: formatWallet(wallet),
      color: "#8B5CF6",
    },
    status,
    amount: `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    milestone: escrow.deadline ? `Due ${escrow.deadline}` : "Single payment",
    action: { label: status === "Delivered · Review" ? "Review" : "View Details", variant: status === "Delivered · Review" ? "coral" : "subtle" },
  };
}

function EscrowTable({ rows, loading, error }) {
  const cols = ["Project", "Freelancer", "Status", "Amount", "Milestone", "Action"];
  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(24,24,32,.97),rgba(18,18,26,.97))",
      border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden",
    }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 780 }}>
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
          {loading ? (
            <TableMessage title="Loading escrows..." message="Reading the latest contracts from Supabase." />
          ) : error ? (
            <TableMessage title="Could not load escrows" message={error} tone="error" />
          ) : rows.length === 0 ? (
            <TableMessage title="No escrows yet" message="Create your first escrow and it will appear here." actionLabel="Create Escrow" />
          ) : (
            rows.map((row, i) => (
              <EscrowRow key={row.id || i} row={row} last={i === rows.length - 1} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TableMessage({ title, message, tone, actionLabel }) {
  return (
    <div style={{ padding: "34px 24px", textAlign: "center", borderTop: `1px solid rgba(36,36,48,.7)` }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: tone === "error" ? "#F87171" : C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6, marginBottom: actionLabel ? 16 : 0 }}>{message}</div>
      {actionLabel && <Btn variant="coral" size="sm" onClick={() => go("/create-escrow")}>{actionLabel}</Btn>}
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
            background: `linear-gradient(90deg,${C.coral},#3FD0C9)`,
            boxShadow: `0 0 8px ${C.coralGlow}`,
            width: row.status === "Completed" ? "100%"
                 : row.status === "Delivered · Review" ? "95%"
                 : row.status === "In Progress" ? "66%" : "40%",
            transition: "width .3s",
          }} />
        </div>
      </div>
      {/* Action */}
      <div><Btn variant={row.action.variant} size="sm" onClick={() => go(row.id ? `/escrow?id=${row.id}` : "/escrow")}>{row.action.label}</Btn></div>
    </div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
function ActivityFeed({ activities = [], loading = false }) {
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
        {loading ? (
          <div style={{ padding: "20px 22px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Loading activities...</div>
        ) : activities.length === 0 ? (
          <div style={{ padding: "20px 22px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>No recent activity yet</div>
        ) : (
          activities.map((a, i) => <ActivityItem key={i} {...a} last={i === activities.length - 1} />)
        )}
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
  const { supabase, user } = useAuth();
  const { wallet, connectWallet, disconnectWallet } = useFreighterWallet();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [escrows, setEscrows] = useState([]);
  const [loadingEscrows, setLoadingEscrows] = useState(true);
  const [escrowError, setEscrowError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [trustScore, setTrustScore] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadUserProfile() {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("display_name,wallet_address")
        .eq("id", user.id)
        .single();

      if (mounted && data) {
        setUserProfile(data);
      }
    }

    loadUserProfile();

    return () => { mounted = false; };
  }, [user?.id, supabase]);

  useEffect(() => {
    let mounted = true;

    async function loadEscrows() {
      setLoadingEscrows(true);
      setEscrowError("");

      const { data, error } = await supabase
        .from("escrows")
        .select("id,title,status,amount_usdc,freelancer_wallet,deadline,created_at")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        setEscrowError(error.message);
        setEscrows([]);
      } else {
        setEscrows((data || []).map(toDisplayEscrow));

        const completed = (data || []).filter(e => e.status === "completed").length;
        setCompletedCount(completed);
      }

      setLoadingEscrows(false);
    }

    loadEscrows();

    return () => { mounted = false; };
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function loadActivities() {
      setLoadingActivities(true);

      const { data } = await supabase
        .from("escrow_events")
        .select("id,event_type,message,created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (mounted && data) {
        const formattedActivities = data.map(e => ({
          icon: e.event_type === "funded" ? "🔒" : e.event_type === "delivered" ? "📦" : "💬",
          color: e.event_type === "funded" ? C.blue : e.event_type === "delivered" ? C.coral : C.green,
          title: e.event_type === "funded" ? "Escrow Funded" : e.event_type === "delivered" ? "Delivery Submitted" : e.event_type,
          desc: e.message || "Activity recorded",
          time: new Date(e.created_at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        }));
        setActivities(formattedActivities);
      }

      setLoadingActivities(false);
    }

    loadActivities();

    return () => { mounted = false; };
  }, [supabase]);

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

        /* Mobile Responsive Navigation Drawer & Layout CSS */
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-sidebar {
            position: fixed !important;
            top: 0;
            left: -240px;
            width: 240px !important;
            min-width: 240px !important;
            max-width: 240px !important;
            height: 100vh !important;
            z-index: 200 !important;
            transition: left .25s ease-in-out !important;
            display: flex !important;
          }
          .mobile-sidebar.open {
            left: 0 !important;
          }
          .mobile-sidebar-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 199;
          }
          .mobile-header {
            display: flex !important;
            height: 60px;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            background: #032F36;
            border-bottom: 1px solid #0A5560;
            position: sticky;
            top: 0;
            z-index: 90;
          }
          .dashboard-main-container {
            flex-direction: column !important;
            overflow: auto !important;
            height: auto !important;
          }
          .dashboard-inner-wrapper {
            padding: 20px 16px 60px !important;
          }
          .dashboard-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-sidebar {
            display: none !important;
          }
          .mobile-sidebar-backdrop {
            display: none !important;
          }
          .mobile-header {
            display: none !important;
          }
          .dashboard-bottom-grid {
            grid-template-columns: 1fr 320px;
          }
        }
      `}</style>

      {/* Mobile Top Header */}
      <header className="mobile-header" style={{ display: "none" }}>
        <button onClick={() => setMobileMenuOpen(true)} style={{ background: "transparent", border: "none", color: C.text, fontSize: 24, cursor: "pointer" }}>
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain" }} />
          <span style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#3FD0C9,#C1F6ED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pangolin</span>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.coral}22,${C.coral}0A)`, border: `1.5px solid ${C.coral}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 750, color: C.coral }}>
          {userProfile?.display_name?.substring(0, 2).toUpperCase() || "U"}
        </div>
      </header>

      {/* Mobile Sidebar Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileMenuOpen(false)}
          active={active}
          setActive={setActive}
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          escrowCount={escrows.length}
          messageCount={0}
          isMobile={true}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="dashboard-main-container" style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.base }}>

        {/* ── Sidebar ── */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(p => !p)}
          active={active}
          setActive={setActive}
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          escrowCount={escrows.length}
          messageCount={0}
          isMobile={false}
        />

        {/* ── Main ── */}
        <main style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          background: `radial-gradient(ellipse 60% 40% at 70% 10%, rgba(46,175,125,.05) 0%, transparent 60%),
                       radial-gradient(ellipse 50% 40% at 20% 80%, rgba(63,208,201,.04) 0%, transparent 60%),
                       ${C.base}`,
          animation: "slide-in .35s ease",
        }}>
          {/* Inner padding wrapper */}
          <div className="dashboard-inner-wrapper" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 60px" }}>

            {/* ── Top Bar ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
              {/* Greeting */}
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>
                  Client Dashboard
                </div>
                <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text }}>
                  Welcome back, {userProfile?.display_name || "User"} 👋
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
              <StatCard icon="💰" label="Total Escrowed" value={loadingEscrows ? "..." : `$${escrows.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[$,]/g, "")), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}  sub="Synced from Supabase"   color={C.coral}  trend={12} />
              <StatCard icon="📁" label="Active Projects" value={loadingEscrows ? "..." : escrows.length}        sub="Contracts in database"     color={C.blue}              />
              <StatCard icon="✅" label="Completed"       value={completedCount}       sub="Since Jan 2025"             color={C.green}  trend={8}  />
              <StatCard icon="⭐" label="Trust Score"     value={trustScore || "—"}  sub="Based on transactions"  color={C.amber}             />
            </div>

            {/* ── Active Escrows ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Active Escrows</h2>
                  <p style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>{loadingEscrows ? "Loading contracts..." : `${escrows.length} contracts currently in Supabase`}</p>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => go("/escrow")}>View All →</Btn>
              </div>
              <EscrowTable rows={escrows} loading={loadingEscrows} error={escrowError} />
            </div>

            {/* ── Bottom row: Activity + Quick Tips ── */}
            <div className="dashboard-bottom-grid" style={{ display: "grid", gap: 20 }}>
              <ActivityFeed activities={activities} loading={loadingActivities} />
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
      background: `linear-gradient(145deg,rgba(46,175,125,.1),rgba(46,175,125,.04))`,
      border: `1px solid rgba(46,175,125,.25)`,
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

      <div style={{ borderTop: `1px solid rgba(46,175,125,.18)`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
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
