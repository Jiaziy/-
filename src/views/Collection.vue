<template>
  <div class="collection">
    <h1>我的收藏</h1>
    <PoemCard 
      v-for="poem in collectedPoems" 
      :key="poem.id" 
      :poem="poem"
    />
  </div>
</template>

<script>
import PoemCard from '@/components/PoemCard.vue'

export default {
  name: 'Collection',
  components: {
    PoemCard
  },
  computed: {
    collectedPoems() {
      return this.$store.state.collectedPoems
    }
  }
}
</script>

<style scoped>
.collection {
  padding: 20px;
}
</style>