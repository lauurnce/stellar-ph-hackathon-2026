// "12.5" with decimals=7 → 125000000n
export function parseAmountToInt(amount: string, decimals: number): bigint {
  const trimmed = amount.trim();
  if (!trimmed || isNaN(Number(trimmed))) throw new Error("Invalid amount.");

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  if (fractionPart.length > decimals) {
    throw new Error(`Use at most ${decimals} decimal places.`);
  }

  const whole = BigInt(wholePart);
  const paddedFraction = fractionPart.padEnd(decimals, "0");
  const fraction = paddedFraction ? BigInt(paddedFraction) : 0n;
  const result = whole * 10n ** BigInt(decimals) + fraction;

  if (result <= 0n) throw new Error("Amount must be greater than zero.");
  return result;
}

// 125000000n with decimals=7 → "12.5"
export function formatAmount(value: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;
  if (fraction === 0n) return whole.toString();
  const trimmed = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole}.${trimmed}`;
}

// "GDIX...RV2M"
export function shortenAddress(address: string | null, size = 6): string {
  if (!address) return "Not connected";
  if (address.length <= size * 2) return address;
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

// "1234567890n" → "123.4567890" displayed as "123.46 USDC"
export function formatUsdc(value: bigint): string {
  return `${formatAmount(value, 7)} USDC`;
}

// Format deadline timestamp to human-readable
export function formatDeadline(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
