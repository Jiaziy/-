0<template>
  <div class="min-h-screen bg-gray-50 py-12 px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Supabase 数据库检查</h1>
      
      <!-- 数据库状态 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">数据库状态</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span>连接状态:</span>
            <span :class="connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'">
              {{ connectionStatus === 'connected' ? '✅ 已连接' : '❌ 未连接' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span>诗词总数:</span>
            <span class="font-semibold">{{ totalPoems }} 首</span>
          </div>
          <div class="flex items-center justify-between">
            <span>数据表状态:</span>
            <span :class="tableExists ? 'text-green-600' : 'text-red-600'">
              {{ tableExists ? '✅ 表存在' : '❌ 表不存在' }}
            </span>
          </div>
        </div>
        <button 
          @click="checkDatabase"
          :disabled="checking"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ checking ? '检查中...' : '重新检查' }}
        </button>
      </div>

      <!-- 诗词列表 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">诗词列表</h2>
        <div v-if="poems.length > 0" class="space-y-3">
          <div v-for="poem in poems" :key="poem.id" class="border rounded p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">{{ poem.title }}</h3>
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ poem.id }}</span>
            </div>
            <div class="text-gray-600">
              <p><strong>作者:</strong> {{ poem.author }}</p>
              <p><strong>朝代:</strong> {{ poem.dynasty }}</p>
              <p><strong>内容:</strong> {{ poem.content.substring(0, 50) }}...</p>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              创建时间: {{ formatDate(poem.created_at) }}
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>暂无诗词数据</p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">统计信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 朝代分布 -->
          <div>
            <h3 class="font-semibold mb-3">朝代分布</h3>
            <div v-if="dynastyStats.length > 0" class="space-y-2">
              <div v-for="stat in dynastyStats" :key="stat.dynasty" class="flex justify-between">
                <span>{{ stat.dynasty }}</span>
                <span class="font-semibold">{{ stat.count }} 首</span>
              </div>
            </div>
            <div v-else class="text-gray-500">暂无数据</div>
          </div>
          
          <!-- 作者分布 -->
          <div>
            <h3 class="font-semibold mb-3">作者分布</h3>
            <div v-if="authorStats.length > 0" class="space-y-2">
              <div v-for="stat in authorStats" :key="stat.author" class="flex justify-between">
                <span>{{ stat.author }}</span>
                <span class="font-semibold">{{ stat.count }} 首</span>
              </div>
            </div>
            <div v-else class="text-gray-500">暂无数据</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-6 flex space-x-4">
        <button 
          @click="migrateData"
          :disabled="migrating"
          class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {{ migrating ? '迁移中...' : '迁移数据到Supabase' }}
        </button>
        
        <button 
          @click="clearData"
          :disabled="clearing"
          class="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {{ clearing ? '清除中...' : '清除所有数据' }}
        </button>
      </div>

      <!-- 操作结果 -->
      <div v-if="operationResult" class="mt-4 p-4 rounded" :class="operationResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ operationResult.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const connectionStatus = ref('disconnected')
const tableExists = ref(false)
const totalPoems = ref(0)
const poems = ref([])
const dynastyStats = ref([])
const authorStats = ref([])
const checking = ref(false)
const migrating = ref(false)
const clearing = ref(false)
const operationResult = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}

const checkDatabase = async () => {
  checking.value = true
  operationResult.value = null
  
  try {
    // 测试连接
    const { data: testData, error: testError } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
    
    if (testError) {
      connectionStatus.value = 'disconnected'
      tableExists.value = false
      throw new Error(`连接失败: ${testError.message}`)
    }
    
    connectionStatus.value = 'connected'
    tableExists.value = true

    // 获取总数
    const { data: countData, error: countError } = await supabase
      .from('poems')
      .select('*', { count: 'exact', head: true })
    
    if (!countError && countData) {
      totalPoems.value = countData.length || 0
    } else {
      totalPoems.value = 0
    }

    // 获取诗词列表
    const { data: poemsData, error: poemsError } = await supabase
      .from('poems')
      .select('*')
      .order('id', { ascending: true })
      .limit(10)
    
    if (!poemsError && poemsData) {
      poems.value = poemsData
    } else {
      poems.value = []
    }

    // 统计朝代分布
    const { data: allPoems, error: statsError } = await supabase
      .from('poems')
      .select('dynasty, author')
    
    if (!statsError && allPoems && Array.isArray(allPoems)) {
      // 朝代统计
      const dynastyCount = {}
      allPoems.forEach(poem => {
        if (poem && poem.dynasty) {
          dynastyCount[poem.dynasty] = (dynastyCount[poem.dynasty] || 0) + 1
        }
      })
      dynastyStats.value = Object.entries(dynastyCount).map(([dynasty, count]) => ({
        dynasty,
        count
      })).sort((a, b) => b.count - a.count)

      // 作者统计
      const authorCount = {}
      allPoems.forEach(poem => {
        if (poem && poem.author) {
          authorCount[poem.author] = (authorCount[poem.author] || 0) + 1
        }
      })
      authorStats.value = Object.entries(authorCount).map(([author, count]) => ({
        author,
        count
      })).sort((a, b) => b.count - a.count)
    } else {
      dynastyStats.value = []
      authorStats.value = []
    }

    operationResult.value = {
      success: true,
      message: '数据库检查完成'
    }

  } catch (error) {
    operationResult.value = {
      success: false,
      message: error.message
    }
  } finally {
    checking.value = false
  }
}

const migrateData = async () => {
  migrating.value = true
  operationResult.value = null
  
  try {
    // 先尝试插入一条测试数据来检查RLS策略
    const testData = {
      title: '测试诗词',
      author: '测试作者',
      dynasty: '测试朝代',
      content: '这是一首测试诗词',
      lines: ['测试行1', '测试行2'],
      translation: '测试翻译',
      notes: '测试注释',
      appreciation: '测试赏析'
    }
    
    const { data: testResult, error: testError } = await supabase
      .from('poems')
      .insert([testData])
      .select()
    
    if (testError) {
      if (testError.message.includes('row-level security')) {
        throw new Error('RLS策略阻止了数据插入。请在Supabase SQL编辑器中运行 supabase_fix_rls.sql 脚本。')
      } else {
        throw testError
      }
    }
    
    // 如果测试成功，删除测试数据并插入真实数据
    await supabase
      .from('poems')
      .delete()
      .eq('title', '测试诗词')
    
    // 检查是否已有真实数据
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
    
    // 插入真实数据
    const poemsToInsert = [
      {
        title: '静夜思',
        author: '李白',
        dynasty: '唐朝',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
        translation: '明亮的月光洒在窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
        notes: '静夜思：宁静的夜晚产生的思绪。疑：好像。举头：抬头。',
        appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。后两句通过动作神态的刻画，深化思乡之情。'
      },
      {
        title: '春望',
        author: '杜甫',
        dynasty: '唐朝',
        content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。',
        lines: ['国破山河在', '城春草木深', '感时花溅泪', '恨别鸟惊心', '烽火连三月', '家书抵万金', '白头搔更短', '浑欲不胜簪'],
        translation: '长安沦陷，国家破碎，只有山河依旧；春天来了，人烟稀少的长安城里草木茂密。感伤国事，不禁涕泪四溅，鸟鸣惊心，徒增离愁别恨。连绵的战火已经延续了半年多，家书难得，一封抵得上万两黄金。愁绪缠绕，搔头思考，白发越搔越短，简直要不能插簪了。',
        notes: '国：国都，指长安。破：陷落。山河在：旧日的山河仍然存在。城：长安城。草木深：指人烟稀少。感时：为国家的时局而感伤。溅泪：流泪。恨别：怅恨离别。烽火：古时边防报警的烟火，这里指安史之乱的战火。三月：正月、二月、三月。抵：值，相当。白头：这里指白头发。搔：用手指轻轻的抓。浑：简直。欲：想，要。不胜：受不住，不能。簪：一种束发的首饰。',
        appreciation: '这首诗全篇情景交融，感情深沉，而又含蓄凝练，言简意赅，充分体现了"沉郁顿挫"的艺术风格。且这首诗结构紧凑，围绕"望"字展开，前四句借景抒情，情景结合。诗人由登高远望到焦点式的透视，由远及近，感情由弱到强，就在这感情和景色的交叉转换中含蓄地传达出诗人的感叹忧愤。'
      }
    ]
    
    const { data, error } = await supabase
      .from('poems')
      .insert(poemsToInsert)
      .select()
    
    if (error) throw error
    
    operationResult.value = {
      success: true,
      message: `成功迁移 ${data.length} 首诗词到Supabase`
    }
    
    // 重新检查数据库
    await checkDatabase()
    
  } catch (error) {
    operationResult.value = {
      success: false,
      message: error.message
    }
  } finally {
    migrating.value = false
  }
}

const clearData = async () => {
  clearing.value = true
  operationResult.value = null
  
  try {
    const { error } = await supabase
      .from('poems')
      .delete()
      .neq('id', 0)
    
    if (error) throw error
    
    operationResult.value = {
      success: true,
      message: '数据清除成功'
    }
    
    // 重新检查数据库
    await checkDatabase()
  } catch (error) {
    operationResult.value = {
      success: false,
      message: `清除失败: ${error.message}`
    }
  } finally {
    clearing.value = false
  }
}

onMounted(() => {
  checkDatabase()
})
</script>