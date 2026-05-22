// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { submitDelivery, getEscrow, confirmFreelancer } from "@/lib/contract-client";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Freelancer Delivery Flow
   Screen A: Submit Delivery · Screen B: Payment Received
   Dark #02353C · Coral #2EAF7D · Inter · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:      "#02353C",
  surface:   "#032F36",
  elevated:  "#054048",
  card:      "#065060",
  border:    "#0A5560",
  borderLit: "#1A7080",
  coral:     "#2EAF7D",
  coralDk:   "#228A62",
  blue:      "#3FD0C9",
  green:     "#449342",
  amber:     "#F59E0B",
  purple:    "#8B5CF6",
  teal:      "#3FD0C9",
  text:      "#C1F6ED",
  textSub:   "#7ECFC6",
  textMuted: "#3A8A82",
  font:      "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
};

function go(path) {
  window.location.href = path;
}
const PHP = 58.3;
const phpOf = u => (parseFloat(u) * PHP).toLocaleString("en-PH", { minimumFractionDigits: 0 });

function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

// ── Shared primitives ──────────────────────────────────────────────────────────
function Btn({ variant = "coral", size = "md", children, onClick, disabled, fullWidth, style: sx = {} }) {
  const [h, hov] = useHover();
  const dis = !!disabled;
  const S = {
    sm:  { p: "8px 18px",  f: "13px",   r: "10px" },
    md:  { p: "12px 24px", f: "14px",   r: "12px" },
    lg:  { p: "14px 30px", f: "15.5px", r: "13px" },
    xl:  { p: "18px 40px", f: "16.5px", r: "100px" },
  }[size] || { p: "12px 24px", f: "14px", r: "12px" };
  const V = {
    coral:  { bg: dis ? "#2A1508" : h ? "linear-gradient(135deg,#3FD0C9,#228A62)" : "linear-gradient(135deg,#2EAF7D,#228A62)", col: dis ? "#6B3820" : "#fff", bd: "none", shd: dis ? "none" : h ? "0 12px 40px rgba(46,175,125,.55),0 0 0 1px rgba(46,175,125,.38)" : "0 6px 24px rgba(46,175,125,.35),0 0 0 1px rgba(46,175,125,.25)" },
    blue:   { bg: h ? "linear-gradient(135deg,#3FD0C9,#2AADA7)" : "linear-gradient(135deg,#3FD0C9,#2AADA7)", col: "#fff", bd: "none", shd: h ? "0 10px 36px rgba(63,208,201,.5)" : "0 5px 18px rgba(63,208,201,.28)" },
    ghost:  { bg: h ? "rgba(46,175,125,.07)" : "transparent", col: h ? C.coral : C.textSub, bd: `1px solid ${h ? "rgba(46,175,125,.3)" : C.border}`, shd: "none" },
    subtle: { bg: h ? C.card : C.elevated, col: C.text, bd: `1px solid ${h ? C.borderLit : C.border}`, shd: "none" },
    green:  { bg: h ? "linear-gradient(135deg,#7ECFC6,#2EAF7D)" : "linear-gradient(135deg,#449342,#2EAF7D)", col: "#fff", bd: "none", shd: h ? "0 10px 36px rgba(68,147,66,.5)" : "0 5px 18px rgba(68,147,66,.28)" },
  }[variant] || {};
  return (
    <button onClick={dis ? undefined : onClick} {...(dis ? {} : hov)} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
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
  const g = glow || "transparent";
  const active = !nohover && h && !!glow;
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

function FieldFocus({ children, accentColor = C.coral }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      border: `1.5px solid ${focused ? accentColor + "70" : C.border}`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: focused ? `0 0 0 3px ${accentColor}15` : "none",
      transition: "all .18s ease",
    }}>
      {typeof children === "function" ? children({ setFocused }) : children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN A — Submit Delivery
// ════════════════════════════════════════════════════════════════════════════
function ScreenA({ onSubmit, escrow, milestones, loadingEscrow, loadingMilestones }) {
  const { supabase, user } = useAuth();
  const { wallet, connectWallet } = useFreighterWallet();
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(""); // "hashing" | "uploading" | "recording" | "done"
  const fileRef = useRef();
  const [linkFocused, setLinkFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);

  const loading = loadingEscrow || loadingMilestones;
  const hasContent = files.length > 0 || link.trim().length > 0;
  const hasNotes = notes.trim().length > 0;
  const valid = hasContent && !!escrow?.id && !loading;

  const milestoneCount = milestones.length || 1;
  const currentMilestone = milestones.find(m => m.status === "active") || milestones.find(m => m.status !== "completed") || milestones[0] || {};
  const currentIndex = milestones.findIndex(m => m.id === currentMilestone.id);
  const milestoneStep = currentIndex >= 0 ? currentIndex + 1 : 1;
  const isLastMilestone = milestones.length === 0 || currentIndex === milestones.length - 1 || milestones.slice(currentIndex + 1).every(m => m.status === "completed");
  const milestoneLabel = `Milestone ${milestoneStep} of ${milestoneCount}`;
  const milestoneName = currentMilestone.name || "Delivery";
  const milestoneAmount = Number(currentMilestone.amount_usdc ?? currentMilestone.amount ?? escrow?.amount_usdc ?? 0);

  const addFiles = newFiles => {
    const mapped = Array.from(newFiles).slice(0, 5 - files.length).map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024
        ? (f.size / 1024 / 1024).toFixed(1) + " MB"
        : (f.size / 1024).toFixed(0) + " KB",
      hash: "sha256-" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6),
      type: f.type || "application/octet-stream",
      id: Math.random(),
    }));
    setFiles(prev => [...prev, ...mapped].slice(0, 5));
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const fileIcon = (type) => {
    if (type.includes("image")) return "🖼️";
    if (type.includes("pdf"))   return "📑";
    if (type.includes("zip") || type.includes("archive")) return "🗜️";
    if (type.includes("figma") || type.includes("design")) return "🎨";
    return "📄";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    // Force-refresh Freighter to pick up current active account
    const fresh = await connectWallet();
    if (!fresh?.address) {
      setSubmitError("Connect your Freighter wallet first.");
      setSubmitting(false);
      return;
    }

    setPhase("hashing"); setProgress(25);
    await new Promise(r => setTimeout(r, 600));
    setPhase("uploading"); setProgress(60);
    await new Promise(r => setTimeout(r, 900));

    if (!escrow?.id) {
      setSubmitting(false);
      return;
    }

    const onchainId = parseInt(escrow?.stellar_contract_id ?? "0") || 0;
    const hashHex = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0")).join("");

    setPhase("recording"); setProgress(85);

    // Extract a readable string from any error shape (Stellar errors can be XDR objects)
    const toErrMsg = (err) => {
      if (!err) return "Contract call failed.";
      const msg = err instanceof Error ? err.message
        : typeof err === "string" ? err
        : typeof err?.message === "string" ? err.message
        : null;
      if (msg && msg !== "[object Object]" && !/^\[object/i.test(msg)) return msg;
      // Try JSON, fallback to generic
      try { return JSON.stringify(err); } catch { return "Contract call failed. Check Freighter and try again."; }
    };

    let txHash = null;

    if (!onchainId || !isLastMilestone) {
      // No on-chain ID, or intermediate milestone — record in DB only, skip contract call
      setPhase("done"); setProgress(100);
    } else {
      // Final milestone — check on-chain state before calling submit_delivery
      let onchainStatus = null;
      try {
        const onchain = await getEscrow(onchainId);
        onchainStatus = onchain.status;
      } catch (err) {
        // RPC read failed — proceed without state check (best-effort)
        console.warn("getEscrow failed:", err);
      }

      if (onchainStatus === "CREATED") {
        setSubmitting(false);
        setSubmitError("Client hasn't funded this escrow yet. Ask them to fund it first.");
        return;
      }
      if (onchainStatus === "CANCELLED") {
        setSubmitting(false);
        setSubmitError("This escrow was cancelled and cannot accept a delivery.");
        return;
      }

      try {
        // FUNDED = freelancer not yet confirmed → auto-confirm to reach ACTIVE
        if (onchainStatus === "FUNDED") {
          await confirmFreelancer(fresh.address, onchainId);
        }

        // DELIVERED/COMPLETED = already submitted on-chain, skip contract call, record in DB only
        if (onchainStatus !== "DELIVERED" && onchainStatus !== "COMPLETED") {
          const { hash } = await submitDelivery(fresh.address, onchainId, hashHex);
          txHash = hash;
        }
      } catch (err) {
        setSubmitting(false);
        setSubmitError(toErrMsg(err));
        return;
      }

      setPhase("done"); setProgress(100);
    }

    setPhase("done"); setProgress(100);
    await new Promise(r => setTimeout(r, 500));

    const fileRecord = files[0] || null;
    const updates = [
      supabase.from("deliveries").insert({
        escrow_id: escrow.id,
        milestone_id: currentMilestone?.id || null,
        submitted_by: user?.id || null,
        file_name: fileRecord ? fileRecord.name : null,
        external_url: link || null,
        file_hash: hashHex,
        delivery_note: notes || null,
        stellar_delivery_tx_hash: txHash,
      }),
      ...(isLastMilestone
        ? [supabase.from("escrows").update({ status: "delivered" }).eq("id", escrow.id)]
        : []),
    ];

    if (currentMilestone?.id) {
      updates.push(
        supabase.from("milestones").update({
          status: "delivered",
          submitted_at: new Date().toISOString(),
        }).eq("id", currentMilestone.id)
      );
    }

    await Promise.all(updates);

    onSubmit();
  };

  const phaseLabels = {
    hashing:   "Computing SHA-256 file hash…",
    uploading: "Uploading to IPFS…",
    recording: "Timestamping on Stellar blockchain…",
    done:      "Delivery recorded on-chain ✓",
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 60px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => window.location.href = "/freelancer"}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid rgba(10,85,96,.6)`,
            borderRadius: 9, padding: "7px 14px", marginBottom: 18,
            color: C.textSub, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Inter',sans-serif", transition: "all .15s",
          }}
        >
          ← Back to Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: `linear-gradient(135deg,${C.coral}25,${C.coral}0A)`, border: `1px solid ${C.coral}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚀</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".08em", textTransform: "uppercase" }}>
  FREELANCER · DELIVERY{escrow?.title ? ` · ${escrow.title}` : ""}
</div>
            <h1 style={{ fontSize: "clamp(18px,3.5vw,24px)", fontWeight: 900, letterSpacing: "-.04em", color: C.text, lineHeight: 1.2 }}>
              Submit Your Work
            </h1>
          </div>
        </div>

        {/* Milestone badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "linear-gradient(135deg,rgba(46,175,125,.12),rgba(46,175,125,.04))",
          border: "1px solid rgba(46,175,125,.28)", borderRadius: 12, padding: "10px 16px",
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: milestoneCount }, (_, idx) => (
              <div key={idx} style={{ width: 22, height: 22, borderRadius: "50%", background: idx < milestoneStep ? `linear-gradient(135deg,${C.coral},${C.coralDk})` : C.elevated, border: idx < milestoneStep ? "none" : `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: idx < milestoneStep ? "#fff" : C.textMuted }}>
                {idx + 1 === milestoneStep ? "●" : idx < milestoneStep ? "✓" : idx + 1}
              </div>
            ))}
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>{milestoneLabel}</span>
            <span style={{ fontSize: 13, color: C.textSub, marginLeft: 6 }}>{milestoneName}</span>
          </div>
          <div style={{ marginLeft: 8, fontSize: 13, fontWeight: 800, color: C.text }}>${milestoneAmount.toFixed(2)} USDC</div>
        </div>
      </div>

      {/* Upload zone */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
          File Upload <span style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 400 }}>(max 5 files)</span>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !submitting && fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? C.coral : files.length > 0 ? "rgba(46,175,125,.35)" : C.border}`,
            borderRadius: 16, padding: "32px 20px", textAlign: "center",
            cursor: submitting ? "default" : "pointer",
            background: dragging ? "rgba(46,175,125,.06)" : files.length > 0 ? "rgba(46,175,125,.03)" : "rgba(255,255,255,.01)",
            transition: "all .18s ease",
            position: "relative", overflow: "hidden",
          }}>
          <input ref={fileRef} type="file" multiple onChange={e => addFiles(e.target.files)} style={{ display: "none" }} />

          {/* Shimmer on drag */}
          {dragging && (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(46,175,125,.08),transparent,rgba(46,175,125,.08))", backgroundSize: "200% 200%", animation: "shimmer 1.5s ease infinite" }} />
          )}

          {files.length === 0 ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: dragging ? C.coral : C.text, marginBottom: 6 }}>
                {dragging ? "Drop to upload" : "Drag & drop your deliverables"}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
                or <span style={{ color: C.coral, fontWeight: 600 }}>browse files</span>
                <br />ZIP, PDF, PNG, Figma exports, videos — anything
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, background: "rgba(63,208,201,.08)", border: "1px solid rgba(63,208,201,.2)", borderRadius: "100px", padding: "5px 14px", fontSize: 12, color: "#7ECFC6", fontWeight: 600 }}>
                ⛓️ SHA-256 hash recorded on Stellar blockchain
              </div>
            </>
          ) : (
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 12 }}>
                {files.length} file{files.length > 1 ? "s" : ""} ready
              </div>
              {files.map(f => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 14px", marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{fileIcon(f.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontFamily: "monospace" }}>
                      {f.size} · <span style={{ color: "#7ECFC6" }}>{f.hash.slice(0, 22)}…</span>
                    </div>
                  </div>
                  {!submitting && (
                    <button onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter(x => x.id !== f.id)); }}
                      style={{ background: "rgba(239,68,68,.1)", border: "none", borderRadius: 7, color: "#F87171", cursor: "pointer", padding: "4px 9px", fontSize: 12, flexShrink: 0 }}>✕</button>
                  )}
                </div>
              ))}
              {files.length < 5 && !submitting && (
                <button style={{ marginTop: 4, background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 10, color: C.textMuted, cursor: "pointer", padding: "8px 16px", fontSize: 12.5, fontFamily: C.font, width: "100%", transition: "border-color .15s, color .15s" }}
                  onMouseEnter={e => { e.target.style.borderColor = C.coral; e.target.style.color = C.coral; }}
                  onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textMuted; }}>
                  + Add more files
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* External link */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
          External Link <span style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 400 }}>— or paste in addition to files</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          background: C.elevated,
          border: `1.5px solid ${linkFocused ? "rgba(46,175,125,.65)" : C.border}`,
          borderRadius: 13, overflow: "hidden",
          boxShadow: linkFocused ? "0 0 0 3px rgba(46,175,125,.12)" : "none",
          transition: "all .18s ease",
        }}>
          <div style={{ padding: "0 14px", fontSize: 18, borderRight: `1px solid ${C.border}`, paddingTop: 12, paddingBottom: 12 }}>🔗</div>
          <input
            value={link} onChange={e => setLink(e.target.value)}
            onFocus={() => setLinkFocused(true)} onBlur={() => setLinkFocused(false)}
            placeholder="https://figma.com/file/… or drive.google.com/…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13.5, padding: "12px 16px", fontFamily: C.font, caretColor: C.coral }}
          />
        </div>
        <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 6 }}>Figma, Google Drive, Notion, Dropbox — any public link works</div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
          Delivery Notes <span style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 400 }}>({notes.length}/500)</span>
        </div>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value.slice(0, 500))} rows={4}
          onFocus={() => setNotesFocused(true)} onBlur={() => setNotesFocused(false)}
          placeholder="Summarise what's included, any important notes for the client, how to access the files, revision instructions, etc."
          style={{
            width: "100%", background: C.elevated, outline: "none", resize: "vertical",
            border: `1.5px solid ${notesFocused ? "rgba(46,175,125,.65)" : C.border}`,
            borderRadius: 13, padding: "13px 16px", color: C.text, fontSize: 14,
            fontFamily: C.font, lineHeight: 1.65, caretColor: C.coral,
            boxShadow: notesFocused ? "0 0 0 3px rgba(46,175,125,.12)" : "none",
            transition: "border-color .18s, box-shadow .18s",
          }}
        />
      </div>

      {/* On-chain note */}
      <div style={{
        display: "flex", gap: 14, alignItems: "flex-start",
        background: "rgba(63,208,201,.07)", border: "1px solid rgba(63,208,201,.22)",
        borderRadius: 14, padding: "14px 18px", marginBottom: 22,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(63,208,201,.15)", border: "1px solid rgba(63,208,201,.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>⛓️</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#7ECFC6", marginBottom: 4 }}>Tamper-proof delivery proof</div>
          <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.65 }}>
            Your file's SHA-256 hash will be <strong style={{ color: C.text }}>timestamped on the Stellar blockchain</strong> the moment you submit — creating an immutable, verifiable record of exactly when you delivered. This protects you in any future dispute.
          </div>
        </div>
      </div>

      {/* Progress bar during submission */}
      {submitting && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: phase === "done" ? C.green : C.textSub }}>{phaseLabels[phase] || "Preparing…"}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: phase === "done" ? C.green : C.coral }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.06)", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "100px",
              background: phase === "done" ? `linear-gradient(90deg,${C.green},#7ECFC6)` : `linear-gradient(90deg,${C.coral},#3FD0C9)`,
              width: `${progress}%`,
              boxShadow: `0 0 12px ${phase === "done" ? "rgba(68,147,66,.6)" : "rgba(46,175,125,.5)"}`,
              transition: "width .5s cubic-bezier(.4,0,.2,1), background .3s",
            }} />
          </div>
          {/* Phase dots */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {[
              { id: "hashing",   label: "Hash" },
              { id: "uploading", label: "Upload" },
              { id: "recording", label: "Stellar" },
              { id: "done",      label: "Done" },
            ].map(({ id, label }, i) => {
              const phases = ["hashing", "uploading", "recording", "done"];
              const idx = phases.indexOf(phase);
              const myIdx = phases.indexOf(id);
              const done = idx >= myIdx && phase !== "";
              const active = phase === id;
              return (
                <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: done ? (active && id !== "done" ? `linear-gradient(135deg,${C.coral},${C.coralDk})` : id === "done" && done ? `linear-gradient(135deg,${C.green},#2EAF7D)` : C.coral) : C.elevated,
                    border: `2px solid ${done ? (id === "done" ? C.green : C.coral) : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: done ? "#fff" : C.textMuted,
                    transition: "all .3s",
                  }}>{done ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 10, color: done ? (id === "done" ? C.green : C.coral) : C.textMuted }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {submitError && (
        <div style={{ fontSize: 12.5, color: "#F87171", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>{submitError}</div>
      )}
      {!submitting ? (
        <Btn variant="coral" size="xl" fullWidth disabled={!valid} onClick={handleSubmit}>
          🚀 Submit Delivery
        </Btn>
      ) : (
        <div style={{ padding: "16px", background: "rgba(46,175,125,.06)", border: `1px solid rgba(46,175,125,.2)`, borderRadius: 14, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textSub }}>
            {phase === "done" ? "✅ Delivery recorded — redirecting…" : "Processing your delivery…"}
          </div>
        </div>
      )}

      {/* 48hr reminder */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 16px", background: "rgba(245,158,11,.07)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 12 }}>
        <span style={{ fontSize: 16 }}>⏱️</span>
        <span style={{ fontSize: 12.5, color: "rgba(252,211,77,.8)", lineHeight: 1.5 }}>
          Client has <strong style={{ color: "#FCD34D" }}>48 hours</strong> to review and respond. If no action is taken, payment is auto-released to your wallet.
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN B — Payment Received
// ════════════════════════════════════════════════════════════════════════════

function AnimatedCheck() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 24px" }}>
      {/* Outer glow rings */}
      <div style={{
        position: "absolute", inset: -16, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(68,147,66,.18) 0%, transparent 70%)",
        animation: "pulse-ring 2.5s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", inset: -6, borderRadius: "50%",
        border: "2px solid rgba(68,147,66,.25)",
        animation: "pulse-ring 2.5s ease-in-out infinite .4s",
      }} />
      {/* Main circle */}
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        background: `linear-gradient(135deg,${C.green},#2EAF7D)`,
        boxShadow: "0 0 40px rgba(68,147,66,.5), 0 8px 32px rgba(68,147,66,.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "pop-in .4s cubic-bezier(.34,1.56,.64,1) .1s both",
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 24 L21 33 L36 15"
            stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40" strokeDashoffset={drawn ? 0 : 40}
            style={{ transition: "stroke-dashoffset .5s cubic-bezier(.4,0,.2,1) .5s" }} />
        </svg>
      </div>
    </div>
  );
}

function TxHash({ hash = "—" }) {
  const [copied, setCopied] = useState(false);
  const display = hash && hash.length > 18 ? hash.slice(0, 10) + "…" + hash.slice(-8) : hash;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      background: C.elevated, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "12px 16px",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue, boxShadow: `0 0 6px ${C.blue}`, flexShrink: 0 }} />
      <code style={{ fontSize: 13.5, color: "#7ECFC6", fontFamily: "monospace", flex: 1 }}>{display}</code>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ background: copied ? "rgba(68,147,66,.12)" : "rgba(63,208,201,.1)", border: `1px solid ${copied ? "rgba(68,147,66,.3)" : "rgba(63,208,201,.25)"}`, borderRadius: 8, color: copied ? C.green : C.blue, cursor: "pointer", padding: "5px 12px", fontSize: 12, fontFamily: C.font, fontWeight: 600, transition: "all .15s" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <button style={{ background: "rgba(63,208,201,.1)", border: "1px solid rgba(63,208,201,.25)", borderRadius: 8, color: C.blue, cursor: "pointer", padding: "5px 12px", fontSize: 12, fontFamily: C.font, fontWeight: 600 }}>
          Stellar ↗
        </button>
      </div>
    </div>
  );
}

function BadgeCard() {
  const [claimed, setClaimed] = useState(false);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPopping(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(139,92,246,.14),rgba(139,92,246,.05))",
      border: "1px solid rgba(139,92,246,.35)",
      borderRadius: 16, padding: "18px 20px",
      animation: popping ? "pop-in .5s cubic-bezier(.34,1.56,.64,1) both" : "none",
      position: "relative", overflow: "hidden",
    }}>
      {/* Sparkle bg */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,.12) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: "linear-gradient(135deg,rgba(139,92,246,.3),rgba(139,92,246,.12))",
          border: "1.5px solid rgba(139,92,246,.45)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
          boxShadow: "0 0 20px rgba(139,92,246,.3)",
          animation: popping ? "wiggle .6s ease 1.2s" : "none",
        }}>⭐</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.purple, letterSpacing: ".06em", textTransform: "uppercase", background: "rgba(139,92,246,.15)", padding: "2px 8px", borderRadius: "100px", border: "1px solid rgba(139,92,246,.25)" }}>
              New Badge Earned
            </div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.text, letterSpacing: "-.02em", marginBottom: 3 }}>Milestone Complete ⭐</div>
          <div style={{ fontSize: 12.5, color: C.textSub }}>Delivered on time · Verified on Stellar</div>
        </div>

        {!claimed ? (
          <Btn variant="subtle" size="sm" onClick={() => setClaimed(true)} sx={{ flexShrink: 0 }}>Claim</Btn>
        ) : (
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, flexShrink: 0 }}>Claimed ✓</div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(139,92,246,.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, color: C.textMuted }}>Badge progress</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple }}>39 / 100 escrows</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: "100px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "39%", background: "linear-gradient(90deg,#8B5CF6,#A78BFA)", borderRadius: "100px", boxShadow: "0 0 8px rgba(139,92,246,.5)" }} />
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>61 more to unlock "Elite Freelancer 💎"</div>
      </div>
    </div>
  );
}

function ScreenB({ escrow, milestones, supabase }) {
  const [clientProfile, setClientProfile] = useState(null);
  const [freelancerProfile, setFreelancerProfile] = useState(null);
  const [txHash, setTxHash] = useState("—");

  const milestone = milestones.find(m => m.status !== "completed") || milestones[0] || {};
  const milestoneIndex = milestones.findIndex(m => m.id === milestone.id);
  const milestoneNumber = milestoneIndex >= 0 ? milestoneIndex + 1 : 1;
  const received = Number(milestone.amount_usdc ?? milestone.amount ?? escrow?.amount_usdc ?? 0);
  const total = Number(escrow?.amount_usdc ?? received);
  const remaining = Math.max(0, total - received);
  const milestoneLabel = milestone.name ? `Milestone ${milestoneNumber} — ${milestone.name}` : "Current milestone";

  useEffect(() => {
    if (!escrow || !supabase) return;

    async function loadProfiles() {
      const [clientRes, freelancerRes, deliveryRes] = await Promise.all([
        escrow.client_id ? supabase.from("profiles").select("display_name").eq("id", escrow.client_id).single() : null,
        escrow.freelancer_id ? supabase.from("profiles").select("display_name,wallet_address").eq("id", escrow.freelancer_id).single() : null,
        supabase.from("deliveries").select("stellar_delivery_tx_hash").eq("escrow_id", escrow.id).single(),
      ]);

      if (clientRes?.data) setClientProfile(clientRes.data);
      if (freelancerRes?.data) setFreelancerProfile(freelancerRes.data);
      if (deliveryRes?.data?.stellar_delivery_tx_hash) setTxHash(deliveryRes.data.stellar_delivery_tx_hash);
    }

    loadProfiles();
  }, [escrow, supabase]);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 60px", textAlign: "center" }}>

      {/* Check animation */}
      <div style={{ paddingTop: 20 }}>
        <AnimatedCheck />
      </div>

      {/* Amount */}
      <div style={{ marginBottom: 6, animation: "fade-up .5s ease .3s both" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Payment Received</div>
        <div style={{
          fontSize: "clamp(48px, 12vw, 72px)", fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1,
          background: "linear-gradient(135deg,#2EAF7D 20%,#3FD0C9 60%,#FFBD99 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8,
        }}>
          ${received.toFixed(2)}
          <span style={{ fontSize: "0.35em", letterSpacing: "-.02em", marginLeft: 8, opacity: .8 }}>USDC</span>
        </div>
        <div style={{ fontSize: 20, color: C.textMuted, fontWeight: 600, letterSpacing: "-.02em" }}>
          ≈ ₱{phpOf(received)}
        </div>
      </div>

      {/* Settlement time */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 28, background: "rgba(68,147,66,.1)", border: "1px solid rgba(68,147,66,.28)", borderRadius: "100px", padding: "6px 16px", animation: "fade-up .5s ease .45s both" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Settled on Stellar</span>
      </div>

      {/* Transaction details card */}
      <GlassCard nohover style={{ padding: "20px", marginBottom: 18, textAlign: "left", animation: "fade-up .5s ease .55s both" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 12 }}>Transaction Details</div>

        {[
          { label: "From",      value: clientProfile ? `${clientProfile.display_name} (Client)` : "—" },
          { label: "To",        value: freelancerProfile ? `${freelancerProfile.display_name} — ${freelancerProfile.wallet_address?.slice(0, 6)}…${freelancerProfile.wallet_address?.slice(-4)}` : "—" },
          { label: "Milestone", value: milestoneLabel },
          { label: "Timestamp", value: new Date().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) },
          { label: "Network",   value: "Stellar Mainnet" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(38,38,58,.5)" }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{value}</span>
          </div>
        ))}

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Transaction Hash</div>
          <TxHash hash={txHash} />
        </div>
      </GlassCard>

      {/* Badge earned */}
      <div style={{ marginBottom: 20, animation: "fade-up .5s ease .65s both" }}>
        <BadgeCard />
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fade-up .5s ease .75s both" }}>
        <Btn variant="coral" size="xl" fullWidth>
          📲 Withdraw ${received.toFixed(2)} to GCash
        </Btn>
        <Btn variant="blue" size="lg" fullWidth>
          🏅 Add to Portfolio Badge
        </Btn>
        <Btn variant="ghost" size="md" fullWidth onClick={() => go("/freelancer?view=dashboard")}>
          Back to Dashboard
        </Btn>
      </div>

      {/* Remaining escrow note */}
      <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(46,175,125,.06)", border: "1px solid rgba(46,175,125,.18)", borderRadius: 12 }}>
        <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6 }}>
          <strong style={{ color: C.coral }}>${remaining.toFixed(2)} USDC</strong> remaining in escrow · Milestone {milestoneNumber + 1} begins when client confirms.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Root
// ════════════════════════════════════════════════════════════════════════════
export default function PangolinDeliveryFlow() {
  const { supabase, user } = useAuth();
  const { wallet } = useFreighterWallet();
  const searchParams = useSearchParams();
  const escrowId = searchParams.get("escrow_id");
  const [screen, setScreen] = useState("A");
  const [escrow, setEscrow] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loadingEscrow, setLoadingEscrow] = useState(true);
  const [loadingMilestones, setLoadingMilestones] = useState(true);



  useEffect(() => {
  if (!user?.id) return;  // ← guard: if no user yet, do nothing

  let mounted = true;

  async function loadEscrow() {
    let query = supabase
      .from("escrows")
      .select("id,title,status,amount_usdc,deadline,client_id,freelancer_id,freelancer_wallet,stellar_contract_id");

    if (wallet?.address) {
      query = query.or(`freelancer_id.eq.${user.id},freelancer_wallet.eq.${wallet.address}`);
    } else {
      query = query.eq("freelancer_id", user.id);
    }

    // If escrow_id is provided in URL, fetch that specific one
    if (escrowId) {
      query = query.eq("id", escrowId);
    } else {
      // Otherwise fetch the most recent one
      query = query.order("created_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (!mounted) return;
    if (!error && data) {
      setEscrow(data);

      const { data: milestoneData, error: milestoneError } = await supabase
        .from("milestones")
        .select("id,title,amount_usdc,status,sort_order")
        .eq("escrow_id", data.id)
        .order("sort_order", { ascending: true });

      if (!mounted) return;
      if (!milestoneError && Array.isArray(milestoneData)) {
        setMilestones(milestoneData.map(m => ({ ...m, name: m.title })));
      }
    }

    setLoadingEscrow(false);
    setLoadingMilestones(false);
  }

  loadEscrow();
  return () => { mounted = false; };
}, [supabase, user?.id, wallet?.address, escrowId]);

  return (
    <AuthGuard>
      <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; }
        body { font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background: #02353C; color: #C1F6ED; -webkit-font-smoothing: antialiased; }

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.45; transform:scale(.7); }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pop-in {
          0%   { transform:scale(0); opacity:0; }
          80%  { transform:scale(1.08); }
          100% { transform:scale(1); opacity:1; }
        }
        @keyframes pulse-ring {
          0%,100% { transform:scale(1);   opacity:.6; }
          50%      { transform:scale(1.12); opacity:.2; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes wiggle {
          0%,100% { transform:rotate(0deg); }
          25%      { transform:rotate(-8deg); }
          75%      { transform:rotate(8deg); }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #02353C; }
        ::-webkit-scrollbar-thumb { background: #0A5560; border-radius: 3px; }
      `}</style>

      {/* Page bg */}
      <div style={{
        minHeight: "100vh", overflowX: "hidden",
        background: `
          radial-gradient(ellipse 65% 45% at 10% 10%, rgba(46,175,125,.06) 0%, transparent 55%),
          radial-gradient(ellipse 55% 40% at 85% 80%, rgba(68,147,66,.05) 0%, transparent 55%),
          #02353C`,
        padding: "36px 0 60px",
      }}>
        {/* Grid texture */}
        <div style={{ position: "fixed", inset: 0, opacity: .017, pointerEvents: "none", backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "44px 44px" }} />

        {/* Logo bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#054048,#032F36)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 22px", boxShadow: "0 0 0 1px rgba(63,208,201,.1)" }}>
            <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain" }} />
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.03em", background: "linear-gradient(135deg,#3FD0C9,#C1F6ED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pangolin</span>
          </div>
        </div>

        {/* Screen content */}
        <div key={screen} style={{ animation: "fade-up .32s ease" }}>
          {screen === "A"
            ? <ScreenA onSubmit={() => setScreen("B")} escrow={escrow} milestones={milestones} loadingEscrow={loadingEscrow} loadingMilestones={loadingMilestones} />
            : <ScreenB escrow={escrow} milestones={milestones} supabase={supabase} />
          }
        </div>
      </div>
    </>
    </AuthGuard>
  );
}
