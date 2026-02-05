import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside';

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`
            absolute z-50 mt-2 min-w-[200px]
            bg-white rounded-lg shadow-lg border border-gray-200
            py-1 animate-slide-up
            ${alignClasses[align]}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ 
  children, 
  onClick, 
  icon,
  danger = false,
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left text-sm flex items-center gap-3
        transition-colors
        ${danger 
          ? 'text-red-600 hover:bg-red-50' 
          : 'text-gray-700 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="border-t border-gray-200 my-1" />;
};

export default Dropdown;