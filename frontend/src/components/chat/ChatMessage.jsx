import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/helpers';

const ChatMessage = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwn = message.sender?._id === user?._id || message.sender === user?._id;

  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && <Avatar name={message.sender?.name} size="xs" />}

      <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs font-semibold text-gray-600 mb-0.5 ml-1">
            {message.sender?.name || 'Unknown'}
          </span>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isOwn
              ? 'bg-primary-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>

        <span className="text-xs text-gray-400 mt-0.5 mx-1">
          {formatDate(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;