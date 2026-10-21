(function () {
  'use strict';
  var sections = window.CALCULUS_FRAMEWORK_SECTIONS || [];
  if (!sections.length || !window.CALCULUS_BOOK) return;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  var groups = new Map();
  sections.forEach(function (section) {
    if (!groups.has(section.chapter)) groups.set(section.chapter, []);
    groups.get(section.chapter).push(section);
  });

  var html = '';
  groups.forEach(function (list, chapter) {
    html += '<h1>' + esc(chapter) + '</h1>';
    list.forEach(function (section) {
      html += '<h2 id="' + esc(section.code.replace('§', 'sec-')) + '">' +
        esc(section.code + ' ' + section.title) +
        '<span class="src">苏德矿版《微积分》上册</span></h2>';
      html += '<h3>核心概念</h3>';
      section.points.forEach(function (point) {
        html += '<div class="p">' + esc(point) + '</div>';
      });
      if (section.formulas && section.formulas.length) {
        html += '<h3>关键公式与定理</h3>';
        section.formulas.forEach(function (formula) {
          html += '<div class="f">' + esc(formula) + '</div>';
        });
      }
      if (section.methods && section.methods.length) {
        html += '<h3>方法与提醒</h3>';
        section.methods.forEach(function (method) {
          html += '<p class="bullet">• ' + esc(method) + '</p>';
        });
      }
    });
  });

  html += '<h1>附录：原交互版精读</h1>';
  window.CALCULUS_BOOK = window.CALCULUS_BOOK.replace('<main>', '<main>' + html);
})();
