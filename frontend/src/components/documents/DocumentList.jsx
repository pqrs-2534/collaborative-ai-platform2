import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFilePlus, FiFileText, FiClock, FiTrash2 } from 'react-icons/fi';
import documentService from '../../services/documentService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Loader from '../common/Loader';
import { formatRelativeTime } from '../../utils/helpers';

const DocumentList = ({ onOpen }) => {
  const { id: projectId } = useParams();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    let alive = true;
    documentService.getDocuments({ project: projectId })
      .then((res) => { if (alive) { setDocs(res.data || []); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const doc = await documentService.createDocument({ project: projectId, title: title.trim() });
      setDocs((prev) => [doc, ...prev]);
      setTitle('');
      setShowCreate(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    setDocs((prev) => prev.filter((d) => d._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="md" text="Loading documents…" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Documents</h3>
        <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
          <FiFilePlus size={14} /> New Doc
        </Button>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiFileText size={22} className="text-blue-500" />
          </div>
          <p className="text-sm text-gray-500">No documents yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200
                         hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
              onClick={() => onOpen && onOpen(doc)}
            >
              <div className="flex items-center gap-3">
                <FiFileText size={18} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FiClock size={11} />
                    {formatRelativeTime(doc.updatedAt)}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(doc._id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-gray-400
                           hover:text-red-500 transition-all"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentList;