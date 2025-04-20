use candid::Principal;

use crate::models::*;
use crate::types::*;
use crate::{USERS, REPORTS, caller};

// Check if a user can stake the specified amount
pub fn can_stake(amount: u64) -> bool {
    let caller_principal = caller();
    
    USERS.with(|users| {
        users.borrow()
            .get(&caller_principal)
            .map_or(false, |user| user.token_balance >= amount)
    })
}

// Stake tokens for a report
pub fn stake_tokens(amount: u64) -> Result<(), String> {
    if amount == 0 {
        return Err("Stake amount must be greater than zero".to_string());
    }
    
    if !can_stake(amount) {
        return Err("Insufficient token balance".to_string());
    }
    
    let caller_principal = caller();
    
    // Deduct tokens from user balance
    USERS.with(|users| {
        if let Some(user) = users.borrow_mut().get_mut(&caller_principal) {
            user.token_balance -= amount;
            Ok(())
        } else {
            Err("User not found".to_string())
        }
    })
}

// Claim reward for an approved report
pub fn claim_reward(report_id: ReportId) -> Result<u64, String> {
    let caller_principal = caller();
    
    REPORTS.with(|reports| {
        let mut reports_mut = reports.borrow_mut();
        
        if let Some(report) = reports_mut.get_mut(&report_id) {
            // Check that caller is the reporter
            if report.reporter_principal != caller_principal {
                return Err("You are not the reporter of this report".to_string());
            }
            
            // Check if report is approved and reward not claimed yet
            if report.status != ReportStatus::Approved {
                return Err("Report not approved".to_string());
            }
            
            if report.reward_claimed {
                return Err("Reward already claimed".to_string());
            }
            
            // Calculate reward based on verdict
            if let Some(verdict) = &report.verdict {
                if verdict.is_genuine {
                    let reward_amount = report.staked_amount * verdict.reward_multiplier as u64;
                    
                    // Mark reward as claimed
                    report.reward_claimed = true;
                    
                    // Credit the reward to the user
                    USERS.with(|users| {
                        if let Some(user) = users.borrow_mut().get_mut(&caller_principal) {
                            user.token_balance += reward_amount;
                        }
                    });
                    
                    Ok(reward_amount)
                } else {
                    Err("Report was rejected; no reward to claim".to_string())
                }
            } else {
                Err("Report has no verdict yet".to_string())
            }
        } else {
            Err("Report not found".to_string())
        }
    })
}