import * as yaml from 'js-yaml';
import { FlowMapDocument, ParsedFlowMap } from './types';

const VALID_DIRECTIONS = ['LR', 'RL', 'TB', 'BT'];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateOptionalString(value: Record<string, unknown>, key: string, path: string, errors: string[]): void {
  if (value[key] !== undefined && typeof value[key] !== 'string') {
    errors.push(`${path}.${key} must be a string.`);
  }
}

function validateStringMap(value: unknown, path: string, errors: string[]): void {
  if (!isObject(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }
  Object.entries(value).forEach(([key, mapValue]) => {
    if (typeof mapValue !== 'string') {
      errors.push(`${path}.${key} must be a string.`);
    }
  });
}

function validateDataMap(value: unknown, path: string, errors: string[]): void {
  if (value !== undefined && !isObject(value)) {
    errors.push(`${path} must be an object.`);
  }
}

function validateDoc(value: unknown): string[] {
  const errors: string[] = [];
  if (!isObject(value)) return ['FlowMap YAML must parse to an object.'];

  validateOptionalString(value, 'title', 'root', errors);

  if (value.height !== undefined && (typeof value.height !== 'number' || !Number.isFinite(value.height) || value.height <= 0)) {
    errors.push('height must be a positive number.');
  }

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
      validateOptionalString(node, 'label', `nodes[${index}]`, errors);
      validateOptionalString(node, 'type', `nodes[${index}]`, errors);
      validateOptionalString(node, 'detail', `nodes[${index}]`, errors);
      if (node.links !== undefined) validateStringMap(node.links, `nodes[${index}].links`, errors);
      validateDataMap(node.data, `nodes[${index}].data`, errors);
    });

    if (value.edges !== undefined && !Array.isArray(value.edges)) {
      errors.push('edges must be an array when provided.');
    } else if (Array.isArray(value.edges)) {
      value.edges.forEach((edge, index) => {
        if (!isObject(edge)) {
          errors.push(`edges[${index}] must be an object.`);
          return;
        }
        if (typeof edge.from !== 'string') errors.push(`edges[${index}] missing string from.`);
        if (typeof edge.to !== 'string') errors.push(`edges[${index}] missing string to.`);
        if (typeof edge.from === 'string' && !seen.has(edge.from)) errors.push(`edges[${index}] references missing from node: ${edge.from}`);
        if (typeof edge.to === 'string' && !seen.has(edge.to)) errors.push(`edges[${index}] references missing to node: ${edge.to}`);
        validateOptionalString(edge, 'id', `edges[${index}]`, errors);
        validateOptionalString(edge, 'label', `edges[${index}]`, errors);
        validateOptionalString(edge, 'type', `edges[${index}]`, errors);
        validateOptionalString(edge, 'detail', `edges[${index}]`, errors);
        validateDataMap(edge.data, `edges[${index}].data`, errors);
      });
    }
  }

  if (value.direction !== undefined && (typeof value.direction !== 'string' || !VALID_DIRECTIONS.includes(value.direction))) {
    errors.push('direction must be one of LR, RL, TB, BT.');
  }

  if (value.groups !== undefined && !Array.isArray(value.groups)) {
    errors.push('groups must be an array when provided.');
  } else if (Array.isArray(value.groups)) {
    value.groups.forEach((group, index) => {
      if (!isObject(group)) {
        errors.push(`groups[${index}] must be an object.`);
        return;
      }
      if (typeof group.id !== 'string' || group.id.trim() === '') errors.push(`groups[${index}] is missing a non-empty string id.`);
      validateOptionalString(group, 'label', `groups[${index}]`, errors);
      if (!Array.isArray(group.nodes)) {
        errors.push(`groups[${index}].nodes must be an array.`);
      } else {
        group.nodes.forEach((nodeId, nodeIndex) => {
          if (typeof nodeId !== 'string') errors.push(`groups[${index}].nodes[${nodeIndex}] must be a string.`);
        });
      }
    });
  }

  if (value.layout !== undefined) {
    if (!isObject(value.layout)) {
      errors.push('layout must be an object when provided.');
    } else {
      Object.entries(value.layout).forEach(([nodeId, position]) => {
        if (!isObject(position)) {
          errors.push(`layout.${nodeId} must be an object.`);
          return;
        }
        if (typeof position.x !== 'number' || !Number.isFinite(position.x)) errors.push(`layout.${nodeId}.x must be a finite number.`);
        if (typeof position.y !== 'number' || !Number.isFinite(position.y)) errors.push(`layout.${nodeId}.y must be a finite number.`);
      });
    }
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
