"use client";

import { useEffect, useState } from "react";

export function useEscrowDetail(supabase, escrowId) {
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !escrowId) return;
    let mounted = true;

    async function loadEscrow() {
      const { data, error } = await supabase
        .from("escrows")
        .select("*")
        .eq("id", escrowId)
        .single();

      if (mounted) {
        if (error) setError(error.message);
        else setEscrow(data);
        setLoading(false);
      }
    }

    loadEscrow();
    return () => { mounted = false; };
  }, [supabase, escrowId]);

  return { escrow, loading, error };
}

export function useEscrows(supabase) {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    async function loadEscrows() {
      const { data, error } = await supabase
        .from("escrows")
        .select("*")
        .order("created_at", { ascending: false });

      if (mounted) {
        if (error) setError(error.message);
        else setEscrows(data || []);
        setLoading(false);
      }
    }

    loadEscrows();
    return () => { mounted = false; };
  }, [supabase]);

  return { escrows, loading, error };
}

export function useMilestones(supabase, escrowId) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !escrowId) return;
    let mounted = true;

    async function loadMilestones() {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("escrow_id", escrowId)
        .order("sort_order", { ascending: true });

      if (mounted) {
        if (error) setError(error.message);
        else setMilestones(data || []);
        setLoading(false);
      }
    }

    loadMilestones();
    return () => { mounted = false; };
  }, [supabase, escrowId]);

  return { milestones, loading, error };
}

export function useUserProfile(supabase, userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !userId) return;
    let mounted = true;

    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (mounted) {
        if (error) setError(error.message);
        else setProfile(data);
        setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [supabase, userId]);

  return { profile, loading, error };
}

export function useDeliveries(supabase, escrowId) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !escrowId) return;
    let mounted = true;

    async function loadDeliveries() {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("escrow_id", escrowId)
        .order("created_at", { ascending: false });

      if (mounted) {
        if (error) setError(error.message);
        else setDeliveries(data || []);
        setLoading(false);
      }
    }

    loadDeliveries();
    return () => { mounted = false; };
  }, [supabase, escrowId]);

  return { deliveries, loading, error };
}

export function useActivities(supabase, limit = 5) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    async function loadActivities() {
      const { data, error } = await supabase
        .from("escrow_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (mounted) {
        if (error) setError(error.message);
        else setActivities(data || []);
        setLoading(false);
      }
    }

    loadActivities();
    return () => { mounted = false; };
  }, [supabase, limit]);

  return { activities, loading, error };
}

export function useDispute(supabase, escrowId) {
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !escrowId) return;
    let mounted = true;

    async function loadDispute() {
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .eq("escrow_id", escrowId)
        .single();

      if (mounted) {
        if (error && error.code !== "PGRST116") setError(error.message); // PGRST116 = no rows returned
        else setDispute(data || null);
        setLoading(false);
      }
    }

    loadDispute();
    return () => { mounted = false; };
  }, [supabase, escrowId]);

  return { dispute, loading, error };
}

export function useDisputeEvents(supabase, disputeId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !disputeId) return;
    let mounted = true;

    async function loadEvents() {
      const { data, error } = await supabase
        .from("escrow_events")
        .select("*")
        .eq("dispute_id", disputeId)
        .order("created_at", { ascending: true });

      if (mounted) {
        if (error) setError(error.message);
        else setEvents(data || []);
        setLoading(false);
      }
    }

    loadEvents();
    return () => { mounted = false; };
  }, [supabase, disputeId]);

  return { events, loading, error };
}

export function useDisputeArbiters(supabase, disputeId) {
  const [arbiters, setArbiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !disputeId) return;
    let mounted = true;

    async function loadArbiters() {
      const { data, error } = await supabase
        .from("dispute_arbiters")
        .select("*")
        .eq("dispute_id", disputeId);

      if (mounted) {
        if (error) setError(error.message);
        else setArbiters(data || []);
        setLoading(false);
      }
    }

    loadArbiters();
    return () => { mounted = false; };
  }, [supabase, disputeId]);

  return { arbiters, loading, error };
}

export function useDisputeResolution(supabase, disputeId) {
  const [resolution, setResolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !disputeId) return;
    let mounted = true;

    async function loadResolution() {
      const { data, error } = await supabase
        .from("dispute_resolutions")
        .select("*")
        .eq("dispute_id", disputeId)
        .single();

      if (mounted) {
        if (error && error.code !== "PGRST116") setError(error.message);
        else setResolution(data || null);
        setLoading(false);
      }
    }

    loadResolution();
    return () => { mounted = false; };
  }, [supabase, disputeId]);

  return { resolution, loading, error };
}

export function usePayments(supabase, userId) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !userId) return;
    let mounted = true;

    async function loadPayments() {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (mounted) {
        if (error) setError(error.message);
        else setPayments(data || []);
        setLoading(false);
      }
    }

    loadPayments();
    return () => { mounted = false; };
  }, [supabase, userId]);

  return { payments, loading, error };
}
