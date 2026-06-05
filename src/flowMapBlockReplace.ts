export interface FlowMapBlockSection {
  text: string;
  lineStart: number;
  lineEnd: number;
}

interface LineSegment {
  content: string;
  ending: string;
  raw: string;
}

interface ReplacementResult {
  updated: string | null;
  foundFence: boolean;
}

export function replaceFlowMapBlockInText(
  fileText: string,
  oldBlockSource: string,
  newBlockSource: string,
  sectionInfo?: FlowMapBlockSection | null,
): string | null {
  const lines = splitLinesPreserveEndings(fileText);

  if (sectionInfo && isValidSectionInfo(sectionInfo)) {
    const sectionResult = replaceMatchingFenceInRange(lines, fileText, sectionInfo.lineStart, sectionInfo.lineEnd, oldBlockSource, newBlockSource);
    if (sectionResult.updated) return sectionResult.updated;

    const expandedResult = replaceMatchingFenceInRange(lines, fileText, sectionInfo.lineStart, sectionInfo.lineEnd + 1, oldBlockSource, newBlockSource);
    if (expandedResult.updated) return expandedResult.updated;

    if (sectionResult.foundFence || expandedResult.foundFence) return null;
  }

  return replaceMatchingFenceInRange(lines, fileText, 0, lines.length - 1, oldBlockSource, newBlockSource).updated;
}

function replaceMatchingFenceInRange(
  lines: LineSegment[],
  fileText: string,
  rangeStart: number,
  rangeEnd: number,
  oldBlockSource: string,
  newBlockSource: string,
): ReplacementResult {
  const start = Math.max(0, rangeStart);
  const end = Math.min(lines.length - 1, rangeEnd);
  let foundFence = false;

  for (let openingIndex = start; openingIndex <= end; openingIndex += 1) {
    const opening = parseFlowMapOpeningFence(lines[openingIndex].content);
    if (!opening) continue;

    const closingIndex = findClosingFence(lines, openingIndex + 1, end, opening.marker);
    if (closingIndex === -1) continue;

    foundFence = true;
    const body = lines.slice(openingIndex + 1, closingIndex).map((line) => line.raw).join('');
    if (normalize(body) !== normalize(oldBlockSource)) continue;

    const lineEnding = lines[openingIndex].ending || detectLineEnding(fileText);
    const replacement = `${lines[openingIndex].raw}${normalizeLineEndings(newBlockSource.trimEnd(), lineEnding)}${lineEnding}${lines[closingIndex].raw}`;
    return {
      foundFence,
      updated: [
        ...lines.slice(0, openingIndex).map((line) => line.raw),
        replacement,
        ...lines.slice(closingIndex + 1).map((line) => line.raw),
      ].join(''),
    };
  }

  return { foundFence, updated: null };
}

function parseFlowMapOpeningFence(line: string): { marker: string } | null {
  const match = /^([ \t]*)(`{3,}|~{3,})[ \t]*flowmap(?:[ \t].*)?$/i.exec(line);
  if (!match) return null;
  return { marker: match[2] };
}

function findClosingFence(lines: LineSegment[], start: number, end: number, openingMarker: string): number {
  const markerChar = escapeRegExp(openingMarker[0]);
  const closingPattern = new RegExp(`^[ \\t]*${markerChar}{${openingMarker.length},}[ \\t]*$`);
  for (let index = start; index <= end; index += 1) {
    if (closingPattern.test(lines[index].content)) return index;
  }
  return -1;
}

function splitLinesPreserveEndings(text: string): LineSegment[] {
  const lines: LineSegment[] = [];
  const pattern = /([^\r\n]*)(\r\n|\n|\r)?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match[0] === '' && match.index === text.length) break;
    lines.push({
      content: match[1],
      ending: match[2] ?? '',
      raw: match[0],
    });
  }

  return lines;
}

function detectLineEnding(text: string): string {
  return text.match(/\r\n|\n|\r/)?.[0] ?? '\n';
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function normalizeLineEndings(text: string, lineEnding: string): string {
  return text.replace(/\r\n|\n|\r/g, lineEnding);
}

function isValidSectionInfo(sectionInfo: FlowMapBlockSection): boolean {
  return Number.isInteger(sectionInfo.lineStart) && Number.isInteger(sectionInfo.lineEnd) && sectionInfo.lineStart >= 0 && sectionInfo.lineEnd >= sectionInfo.lineStart;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
