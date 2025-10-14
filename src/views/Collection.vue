<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center space-x-2">
        <i class="fas fa-book text-2xl text-gray-700"></i>
        <h1 class="text-xl font-bold tracking-wider">古韵诗语</h1>
      </div>
      <nav class="hidden md:flex space-x-6">
        <router-link to="/" class="font-medium hover:text-gray-500 transition-colors">首页</router-link>
        <router-link to="/list" class="font-medium hover:text-gray-500 transition-colors">诗词列表</router-link>
        <router-link to="/collection" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">我的收藏</router-link>
      </nav>
      <div class="relative w-64">
        <input
          type="text"
          placeholder="搜索诗词或作者..."
          class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          @keyup.enter="handleSearch"
          v-model="searchQuery"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-8 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">我的收藏</h1>
        <p class="text-gray-600">管理您收藏的诗词作品</p>
      </div>

      <!-- Collection Stats -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ collectedPoems.length }}</div>
              <div class="text-sm text-gray-500">收藏数量</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ uniqueAuthors.length }}</div>
              <div class="text-sm text-gray-500">作者数量</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ uniqueDynasties.length }}</div>
              <div class="text-sm text-gray-500">朝代数量</div>
            </div>
          </div>
          <button 
            v-if="collectedPoems.length > 0"
            @click="clearAll"
            class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            清空收藏
          </button>
        </div>
      </div>

      <!-- Collection Filter -->
      <div v-if="collectedPoems.length > 0" class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">朝代筛选</label>
            <select v-model="selectedDynasty" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">全部朝代</option>
              <option v-for="dynasty in uniqueDynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">作者筛选</label>
            <select v-model="selectedAuthor" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">全部作者</option>
              <option v-for="author in uniqueAuthors" :key="author" :value="author">{{ author }}</option>
            </select>
          </div>
          
          <button @click="resetFilters" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            重置筛选
          </button>
        </div>
      </div>

      <!-- Collection Grid -->
      <div v-if="filteredPoems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PoemCard 
          v-for="poem in filteredPoems" 
          :key="poem.id" 
          :poem="poem"
          @click="$router.push(`/detail/${poem.id}`)"
          class="cursor-pointer"
        />
      </div>

      <!-- Empty Collection -->
      <div v-else-if="collectedPoems.length === 0" class="text-center py-16">
        <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">暂无收藏</h3>
        <p class="text-gray-500 mb-4">您还没有收藏任何诗词</p>
        <router-link to="/list" class="text-blue-600 hover:text-blue-800 transition-colors">
          去浏览诗词
        </router-link>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-16">
        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">未找到匹配的收藏</h3>
        <p class="text-gray-500">当前筛选条件下没有找到匹配的诗词</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-16 pb-8">
      <div class="container mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 class="text-xl font-bold mb-4">古韵诗语</h3>
            <p class="text-gray-400">
              致力于传承中华古典诗词文化，为诗词爱好者提供高质量的鉴赏与学习平台。
            </p>
          </div>
          <div>
            <h4 class="font-bold mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/" class="hover:text-white transition-colors">首页</router-link></li>
              <li><router-link to="/list" class="hover:text-white transition-colors">诗词列表</router-link></li>
              <li><router-link to="/collection" class="hover:text-white transition-colors">我的收藏</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">关于我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">项目介绍</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2023 古韵诗语 版权所有
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import PoemCard from '@/components/PoemCard.vue'

export default {
  name: 'Collection',
  components: {
    PoemCard
  },
  data() {
    return {
      searchQuery: '',
      selectedDynasty: '',
      selectedAuthor: ''
    }
  },
  computed: {
    collectedPoems() {
      return this.$store.state.collectedPoems
    },
    uniqueAuthors() {
      return [...new Set(this.collectedPoems.map(poem => poem.author))].filter(Boolean)
    },
    uniqueDynasties() {
      return [...new Set(this.collectedPoems.map(poem => poem.dynasty))].filter(Boolean)
    },
    filteredPoems() {
      let filtered = this.collectedPoems

      if (this.selectedDynasty) {
        filtered = filtered.filter(poem => poem.dynasty === this.selectedDynasty)
      }

      if (this.selectedAuthor) {
        filtered = filtered.filter(poem => poem.author === this.selectedAuthor)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(poem => 
          poem.title.toLowerCase().includes(query) ||
          poem.author.toLowerCase().includes(query) ||
          poem.content.toLowerCase().includes(query)
        )
      }

      return filtered
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push(`/search?q=${encodeURIComponent(this.searchQuery)}`)
      }
    },
    resetFilters() {
      this.selectedDynasty = ''
      this.selectedAuthor = ''
      this.searchQuery = ''
    },
    clearAll() {
      if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
        this.$store.state.collectedPoems.forEach(poem => {
          this.$store.commit('removeFromCollection', poem.id)
        })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

body {
  font-family: 'Noto Serif SC', serif;
}
</style>