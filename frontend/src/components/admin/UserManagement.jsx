import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import api from '../../services/api';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Loader from '../common/Loader';

const roleVariant = {
  admin: 'danger',
  project_manager: 'primary',
  team_member: 'default',
  guest: 'warning',
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get('/users')
      .then((res) => { if (alive) { setUsers(res.data || []); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader size="md" text="Loading users…" />
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <span className="text-sm font-medium text-gray-800">{u.name}</span>
                </div>
              </td>
              <td className="py-3 text-sm text-gray-600">{u.email}</td>
              <td className="py-3">
                <Badge variant={roleVariant[u.role] || 'default'} size="sm">
                  {(u.role || '').replace('_', ' ')}
                </Badge>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    <FiEdit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(u._id)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;