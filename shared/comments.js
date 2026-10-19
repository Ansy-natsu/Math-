(function () {
  'use strict';

  var IDENTITY_KEY = 'math-comments-identity-v1';
  var MAX_COMMENT = 300;
  var MAX_REPLY = 200;
  var site = location.pathname.split('/').filter(Boolean)[0];
  if (site !== 'linear-algebra') site = 'calculus';
  var api = '/' + site + '/api/comments';
  var countsCache = new Map();
  var countsPromise = null;
  var countsLoadedAt = 0;
  var COUNTS_KEY = 'math-comments-counts-v1:' + site;
  var THREAD_KEY = 'math-comments-thread-v1:' + site + ':';
  var COUNTS_TTL = 30000;
  var THREAD_TTL = 120000;
  var threadMemory = new Map();

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function identity() {
    var value = null;
    try {
      value = JSON.parse(localStorage.getItem(IDENTITY_KEY) || 'null');
    } catch (error) {}
    if (!value || !value.id) {
      var id = window.crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      value = { id: id, name: '访客-' + id.replace(/-/g, '').slice(0, 4).toUpperCase() };
      try { localStorage.setItem(IDENTITY_KEY, JSON.stringify(value)); } catch (error) {}
    }
    return value;
  }

  function saveName(name) {
    var user = identity();
    user.name = String(name || '').trim().slice(0, 24) || user.name;
    try { localStorage.setItem(IDENTITY_KEY, JSON.stringify(user)); } catch (error) {}
  }

  function sectionKey(chapter, section) {
    return String(chapter || '') + '::' + String(section || '');
  }

  function readCachedJson(key) {
    try {
      var value = JSON.parse(sessionStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function writeCachedJson(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  function readThreadCache(key) {
    var cached = threadMemory.get(key);
    if (!cached) {
      cached = readCachedJson(THREAD_KEY + key);
      if (cached) threadMemory.set(key, cached);
    }
    if (!cached || !Array.isArray(cached.comments)) return null;
    return cached;
  }

  function writeThreadCache(panel) {
    var cached = {
      at: Date.now(),
      comments: panel._comments || [],
      total: Number(panel._total || 0),
      hasMore: Boolean(panel._hasMore)
    };
    threadMemory.set(panel.dataset.sectionKey, cached);
    writeCachedJson(THREAD_KEY + panel.dataset.sectionKey, cached);
  }

  function restoreThread(panel, cached) {
    panel.dataset.loaded = '1';
    panel._comments = cached.comments || [];
    panel._total = Number(cached.total || 0);
    panel._hasMore = Boolean(cached.hasMore);
    renderComments(panel);
  }

  function timeText(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    var diff = Date.now() - date.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
    if (diff < 7 * 86400000) return Math.floor(diff / 86400000) + ' 天前';
    return date.toLocaleDateString('zh-CN');
  }

  async function request(url, options) {
    var response = await fetch(url, options || {});
    var body = await response.json().catch(function () { return {}; });
    if (!response.ok || !body.ok) throw new Error(body.error || ('HTTP ' + response.status));
    return body;
  }

  function post(payload) {
    return request(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ clientId: identity().id }, payload))
    });
  }

  function applyMutation(panel, body) {
    panel._mutationVersion = Number(panel._mutationVersion || 0) + 1;
    panel.dataset.loaded = '1';
    panel._comments = body.comments || [];
    panel._total = Number(body.total || panel._comments.length);
    panel._hasMore = Boolean(body.hasMore);
    renderComments(panel);
    writeThreadCache(panel);
    countsCache.set(panel.dataset.sectionKey, panel._total);
    countsLoadedAt = Date.now();
    writeCachedJson(COUNTS_KEY, {
      at: countsLoadedAt,
      counts: Object.fromEntries(countsCache)
    });
    updateCounts();
  }

  function updateCounts() {
    document.querySelectorAll('.section-comment-trigger').forEach(function (button) {
      var count = countsCache.get(button.dataset.sectionKey) || 0;
      var badge = button.querySelector('.cmt-count');
      badge.textContent = count ? String(count) : '';
    });
  }

  function loadCounts(force) {
    if (!countsLoadedAt) {
      var cached = readCachedJson(COUNTS_KEY);
      if (cached && cached.counts) {
        countsCache = new Map(Object.entries(cached.counts));
        countsLoadedAt = Number(cached.at || 0);
        updateCounts();
      }
    }
    if (!force && countsLoadedAt && Date.now() - countsLoadedAt < COUNTS_TTL) {
      return Promise.resolve(countsCache);
    }
    if (countsPromise && !force) return countsPromise;
    countsPromise = request(api + '?counts=1')
      .then(function (body) {
        countsCache = new Map(Object.entries(body.counts || {}));
        countsLoadedAt = Date.now();
        writeCachedJson(COUNTS_KEY, {
          at: countsLoadedAt,
          counts: body.counts || {}
        });
        updateCounts();
        return countsCache;
      })
      .catch(function () { return countsCache; })
      .finally(function () { countsPromise = null; });
    return countsPromise;
  }

  function panelTemplate(chapter, section) {
    return '<div class="cmt-panel-head"><div><strong>小节批注</strong><small>' +
      escapeHtml(section) + '</small></div><div class="cmt-sort">' +
      '<button type="button" data-cmt-sort="time" class="on">最新</button>' +
      '<button type="button" data-cmt-sort="hot">最热</button>' +
      '<button type="button" class="cmt-close" data-cmt-close>收起</button>' +
      '</div></div>' +
      '<form class="cmt-form"><div class="cmt-name-row"><label>昵称</label>' +
      '<input class="cmt-name" maxlength="24" value="' + escapeHtml(identity().name) + '"></div>' +
      '<textarea class="cmt-text" maxlength="' + MAX_COMMENT + '" placeholder="写下你对本小节的评价、疑问或批注（最多 ' +
      MAX_COMMENT + ' 字）"></textarea>' +
      '<div class="cmt-form-foot"><span class="cmt-counter">0/' + MAX_COMMENT + '</span>' +
      '<span class="cmt-status"></span><button class="cmt-submit" type="submit">发布批注</button></div></form>' +
      '<div class="cmt-list"><div class="cmt-empty">展开后加载批注…</div></div>';
  }

  function prepare(groupHeading) {
    if (groupHeading.querySelector(':scope > .section-comment-trigger')) return;
    var chapter = String(groupHeading.dataset.chapter || '').trim();
    var section = String(groupHeading.dataset.section || '').trim();
    if (!section) return;
    var key = sectionKey(chapter, section);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'section-comment-trigger';
    button.dataset.sectionKey = key;
    button.innerHTML = '💬 批注 <span class="cmt-count"></span>';

    var panel = document.createElement('section');
    panel.className = 'section-comments';
    panel.hidden = true;
    panel.dataset.sectionKey = key;
    panel.dataset.chapter = chapter;
    panel.dataset.section = section;
    panel.dataset.sort = 'time';
    panel.innerHTML = panelTemplate(chapter, section);

    var countNode = groupHeading.querySelector('.cnt');
    if (countNode) groupHeading.insertBefore(button, countNode);
    else groupHeading.appendChild(button);
    groupHeading.parentNode.insertBefore(panel, groupHeading.nextSibling);

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var opening = panel.hidden;
      panel.hidden = !opening;
      if (opening) loadPanel(panel);
    });

    var prefetch = function () {
      if (panel.dataset.loaded !== '1' && !panel._loadPromise) loadPanel(panel, false, false, true);
    };
    button.addEventListener('pointerenter', prefetch, { once: true });
    button.addEventListener('focus', prefetch, { once: true });

    panel.addEventListener('click', function (event) {
      event.stopPropagation();
      var close = event.target.closest('[data-cmt-close]');
      if (close) {
        panel.hidden = true;
        return;
      }
      var sort = event.target.closest('[data-cmt-sort]');
      if (sort) {
        panel.dataset.sort = sort.dataset.cmtSort;
        panel.querySelectorAll('[data-cmt-sort]').forEach(function (node) {
          node.classList.toggle('on', node === sort);
        });
        loadPanel(panel, true);
        return;
      }
      var like = event.target.closest('[data-cmt-like]');
      if (like) {
        toggleLike(panel, like.dataset.commentId, like.dataset.replyId || null);
        return;
      }
      var reply = event.target.closest('[data-cmt-reply]');
      if (reply) {
        showReplyForm(panel, reply.dataset.commentId);
        return;
      }
      var remove = event.target.closest('[data-cmt-delete]');
      if (remove) {
        withdraw(panel, remove.dataset.commentId, remove.dataset.replyId || null);
        return;
      }
      var more = event.target.closest('[data-cmt-more]');
      if (more) {
        loadPanel(panel, true, true);
      }
    });

    panel.addEventListener('input', function (event) {
      if (event.target.classList.contains('cmt-name')) saveName(event.target.value);
      if (event.target.classList.contains('cmt-text')) {
        panel.querySelector('.cmt-counter').textContent =
          event.target.value.length + '/' + MAX_COMMENT;
      }
    });

    panel.addEventListener('submit', function (event) {
      event.preventDefault();
      if (event.target.classList.contains('cmt-form')) submitRoot(panel, event.target);
      else if (event.target.classList.contains('cmt-reply-form')) submitReply(panel, event.target);
    });
  }

  async function loadPanel(panel, force, append, quiet) {
    if (!panel || (panel.dataset.loaded === '1' && !force)) return;
    var list = panel.querySelector('.cmt-list');
    if (!append && panel._loadPromise && !force) {
      if (!quiet && !readThreadCache(panel.dataset.sectionKey)) {
        list.innerHTML = '<div class="cmt-empty">正在加载批注…</div>';
      }
      return panel._loadPromise;
    }
    if (append && panel._loadingMore) return;
    var cached = !append && !force ? readThreadCache(panel.dataset.sectionKey) : null;
    if (cached) restoreThread(panel, cached);
    if (cached && Date.now() - Number(cached.at || 0) < THREAD_TTL) return;
    if (append) {
      var moreButton = list.querySelector('[data-cmt-more]');
      if (moreButton) {
        moreButton.disabled = true;
        moreButton.textContent = '加载中…';
      }
      panel._loadingMore = true;
    } else if (!cached && !quiet) {
      list.innerHTML = '<div class="cmt-empty">正在加载批注…</div>';
    }
    var mutationVersion = Number(panel._mutationVersion || 0);
    var load = (async function () {
      var query = new URLSearchParams({
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        sort: panel.dataset.sort,
        clientId: identity().id,
        limit: '20',
        offset: String(append ? (panel._comments || []).length : 0)
      });
      var body = await request(api + '?' + query.toString());
      if (Number(panel._mutationVersion || 0) !== mutationVersion) return;
      panel.dataset.loaded = '1';
      panel._comments = (append ? (panel._comments || []) : []).concat(body.comments || []);
      panel._total = Number(body.total || panel._comments.length);
      panel._hasMore = Boolean(body.hasMore);
      renderComments(panel);
      writeThreadCache(panel);
    })().catch(function (error) {
      if (!append && !cached) {
        list.innerHTML = '<div class="cmt-empty">批注加载失败：' + escapeHtml(error.message) + '</div>';
      }
    }).finally(function () {
      panel._loadPromise = null;
      panel._loadingMore = false;
      if (append) {
        var rest = list.querySelector('[data-cmt-more]');
        if (rest) {
          rest.disabled = false;
          rest.textContent = '加载更多批注';
        }
      }
    });
    panel._loadPromise = load;
    return load;
  }

  function snapshotThread(panel) {
    return {
      comments: panel._comments || [],
      total: Number(panel._total || 0),
      hasMore: Boolean(panel._hasMore)
    };
  }

  function restoreSnapshot(panel, snapshot) {
    panel._comments = snapshot.comments;
    panel._total = snapshot.total;
    panel._hasMore = snapshot.hasMore;
    renderComments(panel);
    countsCache.set(panel.dataset.sectionKey, panel._total);
    updateCounts();
  }

  function setLocalTotal(panel, total) {
    panel._total = Math.max(0, Number(total) || 0);
    countsCache.set(panel.dataset.sectionKey, panel._total);
    updateCounts();
  }

  function renderComments(panel) {
    var list = panel.querySelector('.cmt-list');
    var comments = panel._comments || [];
    if (!comments.length) {
      list.innerHTML = '<div class="cmt-empty">本小节还没有批注，欢迎写下第一条。</div>';
      return;
    }
    list.innerHTML = comments.map(function (comment) {
      var replies = (comment.replies || []).map(function (reply) {
        return '<div class="cmt-reply"><div class="cmt-meta"><strong>' +
          escapeHtml(reply.nickname) + '</strong><time>' + escapeHtml(timeText(reply.createdAt)) +
          '</time></div><div class="cmt-content">' + escapeHtml(reply.text) + '</div>' +
          '<div class="cmt-actions"><button type="button" class="cmt-action' +
          (reply.liked ? ' on' : '') + '" data-cmt-like data-comment-id="' +
          escapeHtml(comment.id) + '" data-reply-id="' + escapeHtml(reply.id) + '">赞 ' +
          Number(reply.likeCount || 0) + '</button>' +
          (reply.mine ? '<button type="button" class="cmt-action cmt-delete" data-cmt-delete data-comment-id="' +
            escapeHtml(comment.id) + '" data-reply-id="' + escapeHtml(reply.id) + '">撤回</button>' : '') +
          '</div></div>';
      }).join('');
      return '<article class="cmt-item" data-comment-item="' + escapeHtml(comment.id) + '">' +
        '<div class="cmt-meta"><strong>' + escapeHtml(comment.nickname) + '</strong><time>' +
        escapeHtml(timeText(comment.createdAt)) + '</time></div>' +
        '<div class="cmt-content">' + escapeHtml(comment.text) + '</div>' +
        '<div class="cmt-actions"><button type="button" class="cmt-action' +
        (comment.liked ? ' on' : '') + '" data-cmt-like data-comment-id="' +
        escapeHtml(comment.id) + '">赞 ' + Number(comment.likeCount || 0) + '</button>' +
        '<button type="button" class="cmt-action" data-cmt-reply data-comment-id="' +
        escapeHtml(comment.id) + '">回复 ' + Number((comment.replies || []).length) + '</button>' +
        (comment.mine ? '<button type="button" class="cmt-action cmt-delete" data-cmt-delete data-comment-id="' +
          escapeHtml(comment.id) + '">撤回</button>' : '') + '</div>' +
        '<div class="cmt-replies">' + replies + '</div></article>';
    }).join('') +
      (panel._hasMore ? '<button type="button" class="cmt-more" data-cmt-more>加载更多批注</button>' : '');
  }

  function showReplyForm(panel, commentId) {
    var item = panel.querySelector('[data-comment-item="' + CSS.escape(commentId) + '"]');
    if (!item) return;
    if (item.querySelector('.cmt-reply-form')) {
      item.querySelector('.cmt-reply-form').remove();
      return;
    }
    var form = document.createElement('form');
    form.className = 'cmt-reply-form';
    form.dataset.commentId = commentId;
    form.innerHTML = '<textarea class="cmt-reply-text" maxlength="' + MAX_REPLY +
      '" placeholder="回复这条批注（最多 ' + MAX_REPLY + ' 字）"></textarea>' +
      '<div class="cmt-form-foot"><span class="cmt-counter">0/' + MAX_REPLY +
      '</span><span class="cmt-status"></span><button class="cmt-reply-submit" type="submit">发布回复</button></div>';
    var replies = item.querySelector('.cmt-replies');
    replies.appendChild(form);
    form.querySelector('textarea').addEventListener('input', function (event) {
      form.querySelector('.cmt-counter').textContent = event.target.value.length + '/' + MAX_REPLY;
    });
    form.querySelector('textarea').focus();
  }

  async function submitRoot(panel, form) {
    var textarea = form.querySelector('.cmt-text');
    var nameInput = form.querySelector('.cmt-name');
    var status = form.querySelector('.cmt-status');
    var submit = form.querySelector('.cmt-submit');
    var text = textarea.value.trim();
    var nickname = nameInput.value.trim();
    status.classList.remove('error');
    if (!nickname) {
      status.textContent = '请填写昵称';
      status.classList.add('error');
      return;
    }
    if (!text) {
      status.textContent = '请输入批注内容';
      status.classList.add('error');
      return;
    }
    saveName(nickname);
    submit.disabled = true;
    status.textContent = '发布中…';
    panel._mutationVersion = Number(panel._mutationVersion || 0) + 1;
    try {
      var body = await post({
        action: 'add',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        nickname: nickname,
        text: text,
        sort: panel.dataset.sort
      });
      textarea.value = '';
      form.querySelector('.cmt-counter').textContent = '0/' + MAX_COMMENT;
      status.textContent = '已发布';
      applyMutation(panel, body);
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('error');
    } finally {
      submit.disabled = false;
    }
  }

  async function submitReply(panel, form) {
    var textarea = form.querySelector('.cmt-reply-text');
    var status = form.querySelector('.cmt-status');
    var submit = form.querySelector('.cmt-reply-submit');
    var text = textarea.value.trim();
    status.classList.remove('error');
    if (!text) {
      status.textContent = '请输入回复内容';
      status.classList.add('error');
      return;
    }
    submit.disabled = true;
    status.textContent = '发布中…';
    panel._mutationVersion = Number(panel._mutationVersion || 0) + 1;
    try {
      var body = await post({
        action: 'reply',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        commentId: form.dataset.commentId,
        nickname: identity().name,
        text: text,
        sort: panel.dataset.sort
      });
      applyMutation(panel, body);
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('error');
      submit.disabled = false;
    }
  }

  async function toggleLike(panel, commentId, replyId) {
    panel._mutationVersion = Number(panel._mutationVersion || 0) + 1;
    var snapshot = snapshotThread(panel);
    panel._comments = (panel._comments || []).map(function (comment) {
      if (comment.id !== commentId) return comment;
      if (replyId) {
        return Object.assign({}, comment, {
          replies: (comment.replies || []).map(function (reply) {
            if (reply.id !== replyId) return reply;
            return Object.assign({}, reply, {
              liked: !reply.liked,
              likeCount: Math.max(0, Number(reply.likeCount || 0) + (reply.liked ? -1 : 1))
            });
          })
        });
      }
      return Object.assign({}, comment, {
        liked: !comment.liked,
        likeCount: Math.max(0, Number(comment.likeCount || 0) + (comment.liked ? -1 : 1))
      });
    });
    renderComments(panel);
    try {
      var body = await post({
        action: 'like',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        commentId: commentId,
        replyId: replyId,
        sort: panel.dataset.sort
      });
      applyMutation(panel, body);
    } catch (error) {
      restoreSnapshot(panel, snapshot);
      var list = panel.querySelector('.cmt-list');
      var tip = document.createElement('div');
      tip.className = 'cmt-empty';
      tip.textContent = '点赞失败：' + error.message;
      list.prepend(tip);
    }
  }

  async function withdraw(panel, commentId, replyId) {
    if (!window.confirm(replyId ? '确定撤回这条回复吗？' : '确定撤回这条批注吗？')) return;
    panel._mutationVersion = Number(panel._mutationVersion || 0) + 1;
    var snapshot = snapshotThread(panel);
    panel._comments = (panel._comments || []).map(function (comment) {
      if (comment.id !== commentId) return comment;
      if (!replyId) return null;
      return Object.assign({}, comment, {
        replies: (comment.replies || []).filter(function (reply) {
          return reply.id !== replyId;
        })
      });
    }).filter(Boolean);
    setLocalTotal(panel, Number(snapshot.total || 0) - 1);
    renderComments(panel);
    try {
      var body = await post({
        action: 'delete',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        commentId: commentId,
        replyId: replyId,
        sort: panel.dataset.sort
      });
      applyMutation(panel, body);
    } catch (error) {
      restoreSnapshot(panel, snapshot);
      var list = panel.querySelector('.cmt-list');
      var tip = document.createElement('div');
      tip.className = 'cmt-empty';
      tip.textContent = '撤回失败：' + error.message;
      list.prepend(tip);
    }
  }

  function refresh(scope) {
    var root = scope || document;
    root.querySelectorAll('.ghd[data-section]').forEach(prepare);
    updateCounts();
    loadCounts(false);
  }

  window.SectionComments = { refresh: refresh };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { refresh(document); }, { once: true });
  } else {
    refresh(document);
  }
})();
