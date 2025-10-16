import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建模拟的Supabase客户端用于降级处理
const createMockSupabaseClient = () => {
  console.warn('Supabase环境变量未配置，使用模拟客户端')
  
  return {
    from: () => ({
      select: () => ({
        range: () => ({
          order: () => Promise.resolve({ data: [], error: null, count: 0 })
        }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('环境变量未配置') })
        }),
        or: () => Promise.resolve({ data: [], error: null })
      })
    })
  }
}

// 如果环境变量缺失，使用模拟客户端
let supabaseClient
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase环境变量未配置，应用将以降级模式运行')
  supabaseClient = createMockSupabaseClient()
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient