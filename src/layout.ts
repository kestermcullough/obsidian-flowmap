import { graphlib, layout as dagreLayout } from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';
import { FlowDirection } from './types';

const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 92;

export function layoutWithDagre(nodes: Node[], edges: Edge[], direction: FlowDirection = 'LR'): Node[] {
  const graph = new graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 90, marginx: 30, marginy: 30 });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: Number(node.width) || DEFAULT_NODE_WIDTH,
      height: Number(node.height) || DEFAULT_NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagreLayout(graph);

  return nodes.map((node) => {
    const p = graph.node(node.id);
    return {
      ...node,
      position: {
        x: p.x - DEFAULT_NODE_WIDTH / 2,
        y: p.y - DEFAULT_NODE_HEIGHT / 2,
      },
    };
  });
}
