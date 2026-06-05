import { Edge, MarkerType, Node } from '@xyflow/react';
import { FlowMapDocument, FlowMapPosition } from './types';
import { layoutWithDagre } from './layout';

export function flowMapToReactFlow(doc: FlowMapDocument): { nodes: Node[]; edges: Edge[] } {
  const edges: Edge[] = (doc.edges ?? []).map((edge) => ({
    id: edge.id ?? `${edge.from}->${edge.to}${edge.label ? `:${edge.label}` : ''}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    data: { ...edge },
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  const baseNodes: Node[] = doc.nodes.map((node) => ({
    id: node.id,
    type: 'flowMapNode',
    position: doc.layout?.[node.id] ?? { x: 0, y: 0 },
    data: {
      ...node,
      label: node.label ?? node.id,
    },
  }));

  const hasCompleteLayout = doc.nodes.every((node) => hasValidPosition(doc.layout?.[node.id]));
  const nodes = hasCompleteLayout ? baseNodes : layoutWithDagre(baseNodes, edges, doc.direction ?? 'LR');
  return { nodes, edges };
}

function hasValidPosition(pos?: FlowMapPosition): boolean {
  return typeof pos?.x === 'number' && Number.isFinite(pos.x) && typeof pos?.y === 'number' && Number.isFinite(pos.y);
}

export function updateDocLayoutFromNodes(doc: FlowMapDocument, nodes: Node[]): FlowMapDocument {
  const layout: Record<string, FlowMapPosition> = { ...(doc.layout ?? {}) };
  for (const node of nodes) {
    layout[node.id] = {
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
    };
  }
  return { ...doc, layout };
}
