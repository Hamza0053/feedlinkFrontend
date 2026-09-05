import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { requirementService } from '../../services/requirementService';
import { NgoRequirement, CreateRequirementData, FoodCategory, RequirementUrgencyLevel } from '../../types/requirement';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit3,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FOOD_CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: 'prepared_meals', label: 'Prepared Meals' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'packaged_goods', label: 'Packaged Goods' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' },
];

const URGENCY_LEVELS: { value: RequirementUrgencyLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="success" size="sm">Active</Badge>;
    case 'fulfilled':
      return <Badge variant="primary" size="sm">Fulfilled</Badge>;
    case 'expired':
      return <Badge variant="default" size="sm">Expired</Badge>;
    case 'cancelled':
      return <Badge variant="danger" size="sm">Cancelled</Badge>;
    default:
      return <Badge variant="default" size="sm">{status}</Badge>;
  }
};

const getUrgencyBadge = (level: string) => {
  switch (level) {
    case 'critical':
      return <Badge variant="danger" size="sm">Critical</Badge>;
    case 'high':
      return <Badge variant="warning" size="sm">High</Badge>;
    case 'medium':
      return <Badge variant="primary" size="sm">Medium</Badge>;
    case 'low':
      return <Badge variant="default" size="sm">Low</Badge>;
    default:
      return <Badge variant="default" size="sm">{level}</Badge>;
  }
};

export const RequirementsPage: React.FC = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<NgoRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<CreateRequirementData>({
    title: '',
    description: '',
    foodCategory: 'prepared_meals',
    quantityNeeded: '',
    unit: 'servings',
    neededFrom: '',
    neededUntil: '',
    pickupCity: user?.address?.split(',').pop()?.trim() || '',
    urgencyLevel: 'medium',
  });

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const data = await requirementService.getMyRequirements(status);
      setRequirements(data);
    } catch {
      toast.error('Failed to load requirements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [filter]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      foodCategory: 'prepared_meals',
      quantityNeeded: '',
      unit: 'servings',
      neededFrom: '',
      neededUntil: '',
      pickupCity: user?.address?.split(',').pop()?.trim() || '',
      urgencyLevel: 'medium',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await requirementService.update(editingId, formData);
        toast.success('Requirement updated');
      } else {
        await requirementService.create(formData);
        toast.success('Requirement created');
      }
      resetForm();
      fetchRequirements();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to save requirement');
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this requirement?')) return;
    try {
      await requirementService.cancel(id);
      toast.success('Requirement cancelled');
      fetchRequirements();
    } catch {
      toast.error('Failed to cancel requirement');
    }
  };

  const handleEdit = (req: NgoRequirement) => {
    setFormData({
      title: req.title,
      description: req.description || '',
      foodCategory: req.foodCategory,
      quantityNeeded: req.quantityNeeded,
      unit: req.unit,
      neededFrom: req.neededFrom.slice(0, 16),
      neededUntil: req.neededUntil.slice(0, 16),
      pickupCity: req.pickupCity,
      urgencyLevel: req.urgencyLevel,
    });
    setEditingId(req.id);
    setShowForm(true);
  };

  const activeCount = requirements.filter((r) => r.status === 'active').length;
  const fulfilledCount = requirements.filter((r) => r.status === 'fulfilled').length;
  const totalRemaining = requirements
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + r.remainingQuantity, 0);

  if (isLoading && requirements.length === 0) {
    return <LoadingSpinner fullScreen text="Loading requirements..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receiving Requirements</h1>
          <p className="text-gray-500 mt-1">
            Post your current food needs so donors can be matched to your organization
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? (
            <>
              <X size={16} /> Cancel
            </>
          ) : (
            <>
              <Plus size={16} /> New Requirement
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active"
          value={activeCount}
          icon={<ClipboardList size={24} />}
          subtitle={`${totalRemaining.toFixed(0)} units remaining`}
        />
        <StatCard
          title="Fulfilled"
          value={fulfilledCount}
          icon={<CheckCircle size={24} />}
          subtitle="Fully met"
        />
        <StatCard
          title="Total"
          value={requirements.length}
          icon={<Clock size={24} />}
          subtitle="All requirements"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader
            title={editingId ? 'Edit Requirement' : 'Create New Requirement'}
            subtitle="Specify what food your organization currently needs"
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="e.g., Need 100 meals for weekend shelter"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Select
                label="Food Category"
                value={formData.foodCategory}
                onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value as FoodCategory })}
                options={FOOD_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                required
              />
              <Input
                label="Quantity Needed"
                type="number"
                min="1"
                step="any"
                placeholder="100"
                value={formData.quantityNeeded}
                onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                required
              />
              <Input
                label="Unit"
                placeholder="servings, kg, lbs, boxes"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
              <Input
                label="Needed From"
                type="datetime-local"
                value={formData.neededFrom}
                onChange={(e) => setFormData({ ...formData, neededFrom: e.target.value })}
                required
              />
              <Input
                label="Needed Until"
                type="datetime-local"
                value={formData.neededUntil}
                onChange={(e) => setFormData({ ...formData, neededUntil: e.target.value })}
                required
              />
              <Input
                label="Pickup/Receiving City"
                placeholder="e.g., New York"
                value={formData.pickupCity}
                onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                required
              />
              <Select
                label="Urgency Level"
                value={formData.urgencyLevel || 'medium'}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as RequirementUrgencyLevel })}
                options={URGENCY_LEVELS.map((u) => ({ value: u.value, label: u.label }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Additional details about your need..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                {editingId ? 'Update Requirement' : 'Create Requirement'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'active', 'fulfilled', 'expired', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requirements List */}
      {requirements.length === 0 ? (
        <EmptyState
          title="No requirements found"
          description="Create your first receiving requirement to start getting matched with food donations."
          action={
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create Requirement
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => {
            const progressPct = Math.round(
              ((req.quantityNeeded - req.remainingQuantity) / req.quantityNeeded) * 100
            );
            const isExpired = new Date(req.neededUntil) < new Date() && req.status === 'active';

            return (
              <Card key={req.id}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{req.title}</h3>
                      {getStatusBadge(req.status)}
                      {getUrgencyBadge(req.urgencyLevel)}
                      {isExpired && (
                        <Badge variant="warning" size="sm">
                          <AlertTriangle size={12} /> Past due
                        </Badge>
                      )}
                    </div>
                    {req.description && (
                      <p className="text-sm text-gray-600">{req.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>Category: <strong>{req.foodCategory.replace('_', ' ')}</strong></span>
                      <span>City: <strong>{req.pickupCity}</strong></span>
                      <span>
                        {new Date(req.neededFrom).toLocaleDateString()} — {new Date(req.neededUntil).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {req.remainingQuantity.toFixed(1)} {req.unit} remaining of {req.quantityNeeded.toFixed(1)} {req.unit}
                        </span>
                        <span>{progressPct}% fulfilled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            progressPct >= 100
                              ? 'bg-green-500'
                              : progressPct >= 50
                              ? 'bg-primary-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, progressPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {req.status === 'active' && (
                    <div className="flex gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(req)}>
                        <Edit3 size={14} /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(req.id)}>
                        <XCircle size={14} /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
