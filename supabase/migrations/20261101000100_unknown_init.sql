-- UNKNOWN initial schema. All access is server-mediated.
-- Public browser roles receive no direct table privileges.
create extension if not exists pgcrypto;

create table if not exists public.posts (
 id uuid primary key default gen_random_uuid(),
 title text null check (title is null or char_length(title)<=100),
 body text not null check (char_length(body) between 8 and 5000),
 category text not null, language text not null check(language in ('ar','en')),
 status text not null default 'pending_review' check(status in ('pending_review','published','rejected','removed')),
 deletion_token_hash text not null, terms_version text not null, privacy_version text not null,
 disclaimer_version text not null, content_policy_version text not null,
 created_at timestamptz not null default now(), published_at timestamptz null
);
create index if not exists posts_public_feed_idx on public.posts(published_at desc) where status='published';
create index if not exists posts_category_feed_idx on public.posts(category,published_at desc) where status='published';

create table if not exists public.comments (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade,
 body text not null check(char_length(body) between 2 and 1500),
 language text not null check(language in ('ar','en')),
 status text not null default 'pending_review' check(status in ('pending_review','published','rejected','removed')),
 deletion_token_hash text not null, created_at timestamptz not null default now()
);
create index if not exists comments_public_feed_idx on public.comments(post_id,created_at) where status='published';

create table if not exists public.reactions (
 id bigint generated always as identity primary key,
 post_id uuid not null references public.posts(id) on delete cascade,
 visitor_hash text not null check(char_length(visitor_hash)=64),
 reaction_type text not null check(reaction_type in ('care','not-alone','wish-well')),
 created_at timestamptz not null default now(),
 unique(post_id,visitor_hash,reaction_type)
);

create table if not exists public.reports (
 id bigint generated always as identity primary key, reference uuid not null unique,
 target_type text not null check(target_type in ('post','comment')), target_id uuid not null,
 reason text not null check(reason in ('bullying','threat','personal_data','defamation','hate','child_safety','illegal','other')),
 details text null check(details is null or char_length(details)<=1000),
 status text not null default 'open' check(status in ('open','in_review','actioned','dismissed')),
 created_at timestamptz not null default now(), resolved_at timestamptz null
);
create index if not exists reports_open_idx on public.reports(created_at) where status='open';

create table if not exists public.moderation_events (
 id bigint generated always as identity primary key, target_type text not null check(target_type in ('post','comment')),
 target_id uuid not null, rule_code text not null, outcome text not null,
 engine text not null, created_at timestamptz not null default now()
);

create table if not exists public.legal_acceptances (
 id bigint generated always as identity primary key,
 post_id uuid null references public.posts(id) on delete cascade,
 comment_id uuid null references public.comments(id) on delete cascade,
 terms_version text not null, privacy_version text not null, disclaimer_version text not null,
 age_declaration boolean not null default false, locale text not null check(locale in ('ar','en')),
 accepted_at timestamptz not null default now(),
 constraint one_acceptance_target check((post_id is not null) <> (comment_id is not null))
);

create table if not exists public.legal_jurisdictions (
 code text primary key, display_name text not null,
 status text not null default 'restricted' check(status in ('enabled','restricted','under_review','research')),
 reviewed_at timestamptz null, review_due_at timestamptz null,
 reviewer_reference text null,
 public_note text not null default 'Publishing is not enabled pending jurisdiction review.'
);
create table if not exists public.legal_sources (
 id bigint generated always as identity primary key,
 jurisdiction_code text not null references public.legal_jurisdictions(code) on delete cascade,
 title text not null, official_url text not null,
 instrument_status text not null check(instrument_status in ('in_force','draft','amended','repealed','guidance','treaty')),
 effective_date date null, checked_at timestamptz not null default now(), language text not null default 'en', notes text null
);
create table if not exists public.legal_documents (
 id bigint generated always as identity primary key,
 jurisdiction_code text null references public.legal_jurisdictions(code) on delete cascade,
 document_key text not null, locale text not null check(locale in ('ar','en')),
 version text not null, status text not null check(status in ('draft','legal_review','approved','superseded')),
 body_markdown text not null, effective_at timestamptz null, reviewed_at timestamptz null,
 created_at timestamptz not null default now(), unique(jurisdiction_code,document_key,locale,version)
);

do $$
declare tbl text;
begin
 foreach tbl in array array['posts','comments','reactions','reports','moderation_events','legal_acceptances','legal_jurisdictions','legal_sources','legal_documents'] loop
   execute format('alter table public.%I enable row level security',tbl);
   execute format('revoke all on table public.%I from anon, authenticated',tbl);
   execute format('grant all on table public.%I to service_role',tbl);
 end loop;
end $$;
grant usage,select on all sequences in schema public to service_role;
revoke all on all sequences in schema public from anon,authenticated;

comment on table public.posts is 'Posts are read and written only through server routes; author identity and raw IP are intentionally absent.';
comment on table public.reports is 'Restricted safety reports with no public SELECT or Data API access.';
comment on table public.moderation_events is 'Rule/outcome metadata only; never store submitted raw text here.';
