'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = __dirname;
const MAX_BODY = 25 * 1024 * 1024;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8787;

const BANKS = {
  '/calculus': {
    name: 'calculus',
    dataPath: path.join(ROOT, 'calculus', 'data.js'),
    backupDir: path.join(ROOT, 'calculus', '.backups'),
    commentsPath: path.join(ROOT, 'calculus', '.comments', 'comments.json')
  },
  '/linear-algebra': {
    name: 'linear-algebra',
    dataPath: path.join(ROOT, 'linear-algebra', 'data.js'),
    backupDir: path.join(ROOT, 'linear-algebra', '.backups'),
    commentsPath: path.join(ROOT, 'linear-algebra', '.comments', 'comments.json')
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

function readComments(config) {
  if (!fs.existsSync(config.commentsPath)) return [];
  try {
    const value = JSON.parse(fs.readFileSync(config.commentsPath, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn('Unable to read comments:', error.message);
    return [];
  }
}

function writeComments(config, comments) {
  fs.mkdirSync(path.dirname(config.commentsPath), { recursive: true });
  const temp = `${config.commentsPath}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(comments, null, 2), 'utf8');
  try {
    fs.renameSync(temp, config.commentsPath);
  } catch (error) {
    fs.copyFileSync(temp, config.commentsPath);
    fs.unlinkSync(temp);
  }
}

function cleanCommentText(value, max) {
  const text = String(value || '').replace(/\r\n/g, '\n').trim();
  if (!text) throw new Error('批注内容不能为空');
  if (text.length > max) throw new Error(`批注最多 ${max} 字`);
  return text;
}

function cleanNickname(value) {
  const name = String(value || '').trim().replace(/\s+/g, ' ');
  if (!name) throw new Error('请填写昵称');
  return name.slice(0, 24);
}

function publicComment(comment, clientId) {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  return {
    id: comment.id,
    nickname: comment.nickname,
    text: comment.text,
    createdAt: comment.createdAt,
    likeCount: likes.length,
    liked: likes.includes(clientId),
    replies: (Array.isArray(comment.replies) ? comment.replies : []).map((reply) => {
      const replyLikes = Array.isArray(reply.likes) ? reply.likes : [];
      return {
        id: reply.id,
        nickname: reply.nickname,
        text: reply.text,
        createdAt: reply.createdAt,
        likeCount: replyLikes.length,
        liked: replyLikes.includes(clientId)
      };
    })
  };
}

function commentHeat(comment) {
  const likes = Array.isArray(comment.likes) ? comment.likes.length : 0;
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  return likes * 2 + replies.length + replies.reduce((sum, reply) => {
    return sum + (Array.isArray(reply.likes) ? reply.likes.length : 0);
  }, 0);
}

async function handleComments(req, res, config, requestUrl) {
  let comments = readComments(config);
  const countsMode = requestUrl.searchParams.get('counts') === '1';
  if (req.method === 'GET' && countsMode) {
    const counts = {};
    comments.forEach((comment) => {
      const key = comment.sectionKey;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1 + (Array.isArray(comment.replies) ? comment.replies.length : 0);
    });
    sendJson(res, 200, { ok: true, counts });
    return;
  }

  if (req.method === 'GET') {
    const sectionKey = String(requestUrl.searchParams.get('sectionKey') || '');
    const clientId = String(requestUrl.searchParams.get('clientId') || '');
    const sort = requestUrl.searchParams.get('sort') === 'hot' ? 'hot' : 'time';
    const list = comments.filter((comment) => comment.sectionKey === sectionKey);
    list.sort(sort === 'hot'
      ? (a, b) => commentHeat(b) - commentHeat(a) || String(b.createdAt).localeCompare(String(a.createdAt))
      : (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    sendJson(res, 200, {
      ok: true,
      comments: list.map((comment) => publicComment(comment, clientId))
    });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: '请求方法不支持' });
    return;
  }

  try {
    const body = await readBody(req);
    const action = String(body.action || '');
    const clientId = String(body.clientId || '');
    const sectionKey = String(body.sectionKey || '').slice(0, 240);
    if (!clientId || clientId.length > 100) throw new Error('用户标识无效');
    if (!sectionKey) throw new Error('缺少小节标识');

    if (action === 'add') {
      const sectionComments = comments.filter((comment) => comment.sectionKey === sectionKey);
      if (sectionComments.length >= 300) throw new Error('本小节批注数量已达上限');
      comments.push({
        id: crypto.randomUUID(),
        sectionKey,
        chapter: String(body.chapter || '').slice(0, 120),
        section: String(body.section || '').slice(0, 200),
        nickname: cleanNickname(body.nickname),
        clientId,
        text: cleanCommentText(body.text, 300),
        createdAt: new Date().toISOString(),
        likes: [],
        replies: []
      });
    } else if (action === 'reply') {
      const comment = comments.find((item) => item.id === body.commentId && item.sectionKey === sectionKey);
      if (!comment) throw new Error('批注不存在');
      comment.replies = Array.isArray(comment.replies) ? comment.replies : [];
      if (comment.replies.length >= 100) throw new Error('回复数量已达上限');
      comment.replies.push({
        id: crypto.randomUUID(),
        nickname: cleanNickname(body.nickname),
        clientId,
        text: cleanCommentText(body.text, 200),
        createdAt: new Date().toISOString(),
        likes: []
      });
    } else if (action === 'like') {
      const comment = comments.find((item) => item.id === body.commentId && item.sectionKey === sectionKey);
      if (!comment) throw new Error('批注不存在');
      const target = body.replyId
        ? (comment.replies || []).find((reply) => reply.id === body.replyId)
        : comment;
      if (!target) throw new Error('回复不存在');
      target.likes = Array.isArray(target.likes) ? target.likes : [];
      const index = target.likes.indexOf(clientId);
      if (index >= 0) target.likes.splice(index, 1);
      else target.likes.push(clientId);
    } else {
      throw new Error('未知批注操作');
    }

    writeComments(config, comments);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message });
  }
}

function resolveApi(pathname) {
  for (const prefix of Object.keys(BANKS)) {
    if (pathname === `${prefix}/api/data` || pathname === `${prefix}/api/info` || pathname === `${prefix}/api/comments`) {
      return {
        config: BANKS[prefix],
        type: pathname.endsWith('/info') ? 'info' : pathname.endsWith('/comments') ? 'comments' : 'data'
      };
    }
  }
  return null;
}

async function handleApi(req, res, api, requestUrl) {
  const config = api.config;
  if (api.type === 'comments') {
    await handleComments(req, res, config, requestUrl);
    return;
  }
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
  let requestUrl;
  try {
    requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = requestUrl.pathname;
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const api = resolveApi(pathname);
  if (api) {
    handleApi(req, res, api, requestUrl);
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
