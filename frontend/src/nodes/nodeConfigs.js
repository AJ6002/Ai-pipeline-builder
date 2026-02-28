// nodeConfigs.js
// ─────────────────────────────────────────────────────────────────────────────
// Central registry for all node definitions.
// Add new node types here to extend the editor — no other files need changes.
//
// Each entry defines:
//   title       Display name shown in the node header
//   color       Accent hex used for header, handles, and selection glow
//   inputs      Left-side handles  [{ id, label }]
//   outputs     Right-side handles [{ id, label }]
//   fields      Editable fields    [{ name, label, type, options?, defaultValue }]
// ─────────────────────────────────────────────────────────────────────────────

export const NODE_CONFIGS = {
  // ── Input Node ──────────────────────────────────────────────────────────────
  customInput: {
    title: 'Input',
    color: '#6366f1',
    description: 'Pipeline entry point',
    inputs: [],
    outputs: [{ id: 'value', label: 'Value' }],
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: '' },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File', 'Image'],
        defaultValue: 'Text',
      },
    ],
  },

  // ── Output Node ─────────────────────────────────────────────────────────────
  customOutput: {
    title: 'Output',
    color: '#10b981',
    description: 'Pipeline result',
    inputs: [{ id: 'value', label: 'Value' }],
    outputs: [],
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', defaultValue: '' },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File', 'Image'],
        defaultValue: 'Text',
      },
    ],
  },

  // ── LLM Node ────────────────────────────────────────────────────────────────
  llm: {
    title: 'LLM',
    color: '#f59e0b',
    description: 'Language model inference',
    inputs: [
      { id: 'system', label: 'System' },
      { id: 'prompt', label: 'Prompt' },
    ],
    outputs: [{ id: 'response', label: 'Response' }],
    fields: [
      {
        name: 'model',
        label: 'Model',
        type: 'select',
        options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus'],
        defaultValue: 'gpt-4o',
      },
    ],
  },

  // ── Filter Node ─────────────────────────────────────────────────────────────
  filter: {
    title: 'Filter',
    color: '#ef4444',
    description: 'Route data by condition',
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [
      { id: 'pass', label: 'Pass ✓' },
      { id: 'fail', label: 'Fail ✗' },
    ],
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        options: ['Contains', 'Equals', 'Not Empty', 'Is Number', 'Starts With'],
        defaultValue: 'Not Empty',
      },
      { name: 'value', label: 'Value', type: 'text', defaultValue: '' },
    ],
  },

  // ── API Call Node ───────────────────────────────────────────────────────────
  apiCall: {
    title: 'API Call',
    color: '#8b5cf6',
    description: 'Make an HTTP request',
    inputs: [
      { id: 'url', label: 'URL' },
      { id: 'body', label: 'Body' },
    ],
    outputs: [
      { id: 'response', label: 'Response' },
      { id: 'error', label: 'Error' },
    ],
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        defaultValue: 'GET',
      },
    ],
  },

  // ── Note Node ───────────────────────────────────────────────────────────────
  note: {
    title: 'Note',
    color: '#6b7280',
    description: 'Add a comment or annotation',
    inputs: [],
    outputs: [],
    fields: [
      {
        name: 'content',
        label: 'Note',
        type: 'textarea',
        defaultValue: 'Add your notes here...',
      },
    ],
  },

  // ── Transform Node ──────────────────────────────────────────────────────────
  transform: {
    title: 'Transform',
    color: '#06b6d4',
    description: 'Apply a JS expression',
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
    fields: [
      {
        name: 'expression',
        label: 'Expression',
        type: 'textarea',
        monospace: true,          // renders in monospace font for code readability
        defaultValue: 'input.trim().toUpperCase()',
      },
    ],
  },

  // ── Math Node ───────────────────────────────────────────────────────────────
  math: {
    title: 'Math',
    color: '#ec4899',
    description: 'Perform arithmetic operations',
    inputs: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    outputs: [{ id: 'result', label: 'Result' }],
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['+', '−', '×', '÷', 'mod', 'pow'],
        defaultValue: '+',
      },
    ],
  },
};
