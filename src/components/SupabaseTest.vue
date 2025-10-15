<template>
  <div class="supabase-test">
    <h3>Supabase连接测试</h3>
    <button @click="testConnection" :disabled="loading">
      {{ loading ? '测试中...' : '测试连接' }}
    </button>
    <div v-if="result" class="result">
      <p>连接状态: {{ result.success ? '成功' : '失败' }}</p>
      <p v-if="result.error">错误信息: {{ result.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const loading = ref(false)
const result = ref(null)

const testConnection = async () => {
  loading.value = true
  result.value = null
  
  try {
    // 测试Supabase连接
    const { data, error } = await supabase.from('poems').select('count').limit(1)
    
    if (error) {
      result.value = { success: false, error: error.message }
    } else {
      result.value = { success: true }
    }
  } catch (error) {
    result.value = { success: false, error: error.message }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.supabase-test {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin: 20px 0;
}

button {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.result {
  margin-top: 15px;
  padding: 10px;
  background-color: #f3f4f6;
  border-radius: 4px;
}
</style>