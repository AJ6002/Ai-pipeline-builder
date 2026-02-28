// toolbar.js
// ─────────────────────────────────────────────────────────────────────────────
// Pipeline node palette — grouped by category.
// To add a node: add a DraggableNode entry in the appropriate group.
// ─────────────────────────────────────────────────────────────────────────────

import { DraggableNode } from './draggableNode';

const GROUPS = [
    {
        label: 'Data',
        nodes: [
            { type: 'customInput', label: 'Input', color: '#6366f1', tooltip: 'Pipeline entry point — accepts text or file' },
            { type: 'customOutput', label: 'Output', color: '#10b981', tooltip: 'Pipeline result — displays final output' },
            { type: 'text', label: 'Text', color: '#3b82f6', tooltip: 'Text template — use {{variable}} for dynamic inputs' },
        ],
    },
    {
        label: 'Logic',
        nodes: [
            { type: 'llm', label: 'LLM', color: '#f59e0b', tooltip: 'Language model — runs AI inference on a prompt' },
            { type: 'filter', label: 'Filter', color: '#ef4444', tooltip: 'Filter node — route data to pass or fail based on a condition' },
            { type: 'math', label: 'Math', color: '#ec4899', tooltip: 'Math node — perform arithmetic on two inputs' },
        ],
    },
    {
        label: 'Utility',
        nodes: [
            { type: 'apiCall', label: 'API Call', color: '#8b5cf6', tooltip: 'API Call — make an HTTP request to any endpoint' },
            { type: 'transform', label: 'Transform', color: '#06b6d4', tooltip: 'Transform — apply a JavaScript expression to input data' },
        ],
    },
    {
        label: 'Docs',
        nodes: [
            { type: 'note', label: 'Note', color: '#6b7280', tooltip: 'Note — add comments or annotations to your pipeline' },
        ],
    },
];

export const PipelineToolbar = () => (
    <div style={styles.container}>
        {GROUPS.map(({ label, nodes }) => (
            <div key={label} style={styles.group}>
                <p style={styles.groupLabel}>{label}</p>
                {nodes.map((node) => (
                    <DraggableNode key={node.type} {...node} />
                ))}
            </div>
        ))}
    </div>
);

const styles = {
    container: {
        padding: '12px 8px',
        background: 'rgba(12, 12, 20, 0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '140px',
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif",
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginBottom: '8px',
    },
    groupLabel: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: '0 0 4px 4px',
    },
};
