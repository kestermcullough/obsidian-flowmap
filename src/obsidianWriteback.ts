import { Notice, TFile, type App } from 'obsidian';
import { replaceFlowMapBlockInText, type FlowMapBlockSection } from './flowMapBlockReplace';

export async function replaceFlowMapBlock(
  app: App,
  sourcePath: string,
  oldBlockSource: string,
  newBlockSource: string,
  sectionInfo?: FlowMapBlockSection | null,
): Promise<void> {
  const file = app.vault.getAbstractFileByPath(sourcePath);
  if (!(file instanceof TFile)) {
    throw new Error(`Could not locate current file: ${sourcePath}`);
  }

  const fileText = await app.vault.read(file);
  const updated = replaceFlowMapBlockInText(fileText, oldBlockSource, newBlockSource, sectionInfo);
  if (!updated) {
    throw new Error('Could not find the original flowmap block. Try switching away/back to refresh the view.');
  }
  await app.vault.modify(file, updated);
  new Notice('FlowMap layout saved.');
}
