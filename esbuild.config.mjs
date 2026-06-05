import esbuild from 'esbuild';
import process from 'process';
import builtins from 'builtin-modules';
import fs from 'fs';

const banner = `/* FlowMap MVP generated handoff build */`;
const prod = process.argv[2] === 'production';
const watch = process.argv[2] === '--watch';

const context = await esbuild.context({
  banner: { js: banner },
  entryPoints: ['src/main.tsx'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
});

if (watch) {
  await context.watch();
  console.log('Watching FlowMap MVP...');
} else {
  await context.rebuild();
  await context.dispose();
  if (fs.existsSync('main.css')) {
    fs.copyFileSync('main.css', 'styles.css');
    fs.rmSync('main.css');
  }
}
