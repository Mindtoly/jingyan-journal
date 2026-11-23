<script setup>
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import DateArchive from './components/DateArchive.vue'
import ArticleList from './components/ArticleList.vue'
import SubmissionGuidelines from './components/SubmissionGuidelines.vue'
import NoticeList from './components/NoticeList.vue'
import { formatMonth, prepareCatalog, publicationDate, searchArticles } from './articles.js'

const sections = [
  { id: 'archive', title: '文章列表' },
  { id: 'style', title: '投稿须知' },
  { id: 'notices', title: '通知公告' },
  { id: 'about', title: '关于我们', text: '《经济研学动态》用于交流经济学学习与研究成果。' },
]

const articlesUrl = new URL('articles/', new URL(import.meta.env.BASE_URL, document.baseURI))
const today = publicationDate()
const articles = shallowRef([])
const catalogStatus = ref('loading')
const section = ref('archive')
const selection = ref('')
const query = ref('')
const searchTerm = ref('')
const resultsTitle = ref(null)

const activeSection = computed(() => sections.find(item => item.id === section.value))
const showArchive = computed(() => section.value === 'archive' && articles.value.length > 0)
const years = computed(() => [...new Set(articles.value.map(article => article.date.slice(0, 4)))])
const availableMonths = computed(() => new Set(articles.value.map(article => article.date.slice(0, 7))))
const heading = computed(() => {
  if (searchTerm.value) return '“' + searchTerm.value + '”的检索结果'
  if (section.value === 'archive' && selection.value) return formatMonth(selection.value)
  return activeSection.value.title
})
const results = computed(() => {
  if (searchTerm.value) return searchArticles(articles.value, searchTerm.value)
  return articles.value.filter(article => article.date.startsWith(selection.value))
})
const emptyMessage = computed(() => {
  if (searchTerm.value) return '未找到相关文章。'
  return selection.value ? '本月暂无文章。' : '暂无已发表文章。'
})

async function loadCatalog() {
  catalogStatus.value = 'loading'
  try {
    const response = await fetch(new URL('catalog.json', articlesUrl))
    if (!response.ok) throw new Error('Article catalog unavailable')
    articles.value = prepareCatalog(await response.json(), today, articlesUrl)
    selection.value = articles.value[0]?.date.slice(0, 7) ?? ''
    catalogStatus.value = 'ready'
  } catch {
    catalogStatus.value = 'error'
  }
}

function clearSearch() {
  query.value = ''
  searchTerm.value = ''
}

function showSection(id) {
  section.value = id
  clearSearch()
}

async function showSectionFromFooter(id) {
  showSection(id)
  await nextTick()
  resultsTitle.value?.focus({ preventScroll: true })
  resultsTitle.value?.scrollIntoView({ block: 'start' })
}

function selectMonth(date) {
  selection.value = date
  clearSearch()
}

function submitSearch() {
  section.value = 'archive'
  searchTerm.value = query.value.trim()
}

onMounted(loadCatalog)
</script>

<template>
  <SiteHeader
    v-model:query="query"
    :sections="sections"
    :active-section="searchTerm ? '' : section"
    @search="submitSearch"
    @select-section="showSection"
  />
  <main class="page-width layout" :class="{ 'layout--single': !showArchive }">
    <DateArchive
      v-if="showArchive"
      :years="years"
      :available-months="availableMonths"
      :selected-month="searchTerm ? '' : selection"
      @select="selectMonth"
    />
    <section aria-labelledby="results-title">
      <div
        class="results-heading d-flex flex-wrap align-items-baseline justify-content-between"
        :class="{ 'results-heading--archive': section === 'archive' }"
      >
        <h2
          id="results-title"
          ref="resultsTitle"
          tabindex="-1"
          :class="{ 'month-title': section === 'archive' && !searchTerm && selection }"
        >{{ heading }}</h2>
        <div v-if="section === 'archive'" class="d-flex align-items-center gap-3">
          <span
            v-if="catalogStatus === 'ready'"
            class="result-total"
            aria-live="polite"
          >{{ results.length }} 篇文章</span>
          <button v-if="searchTerm" class="clear-search" type="button" @click="clearSearch">清空检索</button>
        </div>
      </div>

      <template v-if="section === 'archive'">
        <p v-if="catalogStatus === 'loading'" class="note" role="status">正在加载文章。</p>
        <p v-else-if="catalogStatus === 'error'" class="note" role="status">
          文章加载失败。<button class="retry" type="button" @click="loadCatalog">重试</button>
        </p>
        <ArticleList v-else :key="searchTerm ? 'search:' + searchTerm : selection" :articles="results" :empty-message="emptyMessage" />
      </template>
      <SubmissionGuidelines v-else-if="section === 'style'" />
      <NoticeList v-else-if="section === 'notices'" />
      <p v-else class="note">{{ activeSection.text }}</p>
    </section>
  </main>
  <SiteFooter :sections="sections" @select-section="showSectionFromFooter" />
</template>
