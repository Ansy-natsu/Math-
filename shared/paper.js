/* 组卷：手动勾选、按条件抽题、错题组卷，生成可打印的试卷与答案解析。
 * 两套题库共用。页面需先加载 data.js（提供 BANK），再调用：
 *   PaperKit.init({ site: 'calculus', subject: '微积分' });
 *   每次重绘题目列表后调用 PaperKit.decorate(容器)。
 * 试卷篮与错题标记只保存在访客自己的浏览器里（localStorage）。
 */
(function () {
  'use strict';

  var CATS = ['选择题', '填空题', '判断题', '计算题', '证明题', '综合题'];
  var DEFAULT_SCORE = { '选择题': 4, '填空题': 4, '判断题': 6, '计算题': 10, '证明题': 12, '综合题': 12 };
  var SPACE = { '选择题': 0, '填空题': 0, '判断题': 3, '计算题': 7, '证明题': 8, '综合题': 8 }; // 作答留白（行）
  var NUM = '一二三四五六七八九十';

  var cfg = null;
  var problems = [];
  var byId = new Map();
  var chapters = [];
  var state = null;
  var userWrong = new Set();
  var els = {};
  // 面板折叠状态：试卷信息默认收起，抽题与已选题目默认展开；题干默认显示
  var UI_KEY = 'paper-ui-v1';
  var ui = { info: false, draw: true, list: true, stmts: true };
  var folded = new Set(); // 单独收起题干的题目

  /* ---------- 工具 ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // 题干：公式原样保留（交给 KaTeX）；公式以外的部分处理 **粗体** 和换行，
  // 包括数据里误写成字面量的 \n（但不碰 \neq、\nu 等命令）。
  // 公式内部的换行不能改成 <br>，否则 $$…$$ 会被拆开而无法渲染。
  var MATH = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?:\\.|[^$\\])+?\$)/g;
  function inlineRich(value) {
    return esc(String(value == null ? '' : value).replace(/\r\n?/g, '\n')).split(MATH).map(function (part, i) {
      if (i % 2) return part;
      return part
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\\+n(?![a-z])/g, '\n')
        .replace(/\n/g, '<br>');
    }).join('');
  }
  function rich(value) {
    var source = String(value == null ? '' : value).replace(/\r\n?/g, '\n');
    var blocks = [];
    var masked = source.replace(MATH, function (match) {
      var key = '\uE000' + blocks.length + '\uE001';
      blocks.push(match);
      return key;
    });
    var matches = Array.from(masked.matchAll(/(?:^|[\s。；;])\s*[（(]?([A-D])[.、．)）]\s*/g));
    var labels = new Set(matches.map(function (match) { return match[1]; }));
    if (labels.size < 2) return inlineRich(source);
    var restore = function (text) {
      return text.replace(/\uE000(\d+)\uE001/g, function (_, index) { return blocks[Number(index)] || ''; });
    };
    var starts = matches.map(function (match) {
      return match.index + match[0].search(/[A-D]/);
    });
    var output = inlineRich(restore(masked.slice(0, starts[0]))) + '<span class="option-grid">';
    starts.forEach(function (start, index) {
      var end = index + 1 < starts.length ? starts[index + 1] : masked.length;
      output += '<span class="option-cell">' + inlineRich(restore(masked.slice(start, end).trim())) + '</span>';
    });
    return output + '</span>';
  }
  function plain(value) {
    return String(value == null ? '' : value).replace(/\\n(?![a-z])/g, ' ').replace(/\s+/g, ' ');
  }
  function categoryOf(type) {
    var t = String(type || '');
    if (/选/.test(t)) return '选择题';
    if (/填空/.test(t)) return '填空题';
    if (/判断/.test(t)) return '判断题';
    if (/证明/.test(t) && /计算/.test(t)) return '综合题';
    if (/证明/.test(t)) return '证明题';
    if (/计算/.test(t)) return '计算题';
    return '综合题';
  }
  function chapterNo(name) {
    var m = String(name || '').match(/第\s*(\d+|[一二三四五六七八九十]+)\s*章/);
    if (!m) return 999;
    var v = m[1];
    if (/^\d+$/.test(v)) return +v;
    return v.length === 1 ? NUM.indexOf(v) + 1 : v === '十' ? 10 : 10 + NUM.indexOf(v.slice(-1)) + 1;
  }
  function stars(n) { return '★'.repeat(n || 3); }
  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key) || 'null'); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }
  function math(node) {
    if (node && window.renderMath) return window.renderMath(node);
    return Promise.resolve();
  }

  /* ---------- 错题 ---------- */
  function builtInWrong(p) {
    return /^错/.test(p.id || '') || !!p.my_answer || !!p.error_analysis;
  }
  function isWrong(p) { return builtInWrong(p) || userWrong.has(p.id); }
  function toggleWrong(id) {
    var p = byId.get(id);
    if (!p || builtInWrong(p)) return;
    if (userWrong.has(id)) userWrong.delete(id); else userWrong.add(id);
    save(cfg.wrongKey, Array.from(userWrong));
  }

  /* ---------- 试卷篮 ---------- */
  function freshState() {
    return { title: cfg.subject + ' 自测卷', minutes: 100, note: '', group: true, space: true, items: [] };
  }
  function persist() { save(cfg.basketKey, state); }
  function inBasket(id) { return state.items.some(function (it) { return it.id === id; }); }
  function add(id) {
    var p = byId.get(id);
    if (!p || inBasket(id)) return false;
    state.items.push({ id: id, score: DEFAULT_SCORE[categoryOf(p.type)] });
    return true;
  }
  function remove(id) { state.items = state.items.filter(function (it) { return it.id !== id; }); }
  function total() { return state.items.reduce(function (s, it) { return s + (+it.score || 0); }, 0); }
  function orderedItems() {
    var list = state.items.filter(function (it) { return byId.has(it.id); });
    if (!state.group) return list;
    return list.slice().sort(function (a, b) {
      return CATS.indexOf(categoryOf(byId.get(a.id).type)) - CATS.indexOf(categoryOf(byId.get(b.id).type));
    });
  }

  /* ---------- 题目列表上的按钮 ---------- */
  function decorate(root) {
    if (!cfg || !root) return;
    root.querySelectorAll('.item .ihd .pid').forEach(function (pid) {
      var head = pid.closest('.ihd');
      if (head.querySelector('.pk-act')) return;
      var id = pid.textContent;
      if (!byId.has(id)) return;
      var box = document.createElement('span');
      box.className = 'pk-act';
      box.dataset.id = id;
      head.appendChild(box);
      paintActions(box);
    });
  }
  function paintActions(box) {
    var id = box.dataset.id;
    var p = byId.get(id);
    var picked = inBasket(id);
    var wrong = isWrong(p);
    var fixed = builtInWrong(p);
    box.innerHTML =
      '<button type="button" class="pk-add' + (picked ? ' on' : '') + '" title="' +
        (picked ? '从试卷中移除' : '加入试卷') + '">' + (picked ? '✓ 已组卷' : '＋ 组卷') + '</button>' +
      '<button type="button" class="pk-wrong' + (wrong ? ' on' : '') + (fixed ? ' fixed' : '') + '" title="' +
        (fixed ? '题库中记录的错题' : wrong ? '取消错题标记' : '标记为错题，可用于错题组卷') + '">' +
        (wrong ? '错题' : '标错') + '</button>';
  }
  function repaintActions() {
    document.querySelectorAll('.pk-act').forEach(paintActions);
    els.fabCount.textContent = state.items.length;
    els.fab.classList.toggle('has', state.items.length > 0);
  }

  /* ---------- 组卷面板 ---------- */
  function buildShell() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'pk-fab';
    fab.innerHTML = '组卷 <span class="pk-fab-n">0</span>';
    fab.title = '打开组卷面板';
    document.body.appendChild(fab);

    var drawer = document.createElement('aside');
    drawer.className = 'pk-drawer';
    drawer.setAttribute('aria-label', '组卷');
    drawer.innerHTML =
      '<div class="pk-dhead"><strong>组卷</strong><span class="pk-sub"></span>' +
      '<button type="button" class="pk-x" data-pk="close" aria-label="关闭">✕</button></div>' +
      '<div class="pk-dbody">' +
        '<section class="pk-sec" data-sec="info"><h3><button type="button" class="pk-tg" data-pk="toggle" aria-expanded="true"><span class="pk-arw">▾</span>试卷信息</button><span class="pk-sum" data-v="sum-info"></span></h3><div class="pk-secbody">' +
          '<label class="pk-row"><span>标题</span><input data-f="title" maxlength="60"></label>' +
          '<div class="pk-row2">' +
            '<label class="pk-row"><span>时间（分钟）</span><input data-f="minutes" type="number" min="0" max="600"></label>' +
            '<div class="pk-total">满分 <b data-v="total">0</b> 分</div>' +
          '</div>' +
          '<label class="pk-row"><span>考试说明</span><input data-f="note" maxlength="120" placeholder="可留空"></label>' +
          '<label class="pk-chk"><input type="checkbox" data-f="group"> 按题型分组（选择、填空、判断、计算、证明、综合）</label>' +
          '<label class="pk-chk"><input type="checkbox" data-f="space"> 试卷中为解答题预留作答空白</label>' +
        '</div></section>' +
        '<section class="pk-sec" data-sec="draw"><h3><button type="button" class="pk-tg" data-pk="toggle" aria-expanded="true"><span class="pk-arw">▾</span>按条件抽题</button><span class="pk-sum" data-v="sum-draw"></span></h3><div class="pk-secbody">' +
          '<div class="pk-lbl">章节</div><div class="pk-chips" data-g="chapter"></div>' +
          '<div class="pk-lbl">题型</div><div class="pk-chips" data-g="cat"></div>' +
          '<div class="pk-row2">' +
            '<label class="pk-row"><span>难度</span>' +
              '<span class="pk-range"><select data-r="dmin"></select> 至 <select data-r="dmax"></select> 星</span></label>' +
            '<label class="pk-row"><span>来源</span><select data-r="src">' +
              '<option value="all">全部题目</option><option value="wrong">只抽错题</option></select></label>' +
          '</div>' +
          '<div class="pk-row2">' +
            '<label class="pk-row"><span>抽取题数</span><input data-r="n" type="number" min="1" value="5"></label>' +
            '<div class="pk-avail">符合条件 <b data-v="avail">0</b> 题<br><small>（已在试卷中的不重复抽）</small></div>' +
          '</div>' +
          '<div class="pk-btns">' +
            '<button type="button" class="pk-primary" data-pk="draw">随机抽题加入</button>' +
            '<button type="button" data-pk="redraw">清空后重新抽</button>' +
            '<button type="button" data-pk="allwrong">全部错题加入</button>' +
          '</div>' +
          '<p class="pk-hint" data-v="wronghint"></p>' +
        '</div></section>' +
        '<section class="pk-sec" data-sec="list"><h3><button type="button" class="pk-tg" data-pk="toggle" aria-expanded="true">' +
          '<span class="pk-arw">▾</span>已选题目</button><span class="pk-cnt" data-v="count">0</span>' +
          '<span class="pk-sum" data-v="sum-list"></span>' +
          '<button type="button" class="pk-link" data-pk="stmts">收起题干</button>' +
          '<button type="button" class="pk-link pk-danger" data-pk="clear">清空</button></h3><div class="pk-secbody">' +
          '<ol class="pk-list"></ol>' +
          '<p class="pk-empty">还没有题目。可在左侧题目上点「＋ 组卷」，或用上方条件抽题。</p>' +
        '</div></section>' +
      '</div>' +
      '<div class="pk-dfoot">' +
        '<button type="button" class="pk-primary" data-pk="paper">预览 / 打印试卷</button>' +
        '<button type="button" data-pk="answers">打印答案与解析</button>' +
      '</div>';
    document.body.appendChild(drawer);

    var mask = document.createElement('div');
    mask.className = 'pk-mask';
    document.body.appendChild(mask);

    var view = document.createElement('div');
    view.className = 'pk-print';
    view.innerHTML =
      '<div class="pk-pbar"><button type="button" data-pk="back">← 返回组卷</button>' +
      '<span class="pk-pmode"></span>' +
      '<button type="button" class="pk-primary" data-pk="print">打印 / 存为 PDF</button></div>' +
      '<div class="pk-sheet"></div>';
    document.body.appendChild(view);

    els = {
      fab: fab, fabCount: fab.querySelector('.pk-fab-n'), drawer: drawer, mask: mask, view: view,
      sheet: view.querySelector('.pk-sheet'), mode: view.querySelector('.pk-pmode'),
      list: drawer.querySelector('.pk-list'), empty: drawer.querySelector('.pk-empty'),
      sub: drawer.querySelector('.pk-sub')
    };
    els.sub.textContent = cfg.subject + '题库 · 共 ' + problems.length + ' 题';
  }

  function fillFilters() {
    var chapBox = els.drawer.querySelector('[data-g="chapter"]');
    chapBox.innerHTML = chapters.map(function (c) {
      return '<label class="pk-chip"><input type="checkbox" value="' + esc(c) + '" checked>' + esc(c) + '</label>';
    }).join('');
    var present = CATS.filter(function (c) { return problems.some(function (p) { return categoryOf(p.type) === c; }); });
    els.drawer.querySelector('[data-g="cat"]').innerHTML = present.map(function (c) {
      return '<label class="pk-chip"><input type="checkbox" value="' + c + '" checked>' + c + '</label>';
    }).join('');
    var opts = [1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '">' + n + '</option>'; }).join('');
    var dmin = els.drawer.querySelector('[data-r="dmin"]');
    var dmax = els.drawer.querySelector('[data-r="dmax"]');
    dmin.innerHTML = opts; dmax.innerHTML = opts;
    dmin.value = '1'; dmax.value = '5';
  }

  function filters() {
    var d = els.drawer;
    var pick = function (g) {
      return Array.from(d.querySelectorAll('[data-g="' + g + '"] input:checked')).map(function (i) { return i.value; });
    };
    var lo = +d.querySelector('[data-r="dmin"]').value;
    var hi = +d.querySelector('[data-r="dmax"]').value;
    return {
      chapters: pick('chapter'), cats: pick('cat'),
      dmin: Math.min(lo, hi), dmax: Math.max(lo, hi),
      wrongOnly: d.querySelector('[data-r="src"]').value === 'wrong',
      n: Math.max(1, parseInt(d.querySelector('[data-r="n"]').value, 10) || 1)
    };
  }
  function candidates(f, ignoreBasket) {
    return problems.filter(function (p) {
      var d = p.difficulty || 3;
      return f.chapters.indexOf(p.chapter || '未分章') >= 0 &&
        f.cats.indexOf(categoryOf(p.type)) >= 0 &&
        d >= f.dmin && d <= f.dmax &&
        (!f.wrongOnly || isWrong(p)) &&
        (ignoreBasket || !inBasket(p.id));
    });
  }

  function renderDrawer() {
    var d = els.drawer;
    ['title', 'minutes', 'note'].forEach(function (k) {
      var input = d.querySelector('[data-f="' + k + '"]');
      if (document.activeElement !== input) input.value = state[k];
    });
    d.querySelector('[data-f="group"]').checked = !!state.group;
    d.querySelector('[data-f="space"]').checked = !!state.space;
    d.querySelector('[data-v="total"]').textContent = total();
    d.querySelector('[data-v="count"]').textContent = state.items.length;
    renderAvail();
    renderFolds();

    var wrongCount = problems.filter(isWrong).length;
    d.querySelector('[data-v="wronghint"]').textContent = wrongCount
      ? '错题本共 ' + wrongCount + ' 题（题库记录的错题 + 你标记的错题）。'
      : '还没有错题：在题目右侧点「标错」，即可用于错题组卷。';

    var items = orderedItems();
    els.empty.style.display = items.length ? 'none' : '';
    var lastCat = null;
    els.list.innerHTML = items.map(function (it, i) {
      var p = byId.get(it.id);
      var cat = categoryOf(p.type);
      var head = state.group && cat !== lastCat ? '<li class="pk-grp">' + cat + '</li>' : '';
      lastCat = cat;
      var fold = !ui.stmts || folded.has(it.id);
      return head + '<li class="pk-it' + (fold ? ' pk-fold' : '') + '" data-id="' + esc(it.id) + '">' +
        '<div class="pk-ith" title="点击收起/展开题干"><span class="pk-no">' + (i + 1) + '</span>' +
          '<span class="pk-pid">' + esc(it.id) + '</span>' +
          '<span class="pk-tag">' + esc(cat) + '</span>' +
          '<span class="pk-star">' + stars(p.difficulty) + '</span>' +
          (isWrong(p) ? '<span class="pk-tag pk-tag-w">错题</span>' : '') +
          '<span class="pk-sp"></span>' +
          '<label class="pk-score"><input type="number" min="0" max="100" value="' + esc(it.score) + '" data-score> 分</label>' +
          (state.group ? '' :
            '<button type="button" class="pk-ic" data-pk="up" title="上移">↑</button>' +
            '<button type="button" class="pk-ic" data-pk="down" title="下移">↓</button>') +
          '<button type="button" class="pk-ic" data-pk="rm" title="移除">✕</button></div>' +
        '<div class="pk-stmt">' + rich(p.statement) + '</div></li>';
    }).join('');
    // 公式渲染器会跳过渲染过的元素，所以对每次新生成的节点单独渲染
    els.list.querySelectorAll('.pk-stmt').forEach(math);
  }
  function renderAvail() {
    var n = candidates(filters(), false).length;
    els.drawer.querySelector('[data-v="avail"]').textContent = n;
    var sum = els.drawer.querySelector('[data-v="sum-draw"]');
    if (sum) sum.textContent = '可抽 ' + n + ' 题';
  }
  // 各区块折叠状态与收起时的一行摘要
  function renderFolds() {
    var d = els.drawer;
    ['info', 'draw', 'list'].forEach(function (key) {
      var sec = d.querySelector('[data-sec="' + key + '"]');
      var open = !!ui[key];
      sec.classList.toggle('pk-closed', !open);
      var tg = sec.querySelector('.pk-tg');
      tg.setAttribute('aria-expanded', open ? 'true' : 'false');
      tg.querySelector('.pk-arw').textContent = open ? '▾' : '▸';
    });
    var meta = [state.title || (cfg.subject + ' 自测卷')];
    if (+state.minutes) meta.push(+state.minutes + ' 分钟');
    meta.push('满分 ' + total() + ' 分');
    d.querySelector('[data-v="sum-info"]').textContent = meta.join(' · ');
    d.querySelector('[data-v="sum-list"]').textContent = '满分 ' + total() + ' 分';
    var st = d.querySelector('[data-pk="stmts"]');
    st.textContent = ui.stmts ? '收起题干' : '展开题干';
    st.style.display = state.items.length && ui.list ? '' : 'none';
  }

  function open() {
    renderDrawer();
    document.body.classList.add('pk-open');
  }
  function close() { document.body.classList.remove('pk-open'); }
  function changed() {
    persist();
    repaintActions();
    if (document.body.classList.contains('pk-open')) renderDrawer();
  }
  function flash(text) {
    var tip = document.createElement('div');
    tip.className = 'pk-toast';
    tip.textContent = text;
    document.body.appendChild(tip);
    setTimeout(function () { tip.remove(); }, 2200);
  }

  /* ---------- 试卷与答案 ---------- */
  function sheetHeader(kind) {
    var title = state.title || (cfg.subject + ' 自测卷');
    if (kind === 'answers') {
      return '<div class="pk-ph"><h1>' + esc(title) + '</h1><div class="pk-ph2">参考答案与解析</div></div>';
    }
    var meta = [];
    if (+state.minutes) meta.push('考试时间 ' + (+state.minutes) + ' 分钟');
    meta.push('满分 ' + total() + ' 分');
    meta.push('共 ' + state.items.length + ' 题');
    return '<div class="pk-ph"><h1>' + esc(title) + '</h1>' +
      '<div class="pk-meta">' + meta.join('　') + '</div>' +
      '<div class="pk-who"><span>姓名 ________</span><span>学号 ________</span><span>得分 ________</span></div>' +
      (state.note ? '<div class="pk-note">' + esc(state.note) + '</div>' : '') + '</div>';
  }
  function sections() {
    var items = orderedItems();
    if (!state.group) return [{ cat: null, items: items }];
    var out = [];
    items.forEach(function (it) {
      var cat = categoryOf(byId.get(it.id).type);
      if (!out.length || out[out.length - 1].cat !== cat) out.push({ cat: cat, items: [] });
      out[out.length - 1].items.push(it);
    });
    return out;
  }
  function list(items) {
    return items && items.length
      ? '<ul>' + items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>' : '';
  }
  function buildSheet(kind) {
    var html = sheetHeader(kind);
    var no = 0;
    sections().forEach(function (sec, si) {
      if (sec.cat) {
        var pts = sec.items.reduce(function (s, it) { return s + (+it.score || 0); }, 0);
        html += '<h2 class="pk-h2">' + NUM.charAt(si) + '、' + sec.cat +
          (kind === 'paper' ? '<small>（共 ' + sec.items.length + ' 题，' + pts + ' 分）</small>' : '') + '</h2>';
      }
      sec.items.forEach(function (it) {
        no += 1;
        var p = byId.get(it.id);
        var cat = categoryOf(p.type);
        if (kind === 'paper') {
          var lines = state.space ? SPACE[cat] : 0;
          html += '<div class="pk-q"><div class="pk-qs"><span class="pk-qn">' + no + '．</span>' +
            '<span class="pk-qp">（' + (+it.score || 0) + ' 分）</span>' + rich(p.statement) + '</div>' +
            (lines ? '<div class="pk-blank" style="height:' + (lines * 1.9) + 'em"></div>' : '') + '</div>';
        } else {
          var body = '<div class="pk-ans"><b>【答案】</b>' + (p.right_answer ? rich(p.right_answer) : '见解析') + '</div>';
          (p.solutions || []).forEach(function (s) {
            body += '<div class="pk-k">【' + esc(s.name || '解析') + '】</div>' + list(s.steps);
          });
          if (p.key_points && p.key_points.length) body += '<div class="pk-k">【解题关键】</div>' + list(p.key_points);
          if (p.topics && p.topics.length) body += '<div class="pk-k">【考点】</div><div class="pk-tp">' + esc(p.topics.join('；')) + '</div>';
          if (p.pitfalls && p.pitfalls.length) body += '<div class="pk-k">【易错提醒】</div>' + list(p.pitfalls);
          html += '<div class="pk-q pk-qa"><div class="pk-qs"><span class="pk-qn">' + no + '．</span>' +
            '<span class="pk-src">' + esc(p.id) + (p.source ? '　' + esc(plain(p.source)) : '') + '</span></div>' +
            '<div class="pk-qstmt">' + rich(p.statement) + '</div>' + body + '</div>';
        }
      });
    });
    return html;
  }
  function showSheet(kind) {
    if (!state.items.length) { flash('试卷里还没有题目'); return; }
    var page = document.createElement('div');
    page.className = 'pk-page';
    page.innerHTML = buildSheet(kind);
    els.sheet.replaceChildren(page);
    els.sheet.dataset.kind = kind;
    els.mode.textContent = kind === 'paper' ? '试卷预览' : '答案与解析预览';
    document.body.classList.add('pk-viewing');
    els.view.scrollTop = 0;
    return math(page);
  }
  function doPrint() {
    var title = document.title;
    document.title = (state.title || cfg.subject) + (els.sheet.dataset.kind === 'answers' ? '（答案与解析）' : '');
    math(els.sheet.firstElementChild).then(function () {
      var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      return fonts;
    }).then(function () {
      window.print();
      document.title = title;
    });
  }

  /* ---------- 事件 ---------- */
  function bind() {
    // 题目列表上的按钮：捕获阶段处理，避免同时触发展开/折叠
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.pk-act button');
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      var id = btn.closest('.pk-act').dataset.id;
      if (btn.classList.contains('pk-add')) {
        if (inBasket(id)) { remove(id); } else { add(id); flash('已加入试卷（共 ' + state.items.length + ' 题）'); }
      } else if (btn.classList.contains('pk-wrong')) {
        if (builtInWrong(byId.get(id))) { flash('这是题库中记录的错题'); return; }
        toggleWrong(id);
      }
      changed();
    }, true);

    els.fab.addEventListener('click', open);
    els.mask.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.body.classList.contains('pk-viewing')) document.body.classList.remove('pk-viewing');
      else close();
    });

    var d = els.drawer;
    d.addEventListener('input', function (e) {
      var t = e.target;
      if (t.dataset.f === 'title' || t.dataset.f === 'note') { state[t.dataset.f] = t.value; persist(); renderFolds(); }
      else if (t.dataset.f === 'minutes') { state.minutes = Math.max(0, parseInt(t.value, 10) || 0); persist(); renderFolds(); }
      else if (t.hasAttribute('data-score')) {
        var item = state.items.find(function (it) { return it.id === t.closest('.pk-it').dataset.id; });
        if (item) { item.score = Math.max(0, Math.min(100, parseInt(t.value, 10) || 0)); persist(); }
        d.querySelector('[data-v="total"]').textContent = total();
        renderFolds();
      } else if (t.dataset.r === 'n') { renderAvail(); }
    });
    d.addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.f === 'group' || t.dataset.f === 'space') { state[t.dataset.f] = t.checked; changed(); }
      else if (t.closest('.pk-chips') || t.dataset.r) { renderAvail(); }
    });
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pk]');
      var ith = e.target.closest('.pk-ith');
      if (!b && ith && !e.target.closest('input,label,button')) {
        var li = ith.closest('.pk-it');
        var fold = !li.classList.contains('pk-fold');
        li.classList.toggle('pk-fold', fold);
        if (fold === !ui.stmts) folded.delete(li.dataset.id); else folded.add(li.dataset.id);
        return;
      }
      if (!b) return;
      var act = b.dataset.pk;
      var row = b.closest('.pk-it');
      var id = row && row.dataset.id;
      if (act === 'close') close();
      else if (act === 'toggle') {
        var key = b.closest('.pk-sec').dataset.sec;
        ui[key] = !ui[key]; save(UI_KEY, ui); renderFolds();
      } else if (act === 'stmts') {
        ui.stmts = !ui.stmts; folded.clear(); save(UI_KEY, ui);
        els.list.querySelectorAll('.pk-it').forEach(function (li) { li.classList.toggle('pk-fold', !ui.stmts); });
        renderFolds();
      }
      else if (act === 'rm') { remove(id); changed(); }
      else if (act === 'up' || act === 'down') {
        var i = state.items.findIndex(function (it) { return it.id === id; });
        var j = act === 'up' ? i - 1 : i + 1;
        if (i >= 0 && j >= 0 && j < state.items.length) {
          var tmp = state.items[i]; state.items[i] = state.items[j]; state.items[j] = tmp;
          changed();
        }
      } else if (act === 'clear') {
        if (state.items.length && confirmClear()) { state.items = []; changed(); }
      } else if (act === 'draw' || act === 'redraw') {
        var f = filters();
        if (act === 'redraw') state.items = [];
        var pool = shuffle(candidates(f, false));
        if (!pool.length) { flash('没有符合条件的题目，可放宽章节、题型或难度'); changed(); return; }
        var picked = pool.slice(0, f.n);
        picked.forEach(function (p) { add(p.id); });
        flash('已抽取 ' + picked.length + ' 题' + (picked.length < f.n ? '（符合条件的只有这么多）' : ''));
        changed();
      } else if (act === 'allwrong') {
        var wrong = problems.filter(isWrong);
        if (!wrong.length) { flash('还没有错题'); return; }
        var n = 0;
        wrong.forEach(function (p) { if (add(p.id)) n += 1; });
        flash(n ? '已加入 ' + n + ' 道错题' : '错题都已在试卷中');
        changed();
      } else if (act === 'paper' || act === 'answers') {
        showSheet(act);
      }
    });
    function confirmClear() { return window.confirm('清空试卷中的全部题目？'); }

    els.view.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pk]');
      if (!b) return;
      if (b.dataset.pk === 'back') document.body.classList.remove('pk-viewing');
      if (b.dataset.pk === 'print') doPrint();
    });
  }

  /* ---------- 初始化 ---------- */
  function init(options) {
    var bank = (typeof BANK !== 'undefined' && BANK) ? BANK : {};
    cfg = {
      site: options.site,
      subject: options.subject,
      basketKey: 'paper-basket-v1:' + options.site,
      wrongKey: 'paper-wrong-v1:' + options.site
    };
    problems = (bank.problems || []).filter(function (p) { return p && p.id && p.statement; });
    problems.forEach(function (p) { byId.set(p.id, p); });
    var seen = new Set();
    problems.forEach(function (p) { seen.add(p.chapter || '未分章'); });
    chapters = Array.from(seen).sort(function (a, b) { return chapterNo(a) - chapterNo(b); });

    ui = Object.assign(ui, load(UI_KEY, {}));
    state = Object.assign(freshState(), load(cfg.basketKey, {}));
    state.items = (state.items || []).filter(function (it) { return it && byId.has(it.id); });
    userWrong = new Set(load(cfg.wrongKey, []).filter(function (id) { return byId.has(id); }));

    buildShell();
    fillFilters();
    bind();
    repaintActions();
  }

  window.PaperKit = {
    init: init,
    decorate: function (root) { if (!cfg) return; decorate(root); repaintActions(); },
    _categoryOf: categoryOf
  };

  // <script defer src="paper.js" data-site="calculus" data-subject="微积分"> 时自动初始化
  var me = document.currentScript;
  if (me && me.dataset.site) {
    init({ site: me.dataset.site, subject: me.dataset.subject || '' });
    decorate(document.getElementById('main') || document.body);
    repaintActions();
  }
})();
