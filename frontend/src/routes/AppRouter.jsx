import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoadingPage from '@components/common/LoadingPage';
import ErrorBoundary from '@components/common/ErrorBoundary';
import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import UserDashboardLayout from '@/layouts/UserDashboardLayout';
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoutes from './AdminRoutes';
import ScrollToTop from '@components/common/ScrollToTop';

// Lazy-loaded pages
const HomePage = lazy(() => import('@pages/public/HomePage'));
const PropertyListingPage = lazy(() => import('@pages/public/PropertyListingPage'));
const PropertyDetailPage = lazy(() => import('@pages/public/PropertyDetailPage'));
const AboutPage = lazy(() => import('@pages/public/AboutPage'));
const ContactPage = lazy(() => import('@pages/public/ContactPage'));
const BlogPage = lazy(() => import('@pages/public/BlogPage'));
const BlogDetailPage = lazy(() => import('@pages/public/BlogDetailPage'));
const NotFoundPage = lazy(() => import('@pages/public/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('@pages/public/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('@pages/public/TermsAndConditionsPage'));
const DisclaimerPage = lazy(() => import('@pages/public/DisclaimerPage'));
const SitemapPage = lazy(() => import('@pages/public/SitemapPage'));
const ComparePage = lazy(() => import('@pages/public/ComparePage'));

const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const OTPVerifyPage = lazy(() => import('@pages/auth/OTPVerifyPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));

const UserDashboardPage = lazy(() => import('@pages/user/DashboardPage'));
const ShortlistPage = lazy(() => import('@pages/user/ShortlistPage'));
const ProfilePage = lazy(() => import('@pages/user/ProfilePage'));
const MyEnquiriesPage = lazy(() => import('@pages/user/MyEnquiriesPage'));
const SearchAlertsPage = lazy(() => import('@pages/user/SearchAlertsPage'));

const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard'));
const AdminProperties = lazy(() => import('@pages/admin/AdminProperties'));
const AdminPropertyCreate = lazy(() => import('@pages/admin/AdminPropertyCreate'));
const AdminPropertyEdit = lazy(() => import('@pages/admin/AdminPropertyEdit'));
const AdminLeads = lazy(() => import('@pages/admin/AdminLeads'));
const AdminLeadDetail = lazy(() => import('@pages/admin/AdminLeadDetail'));
const AdminAnalytics = lazy(() => import('@pages/admin/AdminAnalytics'));
const AdminCms = lazy(() => import('@pages/admin/AdminCms'));

const SuspenseFallback = () => <LoadingPage />;

const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          { index: true, element: <Suspense fallback={<SuspenseFallback />}><HomePage /></Suspense> },
          { path: 'properties', element: <Suspense fallback={<SuspenseFallback />}><PropertyListingPage /></Suspense> },
          { path: 'properties/:slug', element: <Suspense fallback={<SuspenseFallback />}><PropertyDetailPage /></Suspense> },
          { path: 'about', element: <Suspense fallback={<SuspenseFallback />}><AboutPage /></Suspense> },
          { path: 'contact', element: <Suspense fallback={<SuspenseFallback />}><ContactPage /></Suspense> },
          { path: 'blog', element: <Suspense fallback={<SuspenseFallback />}><BlogPage /></Suspense> },
          { path: 'blog/:slug', element: <Suspense fallback={<SuspenseFallback />}><BlogDetailPage /></Suspense> },
          { path: 'privacy', element: <Suspense fallback={<SuspenseFallback />}><PrivacyPolicyPage /></Suspense> },
          { path: 'terms', element: <Suspense fallback={<SuspenseFallback />}><TermsAndConditionsPage /></Suspense> },
          { path: 'disclaimer', element: <Suspense fallback={<SuspenseFallback />}><DisclaimerPage /></Suspense> },
          { path: 'sitemap', element: <Suspense fallback={<SuspenseFallback />}><SitemapPage /></Suspense> },
          { path: 'compare', element: <Suspense fallback={<SuspenseFallback />}><ComparePage /></Suspense> },
        ],
      },
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Suspense fallback={<SuspenseFallback />}><LoginPage /></Suspense> },
          { path: 'register', element: <Suspense fallback={<SuspenseFallback />}><RegisterPage /></Suspense> },
          { path: 'verify-otp', element: <Suspense fallback={<SuspenseFallback />}><OTPVerifyPage /></Suspense> },
          { path: 'forgot-password', element: <Suspense fallback={<SuspenseFallback />}><ForgotPasswordPage /></Suspense> },
        ],
      },
      {
        path: '/dashboard',
        element: <ProtectedRoutes />,
        children: [
          {
            element: <UserDashboardLayout />,
            children: [
              { index: true, element: <Suspense fallback={<SuspenseFallback />}><UserDashboardPage /></Suspense> },
              { path: 'shortlist', element: <Suspense fallback={<SuspenseFallback />}><ShortlistPage /></Suspense> },
              { path: 'enquiries', element: <Suspense fallback={<SuspenseFallback />}><MyEnquiriesPage /></Suspense> },
              { path: 'alerts', element: <Suspense fallback={<SuspenseFallback />}><SearchAlertsPage /></Suspense> },
              { path: 'profile', element: <Suspense fallback={<SuspenseFallback />}><ProfilePage /></Suspense> },
            ]
          }
        ],
      },
      {
        path: '/admin',
        element: <AdminRoutes />,
        children: [
          { index: true, element: <Suspense fallback={<SuspenseFallback />}><AdminDashboard /></Suspense> },
          { path: 'properties', element: <Suspense fallback={<SuspenseFallback />}><AdminProperties /></Suspense> },
          { path: 'properties/create', element: <Suspense fallback={<SuspenseFallback />}><AdminPropertyCreate /></Suspense> },
          { path: 'properties/:id/edit', element: <Suspense fallback={<SuspenseFallback />}><AdminPropertyEdit /></Suspense> },
          { path: 'leads', element: <Suspense fallback={<SuspenseFallback />}><AdminLeads /></Suspense> },
          { path: 'leads/:id', element: <Suspense fallback={<SuspenseFallback />}><AdminLeadDetail /></Suspense> },
          { path: 'analytics', element: <Suspense fallback={<SuspenseFallback />}><AdminAnalytics /></Suspense> },
          { path: 'cms', element: <Suspense fallback={<SuspenseFallback />}><AdminCms /></Suspense> },
        ],
      },
      { path: '*', element: <Suspense fallback={<SuspenseFallback />}><NotFoundPage /></Suspense> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
