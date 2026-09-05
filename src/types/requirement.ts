// NGO Requirement types

export type RequirementStatus = 'active' | 'fulfilled' | 'expired' | 'cancelled';

export type RequirementUrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type FoodCategory =
  | 'prepared_meals'
  | 'fresh_produce'
  | 'packaged_goods'
  | 'bakery'
  | 'dairy'
  | 'beverages'
  | 'other';

export interface NgoRequirement {
  id: string;
  ngoId: string;
  title: string;
  description: string | null;
  foodCategory: FoodCategory;
  quantityNeeded: number;
  unit: string;
  remainingQuantity: number;
  neededFrom: string;
  neededUntil: string;
  pickupCity: string;
  urgencyLevel: RequirementUrgencyLevel;
  status: RequirementStatus;
  fulfilledAt: string | null;
  ngoName?: string;
  ngoOrganization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequirementData {
  title: string;
  description?: string;
  foodCategory: FoodCategory;
  quantityNeeded: number | string;
  unit: string;
  neededFrom: string;
  neededUntil: string;
  pickupCity: string;
  urgencyLevel?: RequirementUrgencyLevel;
}

export interface UpdateRequirementData {
  title?: string;
  description?: string;
  foodCategory?: FoodCategory;
  quantityNeeded?: number | string;
  unit?: string;
  neededFrom?: string;
  neededUntil?: string;
  pickupCity?: string;
  urgencyLevel?: RequirementUrgencyLevel;
}
