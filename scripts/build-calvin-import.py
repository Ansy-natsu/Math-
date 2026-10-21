import json
import re
import sys
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parent.parent
SOURCE = (
    Path(sys.argv[1])
    if len(sys.argv) > 1
    else Path(r"C:\Users\30336\Downloads\陈维新_线性代数_习题精选与解析 (1).pdf")
)
OUTPUT = ROOT / "tmp" / "calvin-parsed.json"
IMPORT_JS = ROOT / "linear-algebra" / "calvin-import.js"

PROBLEM_HEADING = re.compile(
    r"^((?:\d+\.\d+-\d+|附[三四五](?:-[一二三四五六七八九十]+)?-\d+)\S*)\s*(?:｜|\s)\s*(.+)$"
)
SECTION_HEADING = re.compile(r"^习题(\d+\.\d+)\s*(?:｜|\s)+(.*?)(?:（|$)")
CHAPTER_HEADING = re.compile(r"^第([1-6])章\s*(?:｜|\s)+(.*)$")
NOTE_HEADING = re.compile(
    r"^(?:考前速记|第([1-6])章(?:前半)?考前速记|第([1-6])章后半知识速记|本章考前速记|附录考前速记)$"
)
APPENDIX_HEADING = re.compile(r"^附录([三四五])\s+(.+)$")
FOOTER = re.compile(r"^线性代数 · 精选习题与解析 \| \d+ / 99$")

SECTION_MAP = {
    "1.1": ("第2章 行列式与矩阵的秩", "§2.1  n–排列"),
    "1.2": ("第2章 行列式与矩阵的秩", "§2.2  方阵的行列式"),
    "1.3": ("第2章 行列式与矩阵的秩", "§2.3  行列式的性质"),
    "1.4": ("第2章 行列式与矩阵的秩", "§2.4  Laplace定理"),
    "1.5": ("第1章 线性方程组的求解", "§1.3  Gauss消元法的一般结论"),
    "1.6": ("第2章 行列式与矩阵的秩", "§2.5  矩阵的秩"),
    "2.1": ("第1章 线性方程组的求解", "§1.2  同解变形与阶梯形线性方程组"),
    "2.2": ("第2章 行列式与矩阵的秩", "§2.5  矩阵的秩"),
    "2.3": ("第1章 线性方程组的求解", "§1.3  Gauss消元法的一般结论"),
    "2.4": ("第1章 线性方程组的求解", "§1.4  矩阵及其初等变换"),
    "3.1": ("第3章 矩阵的运算", "§3.1  矩阵的加减法、数乘、乘法和转置"),
    "3.2": ("第3章 矩阵的运算", "§3.2  矩阵求逆"),
    "3.3": ("第3章 矩阵的运算", "§3.3  分块矩阵的运算"),
    "3.4": ("第3章 矩阵的运算", "§3.4  矩阵的初等变换与矩阵乘法的联系"),
    "3.5": ("第2章 行列式与矩阵的秩", "§2.7  矩阵的相抵"),
    "3.6": ("第3章 矩阵的运算", "§3.5  矩阵运算对矩阵秩的影响"),
    "4.1": ("第7章 线性空间", "§7.2  线性空间的定义"),
    "4.2": ("第4章 n元向量空间", "§4.1  向量组的线性关系"),
    "4.3": ("第4章 n元向量空间", "§4.3  极大线性无关组与向量组的秩"),
    "4.4": ("第4章 n元向量空间", "§4.4  维数基坐标"),
    "4.5": ("第4章 n元向量空间", "§4.7  子空间"),
    "4.6": ("第4章 n元向量空间", "§4.8  线性方程组解的结构"),
    "4.7": ("第7章 线性空间", "§7.7  基之间的过渡矩阵坐标变换"),
    "4.8": ("第8章 欧氏空间", "§8.1  欧氏空间的定义及其简单性质"),
    "4.9": ("第9章 线性映射与线性变换初步", "§9.1  线性映射的定义"),
    "4.10": ("第9章 线性映射与线性变换初步", "§9.4  线性映射的矩阵"),
    "4.11": ("第4章 n元向量空间", "§4.8  线性方程组解的结构"),
    "5.1": ("第5章 矩阵的特征值理论与相似对角化", "§5.1  特征值与特征向量的定义及计算"),
    "5.2": ("第5章 矩阵的特征值理论与相似对角化", "§5.4  矩阵的相似对角化"),
    "5.3": ("第5章 矩阵的特征值理论与相似对角化", "§5.3  矩阵的相似及其性质"),
    "5.4": ("第5章 矩阵的特征值理论与相似对角化", "§5.5  实对称矩阵的相似对角化"),
    "5.5": ("第5章 矩阵的特征值理论与相似对角化", "§5.4  矩阵的相似对角化"),
    "6.1": ("第6章 二次型", "§6.1  二次型的定义及标准形"),
    "6.2": ("第6章 二次型", "§6.2  二次型的矩阵形式与矩阵的合同"),
    "6.3": ("第6章 二次型", "§6.3  二次型的规范形"),
    "6.4": ("第6章 二次型", "§6.5  二次型的正定性"),
    "6.5": ("第6章 二次型", "§6.5  二次型的正定性"),
    "A三": ("第1章 线性方程组的求解", "§1.1  线性方程组的形式及相关概念"),
    "A四": ("第3章 矩阵的运算", "§3.3  分块矩阵的运算"),
    "A五": ("第8章 欧氏空间", "§8.2  标准正交基"),
}

NOTE_MAP = {
    (1, "all"): ("第2章 行列式与矩阵的秩", "§2.1  n–排列", "行列式与排列·考前速记"),
    (2, "all"): ("第1章 线性方程组的求解", "§1.1  线性方程组的形式及相关概念", "线性方程组·考前速记"),
    (3, "all"): ("第3章 矩阵的运算", "§3.1  矩阵的加减法、数乘、乘法和转置", "矩阵运算·考前速记"),
    (4, "first"): ("第4章 n元向量空间", "§4.1  向量组的线性关系", "向量空间与线性相关·考前速记"),
    (4, "second"): ("第4章 n元向量空间", "§4.8  线性方程组解的结构", "向量空间后半部分·知识速记"),
    (5, "all"): ("第5章 矩阵的特征值理论与相似对角化", "§5.1  特征值与特征向量的定义及计算", "特征值与对角化·考前速记"),
    (5, "second"): ("第5章 矩阵的特征值理论与相似对角化", "§5.3  矩阵的相似及其性质", "相似与对角化·知识速记"),
    (6, "all"): ("第6章 二次型", "§6.1  二次型的定义及标准形", "二次型·考前速记"),
    (6, "附录"): ("第8章 欧氏空间", "§8.2  标准正交基", "附录方法·考前速记"),
}

NOTE_TEXT_OVERRIDES = {
    (1, "all"): [
        r"排列的逆序数是“前大后小”的数对个数，排列符号为 $(-1)^\tau$；一次对换改变奇偶性。",
        r"$n$ 阶行列式的每一项恰取每行、每列各一个元素；三角行列式取主对角线乘积，反三角还要乘 $(-1)^{n(n-1)/2}$。",
        r"两行互换变号；某行乘 $k$，行列式乘 $k$；某行加另一行的倍数，行列式不变。列变换同理。",
        r"按行展开 $D=\sum_j a_{ij}A_{ij}$，其中 $A_{ij}=(-1)^{i+j}M_{ij}$；优先选择零多的行或列。",
        r"范德蒙德行列式 $\det(x_j^{i-1})=\prod_{i<j}(x_j-x_i)$；Cramer 法则只在方阵且 $D\ne0$ 时直接给出唯一解。",
    ],
    (2, "all"): [
        r"解方程组时只对增广矩阵作初等行变换；交换列相当于交换未知量顺序，必须记录。",
        r"秩 $r(A)$ 是最大非零子式的阶数，也是阶梯形的非零行数；初等变换不改变秩。",
        r"$Ax=b$：$r(A)\ne r([A\mid b])$ 时无解；两秩相等时，$r=n$ 有唯一解，$r<n$ 有 $n-r$ 个自由参数。",
        r"齐次方程组恒有零解，有非零解当且仅当 $r(A)<n$。",
        r"含参题先找可能消失的主元，再单独代回临界参数，不能漏分类。",
    ],
    (3, "all"): [
        r"矩阵相乘先检查维数；一般 $AB\ne BA$，也不能由 $AB=O$ 推出某个因子为零。",
        r"$(AB)^T=B^TA^T$，$(AB)^{-1}=B^{-1}A^{-1}$。",
        r"$A$ 可逆 $\iff |A|\ne0\iff r(A)=n$；求逆可用 $[A\mid I]\to[I\mid A^{-1}]$。",
        r"$A^*=|A|A^{-1}$（仅可逆时），并恒有 $AA^*=A^*A=|A|I$。",
        r"左乘初等矩阵作用于行，右乘作用于列；初等变换可逆，因此不改变秩。",
        r"同型矩阵相抵当且仅当秩相同；标准形为 $\operatorname{diag}(I_r,O)$。",
    ],
    (4, "first"): [
        r"子空间必须含零向量，并对加法和数乘封闭；$Ax=0$ 的解集是子空间，$Ax=b\ne0$ 的解集通常不是。",
        r"把向量按列排成 $A$：向量组线性无关 $\iff Ax=0$ 只有零解；$\beta$ 可表示 $\iff Ax=\beta$ 有解。",
        r"求极大无关组时，对列矩阵作行消元，取主元位置对应的原始列。",
        r"基必须线性无关且张成整个空间；$n$ 维空间中，$n$ 个向量只检验其中一个条件即可。",
        r"过渡矩阵约定为 $[\text{新基}]=[\text{旧基}]P$，同一向量的坐标满足 $x_{\text{旧}}=Px_{\text{新}}$。",
    ],
    (4, "second"): [
        r"解空间维数 $\dim\ker A=n-r(A)$；非齐次通解等于一个特解加齐次通解。",
        r"有限维线性空间同构当且仅当维数相同；矩阵、多项式都可先按基坐标化。",
        r"欧氏空间中 $\cos\theta=\dfrac{\langle u,v\rangle}{\|u\|\|v\|}$；Schmidt 正交化先减投影，再按需单位化。",
        r"线性映射先查 $T(0)=0$，再查 $T(au+bv)=aT(u)+bT(v)$。",
        r"矩阵第 $j$ 列是 $T(e_j)$ 的坐标；换基满足 $A_\eta=P^{-1}A_\varepsilon P$。",
    ],
    (5, "all"): [
        r"由 $\det(\lambda I-A)=0$ 求特征值，再由 $(A-\lambda I)x=0$ 求非零特征向量。",
        r"$A$ 可对角化 $\iff$ 有 $n$ 个线性无关特征向量 $\iff$ 每个特征值几何重数等于代数重数。",
        r"取 $P$ 的列为特征向量，$\Lambda$ 的对角元按同一顺序排列，则 $P^{-1}AP=\Lambda$。",
        r"相似保持特征多项式、特征值（含重数）、迹、行列式和秩，但这些量相同不一定推出相似。",
        r"实对称矩阵一定能正交对角化；重特征值内部需再作 Schmidt 正交化。",
    ],
    (5, "second"): [
        r"$A$ 与 $B$ 相似指存在可逆矩阵 $P$，使 $B=P^{-1}AP$。",
        r"若 $P^{-1}AP=\Lambda$，则 $A^k=P\Lambda^kP^{-1}$，$f(A)=Pf(\Lambda)P^{-1}$。",
        r"相似矩阵的迹、行列式、特征多项式、特征值和秩都相同。",
        r"实对称矩阵正交对角化时，$U^TAU=\Lambda$，$U$ 的列是标准正交特征向量。",
        r"$U$ 中特征向量的顺序必须与 $\Lambda$ 中特征值的顺序一致。",
    ],
    (6, "all"): [
        r"二次型写成 $f=X^TAX$ 时取对称矩阵；交叉项 $cx_ix_j$ 对应 $a_{ij}=a_{ji}=c/2$。",
        r"可逆替换 $X=CY$ 给出 $B=C^TAC$，这叫合同；正交替换还满足 $C^{-1}=C^T$。",
        r"实二次型的合同类型由正、负惯性指数 $(p,q)$ 决定，秩 $r=p+q$。",
        r"正定可用全部特征值大于零或全部顺序主子式大于零判断；半正定不能只查顺序主子式。",
        r"做题时先写对称矩阵，再判断题目要求配方、正交化还是只判类型，最后核验替换矩阵与符号。",
    ],
    (6, "附录"): [
        r"插值：设未知系数，用函数值或导数值列线性方程组。",
        r"流量与配料：先写守恒等式，再补充非负和容量约束。",
        r"分块消元：使用 Schur 补 $D-CA^{-1}B$ 时不能交换矩阵乘法次序。",
        r"最小二乘：解 $A^TAX=A^Tb$，并用 $A^Tr=0$ 检查残差。",
        r"附录三、四、五的练习均按当前章节归类；附录一、二、六没有独立习题组。",
    ],
}

SKIP_IMPORT_IDS = {"4.6-8(1)(2)"}

ANSWER_OVERRIDES = {
    "1.1-1": "两个数域互不包含；素数有无穷多个，因此可得到无穷多个互不相同的数域。",
    "1.1-2": r"$P(i)$ 是数域；$Q(i)$ 是实部、虚部均为有理数的复数，$R(i)=C(i)=C$；$Z(i)$ 不是数域。",
    "1.1-3": "（1）两个数域的交仍是数域；（2）两个数域的并一般不是数域。",
    "1.1-5": r"（1）逆序数 $4$，偶排列；（3）逆序数 $15$，奇排列；（5）逆序数 $10$，偶排列。",
    "1.1-7": r"（1）$i=3,\ j=6$；（2）$i=7,\ j=3$。",
    "1.1-9": r"反序排列的逆序数为 $\dfrac{n(n-1)}2-k$。",
    "2.3-4": r"$k\ne-1$ 且 $k\ne4$。",
    "3.1-18": r"$C^{1000}=2^{999}C=2^{999}A^TB$。",
    "4.8-14": r"标准正交基为 $\left\{\dfrac1{\sqrt2},\ \sqrt{\dfrac32}x,\ \sqrt{\dfrac58}(3x^2-1)\right\}$。",
    "6.4-1": "D",
}

TEXT_OVERRIDES = {
    "1.2-1(1)(2)(4)(5)": {
        "statement": "\n".join([
            "按行列式定义，计算下列行列式：",
            r"(1) $\begin{vmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{vmatrix}$",
            r"(2) $\begin{vmatrix}1&\log_b a\\\log_a b&1\end{vmatrix}$",
            r"(4) $\begin{vmatrix}a&0&0\\0&b&c\\0&d&e\end{vmatrix}$",
            r"(5) $\begin{vmatrix}1&2&-1\\3&2&0\\0&-1&1\end{vmatrix}$",
        ]),
        "answer": "(1) $1$；(2) $0$；(4) $a(be-cd)$；(5) $-1$。",
        "solution": "\n".join([
            r"(1) $\cos^2\theta+\sin^2\theta=1$。",
            r"(2) 由 $\log_a b\cdot\log_b a=1$，行列式为 $1-1=0$。",
            r"(4) 非零项为 $abe-acd=a(be-cd)$。",
            r"(5) 展开后仅有三个非零项，结果为 $2+3-6=-1$。",
        ]),
    },
}

SOLUTION_CUES = {
    "2.2-2": r"^以添一列",
    "2.3-4": r"^系数矩阵",
    "3.1-18": r"^教材 A=",
    r"3.2-3\(2\)\(3\)": r"^（2）A=diag",
    r"3.3-3\(1\)\(2\)": r"^设 Q=",
    "4.7-5": r"^取 σ\(",
    "4.8-14": r"^按题目",
    r"4.10-6\(3\)": r"^原矩阵 A=",
}


def collect_lines():
    output = []
    with pdfplumber.open(SOURCE) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            for line in page.extract_text_lines():
                text = (line.get("text") or "").strip()
                if not text or FOOTER.match(text):
                    continue
                output.append({
                    "page": page_no,
                    "top": float(line["top"]),
                    "text": text,
                })
    return output


def gap_before(current, previous):
    if not previous or current["page"] != previous["page"]:
        return None
    return current["top"] - previous["top"]


def clean_text(value):
    text = str(value or "").replace("\ue020", "≠").replace("\r\n?", "\n")
    text = text.replace("⊂≠", "⊄").replace("=≠", "≠").replace("∈/", "∉")
    text = re.sub(r"互不\s+p\s+包含", "互不包含", text)
    replacements = {
        "s inθ": "sinθ",
        "c os": "cos",
        "t an": "tan",
        "l og": "log",
        "∣": "|",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def infer_type(title, statement):
    text = f"{title}\n{statement}"
    if re.search(r"(?:^|\n)\s*[（(]?[A-D][.、．)]", text) or re.search(r"[（(][A-D][）)]", text):
        return "选择题"
    if "填空" in text or "_____" in text or "____" in text:
        return "填空题"
    if "证明" in text or "求证" in text:
        return "证明题"
    if "判断" in text or "是否" in text and "说明" in text:
        return "判断题"
    if any(word in text for word in ("计算", "求", "何时", "何值", "为何值")):
        return "计算题"
    return "综合题"


def infer_difficulty(problem_type, title):
    if problem_type in ("选择题", "填空题", "判断题"):
        base = 2
    elif problem_type == "证明题":
        base = 4
    elif problem_type == "综合题":
        base = 4
    else:
        base = 3
    if any(word in title for word in ("综合", "证明", "参数", "抽象", "恒等式")):
        base += 1
    return max(1, min(5, base))


def answer_from_solution(solution, problem_type):
    text = clean_text(solution)
    if not text:
        return "见解析。"
    collapsed = re.sub(r"\s+", " ", text).strip()
    if problem_type == "选择题":
        choice = re.search(r"(?:故选|故|所以|答案[为是]?|应选)\s*([A-D])", collapsed)
        if choice:
            return choice.group(1)
        choices = re.findall(r"\b([A-D])\b", collapsed)
        if choices:
            return choices[-1]
    sentences = [
        item.strip() for item in re.split(r"(?<=[。！？])|(?<=\.)\s+", collapsed)
        if item.strip() and not re.match(r"^(核对说明|注意|提示|教材.*提示|这里|验算|检验)", item.strip())
    ]
    show_two = problem_type == "证明题" or bool(
        re.search(r"[（(]1[）)].{0,120}[（(]2[）)]", collapsed)
    )
    answer = " ".join(sentences[-2:] if show_two else sentences[-1:]) if sentences else collapsed[-360:]
    answer = re.sub(r"^(因此|所以|故|于是|从而|综上|答案为|结论为)[，,：:\s]*", "", answer)
    if len(answer) > 360:
        answer = answer[-360:].lstrip("，,；;。 ")
    return answer or "见解析。"


def build_problem(item):
    section_code = item["sectionCode"]
    chapter, section = SECTION_MAP.get(
        section_code,
        ("第4章 n元向量空间", "§4.1  向量组的线性关系"),
    )
    statement = clean_text(item["statement"])
    solution = clean_text(item["solution"])
    special = TEXT_OVERRIDES.get(item["pdfId"])
    if special:
        statement = special["statement"]
        solution = special["solution"]
    problem_type = infer_type(item["title"], statement)
    answer = special["answer"] if special else ANSWER_OVERRIDES.get(
        item["pdfId"],
        answer_from_solution(solution, problem_type),
    )
    return {
        "id": "CWX-" + item["pdfId"],
        "source": f"陈维新《线性代数》（第二版）{section_code} {item['sectionTitle']}，PDF第{item['page']}页",
        "chapter": chapter,
        "section": section,
        "statement": statement,
        "type": problem_type,
        "topics": [item["sectionTitle"], item["title"]],
        "difficulty": infer_difficulty(problem_type, item["title"]),
        "tags": ["陈维新", "习题精选", section_code],
        "right_answer": answer,
        "key_points": [],
        "solutions": [{
            "name": "精选解析",
            "steps": [solution],
        }],
        "pitfalls": [],
        "related": [],
        "added": "2026-10-21",
    }


def build_note(note, index):
    mapping = NOTE_MAP.get((note["chapterNo"], note["part"]))
    if not mapping:
        return None
    chapter, section, title = mapping
    lines = NOTE_TEXT_OVERRIDES.get((note["chapterNo"], note["part"]))
    content = clean_text(note["text"]) if not lines else ""
    return {
        "id": "CWX-NOTE-" + str(index + 1),
        "title": f"陈维新｜{title}",
        "chapter": chapter,
        "section": section,
        "content": content,
        "formulas": [],
        "tips": lines or [line for line in content.splitlines() if line.strip()],
        "related": [f"陈维新《线性代数》（第二版）PDF第{note['page']}页"],
        "added": "2026-10-21",
    }


def split_original_solution(lines, pdf_id):
    original_index = next((i for i, item in enumerate(lines) if item["text"].startswith("原题")), None)
    if original_index is None:
        return "", "\n".join(item["text"] for item in lines)

    repeated_original = next((
        index for index in range(original_index + 1, len(lines))
        if lines[index]["text"].startswith("原题")
    ), None)
    if repeated_original is not None:
        statement = lines[original_index:repeated_original]
        statement_text = "\n".join(item["text"] for item in statement)
        statement_text = re.sub(r"^原题\s*", "", statement_text).strip()
        solution_text = "\n".join(item["text"] for item in lines[repeated_original:])
        solution_text = re.sub(r"^原题\s*", "", solution_text).strip()
        return statement_text, solution_text

    statement = [lines[original_index]]
    split_at = None
    cue = SOLUTION_CUES.get(pdf_id)
    if cue:
        split_at = next((
            index for index in range(original_index + 1, len(lines))
            if re.search(cue, lines[index]["text"])
        ), None)
        if split_at is not None:
            statement = lines[original_index:split_at]
    previous = lines[original_index]
    if split_at is None:
        for index in range(original_index + 1, len(lines)):
            current = lines[index]
            gap = gap_before(current, previous)
            if gap is not None and gap >= 34:
                split_at = index
                break
            statement.append(current)
            previous = current

    if split_at is None:
        # A page break may separate the statement and solution. A repeated subpart
        # marker such as "(1) 行为..." is the strongest signal.
        statement_so_far = "\n".join(item["text"] for item in statement)
        for index in range(original_index + 1, len(lines)):
            current = lines[index]
            previous = lines[index - 1]
            if current["page"] == previous["page"]:
                continue
            marker = re.match(r"^\((\d+)\)", current["text"])
            if marker and re.search(rf"\({marker.group(1)}\)", statement_so_far):
                split_at = index
                break
        else:
            for index in range(original_index + 1, len(lines)):
                current = lines[index]
                previous = lines[index - 1]
                if current["page"] != previous["page"]:
                    continue
                if re.search(r"[。？；.!]$", previous["text"]):
                    split_at = index
                    break

    if split_at is None:
        # Final fallback for a page break after a sentence-ending statement.
        for index in range(original_index + 1, len(lines)):
            current = lines[index]
            previous = lines[index - 1]
            if current["page"] != previous["page"] and re.search(r"[。？；.!]$", previous["text"]):
                split_at = index
                break

    if split_at is None:
        split_at = len(lines)
        statement = lines[original_index:]
    else:
        statement = lines[original_index:split_at]

    statement_text = "\n".join(item["text"] for item in statement)
    statement_text = re.sub(r"^原题\s*", "", statement_text).strip()
    solution_text = "\n".join(item["text"] for item in lines[split_at:]).strip()
    return statement_text, solution_text


def main():
    lines = collect_lines()
    problems = []
    notes = []
    chapter_no = None
    chapter_title = ""
    section_code = None
    section_title = ""

    problem_indices = [
        index for index, item in enumerate(lines)
        if PROBLEM_HEADING.match(item["text"])
    ]
    boundary_indices = sorted(set(problem_indices + [
        index for index, item in enumerate(lines)
        if SECTION_HEADING.match(item["text"])
        or CHAPTER_HEADING.match(item["text"])
        or APPENDIX_HEADING.match(item["text"])
        or NOTE_HEADING.match(item["text"])
    ]))

    scanned_until = 0
    for position, start in enumerate(problem_indices):
        line = lines[start]
        match = PROBLEM_HEADING.match(line["text"])
        next_problem = next((index for index in boundary_indices if index > start), len(lines))

        for index in range(scanned_until, start):
            text = lines[index]["text"]
            section_match = SECTION_HEADING.match(text)
            if section_match:
                section_code = section_match.group(1)
                section_title = section_match.group(2).strip()
            chapter_match = CHAPTER_HEADING.match(text)
            if chapter_match:
                chapter_no = int(chapter_match.group(1))
                chapter_title = chapter_match.group(2).strip()
            appendix_match = APPENDIX_HEADING.match(text)
            if appendix_match:
                section_code = "A" + appendix_match.group(1)
                section_title = appendix_match.group(2).strip()
        scanned_until = start

        if section_code is None or chapter_no is None:
            search_end = min(start + 1, len(lines))
            context = "\n".join(item["text"] for item in lines[max(0, start - 80):search_end])
            section_match = list(SECTION_HEADING.finditer(context))
            chapter_match = list(CHAPTER_HEADING.finditer(context))
            if section_match:
                section_code = section_match[-1].group(1)
                section_title = section_match[-1].group(2).strip()
            if chapter_match:
                chapter_no = int(chapter_match[-1].group(1))
                chapter_title = chapter_match[-1].group(2).strip()

        block = lines[start:min(next_problem, len(lines))]
        statement, solution = split_original_solution(block[1:], match.group(1))
        item = {
            "pdfId": match.group(1),
            "title": match.group(2).strip(),
            "chapterNo": chapter_no,
            "chapterTitle": chapter_title,
            "sectionCode": section_code,
            "sectionTitle": section_title,
            "page": line["page"],
            "statement": statement,
            "solution": solution,
            "rawHeading": line["text"],
        }
        if item["title"].startswith("引用"):
            continue
        if statement:
            problems.append(item)
        else:
            base = re.match(r"^(\d+\.\d+-\d+)", item["pdfId"])
            parent = next((entry for entry in reversed(problems)
                           if base and re.match(rf"^{re.escape(base.group(1))}", entry["pdfId"])), None)
            if parent:
                fragment = "\n".join(part["text"] for part in block[1:]).strip()
                parent["solution"] = (parent["solution"] + "\n" + fragment).strip()

    current_chapter = None
    for index, item in enumerate(lines):
        chapter_match = CHAPTER_HEADING.match(item["text"])
        if chapter_match:
            current_chapter = int(chapter_match.group(1))
        if not NOTE_HEADING.match(item["text"]):
            continue
        heading = item["text"]
        explicit_chapter = re.search(r"第([1-6])章", heading)
        note_chapter = int(explicit_chapter.group(1)) if explicit_chapter else current_chapter
        note_part = "附录" if heading.startswith("附录") else (
            "first" if "前半" in heading else "second" if "后半" in heading else "all"
        )
        end = next((
            line_index for line_index in range(index + 1, len(lines))
            if SECTION_HEADING.match(lines[line_index]["text"])
            or CHAPTER_HEADING.match(lines[line_index]["text"])
            or APPENDIX_HEADING.match(lines[line_index]["text"])
            or NOTE_HEADING.match(lines[line_index]["text"])
        ), len(lines))
        note_lines = [line["text"] for line in lines[index + 1:end]]
        notes.append({
            "heading": heading,
            "chapterNo": note_chapter,
            "part": note_part,
            "page": item["page"],
            "text": "\n".join(note_lines).strip(),
        })

    import_problems = [
        build_problem(item) for item in problems
        if item["pdfId"] not in SKIP_IMPORT_IDS
    ]
    import_notes = [
        note for index, source_note in enumerate(notes)
        if (note := build_note(source_note, index)) is not None
    ]
    import_payload = {
        "source": "陈维新《线性代数》（第二版）习题精选与解析",
        "sourcePages": 99,
        "problemCount": len(import_problems),
        "knowledgeCount": len(import_notes),
        "problems": import_problems,
        "knowledge": import_notes,
    }
    IMPORT_JS.write_text(
        "(function () {\n"
        "  'use strict';\n"
        "  var data = " + json.dumps(import_payload, ensure_ascii=False, indent=2) + ";\n"
        "  if (typeof BANK === 'undefined' || !BANK || typeof BANK !== 'object') return;\n"
        "  BANK.problems = Array.isArray(BANK.problems) ? BANK.problems : [];\n"
        "  BANK.knowledge = Array.isArray(BANK.knowledge) ? BANK.knowledge : [];\n"
        "  var problemIds = new Set(BANK.problems.map(function (item) { return item.id; }));\n"
        "  var knowledgeIds = new Set(BANK.knowledge.map(function (item) { return item.id; }));\n"
        "  data.problems.forEach(function (item) {\n"
        "    if (!problemIds.has(item.id)) BANK.problems.push(item);\n"
        "  });\n"
        "  data.knowledge.forEach(function (item) {\n"
        "    if (!knowledgeIds.has(item.id)) BANK.knowledge.push(item);\n"
        "  });\n"
        "  BANK.meta = BANK.meta || {};\n"
        "  BANK.meta.sources = Array.isArray(BANK.meta.sources) ? BANK.meta.sources : [];\n"
        "  if (BANK.meta.sources.indexOf(data.source) < 0) BANK.meta.sources.push(data.source);\n"
        "  window.CALVIN_IMPORT_META = data;\n"
        "})();\n",
        encoding="utf-8",
    )

    OUTPUT.write_text(json.dumps({
        "sourcePages": 99,
        "problemCount": len(problems),
        "problems": problems,
        "notes": notes,
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    missing_original = [item["pdfId"] for item in problems if not item["statement"]]
    empty_solution = [item["pdfId"] for item in problems if not item["solution"]]
    print(f"problems={len(problems)} missing_original={len(missing_original)} empty_solution={len(empty_solution)}")
    print(f"notes={len(notes)}")
    print(f"imported_problems={len(import_problems)} imported_notes={len(import_notes)}")
    print("missing_original", missing_original[:20])
    print("empty_solution", empty_solution[:20])
    for item in problems[:8]:
        print("\n=====", item["pdfId"], item["title"], "=====")
        print("STATEMENT:", repr(item["statement"][:700]))
        print("SOLUTION:", repr(item["solution"][:500]))
if __name__ == "__main__":
    main()
