import { supabase } from '@/lib/supabase'

// AI助手API服务

/**
 * 发送消息到AI助手
 * @param {string} message - 用户消息
 * @param {string} userId - 用户ID
 * @param {string} sessionId - 会话ID
 * @returns {Promise<Object>} AI响应
 */
export async function sendMessageToAI(message, userId, sessionId = null) {
  try {
    // 这里应该调用n8n工作流的webhook端点
    // 暂时使用模拟响应
    return await simulateAIResponse(message, userId, sessionId)
  } catch (error) {
    console.error('发送消息到AI失败:', error)
    throw new Error('无法连接到AI服务')
  }
}

/**
 * 获取用户聊天历史
 * @param {string} userId - 用户ID
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} 聊天历史
 */
export async function getChatHistory(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取聊天历史失败:', error)
    return []
  }
}

/**
 * 获取用户项目信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 项目列表
 */
export async function getUserProjects(userId) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取用户项目失败:', error)
    return []
  }
}

/**
 * 获取项目任务
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} 任务列表
 */
export async function getProjectTasks(projectId) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取项目任务失败:', error)
    return []
  }
}

/**
 * 获取知识库项目
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} 知识库项目列表
 */
export async function getKnowledgeItems(projectId) {
  try {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取知识库项目失败:', error)
    return []
  }
}

/**
 * 创建新项目
 * @param {string} userId - 用户ID
 * @param {string} name - 项目名称
 * @param {string} description - 项目描述
 * @returns {Promise<Object>} 创建的项目
 */
export async function createProject(userId, name, description = '') {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name,
          description,
          status: 'active'
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('创建项目失败:', error)
    throw new Error('创建项目失败')
  }
}

/**
 * 创建任务
 * @param {string} projectId - 项目ID
 * @param {string} title - 任务标题
 * @param {string} description - 任务描述
 * @returns {Promise<Object>} 创建的任务
 */
export async function createTask(projectId, title, description = '') {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          project_id: projectId,
          title,
          description,
          status: 'pending',
          priority: 'medium'
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('创建任务失败:', error)
    throw new Error('创建任务失败')
  }
}

/**
 * 模拟AI响应（开发环境使用）
 */
async function simulateAIResponse(message, userId, sessionId) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  const responses = {
    // 问候类
    '你好': '您好！我是AI项目助手，很高兴为您服务。',
    'hello': 'Hello! I am your AI project assistant.',
    '嗨': '嗨！有什么可以帮您的吗？',
    
    // 项目相关
    '我的项目': '让我帮您查看项目信息...',
    '创建项目': '好的，请告诉我项目名称和描述。',
    '项目状态': '正在为您查询项目状态...',
    
    // 任务相关
    '任务': '您想了解哪个项目的任务？',
    '待办事项': '让我帮您查看待办任务...',
    '完成任务': '请告诉我您想完成哪个任务？',
    
    // 知识库相关
    '知识库': '正在为您查询知识库内容...',
    '学习资料': '让我帮您查找相关的学习资料。',
    
    // 默认响应
    'default': `我已经收到您的消息："${message}"。目前我还在学习阶段，但我会尽力帮助您管理项目和知识库。您可以说：
• "查看我的项目"
• "创建新任务" 
• "查询知识库"
• "项目进度如何"

请问您需要什么帮助？`
  }

  const lowerMessage = message.toLowerCase()
  let response = responses.default

  // 匹配关键词
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key.toLowerCase()) && key !== 'default') {
      response = value
      break
    }
  }

  return {
    success: true,
    response: {
      message: response,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      context: {
        userId,
        messageType: classifyMessage(message)
      }
    }
  }
}

/**
 * 分类消息类型
 */
function classifyMessage(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
    return 'project'
  } else if (lowerMessage.includes('任务') || lowerMessage.includes('task')) {
    return 'task'
  } else if (lowerMessage.includes('知识') || lowerMessage.includes('knowledge')) {
    return 'knowledge'
  } else if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
    return 'help'
  } else {
    return 'general'
  }
}

export default {
  sendMessageToAI,
  getChatHistory,
  getUserProjects,
  getProjectTasks,
  getKnowledgeItems,
  createProject,
  createTask
}