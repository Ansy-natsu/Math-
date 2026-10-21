const fs = require('node:fs');
const vm = require('node:vm');

const FILES = {
  calculus: 'calculus/data.js',
  'linear-algebra': 'linear-algebra/data.js'
};

const ANSWERS = {
  calculus: {
    '2025-QZ-03': String.raw`D. $f(x)=2x\ (0\le x\le\pi/2),\ \pi\ (\pi/2<x\le\pi)$。`,
    '2025-QZ-07': 'B、C、D。',
    '经典-01': String.raw`（1）$\lim_{n\to\infty}x_n=+\infty$；（2）$\lim_{n\to\infty}\dfrac{x_n}{\sqrt{2n}}=1$。`,
    '经典-02': String.raw`$M$，其中 $M=\max\{a_1,a_2,\cdots,a_m\}$。`,
    '经典-03': '$1$。',
    '经典-04': '$0$。',
    '2025-MT-01': String.raw`$\{a_n\}$ 收敛。`,
    '2025-MT-02': '$0$。',
    '2025-MT-09': String.raw`$\{a_n\}$ 收敛。`,
    '2025-QZ-02': 'A、B、C、D。',
    '1-3.5(4)': '极限不存在。',
    '2025-QZ-09': 'B. 等价无穷小。',
    '10.14-E': String.raw`$k=\dfrac34$。`,
    '10.14-D': '$2$。',
    '10.14-C': String.raw`$\cos\alpha$。`,
    '1-4.12(2)': String.raw`$\dfrac{\alpha}{\beta}a^{\alpha-\beta}$。`,
    '1-4.12(5)': String.raw`$\dfrac{\ln3}{\ln2}=\log_2 3$。`,
    '1-4.12(8)': '$0$。',
    '2025-MT-08': String.raw`（1）$\ln4$；（2）$e^{-1/2}$。`,
    '2025-QZ-04': 'A. 4',
    '2025-QZ-05': 'A、B、C',
    '2025-QZ-06': 'B. $3$',
    '2025-MT-13': String.raw`连续：$\alpha>-2$；可导：$\alpha>-1$；一阶导数连续：$\alpha>-1$。`,
    '2025-QZ-08': 'A、D',
    '2025-QZ-10': 'C. 2',
    '2025-MT-03': '$2$。',
    '2025-QZ-01': 'D. $1$',
    '2025-MT-10': String.raw`（1）存在 $\xi\in(0,2)$，使 $f(\xi)=2$；（2）存在 $\xi\in(0,2)$，使 $f'(\xi)+f(\xi)=e$。`,
    '2025-MT-04': String.raw`$dy=-\dfrac{2xy+y\cos(xy)}{x^2+x\cos(xy)-\frac1{1+y}}\,dx$。`,
    '2025-MT-05': String.raw`$\dfrac{d^2x}{dy^2}=t\sqrt{1+t^2}$。`,
    '2025-MT-07': String.raw`$y^{(n)}(0)=\begin{cases}((2m-1)!!)^2,&n=2m+1,\\0,&n=2m,\end{cases}$，其中约定 $(-1)!!=1$。`,
    '2025-MT-11': String.raw`$f'(0)=2$，$f''(0)=-5$，$\displaystyle\lim_{n\to\infty}n\left[f\left(\frac1n\right)-1\right]=2$。`,
    '2025-MT-06': String.raw`切线方程：$x+y=e^{\pi/2}$。`,
    '2025-MT-12': String.raw`（1）唯一正根 $a_n\in(0,1)$ 存在；（2）$\displaystyle\lim_{n\to\infty}(1+a_n)^n=e$。`
  },
  'linear-algebra': {
    '1.3-01': String.raw`当 $a\ne7$ 时只有零解 $x=y=z=0$；当 $a=7$ 时全部解为 $(x,y,z)=t(1,-2,1)^T$，$t\in\mathbb R$。`,
    '1.4-01': String.raw`（1）行阶梯形为 $\begin{pmatrix}1&2&3\\0&0&1\\0&0&0\end{pmatrix}$；（2）非零行数为 $2$，$A$ 行等价于 $\begin{pmatrix}1&0&0\\0&1&0\\0&0&0\end{pmatrix}$。`,
    '1.2-01': String.raw`$(x_1,x_2,x_3,x_4)=s(-2,1,0,0)+t(-1,0,0,1)+(0,0,-1,0)$，$s,t\in\mathbb R$。`,
    '2025-LA-MT-01': String.raw`$p=2,\ q=3,\ r=2$；通解为 $(x_1,x_2,x_3,x_4)=(2,-3,0,0)+s(-2,1,1,0)+t(4,-5,0,1)$，$s,t\in\mathbb R$。`,
    '2025-LA-QZ-A1': '方程组无解。',
    '2025-LA-QZ-B1': '方程组无解。',
    '2025-LA-QZ-B3': '方程组无解。',
    '2025-LA-QZ-A3': '行列式为 $0$。',
    '1.5-01': String.raw`$L=\begin{pmatrix}1&0&0\\2&1&0\\4&3&1\end{pmatrix}$，$U=\begin{pmatrix}2&1&1\\0&1&1\\0&0&2\end{pmatrix}$；行变换为 $R_2\leftarrow R_2-2R_1,\ R_3\leftarrow R_3-4R_1,\ R_3\leftarrow R_3-3R_2$。`,
    '1.5-02': String.raw`$x_1=(1,2)^T$，$x_2=(-1,1)^T$，$X=(x_1,x_2)=\begin{pmatrix}1&-1\\2&1\end{pmatrix}$。`,
    '2.2-01': '$D=24$。',
    '2.1-01': String.raw`逆序数 $\tau=7$；该排列为奇排列。`,
    '2.2-02': '$V_4=12$。',
    '2.3-01': '$D=160$。',
    '2025-LA-QZ-A2': String.raw`$D=1+x_1^2+x_2^2+x_3^2+x_4^2$。`,
    '2025-LA-QZ-B2': String.raw`$D=1+x_1^2+x_2^2+x_3^2+x_4^2$。`,
    '2.4-01': '$D=-10$。',
    '2.3-02': String.raw`$|2A|=16$，$|A^T|=2$，$|A^{-1}|=\dfrac12$，$|A^*|=4$，$|A^2|=4$。`,
    '2025-LA-MT-03': '$D=4$。',
    '2025-LA-MT-04': '$x=-1,\ z=1$。',
    '2025-LA-MT-05': String.raw`$x\ne0$；$|A|=\sqrt[3]{x}$。`,
    '2025-LA-MT-06': String.raw`$PAQ^{2025}=\begin{pmatrix}a_{13}&a_{12}&a_{11}\\a_{23}&a_{22}&a_{21}\\a_{33}+2a_{13}&a_{32}+2a_{12}&a_{31}+2a_{11}\end{pmatrix}$；$P^{1025}AQ^{1000}=\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}+2050a_{11}&a_{32}+2050a_{12}&a_{33}+2050a_{13}\end{pmatrix}$。`,
    '2.6-01': '行空间和行秩均不变。',
    '2.7-01': String.raw`（1）$r(A)=2$；（2）$A$ 相抵于 $\begin{pmatrix}1&0&0\\0&1&0\\0&0&0\end{pmatrix}$。行变换可取 $R_2-2R_1,R_3-R_1$、交换 $R_2,R_3$、$R_2\leftarrow(-1)R_2$，列变换可取 $C_2-2C_1,C_3-3C_1,C_3-2C_2$。`,
    '2025-LA-MT-02': String.raw`（1）$a=-1$ 或 $a=-\dfrac23$ 时，$A$ 与 $B$ 不相抵；（2）$a=1$ 时，二者秩都为 $2$；（3）当二者秩都为 $3$（满秩）时，$(x_1,x_2,x_3)=(1,-1,1)$。`,
    '3.1-01': String.raw`（1）$AB=\begin{pmatrix}2&1\\1&1\end{pmatrix}$，$BA=\begin{pmatrix}1&1\\1&2\end{pmatrix}$，故 $AB\ne BA$；（2）$A^2=\begin{pmatrix}1&2\\0&1\end{pmatrix}$，$B^2=\begin{pmatrix}1&0\\2&1\end{pmatrix}$，$(AB)^2=\begin{pmatrix}5&3\\3&2\end{pmatrix}$，$A^2B^2=\begin{pmatrix}5&2\\2&1\end{pmatrix}$，故 $(AB)^2\ne A^2B^2$。`,
    '3.1-02': String.raw`$(AB)^T=B^TA^T$。`,
    '3.2-01': String.raw`$A^{-1}=\begin{pmatrix}-24&18&5\\20&-15&-4\\-5&4&1\end{pmatrix}$，且 $AA^{-1}=I$。`,
    '3.2-02': String.raw`（1）$A$ 可逆，$A^{-1}=\dfrac{3I-A}{2}$；（2）$A+I$ 可逆，$(A+I)^{-1}=\dfrac{4I-A}{6}$。`,
    '3.3-01': String.raw`$M$ 可逆，$M^{-1}=\begin{pmatrix}A^{-1}&0\\-B^{-1}CA^{-1}&B^{-1}\end{pmatrix}$。`,
    '3.3-02': '$|M|=4$。',
    '3.4-01': String.raw`（1）$EA$ 交换 $A$ 的第 $1,2$ 行，$AE$ 交换 $A$ 的第 $1,2$ 列；（2）$E=\begin{pmatrix}0&1&0\\1&0&0\\0&0&1\end{pmatrix}$，$EA=\begin{pmatrix}4&5&6\\1&2&3\\7&8&9\end{pmatrix}$，$AE=\begin{pmatrix}2&1&3\\5&4&6\\8&7&9\end{pmatrix}$。`,
    '2025-LA-MT-07': '$A^TA=I$。',
    '2025-LA-MT-08': String.raw`（1）$A^2=A$；（2）存在非零矩阵 $X=x\mathbf{1}^T$，使 $AX=BX$。`,
    '3.5-01': String.raw`$r(AB)\le\min\{r(A),r(B)\}$。反例：$A=\begin{pmatrix}1&0\\0&0\end{pmatrix}$，$B=\begin{pmatrix}0&0\\0&1\end{pmatrix}$，$r(A)=r(B)=1$，但 $r(AB)=0$。`,
    '3.5-02': String.raw`$r(A+B)\le r(A)+r(B)$。`,
    '4.1-01': String.raw`$a=1$ 或 $a=2$ 时线性相关。`,
    '4.2-01': '两个向量组等价。',
    '4.3-01': String.raw`$\{\alpha_1,\alpha_3\}$ 是一个极大线性无关组，$r=2$。`,
    '4.4-01': String.raw`$[\beta]_\alpha=(4,-1,-1)^T$。`,
    '4.5-01': String.raw`（1）从 $\alpha$ 到 $\beta$ 的过渡矩阵为 $P=\begin{pmatrix}2&1\\1&1\end{pmatrix}$；（2）从 $\beta$ 到 $\alpha$ 的过渡矩阵为 $P^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$；（3）$[\xi]_\beta=(1,1)^T$。`,
    '4.6-01': '矩阵的行秩等于列秩。',
    '4.7-01': String.raw`（1）$W$ 是 $\mathbb R^3$ 的子空间；（2）$\{(-1,1,0)^T,(-1,0,1)^T\}$ 是 $W$ 的一组基，$\dim W=2$；（3）扩充基为 $\{(-1,1,0)^T,(-1,0,1)^T,(1,0,0)^T\}$。`,
    '4.8-01': String.raw`$\eta^*=(-1,2,0,0)^T$，$\eta_1=(4,-3,1,0)^T$，$\eta_2=(-1,-1,0,1)^T$；通解 $x=\eta^*+c_1\eta_1+c_2\eta_2$，$c_1,c_2\in\mathbb R$。`,
    '4.9-01': String.raw`$\beta_1=(1,1,0,0)^T$，$\beta_2=(\tfrac12,-\tfrac12,1,0)^T$，$\beta_3=(\tfrac13,-\tfrac13,-\tfrac13,1)^T$。`,
    '5.1-01': String.raw`特征值 $4,1,1$；$\lambda=4$ 的特征向量为 $k(1,1,1)^T\ (k\ne0)$，$\lambda=1$ 的特征向量为 $s(1,-1,0)^T+t(1,0,-1)^T\ (s,t\text{ 不全为零})$。`,
    '5.1-02': String.raw`特征值 $4,-1$；$\lambda=4$ 的特征向量为 $k(2,3)^T\ (k\ne0)$，$\lambda=-1$ 的特征向量为 $k(1,-1)^T\ (k\ne0)$。`,
    '5.2-01': String.raw`（1）$\lambda\ne0$，$A^{-1}$ 的特征值为 $\lambda^{-1}$；（2）$A^*$ 的特征值为 $\dfrac{|A|}{\lambda}$；（3）$f(A)$ 的特征值为 $f(\lambda)$。`,
    '5.2-02': '属于不同特征值的特征向量线性无关。',
    '5.3-01': String.raw`（1）迹、行列式、特征多项式和秩均相同；（2）$A$ 与 $B$ 不相似。`,
    '5.4-01': '$A$ 可相似对角化当且仅当 $a=0$。',
    '5.4-02': String.raw`$A^n=\dfrac13\begin{pmatrix}2\cdot4^n+1&2\cdot4^n-2\\4^n-1&4^n+2\end{pmatrix}$。`,
    '6.1-01': String.raw`$f=x^TAx$，$A=\begin{pmatrix}1&2&-3\\2&2&4\\-3&4&3\end{pmatrix}$。`,
    '6.1-02': String.raw`标准形 $f=y_1^2+y_2^2+y_3^2$；可逆替换 $x=Cy$，$C=\begin{pmatrix}1&-1&2\\0&1&-2\\0&0&1\end{pmatrix}$。`,
    '6.2-01': String.raw`（1）$A$ 与 $B$ 合同；（2）$A$ 与 $B$ 不相似。`,
    '6.2-02': String.raw`标准形为 $f=2y_1^2-y_2^2-y_3^2$。`,
    '6.3-01': String.raw`秩为 $1$；正惯性指数为 $1$，负惯性指数为 $0$；规范形为 $z_1^2$。`,
    '6.4-01': String.raw`$Q=\begin{pmatrix}\frac1{\sqrt2}&0&\frac1{\sqrt2}\\\frac1{\sqrt2}&0&-\frac1{\sqrt2}\\0&1&0\end{pmatrix}$；$x=Qy$ 后，$f=2y_1^2+2y_2^2$。`,
    '6.5-01': '二次型正定。',
    '6.5-02': '$-1<t<1$。',
    '6.5-03': String.raw`（1）$A^TA$ 半正定；（2）$A^TA+I_n$ 正定。`,
    '7.1-01': String.raw`$V$ 是线性空间；一组基为 $\begin{pmatrix}1&0\\0&-1\end{pmatrix},\begin{pmatrix}0&1\\0&0\end{pmatrix},\begin{pmatrix}0&0\\1&0\end{pmatrix}$，$\dim V=3$。`,
    '7.2-01': '不构成线性空间。',
    '7.3-01': '线性无关。',
    '7.4-01': '$q=p_2+2p_3$。',
    '7.5-01': String.raw`向量组的秩为 $4$，且构成 $M_2(\mathbb R)$ 的一组基。`,
    '7.6-01': String.raw`一组基为 $E_{11},E_{22},E_{33},E_{12}+E_{21},E_{13}+E_{31},E_{23}+E_{32}$，$\dim S_3(\mathbb R)=6$。`,
    '7.7-01': String.raw`（1）$P=\begin{pmatrix}1&1&1\\0&1&2\\0&0&1\end{pmatrix}$；（2）$[q]_\beta=(2,-4,3)^T$。`,
    '7.8-01': String.raw`$\mathbb R^3=W_1\oplus W_2$；对 $v=(a,b,c)^T$，令 $t=\dfrac{a+b+c}{3}$，则 $v=(v-t(1,1,1)^T)+t(1,1,1)^T$，其中 $v-t(1,1,1)^T\in W_1$。`,
    '7.9-01': String.raw`$\dim(W_1+W_2)=\dim W_1+\dim W_2-\dim(W_1\cap W_2)$。`,
    '8.1-01': String.raw`所定义运算满足内积公理，是 $\mathbb R^2$ 上的一个内积。`,
    '8.1-02': String.raw`$|\langle\alpha,\beta\rangle|\le\|\alpha\|\,\|\beta\|$；等号成立当且仅当 $\alpha,\beta$ 线性相关。`,
    '8.1-03': String.raw`夹角 $\theta=60^\circ$，距离 $d=\sqrt2$。`,
    '8.2-01': String.raw`$\beta_1=(1,1,0)^T$，$\beta_2=(\tfrac12,-\tfrac12,1)^T$，$\beta_3=(-\tfrac23,\tfrac23,\tfrac23)^T$。`,
    '8.2-02': String.raw`$W^\perp=\operatorname{span}\{(1,-1,0)^T,(1,0,-1)^T\}$，$\dim W^\perp=2$。`,
    '8.2-03': String.raw`（1）$A$ 是正交矩阵，$A^{-1}=A^T$；（2）$A^2=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$，$A$ 表示顺时针旋转 $45^\circ$，$A^2$ 表示顺时针旋转 $90^\circ$。`,
    '8.2-04': String.raw`正交投影 $p=(\tfrac43,\tfrac23,\tfrac23)^T$，距离 $d=\dfrac{\sqrt3}{3}$。`,
    '8.2-05': String.raw`$\langle\alpha,\beta\rangle=\sum_{i=1}^n a_ib_i$，$\|\alpha\|^2=\sum_{i=1}^n a_i^2$。`,
    '9.1-01': String.raw`（1）$T_1$ 不是线性映射；（2）$T_2$ 是线性映射。`,
    '9.1-02': String.raw`$\ker T=\operatorname{span}\{(-1,1,-1)^T\}$，$\dim\ker T=1$；$\operatorname{Im}T=\mathbb R^2$，$\dim\operatorname{Im}T=2$。`,
    '9.2-01': String.raw`$(S+T)(x,y)=(3x+y,x)$，$(2S)(x,y)=(2x+2y,2x-2y)$，$(ST)(x,y)=(2x+y,2x-y)$，$(TS)(x,y)=(2x+2y,x-y)$；故 $ST\ne TS$。`,
    '9.3-01': String.raw`$\dim\ker T=2$，一组基为 $(2,-1,1,0)^T,(-1,0,0,1)^T$；$\dim\operatorname{Im}T=2$，一组基为 $(1,0,1)^T,(2,1,3)^T$。`,
    '9.4-01': String.raw`（1）$A=\begin{pmatrix}1&2\\3&-1\end{pmatrix}$；（2）$B=\begin{pmatrix}\frac52&\frac32\\\frac12&-\frac52\end{pmatrix}$。`,
    '9.4-02': String.raw`存在可逆矩阵 $P$，使 $B=P^{-1}AP$，因此 $A$ 与 $B$ 相似。`,
    '9.5-01': String.raw`（1）$A=\begin{pmatrix}1&1&0\\0&1&2\\0&0&1\end{pmatrix}$；（2）特征值为 $1,1,1$，$T$ 不可对角化。`,
    '9.5-02': String.raw`（1）$N=\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$；（2）$N^3=0$，特征值只有 $0$，且不可对角化。`
  }
};

function loadBank(file) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { timeout: 3000 });
  return vm.runInContext('BANK', sandbox, { timeout: 1000 });
}

function normalizeStatement(value) {
  let text = String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/\\+n(?![A-Za-z])/g, '\n');

  const optionMatches = text.match(/(?:^|[\s。；;])([A-D])[.、．]\s*/g) || [];
  const labels = new Set(optionMatches.map((item) => item.trim().charAt(0)).filter(Boolean));
  if (labels.size >= 2) {
    text = text.replace(/([^\n])\s*([A-D])[.、．]\s*/g, '$1\n$2. ');
  }
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

let overrideCount = 0;
for (const [site, file] of Object.entries(FILES)) {
  const bank = loadBank(file);
  for (const problem of bank.problems || []) {
    problem.statement = normalizeStatement(problem.statement);
    const answer = ANSWERS[site][problem.id];
    if (answer) {
      problem.right_answer = answer;
      overrideCount += 1;
    }
  }
  fs.writeFileSync(file, 'const BANK = ' + JSON.stringify(bank, null, 2) + ';\n');
}

console.log(`Updated statements in both banks and replaced ${overrideCount} answers.`);
