-- Migration: Plans, Access Control, and Reviews
-- Description: Creates plans, user_guide_access, reviews, and offline_cache_status tables with their relationships and RLS policies
-- Author: System
-- Date: 2024-03-19

-- create plans table
create table plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id),
    guide_id uuid not null references guides(id),
    name varchar(255) not null,
    content jsonb not null,
    generation_params jsonb not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    ai_generation_cost decimal(10, 6),
    is_favorite boolean default false not null,
    deleted_at timestamptz
);

-- create user_guide_access table
create table user_guide_access (
    user_id uuid not null references users(id),
    guide_id uuid not null references guides(id),
    access_type varchar(20) not null check (access_type in ('free', 'purchased', 'subscription')),
    granted_at timestamptz default now() not null,
    expires_at timestamptz,
    payment_id text,
    primary key (user_id, guide_id)
);

-- create reviews table
create table reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id),
    guide_id uuid not null references guides(id),
    rating integer not null check (rating between 1 and 5),
    comment text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    is_visible boolean default true not null,
    constraint reviews_user_guide_unique unique (user_id, guide_id) deferrable initially deferred
);

-- create offline_cache_status table
create table offline_cache_status (
    user_id uuid not null references users(id),
    plan_id uuid not null references plans(id),
    is_cached boolean default false not null,
    last_synced_at timestamptz default now() not null,
    primary key (user_id, plan_id)
);

-- create indexes
create index idx_plans_user_id on plans(user_id);
create index idx_plans_guide_id on plans(guide_id);
create index idx_plans_deleted_at on plans(deleted_at) where deleted_at is null;
create index idx_plans_content on plans using gin (content);
create index idx_plans_generation_params on plans using gin (generation_params);
create index idx_reviews_guide_id on reviews(guide_id);

-- enable row level security
alter table plans enable row level security;
alter table user_guide_access enable row level security;
alter table reviews enable row level security;
alter table offline_cache_status enable row level security;

-- plans table policies
create policy "Users can manage their own plans"
    on plans for all
    using (auth.uid() = user_id);

-- user_guide_access table policies
create policy "Users can view their own access"
    on user_guide_access for select
    using (auth.uid() = user_id);

-- reviews table policies
create policy "Users can manage their own reviews"
    on reviews for all
    using (auth.uid() = user_id);

create policy "Public can read visible reviews"
    on reviews for select
    using (is_visible = true);

-- offline_cache_status table policies
create policy "Users can manage their own cache status"
    on offline_cache_status for all
    using (auth.uid() = user_id);

-- create triggers for updated_at
create trigger update_plans_updated_at
    before update on plans
    for each row
    execute function update_updated_at_column();

create trigger update_reviews_updated_at
    before update on reviews
    for each row
    execute function update_updated_at_column(); 