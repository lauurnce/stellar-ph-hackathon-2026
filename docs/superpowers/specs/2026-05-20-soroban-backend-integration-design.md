# Soroban Backend Integration Design
**Pangolin | Stellar PH Hackathon 2026**
*2026-05-20*

---

## Scope

Add the Soroban smart contract and frontend integration layer to the Pangolin project. Teammates are actively working on Supabase in `pangolin/app/` — no existing files are modified. Only new files are created.

---

## File Map

```
stellar-ph-hackathon-2026/
│
├── contract/
│   ├── Cargo.toml
│   ├── .gitignore
│   └── src/
│       ├── lib.rs
│       └── test.rs
│
├── scripts/
│   ├── build-contract.ps1
│   └── deploy-testnet.ps1
│
└── pangolin/
    ├── .env.example
    ├── lib/
    │   ├── utils.ts              (existing — untouched)
    │   ├── config.ts             (new)
    │   ├── types.ts              (new)
    │   ├── freighter.ts          (new)
    │   ├── contract-client.ts    (new)
    │   ├── validators.ts         (new)
    │   └── format.ts             (new)
    └── hooks/
        └── use-freighter-wallet.ts (new)
```

---

## Section 1 — Soroban Contract

**Location:** `contract/src/lib.rs`

**Cargo.toml crate name:** `pangolin-escrow`

**Storage model:** each escrow is stored by a `u32` escrow ID (auto-incrementing counter stored under a `DataKey::Counter` instance key).

### Escrow Struct

```rust
pub struct Escrow {
    pub client: Address,
    pub freelancer: Address,
    pub amount_usdc: i128,        // 7-decimal fixed (stroops-equivalent)
    pub min_guarantee_pct: u32,   // 10–50, default 20
    pub platform_fee_pct: u32,    // hardcoded 250 (= 2.5%)
    pub status: EscrowStatus,
    pub delivery_hash: Option<BytesN<32>>,
    pub deadline: u64,            // ledger timestamp
    pub title: String,
    pub description: String,
}
```

### State Machine

```
CREATED   --fund_escrow()-----------> FUNDED
FUNDED    --confirm_freelancer()-----> ACTIVE
ACTIVE    --submit_delivery()--------> DELIVERED
DELIVERED --approve_release()--------> COMPLETED
DELIVERED --trigger_dispute()--------> DISPUTED
DELIVERED --auto_release()-----------> COMPLETED  (deadline passed, client silent)
CREATED|FUNDED --cancel_escrow()-----> CANCELLED  (client only; freelancer not yet active)
```

### Contract Functions

| Function | Auth required | Description |
|---|---|---|
| `create_escrow(client, freelancer, amount, min_pct, deadline, title, desc)` | client | Stores escrow, returns escrow_id |
| `fund_escrow(escrow_id)` | client | Client deposits USDC; status CREATED→FUNDED |
| `confirm_freelancer(escrow_id)` | freelancer | Freelancer accepts terms; status FUNDED→ACTIVE |
| `submit_delivery(escrow_id, delivery_hash)` | freelancer | Records delivery hash; status ACTIVE→DELIVERED |
| `approve_release(escrow_id)` | client | Releases 100% minus platform fee to freelancer; status →COMPLETED |
| `trigger_dispute(escrow_id, reason)` | client or freelancer | Min guarantee auto-paid to freelancer; status →DISPUTED |
| `resolve_dispute(escrow_id, freelancer_pct)` | admin | Admin splits remainder; status →COMPLETED |
| `auto_release(escrow_id)` | anyone | Callable after deadline; min guarantee enforced; status →COMPLETED |
| `init(admin)` | deployer (once) | Sets admin address in persistent storage |
| `cancel_escrow(escrow_id)` | client | Only from CREATED or FUNDED (freelancer not yet active); refunds client |

### Min Guarantee Enforcement

In `trigger_dispute` and `auto_release`:
```
min_amount = escrow.amount_usdc * min_guarantee_pct / 100
freelancer always receives >= min_amount
remainder goes to dispute resolution or client
```
This is enforced by contract code — no human override.

### Error Enum

```rust
pub enum Error {
    Unauthorized    = 1,
    InvalidStatus   = 2,
    InvalidInput    = 3,
    NotFound        = 4,
    DeadlinePassed  = 5,
    AlreadyExists   = 6,
}
```

### Events

Emitted on every state transition:
- `("escrow", "created", escrow_id)`
- `("escrow", "funded", escrow_id)`
- `("escrow", "active", escrow_id)`
- `("escrow", "delivered", escrow_id)`
- `("escrow", "completed", escrow_id)`
- `("escrow", "disputed", escrow_id)`
- `("escrow", "cancelled", escrow_id)`

### Tests (test.rs — minimum 5)

1. `test_create_escrow` — creates escrow, verifies storage
2. `test_fund_and_confirm` — fund + freelancer confirm flow
3. `test_full_happy_path` — create→fund→confirm→deliver→approve→completed
4. `test_min_guarantee_on_dispute` — dispute enforces floor pct
5. `test_auto_release_after_deadline` — auto_release pays min guarantee

---

## Section 2 — Frontend Integration Layer

**All files land in `pangolin/lib/` or `pangolin/hooks/`. No `app/` files touched.**

### `pangolin/lib/config.ts`

Reads all `NEXT_PUBLIC_*` env vars. Exports `appConfig`, `getExpectedNetworkPassphrase()`, `hasRequiredConfig()`.

Key values:
- `rpcUrl` — Soroban RPC endpoint
- `network` — TESTNET or PUBLIC
- `networkPassphrase` — must match deployed contract network
- `contractId` — deployed Soroban contract ID (`C...`)
- `readAddress` — funded account for read-only simulate calls
- `assetAddress` — USDC asset contract address on Stellar
- `assetDecimals` — 7

### `pangolin/lib/types.ts`

```typescript
type WalletStatus = "disconnected" | "connecting" | "connected" | "unsupported"
type TxState     = "idle" | "signing" | "submitting" | "success" | "error"

type WalletSnapshot = { status, address, network, networkPassphrase, isExpectedNetwork, error? }
type TxFeedback     = { state, title, detail?, hash? }

type EscrowStatus = "CREATED" | "FUNDED" | "ACTIVE" | "DELIVERED" |
                    "APPROVED" | "DISPUTED" | "COMPLETED" | "CANCELLED"

type EscrowData = {
  id: number
  client: string
  freelancer: string
  amountUsdc: bigint
  minGuaranteePct: number
  status: EscrowStatus
  deliveryHash: string | null
  deadline: number
  title: string
  description: string
}
```

### `pangolin/lib/freighter.ts`

Three functions, each marked `"use client"`:
- `readFreighterWallet()` → `WalletSnapshot` — reads state without popup
- `connectFreighterWallet()` → `WalletSnapshot` — triggers approve popup
- `signWithFreighter(xdr, address)` → `string` — returns signed XDR

### `pangolin/lib/contract-client.ts`

One exported function per contract method. Read calls use `simulateRead`, write calls use `signAndSubmit`.

**Read (simulate):**
- `getEscrow(id)` → `EscrowData`
- `getEscrowCount()` → `number`

**Write (sign + submit):**
- `createEscrow(client, freelancer, amount, minPct, deadline, title, desc)` → `{ hash, escrowId }`
- `fundEscrow(client, escrowId)` → `{ hash }`
- `confirmFreelancer(freelancer, escrowId)` → `{ hash }`
- `submitDelivery(freelancer, escrowId, deliveryHash)` → `{ hash }`
- `approveRelease(client, escrowId)` → `{ hash }`
- `triggerDispute(caller, escrowId, reason)` → `{ hash }`
- `autoRelease(caller, escrowId)` → `{ hash }`
- `cancelEscrow(client, escrowId)` → `{ hash }`

Error codes mapped to human messages matching the Rust `Error` enum.

### `pangolin/lib/validators.ts`

- `isValidStellarAddress(value)` → `boolean`
- `requireText(value, label)` → `string`
- `parsePositiveInteger(value, label)` → `number`
- `validateMinGuaranteePct(value)` → `number` (clamps 10–50)

### `pangolin/lib/format.ts`

- `parseAmountToInt(amount, decimals)` → `bigint`
- `formatAmount(value, decimals)` → `string`
- `shortenAddress(address, size?)` → `string`

### `pangolin/hooks/use-freighter-wallet.ts`

Owns `WalletSnapshot` React state. Exports `{ wallet, connectWallet, disconnectWallet, refreshWallet }`. Auto-reads wallet on mount to restore sessions.

---

## Section 3 — Scripts

**`scripts/build-contract.ps1`**
```powershell
# Run from repo root
Set-Location contract
cargo build --target wasm32-unknown-unknown --release
Get-ChildItem target\wasm32-unknown-unknown\release\*.wasm
```

**`scripts/deploy-testnet.ps1`**
```powershell
# Run from repo root after build
stellar contract deploy `
  --wasm contract\target\wasm32-unknown-unknown\release\pangolin_escrow.wasm `
  --source my-key `
  --network testnet
```

---

## Section 4 — Environment

**`pangolin/.env.example`**
```env
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=
NEXT_PUBLIC_STELLAR_READ_ADDRESS=
NEXT_PUBLIC_SOROBAN_ASSET_ADDRESS=
NEXT_PUBLIC_SOROBAN_ASSET_CODE=USDC
NEXT_PUBLIC_SOROBAN_ASSET_DECIMALS=7
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
```

---

## What Is NOT Touched

- `pangolin/app/**` — all page components
- `pangolin/components/**`
- `pangolin/lib/utils.ts`
- `pangolin/package.json`
- Any Supabase/Prisma files teammates are working on

---

## Build & Deploy Order

1. `scripts/build-contract.ps1` — compile Rust to WASM
2. `scripts/deploy-testnet.ps1` — deploy to testnet, get contract ID
3. Copy contract ID into `pangolin/.env.local`
4. Fund read address via Friendbot
5. Run `cd pangolin && npm run dev`
