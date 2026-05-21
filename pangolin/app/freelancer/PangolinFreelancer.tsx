// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { confirmFreelancer, getEscrow } from "@/lib/contract-client";
import { useProfile } from "@/hooks/useProfile";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Freelancer Screens (A: Invite Landing · B: Dashboard)
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
  pink:      "#EC4899",
  red:       "#EF4444",
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
const formatUsd = v => Number(v ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

// ── Shared primitives ──────────────────────────────────────────────────────
function Btn({ variant = "coral", size = "md", children, onClick, disabled, fullWidth, style: sx = {} }) {
  const [h, hov] = useHover();
  const dis = !!disabled;
  const S = {
    sm:  { p: "8px 18px",  f: "12.5px", r: "10px" },
    md:  { p: "11px 22px", f: "14px",   r: "12px" },
    lg:  { p: "14px 30px", f: "15px",   r: "13px" },
    xl:  { p: "17px 38px", f: "16.5px", r: "100px" },
  }[size];
  const V = {
    coral: { bg: h ? "linear-gradient(135deg,#3FD0C9,#228A62)" : "linear-gradient(135deg,#2EAF7D,#228A62)", col: "#fff", bd: "none", shd: h ? "0 12px 40px rgba(46,175,125,.55),0 0 0 1px rgba(46,175,125,.38)" : "0 6px 24px rgba(46,175,125,.35),0 0 0 1px rgba(46,175,125,.25)" },
    ghost: { bg: h ? "rgba(46,175,125,.07)" : "transparent", col: h ? C.coral : C.textSub, bd: `1px solid ${h ? "rgba(46,175,125,.3)" : C.border}`, shd: "none" },
    subtle:{ bg: h ? C.card : C.elevated, col: C.text, bd: `1px solid ${h ? C.borderLit : C.border}`, shd: "none" },
    blue:  { bg: h ? "linear-gradient(135deg,#3FD0C9,#2AADA7)" : "linear-gradient(135deg,#3FD0C9,#2AADA7)", col: "#fff", bd: "none", shd: h ? "0 10px 32px rgba(63,208,201,.5)" : "0 5px 18px rgba(63,208,201,.3)" },
    green: { bg: h ? "linear-gradient(135deg,#7ECFC6,#2EAF7D)" : "linear-gradient(135deg,#449342,#2EAF7D)", col: "#fff", bd: "none", shd: h ? "0 10px 32px rgba(68,147,66,.5)" : "0 5px 18px rgba(68,147,66,.3)" },
    red:   { bg: h ? "rgba(239,68,68,.14)" : "transparent", col: "#F87171", bd: `1px solid ${h ? "rgba(239,68,68,.4)" : "rgba(239,68,68,.25)"}`, shd: "none" },
  }[variant] || {};
  return (
    <button onClick={dis ? undefined : onClick} {...(dis ? {} : hov)} style={{
      display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
      fontFamily:C.font,fontWeight:700,cursor:dis?"not-allowed":"pointer",
      transition:"all .17s cubic-bezier(.4,0,.2,1)",
      transform:!dis&&h?"translateY(-1px)":"none",
      width:fullWidth?"100%":"auto",
      padding:S.p,fontSize:S.f,borderRadius:S.r,
      background:V.bg,color:V.col,border:V.bd||"none",boxShadow:V.shd||"none",
      letterSpacing:"-.01em",whiteSpace:"nowrap",...sx,
    }}>{children}</button>
  );
}

function GlassCard({ children, glow, style: sx = {}, nohover }) {
  const [h, hov] = useHover();
  const g = glow || "transparent";
  const active = !nohover && h;
  return (
    <div {...(nohover ? {} : hov)} style={{
      background:"linear-gradient(145deg,rgba(26,26,38,.97),rgba(18,18,28,.97))",
      border:`1px solid ${active && glow ? glow+"50" : C.border}`,
      borderRadius:18,
      boxShadow:active&&glow?`0 0 0 1px ${g}18,0 20px 60px rgba(0,0,0,.5),0 0 40px ${g}10`:"0 6px 28px rgba(0,0,0,.4)",
      transform:active?"translateY(-2px)":"none",
      transition:"all .22s cubic-bezier(.4,0,.2,1)",
      position:"relative",overflow:"hidden",...sx,
    }}>
      {glow&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${g}35,transparent)`,opacity:active?1:0,transition:"opacity .22s"}}/>}
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  const M = {
    "In Progress":  { bg:"rgba(63,208,201,.14)",  bd:"rgba(63,208,201,.35)",  tx:"#7ECFC6", dot:C.blue   },
    "Under Review": { bg:"rgba(245,158,11,.14)",  bd:"rgba(245,158,11,.35)",  tx:"#FCD34D", dot:C.amber  },
    "Delivered":    { bg:"rgba(46,175,125,.14)",  bd:"rgba(46,175,125,.35)",  tx:"#FF8C5A", dot:C.coral  },
    "Completed":    { bg:"rgba(68,147,66,.14)",  bd:"rgba(68,147,66,.35)",  tx:"#7ECFC6", dot:C.green  },
    "Disputed":     { bg:"rgba(239,68,68,.14)",   bd:"rgba(239,68,68,.35)",   tx:"#F87171", dot:C.red    },
    "Pending":      { bg:"rgba(76,76,100,.22)",   bd:"rgba(76,76,100,.4)",    tx:C.textMuted,dot:C.textMuted },
  };
  const s = M[status] || M["Pending"];
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:"100px",fontSize:12,fontWeight:700,background:s.bg,border:`1px solid ${s.bd}`,color:s.tx,whiteSpace:"nowrap" }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:s.dot,boxShadow:`0 0 6px ${s.dot}`,display:"inline-block",animation:status==="In Progress"?"pulse-dot 2s ease-in-out infinite":"none" }}/>
      {status}
    </span>
  );
}

function Avatar({ initials, size = 44, color = C.coral, emoji }) {
  return (
    <div style={{ width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}28,${color}10)`,border:`2px solid ${color}45`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:emoji?size*.45:size*.34,fontWeight:700,color,flexShrink:0 }}>
      {emoji || initials}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN A — Invite Landing Page
// ════════════════════════════════════════════════════════════════════════════
const BADGES = [
  { icon: "⭐", label: "Top Rated",     color: "#F59E0B", desc: "Maintained 4.8+ rating",      earned: true  },
  { icon: "🚀", label: "Fast Delivery", color: "#3FD0C9", desc: "Delivered ahead of deadline",  earned: true  },
  { icon: "🔒", label: "Trusted",       color: "#449342", desc: "10+ completed escrows",        earned: false },
];

const DEFAULT_TOTAL_USDC = 1600;
const DEFAULT_MIN_PCT = 60;
const DEFAULT_MIN_USDC = DEFAULT_TOTAL_USDC * DEFAULT_MIN_PCT / 100;
const DEFAULT_MILESTONES_INVITE = [];

function ScreenA({ onAccept, inviteData, walletAddress }) {
  const [declining, setDeclining] = useState(false);
  const [accepted,  setAccepted]  = useState(false);
  const [accepting,  setAccepting]  = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const { connectWallet } = useFreighterWallet();
  const escrowOnchainId = inviteData?.escrowOnchainId ?? 0;
  const {
    clientName = "Client",
    projectTitle = "Website Redesign — Full Stack",
    category = "UI/UX Design",
    totalUsdc = DEFAULT_TOTAL_USDC,
    deadline = "TBD",
    milestones = DEFAULT_MILESTONES_INVITE,
    minPct = DEFAULT_MIN_PCT,
    minUsdc = DEFAULT_MIN_USDC,
    clientCompletedEscrows = 0,
  } = inviteData || {};
  const clientInitials = (clientName || "CL")
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAccept = async () => {
    setAccepting(true);
    setAcceptError(null);
    try {
      // Activate Freighter to sign — verify the address matches the linked wallet
      const fresh = await connectWallet();
      if (!fresh?.address) {
        setAcceptError("Open Freighter to sign the transaction.");
        return;
      }
      if (walletAddress && fresh.address !== walletAddress) {
        setAcceptError("Wrong wallet active in Freighter. Switch to your linked wallet and try again.");
        return;
      }
      // Check on-chain status — skip confirm_freelancer if already Active or beyond
      const onchain = await getEscrow(escrowOnchainId);
      if (onchain.status === "FUNDED" || onchain.status === "CREATED") {
        await confirmFreelancer(fresh.address, escrowOnchainId);
      }
      setAccepted(true);
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setAccepting(false);
    }
  };

  if (accepted) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px" }}>
        <div style={{ fontSize:60, marginBottom:20 }}>🎉</div>
        <div style={{ fontSize:26,fontWeight:900,letterSpacing:"-.04em",color:C.text,marginBottom:10 }}>You're in!</div>
        <div style={{ fontSize:15,color:C.textSub,lineHeight:1.7,maxWidth:400,margin:"0 auto 28px" }}>
          Your wallet is connected. <strong style={{color:C.text}}>{clientName}</strong> has been notified and the escrow will be funded shortly.
        </div>
        <Btn variant="coral" size="xl" onClick={onAccept}>Continue to Dashboard →</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:620,margin:"0 auto",padding:"0 16px 60px" }}>

      {/* Logo */}
      <div style={{ display:"flex",justifyContent:"center",marginBottom:36 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,#054048,#032F36)",border:`1px solid ${C.border}`,borderRadius:14,padding:"10px 22px",boxShadow:"0 0 0 1px rgba(63,208,201,.1)" }}>
          <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain" }} />
          <span style={{ fontSize:18,fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#3FD0C9,#C1F6ED)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Pangolin</span>
        </div>
      </div>

      {/* Client intro */}
      <div style={{ textAlign:"center",marginBottom:32 }}>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:16,position:"relative",width:72,margin:"0 auto 16px" }}>
          <Avatar initials={clientInitials} size={72} color={C.blue} />
          <div style={{ position:"absolute",bottom:-2,right:-2,width:22,height:22,borderRadius:"50%",background:C.green,border:`2px solid ${C.base}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>✓</div>
        </div>
        <div style={{ fontSize:13,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:6 }}>Project Invitation</div>
        <h1 style={{ fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:"-.04em",color:C.text,lineHeight:1.2,marginBottom:6 }}>
          <span style={{ background:"linear-gradient(135deg,#7ECFC6,#3FD0C9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{clientName}</span>{" "}wants to work with you
        </h1>
        <div style={{ fontSize:13.5,color:C.textMuted }}>Verified client · {clientCompletedEscrows} completed escrows</div>
      </div>

      {/* Project card */}
      <GlassCard nohover glow={C.coral} style={{ marginBottom:16 }}>
        {/* Header */}
        <div style={{ padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
            <div>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:4 }}>Project</div>
              <div style={{ fontSize:18,fontWeight:800,letterSpacing:"-.03em",color:C.text }}>{projectTitle}</div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(63,208,201,.12)",border:"1px solid rgba(63,208,201,.28)",borderRadius:"100px",padding:"3px 11px",fontSize:12,fontWeight:700,color:C.blue,marginTop:8 }}>{category || "General"}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4 }}>Total Escrow</div>
              <div style={{ fontSize:30,fontWeight:900,letterSpacing:"-.05em",background:"linear-gradient(135deg,#2EAF7D,#3FD0C9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>${formatUsd(totalUsdc)}</div>
              <div style={{ fontSize:12.5,color:C.textMuted }}>≈ ₱{phpOf(totalUsdc)}</div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ padding:"16px 24px",borderBottom:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {[
            { label:"Deadline",       value:deadline },
            { label:"Structure",      value:"Milestone-based" },
            { label:"Auto-release",   value:"48 hrs after delivery" },
            { label:"Platform fee",   value:"2.5% (paid by client)" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13.5,fontWeight:600,color:C.text }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div style={{ padding:"16px 24px 0",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:".05em",textTransform:"uppercase",marginBottom:12 }}>Milestones</div>
          {milestones.map((m, i) => (
            <div key={m.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<milestones.length-1?`1px solid rgba(38,38,58,.5)`:"none" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${C.coral},${C.coralDk})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13.5,color:C.textSub }}>{m.name}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:14,fontWeight:700,color:C.text }}>${formatUsd(m.amount)} USDC</div>
                <div style={{ fontSize:11,color:C.textMuted }}>≈ ₱{phpOf(m.amount || 0)}</div>
              </div>
            </div>
          ))}
          <div style={{ paddingBottom:16 }}/>
        </div>

        {/* Guaranteed minimum — hero feature */}
        <div style={{ margin:"0",background:"linear-gradient(135deg,rgba(46,175,125,.12),rgba(46,175,125,.04))",borderTop:"none",borderRadius:"0 0 18px 18px",padding:"18px 24px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
            <span style={{ fontSize:20 }}>🛡️</span>
            <span style={{ fontSize:13.5,fontWeight:800,color:C.text }}>Your Guaranteed Minimum</span>
            <div style={{ marginLeft:"auto",padding:"3px 10px",borderRadius:"100px",fontSize:11,fontWeight:700,background:"rgba(46,175,125,.18)",border:"1px solid rgba(46,175,125,.32)",color:C.coral }}>Pangolin Promise</div>
          </div>
          <div style={{ fontSize:26,fontWeight:900,letterSpacing:"-.04em",color:C.coral,marginBottom:6 }}>
            ${formatUsd(minUsdc)} USDC <span style={{ fontSize:15,color:"rgba(46,175,125,.7)" }}>({minPct}% of total)</span>
          </div>
          <div style={{ fontSize:13,color:C.textSub,lineHeight:1.65 }}>
            Even if the client disputes or cancels, Pangolin's smart contract <strong style={{ color:C.text }}>guarantees you receive at least ${formatUsd(minUsdc)} USDC</strong> — automatically, no questions asked. ≈ ₱{phpOf(minUsdc)}
          </div>
        </div>
      </GlassCard>

      {/* Stellar security note */}
      <div style={{ background:"rgba(63,208,201,.08)",border:"1px solid rgba(63,208,201,.25)",borderRadius:14,padding:"14px 18px",marginBottom:24,display:"flex",gap:14,alignItems:"center" }}>
        <div style={{ width:36,height:36,borderRadius:10,background:"rgba(63,208,201,.15)",border:"1px solid rgba(63,208,201,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>⛓️</div>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:"#7ECFC6",marginBottom:3 }}>Secured by Stellar blockchain</div>
          <div style={{ fontSize:12.5,color:C.textSub,lineHeight:1.55 }}>
            Funds are locked in a verifiable smart contract — not held by Pangolin. 3–5 second settlement. Your wallet, your money.
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Btn variant="coral" size="xl" fullWidth onClick={handleAccept} disabled={accepting}>
          {accepting ? "⏳ Signing…" : "✅ Accept Invitation"}
        </Btn>
        {acceptError && (
          <div style={{ fontSize: 12.5, color: "#F87171", textAlign: "center", marginTop: 4 }}>{acceptError}</div>
        )}

        {!declining ? (
          <Btn variant="ghost" size="lg" fullWidth onClick={() => setDeclining(true)}>
            Decline invitation
          </Btn>
        ) : (
          <div style={{ background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.25)",borderRadius:12,padding:"14px 18px",textAlign:"center" }}>
            <div style={{ fontSize:13.5,fontWeight:700,color:"#F87171",marginBottom:6 }}>Are you sure?</div>
            <div style={{ fontSize:12.5,color:C.textMuted,marginBottom:14 }}>{clientName} will be notified you've declined. This invite link will expire.</div>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <Btn variant="red" size="sm" onClick={() => {}}>Yes, Decline</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setDeclining(false)}>Go back</Btn>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center",marginTop:16,fontSize:12,color:C.textMuted }}>
        🐧 Pangolin · Zero trust needed — just blockchain · 2.5% flat fee charged to client
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN B — Freelancer Dashboard
// ════════════════════════════════════════════════════════════════════════════
function UsdcTrustlineBanner({ walletAddress }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const CONTRACT = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

  useEffect(() => {
    if (!walletAddress) return;
    fetch(`https://horizon-testnet.stellar.org/accounts/${walletAddress}`)
      .then(r => r.json())
      .then(data => {
        const hasUsdc = data.balances?.some((b: any) => b.asset_code === "USDC");
        if (!hasUsdc) setShow(true);
      })
      .catch(() => {});
  }, [walletAddress]);

  if (!show) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(245,158,11,.10),rgba(245,158,11,.04))",
      border: "1px solid rgba(245,158,11,.35)",
      borderRadius: 16, padding: "16px 20px",
      marginBottom: 20, display: "flex", gap: 14,
      alignItems: "flex-start",
    }}>
      <div style={{ fontSize: 22, marginTop: 2 }}>⚠️</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 4 }}>
          USDC Trustline Required
        </div>
        <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 12 }}>
          Your wallet can't receive USDC payments yet. Add the USDC token in Freighter under{" "}
          <strong style={{ color: C.text }}>Manage Assets → Add by Contract ID</strong>.
        </div>
        <div style={{
          background: C.elevated, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          marginBottom: 12,
        }}>
          <code style={{ fontSize: 11.5, color: C.coral, fontFamily: "monospace", wordBreak: "break-all" }}>
            {CONTRACT}
          </code>
          <button onClick={handleCopy} style={{
            background: copied ? "rgba(46,175,125,.15)" : C.card,
            border: `1px solid ${copied ? "rgba(46,175,125,.4)" : C.border}`,
            borderRadius: 8, padding: "5px 12px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, color: copied ? C.coral : C.textSub,
            fontFamily: C.font, whiteSpace: "nowrap", flexShrink: 0,
            transition: "all .17s ease",
          }}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn variant="subtle" size="sm" onClick={() => setShow(false)}>Dismiss</Btn>
          <span style={{ fontSize: 12, color: C.textMuted }}>After adding, refresh the page to dismiss automatically.</span>
        </div>
      </div>
    </div>
  );
}
const getNavItems = (jobCount = 0, messageCount = 0) => [
  { id:"dashboard",  icon:"⊞",  label:"Dashboard" },
  { id:"jobs",       icon:"💼", label:"Active Jobs",    badge: jobCount > 0 ? jobCount : undefined },
  { id:"earnings",   icon:"💰", label:"Earnings" },
  { id:"messages",   icon:"💬", label:"Messages",       badge: messageCount > 0 ? messageCount : undefined },
  { id:"reputation", icon:"⭐", label:"Reputation" },
  { id:"portfolio",  icon:"🎨", label:"Portfolio" },
  { id:"settings",   icon:"⚙️", label:"Settings" },
];

const ACTIVE_JOBS = [];

function SidebarItem({ icon, label, badge, active, collapsed, onClick }) {
  const [h, hov] = useHover();
  return (
    <button onClick={onClick} {...hov} style={{
      display:"flex",alignItems:"center",gap:10,
      padding:collapsed?"10px 12px":"10px 13px",
      borderRadius:11,border:"none",cursor:"pointer",
      background:active?"linear-gradient(135deg,rgba(46,175,125,.16),rgba(46,175,125,.06))":h?"rgba(255,255,255,.04)":"transparent",
      boxShadow:active?"inset 0 0 0 1px rgba(46,175,125,.25)":"none",
      transition:"all .15s ease",width:"100%",textAlign:"left",
      justifyContent:collapsed?"center":"flex-start",position:"relative",fontFamily:C.font,
    }}>
      <span style={{ fontSize:17,flexShrink:0 }}>{icon}</span>
      {!collapsed && <span style={{ fontSize:13.5,fontWeight:active?700:500,color:active?C.coral:h?C.text:C.textSub,transition:"color .15s",whiteSpace:"nowrap" }}>{label}</span>}
      {!collapsed && badge && <span style={{ marginLeft:"auto",background:C.coral,color:"#fff",borderRadius:"100px",fontSize:10.5,fontWeight:800,padding:"2px 7px",boxShadow:"0 2px 8px rgba(46,175,125,.4)" }}>{badge}</span>}
      {collapsed && badge && <div style={{ position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.coral,boxShadow:`0 0 6px ${C.coral}` }}/>}
    </button>
  );
}

function Sidebar({ collapsed, onToggle, active, setActive, freelancerName = "Freelancer", jobCount = 0, messageCount = 0, wallet = null, onConnect = null, isMobile, onClose, onLogout }) {
  const W = collapsed ? 64 : 228;
  const navItems = getNavItems(jobCount, messageCount);
  return (
    <aside className={isMobile ? "mobile-sidebar-inner" : "desktop-sidebar"} style={{ width:isMobile ? "240px" : W,minWidth:isMobile ? "240px" : W,maxWidth:isMobile ? "240px" : W,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:isMobile ? "none" : "width .22s cubic-bezier(.4,0,.2,1), min-width .22s, max-width .22s",overflow:"hidden",flexShrink:0,zIndex:20,height:"100%" }}>
      {/* Logo */}
      <div style={{ height:62,display:"flex",alignItems:"center",padding:(collapsed && !isMobile)?"0 0 0 16px":"0 16px",borderBottom:`1px solid ${C.border}`,gap:10,flexShrink:0 }}>
        <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain",flexShrink:0 }} />
        {(!collapsed || isMobile) && <span style={{ fontSize:17,fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#3FD0C9,#C1F6ED)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap" }}>Pangolin</span>}
        <button onClick={isMobile ? onClose : onToggle} style={{ marginLeft:"auto",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:16,flexShrink:0,padding:"4px 6px",borderRadius:8 }}>
          {isMobile ? "✕" : collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Freelancer badge */}
      {(!collapsed || isMobile) && (
        <div style={{ margin:"12px 8px 4px",background:"rgba(46,175,125,.08)",border:"1px solid rgba(46,175,125,.22)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
          <Avatar initials={freelancerName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "FL"} size={30} color={C.coral} />
          <div>
            <div style={{ fontSize:12.5,fontWeight:700,color:C.text }}>{freelancerName}</div>
            <div style={{ fontSize:11,color:C.coral,fontWeight:600 }}>Freelancer</div>
          </div>
        </div>
      )}

      <nav style={{ flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2 }}>
        {navItems.map(({ id, icon, label, badge }) => (
          <SidebarItem key={id} icon={icon} label={label} badge={badge} active={active===id} collapsed={isMobile ? false : collapsed} onClick={() => { setActive(id); if (isMobile && onClose) onClose(); }} />
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:"0 8px 10px",flexShrink:0 }}>
        {(collapsed && !isMobile) ? (
          <button onClick={onLogout} title="Log out" style={{ width:40,height:40,borderRadius:12,margin:"0 auto",background:"transparent",border:`1px solid rgba(239,68,68,.2)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",color:"#EF4444" }}>↩</button>
        ) : (
          <button onClick={onLogout} style={{ width:"100%",padding:"9px 14px",borderRadius:11,background:"transparent",border:`1px solid rgba(239,68,68,.2)`,color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:C.font,display:"flex",alignItems:"center",gap:8 }}>
            <span>↩</span> Log Out
          </button>
        )}
      </div>

      {/* Wallet */}
      <div style={{ padding:"12px 8px",borderTop:`1px solid ${C.border}`,flexShrink:0 }}>
        {(collapsed && !isMobile) ? (
          <div style={{ width:40,height:40,borderRadius:12,margin:"0 auto",background:`rgba(46,175,125,.12)`,border:`1px solid rgba(46,175,125,.28)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer" }}>🔗</div>
        ) : (
          <div style={{ background:"linear-gradient(135deg,rgba(46,175,125,.1),rgba(46,175,125,.04))",border:"1px solid rgba(46,175,125,.28)",borderRadius:13,padding:"11px 14px" }}>
            <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:5 }}>Connected Wallet</div>
            {wallet?.address ? (
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}` }}/>
                <span style={{ fontSize:12.5,fontWeight:700,color:C.text,fontFamily:"monospace" }}>{wallet.address.slice(0,4)}…{wallet.address.slice(-4)}</span>
              </div>
            ) : (
              <button onClick={() => { if (onConnect) onConnect(); if (isMobile && onClose) onClose(); }} style={{ fontSize:12,color:C.coral,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"0 0 10px",fontFamily:C.font }}>Connect Wallet →</button>
            )}
            <Btn variant="coral" size="sm" sx={{ width:"100%",justifyContent:"center" }}>GCash Withdraw</Btn>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, sub, color = C.coral, trend }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      background:h?"linear-gradient(135deg,rgba(28,28,38,.98),rgba(22,22,32,.98))":"linear-gradient(135deg,rgba(24,24,32,.96),rgba(18,18,26,.96))",
      border:`1px solid ${h?color+"45":C.border}`,borderRadius:17,padding:"20px 22px",
      transition:"all .22s cubic-bezier(.4,0,.2,1)",transform:h?"translateY(-3px)":"none",
      boxShadow:h?`0 16px 48px rgba(0,0,0,.5),0 0 32px ${color}10`:"0 4px 20px rgba(0,0,0,.3)",
      position:"relative",overflow:"hidden",flex:"1 1 150px",minWidth:140,
    }}>
      <div style={{ position:"absolute",top:-20,right:-20,width:90,height:90,background:`radial-gradient(circle,${color}14,transparent 70%)`,opacity:h?1:.5,transition:"opacity .22s" }}/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,position:"relative" }}>
        <div style={{ width:40,height:40,borderRadius:12,background:`${color}16`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{icon}</div>
        {trend!==undefined && <span style={{ fontSize:11.5,fontWeight:700,color:trend>0?C.green:C.red,background:trend>0?"rgba(68,147,66,.12)":"rgba(239,68,68,.12)",border:`1px solid ${trend>0?"rgba(68,147,66,.3)":"rgba(239,68,68,.3)"}`,padding:"3px 9px",borderRadius:"100px" }}>{trend>0?"↑":"↓"} {Math.abs(trend)}%</span>}
      </div>
      <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:5,position:"relative" }}>{label}</div>
      <div style={{ fontSize:26,fontWeight:900,letterSpacing:"-.04em",marginBottom:3,position:"relative",background:`linear-gradient(135deg,${C.text},${color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{value}</div>
      {sub && <div style={{ fontSize:12,color:C.textMuted,position:"relative" }}>{sub}</div>}
    </div>
  );
}

function BadgeShowcase() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <GlassCard nohover glow={C.purple} style={{ padding:"24px 26px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:16,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>Badge Showcase</div>
          <div style={{ fontSize:12.5,color:C.textMuted,marginTop:2 }}>Earned through verified work · shareable on any platform</div>
        </div>
        <Btn variant="subtle" size="sm" onClick={handleCopy}>
          {copied ? "✓ Copied!" : "🔗 Share All"}
        </Btn>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginTop:18 }}>
        {BADGES.map(({ icon, label, color, desc, earned }) => (
          <BadgePill key={label} icon={icon} label={label} color={color} desc={desc} earned={earned} />
        ))}
      </div>

      <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,fontSize:12,color:C.textMuted,textAlign:"center" }}>
        6 earned · 2 locked · Badges are verifiable on Stellar ⛓️
      </div>
    </GlassCard>
  );
}

function BadgePill({ icon, label, color, desc, earned }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{
      display:"flex",flexDirection:"column",gap:8,
      padding:"14px 14px",borderRadius:14,cursor:earned?"pointer":"default",
      background:earned?h?`${color}14`:`${color}0A`:"rgba(255,255,255,.02)",
      border:`1px solid ${earned?h?`${color}45`:`${color}25`:C.border}`,
      transition:"all .18s ease",transform:earned&&h?"translateY(-2px)":"none",
      opacity:earned?1:.45,
      boxShadow:earned&&h?`0 8px 24px ${color}20`:"none",
      position:"relative",overflow:"hidden",
    }}>
      {earned && h && <div style={{ position:"absolute",top:-10,right:-10,width:60,height:60,background:`radial-gradient(circle,${color}15,transparent 70%)` }}/>}
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:34,height:34,borderRadius:10,background:`${color}${earned?"20":"10"}`,border:`1px solid ${color}${earned?"35":"18"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{icon}</div>
        {!earned && <div style={{ fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",background:C.elevated,padding:"2px 6px",borderRadius:5 }}>Locked</div>}
      </div>
      <div>
        <div style={{ fontSize:13,fontWeight:700,color:earned?C.text:C.textMuted,marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:11.5,color:C.textMuted,lineHeight:1.4 }}>{desc}</div>
      </div>
      {earned && (
        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 5px ${color}` }}/>
          <span style={{ fontSize:11,fontWeight:700,color }}>Verified</span>
        </div>
      )}
    </div>
  );
}

function EarningsSummary({ totalUsdc = 3150, thisMonth = 1240, pendingRelease = 0, jobsDone = "0", avgRating = "N/A", responseRate = "N/A" }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <GlassCard nohover glow={C.green} style={{ padding:"24px 26px" }}>
      <div style={{ fontSize:16,fontWeight:800,color:C.text,letterSpacing:"-.02em",marginBottom:20 }}>Earnings Summary</div>

      <div style={{ display:"flex",gap:14,marginBottom:20,flexWrap:"wrap" }}>
        {[
          { label:"This Month",       value:`$${thisMonth.toLocaleString()}`, sub:`≈ ₱${phpOf(thisMonth)}`, color:C.coral  },
          { label:"All Time (USDC)",  value:`$${formatUsd(totalUsdc)}`, sub:`≈ ₱${phpOf(totalUsdc)}`, color:C.green  },
          { label:"Pending Release",  value:`$${formatUsd(pendingRelease)}`, sub:`≈ ₱${phpOf(pendingRelease)}`, color:C.amber  },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ flex:"1 1 130px",background:C.elevated,border:`1px solid ${C.border}`,borderRadius:13,padding:"14px 16px" }}>
            <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",marginBottom:6 }}>{label}</div>
            <div style={{ fontSize:20,fontWeight:900,letterSpacing:"-.03em",background:`linear-gradient(135deg,${color},${color}AA)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{value}</div>
            <div style={{ fontSize:11.5,color:C.textMuted,marginTop:3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* GCash withdrawal */}
      {!done ? (
        !withdrawing ? (
          <Btn variant="coral" size="lg" fullWidth onClick={() => setWithdrawing(true)}>
            📲 Withdraw ${formatUsd(thisMonth)} to GCash
          </Btn>
        ) : (
          <div style={{ background:"linear-gradient(135deg,rgba(46,175,125,.1),rgba(46,175,125,.04))",border:"1px solid rgba(46,175,125,.28)",borderRadius:14,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:800,color:C.text,marginBottom:4 }}>Confirm Withdrawal</div>
            <div style={{ fontSize:13,color:C.textSub,marginBottom:14,lineHeight:1.6 }}>
              Withdraw <strong style={{ color:C.text }}>${formatUsd(thisMonth)} USDC</strong> → <strong style={{ color:C.text }}>₱{phpOf(thisMonth)}</strong> to GCash <code style={{ fontSize:12,color:C.coral,fontFamily:"monospace" }}>+63 917 *** 4821</code>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <Btn variant="coral" size="md" fullWidth onClick={() => setDone(true)}>Confirm</Btn>
              <Btn variant="ghost" size="md" onClick={() => setWithdrawing(false)}>Cancel</Btn>
            </div>
          </div>
        )
      ) : (
        <div style={{ textAlign:"center",padding:"16px 0" }}>
          <div style={{ fontSize:28,marginBottom:8 }}>✅</div>
          <div style={{ fontSize:14,fontWeight:700,color:C.green }}>Withdrawal initiated — arrives in ~3 seconds</div>
        </div>
      )}

      <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,display:"flex",gap:20,flexWrap:"wrap" }}>
        {[["Jobs Done",jobsDone],["Avg Rating",avgRating],["Response Rate",responseRate]].map(([l,v])=>(
          <div key={l}>
            <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:16,fontWeight:800,color:C.text }}>{v}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function WorkProof({ portfolioLink = "pangolin.gg/verify/freelancer" }) {
  const [copied, setCopied] = useState(false);
  const link = portfolioLink;
  return (
    <GlassCard nohover glow={C.teal} style={{ padding:"22px 24px" }}>
      <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:16 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:`rgba(20,184,166,.14)`,border:`1px solid rgba(20,184,166,.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🔏</div>
        <div>
          <div style={{ fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>Verified Portfolio Link</div>
          <div style={{ fontSize:12.5,color:C.textMuted,marginTop:2,lineHeight:1.55 }}>Share this link with potential clients — it proves your completed escrows, ratings, and badges are real and on-chain.</div>
        </div>
      </div>

      <div style={{ display:"flex",gap:10,alignItems:"center",background:C.elevated,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 16px",marginBottom:14 }}>
        <div style={{ width:8,height:8,borderRadius:"50%",background:C.teal,boxShadow:`0 0 6px ${C.teal}`,flexShrink:0 }}/>
        <code style={{ fontSize:13,color:C.teal,fontFamily:"monospace",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{link}</code>
        <button onClick={() => { setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ background:"none",border:"none",cursor:"pointer",color:copied?C.green:C.textMuted,fontSize:13,fontFamily:C.font,fontWeight:600,flexShrink:0,transition:"color .15s" }}>
          {copied?"✓ Copied!":"Copy"}
        </button>
      </div>

      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {["Copy Link","Share to LinkedIn","Download PDF"].map(label => (
          <Btn key={label} variant="subtle" size="sm">{label}</Btn>
        ))}
      </div>
    </GlassCard>
  );
}

const DONE_STATUSES = ["Completed", "completed", "COMPLETED"];

function JobsTableBody({ rows }) {
  if (!rows.length) return (
    <div style={{ padding:"28px 22px",textAlign:"center",color:C.textMuted,fontSize:13 }}>No jobs here yet.</div>
  );
  return (
    <div style={{ overflowX:"auto" }}>
      <div style={{ minWidth:780 }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1.4fr 1.5fr 1fr 1.1fr 1.2fr",padding:"11px 22px",borderBottom:`1px solid ${C.border}`,background:"rgba(255,255,255,.02)" }}>
          {["Project","Client","Status","Amount","Due Date","Action"].map(h => (
            <div key={h} style={{ fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:".05em",textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>
        {rows.map((row, i) => <JobRow key={i} row={row} last={i===rows.length-1} />)}
      </div>
    </div>
  );
}

function ActiveJobsTable({ jobs, count, onViewAll, showAll }) {
  const active = jobs.filter(j => !DONE_STATUSES.includes(j.status));
  const done   = jobs.filter(j =>  DONE_STATUSES.includes(j.status));
  return (
    <>
      <GlassCard nohover style={{ padding:0,overflow:"hidden",marginBottom:done.length ? 16 : 0 }}>
        <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>Active Jobs</div>
            <div style={{ fontSize:12.5,color:C.textMuted,marginTop:2 }}>{active.length} contracts in progress</div>
          </div>
          {!showAll && (
            <Btn variant="ghost" size="sm" onClick={onViewAll}>View All →</Btn>
          )}
        </div>
        <JobsTableBody rows={active} />
      </GlassCard>

      {done.length > 0 && (
        <GlassCard nohover style={{ padding:0,overflow:"hidden" }}>
          <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div>
              <div style={{ fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>✅ Done</div>
              <div style={{ fontSize:12.5,color:C.textMuted,marginTop:2 }}>{done.length} completed · funds released</div>
            </div>
          </div>
          <JobsTableBody rows={done} />
        </GlassCard>
      )}
    </>
  );
}

function JobRow({ row, last }) {
  const router = useRouter();
  const [h, hov] = useHover();
  const isActionable = row.action === "Submit Delivery";
  const handleNavigate = () => {
    const id = row.escrowId || row.id;
    if (id) {
      router.push(`/delivery?escrow_id=${id}`);
    }
  };
  return (
    <div {...hov} style={{
      display:"grid",gridTemplateColumns:"2fr 1.4fr 1.5fr 1fr 1.1fr 1.2fr",
      padding:"14px 22px",alignItems:"center",
      borderBottom:last?"none":`1px solid rgba(38,38,58,.6)`,
      background:h?"rgba(255,255,255,.016)":"transparent",
      transition:"background .15s",
    }}>
      <div>
        <div
          style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:2,cursor:"pointer" }}
          onClick={handleNavigate}
        >{row.project}</div>
        <div style={{ fontSize:11.5,color:C.textMuted }}>#{row.contractRef || "PGL-" + String(row.project || "").length}</div>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <Avatar initials={row.client.initials} size={30} color={row.client.color} />
        <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{row.client.name || row.client.initials}</span>
      </div>
      <div><StatusPill status={row.status} /></div>
      <div>
        <div style={{ fontSize:14,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>${row.amount}</div>
        <div style={{ fontSize:11,color:C.textMuted }}>USDC</div>
      </div>
      <div style={{ fontSize:13,color:C.textSub }}>{row.due}</div>
      <div>
        {isActionable ? (
          <Btn variant="coral" size="sm" onClick={handleNavigate}>
  {row.action}
</Btn>
        ) : (
          <Btn variant="subtle" size="sm" onClick={handleNavigate}>{row.action}</Btn>
        )}
      </div>
    </div>
  );
}

function ScreenB({ onSwitchToInvite = null, hasInvite = false }) {
  const { supabase, user } = useAuth();
  const { wallet, connectWallet } = useFreighterWallet();
  const { profile, saveWalletAddress } = useProfile();
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };
  const [deliveries, setDeliveries] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [jobs, setJobs] = useState(ACTIVE_JOBS);
  const [jobCount, setJobCount] = useState(ACTIVE_JOBS.length);
  const [freelancerName, setFreelancerName] = useState("Freelancer");
  const [earningsThisMonth, setEarningsThisMonth] = useState(0);
  const [earningsTotal, setEarningsTotal] = useState(0);
  const [pendingRelease, setPendingRelease] = useState(0);
  const [statsCompleted, setStatsCompleted] = useState("0");
  const [statsRating] = useState(0);
  const [portfolioLink, setPortfolioLink] = useState("pangolin.gg/verify/freelancer");
  const [responseRate, setResponseRate] = useState("N/A");
  const [showAllJobs, setShowAllJobs] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      // Only fetch jobs assigned to this freelancer's wallet if wallet is connected
      if (wallet?.status !== "connected" || !wallet?.address) {
        setJobs([]);
        setJobCount(0);
        return;
      }

      let query = supabase
        .from("escrows")
        .select("id,title,status,amount_usdc,deadline,freelancer_wallet,client_id,created_at,completed_at")
        .eq("freelancer_wallet", wallet.address)
        .order("created_at", { ascending: false });

      // Apply limit only when not viewing all
      if (!showAllJobs) {
        query = query.limit(6);
      }

      const { data, error } = await query;

      if (!mounted) return;
      if (!error && data?.length) {
        const clientIds = [...new Set((data || []).map(row => row.client_id).filter(Boolean))];
        const { data: clients } = clientIds.length
          ? await supabase.from("profiles").select("id,display_name").in("id", clientIds)
          : { data: [] };
        const clientMap = {};
        (clients || []).forEach(c => { clientMap[c.id] = c.display_name || "Client"; });

        const mapped = data.map(row => {
          const initials = row.freelancer_wallet
            ? row.freelancer_wallet.slice(2, 4).toUpperCase()
            : "CL";
          const status = row.status || "In Progress";
          return {
            escrowId: row.id,
            project: row.title || "Escrow Project",
            client: {
              initials,
              color: status === "Under Review" ? C.amber : status === "Delivered" ? C.pink : C.blue,
              name: clientMap[row.client_id] || "Client",
            },
            status,
            amount: row.amount_usdc ?? 0,
            contractRef: row.id ? `PGL-${String(row.id).slice(0, 6).toUpperCase()}` : undefined,
            due: row.deadline ? new Date(row.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
            action: status === "Under Review" ? "Submit Delivery" : status === "Delivered" ? "Awaiting Approval" : "View",
          };
        });

        setJobs(mapped);
        setJobCount(mapped.length);
        setPendingRelease(
          mapped
            .filter(job => job.status === "Delivered" || job.status === "Under Review")
            .reduce((sum, job) => sum + Number(job.amount || 0), 0)
        );
        setStatsCompleted(String((data || []).filter(row => row.status === "completed").length));

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const allEscrows = data;

        const monthTotal = allEscrows
          .filter(e =>
            e.status === "completed" &&
            e.completed_at &&
            new Date(e.completed_at).getMonth() === currentMonth &&
            new Date(e.completed_at).getFullYear() === currentYear
          )
          .reduce((sum, e) => sum + Number(e.amount_usdc || 0), 0);

        const allTimeTotal = allEscrows
          .filter(e => e.status === "completed")
          .reduce((sum, e) => sum + Number(e.amount_usdc || 0), 0);

        const pendingTotal = allEscrows
          .filter(e => e.status === "delivered")
          .reduce((sum, e) => sum + Number(e.amount_usdc || 0), 0);

        setEarningsThisMonth(monthTotal);
        setEarningsTotal(allTimeTotal);
        setPendingRelease(pendingTotal);
      }

      if (user?.id) {
        const { data: me } = await supabase
          .from("profiles")
          .select("id,display_name")
          .eq("id", user.id)
          .single();
        if (me?.display_name) {
          setFreelancerName(me.display_name);
          setPortfolioLink(`pangolin.gg/verify/${me.display_name.toLowerCase().replace(/\s+/g, "-")}-${user.id.slice(0, 6)}`);
        }
      }
    }

    loadJobs();
    if (user?.id) {
      supabase.from("deliveries").select("delivery_note,created_at").eq("submitted_by", user.id)
        .order("created_at", { ascending: false }).limit(5)
        .then(({ data }) => { if (mounted && data) setDeliveries(data); });
    }
    return () => { mounted = false; };
  }, [supabase, user?.id, wallet, showAllJobs]);

  return (
    <>
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
          {freelancerName.substring(0, 2).toUpperCase() || "FL"}
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
          freelancerName={freelancerName}
          jobCount={jobCount}
          messageCount={0}
          wallet={wallet}
          onConnect={async () => {
            const snap = await connectWallet();
            if (snap.status === "connected" && snap.address) {
              await saveWalletAddress(snap.address);
            }
          }}
          isMobile={true}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      <div className="dashboard-main-container">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} active={active} setActive={setActive} freelancerName={freelancerName} jobCount={jobCount} messageCount={0} wallet={wallet} onConnect={async () => { const snap = await connectWallet(); if (snap.status === "connected" && snap.address) { await saveWalletAddress(snap.address); } }} isMobile={false} onLogout={handleLogout} />

        <main style={{
          flex:1,overflowY:"auto",overflowX:"hidden",
          background:`radial-gradient(ellipse 60% 40% at 70% 10%, rgba(46,175,125,.05) 0%, transparent 60%),radial-gradient(ellipse 50% 40% at 20% 80%, rgba(20,184,166,.04) 0%, transparent 60%),${C.base}`,
        }}>
          <div className="dashboard-inner-wrapper" style={{ maxWidth:1060,margin:"0 auto",padding:"28px 28px 60px" }}>

            {/* Greeting */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:16 }}>
              <div>
                <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:5 }}>Freelancer Dashboard</div>
                <h1 style={{ fontSize:"clamp(20px,3vw,28px)",fontWeight:900,letterSpacing:"-.04em",color:C.text }}>Welcome back, {freelancerName.split(" ")[0] || "Freelancer"} 👋</h1>
              </div>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                {hasInvite && onSwitchToInvite && (
                  <div style={{ display:"flex",gap:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:4 }}>
                    <button onClick={onSwitchToInvite} style={{ padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:C.font,background:"transparent",color:C.textMuted,fontSize:12,fontWeight:500 }}>🔗 Invite</button>
                    <button style={{ padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:C.font,background:"linear-gradient(135deg,rgba(46,175,125,.2),rgba(46,175,125,.08))",boxShadow:"inset 0 0 0 1px rgba(46,175,125,.28)",color:C.coral,fontSize:12,fontWeight:700 }}>📊 Dashboard</button>
                  </div>
                )}
                <FreelancerNotifBell profile={profile} deliveries={deliveries} />
                <Btn variant="coral" size="md" onClick={() => window.location.href = "/delivery"}>+ Submit New Delivery</Btn>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"flex",gap:14,marginBottom:24,flexWrap:"wrap" }}>
              <UsdcTrustlineBanner walletAddress={wallet?.address} />
              <StatCard icon="💰" label="Earnings This Month" value={`$${formatUsd(earningsThisMonth)}`} sub={`≈ ₱${phpOf(earningsThisMonth)}`} color={C.coral} trend={18} />
              <StatCard icon="💼" label="Active Jobs"         value={String(jobCount)} sub="From your latest escrows" color={C.blue} />
              <StatCard icon="✅" label="Completed"           value={statsCompleted} sub="All time" color={C.green} trend={5} />
              <StatCard icon="⭐" label="Reputation Score"    value={statsRating} sub="Based on finished jobs" color={C.amber} />
            </div>

            {/* Active jobs table */}
            <div style={{ marginBottom:22 }}>
              <ActiveJobsTable jobs={jobs} count={jobCount} onViewAll={() => setShowAllJobs(true)} showAll={showAllJobs} />
            </div>

            {/* Bottom row */}
            <div className="freelancer-bottom-grid" style={{ display:"grid",gap:18,marginBottom:22 }}>
              <EarningsSummary totalUsdc={earningsTotal} thisMonth={earningsThisMonth} pendingRelease={pendingRelease} jobsDone={statsCompleted} avgRating={statsRating} responseRate={responseRate} />
              <WorkProof portfolioLink={portfolioLink} />
            </div>

            {/* Badge showcase */}
            <BadgeShowcase />
          </div>
        </main>
      </div>
    </>
  );
}

// ── Freelancer Notification Bell ──────────────────────────────────────────────
function FreelancerNotifBell({ profile, deliveries = [] }) {
  const [open, setOpen] = useState(false);
  const [h, hov] = useHover();

  const items = [
    ...(profile?.wallet_address ? [{
      icon: "🔒",
      color: "#2EAF7D",
      title: "Wallet linked",
      sub: `${profile.wallet_address.slice(0, 6)}…${profile.wallet_address.slice(-6)}`,
    }] : [{
      icon: "⚠️",
      color: "#F59E0B",
      title: "No wallet linked",
      sub: "Connect Freighter to receive payments",
    }]),
    ...deliveries.slice(0, 5).map(d => ({
      icon: "📦",
      color: "#3FD0C9",
      title: "Task submitted",
      sub: d.delivery_note ? d.delivery_note.slice(0, 50) : "Delivery uploaded",
    })),
  ];

  const hasUnread = !profile?.wallet_address || deliveries.length > 0;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        {...hov}
        onClick={() => setOpen(o => !o)}
        style={{
          cursor: "pointer",
          width: 36, height: 36, borderRadius: 10,
          background: h || open ? C.elevated : "rgba(17,17,22,.9)",
          border: `1px solid ${open ? C.borderLit : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s", fontSize: 16, position: "relative",
        }}
      >
        🔔
        {hasUnread && (
          <div style={{
            position: "absolute", top: 5, right: 5,
            width: 8, height: 8, borderRadius: "50%",
            background: C.coral, border: `2px solid ${C.surface}`,
            boxShadow: `0 0 6px ${C.coral}`,
          }} />
        )}
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            width: 280, zIndex: 999,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            boxShadow: "0 16px 48px rgba(0,0,0,.5)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 14px 8px",
              borderBottom: `1px solid ${C.border}`,
              fontSize: 12, fontWeight: 700, color: C.textSub,
              letterSpacing: ".04em", textTransform: "uppercase",
            }}>Notifications</div>
            {items.length === 0 ? (
              <div style={{ padding: "18px 14px", fontSize: 13, color: C.textMuted, textAlign: "center" }}>
                No notifications yet
              </div>
            ) : (
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 9,
                    padding: "10px 14px",
                    borderBottom: i < items.length - 1 ? `1px solid rgba(10,85,96,.4)` : "none",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                      background: `${item.color}18`, border: `1px solid ${item.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{item.title}</div>
                      {item.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, lineHeight: 1.4 }}>{item.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Root — screen switcher
// ════════════════════════════════════════════════════════════════════════════
export default function PangolinFreelancer() {
  const { supabase, user } = useAuth();
  const { wallet, connectWallet: rootConnectWallet, disconnectWallet: rootDisconnectWallet } = useFreighterWallet();
  const { profile, loading: profileLoading, saveWalletAddress } = useProfile();
  const [screen, setScreen] = useState("LOADING");
  const [inviteData, setInviteData] = useState(null);
  const [walletError, setWalletError] = useState("");
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };

  useEffect(() => {
    if (profileLoading) return;
    let mounted = true;

    if (!profile?.wallet_address) {
      setScreen("WALLET");
      return;
    }

    async function run() {
      // Find escrow addressed to this wallet that is pending freelancer acceptance
      const { data: escrow } = await supabase
        .from("escrows")
        .select("id,title,category,amount_usdc,min_guarantee_pct,min_guarantee_usdc,deadline,client_id,stellar_contract_id")
        .eq("freelancer_wallet", profile.wallet_address)
        .eq("status", "created")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (escrow) {
        const { data: client } = escrow.client_id
          ? await supabase.from("profiles").select("display_name").eq("id", escrow.client_id).single()
          : { data: null };
        const { count: clientEscrowCount } = escrow.client_id
          ? await supabase.from("escrows").select("id", { count: "exact", head: true }).eq("client_id", escrow.client_id)
          : { count: 0 };
        const { data: milestoneRows } = await supabase
          .from("milestones")
          .select("title,amount_usdc,sort_order")
          .eq("escrow_id", escrow.id)
          .order("sort_order", { ascending: true });

        if (!mounted) return;

        const totalUsdc = Number(escrow.amount_usdc || 0);
        const minPct = Number(escrow.min_guarantee_pct || 0);
        const minUsdc = Number(escrow.min_guarantee_usdc ?? ((totalUsdc * minPct) / 100));
        setInviteData({
          clientName: client?.display_name || "Client",
          projectTitle: escrow.title || "Escrow Project",
          category: escrow.category || "General",
          totalUsdc,
          deadline: escrow.deadline ? new Date(escrow.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
          milestones: (milestoneRows || []).map(m => ({ name: m.title, amount: Number(m.amount_usdc || 0) })),
          minPct,
          minUsdc,
          clientCompletedEscrows: clientEscrowCount || 0,
          escrowOnchainId: parseInt(escrow.stellar_contract_id ?? "0") || 0,
        });
        setScreen("A");
      } else {
        setScreen("B");
      }

    }

    run();
    return () => { mounted = false; };
  }, [supabase, user?.id, profile?.wallet_address, profileLoading]);

  return (
    <AuthGuard>
      <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; height: 100%; }
        body { font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background: #02353C; color: #C1F6ED; -webkit-font-smoothing: antialiased; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #032F36; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #02353C; }
        ::-webkit-scrollbar-thumb { background: #0A5560; border-radius: 3px; }

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
            display: flex;
            height: 100vh;
            overflow: hidden;
            background: #02353C;
            flex-direction: column !important;
          }
          .dashboard-inner-wrapper {
            padding: 20px 16px 60px !important;
          }
          .freelancer-bottom-grid {
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
          .dashboard-main-container {
            display: flex;
            height: 100vh;
            overflow: hidden;
            background: #02353C;
          }
          .freelancer-bottom-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {screen === "LOADING" && (
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#02353C" }}>
          <div style={{ width:36,height:36,borderRadius:"50%",border:`3px solid rgba(63,208,201,.2)`,borderTop:`3px solid #3FD0C9`,animation:"spin .7s linear infinite" }} />
        </div>
      )}

      {screen === "WALLET" && (
        <div style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          background:`radial-gradient(ellipse 70% 50% at 50% 30%, rgba(63,208,201,.06) 0%, transparent 60%), #02353C`,
          padding:"40px 24px",
        }}>
          <div style={{ width:"100%", maxWidth:400, textAlign:"center" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,#054048,#032F36)",border:`1px solid rgba(10,85,96,.8)`,borderRadius:14,padding:"10px 22px",boxShadow:"0 0 0 1px rgba(63,208,201,.1)",marginBottom:36 }}>
              <img src="/pangolin-logo.png" alt="Pangolin" style={{ width:22,height:22,borderRadius:5,objectFit:"contain" }} />
              <span style={{ fontSize:18,fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#3FD0C9,#C1F6ED)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Pangolin</span>
            </div>
            <div style={{ fontSize:52, marginBottom:20 }}>🔗</div>
            <h1 style={{ fontSize:24,fontWeight:900,letterSpacing:"-.04em",color:"#C1F6ED",marginBottom:10 }}>Connect your wallet first</h1>
            <p style={{ fontSize:14,color:"#7ECFC6",lineHeight:1.7,marginBottom:32 }}>
              Link your Freighter wallet to your account. Once linked, we'll check if any client has an escrow waiting for your wallet address.
            </p>
            {walletError && (
              <div style={{ padding:"12px 16px",borderRadius:10,marginBottom:16,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",fontSize:13,color:"#EF4444" }}>{walletError}</div>
            )}
            <button
              onClick={async () => {
                setWalletError("");
                const snap = await rootConnectWallet();
                if (snap.status === "connected" && snap.address) {
                  const result = await saveWalletAddress(snap.address);
                  if (result?.error) { setWalletError(result.error); rootDisconnectWallet(); }
                }
              }}
              style={{
                width:"100%", padding:"14px", borderRadius:100,
                background:"linear-gradient(135deg,#2EAF7D,#228A62)",
                color:"#02353C", fontSize:15, fontWeight:700, border:"none",
                cursor:"pointer", fontFamily:"'Inter',sans-serif",
                boxShadow:"0 6px 24px rgba(46,175,125,.35)",
              }}
            >
              🔗 Connect Freighter Wallet
            </button>
            <button
              onClick={handleLogout}
              style={{ marginTop:20, background:"none", border:"none", color:"#3A8A82", fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}
            >
              ← Log out
            </button>
          </div>
        </div>
      )}

      {screen === "A" && (
        <div key="A" style={{
          minHeight:"100vh",overflowX:"hidden",
          background:`radial-gradient(ellipse 70% 50% at 15% 15%, rgba(46,175,125,.07) 0%, transparent 55%),radial-gradient(ellipse 60% 45% at 85% 85%, rgba(63,208,201,.05) 0%, transparent 55%),#02353C`,
          padding:"40px 16px 60px",animation:"fade-up .35s ease",
        }}>
          <div style={{ position:"fixed",inset:0,opacity:.017,pointerEvents:"none",backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"44px 44px" }}/>
          <ScreenA onAccept={() => setScreen("B")} inviteData={inviteData} walletAddress={profile?.wallet_address} />
        </div>
      )}

      {screen === "B" && (
        <div key="B" style={{ height:"100vh",animation:"fade-up .3s ease" }}>
          <ScreenB onSwitchToInvite={() => setScreen("A")} hasInvite={!!inviteData} />
        </div>
      )}
    </>
    </AuthGuard>
  );
}
