-- SideQuest Database Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard → SQL Editor)

-- Ideas table
create table ideas (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  one_liner text not null,
  description text not null,
  category text not null,
  difficulty text not null,
  viral_potential integer not null check (viral_potential between 1 and 5),
  pain_point text not null,
  target_audience text not null,
  monetization text not null,
  source_urls text[] not null default '{}',
  source_platform text not null,
  upvotes integer not null default 0,
  scan_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Daily scans log
create table daily_scans (
  id uuid default gen_random_uuid() primary key,
  scan_date date not null unique default current_date,
  ideas_count integer not null default 0,
  sources_scraped integer not null default 0,
  posts_analyzed integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_ideas_scan_date on ideas(scan_date desc);
create index idx_ideas_category on ideas(category);

-- Row Level Security
alter table ideas enable row level security;
alter table daily_scans enable row level security;

-- Ideas: anyone can read, only service role can insert/update
create policy "Ideas are publicly readable" on ideas for select using (true);

-- Daily scans: anyone can read
create policy "Scans are publicly readable" on daily_scans for select using (true);
