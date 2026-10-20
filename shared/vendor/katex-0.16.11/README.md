# KaTeX 0.16.11（本地托管）

来源：<https://github.com/KaTeX/KaTeX/releases/tag/v0.16.11> 官方发布包 `katex.tar.gz`。

只保留网站用到的文件：`katex.min.js`、`katex.min.css`、`contrib/auto-render.min.js` 与全部 `fonts/*.woff2`。
文件与 `cdn.jsdelivr.net/npm/katex@0.16.11/dist/` 上的同名文件逐字节一致。

改为本地托管的原因：在国内访问 jsdelivr 首次加载 `katex.min.js` 实测约 1.9 秒，
而同站点加载同等大小的文件约 0.3 秒，且少建立一个跨域连接。

升级时新建 `katex-<新版本号>/` 目录并修改页面引用，不要覆盖本目录（该路径按长期缓存配置）。

KaTeX 以 MIT 许可证发布，见同目录 `LICENSE`。
