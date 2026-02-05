import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  online = false 
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const onlineSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size]} 
            ${getAvatarColor(name)} 
            rounded-full flex items-center justify-center 
            font-semibold text-white border-2 border-white shadow-sm
          `}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span
          className={`
            absolute bottom-0 right-0 
            ${onlineSizeClasses[size]} 
            bg-green-500 border-2 border-white 
            rounded-full
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
