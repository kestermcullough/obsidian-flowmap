export type FlowDirection = 'LR' | 'RL' | 'TB' | 'BT';

export interface FlowMapDocument {
  title?: string;
  direction?: FlowDirection;
  height?: number;
  nodes: FlowMapNode[];
  edges?: FlowMapEdge[];
  groups?: FlowMapGroup[];
  layout?: Record<string, FlowMapPosition>;
}

export interface FlowMapPosition {
  x: number;
  y: number;
}

export interface FlowMapNode {
  id: string;
  label?: string;
  type?: string;
  detail?: string;
  links?: Record<string, string>;
  data?: Record<string, unknown>;
}

export interface FlowMapEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  type?: string;
  detail?: string;
  data?: Record<string, unknown>;
}

export interface FlowMapGroup {
  id: string;
  label?: string;
  nodes: string[];
}

export interface ParsedFlowMap {
  doc: FlowMapDocument | null;
  errors: string[];
}
