# 经济研学动态

## 本地开发

使用 Node.js 20.19+ 或 22.12+。在项目根目录运行

```powershell
npm install
npm run dev
```

打开终端给出的本地地址。运行 `npm run build` 生成静态站点 `dist/`，用 `npm run preview` 检查构建结果。早期交互演示见[独立演示页](docs/theme-preview.html)。

## 项目目录

| 目录 | 用途 |
| --- | --- |
| `src/` | 正式网站的 Vue 页面、组件和样式 |
| `public/articles/` | 正式发布的文章目录和 PDF |
| `public/notices/` | 通知公告目录和正文 |
| `public/downloads/` | 面向作者的下载附件，包括 LaTeX 模板压缩包 |
| `docs/` | 产品方案与早期的独立交互演示页 |
| `templates/article/` | 单篇 LaTeX 模板及使用说明 |
| `node_modules/` | npm 安装的依赖 |
| `dist/` | Vite 生成的静态站点 |

## 文章数据

`public/articles/` 存放正式发布数据，归档年份由已发表文章的日期生成。网站发布首篇正式文章前会显示「暂无已发表文章」。

正式发布时，编辑部以 LaTeX 定稿和发表日期生成以下文件。

| 文件 | 内容 |
| --- | --- |
| `catalog.json` | 文章列表。每条包含 `id`、`title`、`author`、`date`（YYYY-MM-DD）和 `abstract`。 |
| `<id>.pdf` | 用同一份定稿编译出的阅读文件。 |

文章 ID 与 PDF 文件名对应。网站按发表日期归档，只检索目录中已发表文章的标题、作者和摘要。发布稿件时应同时更新目录和 PDF。

### 文章 ID 登记

编辑部在稿件定稿时维护本地登记表 `../编辑部/文章ID登记.csv`。新稿统一使用 `article-` 加六位十进制流水号，从 `article-000001` 开始。每次在表内取已登记的最大流水号加一，跨年连续编号。发表日期由文章目录的 `date` 字段管理。

登记时填入文章 ID、标题、作者、登记日期和状态。状态填「已登记」，上线后改为「已发表」。稿件停用时保留该行，并标记为「停用」，流水号继续占用。同一篇稿件的定稿目录、`--id` 和正式 PDF 文件名沿用同一个 ID。

编辑部用登记表给稿件分号并查重。发布脚本校验新文章 ID 的格式，并在写入正式目录时检查同名记录和 PDF。修订已发表稿件时沿用原 ID，确认覆盖时使用 `--replace`。

## 通知公告

在 `public/notices/catalog.json` 的数组内为每条公告记录 `id`、`title` 和 `date`。ID 使用小写英文字母、数字和连字符，并为每条公告取不同的 ID。发布日期使用 `YYYY-MM-DD`。将正文保存为同目录下的 `<id>.txt`，使用 UTF-8 编码，以换行分段。

网站按发布日期倒序每页展示 10 条。默认展示标题和日期，展开时才读取对应正文。同一页可同时展开多条。

## 发布单篇文章

### 1. 整理 LaTeX 定稿

在登记表中分配文章 ID，并确定发表日期。将 [`templates/article/`](templates/article/) 复制到网站项目外的稿件定稿目录，在 `main.tex` 中录入定稿，并一并保存 `jingyan.cls`、图片、参考文献等编译资源。排版写法见[模板使用说明](templates/article/使用说明.md)。

列表中的文章标题和署名取自 `\ArticleTitle{标题}{作者}`，摘要取自 `\ArticleAbstract{摘要}`，允许省略摘要。三个展示字段使用纯文本，LaTeX 特殊字符可用 `\%`、`\&` 等方式转义。如果这些命令位于 `\input` 引入的文件中，用 `--metadata-tex` 指定该文件。

### 2. 生成待审文件

在网站项目根目录的 PowerShell 中运行。下例假定编辑部目录与网站项目同级，`--tex`、文章 ID 和日期请换成该篇稿件的实际值。使用 MiKTeX 时，可先运行 `xelatex --version` 确认当前终端能调用编译器。

```powershell
$reviewRoot = '..\编辑部\待审'
New-Item -ItemType Directory -Path $reviewRoot -Force | Out-Null
$stage = Join-Path $reviewRoot 'article-000001-v1'
node scripts/publish-article.mjs prepare `
  --tex '..\编辑部\定稿\article-000001\main.tex' `
  --id article-000001 --date 2026-11-23 --out $stage
```

`--out` 指向网站项目外一个尚不存在的目录，其上一级目录须已存在。建议用编辑部的待审目录，方便跨会话审核和发布。脚本默认运行两遍 XeLaTeX，将 `<id>.pdf` 和只含这篇文章的 `catalog.json` 写到待审目录。编译产生的中间文件放在系统临时目录，普通运行结束时会自动清理。待审目录由编辑部保管，后续 `publish` 会从那里读取这两个文件。

已用同一份定稿生成 PDF 时，可加 `--pdf '对应的单篇.pdf'`，用该 PDF 生成待审文件，目录元数据仍从 LaTeX 读取。需要自动处理 BibTeX 或 Biber 时，可在配置好 `latexmk` 的环境中加 `--latexmk`。每次最多使用其中一个选项。MiKTeX 启动失败或提示缺包时，参见下文的「MiKTeX 编译排查」。

### 3. 核对待审版本

- 打开 PDF，核对标题、作者、正文版本和排版，尤其是公式、图表、脚注与交叉引用。
- 核对 `catalog.json` 的标题、署名、摘要和发表日期，确认 ID 与 PDF 文件名对应。
- 定稿、元数据或发表日期有改动时，重新运行 `prepare`，换一个新的待审目录，例如 `article-000001-v2`。审核通过后，发布本次确认的那一个目录。

### 4. 写入正式文章目录

审核通过且按北京时间已到发表日后，在网站项目根目录运行。将下例的路径换成审核通过的待审目录，即使另开 PowerShell 也可直接执行。

```powershell
node scripts/publish-article.mjs publish --from '..\编辑部\待审\article-000001-v1'
```

脚本把 PDF 写入 `public/articles/`，并将文章记录合并到同目录的 `catalog.json`。确认更新同一篇已发表文章时，在发布命令末尾加 `--replace`。正式开发站刷新后会读取本地更新。

### 5. 构建、预览并上线

```powershell
npm run build
npm run preview
```

打开预览地址，确认文章进入对应年月，能用标题、作者及摘要中的词检索（如有摘要），点击标题能打开刚审核的 PDF。

预览通过后，提交 `public/articles/` 中本次更新的目录和 PDF，推送至 `main`。GitHub Actions 从仓库源码重新构建并将生成的 `dist/` 发布到 GitHub Pages。部署成功后，在公开站点核对文章条目和 PDF 链接。[部署记录](https://github.com/Mindtoly/jingyan-journal/actions/workflows/pages.yml) · [公开站点](https://mindtoly.github.io/jingyan-journal/)

LaTeX 定稿及其编译资源保存在编辑部。文章发布所需的 PDF 和目录已经写入 `public/articles/`，后续构建从这里取数据，待审文件可按编辑部需要保留或归档。

### MiKTeX 编译排查

在运行 `prepare` 的 Windows PowerShell 中执行 `xelatex --version`。找不到命令时，检查 MiKTeX 安装和当前终端的 `PATH`。如果 Codex 沙箱内显示 `RegOpenKeyExW` 或访问 MiKTeX 用户目录时提示「拒绝访问」，在普通的 Windows PowerShell 中运行 `prepare`，让 MiKTeX 读取当前用户的配置。

如果编译报 `GUI framework cannot be initialized`，在稿件目录用以下命令试编。`--disable-installer` 会关闭这次编译的自动装包流程，让缺失文件显示在终端输出里。[MiKTeX 自动装包说明](https://docs.miktex.org/manual/texfeatures.html#automatic-package-installation)

```powershell
xelatex --disable-installer -interaction=nonstopmode -halt-on-error -no-shell-escape main.tex
```

例如，本模板曾因缺少 `nameref.sty` 而无法编译。在普通的 Windows PowerShell 中运行 `miktex packages install nameref`，然后回到网站根目录重试原来的 `prepare` 命令。遇到其他缺失文件时，按编译器报告补齐对应的包。[MiKTeX 包管理命令](https://docs.miktex.org/manual/miktex-packages.html)
