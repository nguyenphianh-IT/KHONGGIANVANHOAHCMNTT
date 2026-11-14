-- ==============================================================================
-- 007_domain_tables.sql
-- MỤC ĐÍCH: Bảng lưu trữ chi tiết nghiệp vụ (Timeline, Resources, Activities, Categories)
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. BẢNG CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('resource', 'post', 'activity')),
    sort_order INT NOT NULL DEFAULT 0
);

-- 2. BẢNG TIMELINE EVENTS (Chi tiết các mốc lịch sử)
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    year VARCHAR(20),
    exact_date VARCHAR(50),
    category VARCHAR(50) NOT NULL CHECK (category IN ('tuoi-tre', 'cuu-nuoc', 'lanh-dao', 'di-chuc')),
    location VARCHAR(255),
    is_memorial BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_timeline_events_sort ON public.timeline_events(sort_order);

-- 3. BẢNG RESOURCES (Kho tư liệu số hóa)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id),
    category_type VARCHAR(30) NOT NULL CHECK (category_type IN ('article', 'book', 'image', 'video')),
    author_or_source VARCHAR(255) NOT NULL,
    date_or_era VARCHAR(100),
    badge_text VARCHAR(100),
    is_mock_data BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_type);

-- 4. BẢNG ACTIVITIES (Hoạt động văn hóa học đường)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    academic_year VARCHAR(50) NOT NULL,
    activity_date DATE,
    organizer VARCHAR(255) NOT NULL,
    participants VARCHAR(255),
    is_sample_data BOOLEAN NOT NULL DEFAULT false,
    highlights TEXT[] NOT NULL DEFAULT '{}'
);
