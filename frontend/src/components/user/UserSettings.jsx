import React, { useState } from 'react';
import { FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const UserSettings = () => {
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [notifs, setNotifs] = useState({ email: true, inApp: true, sound: true });
  const [saving, setSaving] = useState(false);

  /* ─── password change ─── */
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/auth/updatepassword', {
        currentPassword: pw.current,
        newPassword: pw.next,
      });
      toast.success('Password updated successfully');
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setSaving(false); }
  };

  const NOTIF_ITEMS = [
    { key: 'email',  label: 'Email Notifications',   desc: 'Receive updates via email' },
    { key: 'inApp',  label: 'In-App Notifications',  desc: 'See notifications inside the app' },
    { key: 'sound',  label: 'Sound Alerts',          desc: 'Play sound on new notifications' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Password section */}
      <Card title="Change Password">
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Input label="Current Password"         type="password" name="current" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })}  icon={<FiLock />} required />
          <Input label="New Password"             type="password" name="next"    value={pw.next}    onChange={(e) => setPw({ ...pw, next: e.target.value })}     icon={<FiLock />} required />
          <Input label="Confirm New Password"     type="password" name="confirm" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}  icon={<FiLock />} required />
          <Button type="submit" loading={saving} disabled={saving}>
            <FiSave size={16} /> Update Password
          </Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card title="Notification Preferences">
        <div className="space-y-5">
          {NOTIF_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => setNotifs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifs[item.key] ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifs[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserSettings;