// App.js
// ─────────────────────────────────────────────────────────────────────────────
// Root layout: sidebar toolbar | canvas | bottom submit bar
// ─────────────────────────────────────────────────────────────────────────────

import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div style={layout.root}>
      {/* Inter font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar palette */}
      <aside style={layout.sidebar}>
        <PipelineToolbar />
      </aside>

      {/* Main area — canvas + submit */}
      <div style={layout.main}>
        <div style={layout.canvas}>
          <PipelineUI />
        </div>
        <div style={layout.footer}>
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default App;

const layout = {
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: '#0c0c14',
    overflow: 'hidden',
  },
  sidebar: {
    flexShrink: 0,
    height: '100%',
    overflowY: 'auto',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    overflow: 'hidden',
  },
  footer: {
    flexShrink: 0,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(12,12,20,0.95)',
    padding: '10px 16px',
  },
};
