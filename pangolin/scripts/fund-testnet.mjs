#!/usr/bin/env node
/**
 * Pangolin — Testnet USDC Faucet
 *
 * Funds a Stellar testnet account with XLM + USDC for local demo testing.
 * Safe for testnet ONLY. Never paste a mainnet secret key here.
 *
 * Run from the pangolin/ directory:
 *   node scripts/fund-testnet.mjs --secret <TESTNET_SECRET_KEY>
 *   node scripts/fund-testnet.mjs --address <PUBLIC_KEY>    (XLM only, no signing needed)
 *
 * What it does:
 *   1. Fund account with 10,000 XLM via Friendbot
 *   2. Create trustline to testnet USDC (Circle issuer)
 *   3. Swap ~200 XLM → 100 USDC via Stellar DEX (pathPaymentStrictReceive)
 *   4. Print final balances
 */

import {
  Asset,
  Keypair,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Horizon,
} from "@stellar/stellar-sdk";

const HORIZON_URL       = "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL     = "https://friendbot.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const USDC_ISSUER       = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const USDC_ASSET        = new Asset("USDC", USDC_ISSUER);
const EXPECTED_SAC      = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

// ─── helpers ──────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
  return { secret: get("--secret"), address: get("--address") };
}

function step(n, total, label) {
  console.log(`\n[${n}/${total}] ${label}`);
}

async function friendbot(address) {
  const res  = await fetch(`${FRIENDBOT_URL}/?addr=${address}`);
  const body = await res.json();
  if (!res.ok) {
    const detail = body?.detail ?? JSON.stringify(body);
    if (detail.includes("already funded") || detail.includes("createAccountAlreadyExist")) {
      return null; // already exists — not an error
    }
    throw new Error(detail);
  }
  return body.hash;
}

async function loadAccount(server, address) {
  try {
    return await server.loadAccount(address);
  } catch (e) {
    if (e.response?.status === 404) {
      throw new Error(`Account ${address} not found on testnet. Run Friendbot first.`);
    }
    throw e;
  }
}

function hasTrustline(account) {
  return account.balances.some(
    (b) => b.asset_type !== "native" && b.asset_code === "USDC" && b.asset_issuer === USDC_ISSUER,
  );
}

function getBalance(account, code) {
  const bal = code === "XLM"
    ? account.balances.find((b) => b.asset_type === "native")
    : account.balances.find((b) => b.asset_code === code && b.asset_issuer === USDC_ISSUER);
  return bal ? parseFloat(bal.balance).toFixed(2) : "0.00";
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { secret, address: addressArg } = parseArgs();

  if (!secret && !addressArg) {
    console.error(
      "Usage:\n" +
      "  node scripts/fund-testnet.mjs --secret <TESTNET_SECRET_KEY>\n" +
      "  node scripts/fund-testnet.mjs --address <PUBLIC_KEY>   (XLM only)",
    );
    process.exit(1);
  }

  let keypair = null;
  let address;

  if (secret) {
    if (!secret.startsWith("S")) {
      console.error("Secret key must start with S. Mainnet keys are NOT safe here.");
      process.exit(1);
    }
    keypair = Keypair.fromSecret(secret);
    address = keypair.publicKey();
  } else {
    address = addressArg;
  }

  console.log("─────────────────────────────────────────────────────");
  console.log("  Pangolin Testnet Faucet");
  console.log("─────────────────────────────────────────────────────");
  console.log(`  Address : ${address}`);

  // Verify SAC matches the contract's USDC token
  const sac = USDC_ASSET.contractId(NETWORK_PASSPHRASE);
  if (sac === EXPECTED_SAC) {
    console.log(`  USDC SAC: ✓ matches contract config`);
  } else {
    console.warn(`  ⚠  SAC mismatch — computed ${sac}`);
    console.warn(`     Expected ${EXPECTED_SAC}`);
  }

  const server = new Horizon.Server(HORIZON_URL);
  const TOTAL  = keypair ? 3 : 1;

  // ── Step 1: XLM via Friendbot ────────────────────────────────────────────
  step(1, TOTAL, "Funding with testnet XLM (Friendbot)...");
  try {
    const hash = await friendbot(address);
    if (hash) {
      console.log(`  ✓ 10,000 XLM sent · tx ${hash}`);
    } else {
      console.log("  Account already exists — skipped Friendbot.");
    }
  } catch (err) {
    console.error(`  ✗ Friendbot error: ${err.message}`);
    process.exit(1);
  }

  if (!keypair) {
    console.log("\n  No --secret provided. Skipping trustline + USDC swap.");
    console.log("  Run with --secret to complete USDC setup.\n");
    return;
  }

  // ── Step 2: USDC trustline ───────────────────────────────────────────────
  step(2, TOTAL, "Creating USDC trustline...");
  try {
    let account = await loadAccount(server, address);

    if (hasTrustline(account)) {
      console.log("  Trustline already exists — skipped.");
    } else {
      const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(Operation.changeTrust({ asset: USDC_ASSET }))
        .setTimeout(30)
        .build();
      tx.sign(keypair);
      const res = await server.submitTransaction(tx);
      console.log(`  ✓ Trustline created · tx ${res.hash}`);
    }
  } catch (err) {
    const detail = err.response?.data?.extras?.result_codes ?? err.message;
    console.error("  ✗ Trustline failed:", JSON.stringify(detail));
    process.exit(1);
  }

  // ── Step 3: Swap XLM → USDC via DEX ─────────────────────────────────────
  step(3, TOTAL, "Swapping XLM → 100 USDC via Stellar DEX...");
  try {
    const account = await loadAccount(server, address);
    const currentUSDC = parseFloat(getBalance(account, "USDC"));

    if (currentUSDC >= 100) {
      console.log(`  Already have ${currentUSDC} USDC — skipped swap.`);
    } else {
      const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(
          Operation.pathPaymentStrictReceive({
            sendAsset:   Asset.native(),
            sendMax:     "500",       // spend at most 500 XLM
            destination: address,     // receive to self
            destAsset:   USDC_ASSET,
            destAmount:  "100",       // want exactly 100 USDC
            path:        [],          // direct XLM → USDC
          }),
        )
        .setTimeout(30)
        .build();
      tx.sign(keypair);
      const res = await server.submitTransaction(tx);
      console.log(`  ✓ Swapped → 100 USDC · tx ${res.hash}`);
    }
  } catch (err) {
    const codes = err.response?.data?.extras?.result_codes;
    console.warn("  ⚠  DEX swap failed (no liquidity on testnet right now).");
    if (codes) console.warn("     Codes:", JSON.stringify(codes));
    console.warn("\n  Manual USDC options:");
    console.warn("  A) Visit https://laboratory.stellar.org/?#txbuilder&network=test");
    console.warn("     — build a manage_sell_offer or path_payment tx manually");
    console.warn("  B) Ask Lawrence to transfer USDC from the admin account:");
    console.warn(`     GB23TQ6NGHNLYP6QCJUZG23CDR65BOXEPQ225NCL75SALH5GVZVTTD2Z`);
    console.warn("  C) Use Freighter's built-in swap (Settings → Swap) on testnet");
  }

  // ── Final balances ────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────");
  try {
    const account = await loadAccount(server, address);
    console.log(`  XLM  : ${getBalance(account, "XLM")}`);
    console.log(`  USDC : ${getBalance(account, "USDC")}`);
  } catch (err) {
    console.warn("  Could not fetch balances:", err.message);
  }
  console.log("─────────────────────────────────────────────────────");
  console.log("  Explorer:");
  console.log(`  https://stellar.expert/explorer/testnet/account/${address}`);
  console.log("─────────────────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("\nFatal:", err.message ?? err);
  process.exit(1);
});
