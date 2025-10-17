-- AI项目助手数据库迁移脚本
-- 为古诗词应用添加AI助手功能所需的表结构

-- 创建用户扩展表（存储用户偏好和设置）
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    knowledge_base JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建聊天会话表
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL, -- 修改为VARCHAR以支持匿名用户ID
    session_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    is_anonymous BOOLEAN DEFAULT FALSE, -- 添加匿名用户标识
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建知识库项目表
CREATE TABLE IF NOT EXISTS knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_project_id ON knowledge_items(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_category ON knowledge_items(category);

-- 设置行级安全策略 (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;

-- 用户档案策略
CREATE POLICY "用户只能访问自己的档案" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- 项目策略
CREATE POLICY "用户只能访问自己的项目" ON projects
    FOR ALL USING (auth.uid() = user_id);

-- 任务策略
CREATE POLICY "用户只能访问自己项目的任务" ON tasks
    FOR ALL USING (EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = tasks.project_id 
        AND projects.user_id = auth.uid()
    ));

-- 聊天会话策略（支持匿名用户）
CREATE POLICY "用户只能访问自己的聊天记录" ON chat_sessions
    FOR ALL USING (
        -- 认证用户：user_id等于当前用户ID
        (auth.uid()::text = user_id) 
        OR 
        -- 匿名用户：user_id以'anonymous_'开头且没有认证用户
        (user_id LIKE 'anonymous_%' AND auth.uid() IS NULL)
    );

-- 知识库项目策略
CREATE POLICY "用户只能访问自己项目的知识库" ON knowledge_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = knowledge_items.project_id 
        AND projects.user_id = auth.uid()
    ));

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表添加触发器
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_items_updated_at 
    BEFORE UPDATE ON knowledge_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据（可选）
INSERT INTO user_profiles (user_id, name, email, preferences) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', '示例用户', 'user@example.com', '{"theme": "light", "language": "zh-CN"}')
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (user_id, name, description, knowledge_base) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', '古诗词学习项目', '个人古诗词学习和鉴赏项目', '["唐诗", "宋词", "元曲"]')
ON CONFLICT DO NOTHING;

-- 注释：在实际使用时，需要将示例用户ID替换为真实的用户ID