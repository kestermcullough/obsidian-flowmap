import { MarkdownRenderChild, Notice, Plugin } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { parseFlowMap } from './parser';
import { FlowMapEmbed } from './components/FlowMapEmbed';
import '@xyflow/react/dist/style.css';
import './styles.css';

const CODE_BLOCK = 'flowmap';

class FlowMapRenderChild extends MarkdownRenderChild {
  private root: Root | null = null;

  constructor(
    containerEl: HTMLElement,
    private readonly render: (root: Root) => void,
  ) {
    super(containerEl);
  }

  onload() {
    this.root = createRoot(this.containerEl);
    this.render(this.root);
  }

  onunload() {
    this.root?.unmount();
    this.root = null;
  }
}

export default class FlowMapPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(CODE_BLOCK, (source, el, ctx) => {
      const parsed = parseFlowMap(source);
      const child = new FlowMapRenderChild(el, (root) => {
        if (!parsed.doc) {
          root.render(
            <div className="flowmap-error">
              <strong>FlowMap parse error</strong>
              <ul>{parsed.errors.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>,
          );
          return;
        }

        root.render(
          <FlowMapEmbed
            app={this.app}
            doc={parsed.doc}
            source={source}
            sourcePath={ctx.sourcePath}
            getSourceSection={() => ctx.getSectionInfo(el)}
          />,
        );
      });
      ctx.addChild(child);
    });

    this.addCommand({
      id: 'insert-flowmap-example',
      name: 'Insert FlowMap example block',
      editorCallback: (editor) => {
        editor.replaceSelection(exampleBlock());
        new Notice('Inserted FlowMap example.');
      },
    });
  }
}

function exampleBlock(): string {
  return `\n\`\`\`flowmap\ntitle: Churn Model Pipeline\ndirection: LR\nheight: 620\n\nnodes:\n  - id: raw-events\n    label: Raw Events\n    type: delta-table\n    detail: |\n      Source event table used for feature generation.\n    links:\n      catalog: https://example.com/catalog/raw-events\n    data:\n      owner: data-platform\n      freshness: hourly\n\n  - id: feature-job\n    label: Feature Engineering Job\n    type: databricks-job\n    detail: |\n      Builds hourly features for churn prediction.\n    links:\n      job: https://example.com/databricks/job/123\n    data:\n      owner: ml-platform\n      cadence: hourly\n\n  - id: train-model\n    label: Train Churn Model\n    type: notebook\n    data:\n      owner: ml-platform\n\n  - id: registry\n    label: MLflow Registry\n    type: model-registry\n\nedges:\n  - from: raw-events\n    to: feature-job\n    label: reads\n  - from: feature-job\n    to: train-model\n    label: trains from\n  - from: train-model\n    to: registry\n    label: registers\n\`\`\`\n`;
}
