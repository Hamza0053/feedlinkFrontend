import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Building2, Phone, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor' as UserRole,
    organization: '',
    phone: '',
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['donor', 'ngo'].includes(roleParam)) {
      setFormData((prev) => ({ ...prev, role: roleParam as UserRole }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organization: formData.organization,
        phone: formData.phone,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      toast.error(serverMsg || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              FeedLink <span className="text-primary-600">AI</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-6">Join the fight against food waste</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={<User size={18} />}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                icon={<Lock size={18} />}
                required
              />
              <Input
                label="Confirm"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                icon={<Lock size={18} />}
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'donor' }))}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'donor'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">🍽️</div>
                  <p className="text-sm font-semibold text-gray-900">Donor</p>
                  <p className="text-xs text-gray-500">Donate surplus food</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'ngo' }))}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'ngo'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">🤝</div>
                  <p className="text-sm font-semibold text-gray-900">NGO / Receiver</p>
                  <p className="text-xs text-gray-500">Receive food donations</p>
                </button>
              </div>
            </div>

            <Input
              label="Organization (Optional)"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Your company or organization"
              icon={<Building2 size={18} />}
            />

            <Input
              label="Phone (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555-0000"
              icon={<Phone size={18} />}
            />

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
