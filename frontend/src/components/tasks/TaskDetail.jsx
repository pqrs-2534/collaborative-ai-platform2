import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiCalendar, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { updateTask, deleteTask } from '../../redux/slices/taskSlice';
import { PRIORITY, TASK_STATUS, PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import CommentSection from '../comments/CommentSection';

const TaskDetail = ({ task, onClose, onUpdated }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await dispatch(updateTask({ id: task._id, data: form }));
    setEditing(false);
    onUpdated && onUpdated({ ...task, ...form });
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await dispatch(deleteTask(task._id));
    onClose && onClose();
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <FiEdit2 size={14} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <FiSave size={14} /> Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                <FiX size={14} /> Cancel
              </button>
            </>
          )}
        </div>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
          <FiTrash2 size={18} />
        </button>
      </div>

      {/* Title */}
      {editing ? (
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full text-xl font-bold text-gray-900 border-b-2 border-primary-400
                     focus:outline-none pb-1 bg-transparent"
        />
      ) : (
        <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
      )}

      {/* Status + Priority */}
      <div className="flex flex-wrap gap-2">
        {editing ? (
          <>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {Object.values(TASK_STATUS).map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {Object.values(PRIORITY).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
              {task.status?.replace('_', ' ')}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {editing ? (
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      ) : (
        task.description && <p className="text-sm text-gray-600">{task.description}</p>
      )}

      {/* Due date */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiCalendar size={15} className="text-gray-400" />
        {editing ? (
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ) : (
          <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
        )}
      </div>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag, i) => (
            <span key={i} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Comments</p>
        <CommentSection targetType="task" targetId={task._id} />
      </div>
    </div>
  );
};

export default TaskDetail;