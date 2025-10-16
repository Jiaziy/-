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

-- 4. 验证策略创建
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'poems'
ORDER BY cmd;