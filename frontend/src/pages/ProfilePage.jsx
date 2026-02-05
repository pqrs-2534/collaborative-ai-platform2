import React, { useState } from 'react';
import UserProfile from '../components/user/UserProfile';
import UserSettings from '../components/user/UserSettings';

const TABS = [
  { id: 'profile',  label: 'Profile' },
  { id: 'settings', label: 'Settings' },
];

const ProfilePage = () => {
  const [tab, setTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'profile'  && <UserProfile />}
      {tab === 'settings' && <UserSettings />}
    </div>
  );
};

export default ProfilePage;