<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button 
          @click="$router.back()"
          class="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <i class="fas fa-arrow-left"></i>
          <span>返回</span>
        </button>
      </div>

      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
              {{ authStore.user?.email?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-2xl font-bold">个人中心</h1>
              <p class="text-blue-100">{{ authStore.user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 基本信息 -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">基本信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">邮箱</label>
                <p class="text-gray-900">{{ authStore.user?.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">注册时间</label>
                <p class="text-gray-900">{{ formatDate(authStore.user?.created_at) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">最后登录</label>
                <p class="text-gray-900">{{ formatDate(authStore.user?.last_sign_in_at) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">用户ID</label>
                <p class="text-gray-900 text-sm font-mono">{{ authStore.user?.id?.substring(0, 8) }}...</p>
              </div>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">学习统计</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ userStats.collectedPoems }}</div>
                <div class="text-sm text-gray-600">收藏诗词</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ userStats.readPoems }}</div>
                <div class="text-sm text-gray-600">已读诗词</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ userStats.quizScore }}</div>
                <div class="text-sm text-gray-600">答题得分</div>
              </div>
              <div class="text-center p-4 bg-orange-50 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">{{ userStats.studyDays }}</div>
                <div class="text-sm text-gray-600">学习天数</div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex space-x-4">
            <button 
              @click="handleEditProfile"
              class="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="fas fa-edit mr-2"></i>编辑资料
            </button>
            <button 
              @click="handleChangePassword"
              class="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <i class="fas fa-key mr-2"></i>修改密码
            </button>
            <button 
              @click="handleLogout"
              class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>退出登录
            </button>
          </div>
        </div>
      </div>

      <!-- 编辑资料模态框 -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">编辑资料</h3>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                v-model="editForm.username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="请输入个人简介"
              ></textarea>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="saveProfile"
                class="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
              <button 
                @click="showEditModal = false"
                class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const showEditModal = ref(false)
const userStats = reactive({
  collectedPoems: 0,
  readPoems: 0,
  quizScore: 0,
  studyDays: 0
})

const editForm = reactive({
  username: '',
  bio: ''
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 编辑资料
const handleEditProfile = () => {
  showEditModal.value = true
}

// 修改密码
const handleChangePassword = () => {
  alert('修改密码功能开发中...')
}

// 退出登录
const handleLogout = async () => {
  try {
    const result = await authStore.logout()
    if (result.success) {
      router.push('/')
    } else {
      alert('退出失败：' + result.error)
    }
  } catch (error) {
    console.error('退出失败:', error)
    alert('退出失败：' + error.message)
  }
}

// 保存资料
const saveProfile = () => {
  // 这里可以添加保存用户资料的逻辑
  alert('资料保存成功！')
  showEditModal.value = false
}

// 组件挂载时检查登录状态
onMounted(() => {
  if (!authStore.user) {
    router.push('/')
    return
  }
  
  // 这里可以添加获取用户统计信息的逻辑
  // 模拟一些数据
  userStats.collectedPoems = Math.floor(Math.random() * 50)
  userStats.readPoems = Math.floor(Math.random() * 100)
  userStats.quizScore = Math.floor(Math.random() * 1000)
  userStats.studyDays = Math.floor(Math.random() * 365)
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>