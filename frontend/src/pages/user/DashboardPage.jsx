import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { HeartIcon, BellIcon, ClipboardDocumentListIcon, UserIcon } from '@heroicons/react/24/outline';

const QUICK_LINKS = [
  { label: 'Shortlisted Properties', icon: HeartIcon, href: '/dashboard/shortlist', desc: 'Properties you saved' },
  { label: 'My Enquiries', icon: ClipboardDocumentListIcon, href: '/dashboard/enquiries', desc: 'Track your enquiries' },
  { label: 'Search Alerts', icon: BellIcon, href: '/dashboard/alerts', desc: 'Get notified of new listings' },
  { label: 'My Profile', icon: UserIcon, href: '/dashboard/profile', desc: 'Manage your account' },
];

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  return (
    <>
      <Helmet><title>My Dashboard — RealEstate</title></Helmet>
      <div className="page-container py-10">
        <h1 className="section-title mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-slate-400 mb-8">Manage your property journey from one place.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="card p-6 hover-lift group">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
                <link.icon className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-display font-semibold text-navy-900 mb-1">{link.label}</h3>
              <p className="text-slate-400 text-sm">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
