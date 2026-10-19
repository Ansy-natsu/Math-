(function () {
  'use strict';

  var bank = (typeof BANK !== 'undefined' && BANK) ? BANK : {};
  var problems = Array.isArray(bank.problems) ? bank.problems : [];
  var knowledge = Array.isArray(bank.knowledge) ? bank.knowledge : [];
  var pitfalls = Array.isArray(bank.pitfalls) ? bank.pitfalls : [];

  var byChapter = new Map();

  function addItem(chapterName, sectionName, item) {
    var chapter = String(chapterName || '').trim() || '未分章';
    var section = String(sectionName || '').trim() || '未分类';
    if (!byChapter.has(chapter)) {
      byChapter.set(chapter, {
        chapter: chapter,
        outline: [],
        items: [],
        seenSections: new Set()
      });
    }
    var group = byChapter.get(chapter);
    if (!group.seenSections.has(section)) {
      group.seenSections.add(section);
      group.outline.push({ sec: section, name: '', subs: [] });
    }
    group.items.push(item);
  }

  problems.forEach(function (problem) {
    if (!problem || typeof problem !== 'object') return;
    addItem(problem.chapter, problem.section, Object.assign({}, problem, {
      kind: '题目',
      sec: problem.section || '未分类',
      name: problem.id || problem.statement || '未命名题目'
    }));
  });

  knowledge.forEach(function (entry) {
    if (!entry || typeof entry !== 'object') return;
    var section = entry.section || entry.category || '知识点';
    addItem(entry.chapter || '知识库 · 通用方法', section, Object.assign({}, entry, {
      kind: '知识点',
      sec: section,
      name: entry.title || '未命名知识点'
    }));
  });

  pitfalls.forEach(function (entry) {
    if (!entry || typeof entry !== 'object') return;
    var section = entry.section || '高频易错点';
    addItem(entry.chapter || '知识库 · 高频易错点', section, Object.assign({}, entry, {
      kind: '易错点',
      sec: section,
      name: entry.title || '未命名易错点'
    }));
  });

  var chapters = [];
  var chapterIndex = 0;
  byChapter.forEach(function (group) {
    group.id = 'ch' + chapterIndex;
    delete group.seenSections;
    chapters.push(group);
    chapterIndex += 1;
  });

  window.CHAPS = chapters;
})();
