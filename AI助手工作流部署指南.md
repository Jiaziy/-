# AI项目助手工作流部署指南

## 概述
本工作流为古诗词应用提供了一个完整的AI项目助手功能，通过n8n平台实现智能对话、项目管理、知识库查询等功能。

## 工作流功能
- ✅ 用户消息解析和验证
- ✅ 用户上下文构建（支持匿名和认证用户）
- ✅ Supabase数据集成（项目、聊天历史）
- ✅ 智能意图识别
- ✅ 多场景响应生成
- ✅ 聊天记录自动保存

## 部署步骤

### 1. 环境变量配置
在n8n中配置以下环境变量：
```bash
SUPABASE_URL=您的Supabase项目URL
SUPABASE_ANON_KEY=您的Supabase匿名密钥
```

### 2. 认证配置
创建HTTP头认证凭据：
- 名称：`supabase-auth`
- 类型：Header Auth
- 参数：
  - 名称：`apikey`
  - 值：`{{ $env.SUPABASE_ANON_KEY }}`
  - 名称：`Authorization`
  - 值：`Bearer {{ $env.SUPABASE_ANON_KEY }}`

### 3. 数据库准备
确保Supabase中已创建以下表结构（参考 `supabase-ai-assistant-migration.sql`）：
- `projects` - 项目表
- `chat_sessions` - 聊天会话表
- `tasks` - 任务表（可选）
- `knowledge_items` - 知识库表（可选）

### 4. 工作流导入
1. 在n8n控制台中，点击"导入工作流"
2. 上传 `n8n-ai-assistant-workflow-fixed.json` 文件
3. 检查所有节点配置是否正确

### 5. Webhook配置
工作流使用Webhook触发器，URL为：`/webhook/ai-assistant`
- 确保n8n实例可公开访问
- 记录完整的Webhook URL用于前端调用

## 前端集成

### Vue组件调用示例
```javascript
// 在AIAssistant.vue中调用工作流
const response = await fetch('https://your-n8n-instance.com/webhook/ai-assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'anonymous_user_123', // 或认证用户ID
    message: '查看我的项目',
    sessionId: 'session_001'
  })
});
```

### 请求格式
```json
{
  "userId": "string (必需)",
  "message": "string (必需)", 
  "sessionId": "string (可选)",
  "context": "object (可选)"
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
      "intent": "意图类型",
      "hasProjects": "是否有项目",
      "projectCount": "项目数量"
    }
  }
}
```

## 意图识别支持

工作流支持以下意图类型：
- `project_management` - 项目管理
- `task_management` - 任务管理  
- `knowledge_query` - 知识库查询
- `help_request` - 帮助请求
- `create_request` - 创建请求
- `query_request` - 查询请求
- `general_conversation` - 一般对话

## 故障排除

### 常见问题
1. **Webhook无法访问**：检查n8n实例网络配置
2. **Supabase连接失败**：验证环境变量和API密钥
3. **数据库表不存在**：运行迁移脚本创建表结构
4. **权限错误**：检查Supabase RLS策略配置

### 调试方法
1. 查看n8n执行日志
2. 检查Supabase请求日志
3. 验证前端请求格式
4. 测试环境变量配置

## 扩展功能

### 添加AI模型集成
可以在"生成AI响应"节点后添加AI服务调用：
- OpenAI GPT
- 本地AI模型
- 其他AI服务API

### 添加通知功能
集成邮件、Slack等通知渠道，在特定事件时发送提醒。

### 添加数据分析
集成数据分析工具，统计用户行为和助手使用情况。

## 安全考虑

1. **用户认证**：支持匿名和认证用户，确保数据隔离
2. **输入验证**：所有用户输入都经过严格验证
3. **API限流**：在n8n中配置适当的限流策略
4. **数据加密**：敏感数据在传输和存储时加密

## 性能优化建议

1. **缓存策略**：对频繁查询的数据添加缓存
2. **异步处理**：耗时的操作使用异步处理
3. **数据库索引**：确保关键字段有适当的索引
4. **连接池**：配置数据库连接池提高性能

## 版本信息
- 工作流版本：v2.0
- 最后更新：2024-01-01
- 兼容n8n版本：v1.0+