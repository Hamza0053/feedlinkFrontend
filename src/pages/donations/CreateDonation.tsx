import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateDonationData, Donation } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { UrgencyBadge } from '../../components/donation/UrgencyBadge';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  AlertCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const foodCategoryOptions = [
  { value: 'prepared_meals', label: 'Prepared Meals' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'packaged_goods', label: 'Packaged Goods' },
  { value: 'bakery', label: 'Bakery Items' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' },
];

const unitOptions = [
  { value: 'portions', label: 'Portions' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'loaves', label: 'Loaves' },
  { value: 'liters', label: 'Liters' },
  { value: 'packages', label: 'Packages' },
  { value: 'cans', label: 'Cans' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'platters', label: 'Platters' },
  { value: 'items', label: 'Items' },
];

export const CreateDonation: React.FC = () => {
  const navigate = useNavigate();

  // Wizard step: 1 = Input Data, 2 = AI Analysis & Matching
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form state
  const [formData, setFormData] = useState<CreateDonationData>({
    title: '',
    description: '',
    foodCategory: 'prepared_meals',
    quantity: '',
    unit: 'portions',
    servings: '',
    expiryDate: '',
    pickupAddress: '',
    pickupCity: '',
    pickupInstructions: '',
  });

  // AI & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDonation, setCreatedDonation] = useState<Donation | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to set expiry date quickly with presets
  const setExpiryHours = (hours: number) => {
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);
    const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData((prev) => ({ ...prev, expiryDate: localIso }));
  };

  // Validate step 1 before proceeding to AI analysis
  const handleProceedToAnalysis = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    if (formData.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (!formData.expiryDate) {
      toast.error('Please select an expiry date & time');
      return;
    }
    if (formData.pickupAddress.trim().length < 5) {
      toast.error('Pickup address must be at least 5 characters');
      return;
    }
    if (formData.pickupCity.trim().length < 2) {
      toast.error('City must be at least 2 characters');
      return;
    }

    // Move to step 2 and trigger AI analysis
    setCurrentStep(2);
    runAiSubmission(formData);
  };

  const runAiSubmission = async (data: CreateDonationData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const result = await donationService.create(data);
      setCreatedDonation(result);
      toast.success('AI analysis & matching complete!');
    } catch (err: any) {
      const details = err?.response?.data?.details;
      const msg = details
        ? details.map((d: { field: string; message: string }) => `${d.field}: ${d.message}`).join('; ')
        : err?.response?.data?.error || 'AI analysis failed. Please try again.';
      setSubmissionError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      foodCategory: 'prepared_meals',
      quantity: '',
      unit: 'portions',
      servings: '',
      expiryDate: '',
      pickupAddress: '',
      pickupCity: '',
      pickupInstructions: '',
    });
    setCreatedDonation(null);
    setSubmissionError(null);
    setCurrentStep(1);
  };

  const ai = createdDonation?.aiAnalysis;
  const urgencyPercent = ai?.urgencyScorePercent ?? (ai ? ai.urgencyScore * 10 : 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => (currentStep === 2 && !createdDonation ? setCurrentStep(1) : navigate(-1))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            {currentStep === 2 && !createdDonation ? 'Back to Details' : 'Back'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Food Donation
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            List surplus food, run instant AI urgency analysis, and connect with nearby NGOs.
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => !isSubmitting && !createdDonation && setCurrentStep(1)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 1
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 1 ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              1
            </span>
            <span>Donation Info</span>
          </button>

          <div className="w-5 h-0.5 bg-gray-200 mx-1" />

          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 2 ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              2
            </span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              AI Analysis & Match
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: INPUT DATA FORM                                                   */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToAnalysis} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Fields (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section: Food Item Details */}
              <Card>
                <CardHeader
                  title="Food Item Details"
                  subtitle="Describe the surplus food items you wish to donate"
                />
                <div className="space-y-4">
                  <Input
                    label="Donation Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Fresh Gourmet Pasta & Tomato Basil Sauce"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Food Category *"
                      name="foodCategory"
                      value={formData.foodCategory}
                      onChange={handleChange}
                      options={foodCategoryOptions}
                      required
                    />

                    <div>
                      <Input
                        label="Estimated Servings (Optional)"
                        name="servings"
                        type="number"
                        min="1"
                        value={formData.servings}
                        onChange={handleChange}
                        placeholder="e.g., 25 servings"
                      />
                    </div>
                  </div>

                  <Textarea
                    label="Description & Ingredients *"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe condition, allergens, packaging, and any handling requirements..."
                    required
                  />
                </div>
              </Card>

              {/* Section: Quantity & Expiry */}
              <Card>
                <CardHeader
                  title="Quantity & Shelf Life"
                  subtitle="Urgency score will be calculated from expiry date and food type"
                />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Quantity *"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 15"
                      required
                    />

                    <Select
                      label="Unit *"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      options={unitOptions}
                      required
                    />
                  </div>

                  {/* Expiry Input with Quick Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Best Before / Expiry Date & Time *
                      </label>
                      <span className="text-xs text-gray-400">Quick presets:</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setExpiryHours(6)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        +6 Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryHours(12)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        +12 Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryHours(24)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        +24 Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryHours(48)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        +2 Days
                      </button>
                    </div>

                    <Input
                      name="expiryDate"
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      icon={<Calendar size={18} />}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Section: Pickup Logistics */}
              <Card>
                <CardHeader
                  title="Pickup Location & Instructions"
                  subtitle="Where the matched NGO partner will collect the donation"
                />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Street Address *"
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleChange}
                        placeholder="e.g., 742 Evergreen Terrace"
                        icon={<MapPin size={18} />}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="City *"
                        name="pickupCity"
                        value={formData.pickupCity}
                        onChange={handleChange}
                        placeholder="e.g., Springfield"
                        required
                      />
                    </div>
                  </div>

                  <Textarea
                    label="Pickup Instructions (Optional)"
                    name="pickupInstructions"
                    value={formData.pickupInstructions}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Please enter via back loading dock. Ring bell labeled Kitchen."
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar Preview & Submit Card (1 column) */}
            <div className="space-y-6">
              <Card className="sticky top-20 border-primary-100 bg-gradient-to-b from-white to-primary-50/20">
                <CardHeader
                  title="Analysis Summary"
                  action={
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                      <Sparkles size={11} /> Step 1 of 2
                    </span>
                  }
                />

                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Category</span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {formData.foodCategory.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Volume</span>
                      <span className="font-semibold text-gray-800">
                        {formData.quantity ? `${formData.quantity} ${formData.unit}` : 'Not set'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Destination City</span>
                      <span className="font-semibold text-gray-800">
                        {formData.pickupCity || 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* What AI will do */}
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <Brain size={14} className="text-primary-600" />
                      What happens in Step 2:
                    </p>
                    <ul className="space-y-1.5 pl-5 list-disc text-gray-500">
                      <li>Calculates priority urgency score (0–100)</li>
                      <li>Estimates remaining shelf-life & storage tips</li>
                      <li>Matches nearest NGO with spare capacity</li>
                      <li>Generates explainable recommendation report</li>
                    </ul>
                  </div>

                  {/* Proceed Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Proceed to AI Analysis</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: AI ANALYSIS & NGO MATCHING (LIVE)                                  */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* State A: Loading / Processing AI Engine */}
          {isSubmitting && (
            <Card className="text-center py-16 px-6 border-primary-100 bg-gradient-to-b from-white via-primary-50/20 to-white">
              <div className="max-w-md mx-auto space-y-6">
                {/* Glowing Radar Icon */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary-400 rounded-full opacity-20 animate-ping" />
                  <div className="absolute -inset-2 bg-gradient-to-tr from-primary-500 to-emerald-400 rounded-full opacity-30 blur-md animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <Brain size={32} className="animate-pulse" />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Running AI Food Analysis...
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Google Gemini is evaluating perishability, safety parameters, and NGO capacity.
                  </p>
                </div>

                {/* Animated Pipeline Badges */}
                <div className="space-y-2 text-left bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                  <div className="flex items-center gap-3 text-xs text-primary-700 font-medium animate-pulse">
                    <Zap size={14} className="text-primary-600 shrink-0" />
                    <span>Analyzing food category suitability & perishability...</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Clock size={14} className="text-amber-500 shrink-0" />
                    <span>Scoring urgency level and estimated shelf life...</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Building2 size={14} className="text-blue-500 shrink-0" />
                    <span>Searching nearby NGOs in {formData.pickupCity || 'area'} with available capacity...</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* State B: Error State */}
          {!isSubmitting && submissionError && (
            <Card className="border-red-200 bg-red-50/50 p-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-red-900">AI Analysis Error</h3>
                <p className="text-sm text-red-700">{submissionError}</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit Details
                  </Button>
                  <Button
                    onClick={() => runAiSubmission(formData)}
                  >
                    <RotateCcw size={16} className="mr-1.5" />
                    Retry Analysis
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* State C: Successfully Analyzed & Matched! */}
          {!isSubmitting && createdDonation && (
            <div className="space-y-6 animate-fade-in">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-primary-600 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white/20 rounded-md">
                        Step 2 Complete
                      </span>
                      <span className="text-xs text-emerald-100">
                        ID: {createdDonation.id.slice(0, 8)}...
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mt-0.5">
                      Donation Analyzed & NGO Matched!
                    </h2>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Your surplus food has been recorded and an alert sent to the recommended partner.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 border-0 shadow-xs"
                    onClick={() => navigate(`/donations/${createdDonation.id}`)}
                  >
                    View Lifecycle Tracker &rarr;
                  </Button>
                </div>
              </div>

              {/* Grid: AI Urgency & Distribution Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left (2 columns): Detailed AI Insights */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Urgency & Explanation Card */}
                  <Card>
                    <CardHeader
                      title="AI Urgency Assessment"
                      subtitle={`Evaluated via ${createdDonation.aiSource === 'gemini' ? 'Google Gemini AI' : 'Deterministic Rules Engine'}`}
                      action={
                        <Badge
                          variant={createdDonation.aiSource === 'gemini' ? 'primary' : 'info'}
                          size="sm"
                        >
                          <Sparkles size={11} className="mr-1" />
                          {createdDonation.aiSource === 'gemini' ? 'Gemini 2.0 / Flash' : 'Deterministic'}
                        </Badge>
                      }
                    />

                    <div className="space-y-5">
                      {/* Priority Score Meter */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              Urgency Priority
                            </span>
                            <UrgencyBadge level={createdDonation.urgencyLevel} size="sm" />
                          </div>
                          <span className="text-sm font-extrabold text-gray-900">
                            {urgencyPercent}/100
                          </span>
                        </div>
                        <ProgressBar
                          value={urgencyPercent}
                          showValue={false}
                          variant={
                            urgencyPercent >= 75
                              ? 'danger'
                              : urgencyPercent >= 50
                              ? 'warning'
                              : 'success'
                          }
                        />
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                          <span>Low Urgency (Pantry)</span>
                          <span>Critical (Immediate Kitchen Need)</span>
                        </div>
                      </div>

                      {/* Remaining Shelf Life */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-primary-50/50 rounded-xl border border-primary-100">
                          <p className="text-xs font-medium text-primary-800 flex items-center gap-1.5">
                            <Clock size={14} className="text-primary-600" />
                            Estimated Shelf Life
                          </p>
                          <p className="text-base font-bold text-primary-900 mt-1">
                            {ai?.shelfLifeEstimate || 'Ready for immediate transfer'}
                          </p>
                        </div>

                        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            Recommended Route
                          </p>
                          <p className="text-base font-bold text-emerald-900 mt-1">
                            {ai?.recommendedDistribution || 'Shelters & Meal Programs'}
                          </p>
                        </div>
                      </div>

                      {/* AI Rationale & Explanation */}
                      {ai?.explanation && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                            AI Explanation & Rationale
                          </h4>
                          <p className="text-sm text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200/70 leading-relaxed">
                            {ai.explanation}
                          </p>
                        </div>
                      )}

                      {/* Storage Recommendations */}
                      {ai?.storageRecommendations && ai.storageRecommendations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Safe Storage & Handling Directives
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ai.storageRecommendations.map((tip, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100"
                              >
                                <CheckCircle2 size={14} className="text-primary-600 shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Right (1 column): NGO Match Partner Card */}
                <div className="space-y-6">
                  <Card className="border-emerald-200 shadow-sm">
                    <CardHeader
                      title="Best NGO Partner Match"
                      subtitle="Automatically matched based on proximity & capacity"
                      action={
                        createdDonation.matchScore != null ? (
                          <Badge variant="success" size="sm">
                            {createdDonation.matchScore}% Match
                          </Badge>
                        ) : undefined
                      }
                    />

                    <div className="space-y-4">
                      {createdDonation.matchedNgoName ? (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Building2 size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {createdDonation.matchedNgoName}
                              </p>
                              <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {createdDonation.pickupCity} Partner
                              </p>
                            </div>
                          </div>

                          {/* Match Quality */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-500 font-medium">Compatibility Score</span>
                              <span className="font-bold text-gray-800">
                                {createdDonation.matchScore ?? 85}%
                              </span>
                            </div>
                            <ProgressBar
                              value={createdDonation.matchScore ?? 85}
                              showValue={false}
                              variant="success"
                            />
                          </div>

                          {/* Match Explanation */}
                          {createdDonation.matchExplanation && (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                              <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                                <Sparkles size={12} className="text-emerald-600" />
                                Why this partner was selected:
                              </p>
                              {createdDonation.matchExplanation}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center text-xs text-gray-500">
                          <p className="font-semibold text-gray-700">Open For Claim</p>
                          <p className="mt-1">
                            Donation is live on the NGO discovery board for local verified receivers.
                          </p>
                        </div>
                      )}

                      {/* Next Steps Buttons */}
                      <div className="pt-2 space-y-2">
                        <Button
                          className="w-full"
                          size="md"
                          onClick={() => navigate(`/donations/${createdDonation.id}`)}
                        >
                          View Full Details
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          size="md"
                          onClick={resetForm}
                        >
                          Create Another Donation
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
