<template>
  <div class="pagination flex justify-center items-center space-x-2 my-8">
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      上一页
    </button>
    
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="$emit('page-change', page)"
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        currentPage === page 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'border-gray-300 hover:bg-gray-50'
      ]"
    >
      {{ page }}
    </button>
    
    <button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      下一页
    </button>
    
    <span class="text-sm text-gray-500 ml-4">
      第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
    </span>
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
    totalPages() {
      return Math.ceil(this.total / this.perPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  }
}
</script>