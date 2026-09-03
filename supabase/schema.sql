-- ============================================================
-- RHRS Website — Supabase schema
-- Run this in the Supabase SQL Editor for your project.
-- ============================================================

-- Auto-incrementing official numbers (member id / appointment / receipt)
create table if not exists sequences (
  name text primary key,
  value integer not null default 0
);

create or replace function next_sequence(p_name text)
returns integer
language plpgsql
security definer
as $$
declare
  v_val integer;
begin
  insert into sequences (name, value) values (p_name, 1)
  on conflict (name) do update set value = sequences.value + 1
  returning value into v_val;
  return v_val;
end;
$$;

-- Members (ID Card)
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  member_id text unique not null,
  full_name text not null,
  address text not null,
  blood_group text not null,
  emergency_contact text not null,
  designation_level text,
  designation_title text,
  designation_state text,
  designation_number text,
  created_at timestamptz not null default now(),
  check (
    designation_level in ('national', 'zonal', 'state', 'district', 'constituency', 'mandal', 'mahila_morcha', 'yuva_morcha')
    or designation_level is null
  )
);

-- Appointments (Appointment Letter)
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_no text unique not null,
  full_name text not null,
  designation text not null,
  from_date date not null,
  duration text not null,
  created_at timestamptz not null default now()
);

-- Donation payments (Payment Slip)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  receipt_no text unique not null,
  donor_name text not null,
  donation_type text not null,
  amount numeric not null,
  payment_mode text not null,
  txn_ref text not null,
  created_at timestamptz not null default now()
);

-- Parikshan registrations
create table if not exists parikshan_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  level text not null,
  city_state text not null,
  created_at timestamptz not null default now()
);

-- Admin credentials (DB fallback when env vars are not set / differ)
create table if not exists admin_config (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  password text not null,
  created_at timestamptz not null default now()
);

-- Gallery photos (managed from admin panel)
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text default '',
  category text not null default 'events' check (category in ('events', 'issues')),
  image_url text not null,
  sort_order integer,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Emergency helplines (managed from admin panel)
create table if not exists helplines (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  number text not null,
  description text default '',
  icon text default '✦',
  sort_order integer,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Storage bucket for gallery images (public read)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Restrict direct access to tables (app talks through serverless API,
-- which uses the service-role key and bypasses RLS).
alter table members enable row level security;
alter table appointments enable row level security;
alter table payments enable row level security;
alter table parikshan_registrations enable row level security;
alter table gallery_photos enable row level security;
alter table helplines enable row level security;
alter table sequences enable row level security;
alter table admin_config enable row level security;
