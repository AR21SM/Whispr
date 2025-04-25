import { Actor, HttpAgent } from '@dfinity/agent';

// Try different import paths until one works
let idlFactory;
try {
  idlFactory = require('../../../declarations/Whispr_backend/Whispr_backend.did.js').idlFactory;
} catch (e) {
  try {
    idlFactory = require('../../../../declarations/Whispr_backend/Whispr_backend.did.js').idlFactory;
  } catch (e) {
    try {
      idlFactory = require('../../../src/declarations/Whispr_backend/Whispr_backend.did.js').idlFactory;
    } catch (e) {
      console.error("Could not find Whispr_backend declarations:", e);
      idlFactory = null;
    }
  }
}

// Use the correct canister ID from your deployment
const CANISTER_ID = "vizcg-th777-77774-qaaea-cai";
const HOST = "http://localhost:4943";

// Initialize agent
const agent = new HttpAgent({ host: HOST });

// In local development, we need to fetch the root key
if (process.env.NODE_ENV !== 'production') {
  try {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key:', err);
    });
  } catch (e) {
    console.warn('Could not fetch root key:', e);
  }
}

// Create actor for backend canister
let whisprBackend;
try {
  if (idlFactory) {
    whisprBackend = Actor.createActor(idlFactory, {
      agent,
      canisterId: CANISTER_ID,
    });
    console.log("Successfully connected to Whispr_backend canister");
  } else {
    throw new Error("IDL factory not found");
  }
} catch (error) {
  console.error("Failed to create actor:", error);
  whisprBackend = createMockBackend();
}

// Mock implementation as fallback
function createMockBackend() {
  console.warn("Using mock backend implementation");
  return {
    submit_report: async (data) => {
      const reportId = "0x" + Math.floor(Date.now() / 1000).toString(16);
      console.log("Mock submit_report called with:", data);
      console.log("Generated mock report ID:", reportId);
      return reportId;
    },
    get_my_reports: async () => {
      const localReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]');
      console.log("Mock returning reports from localStorage:", localReports);
      return localReports;
    },
    get_token_balance: async () => {
      return 250;
    },
    get_report: async (id) => {
      const reports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
      return reports.find(r => r.id === id) || null;
    }
  };
}

// Helper function to convert File to Base64 string
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Submit report with improved error handling and file support
export async function submitReport(reportData) {
  try {
    // Process evidence files to save them as Base64 strings
    const evidenceFiles = await Promise.all(
      reportData.evidenceFiles.map(async (file) => {
        // Convert File objects to Base64 format that can be stored persistently
        const base64Data = await convertFileToBase64(file);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          base64Data: base64Data, // Store file as Base64 instead of URL
          lastModified: file.lastModified
        };
      })
    );
    
    // Format data for backend
    const submission = {
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: {
        address: reportData.location.address || "",
        coordinates: reportData.location.coordinates ? {
          lat: reportData.location.coordinates.lat,
          lng: reportData.location.coordinates.lng
        } : null
      },
      date: reportData.date ? [reportData.date] : [],
      time: reportData.time ? [reportData.time] : [],
      stake_amount: BigInt(reportData.stakeAmount)
    };
    
    // Submit to backend
    const reportId = await whisprBackend.submit_report(submission);
    console.log("Report submitted successfully, ID:", reportId);
    
    // Format the report for localStorage - basic version for the dashboard
    const formattedReport = {
      id: typeof reportId === 'string' ? reportId : reportId.toString(),
      title: reportData.title,
      category: reportData.category,
      date: reportData.date || new Date().toISOString().split('T')[0],
      status: 'pending',
      stake: reportData.stakeAmount,
      reward: 0,
      hasMessages: false
    };
    
    // Save basic version to localStorage for immediate display in dashboard
    saveReportToLocalStorage(formattedReport);
    
    // Save detailed version with evidence files for viewing
    const detailedReport = {
      id: formattedReport.id,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: reportData.location,
      date: reportData.date || new Date().toISOString().split('T')[0],
      time: reportData.time || "",
      status: 'pending',
      stake: reportData.stakeAmount,
      reward: 0,
      hasMessages: false,
      evidenceFiles: evidenceFiles
    };
    
    // Save detailed report to separate localStorage item
    saveDetailedReportToLocalStorage(detailedReport);
    
    return { success: true, reportId: formattedReport.id };
  } catch (error) {
    // Error handling as before
    console.error('Error submitting report:', error);
    
    // Generate mock ID and create fallback reports
    const mockId = "0x" + Math.floor(Date.now() / 1000).toString(16);
    
    // Process evidence files with Base64
    const evidenceFiles = await Promise.all(
      reportData.evidenceFiles.map(async (file) => {
        const base64Data = await convertFileToBase64(file);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          base64Data: base64Data, // Store as Base64 instead of URL
          lastModified: file.lastModified
        };
      })
    );
    
    // Basic report for dashboard
    const formattedReport = {
      id: mockId,
      title: reportData.title,
      category: reportData.category,
      date: reportData.date || new Date().toISOString().split('T')[0],
      status: 'pending',
      stake: reportData.stakeAmount,
      reward: 0,
      hasMessages: false
    };
    
    // Save basic report
    saveReportToLocalStorage(formattedReport);
    
    // Save detailed version with evidence files
    const detailedReport = {
      id: mockId,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: reportData.location,
      date: reportData.date || new Date().toISOString().split('T')[0],
      time: reportData.time || "",
      status: 'pending',
      stake: reportData.stakeAmount,
      reward: 0,
      hasMessages: false,
      evidenceFiles: evidenceFiles
    };
    
    // Save detailed report
    saveDetailedReportToLocalStorage(detailedReport);
    
    return { success: true, reportId: mockId };
  }
}

// FIXED helper function to save to localStorage - Improved deduplication
function saveReportToLocalStorage(report) {
  try {
    // Make sure we have a consistent ID format
    const reportId = report.id.toString();
    
    // Get existing reports
    const existingReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]');
    
    // Check if the report already exists (by ID)
    const existingIndex = existingReports.findIndex(r => r.id && r.id.toString() === reportId);
    
    // If it exists, update it, otherwise add as new
    if (existingIndex >= 0) {
      existingReports[existingIndex] = { ...existingReports[existingIndex], ...report };
    } else {
      existingReports.unshift(report); // Add to beginning
    }
    
    // Save back to localStorage
    localStorage.setItem('whispr_reports', JSON.stringify(existingReports));
    console.log("Report saved to localStorage:", report);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Function to save detailed reports with evidence files
function saveDetailedReportToLocalStorage(report) {
  try {
    // Make sure we have a consistent ID format
    const reportId = report.id.toString();
    
    // Get existing detailed reports
    const existingReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
    
    // Check if the report already exists
    const existingIndex = existingReports.findIndex(r => r.id && r.id.toString() === reportId);
    
    if (existingIndex >= 0) {
      existingReports[existingIndex] = { ...existingReports[existingIndex], ...report };
    } else {
      existingReports.unshift(report);
    }
    
    // Save back to localStorage
    localStorage.setItem('whispr_reports_details', JSON.stringify(existingReports));
    console.log("Detailed report saved to localStorage:", report);
  } catch (error) {
    console.error('Error saving detailed report to localStorage:', error);
  }
}

// FIXED Get user reports with improved deduplication
export async function getUserReports() {
  try {
    // Try to get reports from backend
    const backendReports = await whisprBackend.get_my_reports();
    console.log("Retrieved reports from backend:", backendReports);
    
    // Format backend reports for frontend use
    const formattedBackendReports = Array.isArray(backendReports) ? backendReports.map(report => ({
      id: report.id.toString(),
      title: report.title || "",
      category: report.category || "other",
      date: report.date || new Date().toISOString().split('T')[0],
      status: report.status || "pending",
      stake: Number(report.stake || 0),
      reward: Number(report.reward || 0),
      hasMessages: Boolean(report.has_messages || false)
    })) : [];
    
    // Get local reports
    const localReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]')
      .map(report => ({
        ...report,
        id: report.id ? report.id.toString() : "unknown"
      }));
    
    // Use a Map for deduplication
    const reportMap = new Map();
    
    // Add backend reports first (they take precedence)
    formattedBackendReports.forEach(report => {
      if (report.id) reportMap.set(report.id.toString(), report);
    });
    
    // Add local reports only if not already in map
    localReports.forEach(report => {
      if (!reportMap.has(report.id)) {
        reportMap.set(report.id, report);
      }
    });
    
    // Convert back to array
    const combinedReports = Array.from(reportMap.values());
    console.log("Final combined and deduplicated reports:", combinedReports);
    
    return combinedReports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    
    // Fallback to localStorage
    const localReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]');
    
    // Deduplicate local reports by ID
    const reportMap = new Map();
    localReports.forEach(report => {
      if (report.id) reportMap.set(report.id.toString(), report);
    });
    
    const dedupedReports = Array.from(reportMap.values());
    console.log("Using deduplicated local reports as fallback:", dedupedReports);
    return dedupedReports;
  }
}

// Get detailed report by ID - combines basic and detailed data
export async function getReportById(reportId) {
  try {
    // First try to get from backend
    const reports = await getUserReports();
    
    // Find the specific report by ID
    const report = reports.find(r => r.id.toString() === reportId.toString());
    
    if (!report) {
      throw new Error("Report not found");
    }
    
    // Get additional details from localStorage if available
    const localReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
    const detailedReport = localReports.find(r => r.id.toString() === reportId.toString());
    
    // Merge the basic report with detailed data if available
    const fullReport = {
      ...report,
      ...(detailedReport || {}),
    };
    
    return fullReport;
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    
    // Try to get from localStorage as fallback
    const localReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]');
    const localReport = localReports.find(r => r.id.toString() === reportId.toString());
    
    // Get additional details from localStorage if available
    const localDetailsReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
    const detailedReport = localDetailsReports.find(r => r.id.toString() === reportId.toString());
    
    if (!localReport && !detailedReport) {
      throw new Error("Report not found in localStorage");
    }
    
    // Merge the basic report with detailed data if available
    return {
      ...(localReport || {}),
      ...(detailedReport || {}),
    };
  }
}

// Get token balance with improved error handling
export async function getTokenBalance() {
  try {
    const balance = await whisprBackend.get_token_balance();
    return Number(balance);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 250; // Default fallback value
  }
}

// Function to migrate existing reports with URL-based images to indicate they need recovery
export function migrateLocalStorage() {
  try {
    // Get all detailed reports
    const detailedReports = JSON.parse(localStorage.getItem('whispr_reports_details') || '[]');
    let hasChanges = false;
    
    // Check each report that might have URL-based images
    detailedReports.forEach(report => {
      if (report.evidenceFiles) {
        report.evidenceFiles.forEach(file => {
          // If this is an old-style file with only URL and no base64Data
          if (file.url && !file.base64Data) {
            console.log("Converting URL-based file to placeholder:", file.name);
            // Add a placeholder for backward compatibility
            file.base64Data = null;
            file.recoveryNeeded = true;
            hasChanges = true;
          }
        });
      }
    });
    
    // Save back if changes were made
    if (hasChanges) {
      localStorage.setItem('whispr_reports_details', JSON.stringify(detailedReports));
      console.log("Updated reports with recovery flags");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run migration when this module loads
migrateLocalStorage();

export default whisprBackend;