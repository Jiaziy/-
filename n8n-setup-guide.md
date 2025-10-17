# n8n工作流设置指南

## 概述
本指南详细说明如何在n8n中设置和配置AI项目助手工作流。

## 前置要求

### 1. n8n实例
- 本地n8n安装 或
- n8n.cloud账户 或
- 自托管n8n实例

### 2. API密钥
- Supabase项目URL和API密钥
- OpenAI API密钥 (可选)

## 设置步骤

### 步骤1: 导入工作流

1. 登录n8n控制台
2. 点击"Workflows" → "Import from file"
3. 选择文件: `n8n-ai-assistant-workflow.json`
4. 点击"Import"

### 步骤2: 配置连接器

#### Supabase PostgreSQL连接
1. 在工作流中找到PostgreSQL节点
2. 点击节点设置
3. 创建新的PostgreSQL连接器:
   - **Host**: `db.[your-supabase-project-ref].supabase.co`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: [你的数据库密码]
   - **Port**: `5432`
   - **SSL**: 启用

#### OpenAI API连接 (可选)
1. 找到HTTP Request节点
2. 点击节点设置
3. 创建新的HTTP Request连接器:
   - **Name**: `openai-api-key`
   - **Authentication**: `Predefined Credential Type`
   - **Credential Type**: `OpenAI API`
   - **API Key**: [你的OpenAI API密钥]

### 步骤3: 配置Webhook

1. 找到Webhook节点
2. 复制Webhook URL
3. 在前端代码中更新Webhook地址

### 步骤4: 测试工作流

1. 激活工作流
2. 使用以下测试数据发送请求:

```json
{
  "userId": "test-user-123",
  "message": "你好，能帮我查看项目吗？",
  "sessionId": "test-session-001"
}
```

## 工作流节点说明

### 1. Webhook节点
- **路径**: `/webhook`
- **方法**: POST
- **用途**: 接收前端请求

### 2. 解析用户输入节点
- 验证必要参数
- 清理输入数据
- 生成会话ID

### 3. Supabase节点
- 获取用户信息
- 查询用户项目
- 检索知识库数据

### 4. 构建上下文节点
- 合并用户数据
- 准备AI提示词
- 设置对话上下文

### 5. AI服务节点
- 调用OpenAI API
- 处理AI响应
- 错误处理

### 6. 保存聊天记录节点
- 存储对话历史
- 更新用户上下文
- 维护会话状态

## 环境变量配置

在n8n设置中添加以下环境变量:

```env
# Supabase配置
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI配置
OPENAI_API_KEY=your-openai-api-key

# 应用配置
N8N_WEBHOOK_URL=https://your-n8n-instance.com
```

## 安全配置

### 1. Webhook安全
- 启用Webhook认证
- 设置IP白名单
- 使用HTTPS

### 2. API密钥管理
- 使用n8n的凭证管理
- 定期轮换密钥
- 最小权限原则

### 3. 数据保护
- 启用数据加密
- 配置访问日志
- 设置数据保留策略

## 监控和日志

### 1. 工作流监控
- 启用执行历史
- 设置错误警报
- 监控性能指标

### 2. 日志配置
```javascript
// 在代码节点中添加日志
console.log('用户请求:', $input.first().json)
console.log('AI响应:', $input.all()[1].json)
```

### 3. 错误处理
- 配置重试机制
- 设置失败通知
- 实现降级策略

## 性能优化

### 1. 缓存策略
- 实现数据缓存
- 设置TTL
- 使用Redis缓存

### 2. 并发处理
- 配置工作流并发
- 优化数据库查询
- 使用批量操作

### 3. 资源优化
- 限制消息长度
- 压缩响应数据
- 启用CDN

## 故障排除

### 常见问题

1. **Webhook 404错误**
   - 检查工作流是否激活
   - 验证Webhook路径
   - 确认网络连通性

2. **数据库连接失败**
   - 检查Supabase连接字符串
   - 验证防火墙设置
   - 确认SSL配置

3. **AI服务超时**
   - 增加超时时间
   - 检查API配额
   - 实现重试逻辑

### 调试技巧

1. **启用详细日志**
```javascript
// 在代码节点开头添加
console.log('节点输入:', JSON.stringify($input.all(), null, 2))
```

2. **测试单个节点**
- 使用"Execute Node"功能
- 检查中间结果
- 验证数据格式

3. **性能分析**
- 使用n8n的执行时间统计
- 监控API调用延迟
- 分析数据库查询性能

## 扩展开发

### 添加新功能

1. **自定义AI提示词**
```javascript
// 在构建上下文节点中修改
const systemPrompt = `你是一个专业的${domain}助手...`
```

2. **多模型支持**
- 添加模型选择参数
- 实现模型路由
- 配置回退策略

3. **插件系统**
- 创建可插拔组件
- 实现模块化设计
- 支持第三方集成

## 备份和恢复

### 1. 工作流备份
- 定期导出工作流
- 版本控制配置
- 环境分离策略

### 2. 数据备份
- 设置Supabase自动备份
- 导出聊天历史
- 配置灾难恢复

### 3. 恢复流程
1. 导入工作流备份
2. 恢复数据库快照
3. 验证功能完整性

## 最佳实践

### 1. 开发流程
- 使用开发/测试/生产环境
- 实现CI/CD流水线
- 进行代码审查

### 2. 安全实践
- 定期安全审计
- 依赖项漏洞扫描
- 渗透测试

### 3. 运维实践
- 设置监控告警
- 定期性能优化
- 容量规划

## 支持资源

### 官方文档
- [n8n文档](https://docs.n8n.io)
- [Supabase文档](https://supabase.com/docs)
- [OpenAI API文档](https://platform.openai.com/docs)

### 社区支持
- n8n社区论坛
- GitHub Issues
- Stack Overflow

### 专业服务
- 技术咨询
- 定制开发
- 运维支持