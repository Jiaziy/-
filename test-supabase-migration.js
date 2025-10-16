// 测试Supabase数据迁移
import { testAndMigrate } from './src/api/migrateToSupabase.js'

async function runMigrationTest() {
  console.log('开始测试Supabase数据迁移...')
  
  try {
    const result = await testAndMigrate()
    
    if (result.success) {
      console.log('✅ 数据迁移成功！')
      console.log(`📊 迁移了 ${result.count} 首诗词`)
    } else {
      console.error('❌ 数据迁移失败:', result.error)
    }
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrationTest()
}