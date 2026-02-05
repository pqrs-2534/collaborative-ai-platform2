import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSocket from '../../hooks/useSocket';
import ToolBar from './ToolBar';
import { createShape, finaliseShape, renderShape } from './DrawingTools';

const Whiteboard = () => {
  const { id: projectId } = useParams();
  const { emit, on, off, connected } = useSocket();
  const svgRef = useRef(null);

  const [shapes, setShapes] = useState([]);
  const [activeTool, setActiveTool] = useState('line');
  const [activeColor, setActiveColor] = useState('#000000');
  const [activeSize, setActiveSize] = useState(3);

  const drawing = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });
  const [preview, setPreview] = useState(null);
  const hasJoined = useRef(false);

  /* ─── join room + remote listeners ─── */
  useEffect(() => {
    if (!emit || !on || !off || !projectId) return;

    // Only join once
    if (!hasJoined.current) {
      emit('joinWhiteboard', projectId);
      hasJoined.current = true;
      console.log('🎨 Joining whiteboard:', projectId);
    }

    const onRemoteShape = (shape) => setShapes((prev) => [...prev, shape]);
    const onRemoteClear = () => setShapes([]);

    on('whiteboardShape', onRemoteShape);
    on('whiteboardClear', onRemoteClear);

    return () => {
      off('whiteboardShape', onRemoteShape);
      off('whiteboardClear', onRemoteClear);
      
      // Only leave when component unmounts
      if (hasJoined.current) {
        emit('leaveWhiteboard', projectId);
        hasJoined.current = false;
        console.log('🎨 Leaving whiteboard:', projectId);
      }
    };
  }, [projectId]); // Only depend on projectId, not emit/on/off

  /* ─── pointer helpers ─── */
  const getPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }, []);

  const onDown = (e) => {
    e.preventDefault();
    const { x, y } = getPoint(e);
    startPt.current = { x, y };
    setPreview(createShape(activeTool, x, y, activeColor, activeSize));
    drawing.current = true;
  };

  const onMove = (e) => {
    if (!drawing.current || !preview) return;
    e.preventDefault();
    const { x, y } = getPoint(e);
    setPreview(finaliseShape(preview, startPt.current.x, startPt.current.y, x, y));
  };

  const onUp = (e) => {
    if (!drawing.current || !preview || !emit) return;
    e.preventDefault();
    const pt = e.changedTouches ? e.changedTouches[0] : e;
    const { x, y } = getPoint(pt);
    let final = finaliseShape(preview, startPt.current.x, startPt.current.y, x, y);

    if (final.tool === 'text') {
      const t = window.prompt('Enter text:', '');
      if (t) {
        final.text = t;
        setShapes((prev) => [...prev, final]);
        emit('whiteboardShape', { projectId, shape: final });
      }
    } else {
      setShapes((prev) => [...prev, final]);
      emit('whiteboardShape', { projectId, shape: final });
    }

    setPreview(null);
    drawing.current = false;
  };

  const handleClear = () => {
    if (!emit) return;
    setShapes([]);
    emit('whiteboardClear', { projectId });
  };

  return (
    <div className="flex flex-col gap-3">
      <ToolBar
        activeTool={activeTool}
        activeColor={activeColor}
        activeSize={activeSize}
        onToolChange={setActiveTool}
        onColorChange={setActiveColor}
        onSizeChange={setActiveSize}
        onClear={handleClear}
      />

      <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ height: 520 }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-crosshair touch-none select-none"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          {shapes.map((s, i) => renderShape(s, i))}
          {preview && renderShape(preview, 'preview')}
        </svg>
      </div>
    </div>
  );
};

export default Whiteboard;