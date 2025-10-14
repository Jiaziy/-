<template>
  <div class="poem-card">
    <h3>{{ poem.title }}</h3>
    <p class="author">{{ poem.author }}</p>
    <p class="content">{{ poem.content }}</p>
    <button @click="toggleCollect">
      {{ isCollected ? '取消收藏' : '收藏' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PoemCard',
  props: {
    poem: Object
  },
  computed: {
    isCollected() {
      return this.$store.state.collectedPoems.some(p => p.id === this.poem.id)
    }
  },
  methods: {
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
.poem-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
}
</style>