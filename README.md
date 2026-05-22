<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1b2a,50:1a3a5c,100:0077b6&height=200&section=header&text=Pangolin&fontSize=64&fontColor=ffffff&fontAlignY=38&desc=PayPal%20protects%20the%20buyer.%20Pangolin%20protects%20the%20work.&descAlignY=60&descSize=16&animation=fadeIn" width="100%"/>
</div>

<div align="center">

# Blockchain Escrow for Filipino Digital Art Commissions

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-0077b6?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet/contract/CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC)
[![Stellar Mainnet](https://img.shields.io/badge/Stellar-Mainnet-00b344?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.expert/explorer/public/contract/CBYSBRWFEBQDMH3B4F4THBCXAYNCRFIIOEDX2P5ETZHRJA2K352WCIRV)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban%20%28Rust%29-e63946?style=for-the-badge)](https://soroban.stellar.org)
[![USDC](https://img.shields.io/badge/Payment-USDC%20on%20Stellar-2b9348?style=for-the-badge)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Hackathon](https://img.shields.io/badge/Stellar%20PH%20Hackathon-2026-f4a300?style=for-the-badge)](https://stellar.org)

**Track: MSME Commerce Tools**

</div>

---

## 📋 Table of Contents

- [The Problem](#-the-problem-640m-left-on-the-table)
- [The Solution](#-the-solution-escrow-enforced-by-code-not-trust)
- [Key Innovation](#-key-innovation-minimum-guaranteed-payment)
- [Key Features](#-key-features)
- [How It Works](#️-how-it-works)
- [Stellar Integration](#-stellar-blockchain-integration)
- [Tech Stack](#️-tech-stack)
- [Setup Instructions](#️-setup--local-development)
- [Live Deployment](#-live-on-stellar-testnet)
- [UI Screenshots](#-user-interface)
- [Team](#-team)

---

## 🎨 The Problem: ₱640M Left on the Table

The Philippines ranks **#3 globally for freelancer earnings** (Payoneer 2023). Over **500,000 Filipino digital art commission artists** earn an estimated **₱18–25 billion annually** — yet every major payment platform leaves them structurally unprotected.

![The Problem with Current Platforms](visuals/image%201.png)

### The Numbers

| Stat | Value |
|------|-------|
| Filipino digital art freelancers | 500,000+ |
| Annual commission earnings (PH) | ₱18–25 billion |
| Artists hit by non-payment / chargeback | **1 in 3** |
| Estimated annual losses to PH creatives | **₱640M** |
| PH global freelancer ranking | **#3** (Payoneer 2023) |
| Dispute fee charged to the artist | ₱900 (with zero recourse) |
| Buyer win rate in digital goods disputes | 73% |

**PayPal's official policy** explicitly excludes all digital and intangible services from Seller Protection. Banks side with buyers in 73% of digital goods disputes. Artists deliver the work, then have no legal recourse when clients disappear.

---

## 💡 The Solution: Escrow Enforced by Code, Not Trust

**Pangolin** is a blockchain-powered escrow payment platform built on Stellar, designed specifically for digital art commissions and creative freelance work.

Pangolin is **not a marketplace**. Discovery happens on Twitter/X, Instagram, Facebook, and Discord — as it already does. Pangolin enters **after the deal is agreed**, acting as the trusted financial enforcement layer that makes what both parties agreed to actually happen.

---

## 🔐 Key Innovation: Minimum Guaranteed Payment

The single mechanic no existing platform offers:

> **The client cannot get 100% back — ever.**

A pre-agreed floor percentage (10–50%, default **20%**) **always** goes to the freelancer, enforced by Soroban contract code — not by human moderation, not by dispute arbitration, not by trust.

| Scenario | Outcome |
|----------|---------|
| Client approves delivery | 100% released to freelancer, 2.5% platform fee |
| Client disputes | Minimum floor % goes to freelancer automatically |
| Client goes silent (48h) | Auto-release: full payment to freelancer |
| Client tries to cancel after delivery | Floor % locked — cannot be withdrawn |

This solves the core asymmetry: **freelancers get paid for work they already did.**

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Minimum Guaranteed Payment** | Pre-agreed floor (10–50%) enforced in contract code — not in moderation policy |
| 🧾 **Proof of Delivery on Stellar** | SHA-256 hash of delivered file timestamped on-chain — tamper-proof, immutable |
| ⏱️ **48-Hour Auto-Release** | If client goes silent after delivery, payment releases automatically |
| 🪜 **Milestone Support** | Split payments into on-chain milestones for longer projects |
| 👤 **Role-Based Dashboards** | Separate UI flows for client and freelancer — no crypto jargon |
| ⭐ **Trust Score Foundation** | On-chain escrow history = verifiable freelancer reputation, tied to Stellar wallet |
| 💵 **2.5% Fee — 75% Cheaper Than Vgen** | vs Vgen's 9.4–10.4% — with more protection |

---

## ⚙️ How It Works

![How Pangolin Works](visuals/image%202.png)

**Step 1 — Agree:** Artist and client negotiate privately (on Twitter/X, Discord, etc.) and agree on price, scope, and minimum guarantee percentage.

**Step 2 — Fund:** Client deposits USDC into the Pangolin Soroban smart contract. Both parties can verify the terms on-chain before work begins.

**Step 3 — Work:** Artist receives on-chain proof that funds are locked. Starts working with confidence.

**Step 4 — Deliver:** Artist submits completed work. SHA-256 file hash is recorded on Stellar — immutable, timestamped proof of delivery.

**Step 5 — Release:** Client approves → full USDC released to artist instantly. Client disputes or goes silent → minimum floor % auto-released to artist by contract.

---

## ⛓️ Stellar Blockchain Integration

Pangolin is **Stellar-native by design** — not a multi-chain app ported to Stellar. Every core financial function runs on Stellar infrastructure.

### Deployed Contract

| Property | Value |
|----------|-------|
| **Network** | Stellar Mainnet |
| **Contract ID** | `CBYSBRWFEBQDMH3B4F4THBCXAYNCRFIIOEDX2P5ETZHRJA2K352WCIRV` |
| **Status** | ✅ Deployed |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CBYSBRWFEBQDMH3B4F4THBCXAYNCRFIIOEDX2P5ETZHRJA2K352WCIRV) |
| **Network** | Stellar Testnet |
| **Contract ID** | `CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC` |
| **Status** | ✅ Deployed & Initialized |
| **USDC Asset (Testnet)** | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC) |

### Deployment Proof

<!-- Screenshot from stellar.expert — save as images/stellar-contract.png -->
![Pangolin Contract on Stellar Expert](images/stellar-contract.png)

<!-- Freighter wallet screenshot showing funded escrow — save as images/freighter-wallet.png -->
![Freighter Wallet](images/freighter-wallet.png)

### Escrow State Machine

```
CREATED → FUNDED → ACTIVE → DELIVERED → COMPLETED
                                      ↘ DISPUTED
                         ↘ CANCELLED
```

### Contract Functions

| Function | Description |
|----------|-------------|
| `create_escrow` | Client creates escrow with terms + minimum guarantee % |
| `fund_escrow` | Client deposits USDC — funds locked in contract |
| `confirm_freelancer` | Freelancer accepts the job on-chain |
| `submit_delivery` | Freelancer submits SHA-256 delivery hash |
| `approve_release` | Client approves — full payment to freelancer |
| `trigger_dispute` | Initiates dispute — floor % released to freelancer |
| `auto_release` | Releases payment after 48h client inaction |
| `cancel_escrow` | Cancels before funding, or after dispute resolution |
| `get_escrow` | Read escrow state |
| `get_escrow_count` | Read total escrow count |

### Why Stellar?

| Requirement | Stellar Solution |
|-------------|-----------------|
| Micro-transaction fees | ~$0.00001 per op — 2.5% fee still viable on ₱500 commissions |
| Fast settlement | 3–5 second finality vs PayPal's T+3 days |
| Stablecoin | Circle-issued USDC native to Stellar — no bridging risk |
| Smart contracts | Soroban — Rust-based, purpose-built for financial logic |
| PH on-ramps | USDC → PHP via Coins.ph, PDAX — already integrated |
| Trust infrastructure | Stellar wallet address = on-chain reputation foundation |

**Ethereum gas fees (~$5–50/tx) make $50 commissions economically unviable. Stellar's fee structure is the only chain where a 2.5% escrow platform makes sense for Philippine art commissions.**

---

## 🛠️ Tech Stack

![Pangolin Architecture](visuals/image3.png)

| Layer | Technology |
|-------|-----------|
| **Smart Contract** | Soroban (Rust), Stellar Testnet |
| **Payment** | USDC on Stellar (Circle-issued, native) |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **Wallet** | Freighter (`@stellar/freighter-api`) |
| **Stellar SDK** | `@stellar/stellar-sdk` |
| **Database** | Supabase (PostgreSQL) — off-chain metadata only |
| **Auth** | Supabase Auth + Freighter wallet linking |
| **Deployment** | Vercel (frontend), Stellar Testnet (contract) |

---

## ⚙️ Setup & Local Development

### Prerequisites

- Node.js 18+
- Rust + `wasm32-unknown-unknown` target (`rustup target add wasm32-unknown-unknown`)
- Stellar CLI (`cargo install --locked stellar-cli`)
- Freighter browser extension
- Supabase account

### 1. Clone & Install

```bash
git clone https://github.com/your-org/stellar-ph-hackathon-2026.git
cd stellar-ph-hackathon-2026/pangolin
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CONTRACT_ID=CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC
NEXT_PUBLIC_USDC_ASSET=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

### 3. Run Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — connect Freighter wallet to start.

### 4. Build Smart Contract (optional)

```bash
cd ..
cargo build --target wasm32-unknown-unknown --release
```

### 5. Run Contract Tests

```bash
cargo test
```

### 6. Deploy Contract to Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/pangolin.wasm \
  --source my-key \
  --network testnet
```

---

## 🌐 Live on Stellar Testnet

| Item | Detail |
|------|--------|
| **Mainnet Contract ID** | `CBYSBRWFEBQDMH3B4F4THBCXAYNCRFIIOEDX2P5ETZHRJA2K352WCIRV` |
| **Mainnet Status** | ✅ Deployed |
| **Mainnet Explorer** | [stellar.expert/explorer/public/contract/CBYSBRW...](https://stellar.expert/explorer/public/contract/CBYSBRWFEBQDMH3B4F4THBCXAYNCRFIIOEDX2P5ETZHRJA2K352WCIRV) |
| **Testnet Contract ID** | `CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC` |
| **Testnet Status** | ✅ Deployed & `init()` called — contract live |
| **USDC (Testnet)** | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` |
| **Testnet Explorer** | [stellar.expert/explorer/testnet/contract/CC4UBEG...](https://stellar.expert/explorer/testnet/contract/CC4UBEGAAWHP3THETSYJZ6SGT6VEOXTLMYS5K4WL654LNXB2C5TOKQCC) |
| **Frontend** | `npm run dev` → localhost:3000 |

---

## 🖥️ User Interface

<!-- Add screenshots here: images/UI1.jpg through UI5.jpg -->
![Landing Page](images/UI1.jpg)
![Create Escrow Wizard](images/UI2.jpg)
![Client Dashboard](images/UI3.jpg)
![Freelancer Delivery Flow](images/UI4.jpg)
![Dispute Center](images/UI5.jpg)

---

## 👥 Team

Built for the **Stellar Philippines Hackathon 2026** — May 18–24, 2026

| Name | Role |
|------|------|
| **Lawrence Panes** | Team Lead — Product, Frontend |
| **Dave Aillerr Rivas** | Smart Contract, Backend |
| **Nichola Ilim** | Frontend, Full-Stack |
| **Hadji Esmael** | Team Member |
| **Nico Ome** | Team Member |

---

## 💬 Key Numbers for Judges

> "We charge **2.5%** — PayPal charges 4.4% with zero protection. Vgen charges 9.4%+ with zero protection."

> "**1 in 3** Filipino commission artists has experienced non-payment or chargeback fraud."

> "**₱640M** in estimated annual losses to Philippine digital creative workers."

> "**20% floor, enforced by code.** The client cannot weaponize the chargeback system after delivery."

> "**3–5 seconds** to settle on Stellar. PayPal is T+3 days."

> "Already **deployed on testnet.** Live contract, working product — not a mockup."

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0077b6,50:1a3a5c,100:0d1b2a&height=120&section=footer&animation=fadeIn" width="100%"/>

*Pangolin — Work with confidence. Get paid by code.*

</div>
