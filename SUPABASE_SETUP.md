# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase官网](https://supabase.com) 并注册账号
2. 创建一个新项目
3. 等待项目初始化完成

## 2. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填入你的 Supabase 项目信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入以下信息：

```
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

你可以在 Supabase 项目的设置中找到这些信息。

## 3. 初始化数据库

在 Supabase 的 SQL 编辑器中运行 `supabase-setup.sql` 文件中的 SQL 语句：

1. 登录 Supabase 控制台
2. 进入你的项目
3. 点击左侧菜单的 "SQL Editor"
4. 复制 `supabase-setup.sql` 的内容并执行

## 4. 测试配置

运行开发服务器测试配置是否成功：

```bash
npm run dev
```

## 5. 部署到 Vercel

### 在 Vercel 中配置环境变量：

1. 进入 Vercel 项目设置
2. 找到 "Environment Variables" 部分
3. 添加以下环境变量：
   - `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥

### 部署命令：

Vercel 会自动使用 `npm run build` 命令构建项目。

## 故障排除

### 如果 Supabase 连接失败：

1. 检查环境变量是否正确设置
2. 确认 Supabase 项目是否正常运行
3. 检查网络连接
4. 查看浏览器控制台的错误信息

### 数据库查询失败：

1. 确认 `poems` 表是否已创建
2. 检查行级安全策略是否配置正确
3. 验证数据是否已成功插入

## 项目结构

- `src/lib/supabase.js` - Supabase 客户端配置
- `src/api/poems.js` - 诗词 API（支持 Supabase 和模拟数据回退）
- `.env.example` - 环境变量模板
- `supabase-setup.sql` - 数据库初始化脚本

## 功能特性

- ✅ 支持 Supabase 实时数据库
- ✅ 模拟数据回退机制
- ✅ 分页查询支持
- ✅ 全文搜索功能
- ✅ 错误处理和日志记录