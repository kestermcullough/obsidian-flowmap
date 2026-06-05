import { useCallback, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { App, Notice } from 'obsidian';
import { FlowMapDocument } from '../types';
import { flowMapToReactFlow, updateDocLayoutFromNodes } from '../convert';
import { layoutWithDagre } from '../layout';
import { stringifyFlowMap } from '../parser';
import { replaceFlowMapBlock } from '../obsidianWriteback';
import type { FlowMapBlockSection } from '../flowMapBlockReplace';
import { FlowMapNode } from './FlowMapNode';
import { DetailsPanel } from './DetailsPanel';

const nodeTypes = { flowMapNode: FlowMapNode };

interface FlowMapEmbedProps {
  app: App;
  doc: FlowMapDocument;
  source: string;
  sourcePath: string;
  getSourceSection?: () => FlowMapBlockSection | null;
}

export function FlowMapEmbed(props: FlowMapEmbedProps) {
  return (
    <ReactFlowProvider>
      <FlowMapCanvas {...props} />
    </ReactFlowProvider>
  );
}

function FlowMapCanvas({ app, doc, source, sourcePath, getSourceSection }: FlowMapEmbedProps) {
  const initial = useMemo(() => flowMapToReactFlow(doc), [doc]);
  const [nodes, setNodes, onNodesChangeBase] = useNodesState(initial.nodes);
  const [edges] = useEdgesState(initial.edges);
  const [arrangeMode, setArrangeMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { fitView, setCenter } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (!arrangeMode) return;
      onNodesChangeBase(changes);
    },
    [arrangeMode, onNodesChangeBase],
  );

  const runAutoLayout = useCallback(() => {
    setNodes((current) => layoutWithDagre(current, edges, doc.direction ?? 'LR'));
    window.setTimeout(() => fitView({ padding: 0.2, duration: 350 }), 0);
  }, [doc.direction, edges, fitView, setNodes]);

  const saveLayout = useCallback(async () => {
    try {
      const updatedDoc = updateDocLayoutFromNodes(doc, nodes);
      await replaceFlowMapBlock(app, sourcePath, source, stringifyFlowMap(updatedDoc), getSourceSection?.() ?? null);
    } catch (error) {
      new Notice(error instanceof Error ? error.message : String(error));
    }
  }, [app, doc, getSourceSection, nodes, source, sourcePath]);

  const focusSelected = useCallback(() => {
    if (!selectedNode) return;
    setCenter(selectedNode.position.x + 110, selectedNode.position.y + 45, { zoom: 1.4, duration: 350 });
  }, [selectedNode, setCenter]);

  return (
    <div className="flowmap-shell" style={{ height: `${doc.height ?? 620}px` }}>
      <div className="flowmap-toolbar">
        <strong>{doc.title ?? 'FlowMap'}</strong>
        <span className="flowmap-toolbar-spacer" />
        <button onClick={() => fitView({ padding: 0.2, duration: 350 })}>Fit</button>
        <button onClick={runAutoLayout}>Auto-layout</button>
        <button aria-pressed={arrangeMode} className={arrangeMode ? 'is-active' : ''} onClick={() => setArrangeMode((v) => !v)}>
          {arrangeMode ? 'Arrange: on' : 'Arrange: off'}
        </button>
        <button disabled={!arrangeMode} onClick={saveLayout}>Save layout</button>
        <button disabled={!selectedNode} onClick={focusSelected}>Focus node</button>
      </div>
      <div className="flowmap-canvas-row">
        <div className="flowmap-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesDraggable={arrangeMode}
            nodesConnectable={false}
            elementsSelectable
            onNodesChange={onNodesChange}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
        <DetailsPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
}
