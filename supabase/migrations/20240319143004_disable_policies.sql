-- Migration: Disable all policies
-- Description: Drops all RLS policies from previous migrations
-- Author: System
-- Date: 2024-03-19

-- Drop users table policies
drop policy if exists "Users can read their own data" on users;
drop policy if exists "Users can update their own data" on users;

-- Drop creators table policies
drop policy if exists "Creators can read their own data" on creators;
drop policy if exists "Creators can update their own data" on creators;
drop policy if exists "Public can read creator profiles" on creators;

-- Drop guides table policies
drop policy if exists "Creators can manage their own guides" on guides;
drop policy if exists "Public can read published guides" on guides;

-- Drop attractions table policies
drop policy if exists "Creators can manage their own attractions" on attractions;
drop policy if exists "Public can read attractions in published guides" on attractions;

-- Drop guide_attractions table policies
drop policy if exists "Creators can manage guide attractions for their guides" on guide_attractions;
drop policy if exists "Public can read guide attractions for published guides" on guide_attractions;

-- Drop tags table policies
drop policy if exists "Public can read tags" on tags;
drop policy if exists "Only authenticated users can create tags" on tags;

-- Drop attraction_tags table policies
drop policy if exists "Public can read attraction tags" on attraction_tags;
drop policy if exists "Creators can manage tags for their attractions" on attraction_tags;

-- Drop plans table policies
drop policy if exists "Users can manage their own plans" on plans;

-- Drop user_guide_access table policies
drop policy if exists "Users can view their own access" on user_guide_access;

-- Drop reviews table policies
drop policy if exists "Users can manage their own reviews" on reviews;
drop policy if exists "Public can read visible reviews" on reviews;

-- Drop offline_cache_status table policies
drop policy if exists "Users can manage their own cache status" on offline_cache_status;

-- Disable RLS on all tables
alter table users disable row level security;
alter table creators disable row level security;
alter table guides disable row level security;
alter table attractions disable row level security;
alter table guide_attractions disable row level security;
alter table tags disable row level security;
alter table attraction_tags disable row level security;
alter table plans disable row level security;
alter table user_guide_access disable row level security;
alter table reviews disable row level security;
alter table offline_cache_status disable row level security; 