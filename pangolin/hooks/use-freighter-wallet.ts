"use client";

import { useEffect, useState, useCallback } from "react";
import { connectFreighterWallet, readFreighterWallet } from "@/lib/freighter";
import type { WalletSnapshot } from "@/lib/types";

const INITIAL_WALLET: WalletSnapshot = {
  status: "disconnected",
  address: null,
  network: null,
  networkPassphrase: null,
  isExpectedNetwork: false,
};

export function useFreighterWallet() {
  const [wallet, setWallet] = useState<WalletSnapshot>(INITIAL_WALLET);

  const refreshWallet = useCallback(async (): Promise<WalletSnapshot> => {
    setWallet((cur) => ({
      ...cur,
      status: cur.status === "unsupported" ? "unsupported" : "connecting",
    }));
    try {
      const snapshot = await readFreighterWallet();
      setWallet(snapshot);
      return snapshot;
    } catch (error) {
      const fallback: WalletSnapshot = {
        status: "unsupported",
        address: null,
        network: null,
        networkPassphrase: null,
        isExpectedNetwork: false,
        error: error instanceof Error ? error.message : "Unable to read wallet state.",
      };
      setWallet(fallback);
      return fallback;
    }
  }, []);

  const connectWallet = useCallback(async (): Promise<WalletSnapshot> => {
    setWallet((cur) => ({ ...cur, status: "connecting" }));
    try {
      const snapshot = await connectFreighterWallet();
      setWallet(snapshot);
      return snapshot;
    } catch (error) {
      const fallback: WalletSnapshot = {
        ...INITIAL_WALLET,
        status: "disconnected",
        error: error instanceof Error ? error.message : "Could not connect wallet.",
      };
      setWallet(fallback);
      return fallback;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(INITIAL_WALLET);
  }, []);

  useEffect(() => {
    void refreshWallet();
  }, [refreshWallet]);

  const isConnected = wallet.status === "connected" && Boolean(wallet.address);
  const isWrongNetwork = wallet.status === "connected" && !wallet.isExpectedNetwork;

  return {
    wallet,
    isConnected,
    isWrongNetwork,
    connectWallet,
    disconnectWallet,
    refreshWallet,
  };
}
