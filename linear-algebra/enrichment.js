(function () {
  'use strict';

  window.LA_SECTION_ENRICHMENT = {
    '§1.1': {
      properties: [
        { title: '解的叠加与平移', text: '非齐次方程组的两个解之差是齐次解；一个非齐次解加上任意齐次解仍是原方程组的解。这就是解集“仿射结构”的来源。', formulas: ['$x_1-x_2\\in\\ker A$', '$x_0+y\\in x_0+\\ker A\\ (y\\in\\ker A)$'] }
      ],
      theorems: [
        { title: '相容性的秩判据', text: '非齐次线性方程组有解的充要条件是系数矩阵与增广矩阵的秩相等。这个条件把“右端是否落在列空间中”转化为可直接计算的秩比较。', formulas: ['$A\\mathbf{x}=\\mathbf{b}$ 有解 $\\iff r(A)=r(A\\mid\\mathbf{b})$'] }
      ]
    },
    '§1.2': {
      properties: [
        { title: '初等变换保持解集', text: '三类初等行变换都能反向执行，因此不改变线性方程组的解集。主元的选择可以变化，但解集和自由未知量个数不会变化。', formulas: ['$(A\\mid\\mathbf{b})\\sim_r(A\'\\mid\\mathbf{b}\')\\Rightarrow$ 两方程组同解'] }
      ],
      theorems: [
        { title: '阶梯形解的维数', text: '阶梯形中主元个数等于秩，自由未知量个数等于未知量总数减秩。因此，只要给出一个阶梯形，就能立即读出解空间的自由度。', formulas: ['自由变量数 $=n-r(A)$'] }
      ]
    },
    '§1.3': {
      properties: [
        { title: '秩决定约束数量', text: '系数矩阵的秩是独立约束的数量。方程很多但有效约束很少时，仍可能出现大量自由变量；相反，方程很少也可能因独立约束足够而使解唯一。', formulas: ['$n-r(A)$ 个自由度'] }
      ],
      theorems: [
        { title: '齐次方程组的非零解判据', text: '齐次方程组除零解外还有非零解，当且仅当系数矩阵的秩小于未知量个数。方阵情形等价于行列式为零。', formulas: ['$A\\mathbf{x}=0$ 有非零解 $\\iff r(A)<n$'] }
      ]
    },
    '§1.4': {
      properties: [
        { title: '初等行变换保持行空间与秩', text: '行变换不改变各行之间的线性关系，因此行空间、零空间和秩都不变。但行变换会改变列的数值表示，所以列空间本身一般会改变。', formulas: ['$r(PA)=r(A)$（$P$ 可逆）'] }
      ],
      theorems: [
        { title: '简化行阶梯形的唯一性', text: '每个矩阵都行等价于唯一的简化行阶梯形。唯一性来自主元列的确定位置，使不同消元顺序最终得到相同的标准形式。', formulas: ['$A\\sim_r\\operatorname{RREF}(A)$'] }
      ]
    },
    '§1.5': {
      properties: [
        { title: '初等矩阵的行列式', text: '交换型初等矩阵行列式为 $-1$，倍乘型为倍数 $k$，倍加型为 $1$。这些数值正好解释三种行变换对行列式的影响。', formulas: ['$|E_{ij}|=-1,\\quad |E_i(k)|=k,\\quad |E_{ij}(k)|=1$'] }
      ],
      theorems: [
        { title: '可逆矩阵的初等分解', text: '方阵可逆当且仅当它能写成有限个初等矩阵的乘积。Gauss-Jordan 求逆就是把这组初等矩阵依次作用到单位矩阵上的过程。', formulas: ['$A$ 可逆 $\\iff A=E_1E_2\\cdots E_s$'] }
      ]
    },

    '§2.1': {
      properties: [
        { title: '一次对换改变奇偶性', text: '任意交换排列中的两个元素，逆序数的奇偶性都会改变。因此排列的正负号在每次对换后都会变号。', formulas: ['$\\operatorname{sgn}(\\sigma\\tau)=-\\operatorname{sgn}(\\sigma)$'] }
      ],
      theorems: [
        { title: '奇偶排列数量相等', text: '$n\\ge2$ 时，$n$ 元排列中奇排列和偶排列各占一半。这为行列式正负项的数量对应提供结构解释。', formulas: ['$\\#\\{\\text{偶排列}\\}=\\#\\{\\text{奇排列}\\}=\\dfrac{n!}{2}$'] }
      ]
    },
    '§2.2': {
      properties: [
        { title: '转置不改变行列式', text: '行列式按行展开和按列展开完全对称，因此矩阵转置后行列式不变。涉及行的性质和涉及列的性质可以互相转用。', formulas: ['$|A^T|=|A|$'] }
      ],
      theorems: [
        { title: '行列式乘积定理', text: '两个同阶方阵乘积的行列式等于各自行列式的乘积。它把矩阵乘法的可逆性与数的乘法联系起来。', formulas: ['$|AB|=|A||B|$'] }
      ]
    },
    '§2.3': {
      properties: [
        { title: '行和相同的行列式', text: '若每行元素之和都等于同一个数 $s$，把所有列加到第一列后可提出公因子 $s$，再用倍加制造零，常可快速降阶。', formulas: ['$|A|=s\\cdot|A\'|$（列变换保持行列式）'] }
      ],
      theorems: [
        { title: '分块三角行列式定理', text: '分块上三角或下三角矩阵的行列式等于对角块行列式的乘积。它把高阶行列式化为多个低阶行列式。', formulas: ['$\\det\\begin{pmatrix}A&C\\\\0&B\\end{pmatrix}=|A||B|$'] }
      ]
    },
    '§2.4': {
      properties: [
        { title: '正交展开恒等式', text: '用某一行元素去乘另一行元素的代数余子式，所得和为零。这说明不同行的代数余子式与当前行正交。', formulas: ['$\\sum_j a_{kj}A_{ij}=0\\quad(k\\ne i)$'] }
      ],
      theorems: [
        { title: 'Laplace 展开定理', text: '行列式可以沿任意一行或任意一列展开，展开式等于该行元素与对应代数余子式乘积之和。选择零元素最多的行或列能显著减少计算。', formulas: ['$|A|=\\sum_{j=1}^n a_{ij}A_{ij}=\\sum_{i=1}^n a_{ij}A_{ij}$'] }
      ]
    },
    '§2.5': {
      properties: [
        { title: '转置保持秩', text: '行秩与列秩相等，因此矩阵转置不会改变秩。这个性质把行空间问题与列空间问题统一起来。', formulas: ['$r(A^T)=r(A)$'] }
      ],
      theorems: [
        { title: '最大非零子式刻画', text: '矩阵的秩等于其非零子式的最高阶数。若存在 $r$ 阶非零子式，而所有 $r+1$ 阶子式都为零，则秩为 $r$。', formulas: ['$r(A)=\\max\\{k:\\exists\\,k\\text{ 阶非零子式}\\}$'] }
      ]
    },
    '§2.6': {
      properties: [
        { title: '消元保持零空间', text: '初等行变换等价于左乘可逆矩阵，因此 $Ax=0$ 与 $PAx=0$ 同解。零空间是消元过程中最稳定、最重要的不变量之一。', formulas: ['$\\ker(PA)=\\ker A$'] }
      ],
      theorems: [
        { title: '主元个数与秩', text: '任意矩阵化为行阶梯形后，非零行数等于矩阵的秩；主元所在列的位置给出极大线性无关列的位置。', formulas: ['$r(A)=\\#\\{\\text{主元}\\}=\\#\\{\\text{非零行}\\}$'] }
      ]
    },
    '§2.7': {
      properties: [
        { title: '相抵保持秩', text: '左乘或右乘可逆矩阵都不会改变秩，因此相抵矩阵的秩相同。反过来，同型且同秩的矩阵一定相抵。', formulas: ['$r(PAQ)=r(A)$'] }
      ],
      theorems: [
        { title: '相抵标准形定理', text: '秩为 $r$ 的 $m\\times n$ 矩阵相抵于左上角为 $I_r$、其余为零的标准矩阵。所有同型同秩矩阵属于同一个相抵类。', formulas: ['$A\\sim\\begin{pmatrix}I_r&0\\\\0&0\\end{pmatrix}$'] }
      ]
    },

    '§3.1': {
      properties: [
        { title: '乘法与线性组合', text: '矩阵乘法可以按列解释：$AB$ 的每一列都是 $A$ 的列向量以 $B$ 的对应列为系数作线性组合。这使矩阵乘法与向量组的线性表示自然衔接。', formulas: ['$AB=A(\\mathbf{b}_1,\\dots,\\mathbf{b}_p)=(A\\mathbf{b}_1,\\dots,A\\mathbf{b}_p)$'] }
      ],
      theorems: [
        { title: '乘积转置定理', text: '矩阵乘积的转置等于各因子转置后按相反顺序相乘。该规则与逆矩阵乘积公式同属“反序”规律。', formulas: ['$(AB)^T=B^TA^T$'] }
      ]
    },
    '§3.2': {
      properties: [
        { title: '逆矩阵的唯一性', text: '若矩阵可逆，其逆矩阵唯一。若 $B,C$ 都是 $A$ 的逆，则 $B=BI=B(AC)=(BA)C=C$，说明左右逆与双侧逆在方阵情形下统一。', formulas: ['$AB=BA=I$'] }
      ],
      theorems: [
        { title: '乘积可逆定理', text: '若 $A,B$ 均可逆，则 $AB$ 可逆，并且逆的顺序相反。该结论可推广到有限多个可逆矩阵的乘积。', formulas: ['$(AB)^{-1}=B^{-1}A^{-1}$'] }
      ]
    },
    '§3.3': {
      properties: [
        { title: '分块对角的运算', text: '分块对角矩阵的加法、乘法、幂和逆都可以逐块进行。对角的零块使不同块之间互不干扰。', formulas: ['$\\operatorname{diag}(A_1,\\dots,A_s)^k=\\operatorname{diag}(A_1^k,\\dots,A_s^k)$'] }
      ],
      theorems: [
        { title: 'Schur 补行列式公式', text: '若 $A$ 可逆，则分块矩阵的行列式可化为 $|A|\\cdot|D-CA^{-1}B|$。它常用于高阶行列式和分块矩阵求逆。', formulas: ['$\\det\\begin{pmatrix}A&B\\\\C&D\\end{pmatrix}=|A|\\,|D-CA^{-1}B|$'] }
      ]
    },
    '§3.4': {
      properties: [
        { title: '初等矩阵可逆', text: '三类初等矩阵都有逆矩阵，且逆矩阵仍是同类型初等矩阵。因此初等变换不仅是操作，也是可逆的线性变换。', formulas: ['$E_{ij}^{-1}=E_{ij},\\quad E_i(k)^{-1}=E_i(1/k),\\quad E_{ij}(k)^{-1}=E_{ij}(-k)$'] }
      ],
      theorems: [
        { title: '可逆的初等矩阵刻画', text: '方阵 $A$ 可逆，当且仅当 $A$ 行等价于单位矩阵，也等价于 $A$ 是有限个初等矩阵的乘积。', formulas: ['$A$ 可逆 $\\iff A\\sim_r I\\iff A=E_1\\cdots E_s$'] }
      ]
    },
    '§3.5': {
      properties: [
        { title: '可逆因子保持秩', text: '左乘或右乘可逆矩阵不会改变秩。因此做行变换或列变换研究秩时，可逆变换可以放心使用。', formulas: ['$r(PA)=r(A)=r(AQ)$'] }
      ],
      theorems: [
        { title: 'Sylvester 秩不等式', text: '若 $A$ 为 $m\\times n$、$B$ 为 $n\\times p$，则乘积秩有下界 $r(A)+r(B)-n$。当 $r(AB)=0$ 时，它直接给出零空间维数的约束。', formulas: ['$r(AB)\\ge r(A)+r(B)-n$'] }
      ]
    },

    '§4.1': {
      properties: [
        { title: '含零向量必相关', text: '任何含有零向量的向量组都线性相关，因为取零向量系数非零、其余系数为零，就能得到非平凡零组合。', formulas: ['$0\\cdot\\alpha_1+1\\cdot0+0\\cdot\\alpha_3=0$'] }
      ],
      theorems: [
        { title: '超维向量组必相关', text: '在 $n$ 维空间中，任意 $n+1$ 个向量必线性相关。更一般地，向量个数大于空间维数时，向量组一定线性相关。', formulas: ['$n+1$ 个向量 $\\in\\mathbb R^n\\Rightarrow$ 线性相关'] }
      ]
    },
    '§4.2': {
      properties: [
        { title: '等价向量组同秩同张成', text: '两个向量组等价时，它们张成同一个空间，因此秩相等。反之，只有张成同一个空间时才能保证双向表示。', formulas: ['$\\operatorname{span}(I)=\\operatorname{span}(II)\\Rightarrow r(I)=r(II)$'] }
      ],
      theorems: [
        { title: '线性表示定理', text: '向量 $\\beta$ 可由向量组 $\\alpha_1,\\dots,\\alpha_s$ 线性表示，当且仅当加入 $\\beta$ 后向量组的秩不增加。', formulas: ['$\\beta\\in\\operatorname{span}(\\alpha_i)\\iff r(\\alpha_1,\\dots,\\alpha_s,\\beta)=r(\\alpha_1,\\dots,\\alpha_s)$'] }
      ]
    },
    '§4.3': {
      properties: [
        { title: '极大无关组保持生成性', text: '极大线性无关组删除了所有冗余向量，却仍能生成原来的全部向量。因此它是张成空间的一组基。' }
      ],
      theorems: [
        { title: '基向量个数不变', text: '有限维向量空间的任意两组基含有相同数量的向量。这个共同的数就是维数，也是向量组的秩。', formulas: ['$|\\mathcal B_1|=|\\mathcal B_2|=\\dim V$'] }
      ]
    },
    '§4.4': {
      properties: [
        { title: '坐标的唯一性', text: '在固定基下，每个向量的坐标表示唯一。若同一向量有两组坐标，其差会给出基向量的非平凡线性关系，与基线性无关矛盾。' }
      ],
      theorems: [
        { title: '维数决定基的判定', text: '在 $n$ 维空间中，任意 $n$ 个线性无关向量都自动构成一组基；反过来，$n$ 个向量若生成整个空间，也自动线性无关。', formulas: ['$\\dim V=n,\\ |S|=n,\\ S$ 线性无关 $\\Rightarrow S$ 是基'] }
      ]
    },
    '§4.5': {
      properties: [
        { title: '过渡矩阵可逆', text: '两组基之间的过渡矩阵一定可逆，因为新基和旧基都能互相线性表示。其逆矩阵描述相反方向的换基。', formulas: ['$P_{\\text{新}\\leftarrow\\text{旧}}^{-1}=P_{\\text{旧}\\leftarrow\\text{新}}$'] }
      ],
      theorems: [
        { title: '相似变换定理', text: '线性变换在两组基下的矩阵相似。相似矩阵的特征多项式、特征值和可对角化性相同。', formulas: ['$B=P^{-1}AP$'] }
      ]
    },
    '§4.6': {
      properties: [
        { title: '行秩等于列秩', text: '矩阵的行向量组与列向量组的秩相同，这个公共数称为矩阵的秩。它同时控制行空间的维数和列空间的维数。', formulas: ['$r_{\\text{行}}(A)=r_{\\text{列}}(A)$'] }
      ],
      theorems: [
        { title: '基本子空间维数定理', text: '$m\\times n$ 矩阵的列空间维数为 $r$，零空间维数为 $n-r$，行空间维数为 $r$，左零空间维数为 $m-r$。', formulas: ['$\\dim\\ker A=n-r,\\quad \\dim\\ker A^T=m-r$'] }
      ]
    },
    '§4.7': {
      properties: [
        { title: '子空间的交与和', text: '两个子空间的交集仍是子空间，和空间也是子空间。零向量总是属于交集，因此交集永远非空。', formulas: ['$U\\cap W\\le V,\\quad U+W\\le V$'] }
      ],
      theorems: [
        { title: '子空间维数公式', text: '两个子空间的和的维数等于各自维数之和减去交空间维数。当交集为零时，和空间成为直和。', formulas: ['$\\dim(U+W)=\\dim U+\\dim W-\\dim(U\\cap W)$'] }
      ]
    },
    '§4.8': {
      properties: [
        { title: '齐次解空间', text: '齐次方程组 $Ax=0$ 的解集是向量空间，维数为 $n-r(A)$。这个空间也是矩阵的零空间。', formulas: ['$\\ker A\\le\\mathbb R^n$'] }
      ],
      theorems: [
        { title: '非齐次解结构定理', text: '若非齐次方程组有解，则全部解等于一个特解加上齐次方程组的全部解。解集的维数与齐次解空间相同。', formulas: ['$\\operatorname{Sol}(Ax=b)=x_0+\\ker A$'] }
      ]
    },
    '§4.9': {
      properties: [
        { title: '内积的几何性质', text: '内积同时决定长度与夹角。正交的向量满足勾股定理，范数满足三角不等式；这些性质解释了向量空间的几何结构。', formulas: ['$x\\perp y\\Rightarrow\\|x+y\\|^2=\\|x\\|^2+\\|y\\|^2$'] }
      ],
      theorems: [
        { title: 'Cauchy-Schwarz 不等式', text: '任意两个向量的内积绝对值不超过范数乘积，等号成立当且仅当两向量线性相关。', formulas: ['$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$'] }
      ]
    },

    '§5.1': {
      properties: [
        { title: '特征空间维数', text: '固定特征值的特征空间是零空间 $\\ker(\\lambda I-A)$，其维数等于几何重数。' , formulas: ['$E_\\lambda=\\ker(\\lambda I-A)$'] }
      ],
      theorems: [
        { title: '特征多项式次数定理', text: '$n$ 阶矩阵的特征多项式是 $n$ 次多项式，计重数后共有 $n$ 个特征值。特征值之和等于迹，乘积等于行列式。', formulas: ['$\\sum\\lambda_i=\\operatorname{tr}A,\\quad \\prod\\lambda_i=|A|$'] }
      ]
    },
    '§5.2': {
      properties: [
        { title: '多项式作用于特征向量', text: '若 $Ax=\\lambda x$，则任意多项式 $f(A)$ 仍以 $x$ 为特征向量，特征值为 $f(\\lambda)$。这使矩阵幂和高阶递推可以通过特征值计算。', formulas: ['$f(A)x=f(\\lambda)x$'] }
      ],
      theorems: [
        { title: '不同特征值的特征向量线性无关', text: '来自不同特征值的特征向量组必线性无关。因此若矩阵有 $n$ 个互异特征值，它必可对角化。', formulas: ['$\\lambda_i\\ne\\lambda_j\\Rightarrow x_i,x_j$ 线性无关'] }
      ]
    },
    '§5.3': {
      properties: [
        { title: '相似保持特征多项式', text: '相似矩阵具有相同的特征多项式、迹、行列式和秩。特征向量本身会随基变换改变，但特征值集合不变。', formulas: ['$|\\lambda I-P^{-1}AP|=|\\lambda I-A|$'] }
      ],
      theorems: [
        { title: '相似矩阵特征空间同维', text: '若 $B=P^{-1}AP$，则 $A$ 与 $B$ 的每个特征值对应的特征空间维数相同。因此几何重数是相似不变量。', formulas: ['$\\dim\\ker(\\lambda I-A)=\\dim\\ker(\\lambda I-B)$'] }
      ]
    },
    '§5.4': {
      properties: [
        { title: '代数重数与几何重数', text: '每个特征值的几何重数不超过代数重数。矩阵可对角化当且仅当每个特征空间的维数都达到其代数重数。', formulas: ['$1\\le\\dim E_\\lambda\\le m_\\lambda$'] }
      ],
      theorems: [
        { title: '可对角化判定定理', text: '$n$ 阶矩阵可对角化，当且仅当它有 $n$ 个线性无关的特征向量；这等价于所有特征值的几何重数之和为 $n$。', formulas: ['$\\sum_\\lambda\\dim E_\\lambda=n$'] }
      ]
    },
    '§5.5': {
      properties: [
        { title: '实对称矩阵特征值实数', text: '实对称矩阵的特征值全为实数，且不同特征值对应的特征向量正交。它没有普通实矩阵中常见的复特征值问题。', formulas: ['$A=A^T\\Rightarrow\\lambda\\in\\mathbb R$'] }
      ],
      theorems: [
        { title: '实对称谱定理', text: '实对称矩阵可以正交对角化：存在正交矩阵 $Q$ 和对角矩阵 $\\Lambda$，使 $Q^TAQ=\\Lambda$。', formulas: ['$A=Q\\Lambda Q^T,\\quad Q^TQ=I$'] }
      ]
    },

    '§6.1': {
      properties: [
        { title: '二次型矩阵唯一性', text: '每个二次型都可以唯一表示成 $x^TAx$，其中 $A$ 为实对称矩阵。唯一性要求把交叉项系数平均分配给两个对称位置。', formulas: ['$a_{ij}=a_{ji}=\\dfrac12 c_{ij}$'] }
      ],
      theorems: [
        { title: '惯性指数不变量', text: '可逆变量替换不改变二次型的正平方项数、负平方项数和零平方项数。因此正负惯性指数是二次型的合同不变量。', formulas: ['$(p,q,r)$ 在合同下不变，且 $p+q+r=n$'] }
      ]
    },
    '§6.2': {
      properties: [
        { title: '合同保持对称性', text: '若 $A$ 对称且 $C$ 可逆，则 $C^TAC$ 仍对称。合同变换保持二次型的对称矩阵结构。', formulas: ['$(C^TAC)^T=C^TA^TC=C^TAC$'] }
      ],
      theorems: [
        { title: '合同与惯性定理', text: '两个实对称矩阵合同，当且仅当它们的正惯性指数和负惯性指数相同。秩相同但符号不同的矩阵可能不合同。', formulas: ['$A\\simeq B\\iff(p_A,q_A)=(p_B,q_B)$'] }
      ]
    },
    '§6.3': {
      properties: [
        { title: '规范形唯一', text: '二次型经合同变换可化为规范形 $y_1^2+\\cdots+y_p^2-y_{p+1}^2-\\cdots-y_{p+q}^2$。标准形不唯一，但正负项数唯一。', formulas: ['$Q\\simeq y_1^2+\\cdots+y_p^2-y_{p+1}^2-\\cdots-y_{p+q}^2$'] }
      ],
      theorems: [
        { title: 'Sylvester 惯性定理', text: '任意实二次型都可通过可逆线性替换化为规范形，且正、负惯性指数与替换方式无关。', formulas: ['$p=\\#\\{\\lambda_i>0\\},\\quad q=\\#\\{\\lambda_i<0\\}$'] }
      ]
    },
    '§6.4': {
      properties: [
        { title: '正交替换保长度', text: '正交变量替换 $x=Qy$ 保持 $\\|x\\|=\\|y\\|$，因此不改变二次型的几何尺度，只旋转或反射坐标系。', formulas: ['$\\|Qy\\|=\\|y\\|$'] }
      ],
      theorems: [
        { title: '正交标准形定理', text: '实二次型可通过正交替换化为特征值加权平方和。平方项的系数就是对称矩阵的特征值。', formulas: ['$Q^TAQ=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$'] }
      ]
    },
    '§6.5': {
      properties: [
        { title: '正定矩阵可逆', text: '正定矩阵的特征值全为正，因此行列式大于零，矩阵可逆。正定性还意味着对应的二次型只在零向量处取零。', formulas: ['$A\\succ0\\Rightarrow|A|>0$'] }
      ],
      theorems: [
        { title: '顺序主子式判据', text: '实对称矩阵正定，当且仅当其所有顺序主子式都大于零。这个判据无需计算特征值，适合判断参数范围。', formulas: ['$A\\succ0\\iff D_k>0\\ (k=1,\\dots,n)$'] }
      ]
    },

    '§7.1': {
      properties: [
        { title: '数乘零元', text: '任意数乘零向量仍为零向量，零数乘任意向量也为零向量。零元与数乘的相容性是线性空间公理的一部分。' , formulas: ['$k0=0,\\quad 0\\alpha=0$'] }
      ],
      theorems: [
        { title: '零元与负元唯一性', text: '线性空间的零元唯一，任意向量的负元也唯一。若两个向量都满足零元性质，则它们相等。', formulas: ['$0_1=0_1+0_2=0_2$'] }
      ]
    },
    '§7.2': {
      properties: [
        { title: '子空间继承公理', text: '子空间只需检查非空与线性组合封闭，其余加法、数乘公理由母空间自动继承。零元由数乘 $0\\alpha$ 得到。', formulas: ['$W\\le V\\iff kx+ly\\in W\\ (\\forall x,y\\in W)$'] }
      ],
      theorems: [
        { title: '子空间判定定理', text: '线性空间的非空子集是子空间，当且仅当它对加法与数乘均封闭。两条封闭性也可合并为对任意线性组合封闭。' }
      ]
    },
    '§7.3': {
      properties: [
        { title: '线性无关的子组性质', text: '线性无关向量组的任意非空子组仍线性无关；线性相关向量组加入更多向量后仍线性相关。', formulas: ['$S$ 无关 $\\Rightarrow$ 任意子集无关'] }
      ],
      theorems: [
        { title: '替换定理', text: '若向量组 $\\beta$ 可由无关组 $\\alpha$ 线性表示，则 $\\beta$ 的向量个数不超过 $\\alpha$ 的个数。它是基的基数不变性的核心证明工具。' }
      ]
    },
    '§7.4': {
      properties: [
        { title: '表示关系保持张成', text: '若 $\\beta$ 可由 $\\alpha$ 组表示，则张成空间满足包含关系；若两组互相表示，则张成空间相同。', formulas: ['$\\beta_i\\in\\operatorname{span}(\\alpha)\\Rightarrow\\operatorname{span}(\\beta)\\subseteq\\operatorname{span}(\\alpha)$'] }
      ],
      theorems: [
        { title: '等价组同秩定理', text: '两个向量组等价时，它们的秩相等，但秩相等不保证两组等价。等价的核心是张成空间相同。' }
      ]
    },
    '§7.5': {
      properties: [
        { title: '极大无关组的压缩性', text: '极大无关组包含原生成空间最少的必需信息。删除任何一个向量都会缩小张成空间，加入原组中任何其他向量都会变成相关组。' }
      ],
      theorems: [
        { title: 'Steinitz 替换定理', text: '在 $n$ 维空间中，任意 $n$ 个线性无关向量可以替换任意一组基中的某个向量并继续生成整个空间。它说明独立方向可以逐步替换生成方向。' }
      ]
    },
    '§7.6': {
      properties: [
        { title: '维数不依赖基', text: '有限维空间的维数由空间本身决定，不依赖所选择的基。换基只改变坐标，不改变维数。' }
      ],
      theorems: [
        { title: '维数比较定理', text: '若 $W\\le V$ 且 $\\dim W=\\dim V<\\infty$，则 $W=V$。这常用于只需证明子空间维数等于母空间维数。', formulas: ['$W\\le V,\\ \\dim W=\\dim V\\Rightarrow W=V$'] }
      ]
    },
    '§7.7': {
      properties: [
        { title: '过渡矩阵的列含义', text: '过渡矩阵的第 $j$ 列是新基第 $j$ 个向量在旧基下的坐标。矩阵的列序必须与基向量顺序对应。' }
      ],
      theorems: [
        { title: '坐标变换定理', text: '若 $P$ 是从旧基到新基的过渡矩阵，则旧坐标 $x$ 与新坐标 $y$ 满足 $x=Py$，等价地 $y=P^{-1}x$。', formulas: ['$x=Py,\\quad y=P^{-1}x$'] }
      ]
    },
    '§7.8': {
      properties: [
        { title: '直和分解唯一性', text: '直和 $U\\oplus W$ 中每个向量都能唯一写成 $u+w$。这种唯一分解使投影和坐标运算可以分开处理。', formulas: ['$v=u+w$ 的分解唯一'] }
      ],
      theorems: [
        { title: '直和判定定理', text: '两个子空间的和是直和，当且仅当交集为零，等价于和的维数等于两者维数之和。', formulas: ['$U\\oplus W\\iff U\\cap W=\\{0\\}\\iff\\dim(U+W)=\\dim U+\\dim W$'] }
      ]
    },
    '§7.9': {
      properties: [
        { title: '交维数的补偿作用', text: '交空间越大，和空间越小。两个子空间的并集通常不是子空间，但它们的交与和都是子空间。' }
      ],
      theorems: [
        { title: '子空间维数公式', text: '有限维子空间 $U,W$ 的和的维数等于两者维数之和减去交的维数。该公式也可用来确定交的维数。', formulas: ['$\\dim(U+W)=\\dim U+\\dim W-\\dim(U\\cap W)$'] }
      ]
    },

    '§8.1': {
      properties: [
        { title: '范数的非负性与齐次性', text: '范数始终非负，只有零向量的范数为零；数乘向量的范数等于数绝对值乘向量范数。', formulas: ['$\\|kx\\|=|k|\\|x\\|$'] }
      ],
      theorems: [
        { title: 'Cauchy-Schwarz 不等式', text: '内积绝对值不超过两向量范数之积，等号成立当且仅当两向量线性相关。', formulas: ['$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$'] }
      ]
    },
    '§8.2': {
      properties: [
        { title: '标准正交基坐标公式', text: '在标准正交基下，向量的第 $i$ 个坐标就是它与第 $i$ 个基向量的内积。不需要再解线性方程组。', formulas: ['$x=\\sum_i\\langle x,e_i\\rangle e_i$'] }
      ],
      theorems: [
        { title: 'Gram-Schmidt 定理', text: '任意线性无关向量组都可以化为标准正交向量组；两者张成同一个子空间。', formulas: ['$\\beta_k=\\alpha_k-\\sum_{j<k}\\dfrac{\\langle\\alpha_k,\\beta_j\\rangle}{\\langle\\beta_j,\\beta_j\\rangle}\\beta_j$'] },
        { title: '正交分解定理', text: '对任意子空间 $U$，空间可分解为 $U\\oplus U^\\perp$。向量在 $U$ 上的投影就是其正交分解中的 $U$ 分量。', formulas: ['$V=U\\oplus U^\\perp$'] }
      ]
    },

    '§9.1': {
      properties: [
        { title: '核与像均为子空间', text: '线性映射的核是定义域的子空间，像是陪域的子空间。它们分别描述被压成零的部分和实际输出的方向。', formulas: ['$\\ker T\\le V,\\quad\\operatorname{Im}T\\le W$'] }
      ],
      theorems: [
        { title: '单射判定定理', text: '线性映射 $T$ 单射，当且仅当 $\\ker T=\\{0\\}$。因此只需解齐次方程判断是否有一对不同的输入映到同一输出。' }
      ]
    },
    '§9.2': {
      properties: [
        { title: '复合运算的结合律', text: '映射复合满足结合律，但一般不满足交换律。矩阵乘法不可交换正是复合顺序不可交换的代数表现。', formulas: ['$(RS)T=R(ST)$，但 $ST\\ne TS$ 一般成立'] }
      ],
      theorems: [
        { title: '复合映射矩阵定理', text: '若 $T,S$ 的矩阵分别为 $A,B$，则复合 $ST$ 的矩阵为 $BA$。从左乘矩阵的顺序与映射复合顺序一致。', formulas: ['$[ST]=[S][T]$'] }
      ]
    },
    '§9.3': {
      properties: [
        { title: '秩与零化度互补', text: '定义域维数被核维数与像维数完全分割。秩越大，丢失的维度越少；零化度越大，映射压缩的信息越多。', formulas: ['$\\operatorname{nullity}(T)+\\operatorname{rank}(T)=\\dim V$'] }
      ],
      theorems: [
        { title: '维数定理', text: '对任意有限维线性映射 $T:V\\to W$，核的维数与像的维数之和等于定义域维数。它是矩阵秩-零化度公式的映射版本。', formulas: ['$\\dim\\ker T+\\dim\\operatorname{Im}T=\\dim V$'] }
      ]
    },
    '§9.4': {
      properties: [
        { title: '矩阵的列与基像', text: '线性映射矩阵的每一列是定义域基向量在陪域基下的坐标。列数等于定义域维数，行数等于陪域维数。' }
      ],
      theorems: [
        { title: '换基相似定理', text: '同一线性变换在两组基下的矩阵相似。不同空间之间的线性映射换基时，矩阵按相抵关系变化。', formulas: ['$B=P^{-1}AP$'] }
      ]
    },
    '§9.5': {
      properties: [
        { title: '线性变换保持线性关系', text: '线性变换把线性组合映为像的线性组合。因此它保持向量组的张成结构，但不一定保持线性无关性。', formulas: ['$T(\\sum c_i\\alpha_i)=\\sum c_iT(\\alpha_i)$'] }
      ],
      theorems: [
        { title: '可对角化判定定理', text: '线性变换可对角化，当且仅当空间存在由特征向量组成的基。此时变换在该基下的矩阵为对角矩阵。', formulas: ['$T(x_i)=\\lambda_i x_i,\\quad P=(x_1,\\dots,x_n)$'] }
      ]
    }
  };
})();
