use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use sha2::{Sha256, Digest};
use std::cell::RefCell;

use crate::models::*;
use crate::types::*;
use crate::{REPORTS, USERS, NEXT_REPORT_ID, caller};
use crate::storage;

// Generate pseudonym from principal to maintain anonymity
fn generate_pseudonym(principal: Principal, report_id: ReportId) -> String {
    let mut hasher = Sha256::new();
    hasher.update(principal.as_slice());
    hasher.update(report_id.to_be_bytes());
    
    let result = hasher.finalize();
    format!("Whispr_{}", hex::encode(&result[0..6]))
}

pub fn submit_report(report_data: ReportSubmission) -> Result<ReportId, String> {
    let caller_principal = caller();
    
    // Check if user has enough tokens to stake
    let user_has_tokens = USERS.with(|users| {
        if let Some(user) = users.borrow().get(&caller_principal) {
            user.token_balance >= report_data.stake_amount
        } else {
            false
        }
    });
    
    if !user_has_tokens {
        return Err("Insufficient token balance for staking".to_string());
    }
    
    // Process and store evidence
    let mut evidence_refs = Vec::new();
    for evidence in &report_data.evidence_data {
        match storage::store_evidence(&evidence.data, &evidence.content_type) {
            Ok(ref_id) => evidence_refs.push(ref_id),
            Err(e) => return Err(format!("Failed to store evidence: {}", e)),
        }
    }
    
    // Generate a new report ID
    let report_id = NEXT_REPORT_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });
    
    // Generate anonymous pseudonym for the reporter
    let pseudonym = generate_pseudonym(caller_principal, report_id);
    
    // Create the report
    let report = Report {
        id: report_id,
        reporter_principal: caller_principal,
        reporter_pseudonym: pseudonym,
        title: report_data.title,
        category: report_data.category,
        description: report_data.description,
        location: report_data.location,
        timestamp: time(),
        evidence_refs,
        status: ReportStatus::Pending,
        staked_amount: report_data.stake_amount,
        verdict: None,
        reward_claimed: false,
    };
    
    // Store the report
    REPORTS.with(|reports| {
        reports.borrow_mut().insert(report_id, report.clone());
    });
    
    // Update user data: deduct tokens and add the report to their submitted list
    USERS.with(|users| {
        if let Some(user) = users.borrow_mut().get_mut(&caller_principal) {
            user.token_balance -= report_data.stake_amount;
            user.reports_submitted.push(report_id);
        }
    });
    
    Ok(report_id)
}

pub fn get_report(report_id: ReportId) -> Option<Report> {
    REPORTS.with(|reports| {
        reports.borrow().get(&report_id).cloned()
    })
}

pub fn list_my_reports() -> Vec<Report> {
    let caller_principal = caller();
    
    REPORTS.with(|reports| {
        reports.borrow()
            .iter()
            .filter(|(_, report)| report.reporter_principal == caller_principal)
            .map(|(_, report)| report.clone())
            .collect()
    })
}