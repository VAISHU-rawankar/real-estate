import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  EyeIcon, 
  UserGroupIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { useGetDashboardStatsQuery, useGetLeadChartDataQuery } from '@store/api/adminApi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnim = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

function StatCard({ item, index }) {
  return (
    <Link to={item.to || '#'}>
      <motion.div 
        variants={itemAnim}
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group transition-all duration-300 h-full"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
          <item.icon className="w-24 h-24 rotate-12" />
        </div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm border border-white/20`}>
            <item.icon className={`w-7 h-7 ${item.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-[13px] font-bold uppercase tracking-wider mb-1">{item.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-display font-bold text-[#111111]">{item.value}</p>
              {item.trend && (
                <span className={`text-[11px] font-bold ${item.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const formatPrice = (price) => {
  if (!price) return '—';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: chartDataRaw, isLoading: chartLoading } = useGetLeadChartDataQuery(30);

  const stats = statsData?.data || {};
  const properties = stats.properties || {};
  const leads = stats.leads || {};
  const users = stats.users || {};
  const recentProperties = properties.recent || [];

  const leadChartData = chartDataRaw?.data?.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: item.count
  })) || [];

  const STATS_CARDS = [
    { 
      title: 'Total Properties', 
      value: properties.total || 0, 
      icon: BuildingOfficeIcon, 
      iconBg: 'bg-[#FFF9F2]', 
      iconColor: 'text-[#D4A853]',
      trend: 12,
      to: '/admin/properties'
    },
    { 
      title: 'Total Views', 
      value: (properties.totalViews || 0).toLocaleString(), 
      icon: EyeIcon, 
      iconBg: 'bg-[#E6FFFA]', 
      iconColor: 'text-[#00BFA5]',
      trend: 24,
      to: '/admin/analytics'
    },
    { 
      title: 'Active Users', 
      value: users.total || 0, 
      icon: UserGroupIcon, 
      iconBg: 'bg-[#FFF0F3]', 
      iconColor: 'text-[#FF4D6D]',
      trend: -2,
      to: '/admin'
    },
    { 
      title: 'Total Analytics', 
      value: '84%', 
      icon: ChartBarIcon, 
      iconBg: 'bg-[#F0EEFF]', 
      iconColor: 'text-[#7C5CFF]',
      trend: 15,
      to: '/admin/analytics'
    },
  ];

  const leadsPieData = [
    { name: 'New Leads', value: leads.byStatus?.new || 0, color: '#D4A853' },
    { name: 'Contacted', value: leads.byStatus?.contacted || 0, color: '#7C5CFF' },
    { name: 'Interested', value: leads.byStatus?.interested || 0, color: '#10B981' },
    { name: 'Lost', value: leads.byStatus?.lost || 0, color: '#FF4D6D' },
  ];

  const totalPieValue = leadsPieData.reduce((acc, curr) => acc + curr.value, 0);

  if (statsLoading || chartLoading) return (
    <div className="h-[400px] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-[#7C5CFF] border-t-transparent rounded-full" 
      />
    </div>
  );

  return (
    <>
      <Helmet><title>Dashboard — RealEstate Pro</title></Helmet>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-10"
      >
        {/* Welcome Header */}
        <motion.div variants={itemAnim} className="relative overflow-hidden bg-[#1A1A24] rounded-[32px] p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#7C5CFF]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#7C5CFF] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Administrator</span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5" />
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Welcome back, Admin! 👋</h1>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-medium">
                Here's what's happening with your real estate portfolio today. Explore your property statistics and performance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors relative">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1A1A24]" />
              </button>
              <Link to="/admin/properties/create" className="flex items-center gap-2 bg-[#7C5CFF] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-[#7C5CFF]/25">
                <PlusIcon className="w-5 h-5" />
                New Property
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_CARDS.map((item, idx) => (
            <StatCard key={idx} item={item} index={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Properties (2/3) */}
          <motion.div variants={itemAnim} className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="p-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-[#111111]">Recent Properties</h2>
                <p className="text-gray-400 text-xs font-semibold mt-1">Latest listings added to the platform</p>
              </div>
              <Link to="/admin/properties" className="group flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-[#111111] text-xs font-bold rounded-2xl border border-gray-100 hover:bg-[#111111] hover:text-white transition-all duration-300">
                View All
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Property</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentProperties.map((p, idx) => (
                    <tr key={p._id || idx} className="hover:bg-gray-50/50 transition-all duration-300">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-11 rounded-xl overflow-hidden shadow-sm">
                            <img 
                              src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                              className="w-full h-full object-cover" 
                              alt="" 
                            />
                          </div>
                          <p className="text-[14px] font-bold text-[#111111] truncate max-w-[200px] leading-tight">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[13px] font-semibold text-gray-400 italic">
                        <span className="flex items-center gap-1.5 font-sans">
                          📍 {p.location?.city || '—'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-[#F0EEFF] text-[#7C5CFF] text-[10px] font-bold rounded-full uppercase tracking-wider">{p.propertyType}</span>
                      </td>
                      <td className="px-8 py-5 text-[14px] font-bold text-[#111111] font-display">{formatPrice(p.price)}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' || p.status === 'featured' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className={`text-[11px] font-bold ${p.status === 'active' || p.status === 'featured' ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {p.status === 'active' || p.status === 'featured' ? 'Published' : p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Link to={`/admin/properties/${p._id}/edit`} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#111111] hover:bg-gray-100 transition-all">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentProperties.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-8 py-10 text-center text-gray-400 font-medium italic">No properties found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Top Property Views (1/3) */}
          <motion.div variants={itemAnim} className="lg:col-span-1 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-display font-bold text-[#111111]">Popular Listings</h2>
                <p className="text-gray-400 text-xs font-semibold mt-1">Most viewed properties</p>
              </div>
              <div className="p-2.5 bg-[#FFF9F2] rounded-2xl">
                <ChartBarIcon className="w-6 h-6 text-[#D4A853]" />
              </div>
            </div>
            <div className="space-y-6 flex-1">
              {recentProperties.slice(0, 5).sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map((p, idx) => {
                const maxViews = Math.max(...recentProperties.map(x => x.viewCount || 0), 1);
                const percent = ((p.viewCount || 0) / maxViews) * 100;
                return (
                  <div key={p._id || idx} className="group cursor-default">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-12 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[13px] font-bold text-[#111111] truncate pr-2 leading-tight">{p.title}</p>
                          <p className="text-[13px] font-bold text-[#7C5CFF]">{p.viewCount || 0}</p>
                        </div>
                        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#D4A853] to-[#E8B84B] rounded-full" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row (Three Equal Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads Overview (Chart) - Hidden */}
          {/* <motion.div variants={itemAnim} className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-[#111111]">Leads Trend</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold text-[#111111] hover:bg-gray-100 transition-colors">
                30 Days <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadChartData}>
                  <defs>
                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#7C5CFF" 
                    strokeWidth={4} 
                    fill="url(#leadsGrad)" 
                    dot={{ r: 4, fill: '#7C5CFF', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#7C5CFF', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div> */}

          {/* Leads Overview (Pie) - Hidden */}
          {/* <motion.div variants={itemAnim} className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <h2 className="text-xl font-display font-bold text-[#111111] mb-8">Lead conversion</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-52 h-52 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsPieData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {leadsPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-display font-bold text-[#111111]">{leads.total || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Leads</p>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                {leadsPieData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.name}</span>
                    </div>
                    <span className="text-base font-bold text-[#111111] ml-4 font-display">
                      {item.value} <span className="text-[10px] text-gray-400 font-medium">({totalPieValue > 0 ? Math.round((item.value / totalPieValue) * 100) : 0}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div> */}

          {/* Quick Actions */}
          <motion.div variants={itemAnim} className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <h2 className="text-xl font-display font-bold text-[#111111] mb-6">Operations</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Add Property', icon: BuildingOfficeIcon, color: 'text-[#D4A853]', bg: 'bg-[#FFF9F2]', to: '/admin/properties/create' },
                // { label: 'View Leads', icon: UsersIcon, color: 'text-[#7C5CFF]', bg: 'bg-[#F0EEFF]', to: '/admin/leads' },
                { label: 'Analytics', icon: ChartBarIcon, color: 'text-[#00BFA5]', bg: 'bg-[#E6FFFA]', to: '/admin/analytics' },
                { label: 'Reports', icon: DocumentArrowDownIcon, color: 'text-[#FF4D6D]', bg: 'bg-[#FFF0F3]', to: '#' },
              ].map((action, idx) => (
                <Link key={idx} to={action.to} className="flex flex-col items-start p-6 rounded-[24px] border border-gray-50 hover:border-[#7C5CFF]/30 hover:bg-[#F0EEFF]/10 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <span className="text-xs font-bold text-[#111111] group-hover:text-[#7C5CFF] transition-colors">{action.label}</span>
                  <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-[#7C5CFF]/50 transition-all duration-500" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-50">
              <Link to="/admin/settings" className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <BellIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-bold text-[#111111]">Platform Settings</p>
                    <p className="text-[10px] font-semibold text-gray-400">Configurations & API</p>
                  </div>
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-gray-300 group-hover:text-[#111111] transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
