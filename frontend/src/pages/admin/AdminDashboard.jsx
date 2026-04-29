import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BuildingOfficeIcon, UsersIcon, StarIcon, ChartBarIcon, ArrowUpIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useGetDashboardStatsQuery, useGetLeadChartDataQuery, useGetRecentActivityQuery } from '@store/api/adminApi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`card p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            <ArrowUpIcon className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-display font-bold text-navy-900">{value ?? '—'}</p>
      <p className="text-slate-400 text-sm mt-1">{title}</p>
      {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: chartData } = useGetLeadChartDataQuery(30);
  const { data: activityData } = useGetRecentActivityQuery();

  const stats = statsData?.data || {};
  const chartPoints = chartData?.data || [];
  const activities = activityData?.data || [];

  return (
    <>
      <Helmet><title>Admin Dashboard — RealEstate</title></Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-900">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Overview of your platform activity</p>
          </div>
          <Link to="/admin/properties/create" className="btn-primary btn-md">
            + New Property
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Properties" value={stats.properties?.total} subtitle={`${stats.properties?.active || 0} active`} icon={BuildingOfficeIcon} color="bg-blue-50 text-blue-600" trend={12} />
          <StatCard title="Featured" value={stats.properties?.featured} subtitle="Paid listings" icon={StarIcon} color="bg-gold-50 text-gold-600" />
          <StatCard title="Total Leads" value={stats.leads?.total} subtitle={`${stats.leads?.todayCount || 0} today`} icon={UsersIcon} color="bg-emerald-50 text-emerald-600" trend={8} />
          <StatCard title="Properties Sold" value={stats.properties?.sold} subtitle="All time" icon={ChartBarIcon} color="bg-purple-50 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Trend Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-navy-900">Lead Trend (30 days)</h2>
              <Link to="/admin/leads" className="text-gold-600 text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
            {chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartPoints}>
                  <defs>
                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,.1)', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="count" stroke="#D4A853" strokeWidth={2.5} fill="url(#leadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-300 text-sm">No data available</div>
            )}
          </div>

          {/* Lead Status Breakdown */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-navy-900 mb-6">Lead Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.leads?.byStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-slate-600">{status.replace('-', ' ')}</span>
                  <span className="font-semibold text-navy-900 text-sm">{count}</span>
                </div>
              ))}
              {!stats.leads?.byStatus && <p className="text-slate-300 text-sm">Loading...</p>}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-navy-900 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {activities.slice(0, 8).map((activity) => (
              <div key={activity._id} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{activity.admin?.name?.[0] || 'A'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-900">
                    <span className="font-medium">{activity.admin?.name || 'Admin'}</span>
                    {' '}{activity.action}
                    {activity.targetTitle && <span className="font-medium"> "{activity.targetTitle}"</span>}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(activity.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-slate-300 text-sm">No recent activity</p>}
          </div>
        </div>
      </div>
    </>
  );
}
