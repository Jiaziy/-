<template>
  <div class="comment-section">
    <h3 class="text-lg font-semibold mb-4">评论 ({{ comments.length }})</h3>
    
    <!-- 评论输入框 -->
    <div class="comment-input mb-6">
      <textarea
        v-model="newComment"
        placeholder="写下您的评论..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        rows="3"
      ></textarea>
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center space-x-2">
          <button 
            v-for="emoji in emojis"
            :key="emoji"
            @click="addEmoji(emoji)"
            class="text-lg hover:scale-110 transition-transform"
          >
            {{ emoji }}
          </button>
        </div>
        <button 
          @click="submitComment"
          :disabled="!newComment.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          发表评论
        </button>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-list space-y-4">
      <div 
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item bg-gray-50 rounded-lg p-4"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
              <span class="text-white text-sm font-medium">{{ comment.author.charAt(0) }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-800">{{ comment.author }}</span>
              <span class="text-sm text-gray-500 ml-2">{{ formatTime(comment.time) }}</span>
            </div>
          </div>
          <button 
            @click="likeComment(comment.id)"
            class="text-gray-400 hover:text-red-500 transition-colors"
            :class="{ 'text-red-500': comment.liked }"
          >
            <i class="fas fa-heart mr-1"></i>
            {{ comment.likes }}
          </button>
        </div>
        <p class="text-gray-700 leading-relaxed">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newComment = ref('')
const comments = ref([
  {
    id: 1,
    author: '诗词爱好者',
    content: '这首诗意境深远，读来令人回味无穷！',
    time: new Date('2024-01-15'),
    likes: 12,
    liked: false
  },
  {
    id: 2,
    author: '文学研究者',
    content: '作者通过简练的语言表达了深刻的情感，真是经典之作。',
    time: new Date('2024-01-14'),
    likes: 8,
    liked: true
  }
])

const emojis = ref(['😊', '👍', '❤️', '🎉', '🙏'])

const addEmoji = (emoji) => {
  newComment.value += emoji
}

const submitComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: Date.now(),
      author: '当前用户',
      content: newComment.value,
      time: new Date(),
      likes: 0,
      liked: false
    })
    newComment.value = ''
  }
}

const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    if (comment.liked) {
      comment.likes--
    } else {
      comment.likes++
    }
    comment.liked = !comment.liked
  }
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.comment-item {
  transition: transform 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
}
</style>