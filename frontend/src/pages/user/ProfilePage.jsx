import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '@store/api/userApi';
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

function InputField({ label, id, type = 'text', value, onChange, disabled, icon: Icon }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all
            ${disabled
              ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-200 text-[#111111] focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/10'
            }`}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const profile = profileData?.data || user;

  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    bio: '',
  });

  const startEdit = () => {
    setForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      city: profile?.location?.city || '',
      bio: profile?.bio || '',
    });
    setEditing(true);
    setSuccess(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        location: { city: form.city },
      }).unwrap();
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err?.data?.error?.message || 'Failed to update profile. Try again.');
    }
  };

  const avatar = profile?.name?.[0]?.toUpperCase() || 'U';
  const roleBadge = { admin: 'Admin', agent: 'Agent', user: 'Premium Member' }[profile?.role] || 'Member';

  return (
    <>
      <Helmet><title>My Profile — RealEstate</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center">
            <UserCircleIcon className="w-5 h-5 text-[#7C5CFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">My Profile</h1>
            <p className="text-sm text-gray-400">Manage your personal information</p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse space-y-4">
            <div className="flex gap-5">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Profile Banner */}
            <div className="h-20 bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA]" />

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex items-end justify-between -mt-10 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#111111] border-4 border-white flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-extrabold">{avatar}</span>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#7C5CFF] text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Name & Role */}
              {!editing && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#111111]">{profile?.name}</h2>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#7C5CFF]/10 text-[#7C5CFF] text-xs font-bold rounded-full uppercase tracking-wider">
                    {roleBadge}
                  </span>
                  {profile?.bio && (
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium mb-4">
                  <CheckCircleIcon className="w-5 h-5" />
                  Profile updated successfully!
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium mb-4">
                  <XMarkIcon className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* View Mode */}
              {!editing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      {profile?.email}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      {profile?.phone || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">City</p>
                    <p className="text-sm font-semibold text-[#111111]">
                      {profile?.location?.city || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-sm font-semibold text-[#111111]">
                      {new Date(profile?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {editing && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Full Name"
                      id="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      icon={UserCircleIcon}
                    />
                    <InputField
                      label="Email (cannot change)"
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      icon={EnvelopeIcon}
                    />
                    <InputField
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      icon={PhoneIcon}
                    />
                    <InputField
                      label="City"
                      id="city"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/10 resize-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-[#111111] hover:bg-[#7C5CFF] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setError(''); }}
                      className="px-6 py-3 border border-gray-200 text-gray-600 hover:border-gray-300 font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
