import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';

export const useReports = (status = 'all') => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = status === 'all' 
        ? await reportService.getAllReports()
        : await reportService.getReportsByStatus(status);
      
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [status]);

  const refreshReports = () => {
    fetchReports();
  };

  return {
    reports,
    loading,
    error,
    refreshReports
  };
};
