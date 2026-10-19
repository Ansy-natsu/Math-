(function () {
  'use strict';

  var bank = (typeof BANK !== 'undefined' && BANK) ? BANK : {};
  var meta = bank.meta || {};
  var problems = Array.isArray(bank.problems) ? bank.problems : [];
  var knowledge = Array.isArray(bank.knowledge) ? bank.knowledge : [];
  var pitfalls = Array.isArray(bank.pitfalls) ? bank.pitfalls : [];
  var chapters = [];
  var chapterMap = new Map();

  function sectionCode(value) {
    var match = String(value || '').match(/§\s*(\d+)\.(\d+)/);
    return match ? '§' + Number(match[1]) + '.' + Number(match[2]) : '';
  }

  function chapterNumber(value) {
    var match = String(value || '').match(/第\s*(\d+)\s*章/);
    return match ? Number(match[1]) : 999;
  }

  function sectionOrder(value) {
    var match = String(value || '').match(/§\s*(\d+)\.(\d+)/);
    return match ? Number(match[1]) * 1000 + Number(match[2]) : 999999;
  }

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
    var code = sectionCode(section);
    var existing = code
      ? chapter.sections.find(function (entry) { return sectionCode(entry.sec) === code; })
      : chapter.sections.find(function (entry) { return entry.sec === section; });
    if (!existing) {
      existing = { sec: section, name: '' };
      chapter.sections.push(existing);
    }
    chapter.items.push(Object.assign({}, item, {
      kind: kind,
      sec: existing.sec,
      name: kind === '题目'
        ? (item.id || item.statement || '未命名题目')
        : (item.title || item.name || '未命名条目')
    }));
  }

  problems.forEach(function (item) { addItem('题目', item); });
  knowledge.forEach(function (item) { addItem('知识点', item); });
  pitfalls.forEach(function (item) { addItem('易错点', item); });

  chapters.forEach(function (chapter) {
    chapter.sections.sort(function (a, b) { return sectionOrder(a.sec) - sectionOrder(b.sec); });
    chapter.outline = chapter.sections.map(function (section) {
      return { sec: section.sec, name: section.name || '', subs: [] };
    });
  });
  chapters.sort(function (a, b) { return chapterNumber(a.chapter) - chapterNumber(b.chapter); });

  window.LA_DATA = {
    meta: meta,
    chapters: chapters,
    counts: {
      problems: problems.length,
      knowledge: knowledge.length,
      pitfalls: pitfalls.length
    }
  };
  window.CHAPS = chapters;
})();
