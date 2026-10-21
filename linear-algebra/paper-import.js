(function () {
  'use strict';
  if (typeof BANK === 'undefined' || !BANK) return;

  var problems = [
    {
      id: 'LA25-W1-Q2',
      source: '2025-2026 春夏学期 线性代数第一次小测（周三习题课）第2题',
      chapter: '第2章 行列式与矩阵的秩',
      section: '§2.2  方阵的行列式',
      statement: String.raw`求 $n$ 阶行列式
$$D_n=\begin{vmatrix}
1&-1&-1&\cdots&-1\\
1&1&-1&\cdots&-1\\
1&1&1&\cdots&-1\\
\vdots&\vdots&\vdots&\ddots&\vdots\\
1&1&1&\cdots&1
\end{vmatrix}$$
展开式中的负项总数。`,
      type: '计算题',
      topics: ['行列式定义', '排列逆序数', '行列式展开'],
      difficulty: 4,
      tags: ['2025线代小测', '行列式', '负项计数'],
      right_answer: String.raw`负项总数为 $\dfrac{n!-2^{n-1}}2$。`,
      key_points: [
        '先计算行列式本身，再利用正项数与负项数之和为 $n!$。',
        '把相邻两行相减，可迅速得到 $D_n=2^{n-1}$。'
      ],
      solutions: [{
        name: '行差法',
        steps: [
          '从第 $n$ 行开始，依次用第 $i$ 行减去第 $i-1$ 行。第 $i$ 行只剩第 $i$ 个元素为 $2$，其余元素为 $0$。',
          '第 $1$ 行首元素仍为 $1$，因此变换后的矩阵为上三角矩阵，其对角线乘积为 $1\\cdot2^{n-1}$。',
          '所以 $D_n=2^{n-1}$。设负项数为 $N_-$，正项数为 $N_+$，则 $N_-+N_+=n!$，$N_+-N_-=2^{n-1}$。',
          '解得 $N_-=\\dfrac{n!-2^{n-1}}2$。'
        ]
      }],
      pitfalls: ['把行列式值直接当成负项数。', '忘记展开式一共有 $n!$ 项。'],
      related: ['§2.2 行列式的排列定义'],
      added: '2026-10-22'
    },
    {
      id: 'LA25-THA-Q2',
      source: '2025-2026 春夏学期 线性代数第一次小测（周四 A 卷）第2题',
      chapter: '第2章 行列式与矩阵的秩',
      section: '§2.4  Laplace定理',
      statement: String.raw`计算 $n$ 阶行列式
$$D_n=\begin{vmatrix}
2a&a^2&0&\cdots&0\\
1&2a&a^2&\cdots&0\\
0&1&2a&\ddots&\vdots\\
\vdots&\vdots&\ddots&\ddots&a^2\\
0&0&\cdots&1&2a
\end{vmatrix}.$$`,
      type: '计算题',
      topics: ['三对角行列式', '递推关系', '特征根'],
      difficulty: 4,
      tags: ['2025线代小测', '三对角', '递推'],
      right_answer: String.raw`$D_n=(n+1)a^n$。`,
      key_points: [
        '按最后一行或第一列展开得到二阶递推。',
        '特征方程有两个相同根 $a$，解形为 $(C_1+C_2n)a^n$。'
      ],
      solutions: [{
        name: '递推法',
        steps: [
          '按最后一行展开，得到 $D_n=2aD_{n-1}-a^2D_{n-2}$。',
          '初值为 $D_1=2a$，$D_2=3a^2$。',
          '特征方程 $r^2-2ar+a^2=0$ 有二重根 $a$，设 $D_n=(C_1+C_2n)a^n$。',
          '代入初值得 $C_1+C_2=2$，$C_1+2C_2=3$，故 $C_1=1,C_2=1$，即 $D_n=(n+1)a^n$。'
        ]
      }],
      pitfalls: ['二重特征根时漏掉因子 $n$。', '递推初值取错。'],
      related: ['§2.4 Laplace 展开'],
      added: '2026-10-22'
    },
    {
      id: 'LA25-THB-Q2',
      source: '2025-2026 春夏学期 线性代数第一次小测（周四 B 卷）第2题',
      chapter: '第2章 行列式与矩阵的秩',
      section: '§2.3  行列式的性质',
      statement: String.raw`计算 $n$ 阶行列式
$$D_n=\begin{vmatrix}
x_1&y&y&\cdots&y\\
y&x_2&y&\cdots&y\\
y&y&x_3&\cdots&y\\
\vdots&\vdots&\vdots&\ddots&\vdots\\
y&y&y&\cdots&x_n
\end{vmatrix}.$$`,
      type: '计算题',
      topics: ['行列式性质', '矩阵行列式引理', '对称型行列式'],
      difficulty: 4,
      tags: ['2025线代小测', '行列式', '矩阵行列式引理'],
      right_answer: String.raw`$D_n=\left(\prod_{i=1}^n(x_i-y)\right)\left(1+y\sum_{i=1}^n\dfrac1{x_i-y}\right)$。`,
      key_points: [
        '将矩阵写成对角矩阵加秩一矩阵。',
        '使用矩阵行列式引理：$|A+uv^T|=|A|(1+v^TA^{-1}u)$。'
      ],
      solutions: [{
        name: '秩一修正',
        steps: [
          '令 $A=\\operatorname{diag}(x_1-y,\\ldots,x_n-y)$，$u=(1,\\ldots,1)^T$，$v=yu$。',
          '原矩阵为 $A+uv^T$。当所有 $x_i\\ne y$ 时，由矩阵行列式引理得',
          '$D_n=\\left(\\prod_{i=1}^n(x_i-y)\\right)\\left(1+y\\sum_{i=1}^n\\dfrac1{x_i-y}\\right)$。',
          '上式两端均为关于 $x_i$ 的多项式，因此由连续性可推广到某些 $x_i=y$ 的情形。'
        ]
      }],
      pitfalls: ['直接假设所有 $x_i$ 相等。', '使用矩阵行列式引理时漏掉右乘向量中的 $y$。'],
      related: ['§2.3 行列式性质', '§2.4 行列式引理'],
      added: '2026-10-22'
    }
  ];

  BANK.problems = Array.isArray(BANK.problems) ? BANK.problems : [];
  var ids = new Set(BANK.problems.map(function (item) { return item.id; }));
  problems.forEach(function (item) {
    if (!ids.has(item.id)) BANK.problems.push(item);
  });
  BANK.meta = BANK.meta || {};
  BANK.meta.sources = Array.isArray(BANK.meta.sources) ? BANK.meta.sources : [];
  var source = '2025-2026 春夏学期线性代数第一次小测（三套）';
  if (BANK.meta.sources.indexOf(source) < 0) BANK.meta.sources.push(source);
})();
