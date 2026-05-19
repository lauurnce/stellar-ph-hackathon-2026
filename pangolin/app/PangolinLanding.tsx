// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Landing / Homepage
   Dark #0D0D0F · Coral #FF6B35 · Trust-Blue #3B82F6 · Inter font
   All inline styles — fully self-contained, no Tailwind config required.
───────────────────────────────────────────────────────────────────────────── */

// ── Shared tokens ─────────────────────────────────────────────────────────────
const C = {
  base: "#0D0D0F",
  surface: "#141418",
  elevated: "#1C1C24",
  border: "#252530",
  borderHover: "#3A3A4A",
  coral: "#FF6B35",
  coralDark: "#E8581F",
  coralGlow: "rgba(255,107,53,0.25)",
  blue: "#3B82F6",
  blueGlow: "rgba(59,130,246,0.2)",
  green: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  text: "#F5F5F7",
  textSub: "#9898A8",
  textMuted: "#52525E",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

function go(path) {
  window.location.href = path;
}

// ── Re-usable helpers ─────────────────────────────────────────────────────────
function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function Logo({ size = "md" }) {
  const s = size === "sm" ? { wrap: "10px 16px", text: "15px", icon: "18px", r: "12px" }
                           : { wrap: "12px 20px", text: "17px", icon: "22px", r: "14px" };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      background: "linear-gradient(135deg,#1C1C24,#141418)",
      border: `1px solid ${C.border}`,
      borderRadius: s.r, padding: s.wrap,
      boxShadow: `0 0 0 1px rgba(255,107,53,.08), inset 0 1px 0 rgba(255,255,255,.04)`,
    }}>
      <span style={{ fontSize: s.icon }}>🐧</span>
      <span style={{
        fontSize: s.text, fontWeight: 800, letterSpacing: "-.03em",
        background: "linear-gradient(135deg,#FF6B35,#FF9A6C)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Pangolin</span>
    </div>
  );
}

function Btn({ variant = "coral", size = "md", children, onClick, style = {} }) {
  const [h, hov] = useHover();
  const base = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    fontFamily: C.font, fontWeight: 700, cursor: "pointer",
    border: "none", transition: "all .18s cubic-bezier(.4,0,.2,1)",
    transform: h ? "translateY(-1px)" : "none",
    whiteSpace: "nowrap", letterSpacing: "-.01em",
  };
  const sizes = {
    sm:  { padding: "9px 18px",  fontSize: "13px", borderRadius: "100px" },
    md:  { padding: "13px 26px", fontSize: "14px", borderRadius: "100px" },
    lg:  { padding: "16px 36px", fontSize: "16px", borderRadius: "100px" },
    xl:  { padding: "18px 44px", fontSize: "17px", borderRadius: "100px" },
  };
  const variants = {
    coral: {
      background: h ? `linear-gradient(135deg,#FF7A44,${C.coralDark})` : `linear-gradient(135deg,${C.coral},${C.coralDark})`,
      color: "#fff",
      boxShadow: h ? `0 12px 40px rgba(255,107,53,.55), 0 0 0 1px rgba(255,107,53,.4)` : `0 6px 24px rgba(255,107,53,.35), 0 0 0 1px rgba(255,107,53,.25)`,
    },
    ghost: {
      background: h ? "rgba(255,107,53,.08)" : "transparent",
      color: h ? C.coral : C.textSub,
      border: `1px solid ${h ? "rgba(255,107,53,.35)" : C.border}`,
      boxShadow: "none",
    },
    secondary: {
      background: h ? C.elevated : C.surface,
      color: C.text,
      border: `1px solid ${h ? C.borderHover : C.border}`,
      boxShadow: h ? "0 8px 24px rgba(0,0,0,.4)" : "0 2px 8px rgba(0,0,0,.2)",
    },
    blue: {
      background: h ? "linear-gradient(135deg,#5A9BFF,#3B82F6)" : "linear-gradient(135deg,#3B82F6,#2563EB)",
      color: "#fff",
      boxShadow: h ? `0 12px 40px rgba(59,130,246,.5)` : `0 6px 24px rgba(59,130,246,.3)`,
    },
  };
  return (
    <button onClick={onClick} {...hov}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function GlassCard({ children, glow = C.coral, style = {} }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      background: "linear-gradient(135deg,rgba(28,28,36,.92),rgba(20,20,24,.96))",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      border: `1px solid ${h ? glow + "50" : C.border}`,
      borderRadius: "18px",
      boxShadow: h ? `0 0 0 1px ${glow}18, 0 24px 64px rgba(0,0,0,.55), 0 0 48px ${glow}12`
                   : "0 8px 32px rgba(0,0,0,.4)",
      transform: h ? "translateY(-3px)" : "none",
      transition: "all .25s cubic-bezier(.4,0,.2,1)",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
        background: `linear-gradient(90deg,transparent,${glow}35,transparent)`,
        opacity: h ? 1 : 0, transition: "opacity .25s",
      }} />
      {children}
    </div>
  );
}

function StatusDot({ color }) {
  return (
    <span style={{
      display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
      background: color, boxShadow: `0 0 8px ${color}`,
      animation: "pulse-dot 2s ease-in-out infinite",
    }} />
  );
}

function Badge({ children, color = C.coral }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700,
      letterSpacing: ".06em", textTransform: "uppercase",
      background: `${color}18`, border: `1px solid ${color}35`, color,
    }}>{children}</span>
  );
}

// ── Pangolin SVG mascot silhouette ────────────────────────────────────────────
function MascotBox({ style = {} }) {
  return (
    <div style={{
      width: "180px", height: "180px",
      background: "linear-gradient(135deg,rgba(28,28,36,.9),rgba(20,20,24,.95))",
      border: "1px dashed rgba(255,107,53,.25)",
      borderRadius: "24px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 60% 60%,rgba(255,107,53,.08) 0%,transparent 70%)",
      }} />
      <svg width="100" height="76" viewBox="0 0 100 76" fill="none">
        {/* Body */}
        <ellipse cx="48" cy="46" rx="30" ry="19" fill="rgba(255,107,53,.2)" />
        {/* Scales */}
        {[[20,40],[27,34],[34,30],[41,28],[48,28],[27,46],[35,42],[43,40],[51,40]].map(([x,y],i)=>(
          <path key={i} d={`M${x} ${y} Q${x+4} ${y-7} ${x+8} ${y}`} stroke="#FF6B35" strokeWidth="1.4" fill="none" opacity=".55"/>
        ))}
        {/* Head */}
        <ellipse cx="74" cy="34" rx="14" ry="11" fill="rgba(255,107,53,.3)" />
        {/* Snout */}
        <path d="M84 34 Q93 32 96 34 Q93 37 84 36Z" fill="rgba(255,107,53,.5)" />
        {/* Eye */}
        <circle cx="76" cy="30" r="2.5" fill="#FF6B35" opacity=".85"/>
        <circle cx="77" cy="29.2" r="0.8" fill="#fff" opacity=".6"/>
        {/* Ear */}
        <path d="M64 26 Q66 18 72 23" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity=".45"/>
        {/* Tail */}
        <path d="M18 48 Q6 53 3 43 Q5 32 16 38" stroke="#FF6B35" strokeWidth="2.2" fill="none" opacity=".45"/>
        {/* Legs */}
        <path d="M34 62 Q32 68 30 72" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
        <path d="M46 65 Q45 70 44 74" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
        <path d="M60 62 Q60 68 60 72" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
      </svg>
      <span style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500, position: "relative" }}>
        Mascot Area
      </span>
    </div>
  );
}

// ── Hero dashboard mockup ────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <GlassCard glow="#3B82F6" style={{ padding: "24px", minWidth: "320px", maxWidth: "400px", animation: "float 5s ease-in-out infinite" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px" }}>Active Escrow</div>
          <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-.04em", background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₱14,500</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.3)", borderRadius: "100px", padding: "5px 12px" }}>
          <StatusDot color={C.green} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>In Progress</span>
        </div>
      </div>

      {/* Parties */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        {[{ label: "Client", init: "JM", color: C.blue },{ label: "Freelancer", init: "AK", color: C.coral }].map(({ label, init, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color }}>{init}</div>
            <div>
              <div style={{ fontSize: "11px", color: C.textMuted }}>{label}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{init === "JM" ? "Juan M." : "Ana K."}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: "20px", color: C.textMuted }}>⇄</div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: C.textMuted }}>Milestone Progress</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: C.coral }}>2 / 3</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "100px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "66%", background: "linear-gradient(90deg,#FF6B35,#FF9A6C)", borderRadius: "100px", boxShadow: "0 0 12px rgba(255,107,53,.5)" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {["Logo Design ✓", "UI Kit ✓", "Handoff"].map((m, i) => (
            <div key={m} style={{
              padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600,
              background: i < 2 ? "rgba(16,185,129,.12)" : "rgba(255,255,255,.04)",
              border: `1px solid ${i < 2 ? "rgba(16,185,129,.3)" : C.border}`,
              color: i < 2 ? C.green : C.textMuted,
            }}>{m}</div>
          ))}
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: "flex", gap: "10px" }}>
        <Btn variant="coral" size="sm" style={{ flex: 1, justifyContent: "center" }}>Release ₱4,833</Btn>
        <Btn variant="ghost" size="sm" style={{ justifyContent: "center" }}>Dispute</Btn>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
          <span style={{ fontSize: "11px", color: C.textMuted }}>Secured on Stellar</span>
        </div>
        <span style={{ fontSize: "11px", color: C.textMuted }}>~3s settlement</span>
      </div>
    </GlassCard>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["How It Works", "For Freelancers", "For Clients"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(13,13,15,.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all .3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <Logo />

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
          {links.map(l => <NavLink key={l}>{l}</NavLink>)}
        </div>

        <Btn variant="coral" size="md" onClick={() => go("/dashboard")}>🔗 Connect Wallet</Btn>
      </div>
    </nav>
  );
}

function NavLink({ children }) {
  const [h, hov] = useHover();
  return (
    <a href="#" {...hov} style={{
      padding: "8px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: 500,
      color: h ? C.text : C.textSub,
      background: h ? "rgba(255,255,255,.05)" : "transparent",
      textDecoration: "none", transition: "all .15s ease",
    }}>{children}</a>
  );
}

function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse 80% 60% at 10% 20%, rgba(255,107,53,.07) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 50% at 80% 70%, rgba(59,130,246,.06) 0%, transparent 60%),
                   ${C.base}`,
      display: "flex", alignItems: "center",
      paddingTop: "100px", paddingBottom: "80px",
      overflow: "hidden",
    }}>
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: .025,
        backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "48px", flexWrap: "wrap" }}>

          {/* Left: copy */}
          <div style={{ flex: "1 1 440px", maxWidth: "560px" }}>
            <div style={{ marginBottom: "20px" }}>
              <Badge color={C.coral}>🚀 Built on Stellar · 2.5% flat fee</Badge>
            </div>

            <h1 style={{
              fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 900,
              letterSpacing: "-.05em", lineHeight: 1.05,
              color: C.text, marginBottom: "24px",
            }}>
              Safe Payments.{" "}
              <span style={{
                background: "linear-gradient(135deg,#FF6B35 20%,#FF9A6C 60%,#FFB088 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Stronger Trust.</span>
              {" "}Better Work.
            </h1>

            <p style={{
              fontSize: "17px", lineHeight: 1.75, color: C.textSub,
              marginBottom: "36px", maxWidth: "480px",
            }}>
              Pangolin is a Web3 escrow platform built for Filipino freelancers and their clients.
              Every peso protected, every milestone tracked, every dispute resolved — on-chain, in seconds.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "48px" }}>
              <Btn variant="coral" size="lg" onClick={() => go("/create-escrow")}>Get Started — It's Free</Btn>
              <Btn variant="ghost" size="lg" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>▶ Browse How It Works</Btn>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex" }}>
                {["AK","JM","MR","PB","LO"].map((init, i) => (
                  <div key={init} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `linear-gradient(135deg,${[C.coral,C.blue,C.purple,C.green,C.amber][i]}30,${[C.coral,C.blue,C.purple,C.green,C.amber][i]}10)`,
                    border: `2px solid ${[C.coral,C.blue,C.purple,C.green,C.amber][i]}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: [C.coral,C.blue,C.purple,C.green,C.amber][i],
                    marginLeft: i > 0 ? "-8px" : 0, zIndex: 5 - i,
                  }}>{init}</div>
                ))}
              </div>
              <div style={{ fontSize: "13px", color: C.textSub }}>
                <span style={{ fontWeight: 700, color: C.text }}>1,240+ freelancers</span> already protected
              </div>
            </div>
          </div>

          {/* Right: mockup + mascot */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "20px", position: "relative" }}>
            <DashboardMockup />
            <div style={{ alignSelf: "flex-end" }}>
              <MascotBox />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { icon: "🛡️", value: "₱0", label: "Lost to Scams" },
    { icon: "⚡", value: "3–5s", label: "Settlement Speed" },
    { icon: "💸", value: "2.5%", label: "Flat Fee Only" },
    { icon: "⛓️", value: "Stellar", label: "Blockchain-Powered" },
  ];
  return (
    <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap" }}>
        {stats.map(({ icon, value, label }, i) => (
          <div key={label} style={{
            flex: "1 1 180px", display: "flex", alignItems: "center", gap: "14px",
            padding: "28px 32px",
            borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ fontSize: "26px" }}>{icon}</span>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-.03em", color: C.text }}>{value}</div>
              <div style={{ fontSize: "12px", color: C.textMuted, fontWeight: 500 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "📝", num: "01", title: "Create a Job", desc: "Describe your project, set milestones, invite your counterpart. Smart contract is generated automatically." },
    { icon: "💰", num: "02", title: "Fund Escrow", desc: "Client deposits payment in XLM or USDC. Funds are locked on Stellar — visible to both parties, touchable by neither." },
    { icon: "🚀", num: "03", title: "Deliver Work", desc: "Freelancer completes milestones. Files, proofs, and deliverables uploaded directly to the contract thread." },
    { icon: "✅", num: "04", title: "Release & Repeat", desc: "Client approves and releases payment instantly. Funds hit the freelancer's GCash or wallet in seconds — not days." },
  ];

  return (
    <section id="how-it-works" style={{ padding: "100px 24px", background: C.base }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color={C.blue}>How It Works</Badge>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginTop: "16px", marginBottom: "16px" }}>
            Four steps. Zero stress.
          </h2>
          <p style={{ fontSize: "16px", color: C.textSub, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            From contract to cash — the whole flow lives on-chain so nobody can ghost, dispute unfairly, or delay payment.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0", position: "relative", flexWrap: "wrap" }}>
          {/* Connector line (desktop) */}
          <div style={{
            position: "absolute", top: "52px", left: "12.5%", right: "12.5%", height: "1px",
            background: `linear-gradient(90deg,transparent,${C.coral}40,${C.coral}60,${C.coral}40,transparent)`,
          }} />

          {steps.map(({ icon, num, title, desc }, i) => (
            <div key={num} style={{ flex: "1 1 220px", padding: "0 16px", textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-flex", marginBottom: "24px" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "20px",
                  background: `linear-gradient(135deg,rgba(255,107,53,.15),rgba(255,107,53,.05))`,
                  border: `1px solid rgba(255,107,53,.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px",
                  boxShadow: "0 8px 24px rgba(255,107,53,.15)",
                }}>{icon}</div>
                <div style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.coral},${C.coralDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 800, color: "#fff",
                  boxShadow: "0 4px 12px rgba(255,107,53,.4)",
                }}>{i + 1}</div>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: C.text, marginBottom: "10px", letterSpacing: "-.02em" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: C.textSub, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: "🔒", title: "Minimum Guaranteed Payment", desc: "Set a non-negotiable floor. Clients can't walk away with your work without paying at least the agreed minimum.", color: C.coral },
    { icon: "🎯", title: "Milestone Escrow", desc: "Break projects into phases. Funds release per milestone — so freelancers get paid as they go, not when clients feel like it.", color: C.blue },
    { icon: "💎", title: "Ultra-Low Fees", desc: "Flat 2.5% per transaction. No monthly subscription, no hidden charges, no percentage creep. Ever.", color: C.green },
    { icon: "📲", title: "GCash Release", desc: "Receive payments straight to your GCash wallet — no crypto knowledge required. Web3 power, Web2 simplicity.", color: C.amber },
    { icon: "⛓️", title: "Blockchain Proof", desc: "Every transaction, milestone, and release is recorded immutably on Stellar. Your receipt is the blockchain.", color: C.purple },
    { icon: "⚖️", title: "Dispute Protection", desc: "Neutral arbitration baked in. If things go sideways, our system — not vibes — decides who's right.", color: "#F43F5E" },
  ];

  return (
    <section style={{ padding: "100px 24px", background: `linear-gradient(180deg,${C.surface} 0%,${C.base} 100%)` }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color={C.coral}>Features</Badge>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginTop: "16px", marginBottom: "16px" }}>
            Built for the way you actually work.
          </h2>
          <p style={{ fontSize: "16px", color: C.textSub, maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
            Every feature exists to protect your money, your time, and your professional reputation.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
          {features.map(({ icon, title, desc, color }) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} color={color} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      background: h ? "linear-gradient(135deg,rgba(28,28,36,.98),rgba(22,22,30,.98))" : "linear-gradient(135deg,rgba(20,20,24,.95),rgba(16,16,20,.95))",
      border: `1px solid ${h ? color + "45" : C.border}`,
      borderRadius: "18px", padding: "28px",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
      transform: h ? "translateY(-4px)" : "none",
      boxShadow: h ? `0 16px 48px rgba(0,0,0,.5), 0 0 32px ${color}12` : "0 4px 16px rgba(0,0,0,.3)",
      cursor: "default", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
        background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
        opacity: h ? 1 : 0, transition: "opacity .22s",
      }} />
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", marginBottom: "18px",
        boxShadow: h ? `0 4px 16px ${color}25` : "none", transition: "box-shadow .22s",
      }}>{icon}</div>
      <h3 style={{ fontSize: "16px", fontWeight: 800, color: C.text, marginBottom: "10px", letterSpacing: "-.02em" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: C.textSub, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { feature: "Transaction Fee", pangolin: "2.5% flat", vgen: "8–20%", paypal: "3.49% + ₱15" },
    { feature: "Settlement Speed", pangolin: "3–5 seconds", vgen: "7–14 days", paypal: "1–5 business days" },
    { feature: "Escrow Protection", pangolin: "✅ Native, on-chain", vgen: "Partial", paypal: "❌ None" },
    { feature: "Non-Marketplace Use", pangolin: "✅ Any freelancer", vgen: "❌ Platform only", paypal: "✅ Yes" },
    { feature: "Dispute Resolution", pangolin: "✅ Smart contract + Arbitration", vgen: "Limited", paypal: "Limited" },
    { feature: "GCash Payout", pangolin: "✅ Yes", vgen: "❌ No", paypal: "❌ No" },
    { feature: "Blockchain Receipts", pangolin: "✅ Stellar network", vgen: "❌ No", paypal: "❌ No" },
  ];

  const cols = ["Feature", "🐧 Pangolin", "Vgen", "PayPal"];

  return (
    <section style={{ padding: "100px 24px", background: C.base }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color={C.blue}>Comparison</Badge>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginTop: "16px", marginBottom: "16px" }}>
            We did the math. You win.
          </h2>
          <p style={{ fontSize: "16px", color: C.textSub, maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
            No other platform gives Filipino freelancers this combination of speed, safety, and savings.
          </p>
        </div>

        <GlassCard glow={C.coral} style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {cols.map((c, i) => (
                    <th key={c} style={{
                      padding: "18px 24px", textAlign: i === 0 ? "left" : "center",
                      fontSize: "13px", fontWeight: 700, letterSpacing: ".02em",
                      color: i === 1 ? C.coral : C.textSub,
                      background: i === 1 ? "rgba(255,107,53,.05)" : "transparent",
                      borderRight: i < cols.length - 1 ? `1px solid ${C.border}` : "none",
                    }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ feature, pangolin, vgen, paypal }, ri) => (
                  <tr key={feature} style={{
                    borderBottom: ri < rows.length - 1 ? `1px solid rgba(42,42,53,.5)` : "none",
                    transition: "background .15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.015)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: C.textSub, borderRight: `1px solid ${C.border}` }}>{feature}</td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: C.coral, textAlign: "center", background: "rgba(255,107,53,.04)", borderRight: `1px solid ${C.border}` }}>{pangolin}</td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: C.textMuted, textAlign: "center", borderRight: `1px solid ${C.border}` }}>{vgen}</td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: C.textMuted, textAlign: "center" }}>{paypal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{
      padding: "100px 24px",
      background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,53,.09) 0%, transparent 70%), ${C.surface}`,
      textAlign: "center",
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>🐧</div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 900, letterSpacing: "-.05em", color: C.text, marginBottom: "18px", lineHeight: 1.1 }}>
          Your next project,{" "}
          <span style={{ background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            fully protected.
          </span>
        </h2>
        <p style={{ fontSize: "17px", color: C.textSub, lineHeight: 1.7, marginBottom: "36px" }}>
          Join 1,240+ Filipino freelancers who trust Pangolin to secure their income, protect their work, and get paid on time — every time.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="coral" size="xl" onClick={() => go("/dashboard")}>🔗 Connect Wallet & Start</Btn>
          <Btn variant="secondary" size="xl" onClick={() => go("/freelancer")}>Freelancer View</Btn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    Product: ["How It Works", "For Freelancers", "For Clients", "Pricing"],
    Resources: ["Documentation", "Stellar Network", "Blog", "Status"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer style={{ background: C.base, borderTop: `1px solid ${C.border}`, padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", marginBottom: "64px" }}>
          {/* Brand */}
          <div style={{ flex: "1 1 240px", maxWidth: "280px" }}>
            <div style={{ marginBottom: "16px" }}><Logo /></div>
            <p style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.7, marginBottom: "20px" }}>
              Secure escrow for the Philippine creative economy, powered by Stellar blockchain.
            </p>
            {/* Stellar badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `${C.blue}12`, border: `1px solid ${C.blue}30`,
              borderRadius: "10px", padding: "8px 14px",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.blue, boxShadow: `0 0 8px ${C.blue}` }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: C.blue }}>Built on Stellar</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} style={{ flex: "1 1 140px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: C.textMuted, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "16px" }}>{group}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map(item => <FooterLink key={item}>{item}</FooterLink>)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: "24px", borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "13px", color: C.textMuted }}>© 2025 Pangolin Protocol. All rights reserved.</span>
          <div style={{ display: "flex", gap: "8px" }}>
            {["🐧 PH", "⛓️ Stellar", "🔒 Audited"].map(t => (
              <span key={t} style={{ fontSize: "11px", color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, padding: "4px 10px", borderRadius: "8px", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children }) {
  const [h, hov] = useHover();
  return (
    <a href="#" {...hov} style={{ fontSize: "14px", color: h ? C.text : C.textMuted, textDecoration: "none", transition: "color .15s", fontWeight: h ? 500 : 400 }}>
      {children}
    </a>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function PangolinLanding() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0D0D0F; color: #F5F5F7; -webkit-font-smoothing: antialiased; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .55; transform: scale(.8); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D0D0F; }
        ::-webkit-scrollbar-thumb { background: #252530; border-radius: 3px; }
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>

      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Features />
        <ComparisonTable />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
