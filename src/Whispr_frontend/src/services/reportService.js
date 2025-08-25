import { 
  submitReport as apiSubmitReport,
  getUserReports,
  getReportById,
  getAllReports,
  getReportsByStatus
} from '../api/whisprBackend';
import { reportStorage } from '../utils/storage';

export const reportService = {
  async submitReport(reportData) {
    try {
      const result = await apiSubmitReport(reportData);
      if (result.success) {
        reportStorage.setReports([...reportStorage.getReports(), result.data]);
      }
      return result;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit report');
    }
  },

  async getUserReports() {
    try {
      return await getUserReports();
    } catch (error) {
      return reportStorage.getReports();
    }
  },

  async getReportById(id) {
    try {
      return await getReportById(id);
    } catch (error) {
      const reports = reportStorage.getReports();
      return reports.find(r => String(r.id) === String(id));
    }
  },

  async getAllReports() {
    try {
      return await getAllReports();
    } catch (error) {
      return reportStorage.getReports();
    }
  },

  async getReportsByStatus(status) {
    try {
      return await getReportsByStatus(status);
    } catch (error) {
      const reports = reportStorage.getReports();
      return reports.filter(r => r.status === status);
    }
  },

  updateReportStatusLocally(reportId, status, notes = '') {
    reportStorage.updateReportStatus(reportId, status, notes);
  }
};
