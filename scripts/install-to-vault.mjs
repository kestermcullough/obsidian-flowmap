import fs from 'fs';
import os from 'os';
import path from 'path';

const vaultArg = process.argv[2] ?? process.env.OBSIDIAN_VAULT;

if (!vaultArg) {
  console.error('Usage: npm run install:vault -- <path-to-obsidian-vault>');
  console.error('Example: npm run install:vault -- "C:\\Users\\kmccullough\\Documents\\MyVault"');
  process.exit(1);
}

const projectRoot = process.cwd();
const vaultPath = normalizePath(vaultArg);
const pluginDir = path.join(vaultPath, '.obsidian', 'plugins', 'flowmap-mvp');
const files = ['main.js', 'manifest.json', 'styles.css'];

for (const file of files) {
  const source = path.join(projectRoot, file);
  if (!fs.existsSync(source)) {
    console.error(`Missing ${file}. Run npm run build first.`);
    process.exit(1);
  }
}

fs.mkdirSync(pluginDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(projectRoot, file), path.join(pluginDir, file));
}

console.log(`Installed FlowMap MVP to ${pluginDir}`);

function normalizePath(input) {
  const expanded = input.startsWith('~') ? path.join(os.homedir(), input.slice(1)) : input;
  const windowsDriveMatch = /^([a-zA-Z]):[\\/](.*)$/.exec(expanded);

  if (process.platform !== 'win32' && windowsDriveMatch) {
    const drive = windowsDriveMatch[1].toLowerCase();
    const rest = windowsDriveMatch[2].replace(/\\/g, '/');
    return path.resolve(`/mnt/${drive}/${rest}`);
  }

  return path.resolve(expanded);
}
