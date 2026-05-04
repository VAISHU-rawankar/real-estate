import React, { useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout as authLogout } from '@store/slices/authSlice';
import {
  HomeIcon, BuildingOfficeIcon, UsersIcon, ChartBarIcon,
  Bars3Icon, BellIcon, ArrowRightOnRectangleIcon,
  ChevronDownIcon, CalendarIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useLogoutMutation } from '@store/api/authApi';
import ToastContainer from '@components/common/ToastContainer';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: HomeIcon, exact: true },
  { label: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
  { label: 'Enquiries', href: '/admin/leads', icon: UsersIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { label: 'CMS', href: '/admin/cms', icon: DocumentTextIcon },
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
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0A0B10] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[100px] flex items-center px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C5CFF] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/20">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[20px] font-bold tracking-tight text-white">RealEstate <span className="text-[#7C5CFF]">Pro</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 group relative ${
                    active
                      ? 'bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] text-white shadow-lg shadow-[#7C5CFF]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                  <span className={`text-[15px] font-semibold ${active ? 'text-white' : 'text-inherit'}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile */}
          <div className="p-6 space-y-4">
            <div className="bg-[#1A1C26] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#7C5CFF] flex items-center justify-center font-bold text-white text-[15px] shadow-sm shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate leading-tight">{user?.name || 'ADMIN USER'}</p>
                <p className="text-gray-500 text-[11px] truncate mt-1">{user?.email || 'adminuser@gmail.com'}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-6 py-2 text-rose-500 hover:text-rose-400 transition-colors w-full group font-bold text-[13px] tracking-wide uppercase"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* Top Header */}
        <header className="h-[80px] md:h-[100px] flex items-center justify-between px-4 md:px-6 bg-transparent shrink-0 relative">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#111111] p-2 -ml-2">
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-[20px] md:text-[32px] font-bold text-[#111111] truncate">Dashboard</h1>
            <p className="text-[#9CA3AF] text-[11px] md:text-[14px] font-medium mt-0.5 md:mt-1 hidden sm:block">Welcome back, Admin!</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <button className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <BellIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            
            <button className="h-9 md:h-11 px-3 md:px-5 rounded-xl bg-white border border-gray-100 shadow-sm hidden md:flex items-center gap-4 text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className="hidden lg:inline">May 15, 2024 - Jun 15, 2024</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 pb-10 overflow-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
