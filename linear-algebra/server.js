'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, 'data.js');
const BACKUP_DIR = path.join(ROOT, '.backups');
const MAX_BODY = 25 * 1024 * 1024;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8788;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
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

function readBank() {
  const source = fs.readFileSync(DATA_PATH, 'utf8');
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

function makeBackup() {
  if (!fs.existsSync(DATA_PATH)) return null;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `data-${stamp}.js`;
  const target = path.join(BACKUP_DIR, name);
  fs.copyFileSync(DATA_PATH, target);

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter((file) => /^data-.*\.js$/.test(file))
    .sort()
    .reverse();
  backups.slice(20).forEach((file) => {
    try {
      fs.unlinkSync(path.join(BACKUP_DIR, file));
    } catch (error) {
      console.warn('Unable to remove old backup:', file, error.message);
    }
  });
  return `.backups/${name}`;
}

function writeBank(data) {
  validateBank(data);
  const backup = makeBackup();
  const tempPath = path.join(ROOT, `.data-${process.pid}-${Date.now()}.tmp`);
  const content = 'const BANK = ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(tempPath, content, 'utf8');
  try {
    fs.renameSync(tempPath, DATA_PATH);
  } catch (error) {
    fs.copyFileSync(tempPath, DATA_PATH);
    fs.unlinkSync(tempPath);
  }
  const stat = fs.statSync(DATA_PATH);
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

async function handleApi(req, res, pathname) {
  if (pathname === '/api/info' && req.method === 'GET') {
    const stat = safeStat(DATA_PATH);
    let counts = { problems: 0, knowledge: 0, pitfalls: 0 };
    let valid = false;
    try {
      const bank = readBank();
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
      service: 'linear-algebra-content-admin',
      valid,
      counts,
      meta: stat ? {
        modifiedAt: stat.mtime.toISOString(),
        size: stat.size
      } : null
    });
    return;
  }

  if (pathname === '/api/data' && req.method === 'GET') {
    try {
      const data = readBank();
      const stat = fs.statSync(DATA_PATH);
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

  if (pathname === '/api/data' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (!body || !body.data) throw new Error('请求中缺少 data');
      const meta = writeBank(body.data);
      sendJson(res, 200, { ok: true, meta });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'API 路径不存在' });
}

function serveStatic(req, res, pathname) {
  let relative = pathname === '/' ? '/index.html' : pathname;
  if (relative === '/admin' || relative === '/admin/') relative = '/admin.html';

  const blocked = relative.startsWith('/.') ||
    relative === '/server.js' ||
    relative === '/package.json' ||
    relative === '/package-lock.json';
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

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname);
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
  console.log(`管理后台：http://${HOST}:${PORT}/admin.html`);
  console.log(`公开网站：http://${HOST}:${PORT}/`);
});
