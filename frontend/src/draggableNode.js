// draggableNode.js
// ─────────────────────────────────────────────────────────────────────────────
// A single draggable palette item. Accepts color, icon, and tooltip props.
// ─────────────────────────────────────────────────────────────────────────────

export const DraggableNode = ({ type, label, color = '#6366f1', icon = '◆', tooltip = '' }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.opacity = '0.7';
  };

  return (
    <div
      className={type}
      draggable
      title={tooltip}
      onDragStart={onDragStart}
      onDragEnd={(e) => (e.target.style.opacity = '1')}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 10px',
        borderRadius: '8px',
        background: `${color}18`,
        border: `1px solid ${color}44`,
        transition: 'background 0.15s, transform 0.1s',
        userSelect: 'none',
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}30`;
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${color}18`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Color dot */}
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }} />
      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
};