<template>
  <div class="min-h-screen bg-gray-50 py-12 px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Supabase 连接测试</h1>
      
      <!-- Connection Test -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">连接状态</h2>
        <div class="flex items-center space-x-4">
          <div class="w-3 h-3 rounded-full" :class="connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'"></div>
          <span class="text-lg">{{ connectionMessage }}</span>
        </div>
        <button 
          @click="testConnection"
          :disabled="testing"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ testing ? '测试中...' : '测试连接' }}
        </button>
      </div>

      <!-- Data Migration -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">数据迁移</h2>
        <div class="mb-4">
          <p class="text-gray-600">当前本地数据: {{ localPoemsCount }} 首诗词</p>
          <p class="text-gray-600">云端数据: {{ cloudPoemsCount }} 首诗词</p>
        </div>
        <button 
          @click="migrateData"
          :disabled="migrating"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {{ migrating ? '迁移中...' : '迁移数据到Supabase' }}
        </button>
        <div v-if="migrationResult" class="mt-4 p-3 rounded" :class="migrationResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ migrationResult.message }}
        </div>
      </div>

      <!-- Sample Data -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">示例数据</h2>
        <div v-if="samplePoems.length > 0" class="space-y-4">
          <div v-for="poem in samplePoems" :key="poem.id" class="border rounded p-4">
            <h3 class="font-semibold">{{ poem.title }} - {{ poem.author }}</h3>
            <p class="text-gray-600 text-sm">{{ poem.dynasty }}</p>
            <p class="mt-2">{{ poem.content.substring(0, 50) }}...</p>
          </div>
        </div>
        <p v-else class="text-gray-500">暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { getPoems } from '@/api/supabasePoems.js'

const connectionStatus = ref('disconnected') // disconnected, connected, error
const connectionMessage = ref('未连接')
const testing = ref(false)
const migrating = ref(false)
const localPoemsCount = ref(0)
const cloudPoemsCount = ref(0)
const migrationResult = ref(null)
const samplePoems = ref([])

const testConnection = async () => {
  testing.value = true
  connectionStatus.value = 'testing'
  connectionMessage.value = '测试连接中...'
  
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    connectionStatus.value = 'connected'
    connectionMessage.value = '连接成功！'
    await loadSampleData()
    
  } catch (error) {
    connectionStatus.value = 'error'
    connectionMessage.value = `连接失败: ${error.message}`
  } finally {
    testing.value = false
  }
}

const loadSampleData = async () => {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .limit(3)
      .order('id', { ascending: true })
    
    if (!error && data) {
      samplePoems.value = data
      cloudPoemsCount.value = data.length
    }
  } catch (error) {
    console.error('加载示例数据失败:', error)
  }
}

const migrateData = async () => {
  migrating.value = true
  migrationResult.value = null
  
  try {
    // 检查是否已有数据
    const { data: existingData, error: checkError } = await supabase
      .from('poems')
      .select('id')
      .limit(1)
    
    if (checkError) throw checkError
    
    // 如果已有数据，先清空
    if (existingData && existingData.length > 0) {
      const { error: deleteError } = await supabase
        .from('poems')
        .delete()
        .neq('id', 0)
      
      if (deleteError) throw deleteError
    }
    
    // 从 SupabasePoems 获取数据
    const { poems: supabasePoems } = await getPoems(1, 100) // 获取所有诗词
    
    // 插入新数据
    const poemsToInsert = supabasePoems.map(poem => ({
      title: poem.title,
      author: poem.author,
      dynasty: poem.dynasty,
      content: poem.content,
      lines: poem.lines,
      translation: poem.translation,
      notes: poem.notes,
      appreciation: poem.appreciation
    }))
    
    const { data, error } = await supabase
      .from('poems')
      .insert(poemsToInsert)
      .select()
    
    if (error) throw error
    
    migrationResult.value = {
      success: true,
      message: `成功迁移 ${data.length} 首诗词到Supabase`
    }
    
    await loadSampleData()
    
  } catch (error) {
    migrationResult.value = {
      success: false,
      message: `迁移失败: ${error.message}`
    }
  } finally {
    migrating.value = false
  }
}

onMounted(() => {
  // 从 Supabase 获取本地数据数量
  getPoems(1, 100).then(data => {
    localPoemsCount.value = data.poems.length
  })
  testConnection()
})
</script>