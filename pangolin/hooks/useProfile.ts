"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/lib/db-types";

export function useProfile() {
  const { supabase, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(data ?? null);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<Omit<Profile, "id" | "created_at">>) => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)
        .select()
        .single();
      if (data) setProfile(data);
      return data ?? null;
    },
    [supabase, user]
  );

  const saveWalletAddress = useCallback(
    async (wallet_address: string): Promise<{ error?: string }> => {
      if (!user) return { error: "Not authenticated" };

      // Always query DB — cached profile state may be stale after disconnect/reconnect
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("wallet_address")
        .eq("id", user.id)
        .single();

      if (currentProfile?.wallet_address && currentProfile.wallet_address !== wallet_address) {
        return { error: "An account can only link one wallet. Your wallet is already set." };
      }

      // Block if another account already owns this wallet
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("wallet_address", wallet_address)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return { error: "This wallet is already linked to another Pangolin account." };
      }

      await updateProfile({ wallet_address });
      return {};
    },
    [supabase, user, updateProfile]
  );

  return { profile, loading, updateProfile, saveWalletAddress, refetch: fetchProfile };
}
