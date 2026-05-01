import React from 'react';
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
  QuestionMarkCircleIcon,
  ChevronRightIcon,
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
  { name: 'Alerts', icon: BellIcon, path: '/dashboard/alerts', badge: 3 },
  { name: 'Profile', icon: UserIcon, path: '/dashboard/profile' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/dashboard/settings' },
];

export default function UserDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const user = useSelector(selectCurrentUser) || { name: 'Harshada Patil', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' };
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

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex font-sans">
      {/* ─── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8">
          <Link to="/" className="text-2xl font-display font-bold text-[#111111] tracking-tight">
            Real<span className="text-[#7C5CFF]">Estate</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {SIDEBAR_MENU.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-[#7C5CFF]/10 text-[#7C5CFF]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#7C5CFF]' : 'group-hover:text-[#111111]'}`} />
                  <span className={`text-[14px] font-semibold ${isActive ? 'text-[#7C5CFF]' : ''}`}>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#7C5CFF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-[#7C5CFF]/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="p-6">
          <div className="bg-[#111111] rounded-3xl p-6 relative overflow-hidden group cursor-pointer mb-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C5CFF]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-white font-bold text-[14px] mb-1 relative z-10">Upgrade Your Experience</p>
            <p className="text-gray-400 text-[11px] mb-4 relative z-10 font-medium">Get early access to premium properties and exclusive deals.</p>
            <button className="w-full bg-[#7C5CFF] hover:bg-[#6D4EE0] text-white py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-lg active:scale-95 relative z-10">
              Go Premium
            </button>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-3 w-full px-6 py-3 text-rose-500 hover:text-rose-400 hover:bg-rose-50 transition-colors group font-bold text-[13px] tracking-wide uppercase rounded-xl border border-rose-100"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-2xl relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7C5CFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search properties, locations..." 
              className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-4 py-3 text-[14px] font-medium outline-none focus:bg-white focus:border-[#7C5CFF]/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 pl-10">
            <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all">
              <BellIcon className="w-6 h-6 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6 cursor-pointer group">
              <img src={user.image} className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-[#7C5CFF]/20 transition-all" alt="" />
              <div className="hidden sm:block">
                <p className="text-[14px] font-bold text-[#111111]">{user.name}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Premium Member</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10 flex-1">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
