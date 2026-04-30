import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ClipboardDocumentListIcon, 
  BellIcon,
  ChevronRightIcon,
  MapPinIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';

const STATS = [
  { id: 1, label: 'Saved Properties', value: 12, icon: HeartIcon, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 2, label: 'My Enquiries', value: 5, icon: ClipboardDocumentListIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, label: 'Active Alerts', value: 3, icon: BellIcon, color: 'text-[#7C5CFF]', bg: 'bg-[#7C5CFF]/10' },
];

const RECENTLY_VIEWED = [
  { id: 1, title: 'Luxury 3BHK Apartment', location: 'Koramangala, Bengaluru', price: '₹1.25 Cr', type: 'FOR SALE', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400', beds: 3, baths: 3, sqft: 1800 },
  { id: 2, title: 'Modern Villa with Pool', location: 'Whitefield, Bengaluru', price: '₹45,000 /mo', type: 'FOR RENT', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400', beds: 4, baths: 4, sqft: 3200 },
  { id: 3, title: 'Premium 2BHK Apartment', location: 'HSR Layout, Bengaluru', price: '₹3.40 Cr', type: 'FOR SALE', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400', beds: 2, baths: 2, sqft: 1200 },
  { id: 4, title: 'Urban Studio Flat', location: 'Electronic City, Bengaluru', price: '₹32,000 /mo', type: 'FOR RENT', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400', beds: 1, baths: 1, sqft: 650 },
];

const ENQUIRIES = [
  { id: 1, title: 'Luxury 3BHK Apartment', location: 'Koramangala, Bengaluru', status: 'New', statusColor: 'bg-[#7C5CFF]', date: '20 Apr 2025', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=100' },
  { id: 2, title: 'Modern Villa with Pool', location: 'Whitefield, Bengaluru', status: 'Viewed', statusColor: 'bg-blue-500', date: '18 Apr 2025', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=100' },
  { id: 3, title: 'Premium 2BHK Apartment', location: 'HSR Layout, Bengaluru', status: 'Responded', statusColor: 'bg-green-500', date: '15 Apr 2025', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=100' },
];

const ALERTS = [
  { id: 1, type: '3 BHK in Sarjapur Road', budget: '₹60L - 1.2 Cr', tag: 'Buy', count: 12, icon: '🏢' },
  { id: 2, type: '2 BHK in Whitefield', budget: '₹20K - 40K', tag: 'Rent', count: 8, icon: '🏠' },
];

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser) || { name: 'Harshada Patil' };

  return (
    <>
      <Helmet><title>Dashboard — RealEstate</title></Helmet>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Main Dashboard */}
        <div className="flex-1 space-y-12">
          {/* Main Header */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-display font-bold text-[#111111] mb-2"
            >
              Welcome back, {user.name.split(' ')[0]}! 👋
            </motion.h1>
            <p className="text-gray-400 font-medium">Find your next perfect home faster</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat, idx) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <button className="text-[#7C5CFF] text-[12px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View all</button>
                </div>
                <p className="text-3xl font-display font-bold text-[#111111] mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recently Viewed */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-bold text-[#111111] uppercase tracking-tight">Recently Viewed</h2>
              <div className="flex items-center gap-3">
                <button className="text-[#7C5CFF] text-[12px] font-bold uppercase tracking-widest mr-4">View All</button>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-all">
                    <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-all">
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {RECENTLY_VIEWED.map((property) => (
                <div key={property.id} className="min-w-[300px] bg-white rounded-[24px] p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden mb-4">
                    <img src={property.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    <div className="absolute top-3 left-3 bg-[#7C5CFF] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {property.type}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[#7C5CFF] transition-all">
                      <HeartIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-[#111111]">{property.price}</p>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" /> {property.location}
                    </p>
                    <div className="flex gap-3 pt-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>{property.beds} BHK</span>
                      <span>•</span>
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested For You */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-bold text-[#111111] uppercase tracking-tight">Suggested For You</h2>
              <button className="text-[#7C5CFF] text-[12px] font-bold uppercase tracking-widest">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RECENTLY_VIEWED.slice(0, 4).map((property) => (
                <div key={`sug-${property.id}`} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex h-48">
                  <div className="w-48 h-full overflow-hidden">
                    <img src={property.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[#7C5CFF] text-[10px] font-bold uppercase tracking-widest mb-1 block">{property.type}</span>
                      <h3 className="text-lg font-bold text-[#111111] mb-1 leading-tight">{property.title}</h3>
                      <p className="text-sm text-gray-400 font-medium truncate max-w-[200px]">{property.location}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-display font-bold text-[#111111]">{property.price}</p>
                      <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#7C5CFF] hover:text-white transition-all">
                        <HeartIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Side Panels */}
        <div className="w-full lg:w-[400px] space-y-10">
          {/* My Enquiries Panel */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold text-[#111111] uppercase tracking-tight">My Enquiries</h2>
              <button className="text-[#7C5CFF] text-[12px] font-bold uppercase tracking-widest">View All</button>
            </div>

            <div className="space-y-6 mb-8">
              {ENQUIRIES.map((enq) => (
                <div key={enq.id} className="flex gap-4 group cursor-pointer">
                  <img src={enq.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[14px] font-bold text-[#111111] truncate">{enq.title}</h3>
                      <span className={`${enq.statusColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest`}>{enq.status}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium truncate mb-1">{enq.location}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Enquired on {enq.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full border border-[#7C5CFF] text-[#7C5CFF] font-bold py-4 rounded-2xl text-[12px] uppercase tracking-widest hover:bg-[#7C5CFF] hover:text-white transition-all active:scale-95">
              Go to My Enquiries
            </button>
          </div>

          {/* Active Alerts Panel */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold text-[#111111] uppercase tracking-tight">Active Alerts</h2>
              <button className="text-[#7C5CFF] text-[12px] font-bold uppercase tracking-widest">View All</button>
            </div>

            <div className="space-y-4 mb-8">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="p-5 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">{alert.icon}</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#111111]">{alert.type}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{alert.budget} • {alert.tag}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-black transition-all"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-black transition-all"><EllipsisVerticalIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-[#7C5CFF] uppercase tracking-widest">{alert.count} new properties</p>
                </div>
              ))}
            </div>

            <button className="w-full border border-[#7C5CFF] text-[#7C5CFF] font-bold py-4 rounded-2xl text-[12px] uppercase tracking-widest hover:bg-[#7C5CFF] hover:text-white transition-all active:scale-95">
              Manage Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-[#7C5CFF]/5 border border-[#7C5CFF]/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 bg-[#7C5CFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C5CFF]/30">
            <SpeakerWaveIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#111111] mb-1">Stay Updated!</h3>
            <p className="text-gray-500 font-medium text-sm">Turn on notifications to get instant alerts on new properties that match your preferences.</p>
          </div>
        </div>
        <button className="bg-[#7C5CFF] hover:bg-[#6D4EE0] text-white px-10 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest transition-all shadow-xl active:scale-95 relative z-10 whitespace-nowrap">
          Enable Notifications
        </button>
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </motion.div>
    </>
  );
}
