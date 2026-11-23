<script setup>
defineProps({
  articles: { type: Array, required: true },
  emptyMessage: { type: String, required: true },
})
</script>

<template>
  <article v-for="article in articles" :key="article.id" class="article">
    <div class="article-fields">
      <h3>
        <a
          :href="article.pdfUrl"
          target="_blank"
          rel="noopener"
          :aria-label="article.title + '，在新标签页打开 PDF'"
        >{{ article.title }}</a>
      </h3>
      <p class="article-author">{{ article.author }}</p>
      <time class="article-date" :datetime="article.date">{{ article.date }}</time>
    </div>
    <details v-if="article.abstract">
      <summary>摘要</summary>
      <p class="abstract">{{ article.abstract }}</p>
    </details>
  </article>
  <p v-if="!articles.length" class="note">{{ emptyMessage }}</p>
</template>
