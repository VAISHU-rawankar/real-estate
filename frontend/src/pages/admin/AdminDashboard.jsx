import React, { useEffect } from 'react';
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
  ChartPieIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { useGetDashboardStatsQuery, useGetLeadChartDataQuery } from '@store/api/adminApi';

function StatCard({ item }) {
  const chartData = item.data?.map((val, i) => ({ value: val })) || [];
  
  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}>
          <item.icon className={`w-6 h-6 ${item.iconColor}`} />
        </div>
        <div>
          <p className="text-gray-400 text-[13px] font-medium">{item.title}</p>
          <p className="text-[28px] font-bold text-[#111111] leading-none mt-1">{item.value}</p>
          <p className={`text-[12px] font-bold mt-2 ${item.trend.startsWith('+') ? 'text-[#10B981]' : 'text-gray-400'}`}>
            {item.trend} <span className="text-gray-400 font-medium">this month</span>
          </p>
        </div>
      </div>
      <div className="w-24 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${item.title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.chartColor} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={item.chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={item.chartColor} 
              strokeWidth={2} 
              fill={`url(#grad-${item.title.replace(/\s+/g, '')})`}
              dot={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: chartDataRaw, isLoading: chartLoading } = useGetLeadChartDataQuery(30);

  // Debug logs to identify data structure issues
  useEffect(() => {
    if (statsData) console.log('Admin Stats Data:', statsData);
    if (chartDataRaw) console.log('Admin Chart Data:', chartDataRaw);
    if (statsError) console.error('Admin Stats Error:', statsError);
  }, [statsData, chartDataRaw, statsError]);

  const stats = statsData?.data || {};
  const properties = stats.properties || {};
  const leads = stats.leads || {};
  const users = stats.users || {};

  const leadChartData = chartDataRaw?.data?.map(d => ({
    date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: d.count
  })) || [
    { date: 'May 15', count: 5 },
    { date: 'May 18', count: 8 },
    { date: 'May 20', count: 12 },
    { date: 'May 22', count: 7 },
    { date: 'May 25', count: 15 },
    { date: 'May 28', count: 10 },
    { date: 'May 30', count: 18 },
  ];

  const STATS_CARDS = [
    { 
      title: 'Total Properties', 
      value: properties.total || 0, 
      trend: `+${properties.recent?.length || 0}`, 
      icon: BuildingOfficeIcon, 
      iconBg: 'bg-[#FEF3C7]', 
      iconColor: 'text-[#D4A853]',
      chartColor: '#D4A853',
      data: [40, 30, 50, 45, 60, 55, 70]
    },
    { 
      title: 'Total Leads', 
      value: leads.total || 0, 
      trend: `+${leads.todayCount || 0}`, 
      icon: UsersIcon, 
      iconBg: 'bg-[#E0E7FF]', 
      iconColor: 'text-[#6366F1]',
      chartColor: '#6366F1',
      data: leadChartData.map(d => d.count)
    },
    { 
      title: 'Total Views', 
      value: (properties.totalViews || 0).toLocaleString(), 
      trend: '+0', 
      icon: EyeIcon, 
      iconBg: 'bg-[#D1FAE5]', 
      iconColor: 'text-[#10B981]',
      chartColor: '#10B981',
      data: [50, 40, 60, 55, 70, 65, 80]
    },
    { 
      title: 'Active Users', 
      value: users.total || 0, 
      trend: '+0', 
      icon: UserGroupIcon, 
      iconBg: 'bg-[#FEE2E2]', 
      iconColor: 'text-[#EF4444]',
      chartColor: '#EF4444',
      data: [30, 45, 35, 60, 50, 75, 60]
    },
  ];

  const leadsPieData = [
    { name: 'New Leads', value: leads.byStatus?.new || 0, color: '#D4A853', percent: '40%' },
    { name: 'Contacted', value: leads.byStatus?.contacted || 0, color: '#6366F1', percent: '30%' },
    { name: 'Converted', value: leads.byStatus?.converted || 0, color: '#10B981', percent: '18%' },
    { name: 'Lost', value: leads.byStatus?.lost || 0, color: '#EF4444', percent: '12%' },
  ];

  const totalLeads = leadsPieData.reduce((acc, item) => acc + item.value, 0);

  if (statsLoading || chartLoading) return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (statsError) return (
    <div className="p-10 text-center bg-red-50 rounded-3xl border border-red-100">
      <p className="text-red-600 font-bold">Failed to load dashboard data. Please try again.</p>
      <div className="mt-4 text-left max-w-md mx-auto">
        <p className="text-red-400 text-xs font-mono bg-white p-3 rounded-lg border border-red-200 overflow-auto max-h-[150px]">
          {JSON.stringify(statsError, null, 2)}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Admin Dashboard — RealEstate Pro</title></Helmet>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_CARDS.map((item, idx) => (
            <StatCard key={idx} item={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Properties */}
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#111111]">Recent Properties</h2>
              <Link to="/admin/properties" className="px-4 py-2 bg-gray-50 text-[#111111] text-xs font-bold rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-gray-50">
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Property</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.recent?.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} className="w-12 h-12 rounded-lg object-cover" alt={p.title} />
                          <span className="text-[14px] font-bold text-[#111111] line-clamp-1 max-w-[200px]">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-[14px] text-gray-500">{p.location?.city || 'Unknown'}</td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 uppercase">
                          {p.propertyType}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-[14px] font-bold text-[#111111]">
                        ₹{p.price >= 10000000 ? (p.price / 10000000).toFixed(2) + ' Cr' : (p.price / 100000).toFixed(1) + ' L'}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${p.status === 'active' || p.status === 'featured' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'} uppercase`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#111111]">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Property Views */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[18px] font-bold text-[#111111]">Top Property Views</h2>
              <button className="px-4 py-2 bg-gray-50 text-[#111111] text-xs font-bold rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {properties.recent && properties.recent.length > 0 ? (
                properties.recent.slice(0, 5)
                  .sort((a,b) => (b.viewCount || 0) - (a.viewCount || 0))
                  .map((p, idx, arr) => {
                    const views = p.viewCount || 0;
                    const maxViews = Math.max(...arr.map(x => x.viewCount || 0), 1);
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} className="w-14 h-14 rounded-lg object-cover" alt={p.title} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <p className="text-[13px] font-bold text-[#111111] truncate max-w-[150px]">{p.title}</p>
                            <p className="text-[13px] font-bold text-[#111111]">{views.toLocaleString()}</p>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#D4A853] rounded-full" 
                              style={{ width: `${(views / maxViews) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm font-medium">No properties to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Overview (Leads) */}
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[18px] font-bold text-[#111111]">Leads Growth</h2>
              <select className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold text-[#111111] outline-none">
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadChartData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A853" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#D4A853" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Leads"
                    stroke="#D4A853" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#viewsGrad)" 
                    dot={{ r: 4, fill: '#fff', stroke: '#D4A853', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#D4A853', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-8">
            {/* Leads Overview */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-[18px] font-bold text-[#111111] mb-8">Leads Overview</h2>
              <div className="flex items-center">
                <div className="w-1/2 h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsPieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leadsPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[20px] font-bold text-[#111111]">{totalLeads}</p>
                    <p className="text-[10px] font-medium text-gray-400">Total Leads</p>
                  </div>
                </div>
                <div className="w-1/2 pl-4 space-y-3">
                  {leadsPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[12px] font-medium text-gray-500">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#111111]">
                        {item.value} ({totalLeads > 0 ? ((item.value / totalLeads) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-[18px] font-bold text-[#111111] mb-8">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/admin/properties/create" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group text-center">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Add Property</span>
                </Link>
                <Link to="/admin/leads" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group text-center">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <UsersIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">View Leads</span>
                </Link>
                <Link to="/admin/analytics" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group text-center">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <ChartPieIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">View Analytics</span>
                </Link>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group text-center">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <DocumentArrowDownIcon className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Export Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
