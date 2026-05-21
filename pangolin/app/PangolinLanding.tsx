// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Landing / Homepage
   Dark #02353C · Mint #C1F6ED · Teal #3FD0C9 · Green #2EAF7D · Forest #449342
   All inline styles — fully self-contained, no Tailwind config required.
───────────────────────────────────────────────────────────────────────────── */

// ── Shared tokens ─────────────────────────────────────────────────────────────
const C = {
  base: "#02353C",
  surface: "#032F36",
  elevated: "#054048",
  border: "#0A5560",
  borderHover: "#1A7080",
  primary: "#2EAF7D",
  primaryDark: "#228A62",
  primaryGlow: "rgba(46,175,125,0.25)",
  teal: "#3FD0C9",
  tealGlow: "rgba(63,208,201,0.2)",
  green: "#449342",
  mint: "#C1F6ED",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  text: "#C1F6ED",
  textSub: "#7ECFC6",
  textMuted: "#3A8A82",
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
  const s = size === "sm"
    ? { img: 32, text: "18px", gap: "8px" }
    : { img: 50, text: "28px", gap: "10px" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: s.gap }}>
      <img
        src="/pangolin-logo.png"
        alt="Pangolin logo"
        className="logo-img"
        style={{ width: `${s.img}px`, height: `${s.img}px`, objectFit: "contain", flexShrink: 0 }}
      />
      <span
        className="logo-text"
        style={{
          fontSize: s.text, fontWeight: 800, letterSpacing: ".03em",
          background: "linear-gradient(135deg,#3FD0C9,#C1F6ED)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          whiteSpace: "nowrap",
        }}
      >Pangolin</span>
    </div>
  );
}

function Btn({ variant = "primary", size = "md", children, onClick, style = {} }) {
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
    primary: {
      background: h
        ? `linear-gradient(135deg,#3FD0C9,${C.primary})`
        : `linear-gradient(135deg,${C.primary},${C.primaryDark})`,
      color: "#02353C",
      boxShadow: h
        ? `0 12px 40px rgba(46,175,125,.55), 0 0 0 1px rgba(46,175,125,.4)`
        : `0 6px 24px rgba(46,175,125,.35), 0 0 0 1px rgba(46,175,125,.25)`,
    },
    ghost: {
      background: h ? "rgba(63,208,201,.1)" : "transparent",
      color: h ? C.teal : C.textSub,
      border: `1px solid ${h ? "rgba(63,208,201,.4)" : C.border}`,
      boxShadow: "none",
    },
    secondary: {
      background: h ? C.elevated : C.surface,
      color: C.text,
      border: `1px solid ${h ? C.borderHover : C.border}`,
      boxShadow: h ? "0 8px 24px rgba(0,0,0,.4)" : "0 2px 8px rgba(0,0,0,.2)",
    },
    teal: {
      background: h
        ? "linear-gradient(135deg,#5AE0DA,#3FD0C9)"
        : "linear-gradient(135deg,#3FD0C9,#2AADA7)",
      color: "#02353C",
      boxShadow: h ? `0 12px 40px rgba(63,208,201,.5)` : `0 6px 24px rgba(63,208,201,.3)`,
    },
  };
  return (
    <button onClick={onClick} {...hov}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function GlassCard({ children, glow = C.primary, style = {} }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      background: "linear-gradient(135deg,rgba(5,64,72,.92),rgba(3,47,54,.96))",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      border: `1px solid ${h ? glow + "60" : C.border}`,
      borderRadius: "18px",
      boxShadow: h
        ? `0 0 0 1px ${glow}20, 0 24px 64px rgba(0,0,0,.55), 0 0 48px ${glow}15`
        : "0 8px 32px rgba(0,0,0,.4)",
      transform: h ? "translateY(-3px)" : "none",
      transition: "all .25s cubic-bezier(.4,0,.2,1)",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
        background: `linear-gradient(90deg,transparent,${glow}40,transparent)`,
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

function Badge({ children, color = C.primary }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700,
      letterSpacing: ".06em", textTransform: "uppercase",
      background: `${color}20`, border: `1px solid ${color}40`, color,
    }}>{children}</span>
  );
}

// ── Mascot image ──────────────────────────────────────────────────────────────
function MascotBox({ style = {} }) {
  return (
    <div style={{
      width: "min(480px, 90vw)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
      ...style,
    }}>
      {/* Glow ring behind mascot */}
      <div style={{
        position: "absolute", inset: "10%",
        background: "radial-gradient(ellipse at 50% 60%, rgba(63,208,201,.18) 0%, rgba(46,175,125,.1) 40%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(20px)",
      }} />
      <img
        src="/pangolin-mascot.png"
        alt="Pangolin mascot"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 8px 32px rgba(63,208,201,.3))",
          maxWidth: "520px",
        }}
      />
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Disappear (become solid/hidden) once scrolled past the hero (~100vh)
    const fn = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = ["How It Works", "For Freelancers", "For Clients"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        transition: "opacity .4s ease, transform .4s ease",
        opacity: scrolled ? 0 : 1,
        transform: scrolled ? "translateY(-100%)" : "translateY(0)",
        pointerEvents: scrolled ? "none" : "auto",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "80px", padding: "0 32px",
        }}>
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop centre links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {links.map(l => <NavLink key={l}>{l}</NavLink>)}
          </div>

          {/* Desktop CTA */}
          <div className="desktop-nav">
            <Btn variant="primary" size="md" onClick={() => go("/dashboard")}>Connect Wallet</Btn>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              display: "none", background: "none", border: "none",
              cursor: "pointer", padding: "8px", borderRadius: "10px",
              color: "#C1F6ED",
            }}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 198,
            background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="mobile-drawer"
        style={{
          position: "fixed", top: "80px", left: 0, right: 0, zIndex: 199,
          background: "rgba(2,53,60,.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "24px 32px 32px",
          display: "flex", flexDirection: "column", gap: "8px",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity .25s ease, transform .25s ease, visibility .25s",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {links.map(l => (
          <a
            key={l}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: "14px 16px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 600, color: "#C1F6ED",
              textDecoration: "none", transition: "background .15s",
              background: "transparent",
              borderBottom: "1px solid rgba(63,208,201,.1)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(63,208,201,.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {l}
          </a>
        ))}
        <div style={{ marginTop: "12px" }}>
          <Btn
            variant="primary" size="lg"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { setMenuOpen(false); go("/dashboard"); }}
          >
            🔗 Connect Wallet
          </Btn>
        </div>
      </div>
    </>
  );
}

function NavLink({ children, onClick }) {
  const [h, hov] = useHover();
  return (
    <a href="#" onClick={onClick} {...hov} style={{
      padding: "10px 18px", borderRadius: "10px", fontSize: "15px", fontWeight: 500,
      color: h ? "#C1F6ED" : "rgba(193,246,237,.75)",
      background: h ? "rgba(63,208,201,.1)" : "transparent",
      textDecoration: "none", transition: "all .15s ease",
      letterSpacing: "-.01em",
    }}>{children}</a>
  );
}

function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse 80% 60% at 10% 20%, rgba(46,175,125,.1) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 50% at 80% 70%, rgba(63,208,201,.08) 0%, transparent 60%),
                   ${C.base}`,
      display: "flex", alignItems: "center",
      paddingTop: "120px", paddingBottom: "80px",
      overflow: "hidden",
    }}>
      {/* Subtle hex grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: .03,
        backgroundImage: "linear-gradient(rgba(193,246,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(193,246,237,1) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "48px", flexWrap: "wrap" }}>

          {/* Left: copy */}
          <div style={{ flex: "1 1 440px", maxWidth: "560px" }}>
            <div style={{ marginBottom: "20px" }}>
            </div>

            <h1 style={{
              fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 900,
              letterSpacing: "-.05em", lineHeight: 1.05,
              color: C.text, marginBottom: "24px",
            }}>
              Safe Payments.{" "}
              <span style={{
                background: "linear-gradient(135deg,#2EAF7D 20%,#3FD0C9 60%,#C1F6ED 100%)",
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
              <Btn variant="primary" size="lg" onClick={() => go("/create-escrow")}>Get Started — It's Free</Btn>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex" }}>
                {["AK","JM","MR","PB","LO"].map((init, i) => (
                  <div key={init} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `linear-gradient(135deg,${[C.primary,C.teal,C.green,C.mint,"#449342"][i]}30,${[C.primary,C.teal,C.green,C.mint,"#449342"][i]}10)`,
                    border: `2px solid ${[C.primary,C.teal,C.green,C.mint,"#449342"][i]}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: [C.primary,C.teal,C.green,C.mint,"#449342"][i],
                    marginLeft: i > 0 ? "-8px" : 0, zIndex: 5 - i,
                  }}>{init}</div>
                ))}
              </div>
              <div style={{ fontSize: "13px", color: C.textSub }}>
                <span style={{ fontWeight: 700, color: C.text }}>1,240+ freelancers</span> already protected
              </div>
            </div>
          </div>

          {/* Right: mascot — hidden on mobile */}
          <div className="hero-mascot" style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <MascotBox />
          </div>

        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const items = [
    { icon: "🛡️", title: "₱0", label: "Lost to Scams" },
    { icon: "⚡", title: "3-5s", label: "Settlement Speed" },
    { icon: "💸", title: "2.5%", label: "Flat Fee Only" },
    { icon: "⛓️", title: "Stellar", label: "Blockchain-Powered" },
  ];
  return (
    <div style={{ background: "#F0FDFB", padding: "0 24px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{
          display: "flex", flexWrap: "wrap",
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(46,175,125,.1), 0 2px 12px rgba(0,0,0,.06)",
          border: "2px solid #C1F6ED",
          overflow: "hidden",
          transform: "translateY(-40px)",
        }}>
          {items.map(({ icon, title }, i) => (
            <div key={title} style={{
              flex: "1 1 200px",
              display: "flex", alignItems: "center", gap: "16px",
              padding: "28px 32px",
              borderRight: i < items.length - 1 ? "1px solid #E0F7F3" : "none",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,rgba(63,208,201,.15),rgba(46,175,125,.1))",
                border: "1px solid rgba(63,208,201,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
              }}>{icon}</div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#02353C", lineHeight: 1.4 }}>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <section id="how-it-works" style={{ padding: "100px 24px", background: "#F0FDFB" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color={C.teal}>How It Works</Badge>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-.04em", color: "#02353C", marginTop: "16px", marginBottom: "16px" }}>
            Four steps. Zero stress.
          </h2>
          <p style={{ fontSize: "16px", color: "#1A6B60", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            From contract to cash — the whole flow lives on-chain so nobody can ghost, dispute unfairly, or delay payment.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0", position: "relative", flexWrap: "wrap",}}>
          <div style={{
            position: "absolute", top: "52px", left: "12.5%", right: "12.5%", height: "1px",
            background: `linear-gradient(90deg,transparent,${C.primary}60,${C.teal}70,${C.primary}60,transparent)`,
          }} />

          {steps.map(({ icon, num, title, desc }, i) => (
            <div key={num} style={{ flex: "1 1 220px", padding: "0 16px", textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-flex", marginBottom: "24px" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "20px",
                  background: "linear-gradient(135deg,rgba(46,175,125,.12),rgba(63,208,201,.08))",
                  border: "1px solid rgba(63,208,201,.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px",
                  boxShadow: "0 8px 24px rgba(46,175,125,.12)",
                }}>{icon}</div>
                <div style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.primary},${C.primaryDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 800, color: "#fff",
                  boxShadow: "0 4px 12px rgba(46,175,125,.4)",
                }}>{i + 1}</div>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#02353C", marginBottom: "10px", letterSpacing: "-.02em" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: "#2A7A70", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: "🔒", title: "Minimum Guaranteed Payment", desc: "Set a non-negotiable floor. Clients can't walk away with your work without paying at least the agreed minimum.", color: C.primary },
    { icon: "🎯", title: "Milestone Escrow", desc: "Break projects into phases. Funds release per milestone — so freelancers get paid as they go, not when clients feel like it.", color: C.teal },
    { icon: "💎", title: "Ultra-Low Fees", desc: "Flat 2.5% per transaction. No monthly subscription, no hidden charges, no percentage creep. Ever.", color: C.green },
    { icon: "📲", title: "GCash Release", desc: "Receive payments straight to your GCash wallet — no crypto knowledge required. Web3 power, Web2 simplicity.", color: C.mint },
    { icon: "⛓️", title: "Blockchain Proof", desc: "Every transaction, milestone, and release is recorded immutably on Stellar. Your receipt is the blockchain.", color: C.teal },
    { icon: "⚖️", title: "Dispute Protection", desc: "Neutral arbitration baked in. If things go sideways, our system — not vibes — decides who's right.", color: "#3FD0C9" },
  ];

  return (
    <section style={{ padding: "100px 24px", background: `linear-gradient(180deg,${C.surface} 0%,${C.base} 100%)` }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color={C.primary}>Features</Badge>
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
      background: h
        ? "linear-gradient(135deg,rgba(5,64,72,.98),rgba(3,52,60,.98))"
        : "linear-gradient(135deg,rgba(3,47,54,.95),rgba(2,40,46,.95))",
      border: `1px solid ${h ? color + "50" : C.border}`,
      borderRadius: "18px", padding: "28px",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
      transform: h ? "translateY(-4px)" : "none",
      boxShadow: h ? `0 16px 48px rgba(0,0,0,.5), 0 0 32px ${color}15` : "0 4px 16px rgba(0,0,0,.3)",
      cursor: "default", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
        background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
        opacity: h ? 1 : 0, transition: "opacity .22s",
      }} />
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        background: `${color}18`, border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", marginBottom: "18px",
        boxShadow: h ? `0 4px 16px ${color}28` : "none", transition: "box-shadow .22s",
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
          <Badge color={C.teal}>Comparison</Badge>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginTop: "16px", marginBottom: "16px" }}>
            We did the math. You win.
          </h2>
          <p style={{ fontSize: "16px", color: C.textSub, maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
            No other platform gives Filipino freelancers this combination of speed, safety, and savings.
          </p>
        </div>

        <GlassCard glow={C.primary} style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {cols.map((c, i) => (
                    <th key={c} style={{
                      padding: "18px 24px", textAlign: i === 0 ? "left" : "center",
                      fontSize: "13px", fontWeight: 700, letterSpacing: ".02em",
                      color: i === 1 ? C.teal : C.textSub,
                      background: i === 1 ? "rgba(63,208,201,.06)" : "transparent",
                      borderRight: i < cols.length - 1 ? `1px solid ${C.border}` : "none",
                    }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ feature, pangolin, vgen, paypal }, ri) => (
                  <tr key={feature} style={{
                    borderBottom: ri < rows.length - 1 ? `1px solid rgba(10,85,96,.5)` : "none",
                    transition: "background .15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(63,208,201,.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: C.textSub, borderRight: `1px solid ${C.border}` }}>{feature}</td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: C.teal, textAlign: "center", background: "rgba(63,208,201,.04)", borderRight: `1px solid ${C.border}` }}>{pangolin}</td>
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
      background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(46,175,125,.12) 0%, transparent 70%), ${C.surface}`,
      textAlign: "center",
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <img src="/pangolin-mascot.png" alt="Pangolin mascot" style={{ width: "120px", height: "120px", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(63,208,201,.3))" }} />
        </div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 900, letterSpacing: "-.05em", color: C.text, marginBottom: "18px", lineHeight: 1.1 }}>
          Your next project,{" "}
          <span style={{ background: "linear-gradient(135deg,#2EAF7D,#3FD0C9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            fully protected.
          </span>
        </h2>
        <p style={{ fontSize: "17px", color: C.textSub, lineHeight: 1.7, marginBottom: "36px" }}>
          Join 1,240+ Filipino freelancers who trust Pangolin to secure their income, protect their work, and get paid on time — every time.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="primary" size="xl" onClick={() => go("/dashboard")}>Connect Wallet</Btn>
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
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `${C.teal}12`, border: `1px solid ${C.teal}30`,
              borderRadius: "10px", padding: "8px 14px",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.teal, boxShadow: `0 0 8px ${C.teal}` }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: C.teal }}>Built on Stellar</span>
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
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #02353C; color: #C1F6ED; -webkit-font-smoothing: antialiased; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .55; transform: scale(.8); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #02353C; }
        ::-webkit-scrollbar-thumb { background: #0A5560; border-radius: 3px; }
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; align-items: center; justify-content: center; }
          .mobile-drawer { display: flex !important; }
          .hero-mascot { display: none !important; }
          .logo-img { width: 32px !important; height: 32px !important; }
          .logo-text { font-size: 18px !important; }
        }
        @media (min-width: 701px) {
          .hamburger { display: none !important; }
          .mobile-drawer { display: none !important; transform: none !important; }
          .mobile-overlay { display: none !important; }
        }
      `}</style>

      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <HowItWorks />
        <Features />
        <ComparisonTable />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
