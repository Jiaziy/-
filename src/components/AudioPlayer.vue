<template>
  <div class="audio-player">
    <button 
      @click="togglePlay"
      class="audio-btn flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
      :class="{ 'playing': isPlaying }"
    >
      <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
    </button>
    <div v-if="isPlaying" class="audio-wave ml-3 flex items-center space-x-1">
      <span class="wave-bar w-1 h-4 bg-blue-400 rounded-full animate-wave"></span>
      <span class="wave-bar w-1 h-6 bg-blue-500 rounded-full animate-wave delay-100"></span>
      <span class="wave-bar w-1 h-8 bg-blue-600 rounded-full animate-wave delay-200"></span>
      <span class="wave-bar w-1 h-6 bg-blue-500 rounded-full animate-wave delay-300"></span>
      <span class="wave-bar w-1 h-4 bg-blue-400 rounded-full animate-wave delay-400"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isPlaying = ref(false)

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  // 这里可以集成实际的音频播放功能
  if (isPlaying.value) {
    speakText()
  }
}

const speakText = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = '诗词朗读功能'
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    utterance.pitch = 1
    
    utterance.onend = () => {
      isPlaying.value = false
    }
    
    speechSynthesis.speak(utterance)
  } else {
    alert('您的浏览器不支持语音合成功能')
    isPlaying.value = false
  }
}
</script>

<style scoped>
.animate-wave {
  animation: wave 1s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-400 {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>