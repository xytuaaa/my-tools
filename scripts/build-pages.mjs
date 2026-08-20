import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDir = process.argv[2];
const outputDir = process.argv[3];
if (!sourceDir || !outputDir) {
  throw new Error('Usage: node scripts/build-pages.mjs <sourceDir> <outputDir>');
}

await mkdir(outputDir, { recursive: true });
await cp(join(sourceDir, 'assets'), join(outputDir, 'assets'), { recursive: true });

let html = await readFile(join(sourceDir, 'nba-perfect-player.html'), 'utf8');
const cssMarker = '<link href="assets/css/perfect-player-premium.css" rel="stylesheet">';
const badgeStyle = `
<style>
  .github-repo-badge{position:fixed;top:max(12px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right));z-index:10000;display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid rgba(45,31,14,.14);border-radius:999px;background:rgba(255,250,242,.92);color:#2d1f0e;box-shadow:0 3px 14px rgba(45,31,14,.12);font:700 12px/1 var(--font-body);text-decoration:none;backdrop-filter:blur(8px)}
  .github-repo-badge:hover{transform:translateY(-1px)}
  .github-repo-badge svg{width:17px;height:17px;fill:currentColor}
  @media(max-width:420px){.github-repo-badge span{display:none}.github-repo-badge{padding:9px}}
</style>`;
const badge = `
<a class="github-repo-badge" href="https://github.com/xytuaaa/my-tools" target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看项目" title="在 GitHub 查看项目">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.2.8-.5v-2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2A11.5 11.5 0 0 1 12 6.8c1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7Z"/></svg>
  <span>GitHub</span>
</a>`;

if (!html.includes(cssMarker) || !html.includes('<body>')) {
  throw new Error('Expected HTML insertion markers were not found');
}
html = html.replace(cssMarker, cssMarker + badgeStyle);
html = html.replace('<body>', '<body>\n' + badge);
await writeFile(join(outputDir, 'nba-perfect-player.html'), html);

const index = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>NBA 完美球员</title>
  <meta http-equiv="refresh" content="0;url=./nba-perfect-player.html">
</head>
<body>
  <p>正在进入 NBA 完美球员……</p>
  <p><a href="./nba-perfect-player.html">点此进入游戏</a></p>
  <script>location.replace('./nba-perfect-player.html');</script>
</body>
</html>`;
await writeFile(join(outputDir, 'index.html'), index);
await writeFile(join(outputDir, '.nojekyll'), '');
