-- Emergency helplines (managed from admin panel, displayed on homepage + footer)
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

-- Seed with the current hardcoded values
insert into helplines (label, number, description, icon, sort_order) values
  ('National Helpline', '1800-123-HELP (4357)', '24×7 Free Legal & Emergency Aid', '✦', 1),
  ('Women Protection', '+91 99999-11111', 'Immediate assistance for women in distress', '◈', 2),
  ('Cultural Rights', '+91 99999-22222', 'Report temple desecration & hate crimes', '◇', 3),
  ('Disaster Relief', '+91 99999-33333', 'Flood, earthquake & calamity response', '▣', 4);

alter table helplines enable row level security;
