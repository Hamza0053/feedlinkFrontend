import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HandHeart, Building2 } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      role: 'donor' as const,
      icon: <HandHeart className="w-8 h-8" />,
      title: 'Food Donor',
      description:
        'I have surplus food to donate. Restaurants, supermarkets, bakeries, and individuals can list food for redistribution.',
      features: [
        'List surplus food easily',
        'AI-powered urgency analysis',
        'Track donation status',
        'Impact statistics',
      ],
    },
    {
      role: 'ngo' as const,
      icon: <Building2 className="w-8 h-8" />,
      title: 'NGO / Receiver',
      description:
        'I represent an organization that can receive food donations and distribute them to people in need.',
      features: [
        'Browse available donations',
        'Claim matching donations',
        'Schedule pickups',
        'Track deliveries',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Select Your Role</h1>
          <p className="text-gray-600 mt-2">
            Choose how you want to participate in the FeedLink AI platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(({ role, icon, title, description, features }) => (
            <Card
              key={role}
              hoverable
              className="text-center cursor-pointer"
              onClick={() => navigate(`/signup?role=${role}`)}
            >
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                {icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <ul className="text-left space-y-2 mb-4">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/signup?role=${role}`);
                }}
              >
                Sign Up as {title}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
