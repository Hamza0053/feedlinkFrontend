import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
