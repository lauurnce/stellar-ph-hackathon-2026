# Pangolin — Tech Stack (Web Platform)
**Stellar PH Hackathon 2026 | Document 2 of 4**
*Generated: May 18, 2026*

---

## The Idea (Summary)

Pangolin is a Stellar-native escrow web platform for Filipino digital art freelancers. All financial logic lives on-chain. The web app is the UI layer that connects users to Stellar smart contracts via Freighter wallet.

---

## Full Web Tech Stack

### Blockchain Layer (Stellar)

| Setting | Value |
|---------|-------|
| Primary Network | Stellar Mainnet (production) |
| Test Network | Stellar Testnet (development / demo fallback) |
| Smart Contracts | Soroban (Stellar's native smart contract platform) |
| Contract Language | Rust |
| Payment Asset | USDC on Stellar (Circle-issued, native — NOT bridged) |
| Asset Issuer | `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` |
| XLM Role | Gas only (minimum account balance ~1 XLM + ~$0.00001/tx) |

**Contract Logic — Escrow State Machine:**

```
States: CREATED → FUNDED → ACTIVE → DELIVERED → APPROVED/DISPUTED
```

Key functions:
```rust
create_escrow(client, freelancer, amount, min_guarantee_pct, deadline)
fund_escrow(escrow_id)
submit_delivery(escrow_id, delivery_hash)
approve_release(escrow_id)
trigger_dispute(escrow_id, reason)
auto_release(escrow_id)   // timeout enforcement
cancel_escrow(escrow_id)
```

> Minimum guarantee logic hardcoded at contract level. Client CANNOT withdraw below freelancer's floor under any condition.

**Why Soroban over Multi-sig:**
- More technically impressive to hackathon judges
- Contract logic is verifiable on-chain (public audit)
- Minimum guarantee mechanic truly enforced by code, not admin
- Judges can read the contract on Stellar Expert / Stellar Laboratory

**Fallback** (if Soroban too slow to build): Multi-signature accounts + sequence-locked transactions. Still valid Stellar-native, less code-impressive to judges.

---

### Wallet

| Setting | Value |
|---------|-------|
| Primary | Freighter Wallet (browser extension — Chrome/Firefox/Brave) |
| SDK | `@stellar/freighter-api` |
| Alternative | LOBSTR wallet (mention in README, not primary for demo) |

Functions: Connect wallet, get public key (user identity), sign transactions, disconnect wallet.

---

### Frontend

| Setting | Value |
|---------|-------|
| Framework | Next.js 14 (React) + TypeScript |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui (or Radix UI) |
| Icons | Lucide React |

**Key Screens:**

1. **Home / Landing Page** — What Pangolin does (short pitch) + Connect Wallet button
2. **Dashboard** — All active/past escrows for connected wallet + status per escrow
3. **Create Escrow** — Form: freelancer address, amount, min %, deadline, description. Review & confirm before signing.
4. **Escrow Detail / Status Page** — Current status (state machine display), on-chain proof link (Stellar Expert), actions: Fund / Confirm / Submit Delivery / Approve / Dispute
5. **Delivery Submission** — Upload form for work files. File hash stored on-chain, files stored off-chain.
6. **Dispute Evidence Form** — Text description + screenshot/file upload

**Stellar SDK Integration:**

```
@stellar/stellar-sdk          ← Stellar JS SDK (transactions, keypairs)
@stellar/stellar-sdk/contract ← Soroban contract interaction
@stellar/freighter-api        ← Wallet connection + signing
```

---

### Backend

| Setting | Value |
|---------|-------|
| Runtime | Node.js |
| Framework | Next.js API Routes (same repo) OR Express.js |

**Purpose (off-chain only):**
- Store project metadata (title, description, file storage refs)
- Notification triggers (email/Discord on state changes)
- File upload handling (delivery files)
- **NO financial logic** — all fund logic is on-chain

**API Endpoints:**

```
POST   /api/escrow/create          ← Save metadata, returns escrow ID
GET    /api/escrow/:id             ← Get metadata + pull on-chain status
POST   /api/escrow/:id/deliver     ← Log delivery submission, trigger notify
POST   /api/escrow/:id/approve     ← Log approval, confirm on-chain
POST   /api/escrow/:id/dispute     ← Log dispute, store evidence
GET    /api/wallet/:address        ← Get all escrows for a wallet
```

---

### Database

| Setting | Value |
|---------|-------|
| Primary | PostgreSQL |
| Host | Supabase (free tier — managed PostgreSQL + instant API) |
| ORM | Prisma (type-safe DB access from TypeScript) |

**Core Schema:**

```sql
users         (wallet_address, email_optional, created_at)
escrows       (id, client_wallet, freelancer_wallet, amount_usdc,
               min_guarantee_pct, status, stellar_contract_id,
               stellar_tx_hash, created_at, deadline)
deliveries    (id, escrow_id, file_url, file_hash, submitted_at)
disputes      (id, escrow_id, raised_by, reason, evidence_url,
               resolution, resolved_at)
```

---

### File Storage

| Setting | Value |
|---------|-------|
| Service | Supabase Storage (free tier) OR Cloudinary (free tier) |
| Used for | Commission delivery files, dispute evidence screenshots |

> File hash stored on-chain for tamper-proof delivery proof.

---

### Notifications

| Setting | Value |
|---------|-------|
| Service | Resend (free tier — 3,000 emails/month) |

**Triggers:**
- Client: *"Freelancer confirmed, escrow is now ACTIVE"*
- Freelancer: *"Client funded escrow — you can start working"*
- Client: *"Freelancer submitted delivery — review now"*
- Both: *"Dispute opened — submit evidence within X days"*
- Both: *"Payment released" / "Escrow completed"*

Optional: Discord webhook notifications (artist communities use Discord)

---

### Hosting / Deployment

| Layer | Service |
|-------|---------|
| Frontend + API | Vercel (free tier, auto-deploy from GitHub) |
| Database | Supabase (free tier — hosted PostgreSQL) |
| File Storage | Supabase Storage (free tier) |
| Blockchain | Stellar Testnet → Stellar Mainnet |

**Environment Variables:**

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet|mainnet
NEXT_PUBLIC_USDC_ASSET_ISSUER=GA5ZSEJYB...
NEXT_PUBLIC_CONTRACT_ID=C...
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

---

### Version Control

| Setting | Value |
|---------|-------|
| Repository | GitHub (public — required by hackathon) |
| Branching | `main` (stable), `dev` (working), `feature/[name]` |
| CI/CD | Vercel auto-deploy on push to main |

---

## Summary Table

| Layer | Technology | Why |
|-------|-----------|-----|
| Blockchain | Stellar Mainnet | Native USDC, near-zero fees |
| Smart Contracts | Soroban (Rust) | Judges: technical credibility |
| Payment Asset | USDC on Stellar | Stable, no volatility |
| Wallet | Freighter + SDK | Most popular Stellar wallet |
| Frontend | Next.js 14 + TypeScript | Fast build, Vercel deploy |
| Styling | Tailwind CSS + shadcn/ui | Clean UI, fast development |
| Stellar JS SDK | `@stellar/stellar-sdk` | Blockchain interaction |
| Database | PostgreSQL (Supabase) | Off-chain metadata |
| File Storage | Supabase Storage | Delivery files |
| Backend/API | Next.js API Routes | Same repo, less complexity |
| Email Notify | Resend | Free tier, simple API |
| Hosting | Vercel | Free, instant GitHub deploy |

---

## What Is On-Chain vs Off-Chain

### On-Chain (Stellar / Soroban)
- ✅ Escrow contract deployment
- ✅ USDC fund locking
- ✅ Minimum guaranteed % enforcement
- ✅ Payment release (approve/dispute/timeout)
- ✅ Delivery file hash (tamper-proof proof of delivery)
- ✅ Transaction history per wallet
- ✅ Escrow state (CREATED/FUNDED/ACTIVE/etc.)

### Off-Chain (PostgreSQL + Backend)
- ✅ Project title, description
- ✅ Delivery file storage (actual files)
- ✅ Dispute evidence files
- ✅ Email/Discord notifications
- ✅ User profile metadata (optional)

> **Critical:** Backend can NEVER touch funds — all fund logic is in Soroban contract.

---

*Pangolin | Stellar Philippines Hackathon 2026*
