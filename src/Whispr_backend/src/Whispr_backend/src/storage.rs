use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = 
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    
    static EVIDENCE_STORAGE: RefCell<StableBTreeMap<String, Vec<u8>, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|mm| mm.borrow().get(MemoryId::new(0)))
        )
    );
}

// Store evidence data in stable memory
pub fn store_evidence(data: &[u8], content_type: &str) -> Result<String, String> {
    // Generate a unique reference ID for this evidence
    let timestamp = ic_cdk::api::time();
    let mut hasher = sha2::Sha256::new();
    hasher.update(data);
    hasher.update(timestamp.to_be_bytes());
    let hash = hasher.finalize();
    
    let evidence_ref = format!("{}-{}", hex::encode(&hash[0..8]), content_type.replace("/", "_"));
    
    // Store the evidence data
    EVIDENCE_STORAGE.with(|storage| {
        storage.borrow_mut().insert(evidence_ref.clone(), data.to_vec());
    });
    
    Ok(evidence_ref)
}

// Retrieve evidence data by reference ID
pub fn get_evidence(evidence_ref: &str) -> Option<Vec<u8>> {
    EVIDENCE_STORAGE.with(|storage| {
        storage.borrow().get(evidence_ref)
    })
}

// Get content type from evidence reference
pub fn get_evidence_content_type(evidence_ref: &str) -> Option<String> {
    if let Some(content_type_part) = evidence_ref.split('-').nth(1) {
        Some(content_type_part.replace("_", "/"))
    } else {
        None
    }
}