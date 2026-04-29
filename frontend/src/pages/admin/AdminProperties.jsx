import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useGetAdminPropertiesQuery, useDeletePropertyMutation, useToggleFeaturedMutation } from '@store/api/propertyApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

function formatPrice(price) {
  if (!price) return '—';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

const STATUS_COLORS = {
  active: 'badge-green', draft: 'badge-yellow', sold: 'badge-red',
  rented: 'badge-navy', archived: 'bg-slate-100 text-slate-500', featured: 'badge-gold',
};

export default function AdminProperties() {
  const { data, isLoading, refetch } = useGetAdminPropertiesQuery({});
  const [deleteProperty] = useDeletePropertyMutation();
  const [toggleFeatured] = useToggleFeaturedMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const properties = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this property?')) return;
    try {
      await deleteProperty(id).unwrap();
      dispatch(showToast({ type: 'success', message: 'Property archived' }));
    } catch {
      dispatch(showToast({ type: 'error', message: 'Failed to archive' }));
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeatured(id).unwrap();
      dispatch(showToast({ type: 'success', message: 'Featured status updated' }));
    } catch {
      dispatch(showToast({ type: 'error', message: 'Failed to update' }));
    }
  };

  return (
    <>
      <Helmet><title>Properties — Admin | RealEstate</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-semibold text-[#1A1A1A] uppercase tracking-tight">Properties</h1>
            <p className="text-[#666666] text-[10px] font-bold uppercase tracking-widest mt-2">{data?.meta?.total || 0} Total Listings</p>
          </div>
          <Link to="/admin/properties/create" className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors shadow-sm">+ New Property</Link>
        </div>

        <div className="bg-white border border-[#EAE6DF] rounded-[24px] overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading properties...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE6DF]">
                  <tr>
                    {['Property', 'Price', 'Location', 'Type', 'Status', 'Views', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#666666] uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            {p.images?.[0]?.thumbnailUrl ? (
                              <img src={p.images[0].thumbnailUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gold-gradient" />
                            )}
                          </div>
                          <span className="font-medium text-navy-900 line-clamp-2">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gold-600 whitespace-nowrap">{formatPrice(p.price)}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{p.location?.city}</td>
                      <td className="px-5 py-4 text-slate-500 capitalize">{p.propertyType}</td>
                      <td className="px-5 py-4">
                        <span className={`badge capitalize ${STATUS_COLORS[p.status] || ''}`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{p.viewCount || 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(p._id)}
                            title={p.isFeatured ? 'Remove featured' : 'Mark featured'}
                            className={`p-1.5 rounded-lg transition-colors ${p.isFeatured ? 'text-gold-500 bg-gold-50' : 'text-slate-400 hover:text-gold-500 hover:bg-gold-50'}`}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>
                          <Link to={`/properties/${p.slug}`} target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <Link to={`/admin/properties/${p._id}/edit`} className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {properties.length === 0 && (
                <div className="py-16 text-center text-slate-300">No properties found. Create your first listing.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
