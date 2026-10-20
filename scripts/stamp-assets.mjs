// 部署前给页面里引用的本地 JS / CSS 加上内容指纹（?v=哈希），并生成 Netlify 的 _headers，
// 让这些文件可以被浏览器长期缓存；文件内容一变，指纹就变，访客会立刻拿到新版本。
//
// 只在 Netlify 构建时运行（见 netlify.toml），会直接改写构建目录里的 HTML。
// 仓库里的源文件不受影响，本地 npm start 也不受影响。
//
// 用法：node scripts/stamp-assets.mjs [--dry-run]

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'netlify', 'scripts', '.backups', '.comments']);
const LONG_CACHE = 'public, max-age=31536000, immutable';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const toUrlPath = (file) => '/' + relative(ROOT, file).split(sep).join('/');
const hashCache = new Map();
function fingerprint(file) {
  if (!hashCache.has(file)) {
    hashCache.set(file, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10));
  }
  return hashCache.get(file);
}

// 匹配 src="..." / href="..." 里指向本地 .js / .css 的引用（不含外链与已带查询串的）
const REF = /\b(src|href)="(?!https?:|\/\/|data:)([^"?#]+\.(?:js|css))"/g;
const longCached = new Set();
let stampedRefs = 0;
const problems = [];

for (const page of walk(ROOT)) {
  const html = readFileSync(page, 'utf8');
  const next = html.replace(REF, (match, attr, ref) => {
    const target = ref.startsWith('/') ? join(ROOT, ref) : resolve(dirname(page), ref);
    if (!target.startsWith(ROOT) || !existsSync(target)) {
      problems.push(`${toUrlPath(page)} 引用了不存在的文件：${ref}`);
      return match;
    }
    longCached.add(toUrlPath(target));
    stampedRefs += 1;
    return `${attr}="${ref}?v=${fingerprint(target)}"`;
  });
  if (next !== html && !DRY_RUN) writeFileSync(page, next);
}

// 本地托管的第三方库按版本号分目录，目录内文件（含字体）都可长期缓存
const VENDOR = join(ROOT, 'shared', 'vendor');
if (existsSync(VENDOR)) {
  (function addVendor(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) addVendor(full);
      else if (/\.(js|css|woff2)$/.test(name)) longCached.add(toUrlPath(full));
    }
  })(VENDOR);
}

if (problems.length) {
  console.error('资源指纹失败，已中止部署：\n' + problems.join('\n'));
  process.exit(1);
}

// 每个文件单独列一条规则：只有确实带指纹（或按版本分目录）的文件才会被长期缓存
const rules = [...longCached].sort().map((path) => `${path}\n  Cache-Control: ${LONG_CACHE}`);
const headers = '# 由 scripts/stamp-assets.mjs 在构建时生成，请勿手动修改\n' + rules.join('\n') + '\n';
if (!DRY_RUN) writeFileSync(join(ROOT, '_headers'), headers);

console.log(`资源指纹：${stampedRefs} 处引用，${longCached.size} 个文件设为长期缓存${DRY_RUN ? '（试运行，未写入）' : ''}`);
