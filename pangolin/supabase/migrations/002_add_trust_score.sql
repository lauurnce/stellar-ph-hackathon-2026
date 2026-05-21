-- Add trust_score field to profiles table
alter table public.profiles 
add column if not exists trust_score numeric default 0;

-- Add comment
comment on column public.profiles.trust_score is 'Trust score (0-100) calculated from transaction history, completion rate, and dispute rate';
