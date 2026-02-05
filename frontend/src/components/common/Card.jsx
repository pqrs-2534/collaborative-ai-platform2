import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = true,
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-card border border-gray-100
        ${hover ? 'hover:shadow-hover transition-shadow cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;