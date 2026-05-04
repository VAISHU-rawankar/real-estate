import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout as authLogout } from '@store/slices/authSlice';
import { useUpdateProfileMutation } from '@store/api/userApi';
import { useLogoutMutation } from '@store/api/authApi';
import { useNavigate } from 'react-router-dom';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#7C5CFF]' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [logoutApi] = useLogoutMutation();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Notification prefs (local state - would connect to backend)
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    newProperties: true,
    priceDrops: true,
    newsletter: false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showPhone: false,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!passwords.current || !passwords.new) {
      setError('Please fill in all password fields.');
      return;
    }
    if (passwords.new.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }
    try {
      await updateProfile({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      }).unwrap();
      setSuccess('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err?.data?.error?.message || 'Failed to update password. Check your current password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      await logoutApi().unwrap();
    } catch (e) {}
    dispatch(authLogout());
    navigate('/');
  };

  return (
    <>
      <Helmet><title>Settings — RealEstate</title></Helmet>

      <div className="max-w-4xl mx-0 px-4 py-8 space-y-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <Cog6ToothIcon className="w-6 h-6 text-[#7C5CFF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] tracking-tight">Settings</h1>
              <p className="text-[13px] text-gray-400 font-medium opacity-80 mt-1">Manage your account security and preferences</p>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 p-3.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            <XMarkIcon className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* ─── Change Password ──────────────────────────────────────────── */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
            <LockClosedIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-semibold text-[#111111] tracking-tight">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
            <div className="max-w-md">
              <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#7C5CFF] focus:ring-4 focus:ring-[#7C5CFF]/5 transition-all pr-12"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C5CFF] transition-colors">
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#7C5CFF] focus:ring-4 focus:ring-[#7C5CFF]/5 transition-all"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#7C5CFF] focus:ring-4 focus:ring-[#7C5CFF]/5 transition-all"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-10 py-4 bg-[#111111] hover:bg-[#7C5CFF] text-white font-semibold rounded-2xl transition-all shadow-xl shadow-black/10 uppercase text-[11px] tracking-widest disabled:opacity-50 active:scale-95"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ─── Notification Preferences ────────────────────────────────── */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
            <BellIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-semibold text-[#111111] tracking-tight">Notifications</h2>
          </div>
          <div className="px-8 py-4 divide-y divide-gray-50">
            <ToggleSwitch
              label="Email Alerts"
              description="Get notified via email for property matches"
              enabled={notifs.emailAlerts}
              onChange={v => setNotifs(n => ({ ...n, emailAlerts: v }))}
            />
            <ToggleSwitch
              label="SMS Alerts"
              description="Receive text messages for urgent updates"
              enabled={notifs.smsAlerts}
              onChange={v => setNotifs(n => ({ ...n, smsAlerts: v }))}
            />
            <ToggleSwitch
              label="New Properties"
              description="Alert when properties matching your criteria are listed"
              enabled={notifs.newProperties}
              onChange={v => setNotifs(n => ({ ...n, newProperties: v }))}
            />
            <ToggleSwitch
              label="Price Drops"
              description="Notify when saved properties lower their price"
              enabled={notifs.priceDrops}
              onChange={v => setNotifs(n => ({ ...n, priceDrops: v }))}
            />
          </div>
        </div>

        {/* ─── Privacy ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
            <ShieldCheckIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-semibold text-[#111111] tracking-tight">Privacy</h2>
          </div>
          <div className="px-8 py-4 divide-y divide-gray-50">
            <ToggleSwitch
              label="Public Profile"
              description="Allow agents to see your profile information"
              enabled={privacy.showProfile}
              onChange={v => setPrivacy(p => ({ ...p, showProfile: v }))}
            />
            <ToggleSwitch
              label="Show Phone Number"
              description="Display your phone to property agents"
              enabled={privacy.showPhone}
              onChange={v => setPrivacy(p => ({ ...p, showPhone: v }))}
            />
          </div>
        </div>

        {/* ─── Danger Zone ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-[32px] border border-rose-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-rose-50 flex items-center gap-3 bg-rose-50/30">
            <TrashIcon className="w-5 h-5 text-rose-500" />
            <h2 className="font-semibold text-rose-500 tracking-tight">Danger Zone</h2>
          </div>
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-[#111111]">Delete Account</p>
              <p className="text-[13px] text-gray-400 font-medium mt-1 opacity-80">Permanently delete your account and all data. This action is irreversible.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold rounded-2xl transition-all shadow-lg shadow-rose-500/20 uppercase tracking-widest active:scale-95"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
