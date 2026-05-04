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
        whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.08)" }}
        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group transition-all duration-500 h-full"
      >
        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
          <item.icon className="w-20 h-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm border border-white/50`}>
            <item.icon className={`w-7 h-7 ${item.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">{item.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-semibold text-[#111111]">{item.value}</p>
              {item.trend && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${item.trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
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
      title: 'Properties', 
      value: properties.total || 0, 
      icon: BuildingOfficeIcon, 
      iconBg: 'bg-amber-50', 
      iconColor: 'text-amber-500',
      trend: 12,
      to: '/admin/properties'
    },
    { 
      title: 'Views', 
      value: (properties.totalViews || 0).toLocaleString(), 
      icon: EyeIcon, 
      iconBg: 'bg-emerald-50', 
      iconColor: 'text-emerald-500',
      trend: 24,
      to: '/admin/analytics'
    },
    { 
      title: 'Enquiries', 
      value: leads.total || 0, 
      icon: UsersIcon, 
      iconBg: 'bg-rose-50', 
      iconColor: 'text-rose-500',
      trend: leads.trend || 0,
      to: '/admin/leads'
    },
    { 
      title: 'Analytics', 
      value: '84%', 
      icon: ChartBarIcon, 
      iconBg: 'bg-indigo-50', 
      iconColor: 'text-indigo-500',
      trend: 15,
      to: '/admin/analytics'
    },
  ];

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
        className="space-y-10 pb-16"
      >
        {/* Welcome Header */}
        <motion.div variants={itemAnim} className="relative overflow-hidden bg-[#1A1C21] rounded-[32px] p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#7C5CFF]/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#7C5CFF]/5 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg uppercase tracking-[0.2em] border border-white/10">Administrator</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-[#7C5CFF]" />
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-white mb-1 tracking-tight">System Overview</h1>
              <p className="text-gray-400 text-[13px] max-w-lg leading-relaxed font-medium opacity-70">
                Welcome back. Monitor your real estate operations and portfolio performance from this central hub.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 relative group active:scale-95">
                <BellIcon className="w-6 h-6 text-gray-300 group-hover:text-white" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#7C5CFF] rounded-full border-[2.5px] border-[#1A1C21]" />
              </button>
              <Link to="/admin/properties/create" className="flex items-center gap-2 bg-[#7C5CFF] text-white px-6 py-3.5 rounded-xl font-semibold text-[12px] uppercase tracking-widest transition-all shadow-xl shadow-[#7C5CFF]/20 hover:bg-[#6D4AEE] active:scale-95">
                <PlusIcon className="w-4 h-4" />
                New Listing
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
          <motion.div variants={itemAnim} className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-8 flex items-center justify-between border-b border-gray-50">
              <div>
                <h2 className="text-xl font-display font-semibold text-[#111111] tracking-tight">Recent Inventory</h2>
                <p className="text-gray-400 text-xs font-medium mt-1 opacity-80">Latest property listings across your portfolio</p>
              </div>
              <Link to="/admin/properties" className="group flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-[#111111] text-[10px] font-semibold rounded-xl border border-gray-100 hover:bg-[#111111] hover:text-white transition-all duration-300 uppercase tracking-widest">
                View All
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Asset</th>
                    <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Type</th>
                    <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
                    <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentProperties.filter(Boolean).map((p, idx) => (
                    <tr key={p._id || idx} className="hover:bg-gray-50/50 transition-all duration-300 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden shadow-sm shrink-0 border border-gray-100">
                            <img 
                              src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              alt="" 
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#111111] truncate max-w-[180px] leading-tight">{p.title}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-1 opacity-70 flex items-center gap-1">
                              <BuildingOfficeIcon className="w-3 h-3 text-[#7C5CFF]" />
                              {p?.location?.city || 'Global'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 bg-indigo-50/50 text-indigo-600 text-[9px] font-semibold rounded-lg uppercase tracking-wider border border-indigo-100/30">{p.propertyType}</span>
                      </td>
                      <td className="px-8 py-5 text-[13px] font-semibold text-[#111111] font-display">{formatPrice(p.price)}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' || p.status === 'featured' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className={`text-[11px] font-semibold ${p.status === 'active' || p.status === 'featured' ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {p.status === 'active' || p.status === 'featured' ? 'Live' : p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/admin/properties/${p._id}/edit`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-[#7C5CFF] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                          <ArrowUpRightIcon className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions (Operations Card) */}
          <motion.div variants={itemAnim} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col h-full">
            <h2 className="text-xl font-display font-semibold text-[#111111] mb-8 tracking-tight">Operations</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Add Property', icon: BuildingOfficeIcon, color: 'text-amber-500', bg: 'bg-amber-50/50', to: '/admin/properties/create' },
                { label: 'Enquiries', icon: UsersIcon, color: 'text-[#7C5CFF]', bg: 'bg-[#7C5CFF]/10', to: '/admin/leads' },
                { label: 'Analytics', icon: ChartBarIcon, color: 'text-rose-500', bg: 'bg-rose-50/50', to: '/admin/analytics' },
              ].map((action, idx) => (
                <Link 
                  key={action.label} 
                  to={action.to} 
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-50 hover:border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/5 transition-all duration-300 group ${idx === 2 ? 'col-span-1' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-all duration-500`}>
                    <action.icon className={`w-7 h-7 ${action.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#111111] uppercase tracking-widest text-center">{action.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-auto">
              <Link to="/admin/leads" className="flex items-center justify-between w-full p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300 group border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-50">
                    <UsersIcon className="w-6 h-6 text-gray-400 group-hover:text-[#7C5CFF] transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-[#111111]">Manage Leads</p>
                    <p className="text-[10px] font-medium text-gray-400">Response Tracking</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#111111] transition-all">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Enquiries (Full Width) */}
        <motion.div variants={itemAnim} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-8 flex items-center justify-between border-b border-gray-50">
            <div>
              <h2 className="text-xl font-display font-semibold text-[#111111] tracking-tight">Recent Enquiries</h2>
              <p className="text-gray-400 text-xs font-medium mt-1 opacity-80">Latest customer interest and property queries</p>
            </div>
            <Link to="/admin/leads" className="group flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-[#111111] text-[10px] font-semibold rounded-xl border border-gray-100 hover:bg-[#111111] hover:text-white transition-all duration-300 uppercase tracking-widest">
              View All Enquiries
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Property Interested</th>
                  <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Source</th>
                  <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Received Date</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.recent?.filter(Boolean).map((lead, idx) => (
                  <tr key={lead._id || idx} className="hover:bg-gray-50/50 transition-all duration-300 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                          {lead.name?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#111111] truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[12px] font-medium text-[#111111] max-w-[200px] truncate">
                          {lead.property?.title || 'General Enquiry'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[9px] font-semibold rounded border border-gray-100 uppercase tracking-tight">
                        {lead.source?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                        lead.status === 'new' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-medium text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link to={`/admin/leads/${lead._id}`} className="text-[#7C5CFF] hover:text-[#6D4AEE] transition-colors">
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!leads.recent || leads.recent.length === 0) && (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-gray-400 text-sm italic">
                      No recent enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

