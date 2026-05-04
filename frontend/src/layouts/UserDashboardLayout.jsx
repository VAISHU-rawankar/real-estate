import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HomeIcon, 
  HeartIcon, 
  ClipboardDocumentListIcon, 
  ArrowsRightLeftIcon, 
  BellIcon, 
  UserIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { selectCurrentUser, logout as authLogout } from '@store/slices/authSlice';
import { useLogoutMutation } from '@store/api/authApi';
import ToastContainer from '@components/common/ToastContainer';
import { useSyncShortlist } from '@hooks/useSyncShortlist';

const SIDEBAR_MENU = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Saved Properties', icon: HeartIcon, path: '/dashboard/shortlist' },
  { name: 'My Enquiries', icon: ClipboardDocumentListIcon, path: '/dashboard/enquiries' },
  { name: 'Compare', icon: ArrowsRightLeftIcon, path: '/dashboard/compare' },
  { name: 'Alerts', icon: BellIcon, path: '/dashboard/alerts' },
  { name: 'Profile', icon: UserIcon, path: '/dashboard/profile' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/dashboard/settings' },
];

export default function UserDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const user = useSelector(selectCurrentUser);
  useSyncShortlist();

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

  const userInitial = user?.name?.[0] || 'U';
  const userRole = user?.role === 'admin' ? 'Administrator' : 'Premium Member';

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans overflow-x-hidden">
      {/* ─── Mobile Sidebar Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-gray-100 flex flex-col 
        transform transition-transform duration-500 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-semibold text-[#111111] tracking-tight">
            Real<span className="text-[#7C5CFF]">Estate</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-400">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {SIDEBAR_MENU.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/25' 
                    : 'text-gray-400 hover:bg-[#F8F9FB] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                  <span className={`text-[14px] font-semibold tracking-tight ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/20'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-3 w-full px-6 py-4 text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-300 group font-semibold text-[12px] tracking-widest uppercase rounded-[20px] border border-rose-50 hover:border-rose-500 active:scale-95"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-50 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-gray-50 rounded-xl text-[#111111] hover:bg-gray-100 transition-colors">
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-xl relative group hidden sm:block">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7C5CFF] transition-colors" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="w-full bg-[#F8F9FB] border border-transparent rounded-[18px] pl-12 pr-4 py-3.5 text-[14px] font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-[#7C5CFF]/5 focus:border-[#7C5CFF]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8 ml-4">
            <div className="relative cursor-pointer hover:bg-gray-50 p-2.5 rounded-2xl transition-all hidden xs:flex group">
              <BellIcon className="w-6 h-6 text-gray-500 group-hover:text-[#7C5CFF] transition-colors" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-gray-50 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-[14px] font-semibold text-[#111111] leading-none mb-1 font-display tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-[#7C5CFF] font-semibold uppercase tracking-[0.2em]">{userRole}</p>
              </div>
              <div className="relative">
                {user?.image ? (
                  <img src={user.image} className="w-11 h-11 rounded-[16px] object-cover ring-4 ring-transparent group-hover:ring-[#7C5CFF]/10 transition-all duration-500" alt="" />
                ) : (
                  <div className="w-11 h-11 rounded-[16px] bg-[#111111] flex items-center justify-center text-white font-semibold text-lg ring-4 ring-transparent group-hover:ring-[#7C5CFF]/10 transition-all duration-500">
                    {userInitial}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-6 flex-1 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
