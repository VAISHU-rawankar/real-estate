import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetLeadAnalyticsQuery } from '@store/api/adminApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#D4A853', '#0F172A', '#10b981', '#6366f1', '#ef4444', '#f59e0b'];

export default function AdminAnalytics() {
  const { data } = useGetLeadAnalyticsQuery({});
  const analytics = data?.data || {};

  return (
    <>
      <Helmet><title>Analytics — Admin | RealEstate</title></Helmet>
      <div className="space-y-8">
        <h1 className="text-2xl font-display font-bold text-navy-900">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-navy-900 mb-5">Leads by Status</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={analytics.byStatus || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, count }) => `${_id}: ${count}`}>
                  {(analytics.byStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-6">
            <h2 className="font-display font-semibold text-navy-900 mb-5">Leads by Source</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.bySource || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#D4A853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
