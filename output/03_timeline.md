# Pangolin — Build Timeline
**Starting: May 18, 2026 (Now) → Hard Deadline: Night of May 21, 2026**
*Stellar PH Hackathon 2026 | Document 3 of 4 | Generated: May 18, 2026*

---

**Constraint:** 3.5 days to checkpoint-ready MVP
**Hackathon Day 4 (May 21)** = Checkpoint 1 — concept validation + progress check
**Goal by May 21 night:** Working testnet demo of full escrow flow

**Team:** 5 developers
**Lawrence** = Lead / PM / Pitch (not primary coder during build phase)

---

## Day 1 — May 18 (Today) — Setup + Alignment

### Morning (Opening Ceremony + Ideation)
- [ ] Attend opening ceremony
- [ ] Submit problem statement (use `Day1_Idea_Submission_Form_Answers.txt`)
- [ ] Confirm final MVP scope with team (cut anything not in demo flow)

### Afternoon — All Team
- [ ] Create GitHub repository (public, as required)
- [ ] Set up Next.js 14 + TypeScript + Tailwind boilerplate
- [ ] All 5 team members install Freighter wallet
- [ ] All 5 team members get Stellar testnet wallets + XLM from friendbot
- [ ] Supabase project created (free tier) — get `DATABASE_URL`
- [ ] Set up `.env.example` file

### Role Division (confirm before Day 2)

| Role | Focus |
|------|-------|
| Dev 1 (Blockchain) | Soroban contract development |
| Dev 2 (Backend) | Next.js API routes + Supabase/Prisma schema |
| Dev 3 (Frontend) | Next.js UI + Freighter wallet connection |
| Dev 4 (Fullstack) | Integration bridge between frontend and contract calls |
| Lawrence | Figma wireframes today, pitch deck from Day 5 |

### Evening
- [ ] Figma wireframes: 5 screens (Home, Dashboard, Create, Status, Deliver)
- [ ] Finalize escrow contract interface (function signatures agreed between Dev 1 and Dev 4 before anyone starts coding)
- [ ] Dev 1 starts Soroban escrow contract skeleton in Rust
- [ ] Dev 2 sets up Prisma schema + first API route (`/api/escrow/create`)
- [ ] Dev 3 builds wallet connect/disconnect component

### Deliverable by End of Day 1
- ✅ Repo created with boilerplate
- ✅ Wallet connect working (can connect Freighter, see G-address)
- ✅ Contract function signatures agreed
- ✅ DB schema defined

---

## Day 2 — May 19 — Core Contract + Backend

**Target:** Escrow contract deployed on testnet + backend API functional

### Dev 1: Soroban Contract
- **AM:** Implement `create_escrow()` and `fund_escrow()` functions
- **PM:** Implement `approve_release()` and `trigger_dispute()` with min guarantee
- **PM:** Deploy to Stellar Testnet
- **EOD:** Test via Stellar Laboratory (manual invoke)

### Dev 2: Backend
- **AM:** `POST /api/escrow/create` — saves metadata to Supabase
- **AM:** `GET /api/escrow/:id` — retrieves metadata
- **PM:** `POST /api/escrow/:id/deliver` — logs delivery
- **PM:** `POST /api/escrow/:id/approve` — triggers on-chain call
- **EOD:** All API routes returning correct shapes

### Dev 3: Frontend
- **AM:** Home/landing page complete
- **AM:** Dashboard page — wallet-gated, shows list of escrows
- **PM:** Create Escrow form (inputs + validation)
- **EOD:** Form data submits to `/api/escrow/create`

### Dev 4: Integration
- **AM:** Wrap Stellar SDK calls (build transactions, sign via Freighter)
- **PM:** Hook up `fund_escrow()` call to frontend "Fund" button
- **PM:** Hook up `approve_release()` to "Approve" button
- **EOD:** Freighter signing flow working end-to-end for at least one action

### Deliverable by End of Day 2
- ✅ Soroban contract on testnet (contract ID exists)
- ✅ Can create + fund escrow from browser via Freighter
- ✅ Backend API operational
- ✅ DB records created on escrow creation

---

## Day 3 — May 20 — Frontend Integration + Full Flow

**Target:** Full escrow flow working testnet end-to-end in browser

### Dev 1: Contract Polish
- **AM:** `auto_release()` timeout enforcement tested
- **AM:** `cancel_escrow()` for mutual cancellation
- **PM:** Edge case testing — what if client disputes before delivery?
- **PM:** Help Dev 4 with any contract call issues

### Dev 2: Backend Polish
- **AM:** `POST /api/escrow/:id/dispute` — evidence storage
- **AM:** Resend email notifications wired up (at least 2 triggers)
- **PM:** `GET /api/wallet/:address` — get all escrows for dashboard
- **PM:** Error handling on all routes

### Dev 3: Frontend Polish
- **AM:** Escrow Status/Detail page (shows state, on-chain proof link, actions)
- **PM:** Delivery submission form (file upload + submit button)
- **PM:** Dispute evidence form
- **PM:** Transaction history list on dashboard

### Dev 4: Integration
- **AM:** `trigger_dispute()` contract call wired up
- **AM:** `submit_delivery()` file hash on-chain
- **PM:** Full flow test: `Create → Fund → Confirm → Deliver → Approve`
- **PM:** Second flow test: `Create → Fund → Confirm → Deliver → Dispute` → Verify minimum guarantee went to freelancer automatically

### Evening — Full Team Integration Test
- [ ] Play as client: create escrow, fund it
- [ ] Play as freelancer: confirm, see on-chain proof, submit delivery
- [ ] Play as client: approve → verify USDC hits freelancer wallet
- [ ] Repeat with dispute flow → verify 20% floor enforced
- [ ] Document all bugs found

### Deliverable by End of Day 3
- ✅ Full approve flow working on testnet
- ✅ Full dispute flow working (minimum guarantee enforced)
- ✅ All 5 screens navigable
- ✅ Freighter wallet signing at every step

---

## Day 4 — May 21 — Checkpoint + Polish (Hard Deadline Tonight)

**Target:** Checkpoint-ready build + judge-presentable quality

### Morning — Bug Fixes
- [ ] Fix all bugs found in Day 3 evening test
- [ ] Fix any UI layout issues
- [ ] Add loading states (transactions take 3–5 sec — show spinner)
- [ ] Add error messages (rejected transaction, wrong network, etc.)
- [ ] Add on-chain transaction hash display per escrow
- [ ] Mobile-responsive check (quick Tailwind breakpoint pass)

### Afternoon — Checkpoint Submission
- [ ] Submit checkpoint materials to hackathon portal
- [ ] Screenshots of working testnet demo
- [ ] Record 1–2 minute screen capture of full flow (for evidence)
- [ ] GitHub README first draft:
  - Problem + solution (copy from Day 1 form)
  - Tech stack table
  - How to run locally
  - Testnet deployment + contract address

### Evening — Hardening
- [ ] Test with REAL 5 team members on 5 different machines
- [ ] Edge case: what if user has no USDC trustline? (show error + guidance)
- [ ] Edge case: what if Freighter not installed? (show install prompt)
- [ ] Final end-to-end pass — no broken buttons

### Deliverable by End of Day 4 (Checkpoint)
- ✅ Working demo on Stellar Testnet
- ✅ All core flows: create, fund, deliver, approve, dispute
- ✅ Minimum guarantee enforced on-chain (provable with tx hash)
- ✅ Clean UI — no broken states
- ✅ README drafted
- ✅ Checkpoint submission sent

---

## Days 5–7 Overview (After Checkpoint — May 22–24)

### Day 5 (May 22)
- Full testnet confirmed
- Mainnet deployment begins
- Pitch deck creation (Lawrence leads)
- Demo video scripting

### Day 6 (May 23)
- Mainnet deployment CONFIRMED with tx proof
- Live website on Vercel accessible
- Demo video recorded + uploaded
- Pitch deck finalized (10–12 slides)
- GitHub README complete
- Final submission via hackathon portal

### Day 7 (May 24)
- Demo Day — 3–5 min live presentation
- Live product demo (use testnet to avoid real funds)
- Backup: pre-recorded demo video if live fails

---

## Critical Path — What Must Not Slip

| Priority | Item | Action |
|----------|------|--------|
| **KEEP** | Create escrow, fund, approve release | Core happy path — never cut |
| **KEEP** | Minimum guarantee on dispute | Core innovation — judges must see this |
| Cut first | Email notifications | Nice to have, not demo-critical |
| Cut second | Delivery file upload | Can demo with hardcoded delivery link |
| Cut third | Cancellation flow | Not needed for demo |
| **NEVER CUT** | Freighter wallet connect | Stellar integration proof |
| **NEVER CUT** | On-chain transaction hash display | Proof it's blockchain |

**Soroban fallback:** If Soroban contract takes too long, pivot to Stellar multi-sig accounts + pre-auth transactions. Less impressive but still 100% on-chain and valid for judging. Make this call by **end of Day 2** if contract not deployed.

---

## Team Bandwidth Warning

> 5 people × 3.5 days × ~14 hours/day = sustainable but tight

**DO NOT scope creep.** Every feature added risks the demo flow.

One broken demo flow = lost 30% judging score (Real-World Impact criterion).

**A clean demo of the CORE flow beats an ambitious half-finished product.**

---

*Pangolin | Stellar Philippines Hackathon 2026*
