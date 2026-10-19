const BANK = {
  "problems": [
    {
      "id": "2025-QZ-03",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第3题",
      "chapter": "第一章 函数与极限",
      "section": "§1.1 函数与初等函数",
      "statement": "函数 $f(x)=\\arcsin(\\sin x)+\\arccos(\\cos x)$ 在 $[0,\\pi]$ 上的表达式为（　）。\\nA. $f(x)=\\pi$　B. $f(x)=2\\pi$　C. $f(x)=2x\\ (0\\le x\\le\\pi/2),\\ \\pi-x\\ (\\pi/2<x\\le\\pi)$　D. $f(x)=2x\\ (0\\le x\\le\\pi/2),\\ \\pi\\ (\\pi/2<x\\le\\pi)$。",
      "type": "单选题",
      "topics": [
        "反三角函数",
        "分段函数",
        "arcsin(sin x)",
        "arccos(cos x)"
      ],
      "difficulty": 3,
      "tags": [
        "2025小测",
        "反三角",
        "分段",
        "单选"
      ],
      "right_answer": "D",
      "key_points": [
        "$\\arcsin(\\sin x)=x$（$0\\le x\\le\\pi/2$），等于 $\\pi-x$（$\\pi/2<x\\le\\pi$）",
        "$\\arccos(\\cos x)=x$（$0\\le x\\le\\pi$）"
      ],
      "solutions": [
        {
          "name": "分段讨论",
          "steps": [
            "当 $0\\le x\\le\\pi/2$ 时，$\\arcsin(\\sin x)=x$，$\\arccos(\\cos x)=x$，所以 $f(x)=2x$。",
            "当 $\\pi/2<x\\le\\pi$ 时，$\\arcsin(\\sin x)=\\pi-x$，$\\arccos(\\cos x)=x$，所以 $f(x)=\\pi$。",
            "对应选项 D。"
          ]
        }
      ],
      "pitfalls": [
        "在 $[0,\\pi]$ 上错误地使用 $\\arcsin(\\sin x)=x$",
        "把 $\\arccos(\\cos x)$ 在 $[0,\\pi]$ 上也分段。"
      ],
      "related": [
        "§1.1 反三角函数"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "2025-QZ-07",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第7题",
      "chapter": "第一章 函数与极限",
      "section": "§1.1 函数与初等函数",
      "statement": "设 $f(x)$ 和 $g(x)$ 均为定义在 $\\mathbb R$ 上的函数，则下列陈述错误的是（不定项）\\nA. 若 $f$ 是周期函数，则 $g(f(x))$ 是周期函数；\\nB. 若 $f,g$ 都是周期函数，则 $f+g$ 是周期函数；\\nC. 若 $f,g$ 都是奇函数，则 $f(g(x))$ 是偶函数；\\nD. 若 $f,g$ 都单调递减，则 $f(x)g(x)$ 单调递增。",
      "type": "多项选择题",
      "topics": [
        "周期函数",
        "奇偶函数",
        "单调性",
        "函数复合"
      ],
      "difficulty": 3,
      "tags": [
        "2025小测",
        "不定项",
        "函数性质",
        "反例"
      ],
      "right_answer": "B、C、D",
      "key_points": [
        "周期函数的复合仍以原周期为周期",
        "两个周期函数的周期不一定可比",
        "奇函数复合仍是奇函数",
        "递减函数乘积单调性不固定"
      ],
      "solutions": [
        {
          "name": "逐项判定",
          "steps": [
            "A 正确：若 $f(x+T)=f(x)$，则 $g(f(x+T))=g(f(x))$。",
            "B 错误：$\\sin x+\\sin(\\pi x)$ 不是周期函数。",
            "C 错误：$f(g(-x))=f(-g(x))=-f(g(x))$，所以是奇函数。",
            "D 错误：取 $f(x)=g(x)=-x$，二者递减，但乘积 $x^2$ 在 $\\mathbb R$ 上不单调递增。",
            "错误项为 B、C、D。"
          ]
        }
      ],
      "pitfalls": [
        "把两个奇函数的复合误认为偶函数",
        "忽略乘积函数中符号变化对单调性的影响",
        "认为任意两个周期函数的和仍具有共同周期。"
      ],
      "related": [
        "§1.1 函数性质"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "经典-01",
      "source": "第一章经典难题（递推数列）",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "设 $x_1=1$，$x_{n+1}=x_n+\\dfrac{1}{x_n}$（$n=1,2,\\cdots$）。(1) 证明 $\\lim\\limits_{n\\to\\infty}x_n=+\\infty$；(2) 求 $\\lim\\limits_{n\\to\\infty}\\dfrac{x_n}{\\sqrt{2n}}$。",
      "type": "证明题 + 计算题",
      "topics": [
        "单调有界准则",
        "反证法排除有界",
        "平方后构造可累加的递推式",
        "夹逼定理",
        "初等裂项 $\\frac1k\\le 2(\\sqrt k-\\sqrt{k-1})$"
      ],
      "difficulty": 5,
      "tags": [
        "经典难题",
        "递推数列",
        "四工具串联",
        "题眼：先平方"
      ],
      "key_points": [
        "第(1)问的坑：**单调递增 ≠ 发散**（$1-\\frac1n$ 就递增但有界），必须反设**有界**、用单调有界准则导出 $L=L+\\frac1L$ 的矛盾",
        "第(2)问的题眼：递推式里 $x_{n+1}$ 与 $x_n$ 不是线性关系，**直接累加不了**；先**平方**才出现可累加的常数项 $+2$",
        "夹逼 $\\sum\\frac{1}{x_k^2}$ 时用初等裂项 $\\frac1k\\le 2(\\sqrt k-\\sqrt{k-1})$，避免引用对数不等式（防超纲）",
        "最后开方要说明 $x_n>0$ 且 $\\sqrt{\\ }$ 连续（极限符号可与它交换）"
      ],
      "solutions": [
        {
          "name": "(1) 单调 + 反证有界",
          "steps": [
            "由 $x_1=1>0$ 与递推式归纳得 $x_n>0$，故 $x_{n+1}-x_n=\\dfrac{1}{x_n}>0$，$\\{x_n\\}$ 严格递增。",
            "反设 $\\{x_n\\}$ 有界。由单调有界准则存在有限极限 $L$。",
            "在 $x_{n+1}=x_n+\\dfrac1{x_n}$ 两端令 $n\\to\\infty$（两端极限均存在，可用四则运算）得 $L=L+\\dfrac1L$，即 $\\dfrac1L=0$，与 $L\\ge1>0$ 矛盾。",
            "故 $\\{x_n\\}$ 无界；又单调递增，所以 $x_n\\to+\\infty$。"
          ]
        },
        {
          "name": "(2) 平方累加 + 夹逼",
          "steps": [
            "平方：$x_{n+1}^2=x_n^2+2+\\dfrac{1}{x_n^2}$。",
            "累加（$k=1$ 到 $n-1$）得 $x_n^2=x_1^2+2(n-1)+\\sum\\limits_{k=1}^{n-1}\\dfrac{1}{x_k^2}=2n-1+\\sum\\limits_{k=1}^{n-1}\\dfrac{1}{x_k^2}$。",
            "下界：$\\dfrac{x_n^2}{2n}>\\dfrac{2n-1}{2n}=1-\\dfrac{1}{2n}$。",
            "上界：由 $x_k^2>2k-1\\ge k$ 得 $\\dfrac{1}{x_k^2}\\le\\dfrac1k$；又 $\\dfrac1k\\le2(\\sqrt k-\\sqrt{k-1})$，裂项相消得 $\\sum\\limits_{k=1}^{n-1}\\dfrac1k\\le2\\sqrt{n-1}$。",
            "故 $1-\\dfrac{1}{2n}<\\dfrac{x_n^2}{2n}\\le1-\\dfrac{1}{2n}+\\dfrac{\\sqrt{n-1}}{n}$，两端都 $\\to1$，由夹逼定理 $\\dfrac{x_n^2}{2n}\\to1$。",
            "由 $x_n>0$ 及 $\\sqrt{\\ }$ 连续，开方得 $\\dfrac{x_n}{\\sqrt{2n}}\\to1$。"
          ]
        }
      ],
      "pitfalls": [
        "第(1)问直接说「单调递增所以趋于 $+\\infty$」——递增不一定发散，必须反证排除有界",
        "第(2)问对 $x_{n+1}=x_n+\\frac1{x_n}$ 直接累加——它不是线性关系，累加不出简单式子",
        "用 $\\sum\\frac1k\\le1+\\ln n$ 估计——需要对数不等式，本章未必已证（易错点 E-006），本题的裂项法纯初等更稳",
        "开方时不说明 $x_n>0$ 与 $\\sqrt{\\ }$ 连续"
      ],
      "related": [
        "题库易错点 E-006（不能引用未证结论）",
        "题库知识点「10.14」九、题型三（取整夹逼）",
        "小测 Q9"
      ],
      "added": "2026-10-16",
      "right_answer": "故 $\\{x_n\\}$ 无界；又单调递增，所以 $x_n\\to+\\infty$。；由 $x_n>0$ 及 $\\sqrt{\\ }$ 连续，开方得 $\\dfrac{x_n}{\\sqrt{2n}}\\to1$。"
    },
    {
      "id": "经典-02",
      "source": "第一章经典难题（夹逼求最大）",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "设 $a_1,a_2,\\cdots,a_m$ 均为正数，求 $\\lim\\limits_{n\\to\\infty}\\left(\\dfrac{a_1^n+a_2^n+\\cdots+a_m^n}{m}\\right)^{\\frac1n}$。",
      "type": "计算题",
      "topics": [
        "夹逼定理",
        "最大项主导",
        "$m^{1/n}\\to1$"
      ],
      "difficulty": 5,
      "tags": [
        "经典难题",
        "题眼：只留最大项",
        "三行解决"
      ],
      "key_points": [
        "题眼：**别管那些较小的项，最大的那一项主导一切**，只用 $M=\\max\\{a_i\\}$ 就能同时卡住上下界",
        "上界：$a_i\\le M\\Rightarrow\\sum a_i^n\\le mM^n\\Rightarrow$ 原式 $\\le M$",
        "下界：$\\sum a_i^n\\ge M^n\\Rightarrow$ 原式 $\\ge\\dfrac{M}{m^{1/n}}$",
        "$m$ 固定，$m^{1/n}=e^{\\frac{\\ln m}{n}}\\to e^0=1$（用 $e^x$ 连续），故左端 $\\to M$"
      ],
      "solutions": [
        {
          "name": "双侧夹逼",
          "steps": [
            "记 $M=\\max\\{a_1,\\cdots,a_m\\}$。",
            "上界：每个 $a_i\\le M$，故 $a_1^n+\\cdots+a_m^n\\le mM^n$，于是 $\\left(\\dfrac{\\sum a_i^n}{m}\\right)^{1/n}\\le M$。",
            "下界：$\\sum a_i^n\\ge M^n$，故 $\\left(\\dfrac{\\sum a_i^n}{m}\\right)^{1/n}\\ge\\left(\\dfrac{M^n}{m}\\right)^{1/n}=\\dfrac{M}{m^{1/n}}$。",
            "合起来 $\\dfrac{M}{m^{1/n}}\\le\\left(\\dfrac{\\sum a_i^n}{m}\\right)^{1/n}\\le M$。",
            "由 $m^{1/n}\\to1$ 得左端 $\\to M$，由夹逼定理极限为 $M$。"
          ]
        }
      ],
      "pitfalls": [
        "以为 $(a_1^n+\\cdots+a_m^n)^{1/n}=a_1+\\cdots+a_m$——幂不能这样分配",
        "误当 $1^\\infty$ 型套推广式——这里底数趋于 $\\frac{M^n+\\cdots}{m}$（发散），不是趋于 1",
        "忘记交代 $m^{1/n}\\to1$ 的理由"
      ],
      "related": [
        "题库题目 1-综.3(2)（$x\\to0$ 取几何平均，可作对照）",
        "§2.3 夹逼定理",
        "小测 Q10"
      ],
      "added": "2026-10-16",
      "right_answer": "由 $m^{1/n}\\to1$ 得左端 $\\to M$，由夹逼定理极限为 $M$。"
    },
    {
      "id": "经典-03",
      "source": "第一章经典难题（$\\sqrt[n]{n}\\to1$）",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "求 $\\lim\\limits_{n\\to\\infty}\\sqrt[n]{n}$。",
      "type": "计算题",
      "topics": [
        "二项式定理放缩",
        "夹逼定理",
        "均值不等式"
      ],
      "difficulty": 4,
      "tags": [
        "经典难题",
        "题眼：二项式留二次项"
      ],
      "key_points": [
        "题眼：把 $\\sqrt[n]{n}$ 写成 $1+t_n$（$t_n\\ge0$），则 $n=(1+t_n)^n$；**二项式展开只留能压住 $t_n$ 的那一项**",
        "留 $C_n^1t_n$ 只能得 $t_n\\le1$（不够）；**留 $C_n^2t_n^2$** 得 $n\\ge\\dfrac{n(n-1)}{2}t_n^2$，即 $t_n^2\\le\\dfrac{2}{n-1}$",
        "于是 $0\\le t_n\\le\\sqrt{\\dfrac{2}{n-1}}\\to0$，由夹逼定理 $t_n\\to0$"
      ],
      "solutions": [
        {
          "name": "二项式放缩 + 夹逼",
          "steps": [
            "$n\\ge1$ 时 $\\sqrt[n]{n}\\ge1$，记 $t_n=\\sqrt[n]{n}-1\\ge0$，则 $n=(1+t_n)^n$。",
            "由二项式定理（$n\\ge2$）：$n=(1+t_n)^n=\\sum\\limits_{k=0}^{n}C_n^kt_n^k\\ge C_n^2t_n^2=\\dfrac{n(n-1)}{2}t_n^2$。",
            "两边除以 $\\dfrac{n(n-1)}{2}$ 得 $t_n^2\\le\\dfrac{2}{n-1}$。",
            "所以 $0\\le t_n\\le\\sqrt{\\dfrac{2}{n-1}}\\to0$，由夹逼定理 $t_n\\to0$。",
            "故 $\\sqrt[n]{n}=1+t_n\\to1$。"
          ]
        }
      ],
      "pitfalls": [
        "用 $\\sqrt[n]{n}=e^{\\frac{\\ln n}{n}}$ 后直接说 $\\frac{\\ln n}{n}\\to0$——**这本身就是要证的结论**，属循环论证（除非书上已有 $\\lim\\frac{n^k}{a^n}=0$ 类结论）",
        "二项式只留 $t_n$ 那一项，得到 $t_n\\le1$，证不出趋于 0",
        "忘记说明 $t_n\\ge0$"
      ],
      "related": [
        "题库题目 经典-01（同样用放缩 + 夹逼）",
        "题库易错点 E-006",
        "小测 Q11"
      ],
      "added": "2026-10-16",
      "right_answer": "故 $\\sqrt[n]{n}=1+t_n\\to1$。"
    },
    {
      "id": "经典-04",
      "source": "第一章经典难题（Wallis 型）",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "求 $\\lim\\limits_{n\\to\\infty}\\dfrac{1\\cdot3\\cdot5\\cdots(2n-1)}{2\\cdot4\\cdot6\\cdots(2n)}$。",
      "type": "计算题",
      "topics": [
        "平方构造",
        "夹逼定理",
        "项数配平"
      ],
      "difficulty": 4,
      "tags": [
        "经典难题",
        "题眼：先平方",
        "Wallis"
      ],
      "key_points": [
        "题眼：直接放缩只能得「$\\le1$」，证不出 0；必须**平方**，让每个因子变成 $\\dfrac{4k^2-1}{4k^2}<1$ 的形式",
        "平方时**分子每个 $(2k-1)^2$ 要换成 $(2k-1)(2k+1)$**，多出来的因子最后用 $\\dfrac{1}{2n+1}$ 配平项数",
        "结果：$0<P_n^2<\\dfrac{1}{2n+1}$，开方得 $0<P_n<\\dfrac{1}{\\sqrt{2n+1}}\\to0$"
      ],
      "solutions": [
        {
          "name": "平方 + 因子配对 + 夹逼",
          "steps": [
            "记 $P_n=\\dfrac{1\\cdot3\\cdots(2n-1)}{2\\cdot4\\cdots(2n)}>0$。",
            "平方并配平项数：$P_n^2=\\dfrac{1\\cdot3}{2^2}\\cdot\\dfrac{3\\cdot5}{4^2}\\cdots\\dfrac{(2n-1)(2n+1)}{(2n)^2}\\cdot\\dfrac{1}{2n+1}$。",
            "每个因子 $\\dfrac{(2k-1)(2k+1)}{(2k)^2}=\\dfrac{4k^2-1}{4k^2}<1$，故 $0<P_n^2<\\dfrac{1}{2n+1}$。",
            "开方得 $0<P_n<\\dfrac{1}{\\sqrt{2n+1}}$，右端 $\\to0$，由夹逼定理 $P_n\\to0$。"
          ]
        }
      ],
      "pitfalls": [
        "只写 $P_n<\\dfrac{2n-1}{2n}\\to1$——这只说明 $P_n\\le1$，**证不出极限为 0**",
        "平方后忘记配平项数（分子多出一个 $(2n+1)$，必须乘回 $\\dfrac{1}{2n+1}$）",
        "忘记说明 $P_n>0$ 才能开方取正"
      ],
      "related": [
        "题库题目 经典-03（同为放缩 + 夹逼）",
        "§2.3 夹逼定理",
        "小测 Q12"
      ],
      "added": "2026-10-16",
      "right_answer": "开方得 $0<P_n<\\dfrac{1}{\\sqrt{2n+1}}$，右端 $\\to0$，由夹逼定理 $P_n\\to0$。"
    },
    {
      "id": "2025-MT-01",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第1题",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "利用 $\\varepsilon-N$ 定义证明：若数列 $\\{a_n^3\\}$ 收敛，则 $\\{a_n\\}$ 必收敛。",
      "type": "证明题",
      "topics": [
        "数列极限的 ε-N 定义",
        "立方差因式分解",
        "极限与连续函数"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "ε-N",
        "立方差",
        "证明题"
      ],
      "key_points": [
        "设 $a_n^3\\to A$，则 $A\\ge0$，目标极限为 $\\sqrt[3]{A}$",
        "分 $A>0$ 与 $A=0$ 两种情况处理",
        "利用 $a^3-b^3=(a-b)(a^2+ab+b^2)$ 控制差"
      ],
      "solutions": [
        {
          "name": "ε-N 证明",
          "steps": [
            "设 $a_n^3\\to A$，记 $b=\\sqrt[3]{A}\\ge0$。",
            "若 $A=0$，对任意 $\\varepsilon>0$，取 $N$ 使 $n>N$ 时 $|a_n^3|<\\varepsilon^3$，于是 $|a_n|<\\varepsilon$。",
            "若 $A>0$，则 $b>0$，且当 $n$ 足够大时 $a_n^3>A/2>0$，从而 $a_n>0$。",
            "由 $a_n^3-b^3=(a_n-b)(a_n^2+a_nb+b^2)$，有 $|a_n-b|=\\dfrac{|a_n^3-b^3|}{a_n^2+a_nb+b^2}\\le\\dfrac{|a_n^3-A|}{b^2}$。",
            "对任意 $\\varepsilon>0$，取 $N$ 使 $n>N$ 时 $|a_n^3-A|<b^2\\varepsilon$，则 $|a_n-b|<\\varepsilon$。",
            "故 $a_n\\to b=\\sqrt[3]{A}$，即 $\\{a_n\\}$ 收敛。"
          ]
        }
      ],
      "pitfalls": [
        "只证明“有界”而没有回到 $\\varepsilon-N$ 定义",
        "$A=0$ 时错误地把立方根写成负数或忽略符号",
        "把立方差公式写成平方差公式。"
      ],
      "related": [
        "§2.3 数列极限存在的准则",
        "§4.1 连续函数的性质"
      ],
      "added": "2026-10-19",
      "right_answer": "故 $a_n\\to b=\\sqrt[3]{A}$，即 $\\{a_n\\}$ 收敛。"
    },
    {
      "id": "2025-MT-02",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第2题",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "利用夹逼定理求极限：$\\displaystyle\\lim_{n\\to\\infty}\\dfrac{(2n-1)!!}{(2n)!!}$。其中奇数双阶乘 $(2n-1)!!=1\\cdot3\\cdots(2n-1)$，偶数双阶乘 $(2n)!!=2\\cdot4\\cdots(2n)$。",
      "type": "计算题",
      "topics": [
        "夹逼定理",
        "双阶乘",
        "平方构造",
        " Telescoping 不等式"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "夹逼定理",
        "双阶乘",
        "必刷"
      ],
      "key_points": [
        "记 $P_n=\\frac{(2n-1)!!}{(2n)!!}$，显然 $P_n>0$",
        "利用 $\\left(\\frac{2k-1}{2k}\\right)^2<\\frac{2k-1}{2k+1}$",
        "乘起来后右侧望远镜相消，得到 $P_n^2<\\frac1{2n+1}$"
      ],
      "solutions": [
        {
          "name": "平方 + 夹逼",
          "steps": [
            "记 $P_n=\\prod_{k=1}^n\\frac{2k-1}{2k}>0$。",
            "因为 $\\left(\\frac{2k-1}{2k}\\right)^2<\\frac{2k-1}{2k+1}$，所以 $P_n^2<\\prod_{k=1}^n\\frac{2k-1}{2k+1}$。",
            "右侧望远镜相消：$\\prod_{k=1}^n\\frac{2k-1}{2k+1}=\\frac1{2n+1}$。",
            "于是 $0<P_n<\\frac1{\\sqrt{2n+1}}$，右端趋于 $0$，由夹逼定理得极限为 $0$。"
          ]
        }
      ],
      "pitfalls": [
        "把双阶乘当成普通阶乘的平方",
        "平方后忘记配平多出来的 $(2n+1)$",
        "只给出下界 $0$，没有能收敛到同一值的上界。"
      ],
      "related": [
        "§2.3 夹逼定理",
        "题库经典-04 Wallis 型"
      ],
      "added": "2026-10-19",
      "right_answer": "于是 $0<P_n<\\frac1{\\sqrt{2n+1}}$，右端趋于 $0$，由夹逼定理得极限为 $0$。"
    },
    {
      "id": "2025-MT-09",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第9题",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "设 $a_n=1+\\dfrac1{3^2}+\\dfrac1{5^2}+\\cdots+\\dfrac1{(2n-1)^2}$，分别用单调有界定理、柯西收敛准则两种方法证明：数列 $\\{a_n\\}$ 收敛。",
      "type": "证明题",
      "topics": [
        "单调有界定理",
        "柯西收敛准则",
        "裂项放缩"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "单调有界",
        "柯西准则",
        "裂项"
      ],
      "key_points": [
        "$a_n$ 显然单调递增",
        "$\\frac1{(2k-1)^2}\\le\\frac1{4k(k-1)}$（$k\\ge2$）可裂项",
        "柯西差 $a_m-a_n$ 的上界趋于 $0$"
      ],
      "solutions": [
        {
          "name": "方法一：单调有界",
          "steps": [
            "由于每项为正，$a_{n+1}-a_n=\\frac1{(2n+1)^2}>0$，所以 $\\{a_n\\}$ 单调递增。",
            "当 $k\\ge2$ 时，$\\frac1{(2k-1)^2}\\le\\frac1{4k(k-1)}=\\frac14\\left(\\frac1{k-1}-\\frac1k\\right)$。",
            "于是 $a_n\\le1+\\frac14\\sum_{k=2}^n\\left(\\frac1{k-1}-\\frac1k\\right)<\\frac54$。",
            "数列单调递增且有上界，由单调有界定理收敛。"
          ]
        },
        {
          "name": "方法二：柯西准则",
          "steps": [
            "对 $m>n$，$0<a_m-a_n=\\sum_{k=n+1}^m\\frac1{(2k-1)^2}$。",
            "用同样的裂项估计，$a_m-a_n\\le\\frac14\\sum_{k=n+1}^m\\left(\\frac1{k-1}-\\frac1k\\right)=\\frac14\\left(\\frac1n-\\frac1m\\right)<\\frac1{4n}$。",
            "对任意 $\\varepsilon>0$，取 $N>\\frac1{4\\varepsilon}$，当 $m>n>N$ 时 $|a_m-a_n|<\\varepsilon$。由柯西收敛准则，数列收敛。"
          ]
        }
      ],
      "pitfalls": [
        "只证明单调，没有给出上界",
        "放缩成调和级数后失去收敛性",
        "柯西准则中把 $m>n$ 错写成 $m<n$。"
      ],
      "related": [
        "§2.3 数列极限存在准则"
      ],
      "added": "2026-10-19",
      "right_answer": "对任意 $\\varepsilon>0$，取 $N>\\frac1{4\\varepsilon}$，当 $m>n>N$ 时 $|a_m-a_n|<\\varepsilon$。由柯西收敛准则，数列收敛。"
    },
    {
      "id": "2025-QZ-02",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第2题",
      "chapter": "第一章 函数与极限",
      "section": "§1.2 数列极限存在的准则",
      "statement": "下列陈述错误的是（不定项）\\nA. 若 $\\{a_{2n-1}\\}$ 与 $\\{a_{2n}\\}$ 都收敛，则 $\\{a_n\\}$ 收敛；\\nB. 若存在 $\\varepsilon_0>0$，对任意 $N>0$，存在 $n_0>N$ 使 $|a_{n_0}-A|\\ge\\varepsilon_0$，则 $\\{a_n\\}$ 收敛；\\nC. 设 $a_1=2$，$a_{n+1}=3a_n-\\dfrac4{a_n+1}$，则 $\\lim a_n=1$；\\nD. 若 $a_n\\to A$，则存在 $N>0$，使对任意 $\\varepsilon>0$，当 $n>N$ 时 $|a_n-A|<\\varepsilon$。",
      "type": "多项选择题",
      "topics": [
        "子列极限",
        "极限定义量词顺序",
        "递推数列",
        "反例"
      ],
      "difficulty": 4,
      "tags": [
        "2025小测",
        "不定项",
        "子列",
        "量词"
      ],
      "right_answer": "A、B、C、D 均错误",
      "key_points": [
        "奇、偶子列必须收敛到同一极限才能推出原数列收敛",
        "B 的量词描述的是“不收敛”，不是收敛",
        "C 从 $a_1=2$ 出发数列递增且趋于 $+\\infty$",
        "D 中 $N$ 必须依赖于 $\\varepsilon$"
      ],
      "solutions": [
        {
          "name": "逐项举反例或分析量词",
          "steps": [
            "A 错：取 $a_{2n-1}=1$、$a_{2n}=0$，奇偶子列均收敛，但原数列不收敛。",
            "B 错：该条件恰说明 $a_n$ 不收敛到 $A$，不能推出收敛。",
            "C 错：$a_1=2$，$a_2=14/3$，$a_3=226/17$，数列递增；若 $a_n\\to L$，则 $L=3L-4/(L+1)$，得 $L=1$ 或 $-2$，与递增起点 $2$ 矛盾，故发散。",
            "D 错：收敛定义要求对每个 $\\varepsilon>0$ 存在相应的 $N(\\varepsilon)$，不能把 $N$ 提前固定为与 $\\varepsilon$ 无关的常数。",
            "因此四项均错误。"
          ]
        }
      ],
      "pitfalls": [
        "看到两个子列都收敛就默认极限相同",
        "把“某个 ε0 不满足”误读成收敛",
        "D 中忽略 $N$ 依赖于 $\\varepsilon$。"
      ],
      "related": [
        "§2.3 数列极限",
        "§4.1 量词与逻辑"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "1-3.5(4)",
      "source": "习题1-3 第5题(4)",
      "chapter": "第一章 函数与极限",
      "section": "§1.3 函数极限存在的准则",
      "statement": "证明 $\\lim\\limits_{x\\to 0} e^{1/x}$ 不存在。",
      "type": "证明题",
      "topics": [
        "极限不存在的证明",
        "归结原则（海涅定理，定理1.12）",
        "定理1.13 极限不存在的充要条件（2）",
        "单侧极限与左右行为差异",
        "无穷大量与极限不存在的区别"
      ],
      "difficulty": 3,
      "tags": [
        "经典反例",
        "无穷型",
        "左右极限不同",
        "第四章间断点预备"
      ],
      "key_points": [
        "支点在 $1/x$：$x\\to 0^+$ 时 $1/x\\to+\\infty$，$x\\to 0^-$ 时 $1/x\\to-\\infty$，两侧趋势相反",
        "因此 $e^{1/x}$ 右趋 $+\\infty$、左趋 $0$，整体不可能有有限极限",
        "用定理1.13(2) 时，必须补一句「$\\infty$ 不是有限数，故该数列极限不存在」，否则该步是空的",
        "它只在右侧趋于 $\\infty$，左侧趋于 $0$，所以它不是无穷大量（无穷大量要求整个去心邻域内 $|f|$ 都任意大）"
      ],
      "solutions": [
        {
          "name": "解法一：定理1.13(2)（最省字）",
          "steps": [
            "取 $x_n=\\dfrac1n$（$n=1,2,\\dots$），则 $x_n\\neq 0$ 且 $x_n\\to 0$。",
            "此时 $f(x_n)=e^{1/x_n}=e^{n}$。",
            "数列 $\\{e^{n}\\}$ 无界，故 $\\lim\\limits_{n\\to\\infty} e^{n}$ 不存在（不是有限数）。",
            "由定理1.13(2)，$\\lim\\limits_{x\\to 0} e^{1/x}$ 不存在。"
          ]
        },
        {
          "name": "解法二：两条路径相互矛盾（最直观）",
          "steps": [
            "取 $x_n=\\dfrac1n\\to 0$，则 $e^{1/x_n}=e^{n}\\to+\\infty$。",
            "取 $x_n'=-\\dfrac1n\\to 0$，则 $e^{1/x_n'}=e^{-n}\\to 0$。",
            "若极限存在为 $A$，则任何趋于 $0$ 的数列都须给出 $f\\to A$；",
            "由第二条路径得 $A=0$，由第一条路径得 $f\\to+\\infty\\neq 0$，矛盾。"
          ]
        },
        {
          "name": "解法三：用单侧极限判定",
          "steps": [
            "$\\lim\\limits_{x\\to 0^-} e^{1/x}=0$（因 $1/x\\to-\\infty$）。",
            "$\\lim\\limits_{x\\to 0^+} e^{1/x}=+\\infty$（不是有限数，右极限不存在）。",
            "极限存在 $\\iff$ 左右极限都存在且相等；此处左极限为 $0$、右极限不存在，故整体极限不存在。"
          ]
        }
      ],
      "pitfalls": [
        "只写「$e^{1/x}\\to\\infty$，所以极限不存在」——只看了右侧，必须两侧都看",
        "误判为「无穷大量」——它与无穷大量的定义不符（左侧并不任意大）",
        "把 $+\\infty$ 当成极限值与 $A$ 比较（$\\infty$ 不是数），应表述为「该路径下函数值无界，故不收敛到任何有限数」"
      ],
      "related": [
        "定理1.12 归结原则（海涅定理）",
        "定理1.13 极限不存在的充要条件",
        "习题1-3 第5题 其余小题 (1)(2)(3)",
        "第四章：$x=0$ 是 $e^{1/x}$ 的无穷型（第二类）间断点"
      ],
      "added": "2026-10-12",
      "right_answer": "极限存在 $\\iff$ 左右极限都存在且相等；此处左极限为 $0$、右极限不存在，故整体极限不存在。"
    },
    {
      "id": "错-1-3.2",
      "source": "第一章作业 习题1-3 第2题",
      "chapter": "第一章 函数与极限",
      "section": "§1.3 函数极限存在的准则",
      "statement": "设 $D(x)=1$（$x$ 为有理数），$D(x)=0$（$x$ 为无理数），证明 $D(x)$ 在每一点极限都不存在。",
      "type": "证明题",
      "topics": [
        "归结原则（海涅定理）",
        "有理数与无理数的稠密性",
        "极限不存在的证明"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "构造漏洞",
        "狄利克雷函数"
      ],
      "my_answer": "取 $x_n'=x_0+\\dfrac1n$、$x_n''=x_0+\\dfrac1{\\sqrt n}$，断言前者有理、后者无理",
      "right_answer": "用稠密性：在 $(x_0,x_0+\\frac1n)$ 内分别取有理数 $r_n$ 与无理数 $s_n$",
      "error_analysis": "两处构造都站不住：① $x_0$ **无理**时 $x_0+\\frac1n$ 也无理，$D(x_n')\\to1$ 就不成立；② $n$ 为完全平方数时 $\\frac1{\\sqrt n}$ 是**有理数**，$x_n''$ 未必无理。所以数列根本不具备所需性质，只在个别情形下碰巧成立。",
      "key_points": [
        "归结原则要求：$\\{x_n\\}\\subset\\mathring U(x_0)$、$x_n\\to x_0$，且**函数值确实趋于两个不同的常数**",
        "构造之前先想清楚：这个数列真的能保证落在「有理数」/「无理数」集合里吗？",
        "最稳的做法是**直接用稠密性**：任何区间内既有无理数又有有理数，取一串即可，不必猜显式公式",
        "$x_0$ 是任意的，所以构造必须对一切 $x_0\\in\\mathbb R$ 都有效"
      ],
      "solutions": [
        {
          "name": "用稠密性构造",
          "steps": [
            "任取 $x_0\\in\\mathbb R$。对每个 $n$，由有理数稠密性，在 $(x_0,x_0+\\frac1n)$ 内取有理数 $r_n$（自然 $r_n\\ne x_0$）。",
            "同样由无理数稠密性，在同一区间内取无理数 $s_n$。",
            "于是 $r_n\\to x_0$、$s_n\\to x_0$，而 $D(r_n)=1\\to1$、$D(s_n)=0\\to0$。",
            "由归结原则，$\\lim\\limits_{x\\to x_0}D(x)$ 不可能存在（否则两条路径必给同一极限）。由 $x_0$ 任意，$D$ 处处无极限。"
          ]
        }
      ],
      "pitfalls": [
        "凭直觉写 $x_0+\\frac1n$、$x_0+\\frac1{\\sqrt n}$ 并断言其有理/无理——性质依赖于 $x_0$ 与 $n$，一般不对"
      ],
      "related": [
        "题库易错点 E-005（构造数列必须验证其性质）",
        "§3.3 归结原则"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-3.6",
      "source": "第一章作业 习题1-3 第6题",
      "chapter": "第一章 函数与极限",
      "section": "§1.3 函数极限存在的准则",
      "statement": "利用 $\\lim\\limits_{n\\to\\infty}\\dfrac{n^k}{a^n}=0$（$a>1$ 为常数，$k$ 为常数），证明 $\\lim\\limits_{x\\to+\\infty}\\dfrac{x^k}{a^x}=0$（提示：用夹逼定理）。",
      "type": "证明题",
      "topics": [
        "夹逼定理",
        "取整夹逼（数列极限推函数极限）",
        "单调性"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "引用未证结论",
        "夹逼"
      ],
      "my_answer": "证 $x^k/a^x$ 单调递减，然后直接说极限为 0",
      "right_answer": "用取整做双边夹逼",
      "error_analysis": "两个问题：① 引用了 $\\dfrac{x_1-x_2}{\\ln x_1-\\ln x_2}>\\sqrt{x_1x_2}$（对数平均 > 几何平均）——本章**没讲、我也没证**；② 更根本的是，**单调递减只能说明极限存在，不能说明极限等于 0**（还要证明下确界为 0）。此外 $k\\le0$ 的情形没讨论，$[x]$ 也没说明是取整。",
      "key_points": [
        "本题的提示是**夹逼定理**，思路应是把函数夹在两个数列之间",
        "取 $n=\\lfloor x\\rfloor$，则 $n\\le x<n+1$，于是 $\\dfrac{n^k}{a^{n+1}}\\le\\dfrac{x^k}{a^x}\\le\\dfrac{(n+1)^k}{a^n}$",
        "两端都化归为已知的数列极限：$\\dfrac{n^k}{a^{n+1}}=\\dfrac1a\\cdot\\dfrac{n^k}{a^n}\\to0$，$\\dfrac{(n+1)^k}{a^n}=a\\cdot\\dfrac{(n+1)^k}{a^{n+1}}\\to0$",
        "「单调有界」只能保证极限存在，要定出极限值必须另有工具"
      ],
      "solutions": [
        {
          "name": "取整 + 双边夹逼（按提示）",
          "steps": [
            "对 $x>1$ 记 $n=\\lfloor x\\rfloor$（$x$ 的整数部分），则 $n\\le x<n+1$，且 $x\\to+\\infty$ 时 $n\\to\\infty$。",
            "因 $a>1$，$a^n\\le a^x$，故 $\\dfrac{x^k}{a^x}\\ge\\dfrac{n^k}{a^{n+1}}=\\dfrac1a\\cdot\\dfrac{n^k}{a^n}$（$k>0$ 时；$k\\le0$ 时同理可得）。",
            "又 $a^x>a^{n}$ 且 $x<n+1$，故 $\\dfrac{x^k}{a^x}\\le\\dfrac{(n+1)^k}{a^{n}}=a\\cdot\\dfrac{(n+1)^k}{a^{n+1}}$。",
            "由已知的数列极限，两端都 $\\to0$（$\\dfrac1a\\cdot0=0$，$a\\cdot0=0$）。",
            "由夹逼定理，$\\lim\\limits_{x\\to+\\infty}\\dfrac{x^k}{a^x}=0$。"
          ]
        }
      ],
      "pitfalls": [
        "引用未在书上证明的不等式（对数平均不等式）",
        "把「单调有界 ⇒ 极限存在」误当成「极限 = 0」"
      ],
      "related": [
        "题库易错点 E-006（不能引用未证的结论）",
        "§3.6 夹逼定理"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "2025-QZ-09",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第9题",
      "chapter": "第一章 函数与极限",
      "section": "§1.4 无穷小量阶的比较",
      "statement": "设 $\\alpha(x)=\\dfrac{1-x}{3+x}$，$\\beta(x)=1-\\sqrt[4]{x}$，当 $x\\to1$ 时，下列陈述正确的是（　）。\\nA. 同阶非等价无穷小　B. 等价无穷小　C. $\\alpha$ 比 $\\beta$ 低阶　D. $\\alpha$ 比 $\\beta$ 高阶。",
      "type": "单选题",
      "topics": [
        "无穷小阶的比较",
        "等价无穷小",
        "变量替换"
      ],
      "difficulty": 2,
      "tags": [
        "2025小测",
        "无穷小比阶",
        "等价量",
        "单选"
      ],
      "right_answer": "B",
      "key_points": [
        "令 $h=x-1\\to0$",
        "$\\alpha\\sim-h/4$，$\\beta\\sim-h/4$"
      ],
      "solutions": [
        {
          "name": "在 $x=1$ 处展开",
          "steps": [
            "令 $x=1+h$，则 $\\alpha=\\frac{-h}{4+h}\\sim-\\frac h4$。",
            "$\\beta=1-(1+h)^{1/4}\\sim-\\frac h4$。",
            "二者之比趋于 $1$，故为等价无穷小，选 B。"
          ]
        }
      ],
      "pitfalls": [
        "在 $x\\to0$ 处套用等价无穷小公式",
        "忽略 $\\sqrt[4]{x}$ 在 $x=1$ 处的线性化系数。"
      ],
      "related": [
        "§3.5 无穷小量阶的比较"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "10.14-E",
      "source": "10.14 练习 E",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "当 $x\\to 0$ 时，$\\alpha(x)=kx^2$，$\\beta(x)=\\sqrt{1+x\\arcsin x}-\\sqrt{\\cos x}$。若 $\\alpha(x)\\sim\\beta(x)$，求常数 $k$。",
      "type": "计算题（含待定常数）",
      "topics": [
        "等价无穷小",
        "根式差有理化",
        "待定常数求法",
        "$\\arcsin x\\sim x$",
        "$1-\\cos x\\sim\\dfrac{x^2}{2}$",
        "$(1+u)^a-1\\sim au$"
      ],
      "difficulty": 4,
      "tags": [
        "综合题",
        "有理化+等价",
        "常考"
      ],
      "key_points": [
        "$\\alpha\\sim\\beta$ 等价于 $\\lim\\limits_{x\\to 0}\\dfrac{\\beta}{\\alpha}=1$，据此列出关于 $k$ 的方程",
        "$\\beta$ 是两根号之差，先有理化把差化成商：分母 $\\sqrt{1+x\\arcsin x}+\\sqrt{\\cos x}\\to 2$",
        "分子 $x\\arcsin x+1-\\cos x$ 中：$x\\arcsin x\\sim x^2$（因 $\\arcsin x\\sim x$），$1-\\cos x\\sim\\dfrac{x^2}{2}$，相加得 $\\dfrac{3}{2}x^2$",
        "于是 $\\beta\\sim\\dfrac{3}{4}x^2$，与 $\\alpha=kx^2$ 比较得 $k=\\dfrac{3}{4}$"
      ],
      "solutions": [
        {
          "name": "解法一：有理化 + 等价",
          "steps": [
            "由 $\\alpha\\sim\\beta$ 得 $\\lim\\limits_{x\\to 0}\\dfrac{\\beta(x)}{\\alpha(x)}=1$。",
            "有理化：$\\beta(x)=\\dfrac{(1+x\\arcsin x)-\\cos x}{\\sqrt{1+x\\arcsin x}+\\sqrt{\\cos x}}$。",
            "分母 $\\to 1+1=2$，故 $\\beta(x)\\sim\\dfrac{x\\arcsin x+1-\\cos x}{2}$。",
            "$\\arcsin x\\sim x\\Rightarrow x\\arcsin x\\sim x^2$；又 $1-\\cos x\\sim\\dfrac{x^2}{2}$，故分子 $\\sim\\dfrac{3}{2}x^2$。",
            "于是 $\\beta(x)\\sim\\dfrac{1}{2}\\cdot\\dfrac{3}{2}x^2=\\dfrac{3}{4}x^2$。",
            "由 $\\beta\\sim\\alpha=kx^2$ 得 $k=\\dfrac{3}{4}$。"
          ]
        },
        {
          "name": "解法二：直接对两个根号用 $(1+u)^a-1\\sim au$",
          "steps": [
            "$\\sqrt{1+x\\arcsin x}=1+\\dfrac{x\\arcsin x}{2}+o(x^2)$，而 $x\\arcsin x\\sim x^2$，故 $\\sqrt{1+x\\arcsin x}=1+\\dfrac{x^2}{2}+o(x^2)$。",
            "$\\cos x=1-(1-\\cos x)$，故 $\\sqrt{\\cos x}=\\sqrt{1-(1-\\cos x)}=1-\\dfrac{1-\\cos x}{2}+o(x^2)=1-\\dfrac{x^2}{4}+o(x^2)$。",
            "两者相减：$\\beta(x)=\\dfrac{3}{4}x^2+o(x^2)$，故 $k=\\dfrac{3}{4}$。"
          ]
        }
      ],
      "pitfalls": [
        "忘了有理化，直接把两个根号相减当成 $0$（两个根号都 $\\to 1$，相减必须展开）",
        "把 $\\arcsin x$ 换成 $x$ 后忘了外面还乘着一个 $x$（正确是 $x\\arcsin x\\sim x^2$，不是 $x$）",
        "只算到 $\\beta\\sim\\dfrac{3}{2}x^2$ 就把系数当成 $k$（漏了有理化时分母的 $2$）"
      ],
      "related": [
        "习题1-3 第11题（有理化求常数）",
        "§3.5 无穷小量、无穷大量、阶的比较",
        "题库易错点 E-001"
      ],
      "added": "2026-10-12",
      "right_answer": "两者相减：$\\beta(x)=\\dfrac{3}{4}x^2+o(x^2)$，故 $k=\\dfrac{3}{4}$。"
    },
    {
      "id": "10.14-D",
      "source": "10.14 练习 D",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to 0}\\dfrac{1-\\cos(1-\\cos 2x)}{x^4}$。",
      "type": "计算题",
      "topics": [
        "等价无穷小",
        "复合函数中的等价替换",
        "$1-\\cos u\\sim\\dfrac{u^2}{2}$（二阶）"
      ],
      "difficulty": 3,
      "tags": [
        "复合等价",
        "容易漏阶",
        "常考"
      ],
      "key_points": [
        "$1-\\cos u\\sim\\dfrac{u^2}{2}$ 中的 $u$ 可以整体换成任何趋于 $0$ 的式子，本题 $u=1-\\cos 2x$",
        "关键看阶：$1-\\cos 2x$ 是二阶量（$\\sim 2x^2$），代进 $\\dfrac{u^2}{2}$ 后升到四阶，正好与分母 $x^4$ 匹配",
        "分两步替换，不要一步跳完，否则容易把阶数算错"
      ],
      "solutions": [
        {
          "name": "两步等价替换",
          "steps": [
            "令 $u=1-\\cos 2x$（$x\\to 0$ 时 $u\\to 0$），由 $1-\\cos u\\sim\\dfrac{u^2}{2}$ 得分子 $\\sim\\dfrac{(1-\\cos 2x)^2}{2}$。",
            "再由 $1-\\cos 2x\\sim\\dfrac{(2x)^2}{2}=2x^2$，代回得 $\\dfrac{1}{2}(2x^2)^2=\\dfrac{1}{2}\\cdot 4x^4=2x^4$。",
            "所以原式 $\\sim\\dfrac{2x^4}{x^4}=2$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $1-\\cos(1-\\cos 2x)$ 写成 $(1-\\cos 2x)^2/2$ 之后，误把 $1-\\cos 2x$ 当成一阶量写成 $x^2$（正确是 $2x^2$）",
        "记错公式：$1-\\cos x\\sim\\dfrac{x^2}{2}$ 中的 $\\dfrac{1}{2}$ 常被漏掉，导致答案差 $2$ 倍",
        "在复合处直接对整个分子用一次等价而不看阶数"
      ],
      "related": [
        "题库易错点 E-001（等价替换只能在因式位置使用）",
        "§3.5 无穷小量阶的比较"
      ],
      "added": "2026-10-12",
      "right_answer": "所以原式 $\\sim\\dfrac{2x^4}{x^4}=2$。"
    },
    {
      "id": "10.14-C",
      "source": "10.14 练习 C",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to\\alpha}\\dfrac{\\sin x-\\sin\\alpha}{x-\\alpha}$。",
      "type": "计算题",
      "topics": [
        "和差化积",
        "重要极限 $\\dfrac{\\sin t}{t}\\to 1$",
        "极限四则运算（两项极限都存在时可拆）"
      ],
      "difficulty": 3,
      "tags": [
        "基本题型",
        "和差化积",
        "必会"
      ],
      "key_points": [
        "被减的两项是「同名三角函数相减」，标准手段是和差化积",
        "$\\sin x-\\sin\\alpha=2\\cos\\dfrac{x+\\alpha}{2}\\sin\\dfrac{x-\\alpha}{2}$",
        "把 $\\dfrac{x-\\alpha}{2}$ 看成整体 $t$，凑出 $\\dfrac{\\sin t}{t}\\to 1$",
        "$\\cos$ 那一项因 $\\cos$ 连续，直接把 $x=\\alpha$ 代进去即可"
      ],
      "solutions": [
        {
          "name": "和差化积 + 凑重要极限",
          "steps": [
            "和差化积：$\\sin x-\\sin\\alpha=2\\cos\\dfrac{x+\\alpha}{2}\\sin\\dfrac{x-\\alpha}{2}$。",
            "原式 $=2\\cos\\dfrac{x+\\alpha}{2}\\sin\\dfrac{x-\\alpha}{2}\\Big/(x-\\alpha)$。",
            "把分母写成 $2\\cdot\\dfrac{x-\\alpha}{2}$，提出系数：原式 $=\\cos\\dfrac{x+\\alpha}{2}\\cdot\\dfrac{\\sin\\frac{x-\\alpha}{2}}{\\frac{x-\\alpha}{2}}$。",
            "令 $t=\\dfrac{x-\\alpha}{2}$，则 $x\\to\\alpha$ 时 $t\\to 0$，由重要极限 $\\dfrac{\\sin t}{t}\\to 1$，方括号部分 $\\to 1$。",
            "而 $\\cos\\dfrac{x+\\alpha}{2}\\to\\cos\\alpha$（余弦函数连续）。",
            "故极限 $=\\cos\\alpha$。"
          ]
        }
      ],
      "pitfalls": [
        "想用 $\\sin x\\sim x$ 把 $\\sin x$ 换成 $x$——这是相减关系，属加减项，不能替换（见易错点 E-001）",
        "用洛必达法则或导数定义来解——那是第二章的内容，本章应走和差化积",
        "和差化积公式记错：$\\sin x-\\sin\\alpha=2\\cos\\dfrac{x+\\alpha}{2}\\sin\\dfrac{x-\\alpha}{2}$（系数 $2$ 与 $\\cos/\\sin$ 的先后别弄反）"
      ],
      "related": [
        "题库知识点「10.14 函数极限·函数连续」五、和差化积",
        "题库易错点 E-001",
        "§3.6 两个重要极限"
      ],
      "added": "2026-10-12",
      "right_answer": "故极限 $=\\cos\\alpha$。"
    },
    {
      "id": "1-4.12(2)",
      "source": "习题1-4 第12题(2)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to a}\\dfrac{x^\\alpha-a^\\alpha}{x^\\beta-a^\\beta}$（$a>0$，$\\beta\\neq 0$）。",
      "type": "计算题（含参数）",
      "topics": [
        "$0/0$ 型极限",
        "变量替换（换元改变变化趋势）",
        "等价量替换",
        "$(1+u)^\\gamma-1\\sim\\gamma u$",
        "拆成两个标准极限"
      ],
      "difficulty": 3,
      "tags": [
        "含参数",
        "换元+等价",
        "0/0型"
      ],
      "key_points": [
        "先换元把 $x\\to a$ 化成 $t\\to 0$：令 $x=a(1+t)$，则 $t=\\dfrac{x-a}{a}$",
        "换元后分子分母都冒出公因子 $[(1+t)^\\bullet-1]$，整体成为乘除结构，等价替换才合法",
        "公共因子 $\\dfrac{a^\\alpha}{a^\\beta}=a^{\\alpha-\\beta}$ 要单独提出——这正是答案里 $a^{\\alpha-\\beta}$ 的来源",
        "最后只剩 $\\dfrac{(1+t)^\\alpha-1}{(1+t)^\\beta-1}\\sim\\dfrac{\\alpha t}{\\beta t}=\\dfrac{\\alpha}{\\beta}$"
      ],
      "solutions": [
        {
          "name": "解法一：整体换元 + 等价量替换",
          "steps": [
            "令 $x=a(1+t)$，则 $t=\\dfrac{x-a}{a}$，且 $x\\to a\\iff t\\to 0$。",
            "于是 $x^\\alpha=a^\\alpha(1+t)^\\alpha$，$x^\\beta=a^\\beta(1+t)^\\beta$。",
            "代入得 $\\dfrac{x^\\alpha-a^\\alpha}{x^\\beta-a^\\beta}=\\dfrac{a^\\alpha[(1+t)^\\alpha-1]}{a^\\beta[(1+t)^\\beta-1]}=a^{\\alpha-\\beta}\\cdot\\dfrac{(1+t)^\\alpha-1}{(1+t)^\\beta-1}$。",
            "由 $(1+u)^\\gamma-1\\sim\\gamma u$（$u\\to 0$），分子分母同时替换：$\\dfrac{(1+t)^\\alpha-1}{(1+t)^\\beta-1}\\sim\\dfrac{\\alpha t}{\\beta t}=\\dfrac{\\alpha}{\\beta}$。",
            "故原式 $=\\dfrac{\\alpha}{\\beta}a^{\\alpha-\\beta}$。"
          ]
        },
        {
          "name": "解法二：拆成两个标准极限",
          "steps": [
            "$\\dfrac{x^\\alpha-a^\\alpha}{x^\\beta-a^\\beta}=\\dfrac{(x^\\alpha-a^\\alpha)/(x-a)}{(x^\\beta-a^\\beta)/(x-a)}$（$x\\neq a$ 时可除）。",
            "令 $x=a(1+t)$，则 $\\dfrac{x^\\alpha-a^\\alpha}{x-a}=\\dfrac{a^\\alpha[(1+t)^\\alpha-1]}{at}=a^{\\alpha-1}\\cdot\\dfrac{(1+t)^\\alpha-1}{t}\\to a^{\\alpha-1}\\alpha$。",
            "同理 $\\dfrac{x^\\beta-a^\\beta}{x-a}\\to a^{\\beta-1}\\beta$。",
            "两式相除得 $\\dfrac{\\alpha a^{\\alpha-1}}{\\beta a^{\\beta-1}}=\\dfrac{\\alpha}{\\beta}a^{\\alpha-\\beta}$。"
          ]
        }
      ],
      "pitfalls": [
        "换元后分母漏掉 $a$：$x-a=at$，不是 $t$",
        "漏掉系数 $\\gamma$：$(1+t)^\\gamma-1\\sim\\gamma t$ 前面的 $\\gamma$ 正是答案里的 $\\alpha$、$\\beta$",
        "把 $a^{\\alpha-\\beta}$ 错写成 $a^{\\alpha/\\beta}$（它来自 $a^\\alpha/a^\\beta$）",
        "用洛必达法则或导数定义——本章还没学，只能用换元 + 等价量"
      ],
      "related": [
        "题库题目 10.14-E（同类：含参数 + 等价量）",
        "题库易错点 E-001（等价替换只能在因式位置）",
        "题库易错点 E-002（不能拆开不存在的极限）",
        "§3.6 两个重要极限",
        "常用等价无穷小：$(1+u)^\\gamma-1\\sim\\gamma u$"
      ],
      "added": "2026-10-12",
      "right_answer": "$\\dfrac{\\alpha}{\\beta}a^{\\alpha-\\beta}$"
    },
    {
      "id": "1-4.12(5)",
      "source": "习题1-4 第12题(5)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to+\\infty}\\dfrac{\\ln(1+3^x)}{\\ln(1+2^x)}$。",
      "type": "计算题",
      "topics": [
        "$\\infty/\\infty$ 型极限",
        "对数运算性质 $\\ln(ab)=\\ln a+\\ln b$",
        "提取主项（把大数化成小数）",
        "等价量替换 $\\ln(1+u)\\sim u$（需 $u\\to 0$）",
        "夹逼定理"
      ],
      "difficulty": 3,
      "tags": [
        "∞/∞型",
        "提主项",
        "对数运算",
        "与 1-4.12(2) 配对"
      ],
      "key_points": [
        "先认清类型：$x\\to+\\infty$ 时分子分母都 $\\to+\\infty$，是 $\\infty/\\infty$ 型（不是 $0/0$）",
        "**不能**直接用 $\\ln(1+u)\\sim u$：它要求 $u\\to 0$，而本题 $u=3^x\\to+\\infty$，条件不成立",
        "关键一步是提主项：$\\ln(1+3^x)=\\ln\\left[3^x(1+3^{-x})\\right]=x\\ln 3+\\ln(1+3^{-x})$，把大数化成小数 $3^{-x}\\to 0$",
        "分子分母同除 $x$ 后，剩下的两项是「无穷小 ÷ 无穷大」，都 $\\to 0$，只剩 $\\dfrac{\\ln 3}{\\ln 2}$"
      ],
      "solutions": [
        {
          "name": "解法一：提取主项（标准做法）",
          "steps": [
            "$\\ln(1+3^x)=\\ln\\left[3^x\\left(1+3^{-x}\\right)\\right]=x\\ln 3+\\ln\\left(1+3^{-x}\\right)$。",
            "同理 $\\ln(1+2^x)=x\\ln 2+\\ln\\left(1+2^{-x}\\right)$。",
            "代入并同除 $x$：$\\dfrac{\\ln(1+3^x)}{\\ln(1+2^x)}=\\dfrac{\\ln 3+\\dfrac{\\ln(1+3^{-x})}{x}}{\\ln 2+\\dfrac{\\ln(1+2^{-x})}{x}}$。",
            "$x\\to+\\infty$ 时 $3^{-x}\\to 0$、$2^{-x}\\to 0$，由 $\\ln(1+u)\\sim u$ 知两个对数都是无穷小，再除以 $x\\to+\\infty$，故两个分式都 $\\to 0$。",
            "所以原式 $=\\dfrac{\\ln 3}{\\ln 2}=\\log_2 3$。"
          ]
        },
        {
          "name": "解法二：夹逼定理（不用等价量）",
          "steps": [
            "当 $x$ 充分大时，$3^x<1+3^x\\le 3^x+3^x=2\\cdot 3^x\\le 3^{x+1}$，取对数得 $x\\ln 3<\\ln(1+3^x)\\le(x+1)\\ln 3$。",
            "同理 $x\\ln 2<\\ln(1+2^x)\\le(x+1)\\ln 2$。",
            "两式相除：$\\dfrac{x\\ln 3}{(x+1)\\ln 2}<\\dfrac{\\ln(1+3^x)}{\\ln(1+2^x)}\\le\\dfrac{(x+1)\\ln 3}{x\\ln 2}$。",
            "左右两端当 $x\\to+\\infty$ 时都趋于 $\\dfrac{\\ln 3}{\\ln 2}$，由夹逼定理得原式 $=\\dfrac{\\ln 3}{\\ln 2}$。"
          ]
        }
      ],
      "pitfalls": [
        "误用 $\\ln(1+u)\\sim u$：它要求 $u\\to 0$。本题 $3^x\\to+\\infty$，若硬替换成 $\\dfrac{3^x}{2^x}$ 会得到 $+\\infty$，答案完全错",
        "提主项时漏掉系数：$\\ln 3^x=x\\ln 3$，那个 $x$ 不能丢",
        "答案写成 $\\ln\\dfrac{3}{2}$ 或 $\\dfrac{3}{2}$——正确是 $\\dfrac{\\ln 3}{\\ln 2}=\\log_2 3$"
      ],
      "related": [
        "题库题目 1-4.12(2)（同为含参数极限，那题是 $0/0$ 型，可作对照）",
        "题库易错点 E-001（等价替换只能在因式位置）",
        "§3.6 两个重要极限",
        "常用等价无穷小：$\\ln(1+u)\\sim u$（$u\\to 0$）"
      ],
      "added": "2026-10-12",
      "right_answer": "左右两端当 $x\\to+\\infty$ 时都趋于 $\\dfrac{\\ln 3}{\\ln 2}$，由夹逼定理得原式 $=\\dfrac{\\ln 3}{\\ln 2}$。"
    },
    {
      "id": "1-4.12(8)",
      "source": "习题1-4 第12题(8)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to+\\infty}\\left[\\sin\\ln(x+1)-\\sin\\ln x\\right]$。",
      "type": "计算题",
      "topics": [
        "三角相减型 $\\infty-\\infty$",
        "和差化积",
        "有界量 × 无穷小量 = 无穷小量",
        "对数差化为 $\\ln(1+1/x)$",
        "夹逼定理"
      ],
      "difficulty": 3,
      "tags": [
        "振荡",
        "有界×无穷小",
        "和差化积"
      ],
      "key_points": [
        "**不能**对 $\\sin\\ln(x+1)$ 直接用 $\\sin u\\sim u$：这里 $u=\\ln(x+1)\\to+\\infty$，条件不成立",
        "先用和差化积，把「两个大角的正弦相减」拆成「有界 × 小角的正弦」",
        "关键观察：$\\ln(x+1)-\\ln x=\\ln\\left(1+\\dfrac{1}{x}\\right)\\to 0$——两角之**差**趋于 $0$",
        "最后用「有界量 × 无穷小量 = 无穷小量」收尾"
      ],
      "solutions": [
        {
          "name": "解法一：和差化积 + 有界×无穷小",
          "steps": [
            "和差化积：$\\sin\\ln(x+1)-\\sin\\ln x=2\\cos\\dfrac{\\ln(x+1)+\\ln x}{2}\\cdot\\sin\\dfrac{\\ln(x+1)-\\ln x}{2}$。",
            "算角差：$\\dfrac{\\ln(x+1)-\\ln x}{2}=\\dfrac{1}{2}\\ln\\dfrac{x+1}{x}=\\dfrac{1}{2}\\ln\\left(1+\\dfrac{1}{x}\\right)\\to 0$。",
            "由 $\\sin u\\sim u$ 与 $\\ln(1+v)\\sim v$：$\\sin\\dfrac{1}{2}\\ln\\left(1+\\dfrac{1}{x}\\right)\\sim\\dfrac{1}{2x}\\to 0$。",
            "而 $\\left|2\\cos\\dfrac{\\ln(x+1)+\\ln x}{2}\\right|\\le 2$ 有界，由「有界量 × 无穷小量 = 无穷小量」得原式 $=0$。"
          ]
        },
        {
          "name": "解法二：用 $|\\sin A-\\sin B|\\le|A-B|$ 直接夹逼",
          "steps": [
            "由和差化积与 $|\\sin u|\\le|u|$ 推出 $|\\sin A-\\sin B|=2\\left|\\cos\\dfrac{A+B}{2}\\right|\\left|\\sin\\dfrac{A-B}{2}\\right|\\le|A-B|$。",
            "取 $A=\\ln(x+1)$，$B=\\ln x$：$\\left|\\sin\\ln(x+1)-\\sin\\ln x\\right|\\le\\ln\\dfrac{x+1}{x}=\\ln\\left(1+\\dfrac{1}{x}\\right)$。",
            "$x\\to+\\infty$ 时右端 $\\to 0$，由夹逼定理得原式 $=0$。"
          ]
        }
      ],
      "pitfalls": [
        "对 $\\sin\\ln(x+1)$ 直接用 $\\sin u\\sim u$（要求 $u\\to 0$，这里却趋于 $+\\infty$）",
        "把 $\\ln(x+1)-\\ln x$ 当成 $\\infty-\\infty$——它其实 $=\\ln(1+1/x)\\to 0$",
        "只算正弦部分，忘了前面那个 $\\cos$ 因子，没说明它「有界」"
      ],
      "related": [
        "题库题目 1-4.12(5)",
        "题库知识点「10.14 函数极限·函数连续」八、未定式的处理流程",
        "§3.6 两个重要极限"
      ],
      "added": "2026-10-12",
      "right_answer": "$x\\to+\\infty$ 时右端 $\\to 0$，由夹逼定理得原式 $=0$。"
    },
    {
      "id": "1-综.3(2)",
      "source": "第一章综合题 第3题(2)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to0}\\left(\\dfrac{a_1^x+a_2^x+\\cdots+a_n^x}{n}\\right)^{\\frac{1}{x}}$（$a_1,a_2,\\cdots,a_n$ 均为正数）。",
      "type": "计算题（含参数，$1^\\infty$ 型）",
      "topics": [
        "$1^\\infty$ 型极限",
        "第二重要极限的推广式 $\\lim u^v=e^{\\lim v(u-1)}$",
        "取对数法",
        "$a^x-1\\sim x\\ln a$",
        "对数运算与几何平均数"
      ],
      "difficulty": 4,
      "tags": [
        "1^∞型",
        "含参数",
        "取对数",
        "几何平均"
      ],
      "key_points": [
        "先识别类型：底数 $\\to1$、指数 $\\to\\infty$，是 $1^\\infty$ 型",
        "两条路：① 直接用推广式 $\\lim u^v=e^{\\lim v(u-1)}$　② 取对数后算 $\\ln y$ 再还原",
        "核心一步：$v(u-1)=\\dfrac{1}{x}\\cdot\\dfrac{a_1^x+\\cdots+a_n^x-n}{n}=\\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\dfrac{a_i^x-1}{x}$",
        "每项用 $a_i^x-1\\sim x\\ln a_i$，于是 $\\dfrac{a_i^x-1}{x}\\to\\ln a_i$",
        "结果 $=\\sqrt[n]{a_1a_2\\cdots a_n}$（几何平均数），别停在 $\\dfrac{1}{n}\\sum\\ln a_i$ 上"
      ],
      "solutions": [
        {
          "name": "解法一：用 $1^\\infty$ 型推广式",
          "steps": [
            "取 $u=\\dfrac{a_1^x+\\cdots+a_n^x}{n}$，$v=\\dfrac{1}{x}$，则 $u\\to1$、$v\\to\\infty$，由推广式 $\\lim u^v=e^{\\lim v(u-1)}$ 入手。",
            "计算 $v(u-1)=\\dfrac{1}{x}\\cdot\\dfrac{a_1^x+\\cdots+a_n^x-n}{n}=\\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\dfrac{a_i^x-1}{x}$。",
            "对每项用 $a_i^x-1\\sim x\\ln a_i$，得 $\\dfrac{a_i^x-1}{x}\\to\\ln a_i$。",
            "所以 $\\lim v(u-1)=\\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\ln a_i=\\ln\\sqrt[n]{a_1a_2\\cdots a_n}$。",
            "原式 $=e^{\\ln\\sqrt[n]{a_1\\cdots a_n}}=\\sqrt[n]{a_1a_2\\cdots a_n}$。"
          ]
        },
        {
          "name": "解法二：取对数（不背推广式也行）",
          "steps": [
            "设 $y=\\left(\\dfrac{a_1^x+\\cdots+a_n^x}{n}\\right)^{1/x}$，取对数得 $\\ln y=\\dfrac{1}{x}\\ln\\left(1+\\dfrac{a_1^x+\\cdots+a_n^x-n}{n}\\right)$。",
            "$x\\to0$ 时括号内的量 $\\to0$，用 $\\ln(1+u)\\sim u$（$\\ln(1+u)$ 是乘积中的因式，替换合法）：$\\ln y\\sim\\dfrac{1}{x}\\cdot\\dfrac{a_1^x+\\cdots+a_n^x-n}{n}=\\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\dfrac{a_i^x-1}{x}$。",
            "再用 $a_i^x-1\\sim x\\ln a_i$，得 $\\ln y\\to\\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\ln a_i=\\ln\\sqrt[n]{a_1a_2\\cdots a_n}$。",
            "由对数函数连续，$y\\to\\sqrt[n]{a_1a_2\\cdots a_n}$。"
          ]
        }
      ],
      "pitfalls": [
        "直接把和拆开求极限——整体是 $1^\\infty$ 型，要先化到 $v(u-1)$ 再处理（参见易错点 E-002）",
        "漏掉 $\\ln a_i$：$a_i^x-1\\sim x\\ln a_i$ 里的 $\\ln a_i$ 正是答案的来源",
        "算到 $\\dfrac{1}{n}\\sum\\ln a_i$ 就停手——要还原成 $\\ln\\sqrt[n]{a_1\\cdots a_n}$，再取指数",
        "用洛必达法则——本章超纲"
      ],
      "related": [
        "题库知识点「10.14 函数极限·函数连续」八、未定式的处理流程",
        "§3.6 重要极限2的推广式（$1^\\infty$ 型）",
        "常用等价无穷小：$a^x-1\\sim x\\ln a$",
        "题库易错点 E-002（不能拆开极限不存在的项）"
      ],
      "added": "2026-10-12",
      "right_answer": "$\\sqrt[n]{a_1a_2\\cdots a_n}$"
    },
    {
      "id": "错-1-3.8(8)",
      "source": "第一章作业 习题1-3 第8题(8)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to1}\\dfrac{x^{n+1}-(n+1)x+n}{(x-1)^2}$（$n$ 为正整数）。",
      "type": "计算题",
      "topics": [
        "二项式展开",
        "约分时提取最低次非零项系数",
        "$0/0$ 型（可约）"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "丢系数",
        "0/0型"
      ],
      "my_answer": "1",
      "right_answer": "$\\dfrac{n(n+1)}{2}$",
      "error_analysis": "令 $t=x-1$ 后分子 $=(1+t)^{n+1}-(n+1)t-1=C_{n+1}^{2}t^{2}+C_{n+1}^{3}t^{3}+\\cdots$，除以 $t^2$ 的常数项应是 $C_{n+1}^{2}=\\dfrac{n(n+1)}{2}$。我把展开写成 $t^{n-1}+\\cdots+1$，等于默认二次项系数为 1，**约分时把最低次非零项的系数丢了**。",
      "key_points": [
        "约分前必须先写出**最低次非零项及其系数**",
        "数值自检最快：取 $n=2$，$\\lim\\limits_{x\\to1}\\dfrac{x^3-3x+2}{(x-1)^2}=\\lim\\limits_{x\\to1}(x+2)=3$，与 $\\dfrac{2\\cdot3}{2}=3$ 相符",
        "$n=1$ 时答案才是 1——只验一个特例容易被骗过去"
      ],
      "solutions": [
        {
          "name": "换元 + 二项式展开",
          "steps": [
            "令 $t=x-1$（$t\\to0$），则 $x=1+t$，分子 $=(1+t)^{n+1}-(n+1)t-1$。",
            "二项式展开：$(1+t)^{n+1}=1+(n+1)t+C_{n+1}^{2}t^{2}+C_{n+1}^{3}t^{3}+\\cdots$",
            "代入得分子 $=C_{n+1}^{2}t^{2}+C_{n+1}^{3}t^{3}+\\cdots$。",
            "除以 $t^2$ 后令 $t\\to0$：原式 $=C_{n+1}^{2}=\\dfrac{n(n+1)}{2}$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $t^{n-1}+\\cdots+1$ 当成分子主部——这只保留了最高次项，最低次非零项的系数才是答案"
      ],
      "related": [
        "同类型：作业 习题1-3 第8(2)题（展开后约 x² 得 10）",
        "题库易错点 E-007"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-3.12(4)",
      "source": "第一章作业 习题1-3 第12题(4)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "证明 $o(x^n)\\cdot o(x^m)=o(x^{m+n})$（$x\\to0$）。",
      "type": "证明题",
      "topics": [
        "$o$ 记号的定义",
        "$o$ 的运算律（乘法）",
        "回到定义证明"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "证明不成立",
        "o记号"
      ],
      "my_answer": "把两个极限改写成同一个分母，说「显然成立」",
      "right_answer": "设 $\\alpha=o(x^n),\\beta=o(x^m)$，则 $\\dfrac{\\alpha\\beta}{x^{m+n}}=\\dfrac{\\alpha}{x^n}\\cdot\\dfrac{\\beta}{x^m}\\to0$",
      "error_analysis": "我只用了恒等式 $x^mx^n=x^{m+n}$，把「证明极限为 0」偷换成「两个分母相等」——**全程没用到 $o$ 的定义**。而且开头写的 $\\lim\\dfrac{f}{x^m}=\\lim\\dfrac{f}{x^{m+n}}$ 一般不成立（两者都趋于 0 才偶然相等）。",
      "key_points": [
        "$o$ 的等式本质是「属于」，证明时**必须回到定义**：证某个比值的极限为 0",
        "乘法律的关键是**拆成两个已知的无穷小之积**：$\\dfrac{\\alpha\\beta}{x^{m+n}}=\\dfrac{\\alpha}{x^n}\\cdot\\dfrac{\\beta}{x^m}$",
        "「显然成立」在数学证明里等于没证，考试必扣分"
      ],
      "solutions": [
        {
          "name": "回到定义",
          "steps": [
            "设 $\\alpha=o(x^n)$，$\\beta=o(x^m)$，按定义即 $\\lim\\limits_{x\\to0}\\dfrac{\\alpha}{x^n}=0$，$\\lim\\limits_{x\\to0}\\dfrac{\\beta}{x^m}=0$。",
            "$\n\\dfrac{\\alpha\\beta}{x^{m+n}}=\\dfrac{\\alpha}{x^n}\\cdot\\dfrac{\\beta}{x^m}$。",
            "由极限的乘法法则：$\\lim\\limits_{x\\to0}\\dfrac{\\alpha\\beta}{x^{m+n}}=0\\cdot0=0$。",
            "按定义即 $\\alpha\\beta=o(x^{m+n})$，也就是 $o(x^n)\\cdot o(x^m)=o(x^{m+n})$。"
          ]
        }
      ],
      "pitfalls": [
        "用恒等式或「显然」代替定义验证——本题要证的是「极限为 0」，这是必须算出来的"
      ],
      "related": [
        "题库知识点「10.14 函数极限·函数连续」七、$o$ 记号",
        "题库易错点 E-006"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-3.16(2)",
      "source": "第一章作业 习题1-3 第16题(2)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to0}\\dfrac{\\sin(\\tan^2x)}{\\sqrt[n]{1+x^2}-1}$。",
      "type": "计算题",
      "topics": [
        "等价量替换",
        "$\\sin u\\sim u$",
        "$\\sqrt[n]{1+x^2}-1\\sim\\dfrac{x^2}{n}$"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "答数错",
        "等价量"
      ],
      "my_answer": "1",
      "right_answer": "$n$",
      "error_analysis": "三重错误：① 无端把分式**取倒数**，还把 $x\\to0$ 改成 $x\\to\\infty$；② 最后 $\\sqrt[n]{\\frac{1}{x^{2n-2}}+\\frac{1}{x^{2n}}}\\to0$（$n>1$），却写成 1；③ 本题唯一该用的 $\\sqrt[n]{1+x^2}-1\\sim\\dfrac{x^2}{n}$ 反而没写出来。",
      "key_points": [
        "分母是 $\\sqrt[n]{1+x^2}-1$，用 $(1+u)^a-1\\sim au$（$a=\\frac1n$，$u=x^2$）：$\\sim\\dfrac{x^2}{n}$",
        "分子 $\\sin(\\tan^2x)\\sim\\tan^2x\\sim x^2$",
        "分子分母都是因式，比值 $=\\dfrac{x^2}{x^2/n}=n$",
        "**不要中途把分式取倒数、不要擅自改变极限过程**"
      ],
      "solutions": [
        {
          "name": "等价量替换（因式位置）",
          "steps": [
            "$x\\to0$ 时 $\\tan^2x\\to0$，故 $\\sin(\\tan^2x)\\sim\\tan^2x\\sim x^2$。",
            "$\\sqrt[n]{1+x^2}-1=(1+x^2)^{1/n}-1\\sim\\dfrac{1}{n}x^2$。",
            "分子分母都是因式，可整体替换：原式 $=\\lim\\limits_{x\\to0}\\dfrac{x^2}{x^2/n}=n$。"
          ]
        }
      ],
      "pitfalls": [
        "忘记 $(1+u)^a-1\\sim au$ 里的系数 $a$（本题 $a=\\frac1n$，故答案是 $n$ 而不是 1）",
        "中途取倒数并改变极限过程"
      ],
      "related": [
        "题库知识点「10.14」一、常用等价无穷小量",
        "题库易错点 E-003"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-综.3(1)",
      "source": "第一章作业 第一章综合题 第3题(1)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to0}\\dfrac{3\\sin x+x^2\\cos\\frac1x}{(1+\\cos x)\\ln(1+x)}$。",
      "type": "计算题",
      "topics": [
        "等价量替换",
        "有界量 × 无穷小量 = 无穷小量",
        "$o$ 记号",
        "展开的适用条件"
      ],
      "difficulty": 4,
      "tags": [
        "错题",
        "答数错",
        "超范围使用展开"
      ],
      "my_answer": "$-\\infty$",
      "right_answer": "$\\dfrac{3}{2}$",
      "error_analysis": "我把 $2x\\cos\\frac1x$ 换成了 $2x-\\frac1x$，即对 $\\cos t$ 用了 $\\cos t\\approx1-\\frac{t^2}{2}$。但这里 **$t=\\frac1x\\to\\infty$**，二次展开**只在 $t\\to0$ 时成立**。随后又把分母 $x(4-x^2)$ 拆错，双重错误。",
      "key_points": [
        "$x^2\\cos\\frac1x$ 是「有界量 $\\cos\\frac1x$」乘「无穷小 $x^2$」，故是 $o(x)$，记作 $o(x)$ 保留即可",
        "分子 $=3\\sin x+o(x)=3x+o(x)$；分母 $(1+\\cos x)\\ln(1+x)\\sim2\\cdot x=2x+o(x)$",
        "结果 $=\\dfrac{3x+o(x)}{2x+o(x)}=\\dfrac{3+o(1)}{2+o(1)}\\to\\dfrac32$",
        "**用任何展开前，先看括号里那个量是否趋于展开点**"
      ],
      "solutions": [
        {
          "name": "有界 × 无穷小 + 等价量",
          "steps": [
            "$\\left|x^2\\cos\\frac1x\\right|\\le x^2\\to0$，故 $x^2\\cos\\frac1x=o(x)$。",
            "$3\\sin x\\sim3x$，故分子 $=3x+o(x)$。",
            "$1+\\cos x\\to2$，$\\ln(1+x)\\sim x$，故分母 $\\sim2x$。",
            "原式 $=\\lim\\limits_{x\\to0}\\dfrac{3x+o(x)}{2x}=\\dfrac32$。"
          ]
        }
      ],
      "pitfalls": [
        "对 $\\cos\\frac1x$ 套用 $\\cos t\\approx1-\\frac{t^2}{2}$——$t=\\frac1x\\to\\infty$，展开不成立",
        "把分母拆成 $x(4-x^2)$ 后分数裂项算错"
      ],
      "related": [
        "题库易错点 E-003（等价量/展开只在自变量趋于展开点时成立）",
        "题库知识点「10.14」八、总纲"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-4.12(1)",
      "source": "第一章作业 习题1-4 第12题(1)",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求 $\\lim\\limits_{x\\to0}\\dfrac{(1+\\alpha x)^a-(1+\\beta x)^b}{x}$。",
      "type": "计算题（含参数）",
      "topics": [
        "等价量替换",
        "$(1+u)^\\lambda-1\\sim\\lambda u$",
        "$0/0$ 型"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "超纲用广义二项式"
      ],
      "my_answer": "按 $C_a^1,C_a^2,\\cdots$ 展开成幂级数后取常数项，得 $a\\alpha-b\\beta$（答案对）",
      "right_answer": "$a\\alpha-b\\beta$，但应用 $(1+u)^\\lambda-1=\\lambda u+o(u)$",
      "error_analysis": "答案正确，但**对非整数指数使用广义二项式 $C_a^k$ 属于超纲**（本章没有二项式级数），而且写成 $\\cdots$ 没有控制余项，证明不完整。",
      "key_points": [
        "第一章的合法工具：$(1+u)^\\lambda-1\\sim\\lambda u$（$u\\to0$，$\\lambda$ 任意实数）",
        "把分子拆成两个等价量之和：$(1+\\alpha x)^a-1\\sim a\\alpha x$，$(1+\\beta x)^b-1\\sim b\\beta x$",
        "注意这是**相减**结构，不能分别替换后相减了事，应先合并成**因式**或用 $o$ 记号：分子 $=a\\alpha x-b\\beta x+o(x)$",
        "最后除以 $x$ 得 $a\\alpha-b\\beta$"
      ],
      "solutions": [
        {
          "name": "用 $(1+u)^\\lambda-1=\\lambda u+o(u)$",
          "steps": [
            "$(1+\\alpha x)^a=1+a\\alpha x+o(x)$（因为 $\\alpha x\\to0$，用 $(1+u)^\\lambda-1=\\lambda u+o(u)$）。",
            "同理 $(1+\\beta x)^b=1+b\\beta x+o(x)$。",
            "相减：分子 $=a\\alpha x-b\\beta x+o(x)=(a\\alpha-b\\beta)x+o(x)$。",
            "除以 $x$：原式 $=a\\alpha-b\\beta+o(1)\\to a\\alpha-b\\beta$。"
          ]
        }
      ],
      "pitfalls": [
        "对非整数指数用广义二项式展开（超纲）",
        "用 $\\cdots$ 代替余项控制",
        "在相减结构里分别替换却不注明 $o(x)$"
      ],
      "related": [
        "题库题目 1-4.12(2)（同类：含参数）",
        "题库易错点 E-003"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "2025-MT-08",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第8题",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "求下列极限：\\n（1）$\\displaystyle\\lim_{x\\to0}\\dfrac{(2^x-1)\\sin x\\ln(1+x)}{\\tan x-\\sin x}$；\\n（2）$\\displaystyle\\lim_{x\\to0}(\\cos x)^{\\csc^2x}$。",
      "type": "计算题",
      "topics": [
        "等价无穷小",
        "指数函数",
        "三角函数",
        "幂指函数极限"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "等价量",
        "1^∞型",
        "双小问"
      ],
      "key_points": [
        "$2^x-1\\sim x\\ln2$，$\\sin x\\sim x$，$\\ln(1+x)\\sim x$",
        "$\\tan x-\\sin x\\sim\\frac{x^3}{2}$",
        "幂指型用取对数或 $\\lim u^v=e^{\\lim v\\ln u}$"
      ],
      "solutions": [
        {
          "name": "逐题替换",
          "steps": [
            "（1）分子 $\\sim(x\\ln2)\\cdot x\\cdot x=x^3\\ln2$，分母 $\\tan x-\\sin x\\sim\\frac{x^3}{2}$，故原式 $=2\\ln2=\\ln4$。",
            "（2）设 $L=\\lim_{x\\to0}(\\cos x)^{\\csc^2x}$，取对数：$\\ln L=\\lim\\dfrac{\\ln\\cos x}{\\sin^2x}$。",
            "$\\ln\\cos x\\sim-\\frac{x^2}{2}$，$\\sin^2x\\sim x^2$，所以 $\\ln L=-\\frac12$。",
            "故 $L=e^{-1/2}$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $(2^x-1)$ 写成 $x$ 而漏掉 $\\ln2$",
        "把 $\\tan x-\\sin x$ 用等价量逐项替换成 $0$",
        "幂指型极限误写成 $e^{\\lim \\frac{\\ln\\cos x}{\\sin x}}$。"
      ],
      "related": [
        "题库易错点 E-001",
        "§3.6 两个重要极限"
      ],
      "added": "2026-10-19",
      "right_answer": "（1）分子 $\\sim(x\\ln2)\\cdot x\\cdot x=x^3\\ln2$，分母 $\\tan x-\\sin x\\sim\\frac{x^3}{2}$，故原式 $=2\\ln2=\\ln4$。；（2）设 $L=\\lim_{x\\to0}(\\cos x)^{\\csc^2x}$，取对数：$\\ln L=\\lim\\dfrac{\\ln\\cos x}{\\sin^2x}$。"
    },
    {
      "id": "2025-QZ-04",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第4题",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "下列结论中，正确的个数有_____个。\\n① $\\displaystyle\\lim_{x\\to0}\\frac{\\sin(x\\sin(1/x))}{x\\sin(1/x)}=1$；\\n② 若 $0<a<1$，则 $\\displaystyle\\lim_{n\\to\\infty}(1-a^n)=1$；\\n③ $\\displaystyle\\lim_{n\\to\\infty}\\sqrt[n]{1+\\frac1{\\sqrt2}+\\cdots+\\frac1{\\sqrt n}}=1$；\\n④ $\\displaystyle\\lim_{n\\to\\infty}(n!)^{1/n^2}=1$。\\nA. 4　B. 3　C. 2　D. 1。",
      "type": "单选题",
      "topics": [
        "重要极限",
        "数列极限",
        "n 次根",
        "对数化"
      ],
      "difficulty": 3,
      "tags": [
        "2025小测",
        "重要极限",
        "n次根",
        "单选"
      ],
      "right_answer": "A. 4",
      "key_points": [
        "令 $u=x\\sin(1/x)\\to0$，用 $\\sin u/u\\to1$",
        "$a^n\\to0$（$0<a<1$）",
        "根号和的增长为 $O(\\sqrt n)$，故 $n$ 次根趋于 $1$",
        "对 $n!$ 取对数：$\\ln(n!)/n^2\\to0$"
      ],
      "solutions": [
        {
          "name": "逐项验证",
          "steps": [
            "① 令 $u=x\\sin(1/x)$，在 $u\\ne0$ 的趋近点上有 $\\sin u/u\\to1$，正确。",
            "② $0<a<1$ 时 $a^n\\to0$，故 $1-a^n\\to1$，正确。",
            "③ 括号和介于 $1$ 与 $2\\sqrt n$ 之间，而 $(2\\sqrt n)^{1/n}\\to1$，故原极限为 $1$，正确。",
            "④ $\\ln((n!)^{1/n^2})=\\frac1{n^2}\\ln(n!)$，由 $\\ln(n!)\\le n\\ln n$ 得该式 $\\le\\frac{\\ln n}{n}\\to0$，故极限为 $e^0=1$，正确。",
            "四项均正确，选 A。"
          ]
        }
      ],
      "pitfalls": [
        "① 中错误地把分母在某些点为零视为极限不存在",
        "③ 中只观察被开方数发散，没有看根指数也增长",
        "④ 中把 $n!$ 的增量误当成线性增长。"
      ],
      "related": [
        "§2.3 数列极限",
        "§3.6 重要极限"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "2025-QZ-05",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第5题",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "下列关于极限计算正确的是（不定项）\\nA. $\\displaystyle\\lim_{x\\to0}(\\sqrt{\\cos2x})^{1/x^2}=e^{-1}$；\\nB. $\\displaystyle\\lim_{x\\to+\\infty}\\left(\\frac{2x+3}{2x+1}\\right)^x=e$；\\nC. $\\displaystyle\\lim_{x\\to0}\\left(\\frac{3x-1}{x-1}\\right)^{1/x}=e^{-2}$；\\nD. $\\displaystyle\\lim_{x\\to+\\infty}(1+x)^{1/x}=e$。",
      "type": "多项选择题",
      "topics": [
        "1^∞ 型极限",
        "取对数",
        "重要极限",
        "等价无穷小"
      ],
      "difficulty": 4,
      "tags": [
        "2025小测",
        "不定项",
        "1^∞",
        "取对数"
      ],
      "right_answer": "A、B、C",
      "key_points": [
        "幂指型极限统一用 $\\ln L=\\lim v\\ln u$",
        "A 中 $\\ln\\cos2x\\sim-2x^2$",
        "C 中 $\\ln\\frac{3x-1}{x-1}\\sim-2x$"
      ],
      "solutions": [
        {
          "name": "逐项取对数",
          "steps": [
            "A：$\\ln L=\\lim_{x\\to0}\\frac{\\ln(\\sqrt{\\cos2x})}{x^2}=\\lim\\frac{\\ln\\cos2x}{2x^2}=-1$，故 $L=e^{-1}$，正确。",
            "B：$\\ln L=\\lim x\\ln(1+\\frac2{2x+1})=1$，故 $L=e$，正确。",
            "C：$\\frac{3x-1}{x-1}=\\frac{1-3x}{1-x}$，$\\ln L=\\lim\\frac{\\ln(1-3x)-\\ln(1-x)}x=-3+1=-2$，故 $L=e^{-2}$，正确。",
            "D：$\\ln L=\\lim\\frac{\\ln(1+x)}x=0$，故 $L=1$，不是 $e$，错误。",
            "正确答案为 A、B、C。"
          ]
        }
      ],
      "pitfalls": [
        "把 $(1+x)^{1/x}$ 在 $x\\to0$ 的重要极限直接搬到 $x\\to+\\infty$",
        "A 中漏掉根号带来的 $\\frac12$",
        "C 中把 $\\ln\\frac{3x-1}{x-1}$ 的极限误算为 $3$ 或 $1$。"
      ],
      "related": [
        "§3.6 重要极限",
        "题库 2025-MT-08"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "2025-QZ-06",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第6题",
      "chapter": "第一章 函数与极限",
      "section": "§1.5 两个重要极限",
      "statement": "极限 $\\displaystyle\\lim_{x\\to+\\infty}x\\left(\\sqrt[5]{x^5+10x^3-7}-\\sqrt[3]{x^3-3x+4}\\right)=$_____。\\nA. $\\frac{23}{15}$　B. $3$　C. $\\frac{16}{15}$　D. $2$。",
      "type": "单选题",
      "topics": [
        "广义二项式展开",
        "渐近展开",
        "根式差"
      ],
      "difficulty": 4,
      "tags": [
        "2025小测",
        "渐近展开",
        "根式差",
        "单选"
      ],
      "right_answer": "B. $3$",
      "key_points": [
        "分别提出 $x$ 后做 $(1+u)^a=1+au+o(u)$",
        "两次展开的一次项分别是 $2/x^2$ 与 $-1/x^2$",
        "差值乘以外层 $x$ 得到 $3$"
      ],
      "solutions": [
        {
          "name": "根式渐近展开",
          "steps": [
            "$\\sqrt[5]{x^5+10x^3-7}=x(1+10/x^2-7/x^5)^{1/5}=x+2/x+o(1/x)$。",
            "$\\sqrt[3]{x^3-3x+4}=x(1-3/x^2+4/x^3)^{1/3}=x-1/x+o(1/x)$。",
            "两式相减得 $3/x+o(1/x)$。",
            "乘以外层 $x$，极限为 $3$，选 B。"
          ]
        }
      ],
      "pitfalls": [
        "只保留 $x-x=0$，忽略下一阶项",
        "把 $(1+u)^{1/5}$ 的系数 $1/5$ 漏掉",
        "把第二个根式的一次项符号算反。"
      ],
      "related": [
        "§3.5 无穷小阶的比较",
        "题库 2025-QZ-04"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "错-1-4.3(3)",
      "source": "第一章作业 习题1-4 第3题(3)",
      "chapter": "第一章 函数与极限",
      "section": "§1.7 函数连续的概念",
      "statement": "指出 $f(x)=e^{1/x}$ 的间断点，并判断其类型。",
      "type": "讨论题",
      "topics": [
        "间断点的分类",
        "第一类（可去、跳跃）与第二类（无穷、振荡）",
        "单侧极限的求法"
      ],
      "difficulty": 3,
      "tags": [
        "错题",
        "间断点分类",
        "经典反例"
      ],
      "my_answer": "跳跃间断点",
      "right_answer": "$x=0$ 是**第二类无穷间断点**",
      "error_analysis": "跳跃间断点要求**两个单侧极限都存在**（且不相等）。而这里 $\\lim\\limits_{x\\to0^+}e^{1/x}=+\\infty$——右极限根本不存在，所以不是第一类。我只写了类型结论、没写单侧极限，错误因此没被自己发现。",
      "key_points": [
        "判类型**必须先把两个单侧极限求出来**，再对照定义分类",
        "$x\\to0^+$ 时 $1/x\\to+\\infty$，$e^{1/x}\\to+\\infty$；$x\\to0^-$ 时 $1/x\\to-\\infty$，$e^{1/x}\\to0$",
        "分类口诀：两侧都有限但不等 → 跳跃；一侧为 $\\infty$ → 无穷（第二类）；一列点振荡无极限 → 振荡（第二类）；两侧相等但 $\\ne f(x_0)$ → 可去"
      ],
      "solutions": [
        {
          "name": "标准流程",
          "steps": [
            "$f$ 在 $x=0$ 无定义，故 $x=0$ 是间断点。",
            "算右极限：$\\lim\\limits_{x\\to0^+}e^{1/x}=+\\infty$（因 $1/x\\to+\\infty$）。",
            "算左极限：$\\lim\\limits_{x\\to0^-}e^{1/x}=0$（因 $1/x\\to-\\infty$）。",
            "右极限不是有限数（极限不存在），故 $x=0$ 是**第二类无穷间断点**。"
          ]
        }
      ],
      "pitfalls": [
        "只写结论不写单侧极限",
        "把「一侧为 $\\infty$」误判为跳跃——跳跃要求两侧极限都是有限数"
      ],
      "related": [
        "题库题目 1-3.5(4)（同一函数的极限不存在）",
        "题库易错点 E-004"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "错-1-综.17",
      "source": "第一章作业 第一章综合题 第17题",
      "chapter": "第一章 函数与极限",
      "section": "§1.7 函数连续的概念",
      "statement": "设 $f(x)=\\dfrac{\\sqrt{1+\\sin x+\\sin^2x}-(\\alpha+\\beta\\sin x)}{\\sin^2x}$ 在 $x=0$ 处为可去间断点，求 $\\alpha,\\beta$。",
      "type": "计算题（含待定常数）",
      "topics": [
        "可去间断点的充要条件",
        "两个单侧极限相等",
        "有理化",
        "等价量替换",
        "充分性验证"
      ],
      "difficulty": 4,
      "tags": [
        "错题",
        "只求必要条件",
        "待定常数"
      ],
      "my_answer": "$\\alpha=1,\\ \\beta=\\dfrac12$（答案正确，但推导缺一步、也没回代验证）",
      "right_answer": "$\\alpha=1,\\ \\beta=\\dfrac12$",
      "error_analysis": "① 由「两个单侧极限相等」到 $2\\beta=1$ 中间少了关键一步：应先**两式相减保留 $t$**，得 $t\\left[\\sqrt{t^2+t+1}-\\sqrt{t^2-t+1}-2\\beta\\right]\\to0$，再由括号内 $\\to1-2\\beta$ 才得 $2\\beta=1$——我直接把 $t$ 约掉了，逻辑上有跳跃；② **只求了必要条件，没有回代验证充分性**。",
      "key_points": [
        "可去间断点的条件：两个单侧极限都存在、相等且为有限数（与 $f(0)$ 无关，$f$ 在该点本无定义）",
        "令 $t=\\sin x$（$x\\to0^\\pm$ 时 $t\\to0^\\pm$），分母 $t^2$，用 $\\sqrt{1+t+t^2}-(\\alpha+\\beta t)$",
        "为使极限有限，需 $\\alpha=1$（否则分子 $\\to1-\\alpha\\ne0$，商发散）",
        "代入 $\\alpha=1$ 后，分子的线性项系数必须为零，才得 $\\beta=\\dfrac12$",
        "**求参数题的最后一步永远是回代验证**：$\\alpha=1,\\beta=\\frac12$ 时两侧极限都是 $\\dfrac38$，有限且相等，确实是可去间断点"
      ],
      "solutions": [
        {
          "name": "必要条件 + 回代验证",
          "steps": [
            "记 $t=\\sin x$，$x\\to0$ 时 $t\\to0$。原式 $=\\dfrac{\\sqrt{1+t+t^2}-\\alpha-\\beta t}{t^2}$。",
            "若 $\\alpha\\ne1$，分子 $\\to1-\\alpha\\ne0$ 而分母 $\\to0$，商必发散，不是可去间断点。故必须 $\\alpha=1$。",
            "此时用 $\\sqrt{1+u}=1+\\dfrac u2-\\dfrac{u^2}{8}+o(u^2)$（$u=t+t^2$）：分子 $=1+\\dfrac{t+t^2}{2}-\\dfrac{t^2}{8}-1-\\beta t+o(t^2)=\\left(\\dfrac12-\\beta\\right)t+\\dfrac38t^2+o(t^2)$。",
            "要使 $\\dfrac{\\text{分子}}{t^2}$ 有有限极限，一次项系数必须为 0：$\\dfrac12-\\beta=0$，即 $\\beta=\\dfrac12$。",
            "回代验证：$\\alpha=1,\\beta=\\dfrac12$ 时，原式 $=\\dfrac38+o(1)\\to\\dfrac38$，两个单侧极限都是 $\\dfrac38$（有限且相等），确为可去间断点。"
          ]
        }
      ],
      "pitfalls": [
        "只求必要条件就交卷——必须回代验证",
        "由「两侧极限相等」到方程组时跳过中间的极限论证"
      ],
      "related": [
        "题库易错点 E-008（求参数必须回代验证）",
        "题库题目 1-4.12(2)"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "2025-MT-13",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第13题",
      "chapter": "第一章 函数与极限",
      "section": "§1.7 函数连续的概念",
      "statement": "设 $f(x)=\\begin{cases}|x|^\\alpha\\sin(x^2),&x\\ne0,\\\\0,&x=0.\\end{cases}$ 问 $\\alpha$ 取何值时，$f(x)$ 在 $x=0$ 处连续？可导？一阶导数连续？",
      "type": "分类讨论",
      "topics": [
        "连续性",
        "可导性",
        "导函数连续性",
        "幂函数与振荡"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "参数讨论",
        "连续",
        "可导"
      ],
      "key_points": [
        "连续：$|x|^\\alpha\\sin x^2$ 的阶为 $|x|^{\\alpha+2}$",
        "可导：差商阶为 $|x|^{\\alpha+1}$",
        "导数连续：由 $f'$ 的两项阶均为 $|x|^{\\alpha+1}$"
      ],
      "solutions": [
        {
          "name": "按阶数分类",
          "steps": [
            "因 $\\sin(x^2)\\sim x^2$，$|f(x)|=O(|x|^{\\alpha+2})$。故 $f$ 在 $0$ 连续当且仅当 $\\alpha+2>0$，即 $\\alpha>-2$。",
            "当 $\\alpha>-2$ 时，差商 $\\dfrac{f(h)-f(0)}h=|h|^\\alpha\\dfrac{\\sin h^2}{h}=O(|h|^{\\alpha+1})$，故可导当且仅当 $\\alpha>-1$，且 $f'(0)=0$。",
            "当 $x\\ne0$ 时，$f'(x)=\\alpha x|x|^{\\alpha-2}\\sin(x^2)+2x|x|^\\alpha\\cos(x^2)$。",
            "当 $\\alpha>-1$ 时，两项均为 $O(|x|^{\\alpha+1})$，所以 $f'(x)\\to0=f'(0)$，一阶导数连续。",
            "结论：$\\alpha>-2$ 时连续；$\\alpha>-1$ 时可导；$\\alpha>-1$ 时一阶导数连续。"
          ]
        }
      ],
      "pitfalls": [
        "只比较 $\\alpha$ 与 $0$，忽略 $\\sin(x^2)$ 已经提供二阶零点",
        "可导性条件与连续性条件混用",
        "求 $|x|^\\alpha$ 的导数时漏掉符号或绝对值。"
      ],
      "related": [
        "§4.1 连续与可导",
        "§2.1 导数定义"
      ],
      "added": "2026-10-19",
      "right_answer": "$\\alpha>-2$ 时连续；$\\alpha>-1$ 时可导，且一阶导数连续。"
    },
    {
      "id": "2025-QZ-08",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第8题",
      "chapter": "第一章 函数与极限",
      "section": "§1.7 函数连续的概念",
      "statement": "下列陈述正确的是（不定项）\\nA. 若 $f$ 在 $[a,b]$ 上连续，最小值和最大值分别为 $m,M$，则值域为 $[m,M]$；\\nB. 若 $f$ 在 $[a,b]$ 上只有第一类间断点，则 $f$ 在 $[a,b]$ 上有界；\\nC. 若定义在 $[a,b]$ 上的 $f$ 的值域是区间 $[m,n]$，则 $f$ 在 $[a,b]$ 上连续；\\nD. 若 $f$ 在 $(a,b)$ 内连续，且 $f(a+0),f(b-0)$ 均存在，则 $f$ 在 $(a,b)$ 内有界。",
      "type": "多项选择题",
      "topics": [
        "连续函数性质",
        "介值定理",
        "有界性",
        "间断点"
      ],
      "difficulty": 4,
      "tags": [
        "2025小测",
        "不定项",
        "连续",
        "有界"
      ],
      "right_answer": "A、D",
      "key_points": [
        "闭区间连续函数由最值定理和介值定理得到值域为 $[m,M]$",
        "值域为区间不能反推连续",
        "端点单侧极限存在可连续延拓到闭区间"
      ],
      "solutions": [
        {
          "name": "逐项判定",
          "steps": [
            "A 正确：连续函数取到最小值、最大值，并由介值定理取遍中间值。",
            "B 错误：可在 $1/n$ 处取值为 $n$、其余为 $0$，每个间断点均为可去型，但函数无界。",
            "C 错误：值域是区间不保证连续，例如在一点改变取值可破坏连续性。",
            "D 正确：补充端点值后得到 $[a,b]$ 上的连续函数，故有界。",
            "正确答案为 A、D。"
          ]
        }
      ],
      "pitfalls": [
        "认为值域是区间就一定连续",
        "忽略第一类间断点也可能无限多个并导致无界",
        "D 中没有利用端点极限进行连续延拓。"
      ],
      "related": [
        "§4.3 闭区间连续函数性质"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "2025-QZ-10",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第10题",
      "chapter": "第一章 函数与极限",
      "section": "§1.7 函数连续的概念",
      "statement": "函数 $f(x)=|x-1|^{1/[x(x-2)]}$ 的第一类间断点个数为（　）。\\nA. 0　B. 1　C. 2　D. 3。",
      "type": "单选题",
      "topics": [
        "间断点分类",
        "单侧极限",
        "指数型函数"
      ],
      "difficulty": 4,
      "tags": [
        "2025小测",
        "间断点",
        "单侧极限",
        "单选"
      ],
      "right_answer": "C. 2",
      "key_points": [
        "定义域排除 $x=0,2$；还要检查 $x=1$",
        "$x=0,2$ 两侧极限均为 $\\sqrt e$，为可去间断点",
        "$x=1$ 时 $f\\sim1/|x-1|\\to+\\infty$，为第二类间断点"
      ],
      "solutions": [
        {
          "name": "逐点求单侧极限",
          "steps": [
            "在 $x=0$ 附近，$\\ln|x-1|\\sim-x$，且 $\\frac1{x(x-2)}\\sim-\\frac1{2x}$，乘积趋于 $\\frac12$，故双侧极限为 $\\sqrt e$。",
            "在 $x=2$ 附近，令 $x=2+h$，$\\ln|x-1|\\sim h$，$\\frac1{x(x-2)}\\sim\\frac1{2h}$，乘积趋于 $\\frac12$，双侧极限也为 $\\sqrt e$。",
            "因此 $x=0,2$ 是可去间断点，属于第一类。",
            "在 $x=1$ 处，指数为 $-1$，$f(x)=1/|x-1|\\to+\\infty$，单侧极限为无穷，属第二类间断点。",
            "所以第一类间断点有 $2$ 个，选 C。"
          ]
        }
      ],
      "pitfalls": [
        "把 $x=1$ 误认为连续点",
        "把趋于无穷的间断点归入第一类",
        "没有分别考察 $x\\to0^\\pm$ 和 $x\\to2^\\pm$。"
      ],
      "related": [
        "§4.1 间断点分类"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "错-1-4.9(3)",
      "source": "第一章作业 习题1-4 第9题(3)",
      "chapter": "第一章 函数与极限",
      "section": "§1.8 闭区间上连续函数的性质",
      "statement": "证明方程 $x-\\varepsilon\\sin x=1$（$0<\\varepsilon<1$）有且仅有一个实根。",
      "type": "证明题",
      "topics": [
        "零点定理（根的存在定理）",
        "介值定理",
        "根的唯一性",
        "和差化积"
      ],
      "difficulty": 4,
      "tags": [
        "错题",
        "超纲用导数",
        "推理无效"
      ],
      "my_answer": "用 $f'(x)=1-\\varepsilon\\cos x>0$ 证单调；存在性写「$\\because1\\in(-\\infty,+\\infty)\\therefore$至少一根」",
      "right_answer": "存在性用零点定理；唯一性用和差化积导出的 $|\\sin x_1-\\sin x_2|\\le|x_1-x_2|$",
      "error_analysis": "① 导数属于**第二章**内容，本章超纲；② 「$1\\in(-\\infty,+\\infty)$ 故作差以后必有零点」是**无效推理**——存在性必须由「找到两点使函数值异号」+ 零点定理给出。",
      "key_points": [
        "存在性：令 $f(x)=x-\\varepsilon\\sin x-1$。取 $x=0$ 得 $f(0)=-1<0$；取 $x=2$ 得 $f(2)=1-\\varepsilon\\sin2>1-1=0$。由零点定理，$(0,2)$ 内至少一根",
        "唯一性：反设有两根 $x_1<x_2$。由 $f(x_1)=f(x_2)=0$ 得 $x_1-x_2=\\varepsilon(\\sin x_1-\\sin x_2)$",
        "两边取绝对值并用和差化积：$|\\sin x_1-\\sin x_2|=2\\left|\\cos\\frac{x_1+x_2}{2}\\right|\\left|\\sin\\frac{x_1-x_2}{2}\\right|\\le|x_1-x_2|$",
        "于是 $|x_1-x_2|=\\varepsilon|\\sin x_1-\\sin x_2|\\le\\varepsilon|x_1-x_2|<|x_1-x_2|$（因 $0<\\varepsilon<1$），矛盾",
        "所以至多一根；结合存在性，恰有一根"
      ],
      "solutions": [
        {
          "name": "零点定理 + 和差化积（第一章允许）",
          "steps": [
            "令 $f(x)=x-\\varepsilon\\sin x-1$，$f$ 在 $\\mathbb R$ 上连续。",
            "$f(0)=-1<0$；$f(2)=1-\\varepsilon\\sin2\\ge1-\\varepsilon>0$（因 $|\\sin2|<1$）。",
            "由零点定理，存在 $\\xi\\in(0,2)$ 使 $f(\\xi)=0$，即至少有一根。",
            "设另有一根 $\\eta\\ne\\xi$，由 $f(\\xi)=f(\\eta)=0$ 相减得 $\\xi-\\eta=\\varepsilon(\\sin\\xi-\\sin\\eta)$。",
            "取绝对值并用 $|\\sin\\xi-\\sin\\eta|\\le|\\xi-\\eta|$（和差化积 + $|\\sin u|\\le|u|$），得 $|\\xi-\\eta|\\le\\varepsilon|\\xi-\\eta|<|\\xi-\\eta|$，矛盾。",
            "故根唯一。"
          ]
        }
      ],
      "pitfalls": [
        "用导数判断单调——第二章才学",
        "把「区间是 $(-\\infty,+\\infty)$」当成存在性的理由"
      ],
      "related": [
        "题库易错点 E-006",
        "§4.3 零点定理",
        "§3.6 和差化积"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "2025-MT-03",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第3题",
      "chapter": "第二章 导数与微分",
      "section": "§2.1 导数的概念",
      "statement": "设 $f(x)$ 在 $x=1$ 处可导，且 $f(1)=0$，$f'(1)=-2$，求 $\\displaystyle\\lim_{x\\to0}\\dfrac{x f(\\cos x)}{e^{\\tan x}-e^{\\sin x}}$。",
      "type": "计算题",
      "topics": [
        "导数定义",
        "等价无穷小",
        "分母差型处理",
        "指数函数"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "导数定义",
        "等价量",
        "差型"
      ],
      "key_points": [
        "$f(\\cos x)=f(1)+f'(1)(\\cos x-1)+o(x^2)$",
        "$e^{\\tan x}-e^{\\sin x}=e^{\\sin x}(e^{\\tan x-\\sin x}-1)$",
        "$\\tan x-\\sin x\\sim\\frac{x^3}{2}$"
      ],
      "solutions": [
        {
          "name": "局部展开 + 等价量",
          "steps": [
            "$\\cos x-1\\sim-\\frac{x^2}{2}$，由 $f(1)=0$、$f'(1)=-2$，得 $f(\\cos x)\\sim(-2)\\left(-\\frac{x^2}{2}\\right)=x^2$。",
            "$\\tan x-\\sin x=\\sin x\\left(\\frac1{\\cos x}-1\\right)\\sim\\frac{x^3}{2}$。",
            "$e^{\\tan x}-e^{\\sin x}=e^{\\sin x}(e^{\\tan x-\\sin x}-1)\\sim\\frac{x^3}{2}$。",
            "原式 $\\sim\\frac{x\\cdot x^2}{x^3/2}=2$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $f(\\cos x)$ 直接替换成 $f(1)=0$，丢失主导项",
        "把 $\\tan x-\\sin x$ 误当成 $0$",
        "指数差直接等价成 $\\tan x-\\sin x$ 时忘记说明整体趋于零。"
      ],
      "related": [
        "§3.6 等价无穷小替换",
        "题库易错点 E-001"
      ],
      "added": "2026-10-19",
      "right_answer": "原式 $\\sim\\frac{x\\cdot x^2}{x^3/2}=2$。"
    },
    {
      "id": "2025-QZ-01",
      "source": "2025–2026 XRY&ZJF 微积分秋冬第一次小测第1题",
      "chapter": "第二章 导数与微分",
      "section": "§2.1 导数的概念",
      "statement": "设 $f(x)$ 是周期为 $4$ 的偶函数，且 $f(x)=x^2-2x\\ (0\\le x\\le2)$，则 $f'\\left(\\frac72\\right)=$_____。\\nA. $-2$　B. $-1$　C. $2$　D. $1$。",
      "type": "单选题",
      "topics": [
        "周期函数",
        "偶函数",
        "导数",
        "对称性"
      ],
      "difficulty": 2,
      "tags": [
        "2025小测",
        "周期",
        "偶函数",
        "单选"
      ],
      "right_answer": "D. $1$",
      "key_points": [
        "$f'(x+4)=f'(x)$",
        "偶函数的导数满足 $f'(-x)=-f'(x)$",
        "$f'(x)=2x-2$（$0<x<2$）"
      ],
      "solutions": [
        {
          "name": "利用周期与奇偶性",
          "steps": [
            "由周期 $4$，$f'\\left(\\frac72\\right)=f'\\left(-\\frac12\\right)$。",
            "由 $f$ 为偶函数，$f'\\left(-\\frac12\\right)=-f'\\left(\\frac12\\right)$。",
            "在 $(0,2)$ 上 $f'(x)=2x-2$，故 $f'\\left(\\frac12\\right)=-1$。",
            "于是 $f'\\left(\\frac72\\right)=1$。"
          ]
        }
      ],
      "pitfalls": [
        "直接把 $7/2$ 代入 $x^2-2x$，超出给定区间",
        "偶函数导数误认为仍是偶函数。"
      ],
      "related": [
        "§2.1 导数的概念"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "2025-MT-10",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第10题",
      "chapter": "第二章 导数与微分",
      "section": "§2.2 微分中值定理",
      "statement": "设函数 $f(x)$ 在 $[0,2]$ 上连续，在 $(0,2)$ 上可导，且 $f(0)=0$，$f(1)=f(2)=e$。证明：\\n（1）存在 $\\xi\\in(0,2)$ 使 $f(\\xi)=2$；\\n（2）存在 $\\xi\\in(0,2)$ 使 $f'(\\xi)+f(\\xi)=e$。",
      "type": "证明题",
      "topics": [
        "介值定理",
        "Rolle 中值定理",
        "辅助函数"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "中值定理",
        "辅助函数",
        "证明题"
      ],
      "key_points": [
        "（1）在 $0$ 与 $1$ 两点间用介值定理",
        "（2）构造 $F(x)=e^x[f(x)-e]$ 或 $e^xf(x)-e^{x+1}$",
        "$F(1)=F(2)=0$，再用 Rolle 定理"
      ],
      "solutions": [
        {
          "name": "介值定理 + Rolle",
          "steps": [
            "（1）$f(0)=0<2<e=f(1)$，由连续函数的介值定理，存在 $\\xi\\in(0,1)\\subset(0,2)$ 使 $f(\\xi)=2$。",
            "（2）令 $F(x)=e^x[f(x)-e]$。因 $f(1)=f(2)=e$，有 $F(1)=F(2)=0$。",
            "$F$ 在 $[1,2]$ 上满足 Rolle 定理条件，故存在 $\\xi\\in(1,2)$ 使 $F'(\\xi)=0$。",
            "$F'(x)=e^x[f(x)-e+f'(x)]$，$e^\\xi>0$，所以 $f'(\\xi)+f(\\xi)=e$。"
          ]
        }
      ],
      "pitfalls": [
        "第（2）问直接对 $f$ 用 Rolle，忽略 $f(1)=f(2)$ 只能得到 $f'=0$",
        "辅助函数构造后不检查两端相等",
        "把 $(0,2)$ 与 $(1,2)$ 的区间范围混淆。"
      ],
      "related": [
        "§2.2 微分中值定理",
        "§4.3 零点定理"
      ],
      "added": "2026-10-19",
      "right_answer": "（1）$f(0)=0<2<e=f(1)$，由连续函数的介值定理，存在 $\\xi\\in(0,1)\\subset(0,2)$ 使 $f(\\xi)=2$。；（2）令 $F(x)=e^x[f(x)-e]$。因 $f(1)=f(2)=e$，有 $F(1)=F(2)=0$。"
    },
    {
      "id": "2025-MT-04",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第4题",
      "chapter": "第二章 导数与微分",
      "section": "§2.3 隐函数与高阶导数",
      "statement": "设函数 $y=f(x)$ 由方程 $x^2y+\\sin(xy)=\\ln(1+y)$ 确定，求 $dy$。",
      "type": "计算题",
      "topics": [
        "隐函数求导",
        "一阶微分",
        "链式法则",
        "对数函数"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "隐函数",
        "微分",
        "计算题"
      ],
      "key_points": [
        "两边同时求微分比先解出 $y'$ 更直接",
        "记住 $d(\\sin u)=\\cos u\\,du$ 与 $d\\ln(1+y)=\\frac{dy}{1+y}$"
      ],
      "solutions": [
        {
          "name": "两边取微分",
          "steps": [
            "$d(x^2y)=2xy\\,dx+x^2\\,dy$。",
            "$d\\sin(xy)=\\cos(xy)(y\\,dx+x\\,dy)$。",
            "$d\\ln(1+y)=\\dfrac{dy}{1+y}$。",
            "代入原方程并移项：$\\left[2xy+y\\cos(xy)\\right]dx+\\left[x^2+x\\cos(xy)-\\frac1{1+y}\\right]dy=0$。",
            "因此 $dy=-\\dfrac{2xy+y\\cos(xy)}{x^2+x\\cos(xy)-\\frac1{1+y}}\\,dx$。"
          ]
        }
      ],
      "pitfalls": [
        "对 $\\sin(xy)$ 求导时漏掉 $y$ 或 $x$ 的一项",
        "把 $\\ln(1+y)$ 的导数写成 $\\frac1y$",
        "只求 $y'$ 而没有按要求写成 $dy$。"
      ],
      "related": [
        "§2.3 隐函数求导",
        "题库 §2.4 微分"
      ],
      "added": "2026-10-19",
      "right_answer": "因此 $dy=-\\dfrac{2xy+y\\cos(xy)}{x^2+x\\cos(xy)-\\frac1{1+y}}\\,dx$。"
    },
    {
      "id": "2025-MT-05",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第5题",
      "chapter": "第二章 导数与微分",
      "section": "§2.3 隐函数与高阶导数",
      "statement": "设 $x=\\ln\\left(t+\\sqrt{1+t^2}\\right)$，$y=\\arctan t$，求 $\\dfrac{dx}{dy}$ 和 $\\dfrac{d^2x}{dy^2}$。",
      "type": "计算题",
      "topics": [
        "参数方程求导",
        "反双曲函数",
        "二阶导数"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "参数方程",
        "二阶导",
        "链式法则"
      ],
      "key_points": [
        "$\\frac{dx}{dt}=\\frac1{\\sqrt{1+t^2}}$，$\\frac{dy}{dt}=\\frac1{1+t^2}$",
        "$\\frac{dx}{dy}=\\frac{dx/dt}{dy/dt}$",
        "二阶导要再对 $t$ 求导后除以 $dy/dt$"
      ],
      "solutions": [
        {
          "name": "参数方程求导",
          "steps": [
            "$\\dfrac{dx}{dt}=\\dfrac1{\\sqrt{1+t^2}}$，$\\dfrac{dy}{dt}=\\dfrac1{1+t^2}$。",
            "$\\dfrac{dx}{dy}=\\dfrac{dx/dt}{dy/dt}=\\sqrt{1+t^2}$。",
            "$\\dfrac{d^2x}{dy^2}=\\dfrac{d}{dt}\\left(\\sqrt{1+t^2}\\right)\\Big/\\dfrac{dy}{dt}=\\dfrac{t}{\\sqrt{1+t^2}}\\cdot(1+t^2)=t\\sqrt{1+t^2}$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $\\frac{dx}{dy}$ 直接再对 $y$ 求导而不换链",
        "漏掉 $\\ln(t+\\sqrt{1+t^2})$ 的导数中的根式",
        "混淆 $\\frac{dx}{dy}$ 与 $\\frac{dy}{dx}$。"
      ],
      "related": [
        "§2.3 参数方程与高阶导数"
      ],
      "added": "2026-10-19",
      "right_answer": "$\\dfrac{d^2x}{dy^2}=\\dfrac{d}{dt}\\left(\\sqrt{1+t^2}\\right)\\Big/\\dfrac{dy}{dt}=\\dfrac{t}{\\sqrt{1+t^2}}\\cdot(1+t^2)=t\\sqrt{1+t^2}$。"
    },
    {
      "id": "2025-MT-07",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第7题",
      "chapter": "第二章 导数与微分",
      "section": "§2.3 隐函数与高阶导数",
      "statement": "设 $y=\\arcsin x$，求 $y^{(n)}(0)$。",
      "type": "计算题",
      "topics": [
        "高阶导数",
        "arcsin 的幂级数",
        "递推关系"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "高阶导数",
        "arcsin",
        "归纳"
      ],
      "key_points": [
        "先利用 $y'=1/\\sqrt{1-x^2}$",
        "偶阶导数在 $0$ 处为零，奇阶由幂级数系数给出",
        "结果 $y^{(2m+1)}(0)=((2m-1)!!)^2$"
      ],
      "solutions": [
        {
          "name": "幂级数/递推",
          "steps": [
            "$\\arcsin x=\\sum_{m=0}^{\\infty}\\dfrac{\\binom{2m}{m}}{4^m(2m+1)}x^{2m+1}$。",
            "因此 $x^{2m+1}$ 的系数为 $\\dfrac{((2m-1)!!)^2}{(2m+1)!}$。",
            "由泰勒系数 $y^{(n)}(0)/n!$ 可得：当 $n=2m+1$ 时，$y^{(n)}(0)=((2m-1)!!)^2$；当 $n=2m$ 时，$y^{(n)}(0)=0$。",
            "其中约定 $(-1)!!=1$。"
          ]
        }
      ],
      "pitfalls": [
        "把奇数阶导数误写成 $(2m-1)!!$",
        "忘记偶数阶导数为零",
        "直接对根式反复求导但没有处理 $x=0$ 的符号与阶数。"
      ],
      "related": [
        "§2.3 高阶导数",
        "§2.2 泰勒展开"
      ],
      "added": "2026-10-19",
      "right_answer": "其中约定 $(-1)!!=1$。"
    },
    {
      "id": "2025-MT-11",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第11题",
      "chapter": "第二章 导数与微分",
      "section": "§2.3 隐函数与高阶导数",
      "statement": "设 $y=f(x)$ 是由方程 $x^3+e^{xy}-\\sin3x+y=2$ 确定的隐函数，求导数 $f'(0)$、$f''(0)$ 及极限 $\\displaystyle\\lim_{n\\to+\\infty}n\\left[f\\left(\\frac1n\\right)-1\\right]$。",
      "type": "综合题",
      "topics": [
        "隐函数求导",
        "二阶导数",
        "导数定义",
        "极限"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "隐函数",
        "二阶导",
        "导数定义"
      ],
      "key_points": [
        "先由原方程求 $f(0)=1$",
        "一阶隐式求导后代点",
        "二阶求导时注意 $e^{xy}$ 的链式法则",
        "极限 $n[f(1/n)-1]\\to f'(0)$"
      ],
      "solutions": [
        {
          "name": "隐式求导 + 导数定义",
          "steps": [
            "令 $x=0$，得 $1+1+y=2$，故 $f(0)=1$。",
            "两边求导：$3x^2+e^{xy}(y+xy')-3\\cos3x+y'=0$。代入 $(0,1)$：$1-3+y'=0$，故 $f'(0)=2$。",
            "再求导：$6x+e^{xy}(y+xy')^2+e^{xy}(2y'+xy'')+9\\sin3x+y''=0$。代入 $(0,1,2)$：$1+4+y''=0$，故 $f''(0)=-5$。",
            "由导数定义，$n[f(1/n)-1]=\\dfrac{f(1/n)-f(0)}{1/n}\\to f'(0)=2$。"
          ]
        }
      ],
      "pitfalls": [
        "忘记由原方程先求出 $f(0)$",
        "对 $e^{xy}$ 求二阶导时漏掉 $(y+xy')^2$",
        "把极限误当成 $f''(0)$。"
      ],
      "related": [
        "§2.3 隐函数与高阶导数",
        "§2.1 导数定义"
      ],
      "added": "2026-10-19",
      "right_answer": "由导数定义，$n[f(1/n)-1]=\\dfrac{f(1/n)-f(0)}{1/n}\\to f'(0)=2$。"
    },
    {
      "id": "2025-MT-06",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第6题",
      "chapter": "第二章 导数与微分",
      "section": "§2.4 导数与微分的应用",
      "statement": "求螺旋线 $C:r=e^{\\theta}$ 在 $\\theta=\\dfrac{\\pi}{2}$ 处的切线方程。",
      "type": "计算题",
      "topics": [
        "极坐标曲线",
        "切线斜率",
        "参数方程"
      ],
      "difficulty": 3,
      "tags": [
        "2025期中",
        "极坐标",
        "切线",
        "几何应用"
      ],
      "key_points": [
        "极坐标切线斜率 $\\frac{dy}{dx}=\\frac{r'\\sin\\theta+r\\cos\\theta}{r'\\cos\\theta-r\\sin\\theta}$",
        "先求点坐标，再代入斜率"
      ],
      "solutions": [
        {
          "name": "极坐标参数化",
          "steps": [
            "$x=r\\cos\\theta=e^{\\theta}\\cos\\theta$，$y=e^{\\theta}\\sin\\theta$。",
            "在 $\\theta=\\frac\\pi2$ 时，点为 $\\left(0,e^{\\pi/2}\\right)$。",
            "切线斜率 $\\frac{dy}{dx}=\\frac{e^\\theta(\\sin\\theta+\\cos\\theta)}{e^\\theta(\\cos\\theta-\\sin\\theta)}$，在 $\\theta=\\frac\\pi2$ 处为 $-1$。",
            "切线方程：$y-e^{\\pi/2}=-(x-0)$，即 $x+y=e^{\\pi/2}$。"
          ]
        }
      ],
      "pitfalls": [
        "把 $r=e^{\\pi/2}$ 直接当成直角坐标点的 $y$ 坐标",
        "斜率公式分子分母写反",
        "将极坐标的 $r$ 直接当作固定半径求水平切线。"
      ],
      "related": [
        "§2.3 参数方程求导",
        "§2.5 切线问题"
      ],
      "added": "2026-10-19",
      "right_answer": "切线方程：$y-e^{\\pi/2}=-(x-0)$，即 $x+y=e^{\\pi/2}$。"
    },
    {
      "id": "2025-MT-12",
      "source": "2025–2026 微积分（甲/H）Ⅰ秋冬期中第12题",
      "chapter": "第二章 导数与微分",
      "section": "§2.4 导数与微分的应用",
      "statement": "设 $f_n(x)=x^n+2nx-2$（$n$ 为正整数），证明：$f_n(x)=0$ 在 $(0,+\\infty)$ 上有唯一正根 $a_n$，并计算 $\\displaystyle\\lim_{n\\to\\infty}(1+a_n)^n$。",
      "type": "综合题",
      "topics": [
        "单调性",
        "零点定理",
        "数列极限",
        "重要极限"
      ],
      "difficulty": 4,
      "tags": [
        "2025期中",
        "唯一根",
        "零点定理",
        "重要极限"
      ],
      "key_points": [
        "$f_n'(x)=nx^{n-1}+2n>0$，故至多一根",
        "$f_n(0)=-2$，$f_n(1)=2n-1>0$，故恰有一根",
        "$2n a_n=2-a_n^n\\to2$，从而 $n a_n\\to1$",
        "用重要极限 $(1+a_n)^{1/a_n}\\to e$"
      ],
      "solutions": [
        {
          "name": "单调 + 零点 + 夹逼",
          "steps": [
            "$f_n'(x)=nx^{n-1}+2n>0$（$x>0$），所以 $f_n$ 严格递增，至多一根。",
            "$f_n(0)=-2<0$，$f_n(1)=2n-1>0$，由零点定理，存在唯一 $a_n\\in(0,1)$ 使 $f_n(a_n)=0$。",
            "由 $a_n^n+2na_n=2$，且 $0<a_n<1$，得 $a_n^n\\to0$，故 $2na_n\\to2$，即 $na_n\\to1$。",
            "$\\ln(1+a_n)^n=n\\ln(1+a_n)=na_n\\cdot\\dfrac{\\ln(1+a_n)}{a_n}\\to1$。",
            "因此 $\\lim(1+a_n)^n=e$。"
          ]
        }
      ],
      "pitfalls": [
        "只证明存在而不证明唯一，漏掉严格单调",
        "直接说 $a_n\\sim 1/n$ 而不说明 $a_n^n\\to0$",
        "把 $(1+a_n)^n$ 误当成 $e^{na_n^2}$。"
      ],
      "related": [
        "§4.3 零点定理",
        "§3.6 重要极限"
      ],
      "added": "2026-10-19",
      "right_answer": "因此 $\\lim(1+a_n)^n=e$。"
    }
  ],
  "pitfalls": [
    {
      "id": "E-001",
      "title": "等价量替换只能在全部为因式时使用",
      "rule": "用等价无穷小替换时，被替换的部分必须整体作为乘除中的因式；若它处在加减项里（或与别的项相加减），不能单独替换。",
      "why": "等价无穷小只保证 $\\lim\\dfrac{\\alpha}{\\beta}=1$，即 $\\alpha$ 与 $\\beta$ 的「主体部分」相同，两者相差一个高阶无穷小。做减法时主体可能正好互相抵消，剩下的高阶零头反而成为决定极限的「主角」；此时把 $\\alpha$ 换成 $\\beta$，等于把真正起作用的那一项扔掉了。",
      "valid": "$\\lim\\limits_{x\\to 0}\\dfrac{\\sin x}{x}$：$\\sin x$ 是分子整体的因式，可直接替换为 $x$，得 $\\lim\\dfrac{x}{x}=1$ ✓",
      "invalid": "$\\lim\\limits_{x\\to 0}\\dfrac{x-\\sin x}{x^3}$：$x$ 与 $\\sin x$ 是相减关系，若把 $\\sin x$ 换成 $x$ 得 $0$，而实际答案为 $\\dfrac{1}{6}$ ✗",
      "remedy": "① 先做恒等变形（提取公因子、通分、有理化），把式子凑成「因式」形态后再替换；② 或改用更高阶的等价量，如 $x-\\sin x\\sim\\dfrac{x^3}{6}$（$x\\to 0$）；③ 相加减的两个无穷小若不同阶，低阶者为主，可只保留低阶项。",
      "related": [
        "定理4.4（等价无穷小的结论：$\\alpha=\\beta+o(\\beta)$）",
        "§3.5 无穷小量、无穷大量、阶的比较",
        "§3.6 两个重要极限（等价量替换定理）"
      ],
      "added": "2026-10-12"
    },
    {
      "id": "E-002",
      "title": "极限四则运算不能拆开极限不存在的项",
      "rule": "$\\lim(f\\pm g)=\\lim f\\pm\\lim g$、$\\lim(fg)=\\lim f\\cdot\\lim g$ 成立的前提是拆出来的每一项极限都存在（都是有限数）。只要有一项是 $\\infty$ 或不存在，就不能拆。",
      "why": "四则运算法则本质是「两个收敛的量」之间的运算律，前提是 $\\lim f$、$\\lim g$ 都是确定的实数。当某一项的极限是 $\\infty$ 时，它根本不是实数；把 $\\infty$ 当作数参与运算会写出无意义的式子——$\\infty\\cdot 0$、$\\infty-\\infty$、$\\infty/\\infty$ 都是未定式，结果不由法则决定。",
      "valid": "$\\lim\\limits_{x\\to 0}\\Bigl[\\dfrac{\\tan 5x}{\\sin 3x}+\\dfrac{1-\\cos x}{\\sin 3x}\\Bigr]$：两项极限分别为 $\\dfrac{5}{3}$ 与 $0$，都存在，可以拆，得 $\\dfrac{5}{3}$ ✓",
      "invalid": "$\\lim\\limits_{x\\to\\infty}x^2\\sin\\dfrac{1}{x}$：若拆成 $(\\lim x)\\cdot\\lim\\dfrac{\\sin(1/x)}{1/x}$，第一个因子 $\\lim\\limits_{x\\to\\infty}x=\\infty$ 不存在，不能拆。本题正确做法是整体替换 $\\sin\\dfrac1x\\sim\\dfrac1x$，得 $x^2\\cdot\\dfrac1x=x\\to+\\infty$ ✗",
      "remedy": "① 拆之前先逐项检查极限是否存在，都收敛才可拆；② 不能拆时改用整体等价替换、提公因式、有理化、和差化积等恒等变形；③ 遇到 $\\infty-\\infty$、$0\\cdot\\infty$、$\\infty/\\infty$ 一律先变形再求。",
      "related": [
        "§3.2 函数极限的性质（四则运算）",
        "作业练习 B（$\\lim\\limits_{x\\to\\infty}x^2\\sin\\frac1x$，不能在 ∞ 处拆项）",
        "题库易错点 E-001"
      ],
      "added": "2026-10-12"
    },
    {
      "id": "E-003",
      "title": "等价量与展开只在自变量趋于展开点时成立",
      "rule": "使用任何等价量替换或（局部）展开之前，必须先确认**括号里那个量确实趋于该展开点**（通常是趋于 $0$）。$\\sin u\\sim u$、$\\ln(1+u)\\sim u$、$\\cos u\\approx1-\\frac{u^2}{2}$ 等全部只对 $u\\to0$ 成立。",
      "why": "这些等价量都是函数在展开点（通常是 $0$）的**局部**线性/二次主部。当 $u$ 不趋于展开点时，主部形式完全改变：例如 $\\cos t$ 在 $t\\to\\infty$ 时并不趋于 $1-\\frac{t^2}{2}$（它根本没有极限，只是有界振荡），此时那个「二次项」与真实值毫无关系。",
      "valid": "$\\lim\\limits_{x\\to0}\\dfrac{\\sin(\\tan^2x)}{\\sqrt[n]{1+x^2}-1}$：$\\tan^2x\\to0$、$x^2\\to0$，两处都满足条件，得 $\\dfrac{x^2}{x^2/n}=n$ ✓",
      "invalid": "$\\lim\\limits_{x\\to0}\\dfrac{x^2\\cos\\frac1x}{(1+\\cos x)\\ln(1+x)}$ 中把 $\\cos\\frac1x$ 换成 $1-\\frac{1}{2x^2}$：这里 $\\frac1x\\to\\infty$，展开不成立。$x^2\\cos\\frac1x$ 应作有界量乘无穷小 $=o(x)$ ✗",
      "remedy": "① 每次替换前先问一句「括号里的量趋于几？」；② 若该量趋于 $\\infty$，改用「有界量 × 无穷小量」或「提取主项」；③ 若该量趋于某个 $a\\ne0$（如 $x\\to\\pi$ 时的 $mx\\to m\\pi$），应换元 $t=x-a$ 把它化成趋于 $0$。",
      "related": [
        "题库错题 错-1-综.3(1)",
        "题库错题 错-1-3.16(2)",
        "作业 习题1-3 第9(1)题（$\\lim\\limits_{x\\to\\pi}\\frac{\\sin mx}{\\sin nx}$，过程误用 $\\frac{\\sin mx}{mx}\\to1$）",
        "题库知识点「10.14」八、总纲"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "E-004",
      "title": "判断间断点类型必须先写出两个单侧极限",
      "rule": "求间断点并分类时，**必须先把两个单侧极限算出来**（或写出分段表达式），再对照定义下结论。只写类型结论不给过程，等于没有依据。",
      "why": "四类间断点的判据全部建立在单侧极限上：「两侧都有限且相等但不等于函数值」→ 可去；「两侧都有限但不等」→ 跳跃（以上属第一类）；「至少一侧为 $\\infty$」→ 无穷；「振荡无极限」→ 振荡（以上属第二类）。不写出单侧极限，就无法排除其他类别。",
      "valid": "$f(x)=\\arctan\\frac1x$：$\\lim\\limits_{x\\to0^-}=-\\frac\\pi2$、$\\lim\\limits_{x\\to0^+}=\\frac\\pi2$，都有限且不等 ⟹ $x=0$ 是第一类跳跃间断点 ✓",
      "invalid": "$f(x)=e^{1/x}$ 判成「跳跃」：跳跃要求两侧极限都存在，而 $\\lim\\limits_{x\\to0^+}e^{1/x}=+\\infty$ 不存在 ⟹ 实为第二类**无穷**间断点 ✗",
      "remedy": "① 先写出分段表达式或直接算 $f(x_0^-)$、$f(x_0^+)$；② 只要有一侧为 $\\infty$，一律归第二类（无穷型）；③ 两侧极限存在但$\\ne f(x_0)$（或无定义）才是可去；④ 遇 $\\sin\\frac1x$ 这类振荡，另取两串点证明极限不存在。",
      "related": [
        "题库错题 错-1-4.3(3)",
        "题库题目 1-3.5(4)（$e^{1/x}$ 的极限不存在）",
        "§4.1 函数连续的概念"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "E-005",
      "title": "用归结原则构造数列，必须验证它真的具备所需性质",
      "rule": "用归结原则（海涅定理）证明极限不存在时，构造的数列 $\\{x_n\\}$ 必须同时满足：① $x_n\\in\\mathring U(x_0)$（即 $x_n\\ne x_0$）；② $x_n\\to x_0$；③ **函数值确实趋于两个不同的常数**（或确实不收敛）。第 ③ 条要靠数列本身的性质来保证。",
      "why": "很多人看到「有理数 / 无理数」就随手写 $x_0+\\frac1n$、$x_0+\\frac1{\\sqrt n}$，但 $x_0+\\frac1n$ 只在 $x_0$ 为有理数时才有理；而 $\\frac1{\\sqrt n}$ 在 $n$ 为完全平方数时是有理数。性质验证不过关，整个反例就无效。",
      "valid": "证 $D(x)$（Dirichlet 函数）处处无极限：直接用**稠密性**，在 $(x_0,x_0+\\frac1n)$ 内分别取有理数 $r_n$ 与无理数 $s_n$，则 $D(r_n)=1\\to1$、$D(s_n)=0\\to0$ ✓",
      "invalid": "取 $x_n'=x_0+\\frac1n$、$x_n''=x_0+\\frac1{\\sqrt n}$ 并断言「前者有理、后者无理」——对无理数的 $x_0$ 前者也无理；$n=4$ 时后者 $=\\frac12$ 是有理数 ✗",
      "remedy": "① 能不猜显式公式就不猜，优先用**稠密性**等存在性定理「取一串」；② 若一定要写显式公式，逐条验证所需性质在**所有 $n$** 下成立；③ 对导出的两串点再核一遍：$x_n\\to x_0$ 且 $x_n\\ne x_0$ 是否真的满足。",
      "related": [
        "题库错题 错-1-3.2",
        "§3.3 归结原则（海涅定理）"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "E-006",
      "title": "不能引用未证明的结论，也不能用后面章节的工具",
      "rule": "证明过程中引用任何结论，都必须是**本章已经学过并证明过**的。第一章不得使用导数（第二章）与洛必达法则、泰勒展开；也不得引用教材上没有的不等式（如对数平均不等式）。",
      "why": "数学证明是把命题归约到**已知为真**的前提。引用未证结论，等于把待证的东西换了个名字；用超纲工具，在考试中不给分，而且掩盖了对本章方法的训练。",
      "valid": "证明 $x-\\varepsilon\\sin x=1$ 有唯一根：存在性用零点定理（取 $f(0)<0,f(2)>0$）；唯一性用和差化积得 $|\\sin x_1-\\sin x_2|\\le|x_1-x_2|$ 推出矛盾——全程第一章工具 ✓",
      "invalid": "用 $f'(x)=1-\\varepsilon\\cos x>0$ 判断单调（导数属第二章）；引用 $\\dfrac{x_1-x_2}{\\ln x_1-\\ln x_2}>\\sqrt{x_1x_2}$（对数平均不等式，本章未讲） ✗",
      "remedy": "① 写每一步时问自己「这条依据是书上哪一条？」；② 遇到「显然」「由某不等式」而说不出出处的，一律重做；③ 求极限时若想用洛必达，改回「等价量替换 / 提主项 / 有理化 / 和差化积 / 夹逼」。",
      "related": [
        "题库错题 错-1-4.9(3)",
        "题库错题 错-1-3.6",
        "题库错题 错-1-4.12(1)"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "E-007",
      "title": "约分和比较系数时，别丢掉最低次非零项的系数",
      "rule": "遇到 $0/0$ 型做「展开后约掉公共零因子」时，**决定极限值的是最低次非零项，而不是最高次项**。约分前后都要把最低次非零项的**系数**写清楚。",
      "why": "极限只看主部（最低次非零项）。把展开简写成「$t^{n-1}+\\cdots+1$」会让人误以为最低次项系数是 $1$，于是答案丢掉一个因子。",
      "valid": "$\\lim\\limits_{x\\to1}\\dfrac{x^3-3x+2}{(x-1)^2}$：令 $t=x-1$，分子 $=(1+t)^3-3t-2=3t^2+t^3$，除以 $t^2$ 得 $3$，即 $\\dfrac{n(n+1)}{2}\\big|_{n=2}=3$ ✓",
      "invalid": "$\\lim\\limits_{x\\to1}\\dfrac{x^{n+1}-(n+1)x+n}{(x-1)^2}$：分子 $=C_{n+1}^{2}t^2+C_{n+1}^{3}t^3+\\cdots$，最低次非零项系数是 $C_{n+1}^{2}=\\dfrac{n(n+1)}{2}$。若写成「$t^{n-1}+\\cdots+1$」就会答成 $1$ ✗",
      "remedy": "① 展开后**逐项写出系数**，至少写到 $t^2$ 项；② 约分前明确标出「最低次非零项」是哪一项；③ 做完用 $n=2$ 这类小值做数值自检。",
      "related": [
        "题库错题 错-1-3.8(8)",
        "同类型：作业 习题1-3 第8(2)题（展开后约 x² 得 10）"
      ],
      "added": "2026-10-16"
    },
    {
      "id": "E-008",
      "title": "求待定参数的题，只求必要条件是不够的",
      "rule": "凡「已知某极限/连续性/可去间断点成立，求参数 $a,b$」的题，由条件解出参数只是**必要条件**，**必须代回原式验证充分性**，才能确认答案正确。",
      "why": "由「条件成立」推出「参数取值」是单向的。可能存在多组解，也可能某组值代回后条件并不成立（例如极限仍发散、或极限值与要求不符）。验证花不了一分钟，却是这类题唯一可能失分的地方。",
      "valid": "求 $f(x)=\\dfrac{\\sqrt{1+\\sin x+\\sin^2x}-(\\alpha+\\beta\\sin x)}{\\sin^2x}$ 在 $x=0$ 可去时的 $\\alpha,\\beta$：得 $\\alpha=1,\\beta=\\dfrac12$ 后，回代算得两侧极限都是 $\\dfrac38$（有限且相等），确认可去 ✓",
      "invalid": "解出 $\\alpha=1,\\beta=\\dfrac12$ 就直接交卷，不说明该组值下极限确实存在 ✗",
      "remedy": "① 解出参数后，**把值代回原式重新算一遍极限**；② 明确写出「此时两个单侧（或整体）极限为 $\\cdots$，有限，故条件成立」；③ 若条件中含「$\\ne0$」等约束，也要一并核对。",
      "related": [
        "题库错题 错-1-综.17",
        "题库题目 1-4.12(2)",
        "题库题目 10.14-E"
      ],
      "added": "2026-10-16"
    }
  ],
  "knowledge": [
    {
      "id": "EQV-001",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "基本三角等价无穷小",
      "content": "当 $x\\to0$ 时，以下基本三角函数可与 $x$ 等价替换。它们是等价无穷小变换的起点，但只能在乘除因式中直接使用。",
      "formulas": [
        "$\\sin x\\sim x$",
        "$\\tan x\\sim x$",
        "$\\arcsin x\\sim x$",
        "$\\arctan x\\sim x$",
        "$1-\\cos x\\sim\\dfrac{x^2}{2}$"
      ],
      "tips": [
        "先确认自变量趋于 $0$",
        "复合函数中的整体满足趋于 $0$ 时可整体替换"
      ],
      "related": [
        "题库易错点 E-001",
        "题库 2025-MT-08"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-002",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "指数与对数等价无穷小",
      "content": "指数、对数函数的线性化是极限计算中的高频工具。底数不是 $e$ 时，需要补上 $\\ln a$。",
      "formulas": [
        "$e^x-1\\sim x$",
        "$\\ln(1+x)\\sim x$",
        "$a^x-1\\sim x\\ln a\\ (a>0,\\ a\\ne1)$"
      ],
      "tips": [
        "$\\ln(1+x)$ 中的 $1+x$ 必须为正",
        "$a^x-1$ 的系数是 $\\ln a$，不是 $a$"
      ],
      "related": [
        "题库 2025-MT-03",
        "题库 2025-MT-08"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-003",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "幂函数与根式等价无穷小",
      "content": "利用 $(1+u)^\\alpha-1\\sim\\alpha u$，可以统一处理根式差、幂函数差和含参数指数。",
      "formulas": [
        "$(1+x)^\\alpha-1\\sim\\alpha x$",
        "$\\sqrt{1+x}-1\\sim\\dfrac{x}{2}$",
        "$\\sqrt[n]{1+x}-1\\sim\\dfrac{x}{n}$"
      ],
      "tips": [
        "把根式写成 $(1+x)^{1/n}$",
        "系数 $\\alpha$ 容易漏掉"
      ],
      "related": [
        "题库 2025-QZ-09",
        "题库 2025-MT-03"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-004",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "二阶与高阶差型等价量",
      "content": "相减后低阶项抵消时，必须保留下一阶非零项。这些差型等价量常用于分子分母同为高阶小量的极限。",
      "formulas": [
        "$x-\\sin x\\sim\\dfrac{x^3}{6}$",
        "$\\tan x-x\\sim\\dfrac{x^3}{3}$",
        "$x-\\arctan x\\sim\\dfrac{x^3}{3}$",
        "$x-\\ln(1+x)\\sim\\dfrac{x^2}{2}$"
      ],
      "tips": [
        "先用泰勒展开确认最低次非零项",
        "阶数不同不能只保留低阶项相减"
      ],
      "related": [
        "题库 2025-QZ-06",
        "题库 2025-MT-08"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-005",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "替换原则与适用范围",
      "content": "等价无穷小只保证比值趋于 $1$。若被替换部分处在加减结构中，不能单独替换；若有公因子，应先提出公因子或作恒等变形。",
      "formulas": [
        "$\\alpha\\sim\\beta\\iff\\alpha/\\beta\\to1$",
        "$\\alpha\\sim\\beta,\\ \\gamma\\sim\\delta\\Rightarrow\\alpha\\gamma\\sim\\beta\\delta$"
      ],
      "tips": [
        "乘除因式可替换",
        "加减项先合并、通分、有理化或展开",
        "每一步都要说明变量趋于哪个点"
      ],
      "related": [
        "题库易错点 E-001"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-006",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "复合结构等价替换",
      "content": "只要内层函数 $u(x)\\to0$，就可以把基本等价量中的 $x$ 整体替换成 $u(x)$。这是处理复合极限最常用的方法。",
      "formulas": [
        "$\\sin u\\sim u$",
        "$\\ln(1+u)\\sim u$",
        "$e^u-1\\sim u$",
        "$1-\\cos u\\sim\\dfrac{u^2}{2}$"
      ],
      "tips": [
        "先确认 $u(x)\\to0$",
        "整体替换后继续化简，不要只替换一半"
      ],
      "related": [
        "题库 2025-MT-03",
        "题库 2025-MT-08"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-007",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "常用组合与指数幂",
      "content": "组合型极限通常先提取主项或取对数，再把指数、对数、根式转化为熟悉的一阶等价量。",
      "formulas": [
        "$\\ln(1+u)\\sim u$",
        "$e^u-1\\sim u$",
        "$\\ln\\cos x\\sim-\\dfrac{x^2}{2}$",
        "$(1+u)^\\alpha=1+\\alpha u+o(u)$"
      ],
      "tips": [
        "幂指型 $u^v$ 先取对数",
        "遇到根式差先有理化或提主项"
      ],
      "related": [
        "题库 2025-MT-08",
        "题库经典-02"
      ],
      "added": "2026-10-19"
    },
    {
      "id": "EQV-008",
      "chapter": "第一章 函数与极限",
      "section": "§1.6 基础等价无穷小变换",
      "title": "等价量替换的检查清单",
      "content": "在提交极限答案前，按“趋近点、整体趋于零、乘除结构、最低阶项、回代检验”五步检查，能排除大多数替换错误。",
      "formulas": [
        "$\\lim\\dfrac{\\alpha}{\\beta}=1$ 是替换依据",
        "差型 $\\alpha-\\beta$ 先合并再判断"
      ],
      "tips": [
        "不要在同一道题中混用不同趋近点的展开",
        "不确定时用 $o$ 记号或泰勒展开验证"
      ],
      "related": [
        "题库易错点 E-001、E-003、E-007"
      ],
      "added": "2026-10-19"
    }
  ]
};
