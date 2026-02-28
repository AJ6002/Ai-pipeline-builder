// submit.js
// ─────────────────────────────────────────────────────────────────────────────
// Submit button and result modal.
//
// Features:
//   ✅ Reads nodes + edges from Zustand store
//   ✅ POSTs to backend /pipelines/parse
//   ✅ Loading state: button disabled + "Analyzing..." text
//   ✅ Success modal: num_nodes, num_edges, is_dag with friendly message
//   ✅ Error toast: shown when backend is unreachable
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useStore } from './store';

const API_URL = 'http://localhost:8000/pipelines/parse';

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = {
    button: (loading) => ({
        background: loading
            ? 'rgba(99,102,241,0.4)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 22px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.03em',
        transition: 'opacity 0.2s, transform 0.1s',
        opacity: loading ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    }),

    // ── Result Modal ──────────────────────────────────────────────────────────
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        background: 'rgba(18,18,28,0.98)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '28px 32px',
        minWidth: '320px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        fontFamily: "'Inter', sans-serif",
    },
    modalTitle: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '20px',
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: '13px',
    },
    statLabel: { color: 'rgba(255,255,255,0.5)' },
    statValue: { color: '#fff', fontWeight: 600 },
    message: (isDAG) => ({
        marginTop: '18px',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        background: isDAG ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${isDAG ? '#10b98144' : '#ef444444'}`,
        color: isDAG ? '#10b981' : '#ef4444',
    }),
    closeBtn: {
        marginTop: '20px',
        width: '100%',
        padding: '9px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.15s',
    },

    // ── Error Toast ───────────────────────────────────────────────────────────
    toast: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'rgba(239,68,68,0.95)',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideIn 0.2s ease',
    },
};

// ── Components ────────────────────────────────────────────────────────────────

const ResultModal = ({ result, onClose }) => (
    <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>📊 Pipeline Analysis</div>

            <div style={styles.statRow}>
                <span style={styles.statLabel}>Nodes</span>
                <span style={styles.statValue}>{result.num_nodes}</span>
            </div>
            <div style={styles.statRow}>
                <span style={styles.statLabel}>Edges</span>
                <span style={styles.statValue}>{result.num_edges}</span>
            </div>
            <div style={styles.statRow}>
                <span style={styles.statLabel}>Is DAG</span>
                <span style={styles.statValue}>{result.is_dag ? 'Yes' : 'No'}</span>
            </div>

            <div style={styles.message(result.is_dag)}>{result.message}</div>

            <button
                style={styles.closeBtn}
                onClick={onClose}
                onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.08)')}
            >
                Close
            </button>
        </div>
    </div>
);

const ErrorToast = ({ message }) => (
    <div style={styles.toast}>⚠️ {message}</div>
);

// ── Main Submit Button ────────────────────────────────────────────────────────

export const SubmitButton = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const nodes = useStore((s) => s.nodes);
    const edges = useStore((s) => s.edges);

    const handleSubmit = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Backend unreachable. Is the server running on port 8000?');
            // Auto-dismiss error toast after 4 seconds
            setTimeout(() => setError(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    style={styles.button(loading)}
                    onClick={handleSubmit}
                    disabled={loading}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                >
                    {loading ? (
                        <>
                            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                            Analyzing…
                        </>
                    ) : (
                        '▶ Run Pipeline'
                    )}
                </button>

                {/* Node / edge count summary — live feedback even before submitting */}
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
                    {nodes.length} node{nodes.length !== 1 ? 's' : ''}
                    {' · '}
                    {edges.length} edge{edges.length !== 1 ? 's' : ''}
                </span>
            </div>

            {result && <ResultModal result={result} onClose={() => setResult(null)} />}
            {error && <ErrorToast message={error} />}
        </>
    );
};
