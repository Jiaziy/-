<template>
  <div class="poem-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold text-gray-800 line-clamp-1">{{ poem.title }}</h3>
        <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            @click.stop="playAudio"
            class="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
          >
            <i class="fas fa-volume-up"></i>
          </button>
          <button 
            @click.stop="toggleCollect"
            class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            :class="{ 'text-red-500': isCollected }"
          >
            <i class="fas" :class="isCollected ? 'fa-heart' : 'fa-heart'"></i>
          </button>
        </div>
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

      <!-- Quick Actions -->
      <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <button 
          @click.stop="sharePoem"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center"
        >
          <i class="fas fa-share-alt mr-1"></i>
          分享
        </button>
        <button 
          @click.stop="viewDetails"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center"
        >
          <i class="fas fa-eye mr-1"></i>
          详情
        </button>
        <button 
          @click.stop="startQuiz"
          class="text-xs text-gray-500 hover:text-green-600 transition-colors flex items-center"
        >
          <i class="fas fa-puzzle-piece mr-1"></i>
          测试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem.js'

const props = defineProps({
  poem: Object
})

const router = useRouter()
const poemStore = usePoemStore()

const isCollected = computed(() => {
  return poemStore.isPoemCollected(props.poem.id)
})

const toggleCollect = () => {
  if (isCollected.value) {
    poemStore.removeFromCollection(props.poem.id)
  } else {
    poemStore.addToCollection(props.poem)
  }
}

const playAudio = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = `${props.poem.title}，作者${props.poem.author}。${props.poem.content}`
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  } else {
    alert('您的浏览器不支持语音朗读功能')
  }
}

const sharePoem = () => {
  const text = `${props.poem.title} - ${props.poem.author}
${props.poem.content}`
  if (navigator.share) {
    navigator.share({
      title: props.poem.title,
      text: text,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(text)
    alert('诗词内容已复制到剪贴板')
  }
}

const viewDetails = () => {
  router.push(`/detail/${props.poem.id}`)
}

const startQuiz = () => {
  // 可以跳转到专门的测试页面或打开模态框
  alert(`开始测试关于《${props.poem.title}》的知识`)
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