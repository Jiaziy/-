<template>
  <div class="recitation-game bg-white rounded-xl shadow-lg p-6">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-gray-800 mb-2">诗词背诵挑战</h3>
      <p class="text-gray-600">根据提示填写正确的诗句</p>
    </div>

    <div v-if="!gameStarted" class="start-screen text-center">
      <div class="mb-6">
        <i class="fas fa-book-open text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-700">测试您对诗词的掌握程度</p>
      </div>
      <button 
        @click="startGame"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        开始挑战
      </button>
    </div>

    <div v-else-if="currentQuestion" class="game-screen">
      <div class="progress-bar bg-gray-200 rounded-full h-2 mb-6">
        <div 
          class="progress-fill bg-green-500 h-full rounded-full transition-all duration-300"
          :style="{ width: `${(currentQuestionIndex / questions.length) * 100}%` }"
        ></div>
      </div>

      <div class="question-card bg-gray-50 rounded-lg p-6 mb-6">
        <h4 class="text-lg font-semibold mb-4">{{ currentQuestion.poem.title }} - {{ currentQuestion.poem.author }}</h4>
        <div class="question-text text-gray-700 leading-relaxed">
          <p v-for="(line, index) in currentQuestion.displayLines" :key="index" class="mb-2">
            {{ line }}
          </p>
        </div>
      </div>

      <div class="answer-input mb-6">
        <input
          v-model="userAnswer"
          :placeholder="`填写第${currentQuestion.missingLine + 1}句`"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-center text-lg"
          @keyup.enter="checkAnswer"
        />
      </div>

      <div class="flex justify-between">
        <button 
          @click="skipQuestion"
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          跳过
        </button>
        <button 
          @click="checkAnswer"
          :disabled="!userAnswer.trim()"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          提交答案
        </button>
      </div>

      <div v-if="showResult" class="result mt-4 p-4 rounded-lg" :class="resultClass">
        <div class="flex items-center justify-center">
          <i :class="resultIcon" class="text-xl mr-2"></i>
          <span class="font-medium">{{ resultMessage }}</span>
        </div>
        <div v-if="!isCorrect" class="mt-2 text-sm">
          <p>正确答案：{{ currentQuestion.correctAnswer }}</p>
        </div>
      </div>
    </div>

    <div v-else class="result-screen text-center">
      <div class="mb-6">
        <i class="fas fa-trophy text-4xl text-yellow-500 mb-4"></i>
        <h4 class="text-xl font-bold mb-2">挑战完成！</h4>
        <p class="text-gray-700">您的得分：{{ score }} / {{ questions.length }}</p>
      </div>
      <div class="space-y-3">
        <button 
          @click="restartGame"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

const gameStarted = ref(false)
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const score = ref(0)

const questions = ref([
  {
    poem: {
      title: '静夜思',
      author: '李白',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
    },
    missingLine: 2,
    correctAnswer: '举头望明月'
  },
  {
    poem: {
      title: '春望',
      author: '杜甫', 
      content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。'
    },
    missingLine: 0,
    correctAnswer: '国破山河在'
  }
])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const displayLines = computed(() => {
  if (!currentQuestion.value) return []
  const lines = currentQuestion.value.poem.content.split('。').filter(l => l)
  const missing = currentQuestion.value.missingLine
  return lines.map((line, index) => index === missing ? '______' : line)
})

const startGame = () => {
  gameStarted.value = true
  currentQuestionIndex.value = 0
  score.value = 0
  userAnswer.value = ''
  showResult.value = false
}

const checkAnswer = () => {
  if (!userAnswer.value.trim()) return
  
  const correct = userAnswer.value.trim() === currentQuestion.value.correctAnswer
  isCorrect.value = correct
  showResult.value = true
  
  if (correct) {
    score.value++
  }

  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

const skipQuestion = () => {
  nextQuestion()
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    userAnswer.value = ''
    showResult.value = false
  } else {
    gameStarted.value = false
    currentQuestionIndex.value = 0
  }
}

const restartGame = () => {
  startGame()
}

const exitGame = () => {
  gameStarted.value = false
  currentQuestionIndex.value = 0
  score.value = 0
}

const resultClass = computed(() => isCorrect.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
const resultIcon = computed(() => isCorrect.value ? 'fas fa-check-circle' : 'fas fa-times-circle')
const resultMessage = computed(() => isCorrect.value ? '回答正确！' : '回答错误')
</script>

<style scoped>
.progress-fill {
  transition: width 0.3s ease;
}

.question-text {
  font-family: 'Noto Serif SC', serif;
}
</style>