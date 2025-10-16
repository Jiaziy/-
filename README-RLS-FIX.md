# Supabase RLS策略修复指南

## 问题描述
数据迁移失败，错误信息："new row violates row-level security policy for table 'poems'"

## 解决方案

### 方法1：在Supabase控制台中配置RLS（推荐）

1. 登录到您的Supabase项目控制台
2. 进入 **Table Editor** → 选择 **poems** 表
3. 点击 **Authentication** 标签页
4. 在 **Row Level Security (RLS)** 部分，点击 **Enable RLS**
5. 创建以下策略：

#### 读取策略
```sql
CREATE POLICY "允许所有人读取诗词" ON poems
  FOR SELECT USING (true);
```

#### 插入策略
```sql
CREATE POLICY "允许所有人插入诗词" ON poems
  FOR INSERT WITH CHECK (true);
```

#### 更新策略
```sql
CREATE POLICY "允许所有人更新诗词" ON poems
  FOR UPDATE USING (true);
```

#### 删除策略
```sql
CREATE POLICY "允许所有人删除诗词" ON poems
  FOR DELETE USING (true);
```

### 方法2：使用SQL编辑器

在Supabase的 **SQL Editor** 中运行以下完整脚本：

```sql
-- 启用RLS
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 创建读取策略
CREATE POLICY "允许所有人读取诗词" ON poems
  FOR SELECT USING (true);

-- 创建插入策略  
CREATE POLICY "允许所有人插入诗词" ON poems
  FOR INSERT WITH CHECK (true);

-- 创建更新策略
CREATE POLICY "允许所有人更新诗词" ON poems
  FOR UPDATE USING (true);

-- 创建删除策略
CREATE POLICY "允许所有人删除诗词" ON poems
  FOR DELETE USING (true);
```

### 方法3：临时禁用RLS（仅用于测试）

```sql
-- 临时禁用RLS进行测试
ALTER TABLE poems DISABLE ROW LEVEL SECURITY;

-- 测试完成后重新启用
-- ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
```

## 验证RLS配置

运行以下查询验证策略是否生效：

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'poems';
```

## 预期结果

配置成功后，您应该看到4条策略记录：
1. 允许所有人读取诗词 (SELECT)
2. 允许所有人插入诗词 (INSERT)  
3. 允许所有人更新诗词 (UPDATE)
4. 允许所有人删除诗词 (DELETE)

## 重新测试

RLS配置完成后，返回 http://localhost:3001/check-database 页面，点击"迁移数据到Supabase"按钮重新尝试数据迁移。

如果仍然遇到问题，请检查：
- Supabase项目URL和密钥是否正确配置在环境变量中
- 数据库表结构是否正确
- 网络连接是否正常