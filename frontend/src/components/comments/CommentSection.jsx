import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';
import commentService from '../../services/commentService';
import CommentItem from './CommentItem';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';

const CommentSection = ({ targetType, targetId }) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ─── fetch ─── */
  useEffect(() => {
    let alive = true;
    commentService.getComments(targetType, targetId)
      .then((res) => { if (alive) setComments(res.data || []); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [targetType, targetId]);

  /* ─── create ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const created = await commentService.createComment({
        targetType,
        targetId,
        content: text.trim(),
      });
      setComments((prev) => [created, ...prev]);
      setText('');
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (id) => setComments((prev) => prev.filter((c) => c._id !== id));
  const handleUpdate = (updated) =>
    setComments((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader size="sm" text="Loading comments…" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New comment box */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg
                           disabled:opacity-40 hover:bg-primary-700 transition-colors"
              >
                {submitting ? 'Posting…' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="text-center py-5">
          <FiMessageSquare size={22} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;