// Donation types
export type DonationStatus =
  | 'pending'
  | 'analyzing'
  | 'matched'
  | 'claimed'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'available';

export type FoodCategory =
  | 'prepared_meals'
  | 'fresh_produce'
  | 'packaged_goods'
  | 'bakery'
  | 'dairy'
  | 'beverages'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  title: string;
  description: string;
  foodCategory: FoodCategory;
  quantity: string;
  unit: string;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
  pickupInstructions?: string;
  images?: string[];
  status: DonationStatus;
  urgencyLevel: UrgencyLevel;
  aiAnalysis?: AiAnalysis;
  aiExplanation?: string | null;
  aiSource?: string | null;
  matchExplanation?: string | null;
  matchScore?: number | null;
  matchedNgoId?: string;
  matchedNgoName?: string;
  claimedAt?: string;
  pickupScheduledAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysis {
  urgencyScore: number; // 1-10
  urgencyScorePercent?: number; // 0-100
  urgencyLevel: UrgencyLevel;
  shelfLifeEstimate: string;
  recommendedDistribution: string;
  recommendedAction?: string;
  explanation?: string;
  storageRecommendations: string[];
  analysisTimestamp: string;
}

export interface CreateDonationData {
  title: string;
  description: string;
  foodCategory: FoodCategory;
  quantity: string;
  unit: string;
  servings?: string;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
  pickupInstructions?: string;
}

export interface DonationMatch {
  id: string;
  donationId: string;
  ngoId: string;
  ngoName: string;
  ngoDistance: string;
  ngoCapacity: string;
  matchScore: number; // 0-100
  matchedAt: string;
}

export interface DonationStatusEvent {
  status: DonationStatus;
  timestamp: string;
  description: string;
  actor?: string;
}
