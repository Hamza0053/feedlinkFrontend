import React, { useState } from 'react';
import { CreateDonationData } from '../../types/donation';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Package, MapPin, Calendar, Image } from 'lucide-react';

interface DonationFormProps {
  onSubmit: (data: CreateDonationData) => void;
  isLoading?: boolean;
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
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'portions', label: 'Portions' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'loaves', label: 'Loaves' },
  { value: 'liters', label: 'Liters' },
  { value: 'packages', label: 'Packages' },
  { value: 'cans', label: 'Cans' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'platters', label: 'Platters' },
  { value: 'items', label: 'Items' },
];

export const DonationForm: React.FC<DonationFormProps> = ({
  onSubmit,
  isLoading = false,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} className="text-primary-600" />
          Donation Details
        </h3>

        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fresh Pasta & Sauce - Evening Surplus"
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the food items, condition, and any special notes..."
            rows={3}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Food Category"
              name="foodCategory"
              value={formData.foodCategory}
              onChange={handleChange}
              options={foodCategoryOptions}
              required
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 30"
              min="1"
              required
            />
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              options={unitOptions}
              required
            />
          </div>

          <Input
            label="Estimated Servings (Optional)"
            name="servings"
            type="number"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 30 (helps AI analysis)"
            min="1"
          />

          <Input
            label="Expiry Date"
            name="expiryDate"
            type="datetime-local"
            value={formData.expiryDate}
            onChange={handleChange}
            icon={<Calendar size={18} />}
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-primary-600" />
          Pickup Information
        </h3>

        <div className="space-y-4">
          <Input
            label="Pickup Address"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="Street address for pickup"
            required
          />

          <Input
            label="City"
            name="pickupCity"
            value={formData.pickupCity}
            onChange={handleChange}
            placeholder="City"
            required
          />

          <Textarea
            label="Pickup Instructions (Optional)"
            name="pickupInstructions"
            value={formData.pickupInstructions}
            onChange={handleChange}
            placeholder="e.g., Use the back entrance. Ring bell twice."
            rows={2}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image size={20} className="text-primary-600" />
          Photos (Optional)
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop images here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG up to 10MB each
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="submit" loading={isLoading} size="lg">
          Create Donation
        </Button>
      </div>
    </form>
  );
};
