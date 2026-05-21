"use client";

import {
  Address,
  BASE_FEE,
  Operation,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { appConfig, getExpectedNetworkPassphrase, hasRequiredConfig, getReadAddress } from "@/lib/config";
import { signWithFreighter } from "@/lib/freighter";
import type { EscrowData, EscrowStatus } from "@/lib/types";


// ─── RPC server ───────────────────────────────────────────────────────────────

function getServer() {
  return new rpc.Server(appConfig.rpcUrl, {
    allowHttp: appConfig.rpcUrl.startsWith("http://"),
  });
}

function ensureConfigured() {
  if (!hasRequiredConfig()) {
    throw new Error("Missing contract config. Set NEXT_PUBLIC_SOROBAN_CONTRACT_ID and NEXT_PUBLIC_STELLAR_RPC_URL in .env.local");
  }
}

// ─── Arg serialization ────────────────────────────────────────────────────────

type ContractArg = { value: string | bigint | number; type: "address" | "i128" | "u32" | "string" | "bytes" };

function buildArgs(values: ContractArg[]) {
  return values.map((entry) => nativeToScVal(entry.value, { type: entry.type }));
}

// ─── Transaction builder ──────────────────────────────────────────────────────

async function buildTransaction(sourceAddress: string, method: string, args: ReturnType<typeof buildArgs>) {
  const server = getServer();
  const sourceAccount = await server.getAccount(sourceAddress);
  return new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: getExpectedNetworkPassphrase(),
  })
    .addOperation(Operation.invokeContractFunction({ contract: appConfig.contractId, function: method, args }))
    .setTimeout(30)
    .build();
}

// ─── Read (simulate) ──────────────────────────────────────────────────────────

async function simulateRead<T>(
  method: string,
  args: ReturnType<typeof buildArgs>,
  transform: (value: unknown) => T,
): Promise<T> {
  ensureConfigured();
  const server = getServer();
  const transaction = await buildTransaction(getReadAddress(), method, args);
  const simulation = await server.simulateTransaction(transaction);

  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(normalizeError(simulation.error));
  }
  if (!simulation.result?.retval) {
    throw new Error(`${method} returned no value.`);
  }
  return transform(scValToNative(simulation.result.retval));
}

// ─── Write (sign + submit) ────────────────────────────────────────────────────

async function signAndSubmit<T>(
  sourceAddress: string,
  method: string,
  args: ReturnType<typeof buildArgs>,
  transformReturn?: (value: unknown) => T,
): Promise<{ hash: string; result?: T }> {
  ensureConfigured();
  const server = getServer();

  const transaction = await buildTransaction(sourceAddress, method, args);
  const preparedTransaction = await server.prepareTransaction(transaction);

  const signedXdr = await signWithFreighter(preparedTransaction.toXDR(), sourceAddress);
  const signedTransaction = TransactionBuilder.fromXDR(signedXdr, getExpectedNetworkPassphrase());

  const sendResponse = await server.sendTransaction(signedTransaction);
  if (sendResponse.status !== "PENDING") {
    throw new Error(normalizeError(sendResponse.errorResult ?? sendResponse.status));
  }

  const finalResponse = await server.pollTransaction(sendResponse.hash, {
    attempts: 20,
    sleepStrategy: () => 1200,
  });

  if (finalResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
    throw new Error("Transaction submitted but not confirmed. Check Stellar Explorer.");
  }
  if (finalResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
    throw new Error(normalizeError(finalResponse.resultXdr));
  }

  return {
    hash: sendResponse.hash,
    result: transformReturn && finalResponse.returnValue
      ? transformReturn(scValToNative(finalResponse.returnValue))
      : undefined,
  };
}

// ─── Deserialization ──────────────────────────────────────────────────────────

function readField(record: unknown, keys: string[]): unknown {
  if (!record || typeof record !== "object") return undefined;
  if (record instanceof Map) {
    for (const key of keys) if (record.has(key)) return record.get(key);
    return undefined;
  }
  const obj = record as Record<string, unknown>;
  for (const key of keys) if (key in obj) return obj[key];
  return undefined;
}

function toStr(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "toString" in v) return String(v);
  throw new Error("Cannot parse string from contract response.");
}

function toBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(Math.trunc(v));
  if (typeof v === "string") return BigInt(v);
  throw new Error("Cannot parse integer from contract response.");
}

function toNumber(v: unknown): number {
  const n = Number(toBigInt(v));
  if (!Number.isSafeInteger(n)) throw new Error("Value out of safe integer range.");
  return n;
}

const STATUS_MAP: Record<number, EscrowStatus> = {
  0: "CREATED",
  1: "FUNDED",
  2: "ACTIVE",
  3: "DELIVERED",
  4: "COMPLETED",
  5: "DISPUTED",
  6: "CANCELLED",
};

function toEscrowStatus(v: unknown): EscrowStatus {
  // scValToNative returns the enum variant as a number or string key
  if (typeof v === "number") return STATUS_MAP[v] ?? "CREATED";
  if (typeof v === "string") return (v.toUpperCase() as EscrowStatus) ?? "CREATED";
  return "CREATED";
}

function normalizeEscrow(raw: unknown, id: number): EscrowData {
  return {
    id,
    client: toStr(readField(raw, ["client"])),
    freelancer: toStr(readField(raw, ["freelancer"])),
    amountUsdc: toBigInt(readField(raw, ["amount_usdc", "amountUsdc"])),
    minGuaranteePct: toNumber(readField(raw, ["min_guarantee_pct", "minGuaranteePct"])),
    platformFeePct: toNumber(readField(raw, ["platform_fee_pct", "platformFeePct"])),
    status: toEscrowStatus(readField(raw, ["status"])),
    deliveryHash: (() => {
      const v = readField(raw, ["delivery_hash", "deliveryHash"]);
      if (v == null) return null;
      return toStr(v);
    })(),
    deadline: toNumber(readField(raw, ["deadline"])),
    title: toStr(readField(raw, ["title"])),
    description: toStr(readField(raw, ["description"])),
  };
}

// ─── Error normalization ──────────────────────────────────────────────────────

function normalizeError(error: unknown): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    // Stellar SDK errors are sometimes XDR objects — try to serialize safely
    try {
      const s = JSON.stringify(error);
      message = s && s !== "null" ? s : "Unknown contract error.";
    } catch {
      message = "Unknown contract error.";
    }
  }
  if (message.includes("#1") || /Unauthorized/i.test(message)) return "Only the authorized wallet can perform this action.";
  if (message.includes("#2") || /InvalidStatus/i.test(message)) return "This action is not allowed in the current escrow state.";
  if (message.includes("#3") || /InvalidInput/i.test(message)) return "Invalid input provided. Check all fields.";
  if (message.includes("#4") || /NotFound/i.test(message)) return "Escrow not found on-chain.";
  if (message.includes("#5") || /DeadlinePassed/i.test(message)) return "The escrow deadline has not yet passed.";
  if (message.includes("#6") || /AlreadyExists/i.test(message)) return "This escrow already exists.";
  return message;
}

// ─── Public API — Read ────────────────────────────────────────────────────────

export async function getEscrow(escrowId: number): Promise<EscrowData> {
  return simulateRead(
    "get_escrow",
    buildArgs([{ value: escrowId, type: "u32" }]),
    (raw) => normalizeEscrow(raw, escrowId),
  );
}

export async function getEscrowCount(): Promise<number> {
  return simulateRead("get_escrow_count", [], toNumber);
}

// ─── Public API — Write ───────────────────────────────────────────────────────

export async function createEscrow(
  client: string,
  freelancer: string,
  amountUsdc: bigint,
  minGuaranteePct: number,
  deadline: number,
  title: string,
  description: string,
): Promise<{ hash: string; escrowId: number | null }> {
  const res = await signAndSubmit(
    client,
    "create_escrow",
    buildArgs([
      { value: client, type: "address" },
      { value: freelancer, type: "address" },
      { value: amountUsdc, type: "i128" },
      { value: minGuaranteePct, type: "u32" },
      { value: BigInt(deadline), type: "u64" },
      { value: title, type: "string" },
      { value: description, type: "string" },
    ]),
    toNumber,
  );
  return { hash: res.hash, escrowId: res.result ?? null };
}

export async function fundEscrow(client: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(client, "fund_escrow", buildArgs([{ value: escrowId, type: "u32" }]));
  return { hash: res.hash };
}

export async function confirmFreelancer(freelancer: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(freelancer, "confirm_freelancer", buildArgs([{ value: escrowId, type: "u32" }]));
  return { hash: res.hash };
}

export async function submitDelivery(freelancer: string, escrowId: number, deliveryHashHex: string): Promise<{ hash: string }> {
  if (deliveryHashHex.replace(/^0x/, "").length !== 64) {
    throw new Error("delivery_hash must be a 32-byte hex string (64 hex chars).");
  }
  const hashBytes = Buffer.from(deliveryHashHex.replace(/^0x/, ""), "hex");
  const res = await signAndSubmit(
    freelancer,
    "submit_delivery",
    [
      nativeToScVal(escrowId, { type: "u32" }),
      xdr.ScVal.scvBytes(hashBytes),
    ],
  );
  return { hash: res.hash };
}

export async function approveRelease(client: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(client, "approve_release", buildArgs([{ value: escrowId, type: "u32" }]));
  return { hash: res.hash };
}

export async function triggerDispute(caller: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(
    caller,
    "trigger_dispute",
    buildArgs([
      { value: escrowId, type: "u32" },
      { value: caller, type: "address" },
    ]),
  );
  return { hash: res.hash };
}

export async function autoRelease(caller: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(caller, "auto_release", buildArgs([{ value: escrowId, type: "u32" }]));
  return { hash: res.hash };
}

export async function cancelEscrow(client: string, escrowId: number): Promise<{ hash: string }> {
  const res = await signAndSubmit(client, "cancel_escrow", buildArgs([{ value: escrowId, type: "u32" }]));
  return { hash: res.hash };
}
