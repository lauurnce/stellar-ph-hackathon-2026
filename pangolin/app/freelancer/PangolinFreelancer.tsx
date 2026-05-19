// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PANGOLIN  —  Freelancer Screens (A: Invite Landing · B: Dashboard)
   Dark #0D0D0F · Coral #FF6B35 · Inter · Fully self-contained JSX
───────────────────────────────────────────────────────────────────────────── */

const C = {
  base:      "#0D0D0F",
  surface:   "#111116",
  elevated:  "#17171F",
  card:      "#1D1D28",
  border:    "#26263A",
  borderLit: "#363650",
  coral:     "#FF6B35",
  coralDk:   "#D9521A",
  blue:      "#3B82F6",
  green:     "#10B981",
  amber:     "#F59E0B",
  purple:    "#8B5CF6",
  teal:      "#14B8A6",
  pink:      "#EC4899",
  red:       "#EF4444",
  text:      "#F0F0F8",
  textSub:   "#8888A8",
  textMuted: "#4C4C64",
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
    coral: { bg: h ? "linear-gradient(135deg,#FF7C48,#D9521A)" : "linear-gradient(135deg,#FF6B35,#D9521A)", col: "#fff", bd: "none", shd: h ? "0 12px 40px rgba(255,107,53,.55),0 0 0 1px rgba(255,107,53,.38)" : "0 6px 24px rgba(255,107,53,.35),0 0 0 1px rgba(255,107,53,.25)" },
    ghost: { bg: h ? "rgba(255,107,53,.07)" : "transparent", col: h ? C.coral : C.textSub, bd: `1px solid ${h ? "rgba(255,107,53,.3)" : C.border}`, shd: "none" },
    subtle:{ bg: h ? C.card : C.elevated, col: C.text, bd: `1px solid ${h ? C.borderLit : C.border}`, shd: "none" },
    blue:  { bg: h ? "linear-gradient(135deg,#5A9BFF,#2563EB)" : "linear-gradient(135deg,#3B82F6,#2563EB)", col: "#fff", bd: "none", shd: h ? "0 10px 32px rgba(59,130,246,.5)" : "0 5px 18px rgba(59,130,246,.3)" },
    green: { bg: h ? "linear-gradient(135deg,#34D399,#059669)" : "linear-gradient(135deg,#10B981,#059669)", col: "#fff", bd: "none", shd: h ? "0 10px 32px rgba(16,185,129,.5)" : "0 5px 18px rgba(16,185,129,.3)" },
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
    "In Progress":  { bg:"rgba(59,130,246,.14)",  bd:"rgba(59,130,246,.35)",  tx:"#60A5FA", dot:C.blue   },
    "Under Review": { bg:"rgba(245,158,11,.14)",  bd:"rgba(245,158,11,.35)",  tx:"#FCD34D", dot:C.amber  },
    "Delivered":    { bg:"rgba(255,107,53,.14)",  bd:"rgba(255,107,53,.35)",  tx:"#FF8C5A", dot:C.coral  },
    "Completed":    { bg:"rgba(16,185,129,.14)",  bd:"rgba(16,185,129,.35)",  tx:"#34D399", dot:C.green  },
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
const MILESTONES_INVITE = [
  { name: "Wireframes & Sitemap",  amount: 400 },
  { name: "Full UI Design",        amount: 800 },
  { name: "Dev Handoff & Assets",  amount: 400 },
];
const TOTAL_USDC   = 1600;
const MIN_PCT      = 60;
const MIN_USDC     = TOTAL_USDC * MIN_PCT / 100;

function ScreenA({ onAccept }) {
  const [declining, setDeclining] = useState(false);
  const [accepted,  setAccepted]  = useState(false);

  if (accepted) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px" }}>
        <div style={{ fontSize:60, marginBottom:20 }}>🎉</div>
        <div style={{ fontSize:26,fontWeight:900,letterSpacing:"-.04em",color:C.text,marginBottom:10 }}>You're in!</div>
        <div style={{ fontSize:15,color:C.textSub,lineHeight:1.7,maxWidth:400,margin:"0 auto 28px" }}>
          Your wallet is connected. <strong style={{color:C.text}}>Juan Miguel</strong> has been notified and the escrow will be funded shortly.
        </div>
        <Btn variant="coral" size="xl" onClick={onAccept}>Continue to Dashboard →</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:620,margin:"0 auto",padding:"0 16px 60px" }}>

      {/* Logo */}
      <div style={{ display:"flex",justifyContent:"center",marginBottom:36 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,#1D1D28,#17171F)",border:`1px solid ${C.border}`,borderRadius:14,padding:"10px 22px",boxShadow:"0 0 0 1px rgba(255,107,53,.08)" }}>
          <span style={{ fontSize:22 }}>🐧</span>
          <span style={{ fontSize:18,fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#FF6B35,#FF9A6C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Pangolin</span>
        </div>
      </div>

      {/* Client intro */}
      <div style={{ textAlign:"center",marginBottom:32 }}>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:16,position:"relative",width:72,margin:"0 auto 16px" }}>
          <Avatar initials="JM" size={72} color={C.blue} />
          <div style={{ position:"absolute",bottom:-2,right:-2,width:22,height:22,borderRadius:"50%",background:C.green,border:`2px solid ${C.base}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>✓</div>
        </div>
        <div style={{ fontSize:13,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:6 }}>Project Invitation</div>
        <h1 style={{ fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:"-.04em",color:C.text,lineHeight:1.2,marginBottom:6 }}>
          <span style={{ background:"linear-gradient(135deg,#60A5FA,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Juan Miguel</span>{" "}wants to work with you
        </h1>
        <div style={{ fontSize:13.5,color:C.textMuted }}>Verified client · 12 completed escrows · 4.9 ★</div>
      </div>

      {/* Project card */}
      <GlassCard nohover glow={C.coral} style={{ marginBottom:16 }}>
        {/* Header */}
        <div style={{ padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
            <div>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:4 }}>Project</div>
              <div style={{ fontSize:18,fontWeight:800,letterSpacing:"-.03em",color:C.text }}>Website Redesign — Full Stack</div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(59,130,246,.12)",border:"1px solid rgba(59,130,246,.28)",borderRadius:"100px",padding:"3px 11px",fontSize:12,fontWeight:700,color:C.blue,marginTop:8 }}>UI/UX Design</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4 }}>Total Escrow</div>
              <div style={{ fontSize:30,fontWeight:900,letterSpacing:"-.05em",background:"linear-gradient(135deg,#FF6B35,#FF9A6C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>${TOTAL_USDC.toLocaleString()}</div>
              <div style={{ fontSize:12.5,color:C.textMuted }}>≈ ₱{phpOf(TOTAL_USDC)}</div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ padding:"16px 24px",borderBottom:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {[
            { label:"Deadline",       value:"Jun 15, 2025" },
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
          {MILESTONES_INVITE.map((m, i) => (
            <div key={m.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<MILESTONES_INVITE.length-1?`1px solid rgba(38,38,58,.5)`:"none" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${C.coral},${C.coralDk})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13.5,color:C.textSub }}>{m.name}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:14,fontWeight:700,color:C.text }}>${m.amount} USDC</div>
                <div style={{ fontSize:11,color:C.textMuted }}>≈ ₱{phpOf(m.amount)}</div>
              </div>
            </div>
          ))}
          <div style={{ paddingBottom:16 }}/>
        </div>

        {/* Guaranteed minimum — hero feature */}
        <div style={{ margin:"0",background:"linear-gradient(135deg,rgba(255,107,53,.12),rgba(255,107,53,.04))",borderTop:"none",borderRadius:"0 0 18px 18px",padding:"18px 24px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
            <span style={{ fontSize:20 }}>🛡️</span>
            <span style={{ fontSize:13.5,fontWeight:800,color:C.text }}>Your Guaranteed Minimum</span>
            <div style={{ marginLeft:"auto",padding:"3px 10px",borderRadius:"100px",fontSize:11,fontWeight:700,background:"rgba(255,107,53,.18)",border:"1px solid rgba(255,107,53,.32)",color:C.coral }}>Pangolin Promise</div>
          </div>
          <div style={{ fontSize:26,fontWeight:900,letterSpacing:"-.04em",color:C.coral,marginBottom:6 }}>
            ${MIN_USDC} USDC <span style={{ fontSize:15,color:"rgba(255,107,53,.7)" }}>({MIN_PCT}% of total)</span>
          </div>
          <div style={{ fontSize:13,color:C.textSub,lineHeight:1.65 }}>
            Even if the client disputes or cancels, Pangolin's smart contract <strong style={{ color:C.text }}>guarantees you receive at least ${MIN_USDC} USDC</strong> — automatically, no questions asked. ≈ ₱{phpOf(MIN_USDC)}
          </div>
        </div>
      </GlassCard>

      {/* Stellar security note */}
      <div style={{ background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.25)",borderRadius:14,padding:"14px 18px",marginBottom:24,display:"flex",gap:14,alignItems:"center" }}>
        <div style={{ width:36,height:36,borderRadius:10,background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>⛓️</div>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:"#93C5FD",marginBottom:3 }}>Secured by Stellar blockchain</div>
          <div style={{ fontSize:12.5,color:C.textSub,lineHeight:1.55 }}>
            Funds are locked in a verifiable smart contract — not held by Pangolin. 3–5 second settlement. Your wallet, your money.
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Btn variant="coral" size="xl" fullWidth onClick={() => setAccepted(true)}>
          🔗 Accept &amp; Connect Wallet
        </Btn>

        {!declining ? (
          <Btn variant="ghost" size="lg" fullWidth onClick={() => setDeclining(true)}>
            Decline invitation
          </Btn>
        ) : (
          <div style={{ background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.25)",borderRadius:12,padding:"14px 18px",textAlign:"center" }}>
            <div style={{ fontSize:13.5,fontWeight:700,color:"#F87171",marginBottom:6 }}>Are you sure?</div>
            <div style={{ fontSize:12.5,color:C.textMuted,marginBottom:14 }}>Juan Miguel will be notified you've declined. This invite link will expire.</div>
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
const NAV_ITEMS = [
  { id:"dashboard",  icon:"⊞",  label:"Dashboard" },
  { id:"jobs",       icon:"💼", label:"Active Jobs",    badge:3 },
  { id:"earnings",   icon:"💰", label:"Earnings" },
  { id:"messages",   icon:"💬", label:"Messages",       badge:1 },
  { id:"reputation", icon:"⭐", label:"Reputation" },
  { id:"portfolio",  icon:"🎨", label:"Portfolio" },
  { id:"settings",   icon:"⚙️", label:"Settings" },
];

const ACTIVE_JOBS = [
  { project:"Website Redesign",    client:{ initials:"JM", color:C.blue  }, status:"In Progress",  amount:1600, due:"Jun 15, 2025", action:"View" },
  { project:"Brand Identity Kit",  client:{ initials:"SR", color:C.amber }, status:"Under Review",  amount:900,  due:"May 25, 2025", action:"Submit Delivery" },
  { project:"Mobile UI Prototype", client:{ initials:"LD", color:C.pink  }, status:"Delivered",    amount:650,  due:"May 20, 2025", action:"Awaiting Approval" },
];

const BADGES = [
  { icon:"🎨", label:"Illustrator",      color:C.purple, desc:"Top UI/UX skills",     earned:true },
  { icon:"⚡", label:"Fast Delivery",     color:C.amber,  desc:"98% on-time rate",      earned:true },
  { icon:"⭐", label:"5-Star Client",     color:C.coral,  desc:"Avg 4.9 rating",        earned:true },
  { icon:"🛡️", label:"Zero Disputes",    color:C.green,  desc:"Clean track record",    earned:true },
  { icon:"🔥", label:"Streak: 12 weeks", color:C.red,    desc:"Active every week",     earned:true },
  { icon:"🌏", label:"Global Ready",     color:C.teal,   desc:"International clients", earned:true },
  { icon:"💎", label:"Elite Freelancer", color:C.blue,   desc:"Top 5% on platform",    earned:false },
  { icon:"🏆", label:"100 Escrows",      color:C.amber,  desc:"38 / 100 milestone",    earned:false },
];

function SidebarItem({ icon, label, badge, active, collapsed, onClick }) {
  const [h, hov] = useHover();
  return (
    <button onClick={onClick} {...hov} style={{
      display:"flex",alignItems:"center",gap:10,
      padding:collapsed?"10px 12px":"10px 13px",
      borderRadius:11,border:"none",cursor:"pointer",
      background:active?"linear-gradient(135deg,rgba(255,107,53,.16),rgba(255,107,53,.06))":h?"rgba(255,255,255,.04)":"transparent",
      boxShadow:active?"inset 0 0 0 1px rgba(255,107,53,.25)":"none",
      transition:"all .15s ease",width:"100%",textAlign:"left",
      justifyContent:collapsed?"center":"flex-start",position:"relative",fontFamily:C.font,
    }}>
      <span style={{ fontSize:17,flexShrink:0 }}>{icon}</span>
      {!collapsed && <span style={{ fontSize:13.5,fontWeight:active?700:500,color:active?C.coral:h?C.text:C.textSub,transition:"color .15s",whiteSpace:"nowrap" }}>{label}</span>}
      {!collapsed && badge && <span style={{ marginLeft:"auto",background:C.coral,color:"#fff",borderRadius:"100px",fontSize:10.5,fontWeight:800,padding:"2px 7px",boxShadow:"0 2px 8px rgba(255,107,53,.4)" }}>{badge}</span>}
      {collapsed && badge && <div style={{ position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.coral,boxShadow:`0 0 6px ${C.coral}` }}/>}
    </button>
  );
}

function Sidebar({ collapsed, onToggle, active, setActive }) {
  const W = collapsed ? 64 : 228;
  return (
    <aside style={{ width:W,minWidth:W,maxWidth:W,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width .22s cubic-bezier(.4,0,.2,1), min-width .22s, max-width .22s",overflow:"hidden",flexShrink:0,zIndex:20 }}>
      {/* Logo */}
      <div style={{ height:62,display:"flex",alignItems:"center",padding:collapsed?"0 0 0 16px":"0 16px",borderBottom:`1px solid ${C.border}`,gap:10,flexShrink:0 }}>
        <span style={{ fontSize:22,flexShrink:0 }}>🐧</span>
        {!collapsed && <span style={{ fontSize:17,fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#FF6B35,#FF9A6C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap" }}>Pangolin</span>}
        <button onClick={onToggle} style={{ marginLeft:"auto",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:16,flexShrink:0,padding:"4px 6px",borderRadius:8 }}>
          {collapsed?"›":"‹"}
        </button>
      </div>

      {/* Freelancer badge */}
      {!collapsed && (
        <div style={{ margin:"12px 8px 4px",background:"rgba(255,107,53,.08)",border:"1px solid rgba(255,107,53,.22)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
          <Avatar initials="AK" size={30} color={C.coral} />
          <div>
            <div style={{ fontSize:12.5,fontWeight:700,color:C.text }}>Ana Kalaw</div>
            <div style={{ fontSize:11,color:C.coral,fontWeight:600 }}>Freelancer</div>
          </div>
        </div>
      )}

      <nav style={{ flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2 }}>
        {NAV_ITEMS.map(({ id, icon, label, badge }) => (
          <SidebarItem key={id} icon={icon} label={label} badge={badge} active={active===id} collapsed={collapsed} onClick={() => setActive(id)} />
        ))}
      </nav>

      {/* Wallet */}
      <div style={{ padding:"12px 8px",borderTop:`1px solid ${C.border}`,flexShrink:0 }}>
        {collapsed ? (
          <div style={{ width:40,height:40,borderRadius:12,margin:"0 auto",background:`rgba(255,107,53,.12)`,border:`1px solid rgba(255,107,53,.28)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer" }}>🔗</div>
        ) : (
          <div style={{ background:"linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))",border:"1px solid rgba(255,107,53,.28)",borderRadius:13,padding:"11px 14px" }}>
            <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:5 }}>Connected Wallet</div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}` }}/>
              <span style={{ fontSize:12.5,fontWeight:700,color:C.text,fontFamily:"monospace" }}>G2hW…k8X3</span>
            </div>
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
        {trend!==undefined && <span style={{ fontSize:11.5,fontWeight:700,color:trend>0?C.green:C.red,background:trend>0?"rgba(16,185,129,.12)":"rgba(239,68,68,.12)",border:`1px solid ${trend>0?"rgba(16,185,129,.3)":"rgba(239,68,68,.3)"}`,padding:"3px 9px",borderRadius:"100px" }}>{trend>0?"↑":"↓"} {Math.abs(trend)}%</span>}
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

function EarningsSummary() {
  const [withdrawing, setWithdrawing] = useState(false);
  const [done, setDone] = useState(false);
  const totalUsdc = 3150;
  const thisMonth = 1240;

  return (
    <GlassCard nohover glow={C.green} style={{ padding:"24px 26px" }}>
      <div style={{ fontSize:16,fontWeight:800,color:C.text,letterSpacing:"-.02em",marginBottom:20 }}>Earnings Summary</div>

      <div style={{ display:"flex",gap:14,marginBottom:20,flexWrap:"wrap" }}>
        {[
          { label:"This Month",       value:`$${thisMonth.toLocaleString()}`, sub:`≈ ₱${phpOf(thisMonth)}`, color:C.coral  },
          { label:"All Time (USDC)",  value:`$${totalUsdc.toLocaleString()}`, sub:`≈ ₱${phpOf(totalUsdc)}`, color:C.green  },
          { label:"Pending Release",  value:"$650",                           sub:"≈ ₱37,895",               color:C.amber  },
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
            📲 Withdraw $1,240 to GCash
          </Btn>
        ) : (
          <div style={{ background:"linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.04))",border:"1px solid rgba(255,107,53,.28)",borderRadius:14,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:800,color:C.text,marginBottom:4 }}>Confirm Withdrawal</div>
            <div style={{ fontSize:13,color:C.textSub,marginBottom:14,lineHeight:1.6 }}>
              Withdraw <strong style={{ color:C.text }}>$1,240 USDC</strong> → <strong style={{ color:C.text }}>₱72,292</strong> to GCash <code style={{ fontSize:12,color:C.coral,fontFamily:"monospace" }}>+63 917 *** 4821</code>
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
        {[["Jobs Done","38"],["Avg Rating","4.9 ★"],["Response Rate","99%"]].map(([l,v])=>(
          <div key={l}>
            <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:16,fontWeight:800,color:C.text }}>{v}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function WorkProof() {
  const [copied, setCopied] = useState(false);
  const link = "pangolin.gg/verify/ana-kalaw-4821";
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

function ActiveJobsTable() {
  return (
    <GlassCard nohover style={{ padding:0,overflow:"hidden" }}>
      <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div style={{ fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>Active Jobs</div>
          <div style={{ fontSize:12.5,color:C.textMuted,marginTop:2 }}>3 contracts in progress</div>
        </div>
        <Btn variant="ghost" size="sm">View All →</Btn>
      </div>

      {/* Header */}
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1.4fr 1.5fr 1fr 1.1fr 1.2fr",padding:"11px 22px",borderBottom:`1px solid ${C.border}`,background:"rgba(255,255,255,.02)" }}>
        {["Project","Client","Status","Amount","Due Date","Action"].map(h => (
          <div key={h} style={{ fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:".05em",textTransform:"uppercase" }}>{h}</div>
        ))}
      </div>

      {ACTIVE_JOBS.map((row, i) => (
        <JobRow key={i} row={row} last={i===ACTIVE_JOBS.length-1} />
      ))}
    </GlassCard>
  );
}

function JobRow({ row, last }) {
  const [h, hov] = useHover();
  const isActionable = row.action === "Submit Delivery";
  return (
    <div {...hov} style={{
      display:"grid",gridTemplateColumns:"2fr 1.4fr 1.5fr 1fr 1.1fr 1.2fr",
      padding:"14px 22px",alignItems:"center",
      borderBottom:last?"none":`1px solid rgba(38,38,58,.6)`,
      background:h?"rgba(255,255,255,.016)":"transparent",
      transition:"background .15s",
    }}>
      <div>
        <div style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:2 }}>{row.project}</div>
        <div style={{ fontSize:11.5,color:C.textMuted }}>#{Math.floor(Math.random()*9000+1000)}</div>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <Avatar initials={row.client.initials} size={30} color={row.client.color} />
        <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{row.client.initials === "JM" ? "Juan M." : row.client.initials === "SR" ? "Sarah R." : "Lara D."}</span>
      </div>
      <div><StatusPill status={row.status} /></div>
      <div>
        <div style={{ fontSize:14,fontWeight:800,color:C.text,letterSpacing:"-.02em" }}>${row.amount}</div>
        <div style={{ fontSize:11,color:C.textMuted }}>USDC</div>
      </div>
      <div style={{ fontSize:13,color:C.textSub }}>{row.due}</div>
      <div>
        {isActionable ? (
          <Btn variant="coral" size="sm" onClick={() => go("/delivery")}>{row.action}</Btn>
        ) : (
          <Btn variant="subtle" size="sm" onClick={() => go("/escrow")}>{row.action}</Btn>
        )}
      </div>
    </div>
  );
}

function ScreenB() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");

  return (
    <div style={{ display:"flex",height:"100vh",overflow:"hidden" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} active={active} setActive={setActive} />

      <main style={{
        flex:1,overflowY:"auto",overflowX:"hidden",
        background:`radial-gradient(ellipse 60% 40% at 70% 10%, rgba(255,107,53,.05) 0%, transparent 60%),radial-gradient(ellipse 50% 40% at 20% 80%, rgba(20,184,166,.04) 0%, transparent 60%),${C.base}`,
      }}>
        <div style={{ maxWidth:1060,margin:"0 auto",padding:"28px 28px 60px" }}>

          {/* Greeting */}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:16 }}>
            <div>
              <div style={{ fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:5 }}>Freelancer Dashboard</div>
              <h1 style={{ fontSize:"clamp(20px,3vw,28px)",fontWeight:900,letterSpacing:"-.04em",color:C.text }}>Welcome back, Ana 👋</h1>
            </div>
            <div style={{ display:"flex",gap:10,alignItems:"center" }}>
              {/* Notif bell */}
              <div style={{ width:40,height:40,borderRadius:12,background:C.elevated,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",position:"relative" }}>
                🔔
                <div style={{ position:"absolute",top:6,right:6,width:9,height:9,borderRadius:"50%",background:C.coral,border:`2px solid ${C.surface}`,boxShadow:`0 0 8px ${C.coral}` }}/>
              </div>
              <Btn variant="coral" size="md">+ Submit New Delivery</Btn>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"flex",gap:14,marginBottom:24,flexWrap:"wrap" }}>
            <StatCard icon="💰" label="Earnings This Month" value="$1,240" sub="≈ ₱72,292" color={C.coral} trend={18} />
            <StatCard icon="💼" label="Active Jobs"         value="3"      sub="1 needs action"  color={C.blue}        />
            <StatCard icon="✅" label="Completed"           value="38"     sub="All time"         color={C.green} trend={5} />
            <StatCard icon="⭐" label="Reputation Score"    value="4.9"    sub="Based on 38 jobs" color={C.amber}       />
          </div>

          {/* Active jobs table */}
          <div style={{ marginBottom:22 }}>
            <ActiveJobsTable />
          </div>

          {/* Bottom row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22,flexWrap:"wrap" }}>
            <EarningsSummary />
            <WorkProof />
          </div>

          {/* Badge showcase */}
          <BadgeShowcase />
        </div>
      </main>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Root — screen switcher
// ════════════════════════════════════════════════════════════════════════════
export default function PangolinFreelancer() {
  const [screen, setScreen] = useState("A");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; height: 100%; }
        body { font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background: #0D0D0F; color: #F0F0F8; -webkit-font-smoothing: antialiased; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        select option { background: #1D1D28; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D0D0F; }
        ::-webkit-scrollbar-thumb { background: #26263A; border-radius: 3px; }
      `}</style>

      {/* Screen switcher tab */}
      <div style={{ position:"fixed",top:12,right:16,zIndex:999,display:"flex",gap:4,background:"rgba(17,17,22,.9)",border:`1px solid ${C.border}`,borderRadius:12,padding:5,backdropFilter:"blur(12px)" }}>
        {[["A","🔗 Invite"],["B","📊 Dashboard"]].map(([id,label]) => (
          <button key={id} onClick={() => setScreen(id)} style={{
            padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:C.font,
            background:screen===id?"linear-gradient(135deg,rgba(255,107,53,.2),rgba(255,107,53,.08))":"transparent",
            boxShadow:screen===id?"inset 0 0 0 1px rgba(255,107,53,.28)":"none",
            color:screen===id?C.coral:C.textMuted,fontSize:12.5,fontWeight:screen===id?700:500,
            transition:"all .15s",
          }}>{label}</button>
        ))}
      </div>

      {screen === "A" ? (
        <div key="A" style={{
          minHeight:"100vh",overflowX:"hidden",
          background:`radial-gradient(ellipse 70% 50% at 15% 15%, rgba(255,107,53,.07) 0%, transparent 55%),radial-gradient(ellipse 60% 45% at 85% 85%, rgba(59,130,246,.05) 0%, transparent 55%),#0D0D0F`,
          padding:"40px 16px 60px",animation:"fade-up .35s ease",
        }}>
          <div style={{ position:"fixed",inset:0,opacity:.017,pointerEvents:"none",backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"44px 44px" }}/>
          <ScreenA onAccept={() => setScreen("B")} />
        </div>
      ) : (
        <div key="B" style={{ height:"100vh",animation:"fade-up .3s ease" }}>
          <ScreenB />
        </div>
      )}
    </>
  );
}
