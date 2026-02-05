import React from 'react';

/* ─── uid generator ─── */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

/* ─── create initial shape object ─── */
export const createShape = (tool, x, y, color, strokeWidth) => {
  const base = { id: uid(), tool, color, strokeWidth, x, y };
  switch (tool) {
    case 'line':   return { ...base, x2: x, y2: y };
    case 'rect':   return { ...base, width: 0, height: 0 };
    case 'circle': return { ...base, radius: 0 };
    case 'text':   return { ...base, text: '' };
    default:       return base;
  }
};

/* ─── finalise shape from start → end pointer ─── */
export const finaliseShape = (shape, sx, sy, ex, ey) => {
  switch (shape.tool) {
    case 'line':
      return { ...shape, x2: ex, y2: ey };
    case 'rect':
      return {
        ...shape,
        x: Math.min(sx, ex),
        y: Math.min(sy, ey),
        width: Math.abs(ex - sx),
        height: Math.abs(ey - sy),
      };
    case 'circle': {
      const dx = ex - sx, dy = ey - sy;
      return { ...shape, x: sx + dx / 2, y: sy + dy / 2, radius: Math.hypot(dx, dy) / 2 };
    }
    default:
      return shape;
  }
};

/* ─── SVG renderers ─── */
export const renderShape = (shape, key) => {
  const common = { key, stroke: shape.color, strokeWidth: shape.strokeWidth };
  switch (shape.tool) {
    case 'line':
      return (
        <line {...common} x1={shape.x} y1={shape.y} x2={shape.x2} y2={shape.y2} strokeLinecap="round" />
      );
    case 'rect':
      return (
        <rect {...common} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill="none" />
      );
    case 'circle':
      return (
        <circle {...common} cx={shape.x} cy={shape.y} r={shape.radius} fill="none" />
      );
    case 'text':
      return (
        <text key={key} x={shape.x} y={shape.y} fill={shape.color}
              fontSize={shape.strokeWidth * 4} fontFamily="Inter, sans-serif">
          {shape.text}
        </text>
      );
    default:
      return null;
  }
};

// Default export so the file can be imported as a module
const DrawingTools = () => null;
export default DrawingTools;