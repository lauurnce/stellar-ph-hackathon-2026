export type EscrowStatusEnum =
  | "created"
  | "funded"
  | "active"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled";

export type DisputeStatusEnum = "open" | "under_review" | "resolved" | "closed";

export type UserRoleEnum = "client" | "freelancer" | "admin";

export interface Profile {
  id: string;
  wallet_address: string | null;
  display_name: string | null;
  email: string | null;
  role: UserRoleEnum | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Escrow {
  id: string;
  client_id: string | null;
  freelancer_id: string | null;
  client_wallet: string;
  freelancer_wallet: string | null;
  title: string;
  category: string | null;
  description: string | null;
  amount_usdc: number;
  platform_fee_usdc: number | null;
  min_guarantee_pct: number;
  min_guarantee_usdc: number | null;
  status: EscrowStatusEnum;
  deadline: string | null;
  review_hours: number | null;
  auto_release_enabled: boolean | null;
  stellar_contract_id: string | null;
  stellar_funding_tx_hash: string | null;
  stellar_release_tx_hash: string | null;
  created_at: string | null;
  funded_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
}

export interface Milestone {
  id: string;
  escrow_id: string;
  title: string;
  description: string | null;
  amount_usdc: number;
  sort_order: number;
  status: EscrowStatusEnum | null;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string | null;
}

export interface Delivery {
  id: string;
  escrow_id: string;
  milestone_id: string | null;
  submitted_by: string | null;
  delivery_note: string | null;
  external_url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_hash: string | null;
  stellar_delivery_tx_hash: string | null;
  created_at: string | null;
}

export interface Dispute {
  id: string;
  escrow_id: string;
  opened_by: string | null;
  reason: string;
  description: string;
  status: DisputeStatusEnum;
  freelancer_award_usdc: number | null;
  client_refund_usdc: number | null;
  resolution_note: string | null;
  stellar_resolution_tx_hash: string | null;
  opened_at: string | null;
  resolved_at: string | null;
}

export interface DisputeEvidence {
  id: string;
  dispute_id: string;
  submitted_by: string | null;
  file_url: string | null;
  file_name: string | null;
  file_hash: string | null;
  note: string | null;
  created_at: string | null;
}

export interface EscrowEvent {
  id: string;
  escrow_id: string;
  actor_id: string | null;
  event_type: string;
  message: string | null;
  tx_hash: string | null;
  created_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "id">; Update: Partial<Profile>; Relationships: [] };
      escrows: { Row: Escrow; Insert: Omit<Escrow, "id">; Update: Partial<Escrow>; Relationships: [] };
      milestones: { Row: Milestone; Insert: Omit<Milestone, "id">; Update: Partial<Milestone>; Relationships: [] };
      deliveries: { Row: Delivery; Insert: Omit<Delivery, "id">; Update: Partial<Delivery>; Relationships: [] };
      disputes: { Row: Dispute; Insert: Omit<Dispute, "id">; Update: Partial<Dispute>; Relationships: [] };
      dispute_evidence: { Row: DisputeEvidence; Insert: Omit<DisputeEvidence, "id">; Update: Partial<DisputeEvidence>; Relationships: [] };
      escrow_events: { Row: EscrowEvent; Insert: Omit<EscrowEvent, "id">; Update: Partial<EscrowEvent>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
