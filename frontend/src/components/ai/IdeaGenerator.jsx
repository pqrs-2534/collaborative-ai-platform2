import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiZap } from 'react-icons/fi';
import { generateIdeas } from '../../redux/slices/ideaSlice';
import Button from '../common/Button';
import { IDEA_CATEGORIES } from '../../utils/constants';

const IdeaGenerator = ({ projectId, onGenerated }) => {
  const dispatch = useDispatch();
  const { generating } = useSelector((state) => state.ideas);

  const [form, setForm] = useState({ prompt: '', category: 'feature', context: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.prompt.trim()) return;

    const result = await dispatch(generateIdeas({ project: projectId, ...form }));
    if (result.type === 'ideas/generate/fulfilled') {
      setForm({ prompt: '', category: 'feature', context: '' });
      onGenerated && onGenerated(result.payload);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border border-purple-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <FiZap size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">AI Idea Generator</h3>
          <p className="text-xs text-gray-500">Describe what you need and let AI help you ideate</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What do you need ideas for? <span className="text-red-500">*</span>
          </label>
          <textarea
            name="prompt"
            value={form.prompt}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. Ways to improve user onboarding flow…"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {Object.entries(IDEA_CATEGORIES).map(([, val]) => (
                <option key={val} value={val}>
                  {val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Context (optional)</label>
            <input
              name="context"
              value={form.context}
              onChange={handleChange}
              placeholder="e.g. SaaS product, B2B"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          loading={generating}
          disabled={generating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {generating ? 'Generating…' : 'Generate Idea'}
        </Button>
      </form>
    </div>
  );
};

export default IdeaGenerator;