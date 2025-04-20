use candid::Principal;
use ic_cdk::api::time;
use std::cell::RefCell;

use crate::models::*;
use crate::types::*;
use crate::{REPORTS, MESSAGES, NEXT_MESSAGE_ID, caller, is_authority};

// Send a message related to a report
pub fn send_message(report_id: ReportId, content: String) -> Result<MessageId, String> {
    let caller_principal = caller();
    let is_caller_authority = is_authority();
    
    // Check if report exists
    let report_option = REPORTS.with(|reports| {
        reports.borrow().get(&report_id).cloned()
    });
    
    let report = match report_option {
        Some(r) => r,
        None => return Err("Report not found".to_string()),
    };
    
    // Determine sender type
    let sender = if report.reporter_principal == caller_principal {
        MessageSender::Reporter
    } else if is_caller_authority {
        MessageSender::Authority(caller_principal)
    } else {
        return Err("You are not authorized to send messages for this report".to_string());
    };
    
    // Create the message
    let message_id = NEXT_MESSAGE_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });
    
    let message = Message {
        id: message_id,
        report_id,
        sender,
        content,
        timestamp: time(),
    };
    
    // Store the message
    MESSAGES.with(|messages| {
        messages.borrow_mut().insert(message_id, message.clone());
    });
    
    Ok(message_id)
}

// Get all messages related to a report
pub fn get_messages(report_id: ReportId) -> Vec<Message> {
    let caller_principal = caller();
    let is_caller_authority = is_authority();
    
    // Check if user is authorized to view messages
    let is_authorized = REPORTS.with(|reports| {
        reports.borrow().get(&report_id).map_or(false, |report| {
            report.reporter_principal == caller_principal || is_caller_authority
        })
    });
    
    if !is_authorized {
        return Vec::new();
    }
    
    // Return all messages for this report
    MESSAGES.with(|messages| {
        messages.borrow()
            .iter()
            .filter(|(_, msg)| msg.report_id == report_id)
            .map(|(_, msg)| msg.clone())
            .collect()
    })
}