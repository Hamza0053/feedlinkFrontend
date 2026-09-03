import React, { useState, useEffect } from 'react';
import { Donation, CreateDonationData } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
  onSuccess: (updated: Donation) => void;
}

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

export const EditDonationModal: React.FC<EditDonationModalProps> = ({
  isOpen,
  onClose,
  donation,
  onSuccess,
}) => {
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (donation) {
      // Format expiryDate for datetime-local input
      let expiryFormatted = '';
      if (donation.expiryDate) {
        const d = new Date(donation.expiryDate);
        if (!isNaN(d.getTime())) {
          expiryFormatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        }
      }

      setFormData({
        title: donation.title || '',
        description: donation.description || '',
        foodCategory: donation.foodCategory || 'prepared_meals',
        quantity: donation.quantity || '',
        unit: donation.unit || 'portions',
        servings: donation.servings ? String(donation.servings) : '',
        expiryDate: expiryFormatted,
        pickupAddress: donation.pickupAddress || '',
        pickupCity: donation.pickupCity || '',
        pickupInstructions: donation.pickupInstructions || '',
      });
    }
  }, [donation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donation) return;

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await donationService.update(donation.id, formData);
      toast.success('Donation updated successfully');
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to update donation';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!donation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Donation Details" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <Input
          label="Donation Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Food Category *"
            name="foodCategory"
            value={formData.foodCategory}
            onChange={handleChange}
            options={foodCategoryOptions}
            required
          />

          <Input
            label="Servings (Optional)"
            name="servings"
            type="number"
            min="1"
            value={formData.servings}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Description & Ingredients *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Quantity *"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
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

        <Input
          label="Expiry Date & Time *"
          name="expiryDate"
          type="datetime-local"
          value={formData.expiryDate}
          onChange={handleChange}
          icon={<Calendar size={16} />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Street Address *"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              icon={<MapPin size={16} />}
              required
            />
          </div>
          <div>
            <Input
              label="City *"
              name="pickupCity"
              value={formData.pickupCity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Textarea
          label="Pickup Instructions"
          name="pickupInstructions"
          value={formData.pickupInstructions}
          onChange={handleChange}
          rows={2}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
