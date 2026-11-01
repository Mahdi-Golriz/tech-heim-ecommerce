-- Shared demo account for portfolio visitors. Its credentials are public, so
-- keep its email and password fixed; otherwise one visitor could lock out the rest.
-- The account itself is created once by hand (see README → Demo account).

create or replace function public.protect_demo_user()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.email = 'demo@example.com' then
    new.email := old.email;
    new.encrypted_password := old.encrypted_password;
    new.email_change := old.email_change;
    new.email_change_token_new := old.email_change_token_new;
    new.email_change_token_current := old.email_change_token_current;
  end if;
  return new;
end;
$$;

revoke execute on function public.protect_demo_user() from public, anon, authenticated;

create trigger protect_demo_user
  before update on auth.users
  for each row execute function public.protect_demo_user();
