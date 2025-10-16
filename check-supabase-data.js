// 检查Supabase数据库内容
import { supabase } from './src/lib/supabase.js'

async function checkSupabaseData() {
  console.log('🔍 检查Supabase数据库内容...\n')
  
  try {
    // 1. 检查连接
    console.log('1. 测试数据库连接...')
    const { data: testData, error: testError } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ 连接失败:', testError.message)
      return
    }
    console.log('✅ 数据库连接成功\n')

    // 2. 检查诗词总数
    console.log('2. 检查诗词总数...')
    const { data: countData, error: countError } = await supabase
      .from('poems')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ 获取总数失败:', countError.message)
    } else {
      console.log(`📊 数据库中的诗词总数: ${countData.length || 0} 首\n`)
    }

    // 3. 获取前几首诗词的详细信息
    console.log('3. 获取诗词样本数据...')
    const { data: poemsData, error: poemsError } = await supabase
      .from('poems')
      .select('id, title, author, dynasty, created_at')
      .order('id', { ascending: true })
      .limit(5)
    
    if (poemsError) {
      console.error('❌ 获取诗词数据失败:', poemsError.message)
    } else {
      console.log('📝 前5首诗词信息:')
      poemsData.forEach(poem => {
        console.log(`   ${poem.id}. ${poem.title} - ${poem.author} (${poem.dynasty})`)
      })
      console.log()
    }

    // 4. 检查朝代分布
    console.log('4. 检查朝代分布...')
    const { data: dynastyData, error: dynastyError } = await supabase
      .from('poems')
      .select('dynasty')
    
    if (dynastyError) {
      console.error('❌ 获取朝代数据失败:', dynastyError.message)
    } else {
      const dynastyCount = {}
      dynastyData.forEach(item => {
        dynastyCount[item.dynasty] = (dynastyCount[item.dynasty] || 0) + 1
      })
      
      console.log('🏛️ 朝代分布:')
      Object.entries(dynastyCount).forEach(([dynasty, count]) => {
        console.log(`   ${dynasty}: ${count} 首`)
      })
      console.log()
    }

    // 5. 检查作者分布
    console.log('5. 检查作者分布...')
    const { data: authorData, error: authorError } = await supabase
      .from('poems')
      .select('author')
    
    if (authorError) {
      console.error('❌ 获取作者数据失败:', authorError.message)
    } else {
      const authorCount = {}
      authorData.forEach(item => {
        authorCount[item.author] = (authorCount[item.author] || 0) + 1
      })
      
      console.log('👤 作者分布:')
      Object.entries(authorCount).forEach(([author, count]) => {
        console.log(`   ${author}: ${count} 首`)
      })
    }

  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error)
  }
}

// 运行检查
checkSupabaseData()