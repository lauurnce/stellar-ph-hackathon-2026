# Pangolin — Coin Flow: Client to Freelancer
**Stellar PH Hackathon 2026 | Document 4 of 4**
*Generated: May 18, 2026*

---

## The Idea (Summary)

Pangolin uses USDC on Stellar as its payment currency. USDC travels through a Soroban smart contract escrow. Freelancers receive USDC and can convert to Philippine Peso via local crypto exchanges.

---

## Section 1: The Flow You Described — And Why It Is Wrong

**Your described flow:**
> "USD → stablecoin → XLM → USDC → USD → Peso"

### Problems with This Flow

**Problem 1 — USDC IS the stablecoin.**
You don't need: `USD → stablecoin → XLM → USDC`
That is actually: `USD → USDC → XLM → USDC` — circular. You came back to USDC after pointlessly converting through XLM.

**Problem 2 — XLM is NOT an intermediate payment currency.**
XLM is Stellar's native coin used only for:
- Minimum account balance (~1–2 XLM per wallet, currently ~$0.10)
- Transaction fees (~0.00001 XLM per operation, effectively free)

USDC travels through the Stellar network **WITHOUT becoming XLM.**

> Think of XLM as gas — your car uses gas but the package inside the car does not turn into gas.

**Problem 3 — Converting USDC → XLM → USDC adds:**
- Price slippage (XLM is volatile, USDC is not)
- Extra transaction fees (2 unnecessary conversions)
- Settlement delay
- No benefit whatsoever

**Problem 4 — "USD → Peso" detour is unnecessary.**
You can go `USDC → Peso` **directly** on Philippine exchanges (Coins.ph, PDAX). No need to convert USDC back to USD first.

---

## Section 2: The Correct Coin Flow

**Principle:** USDC moves through the entire system. XLM exists only in wallets to pay gas. It is never the payment currency.

---

### Client Side — Funding the Escrow

#### Scenario A: Philippine Client (has PHP)

```
PHP (in GCash, bank, or cash)
  ↓
PHP → USDC on Stellar
Via: Coins.ph or PDAX (local exchanges with PHP fiat on-ramp)
  1. Buy USDC on Coins.ph using GCash/bank transfer
  2. Withdraw USDC to Freighter wallet (Stellar network)
  Note: Must set up USDC trustline in Freighter first
  ↓
USDC in Client's Freighter Wallet (Stellar)
  ↓
Client clicks "Fund Escrow" on Pangolin
Freighter signs transaction
USDC transfers from client wallet → Pangolin Soroban Contract
[XLM used only to pay ~$0.00001 tx fee — not the payment itself]
  ↓
USDC LOCKED IN SOROBAN SMART CONTRACT
Neither party can touch it. Minimum guarantee % is pre-set.
```

#### Scenario B: International Client (has USD)

```
USD (bank account, credit card, PayPal)
  ↓
USD → USDC on Stellar
Via: Coinbase, Kraken, or Binance
  1. Buy USDC on exchange using bank transfer/card
  2. Withdraw to Freighter wallet, select "Stellar" network
  OR via: Circle.com API directly (Circle issues USDC natively on Stellar)
  ↓
USDC in Client's Freighter Wallet (Stellar)
  ↓
[Same as Scenario A from here — USDC → Soroban Contract]
```

---

### Inside Pangolin — Escrow Lifecycle

```
USDC LOCKED IN SOROBAN CONTRACT
  ↓
Freelancer confirms → Status: ACTIVE
  ↓
Freelancer submits work
  ↓
Client approves delivery
  ↓
Smart contract auto-releases USDC
[2.5% platform fee deducted before release]
  ↓
USDC released to Freelancer's Freighter Wallet
Settlement: 3–5 seconds on Stellar
```

**Dispute Path:**

```
If disputed instead of approved:
  ↓
Minimum guaranteed % (e.g., 20%) → Freelancer's wallet AUTOMATICALLY
[Enforced by contract code — client cannot override]
Remaining amount → held pending dispute resolution
```

---

### Freelancer Side — Receiving and Cashing Out

```
USDC in Freelancer's Freighter Wallet (Stellar)
  ↓
USDC → PHP
Via: Coins.ph or PDAX (direct USDC → PHP conversion)
  1. Send USDC from Freighter to Coins.ph Stellar deposit address
  2. Coins.ph credits PHP to your account
  3. Withdraw PHP to GCash, Maya, or bank account
  ↓
PHP in GCash / Bank Account
[Standard withdrawal time: instant to 1 business day on Coins.ph]
```

**Alternative for international freelancers wanting USD:**
`USDC in Freighter → Withdraw to Binance/Coinbase → USD bank withdrawal`
*(USDC = USD, essentially a free 1:1 conversion minus exchange fees)*

---

## Section 3: Simplified Visual Flow

```
[CLIENT]                                                  [FREELANCER]
  PHP/USD                                                     PHP
    ↓                                                          ↑
  Fiat On-ramp                                          Fiat Off-ramp
  (Coins.ph /                                           (Coins.ph /
   Binance / Circle)                                     PDAX)
    ↓                                                          ↑
  USDC on Stellar ──→ [PANGOLIN SOROBAN CONTRACT] ──→ USDC on Stellar
 (Client Freighter)    2.5% fee deducted              (Freelancer Freighter)
                       Min guarantee enforced
                       3–5 second settlement
```

> **XLM:** Exists in BOTH wallets as gas only (~1–2 XLM ≈ $0.10). Never converts. Never travels through escrow.

---

## Section 4: What XLM Actually Does (Clarified)

XLM (Lumens) is Stellar's native token. In Pangolin's context:

### What XLM IS
1. **Minimum account balance reserve** — Every Stellar wallet must hold 1 XLM base + 0.5 XLM per trustline. A wallet with USDC trustline needs ~1.5 XLM (~$0.15)
2. **Transaction fee payment** — ~0.00001 XLM per operation (~$0.000001) — effectively free
3. **Required for Soroban contract interaction** — Smart contract calls cost slightly more XLM but still <$0.001/call

### What XLM is NOT in Pangolin
- ❌ NOT the payment currency (USDC is)
- ❌ NOT an intermediate conversion step
- ❌ NOT something the user needs to manually manage for payments
- ❌ NOT volatile risk to the escrow value (USDC is stable)

> **User experience:** Users acquire ~2 XLM once ($0.20) and never think about it again. All escrow values are in USDC. All prices shown to users are in USDC/PHP.

---

## Section 5: Onboarding Friction & Solutions

| Friction | Solution |
|----------|----------|
| "I don't know how to buy USDC on Stellar" | In-app guide with step-by-step (Coins.ph → Freighter). Future: direct fiat on-ramp via Coins.ph API |
| "My USDC is on Ethereum/Polygon, not Stellar" | In-app alert if USDC detected on wrong network. Guide: withdraw from exchange to Stellar specifically. Never bridge — always withdraw direct. |
| "I don't have a Freighter wallet" | "Install Freighter" prompt with download link shown before wallet connect |
| "I don't have XLM for gas" | First-time user prompt: "You need ~2 XLM ($0.20) for gas fees." Friendbot auto-funds on testnet. |
| "USDC trustline not set up" | Pangolin automatically prompts trustline setup on first use. One Freighter signing prompt: "Add USDC to your wallet" |

---

## Section 6: Fees Across the Full Flow

| Step | Cost to User | Charged By |
|------|-------------|------------|
| PHP → USDC on Coins.ph | ~0.5–1% conversion | Coins.ph |
| Coins.ph → Freighter withdraw | ~1 USDC flat fee | Coins.ph |
| USDC → Pangolin Contract | ~$0.00001 | Stellar network |
| **Pangolin escrow fee** | **2.5% (client pays)** | **Pangolin** |
| Contract → Freelancer release | ~$0.00001 | Stellar network |
| Freelancer USDC → PHP | ~0.5–1% conversion | Coins.ph/PDAX |
| Coins.ph → GCash withdraw | Free or small flat | Coins.ph |

**Total effective cost (estimate):**
- **Client:** ~3.5–4% (Pangolin 2.5% + ~1% on-ramp)
- **Freelancer:** ~1% (off-ramp only)
- **vs PayPal:** 4–5% + chargeback risk + zero protection
- **vs Vgen:** 9.4–10.4% with no minimum guarantee

> Pangolin is still **60–75% cheaper** than alternatives WITH more protection.

---

## Section 7: Recommended Pitch Language for Coin Flow

### DO SAY

> "Clients pay in USDC — the dollar-pegged stablecoin issued natively on Stellar by Circle. Freelancers receive USDC and can instantly convert to Philippine Peso on Coins.ph or PDAX. USDC never changes value during the escrow — a ₱10,000 commission stays ₱10,000 throughout."

> "XLM is just gas. It's like having a small amount of local currency to pay highway tolls — it never touches your escrow balance."

### DO NOT SAY

| Wrong | Why |
|-------|-----|
| "You convert from USD to XLM to USDC" | This is wrong and confuses judges |
| "USDC is converted to XLM for the transfer" | USDC travels as USDC on Stellar |
| "You need XLM to pay" | Frames XLM as payment currency, not gas |

---

*Pangolin | Stellar Philippines Hackathon 2026*
