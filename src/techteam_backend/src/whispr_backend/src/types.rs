use candid::{CandidType, Deserialize};
use serde::Serialize;

pub type ReportId = u64;
pub type MessageId = u64;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ReportStatus {
    Pending,
    UnderReview,
    Approved,
    Rejected,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ReportVerdict {
    pub is_genuine: bool,
    pub feedback: String,
    pub reward_multiplier: u8, // e.g., 10 for 10x reward
}