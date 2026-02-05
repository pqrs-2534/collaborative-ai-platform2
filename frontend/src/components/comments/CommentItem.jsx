import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSmile } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import commentService from '../../services/commentService';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';

const EMOJIS = ['👍', '❤️', '🔥', '👏', '😄', '💡'];

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwn = comment.user?._id === user?._id;

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showEmoji, setShowEmoji] = useState(false);

  /* ─── save edit ─── */
  const handleSave = async () => {
    if (!editText.trim()) return;
    try {
      const updated = await commentService.updateComment(comment._id, editText);
      onUpdate && onUpdate(updated);
      setEditing(false);
    } catch (e) { console.error(e); }
  };

  /* ─── delete ─── */
  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.deleteComment(comment._id);
      onDelete && onDelete(comment._id);
    } catch (e) { console.error(e); }
  };

  /* ─── reaction ─── */
  const handleReaction = async (emoji) => {
    try {
      const updated = await commentService.addReaction(comment._id, emoji);
      onUpdate && onUpdate(updated);
    } catch (e) { console.error(e); }
    setShowEmoji(false);
  };

  // Aggregate reaction counts
  const reactionMap = {};
  (comment.reactions || []).forEach((r) => {
    reactionMap[r.emoji] = (reactionMap[r.emoji] || 0) + 1;
  });

  return (
    <div className="group flex gap-3">
      <Avatar name={comment.user?.name} size="sm" />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{comment.user?.name}</span>
            <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowEmoji(!showEmoji)}
              className="p-1 rounded text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors">
              <FiSmile size={14} />
            </button>
            {isOwn && (
              <>
                <button onClick={() => setEditing(true)}
                  className="p-1 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={handleDelete}
                  className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        {editing ? (
          <div className="mt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-2 mt-1.5">
              <button onClick={handleSave} className="text-xs font-semibold text-primary-600 hover:text-primary-700">Save</button>
              <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div className="flex gap-1.5 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-2 w-fit">
            {EMOJIS.map((emoji) => (
              <button key={emoji} onClick={() => handleReaction(emoji)}
                className="text-lg hover:scale-125 transition-transform">
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reactions row */}
        {Object.keys(reactionMap).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(reactionMap).map(([emoji, count]) => (
              <span key={emoji} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-sm">
                {emoji} <span className="text-xs text-gray-600">{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;