import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useGetAdminLeadsQuery } from '@store/api/adminApi';
import useDebounce from '@hooks/useDebounce';

const STATUS_COLORS = {
  new: 'bg-amber-50 text-amber-600 border-amber-100',
  contacted: 'bg-blue-50 text-blue-600 border-blue-100',
  interested: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'site-visit-scheduled': 'bg-purple-50 text-purple-600 border-purple-100',
  closed: 'bg-green-50 text-green-600 border-green-100',
  lost: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function AdminLeads() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetAdminLeadsQuery({ 
    search: debouncedSearch 
  });
  const leads = data?.data || [];

  return (
    <>
      <Helmet><title>Leads Management — Admin | RealEstate</title></Helmet>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111]">Property Enquiries</h1>
            <p className="text-[14px] text-gray-400 font-medium mt-1">Manage and track all customer inquiries submitted across your properties.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#111111] px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
              <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, email or phone..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[14px] outline-none focus:ring-2 focus:ring-[#D4A853] shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-[14px] font-bold text-[#111111] hover:bg-gray-50 shadow-sm transition-all">
              <FunnelIcon className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Loading your leads...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Lead Info</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Property</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Received Date</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[12px] font-bold text-gray-500">
                            {lead.name ? lead.name[0] : '?'}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#111111]">{lead.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[12px] text-gray-400 font-medium">
                                <PhoneIcon className="w-3 h-3" /> {lead.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-bold text-[#111111] max-w-[200px] truncate">
                            {lead.property?.title || 'General Inquiry'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-50 text-[#111111] text-[11px] font-bold rounded-lg border border-gray-100 uppercase tracking-tight">
                          {lead.source?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                          {lead.status?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[13px] font-bold text-[#111111]">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/admin/leads/${lead._id}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-[#111111] text-[11px] font-bold rounded-xl border border-gray-100 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all group-hover:shadow-sm">
                          Manage <ChevronRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-gray-300 font-medium italic">No leads found yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
