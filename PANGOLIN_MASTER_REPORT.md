# PANGOLIN — Master Project Report
## Stellar Philippines Hackathon 2026

**Document Type:** Comprehensive Project Analysis, Strategy & Execution Guide  
**Prepared for:** Team Lead — Lawrence Panes & Team of 5  
**Hackathon:** Stellar Philippines Hackathon 2026 | May 18–24, 2026  
**Prize Target:** ₱50,000 (Top Prize)  
**Last Updated:** May 16, 2026  
**Research Status:** 6 of 6 research files complete ✅

---

## RESEARCH FILES INDEX

| File | Status | Key Output |
|---|---|---|
| `research/Market_Sizing_TAM_SAM_SOM_Bottom_Up_Analysis.md` | ✅ Complete | TAM $450M, SAM $71.8M, SOM $3.75M Y3 revenue |
| `research/Problem_Validation_Is_Problem_Real_Large_Significant.md` | ✅ Complete | 9/10 reality, 9/10 significance — Build it |
| `research/Pitch_Narrative_Storytelling_Strategy_And_Slide_Outline.md` | ✅ Complete | 5-min arc, 12-slide deck, judge Q&A, what NOT to say |
| `research/Business_Model_Revenue_Strategy_And_Unit_Economics.md` | ✅ Complete | 2.5% fee, 23:1 LTV:CAC, breaks even Month 3 |
| `research/Pre_Build_Validation_Playbook_48_Hour_Community_Sprint.md` | ✅ Complete | 48-hr sprint, Go/No-Go scoring, Mom Test questions |
| `research/GTM_Go_To_Market_Strategy_Philippines_SEA.md` | ✅ Complete | Beachhead, channels, Floor Stories campaign, 90-day KPIs |

---

## KEY NUMBERS (Quick Reference)

| Metric | Value |
|---|---|
| TAM (global revenue) | $450M/year |
| SAM (SEA revenue) | $71.8M/year |
| SOM Year 3 revenue | $3.75M |
| Platform fee | **2.5%** (client pays) |
| Revenue per $150 transaction | $3.75 |
| Gross margin | ~99% (Stellar advantage) |
| CAC blended | $5 |
| LTV (2-year) | $116 |
| LTV:CAC ratio | **23:1** |
| Break-even users | ~110 (Month 3) |
| Year 1 revenue | $51,850 |
| Default min guarantee % | 20% |
| Vgen fee vs Pangolin | 9.4% vs 2.5% — **75% cheaper** |
| Problem reality score | **9/10** |
| Problem significance score | **9/10** |
| Primary tagline | "PayPal protects the buyer. Pangolin protects the work." |
| Closing statement | "Pangolin doesn't ask clients to be honest. It makes dishonesty structurally impossible." |

---

## TABLE OF CONTENTS

1. [Project Overview & Core Concept](#1-project-overview--core-concept)
2. [Hackathon Requirements & Schedule](#2-hackathon-requirements--schedule)
3. [Source Files Analysis Summary](#3-source-files-analysis-summary)
4. [The Core Problem — Digital Art Freelancer Payments](#4-the-core-problem--digital-art-freelancer-payments)
5. [The Pangolin Solution — Escrow Flow](#5-the-pangolin-solution--escrow-flow)
6. [Technical Architecture](#6-technical-architecture)
7. [Competitive Landscape](#7-competitive-landscape)
8. [Strengths Analysis](#8-strengths-analysis)
9. [Weaknesses Analysis](#9-weaknesses-analysis)
10. [Opportunities & Threats](#10-opportunities--threats)
11. [7-Day Execution Plan](#11-7-day-execution-plan)
12. [Team Roles Recommendation](#12-team-roles-recommendation)
13. [Judging Criteria Alignment](#13-judging-criteria-alignment)
14. [Submission Checklist](#14-submission-checklist)
15. [Open Questions & Decisions Needed](#15-open-questions--decisions-needed)

---

## 1. Project Overview & Core Concept

### What is Pangolin?

Pangolin is a **blockchain-powered escrow payment platform** built on the **Stellar network**, specifically designed for **digital art freelancers and their clients**. 

Unlike existing platforms, Pangolin is **NOT a marketplace** — it does not help freelancers and clients find each other. That discovery already happens on Twitter/X, Instagram, Facebook, Discord, and art communities. Pangolin enters AFTER the agreement, acting as the trusted financial middleman.

### The One-Line Pitch

> "Pangolin holds your payment so freelancers can work with confidence and clients can buy with trust — powered by Stellar blockchain."

### Core Value Proposition

| For Freelancers | For Clients |
|---|---|
| Guaranteed minimum payment even if client disputes | Funds held securely — work is delivered before full release |
| On-chain proof that money is locked before starting | Protection from delivering partial/no work |
| Fast settlement (3-5 sec on Stellar) | Transparent process via blockchain |
| Ultra-low fees (Stellar fees ~$0.00001) | Can negotiate milestone-based releases |

---

## 2. Hackathon Requirements & Schedule

### Event Details

| Detail | Info |
|---|---|
| Dates | May 18–24, 2026 |
| Format | Fully Online |
| Team Size | Up to 5 members |
| Prize Pool | ₱50,000 |
| Platform | Stellar Blockchain |
| Requirement | Mainnet-ready projects |

### 7-Day Schedule Breakdown

| Day | Phase | Key Activities |
|---|---|---|
| **Day 1 (May 18)** | Launch Day | Opening ceremony, idea submission, problem statement, team formation |
| **Day 2–3 (May 19–20)** | Build Phase I | Ideation finalization, MVP planning, Soroban smart contract development, frontend integration |
| **Day 4 (May 21)** | Checkpoint 1 | Concept validation, problem statement review, progress check |
| **Day 5 (May 22)** | Build Phase II | Full product development, testnet deployment, mainnet preparation |
| **Day 6 (May 23)** | Final Submission | Deploy, record demo video, finalize pitch deck, submit all deliverables |
| **Day 7 (May 24)** | Demo Day | 3–5 min live presentation, product demo, judge Q&A, winners announcement |

### Final Submission Requirements (All Required by Day 6)

- [ ] GitHub Repository (clean, documented)
- [ ] Complete README
- [ ] Demo Video
- [ ] Pitch Deck
- [ ] Live Application / Website
- [ ] Stellar Testnet Deployment Proof
- [ ] Stellar Mainnet Deployment Proof

### Judging Criteria

| Criteria | Weight | What Judges Want |
|---|---|---|
| Real-World Impact | **30%** | Solves actual Filipino/SEA problems |
| Technical Execution on Stellar | **25%** | Proper Stellar integration, smart contract quality |
| UX / Product Usability | **20%** | Functional interface, accessible design |
| Innovation | **15%** | Creative problem-solving, unique approach |
| Feasibility & Scalability | **10%** | Long-term potential, production viability |

**Critical insight:** Real-World Impact is worth 30% — more than any other single criterion. Lead with the human story. Lead with Filipino freelancers losing money.

---

## 3. Source Files Analysis Summary

### Files Reviewed

| File | Content | Status |
|---|---|---|
| `stellar-philippines-hackathon-2026.md` | Full hackathon rules, schedule, judging criteria | Complete & solid |
| `SafeVault_Business_Analysis.md` | Detailed business analysis under brand "SafeVault" (now Pangolin) | Comprehensive — needs Stellar-specific pivot |
| `Pangolin_Core_APIs.md` | API stack recommendations for KYC, AML, wallets, escrow | Good foundation — needs Stellar-first rewrite |
| `payment_platform_comparison.md` | Why existing platforms fail freelancers | Excellent — strong validation evidence |
| `stellar-installation.md` | Empty (not yet written) | Needs content |
| `online-resources.txt` | Empty (not yet written) | Needs content |

### Key Finding from SafeVault Document

The existing SafeVault business analysis is solid but has a **critical misalignment**: it was written for multi-chain (Ethereum, Solana, Polygon) with general marketplace use. For the Stellar hackathon:

1. **Rebrand clarity:** "SafeVault" is the old name; "Pangolin" is the chosen brand
2. **Narrow the scope:** Focus on digital art freelancers (not generic marketplace)
3. **Stellar-first tech:** Replace Solidity/Web3.js with Soroban/Stellar SDK
4. **USDC on Stellar:** Circle's USDC native on Stellar — no cross-chain bridges needed
5. **Remove multi-chain complexity** from MVP — single Stellar network is enough

### Key Finding from Payment Comparison

The `payment_platform_comparison.md` is your **strongest pitch asset**. It shows concretely:
- **PayPal** = zero seller protection for digital services (tracking number required)
- **Stripe** = banks side with cardholders 73% of the time
- **Etsy** = built for physical goods, wrong model
- **Vgen** = no milestones, high fees (9.4–10.4%), one-off only
- **RaketPH** = zero payment security, just a job board

This table is slide 3 of your pitch deck. Use it.

---

## 4. The Core Problem — Digital Art Freelancer Payments

### The Trust Gap

Digital art commission work has a fundamental trust problem:

```
FREELANCER'S FEAR:          CLIENT'S FEAR:
"What if they don't pay     "What if I pay and 
after I deliver?"           they don't deliver?"
         ↓                           ↓
         ← ─ ─ ─ NO TRUST ─ ─ ─ →
```

Both fears are valid. Neither party wants to go first.

### Why Existing Solutions Fail

**PayPal (Most Common Tool):**
- Digital/intangible services EXCLUDED from seller protection
- Clients can claim "not delivered" — no tracking number for digital work
- PayPal auto-sides with buyer
- Freelancer loses: work + payment + ₱900 dispute fee

**Credit Cards / Stripe:**
- Banks side with cardholders 73% of time
- Digital screenshots = weak evidence vs physical receipts
- Stripe not fully available for Philippines direct payouts

**Vgen (Art-Specific Platform):**
- No milestone-based payments
- Only works for simple, one-off assets
- Fees: 9.4–10.4% (too high for ongoing projects)
- Terrible for large projects ($1,000+ branding projects)

**RaketPH:**
- No escrow whatsoever
- Pure job board, GCash/bank offline
- Zero recourse if client ghosts

### The Resulting Pain

- Freelancers ask for 50% upfront, losing clients who don't trust them
- Clients refuse upfront, losing freelancers who don't trust them
- Both sides operate on faith, personal reputation, and informal contracts
- The unbanked and newer freelancers suffer most
- International transactions (PHP → USD → crypto) add 5–15% in friction fees

---

## 5. The Pangolin Solution — Escrow Flow

### The Core User Journey

```
Phase 1: Agreement (Happens OFF Pangolin)
├── Freelancer & client connect on Twitter, Discord, IG, etc.
├── Negotiate: price, timeline, deliverables, revision policy
└── Agree on terms → "Let's use Pangolin"

Phase 2: Escrow Setup (ON Pangolin)
├── Client creates escrow order on Pangolin
├── Client deposits USDC to Pangolin escrow address (Stellar)
├── Smart contract/multi-sig locks the funds
└── Freelancer gets on-chain confirmation: "₱X is locked and waiting for you"

Phase 3: Work Delivery
├── Freelancer works with full payment assurance
├── Freelancer submits completed work through Pangolin
├── Work delivery timestamp recorded on-chain
└── Client reviews delivered work

Phase 4: Payment Resolution
├── CLIENT APPROVES → 100% of funds (minus Pangolin fee) go to freelancer
├── CLIENT DISPUTES → Dispute resolution triggers
│   ├── Evidence submission from both sides
│   ├── Pangolin admin/arbitration reviews
│   └── Decision made on evidence
└── TIMEOUT (client doesn't respond) → Auto-release after X days

Phase 5: CRITICAL MECHANIC — Minimum Guaranteed Payment
├── Client CANNOT get 100% refund back
├── Minimum % (e.g., 20-30%) ALWAYS goes to freelancer
├── This prevents bad-faith chargebacks after receiving work
└── Agreed at escrow creation time
```

### The Key Innovation

The **minimum guaranteed payment mechanic** is what differentiates Pangolin from all existing escrow tools. It fundamentally shifts the incentive structure:

- Clients can't abuse the system to get free work
- Freelancers have a floor — they are NEVER fully ghosted
- The minimum % is agreed upfront and locked on-chain

### Stellar-Specific Implementation

```
USDC (Circle on Stellar) — stablecoin, no volatility risk
Transaction speed: 3-5 seconds
Transaction cost: ~$0.00001 per transaction
No gas wars, no congestion
Freighter Wallet integration (browser extension)
Soroban Smart Contracts OR Multi-sig accounts for escrow logic
```

---

## 6. Technical Architecture

### Recommended MVP Stack (7-day feasible)

**Frontend:**
- Next.js 14 (React) + TypeScript
- Tailwind CSS
- Freighter Wallet SDK (Stellar browser extension)
- Simple, clean UI — art community aesthetic

**Backend:**
- Node.js + Express (or Next.js API routes for simplicity)
- PostgreSQL (transaction records, user metadata)
- Stellar SDK (JavaScript: `@stellar/stellar-sdk`)

**Blockchain Layer (Stellar):**
- USDC on Stellar (issued by Circle, native asset)
- Option A: **Soroban Smart Contracts** (more impressive to judges, harder to build in 7 days)
- Option B: **Multi-signature accounts + sequence-locked transactions** (simpler, still valid Stellar-native)
- Stellar Testnet → Stellar Mainnet

**Wallet:**
- Freighter Wallet (most popular Stellar browser wallet)
- LOBSTR as alternative

**Hosting:**
- Vercel (frontend, free tier)
- Railway or Render (backend, free tier)
- Stellar Mainnet for on-chain components

### API Stack (from Pangolin_Core_APIs.md)

For **MVP hackathon** scope, simplify to:

| Purpose | Tool | Priority |
|---|---|---|
| Stellar blockchain | Stellar SDK (JS) | CRITICAL |
| Wallet connection | Freighter SDK | CRITICAL |
| Database | PostgreSQL / Supabase | CRITICAL |
| KYC | Skip for MVP (add post-hackathon) | LOW |
| AML | Skip for MVP | LOW |
| Notifications | Email (Resend.com, free tier) | MEDIUM |

### Data Model (Core)

```sql
Users: id, wallet_address, email, created_at
Escrows: id, client_id, freelancer_id, amount_usdc, 
         minimum_guaranteed_pct, status, stellar_tx_id,
         created_at, deadline, dispute_reason
Deliveries: id, escrow_id, file_url, submitted_at, approved_at
Disputes: id, escrow_id, reason, evidence_url, resolution, resolved_at
```

### Escrow States

```
CREATED → FUNDED → IN_PROGRESS → DELIVERED → APPROVED → COMPLETED
                      ↓                          ↓
                   CANCELLED              DISPUTED → RESOLVED
```

---

## 7. Competitive Landscape

### Direct Competitors

| Platform | Type | Key Weakness vs Pangolin |
|---|---|---|
| PayPal | Payment processor | Zero seller protection for digital work |
| Stripe | Payment processor | Chargeback bias toward buyers (73%) |
| Vgen | Art-specific | No milestones, high fees, one-off only |
| Escrow.com | General escrow | $25 minimum fee, 0.89-3.25% fee, slow |
| Freelancer.com | Marketplace | Tied to their ecosystem, not standalone |
| Upwork | Marketplace | Must find clients on Upwork, high platform lock-in |
| RaketPH | Local job board | Zero payment protection |

### Pangolin's Differentiation Matrix

| Feature | Pangolin | Vgen | Escrow.com | PayPal |
|---|---|---|---|---|
| Milestone-based | YES | No | Yes (paid) | No |
| Min guaranteed to seller | YES | No | No | No |
| Blockchain transparent | YES | No | No | No |
| Sub-$1 fees | YES | No (9-10%) | No (1-3%) | No (3.5%+) |
| Works without marketplace | YES | No | Yes | Yes |
| Stellar/crypto native | YES | No | No | No |
| Philippines-friendly | YES | Limited | Limited | Limited |

---

## 8. Strengths Analysis

### S1 — Real & Specific Problem (High Hackathon Score)
The problem is hyper-specific to a real, underserved community. Judges can immediately relate because:
- Filipino freelancers are a massive and growing sector
- The payment comparison table is undeniable evidence
- The minimum-guaranteed-payment mechanic is a genuine innovation

### S2 — Stellar is the Right Network for This
- USDC on Stellar = stable payments without volatility
- 3-5 second finality = instant confirmation for freelancers
- Near-zero fees = viable for $20-$500 commission transactions (vs Ethereum gas)
- PayFi track alignment = fits hackathon focus perfectly
- Circle has native USDC on Stellar — no bridges needed

### S3 — Both Sides Win (Network Effect Potential)
Most escrow tools protect one side. Pangolin has a mechanic that protects both:
- Clients: money is held securely, released only on delivery approval
- Freelancers: minimum % guaranteed regardless of client behavior
This dual-side protection is the foundation of a 2-sided network

### S4 — Not a Marketplace (Strategic Advantage)
Not competing with Upwork, Fiverr, Vgen — they can partner with those platforms, not fight them. Pangolin is infrastructure.

### S5 — Southeast Asia Timing
- Philippines is #1 in freelancer growth in SEA (Payoneer reports)
- SEA gig economy growing 15-20% YoY
- Crypto/blockchain adoption in Philippines is one of highest in world (BSP supportive)
- Gcash, Maya already normalized digital payments — next step is crypto

### S6 — Clean MVP Scope
The MVP is achievable in 7 days with a team of 5:
- One user flow (escrow creation → delivery → release)
- One stablecoin (USDC on Stellar)
- One wallet (Freighter)
- Web app only (no mobile needed for demo)

### S7 — Blockchain Transparency = Trust Layer
Every escrow transaction is on-chain. Freelancers can verify funds exist. Clients can verify delivery. No black box.

---

## 9. Weaknesses Analysis

### W1 — Crypto Onboarding Barrier (Critical)
**The Problem:** Most Filipino freelancers use GCash, PayMaya, or PayPal — not Freighter Wallet. Getting users to:
1. Install Freighter wallet
2. Acquire USDC on Stellar (not easy locally)
3. Trust a new blockchain platform

...is a major friction point.

**Mitigation:** 
- In-app wallet creation (if Freighter allows)
- Partner with local crypto ramps (Coins.ph, PDAX)
- Show simple onboarding video in demo
- Fiat on-ramp roadmap in pitch

### W2 — USDC Acquisition in Philippines
Users need USDC (Stellar) to use the platform. Getting USDC on Stellar specifically is non-trivial:
- Binance → Stellar withdrawal (possible but complex)
- Coins.ph limited Stellar support
- No Peso → USDC on Stellar direct ramp yet

**Mitigation:** Present as "Phase 2 feature" — fiat on/off ramp via partnerships with Coins.ph or Maya

### W3 — Legal Gray Area
Holding user funds in the Philippines requires regulatory consideration:
- BSP e-money issuer license
- Virtual Asset Service Provider (VASP) registration
- KYC/AML requirements

**Mitigation:** Frame as non-custodial (funds go directly to smart contract, not to Pangolin entity). Smart contract = trustless holding.

### W4 — Dispute Resolution is Off-Chain
The minimum-guaranteed mechanic is great, but WHO decides how much the freelancer gets in a dispute? This is subjective and off-chain:
- Who reviews evidence?
- How long does resolution take?
- What if both parties disagree?

**Mitigation:** Clear SLA in smart contract. Use DAO governance or arbitration panel as roadmap item.

### W5 — Team Bandwidth in 7 Days
5 people, 7 days, blockchain + frontend + backend + smart contracts + pitch + demo video = very tight.

**Mitigation:** See team roles section — tight specialization, no scope creep, use templates.

### W6 — Platform Lock-In Risk
Freelancers prefer where THEIR clients are. If clients refuse to use Pangolin (don't want to set up Freighter), freelancer loses the client.

**Mitigation:** Make client onboarding extremely simple. Consider email-based escrow invitation (client doesn't need to install wallet upfront).

### W7 — SafeVault Analysis Uses Wrong Stack
The SafeVault document specifies Ethereum/Solana/multi-chain stack, React + NestJS, Solidity smart contracts. This needs to be fully pivoted to Stellar-native tools.

---

## 10. Opportunities & Threats

### Opportunities

**O1 — Philippine Freelancer Economy is Massive**
- ~1.5M registered freelancers (DOLE data)
- Philippines is among top 5 countries on Upwork/Fiverr for design work
- Growing demand for international clients hiring Filipino designers

**O2 — Art Commission Community is Organized**
- Active Discord servers, Facebook groups, Twitter communities
- Commission community has established norms (TOS documents, etc.)
- Pangolin can become the standard tool — like "just use Pangolin"

**O3 — Stellar Foundation Grants**
- SCF (Stellar Community Fund) provides grants for builders
- Winning the hackathon opens doors to SCF funding
- Potential for Stellar Foundation to promote Pangolin in their ecosystem

**O4 — B2B Pivot Potential (Escrow-as-a-Service)**
- After MVP: offer API to art platforms (RaketPH, local Discord bots)
- "SafeVault as EaaS (Escrow-as-a-Service)" — from Pangolin_Core_APIs.md
- B2B SaaS model = much more scalable revenue

**O5 — Expand Beyond Art**
- Music producers, video editors, writers, voice actors — all same problem
- Step 1: Digital art → Step 2: All digital creative work → Step 3: All gig work

**O6 — International Client Flow**
- Filipino freelancers often have US, EU, Japanese clients
- Cross-border USDC payment via Stellar = massive advantage over bank wire

### Threats

**T1 — Vgen Could Add Stellar Integration**
Vgen already serves the art commission community. If they add milestone-based escrow + blockchain, they'd be a direct threat.

**T2 — Regulatory Crackdown**
BSP is supportive of blockchain but could tighten VASP rules. Custodying user funds = risk.

**T3 — Stablecoin Depegging**
USDC has maintained peg but Terra/LUNA collapse created distrust. Users may resist stablecoin adoption.

**T4 — User Education Curve**
"You need a crypto wallet to get paid" will scare many Filipino freelancers unfamiliar with blockchain.

---

## 11. 7-Day Execution Plan

### Day 1 — May 18 (Launch Day)

**Morning:** Opening ceremony, ecosystem intro
**Afternoon:**
- [ ] Finalize team roles (assign below)
- [ ] Submit problem statement (use text from this doc)
- [ ] Set up GitHub repository
- [ ] Set up Stellar testnet wallets (all 5 team members)
- [ ] Install Freighter wallet on all machines
- [ ] Set up project boilerplate (Next.js + Tailwind)
- [ ] Join Stellar developer Discord

**Evening:**
- [ ] Finalize MVP scope (cut anything not essential to demo)
- [ ] Draw escrow flow on whiteboard/FigJam
- [ ] Create Figma wireframes (3 screens minimum: home, create escrow, escrow status)

---

### Day 2 — May 19 (Smart Contract + Backend)

**Primary Goal:** Core escrow logic working on testnet

- [ ] Implement Stellar multi-sig escrow OR Soroban contract
- [ ] USDC trustline setup on testnet
- [ ] Deposit USDC to escrow address (testnet)
- [ ] Verify locked funds from freelancer's wallet
- [ ] Backend: database schema + API endpoints
  - POST /escrow/create
  - GET /escrow/:id
  - POST /escrow/:id/deliver
  - POST /escrow/:id/approve
  - POST /escrow/:id/dispute

---

### Day 3 — May 20 (Frontend Integration)

**Primary Goal:** Working UI connected to testnet

- [ ] Freighter wallet connect button
- [ ] Create escrow form (amount, freelancer address, minimum guaranteed %, deadline)
- [ ] Escrow status page (show locked funds, delivery status)
- [ ] Delivery submission form
- [ ] Approve/Dispute buttons
- [ ] Testnet end-to-end test: full flow from create → deliver → approve

---

### Day 4 — May 21 (Checkpoint 1 + Polish)

**Morning:** Submit checkpoint proof (concept validation)
**Afternoon:**
- [ ] Fix bugs from Day 3 testing
- [ ] UI polish (make it look professional)
- [ ] Write README first draft
- [ ] Test with real team members playing freelancer + client roles
- [ ] Record screen captures for potential demo video clips

---

### Day 5 — May 22 (Testnet Complete + Mainnet Prep)

- [ ] Full testnet deployment confirmed
- [ ] Testnet deployment screenshots/transaction hashes saved
- [ ] Mainnet wallet funded with XLM (from hackathon support)
- [ ] USDC trustline on Mainnet
- [ ] Mainnet deployment started
- [ ] Start pitch deck creation
- [ ] Start demo video script

---

### Day 6 — May 23 (Final Submission)

**Hard deadline — everything must be done**

- [ ] Mainnet deployment CONFIRMED with transaction proof
- [ ] Live website accessible (Vercel URL)
- [ ] Demo video recorded and uploaded
- [ ] Pitch deck finalized (10-12 slides)
- [ ] GitHub README complete with:
  - Project description
  - Problem statement
  - Solution overview
  - Tech stack
  - How to run locally
  - Testnet/Mainnet deployment details
  - Team information
- [ ] Submit all materials via hackathon portal

---

### Day 7 — May 24 (Demo Day)

- [ ] 3-5 minute live presentation rehearsed
- [ ] Live demo ready (use testnet for demo to avoid real funds)
- [ ] Backup: pre-recorded demo video ready if live fails
- [ ] Anticipate judge questions (see Q&A prep below)

---

## 12. Team Roles Recommendation

### Suggested Assignments for Team of 5

| Role | Focus | Deliverables |
|---|---|---|
| **Lawrence (Lead)** | Project management, pitch, business strategy | Pitch deck, problem statement, judge Q&A, final integration |
| **Dev 1 (Blockchain)** | Stellar smart contract / escrow logic | Soroban contract or multi-sig implementation, testnet/mainnet deployment |
| **Dev 2 (Backend)** | API + database | REST API, PostgreSQL, escrow state machine |
| **Dev 3 (Frontend)** | UI + wallet integration | Next.js app, Freighter wallet connect, all screens |
| **Bizops/Design** | Business + UX/design support | Figma wireframes, README, demo video, market research, pitch deck design |

### Communication Protocol

- Daily standup: 15 min every morning (what I did, what I'm doing, blockers)
- GitHub: feature branches, PR reviews even for hackathon (keeps history clean for judges)
- Discord/group chat for async
- Lawrence reviews all business-facing content before submission

---

## 13. Judging Criteria Alignment

### How Pangolin Scores on Each Criterion

**Real-World Impact (30%) — TARGET: 28-30/30**

Story to tell: "Every day, Filipino freelancers spend 20+ hours on a commission only to have the client dispute the payment on PayPal and win automatically — because PayPal doesn't recognize digital work as deliverable. Pangolin makes this impossible."

Evidence:
- Payment comparison table (your existing doc) = undeniable
- Filipino freelancer economy data (1.5M+)
- Specific dollar amounts lost to chargeback fraud

**Technical Execution on Stellar (25%) — TARGET: 20-25/25**

Must demonstrate:
- USDC on Stellar (not just XLM)
- Working escrow logic on-chain (Soroban OR multi-sig)
- Freighter wallet integration
- Mainnet deployment proof
- Transaction hashes (real on-chain evidence)

**UX / Product Usability (20%) — TARGET: 16-20/20**

Requirements:
- Clean, modern UI (not a blockchain app that looks like 2017)
- Full user journey demonstrable in < 2 minutes
- Mobile-responsive (even if web-only)
- Clear status indicators (escrow states visible)
- Error handling visible

**Innovation (15%) — TARGET: 12-15/15**

Innovation angle: **The minimum-guaranteed payment mechanic**. No other escrow platform has this. Frame it as:
> "We don't just hold funds — we mathematically guarantee the freelancer always gets paid something, making bad-faith disputes economically irrational for clients."

**Feasibility & Scalability (10%) — TARGET: 8-10/10**

Show:
- Revenue model (1-3% transaction fee)
- Stellar can handle millions of TPS
- Clear path from MVP to product
- TAM/SAM numbers

---

## 14. Submission Checklist

### GitHub Repository
- [ ] Public repository
- [ ] Clear folder structure
- [ ] `.env.example` file (no real keys committed)
- [ ] All code committed and working

### README Must Include
- [ ] Project name + tagline
- [ ] Problem statement (1 paragraph)
- [ ] Solution description (1 paragraph)
- [ ] How it works (user flow with screenshots or diagrams)
- [ ] Tech stack table
- [ ] Setup instructions (how to run locally)
- [ ] Testnet deployment link + transaction hash
- [ ] Mainnet deployment link + transaction hash
- [ ] Team information
- [ ] Freighter wallet address for prize

### Demo Video (3-5 minutes)
- [ ] Introduce the problem (30 sec)
- [ ] Show the product (2-3 min live or recorded demo)
- [ ] Explain Stellar integration (30 sec)
- [ ] State the ask / vision (30 sec)
- [ ] Upload to YouTube (unlisted) or Loom

### Pitch Deck (10-12 slides)
1. Cover — Pangolin logo + tagline
2. The Problem — "Filipino freelancers lose ₱X to bad-faith clients every year"
3. Why existing tools fail — payment comparison table
4. Our Solution — escrow flow diagram
5. Key Innovation — minimum guaranteed payment mechanic
6. How it works — 4-step user journey
7. Tech stack — Stellar + Soroban/multi-sig diagram
8. Market — TAM/SAM/SOM (add when research returns)
9. Business model — 1-3% transaction fee
10. Traction / Demo proof — screenshots + testnet hash
11. Team — photos, roles, bios
12. Vision — roadmap + call to action

---

## 15. Open Questions & Decisions Needed

### Critical Decisions (Day 1)

| Question | Options | Recommendation |
|---|---|---|
| Escrow implementation | Soroban smart contract vs Multi-sig accounts | **Multi-sig for MVP** (faster), Soroban in README as roadmap |
| Frontend wallet | Freighter only vs also Lobstr | **Freighter only** — simpler to integrate |
| Dispute resolution | Manual admin vs smart contract timeout | **Timeout auto-release** (simpler, on-chain) |
| Minimum guarantee % | Fixed (e.g., 25%) vs user-configurable | **User-configurable at escrow creation** |
| Stablecoin | USDC only vs USDC + XLM | **USDC only** — stable, no volatility issue |

### Post-Hackathon Decisions

- KYC/AML integration plan (Sumsub is the rec from Pangolin_Core_APIs.md)
- Fiat on-ramp partnership (Coins.ph, PDAX)
- BSP VASP registration planning
- B2B API offering to art platforms

---

## Appendix A — Existing Brand Name History

The project has evolved through naming iterations:
- **SafeVault** — Original concept name (general marketplace escrow)
- **Pangolin** — Current chosen brand name (focus: digital art freelancers)

Pangolin is the name to use for all hackathon submissions.

---

## Appendix B — Potential Taglines

From SafeVault doc + new suggestions:

**For pitch:**
- "Trust Every Transaction." (from existing doc)
- "Your Funds. Safely Held." (from existing doc)
- "Work Delivered. Payment Guaranteed." (new — stronger for freelancers)
- "The Escrow Layer for Digital Creators." (new — B2B positioning)
- "Pangolin: Where Art and Payment Finally Trust Each Other." (new)

**Recommended for hackathon:** "Work Delivered. Payment Guaranteed."

---

## Appendix C — Selected Stellar Track

Based on Pangolin's concept, the best track alignment is:

**Primary: Stablecoins & PayFi**  
Pangolin uses USDC (stablecoin) as the escrow currency and enables PayFi (payment finance) for the gig economy.

**Secondary fit: Financial Inclusion**  
Unbanked/underbanked Filipino freelancers getting access to secure payment infrastructure.

---

*This document will be updated as research agents return with market sizing, problem validation, GTM strategy, and technical recommendations.*

*Research agents dispatched: TAM/SAM/SOM Agent, Problem Validation Agent, GTM Agent, Hackathon Win Strategy Agent*

---

## References

### Internal Source Documents

Primary input files located in `source-documents/` that this report synthesizes:

- **`source-documents/Hackathon_Rules_Schedule_And_Judging_Criteria.md`** — Hackathon event details (dates, prize pool, team size, format), 7-day schedule, judging criteria and weights (Impact 30%, Technical 25%, UX 20%, Innovation 15%, Feasibility 10%), submission requirements, and track definitions. Directly drives Sections 2, 11, 13, 14, and Appendix C.
- **`source-documents/Pangolin_Initial_Business_Analysis_And_SafeVault_Concept.md`** — Original SafeVault/Pangolin business analysis: problem statement, escrow model design, dispute management, trust gap framing, two-sided platform concept, and B2B EaaS opportunity. Foundation for Sections 1, 4, 5, 8, 9, 10, Appendix A, and Appendix B.
- **`source-documents/Pangolin_API_Stack_Recommendations_KYC_AML_Blockchain.md`** — API stack recommendations for KYC (Sumsub, Onfido), AML/fraud detection (Chainalysis, TRM Labs), blockchain validation, and escrow infrastructure. Referenced in Sections 6 and 15 (post-hackathon KYC/AML decisions).
- **`source-documents/Payment_Platforms_Comparison_Why_They_Fail_Freelancers.md`** — Detailed comparison of PayPal, Stripe/Credit Cards, Etsy, Vgen, and RaketPH: protection policies, fee structures, and critical gaps for freelancers. Core evidence for Sections 3, 4, 7, and the judging criteria alignment in Section 13.

---

### Internal Research Files

Detailed analysis files located in `research/` that feed into the key numbers and strategic recommendations in this master report:

- **`research/Market_Sizing_TAM_SAM_SOM_Bottom_Up_Analysis.md`** — Bottom-up TAM ($450M), SAM ($71.8M), SOM ($3.75M Year 3 revenue) calculations; freelancer population data; average commission values; revenue projections Years 1–5; sensitivity analysis.
- **`research/Problem_Validation_Is_Problem_Real_Large_Significant.md`** — Problem reality (9/10), scale (8/10), and significance (9/10) scoring; hard evidence from platform policies, community data, and financial loss estimates.
- **`research/Business_Model_Revenue_Strategy_And_Unit_Economics.md`** — 2.5% fee rationale; unit economics ($3.75 revenue per transaction, ~99% gross margin); CAC ($5 blended), LTV ($116), LTV:CAC (23:1); break-even analysis (~110 users, Month 3); revenue projections.
- **`research/GTM_Go_To_Market_Strategy_Philippines_SEA.md`** — Beachhead market selection; community targeting (Reddit, Facebook, Discord, Twitter); influencer strategy; partnership roadmap (RaketPH, Coins.ph); 30/60/90-day KPIs; Floor Stories campaign.
- **`research/Pitch_Narrative_Storytelling_Strategy_And_Slide_Outline.md`** — 5-minute narrative arc; 12-slide deck outline; judge Q&A preparation; tagline options; what NOT to say; the Pangolin metaphor.
- **`research/Pre_Build_Validation_Playbook_48_Hour_Community_Sprint.md`** — 6 unvalidated assumptions with risk ratings; 48-hour sprint execution plan; Go/No-Go scoring framework; Typeform validation questions; Mom Test interview scripts for freelancers and clients.

---

### External Sources

Third-party data and reports cited across this document and the research files:

1. Payoneer Global Freelancer Income Report 2022–2023 — 1.5M registered PH freelancers; Philippines #3 globally for freelancer earnings; design as #1 skill category; 70% of PH commissions from overseas clients
2. DOLE Philippines 2024 — Filipino freelancer population estimates; gig economy growth
3. Bangko Sentral ng Pilipinas (BSP) Digital Payments Report 2024 — 71% of Filipinos using digital payments (2024), up from 30% in 2020
4. Chainalysis Global Crypto Adoption Index 2023 — Philippines #1 in SEA crypto adoption; 55% SEA crypto-accessible rate
5. Stellar Development Foundation Annual Report 2024 — USDC on Stellar 340% growth; transaction finality (3–5 seconds); fee structure (~$0.00001/operation)
6. Grand View Research, "Digital Art Market" 2024 — $3.5B global market (2023), 14% CAGR to $7B+ by 2028
7. Google-Temasek-Bain e-Conomy SEA 2024 Report — SEA digital economy and gig market growth context
8. Vgen platform statistics 2024 — 250K–500K artists; 9.4–10.4% fee structure; $50M+ transaction volume
9. PayPal Seller Protection Policy (official PayPal policy page) — Digital and intangible services exclusion clause; 180-day buyer dispute window; ₱900 dispute processing fee
10. Freelancers Union, "Freelancing in America" 2023 — 71% non-payment incidence; average $6,000/year loss
11. Fiverr Q4 2023 Earnings Call — ~2.1M active "Graphics & Design" sellers globally
