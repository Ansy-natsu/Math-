(function () {
  'use strict';

  window.CALCULUS_EXTRA_EXAMPLES = [
    {
      bookChapter: 2,
      bookSection: 0,
      id: '2.1-X1',
      type: '定义计算题',
      difficulty: 2,
      statement: '用导数定义求 $f(x)=\\dfrac{1}{x+1}$ 的导函数 $f\'(x)$，并求曲线在 $x=1$ 处的切线方程。',
      topics: ['导数的定义', '函数在一点处的切线'],
      key_points: ['先写出差商，再通过通分消去分母中的 $h$', '切线斜率取 $f\'(1)$'],
      solutions: [{
        name: '定义计算',
        steps: [
          '$f(x+h)-f(x)=\\dfrac1{x+h+1}-\\dfrac1{x+1}=\\dfrac{-(h)}{(x+h+1)(x+1)}$。',
          '$\\dfrac{f(x+h)-f(x)}h\\to -\\dfrac1{(x+1)^2}$，故 $f\'(x)=-\\dfrac1{(x+1)^2}$。',
          '$f(1)=\\dfrac12$，$f\'(1)=-\\dfrac14$，切线为 $y-\\dfrac12=-\\dfrac14(x-1)$，即 $x+4y-3=0$。'
        ]
      }],
      pitfalls: ['通分后忘记约去 $h$，直接令 $h=0$ 会得到无意义形式', '把切点纵坐标 $f(1)$ 漏掉，只写斜率。']
    },
    {
      bookChapter: 2,
      bookSection: 0,
      id: '2.1-X2',
      type: '计算题',
      difficulty: 2,
      statement: '设 $y=x^3-2x$，求曲线在 $x=1$ 处的切线与法线方程。',
      topics: ['导数的几何意义', '切线', '法线'],
      key_points: ['切线斜率是 $y\'(1)$', '法线斜率是切线斜率的负倒数'],
      solutions: [{
        name: '求斜率后写直线方程',
        steps: [
          '$y\'=3x^2-2$，所以 $y\'(1)=1$，切点为 $(1,-1)$。',
          '切线：$y+1=x-1$，即 $y=x-2$。',
          '法线斜率为 $-1$，法线：$y+1=-(x-1)$，即 $x+y=0$。'
        ]
      }],
      pitfalls: ['把切点横坐标 $x=1$ 直接当作切点坐标 $(1,1)$', '法线斜率误写成切线斜率。']
    },
    {
      bookChapter: 2,
      bookSection: 1,
      id: '2.2-X1',
      type: '计算题',
      difficulty: 2,
      statement: '求下列函数的导数：\\n（1）$y=\\sin(x^2+1)$；\\n（2）$y=e^{\\cos x}$。',
      topics: ['复合函数求导', '链式法则'],
      key_points: ['外层求导后要乘内层导数', '不要漏掉内层函数的导数'],
      solutions: [{
        name: '链式法则',
        steps: [
          '（1）$y\'=\\cos(x^2+1)\\cdot 2x=2x\\cos(x^2+1)$。',
          '（2）$y\'=e^{\\cos x}\\cdot(-\\sin x)=-e^{\\cos x}\\sin x$。'
        ]
      }],
      pitfalls: ['只写外层导数，漏乘 $2x$', '把 $e^{\\cos x}$ 的导数写成 $e^{\\cos x}$。']
    },
    {
      bookChapter: 2,
      bookSection: 1,
      id: '2.2-X2',
      type: '计算题',
      difficulty: 3,
      statement: '设 $y=(x^2+1)^{10}(2x-1)^5$，求 $y\'$。',
      topics: ['乘法法则', '链式法则', '对数求导思想'],
      key_points: ['可直接用乘积法则', '也可先取对数简化指数'],
      solutions: [{
        name: '对数求导',
        steps: [
          '取对数：$\\ln|y|=10\\ln(x^2+1)+5\\ln|2x-1|$。',
          '两边求导：$\\dfrac{y\'}{y}=\\dfrac{20x}{x^2+1}+\\dfrac{10}{2x-1}$。',
          '故 $y\'=(x^2+1)^{10}(2x-1)^5\\left(\\dfrac{20x}{x^2+1}+\\dfrac{10}{2x-1}\\right)$。'
        ]
      }],
      pitfalls: ['把乘积的导数误写成两个因子导数的乘积', '对数求导后忘记乘回原函数 $y$。']
    },
    {
      bookChapter: 2,
      bookSection: 2,
      id: '2.3-X1',
      type: '隐函数求导',
      difficulty: 3,
      statement: '设 $x^2+y^2=25$。求 $\\dfrac{dy}{dx}$，并求曲线在点 $(3,4)$ 处的切线方程。',
      topics: ['隐函数求导', '切线', '法线'],
      key_points: ['把 $y$ 看作 $x$ 的函数，对等式两边求导', '在指定点代入坐标与斜率'],
      solutions: [{
        name: '两边对 $x$ 求导',
        steps: [
          '$2x+2y\\dfrac{dy}{dx}=0$，故 $\\dfrac{dy}{dx}=-\\dfrac{x}{y}$（$y\\ne0$）。',
          '在 $(3,4)$ 处，$\\dfrac{dy}{dx}=-\\dfrac34$。',
          '切线：$y-4=-\\dfrac34(x-3)$，即 $3x+4y=25$。'
        ]
      }],
      pitfalls: ['对 $y^2$ 求导时忘记乘 $y\'$', '把点 $(3,4)$ 的坐标代错位置。']
    },
    {
      bookChapter: 2,
      bookSection: 2,
      id: '2.3-X2',
      type: '高阶导数',
      difficulty: 3,
      statement: '设 $y=xe^x$，求 $y^{(n)}$。',
      topics: ['高阶导数', '莱布尼茨公式', '归纳法'],
      key_points: ['可逐阶求导发现规律', '也可用莱布尼茨公式 $(uv)^{(n)}$'],
      solutions: [{
        name: '逐阶求导找规律',
        steps: [
          '$y\'=e^x+xe^x=(x+1)e^x$。',
          '$y\'\'=(x+2)e^x$，继续求导可得 $y\'\'\'=(x+3)e^x$。',
          '归纳得到 $y^{(n)}=(x+n)e^x$（$n\\ge1$）。'
        ]
      }],
      pitfalls: ['把 $(xe^x)^{(n)}$ 误写成 $xe^x$', '只算前三阶却不说明归纳依据。']
    },
    {
      bookChapter: 2,
      bookSection: 3,
      id: '2.4-X1',
      type: '近似计算',
      difficulty: 2,
      statement: '利用微分近似计算 $\\sqrt{101}$，并估计误差量级。',
      topics: ['微分', '线性近似', '误差估计'],
      key_points: ['选 $100$ 为基准点，令 $f(x)=\\sqrt x$', '$f(100+1)\\approx f(100)+f\'(100)\\cdot1$'],
      solutions: [{
        name: '一阶线性近似',
        steps: [
          '$f\'(x)=\\dfrac1{2\\sqrt x}$，$f(100)=10$，$f\'(100)=\\dfrac1{20}$。',
          '$\\sqrt{101}\\approx10+\\dfrac1{20}=10.05$。',
          '误差主要来自二阶项，量级约为 $\\dfrac1{8\\cdot100^{3/2}}\\approx1.25\\times10^{-4}$。'
        ]
      }],
      pitfalls: ['把微分近似写成精确等式', '基准点选得离 $101$ 太远，导致误差变大。']
    },
    {
      bookChapter: 2,
      bookSection: 4,
      id: '2.5-X1',
      type: '应用题',
      difficulty: 3,
      statement: '讨论函数 $f(x)=x^3-3x$ 的单调区间、极值与凹凸性，并作出函数草图。',
      topics: ['单调性', '极值', '凹凸性', '函数作图'],
      key_points: ['用 $f\'(x)$ 的符号判断单调性和极值', '用 $f\'\'(x)$ 的符号判断凹凸性'],
      solutions: [{
        name: '导数分析',
        steps: [
          '$f\'(x)=3x^2-3=3(x-1)(x+1)$。',
          '$x<-1$ 或 $x>1$ 时递增，$-1<x<1$ 时递减。',
          '$x=-1$ 处取极大值 $2$，$x=1$ 处取极小值 $-2$。',
          '$f\'\'(x)=6x$：$x<0$ 时凸向下，$x>0$ 时凸向上，拐点为 $(0,0)$。',
          '结合零点 $x=-\\sqrt3,0,\\sqrt3$ 与极值点可作出草图。'
        ]
      }],
      pitfalls: ['只求出驻点却不检查导数符号变化', '把凹凸性方向写反。']
    }
  ];
})();
