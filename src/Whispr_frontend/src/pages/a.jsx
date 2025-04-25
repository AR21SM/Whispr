import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FilePlus, Camera, AlertTriangle, Info, X, Plus, ChevronRight, Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MapSelector from '../components/ui/MapSelector';
import { submitReport } from '../api/whisprBackend';

const ReportPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('details');
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      coordinates: null
    },
    date: '',
    time: '',
    category: '',
    evidenceFiles: [],
    stakeAmount: 10
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Your existing code and handlers remain the same...

  const handleNextStep = () => {
    if (currentStep === 'details') setCurrentStep('evidence');
    else if (currentStep === 'evidence') setCurrentStep('staking');
    else if (currentStep === 'staking') setCurrentStep('review');
    else if (currentStep === 'review') {
      setIsSubmitting(true);
      
      // Submit report to backend
      submitReport(reportData)
        .then(response => {
          setIsSubmitting(false);
          
          if (response.success) {
            // Store the report ID for display
            const submittedReport = {
              ...reportData,
              id: response.reportId
            };
            
            setReportData(submittedReport);
            
            // Save to localStorage for immediate display in dashboard
            saveReportToLocalStorage(submittedReport);
            
            setCurrentStep('confirmation');
          } else {
            alert(`Error submitting report: ${response.error}`);
          }
        })
        .catch(error => {
          setIsSubmitting(false);
          alert(`An unexpected error occurred: ${error.message}`);
        });
    }
  };

  // Function to save to localStorage until backend sync is complete
  const saveReportToLocalStorage = (report) => {
    try {
      const dashboardReport = {
        id: report.id,
        title: report.title,
        category: report.category,
        date: report.date || new Date().toISOString().split('T')[0],
        status: 'pending',
        stake: report.stakeAmount,
        reward: 0,
        hasMessages: false
      };
      
      const existingReports = JSON.parse(localStorage.getItem('whispr_reports') || '[]');
      const updatedReports = [dashboardReport, ...existingReports];
      localStorage.setItem('whispr_reports', JSON.stringify(updatedReports));
    } catch (error) {
      console.error('Error saving report to localStorage:', error);
    }
  };

  // Update confirmation step to use React Router for navigation
  
  // Rest of your component remains the same...
};

export default ReportPage;