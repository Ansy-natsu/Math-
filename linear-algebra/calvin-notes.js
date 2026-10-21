(function () {
  'use strict';
  var data = {
  "source": "陈维新《线性代数》（第二版）考前速记",
  "knowledgeCount": 9,
  "knowledge": [
    {
      "id": "KJ-NOTE-1",
      "title": "陈维新｜行列式与排列·考前速记",
      "chapter": "第2章 行列式与矩阵的秩",
      "section": "§2.1  n–排列",
      "content": "",
      "formulas": [],
      "tips": [
        "排列的逆序数是“前大后小”的数对个数，排列符号为 $(-1)^\\tau$；一次对换改变奇偶性。",
        "$n$ 阶行列式的每一项恰取每行、每列各一个元素；三角行列式取主对角线乘积，反三角还要乘 $(-1)^{n(n-1)/2}$。",
        "两行互换变号；某行乘 $k$，行列式乘 $k$；某行加另一行的倍数，行列式不变。列变换同理。",
        "按行展开 $D=\\sum_j a_{ij}A_{ij}$，其中 $A_{ij}=(-1)^{i+j}M_{ij}$；优先选择零多的行或列。",
        "范德蒙德行列式 $\\det(x_j^{i-1})=\\prod_{i<j}(x_j-x_i)$；Cramer 法则只在方阵且 $D\\ne0$ 时直接给出唯一解。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第7页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-2",
      "title": "陈维新｜线性方程组·考前速记",
      "chapter": "第1章 线性方程组的求解",
      "section": "§1.1  线性方程组的形式及相关概念",
      "content": "",
      "formulas": [],
      "tips": [
        "解方程组时只对增广矩阵作初等行变换；交换列相当于交换未知量顺序，必须记录。",
        "秩 $r(A)$ 是最大非零子式的阶数，也是阶梯形的非零行数；初等变换不改变秩。",
        "$Ax=b$：$r(A)\\ne r([A\\mid b])$ 时无解；两秩相等时，$r=n$ 有唯一解，$r<n$ 有 $n-r$ 个自由参数。",
        "齐次方程组恒有零解，有非零解当且仅当 $r(A)<n$。",
        "含参题先找可能消失的主元，再单独代回临界参数，不能漏分类。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第27页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-3",
      "title": "陈维新｜矩阵运算·考前速记",
      "chapter": "第3章 矩阵的运算",
      "section": "§3.1  矩阵的加减法、数乘、乘法和转置",
      "content": "",
      "formulas": [],
      "tips": [
        "矩阵相乘先检查维数；一般 $AB\\ne BA$，也不能由 $AB=O$ 推出某个因子为零。",
        "$(AB)^T=B^TA^T$，$(AB)^{-1}=B^{-1}A^{-1}$。",
        "$A$ 可逆 $\\iff |A|\\ne0\\iff r(A)=n$；求逆可用 $[A\\mid I]\\to[I\\mid A^{-1}]$。",
        "$A^*=|A|A^{-1}$（仅可逆时），并恒有 $AA^*=A^*A=|A|I$。",
        "左乘初等矩阵作用于行，右乘作用于列；初等变换可逆，因此不改变秩。",
        "同型矩阵相抵当且仅当秩相同；标准形为 $\\operatorname{diag}(I_r,O)$。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第35页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-4",
      "title": "陈维新｜向量空间与线性相关·考前速记",
      "chapter": "第4章 n元向量空间",
      "section": "§4.1  向量组的线性关系",
      "content": "",
      "formulas": [],
      "tips": [
        "子空间必须含零向量，并对加法和数乘封闭；$Ax=0$ 的解集是子空间，$Ax=b\\ne0$ 的解集通常不是。",
        "把向量按列排成 $A$：向量组线性无关 $\\iff Ax=0$ 只有零解；$\\beta$ 可表示 $\\iff Ax=\\beta$ 有解。",
        "求极大无关组时，对列矩阵作行消元，取主元位置对应的原始列。",
        "基必须线性无关且张成整个空间；$n$ 维空间中，$n$ 个向量只检验其中一个条件即可。",
        "过渡矩阵约定为 $[\\text{新基}]=[\\text{旧基}]P$，同一向量的坐标满足 $x_{\\text{旧}}=Px_{\\text{新}}$。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第51页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-5",
      "title": "陈维新｜向量空间后半部分·知识速记",
      "chapter": "第4章 n元向量空间",
      "section": "§4.8  线性方程组解的结构",
      "content": "",
      "formulas": [],
      "tips": [
        "解空间维数 $\\dim\\ker A=n-r(A)$；非齐次通解等于一个特解加齐次通解。",
        "有限维线性空间同构当且仅当维数相同；矩阵、多项式都可先按基坐标化。",
        "欧氏空间中 $\\cos\\theta=\\dfrac{\\langle u,v\\rangle}{\\|u\\|\\|v\\|}$；Schmidt 正交化先减投影，再按需单位化。",
        "线性映射先查 $T(0)=0$，再查 $T(au+bv)=aT(u)+bT(v)$。",
        "矩阵第 $j$ 列是 $T(e_j)$ 的坐标；换基满足 $A_\\eta=P^{-1}A_\\varepsilon P$。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第60页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-6",
      "title": "陈维新｜特征值与对角化·考前速记",
      "chapter": "第5章 矩阵的特征值理论与相似对角化",
      "section": "§5.1  特征值与特征向量的定义及计算",
      "content": "",
      "formulas": [],
      "tips": [
        "由 $\\det(\\lambda I-A)=0$ 求特征值，再由 $(A-\\lambda I)x=0$ 求非零特征向量。",
        "$A$ 可对角化 $\\iff$ 有 $n$ 个线性无关特征向量 $\\iff$ 每个特征值几何重数等于代数重数。",
        "取 $P$ 的列为特征向量，$\\Lambda$ 的对角元按同一顺序排列，则 $P^{-1}AP=\\Lambda$。",
        "相似保持特征多项式、特征值（含重数）、迹、行列式和秩，但这些量相同不一定推出相似。",
        "实对称矩阵一定能正交对角化；重特征值内部需再作 Schmidt 正交化。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第73页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-7",
      "title": "陈维新｜相似与对角化·知识速记",
      "chapter": "第5章 矩阵的特征值理论与相似对角化",
      "section": "§5.3  矩阵的相似及其性质",
      "content": "",
      "formulas": [],
      "tips": [
        "$A$ 与 $B$ 相似指存在可逆矩阵 $P$，使 $B=P^{-1}AP$。",
        "若 $P^{-1}AP=\\Lambda$，则 $A^k=P\\Lambda^kP^{-1}$，$f(A)=Pf(\\Lambda)P^{-1}$。",
        "相似矩阵的迹、行列式、特征多项式、特征值和秩都相同。",
        "实对称矩阵正交对角化时，$U^TAU=\\Lambda$，$U$ 的列是标准正交特征向量。",
        "$U$ 中特征向量的顺序必须与 $\\Lambda$ 中特征值的顺序一致。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第76页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-8",
      "title": "陈维新｜二次型·考前速记",
      "chapter": "第6章 二次型",
      "section": "§6.1  二次型的定义及标准形",
      "content": "",
      "formulas": [],
      "tips": [
        "二次型写成 $f=X^TAX$ 时取对称矩阵；交叉项 $cx_ix_j$ 对应 $a_{ij}=a_{ji}=c/2$。",
        "可逆替换 $X=CY$ 给出 $B=C^TAC$，这叫合同；正交替换还满足 $C^{-1}=C^T$。",
        "实二次型的合同类型由正、负惯性指数 $(p,q)$ 决定，秩 $r=p+q$。",
        "正定可用全部特征值大于零或全部顺序主子式大于零判断；半正定不能只查顺序主子式。",
        "做题时先写对称矩阵，再判断题目要求配方、正交化还是只判类型，最后核验替换矩阵与符号。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第84页"
      ],
      "added": "2026-10-21"
    },
    {
      "id": "KJ-NOTE-9",
      "title": "陈维新｜附录方法·考前速记",
      "chapter": "第8章 欧氏空间",
      "section": "§8.2  标准正交基",
      "content": "",
      "formulas": [],
      "tips": [
        "插值：设未知系数，用函数值或导数值列线性方程组。",
        "流量与配料：先写守恒等式，再补充非负和容量约束。",
        "分块消元：使用 Schur 补 $D-CA^{-1}B$ 时不能交换矩阵乘法次序。",
        "最小二乘：解 $A^TAX=A^Tb$，并用 $A^Tr=0$ 检查残差。",
        "附录三、四、五的练习均按当前章节归类；附录一、二、六没有独立习题组。"
      ],
      "related": [
        "陈维新《线性代数》（第二版）PDF第94页"
      ],
      "added": "2026-10-21"
    }
  ]
};
  if (typeof BANK === 'undefined' || !BANK || typeof BANK !== 'object') return;
  BANK.knowledge = Array.isArray(BANK.knowledge) ? BANK.knowledge : [];
  var ids = new Set(BANK.knowledge.map(function (item) { return item.id; }));
  data.knowledge.forEach(function (item) { if (!ids.has(item.id)) BANK.knowledge.push(item); });
  BANK.meta = BANK.meta || {};
  BANK.meta.sources = Array.isArray(BANK.meta.sources) ? BANK.meta.sources : [];
  if (BANK.meta.sources.indexOf(data.source) < 0) BANK.meta.sources.push(data.source);
  window.KJ_NOTE_META = data;
})();
