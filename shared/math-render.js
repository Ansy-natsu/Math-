(function () {
  'use strict';

  var queue = window.__mathQueue || [];
  var rendered = new WeakSet();
  var options = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false }
    ],
    throwOnError: false,
    strict: false,
    trust: false,
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoredClasses: ['katex', 'no-math']
  };
  var commands = new Set([
    'alpha', 'beta', 'gamma', 'delta', 'Delta', 'eta', 'theta', 'lambda',
    'sigma', 'tau', 'pi', 'xi', 'varepsilon', 'rho', 'mu', 'nu', 'omega',
    'Omega', 'begin', 'end', 'frac', 'dfrac', 'tfrac', 'sqrt', 'operatorname',
    'mathbb', 'mathbf', 'mathcal', 'boldsymbol', 'mathrm', 'text', 'circ',
    'langle', 'rangle', 'left', 'right', 'big', 'Bigl', 'Bigr', 'lim',
    'sum', 'prod', 'int', 'infty', 'neq', 'ne', 'lt', 'le', 'ge', 'equiv',
    'approx', 'sim', 'simeq', 'cdot', 'cdots', 'ldots', 'dots', 'times',
    'pm', 'cap', 'cup', 'subset', 'subseteq', 'in', 'notin', 'forall',
    'exists', 'perp', 'oplus', 'odot', 'dim', 'ker', 'det', 'ln', 'log',
    'sin', 'cos', 'tan', 'arcsin', 'arctan', 'max', 'min', 'xrightarrow',
    'Rightarrow', 'iff', 'leftarrow', 'leftrightarrow', 'mapsto', 'because',
    'therefore', 'mathring', 'bar', 'overline', 'lfloor', 'rfloor'
  ]);

  function hasOverescapedCommand(value) {
    for (var i = 0; i < value.length - 2; i++) {
      if (value[i] !== '\\' || value[i + 1] !== '\\') continue;
      if (i > 0 && value[i - 1] === '\\') continue;
      var j = i + 2;
      if (!/[A-Za-z]/.test(value[j])) continue;
      while (j < value.length && /[A-Za-z]/.test(value[j])) j++;
      if (commands.has(value.slice(i + 2, j))) return true;
    }
    return false;
  }

  function normalizeMathEscapes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || parent.closest('.katex')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue && node.nodeValue.indexOf('$') >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (textNode) {
      var value = textNode.nodeValue;
      if (!hasOverescapedCommand(value)) return;
      textNode.nodeValue = value.replace(/\\\\/g, '\\');
    });
  }

  function renderNow(node) {
    if (!node || rendered.has(node)) return Promise.resolve();
    if (node.nodeType !== 1) return Promise.resolve();
    rendered.add(node);
    try {
      normalizeMathEscapes(node);
      window.renderMathInElement(node, options);
      return Promise.resolve();
    } catch (error) {
      console.warn('Formula rendering skipped:', error);
      return Promise.resolve();
    }
  }

  function renderMath(node) {
    if (!node) return Promise.resolve();
    if (window.katex && window.renderMathInElement) return renderNow(node);
    return new Promise(function (resolve) {
      queue.push({ node: node, resolve: resolve });
    });
  }

  function drain() {
    if (!(window.katex && window.renderMathInElement)) {
      window.setTimeout(drain, 50);
      return;
    }
    window.__mathRenderNow = renderMath;
    window.renderMath = renderMath;
    var pending = queue.splice(0, queue.length);
    pending.forEach(function (entry) {
      if (entry && entry.node) {
        renderNow(entry.node).then(entry.resolve, entry.resolve);
      } else if (entry && entry.resolve) {
        entry.resolve();
      }
    });
  }

  window.__mathQueue = queue;
  window.__mathRenderNow = renderMath;
  window.renderMath = renderMath;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drain, { once: true });
  } else {
    drain();
  }
})();
