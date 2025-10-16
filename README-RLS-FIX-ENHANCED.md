# Supabase RLS策略修复指南（增强版）

## 问题描述
策略已存在错误："policy "允许所有人读取诗词" for table "poems" already exists"

## 解决方案

### 方法1：使用修复脚本（推荐）

在Supabase的 **SQL Editor** 中运行 `supabase_fix_rls.sql` 脚本：

```sql
-- 修复Supabase RLS策略
-- 先删除现有策略，然后重新创建

-- 1. 删除现有策略
DROP POLICY IF EXISTS "允许所有人读取诗词" ON poems;
DROP POLICY IF EXISTS "允许所有人插入诗词" ON poems;
DROP POLICY IF EXISTS "允许所有人更新诗词" ON poems;
DROP POLICY IF EXISTS "允许所有人删除诗词" ON poems;

-- 2. 确保RLS已启用
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 3. 创建新的策略（使用英文名称避免编码问题）
CREATE POLICY "enable_read_for_all" ON poems
  FOR SELECT USING (true);

CREATE POLICY "enable_insert_for_all" ON poems
  FOR INSERT WITH CHECK (true);

CREATE POLICY "enable_update_for_all" ON poems
  FOR UPDATE USING (true);

CREATE POLICY "enable_delete_for_all" ON poems
  FOR DELETE USING (true);
```

### 方法2：逐个检查现有策略

如果不想删除现有策略，可以检查并修改现有策略：

```sql
-- 查看现有策略
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'poems';

-- 如果策略存在但配置不正确，可以修改它们
-- 例如，确保策略适用于所有用户（roles = '{authenticated, anon}'）
```

### 方法3：临时解决方案

如果策略配置复杂，可以临时禁用RLS进行测试：

```sql
-- 临时禁用RLS
ALTER TABLE poems DISABLE ROW LEVEL SECURITY;

-- 测试数据迁移
-- 然后重新启用RLS
-- ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
```

## 验证步骤

1. **运行修复脚本**：在Supabase SQL编辑器中执行 `supabase_fix_rls.sql`
2. **验证策略**：运行验证查询确认4个策略都已创建
3. **测试连接**：返回检查页面验证数据库连接
4. **数据迁移**：点击"迁移数据到Supabase"按钮

## 预期结果

修复脚本运行成功后，您应该看到4个新的英文策略：
- `enable_read_for_all` (SELECT)
- `enable_insert_for_all` (INSERT)
- `enable_update_for_all` (UPDATE)  
- `enable_delete_for_all` (DELETE)

## 故障排除

如果仍然遇到问题：

1. **检查表是否存在**：
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'poems';
   ```

2. **检查RLS状态**：
   ```sql
   SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'poems';
   ```

3. **重置整个表**（谨慎使用）：
   ```sql
   DROP TABLE IF EXISTS poems CASCADE;
   -- 然后重新运行表创建脚本
   ```

完成RLS配置后，数据迁移应该能够成功执行。