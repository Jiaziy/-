<template>
  <div class="list">
    <h1>诗词列表</h1>
    <PoemCard 
      v-for="poem in poems" 
      :key="poem.id" 
      :poem="poem"
    />
    <Pagination 
      :total="total" 
      :per-page="perPage" 
      :current-page="currentPage"
      @page-change="changePage"
    />
  </div>
</template>

<script>
import PoemCard from '@/components/PoemCard.vue'
import Pagination from '@/components/Pagination.vue'
import { getPoems } from '@/api/poems.js'

export default {
  name: 'List',
  components: {
    PoemCard,
    Pagination
  },
  data() {
    return {
      poems: [],
      total: 0,
      perPage: 10,
      currentPage: 1
    }
  },
  created() {
    this.fetchPoems()
  },
  methods: {
    async fetchPoems() {
      const { poems, total } = await getPoems(this.currentPage, this.perPage)
      this.poems = poems
      this.total = total
    },
    changePage(page) {
      this.currentPage = page
      this.fetchPoems()
    }
  }
}
</script>

<style scoped>
.list {
  padding: 20px;
}
</style>