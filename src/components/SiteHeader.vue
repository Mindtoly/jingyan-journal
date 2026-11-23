<script setup>
import { BButton, BFormInput } from 'bootstrap-vue-next'

defineProps({
  sections: { type: Array, required: true },
  activeSection: { type: String, required: true },
})

const query = defineModel('query', { type: String, required: true })
const emit = defineEmits(['search', 'select-section'])
</script>

<template>
  <header class="site-header">
    <div class="page-width masthead d-flex justify-content-between">
      <h1>经济研学动态</h1>
      <form class="search input-group" role="search" @submit.prevent="emit('search')">
        <label for="query" class="visually-hidden">检索文章</label>
        <BFormInput
          id="query"
          v-model="query"
          type="search"
          placeholder="检索标题、作者或摘要"
        />
        <BButton type="submit" variant="primary">检索</BButton>
      </form>
    </div>
    <nav class="site-nav" aria-label="网站栏目">
      <div class="page-width nav">
        <button
          v-for="item in sections"
          :key="item.id"
          class="nav-link"
          type="button"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          @click="emit('select-section', item.id)"
        >{{ item.title }}</button>
      </div>
    </nav>
  </header>
</template>
