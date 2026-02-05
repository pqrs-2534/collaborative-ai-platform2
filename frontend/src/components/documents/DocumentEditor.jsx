import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSave, FiClock, FiArrowLeft } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import documentService from '../../services/documentService';
import VersionHistory from './VersionHistory';
import Button from '../common/Button';
import Modal from '../common/Modal';

const DocumentEditor = ({ doc: initialDoc, onBack }) => {
  const [doc, setDoc] = useState(initialDoc);
  const [content, setContent] = useState(initialDoc?.content || '');
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const saveTimer = useRef(null);
  const lastSaved = useRef(initialDoc?.content || '');

  const doSave = useCallback(async () => {
    if (!doc?._id) return;
    setSaving(true);
    try {
      const updated = await documentService.updateDocument(doc._id, { content });
      setDoc(updated);
      lastSaved.current = content;
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }, [doc?._id, content]);

  /* ─── auto-save 3 s after last keystroke ─── */
  useEffect(() => {
    clearTimeout(saveTimer.current);
    if (content === lastSaved.current) return; // nothing new
    saveTimer.current = setTimeout(() => doSave(), 3000);
    return () => clearTimeout(saveTimer.current);
  }, [content, doSave]);

  const handleRestore = (restored) => {
    setDoc(restored);
    setContent(restored.content || '');
    lastSaved.current = restored.content || '';
    setShowHistory(false);
  };

  if (!doc) {
    return <p className="text-sm text-gray-500 text-center py-8">Document not found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={18} />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{doc.title}</h2>
            <p className="text-xs text-gray-400">{saving ? 'Saving…' : 'Auto-saved'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowHistory(true)}>
            <FiClock size={14} /> History
          </Button>
          <Button size="sm" onClick={doSave} loading={saving} disabled={saving}>
            <FiSave size={14} /> Save
          </Button>
        </div>
      </div>

      {/* Rich-text editor */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          placeholder="Start writing…"
          style={{ minHeight: 400 }}
        />
      </div>

      {/* Version history modal */}
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Version History">
        <VersionHistory documentId={doc._id} onRestore={handleRestore} />
      </Modal>
    </div>
  );
};

export default DocumentEditor;