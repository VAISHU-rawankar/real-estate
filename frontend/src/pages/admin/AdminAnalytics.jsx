import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  useGetLeadAnalyticsQuery, 
  useGetDashboardStatsQuery 
} from '@store/api/adminApi';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  FunnelIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#7C5CFF', '#EF4444', '#A78BFA', '#FCA5A5', '#4C1D95', '#B91C1C'];

function AnalyticCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <h2 className="text-[18px] font-bold text-[#111111]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminAnalytics() {
  const { data: leadData, isLoading: leadLoading } = useGetLeadAnalyticsQuery({});
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  
  const leadAnalytics = leadData?.data || {};
  const stats = statsData?.data || {};

  if (leadLoading || statsLoading) return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Helmet><title>Advanced Analytics — Admin | RealEstate</title></Helmet>
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111]">Market Analytics</h1>
            <p className="text-[14px] text-gray-400 font-medium mt-1">Detailed performance metrics and lead distribution.</p>
          </div>
          <button className="bg-[#111111] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-md active:scale-95">
            Download Report
          </button>
        </div>

        {/* Top Row: Conversion & Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <AnalyticCard title="Lead Conversion Pipeline" icon={FunnelIcon}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={leadAnalytics.byStatus || []} 
                    dataKey="count" 
                    nameKey="_id" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {(leadAnalytics.byStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </AnalyticCard> */}

          {/* <AnalyticCard title="Acquisition Channels" icon={GlobeAltIcon}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadAnalytics.bySource || []} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="_id" type="category" tick={{ fontSize: 11, fontWeight: 600, fill: '#9CA3AF' }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#7C5CFF" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnalyticCard> */}

          <AnalyticCard title="Listing Performance" icon={ChartBarIcon}>
            <div className="space-y-6">
              {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Avg. Leads / Property</span>
                <span className="text-lg font-bold text-[#111111]">
                  {(stats.leads?.total / (stats.properties?.total || 1)).toFixed(1)}
                </span>
              </div> */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Active Listings</span>
                <span className="text-lg font-bold text-emerald-600">{stats.properties?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Property Views</span>
                <span className="text-lg font-bold text-[#111111]">{(stats.properties?.totalViews || 0).toLocaleString()}</span>
              </div>
            </div>
          </AnalyticCard>
        </div>

        {/* Bottom Row: Trends */}
        <div className="grid grid-cols-1 gap-8">
          {/* <AnalyticCard title="Lead Acquisition Trend" icon={ArrowTrendingUpIcon}>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadAnalytics.dailyTrend || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="_id" tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="#7C5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 4, fill: '#fff', stroke: '#7C5CFF', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnalyticCard> */}
        </div>
      </div>
    </>
  );
}
