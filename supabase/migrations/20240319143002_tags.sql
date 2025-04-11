-- Migration: Tags and Attraction Tags
-- Description: Creates tags and attraction_tags tables with their relationships and RLS policies
-- Author: System
-- Date: 2024-03-19

-- create tags table
create table tags (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    category varchar(50) not null check (category in ('Cultural', 'Fun_Facts', 'Historical', 'Culinary')),
    created_at timestamptz default now() not null,
    unique(name, category)
);

-- create attraction_tags junction table
create table attraction_tags (
    attraction_id uuid not null references attractions(id),
    tag_id uuid not null references tags(id),
    created_at timestamptz default now() not null,
    primary key (attraction_id, tag_id)
);

-- enable row level security
alter table tags enable row level security;
alter table attraction_tags enable row level security;

-- tags table policies
create policy "Public can read tags"
    on tags for select
    using (true);

create policy "Only authenticated users can create tags"
    on tags for insert
    with check (auth.role() = 'authenticated');

-- attraction_tags table policies
create policy "Public can read attraction tags"
    on attraction_tags for select
    using (true);

create policy "Creators can manage tags for their attractions"
    on attraction_tags for all
    using (attraction_id in (
        select id from attractions
        where creator_id in (
            select id from creators
            where user_id = auth.uid()
        )
    )); 