mod authority;

// Export the candid types we need for the interface
use candid::Principal;
use ic_cdk_macros::*;

// Initialize function
#[init]
fn init() {
    authority::handlers::init();
}

// Report management functions
#[update]
fn submit_report(
    title: String,
    description: String,
    category: String,
    location: Option<authority::types::Location>,
    incident_date: Option<String>,
    stake_amount: u64,
    evidence_count: u32,
) -> Result<u64, String> {
    authority::handlers::submit_report(title, description, category, location, incident_date, stake_amount, evidence_count)
}

#[query]
fn get_all_reports() -> Result<Vec<authority::types::Report>, String> {
    authority::handlers::get_all_reports()
}

#[query]
fn get_reports_by_status(status: authority::types::ReportStatus) -> Result<Vec<authority::types::Report>, String> {
    authority::handlers::get_reports_by_status(status)
}

#[query]
fn get_report(id: u64) -> Vec<authority::types::Report> {
    authority::handlers::get_report(id)
}

#[query]
fn get_user_reports() -> Vec<authority::types::Report> {
    authority::handlers::get_user_reports()
}

// Report review functions (Authority only)
#[update]
fn verify_report(report_id: u64, notes: Option<String>) -> Result<(), String> {
    authority::handlers::verify_report(report_id, notes)
}

#[update]
fn reject_report(report_id: u64, notes: Option<String>) -> Result<(), String> {
    authority::handlers::reject_report(report_id, notes)
}

#[update]
fn put_under_review(report_id: u64, notes: Option<String>) -> Result<(), String> {
    authority::handlers::put_under_review(report_id, notes)
}

#[update]
fn bulk_verify_reports(report_ids: Vec<u64>, notes: Option<String>) -> Result<Vec<u64>, String> {
    authority::handlers::bulk_verify_reports(report_ids, notes)
}

// Messaging functions
#[update]
fn send_message_as_authority(report_id: u64, content: String) -> Result<(), String> {
    authority::handlers::send_message_as_authority(report_id, content)
}

#[update]
fn send_message_as_reporter(report_id: u64, content: String) -> Result<(), String> {
    authority::handlers::send_message_as_reporter(report_id, content)
}

#[query]
fn get_messages(report_id: u64) -> Vec<authority::types::Message> {
    authority::handlers::get_messages(report_id)
}

// User management functions
#[query]
fn get_user_balance() -> u64 {
    authority::handlers::get_user_balance()
}

#[query]
fn get_user_info() -> Option<authority::types::User> {
    let caller = ic_cdk::caller();
    if caller == Principal::anonymous() {
        return None;
    }
    authority::store::get_user(caller)
}

#[update]
fn transfer_tokens(to: Principal, amount: u64) -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous callers cannot transfer tokens".to_string());
    }
    
    authority::store::transfer_tokens(caller, to, amount)
}

#[update]
fn add_tokens_to_user(user_id: Principal, amount: u64) -> Result<(), String> {
    if !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Only authorities can add tokens".to_string());
    }
    
    let user = match authority::store::get_user(user_id) {
        Some(mut user) => {
            user.token_balance += amount;
            user
        },
        None => authority::types::User {
            id: user_id,
            token_balance: amount,
            reports_submitted: Vec::new(),
            rewards_earned: 0,
            stakes_active: 0,
            stakes_lost: 0,
        },
    };
    
    authority::store::create_or_update_user(user);
    Ok(())
}

// Authority management functions
#[query]
fn is_authority() -> bool {
    let caller = ic_cdk::caller();
    if caller == Principal::anonymous() {
        return false;
    }
    authority::store::is_authority(caller)
}

#[update]
fn add_new_authority(id: Principal) -> Result<(), String> {
    authority::handlers::add_new_authority(id)
}

#[update]
fn remove_authority(id: Principal) -> Result<(), String> {
    authority::handlers::remove_authority(id)
}

#[query]
fn get_all_authorities() -> Result<Vec<authority::types::Authority>, String> {
    authority::handlers::get_all_authorities()
}

// Statistics and analytics functions
#[query]
fn get_authority_statistics() -> Result<authority::types::AuthorityStats, String> {
    authority::handlers::get_authority_statistics()
}

#[query]
fn get_detailed_analytics() -> Result<authority::types::DetailedAnalytics, String> {
    if !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Unauthorized".to_string());
    }
    
    let all_reports = authority::store::get_all_reports();
    let mut category_stats = std::collections::HashMap::new();
    let mut monthly_stats = std::collections::HashMap::new();
    
    let current_time = ic_cdk::api::time();
    let month_in_ns = 30 * 24 * 60 * 60 * 1_000_000_000u64; // 30 days in nanoseconds
    
    for report in &all_reports {
        // Category statistics
        let category_entry = category_stats.entry(report.category.clone()).or_insert((0u64, 0u64, 0u64));
        match report.status {
            authority::types::ReportStatus::Pending => category_entry.0 += 1,
            authority::types::ReportStatus::Approved => category_entry.1 += 1,
            authority::types::ReportStatus::Rejected => category_entry.2 += 1,
            _ => {},
        }
        
        // Monthly statistics (last 12 months)
        let months_ago = (current_time - report.date_submitted) / month_in_ns;
        if months_ago < 12 {
            let month_entry = monthly_stats.entry(months_ago).or_insert(0u64);
            *month_entry += 1;
        }
    }
    
    let analytics = authority::types::DetailedAnalytics {
        total_reports: all_reports.len() as u64,
        pending_reports: all_reports.iter().filter(|r| r.status == authority::types::ReportStatus::Pending).count() as u64,
        approved_reports: all_reports.iter().filter(|r| r.status == authority::types::ReportStatus::Approved).count() as u64,
        rejected_reports: all_reports.iter().filter(|r| r.status == authority::types::ReportStatus::Rejected).count() as u64,
        category_breakdown: category_stats,
        monthly_submission_trend: monthly_stats,
        average_stake_amount: if all_reports.is_empty() { 0.0 } else { 
            all_reports.iter().map(|r| r.stake_amount as f64).sum::<f64>() / all_reports.len() as f64 
        },
        total_staked_amount: all_reports.iter().map(|r| r.stake_amount).sum(),
        total_rewards_distributed: authority::store::get_authority_stats().total_rewards_distributed,
    };
    
    Ok(analytics)
}

#[query]
fn health_check() -> authority::types::SystemHealth {
    let all_reports = authority::store::get_all_reports();
    let stats = authority::store::get_authority_stats();
    
    authority::types::SystemHealth {
        status: "healthy".to_string(),
        total_reports: all_reports.len() as u64,
        pending_reports: stats.reports_pending,
        system_time: ic_cdk::api::time(),
        memory_usage: 0, // Could be implemented with memory checks
    }
}

// Advanced query functions for filtering and pagination
#[query]
fn get_reports_paginated(page: u64, page_size: u64) -> Result<(Vec<authority::types::Report>, u64), String> {
    if !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Unauthorized".to_string());
    }
    
    let all_reports = authority::store::get_all_reports();
    let total_count = all_reports.len() as u64;
    
    let start_index = (page * page_size) as usize;
    let end_index = std::cmp::min(start_index + page_size as usize, all_reports.len());
    
    if start_index >= all_reports.len() {
        return Ok((vec![], total_count));
    }
    
    let page_reports = all_reports[start_index..end_index].to_vec();
    Ok((page_reports, total_count))
}

#[query]
fn get_reports_by_category(category: String) -> Result<Vec<authority::types::Report>, String> {
    if !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Unauthorized".to_string());
    }
    
    let all_reports = authority::store::get_all_reports();
    let filtered_reports: Vec<authority::types::Report> = all_reports
        .into_iter()
        .filter(|report| report.category.to_lowercase() == category.to_lowercase())
        .collect();
    
    Ok(filtered_reports)
}

#[query]
fn get_reports_by_date_range(start_date: u64, end_date: u64) -> Result<Vec<authority::types::Report>, String> {
    if !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Unauthorized".to_string());
    }
    
    let all_reports = authority::store::get_all_reports();
    let filtered_reports: Vec<authority::types::Report> = all_reports
        .into_iter()
        .filter(|report| report.date_submitted >= start_date && report.date_submitted <= end_date)
        .collect();
    
    Ok(filtered_reports)
}

#[query]
fn search_reports(
    keyword: Option<String>,
    category: Option<String>,
    status: Option<authority::types::ReportStatus>,
    date_from: Option<u64>,
    date_to: Option<u64>,
    min_stake: Option<u64>,
    max_stake: Option<u64>,
) -> Result<Vec<authority::types::Report>, String> {
    authority::handlers::search_reports(keyword, category, status, date_from, date_to, min_stake, max_stake)
}

// Evidence management functions
#[update]
fn upload_evidence(
    report_id: u64,
    file_name: String,
    file_type: String,
    file_data: Vec<u8>,
) -> Result<u64, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous callers cannot upload evidence".to_string());
    }
    
    // Check if report exists and caller is the submitter
    let report = match authority::store::get_report(report_id) {
        Some(report) => report,
        None => return Err("Report not found".to_string()),
    };
    
    if report.submitter_id != caller {
        return Err("You can only upload evidence for your own reports".to_string());
    }
    
    // Create evidence file
    let evidence = authority::types::EvidenceFile {
        id: 0, // Will be assigned by add_evidence_file
        name: file_name,
        file_type,
        data: file_data,
        upload_date: ic_cdk::api::time(),
    };
    
    let evidence_id = authority::store::add_evidence_file(&evidence);
    
    // Update report with new evidence
    let mut updated_report = report;
    updated_report.evidence_files.push(evidence_id);
    updated_report.evidence_count = updated_report.evidence_files.len() as u32;
    
    authority::store::update_report(updated_report)?;
    
    Ok(evidence_id)
}

#[query]
fn get_evidence(evidence_id: u64) -> Option<authority::types::EvidenceFile> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return None;
    }
    
    // Check if caller is authorized (must be authority or evidence owner)
    let evidence = authority::store::get_evidence_file(evidence_id)?;
    
    // Find the report this evidence belongs to
    let all_reports = authority::store::get_all_reports();
    let report = all_reports.iter().find(|r| r.evidence_files.contains(&evidence_id))?;
    
    // Check authorization
    if report.submitter_id == caller || authority::store::is_authority(caller) {
        Some(evidence)
    } else {
        None
    }
}

// Development utilities
#[update]
fn reset_to_mock_data() -> Result<(), String> {
    // Allow anyone to initialize the system if no authorities exist yet
    let authorities = authority::store::get_all_authorities();
    if !authorities.is_empty() && !authority::store::is_authority(ic_cdk::caller()) {
        return Err("Only authorities can reset data".to_string());
    }
    
    authority::handlers::reset_to_mock_data()
}

// Special initialization function for setting up the first authority
#[update]
fn initialize_system() -> Result<(), String> {
    let caller = ic_cdk::caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous callers cannot initialize system".to_string());
    }
    
    // Check if any authorities already exist
    let authorities = authority::store::get_all_authorities();
    if !authorities.is_empty() {
        return Err("System already initialized".to_string());
    }
    
    // Add caller as the first authority
    let authority = authority::types::Authority {
        id: caller,
        reports_reviewed: Vec::new(),
        approval_rate: 0.0,
    };
    
    authority::store::add_authority(authority);
    
    // Add the specified authority as well
    let specified_authority = authority::types::Authority {
        id: Principal::from_text("d27x5-vpdgv-xg4ve-woszp-ulej4-4hlq4-xrlwz-nyedm-rtjsa-a2d2z-oqe")
            .unwrap_or_else(|_| Principal::anonymous()),
        reports_reviewed: Vec::new(),
        approval_rate: 0.0,
    };
    
    authority::store::add_authority(specified_authority);
    
    // Now initialize mock data
    authority::store::initialize_mock_data();
    
    Ok(())
}