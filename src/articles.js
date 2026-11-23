const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function publicationDate(date = new Date()) {
  const parts = dateFormatter.formatToParts(date)
  const part = type => parts.find(value => value.type === type).value
  return [part('year'), part('month'), part('day')].join('-')
}

export function monthId(year, month) {
  return year + '-' + String(month).padStart(2, '0')
}

export function formatMonth(value) {
  const [year, month] = value.split('-')
  return year + ' 年 ' + Number(month) + ' 月'
}

function normalize(text) {
  return text.normalize('NFKC').toLowerCase()
}

export function searchArticles(articles, query) {
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean)
  return articles.filter(article => {
    const text = normalize([
      article.title,
      article.author,
      article.abstract,
    ].join(' '))
    return terms.every(term => text.includes(term))
  })
}

export function prepareCatalog(records, today, articlesUrl) {
  if (!Array.isArray(records)) throw new Error('Invalid article catalog')

  const ids = new Set()
  for (const record of records) {
    if (
      !record || typeof record.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)
      || ids.has(record.id) || typeof record.date !== 'string'
      || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)
      || !Number.isFinite(Date.parse(record.date))
      || new Date(record.date).toISOString().slice(0, 10) !== record.date
      || typeof record.title !== 'string' || !record.title.trim()
      || typeof record.author !== 'string' || !record.author.trim()
      || typeof record.abstract !== 'string'
    ) {
      throw new Error('Invalid article record')
    }
    ids.add(record.id)
  }

  return records
    .filter(record => record.date <= today)
    .map(record => ({ ...record, pdfUrl: new URL(record.id + '.pdf', articlesUrl).href }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}
