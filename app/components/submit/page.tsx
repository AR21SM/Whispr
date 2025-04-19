"use client";
// components/submit/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    crimeSubcategory: '',
    description: '',
    personallyWitnessed: false,
    location: '',
    tokenStake: 0,
    evidenceFiles: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      evidenceFiles: e.target.files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Call the API endpoint to save the report
      const response = await fetch('/api/report/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crimeSubcategory: formData.crimeSubcategory,
          description: formData.description,
          personallyWitnessed: formData.personallyWitnessed,
          location: formData.location,
          tokenStake: formData.tokenStake,
          occurrenceDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      // Redirect to my-report page after successful submission
      router.push('/my-report');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Submit Anonymous Report</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Crime Subcategory</label>
          <select
            name="crimeSubcategory"
            value={formData.crimeSubcategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select category</option>
            <option value="Murder">Murder</option>
            <option value="Theft">Theft</option>
            <option value="Fraud">Fraud</option>
            <option value="Narcotics">Narcotics</option>
            <option value="Cybercrime">Cybercrime</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={5}
            required
            placeholder="Provide detailed information about the incident"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder="Where did this incident occur?"
          />
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="personallyWitnessed"
            checked={formData.personallyWitnessed}
            onChange={handleChange}
            className="mr-2"
            id="personallyWitnessed"
          />
          <label htmlFor="personallyWitnessed" className="text-gray-700">
            I personally witnessed this incident
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Token Stake (minimum 10 tokens)
          </label>
          <input
            type="number"
            name="tokenStake"
            value={formData.tokenStake}
            onChange={handleChange}
            min="10"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Staking tokens helps prevent false reports. You'll receive 10x your stake as a reward if your report is verified as genuine.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Evidence (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            multiple
          />
          <p className="text-sm text-gray-500 mt-1">
            You can upload photos or videos as evidence (max 10MB)
          </p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-bold mb-2">Privacy Notice</h3>
          <p className="text-sm">
            Your report will be submitted anonymously using blockchain technology. No personal identification information will be collected or stored.
          </p>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}