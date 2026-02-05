import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../redux/slices/projectSlice';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateProject = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);

  const [form, setForm] = useState({ name: '', description: '', status: 'planning' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const result = await dispatch(createProject(form));
    if (result.type === 'projects/create/fulfilled') {
      onSuccess && onSuccess(result.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. Website Redesign"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="What is this project about?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500
                     focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? 'Creating…' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default CreateProject;