// @ts-nocheck
"use client";

import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    base: { value: "#0D0D0F", label: "Base" },
    surface: { value: "#141418", label: "Surface" },
    elevated: { value: "#1C1C22", label: "Elevated" },
    border: { value: "#2A2A35", label: "Border" },
    coral: { value: "#FF6B35", label: "Coral / Accent" },
    coralMuted: { value: "#FF6B3520", label: "Coral Muted" },
    blue: { value: "#3B82F6", label: "Trust Blue" },
    blueMuted: { value: "#3B82F620", label: "Blue Muted" },
    textPrimary: { value: "#F5F5F7", label: "Text Primary" },
    textSecondary: { value: "#8E8EA0", label: "Text Secondary" },
    textMuted: { value: "#52525E", label: "Text Muted" },
  },
  semantic: {
    funded: { bg: "#3B82F620", text: "#60A5FA", border: "#3B82F640", dot: "#3B82F6" },
    inProgress: { bg: "#F59E0B20", text: "#FCD34D", border: "#F59E0B40", dot: "#F59E0B" },
    delivered: { bg: "#8B5CF620", text: "#A78BFA", border: "#8B5CF640", dot: "#8B5CF6" },
    disputed: { bg: "#EF444420", text: "#F87171", border: "#EF444440", dot: "#EF4444" },
    completed: { bg: "#10B98120", text: "#34D399", border: "#10B98140", dot: "#10B981" },
  },
};

// ─── Inline Styles (since we can't rely on arbitrary Tailwind values) ─────────
const css = {
  page: {
    background: "#0D0D0F",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#F5F5F7",
    padding: "48px 24px",
    overflowX: "hidden",
  },
  section: {
    marginBottom: "72px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#52525E",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#F5F5F7",
    marginBottom: "28px",
    lineHeight: 1.3,
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, #2A2A35 0%, transparent 100%)",
    marginBottom: "72px",
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      background: "linear-gradient(135deg, #1C1C22 0%, #141418 100%)",
      border: "1px solid #2A2A35",
      borderRadius: "14px",
      padding: "10px 18px",
      boxShadow: "0 0 0 1px #FF6B3510, inset 0 1px 0 #ffffff08",
    }}>
      <span style={{ fontSize: "22px" }}>🐧</span>
      <span style={{
        fontSize: "17px",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        background: "linear-gradient(135deg, #FF6B35 0%, #FF9A6C 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>Pangolin</span>
    </div>
  );
}

function MascotPlaceholder() {
  return (
    <div style={{
      width: "160px",
      height: "160px",
      background: "linear-gradient(135deg, #1C1C22 0%, #141418 100%)",
      border: "1px dashed #2A2A35",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle gradient glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, #FF6B3510 0%, transparent 70%)",
      }} />
      {/* Pangolin SVG silhouette */}
      <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="36" cy="34" rx="22" ry="14" fill="#FF6B3530" />
        {/* Scales pattern */}
        <path d="M20 28 Q24 22 28 28" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M26 24 Q30 18 34 24" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M32 22 Q36 16 40 22" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M38 24 Q42 18 46 24" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M22 34 Q26 28 30 34" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M30 30 Q34 24 38 30" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M38 30 Q42 24 46 30" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.6"/>
        {/* Head */}
        <ellipse cx="54" cy="26" rx="10" ry="8" fill="#FF6B3540" />
        {/* Snout */}
        <path d="M60 26 Q66 24 68 26 Q66 28 60 27Z" fill="#FF6B3560" />
        {/* Eye */}
        <circle cx="56" cy="23" r="2" fill="#FF6B35" opacity="0.8"/>
        {/* Ear */}
        <path d="M48 20 Q50 14 54 18" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.5"/>
        {/* Tail */}
        <path d="M14 34 Q4 38 2 30 Q4 22 12 28" stroke="#FF6B35" strokeWidth="2" fill="none" opacity="0.5"/>
        {/* Legs */}
        <path d="M26 46 Q24 50 22 52" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M34 48 Q33 52 32 54" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M44 46 Q44 50 44 53" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
      <span style={{ fontSize: "11px", color: "#52525E", fontWeight: 500, position: "relative" }}>
        Mascot Placeholder
      </span>
    </div>
  );
}

function ColorSwatch({ value, label }) {
  const [copied, setCopied] = useState(false);
  const isDark = value.includes("20") || value.includes("40") || value.includes("10");

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
      }}
    >
      <div style={{
        width: "72px",
        height: "72px",
        borderRadius: "14px",
        background: value,
        border: "1px solid #2A2A35",
        boxShadow: `0 4px 16px ${value}40`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {copied && <span style={{ fontSize: "16px" }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#F5F5F7", marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#52525E", fontFamily: "monospace" }}>{value}</div>
      </div>
    </button>
  );
}

function PangolinButton({ variant = "primary", size = "md", children, ...props }) {
  const [hovered, setHovered] = useState(false);

  const variants = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg, #FF7A44 0%, #FF6B35 100%)"
        : "linear-gradient(135deg, #FF6B35 0%, #E85D2A 100%)",
      color: "#FFFFFF",
      border: "none",
      boxShadow: hovered
        ? "0 8px 32px #FF6B3550, 0 0 0 1px #FF6B3540"
        : "0 4px 16px #FF6B3530, 0 0 0 1px #FF6B3530",
    },
    secondary: {
      background: hovered ? "#1C1C2A" : "#141418",
      color: "#F5F5F7",
      border: "1px solid #2A2A35",
      boxShadow: hovered ? "0 4px 16px #00000040" : "0 2px 8px #00000020",
    },
    ghost: {
      background: hovered ? "#FF6B3510" : "transparent",
      color: hovered ? "#FF6B35" : "#8E8EA0",
      border: "1px solid transparent",
      boxShadow: "none",
    },
    destructive: {
      background: hovered ? "#EF444420" : "transparent",
      color: "#F87171",
      border: `1px solid ${hovered ? "#EF444440" : "#EF444430"}`,
      boxShadow: hovered ? "0 4px 16px #EF444420" : "none",
    },
    blue: {
      background: hovered
        ? "linear-gradient(135deg, #4F92FF 0%, #3B82F6 100%)"
        : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      color: "#FFFFFF",
      border: "none",
      boxShadow: hovered
        ? "0 8px 32px #3B82F650, 0 0 0 1px #3B82F640"
        : "0 4px 16px #3B82F630, 0 0 0 1px #3B82F630",
    },
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "13px", borderRadius: "10px" },
    md: { padding: "12px 22px", fontSize: "14px", borderRadius: "12px" },
    lg: { padding: "16px 32px", fontSize: "15px", borderRadius: "14px" },
  };

  const style = {
    ...variants[variant],
    ...sizes[size],
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transform: hovered ? "translateY(-1px)" : "none",
    whiteSpace: "nowrap",
  };

  return (
    <button
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function GlassCard({ children, style = {}, glow = "coral" }) {
  const [hovered, setHovered] = useState(false);
  const glowColor = glow === "coral" ? "#FF6B35" : "#3B82F6";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(135deg, rgba(28,28,34,0.9) 0%, rgba(20,20,24,0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? glowColor + "40" : "#2A2A35"}`,
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? `0 0 0 1px ${glowColor}20, 0 16px 48px #00000050, 0 0 32px ${glowColor}15`
          : "0 4px 24px #00000040",
        transform: hovered ? "translateY(-2px)" : "none",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle top-edge highlight */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "20%",
        right: "20%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${glowColor}30, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s ease",
      }} />
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    Funded: tokens.semantic.funded,
    "In Progress": tokens.semantic.inProgress,
    Delivered: tokens.semantic.delivered,
    Disputed: tokens.semantic.disputed,
    Completed: tokens.semantic.completed,
  };

  const config = configs[status];

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: "100px",
      padding: "5px 12px",
      fontSize: "12px",
      fontWeight: 600,
      color: config.text,
      letterSpacing: "0.01em",
    }}>
      <span style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: config.dot,
        display: "inline-block",
        boxShadow: `0 0 6px ${config.dot}`,
        animation: status === "In Progress" ? "pulse 2s ease-in-out infinite" : "none",
      }} />
      {status}
    </div>
  );
}

function GradientBadge({ children, variant = "coral" }) {
  const gradients = {
    coral: "linear-gradient(135deg, #FF6B35 0%, #FF9A6C 100%)",
    blue: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    purple: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    green: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "100px",
      background: gradients[variant],
      color: "#fff",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      boxShadow: `0 2px 12px ${variant === "coral" ? "#FF6B3540" : "#3B82F640"}`,
    }}>
      {children}
    </span>
  );
}

function Avatar({ initials, size = 40, color = "#FF6B35" }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 700,
      color: color,
      letterSpacing: "-0.02em",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TypographySample({ tag, label, style }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "baseline",
      gap: "24px",
      padding: "20px 0",
      borderBottom: "1px solid #2A2A3520",
    }}>
      <div style={{ width: "80px", flexShrink: 0 }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#52525E",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>{label}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...style, color: "#F5F5F7" }}>
          The quick escrow protects{tag === "caption" || tag === "label" ? " you." : " your creative work."}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{ fontSize: "11px", color: "#52525E", fontFamily: "monospace" }}>
          {style.fontSize} / {style.fontWeight}
        </span>
      </div>
    </div>
  );
}

// ─── Sample Card Content ───────────────────────────────────────────────────────
function SampleJobCard() {
  return (
    <GlassCard glow="coral" style={{ maxWidth: "340px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar initials="MK" size={36} color="#FF6B35" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F5F7" }}>Maya K.</div>
            <div style={{ fontSize: "11px", color: "#52525E" }}>Brand Designer</div>
          </div>
        </div>
        <StatusBadge status="In Progress" />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#F5F5F7", marginBottom: "6px", letterSpacing: "-0.01em" }}>
          Full Brand Identity Package
        </div>
        <div style={{ fontSize: "13px", color: "#8E8EA0", lineHeight: 1.6 }}>
          Logo, color system, typography guide, and brand guidelines document.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#52525E", marginBottom: "2px" }}>Escrowed</div>
          <div style={{
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #FF6B35 0%, #FF9A6C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>$1,200</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <GradientBadge variant="blue">Web3</GradientBadge>
          <GradientBadge variant="purple">NFT</GradientBadge>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Main Style Guide ─────────────────────────────────────────────────────────
export default function PangolinDesignSystem() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0D0F; }
        ::-webkit-scrollbar-thumb { background: #2A2A35; border-radius: 3px; }
      `}</style>

      <div style={css.page}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
              <Logo />
              <GradientBadge variant="coral">Design System v1.0</GradientBadge>
            </div>
            <h1 style={{
              fontSize: "40px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}>
              <span style={{
                background: "linear-gradient(135deg, #F5F5F7 0%, #8E8EA0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Pangolin</span>{" "}
              <span style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF9A6C 60%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Design Tokens</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#8E8EA0", lineHeight: 1.7, maxWidth: "560px" }}>
              A living style guide for the Pangolin Web3 freelance escrow platform. 
              Every component, color, and type scale — in one place.
            </p>
          </div>

          <div style={css.divider} />

          {/* ── 1. Identity ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 01</div>
            <div style={css.sectionTitle}>Brand Identity</div>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "12px", fontWeight: 500 }}>Logo</div>
                <Logo />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "12px", fontWeight: 500 }}>Mascot</div>
                <MascotPlaceholder />
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 2. Color Palette ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 02</div>
            <div style={css.sectionTitle}>Color Palette</div>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "20px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Core & Brand
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {Object.values(tokens.colors).map((c) => (
                  <ColorSwatch key={c.label} {...c} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "20px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Semantic / Status
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["Funded", "In Progress", "Delivered", "Disputed", "Completed"].map(s => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 3. Typography ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 03</div>
            <div style={css.sectionTitle}>Typography Scale</div>
            <div style={{
              background: "#141418",
              border: "1px solid #2A2A35",
              borderRadius: "16px",
              padding: "8px 24px",
              overflow: "hidden",
            }}>
              <TypographySample tag="h1" label="H1" style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1 }} />
              <TypographySample tag="h2" label="H2" style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2 }} />
              <TypographySample tag="h3" label="H3" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }} />
              <TypographySample tag="h4" label="H4" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.4 }} />
              <TypographySample tag="body" label="Body" style={{ fontSize: "15px", fontWeight: 400, lineHeight: 1.7 }} />
              <TypographySample tag="caption" label="Caption" style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.6, color: "#8E8EA0" }} />
              <TypographySample tag="label" label="Label" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }} />
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 4. Buttons ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 04</div>
            <div style={css.sectionTitle}>Button Variants</div>

            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "16px", fontWeight: 500 }}>Sizes — Primary</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <PangolinButton variant="primary" size="lg">💰 Fund Escrow</PangolinButton>
                <PangolinButton variant="primary" size="md">Fund Escrow</PangolinButton>
                <PangolinButton variant="primary" size="sm">Fund</PangolinButton>
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "16px", fontWeight: 500 }}>Variants</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <PangolinButton variant="primary">Primary CTA</PangolinButton>
                <PangolinButton variant="blue">Trust Blue</PangolinButton>
                <PangolinButton variant="secondary">Secondary</PangolinButton>
                <PangolinButton variant="ghost">Ghost</PangolinButton>
                <PangolinButton variant="destructive">⚠ Raise Dispute</PangolinButton>
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 5. Cards ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 05</div>
            <div style={css.sectionTitle}>Card Components</div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
              {/* Job card */}
              <SampleJobCard />

              {/* Stats card */}
              <GlassCard glow="blue" style={{ maxWidth: "280px" }}>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#8E8EA0", fontWeight: 500 }}>Platform Stats</span>
                  <GradientBadge variant="green">Live</GradientBadge>
                </div>
                {[
                  { label: "Total Escrowed", value: "$2.4M", color: "#FF6B35" },
                  { label: "Active Jobs", value: "1,847", color: "#3B82F6" },
                  { label: "Completed", value: "12,340", color: "#10B981" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #2A2A3530",
                  }}>
                    <span style={{ fontSize: "13px", color: "#8E8EA0" }}>{label}</span>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color,
                    }}>{value}</span>
                  </div>
                ))}
              </GlassCard>

              {/* Minimal card */}
              <GlassCard glow="coral" style={{ maxWidth: "240px" }}>
                <div style={{ fontSize: "11px", color: "#52525E", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Hover to see glow
                </div>
                <div style={{ fontSize: "13px", color: "#8E8EA0", lineHeight: 1.6 }}>
                  Glass cards use <code style={{ background: "#2A2A35", padding: "1px 6px", borderRadius: "4px", fontSize: "12px", color: "#FF6B35" }}>backdrop-filter</code> blur with a coral border glow on hover.
                </div>
              </GlassCard>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 6. Badges & Pills ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 06</div>
            <div style={css.sectionTitle}>Badges & Status Pills</div>

            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "16px", fontWeight: 500 }}>Status Pills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["Funded", "In Progress", "Delivered", "Disputed", "Completed"].map(s => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "16px", fontWeight: 500 }}>Gradient Badges</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <GradientBadge variant="coral">Pro</GradientBadge>
                <GradientBadge variant="blue">Web3</GradientBadge>
                <GradientBadge variant="purple">NFT</GradientBadge>
                <GradientBadge variant="green">Verified</GradientBadge>
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 7. Avatars ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 07</div>
            <div style={css.sectionTitle}>Avatar Placeholders</div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-end" }}>
              {[
                { initials: "MK", size: 56, color: "#FF6B35", label: "56px" },
                { initials: "JD", size: 44, color: "#3B82F6", label: "44px" },
                { initials: "AW", size: 36, color: "#8B5CF6", label: "36px" },
                { initials: "PB", size: 28, color: "#10B981", label: "28px" },
              ].map(({ initials, size, color, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <Avatar initials={initials} size={size} color={color} />
                  <span style={{ fontSize: "11px", color: "#52525E" }}>{label}</span>
                </div>
              ))}

              {/* Avatar group */}
              <div style={{ marginLeft: "20px" }}>
                <div style={{ fontSize: "12px", color: "#52525E", marginBottom: "12px", fontWeight: 500 }}>Avatar Group</div>
                <div style={{ display: "flex" }}>
                  {[
                    { initials: "MK", color: "#FF6B35" },
                    { initials: "JD", color: "#3B82F6" },
                    { initials: "AW", color: "#8B5CF6" },
                    { initials: "+4", color: "#52525E" },
                  ].map(({ initials, color }, i) => (
                    <div key={initials} style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: 4 - i }}>
                      <Avatar initials={initials} size={36} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            paddingTop: "32px",
            borderTop: "1px solid #2A2A35",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Logo />
              <span style={{ fontSize: "13px", color: "#52525E" }}>Design System v1.0</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <GradientBadge variant="coral">Fintech</GradientBadge>
              <GradientBadge variant="blue">Web3</GradientBadge>
              <GradientBadge variant="purple">Escrow</GradientBadge>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
