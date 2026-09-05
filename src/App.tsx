import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { RoleSelection } from './pages/RoleSelection';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { NgoDashboard } from './pages/ngo/NgoDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateDonation } from './pages/donations/CreateDonation';
import { DonationDetails } from './pages/donations/DonationDetails';
import { DonationsPage } from './pages/donations/DonationsPage';
import { Notifications } from './pages/Notifications';
import { Impact } from './pages/Impact';
import { NotFound } from './pages/NotFound';
import { RequirementsPage } from './pages/requirements/RequirementsPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin-only route wrapper — rejects non-admin users
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard router based on role
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'donor':
      return <DonorDashboard />;
    case 'ngo':
      return <NgoDashboard />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <DonorDashboard />;
  }
};

// Inner app that has access to auth context
const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <NotificationProvider userId={user?.id}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/impact" element={<Impact />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardRouter />} />
        </Route>

        <Route
          path="/donations"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DonationsPage />} />
          <Route path="new" element={<CreateDonation />} />
          <Route path=":id" element={<DonationDetails />} />
        </Route>

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Notifications />} />
        </Route>

        {/* NGO Requirements */}
        <Route
          path="/requirements"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RequirementsPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NotificationProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#16a34a',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
