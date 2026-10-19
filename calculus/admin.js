(function () {
  'use strict';

  const DRAFT_KEY = 'math-admin-draft-v1';
  const PAGE_SIZE = 12;
  const DATA_FILE = 'data.js';

  const state = {
    data: null,
    apiOnline: false,
    serverInfo: null,
    baseline: '',
    dirty: false,
    view: 'dashboard',
    previousView: 'dashboard',
    searchQuery: '',
    knowledgeTab: 'points',
    page: 1,
    filters: {
      questionQuery: '',
      chapter: '',
      section: '',
      type: '',
      difficulty: ''
    },
    draftAvailable: false,
    draftMeta: null,
    editor: null
  };

  const el = {
    main: document.getElementById('mainView'),
    viewTitle: document.getElementById('viewTitle'),
    globalSearch: document.getElementById('globalSearch'),
    saveState: document.getElementById('saveState'),
    publishBtn: document.getElementById('publishBtn'),
    serverState: document.getElementById('serverState'),
    sidebar: document.getElementById('sidebar'),
    sidebarScrim: document.getElementById('sidebarScrim'),
    menuBtn: document.getElementById('menuBtn'),
    drawer: document.getElementById('editorDrawer'),
    drawerScrim: document.getElementById('drawerScrim'),
    editorTitle: document.getElementById('editorTitle'),
    editorEyebrow: document.getElementById('editorEyebrow'),
    editorBody: document.getElementById('editorBody'),
    editorForm: document.getElementById('editorForm'),
    closeEditor: document.getElementById('closeEditor'),
    cancelEditor: document.getElementById('cancelEditor'),
    saveEditor: document.getElementById('saveEditor'),
    formHint: document.getElementById('formHint'),
    modalLayer: document.getElementById('modalLayer'),
    toastStack: document.getElementById('toastStack'),
    fileInput: document.getElementById('fileInput'),
    navQuestionCount: document.getElementById('navQuestionCount'),
    navKnowledgeCount: document.getElementById('navKnowledgeCount')
  };

  const VIEW_TITLES = {
    dashboard: '总览',
    questions: '题库管理',
    knowledge: '知识库',
    taxonomy: '章节结构',
    data: '数据与备份',
    search: '搜索结果'
  };

  const KIND_META = {
    questions: { label: '题目', plural: '题目', className: '' },
    knowledge: { label: '知识点', plural: '知识点', className: 'is-knowledge' },
    pitfalls: { label: '易错点', plural: '易错点', className: 'is-pitfall' }
  };

  const KIND_COLLECTION = {
    questions: 'problems',
    knowledge: 'knowledge',
    pitfalls: 'pitfalls'
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function stableJson(value) {
    return JSON.stringify(value);
  }

  function text(value, fallback) {
    const out = String(value == null ? '' : value).trim();
    return out || fallback || '';
  }

  function truncate(value, length) {
    const out = text(value);
    return out.length > length ? out.slice(0, length - 1) + '…' : out;
  }

  function splitLines(value) {
    return String(value || '').split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
  }

  function splitTags(value) {
    return String(value || '').split(/[\n,，]/).map(function (tag) {
      return tag.trim();
    }).filter(Boolean);
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  function today() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  function formatTime(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function normalizeData(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const data = clone(source);
    data.problems = Array.isArray(source.problems) ? source.problems : [];
    data.knowledge = Array.isArray(source.knowledge) ? source.knowledge : [];
    data.pitfalls = Array.isArray(source.pitfalls) ? source.pitfalls : [];
    return data;
  }

  function localBank() {
    try {
      if (typeof BANK !== 'undefined') return normalizeData(BANK);
    } catch (error) {
      console.warn('Unable to read local BANK', error);
    }
    return normalizeData({});
  }

  function allItems() {
    if (!state.data) return [];
    return [
      ...state.data.problems.map(function (item) { return { kind: 'questions', item: item }; }),
      ...state.data.knowledge.map(function (item) { return { kind: 'knowledge', item: item }; }),
      ...state.data.pitfalls.map(function (item) { return { kind: 'pitfalls', item: item }; })
    ];
  }

  function collectionFor(kind) {
    return state.data[KIND_COLLECTION[kind]] || [];
  }

  function itemTitle(kind, item) {
    if (kind === 'questions') return text(item.statement, '未填写题目');
    if (kind === 'knowledge') return text(item.title, '未命名知识点');
    return text(item.title, '未命名易错点');
  }

  function itemCode(kind, item) {
    return text(item.id, kind === 'pitfalls' ? '未编号' : '—');
  }

  function itemSection(item) {
    return text(item.section || item.category || item.sec, '未分类');
  }

  function indexOrder(value, chapterMode) {
    if (chapterMode) {
      const cn = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
      const match = String(value || '').match(/第\s*([一二三四五六七八九十]+|\d+)\s*章/);
      if (!match) return 999999;
      return /^\d+$/.test(match[1]) ? Number(match[1]) : (cn[match[1]] || 999999);
    }
    const match = String(value || '').match(/§\s*(\d+)\.(\d+)/);
    return match ? Number(match[1]) * 1000 + Number(match[2]) : 999999;
  }

  function chapters() {
    const seen = new Set();
    const result = [];
    allItems().forEach(function (entry) {
      const chapter = text(entry.item.chapter);
      if (chapter && !seen.has(chapter)) {
        seen.add(chapter);
        result.push(chapter);
      }
    });
    return result.sort(function (a, b) { return indexOrder(a, true) - indexOrder(b, true); });
  }

  function sections(chapter) {
    const seen = new Set();
    const result = [];
    allItems().forEach(function (entry) {
      if (chapter && text(entry.item.chapter) !== chapter) return;
      const section = itemSection(entry.item);
      if (section !== '未分类' && !seen.has(section)) {
        seen.add(section);
        result.push(section);
      }
    });
    return result.sort(function (a, b) { return indexOrder(a, false) - indexOrder(b, false); });
  }

  function defaultChapter() {
    return chapters()[0] || '第一章 函数与极限';
  }

  function searchable(kind, item) {
    return JSON.stringify(item).toLowerCase();
  }

  function matchesQuery(kind, item, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return true;
    return searchable(kind, item).indexOf(q) >= 0;
  }

  function itemById(kind, id) {
    return collectionFor(kind).find(function (item) { return String(item.id) === String(id); });
  }

  function nextPitfallId() {
    let max = 0;
    state.data.pitfalls.forEach(function (item) {
      const match = String(item.id || '').match(/^E-(\d+)$/i);
      if (match) max = Math.max(max, Number(match[1]));
    });
    return 'E-' + String(max + 1).padStart(3, '0');
  }

  function nextKnowledgeId() {
    const stamp = today().replace(/-/g, '');
    const prefix = 'K-' + stamp + '-';
    let max = 0;
    state.data.knowledge.forEach(function (item) {
      const id = String(item.id || '');
      if (id.indexOf(prefix) === 0) max = Math.max(max, Number(id.slice(prefix.length)) || 0);
    });
    return prefix + String(max + 1).padStart(2, '0');
  }

  function uniqueCopyId(kind, id) {
    const base = 'copy-' + (id || 'item');
    let candidate = base;
    let index = 2;
    while (itemById(kind, candidate)) {
      candidate = base + '-' + index;
      index += 1;
    }
    return candidate;
  }

  function toast(message, type) {
    const node = document.createElement('div');
    node.className = 'toast ' + (type || '');
    node.textContent = message;
    el.toastStack.appendChild(node);
    window.setTimeout(function () {
      node.style.opacity = '0';
      node.style.transform = 'translateY(5px)';
      node.style.transition = 'opacity .2s, transform .2s';
      window.setTimeout(function () { node.remove(); }, 220);
    }, 3200);
  }

  function setBusy(button, busy, busyText) {
    if (!button) return;
    if (busy) {
      button.dataset.label = button.textContent;
      button.disabled = true;
      button.textContent = busyText || '处理中…';
    } else {
      button.disabled = false;
      button.textContent = button.dataset.label || button.textContent;
    }
  }

  function setSaveState(mode, label) {
    el.saveState.className = 'save-state';
    if (mode === 'dirty') el.saveState.classList.add('is-dirty');
    if (mode === 'error') el.saveState.classList.add('is-error');
    el.saveState.querySelector('span').textContent = label;
  }

  function setDirty(dirty) {
    state.dirty = dirty;
    if (dirty) {
      setSaveState('dirty', '有未发布更改');
      window.clearTimeout(setDirty.timer);
      setDirty.timer = window.setTimeout(saveDraft, 450);
    } else {
      setSaveState('', state.apiOnline ? '已同步' : '本地模式');
    }
  }

  function saveDraft() {
    if (!state.data) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        version: 1,
        savedAt: new Date().toISOString(),
        data: state.data
      }));
    } catch (error) {
      console.warn('Unable to save local draft', error);
      setSaveState('error', '草稿保存失败');
    }
  }

  function readDraft() {
    try {
      const value = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!value || !value.data || typeof value.data !== 'object') return null;
      return value;
    } catch (error) {
      return null;
    }
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    state.draftAvailable = false;
    state.draftMeta = null;
  }

  function updateServerState(online, info) {
    state.apiOnline = online;
    state.serverInfo = info || null;
    el.serverState.className = 'server-state ' + (online ? 'is-online' : 'is-offline');
    el.serverState.querySelector('strong').textContent = online ? '数据服务已连接' : '本地文件模式';
    el.serverState.querySelector('span:last-child').textContent = online
      ? '发布将直接写入 data.js'
      : '发布将下载 data.js';
    el.publishBtn.title = online ? '发布并写入 data.js' : '下载更新后的 data.js，可手动替换';
    if (!state.dirty) setSaveState('', online ? '已同步' : '本地模式');
  }

  async function loadRemote(silent) {
    try {
      const response = await fetch('api/data', { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const payload = await response.json();
      if (!payload || !payload.ok || !payload.data) throw new Error('数据接口返回格式不正确');
      state.data = normalizeData(payload.data);
      state.baseline = stableJson(state.data);
      updateServerState(true, payload.meta || null);
      return true;
    } catch (error) {
      if (!silent) console.warn('Remote data unavailable:', error);
      return false;
    }
  }

  async function init() {
    const loaded = await loadRemote(true);
    if (!loaded) {
      state.data = localBank();
      state.baseline = stableJson(state.data);
      updateServerState(false, null);
    }

    const draft = readDraft();
    if (draft && stableJson(normalizeData(draft.data)) !== state.baseline) {
      state.draftAvailable = true;
      state.draftMeta = { savedAt: draft.savedAt, data: normalizeData(draft.data) };
    }

    bindEvents();
    updateCounts();
    render();
  }

  function bindEvents() {
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () {
        navigate(button.dataset.nav);
      });
    });

    el.globalSearch.addEventListener('input', function () {
      const query = el.globalSearch.value.trim();
      state.searchQuery = query;
      if (query) {
        if (state.view !== 'search') state.previousView = state.view;
        state.view = 'search';
        el.viewTitle.textContent = VIEW_TITLES.search;
        updateNavActive();
        render();
      } else if (state.view === 'search') {
        navigate(state.previousView || 'dashboard');
      }
    });

    el.publishBtn.addEventListener('click', publish);
    el.menuBtn.addEventListener('click', function () {
      el.sidebar.classList.add('is-open');
      el.sidebarScrim.classList.add('is-open');
    });
    el.sidebarScrim.addEventListener('click', closeSidebar);

    el.closeEditor.addEventListener('click', closeEditor);
    el.cancelEditor.addEventListener('click', closeEditor);
    el.drawerScrim.addEventListener('click', closeEditor);
    el.editorForm.addEventListener('submit', submitEditor);
    el.editorBody.addEventListener('click', handleEditorClick);
    el.fileInput.addEventListener('change', importFile);
    el.modalLayer.addEventListener('click', function (event) {
      if (event.target === el.modalLayer) closeModal(false);
    });

    el.main.addEventListener('click', handleMainClick);
    el.main.addEventListener('change', handleMainChange);
    el.main.addEventListener('input', handleMainInput);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (el.modalLayer.classList.contains('is-open')) {
          closeModal(false);
          return;
        }
        if (el.drawer.classList.contains('is-open')) {
          closeEditor();
          return;
        }
        if (state.view === 'search') {
          el.globalSearch.value = '';
          navigate(state.previousView || 'dashboard');
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (el.drawer.classList.contains('is-open')) {
          el.editorForm.requestSubmit();
        } else {
          publish();
        }
      }
    });
  }

  function closeSidebar() {
    el.sidebar.classList.remove('is-open');
    el.sidebarScrim.classList.remove('is-open');
  }

  function navigate(view) {
    state.view = VIEW_TITLES[view] ? view : 'dashboard';
    state.page = 1;
    el.viewTitle.textContent = VIEW_TITLES[state.view];
    if (state.view !== 'search') {
      el.globalSearch.value = '';
      state.searchQuery = '';
    }
    closeSidebar();
    updateNavActive();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNavActive() {
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.nav === state.view);
    });
  }

  function updateCounts() {
    if (!state.data) return;
    el.navQuestionCount.textContent = state.data.problems.length;
    el.navKnowledgeCount.textContent = state.data.knowledge.length + state.data.pitfalls.length;
  }

  function draftBanner() {
    if (!state.draftAvailable || !state.draftMeta) return '';
    return '<div class="draft-banner">' +
      '<span>检测到一份未发布的本地草稿，保存于 ' + escapeHtml(formatTime(state.draftMeta.savedAt)) + '。是否恢复？</span>' +
      '<button class="btn small primary" data-action="restore-draft">恢复草稿</button>' +
      '<button class="btn small" data-action="discard-draft">丢弃草稿</button>' +
      '</div>';
  }

  function render() {
    if (!state.data) {
      el.main.innerHTML = '<div class="empty-state"><span class="empty-mark">…</span><strong>正在载入内容</strong></div>';
      return;
    }
    let html = '';
    if (state.view === 'questions') html = viewQuestions();
    else if (state.view === 'knowledge') html = viewKnowledge();
    else if (state.view === 'taxonomy') html = viewTaxonomy();
    else if (state.view === 'data') html = viewData();
    else if (state.view === 'search') html = viewSearch();
    else html = viewDashboard();
    el.main.innerHTML = html;
  }

  function viewHead(eyebrow, title, description, actions) {
    return '<div class="view-head"><div>' +
      '<span class="eyebrow">' + escapeHtml(eyebrow) + '</span>' +
      '<h1>' + escapeHtml(title) + '</h1>' +
      '<p>' + escapeHtml(description) + '</p>' +
      '</div><div class="head-actions">' + (actions || '') + '</div></div>';
  }

  function viewDashboard() {
    const data = state.data;
    const recent = allItems().slice().sort(function (a, b) {
      return String(b.item.added || '').localeCompare(String(a.item.added || ''));
    }).slice(0, 6);
    const sectionCounts = new Map();
    allItems().forEach(function (entry) {
      const key = itemSection(entry.item);
      sectionCounts.set(key, (sectionCounts.get(key) || 0) + 1);
    });
    const bars = Array.from(sectionCounts.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 6);
    const barMax = Math.max.apply(null, bars.map(function (row) { return row[1]; }).concat([1]));
    const missingSolutions = data.problems.filter(function (item) { return !Array.isArray(item.solutions) || !item.solutions.length; }).length;
    const missingKnowledge = data.knowledge.filter(function (item) { return !text(item.content) || !Array.isArray(item.formulas) || !item.formulas.length; }).length;
    const missingPitfall = data.pitfalls.filter(function (item) { return !text(item.rule) || !text(item.remedy); }).length;
    const duplicateIds = countDuplicateIds();

    return draftBanner() +
      viewHead(
        'Dashboard',
        '内容管理总览',
        '统一维护题目、知识点与易错点，发布后公开网站会立即使用最新数据。',
        '<button class="btn" data-action="new-question">＋ 新建题目</button>' +
        '<button class="btn primary" data-action="new-knowledge">＋ 新建知识点</button>'
      ) +
      '<div class="metrics">' +
        metricCard('题库条目', data.problems.length, '道题目已收录', '∑', '含错题与经典题') +
        metricCard('知识点', data.knowledge.length, '条系统知识内容', '◇', '支持公式与解题提示') +
        metricCard('易错点', data.pitfalls.length, '条高频错误提醒', '!', '沉淀通用纠错规则') +
        metricCard('章节分类', chapters().length, '个章节 · ' + new Set(allItems().map(function (x) { return itemSection(x.item); })).size + ' 个分类', '≋', '跨题库与知识库共享') +
      '</div>' +
      '<div class="dashboard-grid">' +
        '<div class="panel">' +
          '<div class="panel-head"><div><h2>快速开始</h2><p>从最常用的维护动作开始</p></div></div>' +
          '<div class="panel-body"><div class="quick-grid">' +
            quickAction('∑', '新建题目', '录入题干、解法与解题关键', 'new-question') +
            quickAction('◇', '新建知识点', '整理定义、公式与使用提示', 'new-knowledge') +
            quickAction('!', '新建易错点', '记录错误表现与纠正方法', 'new-pitfall') +
            quickAction('⇅', '导入 / 导出', '备份数据或迁移已有题库', 'go-data') +
          '</div></div>' +
        '</div>' +
        '<div class="panel">' +
          '<div class="panel-head"><div><h2>分类分布</h2><p>按条目数量排序</p></div></div>' +
          '<div class="panel-body"><div class="section-bars">' +
            (bars.length ? bars.map(function (row) {
              return '<div class="bar-row"><span class="bar-label" title="' + escapeAttr(row[0]) + '">' +
                escapeHtml(truncate(row[0], 22)) + '</span><span class="bar-track"><span class="bar-fill" style="width:' +
                Math.max(7, Math.round(row[1] / barMax * 100)) + '%"></span></span><em>' + row[1] + '</em></div>';
            }).join('') : '<div class="empty-state"><p>还没有分类数据。</p></div>') +
          '</div></div>' +
        '</div>' +
        '<div class="panel">' +
          '<div class="panel-head"><div><h2>最近收录</h2><p>按收录日期显示最新条目</p></div>' +
            '<button class="btn small ghost" data-action="go-questions">查看题库</button></div>' +
          '<div class="panel-body recent-list">' +
            (recent.length ? recent.map(function (entry) {
              const meta = KIND_META[entry.kind];
              return '<div class="recent-item"><span class="recent-kind ' + meta.className + '">' + meta.label +
                '</span><span class="recent-copy">' + escapeHtml(truncate(itemTitle(entry.kind, entry.item), 52)) +
                '</span><span class="recent-date">' + escapeHtml(formatDate(entry.item.added)) + '</span></div>';
            }).join('') : '<div class="empty-state"><p>暂无收录内容。</p></div>') +
          '</div>' +
        '</div>' +
        '<div class="panel">' +
          '<div class="panel-head"><div><h2>内容检查</h2><p>发布前可优先处理这些条目</p></div></div>' +
          '<div class="panel-body health-list">' +
            healthItem(missingSolutions ? 'warning' : 'ok', '题目缺少完整解法', missingSolutions) +
            healthItem(missingKnowledge ? 'warning' : 'ok', '知识点缺少正文或公式', missingKnowledge) +
            healthItem(missingPitfall ? 'warning' : 'ok', '易错点缺少规则或纠正建议', missingPitfall) +
            healthItem(duplicateIds ? 'danger' : 'ok', '重复编号', duplicateIds) +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function metricCard(label, value, note, mark, extra) {
    return '<div class="metric-card" data-mark="' + escapeAttr(mark) + '">' +
      '<div class="metric-label"><span>' + escapeHtml(label) + '</span><i>' + escapeHtml(mark) + '</i></div>' +
      '<div class="metric-value">' + Number(value || 0).toLocaleString('zh-CN') + '</div>' +
      '<div class="metric-note">' + escapeHtml(note || extra || '') + '</div></div>';
  }

  function quickAction(mark, title, note, action) {
    return '<button class="quick-action" data-action="' + escapeAttr(action) + '"><b>' + escapeHtml(mark) +
      '</b><div><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(note) + '</small></div></button>';
  }

  function healthItem(level, label, count) {
    const cls = level === 'warning' ? 'is-warning' : level === 'danger' ? 'is-danger' : '';
    return '<div class="health-item ' + cls + '"><i></i><span>' + escapeHtml(label) +
      '</span><b>' + Number(count || 0) + ' 条</b></div>';
  }

  function countDuplicateIds() {
    let count = 0;
    Object.keys(KIND_META).forEach(function (kind) {
      const seen = new Set();
      collectionFor(kind).forEach(function (item) {
        const id = itemCode(kind, item);
        if (id && id !== '—' && id !== '未编号') {
          if (seen.has(id)) count += 1;
          else seen.add(id);
        }
      });
    });
    return count;
  }

  function viewQuestions() {
    const filters = state.filters;
    const optionsChapters = chapters();
    const optionsSections = (filters.chapter ? sections(filters.chapter) : Array.from(new Set(allItems().map(function (entry) {
      return itemSection(entry.item);
    })))).sort(function (a, b) { return indexOrder(a, false) - indexOrder(b, false); });
    const types = Array.from(new Set(state.data.problems.map(function (item) { return text(item.type); }).filter(Boolean))).sort();
    let list = state.data.problems.filter(function (item) {
      if (filters.chapter && text(item.chapter) !== filters.chapter) return false;
      if (filters.section && itemSection(item) !== filters.section) return false;
      if (filters.type && text(item.type) !== filters.type) return false;
      if (filters.difficulty && String(item.difficulty || 3) !== filters.difficulty) return false;
      return matchesQuery('questions', item, filters.questionQuery);
    });
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    return draftBanner() +
      viewHead('Question Bank', '题库管理', '维护题干、解法、考点、难度与错题复盘信息。',
        '<button class="btn primary" data-action="new-question">＋ 新建题目</button>') +
      '<div class="toolbar">' +
        '<input class="filter-input" id="questionQuery" value="' + escapeAttr(filters.questionQuery) + '" placeholder="筛选题目、编号、考点或标签">' +
        selectHtml('filterChapter', '全部章节', optionsChapters, filters.chapter) +
        selectHtml('filterSection', '全部分类', optionsSections, filters.section) +
        selectHtml('filterType', '全部题型', types, filters.type) +
        selectHtml('filterDifficulty', '全部难度', ['1', '2', '3', '4', '5'], filters.difficulty, function (value) { return value + ' 星'; }) +
        '<span class="toolbar-meta">共 ' + list.length + ' 条</span>' +
      '</div>' +
      '<div class="data-table-wrap">' +
        '<table class="data-table"><colgroup><col style="width:110px"><col><col style="width:210px"><col style="width:110px"><col style="width:90px"><col style="width:100px"><col style="width:110px"></colgroup>' +
        '<thead><tr><th>编号</th><th>题目</th><th>章节 / 分类</th><th>题型</th><th>难度</th><th>收录</th><th></th></tr></thead><tbody>' +
        (pageItems.length ? pageItems.map(questionRow).join('') : emptyTable('还没有符合筛选条件的题目', '新建一道题目，或调整筛选条件。', 'new-question', '新建题目')) +
        '</tbody></table></div>' +
      pagination(list.length, state.page, totalPages, '题');
  }

  function questionRow(item) {
    return '<tr data-open-kind="questions" data-open-id="' + escapeAttr(item.id) + '">' +
      '<td><span class="cell-id">' + escapeHtml(itemCode('questions', item)) + '</span></td>' +
      '<td><div class="cell-title">' + escapeHtml(truncate(item.statement, 90)) + '</div>' +
        '<span class="cell-sub">' + escapeHtml(truncate((item.topics || []).join(' · '), 66)) + '</span></td>' +
      '<td><span class="pill">' + escapeHtml(truncate(text(item.chapter, '未分章'), 12)) + '</span>' +
        '<span class="cell-sub">' + escapeHtml(truncate(itemSection(item), 24)) + '</span></td>' +
      '<td><span class="pill blue">' + escapeHtml(truncate(text(item.type, '未分类'), 12)) + '</span></td>' +
      '<td><span class="difficulty">' + '★'.repeat(Math.max(1, Math.min(5, Number(item.difficulty) || 3))) +
        '<span style="color:#ddd">' + '★'.repeat(5 - Math.max(1, Math.min(5, Number(item.difficulty) || 3))) + '</span></span></td>' +
      '<td><span class="cell-sub" style="margin:0">' + escapeHtml(formatDate(item.added)) + '</span></td>' +
      '<td>' + rowActions('questions', item.id) + '</td></tr>';
  }

  function viewKnowledge() {
    const isPoints = state.knowledgeTab === 'points';
    const kind = isPoints ? 'knowledge' : 'pitfalls';
    const base = collectionFor(kind);
    const list = base.filter(function (item) { return matchesQuery(kind, item, state.searchQuery); });
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);
    const table = isPoints ? knowledgeTable(pageItems) : pitfallTable(pageItems);

    return draftBanner() +
      viewHead('Knowledge Base', '知识库', '沉淀概念、公式、使用条件与易错提醒，供题库内容复用。',
        '<button class="btn" data-action="new-pitfall">＋ 新建易错点</button>' +
        '<button class="btn primary" data-action="new-knowledge">＋ 新建知识点</button>') +
      '<div class="toolbar">' +
        '<div class="segmented">' +
          '<button class="' + (isPoints ? 'is-active' : '') + '" data-knowledge-tab="points">知识点 ' + state.data.knowledge.length + '</button>' +
          '<button class="' + (!isPoints ? 'is-active' : '') + '" data-knowledge-tab="pitfalls">易错点 ' + state.data.pitfalls.length + '</button>' +
        '</div>' +
        '<span class="toolbar-meta">共 ' + list.length + ' 条</span>' +
      '</div>' +
      '<div class="data-table-wrap">' + table + '</div>' +
      pagination(list.length, state.page, totalPages, isPoints ? '个知识点' : '条易错点');
  }

  function knowledgeTable(items) {
    return '<table class="data-table"><colgroup><col style="width:130px"><col><col style="width:220px"><col style="width:120px"><col style="width:100px"><col style="width:110px"></colgroup>' +
      '<thead><tr><th>编号</th><th>知识点</th><th>章节 / 分类</th><th>标签</th><th>收录</th><th></th></tr></thead><tbody>' +
      (items.length ? items.map(function (item) {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        return '<tr data-open-kind="knowledge" data-open-id="' + escapeAttr(item.id) + '">' +
          '<td><span class="cell-id">' + escapeHtml(itemCode('knowledge', item)) + '</span></td>' +
          '<td><div class="cell-title">' + escapeHtml(truncate(item.title, 90)) + '</div>' +
            '<span class="cell-sub">' + escapeHtml(truncate(item.content || item.summary, 70)) + '</span></td>' +
          '<td><span class="pill">' + escapeHtml(truncate(text(item.chapter, '通用知识'), 13)) + '</span>' +
            '<span class="cell-sub">' + escapeHtml(truncate(itemSection(item), 25)) + '</span></td>' +
          '<td>' + (tags.length ? '<span class="pill green">' + escapeHtml(truncate(tags.join(' · '), 12)) + '</span>' : '<span class="cell-sub">—</span>') + '</td>' +
          '<td><span class="cell-sub" style="margin:0">' + escapeHtml(formatDate(item.added)) + '</span></td>' +
          '<td>' + rowActions('knowledge', item.id) + '</td></tr>';
      }).join('') : emptyTable('还没有知识点', '把常用定义、公式与使用条件整理成可检索的条目。', 'new-knowledge', '新建知识点')) +
      '</tbody></table>';
  }

  function pitfallTable(items) {
    return '<table class="data-table"><colgroup><col style="width:110px"><col><col style="width:220px"><col style="width:130px"><col style="width:100px"><col style="width:110px"></colgroup>' +
      '<thead><tr><th>编号</th><th>易错点</th><th>章节 / 分类</th><th>关联</th><th>收录</th><th></th></tr></thead><tbody>' +
      (items.length ? items.map(function (item) {
        return '<tr data-open-kind="pitfalls" data-open-id="' + escapeAttr(item.id) + '">' +
          '<td><span class="cell-id">' + escapeHtml(itemCode('pitfalls', item)) + '</span></td>' +
          '<td><div class="cell-title">' + escapeHtml(truncate(item.title, 90)) + '</div>' +
            '<span class="cell-sub">' + escapeHtml(truncate(item.rule, 70)) + '</span></td>' +
          '<td><span class="pill">' + escapeHtml(truncate(text(item.chapter, '通用方法'), 13)) + '</span>' +
            '<span class="cell-sub">' + escapeHtml(truncate(itemSection(item), 25)) + '</span></td>' +
          '<td><span class="pill red">' + escapeHtml(String((item.related || []).length)) + ' 项关联</span></td>' +
          '<td><span class="cell-sub" style="margin:0">' + escapeHtml(formatDate(item.added)) + '</span></td>' +
          '<td>' + rowActions('pitfalls', item.id) + '</td></tr>';
      }).join('') : emptyTable('还没有易错点', '记录错误表现、原因和纠正动作，让同类错误不再重复。', 'new-pitfall', '新建易错点')) +
      '</tbody></table>';
  }

  function rowActions(kind, id) {
    return '<div class="row-actions">' +
      '<button class="row-action" title="编辑" data-action="edit" data-kind="' + kind + '" data-id="' + escapeAttr(id) + '">✎</button>' +
      '<button class="row-action" title="复制" data-action="duplicate" data-kind="' + kind + '" data-id="' + escapeAttr(id) + '">⧉</button>' +
      '<button class="row-action del" title="删除" data-action="delete" data-kind="' + kind + '" data-id="' + escapeAttr(id) + '">×</button>' +
      '</div>';
  }

  function emptyTable(title, note, action, buttonLabel) {
    return '<tr><td colspan="7"><div class="empty-state"><span class="empty-mark">◇</span><strong>' +
      escapeHtml(title) + '</strong><p>' + escapeHtml(note) + '</p><button class="btn small" data-action="' +
      escapeAttr(action) + '">' + escapeHtml(buttonLabel) + '</button></div></td></tr>';
  }

  function selectHtml(id, allLabel, options, selected, labeler) {
    return '<select id="' + id + '"><option value="">' + escapeHtml(allLabel) + '</option>' +
      options.map(function (option) {
        const value = String(option);
        return '<option value="' + escapeAttr(value) + '"' + (value === selected ? ' selected' : '') + '>' +
          escapeHtml(labeler ? labeler(value) : value) + '</option>';
      }).join('') + '</select>';
  }

  function pagination(total, current, totalPages, noun) {
    if (!total) return '';
    const start = (current - 1) * PAGE_SIZE + 1;
    const end = Math.min(total, current * PAGE_SIZE);
    let buttons = '';
    const pages = [];
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - current) <= 1) pages.push(page);
    }
    let last = 0;
    pages.forEach(function (page) {
      if (last && page - last > 1) buttons += '<button disabled>…</button>';
      buttons += '<button class="' + (page === current ? 'is-current' : '') + '" data-page="' + page + '">' + page + '</button>';
      last = page;
    });
    return '<div class="pagination"><span>显示 ' + start + '–' + end + '，共 ' + total + ' ' + escapeHtml(noun) +
      '</span><div class="page-buttons">' +
      '<button data-page="' + (current - 1) + '"' + (current <= 1 ? ' disabled' : '') + '>‹</button>' +
      buttons +
      '<button data-page="' + (current + 1) + '"' + (current >= totalPages ? ' disabled' : '') + '>›</button>' +
      '</div></div>';
  }

  function viewTaxonomy() {
    const map = new Map();
    allItems().forEach(function (entry) {
      const chapter = text(entry.item.chapter, '未分章');
      const section = itemSection(entry.item);
      if (!map.has(chapter)) map.set(chapter, new Map());
      const sectionsMap = map.get(chapter);
      if (!sectionsMap.has(section)) sectionsMap.set(section, { questions: 0, knowledge: 0, pitfalls: 0 });
      sectionsMap.get(section)[entry.kind] += 1;
    });

    const chapterCards = Array.from(map.entries()).map(function (entry, index) {
      const chapter = entry[0];
      const sectionsMap = entry[1];
      const total = Array.from(sectionsMap.values()).reduce(function (sum, row) {
        return sum + row.questions + row.knowledge + row.pitfalls;
      }, 0);
      const rows = Array.from(sectionsMap.entries()).map(function (sectionEntry) {
        const section = sectionEntry[0];
        const count = sectionEntry[1];
        return '<div class="section-row"><span class="section-name" title="' + escapeAttr(section) + '">' + escapeHtml(section) + '</span>' +
          '<span class="section-kinds"><span>题 ' + count.questions + '</span><span>知 ' + count.knowledge + '</span><span>错 ' + count.pitfalls + '</span></span>' +
          '<button class="icon-btn" data-action="rename-section" data-chapter="' + escapeAttr(chapter) + '" data-section="' + escapeAttr(section) + '" title="重命名分类">✎</button>' +
          '</div>';
      }).join('');
      return '<div class="panel chapter-card"><div class="chapter-head"><span class="chapter-index">' + (index + 1) + '</span>' +
        '<div><h3>' + escapeHtml(chapter) + '</h3><span>' + sectionsMap.size + ' 个分类</span></div>' +
        '<span class="chapter-count">' + total + ' 条内容</span>' +
        '<button class="icon-btn" data-action="rename-chapter" data-chapter="' + escapeAttr(chapter) + '" title="重命名章节">✎</button>' +
        '</div>' + rows + '</div>';
    }).join('');

    return viewHead('Taxonomy', '章节结构', '分类名会被题库、知识点和易错点共同使用。重命名会同步更新所有条目。') +
      '<div class="taxonomy-layout"><div>' + (chapterCards || '<div class="empty-state"><span class="empty-mark">≋</span><strong>还没有章节</strong><p>新建内容时填写章节与分类即可自动生成结构。</p></div>') + '</div>' +
      '<div class="panel tips-card"><div class="panel-head"><div><h2>整理建议</h2><p>让内容更容易被找到</p></div></div>' +
      '<div class="panel-body tips-list">' +
        '<div class="tip-item"><b>1</b><span>章节保持教材级粒度，例如「第一章 函数与极限」。</span></div>' +
        '<div class="tip-item"><b>2</b><span>分类承担检索职责，例如「§3.6 两个重要极限」或「等价无穷小」。</span></div>' +
        '<div class="tip-item"><b>3</b><span>重命名会同步影响公开网站，发布前请确认名称没有误改。</span></div>' +
        '<div class="tip-item"><b>4</b><span>同一个分类可以同时容纳题目、知识点和易错点。</span></div>' +
      '</div></div></div>';
  }

  function viewData() {
    const counts = {
      problems: state.data.problems.length,
      knowledge: state.data.knowledge.length,
      pitfalls: state.data.pitfalls.length
    };
    const size = new Blob([stableJson(state.data)]).size;
    const serverStatus = state.apiOnline ? '已连接，可直接发布' : '未连接，发布时下载 data.js';
    return viewHead('Data & Backup', '数据与备份', '检查数据来源、迁移内容或导出完整备份。') +
      '<div class="data-grid"><div class="panel"><div class="panel-head"><div><h2>当前数据</h2><p>公开网站读取的数据源</p></div></div>' +
      '<div class="panel-body info-list">' +
        infoRow('数据文件', DATA_FILE) +
        infoRow('题目', counts.problems + ' 条') +
        infoRow('知识点', counts.knowledge + ' 条') +
        infoRow('易错点', counts.pitfalls + ' 条') +
        infoRow('数据大小', formatBytes(size)) +
        infoRow('数据接口', serverStatus) +
        infoRow('最近写入', state.serverInfo && state.serverInfo.modifiedAt ? formatTime(state.serverInfo.modifiedAt) : '—') +
        infoRow('自动备份', state.serverInfo && state.serverInfo.backup ? state.serverInfo.backup : '发布时自动保存到 .backups') +
        infoRow('本地草稿', state.dirty ? '存在未发布更改' : '无未发布更改') +
      '</div></div>' +
      '<div class="panel"><div class="panel-head"><div><h2>工具</h2><p>备份、迁移与恢复</p></div></div><div class="panel-body action-stack">' +
        actionCard('⇩', '导出 JSON', '下载完整数据，适合备份或迁移。', 'export-json', '导出') +
        actionCard('{ }', '下载 data.js', '生成公开网站可直接使用的数据文件。', 'download-data', '下载') +
        actionCard('⇧', '导入 JSON', '用备份文件替换当前数据，导入后仍需发布。', 'import-data', '选择文件') +
        actionCard('↻', '从磁盘重新载入', '放弃当前未发布更改，重新读取 data.js。', 'reload-data', '重新载入') +
        actionCard('⌫', '清除本地草稿', '删除浏览器中保存的自动草稿。', 'clear-draft', '清除') +
        actionCard('↑', '发布更新', '将当前内容写入 data.js 并更新公开网站。', 'publish', '发布') +
      '</div></div></div>';
  }

  function infoRow(label, value) {
    return '<div class="info-row"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
  }

  function actionCard(mark, title, note, action, buttonLabel) {
    return '<div class="action-card"><i>' + escapeHtml(mark) + '</i><div><strong>' + escapeHtml(title) +
      '</strong><small>' + escapeHtml(note) + '</small></div><button class="btn small" data-action="' +
      escapeAttr(action) + '">' + escapeHtml(buttonLabel) + '</button></div>';
  }

  function viewSearch() {
    const query = state.searchQuery;
    const groups = {};
    if (query) {
      allItems().forEach(function (entry) {
        if (!matchesQuery(entry.kind, entry.item, query)) return;
        if (!groups[entry.kind]) groups[entry.kind] = [];
        groups[entry.kind].push(entry.item);
      });
    }
    const total = Object.keys(groups).reduce(function (sum, kind) { return sum + groups[kind].length; }, 0);
    let body = '';
    ['questions', 'knowledge', 'pitfalls'].forEach(function (kind) {
      const items = groups[kind] || [];
      if (!items.length) return;
      const meta = KIND_META[kind];
      body += '<section class="search-group"><h2>' + meta.plural + ' · ' + items.length + '</h2>' +
        items.slice(0, 20).map(function (item) {
          return '<div class="search-result" data-open-kind="' + kind + '" data-open-id="' + escapeAttr(item.id) + '">' +
            '<span class="recent-kind ' + meta.className + '">' + meta.label + '</span>' +
            '<div class="result-main"><strong>' + escapeHtml(truncate(itemTitle(kind, item), 100)) + '</strong>' +
            '<small>' + escapeHtml(itemCode(kind, item)) + ' · ' + escapeHtml(text(item.chapter, '未分章')) +
            ' · ' + escapeHtml(itemSection(item)) + '</small></div><span class="muted">编辑 ›</span></div>';
        }).join('') + '</section>';
    });
    return viewHead('Search', '搜索结果', '关键词：' + (query || '—') + '　共找到 ' + total + ' 条内容。') +
      (body || '<div class="empty-state"><span class="empty-mark">⌕</span><strong>没有找到相关内容</strong><p>尝试搜索题目编号、公式片段、章节名称或标签。</p></div>');
  }

  function handleMainClick(event) {
    const actionNode = event.target.closest('[data-action]');
    if (actionNode) {
      event.stopPropagation();
      const action = actionNode.dataset.action;
      if (action === 'new-question') openEditor('questions');
      if (action === 'new-knowledge') openEditor('knowledge');
      if (action === 'new-pitfall') openEditor('pitfalls');
      if (action === 'edit') openEditor(actionNode.dataset.kind, actionNode.dataset.id);
      if (action === 'duplicate') duplicateItem(actionNode.dataset.kind, actionNode.dataset.id);
      if (action === 'delete') deleteItem(actionNode.dataset.kind, actionNode.dataset.id);
      if (action === 'go-data') navigate('data');
      if (action === 'go-questions') navigate('questions');
      if (action === 'export-json') exportJson();
      if (action === 'download-data') downloadDataJs();
      if (action === 'import-data') el.fileInput.click();
      if (action === 'reload-data') reloadData();
      if (action === 'clear-draft') clearDraftAction();
      if (action === 'publish') publish();
      if (action === 'restore-draft') restoreDraft();
      if (action === 'discard-draft') discardDraft();
      if (action === 'rename-chapter') renameChapter(actionNode.dataset.chapter);
      if (action === 'rename-section') renameSection(actionNode.dataset.chapter, actionNode.dataset.section);
      return;
    }

    const tab = event.target.closest('[data-knowledge-tab]');
    if (tab) {
      state.knowledgeTab = tab.dataset.knowledgeTab;
      state.page = 1;
      render();
      return;
    }

    const page = event.target.closest('[data-page]');
    if (page && !page.disabled) {
      const value = Number(page.dataset.page);
      if (Number.isFinite(value) && value > 0) {
        state.page = value;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const row = event.target.closest('[data-open-kind]');
    if (row) {
      openEditor(row.dataset.openKind, row.dataset.openId);
    }
  }

  function handleMainChange(event) {
    const target = event.target;
    if (!target.id) return;
    if (target.id === 'filterChapter') {
      state.filters.chapter = target.value;
      state.filters.section = '';
      state.page = 1;
      render();
    } else if (target.id === 'filterSection') {
      state.filters.section = target.value;
      state.page = 1;
      render();
    } else if (target.id === 'filterType') {
      state.filters.type = target.value;
      state.page = 1;
      render();
    } else if (target.id === 'filterDifficulty') {
      state.filters.difficulty = target.value;
      state.page = 1;
      render();
    }
  }

  function handleMainInput(event) {
    if (event.target.id !== 'questionQuery') return;
    state.filters.questionQuery = event.target.value;
    state.page = 1;
    const value = event.target.value;
    const selection = event.target.selectionStart;
    window.clearTimeout(handleMainInput.timer);
    handleMainInput.timer = window.setTimeout(function () {
      render();
      const input = document.getElementById('questionQuery');
      if (input) {
        input.focus();
        try { input.setSelectionRange(selection, selection); } catch (error) {}
      }
    }, 180);
  }

  function duplicateItem(kind, id) {
    const source = itemById(kind, id);
    if (!source) return;
    const copy = clone(source);
    copy.id = uniqueCopyId(kind, source.id);
    if (kind === 'questions') copy.statement = text(source.statement) + '（副本）';
    else copy.title = text(source.title) + '（副本）';
    copy.added = today();
    openEditor(kind, null, copy);
  }

  function deleteItem(kind, id) {
    const item = itemById(kind, id);
    if (!item) return;
    confirmDialog({
      title: '删除这条' + KIND_META[kind].label + '？',
      message: '「' + truncate(itemTitle(kind, item), 54) + '」将从当前数据中移除。发布后公开网站也会同步删除。',
      confirmText: '确认删除',
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      state.data[KIND_COLLECTION[kind]] = collectionFor(kind).filter(function (entry) {
        return String(entry.id) !== String(id);
      });
      state.draftAvailable = false;
      updateCounts();
      setDirty(true);
      render();
      toast('已删除，尚未发布', 'success');
    });
  }

  function renameChapter(chapter) {
    askDialog({
      title: '重命名章节',
      message: '所有属于该章节的题目、知识点与易错点会同步更新。',
      value: chapter,
      confirmText: '保存名称'
    }).then(function (value) {
      if (!value || value === chapter) return;
      let changed = 0;
      Object.keys(KIND_META).forEach(function (kind) {
        collectionFor(kind).forEach(function (item) {
          if (text(item.chapter) === chapter) {
            item.chapter = value;
            changed += 1;
          }
        });
      });
      if (!changed) return;
      state.draftAvailable = false;
      setDirty(true);
      render();
      toast('已重命名章节并更新 ' + changed + ' 条内容', 'success');
    });
  }

  function renameSection(chapter, section) {
    askDialog({
      title: '重命名分类',
      message: '章节「' + chapter + '」下的该分类会同步更新。',
      value: section,
      confirmText: '保存名称'
    }).then(function (value) {
      if (!value || value === section) return;
      let changed = 0;
      Object.keys(KIND_META).forEach(function (kind) {
        collectionFor(kind).forEach(function (item) {
          if (text(item.chapter) === chapter && itemSection(item) === section) {
            if (item.section != null || !item.category) item.section = value;
            else item.category = value;
            changed += 1;
          }
        });
      });
      if (!changed) return;
      state.draftAvailable = false;
      setDirty(true);
      render();
      toast('已重命名分类并更新 ' + changed + ' 条内容', 'success');
    });
  }

  function restoreDraft() {
    if (!state.draftMeta) return;
    state.data = normalizeData(state.draftMeta.data);
    state.draftAvailable = false;
    updateCounts();
    setDirty(true);
    render();
    toast('已恢复本地草稿', 'success');
  }

  function discardDraft() {
    clearDraft();
    render();
    toast('已丢弃本地草稿');
  }

  function clearDraftAction() {
    confirmDialog({
      title: '清除本地草稿？',
      message: '这不会影响已经发布的数据，只会删除浏览器里保存的未发布副本。',
      confirmText: '清除草稿',
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      clearDraft();
      render();
      toast('本地草稿已清除');
    });
  }

  function exportJson() {
    downloadFile('bank-backup-' + today() + '.json', JSON.stringify(state.data, null, 2), 'application/json');
    toast('JSON 备份已下载', 'success');
  }

  function dataJsContent() {
    return 'const BANK = ' + JSON.stringify(state.data, null, 2) + ';\n';
  }

  function downloadDataJs() {
    downloadFile(DATA_FILE, dataJsContent(), 'text/javascript');
    toast('data.js 已下载，可用于替换站点数据文件', 'success');
  }

  function downloadFile(name, content, mime) {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function importFile(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(reader.result);
        const data = normalizeData(parsed && parsed.data && !parsed.problems ? parsed.data : parsed);
        if (!Array.isArray(data.problems) || !Array.isArray(data.knowledge) || !Array.isArray(data.pitfalls)) {
          throw new Error('缺少 problems、knowledge 或 pitfalls 数组');
        }
        confirmDialog({
          title: '导入并替换当前数据？',
          message: '将导入 ' + data.problems.length + ' 道题目、' + data.knowledge.length + ' 个知识点、' +
            data.pitfalls.length + ' 条易错点。导入后仍需点击「发布更新」。',
          confirmText: '导入数据'
        }).then(function (ok) {
          if (!ok) return;
          state.data = data;
          state.draftAvailable = false;
          updateCounts();
          setDirty(true);
          render();
          toast('数据已导入，请检查后发布', 'success');
        });
      } catch (error) {
        toast('导入失败：' + error.message, 'error');
      }
    };
    reader.onerror = function () { toast('文件读取失败', 'error'); };
    reader.readAsText(file, 'utf-8');
  }

  async function publish() {
    if (!state.data) return;
    const publishButtons = [el.publishBtn].concat(Array.from(document.querySelectorAll('[data-action="publish"]')));
    publishButtons.forEach(function (button) { setBusy(button, true, '发布中…'); });
    try {
      if (!state.apiOnline) {
        downloadDataJs();
        setSaveState('dirty', '已导出，等待替换');
        toast('后端未连接：已下载最新 data.js，请替换站点文件', '');
        return;
      }
      const response = await fetch('api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state.data })
      });
      const payload = await response.json().catch(function () { return {}; });
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || ('HTTP ' + response.status));
      }
      state.baseline = stableJson(state.data);
      state.serverInfo = payload.meta || state.serverInfo;
      state.dirty = false;
      clearDraft();
      setSaveState('', '已同步');
      toast('发布成功，公开网站已使用最新内容', 'success');
      render();
    } catch (error) {
      console.error(error);
      setSaveState('error', '发布失败');
      toast('发布失败：' + error.message, 'error');
    } finally {
      publishButtons.forEach(function (button) { setBusy(button, false); });
    }
  }

  function reloadData() {
    if (!state.apiOnline) {
      window.location.reload();
      return;
    }
    confirmDialog({
      title: '从磁盘重新载入？',
      message: '当前未发布的更改会保留为本地草稿，页面将读取最新的 data.js。',
      confirmText: '重新载入'
    }).then(async function (ok) {
      if (!ok) return;
      if (state.dirty) saveDraft();
      const loaded = await loadRemote(false);
      if (!loaded) {
        toast('重新载入失败，请检查服务', 'error');
        return;
      }
      state.dirty = false;
      clearDraft();
      updateCounts();
      render();
      toast('已从磁盘重新载入数据', 'success');
    });
  }

  function openEditor(kind, id, prefill) {
    if (!KIND_META[kind]) return;
    let source = prefill ? clone(prefill) : id ? clone(itemById(kind, id)) : null;
    if (!source) source = newItem(kind);
    state.editor = {
      kind: kind,
      id: id || null,
      original: source,
      isNew: !id
    };
    el.editorEyebrow.textContent = (id ? '编辑' : '新建') + ' · ' + KIND_META[kind].label;
    el.editorTitle.textContent = id ? itemCode(kind, source) : '新建' + KIND_META[kind].label;
    el.saveEditor.textContent = id ? '保存修改' : '创建条目';
    el.formHint.textContent = '带 * 的字段为必填项 · Ctrl / ⌘ + S 保存';
    renderEditorForm(source);
    el.drawer.classList.add('is-open');
    el.drawerScrim.classList.add('is-open');
    el.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () {
      const first = el.editorBody.querySelector('input, textarea, select');
      if (first) first.focus();
    }, 260);
  }

  function closeEditor() {
    el.drawer.classList.remove('is-open');
    el.drawerScrim.classList.remove('is-open');
    el.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.editor = null;
  }

  function newItem(kind) {
    if (kind === 'questions') {
      return {
        id: '', source: '', chapter: defaultChapter(), section: sections(defaultChapter())[0] || '',
        statement: '', type: '计算题', difficulty: 3, topics: [], tags: [], key_points: [],
        solutions: [], pitfalls: [], related: [], added: today(),
        my_answer: '', right_answer: '', error_analysis: ''
      };
    }
    if (kind === 'knowledge') {
      return {
        id: nextKnowledgeId(), title: '', chapter: defaultChapter(),
        section: sections(defaultChapter())[0] || '知识点', category: '核心概念',
        summary: '', content: '', formulas: [], tips: [], tags: [], related: [], added: today()
      };
    }
    return {
      id: nextPitfallId(), title: '', chapter: defaultChapter(), section: '高频易错点',
      rule: '', why: '', valid: '', invalid: '', remedy: '',
      related: [], added: today()
    };
  }

  function renderEditorForm(model) {
    const scroll = el.editorBody.scrollTop;
    const datalists = '<datalist id="chapterOptions">' + chapters().map(function (value) {
      return '<option value="' + escapeAttr(value) + '">';
    }).join('') + '</datalist><datalist id="sectionOptions">' + sections(model.chapter).map(function (value) {
      return '<option value="' + escapeAttr(value) + '">';
    }).join('') + '</datalist><datalist id="typeOptions">' +
      Array.from(new Set(state.data.problems.map(function (item) { return text(item.type); }).filter(Boolean))).map(function (value) {
        return '<option value="' + escapeAttr(value) + '">';
      }).join('') + '</datalist>';
    let html = datalists;
    if (state.editor.kind === 'questions') html += questionForm(model);
    else if (state.editor.kind === 'knowledge') html += knowledgeForm(model);
    else html += pitfallForm(model);
    el.editorBody.innerHTML = html;
    el.editorBody.scrollTop = scroll;
  }

  function questionForm(model) {
    return '<section class="form-section"><div class="form-section-head"><div><h3>基本信息</h3><p>编号用于检索，章节与分类决定公开站点的归类。</p></div></div>' +
      '<div class="form-grid">' +
        field('编号', 'id', model.id, { required: true, placeholder: '例如 1-3.5(4)' }) +
        field('出处', 'source', model.source, { placeholder: '习题、作业或试卷来源' }) +
        field('章节', 'chapter', model.chapter, { required: true, list: 'chapterOptions' }) +
        field('分类', 'section', model.section, { required: true, list: 'sectionOptions', placeholder: '例如 §3.6 两个重要极限' }) +
        field('题型', 'type', model.type, { list: 'typeOptions', placeholder: '计算题 / 证明题…' }) +
        field('难度', 'difficulty', model.difficulty, { type: 'select', options: ['1', '2', '3', '4', '5'], labeler: function (v) { return v + ' 星'; } }) +
        field('收录日期', 'added', model.added, { type: 'date' }) +
      '</div></section>' +
      '<section class="form-section"><div class="form-section-head"><div><h3>题干</h3><p>支持 LaTeX 行内公式，例如 $x \\to 0$。</p></div></div>' +
        field('题目正文', 'statement', model.statement, { required: true, type: 'textarea', rows: 5, wide: true, placeholder: '粘贴或输入完整题干…' }) +
      '</section>' +
      '<section class="form-section"><div class="form-section-head"><div><h3>考点与解题关键</h3><p>每行一条，便于检索和展示。</p></div></div>' +
        '<div class="form-grid">' +
          field('考点', 'topics', (model.topics || []).join('\n'), { type: 'textarea', rows: 5, wide: true, help: '每行一个考点' }) +
          field('解题关键', 'key_points', (model.key_points || []).join('\n'), { type: 'textarea', rows: 5, wide: true, help: '每行一个关键步骤或观察点' }) +
        '</div>' +
      '</section>' +
      solutionSection(model) +
      '<section class="form-section"><div class="form-section-head"><div><h3>标签与关联</h3><p>帮助内容被搜索和交叉引用。</p></div></div>' +
        '<div class="form-grid">' +
          field('标签', 'tags', (model.tags || []).join('，'), { wide: true, help: '用逗号或换行分隔' }) +
          field('易错点', 'pitfalls', (model.pitfalls || []).join('\n'), { type: 'textarea', rows: 4, wide: true, help: '每行一条本题专属易错提醒' }) +
          field('关联内容', 'related', (model.related || []).join('\n'), { type: 'textarea', rows: 4, wide: true, help: '每行一个关联题目、定理或知识点' }) +
        '</div>' +
      '</section>' +
      '<section class="form-section"><details class="details-block"><summary>错题复盘（可选）</summary><div class="form-grid" style="margin-top:12px">' +
        field('当时答案', 'my_answer', model.my_answer, { type: 'textarea', rows: 3, wide: true }) +
        field('正确答案', 'right_answer', model.right_answer, { type: 'textarea', rows: 3, wide: true }) +
        field('错因分析', 'error_analysis', model.error_analysis, { type: 'textarea', rows: 4, wide: true }) +
      '</div></details></section>';
  }

  function solutionSection(model) {
    const solutions = model.solutions || [];
    return '<section class="form-section"><div class="form-section-head"><div><h3>解题过程</h3><p>可以保留多种解法，每条步骤独占一行。</p></div>' +
      '<button type="button" class="btn small" data-editor-action="add-solution">＋ 添加解法</button></div>' +
      '<div class="solution-list">' +
      (solutions.length ? solutions.map(function (solution, index) {
        return '<div class="solution-card" data-solution-index="' + index + '"><div class="solution-card-head"><strong>解法 ' + (index + 1) + '</strong>' +
          '<button type="button" class="remove-solution" data-editor-action="remove-solution" data-index="' + index + '">移除解法</button></div>' +
          '<div class="field"><label>解法名称</label><input data-sol-field="name" value="' + escapeAttr(solution.name) + '" placeholder="例如 解法一：等价替换"></div>' +
          '<div class="field"><label>推导步骤</label><textarea data-sol-field="steps" rows="5" placeholder="每行一步…">' +
          escapeHtml((solution.steps || []).join('\n')) + '</textarea></div></div>';
      }).join('') : '<div class="empty-state" style="padding:28px 15px"><p>还没有解题过程。可先保存题干与考点，稍后补充解法。</p></div>') +
      '</div></section>';
  }

  function knowledgeForm(model) {
    return '<section class="form-section"><div class="form-section-head"><div><h3>基本信息</h3><p>知识点会显示在公开网站的「知识点 · 易错点」栏目。</p></div></div>' +
      '<div class="form-grid">' +
        field('编号', 'id', model.id, { required: true }) +
        field('标题', 'title', model.title, { required: true, placeholder: '清晰描述这条知识' }) +
        field('章节', 'chapter', model.chapter, { list: 'chapterOptions' }) +
        field('分类', 'section', model.section, { list: 'sectionOptions', placeholder: '例如 常用等价量' }) +
        field('类别', 'category', model.category, { placeholder: '核心概念 / 公式 / 方法' }) +
        field('收录日期', 'added', model.added, { type: 'date' }) +
      '</div></section>' +
      '<section class="form-section"><div class="form-section-head"><div><h3>正文</h3><p>支持 LaTeX 行内公式。</p></div></div>' +
        '<div class="form-grid">' +
          field('摘要', 'summary', model.summary, { type: 'textarea', rows: 3, wide: true, help: '用于快速浏览，可留空' }) +
          field('知识正文', 'content', model.content, { required: true, type: 'textarea', rows: 7, wide: true, placeholder: '解释概念、条件与用途…' }) +
        '</div></section>' +
      '<section class="form-section"><div class="form-section-head"><div><h3>公式与提示</h3><p>每行一条，公开网站会单独排版展示。</p></div></div>' +
        '<div class="form-grid">' +
          field('公式', 'formulas', (model.formulas || []).join('\n'), { type: 'textarea', rows: 7, wide: true, help: '每行一个公式或结论' }) +
          field('使用提示', 'tips', (model.tips || []).join('\n'), { type: 'textarea', rows: 6, wide: true, help: '每行一条提示' }) +
          field('标签', 'tags', (model.tags || []).join('，'), { wide: true, help: '用逗号或换行分隔' }) +
          field('关联内容', 'related', (model.related || []).join('\n'), { type: 'textarea', rows: 4, wide: true, help: '每行一个关联条目' }) +
        '</div></section>';
  }

  function pitfallForm(model) {
    return '<section class="form-section"><div class="form-section-head"><div><h3>基本信息</h3><p>用一句话说明错误规则，再补充原因与纠正方式。</p></div></div>' +
      '<div class="form-grid">' +
        field('编号', 'id', model.id, { required: true }) +
        field('标题', 'title', model.title, { required: true, placeholder: '例如 等价量替换只能在因式位置使用' }) +
        field('章节', 'chapter', model.chapter, { list: 'chapterOptions' }) +
        field('分类', 'section', model.section, { list: 'sectionOptions', placeholder: '例如 高频易错点' }) +
        field('收录日期', 'added', model.added, { type: 'date' }) +
      '</div></section>' +
      '<section class="form-section"><div class="form-section-head"><div><h3>错误说明</h3><p>区分规则、原因、正反例与纠正动作。</p></div></div>' +
        '<div class="form-grid">' +
          field('规则', 'rule', model.rule, { required: true, type: 'textarea', rows: 4, wide: true }) +
          field('为什么错', 'why', model.why, { type: 'textarea', rows: 5, wide: true }) +
          field('正确示例', 'valid', model.valid, { type: 'textarea', rows: 3, wide: true }) +
          field('错误示例', 'invalid', model.invalid, { type: 'textarea', rows: 3, wide: true }) +
          field('纠正方法', 'remedy', model.remedy, { type: 'textarea', rows: 5, wide: true }) +
          field('关联内容', 'related', (model.related || []).join('\n'), { type: 'textarea', rows: 4, wide: true, help: '每行一个关联条目' }) +
        '</div></section>';
  }

  function field(label, name, value, options) {
    const opts = options || {};
    const id = 'field-' + name;
    const required = opts.required ? ' <em>*</em>' : '';
    let control = '';
    if (opts.type === 'textarea') {
      control = '<textarea id="' + id + '" data-field="' + name + '" rows="' + (opts.rows || 4) + '"' +
        (opts.placeholder ? ' placeholder="' + escapeAttr(opts.placeholder) + '"' : '') + '>' +
        escapeHtml(value == null ? '' : value) + '</textarea>';
    } else if (opts.type === 'select') {
      control = '<select id="' + id + '" data-field="' + name + '">' + (opts.options || []).map(function (option) {
        return '<option value="' + escapeAttr(option) + '"' + (String(value) === String(option) ? ' selected' : '') + '>' +
          escapeHtml(opts.labeler ? opts.labeler(option) : option) + '</option>';
      }).join('') + '</select>';
    } else {
      control = '<input id="' + id + '" data-field="' + name + '" type="' + (opts.type || 'text') + '" value="' +
        escapeAttr(value == null ? '' : value) + '"' + (opts.list ? ' list="' + opts.list + '"' : '') +
        (opts.placeholder ? ' placeholder="' + escapeAttr(opts.placeholder) + '"' : '') + '>';
    }
    return '<div class="field' + (opts.wide ? ' wide' : '') + '" data-field-wrap="' + name + '"><label for="' + id + '">' +
      escapeHtml(label) + required + '</label>' + control +
      (opts.help ? '<span class="field-help">' + escapeHtml(opts.help) + '</span>' : '') + '</div>';
  }

  function handleEditorClick(event) {
    const button = event.target.closest('[data-editor-action]');
    if (!button) return;
    const action = button.dataset.editorAction;
    if (action === 'add-solution' || action === 'remove-solution') {
      const model = collectEditorModel({ preserveErrors: true });
      if (!Array.isArray(model.solutions)) model.solutions = [];
      if (action === 'add-solution') {
        model.solutions.push({ name: '解法 ' + (model.solutions.length + 1), steps: [] });
      } else {
        model.solutions.splice(Number(button.dataset.index), 1);
      }
      renderEditorForm(model);
    }
  }

  function collectEditorModel() {
    const kind = state.editor.kind;
    const original = state.editor.original || {};
    const model = clone(original);
    el.editorBody.querySelectorAll('[data-field]').forEach(function (input) {
      model[input.dataset.field] = input.value;
    });
    model.id = text(model.id);
    model.chapter = text(model.chapter);
    model.section = text(model.section);
    model.added = text(model.added);
    if (kind === 'questions') {
      model.source = text(model.source);
      model.statement = text(model.statement);
      model.type = text(model.type);
      model.difficulty = Number(model.difficulty) || 3;
      model.topics = splitLines(model.topics);
      model.tags = splitTags(model.tags);
      model.key_points = splitLines(model.key_points);
      model.pitfalls = splitLines(model.pitfalls);
      model.related = splitLines(model.related);
      model.my_answer = text(model.my_answer);
      model.right_answer = text(model.right_answer);
      model.error_analysis = text(model.error_analysis);
      model.solutions = Array.from(el.editorBody.querySelectorAll('[data-solution-index]')).map(function (card) {
        return {
          name: text(card.querySelector('[data-sol-field="name"]').value, '解法'),
          steps: splitLines(card.querySelector('[data-sol-field="steps"]').value)
        };
      });
    } else if (kind === 'knowledge') {
      model.title = text(model.title);
      model.category = text(model.category);
      model.summary = text(model.summary);
      model.content = text(model.content);
      model.formulas = splitLines(model.formulas);
      model.tips = splitLines(model.tips);
      model.tags = splitTags(model.tags);
      model.related = splitLines(model.related);
    } else {
      model.title = text(model.title);
      model.rule = text(model.rule);
      model.why = text(model.why);
      model.valid = text(model.valid);
      model.invalid = text(model.invalid);
      model.remedy = text(model.remedy);
      model.related = splitLines(model.related);
    }
    return model;
  }

  function submitEditor(event) {
    event.preventDefault();
    const model = collectEditorModel();
    const kind = state.editor.kind;
    const errors = validateItem(kind, model);
    clearFormErrors();
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach(function (fieldName) {
        const wrap = el.editorBody.querySelector('[data-field-wrap="' + fieldName + '"]');
        if (wrap) {
          wrap.classList.add('has-error');
          const message = document.createElement('span');
          message.className = 'error-text';
          message.textContent = errors[fieldName];
          wrap.appendChild(message);
        }
      });
      const first = el.editorBody.querySelector('.has-error input, .has-error textarea, .has-error select');
      if (first) {
        first.focus();
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      el.formHint.textContent = '请先修正标红的字段';
      return;
    }

    if (state.editor.id) {
      const index = collectionFor(kind).findIndex(function (item) {
        return String(item.id) === String(state.editor.id);
      });
      if (index >= 0) state.data[KIND_COLLECTION[kind]][index] = model;
    } else {
      state.data[KIND_COLLECTION[kind]].push(model);
    }
    state.draftAvailable = false;
    updateCounts();
    setDirty(true);
    closeEditor();
    render();
    toast(state.editor ? '内容已保存' : '条目已保存，记得发布更新', 'success');
  }

  function validateItem(kind, model) {
    const errors = {};
    if (!model.id) errors.id = '请填写编号';
    if (kind === 'questions') {
      if (!model.chapter) errors.chapter = '请填写章节';
      if (!model.section) errors.section = '请填写分类';
      if (!model.statement) errors.statement = '请填写题目正文';
      if (model.difficulty < 1 || model.difficulty > 5) errors.difficulty = '难度必须在 1–5 之间';
    } else if (kind === 'knowledge') {
      if (!model.title) errors.title = '请填写知识点标题';
      if (!model.content) errors.content = '请填写知识正文';
    } else {
      if (!model.title) errors.title = '请填写易错点标题';
      if (!model.rule) errors.rule = '请填写错误规则';
    }
    if (model.id) {
      const duplicate = collectionFor(kind).some(function (item) {
        return String(item.id) === String(model.id) && String(item.id) !== String(state.editor.id || '');
      });
      if (duplicate) errors.id = '该编号已存在';
    }
    return errors;
  }

  function clearFormErrors() {
    el.editorBody.querySelectorAll('.has-error').forEach(function (node) { node.classList.remove('has-error'); });
    el.editorBody.querySelectorAll('.error-text').forEach(function (node) { node.remove(); });
    el.formHint.textContent = '带 * 的字段为必填项 · Ctrl / ⌘ + S 保存';
  }

  function confirmDialog(options) {
    return new Promise(function (resolve) {
      el.modalLayer.innerHTML = '<div class="modal"><h3>' + escapeHtml(options.title) + '</h3><p>' +
        escapeHtml(options.message) + '</p><div class="modal-actions"><button class="btn" data-modal-cancel>取消</button>' +
        '<button class="btn ' + (options.danger ? 'danger' : 'primary') + '" data-modal-confirm>' +
        escapeHtml(options.confirmText || '确认') + '</button></div></div>';
      el.modalLayer.classList.add('is-open');
      el.modalLayer.setAttribute('aria-hidden', 'false');
      const finish = function (value) {
        el.modalLayer.classList.remove('is-open');
        el.modalLayer.setAttribute('aria-hidden', 'true');
        el.modalLayer.innerHTML = '';
        resolve(value);
      };
      el.modalLayer.querySelector('[data-modal-cancel]').onclick = function () { finish(false); };
      el.modalLayer.querySelector('[data-modal-confirm]').onclick = function () { finish(true); };
      el.modalLayer._resolve = finish;
    });
  }

  function askDialog(options) {
    return new Promise(function (resolve) {
      el.modalLayer.innerHTML = '<div class="modal"><h3>' + escapeHtml(options.title) + '</h3><p>' +
        escapeHtml(options.message || '') + '</p><div class="modal-field"><input id="modalInput" value="' +
        escapeAttr(options.value || '') + '" autocomplete="off"></div><div class="modal-actions"><button class="btn" data-modal-cancel>取消</button>' +
        '<button class="btn primary" data-modal-confirm>' + escapeHtml(options.confirmText || '保存') + '</button></div></div>';
      el.modalLayer.classList.add('is-open');
      el.modalLayer.setAttribute('aria-hidden', 'false');
      const input = el.modalLayer.querySelector('#modalInput');
      input.focus();
      input.select();
      const finish = function (value) {
        el.modalLayer.classList.remove('is-open');
        el.modalLayer.setAttribute('aria-hidden', 'true');
        el.modalLayer.innerHTML = '';
        resolve(value);
      };
      const submit = function () {
        const value = text(input.value);
        if (!value) {
          input.style.borderColor = '#c66d61';
          return;
        }
        finish(value);
      };
      el.modalLayer.querySelector('[data-modal-cancel]').onclick = function () { finish(null); };
      el.modalLayer.querySelector('[data-modal-confirm]').onclick = submit;
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submit();
        }
      });
      el.modalLayer._resolve = finish;
    });
  }

  function closeModal(value) {
    if (typeof el.modalLayer._resolve === 'function') el.modalLayer._resolve(value === true);
  }

  init();
})();
