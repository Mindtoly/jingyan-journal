<script setup>
const props = defineProps({
  sections: { type: Array, required: true },
})

const emit = defineEmits(['select-section'])
const groups = [
  { title: '阅读', sectionIds: ['archive', 'notices'] },
  { title: '投稿与刊物', sectionIds: ['style', 'about'] },
]
</script>

<template>
  <footer class="site-footer">
    <div class="page-width footer-layout">
      <div class="footer-identity">
        <p class="footer-name">经济研学动态</p>
        <p class="footer-description">经济学学习与研究成果的在线出版平台</p>
      </div>
      <nav class="footer-nav" aria-label="页脚导航">
        <div v-for="group in groups" :key="group.title" class="footer-group">
          <h2>{{ group.title }}</h2>
          <ul>
            <li v-for="item in props.sections.filter(section => group.sectionIds.includes(section.id))" :key="item.id">
              <button type="button" @click="emit('select-section', item.id)">{{ item.title }}</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="page-width footer-meta d-flex flex-column flex-sm-row justify-content-between gap-2">
      <p class="m-0">© 2026 经济研学动态</p>
      <p class="m-0">本站刊载的文章仅代表作者个人观点。</p>
    </div>
  </footer>
</template>
