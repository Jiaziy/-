<template>
  <div class="poem-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold text-gray-800 line-clamp-1">{{ poem.title }}</h3>
        <button 
          @click="toggleCollect"
          class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          :class="{ 'text-red-500': isCollected }"
        >
          <i class="fas" :class="isCollected ? 'fa-heart' : 'fa-heart'"></i>
        </button>
      </div>
      
      <p class="text-gray-600 mb-3 line-clamp-3 leading-relaxed">{{ poem.content }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white text-sm font-medium">{{ poem.author.charAt(0) }}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">{{ poem.author }}</span>
            <span class="text-xs text-gray-500 ml-2">{{ poem.dynasty || '未知朝代' }}</span>
          </div>
        </div>
        <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
          {{ poem.dynasty || '未知' }}
        </span>
      </div>
    </div>
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>