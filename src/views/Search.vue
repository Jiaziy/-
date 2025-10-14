<template>
  <div class="search">
    <h1>搜索诗词</h1>
    <SearchBox @search="handleSearch" />
    <PoemCard 
      v-for="poem in results" 
      :key="poem.id" 
      :poem="poem"
    />
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox.vue'
import PoemCard from '@/components/PoemCard.vue'
import { searchPoems } from '@/api/poems.js'

export default {
  name: 'Search',
  components: {
    SearchBox,
    PoemCard
  },
  data() {
    return {
      results: []
    }
  },
  methods: {
    async handleSearch(query) {
      this.results = await searchPoems(query)
    }
  }
}
</script>

<style scoped>
.search {
  padding: 20px;
}
</style>