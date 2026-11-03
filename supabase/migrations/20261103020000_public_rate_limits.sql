-- Shared atomic public API rate limiting for the existing UNKNOWN schema.
-- Safe to apply after review in a disposable staging project; not auto-applied.
create table if not exists public.public_rate_limits (
  subject_hash text primary key check (subject_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists public_rate_limits_updated_idx
  on public.public_rate_limits(updated_at);

alter table public.public_rate_limits enable row level security;
revoke all on table public.public_rate_limits from public, anon, authenticated;
grant all on table public.public_rate_limits to service_role;

create or replace function public.unknown_consume_public_rate_limit(
  p_subject_hash text,
  p_limit integer,
  p_window_seconds integer
) returns table(allowed boolean, retry_after timestamptz)
language plpgsql
security invoker
set search_path = public
as $function$
declare
  rate_row public.public_rate_limits%rowtype;
  window_end timestamptz;
begin
  if p_subject_hash is null or p_subject_hash !~ '^[0-9a-f]{64}$'
    or p_limit is null or p_limit < 1 or p_limit > 10000
    or p_window_seconds is null or p_window_seconds < 1 or p_window_seconds > 604800 then
    raise exception 'Invalid public rate-limit parameters';
  end if;

  insert into public.public_rate_limits(subject_hash, window_started_at, request_count, updated_at)
    values (p_subject_hash, now(), 0, now())
    on conflict (subject_hash) do nothing;

  select * into rate_row
    from public.public_rate_limits
    where subject_hash = p_subject_hash
    for update;

  if rate_row.window_started_at <= now() - make_interval(secs => p_window_seconds) then
    update public.public_rate_limits
      set window_started_at = now(), request_count = 1, updated_at = now()
      where subject_hash = p_subject_hash;
    return query select true, null::timestamptz;
    return;
  end if;

  if rate_row.request_count >= p_limit then
    window_end := rate_row.window_started_at + make_interval(secs => p_window_seconds);
    return query select false, window_end;
    return;
  end if;

  update public.public_rate_limits
    set request_count = request_count + 1, updated_at = now()
    where subject_hash = p_subject_hash;
  return query select true, null::timestamptz;
end;
$function$;

revoke all on function public.unknown_consume_public_rate_limit(text,integer,integer)
  from public, anon, authenticated;
grant execute on function public.unknown_consume_public_rate_limit(text,integer,integer)
  to service_role;

comment on table public.public_rate_limits is
  'Atomic shared API rate-limit counters keyed by server-side HMAC; raw client addresses are never stored.';
