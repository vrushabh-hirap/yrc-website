-- ==========================================================================
-- Young's Research Conference (YRC 2026) - Supabase PostgreSQL Database Schema
-- Run this complete script in the Supabase SQL Editor (https://supabase.com/dashboard/project/dyrcmjadhirysbhrfnmn/sql)
-- ==========================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    phone VARCHAR(50),
    prn VARCHAR(50),
    department VARCHAR(100) DEFAULT 'AIML',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(255) UNIQUE NOT NULL,
    track VARCHAR(255) NOT NULL CHECK (track IN (
        'AI & Machine Learning',
        'Data Science & Analytics',
        'IoT & Embedded Systems',
        'Cybersecurity & Blockchain'
    )),
    division VARCHAR(10) NOT NULL CHECK (division IN ('A', 'B')),
    group_code VARCHAR(50) UNIQUE NOT NULL,
    academic_year VARCHAR(50) DEFAULT '2025-26',
    leader_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

-- 4. PAPERS TABLE
CREATE TABLE IF NOT EXISTS public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    track VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'rejected', 'approved')),
    rejection_reason TEXT,
    version INT DEFAULT 1,
    publication_status VARCHAR(50) DEFAULT 'not_published' CHECK (publication_status IN ('not_published', 'preparing', 'published')),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_teams_group_code ON public.teams(group_code);
CREATE INDEX IF NOT EXISTS idx_teams_mentor ON public.teams(mentor_id);
CREATE INDEX IF NOT EXISTS idx_teams_track ON public.teams(track);
CREATE INDEX IF NOT EXISTS idx_papers_team ON public.papers(team_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_paper ON public.feedbacks(paper_id);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- SERVICE ROLE POLICIES (Full Access for Next.js API Routes)
DROP POLICY IF EXISTS "Service Role Full Access Users" ON public.users;
CREATE POLICY "Service Role Full Access Users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Teams" ON public.teams;
CREATE POLICY "Service Role Full Access Teams" ON public.teams FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Team Members" ON public.team_members;
CREATE POLICY "Service Role Full Access Team Members" ON public.team_members FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Papers" ON public.papers;
CREATE POLICY "Service Role Full Access Papers" ON public.papers FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Feedbacks" ON public.feedbacks;
CREATE POLICY "Service Role Full Access Feedbacks" ON public.feedbacks FOR ALL USING (true);

-- SUPABASE STORAGE BUCKET CREATION FOR RESEARCH PAPERS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('yrc-papers', 'yrc-papers', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public Read Access for Papers" ON storage.objects;
CREATE POLICY "Public Read Access for Papers" ON storage.objects FOR SELECT USING (bucket_id = 'yrc-papers');

DROP POLICY IF EXISTS "Public Upload Access for Papers" ON storage.objects;
CREATE POLICY "Public Upload Access for Papers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'yrc-papers');

DROP POLICY IF EXISTS "Public Update Access for Papers" ON storage.objects;
CREATE POLICY "Public Update Access for Papers" ON storage.objects FOR UPDATE USING (bucket_id = 'yrc-papers');

-- SEED DEFAULT ADMIN USER
-- Password: AdminPassword123! (bcrypt hashed)
INSERT INTO public.users (name, email, password, role, department)
VALUES (
    'YRC Admin',
    'admin@pccoepune.org',
    '$2a$10$eE0mQoQ7zD1a2Ww.E7N1vO.R4dD4yX4z4K4L4M4N4O4P4Q4R4S4T4',
    'admin',
    'AIML'
)
ON CONFLICT (email) DO NOTHING;
