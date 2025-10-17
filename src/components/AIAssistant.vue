<template>
  <div class="ai-assistant fixed bottom-6 right-6 z-50">
    <!-- 聊天按钮 -->
    <button 
      @click="toggleChat"
      class="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
      :class="{ 'scale-110': isOpen }"
    >
      <i class="fas" :class="isOpen ? 'fa-times' : 'fa-robot'"></i>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <!-- 聊天头部 -->
      <div class="chat-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="fas fa-robot"></i>
            <h3 class="font-semibold">AI项目助手</h3>
          </div>
          <button @click="toggleChat" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-sm text-blue-100 mt-1">我可以帮您管理项目和知识库</p>
      </div>

      <!-- 消息区域 -->
      <div ref="messagesContainer" class="messages flex-1 p-4 overflow-y-auto bg-gray-50">
        <div v-for="(message, index) in messages" :key="index" class="message mb-4">
          <div v-if="message.role === 'assistant'" class="assistant-message flex items-start space-x-2">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
              <i class="fas fa-robot"></i>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
              <p class="text-sm text-gray-800">{{ message.content }}</p>
              <span class="text-xs text-gray-500 mt-1 block">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
          
          <div v-else class="user-message flex items-start space-x-2 justify-end">
            <div class="bg-blue-500 p-3 rounded-lg shadow-sm max-w-[80%]">
              <p class="text-sm text-white">{{ message.content }}</p>
              <span class="text-xs text-blue-100 mt-1 block">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-message flex items-start space-x-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            <i class="fas fa-robot"></i>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="输入您的问题..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            :disabled="isLoading"
          />
          <button 
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const isOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

// 初始化欢迎消息
const initializeMessages = () => {
  messages.value = [
    {
      role: 'assistant',
      content: '您好！我是AI项目助手，我可以帮您：\n• 管理项目任务\n• 查询知识库\n• 提供项目建议\n• 解答相关问题\n\n请问有什么可以帮您的吗？',
      timestamp: new Date()
    }
  ]
}

// 发送消息到n8n工作流
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  userInput.value = ''
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })

  isLoading.value = true
  scrollToBottom()

  try {
    // 调用n8n工作流
    const response = await fetch('https://your-n8n-instance.com/webhook/ai-assistant-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authStore.user?.id || 'anonymous',
        message: userMessage,
        sessionId: generateSessionId()
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.success) {
      messages.value.push({
        role: 'assistant',
        content: data.response.message,
        timestamp: new Date(data.response.timestamp)
      })
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，暂时无法处理您的请求。请稍后再试。',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 生成会话ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 切换聊天窗口
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 组件挂载时初始化
onMounted(() => {
  initializeMessages()
})
</script>

<style scoped>
.chat-window {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.messages {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: #f7fafc;
}

.messages::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.assistant-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-message .message-content {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
</style>