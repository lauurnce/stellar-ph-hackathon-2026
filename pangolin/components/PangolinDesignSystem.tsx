// @ts-nocheck
"use client";

import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    base: { value: "#02353C", label: "Base" },
    surface: { value: "#032F36", label: "Surface" },
    elevated: { value: "#054048", label: "Elevated" },
    border: { value: "#0A5560", label: "Border" },
    primary: { value: "#2EAF7D", label: "Primary Green" },
    primaryMuted: { value: "#2EAF7D20", label: "Primary Muted" },
    teal: { value: "#3FD0C9", label: "Teal Accent" },
    tealMuted: { value: "#3FD0C920", label: "Teal Muted" },
    forest: { value: "#449342", label: "Forest Green" },
    mint: { value: "#C1F6ED", label: "Mint / Text" },
    textPrimary: { value: "#C1F6ED", label: "Text Primary" },
    textSecondary: { value: "#7ECFC6", label: "Text Secondary" },
    textMuted: { value: "#3A8A82", label: "Text Muted" },
  },
  semantic: {
    funded: {
      bg: "#3FD0C920",
      text: "#3FD0C9",
      border: "#3FD0C940",
      dot: "#3FD0C9",
    },
    inProgress: {
      bg: "#F59E0B20",
      text: "#FCD34D",
      border: "#F59E0B40",
      dot: "#F59E0B",
    },
    delivered: {
      bg: "#449342_20",
      text: "#6DC96B",
      border: "#44934240",
      dot: "#449342",
    },
    disputed: {
      bg: "#EF444420",
      text: "#F87171",
      border: "#EF444440",
      dot: "#EF4444",
    },
    completed: {
      bg: "#2EAF7D20",
      text: "#2EAF7D",
      border: "#2EAF7D40",
      dot: "#2EAF7D",
    },
  },
};

// Fix semantic bg values (no underscore in hex)
tokens.semantic.delivered.bg = "rgba(68,147,66,.12)";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const css = {
  page: {
    background: "#02353C",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#C1F6ED",
    padding: "56px 28px",
    overflowX: "hidden",
  },
  section: { marginBottom: "72px" },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#3A8A82",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#C1F6ED",
    marginBottom: "28px",
    lineHeight: 1.3,
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, #0A5560 0%, transparent 100%)",
    marginBottom: "72px",
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="logo">
      <img src="/logo-pangolin.png" alt="Pangolin logo" />
      <span className="brand">Pangolin</span>
    </div>
  );
}

function MascotDisplay() {
  return (
    <div className="mascot">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(63,208,201,.12) 0%, transparent 70%)",
        }}
      />
      <img src="/mascot-pangolin.png" alt="Pangolin mascot" />
    </div>
  );
}

function ColorSwatch({ value, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="color-swatch">
      <div className="sw" style={{ background: value, boxShadow: `0 4px 16px ${value}40` }}>
        {copied && <span style={{ fontSize: "16px" }}>✓</span>}
      </div>
      <div>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </button>
  );
}

function PangolinButton({
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md";
  return (
    <button className={`btn smooth btn-${variant} ${sizeClass}`} {...props}>
      {children}
    </button>
  );
}

function GlassCard({ children, style = {} }) {
  return (
    <div className="glass-card" style={style}>
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
    <div className="status-badge" style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: config.dot, display: "inline-block", boxShadow: `0 0 6px ${config.dot}`, animation: status === "In Progress" ? "pulse 2s ease-in-out infinite" : "none" }} />
      {status}
    </div>
  );
}

function GradientBadge({ children, variant = "primary" }) {
  const gradients = {
    primary: "linear-gradient(135deg, #2EAF7D 0%, #3FD0C9 100%)",
    teal: "linear-gradient(135deg, #3FD0C9 0%, #C1F6ED 100%)",
    forest: "linear-gradient(135deg, #449342 0%, #6DC96B 100%)",
    mint: "linear-gradient(135deg, #2EAF7D 0%, #C1F6ED 100%)",
  };
  return (
    <span className="gradient-badge" style={{ background: gradients[variant] || gradients.primary }}>
      {children}
    </span>
  );
}

function Avatar({ initials, size = 40, color = "#2EAF7D" }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`, border: `2px solid ${color}40`, fontSize: size * 0.35, color }}>
      {initials}
    </div>
  );
}

function TypographySample({ tag, label, style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "24px",
        padding: "20px 0",
        borderBottom: "1px solid rgba(10,85,96,.3)",
      }}
    >
      <div style={{ width: "80px", flexShrink: 0 }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#3A8A82",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...style, color: "#C1F6ED" }}>
          The quick escrow protects
          {tag === "caption" || tag === "label"
            ? " you."
            : " your creative work."}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span
          style={{
            fontSize: "11px",
            color: "#3A8A82",
            fontFamily: "monospace",
          }}
        >
          {style.fontSize} / {style.fontWeight}
        </span>
      </div>
    </div>
  );
}

function SampleJobCard() {
  return (
    <GlassCard glow="primary" style={{ maxWidth: "340px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar initials="MK" size={36} color="#2EAF7D" />
          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 600, color: "#C1F6ED" }}
            >
              Maya K.
            </div>
            <div style={{ fontSize: "11px", color: "#3A8A82" }}>
              Brand Designer
            </div>
          </div>
        </div>
        <StatusBadge status="In Progress" />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#C1F6ED",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          Full Brand Identity Package
        </div>
        <div style={{ fontSize: "13px", color: "#7ECFC6", lineHeight: 1.6 }}>
          Logo, color system, typography guide, and brand guidelines document.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{ fontSize: "11px", color: "#3A8A82", marginBottom: "2px" }}
          >
            Escrowed
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #2EAF7D 0%, #3FD0C9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            $1,200
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <GradientBadge variant="teal">Web3</GradientBadge>
          <GradientBadge variant="forest">NFT</GradientBadge>
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
        ::-webkit-scrollbar-track { background: #02353C; }
        ::-webkit-scrollbar-thumb { background: #0A5560; border-radius: 3px; }
      `}</style>

      <div className="ui-container">
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* ── Header ── */}
          <div style={{ marginBottom: "72px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <Logo />
              <GradientBadge variant="primary">
                Design System v1.0
              </GradientBadge>
            </div>
            <h1
              style={{
                fontSize: "40px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #C1F6ED 0%, #7ECFC6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pangolin
              </span>{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2EAF7D 0%, #3FD0C9 60%, #C1F6ED 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Design Tokens
              </span>
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#7ECFC6",
                lineHeight: 1.7,
                maxWidth: "560px",
              }}
            >
              A living style guide for the Pangolin Web3 freelance escrow
              platform. Every component, color, and type scale — in one place.
            </p>
          </div>

          <div style={css.divider} />

          {/* ── 1. Identity ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 01</div>
            <div style={css.sectionTitle}>Brand Identity</div>
            <div
              style={{
                display: "flex",
                gap: "32px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#3A8A82",
                    marginBottom: "12px",
                    fontWeight: 500,
                  }}
                >
                  Logo
                </div>
                <Logo />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#3A8A82",
                    marginBottom: "12px",
                    fontWeight: 500,
                  }}
                >
                  Mascot
                </div>
                <MascotDisplay />
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 2. Color Palette ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 02</div>
            <div style={css.sectionTitle}>Color Palette</div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "20px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Core & Brand
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {Object.values(tokens.colors).map((c) => (
                  <ColorSwatch key={c.label} {...c} />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "20px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Semantic / Status
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  "Funded",
                  "In Progress",
                  "Delivered",
                  "Disputed",
                  "Completed",
                ].map((s) => (
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
            <div
              style={{
                background: "#032F36",
                border: "1px solid #0A5560",
                borderRadius: "16px",
                padding: "8px 24px",
                overflow: "hidden",
              }}
            >
              <TypographySample
                tag="h1"
                label="H1"
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              />
              <TypographySample
                tag="h2"
                label="H2"
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              />
              <TypographySample
                tag="h3"
                label="H3"
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              />
              <TypographySample
                tag="h4"
                label="H4"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.4,
                }}
              />
              <TypographySample
                tag="body"
                label="Body"
                style={{ fontSize: "15px", fontWeight: 400, lineHeight: 1.7 }}
              />
              <TypographySample
                tag="caption"
                label="Caption"
                style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.6 }}
              />
              <TypographySample
                tag="label"
                label="Label"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 4. Buttons ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 04</div>
            <div style={css.sectionTitle}>Button Variants</div>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                Sizes — Primary
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <PangolinButton variant="primary" size="lg">
                  💰 Fund Escrow
                </PangolinButton>
                <PangolinButton variant="primary" size="md">
                  Fund Escrow
                </PangolinButton>
                <PangolinButton variant="primary" size="sm">
                  Fund
                </PangolinButton>
              </div>
            </div>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                Variants
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <PangolinButton variant="primary">Primary CTA</PangolinButton>
                <PangolinButton variant="teal">Teal Accent</PangolinButton>
                <PangolinButton variant="secondary">Secondary</PangolinButton>
                <PangolinButton variant="ghost">Ghost</PangolinButton>
                <PangolinButton variant="destructive">
                  ⚠ Raise Dispute
                </PangolinButton>
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 5. Cards ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 05</div>
            <div style={css.sectionTitle}>Card Components</div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <SampleJobCard />
              <GlassCard glow="teal" style={{ maxWidth: "280px" }}>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#7ECFC6",
                      fontWeight: 500,
                    }}
                  >
                    Platform Stats
                  </span>
                  <GradientBadge variant="forest">Live</GradientBadge>
                </div>
                {[
                  { label: "Total Escrowed", value: "$2.4M", color: "#2EAF7D" },
                  { label: "Active Jobs", value: "1,847", color: "#3FD0C9" },
                  { label: "Completed", value: "12,340", color: "#449342" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(10,85,96,.4)",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#7ECFC6" }}>
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </GlassCard>
              <GlassCard glow="primary" style={{ maxWidth: "240px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#3A8A82",
                    marginBottom: "8px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Hover to see glow
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#7ECFC6",
                    lineHeight: 1.6,
                  }}
                >
                  Glass cards use{" "}
                  <code
                    style={{
                      background: "#0A5560",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#3FD0C9",
                    }}
                  >
                    backdrop-filter
                  </code>{" "}
                  blur with a teal border glow on hover.
                </div>
              </GlassCard>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 6. Badges ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 06</div>
            <div style={css.sectionTitle}>Badges & Status Pills</div>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                Status Pills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  "Funded",
                  "In Progress",
                  "Delivered",
                  "Disputed",
                  "Completed",
                ].map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#3A8A82",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                Gradient Badges
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <GradientBadge variant="primary">Pro</GradientBadge>
                <GradientBadge variant="teal">Web3</GradientBadge>
                <GradientBadge variant="forest">NFT</GradientBadge>
                <GradientBadge variant="mint">Verified</GradientBadge>
              </div>
            </div>
          </div>

          <div style={css.divider} />

          {/* ── 7. Avatars ── */}
          <div style={css.section}>
            <div style={css.sectionLabel}>Section 07</div>
            <div style={css.sectionTitle}>Avatar Placeholders</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                alignItems: "flex-end",
              }}
            >
              {[
                { initials: "MK", size: 56, color: "#2EAF7D", label: "56px" },
                { initials: "JD", size: 44, color: "#3FD0C9", label: "44px" },
                { initials: "AW", size: 36, color: "#449342", label: "36px" },
                { initials: "PB", size: 28, color: "#C1F6ED", label: "28px" },
              ].map(({ initials, size, color, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Avatar initials={initials} size={size} color={color} />
                  <span style={{ fontSize: "11px", color: "#3A8A82" }}>
                    {label}
                  </span>
                </div>
              ))}
              <div style={{ marginLeft: "20px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#3A8A82",
                    marginBottom: "12px",
                    fontWeight: 500,
                  }}
                >
                  Avatar Group
                </div>
                <div style={{ display: "flex" }}>
                  {[
                    { initials: "MK", color: "#2EAF7D" },
                    { initials: "JD", color: "#3FD0C9" },
                    { initials: "AW", color: "#449342" },
                    { initials: "+4", color: "#3A8A82" },
                  ].map(({ initials, color }, i) => (
                    <div
                      key={initials}
                      style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: 4 - i }}
                    >
                      <Avatar initials={initials} size={36} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "32px",
              borderTop: "1px solid #0A5560",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Logo />
              <span style={{ fontSize: "13px", color: "#3A8A82" }}>
                Design System v1.0
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <GradientBadge variant="primary">Fintech</GradientBadge>
              <GradientBadge variant="teal">Web3</GradientBadge>
              <GradientBadge variant="forest">Escrow</GradientBadge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
