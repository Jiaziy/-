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
        <router-link to="/list" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">诗词列表</router-link>
        <router-link to="/collection" class="font-medium hover:text-gray-500 transition-colors">我的收藏</router-link>
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
        <h1 class="text-3xl font-bold mb-4">诗词列表</h1>
        <p class="text-gray-600">浏览所有诗词作品，感受中华文化的博大精深</p>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">朝代筛选</label>
            <select v-model="selectedDynasty" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">全部朝代</option>
              <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">作者筛选</label>
            <select v-model="selectedAuthor" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">全部作者</option>
              <option v-for="author in authors" :key="author" :value="author">{{ author }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select v-model="sortBy" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="title">按标题</option>
              <option value="author">按作者</option>
              <option value="dynasty">按朝代</option>
            </select>
          </div>
          
          <button @click="resetFilters" class="mt-6 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            重置筛选
          </button>
        </div>
      </div>

      <!-- Poems Grid -->
      <div v-if="filteredPoems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PoemCard 
          v-for="poem in paginatedPoems" 
          :key="poem.id" 
          :poem="poem"
          @click="$router.push(`/detail/${poem.id}`)"
          class="cursor-pointer"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <i class="fas fa-book-open text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">暂无诗词</h3>
        <p class="text-gray-500">当前筛选条件下没有找到匹配的诗词</p>
      </div>

      <!-- Pagination -->
      <Pagination 
        v-if="filteredPoems.length > 0"
        :total="filteredPoems.length"
        :per-page="perPage"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
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
      perPage: 9,
      currentPage: 1,
      searchQuery: '',
      selectedDynasty: '',
      selectedAuthor: '',
      sortBy: 'title',
      dynasties: ['先秦', '汉朝', '魏晋', '唐朝', '宋朝', '明清'],
      authors: ['李白', '杜甫', '苏轼', '辛弃疾', '李清照', '纳兰性德']
    }
  },
  computed: {
    filteredPoems() {
      let filtered = this.poems

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

      // 排序
      filtered.sort((a, b) => {
        if (this.sortBy === 'title') {
          return a.title.localeCompare(b.title)
        } else if (this.sortBy === 'author') {
          return a.author.localeCompare(b.author)
        } else {
          return a.dynasty.localeCompare(b.dynasty)
        }
      })

      return filtered
    },
    paginatedPoems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredPoems.slice(start, end)
    }
  },
  created() {
    this.fetchPoems()
  },
  methods: {
    async fetchPoems() {
      try {
        const data = await getPoems()
        this.poems = data.poems
        this.total = data.total
      } catch (error) {
        console.error('获取诗词列表失败:', error)
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleSearch() {
      this.currentPage = 1
      if (this.searchQuery.trim()) {
        this.$router.push(`/search?q=${encodeURIComponent(this.searchQuery)}`)
      }
    },
    resetFilters() {
      this.selectedDynasty = ''
      this.selectedAuthor = ''
      this.searchQuery = ''
      this.sortBy = 'title'
      this.currentPage = 1
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