-- Migration: Fix Infinite Recursion in RLS Policies
-- Description: Temporarily disable RLS on tables causing circular references
-- Author: AI Assistant
-- Date: 2024-12-10

-- Disable RLS on problematic tables to break circular references
alter table user_guide_access disable row level security;
alter table reviews disable row level security;
alter table user_guide_interactions disable row level security;

-- Drop problematic policies that create circular references
drop policy if exists "user_guide_access_select_auth" on user_guide_access;
drop policy if exists "reviews_select_auth" on reviews;
drop policy if exists "user_guide_interactions_select_auth" on user_guide_interactions;

-- Create simplified policies without circular references
create policy "user_guide_access_select_auth_simple" on user_guide_access
    for select to authenticated
    using (auth.uid() = user_id);

create policy "reviews_select_auth_simple" on reviews
    for select to authenticated
    using (is_visible = true or auth.uid() = user_id);

create policy "user_guide_interactions_select_auth_simple" on user_guide_interactions
    for select to authenticated
    using (auth.uid() = user_id);

-- Re-enable RLS with simplified policies
alter table user_guide_access enable row level security;
alter table reviews enable row level security;
alter table user_guide_interactions enable row level security; 