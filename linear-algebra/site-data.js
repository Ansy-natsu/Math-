(function () {
  'use strict';

  var bank = (typeof BANK !== 'undefined' && BANK) ? BANK : {};
  var meta = bank.meta || {};
  var problems = Array.isArray(bank.problems) ? bank.problems : [];
  var knowledge = Array.isArray(bank.knowledge) ? bank.knowledge : [];
  var pitfalls = Array.isArray(bank.pitfalls) ? bank.pitfalls : [];
  var chapters = [];
  var chapterMap = new Map();

  function addChapter(data) {
    var name = data.chapter;
    if (!chapterMap.has(name)) {
      var chapter = {
        id: data.id || ('ch' + (chapters.length + 1)),
        num: data.num || '',
        title: data.title || name,
        chapter: name,
        sections: data.sections || [],
        items: []
      };
      chapterMap.set(name, chapter);
      chapters.push(chapter);
    }
    return chapterMap.get(name);
  }

  if (Array.isArray(meta.outline)) {
    meta.outline.forEach(addChapter);
  }

  function addItem(kind, item) {
    var chapterName = item.chapter || '未分章';
    var chapter = chapterMap.get(chapterName);
    if (!chapter) {
      chapter = addChapter({
        chapter: chapterName,
        title: chapterName,
        sections: []
      });
    }
    var section = item.section || item.sec || '未分类';
    if (!chapter.sections.some(function (entry) { return entry.sec === section; })) {
      chapter.sections.push({ sec: section, name: '' });
    }
    chapter.items.push(Object.assign({}, item, {
      kind: kind,
      sec: section
    }));
  }

  problems.forEach(function (item) { addItem('题目', item); });
  knowledge.forEach(function (item) { addItem('知识点', item); });
  pitfalls.forEach(function (item) { addItem('易错点', item); });

  window.LA_DATA = {
    meta: meta,
    chapters: chapters,
    counts: {
      problems: problems.length,
      knowledge: knowledge.length,
      pitfalls: pitfalls.length
    }
  };
})();
