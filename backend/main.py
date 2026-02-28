# backend/main.py
# ─────────────────────────────────────────────────────────────────────────────
# VectorShift Pipeline Analysis API
#
# Endpoints:
#   GET  /           → health check
#   POST /pipelines/parse → analyze pipeline graph
#
# DAG detection uses Kahn's algorithm (topological sort via BFS).
# Time complexity: O(V + E)
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import deque

app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allow requests from React dev server (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ─────────────────────────────────────────────────

class Edge(BaseModel):
    source: str
    target: str

class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Edge] = []

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    message: str


# ── DAG Detection (Kahn's Algorithm) ─────────────────────────────────────────

def check_is_dag(nodes: List[Dict], edges: List[Edge]) -> bool:
    """
    Detects whether the pipeline graph is a Directed Acyclic Graph (DAG).
    Uses Kahn's topological sort algorithm (BFS-based).

    Returns True if no cycles exist, False otherwise.
    """
    node_ids = {n["id"] for n in nodes}

    # Build adjacency list and in-degree map
    adjacency: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    in_degree: Dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src, tgt = edge.source, edge.target
        # Guard: ignore edges referencing nodes not in the node list
        if src not in adjacency or tgt not in adjacency:
            continue
        adjacency[src].append(tgt)
        in_degree[tgt] += 1

    # BFS: start from all nodes with in-degree 0
    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adjacency[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If all nodes were visited → no cycle → is a DAG
    return visited_count == len(node_ids)


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "ok", "service": "VectorShift Pipeline API"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Analyzes a pipeline graph and returns:
      - num_nodes : total node count
      - num_edges : total edge count
      - is_dag    : whether the graph has no directed cycles
      - message   : human-readable result string
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag = check_is_dag(pipeline.nodes, pipeline.edges)

    if is_dag:
        message = "✅ Valid pipeline — no cycles detected."
    else:
        message = "❌ Cycle detected — pipeline contains a loop."

    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag,
        message=message,
    )
