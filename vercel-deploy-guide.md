# Vercel 部署指南

## 部署步骤

### 方法一：通过 GitHub 部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "初始提交：古诗词鉴赏网页"
   git branch -M main
   git remote add origin https://github.com/你的用户名/gushici.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [Vercel](https://vercel.com/)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 保持默认配置，点击 "Deploy"

### 方法二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel
   ```

3. **按照提示操作**
   - 选择当前目录
   - 保持默认配置
   - 确认部署

## 环境配置

### 构建配置
项目已配置 `vercel.json`，包含：
- 构建命令：`npm run build`
- 输出目录：`dist`
- SPA 路由配置

### 自定义域名（可选）
1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 解析到 Vercel 提供的地址

## 部署注意事项

### 1. 路由配置
- 项目使用 Vue Router 的 history 模式
- Vercel 会自动处理 SPA 路由重定向

### 2. 环境变量
如需配置环境变量，在 Vercel 项目设置的 Environment Variables 中添加：
```env
VUE_APP_API_URL=你的API地址
VUE_APP_VERSION=1.0.0
```

### 3. 构建优化
- 自动启用代码分割
- 静态资源优化
- CDN 加速

## 故障排除

### 构建失败
1. 检查 `package.json` 中的依赖是否正确
2. 确保所有文件路径正确
3. 查看 Vercel 构建日志

### 路由问题
如果页面刷新后出现 404，检查 `vercel.json` 中的路由配置：
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 静态资源加载失败
确保 `public/index.html` 中的资源路径正确：
```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

## 性能优化建议

1. **启用缓存**
   - 配置适当的缓存头
   - 使用 Vercel 的边缘缓存

2. **图片优化**
   - 使用 WebP 格式
   - 配置图片懒加载

3. **代码分割**
   - Vue Router 已自动启用懒加载
   - 按需加载组件

## 监控和分析

1. **性能监控**
   - 使用 Vercel Analytics
   - 配置性能预算

2. **错误追踪**
   - 集成 Sentry
   - 监控 JavaScript 错误

## 更新部署

每次推送到 main 分支时，Vercel 会自动重新部署。

如需手动部署：
```bash
vercel --prod
```

## 支持的功能

✅ 支持的功能：
- SPA 路由
- 静态资源服务
- 自动 HTTPS
- CDN 加速
- 环境变量
- 自定义域名

❌ 不支持的功能：
- 服务器端渲染（需要 Next.js）
- 后端 API（需要 Serverless Functions）