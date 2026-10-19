# Math Studio

微积分与线性代数题库合集，包含课程入口、公开题库和内容管理后台。

## 线上地址

- 题库目录：<https://ansy.netlify.app/>
- 微积分题库：<https://ansy.netlify.app/calculus/>
- 线性代数题库：<https://ansy.netlify.app/linear-algebra/>
- 微积分后台：<https://ansy.netlify.app/calculus/admin.html>
- 线性代数后台：<https://ansy.netlify.app/linear-algebra/admin.html>

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
