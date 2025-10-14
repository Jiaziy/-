<template>
  <div class="search-box relative max-w-2xl mx-auto">
    <div class="relative">
      <input 
        type="text" 
        v-model="query" 
        placeholder="搜索诗词、作者或朝代..."
        @keyup.enter="search"
        class="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg shadow-sm"
      >
      <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
      <button 
        @click="search"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
      >
        搜索
      </button>
    </div>
    
    <!-- 搜索建议 -->
    <div v-if="showSuggestions && suggestions.length > 0" class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-50">
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      >
        <i class="fas fa-search text-gray-400 mr-3"></i>
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const query = ref('')
const showSuggestions = ref(false)
const suggestions = ref([
  '李白',
  '杜甫',
  '苏轼',
  '唐诗三百首',
  '宋词精选',
  '静夜思',
  '水调歌头'
])

const emit = defineEmits(['search'])

watch(query, (newVal) => {
  showSuggestions.value = newVal.length > 0
})

const search = () => {
  showSuggestions.value = false
  emit('search', query.value)
}

const selectSuggestion = (suggestion) => {
  query.value = suggestion
  search()
}
</script>