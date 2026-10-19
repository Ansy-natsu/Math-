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

  function updateCounts() {
    document.querySelectorAll('.section-comment-trigger').forEach(function (button) {
      var count = countsCache.get(button.dataset.sectionKey) || 0;
      var badge = button.querySelector('.cmt-count');
      badge.textContent = count ? String(count) : '';
    });
  }

  function loadCounts(force) {
    if (!force && countsLoadedAt && Date.now() - countsLoadedAt < 15000) {
      return Promise.resolve(countsCache);
    }
    if (countsPromise && !force) return countsPromise;
    countsPromise = request(api + '?counts=1')
      .then(function (body) {
        countsCache = new Map(Object.entries(body.counts || {}));
        countsLoadedAt = Date.now();
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

  async function loadPanel(panel, force) {
    if (!panel || (panel.dataset.loaded === '1' && !force)) return;
    var list = panel.querySelector('.cmt-list');
    list.innerHTML = '<div class="cmt-empty">正在加载批注…</div>';
    try {
      var query = new URLSearchParams({
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        sort: panel.dataset.sort,
        clientId: identity().id
      });
      var body = await request(api + '?' + query.toString());
      panel.dataset.loaded = '1';
      panel._comments = body.comments || [];
      renderComments(panel);
    } catch (error) {
      list.innerHTML = '<div class="cmt-empty">批注加载失败：' + escapeHtml(error.message) + '</div>';
    }
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
          Number(reply.likeCount || 0) + '</button></div></div>';
      }).join('');
      return '<article class="cmt-item" data-comment-item="' + escapeHtml(comment.id) + '">' +
        '<div class="cmt-meta"><strong>' + escapeHtml(comment.nickname) + '</strong><time>' +
        escapeHtml(timeText(comment.createdAt)) + '</time></div>' +
        '<div class="cmt-content">' + escapeHtml(comment.text) + '</div>' +
        '<div class="cmt-actions"><button type="button" class="cmt-action' +
        (comment.liked ? ' on' : '') + '" data-cmt-like data-comment-id="' +
        escapeHtml(comment.id) + '">赞 ' + Number(comment.likeCount || 0) + '</button>' +
        '<button type="button" class="cmt-action" data-cmt-reply data-comment-id="' +
        escapeHtml(comment.id) + '">回复 ' + Number((comment.replies || []).length) + '</button></div>' +
        '<div class="cmt-replies">' + replies + '</div></article>';
    }).join('');
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
    try {
      await post({
        action: 'add',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        nickname: nickname,
        text: text
      });
      textarea.value = '';
      form.querySelector('.cmt-counter').textContent = '0/' + MAX_COMMENT;
      status.textContent = '已发布';
      await loadPanel(panel, true);
      loadCounts(true);
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
    try {
      await post({
        action: 'reply',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        commentId: form.dataset.commentId,
        nickname: identity().name,
        text: text
      });
      await loadPanel(panel, true);
      loadCounts(true);
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('error');
      submit.disabled = false;
    }
  }

  async function toggleLike(panel, commentId, replyId) {
    try {
      await post({
        action: 'like',
        sectionKey: panel.dataset.sectionKey,
        chapter: panel.dataset.chapter,
        section: panel.dataset.section,
        commentId: commentId,
        replyId: replyId
      });
      await loadPanel(panel, true);
    } catch (error) {
      var list = panel.querySelector('.cmt-list');
      var tip = document.createElement('div');
      tip.className = 'cmt-empty';
      tip.textContent = '点赞失败：' + error.message;
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
