use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;
use crate::types::*;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub principal: Principal,
    pub username: String,
    pub token_balance: u64,
    pub reports_submitted: Vec<ReportId>,
    pub reputation_score: i32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Authority {
    pub principal: Principal,
    pub reports_reviewed: Vec<ReportId>,
    pub reports_approved: Vec<ReportId>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Report {
    pub id: ReportId,
    pub reporter_principal: Principal,
    pub reporter_pseudonym: String, // Generated anonymous identifier
    pub title: String,
    pub category: String,
    pub description: String,
    pub location: String,
    pub timestamp: u64,
    pub evidence_refs: Vec<String>, // References to evidence stored in stable memory
    pub status: ReportStatus,
    pub staked_amount: u64,
    pub verdict: Option<ReportVerdict>,
    pub reward_claimed: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ReportSubmission {
    pub title: String,
    pub category: String,
    pub description: String,
    pub location: String,
    pub stake_amount: u64,
    pub evidence_data: Vec<EvidenceData>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EvidenceData {
    pub content_type: String, // "image/jpeg", "video/mp4", etc.
    pub data: Vec<u8>,
    pub description: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Message {
    pub id: MessageId,
    pub report_id: ReportId,
    pub sender: MessageSender,
    pub content: String,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum MessageSender {
    Reporter,
    Authority(Principal),
}