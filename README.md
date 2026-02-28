# VectorShift Pipeline Builder — Frontend Assessment

A visual, drag-and-drop AI pipeline editor built with **React + ReactFlow** on the frontend and **FastAPI** on the backend.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
# → Running on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start
# → Running on http://localhost:3000
```

---

## ✅ Features Implemented

| Part | Feature |
|------|---------|
| **1** | `BaseNode` — universal node shell (glassmorphism, selection glow, dynamic handles) |
| **1** | `nodeConfigs.js` — data-driven central registry for all node types |
| **1** | `NodeFactory` — renders any node from its config. Zero duplication |
| **2** | `TextNode` — live `{{variable}}` detection → dynamic input handles |
| **2** | Auto-resize textarea, deduplication, defensive parsing (`{{123bad}}` ignored) |
| **3** | 5 new nodes: **Filter**, **API Call**, **Note**, **Transform**, **Math** |
| **3** | Grouped, color-coded toolbar palette with tooltips |
| **3** | Color-coded MiniMap, dot background, `snapToGrid`, `fitView` |
| **4** | `POST /pipelines/parse` — counts nodes/edges, detects DAG via Kahn's algorithm |
| **4** | Submit button with loading state, result modal, error toast, live node/edge counter |

---

## 🏗️ Architecture Overview

```
nodeConfigs.js   ← single source of truth for all node definitions
      ↓
NodeFactory.js   ← renders any config into a reactive UI component
      ↓
BaseNode.js      ← visual shell: color, handles, glow, glassmorphism
```

**Custom hook:** `useNodeData(id)` — clean read/write access to node fields, decoupled from Zustand internals.

**Utility:** `parseVariables(text)` — extracts valid `{{variable}}` names (regex enforces JS identifier rules).

---

## 📐 Scalability Design

> **Adding a new node type requires exactly:**
> 1. One config entry in `nodeConfigs.js`
> 2. One ~7-line file (e.g. `fooNode.js`) using `NodeFactory`
> 3. One entry each in `toolbar.js` and `ui.js`
>
> **Zero new component logic.** The system supports 50+ node types without architectural changes.

---

## 🔬 Backend — DAG Detection

Uses **Kahn's Algorithm** (BFS-based topological sort) — `O(V + E)`:
1. Build adjacency list and in-degree map from edges
2. BFS-process all nodes with in-degree 0
3. If all nodes visited → no cycle → valid DAG
4. Returns `num_nodes`, `num_edges`, `is_dag`, and a human-readable `message`

---

## 📁 Folder Structure

```
frontend/src/
├── nodes/
│   ├── nodeConfigs.js    ← all node definitions
│   ├── BaseNode.js       ← universal visual shell
│   ├── NodeFactory.js    ← config → component renderer
│   ├── textNode.js       ← dynamic variable handles (special case)
│   └── [7 other nodes]   ← each ~7 lines
├── hooks/
│   └── useNodeData.js
├── utils/
│   └── parseVariables.js
├── toolbar.js            ← grouped palette
├── ui.js                 ← canvas + node type registry
├── submit.js             ← backend integration
└── App.js                ← root layout

backend/
└── main.py               ← FastAPI + DAG analysis
```
