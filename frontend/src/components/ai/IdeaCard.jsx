import React from 'react';
import { FiThumbsUp, FiThumbsDown, FiRefreshCw, FiEdit2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { voteIdea } from '../../redux/slices/ideaSlice';
import Badge from '../common/Badge';
import { formatRelativeTime } from '../../utils/helpers';

const categoryVariant = {
  feature: 'primary',
  improvement: 'success',
  bug_fix: 'danger',
  design: 'info',
  research: 'warning',
  other: 'default',
};

const statusVariant = {
  draft: 'default',
  review: 'warning',
  approved: 'success',
  rejected: 'danger',
  implemented: 'info',
};

const IdeaCard = ({ idea, onRefine, onEdit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const hasVotedUp  = (idea.votes || []).some((v) => v.user === user?._id && v.vote === 1);
  const hasVotedDown = (idea.votes || []).some((v) => v.user === user?._id && v.vote === -1);
  const voteCount   = (idea.votes || []).reduce((sum, v) => sum + v.vote, 0);

  const handleVote = (vote) => dispatch(voteIdea({ id: idea._id, vote }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Top badges + timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Badge variant={categoryVariant[idea.category] || 'default'} size="sm">
            {idea.category}
          </Badge>
          <Badge variant={statusVariant[idea.status] || 'default'} size="sm">
            {idea.status}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">{formatRelativeTime(idea.createdAt)}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900">{idea.title}</h3>

      {/* AI-generated block */}
      {idea.aiGenerated && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-purple-700 mb-1">✨ AI Generated</p>
          <p className="text-sm text-gray-700">{idea.aiGenerated}</p>
        </div>
      )}

      {/* User description */}
      {idea.description && (
        <p className="text-sm text-gray-600">{idea.description}</p>
      )}

      {/* Refinements */}
      {idea.refinements?.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">Refinements</p>
          {idea.refinements.slice(-2).map((r, i) => (
            <div key={i} className="bg-blue-50 rounded-lg p-2 mb-1.5">
              <p className="text-xs text-blue-800">{r.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer: votes + actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote(1)}
            className={`p-1.5 rounded-md transition-colors ${
              hasVotedUp ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <FiThumbsUp size={15} />
          </button>
          <span className="text-sm font-semibold text-gray-700 w-6 text-center">{voteCount}</span>
          <button
            onClick={() => handleVote(-1)}
            className={`p-1.5 rounded-md transition-colors ${
              hasVotedDown ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <FiThumbsDown size={15} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onRefine && onRefine(idea)}
            className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Refine with AI"
          >
            <FiRefreshCw size={15} />
          </button>
          <button
            onClick={() => onEdit && onEdit(idea)}
            className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Edit"
          >
            <FiEdit2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;