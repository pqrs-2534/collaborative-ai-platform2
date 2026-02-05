import React from 'react';
import { FiMinus, FiSquare, FiCircle, FiType, FiTrash2 } from 'react-icons/fi';

const TOOLS  = [
  { id: 'line',   icon: FiMinus,  label: 'Line' },
  { id: 'rect',   icon: FiSquare, label: 'Rectangle' },
  { id: 'circle', icon: FiCircle, label: 'Circle' },
  { id: 'text',   icon: FiType,   label: 'Text' },
];

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
const SIZES  = [2, 4, 6, 10];

const ToolBar = ({ activeTool, activeColor, activeSize, onToolChange, onColorChange, onSizeChange, onClear }) => (
  <div className="flex items-center gap-4 flex-wrap bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2.5">
    {/* Shape tools */}
    <div className="flex gap-1">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          onClick={() => onToolChange(t.id)}
          title={t.label}
          className={`p-2 rounded-lg transition-colors ${
            activeTool === t.id
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <t.icon size={18} />
        </button>
      ))}
    </div>

    <div className="w-px h-6 bg-gray-200" />

    {/* Colors */}
    <div className="flex gap-1.5">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onColorChange(c)}
          className={`w-5 h-5 rounded-full border-2 transition-transform ${
            activeColor === c ? 'border-gray-800 scale-110' : 'border-gray-300'
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>

    <div className="w-px h-6 bg-gray-200" />

    {/* Stroke sizes */}
    <div className="flex items-center gap-2">
      {SIZES.map((s) => (
        <button
          key={s}
          onClick={() => onSizeChange(s)}
          className={`flex items-center justify-center rounded-full ${
            activeSize === s ? 'ring-2 ring-primary-500' : ''
          }`}
          style={{ width: s + 8, height: s + 8 }}
        >
          <div className="rounded-full bg-gray-700" style={{ width: s, height: s }} />
        </button>
      ))}
    </div>

    <div className="w-px h-6 bg-gray-200" />

    {/* Clear */}
    <button
      onClick={onClear}
      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors ml-auto"
      title="Clear board"
    >
      <FiTrash2 size={18} />
    </button>
  </div>
);

export default ToolBar;