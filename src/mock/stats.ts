import {
  ImpactStats,
  MonthlyStats,
  TopDonor,
  TopNgo,
  RecentActivity,
} from '../types/stats';

export const mockImpactStats: ImpactStats = {
  totalUsers: 124,
  activeDonors: 89,
  activeNgos: 34,
  totalDonations: 1247,
  completedDonations: 1178,
  totalServings: 45820,
  totalMealsProvided: 45820,
  totalKgRedistributed: 28560,
  totalCO2Saved: 57120,
  completionRate: 94.5,
  averageMatchTime: '12 min',
};

export const mockMonthlyStats: MonthlyStats[] = [
  { month: 'Apr', donations: 145, mealsProvided: 5280, kgRedistributed: 3300 },
  { month: 'May', donations: 178, mealsProvided: 6450, kgRedistributed: 4030 },
  { month: 'Jun', donations: 203, mealsProvided: 7180, kgRedistributed: 4490 },
  { month: 'Jul', donations: 189, mealsProvided: 6820, kgRedistributed: 4260 },
  { month: 'Aug', donations: 221, mealsProvided: 8150, kgRedistributed: 5090 },
  { month: 'Sep', donations: 156, mealsProvided: 5640, kgRedistributed: 3520 },
];

export const mockTopDonors: TopDonor[] = [
  {
    id: 'donor-2',
    name: 'Sarah Johnson',
    organization: 'FreshMart Supermarket',
    totalDonations: 342,
    totalKg: 12450,
  },
  {
    id: 'donor-1',
    name: 'Marco Rossi',
    organization: 'Bella Italia Restaurant',
    totalDonations: 189,
    totalKg: 4280,
  },
  {
    id: 'donor-3',
    name: 'Emily Chen',
    organization: 'Golden Crust Bakery',
    totalDonations: 156,
    totalKg: 3120,
  },
];

export const mockTopNgos: TopNgo[] = [
  {
    id: 'ngo-1',
    name: 'Hope Food Bank',
    totalClaimed: 412,
    totalPeopleServed: 15200,
  },
  {
    id: 'ngo-2',
    name: 'Community Shelter Network',
    totalClaimed: 287,
    totalPeopleServed: 10850,
  },
  {
    id: 'ngo-3',
    name: 'Kids First Foundation',
    totalClaimed: 198,
    totalPeopleServed: 7400,
  },
];

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'completion',
    description: 'Bread assortment delivered to Kids First Foundation',
    timestamp: '2026-08-31T10:00:00Z',
    user: 'Golden Crust Bakery',
  },
  {
    id: 'act-2',
    type: 'claim',
    description: 'Community Shelter claimed vegetables from FreshMart',
    timestamp: '2026-08-31T15:00:00Z',
    user: 'Community Shelter Network',
  },
  {
    id: 'act-3',
    type: 'donation',
    description: 'New pasta donation submitted by Bella Italia',
    timestamp: '2026-09-01T14:00:00Z',
    user: 'Bella Italia Restaurant',
  },
  {
    id: 'act-4',
    type: 'pickup',
    description: 'Organic milk picked up by Hope Food Bank',
    timestamp: '2026-09-01T07:30:00Z',
    user: 'Hope Food Bank',
  },
  {
    id: 'act-5',
    type: 'donation',
    description: 'Fresh produce box listed by Bella Italia',
    timestamp: '2026-09-01T12:00:00Z',
    user: 'Bella Italia Restaurant',
  },
  {
    id: 'act-6',
    type: 'completion',
    description: 'Croissants delivered to Community Shelter',
    timestamp: '2026-08-30T10:00:00Z',
    user: 'Golden Crust Bakery',
  },
];
