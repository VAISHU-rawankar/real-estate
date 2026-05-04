import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetAlertsQuery, useCreateAlertMutation, useDeleteAlertMutation } from '@store/api/userApi';
import {
  BellIcon,
  BellAlertIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', '1BHK', '2BHK', '3BHK', 'Commercial', 'Office'];
const CITIES = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur'];

function AlertCard({ alert, onDelete, isDeleting }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center shrink-0">
          <BellAlertIcon className="w-5 h-5 text-[#7C5CFF]" />
        </div>
        <div>
          <h3 className="font-bold text-[#111111] text-sm">{alert.name || 'Property Alert'}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {alert.filters?.city && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPinIcon className="w-3.5 h-3.5" />
                {alert.filters.city}
              </span>
            )}
            {alert.filters?.propertyType && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <HomeIcon className="w-3.5 h-3.5" />
                {alert.filters.propertyType}
              </span>
            )}
            {(alert.filters?.minPrice || alert.filters?.maxPrice) && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CurrencyRupeeIcon className="w-3.5 h-3.5" />
                {alert.filters?.minPrice ? `₹${(alert.filters.minPrice / 100000).toFixed(0)}L` : 'Any'}
                {' — '}
                {alert.filters?.maxPrice ? `₹${(alert.filters.maxPrice / 100000).toFixed(0)}L` : 'Any'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Created {new Date(alert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <button
        onClick={() => onDelete(alert._id)}
        disabled={isDeleting}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
        title="Delete alert"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SearchAlertsPage() {
  const { data, isLoading, isError } = useGetAlertsQuery();
  const [createAlert, { isLoading: isCreating }] = useCreateAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', city: '', propertyType: '', minPrice: '', maxPrice: '' });

  const alerts = data?.data || [];

  const handleDelete = async (id) => {
    setDeletingId(id);
    try { await deleteAlert(id).unwrap(); }
    catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.city && !form.propertyType) { setFormError('Please set at least one filter (city or type).'); return; }
    try {
      await createAlert({
        name: form.name || `Alert — ${form.city || form.propertyType}`,
        filters: {
          city: form.city || undefined,
          propertyType: form.propertyType || undefined,
          minPrice: form.minPrice ? Number(form.minPrice) : undefined,
          maxPrice: form.maxPrice ? Number(form.maxPrice) : undefined,
        }
      }).unwrap();
      setSuccess('Alert created! You\'ll be notified when matching properties are listed.');
      setShowForm(false);
      setForm({ name: '', city: '', propertyType: '', minPrice: '', maxPrice: '' });
      setFormError('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setFormError(err?.data?.error?.message || 'Failed to create alert.');
    }
  };

  return (
    <>
      <Helmet><title>Search Alerts — RealEstate</title></Helmet>

      <div className="max-w-4xl mx-0 px-4 py-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <BellIcon className="w-6 h-6 text-[#7C5CFF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] tracking-tight">Search Alerts</h1>
              <p className="text-[13px] text-gray-400 font-medium opacity-80 mt-1">{alerts.length} active property alert{alerts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(''); }}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#7C5CFF] text-white text-[11px] font-semibold rounded-2xl transition-all shadow-xl shadow-black/10 uppercase tracking-widest active:scale-95"
          >
            {showForm ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Alert'}
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 p-3.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium mb-6">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        {/* Create Alert Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border border-[#7C5CFF]/20 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
            <h2 className="font-bold text-[#111111]">Create New Alert</h2>
            {formError && (
              <p className="text-sm text-red-500 font-medium">{formError}</p>
            )}
            <input
              type="text"
              placeholder="Alert name (e.g. 2BHK in Pune)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all bg-white"
              >
                <option value="">Any City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={form.propertyType}
                onChange={e => setForm(f => ({ ...f, propertyType: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all bg-white"
              >
                <option value="">Any Type</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Min Price (Lakhs)"
                  value={form.minPrice}
                  onChange={e => setForm(f => ({ ...f, minPrice: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Max Price (Lakhs)"
                  value={form.maxPrice}
                  onChange={e => setForm(f => ({ ...f, maxPrice: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-3 bg-[#7C5CFF] hover:bg-[#6D4AEE] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Alert'}
            </button>
          </form>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BellIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No alerts yet</h3>
            <p className="text-sm text-gray-400 mb-6">Create an alert and get notified when matching properties are listed.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-[#111111] text-white rounded-full text-sm font-semibold hover:bg-[#7C5CFF] transition-colors"
            >
              Create Your First Alert
            </button>
          </div>
        )}

        {/* List */}
        {!isLoading && !isError && alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onDelete={handleDelete}
                isDeleting={deletingId === alert._id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
