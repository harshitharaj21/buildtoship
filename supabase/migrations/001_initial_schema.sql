-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Initial schema for Full-Stack To-Do List Application
-- Features: Tasks table, updated_at trigger, indexes, and Row Level Security (RLS)
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT task_title_not_empty CHECK (char_length(trim(title)) > 0)
);

-- 3. Create Indexes for High-Performance Querying & Filtering
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks (user_id, completed);

-- 4. Create Trigger Function for Automatic updated_at Timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger to Tasks Table
DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies for Strict User-Level Data Isolation
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks"
    ON public.tasks
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks"
    ON public.tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks"
    ON public.tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks"
    ON public.tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. Seed Data Helper (Optional / Demonstrative)
-- ==============================================================================
-- Note: Tasks require a valid auth.users entry. 
-- In Supabase, users are created through Supabase Auth (Sign Up).
-- The function below safely inserts initial sample tasks for any newly registered user.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.seed_default_user_tasks()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.tasks (user_id, title, completed)
    VALUES 
        (NEW.id, 'Welcome to your To-Do App! 👋', false),
        (NEW.id, 'Explore marking tasks as complete', true),
        (NEW.id, 'Create your first custom task', false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to seed tasks automatically when a new user signs up via Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created_seed_tasks ON auth.users;
CREATE TRIGGER on_auth_user_created_seed_tasks
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.seed_default_user_tasks();
