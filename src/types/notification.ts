// Notification types
export type NotificationType =
  | 'donation_created'
  | 'donation_matched'
  | 'donation_claimed'
  | 'pickup_scheduled'
  | 'pickup_reminder'
  | 'donation_completed'
  | 'donation_expired'
  | 'new_available'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
