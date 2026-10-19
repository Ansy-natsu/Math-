import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';

const MAX_COMMENT = 300;
const MAX_REPLY = 200;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function text(value, max) {
  const output = String(value || '').replace(/\r\n/g, '\n').trim();
  if (!output) throw new Error('批注内容不能为空');
  if (output.length > max) throw new Error(`批注最多 ${max} 字`);
  return output;
}

function nickname(value) {
  const output = String(value || '').trim().replace(/\s+/g, ' ');
  if (!output) throw new Error('请填写昵称');
  return output.slice(0, 24);
}

function storeKey(site, sectionKey) {
  return `threads/${site}/${Buffer.from(sectionKey).toString('base64url')}.json`;
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

function heat(comment) {
  const likes = Array.isArray(comment.likes) ? comment.likes.length : 0;
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  return likes * 2 + replies.length + replies.reduce((sum, reply) => {
    return sum + (Array.isArray(reply.likes) ? reply.likes.length : 0);
  }, 0);
}

export async function handleComments(site, request) {
  const url = new URL(request.url);
  const store = getStore({ name: 'math-comments', consistency: 'strong' });

  if (request.method === 'GET' && url.searchParams.get('counts') === '1') {
    const counts = {};
    const prefix = `threads/${site}/`;
    const blobs = [];
    for await (const page of store.list({ prefix, paginate: true })) {
      blobs.push(...page.blobs);
    }
    await Promise.all(blobs.map(async (blob) => {
      const comments = await store.get(blob.key, { type: 'json' });
      if (!Array.isArray(comments)) return;
      const key = blob.key.slice(prefix.length, -5);
      const sectionKey = Buffer.from(key, 'base64url').toString();
      counts[sectionKey] = comments.reduce((sum, comment) => {
        return sum + 1 + (Array.isArray(comment.replies) ? comment.replies.length : 0);
      }, 0);
    }));
    return json(200, { ok: true, counts });
  }

  const sectionKey = String(url.searchParams.get('sectionKey') || '');
  if (!sectionKey) return json(400, { ok: false, error: '缺少小节标识' });
  const key = storeKey(site, sectionKey);
  let comments = await store.get(key, { type: 'json' });
  if (!Array.isArray(comments)) comments = [];

  if (request.method === 'GET') {
    const clientId = String(url.searchParams.get('clientId') || '');
    const sort = url.searchParams.get('sort') === 'hot' ? 'hot' : 'time';
    comments.sort(sort === 'hot'
      ? (a, b) => heat(b) - heat(a) || String(b.createdAt).localeCompare(String(a.createdAt))
      : (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json(200, {
      ok: true,
      comments: comments.map((comment) => publicComment(comment, clientId))
    });
  }

  if (request.method !== 'POST') return json(405, { ok: false, error: '请求方法不支持' });

  try {
    const body = await request.json();
    const action = String(body.action || '');
    const clientId = String(body.clientId || '');
    if (!clientId || clientId.length > 100) throw new Error('用户标识无效');

    if (action === 'add') {
      if (comments.length >= 300) throw new Error('本小节批注数量已达上限');
      comments.push({
        id: randomUUID(),
        sectionKey,
        chapter: String(body.chapter || '').slice(0, 120),
        section: String(body.section || '').slice(0, 200),
        nickname: nickname(body.nickname),
        clientId,
        text: text(body.text, MAX_COMMENT),
        createdAt: new Date().toISOString(),
        likes: [],
        replies: []
      });
    } else if (action === 'reply') {
      const comment = comments.find((item) => item.id === body.commentId);
      if (!comment) throw new Error('批注不存在');
      comment.replies = Array.isArray(comment.replies) ? comment.replies : [];
      if (comment.replies.length >= 100) throw new Error('回复数量已达上限');
      comment.replies.push({
        id: randomUUID(),
        nickname: nickname(body.nickname),
        clientId,
        text: text(body.text, MAX_REPLY),
        createdAt: new Date().toISOString(),
        likes: []
      });
    } else if (action === 'like') {
      const comment = comments.find((item) => item.id === body.commentId);
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

    await store.setJSON(key, comments);
    return json(200, { ok: true });
  } catch (error) {
    return json(400, { ok: false, error: error.message });
  }
}
