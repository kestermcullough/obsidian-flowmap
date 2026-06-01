import yaml from 'js-yaml';
import { FlowMapDocument, ParsedFlowMap } from './types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateDoc(value: unknown): string[] {
  const errors: string[] = [];
  if (!isObject(value)) return ['FlowMap YAML must parse to an object.'];

  if (!Array.isArray(value.nodes)) {
    errors.push('Missing required top-level `nodes:` array.');
  } else {
    const seen = new Set<string>();
    value.nodes.forEach((node, index) => {
      if (!isObject(node)) {
        errors.push(`nodes[${index}] must be an object.`);
        return;
      }
      if (typeof node.id !== 'string' || node.id.trim() === '') {
        errors.push(`nodes[${index}] is missing a non-empty string id.`);
        return;
      }
      if (seen.has(node.id)) errors.push(`Duplicate node id: ${node.id}`);
      seen.add(node.id);
    });

    if (Array.isArray(value.edges)) {
      value.edges.forEach((edge, index) => {
        if (!isObject(edge)) {
          errors.push(`edges[${index}] must be an object.`);
          return;
        }
        if (typeof edge.from !== 'string') errors.push(`edges[${index}] missing string from.`);
        if (typeof edge.to !== 'string') errors.push(`edges[${index}] missing string to.`);
        if (typeof edge.from === 'string' && !seen.has(edge.from)) errors.push(`edges[${index}] references missing from node: ${edge.from}`);
        if (typeof edge.to === 'string' && !seen.has(edge.to)) errors.push(`edges[${index}] references missing to node: ${edge.to}`);
      });
    }
  }

  if (value.direction && !['LR', 'RL', 'TB', 'BT'].includes(String(value.direction))) {
    errors.push('direction must be one of LR, RL, TB, BT.');
  }

  return errors;
}

export function parseFlowMap(source: string): ParsedFlowMap {
  try {
    const raw = yaml.load(source);
    const errors = validateDoc(raw);
    if (errors.length > 0) return { doc: null, errors };
    return { doc: raw as FlowMapDocument, errors: [] };
  } catch (error) {
    return { doc: null, errors: [error instanceof Error ? error.message : String(error)] };
  }
}

export function stringifyFlowMap(doc: FlowMapDocument): string {
  return yaml.dump(doc, {
    noRefs: true,
    lineWidth: 100,
    sortKeys: false,
  }).trimEnd();
}
