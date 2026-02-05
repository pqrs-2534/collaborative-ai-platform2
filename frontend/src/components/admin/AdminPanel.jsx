import React from 'react';
import { FiUsers, FiFolder, FiSettings } from 'react-icons/fi';
import Card from '../common/Card';
import useAuth from '../../hooks/useAuth';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-sm">You do not have permission to view this page.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users',     value: '—', icon: FiUsers,    color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Projects',  value: '—', icon: FiFolder,   color: 'text-green-600',   bg: 'bg-green-50' },
    { label: 'System Status',   value: 'Online', icon: FiSettings, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage users and system settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
              </div>
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User management */}
      <Card title="User Management">
        <UserManagement />
      </Card>
    </div>
  );
};

export default AdminPanel;