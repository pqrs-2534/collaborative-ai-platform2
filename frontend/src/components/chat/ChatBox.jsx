import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSocket from '../../hooks/useSocket';
import chatService from '../../services/chatService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Loader from '../common/Loader';

const ChatBox = () => {
  const { id: projectId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { emit, on, off } = useSocket();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const hasJoined = useRef(false);

  /* ─── auto-scroll ─── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* ─── load history + join room ─── */
  useEffect(() => {
    let alive = true;

    chatService.getMessages(projectId)
      .then((res) => { 
        if (alive) { 
          setMessages(res.data || []); 
          setLoading(false); 
        } 
      })
      .catch(() => { if (alive) setLoading(false); });

    // Join chat room only once
    if (emit && !hasJoined.current) {
      emit('joinChat', projectId);
      hasJoined.current = true;
      console.log('📥 Joining chat:', projectId);
    }

    return () => {
      alive = false;
      // Leave chat room only on unmount
      if (emit && hasJoined.current) {
        emit('leaveChat', projectId);
        hasJoined.current = false;
        console.log('📤 Leaving chat:', projectId);
      }
    };
  }, [projectId]); // Only depend on projectId

  /* ─── real-time listeners ─── */
  useEffect(() => {
    if (!on || !off) return;

    const onMsg = (msg) => setMessages((prev) => [...prev, msg]);

    const onType = (data) => {
      if (data.userId === user?._id) return;
      setTyping(data.userName);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(null), 2800);
    };

    on('newMessage', onMsg);
    on('typingIndicator', onType);

    return () => {
      off('newMessage', onMsg);
      off('typingIndicator', onType);
      clearTimeout(typingTimeout.current);
    };
  }, [projectId]); // Only depend on projectId

  /* ─── send ─── */
  const handleSend = (content) => {
    if (!emit) return;
    
    emit('sendMessage', { projectId, content });
    
    // Optimistic append
    setMessages((prev) => [
      ...prev,
      { 
        _id: String(Date.now()), 
        content, 
        sender: user, 
        createdAt: new Date().toISOString() 
      },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="md" text="Loading chat…" />
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white"
         style={{ height: 'calc(100vh - 260px)', minHeight: 360 }}>
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            No messages yet — start the conversation!
          </p>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg._id} message={msg} />
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-2 text-sm text-gray-400 italic">
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            {typing} is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;