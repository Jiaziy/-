import { supabase } from '../lib/supabase.js'
import { poemsData } from './poems.js'

// 将本地数据迁移到Supabase
export async function migratePoemsToSupabase() {
  try {
    console.log('开始迁移诗词数据到Supabase...')
    
    // 检查是否已有数据
    const { data: existingData, error: checkError } = await supabase
      .from('poems')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('检查现有数据失败:', checkError)
      return { success: false, error: checkError }
    }
    
    // 如果已有数据，先清空
    if (existingData && existingData.length > 0) {
      console.log('检测到已有数据，正在清空...')
      const { error: deleteError } = await supabase
        .from('poems')
        .delete()
        .neq('id', 0) // 删除所有记录
      
      if (deleteError) {
        console.error('清空数据失败:', deleteError)
        return { success: false, error: deleteError }
      }
    }
    
    // 转换数据格式并插入
    const poemsToInsert = poemsData.map(poem => ({
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
    
    if (error) {
      console.error('插入数据失败:', error)
      return { success: false, error }
    }
    
    console.log(`成功迁移 ${data.length} 首诗词到Supabase`)
    return { success: true, count: data.length }
    
  } catch (error) {
    console.error('迁移过程中发生错误:', error)
    return { success: false, error }
  }
}

// 测试连接和迁移
export async function testAndMigrate() {
  try {
    // 测试连接
    const { data, error } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase连接测试失败:', error)
      return { success: false, error }
    }
    
    console.log('Supabase连接成功')
    
    // 执行迁移
    const result = await migratePoemsToSupabase()
    return result
    
  } catch (error) {
    console.error('测试和迁移过程中发生错误:', error)
    return { success: false, error }
  }
}