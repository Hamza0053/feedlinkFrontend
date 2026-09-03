import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Donation } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Badge } from '../../components/ui/Badge';
import { UrgencyBadge } from '../../components/donation/UrgencyBadge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Calendar,
  Brain,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  Shield,
  Sparkles,
  Target,
  Zap,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';

export const DonationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    donationService
      .getById(id)
      .then((d) => setDonation(d || null))
      .catch(() => setDonation(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleClaim = async () => {
    if (!donation) return;
    setIsActionLoading(true);
    try {
      const updated = await donationService.claim(donation.id);
      setDonation(updated);
      toast.success('Donation claimed successfully!');
    } catch {
      toast.error('Failed to claim donation');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!donation) return;
    setIsActionLoading(true);
    try {
      const updated = await donationService.updateStatus(donation.id, newStatus);
      setDonation(updated);
      toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Loading donation details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Donation Not Found</h2>
        <p className="text-gray-500 mb-4">The donation you are looking for does not exist.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const ai = donation.aiAnalysis;
  const isGemini = donation.aiSource === 'gemini';
  const urgencyPercent = ai?.urgencyScorePercent ?? (ai ? ai.urgencyScore * 10 : 0);

  const statusSteps = [
    { key: 'pending', label: 'Submitted', icon: <Package size={16} /> },
    { key: 'analyzing', label: 'AI Analyzed', icon: <Brain size={16} /> },
    { key: 'matched', label: 'Matched', icon: <Users size={16} /> },
    { key: 'claimed', label: 'Claimed', icon: <CheckCircle2 size={16} /> },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: <Calendar size={16} /> },
    { key: 'in_transit', label: 'In Transit', icon: <Truck size={16} /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={16} /> },
    { key: 'completed', label: 'Completed', icon: <Shield size={16} /> },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === donation.status);

  const categoryLabels: Record<string, string> = {
    prepared_meals: 'Prepared Meals',
    fresh_produce: 'Fresh Produce',
    packaged_goods: 'Packaged Goods',
    bakery: 'Bakery Items',
    dairy: 'Dairy Products',
    beverages: 'Beverages',
    other: 'Other',
  };

  const urgencyVariant =
    urgencyPercent >= 75 ? 'danger' : urgencyPercent >= 50 ? 'warning' : urgencyPercent >= 25 ? 'primary' : 'success';

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{donation.title}</h1>
          <p className="text-gray-500 mt-1">
            by {donation.donorName} &middot; {format(new Date(donation.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge level={donation.urgencyLevel} size="md" />
          <Badge
            variant={
              donation.status === 'completed' ? 'success' :
              donation.status === 'expired' ? 'danger' :
              donation.status === 'analyzing' ? 'warning' :
              'info'
            }
            size="md"
          >
            {donation.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Status Timeline */}
      {currentStepIndex >= 0 && (
        <Card className="mb-6">
          <CardHeader title="Donation Progress" />
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center min-w-[80px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    i <= currentStepIndex
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-xs text-center ${
                    i <= currentStepIndex ? 'text-primary-700 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <ProgressBar
            value={((currentStepIndex + 1) / statusSteps.length) * 100}
            showValue={false}
            variant={donation.status === 'expired' ? 'danger' : 'primary'}
            className="mt-4"
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Donation Details" />
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-900">{donation.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Package size={14} /> Category
                  </h4>
                  <p className="text-gray-900">
                    {categoryLabels[donation.foodCategory] || donation.foodCategory}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Quantity</h4>
                  <p className="text-gray-900">
                    {donation.quantity} {donation.unit}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar size={14} /> Expiry Date
                  </h4>
                  <p className="text-gray-900">
                    {format(new Date(donation.expiryDate), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Clock size={14} /> Created
                  </h4>
                  <p className="text-gray-900">
                    {format(new Date(donation.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Pickup Info */}
          <Card>
            <CardHeader title="Pickup Information" />
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {donation.pickupAddress}
                  </p>
                  <p className="text-sm text-gray-500">{donation.pickupCity}</p>
                </div>
              </div>
              {donation.pickupInstructions && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Instructions: </span>
                    {donation.pickupInstructions}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Analysis Card */}
          {ai && (
            <Card>
              <CardHeader
                title="AI Food Analysis"
                action={
                  <Badge variant={isGemini ? 'primary' : 'info'} size="sm">
                    {isGemini ? (
                      <><Sparkles size={12} className="mr-1" /> Gemini AI</>
                    ) : (
                      <><Info size={12} className="mr-1" /> Auto Analysis</>
                    )}
                  </Badge>
                }
              />
              <div className="space-y-4">
                {/* Urgency Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Zap size={14} /> Urgency Priority Score
                    </span>
                    <span className={`text-lg font-bold ${
                      urgencyPercent >= 75 ? 'text-red-600' :
                      urgencyPercent >= 50 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {urgencyPercent}/100
                    </span>
                  </div>
                  <ProgressBar
                    value={urgencyPercent}
                    showValue={false}
                    variant={urgencyVariant}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Level: {ai.urgencyLevel.toUpperCase()}
                  </p>
                </div>

                {/* AI Explanation */}
                {ai.explanation && (
                  <div className="bg-primary-50/50 rounded-lg p-3 border border-primary-100">
                    <p className="text-xs font-medium text-primary-700 mb-1 flex items-center gap-1">
                      <Brain size={12} /> Why this urgency?
                    </p>
                    <p className="text-sm text-gray-700">{ai.explanation}</p>
                  </div>
                )}

                {/* Recommended Action */}
                {ai.recommendedAction && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Target size={14} /> Recommended Action
                    </h4>
                    <p className="text-sm text-gray-900">{ai.recommendedAction}</p>
                  </div>
                )}

                {/* Shelf Life */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Clock size={14} /> Shelf Life
                  </h4>
                  <p className="text-sm text-gray-900">{ai.shelfLifeEstimate}</p>
                </div>

                {/* Distribution */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Distribution</h4>
                  <p className="text-sm text-gray-900">{ai.recommendedDistribution}</p>
                </div>

                {/* Storage Tips */}
                {ai.storageRecommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Storage Tips</h4>
                    <ul className="space-y-1">
                      {ai.storageRecommendations.map((rec, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <AlertCircle size={14} className="text-primary-500 mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isGemini && (
                  <p className="text-xs text-gray-400 italic flex items-center gap-1">
                    <Info size={10} />
                    AI analysis unavailable — using deterministic assessment.
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Matched NGO with explanation */}
          {donation.matchedNgoName && (
            <Card>
              <CardHeader
                title="Matched NGO"
                action={
                  donation.matchScore != null ? (
                    <Badge variant={donation.matchScore >= 70 ? 'success' : 'info'} size="sm">
                      Score: {donation.matchScore}/100
                    </Badge>
                  ) : undefined
                }
              />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donation.matchedNgoName}</p>
                    <p className="text-xs text-gray-500">AI-matched partner</p>
                  </div>
                </div>

                {/* Match score bar */}
                {donation.matchScore != null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Match Quality</span>
                      <span className="text-xs font-bold text-gray-700">
                        {donation.matchScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={donation.matchScore}
                      showValue={false}
                      variant={donation.matchScore >= 70 ? 'success' : donation.matchScore >= 40 ? 'warning' : 'danger'}
                    />
                  </div>
                )}

                {/* Match explanation */}
                {donation.matchExplanation && (
                  <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs font-medium text-emerald-700 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Why this NGO?
                    </p>
                    <p className="text-sm text-gray-700">{donation.matchExplanation}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <div className="space-y-3">
              {user?.role === 'ngo' &&
                ['pending', 'matched', 'analyzing'].includes(donation.status) && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleClaim}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Claiming...' : 'Claim This Donation'}
                  </Button>
                )}

              {user?.role === 'ngo' && donation.status === 'claimed' && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleStatusUpdate('pickup_scheduled')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Updating...' : 'Schedule Pickup'}
                </Button>
              )}

              {user?.role === 'ngo' && donation.status === 'pickup_scheduled' && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleStatusUpdate('in_transit')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Updating...' : 'Mark In Transit'}
                </Button>
              )}

              {user?.role === 'ngo' && donation.status === 'in_transit' && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleStatusUpdate('delivered')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Updating...' : 'Mark Delivered'}
                </Button>
              )}

              {user?.role === 'ngo' && donation.status === 'delivered' && (
                <Button
                  className="w-full"
                  size="lg"
                  variant="success"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Updating...' : 'Complete Donation'}
                </Button>
              )}

              {user?.role === 'donor' && donation.status === 'pending' && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Cancelling...' : 'Cancel Donation'}
                </Button>
              )}

              {['completed', 'expired', 'cancelled'].includes(donation.status) && (
                <p className="text-sm text-gray-500 text-center">
                  This donation is {donation.status.replace(/_/g, ' ')}.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
