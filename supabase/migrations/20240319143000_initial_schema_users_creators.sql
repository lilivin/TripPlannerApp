-- Migration: Initial schema setup - Users and Creators tables
-- Description: Creates the core users and creators tables with RLS policies
-- Author: System
-- Date: 2024-03-19

-- enable required extensions
create extension if not exists "uuid-ossp";

-- create users table
create table users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    language_preference varchar(10) default 'pl' not null,
    last_login_at timestamptz,
    is_active boolean default true not null,
    avatar_url text,
    deleted_at timestamptz
);

-- create creators table
create table creators (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id),
    display_name varchar(100) not null,
    biography text,
    profile_image_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    is_verified boolean default false not null,
    contact_email varchar(255),
    website text,
    deleted_at timestamptz,
    constraint creators_user_id_unique unique (user_id) deferrable initially deferred
);

-- create indexes
create index idx_users_email on users(email);
create index idx_users_deleted_at on users(deleted_at) where deleted_at is null;
create index idx_creators_deleted_at on creators(deleted_at) where deleted_at is null;

-- enable row level security
alter table users enable row level security;
alter table creators enable row level security;

-- users table policies
create policy "Users can read their own data"
    on users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on users for update
    using (auth.uid() = id);

-- creators table policies
create policy "Creators can read their own data"
    on creators for select
    using (auth.uid() = user_id);

create policy "Creators can update their own data"
    on creators for update
    using (auth.uid() = user_id);

create policy "Public can read creator profiles"
    on creators for select
    using (true);

-- create triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

create trigger update_creators_updated_at
    before update on creators
    for each row
    execute function update_updated_at_column(); 