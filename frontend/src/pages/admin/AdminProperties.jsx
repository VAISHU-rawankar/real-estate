import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PencilIcon, TrashIcon, StarIcon, EyeIcon, 
  PlusIcon, MagnifyingGlassIcon, FunnelIcon,
  ChevronDownIcon, EllipsisVerticalIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useGetAdminPropertiesQuery, useDeletePropertyMutation, useToggleFeaturedMutation } from '@store/api/propertyApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';
import useDebounce from '@hooks/useDebounce';

function formatPrice(price) {
  if (!price) return '—';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

const STATUS_CONFIG = {
  active: { label: 'Published', bg: 'bg-[#F0EEFF]', text: 'text-[#7C5CFF]' },
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-500' },
  sold: { label: 'Sold', bg: 'bg-[#FFF0F3]', text: 'text-[#FF4D6D]' },
  rented: { label: 'Rented', bg: 'bg-[#F0EEFF]', text: 'text-[#7C5CFF]' },
  featured: { label: 'Featured', bg: 'bg-[#F0EEFF]', text: 'text-[#7C5CFF]' },
  archived: { label: 'Archived', bg: 'bg-red-50', text: 'text-red-400' },
};

export default function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data, isLoading, refetch } = useGetAdminPropertiesQuery({ 
    keyword: debouncedSearch 
  });
  
  const [deleteProperty] = useDeletePropertyMutation();
  const [toggleFeatured] = useToggleFeaturedMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const properties = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this property?')) return;
    try {
      await deleteProperty(id).unwrap();
      dispatch(showToast({ type: 'success', message: 'Property archived successfully' }));
    } catch {
      dispatch(showToast({ type: 'error', message: 'Failed to archive property' }));
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeatured(id).unwrap();
      dispatch(showToast({ type: 'success', message: 'Featured status updated' }));
    } catch {
      dispatch(showToast({ type: 'error', message: 'Failed to update featured status' }));
    }
  };

  return (
    <>
      <Helmet><title>Properties — RealEstate Pro</title></Helmet>
      
      <div className="space-y-8">
        {/* Header Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties by title, location or ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] outline-none transition-all text-[14px] font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm text-[14px] font-bold text-[#111111] hover:bg-gray-50 transition-colors">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              Filters
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
            <Link 
              to="/admin/properties/create" 
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] text-white text-[14px] font-bold rounded-2xl shadow-lg shadow-[#7C5CFF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Property
            </Link>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-[24px] border border-gray-50 shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="w-10 h-10 border-4 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Property Information</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Views</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.map((p) => {
                    const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                              <img 
                                src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                                className="w-full h-full object-cover" 
                                alt="" 
                              />
                              {p.isFeatured && (
                                <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                  <StarIcon className="w-2.5 h-2.5 text-[#7C5CFF] fill-[#7C5CFF]" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[14px] font-bold text-[#111111] line-clamp-1 group-hover:text-[#7C5CFF] transition-colors">{p.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">ID: #{p.id || p._id.slice(-6)}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-[11px] font-bold text-[#7C5CFF] uppercase">{p.propertyType}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[13px] font-medium text-gray-500">{p?.location?.city || '—'}</td>
                        <td className="px-8 py-5 text-[14px] font-bold text-[#111111]">{formatPrice(p.price)}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-[13px] font-bold text-[#111111]">
                            <EyeIcon className="w-4 h-4 text-gray-400" />
                            {p.viewCount || 0}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold inline-block ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleFeatured(p._id)}
                              className={`p-2 rounded-xl transition-all ${p.isFeatured ? 'bg-[#F0EEFF] text-[#7C5CFF]' : 'bg-gray-50 text-gray-400 hover:text-[#7C5CFF] hover:bg-[#F0EEFF]'}`}
                              title="Featured Toggle"
                            >
                              <StarIcon className={`w-5 h-5 ${p.isFeatured ? 'fill-[#7C5CFF]' : ''}`} />
                            </button>
                            <Link 
                              to={`/admin/properties/${p._id}/edit`}
                              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#7C5CFF] hover:bg-[#F0EEFF] transition-all"
                              title="Edit"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#FF4D6D] hover:bg-[#FFF0F3] transition-all"
                              title="Archive"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#111111] transition-all">
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {properties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
                    <BuildingOfficeIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111111]">No properties found</h3>
                  <p className="text-gray-400 text-[14px] mt-2 mb-8">Start by adding your first property listing.</p>
                  <Link 
                    to="/admin/properties/create" 
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] text-white text-[14px] font-bold rounded-2xl shadow-lg shadow-[#7C5CFF]/20"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
