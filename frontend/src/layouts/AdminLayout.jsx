import React, { useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout as authLogout } from '@store/slices/authSlice';
import {
  HomeIcon, BuildingOfficeIcon, UsersIcon, ChartBarIcon,
  Bars3Icon, BellIcon, ArrowRightOnRectangleIcon,
  ChevronDownIcon, CalendarIcon
} from '@heroicons/react/24/outline';
import { useLogoutMutation } from '@store/api/authApi';
import ToastContainer from '@components/common/ToastContainer';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: HomeIcon, exact: true },
  { label: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
  { label: 'Leads', href: '/admin/leads', icon: UsersIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.warn('Backend logout failed, forcing local logout');
    } finally {
      dispatch(authLogout());
      navigate('/auth/login');
    }
  };

  const isActive = (href, exact) => exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#111111] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[100px] flex items-center px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4A853] flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RealEstate <span className="text-[#D4A853]">Pro</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
                    active
                      ? 'bg-gradient-to-r from-[#D4A853] to-[#B8891F] text-white shadow-lg shadow-[#D4A853]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
                  <span className="text-[15px] font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile */}
          <div className="p-6">
            <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#D4A853] flex items-center justify-center font-bold text-white text-lg">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate uppercase tracking-tight">{user?.name || 'ADMIN USER'}</p>
                <p className="text-white/40 text-[11px] truncate font-medium">{user?.email || 'pharshada962@gmail.com'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-red-400 transition-colors w-full group font-bold text-[13px] uppercase tracking-wider"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
        {/* Top Header */}
        <header className="h-[100px] flex items-center justify-between px-10 bg-transparent">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111]">Dashboard</h1>
            <p className="text-[#666666] text-sm mt-1">Welcome back, Admin! Here's what's happening with your real estate platform.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            
            <button className="h-11 px-5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-3 text-sm font-semibold text-[#111111] hover:bg-gray-50 transition-colors">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span>May 15, 2024 - Jun 15, 2024</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#111111] absolute left-4">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 px-10 pb-10 overflow-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
