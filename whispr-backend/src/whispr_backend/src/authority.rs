use candid::Principal;
use ic_cdk::api::time;
use std::cell::RefCell;

use crate::models::*;
use crate::types::*;
use crate::{REPORTS, USERS, AUTHORITIES, caller, is_authority};

// Review a report and issue a verdict
pub fn review_report(report_id: ReportId, verdict: ReportVerdict) -> Result<(), String> {
    // Check if caller is an authority
    if !is_authority() {
        return Err("Only authorities can review reports".to_string());
    }
    
    let caller_principal = caller();
    
    // Update the report with the verdict
    REPORTS.with(|reports| {
        let mut reports_mut = reports.borrow_mut();
        
        if let Some(report) = reports_mut.get_mut(&report_id) {
            // Check if report is already reviewed
            if report.status == ReportStatus::Approved || report.status == ReportStatus::Rejected {
                return Err("Report already reviewed".to_string());
            }
            
            // Update report status based on verdict
            if verdict.is_genuine {
                report.status = ReportStatus::Approved;
                
                // Calculate and award the reward to the reporter
                let reward_amount = report.staked_amount * verdict.reward_multiplier as u64;
                
                USERS.with(|users| {
                    if let Some(user) = users.borrow_mut().get_mut(&report.reporter_principal) {
                        user.token_balance += reward_amount;
                        user.reputation_score += 5; // Increase reputation for genuine report
                    }
                });
            } else {
                report.status = ReportStatus::Rejected;
                
                // Decrease reputation score for false reports
                USERS.with(|users| {
                    if let Some(user) = users.borrow_mut().get_mut(&report.reporter_principal) {
                        user.reputation_score -= 3;
                        // Note: Staked tokens are not returned for rejected reports
                    }
                });
            }
            
            // Record the verdict
            report.verdict = Some(verdict);
            
            // Update authority records
            AUTHORITIES.with(|authorities| {
                if let Some(authority) = authorities.borrow_mut().get_mut(&caller_principal) {
                    authority.reports_reviewed.push(report_id);
                    if report.status == ReportStatus::Approved {
                        authority.reports_approved.push(report_id);
                    }
                }
            });
            
            Ok(())
        } else {
            Err("Report not found".to_string())
        }
    })
}

// List all reports pending review
pub fn list_pending_reports() -> Vec<Report> {
    // Check if caller is an authority
    if !is_authority() {
        return Vec::new();
    }
    
    REPORTS.with(|reports| {
        reports.borrow()
            .iter()
            .filter(|(_, report)| report.status == ReportStatus::Pending)
            .map(|(_, report)| report.clone())
            .collect()
    })
}

// List reports under review
pub fn list_under_review_reports() -> Vec<Report> {
    // Check if caller is an authority
    if !is_authority() {
        return Vec::new();
    }
    
    REPORTS.with(|reports| {
        reports.borrow()
            .iter()
            .filter(|(_, report)| report.status == ReportStatus::UnderReview)
            .map(|(_, report)| report.clone())
            .collect()
    })
}