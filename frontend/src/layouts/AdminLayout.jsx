import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import {
  HomeIcon, BuildingOfficeIcon, UsersIcon, ChartBarIcon,
  CogIcon, Bars3Icon, XMarkIcon, BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useLogoutMutation } from '@store/api/authApi';
import ToastContainer from '@components/common/ToastContainer';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: HomeIcon, exact: true },
  { label: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
  { label: 'Leads', href: '/admin/leads', icon: UsersIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const isActive = (href, exact) => exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm">RealEstate</p>
            <p className="text-white/40 text-xs">Admin Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href, item.exact)
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.[0] || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => logout()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm w-full transition-colors">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-navy-900">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-navy-900 transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.[0] || 'A'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
