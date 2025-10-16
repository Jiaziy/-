<template>
  <div class="poem-quiz bg-white rounded-xl shadow-lg p-6">
    <div class="quiz-header text-center mb-6">
      <h3 class="text-xl font-bold text-gray-800 mb-2">诗词知识问答</h3>
      <div class="flex justify-center items-center space-x-4 text-sm text-gray-600">
        <span>题目 {{ currentQuestion + 1 }} / {{ questions.length }}</span>
        <span>得分: {{ score }}</span>
      </div>
    </div>

    <div v-if="!quizStarted" class="start-screen text-center">
      <div class="mb-6">
        <i class="fas fa-brain text-4xl text-purple-500 mb-4"></i>
        <p class="text-gray-700">测试您的诗词知识储备</p>
      </div>
      <button 
        @click="startQuiz"
        class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        开始答题
      </button>
    </div>

    <div v-else-if="currentQuestion < questions.length" class="quiz-screen">
      <div class="question-card bg-gray-50 rounded-lg p-6 mb-6">
        <h4 class="text-lg font-semibold mb-4">{{ questions[currentQuestion].question }}</h4>
        
        <div v-if="questions[currentQuestion].type === 'multiple'" class="options-grid grid gap-3">
          <button
            v-for="(option, index) in questions[currentQuestion].options"
            :key="index"
            @click="selectAnswer(index)"
            class="option-btn p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{
              'bg-blue-100 border-blue-300': selectedAnswer === index,
              'bg-green-100 border-green-300': showResult && index === questions[currentQuestion].correctAnswer,
              'bg-red-100 border-red-300': showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer
            }"
          >
            <span class="font-medium mr-2">{{ String.fromCharCode(65 + index) }}.</span>
            {{ option }}
          </button>
        </div>

        <div v-else-if="questions[currentQuestion].type === 'true_false'" class="true-false-buttons flex justify-center space-x-4">
          <button
            @click="selectAnswer(0)"
            class="true-btn px-6 py-3 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            :class="{
              'bg-green-500 text-white': selectedAnswer === 0,
              'bg-green-100': showResult && questions[currentQuestion].correctAnswer === 0
            }"
          >
            <i class="fas fa-check mr-2"></i>正确
          </button>
          <button
            @click="selectAnswer(1)"
            class="false-btn px-6 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            :class="{
              'bg-red-500 text-white': selectedAnswer === 1,
              'bg-red-100': showResult && questions[currentQuestion].correctAnswer === 1
            }"
          >
            <i class="fas fa-times mr-2"></i>错误
          </button>
        </div>
      </div>

      <div v-if="showResult" class="result mb-4 p-4 rounded-lg" :class="resultClass">
        <div class="flex items-center justify-center">
          <i :class="resultIcon" class="text-xl mr-2"></i>
          <span class="font-medium">{{ resultMessage }}</span>
        </div>
        <div v-if="!isCorrect" class="mt-2 text-sm">
          <p>解析：{{ questions[currentQuestion].explanation }}</p>
        </div>
      </div>

      <div class="flex justify-end">
        <button 
          @click="nextQuestion"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ currentQuestion === questions.length - 1 ? '查看结果' : '下一题' }}
        </button>
      </div>
    </div>

    <div v-else class="result-screen text-center">
      <div class="mb-6">
        <i class="fas fa-award text-4xl text-yellow-500 mb-4"></i>
        <h4 class="text-xl font-bold mb-2">答题完成！</h4>
        <p class="text-gray-700">最终得分：{{ score }} / {{ questions.length }}</p>
        <p class="text-sm text-gray-500 mt-2">正确率：{{ Math.round((score / questions.length) * 100) }}%</p>
      </div>
      <div class="space-y-3">
        <button 
          @click="restartQuiz"
          class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          重新答题
        </button>
        <button 
          @click="exitQuiz"
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

const quizStarted = ref(false)
const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const showResult = ref(false)
const score = ref(0)

const questions = ref([
  {
    type: 'multiple',
    question: '《静夜思》的作者是谁？',
    options: ['李白', '杜甫', '白居易', '王维'],
    correctAnswer: 0,
    explanation: '《静夜思》是唐代诗人李白的代表作之一。'
  },
  {
    type: 'true_false', 
    question: '李清照是宋代著名的婉约派词人。',
    options: ['正确', '错误'],
    correctAnswer: 0,
    explanation: '李清照是宋代婉约派词人的代表人物。'
  },
  {
    type: 'multiple',
    question: '下列哪句诗出自杜甫的《春望》？',
    options: ['国破山河在', '床前明月光', '举头望明月', '疑是地上霜'],
    correctAnswer: 0,
    explanation: '"国破山河在"是杜甫《春望》中的名句。'
  }
])

const startQuiz = () => {
  quizStarted.value = true
  currentQuestion.value = 0
  score.value = 0
  selectedAnswer.value = null
  showResult.value = false
}

const selectAnswer = (index) => {
  if (showResult.value) return
  selectedAnswer.value = index
  checkAnswer()
}

const checkAnswer = () => {
  if (selectedAnswer.value === null) return
  
  const correct = selectedAnswer.value === questions.value[currentQuestion.value].correctAnswer
  showResult.value = true
  
  if (correct) {
    score.value++
  }
}

const nextQuestion = () => {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
    selectedAnswer.value = null
    showResult.value = false
  } else {
    quizStarted.value = false
  }
}

const restartQuiz = () => {
  startQuiz()
}

const exitQuiz = () => {
  quizStarted.value = false
  currentQuestion.value = 0
  score.value = 0
}

const isCorrect = computed(() => selectedAnswer.value === questions.value[currentQuestion.value]?.correctAnswer)
const resultClass = computed(() => isCorrect.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
const resultIcon = computed(() => isCorrect.value ? 'fas fa-check-circle' : 'fas fa-times-circle')
const resultMessage = computed(() => isCorrect.value ? '回答正确！' : '回答错误')
</script>

<style scoped>
.options-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .options-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.option-btn {
  transition: all 0.2s ease;
}
</style>