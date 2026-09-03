import React, { useState } from 'react';
import { Donation } from '../../types/donation';
import { donationService } from '../../services/donationService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeleteDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
  onSuccess: (deletedId: string) => void;
}

export const DeleteDonationModal: React.FC<DeleteDonationModalProps> = ({
  isOpen,
  onClose,
  donation,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!donation) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await donationService.delete(donation.id);
      toast.success('Donation deleted successfully');
      onSuccess(donation.id);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to delete donation';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4 pt-2">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">Delete Donation?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete <span className="font-semibold text-gray-800">"{donation.title}"</span>?
            This will remove the donation and any associated match data. This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
