import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Leaf, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
      let displayError = 'Invalid email or password.';

      if (err?.response?.status === 404) {
        displayError = serverMessage || 'No account found with this email. Please sign up or check your email.';
      } else if (err?.response?.status === 401) {
        displayError = serverMessage || 'Incorrect email or password.';
      } else if (!err?.response) {
        displayError = 'Unable to connect to server. Please check your internet connection or try again later.';
      } else if (serverMessage) {
        displayError = serverMessage;
      }

      setErrorMessage(displayError);
      toast.error(displayError);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">Sign in to your account to continue</p>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Login Failed</p>
                <p className="text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter your password"
              icon={<Lock size={18} />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo accounts hint */}
        <div className="mt-4 bg-white/80 rounded-xl border border-gray-200 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Demo workflow:</p>
          <p>1. Sign up as a <strong>Donor</strong> (e.g., restaurant)</p>
          <p>2. Create a food donation</p>
          <p>3. Sign up as an <strong>NGO</strong> (e.g., food bank)</p>
          <p>4. Claim the donation and track pickup</p>
          <p className="mt-2 font-medium text-gray-700">Admin login:</p>
          <p>Set <code className="bg-gray-100 px-1 rounded">ADMIN_EMAIL</code> &amp; <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> in backend/.env</p>
          <p className="mt-1 text-gray-400">Requires backend + PostgreSQL running</p>
        </div>
      </div>
    </div>
  );
};
