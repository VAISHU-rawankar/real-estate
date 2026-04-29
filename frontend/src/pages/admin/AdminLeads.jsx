import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useGetAdminLeadsQuery } from '@store/api/adminApi';

const STATUS_COLORS = {
  new: 'badge-gold', contacted: 'badge-navy', interested: 'badge-green',
  'site-visit-scheduled': 'bg-purple-100 text-purple-700', closed: 'badge-green', lost: 'badge-red',
};

export default function AdminLeads() {
  const { data, isLoading } = useGetAdminLeadsQuery({});
  const leads = data?.data || [];

  return (
    <>
      <Helmet><title>Leads — Admin | RealEstate</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-semibold text-[#1A1A1A] uppercase tracking-tight">Leads</h1>
            <p className="text-[#666666] text-[10px] font-bold uppercase tracking-widest mt-2">{data?.meta?.total || 0} Total Leads</p>
          </div>
          <a href="/api/v1/admin/leads/export" className="bg-white border border-[#EAE6DF] hover:border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors">Export CSV</a>
        </div>

        <div className="bg-white border border-[#EAE6DF] rounded-[24px] overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading leads...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE6DF]">
                  <tr>
                    {['Name', 'Phone', 'Property', 'Source', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#666666] uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-navy-900">{lead.name}</td>
                      <td className="px-5 py-4 text-slate-500">{lead.phone}</td>
                      <td className="px-5 py-4 text-slate-500 max-w-[160px] truncate">{lead.property?.title || '—'}</td>
                      <td className="px-5 py-4 text-slate-500 capitalize">{lead.source?.replace('-', ' ')}</td>
                      <td className="px-5 py-4">
                        <span className={`badge capitalize ${STATUS_COLORS[lead.status] || ''}`}>{lead.status?.replace('-', ' ')}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/admin/leads/${lead._id}`} className="text-gold-600 hover:text-gold-700 font-medium text-xs">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && (
                <div className="py-16 text-center text-slate-300">No leads yet</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
