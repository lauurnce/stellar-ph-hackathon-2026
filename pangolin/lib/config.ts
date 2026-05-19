import { Networks } from "@stellar/stellar-sdk";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

export const appConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "TESTNET",
  networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ?? TESTNET_PASSPHRASE,
  contractId: process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID ?? "",
  assetAddress: process.env.NEXT_PUBLIC_SOROBAN_ASSET_ADDRESS ?? "",
  assetCode: process.env.NEXT_PUBLIC_SOROBAN_ASSET_CODE ?? "USDC",
  assetDecimals: Number(process.env.NEXT_PUBLIC_SOROBAN_ASSET_DECIMALS ?? "7"),
  explorerUrl: process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL ?? "https://stellar.expert/explorer/testnet",
  readAddress: process.env.NEXT_PUBLIC_STELLAR_READ_ADDRESS ?? "",
};

const networkPassphraseMap: Record<string, string> = {
  TESTNET: Networks.TESTNET,
  PUBLIC: Networks.PUBLIC,
  PUBNET: Networks.PUBLIC,
};

export function getExpectedNetworkPassphrase(): string {
  return networkPassphraseMap[appConfig.network] ?? appConfig.networkPassphrase;
}

export function hasRequiredConfig(): boolean {
  return Boolean(appConfig.contractId && appConfig.rpcUrl);
}

export function getReadAddress(): string {
  if (!appConfig.readAddress) {
    throw new Error("NEXT_PUBLIC_STELLAR_READ_ADDRESS is not set. Add a funded testnet address to .env.local");
  }
  return appConfig.readAddress;
}
