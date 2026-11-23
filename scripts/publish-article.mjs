import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { access, copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { prepareCatalog, publicationDate } from '../src/articles.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const articlesDir = join(root, 'public', 'articles')
const catalogName = 'catalog.json'
const validationUrl = new URL('https://example.invalid/articles/')
const windowsDevice = /^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/i
const articleIdFormat = /^article-[0-9]{6}$/

function validateCatalog(records) {
  prepareCatalog(records, '9999-12-31', validationUrl)
  if (records.some(record => windowsDevice.test(record.id))) {
    throw new Error('文章 ID 不能是 Windows 保留设备名。')
  }
}

async function validatePublicationId(id, catalog) {
  if (articleIdFormat.test(id) && id !== 'article-000000') return

  // Existing articles keep their IDs so previously published PDF links stay valid.
  const published = catalog ?? await loadCatalog(articlesDir)
  if (!published.some(record => record.id === id)) {
    throw new Error('新文章 ID 须使用 article- 加六位流水号，范围为 article-000001 至 article-999999。')
  }
}

function readGroups(tex, name, count, required) {
  const matches = [...tex.matchAll(new RegExp(String.raw`(?<!\\)\\${name}(?![A-Za-z@])`, 'g'))]
  if (!matches.length && !required) return ['']
  if (matches.length !== 1) throw new Error(`元数据来源应包含一处 \\${name}。`)

  let rest = tex.slice(matches[0].index + matches[0][0].length)
  return Array.from({ length: count }, () => {
    rest = rest.trimStart()
    const group = /^\{((?:\\[{}%$#&_]|[^{}\\$#&_~^])*)\}/u.exec(rest)
    if (!group) {
      throw new Error(`\\${name} 的展示字段应为纯文本，可用 LaTeX 转义书写特殊字符。`)
    }
    rest = rest.slice(group[0].length)
    return group[1].replace(/\\([{}%$#&_])/gu, '$1').replace(/\s+/gu, ' ').trim()
  })
}

async function readMetadata(path, id, date) {
  const source = await readFile(path, 'utf8')
  const tex = source.replace(/\\[^\r\n]|%[^\r\n]*(?:\r?\n[\t ]*)?/gu, token =>
    token.startsWith('%') ? '' : token,
  )
  const [title, author] = readGroups(tex, 'ArticleTitle', 2, true)
  const [abstract] = readGroups(tex, 'ArticleAbstract', 1, false)
  const record = { id, title, author, date, abstract }
  validateCatalog([record])
  return record
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', windowsHide: true })
  if (result.error?.code === 'ENOENT') {
    throw new Error(`找不到 ${command}。请在运行发布脚本的终端检查 ${command} --version 和 PATH。`)
  }
  if (result.error) {
    throw new Error(`无法启动 ${command}（${result.error.message}）。`)
  }
  if (result.status !== 0) {
    const reason = result.signal ? `信号 ${result.signal}` : `退出码 ${result.status}`
    throw new Error(`${command} 编译失败（${reason}）。请查看上方输出和 README 的「MiKTeX 编译排查」。`)
  }
}

function writeJson(path, value) {
  return writeFile(path, JSON.stringify(value, null, 2) + '\n', 'utf8')
}

async function readPdf(path) {
  const pdf = await readFile(path)
  if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`文件不是有效的 PDF：${path}`)
  }
  return pdf
}

async function compilePdf(entry, id, latexmk) {
  const work = await mkdtemp(join(tmpdir(), 'jingyan-article-'))
  try {
    const options = ['-interaction=nonstopmode', '-halt-on-error', '-no-shell-escape', `-jobname=${id}`]
    const input = `./${basename(entry)}`
    if (latexmk) {
      run('latexmk', ['-xelatex', ...options, `-outdir=${work}`, input], dirname(entry))
    } else {
      const args = [...options, `-output-directory=${work}`, input]
      run('xelatex', args, dirname(entry))
      run('xelatex', args, dirname(entry))
    }
    return await readPdf(join(work, `${id}.pdf`))
  } finally {
    await rm(work, { recursive: true, force: true })
  }
}

async function prepare({ tex, 'metadata-tex': metadataTex, id, date, out, pdf, latexmk }) {
  if (!tex || !id || !date || !out) throw new Error('prepare 需要 --tex、--id、--date 和 --out。')
  if (pdf && latexmk) throw new Error('--pdf 与 --latexmk 只能选择一种。')
  const entry = resolve(tex)
  const stage = resolve(out)
  const relativeStage = relative(root, stage)
  if (!relativeStage || (!isAbsolute(relativeStage) && !relativeStage.startsWith(`..${sep}`) && relativeStage !== '..')) {
    throw new Error('请把待审目录放在网站项目外。')
  }
  if (existsSync(stage)) throw new Error(`待审目录已存在，请指定一个新目录：${stage}`)
  await validatePublicationId(id)
  await access(entry)
  const record = await readMetadata(resolve(metadataTex ?? tex), id, date)
  const pdfBytes = pdf ? await readPdf(resolve(pdf)) : await compilePdf(entry, id, latexmk)

  await mkdir(stage)
  try {
    await writeFile(join(stage, `${id}.pdf`), pdfBytes)
    await writeJson(join(stage, catalogName), [record])
  } catch (error) {
    await rm(stage, { recursive: true, force: true })
    throw error
  }
  console.log(`已生成待审文件：${stage}`)
}

async function loadCatalog(dir) {
  return JSON.parse(await readFile(join(dir, catalogName), 'utf8'))
}

async function publish({ from, replace }) {
  if (!from) throw new Error('publish 需要 --from。')
  const stage = resolve(from)
  const records = await loadCatalog(stage)
  validateCatalog(records)
  if (records.length !== 1) throw new Error('待审目录必须包含一篇文章的目录记录。')
  const [record] = records
  const { id, date } = record
  if (date > publicationDate()) throw new Error('按北京时间尚未到发表日，请将文件留在待审目录。')
  const pdfName = `${id}.pdf`
  const pdf = await readPdf(join(stage, pdfName))

  const lock = join(root, '.article-publication-lock')
  try {
    await mkdir(lock)
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`发布锁已存在，请检查是否有发布任务正在运行：${lock}`)
    throw error
  }
  let keepRecoveryFiles = false
  try {
    const catalog = await loadCatalog(articlesDir)
    validateCatalog(catalog)
    await validatePublicationId(id, catalog)

    const names = [pdfName, catalogName]
    const hasPdf = existsSync(join(articlesDir, pdfName))
    const position = catalog.findIndex(item => item.id === id)
    if (!replace && (hasPdf || position !== -1)) {
      throw new Error(`文章 ID ${id} 已存在。确认更新同一篇文章时使用 --replace。`)
    }
    if (position === -1) catalog.push(record)
    else catalog[position] = record

    // Prepare every file and backup before touching the served directory.
    const previous = new Set(hasPdf ? names : [catalogName])
    for (const name of previous) await copyFile(join(articlesDir, name), join(lock, `old-${name}`))
    await writeFile(join(lock, pdfName), pdf)
    await writeJson(join(lock, catalogName), catalog)

    const installed = []
    try {
      // Install the catalog last so a new article points to files that already exist.
      for (const name of names) {
        await rename(join(lock, name), join(articlesDir, name))
        installed.push(name)
      }
    } catch (error) {
      try {
        for (const name of installed.reverse()) {
          const target = join(articlesDir, name)
          if (previous.has(name)) await copyFile(join(lock, `old-${name}`), target)
          else await rm(target)
        }
      } catch (rollbackError) {
        keepRecoveryFiles = true
        throw new Error(`发布和回滚均未完成。备份保存在 ${lock}。${error.message} ${rollbackError.message}`)
      }
      throw error
    }
    console.log(`已更新正式站的本地文章数据：${id}`)
  } finally {
    if (!keepRecoveryFiles) await rm(lock, { recursive: true, force: true })
  }
}

try {
  const [mode, ...args] = process.argv.slice(2)
  if (mode === 'prepare') {
    const { values } = parseArgs({ args, options: {
      tex: { type: 'string' }, 'metadata-tex': { type: 'string' }, id: { type: 'string' },
      date: { type: 'string' }, out: { type: 'string' }, pdf: { type: 'string' }, latexmk: { type: 'boolean' },
    } })
    await prepare(values)
  } else if (mode === 'publish') {
    const { values } = parseArgs({ args, options: { from: { type: 'string' }, replace: { type: 'boolean' } } })
    await publish(values)
  } else {
    throw new Error('请指定 prepare 或 publish，参数示例见 README.md 的「发布单篇文章」。')
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
