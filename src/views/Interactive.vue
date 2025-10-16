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
        <router-link to="/interactive" class="font-medium text-blue-600 transition-colors">互动学习</router-link>
        <router-link to="/collection" class="font-medium hover:text-gray-500 transition-colors">我的收藏</router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-8 py-12">
      <!-- Hero Section -->
      <section class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">互动学习中心</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          通过多种互动方式深入学习古诗词，提升诗词鉴赏能力和文化素养
        </p>
      </section>

      <!-- Interactive Features Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
        <!-- Quiz Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-brain text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词知识问答</h3>
                <p class="text-purple-100">测试您的诗词知识储备</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <PoemQuiz />
          </div>
        </div>

        <!-- Recitation Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-book-open text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词背诵挑战</h3>
                <p class="text-green-100">根据提示填写正确的诗句</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <RecitationGame />
          </div>
        </div>

        <!-- Fill in the Blank Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-edit text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词填空游戏</h3>
                <p class="text-orange-100">挑战您的诗词记忆能力</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <FillInTheBlank />
          </div>
        </div>

        <!-- Audio Learning Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-volume-up text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词朗读学习</h3>
                <p class="text-blue-100">通过听力加深诗词记忆</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="text-center">
              <AudioPlayer />
              <p class="text-gray-600 mt-4">点击播放按钮聆听诗词朗读</p>
            </div>
          </div>
        </div>

        <!-- Sharing Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-share-alt text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词分享</h3>
                <p class="text-pink-100">与朋友分享喜爱的诗词</p>
              </div>
            </div>
          </div>
          <div class="p-6 text-center">
            <ShareButton />
            <p class="text-gray-600 mt-4">分享您喜爱的诗词给朋友</p>
          </div>
        </div>

        <!-- Community Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-comments text-2xl"></i>
              <div>
                <h3 class="text-xl font-bold">诗词交流</h3>
                <p class="text-teal-100">与其他爱好者交流心得</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <CommentSection />
          </div>
        </div>
      </section>

      <!-- Learning Progress -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-16">
        <h2 class="text-2xl font-bold mb-6 text-center">学习进度统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-3xl font-bold text-blue-600 mb-2">12</div>
            <p class="text-gray-600">已学习诗词</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-3xl font-bold text-green-600 mb-2">8</div>
            <p class="text-gray-600">正确答题数</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-3xl font-bold text-purple-600 mb-2">15</div>
            <p class="text-gray-600">互动次数</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-3xl font-bold text-orange-600 mb-2">85%</div>
            <p class="text-gray-600">学习完成度</p>
          </div>
        </div>
      </section>
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
              <li><router-link to="/interactive" class="hover:text-white transition-colors">互动学习</router-link></li>
              <li><router-link to="/collection" class="hover:text-white transition-colors">我的收藏</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">学习资源</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">诗词知识</a></li>
              <li><a href="#" class="hover:text-white transition-colors">背诵技巧</a></li>
              <li><a href="#" class="hover:text-white transition-colors">赏析指南</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">联系我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">意见反馈</a></li>
              <li><a href="#" class="hover:text-white transition-colors">合作联系</a></li>
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
import PoemQuiz from '@/components/PoemQuiz.vue'
import RecitationGame from '@/components/RecitationGame.vue'
import FillInTheBlank from '@/components/FillInTheBlank.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import ShareButton from '@/components/ShareButton.vue'
import CommentSection from '@/components/CommentSection.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

body {
  font-family: 'Noto Serif SC', serif;
}
</style>