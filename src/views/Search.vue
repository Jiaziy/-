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
        <h1 class="text-3xl font-bold mb-4">搜索结果</h1>
        <p v-if="searchQuery" class="text-gray-600">
          搜索关键词: <span class="text-blue-600 font-medium">"{{ searchQuery }}"</span>
          <span class="text-gray-500 ml-2">找到 {{ results.length }} 个结果</span>
        </p>
      </div>

      <!-- Search Box -->
      <div class="mb-8">
        <SearchBox @search="handleSearch" />
      </div>

      <!-- Search Results -->
      <div v-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PoemCard 
          v-for="poem in results" 
          :key="poem.id" 
          :poem="poem"
          @click="$router.push(`/detail/${poem.id}`)"
          class="cursor-pointer"
        />
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery" class="text-center py-16">
        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">未找到相关诗词</h3>
        <p class="text-gray-500 mb-4">请尝试使用其他关键词搜索</p>
        <div class="space-x-4">
          <button @click="showSuggestions" class="text-blue-600 hover:text-blue-800 transition-colors">
            查看热门搜索
          </button>
          <router-link to="/list" class="text-blue-600 hover:text-blue-800 transition-colors">
            浏览全部诗词
          </router-link>
        </div>
      </div>

      <!-- Popular Searches -->
      <div v-if="showPopular" class="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h3 class="text-lg font-bold mb-4">热门搜索</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="searchByTag(tag)"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-16">
        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">搜索诗词</h3>
        <p class="text-gray-500">输入关键词搜索您感兴趣的诗词作品</p>
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
      results: [],
      searchQuery: '',
      showPopular: false,
      popularTags: ['李白', '杜甫', '苏轼', '唐诗三百首', '宋词精选', '静夜思', '水调歌头', '春望']
    }
  },
  created() {
    // 从URL参数获取搜索关键词
    const query = this.$route.query.q
    if (query) {
      this.searchQuery = query
      this.handleSearch(query)
    }
  },
  methods: {
    async handleSearch(query) {
      this.searchQuery = query
      if (query.trim()) {
        this.results = await searchPoems(query)
        this.showPopular = false
      } else {
        this.results = []
      }
    },
    showSuggestions() {
      this.showPopular = true
    },
    searchByTag(tag) {
      this.searchQuery = tag
      this.handleSearch(tag)
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