import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: 'donor-1',
    email: 'restaurant@example.com',
    name: 'Marco Rossi',
    role: 'donor',
    organization: 'Bella Italia Restaurant',
    phone: '+1 555-0101',
    address: '123 Main Street, Downtown',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'donor-2',
    email: 'supermarket@example.com',
    name: 'Sarah Johnson',
    role: 'donor',
    organization: 'FreshMart Supermarket',
    phone: '+1 555-0102',
    address: '456 Oak Avenue, Midtown',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'donor-3',
    email: 'bakery@example.com',
    name: 'Emily Chen',
    role: 'donor',
    organization: 'Golden Crust Bakery',
    phone: '+1 555-0103',
    address: '789 Elm Street, Uptown',
    createdAt: '2025-03-10T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'ngo-1',
    email: 'hope@example.com',
    name: 'David Williams',
    role: 'ngo',
    organization: 'Hope Food Bank',
    phone: '+1 555-0201',
    address: '100 Charity Lane, East Side',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'ngo-2',
    email: 'shelter@example.com',
    name: 'Maria Garcia',
    role: 'ngo',
    organization: 'Community Shelter Network',
    phone: '+1 555-0202',
    address: '200 Haven Road, West End',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: 'ngo-3',
    email: 'kids@example.com',
    name: 'James Thompson',
    role: 'ngo',
    organization: 'Kids First Foundation',
    phone: '+1 555-0203',
    address: '300 Sunshine Blvd, North District',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-04-05T10:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@feedlink.ai',
    name: 'Alex Admin',
    role: 'admin',
    phone: '+1 555-0001',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
];

export const getUserById = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id);

export const getUsersByRole = (role: string): User[] =>
  mockUsers.filter((u) => u.role === role);
