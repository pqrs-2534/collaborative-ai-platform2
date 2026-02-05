import React, { useState, useEffect } from 'react';
import { FiClock, FiRotateCcw } from 'react-icons/fi';
import documentService from '../../services/documentService';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/helpers';

const VersionHistory = ({ documentId, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (documentId) {
      documentService.getVersionHistory(documentId)
        .then((res) => { if (alive) { setVersions(res.data || []); setLoading(false); } })
        .catch(() => { if (alive) setLoading(false); });
    }
    return () => { alive = false; };
  }, [documentId]);

  const handleRestore = async (versionId) => {
    if (!window.confirm('Restore this version? Current content will be replaced.')) return;
    try {
      const updated = await documentService.restoreVersion(documentId, versionId);
      onRestore && onRestore(updated);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size="sm" />
      </div>
    );
  }

  if (versions.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-6">No version history available.</p>;
  }

  return (
    <div className="space-y-2">
      {versions.map((v, i) => (
        <div key={v._id || i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiClock size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Version {versions.length - i}</p>
              <p className="text-xs text-gray-500">{formatDate(v.createdAt)}</p>
            </div>
          </div>

          {i === 0 ? (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">Current</span>
          ) : (
            <button
              onClick={() => handleRestore(v._id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-600
                         hover:text-primary-700 hover:bg-primary-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <FiRotateCcw size={12} /> Restore
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default VersionHistory;