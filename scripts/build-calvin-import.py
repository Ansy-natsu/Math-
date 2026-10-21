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

SKIP_IMPORT_IDS = {"4.6-8(1)(2)"}

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
    problem_type = infer_type(item["title"], statement)
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
        "right_answer": answer_from_solution(solution, problem_type),
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
    content = clean_text(note["text"])
    return {
        "id": "CWX-NOTE-" + str(index + 1),
        "title": f"陈维新｜{title}",
        "chapter": chapter,
        "section": section,
        "content": content,
        "formulas": [],
        "tips": [line for line in content.splitlines() if line.strip()],
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
