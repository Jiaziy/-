# AI项目助手集成说明

## 概述
为古诗词应用添加了AI项目助手功能，通过n8n工作流和Supabase实现智能聊天助手。

## 文件结构

```
项目根目录/
├── n8n-ai-assistant-workflow.json    # n8n工作流配置
├── supabase-ai-assistant-migration.sql # 数据库迁移脚本
└── src/
    ├── components/
    │   └── AIAssistant.vue           # AI助手聊天组件
    ├── api/
    │   └── aiAssistant.js            # AI助手API服务
    └── App.vue (已更新)               # 主应用集成
```

## 功能特性

### 1. AI聊天助手
- 浮动聊天窗口设计
- 实时消息交互
- 消息历史记录
- 响应式界面

### 2. 智能项目管理
- 项目信息查询
- 任务管理协助
- 知识库检索
- 进度跟踪

### 3. 数据集成
- Supabase用户认证集成
- 项目数据关联
- 聊天记录存储
- 实时上下文感知

## 安装和配置

### 1. 数据库设置
```sql
-- 在Supabase中执行迁移脚本
-- 文件: supabase-ai-assistant-migration.sql
```

### 2. n8n工作流部署
1. 登录n8n控制台
2. 导入工作流文件: `n8n-ai-assistant-workflow.json`
3. 配置连接器:
   - Supabase PostgreSQL连接
   - OpenAI API密钥
4. 激活工作流

### 3. 前端集成
AI助手组件已自动集成到主应用中，会在所有页面显示为浮动按钮。

## API端点

### Webhook端点
- **URL**: `/webhook/ai-assistant-webhook`
- **方法**: POST
- **内容类型**: application/json

### 请求格式
```json
{
  "userId": "用户ID",
  "message": "用户消息",
  "sessionId": "会话ID(可选)"
}
```

### 响应格式
```json
{
  "success": true,
  "response": {
    "message": "AI回复内容",
    "sessionId": "会话ID",
    "timestamp": "时间戳",
    "context": {
      "userId": "用户ID",
      "projectCount": "项目数量",
      "usedProjects": ["使用的项目名称"]
    }
  }
}
```

## 组件使用

### 基本用法
```vue
<template>
  <div>
    <!-- 其他内容 -->
    <AIAssistant />
  </div>
</template>

<script setup>
import AIAssistant from '@/components/AIAssistant.vue'
</script>
```

### 自定义配置
组件支持以下配置选项：
- 位置调整 (CSS类名修改)
- 主题颜色 (Tailwind CSS类)
- 消息样式自定义

## 数据库表结构

### 1. user_profiles (用户档案)
- id: UUID主键
- user_id: 用户ID (外键)
- name: 用户名
- email: 邮箱
- preferences: 用户偏好设置 (JSONB)

### 2. projects (项目表)
- id: UUID主键  
- user_id: 用户ID (外键)
- name: 项目名称
- description: 项目描述
- status: 项目状态
- knowledge_base: 知识库标签 (JSONB)

### 3. tasks (任务表)
- id: UUID主键
- project_id: 项目ID (外键)
- title: 任务标题
- description: 任务描述
- status: 任务状态
- priority: 优先级
- due_date: 截止日期

### 4. chat_sessions (聊天会话)
- id: UUID主键
- user_id: 用户ID (外键)
- session_id: 会话ID
- user_message: 用户消息
- ai_response: AI回复
- context: 上下文信息 (JSONB)

### 5. knowledge_items (知识库项目)
- id: UUID主键
- project_id: 项目ID (外键)
- title: 标题
- content: 内容
- category: 分类
- tags: 标签数组

## 安全特性

### 1. 行级安全策略 (RLS)
所有表都启用了RLS，确保用户只能访问自己的数据。

### 2. 输入验证
- 消息内容过滤
- 用户身份验证
- SQL注入防护

### 3. 会话管理
- 唯一会话ID生成
- 会话超时处理
- 数据清理机制

## 开发环境配置

### 环境变量
```env
# Supabase配置
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# n8n配置  
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url

# OpenAI配置 (可选)
VITE_OPENAI_API_KEY=your_openai_key
```

### 本地开发
1. 启动开发服务器: `npm run dev`
2. AI助手组件将显示在页面右下角
3. 使用模拟数据进行测试

## 故障排除

### 常见问题

1. **AI助手不显示**
   - 检查组件是否正确导入
   - 验证CSS类名冲突

2. **消息发送失败**
   - 检查网络连接
   - 验证n8n工作流状态
   - 查看浏览器控制台错误

3. **数据库连接问题**
   - 验证Supabase连接配置
   - 检查RLS策略设置
   - 确认表结构是否正确创建

### 调试模式
启用开发工具查看详细日志：
```javascript
// 在浏览器控制台
localStorage.setItem('debug', 'ai-assistant*')
```

## 扩展开发

### 添加新功能
1. 在`aiAssistant.js`中添加新的API方法
2. 更新n8n工作流处理逻辑
3. 在前端组件中添加对应的UI交互

### 自定义响应
修改模拟响应逻辑来支持特定业务需求：
```javascript
// 在aiAssistant.js中
function simulateAIResponse(message, userId, sessionId) {
  // 添加自定义逻辑
  if (message.includes('特定关键词')) {
    return '自定义回复'
  }
}
```

## 性能优化建议

1. **消息分页**: 实现聊天记录分页加载
2. **缓存策略**: 对频繁查询的数据进行缓存
3. **压缩传输**: 启用Gzip压缩减少数据传输量
4. **图片优化**: 对AI生成的内容进行懒加载

## 版本更新

### v1.0.0 (当前版本)
- 基础AI聊天功能
- 项目数据集成
- 响应式界面设计
- 基础安全策略

### 计划功能
- [ ] 语音输入支持
- [ ] 文件上传处理
- [ ] 多语言支持
- [ ] 高级分析报表

## 技术支持

如有问题请联系开发团队或查看项目文档。