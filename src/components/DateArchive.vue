<script setup>
import { nextTick, ref } from 'vue'
import { formatMonth, monthId } from '../articles.js'

defineProps({
  years: { type: Array, required: true },
  availableMonths: { type: Set, required: true },
  selectedMonth: { type: String, required: true },
})

const emit = defineEmits(['select'])
const months = Array.from({ length: 12 }, (_, index) => 12 - index)
const open = ref(false)
const toggle = ref(null)
const dismiss = ref(null)

async function openArchive() {
  open.value = true
  await nextTick()
  dismiss.value?.focus({ preventScroll: true })
}

async function closeArchive() {
  if (!open.value) return
  open.value = false
  await nextTick()
  toggle.value?.focus({ preventScroll: true })
}

function select(date) {
  emit('select', date)
  closeArchive()
}
</script>

<template>
  <div class="archive-controls" @keydown.esc="closeArchive">
    <button
      ref="toggle"
      type="button"
      class="archive-toggle"
      aria-label="展开日期筛选"
      aria-controls="archive-panel"
      :aria-expanded="open"
      @click="openArchive"
    >
      <span class="archive-toggle-icon" aria-hidden="true"></span>
    </button>
    <div v-show="open" class="archive-backdrop" aria-hidden="true" @click="closeArchive"></div>
    <aside id="archive-panel" class="archive-box" :class="{ 'is-open': open }" aria-label="年月归档">
      <button ref="dismiss" type="button" class="archive-close" @click="closeArchive">收起</button>
      <details v-for="(year, index) in years" :key="year" class="year" :open="index === 0 ? '' : undefined">
        <summary>{{ year }} 年</summary>
        <div class="month-grid">
          <button
            v-for="month in months"
            :key="month"
            type="button"
            class="month"
            :disabled="!availableMonths.has(monthId(year, month))"
            :aria-label="formatMonth(monthId(year, month))"
            :aria-current="selectedMonth === monthId(year, month) ? 'date' : undefined"
            @click="select(monthId(year, month))"
          >{{ month }}月</button>
        </div>
      </details>
    </aside>
  </div>
</template>
