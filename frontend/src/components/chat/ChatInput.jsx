import React, { useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSend, placeholder = 'Type a message…' }) => {
  const [message, setMessage] = useState('');
  const ref = useRef(null);

  const send = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend && onSend(trimmed);
    setMessage('');
    ref.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t border-gray-200 bg-white">
      <textarea
        ref={ref}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        style={{ maxHeight: 120 }}
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <button
        onClick={send}
        disabled={!message.trim()}
        className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiSend size={18} />
      </button>
    </div>
  );
};

export default ChatInput;