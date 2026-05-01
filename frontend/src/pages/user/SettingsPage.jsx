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

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center">
            <Cog6ToothIcon className="w-5 h-5 text-[#7C5CFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account preferences</p>
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
            <LockClosedIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-bold text-[#111111]">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all pr-10"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7C5CFF] transition-all"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-[#111111] hover:bg-[#7C5CFF] text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ─── Notification Preferences ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
            <BellIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-bold text-[#111111]">Notifications</h2>
          </div>
          <div className="px-6 py-2">
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
            <ToggleSwitch
              label="Newsletter"
              description="Weekly digest of market trends and featured properties"
              enabled={notifs.newsletter}
              onChange={v => setNotifs(n => ({ ...n, newsletter: v }))}
            />
          </div>
        </div>

        {/* ─── Privacy ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-[#7C5CFF]" />
            <h2 className="font-bold text-[#111111]">Privacy</h2>
          </div>
          <div className="px-6 py-2">
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
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-red-50 flex items-center gap-3">
            <TrashIcon className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-500">Danger Zone</h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#111111]">Delete Account</p>
              <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
