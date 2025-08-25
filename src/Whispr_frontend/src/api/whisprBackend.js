import { Actor, HttpAgent } from '@dfinity/agent';

let idlFactory;
let whisprBackend;

async function loadIdlFactory() {
  try {
    const module = await import('../../../../.dfx/local/canisters/Whispr_backend/service.did.js');
    return module.idlFactory;
  } catch (e) {
    console.warn("Could not load IDL factory from .dfx declarations:", e.message);
    try {
      const manualModule = await import('./Whispr_backend.did.js');
      return manualModule.idlFactory;
    } catch (e2) {
      console.error("Could not find any Whispr_backend declarations:", e2.message);
      return null;
    }
  }
}

async function initializeBackend() {
  try {
    idlFactory = await loadIdlFactory();
    
    if (!idlFactory) {
      console.error("No IDL factory available - backend connection disabled");
      return;
    }

    const CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai";
    const HOST = "http://localhost:4943";

    const agent = new HttpAgent({ host: HOST });

    if (process.env.NODE_ENV !== 'production') {
      agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key:', err);
      });
    }

    whisprBackend = Actor.createActor(idlFactory, {
      agent,
      canisterId: CANISTER_ID,
    });

    console.log("Connected to Whispr Rust backend on Internet Computer:", CANISTER_ID);
  } catch (error) {
    console.error("Error setting up backend connection:", error);
    whisprBackend = null;
  }
}

initializeBackend();

export async function submitReport(reportData) {
  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    throw new Error("Backend connection not available. Please check if the canister is running.");
  }

  try {
    const currentBalance = await getTokenBalance();
    if (currentBalance < reportData.stakeAmount) {
      throw new Error(`Insufficient tokens. You have ${currentBalance} tokens but need ${reportData.stakeAmount} for staking.`);
    }

    const evidenceFiles = await Promise.all(
      reportData.evidenceFiles.map(async (file) => {
        const base64Data = await convertFileToBase64(file);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          base64Data: base64Data,
          lastModified: file.lastModified
        };
      })
    );
    
    const location = reportData.location && reportData.location.coordinates ? {
      latitude: reportData.location.coordinates.lat,
      longitude: reportData.location.coordinates.lng,
      address: reportData.location.address || ""
    } : null;
    
    const result = await whisprBackend.submit_report(
      reportData.title,
      reportData.description, 
      reportData.category,
      location ? [location] : [],
      reportData.date ? [reportData.date] : [],
      reportData.stakeAmount,
      evidenceFiles.length
    );
    
    if (result && 'Ok' in result) {
      const reportId = String(result.Ok);
      console.log("Report submitted to Rust backend on-chain, ID:", reportId);
      
      if (evidenceFiles.length > 0) {
        const detailedReport = {
          id: reportId,
          title: reportData.title,
          description: reportData.description,
          evidenceFiles: evidenceFiles,
          evidenceCount: evidenceFiles.length
        };
        saveDetailedReportToLocalStorage(detailedReport);
      }
      
      return { success: true, reportId: reportId };
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response from Rust backend");
    }
  } catch (error) {
    console.error('Error submitting to Rust backend:', error);
    throw error;
  }
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export async function getUserReports() {
  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    console.warn("Backend connection not available");
    return [];
  }

  try {
    const reports = await whisprBackend.get_user_reports();
    console.log("Retrieved user reports from Rust backend:", reports);
    
    if (Array.isArray(reports)) {
      return reports.map(report => ({
        id: String(report.id),
        title: report.title || "",
        category: report.category || "other",
        date: report.date || new Date().toISOString().split('T')[0],
        time: report.time || "",
        status: report.status || "pending",
        stake: Number(report.stake || 0),
        reward: Number(report.reward || 0),
        hasMessages: Boolean(report.has_messages || false)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching reports from Rust backend:', error);
    throw error;
  }
}

export async function getTokenBalance() {
  // Ensure backend is initialized
  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    console.warn("Backend connection not available, using cached balance");
    const cachedBalance = localStorage.getItem('user_token_balance');
    return cachedBalance ? parseInt(cachedBalance, 10) : 250;
  }

  try {
    const balance = await whisprBackend.get_user_balance();
    const numericBalance = Number(balance);
    console.log("Retrieved token balance from Rust backend:", numericBalance);
    
    localStorage.setItem('user_token_balance', numericBalance.toString());
    
    return numericBalance;
  } catch (error) {
    console.error('Error fetching token balance from Rust backend:', error);
    
    const cachedBalance = localStorage.getItem('user_token_balance');
    if (cachedBalance !== null) {
      return parseInt(cachedBalance, 10);
    }
    
    try {
      await whisprBackend.add_tokens_to_user(250);
      return 250;
    } catch (initError) {
      console.error('Error initializing user tokens:', initError);
      return 250;
    }
  }
}

export async function getAuthorityStatistics() {
  // Ensure backend is initialized
  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    const result = await whisprBackend.get_authority_statistics();
    if (result && 'Ok' in result) {
      console.log("Retrieved authority statistics from Rust backend:", result.Ok);
      return result.Ok;
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response format from get_authority_statistics");
    }
  } catch (error) {
    console.error('Error fetching authority statistics from Rust backend:', error);
    throw error;
  }
}

export async function getReportsByStatus(status) {
  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    const statusVariant = status === 'pending' ? { Pending: null } :
                         status === 'verified' ? { Approved: null } :
                         status === 'rejected' ? { Rejected: null } :
                         status === 'under_review' ? { UnderReview: null } : 
                         { Pending: null };
    
    const result = await whisprBackend.get_reports_by_status(statusVariant);
    if (result && 'Ok' in result) {
      console.log(`Retrieved ${status} reports from Rust backend:`, result.Ok);
      return result.Ok.map(formatReport);
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response format from get_reports_by_status");
    }
  } catch (error) {
    console.error(`Error fetching ${status} reports from Rust backend:`, error);
    throw error;
  }
}

export async function verifyReport(reportId, notes) {

  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    console.log(`Verifying report ${reportId} on Rust backend with notes:`, notes);
    
    const formattedId = BigInt(reportId);
    const result = await whisprBackend.verify_report(formattedId, notes ? [notes] : []);
    
    if (result && 'Ok' in result) {
      console.log(`Successfully verified report ${reportId} on Rust backend`);
      return { success: true };
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response format from verify_report");
    }
  } catch (error) {
    console.error('Error verifying report on Rust backend:', error);
    throw error;
  }
}

export async function rejectReport(reportId, notes) {

  if (!whisprBackend) {
    await initializeBackend();
  }
  
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    console.log(`Rejecting report ${reportId} on Rust backend with notes:`, notes);
    
    const formattedId = BigInt(reportId);
    const result = await whisprBackend.reject_report(formattedId, notes ? [notes] : []);
    
    if (result && 'Ok' in result) {
      console.log(`Successfully rejected report ${reportId} on Rust backend`);
      return { success: true };
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response format from reject_report");
    }
  } catch (error) {
    console.error('Error rejecting report on Rust backend:', error);
    throw error;
  }
}

export async function getAllReports() {
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    const result = await whisprBackend.get_all_reports();
    if (result && 'Ok' in result) {
      console.log("Retrieved all reports from Rust backend:", result.Ok);
      return result.Ok.map(formatReport);
    } else if (result && 'Err' in result) {
      throw new Error(result.Err);
    } else {
      throw new Error("Invalid response format from get_all_reports");
    }
  } catch (error) {
    console.error('Error fetching all reports from Rust backend:', error);
    throw error;
  }
}
function saveDetailedReportToLocalStorage(report) {
  try {
    const reportId = String(report.id);
    const existingReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
    const existingIndex = existingReports.findIndex(r => r.id && String(r.id) === reportId);
    
    if (existingIndex >= 0) {
      existingReports[existingIndex] = { ...existingReports[existingIndex], ...report };
    } else {
      existingReports.unshift(report);
    }
    
    localStorage.setItem('whispr_reports_details', JSON.stringify(existingReports));
    console.log("Evidence files cached locally for report:", reportId);
  } catch (error) {
    console.error('Error caching evidence files:', error);
  }
}

export async function getReportById(reportId) {
  if (!whisprBackend) {
    throw new Error("Backend connection not available");
  }

  try {
    const result = await whisprBackend.get_report(BigInt(reportId));
    if (result && result.length > 0) {
      const report = formatReport(result[0]);
      console.log("Retrieved report from Rust backend:", report);
      
      const localReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
      const detailedReport = localReports.find(r => String(r.id) === String(reportId));
      
      return {
        ...report,
        evidenceFiles: detailedReport?.evidenceFiles || [],
        description: report.description || detailedReport?.description || ""
      };
    } else {
      throw new Error("Report not found");
    }
  } catch (error) {
    console.error('Error fetching report from Rust backend:', error);
    throw error;
  }
}
function formatReport(report) {
  try {
    let formattedDate, incidentDate, reviewDate;
    
    try {
      if (report.date_submitted) {
        formattedDate = new Date(Number(report.date_submitted) / 1000000).toISOString().split('T')[0];
      } else {
        formattedDate = new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      formattedDate = new Date().toISOString().split('T')[0];
    }
    
    try {
      incidentDate = '';
      if (report.incident_date && Array.isArray(report.incident_date) && report.incident_date.length > 0) {
        incidentDate = report.incident_date[0];
      }
    } catch (e) {
      incidentDate = '';
    }
    
    try {
      reviewDate = null;
      if (report.review_date) {
        reviewDate = new Date(Number(report.review_date) / 1000000).toISOString();
      }
    } catch (e) {
      reviewDate = null;
    }
    
    let submitterId;
    try {
      if (typeof report.submitter_id === 'object' && report.submitter_id !== null) {
        if ('toText' in report.submitter_id && typeof report.submitter_id.toText === 'function') {
          submitterId = report.submitter_id.toText();
        } else {
          submitterId = String(report.submitter_id);
        }
      } else {
        submitterId = String(report.submitter_id || "unknown");
      }
    } catch (e) {
      submitterId = "unknown";
    }

    let reviewNotes = '';
    try {
      if (Array.isArray(report.review_notes) && report.review_notes.length > 0) {
        reviewNotes = report.review_notes[0];
      } else if (report.review_notes) {
        reviewNotes = String(report.review_notes);
      }
    } catch (e) {
      reviewNotes = '';
    }
    
    const status = getStatusString(report.status);
    
    return {
      id: String(report.id),
      title: report.title || "",
      description: report.description || "",
      category: report.category || "",
      date: incidentDate || formattedDate,
      dateSubmitted: formattedDate,
      submitterId: submitterId,
      status: status,
      evidenceCount: Number(report.evidence_count || 0),
      stakeAmount: Number(report.stake_amount || 0),
      rewardAmount: Number(report.reward_amount || 0),
      reviewNotes: reviewNotes,
      reviewDate: reviewDate,
      reviewer: report.reviewer,
      location: report.location || null,
      evidenceFiles: [],
      hasMessages: false
    };
  } catch (error) {
    console.error("Error formatting report:", error, report);
    return {
      id: String(report.id || "unknown-" + Date.now()),
      title: report.title || "Error Loading Report",
      description: "Error loading report details",
      category: "unknown",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      stakeAmount: 0,
      rewardAmount: 0,
      evidenceCount: 0,
      evidenceFiles: [],
      hasMessages: false
    };
  }
}

function getStatusString(status) {
  if (!status) return 'pending';
  
  try {
    if (typeof status === 'string') return status.toLowerCase();
    
    if (typeof status === 'object') {
      if ('Pending' in status) return 'pending';
      if ('UnderReview' in status) return 'under_review';
      if ('Approved' in status) return 'verified';
      if ('Rejected' in status) return 'rejected';
    }
  } catch (e) {
    console.warn("Error determining status:", e);
  }
  
  return 'pending';
}

export function initializeNewUser() {
  const existingBalance = localStorage.getItem('user_token_balance');
  if (existingBalance === null) {
    localStorage.setItem('user_token_balance', '250');
    console.log('New user initialized with 250 tokens locally');
    return 250;
  }
  return parseInt(existingBalance, 10);
}

export default whisprBackend;