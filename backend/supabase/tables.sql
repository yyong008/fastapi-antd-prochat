-- =============================================================================
-- FastAPI ProChat — Supabase / PostgreSQL 表初始化
-- 与 backend/backend/dals/chat.py, knownledge_dal.py, file_dal.py 中的表名一致
-- 在 Supabase：SQL Editor 中执行本文件，或作为迁移脚本使用
-- =============================================================================

-- 本地/云端通用扩展（gen_random_uuid 等；部分实例已默认启用）
-- -----------------------------------------------------------------------------
-- chat_test：多轮对话存储（chat_stream / chat_db 写入 id、title、chat）
-- id 为字符串 UUID，与前端路由 /chat/:id 一致
-- -----------------------------------------------------------------------------
create table if not exists public.chat_test (
  id text primary key,
  title text not null default 'New Chat',
  chat text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.chat_test is '会话记录；get_all_items 按 created_at 降序';

create index if not exists idx_chat_test_created_at on public.chat_test (created_at desc);

-- -----------------------------------------------------------------------------
-- knowledge：知识库（KnowledgeService 写入 id、name、description；data 存 file_ids 等）
-- -----------------------------------------------------------------------------
create table if not exists public.knowledge (
  id text primary key,
  name text not null,
  description text,
  data jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.knowledge.data is '如 {"file_ids": ["uuid", ...]}';

create index if not exists idx_knowledge_created_at on public.knowledge (created_at desc);

-- -----------------------------------------------------------------------------
-- file：上传文件元数据与抽取正文（upload/file.py 写入；入库前会去掉 hash 字段）
-- -----------------------------------------------------------------------------
create table if not exists public.file (
  id text primary key,
  filename text not null,
  data jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.file.data is '如 {"content": "全文..."}';
comment on column public.file.meta is '如 collection_name、content_type、name、size';

create index if not exists idx_file_created_at on public.file (created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at：更新时自动刷新（可选）
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_chat_test_updated_at on public.chat_test;
create trigger trg_chat_test_updated_at
  before update on public.chat_test
  for each row
  execute procedure public.handle_updated_at();

drop trigger if exists trg_knowledge_updated_at on public.knowledge;
create trigger trg_knowledge_updated_at
  before update on public.knowledge
  for each row
  execute procedure public.handle_updated_at();

drop trigger if exists trg_file_updated_at on public.file;
create trigger trg_file_updated_at
  before update on public.file
  for each row
  execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security（按需开启）
-- 服务端使用 SUPABASE_KEY（service_role）时可绕过 RLS；前端/anon 访问请在控制台自行加策略
-- -----------------------------------------------------------------------------
-- alter table public.chat_test enable row level security;
-- alter table public.knowledge enable row level security;
-- alter table public.file enable row level security;
