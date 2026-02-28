// textNode.js
// ─────────────────────────────────────────────────────────────────────────────
// The "smart" text node. Special-cased from NodeFactory because it has
// dynamic behavior that can't be expressed in a static config:
//
//   1. Detects {{variable}} patterns in real time
//   2. Renders one input Handle per unique, valid variable (live updates)
//   3. Auto-resizes textarea height as content grows
//   4. Defensively ignores invalid identifiers like {{123bad}}
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../hooks/useNodeData';
import { parseVariables } from '../utils/parseVariables';

const COLOR = '#3b82f6'; // blue accent for Text node

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  wrapper: (selected) => ({
    background: 'rgba(18, 18, 28, 0.85)',
    backdropFilter: 'blur(8px)',
    border: `1.5px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px',
    minWidth: '240px',
    maxWidth: '320px',
    boxShadow: selected
      ? `0 0 0 3px ${COLOR}55, 0 8px 32px rgba(0,0,0,0.5)`
      : '0 4px 24px rgba(0,0,0,0.4)',
    fontFamily: "'Inter', sans-serif",
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    position: 'relative',
  }),

  header: {
    background: `linear-gradient(135deg, ${COLOR}ee, ${COLOR}99)`,
    borderRadius: '10px 10px 0 0',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },

  varBadge: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    fontSize: '10px',
    color: '#fff',
    padding: '2px 7px',
    fontWeight: 600,
  },

  body: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '3px',
    display: 'block',
  },

  textarea: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '12px',
    padding: '6px 8px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
    resize: 'none',        // we handle resize ourselves
    overflow: 'hidden',    // prevents scrollbar flicker during auto-resize
    minHeight: '60px',
    maxHeight: '260px',    // cap vertical growth — allows scroll on huge pastes
    overflowY: 'auto',     // show scrollbar only when capped
    lineHeight: '1.5',
    transition: 'border-color 0.15s',
  },

  handle: {
    width: '10px',
    height: '10px',
    background: COLOR,
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    // Smooth appearance/disappearance as variables are added or removed
    transition: 'opacity 0.15s ease, transform 0.15s ease',
  },

  handleLabel: {
    position: 'absolute',
    left: '14px',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  },

  outputHandle: {
    width: '10px',
    height: '10px',
    background: COLOR,
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
  },

  hint: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.25)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export const TextNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const { setField } = useNodeData(id);

  // Parse variables whenever text changes
  useEffect(() => {
    setVariables(parseVariables(text));
  }, [text]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';                          // reset first
    ta.style.height = `${ta.scrollHeight}px`;          // expand to content
  }, [text]);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      // Perf guard: skip processing if value hasn't changed
      // (handles synthetic events from IME input, autofill, etc.)
      if (val === text) return;
      setText(val);
      setField('text', val);
    },
    [setField, text]
  );

  // Compute vertical % positions for input handles (20%–80% range)
  const getHandleTop = (index, total) => {
    if (total === 1) return 50;
    const step = 60 / (total - 1);
    return 20 + index * step;
  };

  return (
    <div style={styles.wrapper(selected)}>

      {/* ── Dynamic Input Handles (one per {{variable}}) ── */}
      {variables.map((varName, i) => {
        const topPct = getHandleTop(i, variables.length);
        return (
          <Handle
            key={varName}
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ ...styles.handle, top: `${topPct}%` }}
            title={varName}
          />
        );
      })}

      {/* ── Header ── */}
      <div style={styles.header}>
        <span style={styles.title}>Text</span>
        {variables.length > 0 && (
          <span style={styles.varBadge}>
            {variables.length} var{variables.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Handle labels (inside body, left-aligned) ── */}
      {variables.length > 0 && (
        <div style={{ padding: '6px 12px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {variables.map((v) => (
            <span key={v} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
              ← <code style={{ color: `${COLOR}cc` }}>{`{{${v}}}`}</code>
            </span>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div style={styles.body}>
        <label>
          <span style={styles.label}>Content</span>
          <textarea
            ref={textareaRef}
            style={styles.textarea}
            value={text}
            placeholder="Type here… use {{variable}} to create dynamic inputs"
            onChange={handleChange}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.35)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </label>

        {/* Hint only shown when no variables yet */}
        {variables.length === 0 && (
          <span style={styles.hint}>Tip: type {'{{name}}'} to create a dynamic input handle</span>
        )}
      </div>

      {/* ── Static Output Handle (right side) ── */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ ...styles.outputHandle, top: '50%' }}
        title="Output"
      />
    </div>
  );
};
