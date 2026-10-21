(function () {
  'use strict';
  if (typeof BANK === 'undefined' || !BANK) return;

  var S = function (code, title, chapter, points, formulas, methods) {
    return {
      code: code,
      title: title,
      chapter: chapter,
      points: points,
      formulas: formulas || [],
      methods: methods || []
    };
  };

  var CH1 = '第一章 函数与极限';
  var CH2 = '第二章 导数与微分';
  var CH3 = '第三章 微分中值定理及导数的应用';
  var CH4 = '第四章 不定积分';
  var CH5 = '第五章 定积分及其应用';
  var CH6 = '第六章 常微分方程';

  var sections = [
    S('§1.1', '函数与初等函数', CH1,
      ['理解函数的定义域、值域与对应法则；掌握复合、反函数及初等函数的构成。'],
      ['$\\ln x$ 的定义域为 $x>0$；$\\arcsin x$ 的定义域为 $[-1,1]$。'],
      ['先求各层定义域，再取交集。']),
    S('§1.2', '数列极限', CH1,
      ['理解 $\\varepsilon-N$ 定义、收敛数列的唯一性、有界性与保号性。'],
      ['$\\lim_{n\\to\\infty}a_n=A\\iff$ 对任意 $\\varepsilon>0$，存在 $N$，当 $n>N$ 时 $|a_n-A|<\\varepsilon$。'],
      ['单调有界准则、夹逼准则和递推数列先估值再证明。']),
    S('§1.3', '函数极限', CH1,
      ['掌握双侧极限、单侧极限、无穷小量阶和两个重要极限。'],
      ['$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$，$\\lim_{x\\to\\infty}(1+\\frac1x)^x=e$。'],
      ['先判断趋近方式，再选用等价无穷小、夹逼或洛必达法则。']),
    S('§1.4', '函数的连续性', CH1,
      ['理解连续、间断点分类及闭区间连续函数的介值、最值和一致连续性质。'],
      ['$f$ 在 $x_0$ 连续 $\\iff \\lim_{x\\to x_0}f(x)=f(x_0)$。'],
      ['分段函数在分界点要分别计算左右极限与函数值。']),

    S('§2.1', '导数', CH2,
      ['掌握导数定义、几何意义、求导法则、隐函数求导与高阶导数。'],
      ['$f\'(x_0)=\\lim_{\\Delta x\\to0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$。'],
      ['可导必连续；分段函数在分界点用定义求导。']),
    S('§2.2', '微分', CH2,
      ['理解可微、微分形式不变性、近似计算和误差估计。'],
      ['$dy=f\'(x)dx$，$\\Delta y\\approx f\'(x)\\Delta x$。'],
      ['先求导数，再乘自变量微分。']),

    S('§3.1', '微分中值定理', CH3,
      ['掌握费马、罗尔、拉格朗日与柯西中值定理及单调性判定。'],
      ['若 $f$ 在 $[a,b]$ 连续、在 $(a,b)$ 可导，则存在 $\\xi$ 使 $f(b)-f(a)=f\'(\\xi)(b-a)$。'],
      ['证明不等式时构造辅助函数；证明存在性时检查闭连续、开可导。']),
    S('§3.2', '未定式的极限', CH3,
      ['掌握 $0/0$、$\\infty/\\infty$ 及其他未定式的洛必达法则。'],
      ['使用前必须确认分子、分母同时趋于 $0$ 或同时趋于 $\\infty$。'],
      ['幂指型先取对数，差式先通分或提取公因子。']),
    S('§3.3', '泰勒定理及应用', CH3,
      ['理解泰勒与麦克劳林公式，能用于极限、估计和高阶无穷小。'],
      ['$e^x=1+x+\\frac{x^2}{2!}+o(x^2)$，$\\sin x=x-\\frac{x^3}{3!}+o(x^3)$。'],
      ['先确定展开点与阶数，再统一余项阶数。']),
    S('§3.4', '数学建模（一）', CH3,
      ['把最值、变化率和边际量问题转化为函数或导数模型。'],
      ['最值问题先写目标函数与约束，再求驻点和端点。'],
      ['检查实际范围、量纲和端点。']),
    S('§3.5', '函数图形的凹凸性与拐点', CH3,
      ['用二阶导数判断凹凸性，用二阶导变号判断拐点。'],
      ['$f\'\'>0$ 为凹向上；$f\'\'<0$ 为凹向下。'],
      ['拐点必须同时满足在曲线上且凹凸性发生改变。']),
    S('§3.6', '函数图形的描绘', CH3,
      ['综合定义域、单调性、极值、凹凸、渐近线和关键点作图。'],
      ['先找竖直渐近线，再比较 $x\\to\\pm\\infty$ 时的线性主部。'],
      ['作图前列出定义域、截距、渐近线和单调区间。']),
    S('§3.7', '导数在经济中的应用', CH3,
      ['理解边际、弹性与最优化模型。'],
      ['需求弹性 $\\varepsilon=-\\frac{p}{Q}\\frac{dQ}{dp}$。'],
      ['先确认变量和单位，再解释边际量与弹性。']),
    S('§3.8', '曲率', CH3,
      ['掌握曲率与曲率圆的计算与几何意义。'],
      ['$\\kappa=\\frac{|y\'\'|}{(1+y\'^2)^{3/2}}$，曲率半径 $R=1/\\kappa$。'],
      ['参数方程先求 $dy/dx$ 与 $d^2y/dx^2$。']),
    S('§3.9', '方程的近似根', CH3,
      ['掌握二分法、牛顿迭代与收敛的基本判断。'],
      ['牛顿迭代 $x_{n+1}=x_n-\\frac{f(x_n)}{f\'(x_n)}$。'],
      ['先隔离根，再检查初始点与导数非零。']),

    S('§4.1', '不定积分的概念', CH4,
      ['理解原函数族、基本积分表和线性性质。'],
      ['$\\int f(x)dx=F(x)+C\\iff F\'(x)=f(x)$。'],
      ['积分结果必须含任意常数 $C$。']),
    S('§4.2', '不定积分的几种基本方法', CH4,
      ['掌握换元法、分部积分法与常见代数变形。'],
      ['$\\int f(\\varphi(x))\\varphi\'(x)dx=\\int f(u)du$；$\\int u\\,dv=uv-\\int v\\,du$。'],
      ['换元必须同步改变微分；分部积分优先选易降次的部分。']),
    S('§4.3', '特殊类型函数的不定积分', CH4,
      ['处理有理函数、三角有理式和简单无理式。'],
      ['有理函数先因式分解并作部分分式。'],
      ['比较分母结构，优先换元，其次部分分式。']),

    S('§5.1', '定积分的概念', CH5,
      ['理解分割、近似、求和、取极限的黎曼积分思想。'],
      ['$\\int_a^b f(x)dx=\\lim_{\\lambda\\to0}\\sum f(\\xi_i)\\Delta x_i$。'],
      ['用定义时应利用可积函数的等分分割。']),
    S('§5.2', '定积分的性质和基本定理', CH5,
      ['掌握线性、区间可加、保号性及微积分基本定理。'],
      ['$\\frac{d}{dx}\\int_a^{\\varphi(x)}f(t)dt=f(\\varphi(x))\\varphi\'(x)$。'],
      ['变上限积分先套链式法则。']),
    S('§5.3', '定积分的计算方法', CH5,
      ['熟练使用牛顿-莱布尼茨公式、换元和对称性。'],
      ['$\\int_a^b f(x)dx=F(b)-F(a)$。'],
      ['换元后立即更换上下限，避免回代。']),
    S('§5.4', '定积分的应用', CH5,
      ['计算面积、体积、弧长、功与平均值。'],
      ['面积 $S=\\int_a^b|f-g|dx$；旋转体体积 $V=\\pi\\int_a^b y^2dx$。'],
      ['先画区域并判断上下边界和旋转轴。']),
    S('§5.5', '反常积分', CH5,
      ['判断无穷区间与无界函数反常积分的收敛性。'],
      ['$\\int_1^{+\\infty}x^{-p}dx$ 当且仅当 $p>1$ 时收敛。'],
      ['先写成极限，再计算；比较判别法要看主导项。']),
    S('§5.6', '定积分的近似计算', CH5,
      ['理解矩形、梯形和抛物线法。'],
      ['复合 Simpson：$I\\approx\\frac h3[f_0+4\\sum f_{\\text{奇}}+2\\sum f_{\\text{偶}}+f_n]$。'],
      ['节点数和步长必须匹配公式。']),

    S('§6.1', '常微分方程的基本概念', CH6,
      ['区分阶、通解、特解、初始条件和积分曲线。'],
      ['$n$ 阶方程通解通常含 $n$ 个独立任意常数。'],
      ['先判断方程阶数与可识别类型。']),
    S('§6.2', '可分离变量方程与齐次方程', CH6,
      ['掌握分离变量和齐次代换。'],
      ['$g(y)dy=f(x)dx$；齐次方程令 $u=y/x$。'],
      ['积分后及时利用初值确定常数。']),
    S('§6.3', '一阶线性微分方程', CH6,
      ['掌握线性方程与伯努利方程的求解。'],
      ['$y\'+P(x)y=Q(x)$ 的通解为 $y=e^{-\\int P dx}(\\int Qe^{\\int P dx}dx+C)$。'],
      ['先化为标准形式，再识别 $P,Q$。']),
    S('§6.4', '全微分方程', CH6,
      ['识别恰当方程并求势函数。'],
      ['$Pdx+Qdy=0$ 恰当 $\\iff P_y=Q_x$。'],
      ['检验恰当性后可分组或求原函数。']),
    S('§6.5', '可降阶的二阶微分方程', CH6,
      ['处理缺 $y$、缺 $x$ 和 $y\'\'=f(x)$ 三类降阶方程。'],
      ['缺 $y$ 令 $p=y\'$；缺 $x$ 令 $p(y)=y\'$。'],
      ['根据缺少的自变量选择降阶变量。']),
    S('§6.6', '二阶线性微分方程解的结构', CH6,
      ['理解齐次通解与非齐次特解的叠加结构。'],
      ['非齐次通解 $=$ 齐次通解 $+$ 一个特解。'],
      ['先求齐次解，再寻找非齐次特解。']),
    S('§6.7', '二阶常系数线性微分方程', CH6,
      ['掌握特征方程法与待定系数法。'],
      ['$y\'\'+py\'+qy=0$ 由 $r^2+pr+q=0$ 的根决定解形。'],
      ['先求特征根，再按重根和右端类型设特解。']),
    S('§6.8', '常系数线性微分方程组', CH6,
      ['用消元法或矩阵方法求解一阶线性方程组。'],
      ['$X\'=AX$ 的解由矩阵 $A$ 的特征值结构决定。'],
      ['先写出矩阵形式，再消元或对角化。']),
    S('§6.9', '二阶变系数线性微分方程的一般解法', CH6,
      ['掌握降阶法与常数变易法。'],
      ['已知齐次解 $y_1$ 时令 $y=uy_1$ 可降阶。'],
      ['先用观察法找齐次特解，再进行常数变易。']),
    S('§6.10', '数学建模（二）', CH6,
      ['建立几何与物理中的微分方程模型。'],
      ['变化率问题先写微元关系，再积分。'],
      ['核对初始条件、单位和非负约束。']),
    S('§6.11', '差分方程', CH6,
      ['掌握一阶与二阶常系数线性差分方程。'],
      ['一阶线性差分方程通解为齐次通解加一个特解。'],
      ['先求平衡点，再用初值确定常数。'])
  ];

  var byCode = {};
  sections.forEach(function (section) { byCode[section.code] = section; });

  function makeProblem(id, code, statement, answer, steps, topics, difficulty, type) {
    var section = byCode[code];
    return {
      id: id,
      source: '苏德矿版《微积分》上册·精选强化（依据教材目录整理）',
      chapter: section.chapter,
      section: code + ' ' + section.title,
      statement: statement,
      type: type || '计算题',
      topics: topics || [],
      difficulty: difficulty || 3,
      tags: ['苏德矿版', '精选强化'],
      right_answer: answer,
      key_points: topics || [],
      solutions: [{ name: '清晰解答', steps: steps }],
      pitfalls: [],
      related: [],
      added: '2026-10-21'
    };
  }

  var problems = [
    makeProblem('SDK-3.1-01', '§3.1',
      '证明：当 $x>0$ 时，$\\ln(1+x)<x$。',
      '$\\ln(1+x)<x$。',
      ['令 $f(x)=\\ln(1+x)-x$，则 $f(0)=0$。', '$f\'(x)=\\frac1{1+x}-1=-\\frac{x}{1+x}<0\\ (x>0)$。', '所以 $f(x)$ 在 $x>0$ 时严格递减，故 $f(x)<f(0)=0$。'],
      ['拉格朗日中值定理', '单调性证明不等式'], 3, '证明题'),
    makeProblem('SDK-3.2-01', '§3.2',
      '求 $\\displaystyle\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}$。',
      '$\\dfrac12$。',
      ['分子分母均为 $0/0$ 型。', '连续使用洛必达法则：原式 $=\\lim\\frac{e^x-1}{2x}=\\lim\\frac{e^x}{2}=\\frac12$。'],
      ['洛必达法则', '$0/0$ 型'], 2),
    makeProblem('SDK-3.3-01', '§3.3',
      '求 $\\displaystyle\\lim_{x\\to0}\\frac{\\sin x-x}{x^3}$。',
      '$-\\dfrac16$。',
      ['由麦克劳林公式 $\\sin x=x-\\frac{x^3}{6}+o(x^3)$。', '故 $\\frac{\\sin x-x}{x^3}=-\\frac16+o(1)\\to-\\frac16$。'],
      ['麦克劳林公式', '高阶无穷小'], 3),
    makeProblem('SDK-3.5-01', '§3.5',
      '设 $f(x)=xe^{-x}$，求其凹凸区间与拐点。',
      '凹向上区间 $(2,+\\infty)$，凹向下区间 $(-\\infty,2)$，拐点为 $(2,2e^{-2})$。',
      ['$f\'(x)=(1-x)e^{-x}$，$f\'\'(x)=(x-2)e^{-x}$。', '$x<2$ 时 $f\'\'<0$，$x>2$ 时 $f\'\'>0$。', '故拐点为 $(2,2e^{-2})$。'],
      ['二阶导数', '凹凸性与拐点'], 3),
    makeProblem('SDK-3.6-01', '§3.6',
      '求曲线 $y=\\dfrac{x^2+1}{x-1}$ 的渐近线。',
      '竖直渐近线 $x=1$，斜渐近线 $y=x+1$。',
      ['$x\\to1$ 时分母趋于 $0$，分子不为 $0$，故 $x=1$ 为竖直渐近线。', '$y=x+1+\\frac{2}{x-1}$，当 $x\\to\\pm\\infty$ 时与 $y=x+1$ 无限接近。'],
      ['渐近线', '有理函数'], 3),
    makeProblem('SDK-3.8-01', '§3.8',
      '求 $y=\\ln x$ 在 $x=1$ 处的曲率与曲率半径。',
      '曲率 $\\kappa=\\dfrac{1}{2\\sqrt2}$，曲率半径 $R=2\\sqrt2$。',
      ['$y\'=1/x$，$y\'\'=-1/x^2$。', '在 $x=1$ 处，$\\kappa=\\frac1{(1+1)^{3/2}}=\\frac1{2\\sqrt2}$。', '$R=1/\\kappa=2\\sqrt2$。'],
      ['曲率公式', '曲率半径'], 3),
    makeProblem('SDK-3.9-01', '§3.9',
      '用牛顿迭代法求 $x^3-x-1=0$ 在 $(1,2)$ 内的近似根，取 $x_1=1.5$，写出 $x_2$。',
      '$x_2=\\dfrac{23}{16}$。',
      ['$f\'(x)=3x^2-1$。', '$x_2=x_1-\\frac{x_1^3-x_1-1}{3x_1^2-1}$。', '代入 $x_1=3/2$，得 $x_2=23/16$。'],
      ['牛顿迭代', '近似根'], 3),
    makeProblem('SDK-4.1-01', '§4.1',
      '求 $\\displaystyle\\int\\frac{2x+1}{x^2+x+1}dx$。',
      '$\\ln(x^2+x+1)+C$。',
      ['注意到分子恰为分母的导数：$(x^2+x+1)\'=2x+1$。', '故积分为 $\\ln(x^2+x+1)+C$。'],
      ['基本积分表', '对数积分'], 2),
    makeProblem('SDK-4.2-01', '§4.2',
      '求 $\\displaystyle\\int\\frac{x}{1+x^4}dx$。',
      '$\\dfrac12\\arctan(x^2)+C$。',
      ['令 $u=x^2$，则 $du=2x\\,dx$。', '原式 $=\\frac12\\int\\frac{du}{1+u^2}=\\frac12\\arctan u+C$。'],
      ['换元积分法', '反正切'], 2),
    makeProblem('SDK-4.2-02', '§4.2',
      '求 $\\displaystyle\\int x\\arctan x\\,dx$。',
      '$\\dfrac{x^2+1}{2}\\arctan x-\\dfrac{x}{2}+C$。',
      ['取 $u=\\arctan x$，$dv=x\\,dx$。', '$\\int x\\arctan x\\,dx=\\frac{x^2}{2}\\arctan x-\\frac12\\int\\frac{x^2}{1+x^2}dx$。', '利用 $\\frac{x^2}{1+x^2}=1-\\frac1{1+x^2}$，整理得答案。'],
      ['分部积分', '反三角函数'], 3),
    makeProblem('SDK-4.3-01', '§4.3',
      '求 $\\displaystyle\\int\\frac{dx}{x(x+1)}$。',
      '$\\ln\\left|\\dfrac{x}{x+1}\\right|+C$。',
      ['部分分式分解：$\\frac1{x(x+1)}=\\frac1x-\\frac1{x+1}$。', '逐项积分得 $\\ln|x|-\\ln|x+1|+C$。'],
      ['有理函数', '部分分式'], 3),
    makeProblem('SDK-5.1-01', '§5.1',
      '用定积分定义计算 $\\displaystyle\\int_0^1x^2dx$。',
      '$\\dfrac13$。',
      ['将 $[0,1]$ $n$ 等分，取右端点。', '黎曼和 $S_n=\\frac1{n^3}\\sum_{k=1}^n k^2=\\frac{(n+1)(2n+1)}{6n^2}$。', '令 $n\\to\\infty$，得积分值 $1/3$。'],
      ['定积分定义', '黎曼和'], 3),
    makeProblem('SDK-5.2-01', '§5.2',
      '求 $\\displaystyle\\frac{d}{dx}\\int_0^{x^2}\\sin(t^2)dt$。',
      '$2x\\sin(x^4)$。',
      ['令上限 $u=x^2$，由变上限积分求导与链式法则：', '$\\frac{d}{dx}\\int_0^u\\sin(t^2)dt=\\sin(u^2)\\cdot2x$。', '代回 $u=x^2$ 得 $2x\\sin(x^4)$。'],
      ['变上限积分', '链式法则'], 2),
    makeProblem('SDK-5.3-01', '§5.3',
      '计算 $\\displaystyle\\int_0^\\pi x\\sin x\\,dx$。',
      '$\\pi$。',
      ['分部积分，取 $u=x$，$dv=\\sin x\\,dx$。', '原式 $=[-x\\cos x]_0^\\pi+\\int_0^\\pi\\cos x\\,dx=\\pi+0$。'],
      ['定积分分部积分', '三角积分'], 3),
    makeProblem('SDK-5.4-01', '§5.4',
      '求曲线 $y=x^2$ 与 $y=2-x^2$ 所围区域的面积。',
      '$\\dfrac83$。',
      ['联立得交点 $x=\\pm1$。', '面积 $S=\\int_{-1}^1(2-2x^2)dx$。', '计算得 $S=\\frac83$。'],
      ['平面图形面积', '交点'], 3),
    makeProblem('SDK-5.4-02', '§5.4',
      '曲线 $y=\\sqrt x\\ (0\\le x\\le4)$ 绕 $x$ 轴旋转，求所得旋转体体积。',
      '$8\\pi$。',
      ['圆盘法：$V=\\pi\\int_0^4(\\sqrt x)^2dx$。', '$V=\\pi\\int_0^4x\\,dx=8\\pi$。'],
      ['旋转体体积', '圆盘法'], 3),
    makeProblem('SDK-5.5-01', '§5.5',
      '讨论 $\\displaystyle\\int_1^{+\\infty}\\frac{dx}{x^p}$ 的收敛性。',
      '$p>1$ 时收敛，值为 $\\dfrac1{p-1}$；$p\\le1$ 时发散。',
      ['写成极限 $\\lim_{b\\to+\\infty}\\int_1^b x^{-p}dx$。', '$p\\ne1$ 时原函数为 $\\frac{x^{1-p}}{1-p}$，只有 $p>1$ 时极限有限。', '$p=1$ 时积分为 $\\ln b$，发散。'],
      ['无穷区间反常积分', '$p$ 积分'], 3),
    makeProblem('SDK-5.6-01', '§5.6',
      '用 Simpson 公式（取 $h=1/2$）近似计算 $\\displaystyle\\int_0^1\\frac{4}{1+x^2}dx$。',
      '$\\dfrac{47}{15}\\approx3.1333$。',
      ['节点为 $0,1/2,1$，函数值为 $4,16/5,2$。', '$S=\\frac{h}{3}[f(0)+4f(1/2)+f(1)]$。', '$S=\\frac16(4+\\frac{64}{5}+2)=\\frac{47}{15}$。'],
      ['Simpson 公式', '数值积分'], 3),
    makeProblem('SDK-6.2-01', '§6.2',
      '解初值问题 $y\'=xy,\\ y(0)=1$。',
      '$y=e^{x^2/2}$。',
      ['分离变量：$\\frac{dy}{y}=x\\,dx$。', '积分得 $\\ln|y|=\\frac{x^2}{2}+C$。', '由 $y(0)=1$ 得 $C=0$，故 $y=e^{x^2/2}$。'],
      ['可分离变量方程', '初值问题'], 2),
    makeProblem('SDK-6.3-01', '§6.3',
      '求一阶线性方程 $y\'+y=e^x$ 的通解。',
      '$y=\\dfrac12e^x+Ce^{-x}$。',
      ['积分因子为 $e^{\\int1\\,dx}=e^x$。', '方程化为 $(e^xy)\'=e^{2x}$。', '积分得 $e^xy=\\frac12e^{2x}+C$，故 $y=\\frac12e^x+Ce^{-x}$。'],
      ['一阶线性方程', '积分因子'], 3),
    makeProblem('SDK-6.5-01', '§6.5',
      '求 $y\'\'=x$ 的通解。',
      '$y=\\dfrac{x^3}{6}+C_1x+C_2$。',
      ['连续积分两次：$y\'=\\frac{x^2}{2}+C_1$。', '再积分得 $y=\\frac{x^3}{6}+C_1x+C_2$。'],
      ['可降阶方程', '连续积分'], 2),
    makeProblem('SDK-6.7-01', '§6.7',
      '求 $y\'\'-3y\'+2y=0$ 的通解。',
      '$y=C_1e^x+C_2e^{2x}$。',
      ['特征方程为 $r^2-3r+2=0$。', '特征根为 $1,2$。', '故通解为 $y=C_1e^x+C_2e^{2x}$。'],
      ['二阶常系数齐次方程', '特征方程'], 3),
    makeProblem('SDK-6.7-02', '§6.7',
      '求 $y\'\'+y=x$ 的通解。',
      '$y=C_1\\cos x+C_2\\sin x+x$。',
      ['对应齐次方程特征根为 $\\pm i$，齐次解为 $C_1\\cos x+C_2\\sin x$。', '设特解 $y_p=ax+b$，代入得 $a=1,b=0$。', '故 $y=y_h+y_p$。'],
      ['二阶非齐次方程', '待定系数法'], 3),
    makeProblem('SDK-6.7-03', '§6.7',
      '求 $y\'\'+2y\'+2y=0$ 的通解。',
      '$y=e^{-x}(C_1\\cos x+C_2\\sin x)$。',
      ['特征方程 $r^2+2r+2=0$。', '特征根 $r=-1\\pm i$。', '由复根情形得通解。'],
      ['共轭复根', '常系数齐次方程'], 3),
    makeProblem('SDK-6.8-01', '§6.8',
      '解方程组 $\\begin{cases}x\'=y,\\\\y\'=-x.\\end{cases}$',
      '$x=C_1\\cos t+C_2\\sin t,\\quad y=-C_1\\sin t+C_2\\cos t$。',
      ['由 $x\'\'=y\'=-x$，得 $x\'\'+x=0$。', '解得 $x=C_1\\cos t+C_2\\sin t$。', '再由 $y=x\'$ 求 $y$。'],
      ['微分方程组', '消元法'], 4),
    makeProblem('SDK-6.9-01', '§6.9',
      '求 Euler 方程 $x^2y\'\'-2xy\'+2y=0\\ (x>0)$ 的通解。',
      '$y=C_1x+C_2x^2$。',
      ['令 $x=e^t$，则 Euler 方程化为常系数方程。', '对应特征方程 $r(r-1)-2r+2=0$，即 $(r-1)(r-2)=0$。', '故 $y=C_1x+C_2x^2$。'],
      ['Euler 方程', '变系数方程'], 4),
    makeProblem('SDK-6.11-01', '§6.11',
      '求差分方程 $y_{n+1}=2y_n+1$ 的通解。',
      '$y_n=C2^n-1$。',
      ['令平衡值满足 $Y=2Y+1$，得平衡值 $Y=-1$。', '设 $z_n=y_n+1$，则 $z_{n+1}=2z_n$。', '故 $z_n=C2^n$，从而 $y_n=C2^n-1$。'],
      ['一阶差分方程', '平衡点'], 3)
  ];

  var knowledge = sections.map(function (section) {
    return {
      id: 'SDK-FRAME-' + section.code.replace('§', ''),
      title: section.code + ' ' + section.title + ' · 知识框架',
      chapter: section.chapter,
      section: section.code + ' ' + section.title,
      content: section.points.concat(section.theorems || []).join('\n'),
      formulas: section.formulas,
      tips: section.methods,
      related: ['苏德矿版《微积分》上册目录'],
      added: '2026-10-21'
    };
  });

  BANK.problems = Array.isArray(BANK.problems) ? BANK.problems : [];
  BANK.knowledge = Array.isArray(BANK.knowledge) ? BANK.knowledge : [];

  function remapCode(code, chapter) {
    if (chapter.indexOf('第一章') >= 0) {
      if (code === '§1.2') return '§1.2';
      if (code === '§1.3' || code === '§1.4' || code === '§1.5' || code === '§1.6') return '§1.3';
      if (code === '§1.7' || code === '§1.8') return '§1.4';
    }
    if (chapter.indexOf('第二章') >= 0) {
      if (code === '§2.2') return '§3.1';
      if (code === '§2.4') return '§3.5';
      return '§2.1';
    }
    return code;
  }

  BANK.problems.concat(BANK.knowledge).forEach(function (item) {
    var match = String(item.section || '').match(/§\s*(\d+)\.(\d+)/);
    if (!match) return;
    var mapped = remapCode('§' + match[1] + '.' + match[2], String(item.chapter || ''));
    var section = byCode[mapped];
    if (!section) return;
    item.chapter = section.chapter;
    item.section = section.code + ' ' + section.title;
  });

  var problemIds = new Set(BANK.problems.map(function (item) { return item.id; }));
  var knowledgeIds = new Set(BANK.knowledge.map(function (item) { return item.id; }));
  problems.forEach(function (item) {
    if (!problemIds.has(item.id)) BANK.problems.push(item);
  });
  knowledge.forEach(function (item) {
    if (!knowledgeIds.has(item.id)) BANK.knowledge.push(item);
  });
  BANK.meta = BANK.meta || {};
  BANK.meta.sources = Array.isArray(BANK.meta.sources) ? BANK.meta.sources : [];
  if (BANK.meta.sources.indexOf('苏德矿版《微积分》上册') < 0) {
    BANK.meta.sources.push('苏德矿版《微积分》上册');
  }

  window.CALCULUS_FRAMEWORK_SECTIONS = sections;
})();
