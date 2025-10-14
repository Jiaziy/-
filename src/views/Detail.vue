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
    <main class="container mx-auto px-8 py-12 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">加载中...</p>
      </div>

      <!-- Poem Detail -->
      <div v-else-if="poem" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Poem Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ poem.title }}</h1>
              <div class="flex items-center space-x-4">
                <span class="text-lg">{{ poem.author }}</span>
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm">{{ poem.dynasty || '未知朝代' }}</span>
              </div>
            </div>
            <button 
              @click="toggleCollect"
              class="text-white hover:text-red-200 transition-colors p-3 rounded-full hover:bg-white/10"
              :class="{ 'text-red-300': isCollected }"
            >
              <i class="fas text-2xl" :class="isCollected ? 'fa-heart' : 'fa-heart'"></i>
            </button>
          </div>
        </div>

        <!-- Poem Content -->
        <div class="p-8">
          <!-- Original Text -->
          <section class="mb-8">
            <h2 class="text-xl font-bold mb-4 text-gray-800">原文</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="text-lg leading-loose text-gray-700 text-center space-y-4">
                <p v-for="(line, index) in poem.lines || poem.content.split('。').filter(l => l)" :key="index" class="text-xl">
                  {{ line }}
                </p>
              </div>
            </div>
          </section>

          <!-- Translation -->
          <section class="mb-8" v-if="poem.translation">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800">译文</h2>
              <button 
                @click="showTranslation = !showTranslation"
                class="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {{ showTranslation ? '隐藏' : '显示' }}译文
              </button>
            </div>
            <div v-if="showTranslation" class="bg-blue-50 rounded-lg p-6">
              <p class="text-gray-700 leading-relaxed">{{ poem.translation }}</p>
            </div>
          </section>

          <!-- Notes -->
          <section class="mb-8" v-if="poem.notes">
            <h2 class="text-xl font-bold mb-4 text-gray-800">注释</h2>
            <div class="bg-green-50 rounded-lg p-6">
              <p class="text-gray-700 leading-relaxed">{{ poem.notes }}</p>
            </div>
          </section>

          <!-- Appreciation -->
          <section v-if="poem.appreciation">
            <h2 class="text-xl font-bold mb-4 text-gray-800">赏析</h2>
            <div class="bg-purple-50 rounded-lg p-6">
              <p class="text-gray-700 leading-relaxed">{{ poem.appreciation }}</p>
            </div>
          </section>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-16">
        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600 mb-2">诗词未找到</h3>
        <p class="text-gray-500 mb-4">抱歉，没有找到对应的诗词信息</p>
        <router-link to="/list" class="text-blue-600 hover:text-blue-800 transition-colors">
          返回诗词列表
        </router-link>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem.js'
import { getPoemById } from '@/api/poems.js'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

const poem = ref(null)
const loading = ref(true)
const showTranslation = ref(true)
const searchQuery = ref('')

const isCollected = computed(() => {
  return poem.value ? poemStore.isPoemCollected(poem.value.id) : false
})

const fetchPoem = async () => {
  try {
    const poemData = await getPoemById(route.params.id)
    poem.value = poemData
  } catch (error) {
    console.error('获取诗词详情失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleCollect = () => {
  if (!poem.value) return
  
  if (isCollected.value) {
    poemStore.removeFromCollection(poem.value.id)
  } else {
    poemStore.addToCollection(poem.value)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

onMounted(() => {
  fetchPoem()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

body {
  font-family: 'Noto Serif SC', serif;
}
</style>