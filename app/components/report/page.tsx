// app/my-report/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/app/components/layout';

export default function MyReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/report/my-reports');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data.reports);
      } catch (err) {
        setError('Error loading reports. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Submitted Reports</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center p-12">
            <div className="spinner"></div>
            <p className="mt-4">Loading your reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-gray-100 p-8 text-center rounded">
            <p className="text-lg">You haven't submitted any reports yet.</p>
            <button 
              onClick={() => window.location.href = '/submit-report'}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Submit a Report
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Crime Subcategory</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Crime Occurrence</th>
                  <th className="py-3 px-4 text-left">Tip Score</th>
                  <th className="py-3 px-4 text-left">Solved</th>
                  <th className="py-3 px-4 text-left">Token Stake</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{report.crimeSubcategory}</td>
                    <td className="py-3 px-4">
                      {report.description.length > 50
                        ? `${report.description.substring(0, 50)}...`
                        : report.description}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(report.occurrenceDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{report.tipScore}</td>
                    <td className="py-3 px-4">
                      {report.solved ? (
                        <span className="bg-green-100 text-green-800 py-1 px-2 rounded">Yes</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 py-1 px-2 rounded">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{report.tokenStake} tokens</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}