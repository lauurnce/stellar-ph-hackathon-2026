# Pangolin — Features & User Workflow
**Stellar PH Hackathon 2026 | Document 1 of 4**
*Generated: May 18, 2026*

---

## The Idea (Summary)

Pangolin is a blockchain-powered escrow payment platform built on Stellar, designed specifically for Filipino digital art freelancers and their clients.

It is **NOT a marketplace.** Discovery happens on Twitter/X, Instagram, Discord, Facebook. Pangolin enters AFTER the deal is agreed — acting as the trusted financial enforcement layer.

**Core innovation: Minimum Guaranteed Payment** — a pre-agreed floor percentage (default 20%) that ALWAYS goes to the freelancer, enforced by Soroban smart contract code. The client cannot get 100% back under any condition.

---

## Current Features (MVP Scope — Hackathon Build)

### Authentication

**F1. Freighter Wallet Connect**
- Browser extension wallet (Stellar-native)
- One-click connect/disconnect
- User identity = Stellar public key (G-address)
- No email, no password, no KYC at launch
- Wallet IS the account

---

### Escrow Creation

**F2. Create Escrow Agreement**
- Client fills in:
  - Freelancer's Stellar wallet address
  - Commission amount (denominated in USDC)
  - Project title and description
  - Deadline date
  - Minimum guaranteed payment % (10–50%, default: 20%)
  - Optional: milestone splits (e.g., 50% on sketch, 50% on final)
- Smart contract generated from inputs
- Both parties can review terms before funding

**F3. Escrow Invitation Link**
- Client generates shareable link
- Freelancer opens link, reviews terms, confirms participation
- Both parties sign/confirm before funding proceeds

---

### Funding

**F4. Client Funds Escrow**
- Client deposits USDC into Pangolin Soroban smart contract on Stellar
- 2.5% platform fee added on top (paid by client)
- Freighter wallet signs transaction
- Funds locked — neither party can unilaterally withdraw

**F5. Freelancer Funding Confirmation**
- Freelancer sees on-chain proof that funds are locked
- Dashboard shows: amount locked, minimum guaranteed amount, deadline
- Status changes: `CREATED → FUNDED → ACTIVE`
- Freelancer can now start work with full confidence

---

### Work Delivery

**F6. Delivery Submission**
- Freelancer submits work via Pangolin platform
- Upload deliverable files (images, ZIPs, links)
- Delivery timestamp recorded (off-chain metadata + on-chain hash)
- Client notified of delivery

**F7. Client Review Window**
- Client has X days (set at escrow creation) to review
- Can APPROVE or DISPUTE
- Silence timeout: auto-release after deadline if client does not respond

---

### Payment Resolution

**F8. Full Release (Client Approves)**
- Client clicks "Approve Delivery"
- 100% of escrowed funds (minus 2.5% platform fee) released instantly
- Funds go directly to freelancer's Freighter wallet
- Settlement: 3–5 seconds on Stellar

**F9. Dispute Trigger**
- Either party can raise a dispute within review window
- Both sides submit evidence (screenshots, messages, files)
- Pangolin admin/arbitration reviews
- Resolution splits funds based on decision

**F10. Minimum Guaranteed Enforcement (CORE MECHANIC)**
- If dispute triggered or timeout reached:
  - Minimum guaranteed % ALWAYS goes to freelancer automatically
  - Contract code enforces this — no human override possible
  - Remaining amount resolved via dispute process
- **Example:** 20% floor on ₱10,000 commission = freelancer gets AT MINIMUM ₱2,000 no matter what

---

### History & Tracking

**F11. Escrow Dashboard**
- List of all escrows (as client or freelancer)
- Status per escrow: `CREATED` / `FUNDED` / `ACTIVE` / `DELIVERED` / `APPROVED` / `DISPUTED` / `COMPLETED` / `CANCELLED`
- On-chain transaction hash viewable per escrow
- Filter by status, date, counterparty

**F12. Transaction History**
- Per-wallet escrow history
- Amounts, dates, counterparties
- Foundation for future Pangolin Trust Score

---

### Planned Post-Hackathon Features (Not MVP)

**F13. Pangolin Trust Score**
- On-chain reputation score from completed escrow history
- Verifiable freelancer credential tied to Stellar wallet address

**F14. EaaS — Escrow as a Service**
- B2B API for platforms to embed Pangolin escrow
- Target: RaketPH, Discord commission bots, art marketplaces

**F15. Fiat On/Off Ramp**
- Partner with Coins.ph and PDAX for direct PHP ↔ USDC conversion
- Removes need for users to manually acquire USDC

---

## User Workflow — Step by Step

### Actor: Client

| Step | Action |
|------|--------|
| 1 | Connect Freighter wallet to Pangolin web app |
| 2 | Click "Create New Commission Escrow" |
| 3 | Enter commission details: freelancer wallet address, amount in USDC, minimum guaranteed %, deadline, project description |
| 4 | Review escrow terms — see exactly what you agree to |
| 5 | Sign and fund — Freighter wallet prompt appears, client approves USDC transfer to escrow contract |
| 6 | Wait for freelancer confirmation |
| 7 | Freelancer starts work. Client sees status: ACTIVE |
| 8 | Receive delivery notification |
| 9a | **Satisfied** → Click "Approve" → USDC released to freelancer |
| 9b | **Dissatisfied** → Click "Dispute" → Submit evidence. Minimum 20% still goes to freelancer regardless of outcome |

---

### Actor: Freelancer

| Step | Action |
|------|--------|
| 1 | Receive commission invitation link from client |
| 2 | Open Pangolin, connect Freighter wallet |
| 3 | Review escrow terms (amount, minimum guarantee, deadline) |
| 4 | Confirm participation |
| 5 | See on-chain proof: *"₱X,XXX is locked and waiting for you"* |
| 6 | Work on commission with confidence |
| 7 | Submit completed work through Pangolin delivery form |
| 8a | **Client approves** → Receive 100% USDC minus platform fee instantly in Freighter wallet |
| 8b | **Client disputes** → Receive minimum guaranteed % automatically. Dispute process begins for remaining amount |
| 8c | **Client goes silent** → Auto-release after timeout, minimum guaranteed % enforced |

---

### Escrow State Machine

```
CREATED
  ↓ (client deposits USDC)
FUNDED
  ↓ (freelancer confirms)
ACTIVE
  ↓ (freelancer submits work)
DELIVERED
  ↓ ──────────────────────────────┐
APPROVED                      DISPUTED
  ↓                               ↓
COMPLETED                     RESOLVED
```

> CANCELLED available from CREATED or FUNDED if both parties agree

---

## Key Differentiator vs Competitors

| Feature | Pangolin | Vgen | PayPal | Escrow.com |
|---------|----------|------|--------|------------|
| Min guaranteed to seller | **YES** | No | No | No |
| Blockchain transparent | **YES** | No | No | No |
| Sub-$1 fees | **YES** | No | No | No |
| Works without marketplace | **YES** | No | Yes | Yes |
| Philippines-friendly | **YES** | Limited | Limited | Limited |
| Stellar/crypto native | **YES** | No | No | No |
| Milestone support | **YES** | No | No | Yes (paid) |

---

*Pangolin | Stellar Philippines Hackathon 2026*
