-- Rolling Context Cache state for Gemini Explicit Context Caching.
-- One row per chat session; holds the active cache name + the index of the
-- last history turn baked into it.

create table if not exists public.gemini_context_caches (
  session_id          text primary key,
  tenant_id           text,
  cached_content_name text,                       -- e.g. 'cachedContents/12345'
  cached_turn_count   integer not null default 0, -- # of sanitised history msgs in the cache
  model               text,                       -- model the cache was built for
  expires_at          timestamptz,                -- cache TTL expiry
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_gemini_caches_tenant  on public.gemini_context_caches (tenant_id);
create index if not exists idx_gemini_caches_expires on public.gemini_context_caches (expires_at);

-- This table is written only by the trusted server route (service-role key),
-- never by browser clients, so RLS stays enabled with no public policy.
alter table public.gemini_context_caches enable row level security;
