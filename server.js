'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const MAX_BODY = 25 * 1024 * 1024;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8787;

const BANKS = {
  '/calculus': {
    name: 'calculus',
    dataPath: path.join(ROOT, 'calculus', 'data.js'),
    backupDir: path.join(ROOT, 'calculus', '.backups')
  },
  '/linear-algebra': {
    name: 'linear-algebra',
    dataPath: path.join(ROOT, 'linear-algebra', 'data.js'),
    backupDir: path.join(ROOT, 'linear-algebra', '.backups')
  }
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function safeStat(file) {
  try {
    return fs.statSync(file);
  } catch (error) {
    return null;
  }
}

function readBank(config) {
  const source = fs.readFileSync(config.dataPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { timeout: 2000 });
  const bank = vm.runInContext('BANK', sandbox, { timeout: 1000 });
  if (!bank || typeof bank !== 'object' || Array.isArray(bank)) {
    throw new Error('data.js 中没有有效的 BANK 对象');
  }
  return bank;
}

function validateBank(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('数据必须是对象');
  }
  ['problems', 'knowledge', 'pitfalls'].forEach((key) => {
    if (!Array.isArray(data[key])) {
      throw new Error(`缺少 ${key} 数组`);
    }
    data[key].forEach((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error(`${key}[${index}] 必须是对象`);
      }
    });
  });
}

function makeBackup(config) {
  if (!fs.existsSync(config.dataPath)) return null;
  fs.mkdirSync(config.backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `data-${stamp}.js`;
  const target = path.join(config.backupDir, name);
  fs.copyFileSync(config.dataPath, target);

  const backups = fs.readdirSync(config.backupDir)
    .filter((file) => /^data-.*\.js$/.test(file))
    .sort()
    .reverse();
  backups.slice(20).forEach((file) => {
    try {
      fs.unlinkSync(path.join(config.backupDir, file));
    } catch (error) {
      console.warn('Unable to remove old backup:', file, error.message);
    }
  });
  return path.relative(ROOT, target).replace(/\\/g, '/');
}

function writeBank(config, data) {
  validateBank(data);
  const backup = makeBackup(config);
  const tempPath = path.join(ROOT, `.data-${config.name}-${process.pid}-${Date.now()}.tmp`);
  const content = 'const BANK = ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(tempPath, content, 'utf8');
  try {
    fs.renameSync(tempPath, config.dataPath);
  } catch (error) {
    fs.copyFileSync(tempPath, config.dataPath);
    fs.unlinkSync(tempPath);
  }
  const stat = fs.statSync(config.dataPath);
  return {
    modifiedAt: stat.mtime.toISOString(),
    size: stat.size,
    backup,
    counts: {
      problems: data.problems.length,
      knowledge: data.knowledge.length,
      pitfalls: data.pitfalls.length
    }
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('请求体超过 25 MB 限制'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error('请求体不是有效 JSON'));
      }
    });
    req.on('error', reject);
  });
}

function resolveApi(pathname) {
  for (const prefix of Object.keys(BANKS)) {
    if (pathname === `${prefix}/api/data` || pathname === `${prefix}/api/info`) {
      return {
        config: BANKS[prefix],
        type: pathname.endsWith('/info') ? 'info' : 'data'
      };
    }
  }
  return null;
}

async function handleApi(req, res, api) {
  const config = api.config;
  if (api.type === 'info' && req.method === 'GET') {
    const stat = safeStat(config.dataPath);
    let counts = { problems: 0, knowledge: 0, pitfalls: 0 };
    let valid = false;
    try {
      const bank = readBank(config);
      counts = {
        problems: Array.isArray(bank.problems) ? bank.problems.length : 0,
        knowledge: Array.isArray(bank.knowledge) ? bank.knowledge.length : 0,
        pitfalls: Array.isArray(bank.pitfalls) ? bank.pitfalls.length : 0
      };
      valid = true;
    } catch (error) {
      counts.error = error.message;
    }
    sendJson(res, 200, {
      ok: true,
      service: `${config.name}-content-admin`,
      valid,
      counts,
      meta: stat ? {
        modifiedAt: stat.mtime.toISOString(),
        size: stat.size
      } : null
    });
    return;
  }

  if (api.type === 'data' && req.method === 'GET') {
    try {
      const data = readBank(config);
      const stat = fs.statSync(config.dataPath);
      sendJson(res, 200, {
        ok: true,
        data,
        meta: {
          modifiedAt: stat.mtime.toISOString(),
          size: stat.size,
          backup: '发布时自动保存到 .backups'
        }
      });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (api.type === 'data' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (!body || !body.data) throw new Error('请求中缺少 data');
      const meta = writeBank(config, body.data);
      sendJson(res, 200, { ok: true, meta });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'API 路径或请求方法不存在' });
}

function serveStatic(req, res, pathname) {
  let relative = pathname === '/' ? '/index.html' : pathname;
  if (relative.endsWith('/')) relative += 'index.html';

  const blocked = relative.startsWith('/.') ||
    relative.includes('/.backups/') ||
    relative === '/server.js' ||
    relative === '/package.json' ||
    relative === '/package-lock.json' ||
    relative === '/netlify.toml';
  if (blocked) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(relative);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const filePath = path.resolve(ROOT, '.' + decoded);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  const stat = safeStat(filePath);
  if (!stat || !stat.isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache'
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const api = resolveApi(pathname);
  if (api) {
    handleApi(req, res, api);
    return;
  }
  if (pathname.startsWith('/api/') || pathname.includes('/api/')) {
    sendJson(res, 404, { ok: false, error: 'API 路径不存在' });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
    res.end('Method not allowed');
    return;
  }
  serveStatic(req, res, pathname);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用。可设置 PORT 环境变量后重试。`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`题库目录：http://${HOST}:${PORT}/`);
  console.log(`微积分题库：http://${HOST}:${PORT}/calculus/`);
  console.log(`线性代数题库：http://${HOST}:${PORT}/linear-algebra/`);
});
