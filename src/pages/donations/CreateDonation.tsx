import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DonationForm } from '../../components/donation/DonationForm';
import { CreateDonationData } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Brain, Target, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateDonation: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateDonationData) => {
    setIsSubmitting(true);
    try {
      const donation = await donationService.create(data);
      toast.success('Donation created! AI is analyzing your food items...');
      navigate(`/donations/${donation.id}`);
    } catch (error) {
      toast.error('Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details below. Our AI will analyze your food and find the best NGO match.
        </p>
      </div>

      <Card>
        <DonationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Card>

      {/* AI Pipeline Info */}
      <div className="mt-6 bg-primary-50 border border-primary-100 rounded-xl p-4">
        <p className="text-sm font-medium text-primary-800 mb-3 flex items-center gap-2">
          <Brain size={16} /> What happens after you submit?
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-white rounded-full px-3 py-1.5 border border-primary-200">
            <Brain size={12} /> AI Food Analysis
          </span>
          <span className="text-primary-300">&rarr;</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-white rounded-full px-3 py-1.5 border border-primary-200">
            <Target size={12} /> Urgency Scoring
          </span>
          <span className="text-primary-300">&rarr;</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-white rounded-full px-3 py-1.5 border border-primary-200">
            <Target size={12} /> Smart NGO Match
          </span>
          <span className="text-primary-300">&rarr;</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-white rounded-full px-3 py-1.5 border border-primary-200">
            <Bell size={12} /> NGO Notified
          </span>
        </div>
      </div>
    </div>
  );
};
