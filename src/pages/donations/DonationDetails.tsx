import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Donation, DonationStatus } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Badge } from '../../components/ui/Badge';
import { UrgencyBadge } from '../../components/donation/UrgencyBadge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { EditDonationModal } from '../../components/donation/EditDonationModal';
import { DeleteDonationModal } from '../../components/donation/DeleteDonationModal';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Brain,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  Shield,
  Sparkles,
  Pencil,
  Trash2,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const statusConfig: Record<
  DonationStatus,
  { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'; label: string; description: string }
> = {
  pending: { variant: 'default', label: 'Pending Review', description: 'Awaiting AI processing & validation' },
  analyzing: { variant: 'info', label: 'AI Analyzing', description: 'Urgency scoring and NGO matching in progress' },
  matched: { variant: 'primary', label: 'Matched', description: 'Matched with a verified local NGO receiver' },
  claimed: { variant: 'info', label: 'Claimed', description: 'NGO confirmed acceptance of this donation' },
  pickup_scheduled: { variant: 'warning', label: 'Pickup Scheduled', description: 'Logistics arranged for collection' },
  in_transit: { variant: 'warning', label: 'In Transit', description: 'Food is currently on the way to the receiver' },
  delivered: { variant: 'success', label: 'Delivered', description: 'Delivered safely to the destination facility' },
  completed: { variant: 'success', label: 'Completed', description: 'Redistributed successfully to the community' },
  expired: { variant: 'danger', label: 'Expired', description: 'Donation passed its safety window' },
  cancelled: { variant: 'danger', label: 'Cancelled', description: 'Donation was cancelled by donor' },
  available: { variant: 'primary', label: 'Available', description: 'Open for any registered NGO to claim' },
};

const categoryLabels: Record<string, string> = {
  prepared_meals: 'Prepared Meals',
  fresh_produce: 'Fresh Produce',
  packaged_goods: 'Packaged Goods',
  bakery: 'Bakery Items',
  dairy: 'Dairy Products',
  beverages: 'Beverages',
  other: 'Other',
};

export const DonationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading donation details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Donation Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The donation record you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const ai = donation.aiAnalysis;
  const isGemini = donation.aiSource === 'gemini';
  const urgencyPercent = ai?.urgencyScorePercent ?? (ai ? ai.urgencyScore * 10 : 0);
  const statusMeta = statusConfig[donation.status] || statusConfig.pending;

  const isOwner = (user?.role === 'donor' && user?.id === donation.donorId) || user?.role === 'admin';
  const canEdit = isOwner && ['pending', 'analyzing', 'matched'].includes(donation.status);
  const canDelete = isOwner && !['claimed', 'pickup_scheduled', 'in_transit'].includes(donation.status);

  // Lifecycle steps
  const statusSteps = [
    { key: 'pending', label: 'Submitted', icon: Package },
    { key: 'analyzing', label: 'AI Analyzed', icon: Brain },
    { key: 'matched', label: 'Matched', icon: Users },
    { key: 'claimed', label: 'Claimed', icon: CheckCircle2 },
    { key: 'pickup_scheduled', label: 'Pickup Ready', icon: Calendar },
    { key: 'in_transit', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    { key: 'completed', label: 'Completed', icon: Shield },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === donation.status);

  // Calculate hours remaining until expiry
  const expiryDate = new Date(donation.expiryDate);
  const isExpired = expiryDate.getTime() < Date.now();
  const hoursRemaining = Math.max(
    0,
    Math.round((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link
            to="/dashboard"
            className="hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-400">Donations</span>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">
            {donation.title}
          </span>
        </div>

        {/* Quick Action Buttons in Top Bar */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Donor Actions */}
          {isOwner && (
            <>
              {canEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <Pencil size={14} />
                  Edit
                </Button>
              )}
              {['pending', 'analyzing', 'matched'].includes(donation.status) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isActionLoading}
                  className="text-amber-700 hover:bg-amber-50 border-amber-200"
                >
                  Cancel
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              )}
            </>
          )}

          {/* NGO Workflow Actions */}
          {user?.role === 'ngo' && (
            <>
              {['pending', 'matched', 'analyzing'].includes(donation.status) && (
                <Button
                  size="sm"
                  onClick={handleClaim}
                  disabled={isActionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs font-semibold"
                >
                  <CheckCircle2 size={14} />
                  {isActionLoading ? 'Claiming...' : 'Claim This Donation'}
                </Button>
              )}
              {donation.status === 'claimed' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('pickup_scheduled')}
                  disabled={isActionLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1.5 font-semibold"
                >
                  <Calendar size={14} />
                  {isActionLoading ? 'Updating...' : 'Schedule Pickup'}
                </Button>
              )}
              {donation.status === 'pickup_scheduled' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('in_transit')}
                  disabled={isActionLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 font-semibold"
                >
                  <Truck size={14} />
                  {isActionLoading ? 'Updating...' : 'Mark In Transit'}
                </Button>
              )}
              {donation.status === 'in_transit' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('delivered')}
                  disabled={isActionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-semibold"
                >
                  <CheckCircle2 size={14} />
                  {isActionLoading ? 'Updating...' : 'Mark Delivered'}
                </Button>
              )}
              {donation.status === 'delivered' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isActionLoading}
                  className="flex items-center gap-1.5 font-semibold"
                >
                  <ShieldCheck size={14} />
                  {isActionLoading ? 'Updating...' : 'Complete Donation'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary-50/60 via-emerald-50/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusMeta.variant} size="md">
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                {statusMeta.label}
              </Badge>
              <UrgencyBadge level={donation.urgencyLevel} size="md" />
              <span className="text-xs text-gray-400 font-mono">
                #{donation.id.slice(0, 8)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {donation.title}
            </h1>

            <p className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
              <span>Donated by <strong className="text-gray-800">{donation.donorName}</strong></span>
              <span>&middot;</span>
              <span>Created {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 text-gray-600">
                <MapPin size={13} /> {donation.pickupCity}
              </span>
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3 shrink-0">
            <div className="text-center px-3 border-r border-gray-200">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Volume</p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {donation.quantity} <span className="text-xs font-normal text-gray-500">{donation.unit}</span>
              </p>
            </div>

            <div className="text-center px-3">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Urgency Score</p>
              <p className={`text-base font-extrabold mt-0.5 ${
                urgencyPercent >= 75 ? 'text-red-600' :
                urgencyPercent >= 50 ? 'text-amber-600' :
                'text-emerald-600'
              }`}>
                {urgencyPercent}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Lifecycle Progress Stepper */}
      {currentStepIndex >= 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary-600" />
                Donation Lifecycle Progress
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{statusMeta.description}</p>
            </div>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
              Step {currentStepIndex + 1} of {statusSteps.length}
            </span>
          </div>

          {/* Stepper Node Line */}
          <div className="overflow-x-auto pb-2 pt-1">
            <div className="min-w-[680px] flex items-center justify-between relative">
              {/* Background Connecting Bar */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
              {/* Active Connecting Bar */}
              <div
                className="absolute top-5 left-6 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                style={{
                  width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              />

              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                const isPassed = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-600 ring-4 ring-emerald-100'
                          : 'bg-white text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isPassed ? <Check size={18} /> : <Icon size={18} />}
                    </div>

                    <span
                      className={`text-xs mt-2 font-medium text-center whitespace-nowrap ${
                        isCurrent
                          ? 'text-emerald-700 font-bold'
                          : isPassed
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Food Details, Logistics, & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Specifications Grid */}
          <Card>
            <CardHeader title="Food Specifications" subtitle="Detailed attributes of the donated surplus items" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Category
                </span>
                <span className="text-sm font-bold text-gray-900 mt-1 block capitalize">
                  {categoryLabels[donation.foodCategory] || donation.foodCategory}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Quantity
                </span>
                <span className="text-sm font-bold text-gray-900 mt-1 block">
                  {donation.quantity} {donation.unit}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Servings
                </span>
                <span className="text-sm font-bold text-gray-900 mt-1 block">
                  {donation.servings ? `${donation.servings} people` : 'Standard batch'}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isExpired
                  ? 'bg-red-50 border-red-200'
                  : hoursRemaining <= 12
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-gray-50 border-gray-100'
              }`}>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Shelf Life
                </span>
                <span className={`text-sm font-bold mt-1 block ${
                  isExpired ? 'text-red-700' : hoursRemaining <= 12 ? 'text-amber-800' : 'text-gray-900'
                }`}>
                  {isExpired ? 'Expired' : `${hoursRemaining}h remaining`}
                </span>
              </div>
            </div>

            {/* Description & Notes */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Item Description & Ingredients
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                {donation.description || 'No detailed description provided.'}
              </p>
            </div>
          </Card>

          {/* Pickup & Logistics Card */}
          <Card>
            <CardHeader
              title="Pickup Location & Instructions"
              subtitle="Designated collection address for the verified partner"
            />
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{donation.pickupAddress}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{donation.pickupCity}</p>
                </div>
              </div>

              {donation.pickupInstructions && (
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/80">
                  <p className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-600" />
                    Special Pickup Instructions
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {donation.pickupInstructions}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> Expiry Target:
                </span>
                <span className="font-semibold text-gray-800">
                  {format(new Date(donation.expiryDate), 'EEEE, MMMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Insights & NGO Matching (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Intelligence Card */}
          {ai && (
            <Card className="border-emerald-100">
              <CardHeader
                title="AI Safety & Urgency Score"
                action={
                  <Badge variant={isGemini ? 'primary' : 'info'} size="sm">
                    <Sparkles size={11} className="mr-1" />
                    {isGemini ? 'Google Gemini AI' : 'Deterministic'}
                  </Badge>
                }
              />

              <div className="space-y-4">
                {/* Priority Gauge */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Calculated Urgency
                    </span>
                    <span className={`text-base font-extrabold ${
                      urgencyPercent >= 75 ? 'text-red-600' :
                      urgencyPercent >= 50 ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>
                      {urgencyPercent}/100
                    </span>
                  </div>
                  <ProgressBar
                    value={urgencyPercent}
                    showValue={false}
                    variant={
                      urgencyPercent >= 75 ? 'danger' :
                      urgencyPercent >= 50 ? 'warning' :
                      'success'
                    }
                  />
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                  </div>
                </div>

                {/* AI Rationale */}
                {ai.explanation && (
                  <div className="p-3.5 bg-primary-50/50 rounded-xl border border-primary-100">
                    <p className="text-xs font-bold text-primary-800 mb-1 flex items-center gap-1.5">
                      <Brain size={13} className="text-primary-600" />
                      AI Evaluation Rationale
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {ai.explanation}
                    </p>
                  </div>
                )}

                {/* Recommended Distribution Route */}
                {ai.recommendedDistribution && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Recommended Route
                    </span>
                    <span className="text-xs font-medium text-emerald-900 mt-0.5 block">
                      {ai.recommendedDistribution}
                    </span>
                  </div>
                )}

                {/* Storage Recommendations */}
                {ai.storageRecommendations && ai.storageRecommendations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Storage & Safety Tips
                    </h4>
                    <ul className="space-y-1.5">
                      {ai.storageRecommendations.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100"
                        >
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Matched NGO Partner Card */}
          {donation.matchedNgoName ? (
            <Card className="border-emerald-200 shadow-2xs">
              <CardHeader
                title="Matched NGO Partner"
                action={
                  donation.matchScore != null ? (
                    <Badge variant="success" size="sm">
                      {donation.matchScore}% Match
                    </Badge>
                  ) : undefined
                }
              />

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {donation.matchedNgoName}
                    </p>
                    <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {donation.pickupCity} Verified Partner
                    </p>
                  </div>
                </div>

                {/* Match Quality */}
                {donation.matchScore != null && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 font-medium">Match Score</span>
                      <span className="font-bold text-gray-800">
                        {donation.matchScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={donation.matchScore}
                      showValue={false}
                      variant="success"
                    />
                  </div>
                )}

                {/* Match Explanation */}
                {donation.matchExplanation && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                    <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                      <Sparkles size={12} className="text-emerald-600" />
                      Why this partner was selected:
                    </p>
                    {donation.matchExplanation}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="border-gray-200">
              <div className="p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <h4 className="text-sm font-bold text-gray-800">Open For NGO Claim</h4>
                <p className="text-xs text-gray-500">
                  This donation is visible to all registered NGOs in {donation.pickupCity}.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Donation Modal */}
      <EditDonationModal
        isOpen={isEditModalOpen}
        donation={donation}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => setDonation(updated)}
      />

      {/* Delete Donation Modal */}
      <DeleteDonationModal
        isOpen={isDeleteModalOpen}
        donation={donation}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};
