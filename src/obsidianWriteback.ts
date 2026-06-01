import { App, Notice, TFile } from 'obsidian';

export async function replaceFlowMapBlock(app: App, sourcePath: string, oldBlockSource: string, newBlockSource: string): Promise<void> {
  const file = app.vault.getAbstractFileByPath(sourcePath);
  if (!(file instanceof TFile)) {
    throw new Error(`Could not locate current file: ${sourcePath}`);
  }

  const fileText = await app.vault.read(file);
  const updated = replaceFirstMatchingFence(fileText, oldBlockSource, newBlockSource);
  if (!updated) {
    throw new Error('Could not find the original flowmap block. Try switching away/back to refresh the view.');
  }
  await app.vault.modify(file, updated);
  new Notice('FlowMap layout saved.');
}

function replaceFirstMatchingFence(fileText: string, oldBlockSource: string, newBlockSource: string): string | null {
  const fencePattern = /(^|\n)(```flowmap\s*\n)([\s\S]*?)(\n```)/g;
  let match: RegExpExecArray | null;
  while ((match = fencePattern.exec(fileText)) !== null) {
    const body = match[3];
    if (normalize(body) === normalize(oldBlockSource)) {
      const replacement = `${match[1]}${match[2]}${newBlockSource}${match[4]}`;
      return fileText.slice(0, match.index) + replacement + fileText.slice(match.index + match[0].length);
    }
  }
  return null;
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, '\n').trim();
}
