// ui.js
// Displays the drag-and-drop canvas UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

// ── Node type imports ────────────────────────────────────────────────────────
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { ApiNode } from './nodes/apiNode';
import { NoteNode } from './nodes/noteNode';
import { TransformNode } from './nodes/transformNode';
import { MathNode } from './nodes/mathNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// ── Node type registry ───────────────────────────────────────────────────────
// To register a new node: add one line here + one entry in nodeConfigs.js + toolbar.js
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  apiCall: ApiNode,
  note: NoteNode,
  transform: TransformNode,
  math: MathNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: type });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event?.dataTransfer?.getData('application/reactflow');
      if (!raw) return;

      const appData = JSON.parse(raw);
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode({
        id: getNodeID(type),
        type,
        position,
        data: getInitNodeData(getNodeID(type), type),
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="#1e1e2e" gap={gridSize} variant="dots" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colorMap = {
              customInput: '#6366f1',
              customOutput: '#10b981',
              llm: '#f59e0b',
              text: '#3b82f6',
              filter: '#ef4444',
              apiCall: '#8b5cf6',
              note: '#6b7280',
              transform: '#06b6d4',
              math: '#ec4899',
            };
            return colorMap[node.type] || '#555';
          }}
          style={{
            background: 'rgba(12,12,20,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </ReactFlow>
    </div>
  );
};
