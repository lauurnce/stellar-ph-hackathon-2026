#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, BytesN, Env, String, Vec,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum EscrowStatus {
    Created = 0,
    Funded = 1,
    Active = 2,
    Delivered = 3,
    Completed = 4,
    Disputed = 5,
    Cancelled = 6,
}

#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    pub client: Address,
    pub freelancer: Address,
    /// 7-decimal fixed-point (like XLM stroops)
    pub amount_usdc: i128,
    /// 10–50 — minimum guarantee percentage to freelancer on dispute
    pub min_guarantee_pct: u32,
    /// hardcoded 250 = 2.5%
    pub platform_fee_pct: u32,
    pub status: EscrowStatus,
    pub delivery_hash: Option<BytesN<32>>,
    /// ledger timestamp
    pub deadline: u64,
    pub title: soroban_sdk::String,
    pub description: soroban_sdk::String,
}

#[contracttype]
pub enum DataKey {
    Admin,
    UsdcToken,
    Counter,
    Escrow(u32),
    EscrowMilestones(u32),
}

// ---------------------------------------------------------------------------
// Milestone types
// ---------------------------------------------------------------------------

/// Lifecycle of a single milestone.
/// Pending → Active (next in queue) → Delivered (freelancer submitted)
/// → Approved (client approved, funds released)
#[contracttype]
#[derive(Clone, PartialEq)]
pub enum MilestoneStatus {
    Pending = 0,
    Active = 1,
    Delivered = 2,
    Approved = 3,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub index: u32,
    pub title: String,
    pub amount_usdc: i128,
    pub status: MilestoneStatus,
    pub delivery_hash: Option<BytesN<32>>,
}

#[contracterror]
#[derive(Clone, PartialEq)]
pub enum Error {
    Unauthorized = 1,
    InvalidStatus = 2,
    InvalidInput = 3,
    NotFound = 4,
    DeadlinePassed = 5,
    AlreadyExists = 6,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct PangolinEscrow;

#[contractimpl]
impl PangolinEscrow {
    // -----------------------------------------------------------------------
    // Initialisation
    // -----------------------------------------------------------------------

    /// One-time setup.  Fails with AlreadyExists if called more than once.
    pub fn init(env: Env, admin: Address, usdc_token: Address) -> Result<(), Error> {
        if env.storage().persistent().has(&DataKey::Admin) {
            return Err(Error::AlreadyExists);
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage()
            .persistent()
            .set(&DataKey::UsdcToken, &usdc_token);
        env.storage().persistent().set(&DataKey::Counter, &0u32);
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Escrow lifecycle
    // -----------------------------------------------------------------------

    /// Create a new escrow.  Returns the escrow ID.
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        amount_usdc: i128,
        min_guarantee_pct: u32,
        deadline: u64,
        title: soroban_sdk::String,
        description: soroban_sdk::String,
    ) -> Result<u32, Error> {
        client.require_auth();

        // Validation
        if amount_usdc <= 0 {
            return Err(Error::InvalidInput);
        }
        if min_guarantee_pct < 10 || min_guarantee_pct > 50 {
            return Err(Error::InvalidInput);
        }
        if deadline <= env.ledger().timestamp() {
            return Err(Error::InvalidInput);
        }

        // Increment counter
        let mut counter: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::Counter)
            .unwrap_or(0);
        let escrow_id = counter;
        counter += 1;
        env.storage().persistent().set(&DataKey::Counter, &counter);

        let escrow = Escrow {
            client,
            freelancer,
            amount_usdc,
            min_guarantee_pct,
            platform_fee_pct: 250,
            status: EscrowStatus::Created,
            delivery_hash: None,
            deadline,
            title,
            description,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "created"), escrow_id);

        Ok(escrow_id)
    }

    /// Client transfers USDC into the contract.
    pub fn fund_escrow(env: Env, escrow_id: u32) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Created {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let usdc_token = Self::load_usdc(&env);
        token::Client::new(&env, &usdc_token).transfer(
            &escrow.client,
            &env.current_contract_address(),
            &escrow.amount_usdc,
        );

        escrow.status = EscrowStatus::Funded;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "funded"), escrow_id);

        Ok(())
    }

    /// Freelancer acknowledges and starts work.
    pub fn confirm_freelancer(env: Env, escrow_id: u32) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Funded {
            return Err(Error::InvalidStatus);
        }

        escrow.freelancer.require_auth();

        escrow.status = EscrowStatus::Active;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "active"), escrow_id);

        Ok(())
    }

    /// Freelancer submits deliverable hash.
    pub fn submit_delivery(
        env: Env,
        escrow_id: u32,
        delivery_hash: BytesN<32>,
    ) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Active {
            return Err(Error::InvalidStatus);
        }

        escrow.freelancer.require_auth();

        escrow.delivery_hash = Some(delivery_hash);
        escrow.status = EscrowStatus::Delivered;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "delivered"), escrow_id);

        Ok(())
    }

    /// Client approves delivery; funds are released to freelancer (minus platform fee).
    pub fn approve_release(env: Env, escrow_id: u32) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Delivered {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let fee = escrow.amount_usdc * escrow.platform_fee_pct as i128 / 10_000;
        let freelancer_amount = escrow.amount_usdc - fee;

        let usdc_token = Self::load_usdc(&env);
        let token_client = token::Client::new(&env, &usdc_token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &freelancer_amount,
        );
        // Fee stays in the contract as platform revenue

        escrow.status = EscrowStatus::Completed;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "completed"), escrow_id);

        Ok(())
    }

    /// Client or freelancer raises a dispute after delivery.
    /// `caller` must be either the client or the freelancer.
    pub fn trigger_dispute(env: Env, escrow_id: u32, caller: Address) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Delivered {
            return Err(Error::InvalidStatus);
        }

        // Verify caller is a participant
        if caller != escrow.client && caller != escrow.freelancer {
            return Err(Error::Unauthorized);
        }
        caller.require_auth();

        // Pay out minimum guarantee immediately to freelancer
        let min_amount = escrow.amount_usdc * escrow.min_guarantee_pct as i128 / 100;

        let usdc_token = Self::load_usdc(&env);
        let token_client = token::Client::new(&env, &usdc_token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &min_amount,
        );

        escrow.status = EscrowStatus::Disputed;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "disputed"), escrow_id);

        Ok(())
    }

    /// Admin resolves a dispute by specifying how to split the *remaining* funds
    /// (after the minimum guarantee was already paid in `trigger_dispute`).
    /// `freelancer_pct` is 0–100 representing the freelancer's share of the remainder.
    pub fn resolve_dispute(
        env: Env,
        escrow_id: u32,
        freelancer_pct: u32,
    ) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Disputed {
            return Err(Error::InvalidStatus);
        }

        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .ok_or(Error::NotFound)?;
        admin.require_auth();

        if freelancer_pct > 100 {
            return Err(Error::InvalidInput);
        }

        // Remaining in contract = total - min_guarantee (already sent)
        let min_amount = escrow.amount_usdc * escrow.min_guarantee_pct as i128 / 100;
        let remaining = escrow.amount_usdc - min_amount;

        let freelancer_share = remaining * freelancer_pct as i128 / 100;
        let client_share = remaining - freelancer_share;

        let usdc_token = Self::load_usdc(&env);
        let token_client = token::Client::new(&env, &usdc_token);

        if freelancer_share > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.freelancer,
                &freelancer_share,
            );
        }
        if client_share > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.client,
                &client_share,
            );
        }

        escrow.status = EscrowStatus::Completed;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "completed"), escrow_id);

        Ok(())
    }

    /// Anyone can call this after the deadline has passed to release funds to the
    /// freelancer (client was silent).  Full release minus platform fee.
    pub fn auto_release(env: Env, escrow_id: u32) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Delivered {
            return Err(Error::InvalidStatus);
        }

        if env.ledger().timestamp() <= escrow.deadline {
            return Err(Error::DeadlinePassed);
        }

        let fee = escrow.amount_usdc * escrow.platform_fee_pct as i128 / 10_000;
        let freelancer_amount = escrow.amount_usdc - fee;

        let usdc_token = Self::load_usdc(&env);
        let token_client = token::Client::new(&env, &usdc_token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &freelancer_amount,
        );

        escrow.status = EscrowStatus::Completed;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "completed"), escrow_id);

        Ok(())
    }

    /// Client cancels before work begins.  Refunds USDC if already funded.
    pub fn cancel_escrow(env: Env, escrow_id: u32) -> Result<(), Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Created && escrow.status != EscrowStatus::Funded {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        if escrow.status == EscrowStatus::Funded {
            let usdc_token = Self::load_usdc(&env);
            token::Client::new(&env, &usdc_token).transfer(
                &env.current_contract_address(),
                &escrow.client,
                &escrow.amount_usdc,
            );
        }

        escrow.status = EscrowStatus::Cancelled;
        env.storage()
            .persistent()
            .set(&DataKey::Escrow(escrow_id), &escrow);

        env.events()
            .publish(("escrow", "cancelled"), escrow_id);

        Ok(())
    }

    // -----------------------------------------------------------------------
    // Read-only queries
    // -----------------------------------------------------------------------

    pub fn get_escrow(env: Env, escrow_id: u32) -> Result<Escrow, Error> {
        Self::load_escrow(&env, escrow_id)
    }

    pub fn get_escrow_count(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::Counter)
            .unwrap_or(0)
    }

    // -----------------------------------------------------------------------
    // Upgrade
    // -----------------------------------------------------------------------

    /// Replace the contract's WASM with a new version.
    /// Only callable by the admin set in `init`.
    /// Storage (escrows, milestones, counter, admin, usdc token) is preserved.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .ok_or(Error::NotFound)?;
        admin.require_auth();

        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    fn load_escrow(env: &Env, id: u32) -> Result<Escrow, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(id))
            .ok_or(Error::NotFound)
    }

    fn load_usdc(env: &Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::UsdcToken)
            .unwrap()
    }
}

// ---------------------------------------------------------------------------
// Milestones
// Per-phase delivery and partial payment release for escrows.
// ---------------------------------------------------------------------------

#[contractimpl]
impl PangolinEscrow {
    /// Define the milestone schedule for an escrow.
    ///
    /// Rules:
    /// * Only the client may call this.
    /// * Must be called while the escrow is still Created (before funding).
    /// * The sum of milestone amounts must equal the escrow's amount_usdc.
    /// * 1–10 milestones per escrow.
    ///
    /// Calling this a second time replaces the previous schedule entirely.
    pub fn set_milestones(
        env: Env,
        escrow_id: u32,
        titles: Vec<String>,
        amounts: Vec<i128>,
    ) -> Result<(), Error> {
        let escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Created {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let n = titles.len();
        if n == 0 || n > 10 || amounts.len() != n {
            return Err(Error::InvalidInput);
        }

        // Amounts must sum to the escrow total
        let mut total: i128 = 0;
        for i in 0..n {
            let amt = amounts.get(i).unwrap();
            if amt <= 0 {
                return Err(Error::InvalidInput);
            }
            total += amt;
        }
        if total != escrow.amount_usdc {
            return Err(Error::InvalidInput);
        }

        // Build milestone list — first one Active, rest Pending
        let mut milestones: Vec<Milestone> = Vec::new(&env);
        for i in 0..n {
            milestones.push_back(Milestone {
                index: i,
                title: titles.get(i).unwrap(),
                amount_usdc: amounts.get(i).unwrap(),
                status: if i == 0 {
                    MilestoneStatus::Active
                } else {
                    MilestoneStatus::Pending
                },
                delivery_hash: None,
            });
        }

        env.storage()
            .persistent()
            .set(&DataKey::EscrowMilestones(escrow_id), &milestones);

        env.events().publish(("milestone", "set"), (escrow_id, n));

        Ok(())
    }

    /// Freelancer submits proof-of-work for the currently Active milestone.
    /// Escrow status stays Active so the client can approve milestone-by-milestone.
    pub fn submit_milestone_delivery(
        env: Env,
        escrow_id: u32,
        delivery_hash: BytesN<32>,
    ) -> Result<u32, Error> {
        let escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Active {
            return Err(Error::InvalidStatus);
        }

        escrow.freelancer.require_auth();

        let mut milestones: Vec<Milestone> = env
            .storage()
            .persistent()
            .get(&DataKey::EscrowMilestones(escrow_id))
            .ok_or(Error::NotFound)?;

        let mut active_index: Option<u32> = None;
        for i in 0..milestones.len() {
            let ms = milestones.get(i).unwrap();
            if ms.status == MilestoneStatus::Active {
                active_index = Some(i);
                break;
            }
        }

        let idx = active_index.ok_or(Error::InvalidStatus)?;
        let mut ms = milestones.get(idx).unwrap();
        ms.delivery_hash = Some(delivery_hash);
        ms.status = MilestoneStatus::Delivered;
        milestones.set(idx, ms);

        env.storage()
            .persistent()
            .set(&DataKey::EscrowMilestones(escrow_id), &milestones);

        env.events()
            .publish(("milestone", "delivered"), (escrow_id, idx));

        Ok(idx)
    }

    /// Client approves a delivered milestone and releases its payment slice.
    /// Per-milestone fee = milestone.amount_usdc * platform_fee_pct / 10_000.
    /// Final milestone approval marks the escrow Completed.
    /// Returns true when this was the final milestone.
    pub fn approve_milestone(
        env: Env,
        escrow_id: u32,
        milestone_index: u32,
    ) -> Result<bool, Error> {
        let mut escrow = Self::load_escrow(&env, escrow_id)?;

        if escrow.status != EscrowStatus::Active {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let mut milestones: Vec<Milestone> = env
            .storage()
            .persistent()
            .get(&DataKey::EscrowMilestones(escrow_id))
            .ok_or(Error::NotFound)?;

        if milestone_index >= milestones.len() {
            return Err(Error::InvalidInput);
        }

        let mut ms = milestones.get(milestone_index).unwrap();
        if ms.status != MilestoneStatus::Delivered {
            return Err(Error::InvalidStatus);
        }

        // Per-milestone platform fee (proportional share)
        let fee = ms.amount_usdc * escrow.platform_fee_pct as i128 / 10_000;
        let payout = ms.amount_usdc - fee;

        let usdc_token = Self::load_usdc(&env);
        let token_client = token::Client::new(&env, &usdc_token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &payout,
        );

        ms.status = MilestoneStatus::Approved;
        milestones.set(milestone_index, ms);

        // Any remaining unfinished milestones?
        let mut remaining_pending = false;
        for i in 0..milestones.len() {
            let m = milestones.get(i).unwrap();
            if m.status == MilestoneStatus::Pending || m.status == MilestoneStatus::Active {
                remaining_pending = true;
                break;
            }
        }
        let is_final = !remaining_pending;

        if is_final {
            escrow.status = EscrowStatus::Completed;
            env.storage()
                .persistent()
                .set(&DataKey::Escrow(escrow_id), &escrow);

            env.events().publish(("escrow", "completed"), escrow_id);
        } else {
            // Promote next Pending milestone to Active
            for i in (milestone_index + 1)..milestones.len() {
                let mut next = milestones.get(i).unwrap();
                if next.status == MilestoneStatus::Pending {
                    next.status = MilestoneStatus::Active;
                    milestones.set(i, next);
                    break;
                }
            }
        }

        env.storage()
            .persistent()
            .set(&DataKey::EscrowMilestones(escrow_id), &milestones);

        env.events()
            .publish(("milestone", "approved"), (escrow_id, milestone_index));

        Ok(is_final)
    }

    /// Returns the milestone list, or an empty Vec if none were set
    /// (legacy single-payment escrows).
    pub fn get_milestones(env: Env, escrow_id: u32) -> Vec<Milestone> {
        env.storage()
            .persistent()
            .get(&DataKey::EscrowMilestones(escrow_id))
            .unwrap_or_else(|| Vec::new(&env))
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod test;
