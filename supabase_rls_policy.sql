-- Supabase RLS策略配置
-- 在Supabase SQL编辑器中运行这些命令

-- 1. 启用RLS
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 2. 创建允许所有用户读取的策略
CREATE POLICY "允许所有人读取诗词" ON poems
  FOR SELECT USING (true);

-- 3. 创建允许所有用户插入的策略  
CREATE POLICY "允许所有人插入诗词" ON poems
  FOR INSERT WITH CHECK (true);

-- 4. 创建允许所有用户更新的策略
CREATE POLICY "允许所有人更新诗词" ON poems
  FOR UPDATE USING (true);

-- 5. 创建允许所有用户删除的策略
CREATE POLICY "允许所有人删除诗词" ON poems
  FOR DELETE USING (true);

-- 6. 检查策略是否生效
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