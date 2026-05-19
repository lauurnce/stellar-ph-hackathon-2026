#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, BytesN, Env, String,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Spin up a fresh environment with the Pangolin contract and a mock USDC token.
/// Returns (env, contract_address, usdc_token_address, admin, client, freelancer).
fn setup() -> (Env, Address, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy the Pangolin escrow contract
    let contract_id = env.register(PangolinEscrow, ());

    // Deploy a Stellar Asset Contract for mock USDC
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();

    let admin = Address::generate(&env);
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);

    // Mint 10,000 USDC (7 decimal places) to the client
    let token_stellar_client = token::StellarAssetClient::new(&env, &token_id);
    token_stellar_client.mint(&client, &10_000_000_000i128);

    // Initialise the Pangolin contract
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);
    pangolin.init(&admin, &token_id);

    (env, contract_id, token_id, admin, client, freelancer)
}

/// Returns a deadline 1000 seconds in the future from the current ledger timestamp.
fn future_deadline(env: &Env) -> u64 {
    env.ledger().timestamp() + 1_000
}

// ---------------------------------------------------------------------------
// Test 1 — create_escrow
// ---------------------------------------------------------------------------

#[test]
fn test_create_escrow() {
    let (env, contract_id, _token_id, _admin, client, freelancer) = setup();
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);

    let amount: i128 = 1_000_000_000; // 100 USDC (7 dp)
    let deadline = future_deadline(&env);
    let title = String::from_str(&env, "Logo design");
    let description = String::from_str(&env, "Create a new brand logo");

    let escrow_id = pangolin
        .create_escrow(&client, &freelancer, &amount, &20u32, &deadline, &title, &description)
        .unwrap();

    assert_eq!(escrow_id, 0u32);
    assert_eq!(pangolin.get_escrow_count(), 1u32);

    let escrow = pangolin.get_escrow(&escrow_id).unwrap();
    assert_eq!(escrow.client, client);
    assert_eq!(escrow.freelancer, freelancer);
    assert_eq!(escrow.amount_usdc, amount);
    assert_eq!(escrow.min_guarantee_pct, 20u32);
    assert_eq!(escrow.platform_fee_pct, 250u32);
    assert_eq!(escrow.status, EscrowStatus::Created);
    assert!(escrow.delivery_hash.is_none());
    assert_eq!(escrow.deadline, deadline);
}

// ---------------------------------------------------------------------------
// Test 2 — fund_escrow + confirm_freelancer
// ---------------------------------------------------------------------------

#[test]
fn test_fund_and_confirm() {
    let (env, contract_id, token_id, _admin, client, freelancer) = setup();
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);
    let token_client = token::Client::new(&env, &token_id);

    let amount: i128 = 500_000_000; // 50 USDC
    let deadline = future_deadline(&env);

    let escrow_id = pangolin
        .create_escrow(
            &client,
            &freelancer,
            &amount,
            &10u32,
            &deadline,
            &String::from_str(&env, "Web dev"),
            &String::from_str(&env, "Build a landing page"),
        )
        .unwrap();

    // Fund: client balance should decrease
    let client_before = token_client.balance(&client);
    pangolin.fund_escrow(&escrow_id).unwrap();
    let client_after = token_client.balance(&client);

    assert_eq!(client_before - client_after, amount);
    assert_eq!(
        pangolin.get_escrow(&escrow_id).unwrap().status,
        EscrowStatus::Funded
    );

    // Confirm
    pangolin.confirm_freelancer(&escrow_id).unwrap();
    assert_eq!(
        pangolin.get_escrow(&escrow_id).unwrap().status,
        EscrowStatus::Active
    );
}

// ---------------------------------------------------------------------------
// Test 3 — full happy path (approve_release)
// ---------------------------------------------------------------------------

#[test]
fn test_full_happy_path() {
    let (env, contract_id, token_id, _admin, client, freelancer) = setup();
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);
    let token_client = token::Client::new(&env, &token_id);

    let amount: i128 = 2_000_000_000; // 200 USDC
    let deadline = future_deadline(&env);
    let hash = BytesN::from_array(&env, &[0xab; 32]);

    let escrow_id = pangolin
        .create_escrow(
            &client,
            &freelancer,
            &amount,
            &20u32,
            &deadline,
            &String::from_str(&env, "Smart contract audit"),
            &String::from_str(&env, "Audit a Soroban contract"),
        )
        .unwrap();

    pangolin.fund_escrow(&escrow_id).unwrap();
    pangolin.confirm_freelancer(&escrow_id).unwrap();
    pangolin.submit_delivery(&escrow_id, &hash).unwrap();

    let freelancer_before = token_client.balance(&freelancer);
    pangolin.approve_release(&escrow_id).unwrap();
    let freelancer_after = token_client.balance(&freelancer);

    // fee = 2_000_000_000 * 250 / 10_000 = 50_000_000
    let expected_fee: i128 = amount * 250 / 10_000;
    let expected_payout = amount - expected_fee;

    assert_eq!(freelancer_after - freelancer_before, expected_payout);
    assert_eq!(
        pangolin.get_escrow(&escrow_id).unwrap().status,
        EscrowStatus::Completed
    );
}

// ---------------------------------------------------------------------------
// Test 4 — minimum guarantee on dispute
// ---------------------------------------------------------------------------

#[test]
fn test_min_guarantee_on_dispute() {
    let (env, contract_id, token_id, _admin, client, freelancer) = setup();
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);
    let token_client = token::Client::new(&env, &token_id);

    let amount: i128 = 1_000_000_000; // 100 USDC
    let min_pct = 30u32;
    let deadline = future_deadline(&env);
    let hash = BytesN::from_array(&env, &[0xcd; 32]);

    let escrow_id = pangolin
        .create_escrow(
            &client,
            &freelancer,
            &amount,
            &min_pct,
            &deadline,
            &String::from_str(&env, "UI mockups"),
            &String::from_str(&env, "Design 5 screens"),
        )
        .unwrap();

    pangolin.fund_escrow(&escrow_id).unwrap();
    pangolin.confirm_freelancer(&escrow_id).unwrap();
    pangolin.submit_delivery(&escrow_id, &hash).unwrap();

    let freelancer_before = token_client.balance(&freelancer);
    // Client raises a dispute
    pangolin.trigger_dispute(&escrow_id, &client).unwrap();
    let freelancer_after = token_client.balance(&freelancer);

    let min_amount = amount * min_pct as i128 / 100;
    assert_eq!(freelancer_after - freelancer_before, min_amount);
    assert_eq!(
        pangolin.get_escrow(&escrow_id).unwrap().status,
        EscrowStatus::Disputed
    );
}

// ---------------------------------------------------------------------------
// Test 5 — auto_release after deadline
// ---------------------------------------------------------------------------

#[test]
fn test_auto_release_after_deadline() {
    let (env, contract_id, token_id, _admin, client, freelancer) = setup();
    let pangolin = PangolinEscrowClient::new(&env, &contract_id);
    let token_client = token::Client::new(&env, &token_id);

    let amount: i128 = 3_000_000_000; // 300 USDC
    let deadline = future_deadline(&env);
    let hash = BytesN::from_array(&env, &[0xef; 32]);

    let escrow_id = pangolin
        .create_escrow(
            &client,
            &freelancer,
            &amount,
            &15u32,
            &deadline,
            &String::from_str(&env, "Mobile app"),
            &String::from_str(&env, "Build a Flutter app"),
        )
        .unwrap();

    pangolin.fund_escrow(&escrow_id).unwrap();
    pangolin.confirm_freelancer(&escrow_id).unwrap();
    pangolin.submit_delivery(&escrow_id, &hash).unwrap();

    // Advance the ledger past the deadline
    env.ledger().with_mut(|l| {
        l.timestamp = deadline + 1;
    });

    let freelancer_before = token_client.balance(&freelancer);
    pangolin.auto_release(&escrow_id).unwrap();
    let freelancer_after = token_client.balance(&freelancer);

    let expected_fee: i128 = amount * 250 / 10_000;
    let expected_payout = amount - expected_fee;

    assert_eq!(freelancer_after - freelancer_before, expected_payout);
    assert_eq!(
        pangolin.get_escrow(&escrow_id).unwrap().status,
        EscrowStatus::Completed
    );
}
