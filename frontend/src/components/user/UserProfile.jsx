import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';
import { updateProfile } from '../../redux/slices/authSlice';
import Avatar from '../common/Avatar';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    bio:   user?.bio   || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(form));
  };

  const roleLabel = (r) =>
    (r || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Avatar card */}
      <Card>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar name={user?.name} size="2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {roleLabel(user?.role)}
          </span>
          {user?.bio && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{user.bio}</p>
          )}
        </div>
      </Card>

      {/* Edit form */}
      <Card title="Edit Profile" className="lg:col-span-2">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name"  name="name"  value={form.name}  onChange={handleChange} icon={<FiUser />} />
          <Input label="Email"      type="email" name="email" value={form.email} onChange={handleChange} icon={<FiMail />} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="A short bio about you…"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button type="submit"><FiSave size={16} /> Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;