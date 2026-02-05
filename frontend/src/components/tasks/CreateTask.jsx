import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../redux/slices/taskSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { PRIORITY } from '../../utils/constants';

const CreateTask = ({ projectId, defaultStatus = 'todo', onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: defaultStatus,
    dueDate: '',
    tags: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      project: projectId,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    const result = await dispatch(createTask(payload));
    if (result.type === 'tasks/create/fulfilled') {
      onSuccess && onSuccess(result.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Task Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="Optional details…"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {Object.values(PRIORITY).map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <Input
        label="Tags (comma-separated)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="e.g. frontend, urgent"
      />

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" loading={loading} disabled={loading}>
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default CreateTask;