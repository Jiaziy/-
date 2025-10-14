<template>
  <div class="detail" v-if="poem">
    <h1>{{ poem.title }}</h1>
    <p class="author">{{ poem.author }}</p>
    <div class="content">
      <p v-for="(line, index) in poem.lines" :key="index">{{ line }}</p>
    </div>
    <div class="translation">
      <h3>译文</h3>
      <p>{{ poem.translation }}</p>
    </div>
    <button @click="toggleCollect">
      {{ isCollected ? '取消收藏' : '收藏' }}
    </button>
  </div>
</template>

<script>
import { getPoemById } from '@/api/poems.js'

export default {
  name: 'Detail',
  data() {
    return {
      poem: null
    }
  },
  computed: {
    isCollected() {
      return this.$store.state.collectedPoems.some(p => p.id === this.poem.id)
    }
  },
  created() {
    this.fetchPoem()
  },
  methods: {
    async fetchPoem() {
      const poem = await getPoemById(this.$route.params.id)
      this.poem = poem
    },
    toggleCollect() {
      if (this.isCollected) {
        this.$store.commit('removeFromCollection', this.poem.id)
      } else {
        this.$store.commit('addToCollection', this.poem)
      }
    }
  }
}
</script>

<style scoped>
.detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.author {
  color: #666;
  font-style: italic;
}
.content {
  margin: 20px 0;
  line-height: 2;
}
.translation {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>