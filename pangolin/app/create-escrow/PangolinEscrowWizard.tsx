// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { createEscrow, fundEscrow } from "@/lib/contract-client";
import { parseAmountToInt } from "@/lib/format";
import { appConfig } from "@/lib/config";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Escrow Creation Wizard  (3-step)
   Dark #0D0D0F · Coral #FF6B35 · Inter · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:        "#0D0D0F",
  surface:     "#111116",
  elevated:    "#17171F",
  card:        "#1D1D28",
  border:      "#26263A",
  borderLight: "#333348",
  coral:       "#FF6B35",
  coralDark:   "#D9521A",
  coralSoft:   "rgba(255,107,53,0.12)",
  blue:        "#3B82F6",
  green:       "#10B981",
  amber:       "#F59E0B",
  purple:      "#8B5CF6",
  text:        "#F0F0F8",
  textSub:     "#8888A8",
  textMuted:   "#4C4C64",
  font:        "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
};

function go(path) {
  window.location.href = path;
}

const PHP_RATE = 58.3; // 1 USDC ≈ ₱58.30

// ── Helpers ───────────────────────────────────────────────────────────────────
function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function fmt(usdc) {
  const n = parseFloat(usdc) || 0;
  return { usdc: n.toFixed(2), php: (n * PHP_RATE).toLocaleString("en-PH", { minimumFractionDigits: 2 }) };
}

// ── Design primitives ─────────────────────────────────────────────────────────
function Label({ children, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "-.01em" }}>{children}</span>
      {hint && <span style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 400 }}>{hint}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", prefix, style: sx = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: C.elevated, border: `1.5px solid ${focused ? C.coral + "70" : C.border}`,
      borderRadius: 12, overflow: "hidden",
      boxShadow: focused ? `0 0 0 3px rgba(255,107,53,.12)` : "none",
      transition: "all .18s ease",
    }}>
      {prefix && (
        <div style={{ padding: "0 14px", fontSize: 14, color: C.textMuted, borderRight: `1px solid ${C.border}`, height: "100%", display: "flex", alignItems: "center", background: "rgba(255,255,255,.02)", whiteSpace: "nowrap", paddingTop: 12, paddingBottom: 12 }}>
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: C.text, fontSize: 14, padding: "13px 16px",
          fontFamily: C.font, caretColor: C.coral,
          ...sx,
        }}
      />
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: C.elevated,
          border: `1.5px solid ${focused ? C.coral + "70" : C.border}`,
          borderRadius: 12, outline: "none",
          color: value ? C.text : C.textMuted,
          fontSize: 14, padding: "13px 40px 13px 16px",
          fontFamily: C.font, cursor: "pointer", appearance: "none",
          boxShadow: focused ? `0 0 0 3px rgba(255,107,53,.12)` : "none",
          transition: "all .18s ease",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: C.card }}>{o}</option>)}
      </select>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.textMuted, pointerEvents: "none", fontSize: 13 }}>▾</div>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", background: C.elevated,
        border: `1.5px solid ${focused ? C.coral + "70" : C.border}`,
        borderRadius: 12, outline: "none", resize: "vertical",
        color: C.text, fontSize: 14, padding: "13px 16px",
        fontFamily: C.font, lineHeight: 1.6, caretColor: C.coral,
        boxShadow: focused ? `0 0 0 3px rgba(255,107,53,.12)` : "none",
        transition: "border-color .18s, box-shadow .18s",
      }}
    />
  );
}

function Toggle({ on, setOn, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      {(label || sub) && (
        <div>
          {label && <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{label}</div>}
          {sub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
        </div>
      )}
      <button onClick={() => setOn(!on)} style={{
        width: 46, height: 26, borderRadius: 13,
        background: on ? `linear-gradient(135deg,${C.coral},${C.coralDark})` : C.border,
        border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background .2s ease",
        boxShadow: on ? `0 4px 14px rgba(255,107,53,.35)` : "none",
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: on ? 23 : 3,
          transition: "left .2s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,.3)",
        }} />
      </button>
    </div>
  );
}

function Btn({ variant = "coral", size = "md", children, onClick, disabled, style: sx = {}, fullWidth }) {
  const [h, hov] = useHover();
  const isDisabled = !!disabled;
  const sizes = {
    sm:   { padding: "9px 18px",  fontSize: "13px",  borderRadius: "10px" },
    md:   { padding: "12px 24px", fontSize: "14px",  borderRadius: "12px" },
    lg:   { padding: "16px 32px", fontSize: "15.5px",borderRadius: "14px" },
    xl:   { padding: "18px 36px", fontSize: "16.5px",borderRadius: "15px" },
  };
  const variants = {
    coral: {
      background: isDisabled ? "#3A2218" : h ? `linear-gradient(135deg,#FF7C48,${C.coralDark})` : `linear-gradient(135deg,${C.coral},${C.coralDark})`,
      color: isDisabled ? "#6B3820" : "#fff", border: "none",
      boxShadow: isDisabled ? "none" : h ? "0 12px 40px rgba(255,107,53,.5),0 0 0 1px rgba(255,107,53,.35)" : "0 6px 24px rgba(255,107,53,.32),0 0 0 1px rgba(255,107,53,.22)",
    },
    ghost: {
      background: h ? "rgba(255,107,53,.07)" : "transparent",
      color: h ? C.coral : C.textSub,
      border: `1px solid ${h ? "rgba(255,107,53,.28)" : C.border}`,
      boxShadow: "none",
    },
    subtle: {
      background: h ? C.card : C.elevated,
      color: C.text, border: `1px solid ${h ? C.borderLight : C.border}`,
      boxShadow: "none",
    },
  };
  return (
    <button onClick={isDisabled ? undefined : onClick} {...(isDisabled ? {} : hov)} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: C.font, fontWeight: 700, cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "all .17s cubic-bezier(.4,0,.2,1)",
      transform: !isDisabled && h ? "translateY(-1px)" : "none",
      whiteSpace: "nowrap", letterSpacing: "-.01em",
      width: fullWidth ? "100%" : "auto",
      ...sizes[size], ...variants[variant], ...sx,
    }}>{children}</button>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ children, tip }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
          transform: "translateX(-50%)", zIndex: 50,
          background: C.card, border: `1px solid ${C.borderLight}`,
          borderRadius: 11, padding: "11px 14px", width: 260,
          boxShadow: "0 12px 40px rgba(0,0,0,.6)",
          fontSize: 12.5, color: C.textSub, lineHeight: 1.6,
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 5 }}>Minimum Guaranteed Payment</div>
          {tip}
          <div style={{
            position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
            width: 10, height: 10, background: C.card, border: `1px solid ${C.borderLight}`,
            borderRight: "none", borderTop: "none", rotate: "-45deg",
          }} />
        </div>
      )}
    </div>
  );
}

// ── Step Progress Bar ─────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Commission Details", "Payment Terms", "Review & Confirm"];
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {steps.map((label, i) => {
          const idx = i + 1;
          const done = step > idx;
          const active = step === idx;
          return (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
              {/* Circle */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: done ? C.green : active ? `linear-gradient(135deg,${C.coral},${C.coralDark})` : C.elevated,
                border: `2px solid ${done ? C.green : active ? C.coral : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 16 : 14, fontWeight: 800, color: (done || active) ? "#fff" : C.textMuted,
                boxShadow: active ? `0 0 24px rgba(255,107,53,.45),0 0 0 4px rgba(255,107,53,.12)` : done ? `0 0 16px rgba(16,185,129,.3)` : "none",
                transition: "all .3s ease", zIndex: 2, position: "relative",
              }}>
                {done ? "✓" : idx}
              </div>
              {/* Label */}
              <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? C.coral : done ? C.green : C.textMuted, textAlign: "center", whiteSpace: "nowrap" }}>
                {label}
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 20, left: "50%", right: "-50%", height: 2, zIndex: 0,
                  background: step > idx + 1 ? C.green : step > idx ? `linear-gradient(90deg,${C.green},${C.border})` : C.border,
                  transition: "background .4s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 1: Commission Details ────────────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  const [inviteMode, setInviteMode] = useState(false);
  const valid = data.title.trim() && data.category && data.description.trim() && (inviteMode || data.freelancerWallet.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <Label>Project Title</Label>
        <Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="e.g. Brand identity package for Web3 startup" />
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={data.category} placeholder="Select a category"
          options={["Illustration", "Animation", "3D Art", "Music & Audio", "Writing & Copywriting", "UI/UX Design", "Other"]}
          onChange={e => setData({ ...data, category: e.target.value })}
        />
      </div>

      <div>
        <Label hint="(min. 30 characters)">Project Description</Label>
        <Textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          placeholder="Describe the scope, deliverables, style references, and any special requirements..." rows={5} />
        <div style={{ fontSize: 11.5, color: data.description.length >= 30 ? C.green : C.textMuted, marginTop: 5, textAlign: "right" }}>
          {data.description.length} characters {data.description.length < 30 && `(${30 - data.description.length} more needed)`}
        </div>
      </div>

      {/* Freelancer input */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <Label>Freelancer</Label>
          <Toggle on={inviteMode} setOn={v => { setInviteMode(v); setData({ ...data, freelancerWallet: "" }); }} />
        </div>
        <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 10, textAlign: "right", marginTop: -4 }}>
          {inviteMode ? "Invite via Link" : "Enter wallet address"}
        </div>

        {inviteMode ? (
          <div style={{
            background: C.elevated, border: `1.5px dashed ${C.border}`,
            borderRadius: 12, padding: "18px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🔗</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Generate Invite Link</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 14 }}>Share a unique link with your freelancer — they'll connect their wallet to join this contract.</div>
            <Btn variant="subtle" size="sm" onClick={() => {}}>Copy Invite Link</Btn>
          </div>
        ) : (
          <Input
            value={data.freelancerWallet}
            onChange={e => setData({ ...data, freelancerWallet: e.target.value })}
            placeholder="G... (Stellar wallet address)"
            prefix="Wallet"
          />
        )}
      </div>

      <div style={{ marginTop: 4 }}>
        <Btn variant="coral" size="xl" fullWidth disabled={!valid} onClick={onNext}>
          Next: Payment Terms →
        </Btn>
      </div>
    </div>
  );
}

// ── STEP 2: Payment Terms ─────────────────────────────────────────────────────
function Step2({ data, setData, onNext, onBack }) {
  const [milestones, setMilestones] = useState(data.milestones || [{ name: "", amount: "" }]);
  const total = parseFloat(data.totalAmount) || 0;
  const minPct = data.minGuarantee ?? 40;
  const minUSDC = ((minPct / 100) * total).toFixed(2);

  const addMilestone = () => {
    if (milestones.length < 5) setMilestones([...milestones, { name: "", amount: "" }]);
  };
  const removeMilestone = i => setMilestones(milestones.filter((_, idx) => idx !== i));
  const updateMilestone = (i, field, val) => setMilestones(milestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const valid = total > 0 && data.deadline;

  const handleNext = () => {
    setData({ ...data, milestones, minGuarantee: minPct });
    onNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Total amount */}
      <div>
        <Label>Total Escrow Amount</Label>
        <Input value={data.totalAmount} onChange={e => setData({ ...data, totalAmount: e.target.value })}
          type="number" placeholder="0.00" prefix="USDC" />
        {total > 0 && (
          <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
            <span>≈</span>
            <span style={{ fontWeight: 600, color: C.textSub }}>₱{fmt(total).php} PHP</span>
            <span style={{ color: C.textMuted }}>at current rate (1 USDC ≈ ₱{PHP_RATE})</span>
          </div>
        )}
      </div>

      {/* Minimum Guaranteed Payment — KEY FEATURE */}
      <div style={{
        background: `linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))`,
        border: `1.5px solid rgba(255,107,53,.28)`,
        borderRadius: 16, padding: "20px 22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>Minimum Guaranteed Payment</span>
          <Tooltip tip="Even if a dispute occurs or the client cancels, the freelancer is guaranteed to receive at least this percentage of the total escrow. Pangolin's smart contract enforces this automatically — no exceptions.">
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "rgba(255,107,53,.2)", border: "1px solid rgba(255,107,53,.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: C.coral, cursor: "help",
            }}>?</div>
          </Tooltip>
          <div style={{
            marginLeft: "auto", padding: "3px 10px", borderRadius: "100px", fontSize: 11, fontWeight: 700,
            background: "rgba(255,107,53,.18)", color: C.coral, border: "1px solid rgba(255,107,53,.3)",
          }}>Pangolin's Core Feature</div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 12 }}>
          <input type="range" min={10} max={50} step={5} value={minPct}
            onChange={e => setData({ ...data, minGuarantee: +e.target.value })}
            style={{ width: "100%", accentColor: C.coral, cursor: "pointer", height: 20 }} />
        </div>

        {/* Visual readout */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(0,0,0,.25)", borderRadius: 12, padding: "14px 18px",
          border: `1px solid rgba(255,107,53,.18)`,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-.05em", background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{minPct}%</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Guaranteed</div>
          </div>
          <div style={{ width: 1, height: 48, background: "rgba(255,107,53,.2)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.03em", color: total > 0 ? C.text : C.textMuted }}>{total > 0 ? `$${minUSDC}` : "$—"}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>USDC minimum</div>
          </div>
          <div style={{ width: 1, height: 48, background: "rgba(255,107,53,.2)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", color: total > 0 ? C.textSub : C.textMuted }}>{total > 0 ? `₱${(parseFloat(minUSDC) * PHP_RATE).toLocaleString("en-PH", { minimumFractionDigits: 0 })}` : "₱—"}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>PHP equivalent</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 12, lineHeight: 1.6 }}>
          ⚡ Smart contract enforced — freelancer receives at least <strong style={{ color: C.coral }}>${minUSDC} USDC</strong> even if a dispute is raised or the project is cancelled.
        </div>
      </div>

      {/* Milestone toggle */}
      <div style={{
        background: C.elevated, border: `1.5px solid ${C.border}`,
        borderRadius: 14, padding: "18px 20px",
      }}>
        <Toggle
          on={data.milestonesEnabled}
          setOn={v => setData({ ...data, milestonesEnabled: v })}
          label="Payment Structure"
          sub={data.milestonesEnabled ? "Milestone-based — released in phases" : "Single Payment — released upon completion"}
        />

        {data.milestonesEnabled && (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 4 }}>Milestone Breakdown</div>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg,${C.coral},${C.coralDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#fff",
                }}>{i + 1}</div>
                <div style={{ flex: 2 }}>
                  <input value={m.name} onChange={e => updateMilestone(i, "name", e.target.value)}
                    placeholder={`Milestone ${i + 1} name`}
                    style={{ width: "100%", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "9px 13px", color: C.text, fontSize: 13, fontFamily: C.font, outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <input value={m.amount} onChange={e => updateMilestone(i, "amount", e.target.value)}
                    placeholder="USDC" type="number"
                    style={{ width: "100%", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "9px 13px", color: C.text, fontSize: 13, fontFamily: C.font, outline: "none" }} />
                </div>
                {milestones.length > 1 && (
                  <button onClick={() => removeMilestone(i)} style={{ background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, color: "#F87171", cursor: "pointer", padding: "8px 10px", fontSize: 13, flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
            {milestones.length < 5 && (
              <button onClick={addMilestone} style={{ background: "transparent", border: `1.5px dashed ${C.border}`, borderRadius: 10, color: C.textMuted, cursor: "pointer", padding: "10px", fontSize: 13, fontFamily: C.font, marginTop: 2, transition: "border-color .15s, color .15s" }}
                onMouseEnter={e => { e.target.style.borderColor = C.coral; e.target.style.color = C.coral; }}
                onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textMuted; }}>
                + Add Milestone {milestones.length + 1} of 5
              </button>
            )}
          </div>
        )}
      </div>

      {/* Deadline */}
      <div>
        <Label>Project Deadline</Label>
        <Input value={data.deadline} onChange={e => setData({ ...data, deadline: e.target.value })} type="date" />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <Btn variant="ghost" size="lg" onClick={onBack}>← Back</Btn>
        <Btn variant="coral" size="xl" fullWidth disabled={!valid} onClick={handleNext}>Next: Review →</Btn>
      </div>
    </div>
  );
}

// ── STEP 3: Review & Confirm ──────────────────────────────────────────────────
function Step3({ data, onBack, onSubmit, txLoading = false, txError = null }) {
  const [confirmed, setConfirmed] = useState(false);
  const total = parseFloat(data.totalAmount) || 0;
  const fee = (total * 0.025).toFixed(2);
  const totalWithFee = (total + parseFloat(fee)).toFixed(2);
  const minGuarantee = data.minGuarantee ?? 40;
  const minUSDC = ((minGuarantee / 100) * total).toFixed(2);

  const Row = ({ label, value, highlight, muted, mono }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid rgba(38,38,58,.6)` }}>
      <span style={{ fontSize: 13, color: muted ? C.textMuted : C.textSub, fontWeight: muted ? 400 : 500 }}>{label}</span>
      <span style={{
        fontSize: highlight ? 16 : 14, fontWeight: highlight ? 800 : 600,
        color: highlight ? C.coral : mono ? C.textSub : C.text,
        fontFamily: mono ? "monospace" : C.font, letterSpacing: highlight ? "-.03em" : "normal",
      }}>{value}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Summary card */}
      <div style={{
        background: "linear-gradient(135deg,rgba(29,29,40,.97),rgba(22,22,32,.97))",
        border: `1.5px solid ${C.border}`, borderRadius: 18,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 3 }}>Contract Summary</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-.02em" }}>{data.title || "Untitled Project"}</div>
          </div>
          <div style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.3)", fontSize: 12, fontWeight: 700, color: C.amber }}>Draft</div>
        </div>

        <div style={{ padding: "6px 22px" }}>
          <Row label="Category"           value={data.category || "—"}                                         />
          <Row label="Freelancer Wallet"  value={data.freelancerWallet || "Invite Link"} mono                  />
          <Row label="Payment Structure"  value={data.milestonesEnabled ? "Milestone-based" : "Single Payment"}/>
          <Row label="Deadline"           value={data.deadline || "—"}                                         />
          <Row label="Auto-Release"       value="✅ 48 hrs after delivery" />
        </div>

        {/* Financial breakdown */}
        <div style={{ margin: "0 22px", background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 13, padding: "6px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".05em", textTransform: "uppercase", padding: "10px 0 6px" }}>Financial Breakdown</div>
          <Row label="Escrow Amount"      value={`$${fmt(total).usdc} USDC`}                                   />
          <Row label="PHP Equivalent"     value={`≈ ₱${fmt(total).php}`} muted                                />
          <Row label={`Platform Fee (2.5%)`} value={`+ $${fee} USDC`}                                         />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 10px" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>Total You Pay</span>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.04em", background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>${totalWithFee} USDC</span>
          </div>
        </div>

        {/* Minimum guarantee highlight */}
        <div style={{ margin: "0 22px 20px", background: `linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))`, border: `1px solid rgba(255,107,53,.28)`, borderRadius: 13, padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span>🛡️</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Guaranteed Minimum</span>
          </div>
          <div style={{ fontSize: 13.5, color: C.coral, fontWeight: 700, marginBottom: 4 }}>
            ${minUSDC} USDC ({minGuarantee}% of total)
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>
            Freelancer receives at least this amount even if the project is disputed or cancelled.
          </div>
        </div>

        {/* Milestones */}
        {data.milestonesEnabled && data.milestones?.length > 0 && (
          <div style={{ margin: "0 22px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 10 }}>Milestones</div>
            {data.milestones.filter(m => m.name || m.amount).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < data.milestones.length - 1 ? `1px solid rgba(38,38,58,.5)` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg,${C.coral},${C.coralDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: C.textSub }}>{m.name || `Milestone ${i + 1}`}</span>
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{m.amount ? `$${parseFloat(m.amount).toFixed(2)} USDC` : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blockchain transparency note */}
      <div style={{
        display: "flex", gap: 14, background: "rgba(59,130,246,.08)",
        border: `1px solid rgba(59,130,246,.25)`, borderRadius: 13, padding: "15px 18px",
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⛓️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD", marginBottom: 4 }}>Blockchain Transparency</div>
          <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6 }}>
            Funds are locked in a Stellar smart contract — visible to both parties, controlled by neither until release conditions are met. <strong style={{ color: C.text }}>Freelancer is notified automatically upon funding.</strong>
          </div>
        </div>
      </div>

      {/* Checkbox confirm */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <div onClick={() => setConfirmed(!confirmed)} style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
          background: confirmed ? C.coral : "transparent",
          border: `2px solid ${confirmed ? C.coral : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s", boxShadow: confirmed ? `0 0 12px rgba(255,107,53,.35)` : "none",
          cursor: "pointer",
        }}>
          {confirmed && <span style={{ fontSize: 12, color: "#fff", fontWeight: 800 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>
          I confirm the escrow terms above and authorize Pangolin to lock <strong style={{ color: C.text }}>${totalWithFee} USDC</strong> in a Stellar smart contract upon submission.
        </span>
      </label>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <Btn variant="ghost" size="lg" onClick={onBack}>← Back</Btn>
        {txError && (
          <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#F87171", lineHeight: 1.55 }}>
            {txError}
          </div>
        )}
        <Btn variant="coral" size="xl" fullWidth disabled={!confirmed || txLoading} onClick={onSubmit}>
          {txLoading ? "⏳ Signing & Submitting…" : "🔒 Fund Escrow Now"}
        </Btn>
      </div>

      {submitError && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 12, padding: "12px 14px", color: "#F87171", fontSize: 12.5, lineHeight: 1.5 }}>
          {submitError}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted }}>
        Secured by Stellar Network · 3–5 second settlement · 2.5% total platform fee
      </div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ data, onReset, txHash }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 20, animation: "bounce-in .5s cubic-bezier(.4,0,.2,1)" }}>🎉</div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginBottom: 10 }}>Escrow Created!</div>
      <div style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 28px" }}>
        <strong style={{ color: C.text }}>{data.title}</strong> is now live.<br />
        Your freelancer has been notified and ${(parseFloat(data.totalAmount) * 1.025).toFixed(2)} USDC is locked securely on Stellar.
      </div>
      {txHash && (
        <div style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 12.5, color: "#34D399", fontFamily: "monospace", wordBreak: "break-all" }}>
          ⛓️ Tx: {txHash}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn variant="coral" size="lg" onClick={onReset}>Create Another Escrow</Btn>
        <Btn variant="ghost" size="lg" onClick={() => go("/dashboard")}>View Dashboard</Btn>
      </div>
    </div>
  );
}

// ── Root Wizard ───────────────────────────────────────────────────────────────
const INIT = {
  title: "", category: "", description: "", freelancerWallet: "",
  totalAmount: "", minGuarantee: 40, deadline: "",
  milestonesEnabled: false, milestones: [{ name: "", amount: "" }],
};

export default function PangolinEscrowWizard() {
  const { supabase, user } = useAuth();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [data, setData] = useState(INIT);
  const [txHash, setTxHash] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState(null);
  const scrollRef = useRef(null);
  const { wallet, connectWallet } = useFreighterWallet();

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const reset = () => { setStep(1); setDone(false); setData(INIT); setTxHash(null); setTxError(null); };

  const handleSubmit = async () => {
    if (!wallet.address) {
      setTxError("Connect your Freighter wallet first.");
      return;
    }
    setTxLoading(true);
    setTxError(null);
    try {
      const amountUsdc = parseAmountToInt(data.totalAmount || "0", appConfig.assetDecimals);
      const deadlineTs = data.deadline
        ? Math.floor(new Date(data.deadline).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 86400 * 30;
      const { escrowId, hash: createHash } = await createEscrow(
        wallet.address,
        data.freelancerWallet,
        amountUsdc,
        data.minGuarantee ?? 40,
        deadlineTs,
        data.title,
        data.description,
      );
      if (escrowId == null) throw new Error("Contract did not return an escrow ID. Check explorer and try again.");
      const { hash: fundHash } = await fundEscrow(wallet.address, escrowId);
      setTxHash(fundHash);
      setDone(true);
    } catch (err) {
      setTxError(err instanceof Error ? err.message : "Transaction failed. Try again.");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; }
        body { font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background: #0D0D0F; color: #F0F0F8; -webkit-font-smoothing: antialiased; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 4px; background: rgba(255,107,53,.25); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,#FF6B35,#D9521A); cursor: pointer; box-shadow: 0 4px 14px rgba(255,107,53,.5); }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        select option { background: #1D1D28; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes bounce-in { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D0D0F; }
        ::-webkit-scrollbar-thumb { background: #26263A; border-radius: 3px; }
      `}</style>

      {/* Page wrapper */}
      <div ref={scrollRef} style={{
        minHeight: "100vh", overflowY: "auto",
        background: `radial-gradient(ellipse 70% 50% at 15% 15%, rgba(255,107,53,.07) 0%, transparent 55%),
                     radial-gradient(ellipse 60% 45% at 85% 85%, rgba(59,130,246,.05) 0%, transparent 55%),
                     #0D0D0F`,
        padding: "48px 16px 80px",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "fixed", inset: 0, opacity: .018, pointerEvents: "none",
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", animation: "fade-up .35s ease" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, gap: 12 }}>
            <button onClick={() => go("/dashboard")} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "8px 14px",
              color: C.textSub, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: C.font,
              transition: "all .15s ease", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.elevated; e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
            >
              ← Dashboard
            </button>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#1D1D28,#17171F)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 20px", boxShadow: "0 0 0 1px rgba(255,107,53,.08)" }}>
              <span style={{ fontSize: 22 }}>🐧</span>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-.03em", background: "linear-gradient(135deg,#FF6B35,#FF9A6C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pangolin</span>
            </div>

            <div style={{ width: 120 }} />
          </div>

          {/* Header text */}
          {!done && (
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.textMuted, marginBottom: 8 }}>New Escrow Contract</div>
              <h1 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, marginBottom: 8 }}>
                {step === 1 ? "Define the Project" : step === 2 ? "Set Payment Terms" : "Review & Confirm"}
              </h1>
              <p style={{ fontSize: 14, color: C.textMuted }}>
                {step === 1 ? "Tell us about the commission and who you're working with." : step === 2 ? "Set the escrow amount, guarantees, and milestones." : "Double-check everything before locking funds on-chain."}
              </p>
            </div>
          )}

          {/* Main card */}
          <div style={{
            background: "linear-gradient(145deg,rgba(24,24,34,.98),rgba(17,17,25,.98))",
            border: `1px solid ${C.border}`, borderRadius: 22,
            boxShadow: "0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03)",
            padding: done ? "48px 36px" : "36px 36px 32px",
            backdropFilter: "blur(20px)",
          }}>
            {!done && <StepBar step={step} />}

            {done ? (
              <SuccessScreen data={data} onReset={reset} txHash={txHash} />
            ) : step === 1 ? (
              <Step1 data={data} setData={setData} onNext={() => setStep(2)} />
            ) : step === 2 ? (
              <Step2 data={data} setData={setData} onNext={() => setStep(3)} onBack={() => setStep(1)} />
            ) : (
              <Step3 data={data} onBack={() => setStep(2)} onSubmit={handleSubmit} txLoading={txLoading} txError={txError} />
            )}
          </div>

          {/* Footer note */}
          {!done && (
            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: C.textMuted }}>
              🔒 Secured by Stellar · End-to-end escrow protection · 2.5% platform fee
            </div>
          )}

        </div>
      </div>
    </>
  );
}
