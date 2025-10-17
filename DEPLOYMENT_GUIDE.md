# AI项目助手部署指南

## 完整部署流程

### 阶段1: 数据库准备

#### 1.1 创建Supabase项目
1. 登录 [Supabase](https://supabase.com)
2. 创建新项目或使用现有项目
3. 记录项目URL和API密钥

#### 1.2 执行数据库迁移
```bash
# 方法1: 使用Supabase SQL编辑器
# 登录Supabase控制台 → SQL编辑器 → 粘贴迁移脚本内容

# 方法2: 使用命令行
psql -h db.your-project-ref.supabase.co -p 5432 -U postgres -d postgres -f supabase-ai-assistant-migration.sql
```

#### 1.3 验证表结构
```sql
-- 检查表是否创建成功
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'projects', 'tasks', 'chat_sessions', 'knowledge_items');
```

### 阶段2: n8n工作流部署

#### 2.1 设置n8n实例
```bash
# 本地n8n安装
npm install n8n -g
n8n start

# 或使用Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

#### 2.2 导入工作流
1. 访问n8n控制台 (http://localhost:5678)
2. 导入 `n8n-ai-assistant-workflow.json`
3. 配置连接器（参考n8n-setup-guide.md）

#### 2.3 测试工作流
```bash
# 使用curl测试Webhook
curl -X POST \
  http://localhost:5678/webhook/ai-assistant-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-001",
    "message": "你好，测试消息",
    "sessionId": "test-session-001"
  }'
```

### 阶段3: 前端应用更新

#### 3.1 更新环境变量
在 `.env` 文件中添加：
```env
# AI助手配置
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ai-assistant-webhook
VITE_AI_ASSISTANT_ENABLED=true

# Supabase配置 (已存在)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 3.2 安装依赖和构建
```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产构建
npm run build
```

#### 3.3 验证集成
1. 访问应用首页
2. 检查右下角是否显示AI助手按钮
3. 点击按钮测试聊天功能

### 阶段4: 生产环境部署

#### 4.1 n8n生产部署
```yaml
# docker-compose.yml 示例
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-password
    volumes:
      - n8n_data:/home/node/.n8n
```

#### 4.2 前端部署
```bash
# Vercel部署
npm i -g vercel
vercel --prod

# Netlify部署
npm run build
# 上传dist目录到Netlify
```

#### 4.3 域名和SSL配置
```nginx
# nginx配置示例
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /webhook/ {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 测试验证

### 功能测试清单

#### 数据库测试
- [ ] 用户表可正常读写
- [ ] 项目表RLS策略生效
- [ ] 聊天记录可保存
- [ ] 知识库项目可查询

#### n8n工作流测试
- [ ] Webhook可接收请求
- [ ] Supabase连接正常
- [ ] AI服务响应正确
- [ ] 错误处理机制有效

#### 前端集成测试
- [ ] AI助手按钮显示正常
- [ ] 聊天窗口可打开关闭
- [ ] 消息发送接收正常
- [ ] 响应式设计适配

### 性能测试

#### 负载测试
```bash
# 使用ab进行压力测试
ab -n 100 -c 10 -p test_data.json -T application/json http://localhost:5678/webhook/ai-assistant-webhook
```

#### 并发测试
```javascript
// 模拟并发请求
const testConcurrentRequests = async () => {
  const promises = Array(10).fill().map(() => 
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
  );
  
  const results = await Promise.all(promises);
  console.log('并发测试结果:', results);
};
```

### 安全测试

#### 输入验证测试
```javascript
// 测试恶意输入
const testCases = [
  { input: "<script>alert('xss')</script>", expected: "安全过滤" },
  { input: "'; DROP TABLE users; --", expected: "SQL注入防护" },
  { input: "正常消息", expected: "正常处理" }
];
```

#### 认证测试
```javascript
// 测试未授权访问
const testUnauthorizedAccess = async () => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({ message: "测试" })
    // 不包含userId
  });
  
  // 应返回错误
  assert(response.status === 400);
};
```

## 监控和维护

### 日志监控配置

#### n8n日志
```javascript
// 自定义日志中间件
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error)
};
```

#### 应用日志
```javascript
// 前端错误监控
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  // 发送到错误监控服务
});
```

### 性能监控

#### 关键指标
- 响应时间 (< 2秒)
- 错误率 (< 1%)
- 并发用户数
- API调用频率

#### 监控工具配置
```yaml
# Prometheus配置示例
scrape_configs:
  - job_name: 'n8n'
    static_configs:
      - targets: ['localhost:5678']
```

### 备份策略

#### 数据库备份
```sql
-- 自动备份脚本
pg_dump -h your-db-host -U postgres -d your-db > backup_$(date +%Y%m%d).sql
```

#### 工作流备份
```bash
# 定期导出n8n工作流
curl -X GET http://localhost:5678/rest/workflows -u admin:password > workflows_backup.json
```

## 故障排除

### 常见问题解决

#### 问题1: AI助手不显示
**症状**: 页面右下角没有浮动按钮
**解决**:
1. 检查浏览器控制台错误
2. 验证组件导入路径
3. 确认CSS样式加载

#### 问题2: 消息发送失败  
**症状**: 消息发送后无响应
**解决**:
1. 检查n8n工作流状态
2. 验证Webhook URL配置
3. 查看网络请求详情

#### 问题3: 数据库连接错误
**症状**: n8n节点执行失败
**解决**:
1. 检查Supabase连接字符串
2. 验证数据库权限
3. 确认网络连通性

### 调试工具

#### 浏览器开发者工具
```javascript
// 启用详细日志
localStorage.setItem('debug', 'ai-assistant*');

// 监控网络请求
console.log('AI助手请求详情:', {
  url: webhookUrl,
  payload: requestData
});
```

#### n8n调试模式
```bash
# 启用详细日志
N8N_LOG_LEVEL=verbose n8n start

# 或使用环境变量
export N8N_LOG_LEVEL=debug
```

## 扩展和定制

### 添加新功能

#### 自定义AI模型
```javascript
// 修改aiAssistant.js
const customAIProvider = {
  chat: async (message, context) => {
    // 调用自定义AI服务
    return await fetch(customAIUrl, {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }
};
```

#### 多语言支持
```javascript
// 国际化配置
const i18n = {
  zh: { greeting: '您好！我是AI助手' },
  en: { greeting: 'Hello! I am your AI assistant' }
};
```

### 性能优化建议

#### 缓存策略
```javascript
// 实现消息缓存
const messageCache = new Map();
const getCachedResponse = (message) => messageCache.get(message);
```

#### 懒加载优化
```javascript
// 组件懒加载
const AIAssistant = defineAsyncComponent(() =>
  import('./components/AIAssistant.vue')
);
```

## 支持联系方式

### 技术支持
- 邮箱: support@your-company.com
- 文档: https://docs.your-project.com
- GitHub: https://github.com/your-repo/issues

### 紧急联系
- 运维团队: ops@your-company.com
- 值班电话: +86-XXX-XXXX-XXXX

---

**部署完成时间**: 预计2-4小时  
**预计维护工作量**: 每周1-2小时  
**技术支持级别**: 7x24小时监控