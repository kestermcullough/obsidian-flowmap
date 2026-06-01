import React from 'react';
import { Node } from '@xyflow/react';

interface Props {
  selectedNode: Node | null;
  onClose: () => void;
}

export function DetailsPanel({ selectedNode, onClose }: Props) {
  if (!selectedNode) return null;
  const data = selectedNode.data as Record<string, unknown>;
  const links = data.links as Record<string, string> | undefined;
  const customData = data.data as Record<string, unknown> | undefined;

  return (
    <aside className="flowmap-details">
      <div className="flowmap-details-header">
        <div>
          <div className="flowmap-details-title">{String(data.label ?? selectedNode.id)}</div>
          {data.type && <div className="flowmap-details-subtitle">{String(data.type)}</div>}
        </div>
        <button onClick={onClose} aria-label="Close details">×</button>
      </div>

      {data.detail && <pre className="flowmap-details-text">{String(data.detail)}</pre>}

      {links && Object.keys(links).length > 0 && (
        <section>
          <h4>Links</h4>
          <ul>
            {Object.entries(links).map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer">{label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {customData && Object.keys(customData).length > 0 && (
        <section>
          <h4>Data</h4>
          <dl>
            {Object.entries(customData).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      )}
    </aside>
  );
}
