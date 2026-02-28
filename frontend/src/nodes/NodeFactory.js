// NodeFactory.js
// ─────────────────────────────────────────────────────────────────────────────
// Renders any node purely from its nodeConfigs.js entry.
// Handles field rendering (text, select, textarea) generically.
// Adding a new node type = zero new component code.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeData } from '../hooks/useNodeData';

const fieldStyles = {
    label: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.55)',
        fontFamily: "'Inter', sans-serif",
    },
    input: {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '12px',
        padding: '5px 8px',
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    },
    textarea: {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '12px',
        padding: '5px 8px',
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        width: '100%',
        boxSizing: 'border-box',
        resize: 'vertical',
        minHeight: '56px',
        transition: 'border-color 0.15s',
    },
    select: {
        background: 'rgba(30,30,46,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '12px',
        padding: '5px 8px',
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
};

/**
 * Renders a single field (text / select / textarea) from a field config object.
 * Supports optional `monospace` flag for code-like fields (e.g. Transform expression).
 */
const NodeField = ({ field, value, onChange }) => {
    const textareaRef = useRef(null);

    // Auto-resize textarea height to match content (Note, Transform nodes)
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    }, [value]);

    const handleFocus = (e) => {
        e.target.style.borderColor = 'rgba(255,255,255,0.35)';
    };
    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    };

    return (
        <label style={fieldStyles.label}>
            {field.label}
            {field.type === 'select' ? (
                <select
                    style={fieldStyles.select}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : field.type === 'textarea' ? (
                <textarea
                    ref={textareaRef}
                    style={{
                        ...fieldStyles.textarea,
                        // Monospace font for code/expression fields
                        ...(field.monospace ? { fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '11px' } : {}),
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            ) : (
                // Fallback: unknown field types safely render as plain text input
                <input
                    type="text"
                    style={fieldStyles.input}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            )}
        </label>
    );
};

/**
 * NodeFactory — drives any node from its config object.
 *
 * @param {object} config  - Entry from NODE_CONFIGS
 * @param {string} id      - ReactFlow node id
 * @param {object} data    - ReactFlow node data
 * @param {boolean} selected - Whether node is selected
 */
// Memoized to prevent unnecessary re-renders in ReactFlow canvas
export const NodeFactory = memo(({ config, id, data, selected }) => {
    const { setField } = useNodeData(id);

    // Initialize local state from data or config defaults
    const initState = () => {
        const s = {};
        (config.fields || []).forEach((f) => {
            s[f.name] = data?.[f.name] ?? f.defaultValue ?? '';
        });
        return s;
    };

    const [values, setValues] = useState(initState);

    const handleChange = (fieldName, value) => {
        setValues((prev) => ({ ...prev, [fieldName]: value }));
        setField(fieldName, value);
    };

    return (
        <BaseNode
            id={id}
            selected={selected}
            title={config.title}
            color={config.color}
            inputs={config.inputs}
            outputs={config.outputs}
        >
            {(config.fields || []).map((field) => (
                <NodeField
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    onChange={(val) => handleChange(field.name, val)}
                />
            ))}
        </BaseNode>
    );
});

NodeFactory.displayName = 'NodeFactory';
