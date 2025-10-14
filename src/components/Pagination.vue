<template>
  <div class="pagination">
    <button 
      v-for="page in pages" 
      :key="page" 
      @click="$emit('page-change', page)"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: Number,
    perPage: Number,
    currentPage: Number
  },
  computed: {
    pages() {
      const pageCount = Math.ceil(this.total / this.perPage)
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
button {
  margin: 0 5px;
}
.active {
  background: #42b983;
  color: white;
}
</style>