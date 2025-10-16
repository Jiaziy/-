import { supabase } from '@/lib/supabase'

// 获取诗词列表
export async function getPoems(page = 1, perPage = 10) {
  try {
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    
    const { data, error, count } = await supabase
      .from('poems')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: true })
    
    if (error) throw error
    
    return {
      poems: data || [],
      total: count || 0
    }
  } catch (error) {
    console.error('获取诗词列表失败:', error)
    return { poems: [], total: 0 }
  }
}

// 根据ID获取诗词详情
export async function getPoemById(id) {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('获取诗词详情失败:', error)
    return null
  }
}

// 搜索诗词
export async function searchPoems(query) {
  if (!query) return []
  
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`)
      .order('id', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('搜索诗词失败:', error)
    return []
  }
}

// 按朝代筛选诗词
export async function getPoemsByDynasty(dynasty, page = 1, perPage = 10) {
  try {
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    
    const { data, error, count } = await supabase
      .from('poems')
      .select('*', { count: 'exact' })
      .eq('dynasty', dynasty)
      .range(from, to)
      .order('id', { ascending: true })
    
    if (error) throw error
    
    return {
      poems: data || [],
      total: count || 0
    }
  } catch (error) {
    console.error('按朝代筛选诗词失败:', error)
    return { poems: [], total: 0 }
  }
}

// 按作者筛选诗词
export async function getPoemsByAuthor(author, page = 1, perPage = 10) {
  try {
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    
    const { data, error, count } = await supabase
      .from('poems')
      .select('*', { count: 'exact' })
      .eq('author', author)
      .range(from, to)
      .order('id', { ascending: true })
    
    if (error) throw error
    
    return {
      poems: data || [],
      total: count || 0
    }
  } catch (error) {
    console.error('按作者筛选诗词失败:', error)
    return { poems: [], total: 0 }
  }
}

// 获取所有朝代列表
export async function getDynasties() {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('dynasty')
      .order('dynasty', { ascending: true })
    
    if (error) throw error
    
    // 去重并返回朝代列表
    const uniqueDynasties = [...new Set(data.map(item => item.dynasty))]
    return uniqueDynasties
  } catch (error) {
    console.error('获取朝代列表失败:', error)
    return []
  }
}

// 获取所有作者列表
export async function getAuthors() {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('author')
      .order('author', { ascending: true })
    
    if (error) throw error
    
    // 去重并返回作者列表
    const uniqueAuthors = [...new Set(data.map(item => item.author))]
    return uniqueAuthors
  } catch (error) {
    console.error('获取作者列表失败:', error)
    return []
  }
}