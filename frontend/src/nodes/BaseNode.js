// BaseNode.js
// ─────────────────────────────────────────────────────────────────────────────
// The single visual shell that every node in the pipeline uses.
// Receives config-driven props: title, color, inputs, outputs, children.
// Handles layout, styling, hover/selection glow, and dynamic handle placement.
// ─────────────────────────────────────────────────────────────────────────────

import { Handle, Position } from 'reactflow';

const styles = {
    wrapper: (color, selected) => ({
        background: 'rgba(18, 18, 28, 0.85)',
        backdropFilter: 'blur(8px)',
        border: `1.5px solid ${selected ? color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px',
        minWidth: '220px',
        boxShadow: selected
            ? `0 0 0 3px ${color}55, 0 8px 32px rgba(0,0,0,0.5)`
            : '0 4px 24px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'grab',
        overflow: 'visible',
    }),

    header: (color) => ({
        background: `linear-gradient(135deg, ${color}ee, ${color}99)`,
        borderRadius: '10px 10px 0 0',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    }),

    title: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
    },

    body: {
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },

    handleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        padding: '0 4px',
        minHeight: '16px',
    },

    handle: (color) => ({
        width: '10px',
        height: '10px',
        background: color,
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '50%',
    }),
};

/**
 * BaseNode — the universal node shell.
 *
 * @param {string}   id        - ReactFlow node id
 * @param {boolean}  selected  - Whether node is selected (from ReactFlow)
 * @param {string}   title     - Display name in header
 * @param {string}   color     - Accent color hex
 * @param {Array}    inputs    - [{ id, label }] for left-side handles
 * @param {Array}    outputs   - [{ id, label }] for right-side handles
 * @param {ReactNode} children - Fields rendered inside the body
 */
export const BaseNode = ({ id, selected, title, color: rawColor, inputs: rawInputs, outputs: rawOutputs, children }) => {
    // Defensive defaults — prevents runtime errors from incomplete configs
    const color = rawColor || '#6366f1';
    const inputs = rawInputs ?? [];
    const outputs = rawOutputs ?? [];
    // Compute vertical positions for handles evenly spaced
    const inputPositions = computePositions(inputs.length);
    const outputPositions = computePositions(outputs.length);

    return (
        <div style={styles.wrapper(color, selected)}>
            {/* Input Handles (left side) */}
            {inputs.map((handle, i) => (
                <Handle
                    key={handle.id}
                    type="target"
                    position={Position.Left}
                    id={`${id}-${handle.id}`}
                    style={{
                        ...styles.handle(color),
                        top: `${inputPositions[i]}%`,
                    }}
                    title={handle.label}
                />
            ))}

            {/* Header */}
            <div style={styles.header(color)}>
                <span style={styles.title}>{title}</span>
            </div>

            {/* Handle Labels Row */}
            {(inputs.length > 0 || outputs.length > 0) && (
                <div style={{ padding: '4px 12px 0' }}>
                    {inputs.map((h) => (
                        <div key={h.id} style={{ ...styles.handleRow, justifyContent: 'flex-start' }}>
                            ← {h.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Body Content */}
            <div style={styles.body}>{children}</div>

            {/* Output Handle Labels */}
            {outputs.length > 0 && (
                <div style={{ padding: '0 12px 8px' }}>
                    {outputs.map((h) => (
                        <div key={h.id} style={{ ...styles.handleRow, justifyContent: 'flex-end' }}>
                            {h.label} →
                        </div>
                    ))}
                </div>
            )}

            {/* Output Handles (right side) */}
            {outputs.map((handle, i) => (
                <Handle
                    key={handle.id}
                    type="source"
                    position={Position.Right}
                    id={`${id}-${handle.id}`}
                    style={{
                        ...styles.handle(color),
                        top: `${outputPositions[i]}%`,
                    }}
                    title={handle.label}
                />
            ))}
        </div>
    );
};

/**
 * Evenly distributes N handles across the node height (20%–80% range).
 * @param {number} count
 * @returns {number[]} percentage positions
 */
function computePositions(count) {
    if (count === 0) return [];
    if (count === 1) return [50];
    const step = 60 / (count - 1);
    return Array.from({ length: count }, (_, i) => 20 + i * step);
}
