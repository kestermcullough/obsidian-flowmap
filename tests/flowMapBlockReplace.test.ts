import { describe, expect, it } from 'vitest';
import { replaceFlowMapBlockInText } from '../src/flowMapBlockReplace';

const oldSource = 'nodes:\n  - id: a';
const newSource = 'nodes:\n  - id: a\nlayout:\n  a:\n    x: 10\n    y: 20';

describe('replaceFlowMapBlockInText', () => {
  it('uses section lines to replace the intended duplicate block', () => {
    const fileText = [
      '# Note',
      '```flowmap',
      oldSource,
      '```',
      'Between',
      '```flowmap',
      oldSource,
      '```',
      '',
    ].join('\n');

    const updated = replaceFlowMapBlockInText(fileText, oldSource, newSource, {
      text: ['```flowmap', oldSource, '```'].join('\n'),
      lineStart: 6,
      lineEnd: 9,
    });

    expect(updated).not.toBeNull();
    expect(updated?.indexOf('layout:')).toBe(updated?.lastIndexOf('layout:'));
    expect(updated?.split('Between\n')[1]).toContain('layout:');
  });

  it('does not fall back to another duplicate when the targeted block changed', () => {
    const fileText = [
      '# Note',
      '```flowmap',
      oldSource,
      '```',
      'Between',
      '```flowmap',
      'nodes:\n  - id: changed',
      '```',
      '',
    ].join('\n');

    const updated = replaceFlowMapBlockInText(fileText, oldSource, newSource, {
      text: ['```flowmap', oldSource, '```'].join('\n'),
      lineStart: 6,
      lineEnd: 9,
    });

    expect(updated).toBeNull();
  });

  it('preserves CRLF line endings around the replacement', () => {
    const fileText = ['```flowmap', oldSource, '```', ''].join('\r\n');
    const updated = replaceFlowMapBlockInText(fileText, oldSource, newSource);

    expect(updated).toContain('layout:\r\n');
    expect(updated).not.toContain('layout:\n  a:');
  });

  it('supports tilde fences and trailing opening-fence whitespace', () => {
    const fileText = ['~~~flowmap   ', oldSource, '~~~', ''].join('\n');
    const updated = replaceFlowMapBlockInText(fileText, oldSource, newSource);

    expect(updated).toContain('~~~flowmap   \n');
    expect(updated).toContain('layout:');
  });
});
