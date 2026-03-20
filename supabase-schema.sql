-- ShipScanner Database Schema
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

-- Email subscribers
create table email_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Saved ideas (user bookmarks)
create table saved_ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid not null references ideas(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, idea_id)
);

-- Upvote tracking (one per user per idea)
create table idea_upvotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid not null references ideas(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, idea_id)
);

-- Indexes
create index idx_ideas_scan_date on ideas(scan_date desc);
create index idx_ideas_category on ideas(category);
create index idx_saved_ideas_user on saved_ideas(user_id);
create index idx_email_subscribers_active on email_subscribers(is_active) where is_active = true;

-- Row Level Security
alter table ideas enable row level security;
alter table daily_scans enable row level security;
alter table email_subscribers enable row level security;
alter table saved_ideas enable row level security;
alter table idea_upvotes enable row level security;

-- Ideas: anyone can read, only service role can insert/update
create policy "Ideas are publicly readable" on ideas for select using (true);

-- Daily scans: anyone can read
create policy "Scans are publicly readable" on daily_scans for select using (true);

-- Email subscribers: service role only (handled by API route)
create policy "Subscribers managed by service role" on email_subscribers for all using (false);

-- Saved ideas: users can manage their own
create policy "Users can view own saved ideas" on saved_ideas for select using (auth.uid() = user_id);
create policy "Users can save ideas" on saved_ideas for insert with check (auth.uid() = user_id);
create policy "Users can unsave ideas" on saved_ideas for delete using (auth.uid() = user_id);

-- Upvotes: users can manage their own
create policy "Users can view own upvotes" on idea_upvotes for select using (auth.uid() = user_id);
create policy "Users can upvote" on idea_upvotes for insert with check (auth.uid() = user_id);
create policy "Users can remove upvote" on idea_upvotes for delete using (auth.uid() = user_id);
