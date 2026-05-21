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
    (wallet_address: string) => updateProfile({ wallet_address }),
    [updateProfile]
  );

  return { profile, loading, updateProfile, saveWalletAddress, refetch: fetchProfile };
}
