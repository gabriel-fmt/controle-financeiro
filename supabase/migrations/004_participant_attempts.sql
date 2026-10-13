alter table public.quiz_results
  add column if not exists participant_key text,
  add column if not exists device_key uuid,
  add column if not exists attempt_number integer;

update public.quiz_results
set participant_key = lower(regexp_replace(trim(participant_first_name || ' ' || participant_last_name), '[[:space:]]+', ' ', 'g'))
where participant_key is null;

update public.quiz_results
set device_key = session_id
where device_key is null;

with numbered as (
  select id, row_number() over (partition by participant_key order by completed_at, id)::integer as number
  from public.quiz_results
)
update public.quiz_results as result
set attempt_number = numbered.number
from numbered
where result.id = numbered.id and result.attempt_number is null;

alter table public.quiz_results
  alter column participant_key set not null,
  alter column device_key set not null,
  alter column attempt_number set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'quiz_results_attempt_number_check') then
    alter table public.quiz_results add constraint quiz_results_attempt_number_check check (attempt_number > 0);
  end if;
end $$;

create unique index if not exists quiz_results_participant_attempt_idx
on public.quiz_results (participant_key, attempt_number);

create index if not exists quiz_results_device_key_idx
on public.quiz_results (device_key);

create or replace function public.assign_quiz_attempt_number()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.participant_key is null or trim(new.participant_key) = '' then
    new.participant_key := lower(regexp_replace(trim(new.participant_first_name || ' ' || new.participant_last_name), '[[:space:]]+', ' ', 'g'));
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.participant_key, 0));
  select coalesce(max(attempt_number), 0) + 1
  into new.attempt_number
  from public.quiz_results
  where participant_key = new.participant_key;

  return new;
end;
$$;

drop trigger if exists set_quiz_attempt_number on public.quiz_results;
create trigger set_quiz_attempt_number
before insert on public.quiz_results
for each row execute function public.assign_quiz_attempt_number();
