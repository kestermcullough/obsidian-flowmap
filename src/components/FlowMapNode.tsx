import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface Props {
  data: {
    label: string;
    type?: string;
  };
}

export function FlowMapNode({ data }: Props) {
  return (
    <div className="flowmap-node">
      <Handle type="target" position={Position.Left} />
      {data.type && <div className="flowmap-node-type">{data.type}</div>}
      <div className="flowmap-node-label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
