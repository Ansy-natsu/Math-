# Math Studio

微积分与线性代数题库合集，包含课程入口、公开题库和内容管理后台。

## 线上地址

- 题库目录：<https://ansy.netlify.app/>
- 微积分题库：<https://ansy.netlify.app/calculus/>
- 线性代数题库：<https://ansy.netlify.app/linear-algebra/>
- 微积分后台：<https://ansy.netlify.app/calculus/admin.html>
- 线性代数后台：<https://ansy.netlify.app/linear-algebra/admin.html>

线性代数题库提供与微积分一致的树状题目索引，并增加“交互版”：

- 9 章、52 个小节的教材目录
- 52 个小节默认折叠，点击后才展开该节内容
- 每节按“定义 / 性质 / 相关定理 / 典型方法”分组展示
- 52 个补充定义、52 个性质和 53 个定理，连同原概念讲解与公式组成完整知识链
- 每节补充方法清单与检查点
- 可折叠的概念、公式与易错提醒
- 77 个可点击例题及完整讲解
- “例题速查”弹层，可按当前章节随机抽取例题

微积分交互版也改为默认折叠：

- 原教材正文文字和顺序保持不变
- 2 章、10 个小节和 43 个知识分组默认折叠
- 原有 22 道题接入对应小节，另补充 8 道导数与微分例题
- 小节、知识分组和例题均需点击后展开，支持“例题速查”

## 公式渲染

- 使用 KaTeX 代替 MathJax，提升首屏和展开时的公式渲染速度
- 题库采用按展开区块懒渲染，不处理隐藏内容
- 搜索输入增加防抖，避免每次按键都重建公式
- 自动修正历史数据中的双重 LaTeX 转义，并保持矩阵换行正确

## 本地运行

```powershell
npm start
```

本地入口：

- 题库目录：<http://127.0.0.1:8787/>
- 微积分题库：<http://127.0.0.1:8787/calculus/>
- 线性代数题库：<http://127.0.0.1:8787/linear-algebra/>

本地服务为两套题库分别提供 `/calculus/api/data` 和 `/linear-algebra/api/data` 发布接口，发布时会备份到对应目录的 `.backups/`。

## 目录结构

```text
/
├─ index.html             题库选择目录
├─ landing.css            目录页样式
├─ calculus/              微积分子站
│  ├─ index.html
│  ├─ admin.html
│  ├─ data.js
│  └─ ...
├─ linear-algebra/        线性代数子站
│  ├─ index.html
│  ├─ admin.html
│  ├─ data.js
│  └─ ...
└─ server.js              本地预览与双题库发布服务
```

Netlify 部署 `main` 分支根目录；推送到 GitHub 后会自动更新线上站点。
