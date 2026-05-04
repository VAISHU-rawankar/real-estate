import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useGetMyEnquiriesQuery } from '@store/api/userApi';
import {
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';

const STATUS_STYLES = {
  new:                    { label: 'New',        bg: 'bg-blue-50',     text: 'text-blue-600',   dot: 'bg-blue-500' },
  contacted:              { label: 'Contacted',  bg: 'bg-yellow-50',   text: 'text-yellow-700', dot: 'bg-yellow-500' },
  interested:             { label: 'Interested', bg: 'bg-purple-50',   text: 'text-purple-600', dot: 'bg-purple-500' },
  'site-visit-scheduled': { label: 'Visit',      bg: 'bg-indigo-50',   text: 'text-indigo-600', dot: 'bg-indigo-500' },
  closed:                 { label: 'Closed',     bg: 'bg-green-50',    text: 'text-green-600',  dot: 'bg-green-500' },
  lost:                   { label: 'Lost',       bg: 'bg-red-50',      text: 'text-red-600',    dot: 'bg-red-500' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function EnquiryCard({ enquiry }) {
  const [expanded, setExpanded] = useState(false);
  const property = enquiry.property;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        {/* Property Image */}
        <Link to={property ? `/properties/${property.slug}` : '#'} className="shrink-0">
          <img
            src={property?.images?.[0]?.url || 'https://via.placeholder.com/120x90?text=No+Image'}
            alt={property?.title || 'Property'}
            className="w-full sm:w-28 h-20 object-cover rounded-xl bg-gray-100"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                to={property ? `/properties/${property.slug}` : '#'}
                className="font-bold text-[#111111] hover:text-[#7C5CFF] transition-colors text-[15px] line-clamp-1"
              >
                {property?.title || 'Property (Deleted)'}
              </Link>
              {property?.location?.city && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {property?.location?.city}, {property?.location?.state}
                </p>
              )}
            </div>
            <StatusBadge status={enquiry.status} />
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            {property?.price && (
              <span className="flex items-center gap-1">
                <CurrencyRupeeIcon className="w-4 h-4" />
                ₹{(property.price / 100000).toFixed(1)}L
              </span>
            )}
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {enquiry.message && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-[#7C5CFF] font-semibold hover:underline"
            >
              {expanded ? 'Hide message ▲' : 'View your message ▼'}
            </button>
          )}

          {expanded && enquiry.message && (
            <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
              {enquiry.message}
            </p>
          )}
        </div>
      </div>

      {/* Agent Response */}
      {enquiry.agentNotes && (
        <div className="border-t border-gray-50 bg-[#7C5CFF]/5 px-5 py-3 flex gap-2">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#7C5CFF] shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600"><span className="font-semibold text-[#7C5CFF]">Agent:</span> {enquiry.agentNotes}</p>
        </div>
      )}
    </div>
  );
}

export default function MyEnquiriesPage() {
  const { data, isLoading, isError, error } = useGetMyEnquiriesQuery();
  const enquiries = data?.data || [];

  return (
    <>
      <Helmet><title>My Enquiries — RealEstate</title></Helmet>

      <div className="max-w-5xl mx-0 px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#7C5CFF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] tracking-tight">My Enquiries</h1>
              <p className="text-[13px] text-gray-400 font-medium opacity-80 mt-1">{enquiries.length} property enquiries submitted</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-28 h-20 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <XCircleIcon className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-gray-500 mb-2">Failed to load enquiries.</p>
            <p className="text-xs text-gray-400 italic">Error: {error?.data?.error?.message || error?.status || 'Unknown error'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-xs font-bold text-[#7C5CFF] hover:underline"
            >
              Reload Page
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && enquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No enquiries yet</h3>
            <p className="text-sm text-gray-400 mb-6">Browse properties and contact an agent to get started.</p>
            <Link
              to="/properties"
              className="px-6 py-2.5 bg-[#111111] text-white rounded-full text-sm font-semibold hover:bg-[#7C5CFF] transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* List */}
        {!isLoading && !isError && enquiries.length > 0 && (
          <div className="space-y-4">
            {enquiries.map(e => <EnquiryCard key={e._id} enquiry={e} />)}
          </div>
        )}
      </div>
    </>
  );
}
