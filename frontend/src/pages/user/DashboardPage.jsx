import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  HomeIcon, 
  BellIcon, 
  ChatBubbleBottomCenterTextIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import PropertyCard from '@components/property/PropertyCard';
import { 
  useGetShortlistQuery, 
  useGetMyEnquiriesQuery, 
  useGetAlertsQuery 
} from '../../store/api/userApi';
import { 
  useGetPropertiesQuery, 
  useGetFeaturedPropertiesQuery 
} from '../../store/api/propertyApi';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser) || { name: 'User' };
  
  // User Data
  const { data: shortlistRaw } = useGetShortlistQuery();
  const { data: enquiriesRaw } = useGetMyEnquiriesQuery();
  const { data: alertsRaw } = useGetAlertsQuery();

  // Property Data (Real Database)
  const { data: featuredRaw, isLoading: loadingFeatured } = useGetFeaturedPropertiesQuery(4);
  const { data: propertiesRaw, isLoading: loadingProperties } = useGetPropertiesQuery({ limit: 4 });

  const shortlist = shortlistRaw?.data || [];
  const enquiries = enquiriesRaw?.data || [];
  const alerts = alertsRaw?.data || [];
  
  const featuredProperties = featuredRaw?.data || [];
  const recentProperties = propertiesRaw?.data?.properties || propertiesRaw?.data || [];

  const STATS = [
    { 
      id: 1, 
      label: 'Saved Properties', 
      value: shortlist.length, 
      icon: HeartIcon, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50',
      path: '/dashboard/shortlist'
    },
    { 
      id: 2, 
      label: 'My Enquiries', 
      value: enquiries.length, 
      icon: ChatBubbleBottomCenterTextIcon, 
      color: 'text-violet-500', 
      bg: 'bg-violet-50',
      path: '/dashboard/enquiries'
    },
    { 
      id: 3, 
      label: 'Active Alerts', 
      value: alerts.length, 
      icon: BellIcon, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      path: '/dashboard/alerts'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* ─── Top Section: Stats & Side Panels ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-8 min-w-0">
          {/* Main Header */}
          <motion.div variants={itemAnim}>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] mb-2 tracking-tight">
              Hello, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400 font-medium text-sm opacity-80">Your personalized property insights and updates.</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <motion.div 
                key={stat.id}
                variants={itemAnim}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[28px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7C5CFF]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Link to={stat.path} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#7C5CFF] hover:text-white transition-all">
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-2xl font-display font-semibold text-[#111111] mb-1 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-[9px] font-semibold uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Side Panel: Active Alerts & Quick Actions */}
        <div className="xl:col-span-4">
          <motion.div variants={itemAnim} className="bg-[#111111] rounded-[40px] p-6 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between group h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C5CFF]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-display font-semibold tracking-tight text-white">Active Alerts</h2>
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-semibold uppercase tracking-[0.15em] text-white/90">{alerts.length} New</span>
              </div>
              <div className="space-y-4">
                {alerts.slice(0, 2).map((alert) => (
                  <div key={alert._id} className="p-4 bg-white/5 border border-white/5 rounded-[20px] hover:bg-white/10 transition-all cursor-pointer group/item">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#7C5CFF] rounded-xl flex items-center justify-center text-lg shadow-lg">🔔</div>
                      <div>
                        <h4 className="text-[13px] font-semibold font-display tracking-tight text-white">{alert.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium opacity-70 truncate max-w-[140px]">{alert.filters?.city || 'All Cities'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-6 opacity-40">
                    <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                    <p className="text-[9px] font-semibold uppercase tracking-widest">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
            <Link to="/dashboard/alerts" className="mt-6 block w-full bg-[#7C5CFF] text-white font-semibold py-3.5 rounded-[18px] text-[11px] uppercase tracking-[0.2em] text-center hover:bg-white hover:text-[#111111] transition-all relative z-10 active:scale-95 shadow-lg shadow-[#7C5CFF]/10">
              Manage Alerts
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── My Shortlist (Dynamic Section) ─────────────────────────── */}
      {shortlist.length > 0 && (
        <motion.div variants={itemAnim} className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-display font-semibold text-[#111111] tracking-tight">My Shortlist</h2>
              <p className="text-gray-400 text-[11px] font-medium mt-1 opacity-70">Premium properties you've bookmarked</p>
            </div>
            <Link to="/dashboard/shortlist" className="text-[#7C5CFF] text-[10px] font-semibold uppercase tracking-[0.15em] hover:translate-x-1 transition-transform flex items-center gap-2">
              View All <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shortlist.slice(0, 4).map((item, index) => item.property && (
              <PropertyCard key={`shortlist-${item.property._id}`} property={item.property} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Featured Properties ──────────────────── */}
      <motion.div variants={itemAnim} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-semibold text-[#111111] tracking-tight">Featured Properties</h2>
            <p className="text-gray-400 text-[11px] font-medium mt-1 opacity-70">Handpicked premium listings for you</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl bg-white border border-gray-100 hover:bg-[#7C5CFF] hover:text-white transition-all shadow-sm">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-white border border-gray-100 hover:bg-[#7C5CFF] hover:text-white transition-all shadow-sm">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingFeatured ? (
            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-[28px]" />)
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((property, index) => (
              <PropertyCard key={`featured-${property._id}`} property={property} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-[28px] border border-dashed border-gray-200">
               <p className="text-gray-400 text-sm font-medium">No featured properties available yet.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Suggested For You ─────────────────── */}
      <motion.div variants={itemAnim} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-semibold text-[#111111] tracking-tight">Suggested For You</h2>
            <p className="text-gray-400 text-[11px] font-medium mt-1 opacity-70">Based on the latest marketplace activity</p>
          </div>
          <Link to="/properties" className="text-[#7C5CFF] text-[10px] font-semibold uppercase tracking-[0.15em] hover:translate-x-1 transition-transform flex items-center gap-2">
            View All <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingProperties ? (
            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-[28px]" />)
          ) : recentProperties.length > 0 ? (
            recentProperties.map((property, index) => (
              <PropertyCard key={`suggested-${property._id}`} property={property} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-[28px] border border-dashed border-gray-200">
               <p className="text-gray-400 text-sm font-medium">Explore properties to get personalized suggestions.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
