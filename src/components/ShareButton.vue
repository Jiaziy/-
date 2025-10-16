<template>
  <div class="share-button relative">
    <button 
      @click="toggleShareMenu"
      class="share-btn flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
    >
      <i class="fas fa-share-alt"></i>
    </button>
    
    <div v-if="showShareMenu" class="share-menu absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
      <div class="share-options grid grid-cols-2 gap-2 min-w-[120px]">
        <button 
          v-for="option in shareOptions"
          :key="option.name"
          @click="share(option)"
          class="share-option flex flex-col items-center p-2 rounded hover:bg-gray-50 transition-colors"
        >
          <i :class="option.icon" class="text-lg mb-1"></i>
          <span class="text-xs">{{ option.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showShareMenu = ref(false)
const shareOptions = ref([
  { name: '微信', icon: 'fab fa-weixin', type: 'wechat' },
  { name: '微博', icon: 'fab fa-weibo', type: 'weibo' },
  { name: 'QQ', icon: 'fab fa-qq', type: 'qq' },
  { name: '复制', icon: 'fas fa-copy', type: 'copy' }
])

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const share = async (option) => {
  const poem = {
    title: '当前诗词标题',
    content: '诗词内容...',
    url: window.location.href
  }
  
  switch (option.type) {
    case 'copy':
      await copyToClipboard(`${poem.title}\n\n${poem.content}\n\n${poem.url}`)
      break
    case 'wechat':
      // 微信分享逻辑
      alert('微信分享功能')
      break
    case 'weibo':
      shareToWeibo(poem)
      break
    case 'qq':
      shareToQQ(poem)
      break
  }
  
  showShareMenu.value = false
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const shareToWeibo = (poem) => {
  const url = `http://service.weibo.com/share/share.php?title=${encodeURIComponent(poem.title)}&url=${encodeURIComponent(poem.url)}`
  window.open(url, '_blank', 'width=615,height=505')
}

const shareToQQ = (poem) => {
  const url = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(poem.url)}&title=${encodeURIComponent(poem.title)}`
  window.open(url, '_blank', 'width=615,height=505')
}
</script>

<style scoped>
.share-menu {
  min-width: 140px;
}
</style>