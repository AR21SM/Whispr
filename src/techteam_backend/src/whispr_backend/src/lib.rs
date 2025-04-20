mod models;
mod report;
mod staking;
mod messaging;
mod storage;
mod authority;
mod types;

use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;
use serde::Serialize;

use models::*;
use types::*;

// Global state
thread_local! {
    static REPORTS: RefCell<HashMap<ReportId, Report>> = RefCell::new(HashMap::new());
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
    static AUTHORITIES: RefCell<HashMap<Principal, Authority>> = RefCell::new(HashMap::new());
    static MESSAGES: RefCell<HashMap<MessageId, Message>> = RefCell::new(HashMap::new());
    static NEXT_REPORT_ID: RefCell<u64> = RefCell::new(1);
    static NEXT_MESSAGE_ID: RefCell<u64> = RefCell::new(1);
}

// Initialize the canister
#[init]
fn init() {
    ic_cdk::println!("Whispr backend initialized");
}

// Get caller principal
fn caller() -> Principal {
    ic_cdk::caller()
}

// Check if caller is an authority
fn is_authority() -> bool {
    let caller = caller();
    AUTHORITIES.with(|authorities| {
        authorities.borrow().contains_key(&caller)
    })
}

// --- Entry points for the canister ---

#[query]
fn get_user_profile() -> Option<User> {
    let caller = caller();
    USERS.with(|users| {
        users.borrow().get(&caller).cloned()
    })
}

#[update]
fn register_user(username: String) -> Result<User, String> {
    let caller = caller();
    
    USERS.with(|users| {
        if users.borrow().contains_key(&caller) {
            return Err("User already registered".to_string());
        }
        
        let user = User {
            principal: caller,
            username,
            token_balance: 100, // Initial token amount
            reports_submitted: Vec::new(),
            reputation_score: 0,
        };
        
        users.borrow_mut().insert(caller, user.clone());
        Ok(user)
    })
}

#[update]
fn register_authority(auth_code: String) -> Result<(), String> {
    // In a real implementation, validate authority with a secure authentication method
    if auth_code != "SECURE_AUTH_CODE" {
        return Err("Invalid authority authentication code".to_string());
    }
    
    let caller = caller();
    
    AUTHORITIES.with(|authorities| {
        if authorities.borrow().contains_key(&caller) {
            return Err("Already registered as authority".to_string());
        }
        
        let authority = Authority {
            principal: caller,
            reports_reviewed: Vec::new(),
            reports_approved: Vec::new(),
        };
        
        authorities.borrow_mut().insert(caller, authority);
        Ok(())
    })
}

// Report management functions - implemented in report.rs
#[update]
fn submit_report(report_data: ReportSubmission) -> Result<ReportId, String> {
    report::submit_report(report_data)
}

#[query]
fn get_report(report_id: ReportId) -> Option<Report> {
    report::get_report(report_id)
}

#[query]
fn list_my_reports() -> Vec<Report> {
    report::list_my_reports()
}

// Authority functions
#[update]
fn review_report(report_id: ReportId, verdict: ReportVerdict) -> Result<(), String> {
    authority::review_report(report_id, verdict)
}

#[query]
fn list_pending_reports() -> Vec<Report> {
    authority::list_pending_reports()
}

// Messaging functions
#[update]
fn send_message(report_id: ReportId, content: String) -> Result<MessageId, String> {
    messaging::send_message(report_id, content)
}

#[query]
fn get_messages(report_id: ReportId) -> Vec<Message> {
    messaging::get_messages(report_id)
}

// Generate the Candid interface
ic_cdk::export_candid!();