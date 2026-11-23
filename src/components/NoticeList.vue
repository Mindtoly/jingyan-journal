<script setup>
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'

const noticesUrl = new URL('notices/', new URL(import.meta.env.BASE_URL, document.baseURI))
const pageSize = 10
const notices = shallowRef([])
const catalogStatus = ref('loading')
const page = ref(1)
const bodies = reactive(new Map())

const pageCount = computed(() => Math.ceil(notices.value.length / pageSize))
const visibleNotices = computed(() => {
  const start = (page.value - 1) * pageSize
  return notices.value.slice(start, start + pageSize)
})

function prepareNotices(records) {
  if (!Array.isArray(records)) throw new Error('Invalid notice catalog')

  const ids = new Set()
  for (const notice of records) {
    const date = new Date(notice?.date)
    if (
      !notice || typeof notice.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(notice.id)
      || ids.has(notice.id) || typeof notice.title !== 'string' || !notice.title.trim()
      || typeof notice.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(notice.date)
      || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== notice.date
    ) throw new Error('Invalid notice record')
    ids.add(notice.id)
  }

  return [...records].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}

async function loadCatalog() {
  catalogStatus.value = 'loading'
  try {
    const response = await fetch(new URL('catalog.json', noticesUrl))
    if (!response.ok) throw new Error('Notice catalog unavailable')
    notices.value = prepareNotices(await response.json())
    page.value = 1
    catalogStatus.value = 'ready'
  } catch {
    catalogStatus.value = 'error'
  }
}

async function loadBody(id) {
  const state = bodies.get(id)
  if (state?.status === 'loading' || state?.status === 'ready') return

  bodies.set(id, { status: 'loading' })
  try {
    const response = await fetch(new URL(id + '.txt', noticesUrl), { headers: { Accept: 'text/plain' } })
    if (!response.ok) throw new Error('Notice body unavailable')
    const paragraphs = (await response.text()).split(/\r?\n/).map(line => line.trim()).filter(Boolean)
    if (!paragraphs.length) throw new Error('Notice body is empty')
    bodies.set(id, { status: 'ready', paragraphs })
  } catch {
    bodies.set(id, { status: 'error' })
  }
}

function loadOnOpen(event, id) {
  if (event.currentTarget.open) loadBody(id)
}

onMounted(loadCatalog)
</script>

<template>
  <p v-if="catalogStatus === 'loading'" class="note" role="status">正在加载通知公告。</p>
  <p v-else-if="catalogStatus === 'error'" class="note" role="status">
    通知公告加载失败。<button class="retry" type="button" @click="loadCatalog">重试</button>
  </p>
  <p v-else-if="!notices.length" class="note">暂无通知公告。</p>
  <template v-else>
    <ol class="notice-list">
      <li v-for="notice in visibleNotices" :key="notice.id">
        <details @toggle="loadOnOpen($event, notice.id)">
          <summary>
            <span class="notice-title">{{ notice.title }}</span>
            <time :datetime="notice.date">{{ notice.date }}</time>
          </summary>
          <div class="notice-body">
            <template v-if="bodies.get(notice.id)?.status === 'ready'">
              <p v-for="(paragraph, index) in bodies.get(notice.id).paragraphs" :key="index" class="notice-text">{{ paragraph }}</p>
            </template>
            <p v-else-if="bodies.get(notice.id)?.status === 'error'" role="status">
              公告正文加载失败。<button class="retry" type="button" @click="loadBody(notice.id)">重试</button>
            </p>
            <p v-else role="status">正在加载公告正文。</p>
          </div>
        </details>
      </li>
    </ol>
    <nav v-if="pageCount > 1" class="notice-pagination" aria-label="公告分页">
      <button type="button" :disabled="page === 1" @click="page--">上一页</button>
      <span aria-live="polite">第 {{ page }} / {{ pageCount }} 页</span>
      <button type="button" :disabled="page === pageCount" @click="page++">下一页</button>
    </nav>
  </template>
</template>

<style scoped>
.notice-list { list-style: none; margin: .45rem 0 0; padding: 0; }
.notice-list li { border-bottom: 1px solid var(--line); }
.notice-list summary {
  display: grid;
  grid-template-columns: .55rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: .55rem;
  padding: .8rem 0;
  cursor: pointer;
  list-style: none;
}
.notice-list summary::-webkit-details-marker { display: none; }
.notice-list summary::before {
  content: "";
  align-self: center;
  width: .42rem;
  height: .42rem;
  border-right: 1px solid var(--wine);
  border-bottom: 1px solid var(--wine);
  transform: rotate(-45deg);
}
.notice-list details[open] summary::before { transform: rotate(45deg); }
.notice-list summary:hover .notice-title, .notice-list details[open] .notice-title { color: var(--wine); }
.notice-title { font: 650 1.0625rem/1.5 var(--song); overflow-wrap: anywhere; }
.notice-list time { color: var(--muted); font-size: .8125rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.notice-body { margin: 0 0 1rem 1.1rem; font-size: .9375rem; line-height: 1.75; }
.notice-body p { margin: 0; }
.notice-text { text-indent: 2em; white-space: pre-wrap; overflow-wrap: anywhere; }
.notice-text + .notice-text { margin-block-start: 1.75em; }
.notice-pagination { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: .65rem 1rem; margin-top: 1.25rem; }
.notice-pagination span { color: var(--muted); font-size: .875rem; font-variant-numeric: tabular-nums; }
.notice-pagination button { background: transparent; border: 1px solid var(--line); border-radius: .18rem; padding: .38rem .7rem; color: var(--wine); }
.notice-pagination button:hover:not(:disabled) { background: var(--soft-wine); }
.notice-pagination button:disabled { color: var(--muted); opacity: .65; }
</style>
