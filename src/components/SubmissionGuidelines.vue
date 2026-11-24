<script setup>
const templateUrl = import.meta.env.BASE_URL + 'downloads/jingyan-latex-template.zip'
</script>

<template>
  <div class="submission-guide">
    <section>
      <h3>投稿范围</h3>
      <p>《经济研学动态》用于交流经济学学习与研究成果，欢迎围绕经济学问题撰写的研究文章和文献评述。</p>
    </section>

    <section>
      <h3>投稿方式</h3>
      <p>
        <strong>发送投稿邮件即表示接受投稿时公布的<a href="#publication-terms">著作权与刊发许可条款</a>。</strong>
        请在投稿前阅读全文，特别留意许可期限、无偿许可和公开 GitHub 托管的约定。对条款有疑问，可以先联系编辑部。
      </p>
      <p>
        请将稿件发至编辑部邮箱 <a href="mailto:onlys4@outlook.com">onlys4@outlook.com</a>。
        邮件主题可写为「投稿｜文章标题｜作者署名」。请在邮件中注明联系方式。
        稿件曾公开发表的，请随稿说明原出处和发表日期。
      </p>
    </section>

    <section id="publication-terms">
      <h3>著作权与刊发许可</h3>
      <p>
        <strong>权利归属。</strong>稿件著作权由原权利人保留，权利人仍可自行使用作品或另行授权。
        投稿人应有权作出下列授权。合著稿件须经全体合著者同意，由其共同投稿或授权代表投稿。
        如已有与本次刊发有关的授权约定，或稿件含有第三方图表、图片等材料，请随稿说明可使用的范围及依据。
      </p>
      <p>
        <strong>审阅与校样。</strong>来稿 PDF 用于内部审阅，定稿 LaTeX 源文件和未公开附件仅供内部编校与归档。
        本刊按作者确认的署名刊发，涉及内容的实质性修改须征得作者同意。
        网络刊发许可在稿件录用且作者确认最终 PDF 后生效。尚未发表的稿件，作者确认最终 PDF 即同意本刊首次公开刊发该版本。
      </p>
      <p>
        <strong>许可范围、期限与报酬。</strong>权利人授予本刊运营者全球范围内的非专有许可，
        允许其复制、存档并通过本刊网站向公众提供经确认的最终 PDF 供阅读和下载，同时展示文章标题、公开署名和摘要。
        许可至作品著作财产权保护期届满，双方另有书面约定或依法提前终止的，从其约定或规定。
        除双方另有书面约定外，本刊不支付稿酬或许可使用费。
        如以 CC 等公众许可刊发，须由权利人另行确认许可及其适用范围。
      </p>
      <p>
        <strong>公开托管。</strong>权利人同意本刊将最终 PDF 和文章目录上传至用于部署本刊网站的公开 GitHub 仓库，并通过 GitHub Pages 刊发。
        根据<a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#d-user-generated-content">GitHub 服务条款</a>，
        GitHub 用户可在平台内查看和 fork（在 GitHub 上复制仓库），GitHub 及其关联方可按条款使用上传内容，包括用于训练 AI。
        权利人同意本刊为上述托管按该条款向 GitHub 及其用户授予相应许可。
      </p>
      <p>
        <strong>更正、撤稿和权利异议。</strong>作者或权利人可通过编辑部邮箱提出更正、撤稿请求或权利异议。
        本刊核实后答复，并根据情况更正、暂停公开或撤稿。违反本条款的一方依法承担相应责任。
        本条款适用于公布后提交的稿件。双方另有书面约定的，以该约定为准。
      </p>
    </section>

    <section>
      <h3>投稿附件清单</h3>
      <ul>
        <li>
          <strong>初次投稿。</strong>仅接收一份完整的 PDF，供编辑部审阅。请在稿件中列明文章标题和拟公开的作者署名。
          多位作者请注明署名顺序，建议附摘要和关键词。图表请注明编号和标题，涉及数据时请标明单位和来源。
        </li>
        <li>
          <strong>定稿后。</strong>编辑部确认采用且稿件定稿后，请补交 LaTeX 主文件及稿件实际用到的子文件、图片、
          参考文献库和自定义样式文件。可将源文件及附件打包为 ZIP，请保留原有目录结构。
        </li>
      </ul>
      <p>编辑部根据定稿统一排版。文章以单篇 PDF 形式刊发，按发表年月归档。</p>
    </section>

    <section>
      <h3>参考文献引注与著录体例</h3>
      <p>
        <strong>正文引注。</strong>采用作者—年份格式。正文已提及作者时，括号内列年份和必要页码，如「马克思（1972，第 832 页）」。
        采用括号式引注时，将作者、年份和必要页码一并列在括号内，如「（马克思，1972，第 832 页）」。
        直接引用原文时请标明所引页码。脚注用于补充说明。
      </p>
      <p>
        <strong>同处引用多篇文献。</strong>不同作者的文献用分号隔开，如「（张三，2020；李四，2022）」。
        同一作者的多项文献可合并列出，如「（张三，2020，2022a，2022b）」。
        同一作者同年的不同文献，在年份后加 a、b、c，正文和文末保持一致。
      </p>
      <p>
        <strong>中译本与外文原文。</strong>引用中译本时，使用作者的通行中文译名，年份和页码以实际所引译本为准。
        引用外文原文时，使用作者的原文姓氏，如「（Smith，2020，p. 15）」。
        同处引用中文和外文文献时，各自保留相应的姓名写法。
      </p>
      <p>
        <strong>文末参考文献。</strong>文末列出正文引用过的文献。中文文献及中译本排在前，外文原文文献排在后。
        中文组按第一作者姓氏的完整拼音排序，外文组按第一作者姓氏的字母顺序排序。
        同一作者的多项文献按出版年份从早到晚排列。
      </p>
      <table class="table reference-formats">
        <thead>
          <tr>
            <th scope="col">文献类型</th>
            <th scope="col">著录格式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">中文期刊论文</th>
            <td>作者，年份：《篇名》，《刊名》第 X 期，第 X—X 页。有卷号时一并标明。</td>
          </tr>
          <tr>
            <th scope="row">中文专著</th>
            <td>作者，年份：《书名》，出版社。</td>
          </tr>
          <tr>
            <th scope="row">中译本</th>
            <td>作者中文译名，译本年份：《书名》，译者译，出版社。</td>
          </tr>
          <tr>
            <th scope="row">论文集中的文章</th>
            <td>作者，年份：《篇名》，载于编者编《论文集名》，出版社，第 X—X 页。</td>
          </tr>
          <tr>
            <th scope="row">外文期刊论文</th>
            <td>Surname, A., Year, “Article Title,” <i>Journal Name</i>, Volume(Issue), pp. X–X.</td>
          </tr>
          <tr>
            <th scope="row">外文专著</th>
            <td>Surname, A., Year, <i>Book Title</i>, Publisher.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="submission-downloads">
      <h3>附件下载</h3>
      <ul>
        <li><a :href="templateUrl" download>《经济研学动态》单篇文章 LaTeX 模板（ZIP）</a></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.submission-guide { max-width: 53rem; margin-block-start: 1.25rem; line-height: 1.75; }
.submission-guide section + section { margin-block-start: 1.5rem; }
.submission-guide .submission-downloads { margin-block-start: clamp(2.5rem, 5vw, 3.25rem); }
.submission-guide h3 { margin: 0 0 .5rem; color: var(--wine); font: 700 1.2rem/1.4 var(--song); }
.submission-guide p, .submission-guide ul { margin: 0 0 .65rem; }
.submission-guide p { text-indent: 2em; }
.submission-guide ul { padding-inline-start: 1.3rem; }
.submission-guide li + li { margin-block-start: .35rem; }
.submission-guide a { text-underline-offset: .17em; overflow-wrap: anywhere; }
.reference-formats { table-layout: fixed; margin-block-end: 0; }
.reference-formats th:first-child { width: 9rem; }
.reference-formats th, .reference-formats td { overflow-wrap: anywhere; }
@media (max-width: 590px) {
  .reference-formats th:first-child { width: 6rem; }
}
</style>
