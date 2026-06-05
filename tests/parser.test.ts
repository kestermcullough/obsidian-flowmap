import { describe, expect, it } from 'vitest';
import { parseFlowMap, stringifyFlowMap } from '../src/parser';

describe('parseFlowMap', () => {
  it('parses a valid minimal flowmap', () => {
    const result = parseFlowMap(`
title: Example
direction: LR
height: 400
nodes:
  - id: source
    label: Source
edges: []
`);

    expect(result.errors).toEqual([]);
    expect(result.doc?.nodes[0].id).toBe('source');
    expect(result.doc?.height).toBe(400);
  });

  it('reports missing edge references', () => {
    const result = parseFlowMap(`
nodes:
  - id: source
edges:
  - from: source
    to: missing
`);

    expect(result.doc).toBeNull();
    expect(result.errors).toContain('edges[0] references missing to node: missing');
  });

  it('rejects malformed optional structures', () => {
    const result = parseFlowMap(`
direction: sideways
height: -1
nodes:
  - id: source
    links:
      catalog: 123
edges:
  from: source
layout:
  source:
    x: no
    y: 10
groups:
  - id: group
    nodes: source
`);

    expect(result.doc).toBeNull();
    expect(result.errors).toEqual(expect.arrayContaining([
      'direction must be one of LR, RL, TB, BT.',
      'height must be a positive number.',
      'nodes[0].links.catalog must be a string.',
      'edges must be an array when provided.',
      'layout.source.x must be a finite number.',
      'groups[0].nodes must be an array.',
    ]));
  });
});

describe('stringifyFlowMap', () => {
  it('round trips layout positions', () => {
    const yaml = stringifyFlowMap({
      nodes: [{ id: 'source' }],
      layout: { source: { x: 12, y: 34 } },
    });

    const result = parseFlowMap(yaml);
    expect(result.doc?.layout?.source).toEqual({ x: 12, y: 34 });
  });
});
