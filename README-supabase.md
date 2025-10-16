# Supabase 数据迁移指南

## 概述
本项目已将诗词数据从本地模拟数据迁移到 Supabase 云端数据库。

## 数据库结构

### poems 表结构
```sql
CREATE TABLE poems (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  content TEXT NOT NULL,
  lines JSONB,
  translation TEXT,
  notes TEXT,
  appreciation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 索引
- `idx_poems_dynasty` - 朝代筛选索引
- `idx_poems_author` - 作者筛选索引  
- `idx_poems_title` - 标题搜索索引

## API 更新

### 新的 API 文件
- `src/api/supabasePoems.js` - 使用 Supabase 的 API 函数
- `src/api/migrateToSupabase.js` - 数据迁移工具

### 主要 API 函数
```javascript
// 获取诗词列表（支持分页）
getPoems(page = 1, perPage = 10)

// 按ID获取诗词详情
getPoemById(id)

// 搜索诗词
searchPoems(query)

// 按朝代筛选
getPoemsByDynasty(dynasty, page = 1, perPage = 10)

// 按作者筛选  
getPoemsByAuthor(author, page = 1, perPage = 10)

// 获取朝代列表
getDynasties()

// 获取作者列表
getAuthors()
```

## 数据迁移

### 自动迁移
运行以下命令进行数据迁移：
```bash
node test-supabase-migration.js
```

### 手动迁移
使用 SQL 文件进行手动迁移：
```bash
# 在 Supabase SQL 编辑器中运行
supabase_migration.sql
```

## 环境配置

确保 `.env` 文件包含正确的 Supabase 配置：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 功能特性

### 1. 实时数据同步
- 所有诗词数据现在存储在云端
- 支持多用户并发访问
- 自动数据备份和恢复

### 2. 高级筛选功能
- 按朝代浏览诗词
- 按作者筛选作品  
- 实时搜索功能

### 3. 性能优化
- 数据库索引优化查询性能
- 分页加载减少数据传输
- 缓存策略提升用户体验

## 部署说明

### 生产环境部署
1. 确保 Supabase 项目已配置正确的 CORS 设置
2. 验证数据库连接和权限设置
3. 测试所有 API 端点功能正常

### 开发环境
1. 使用本地 Supabase 实例进行开发
2. 配置开发环境变量
3. 运行数据迁移测试

## 故障排除

### 常见问题
1. **连接失败**：检查环境变量配置
2. **权限错误**：验证 RLS 策略设置
3. **数据不一致**：运行数据迁移脚本

### 技术支持
如有问题，请参考：
- Supabase 官方文档
- 项目 API 文档
- 迁移脚本日志