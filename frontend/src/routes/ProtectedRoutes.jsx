import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@store/slices/authSlice';
import PublicLayout from '@/layouts/PublicLayout';

export default function ProtectedRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}
