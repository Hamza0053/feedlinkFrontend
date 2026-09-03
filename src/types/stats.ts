// Impact Statistics types
export interface ImpactStats {
  totalUsers: number;
  activeDonors: number;
  activeNgos: number;
  totalDonations: number;
  completedDonations: number;
  totalServings: number;
  totalMealsProvided: number;
  totalKgRedistributed: number;
  totalCO2Saved: number;
  completionRate: number;
  averageMatchTime: string;
}

export interface MonthlyStats {
  month: string;
  donations: number;
  mealsProvided: number;
  kgRedistributed: number;
}

export interface TopDonor {
  id: string;
  name: string;
  organization?: string;
  totalDonations: number;
  totalKg: number;
}

export interface TopNgo {
  id: string;
  name: string;
  totalClaimed: number;
  totalPeopleServed: number;
}

export interface RecentActivity {
  id: string;
  type: 'donation' | 'claim' | 'pickup' | 'completion';
  description: string;
  timestamp: string;
  user: string;
}

export interface AiMatchingStats {
  totalMatches: number;
  avgMatchScore: number;
  successfulMatches: number;
  aiExplanationRate: number;
}
