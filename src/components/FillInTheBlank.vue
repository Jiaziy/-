<template>
  <div class="fill-blank-game bg-white rounded-xl shadow-lg p-6">
    <div class="game-header text-center mb-6">
      <h3 class="text-xl font-bold text-gray-800 mb-2">诗词填空挑战</h3>
      <p class="text-gray-600">根据上下文填写正确的诗句</p>
    </div>

    <div v-if="!gameActive" class="start-screen text-center">
      <div class="mb-6">
        <i class="fas fa-edit text-4xl text-orange-500 mb-4"></i>
        <p class="text-gray-700">挑战您的诗词记忆能力</p>
      </div>
      <button 
        @click="startGame"
        class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
      >
        开始挑战
      </button>
    </div>

    <div v-else class="game-content">
      <div class="progress-info flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600">进度: {{ currentIndex + 1 }} / {{ games.length }}</span>
        <span class="text-sm font-medium">得分: {{ score }}</span>
      </div>

      <div class="poem-card bg-gray-50 rounded-lg p-6 mb-6">
        <h4 class="text-lg font-semibold mb-4">{{ currentGame.poem.title }} - {{ currentGame.poem.author }}</h4>
        <div class="poem-lines space-y-3">
          <div 
            v-for="(line, index) in currentGame.displayLines"
            :key="index"
            class="poem-line text-lg leading-relaxed"
            :class="{ 'blank-line': index === currentGame.blankIndex }"
          >
            <span v-if="index !== currentGame.blankIndex">{{ line }}</span>
            <input
              v-else
              v-model="userAnswer"
              placeholder="填写诗句"
              class="blank-input w-32 px-2 py-1 border-b-2 border-blue-500 focus:outline-none text-center bg-transparent"
              @keyup.enter="checkAnswer"
            />
          </div>
        </div>
      </div>

      <div class="game-controls flex justify-between">
        <button 
          @click="skipGame"
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          跳过
        </button>
        <button 
          @click="checkAnswer"
          :disabled="!userAnswer.trim()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          提交答案
        </button>
      </div>

      <div v-if="showFeedback" class="feedback mt-4 p-4 rounded-lg" :class="feedbackClass">
        <div class="flex items-center justify-center">
          <i :class="feedbackIcon" class="text-xl mr-2"></i>
          <span class="font-medium">{{ feedbackMessage }}</span>
        </div>
        <div v-if="!isCorrect" class="mt-2 text-sm">
          <p>正确答案: {{ currentGame.correctAnswer }}</p>
        </div>
      </div>
    </div>

    <div v-if="gameCompleted" class="completion-screen text-center">
      <div class="mb-6">
        <i class="fas fa-star text-4xl text-yellow-500 mb-4"></i>
        <h4 class="text-xl font-bold mb-2">挑战完成！</h4>
        <p class="text-gray-700">最终得分: {{ score }} / {{ games.length }}</p>
      </div>
      <div class="space-y-3">
        <button 
          @click="restartGame"
          class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          再来一次
        </button>
        <button 
          @click="exitGame"
          class="w-full px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          返回
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const gameActive = ref(false)
const currentIndex = ref(0)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const gameCompleted = ref(false)

const games = ref([
  {
    poem: {
      title: '静夜思',
      author: '李白',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
    },
    blankIndex: 2,
    correctAnswer: '举头望明月'
  },
  {
    poem: {
      title: '春望',
      author: '杜甫',
      content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。'
    },
    blankIndex: 1,
    correctAnswer: '城春草木深'
  },
  {
    poem: {
      title: '登鹳雀楼',
      author: '王之涣',
      content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
    },
    blankIndex: 3,
    correctAnswer: '更上一层楼'
  }
])

const currentGame = computed(() => games.value[currentIndex.value])

const displayLines = computed(() => {
  if (!currentGame.value) return []
  const lines = currentGame.value.poem.content.split('。').filter(l => l)
  return lines.map((line, index) => index === currentGame.value.blankIndex ? '______' : line)
})

const startGame = () => {
  gameActive.value = true
  currentIndex.value = 0
  score.value = 0
  userAnswer.value = ''
  showFeedback.value = false
  gameCompleted.value = false
}

const checkAnswer = () => {
  if (!userAnswer.value.trim()) return
  
  const correct = userAnswer.value.trim() === currentGame.value.correctAnswer
  isCorrect.value = correct
  showFeedback.value = true
  
  if (correct) {
    score.value++
  }

  setTimeout(() => {
    nextGame()
  }, 2000)
}

const skipGame = () => {
  nextGame()
}

const nextGame = () => {
  if (currentIndex.value < games.value.length - 1) {
    currentIndex.value++
    userAnswer.value = ''
    showFeedback.value = false
  } else {
    gameCompleted.value = true
    gameActive.value = false
  }
}

const restartGame = () => {
  startGame()
}

const exitGame = () => {
  gameActive.value = false
  currentIndex.value = 0
  score.value = 0
  gameCompleted.value = false
}

const feedbackClass = computed(() => isCorrect.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
const feedbackIcon = computed(() => isCorrect.value ? 'fas fa-check-circle' : 'fas fa-times-circle')
const feedbackMessage = computed(() => isCorrect.value ? '回答正确！' : '回答错误')
</script>

<style scoped>
.blank-line {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.blank-input {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.125rem;
}

.blank-input::placeholder {
  color: #9ca3af;
  opacity: 0.7;
}

.poem-line {
  font-family: 'Noto Serif SC', serif;
}
</style>