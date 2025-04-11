-- Migration: Guides and Attractions tables
-- Description: Creates guides and attractions tables with their relationships and RLS policies
-- Author: System
-- Date: 2024-03-19

-- enable required postgis extension for geographical data
create extension if not exists postgis;

-- create guides table
create table guides (
    id uuid primary key default gen_random_uuid(),
    creator_id uuid not null references creators(id),
    title varchar(255) not null,
    description text not null,
    language varchar(10) default 'pl' not null,
    price decimal(10, 2) default 0.00 not null,
    is_published boolean default false not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    version integer default 1 not null,
    cover_image_url text,
    location_name varchar(255) not null,
    recommended_days integer default 1 not null,
    deleted_at timestamptz
);

-- create attractions table
create table attractions (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    description text not null,
    address text not null,
    geolocation geography(point) not null,
    opening_hours jsonb,
    contact_info jsonb,
    images jsonb default '[]'::jsonb not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    creator_id uuid not null references creators(id),
    average_visit_time_minutes integer,
    ticket_price_info text,
    accessibility_info text,
    deleted_at timestamptz
);

-- create guide_attractions junction table
create table guide_attractions (
    guide_id uuid not null references guides(id),
    attraction_id uuid not null references attractions(id),
    order_index integer not null,
    custom_description text,
    is_highlight boolean default false not null,
    created_at timestamptz default now() not null,
    primary key (guide_id, attraction_id)
);

-- create indexes
create index idx_guides_creator_id on guides(creator_id);
create index idx_guides_is_published on guides(is_published) where is_published = true;
create index idx_guides_language on guides(language);
create index idx_guides_deleted_at on guides(deleted_at) where deleted_at is null;

create index idx_attractions_creator_id on attractions(creator_id);
create index idx_attractions_deleted_at on attractions(deleted_at) where deleted_at is null;
create index idx_attractions_geolocation on attractions using gist (geolocation);
create index idx_attractions_opening_hours on attractions using gin (opening_hours);
create index idx_attractions_contact_info on attractions using gin (contact_info);
create index idx_attractions_images on attractions using gin (images);

-- enable row level security
alter table guides enable row level security;
alter table attractions enable row level security;
alter table guide_attractions enable row level security;

-- guides table policies
create policy "Creators can manage their own guides"
    on guides for all
    using (auth.uid() in (
        select user_id from creators where id = creator_id
    ));

create policy "Public can read published guides"
    on guides for select
    using (is_published = true and deleted_at is null);

-- attractions table policies
create policy "Creators can manage their own attractions"
    on attractions for all
    using (auth.uid() in (
        select user_id from creators where id = creator_id
    ));

create policy "Public can read attractions in published guides"
    on attractions for select
    using (id in (
        select attraction_id from guide_attractions
        where guide_id in (
            select id from guides 
            where is_published = true 
            and deleted_at is null
        )
    ));

-- guide_attractions table policies
create policy "Creators can manage guide attractions for their guides"
    on guide_attractions for all
    using (guide_id in (
        select id from guides
        where creator_id in (
            select id from creators
            where user_id = auth.uid()
        )
    ));

create policy "Public can read guide attractions for published guides"
    on guide_attractions for select
    using (guide_id in (
        select id from guides
        where is_published = true
        and deleted_at is null
    ));

-- create triggers for updated_at
create trigger update_guides_updated_at
    before update on guides
    for each row
    execute function update_updated_at_column();

create trigger update_attractions_updated_at
    before update on attractions
    for each row
    execute function update_updated_at_column(); 