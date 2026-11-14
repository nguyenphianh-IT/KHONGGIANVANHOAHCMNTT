-- ==============================================================================
-- 005_content_workflow_schema.sql
-- MỤC ĐÍCH: Bảng quản lý nội dung, phiên bản (Revisions), Soft Delete & toàn vẹn tham chiếu
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. BẢNG CONTENT ITEMS
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('timeline_event', 'resource', 'activity', 'post', 'quiz')),
    slug VARCHAR(255) UNIQUE NOT NULL,
    published_revision_id UUID,
    latest_draft_revision_id UUID,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_items_slug ON public.content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_deleted ON public.content_items(is_deleted);

-- 2. BẢNG CONTENT REVISIONS
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1 CHECK (version_number > 0),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'rejected', 'archived')),
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    submitted_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    review_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_revision_item UNIQUE (id, item_id),
    CONSTRAINT uq_item_version UNIQUE (item_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_status ON public.content_revisions(status);
CREATE INDEX IF NOT EXISTS idx_content_revisions_author ON public.content_revisions(author_id);
CREATE INDEX IF NOT EXISTS idx_content_revisions_item_status ON public.content_revisions(item_id, status);

-- 3. KHÓA NGOẠI KÉP VỚI ON DELETE RESTRICT CHO PUBLISHED REVISION
-- Không cho phép xóa revision đang được xuất bản
ALTER TABLE public.content_items 
DROP CONSTRAINT IF EXISTS fk_item_published_revision;

ALTER TABLE public.content_items 
ADD CONSTRAINT fk_item_published_revision 
FOREIGN KEY (published_revision_id, id) 
REFERENCES public.content_revisions(id, item_id) 
ON DELETE RESTRICT;

-- 4. KHÓA NGOẠI ĐƠN VỚI ON DELETE SET NULL CHO LATEST DRAFT REVISION
-- Chỉ gán NULL cho latest_draft_revision_id, bảo vệ tuyệt đối cột khóa chính id
ALTER TABLE public.content_items 
DROP CONSTRAINT IF EXISTS fk_item_latest_draft_revision;

ALTER TABLE public.content_items 
ADD CONSTRAINT fk_item_latest_draft_revision 
FOREIGN KEY (latest_draft_revision_id) 
REFERENCES public.content_revisions(id) 
ON DELETE SET NULL;

-- Trigger kiểm tra latest_draft_revision_id thuộc về content_item
CREATE OR REPLACE FUNCTION public.check_draft_revision_ownership()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NEW.latest_draft_revision_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.content_revisions 
            WHERE id = NEW.latest_draft_revision_id AND item_id = NEW.id
        ) THEN
            RAISE EXCEPTION 'latest_draft_revision_id (%) không thuộc về content_item (%)', 
                NEW.latest_draft_revision_id, NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_draft_revision_ownership ON public.content_items;
CREATE TRIGGER trg_check_draft_revision_ownership
BEFORE INSERT OR UPDATE OF latest_draft_revision_id ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.check_draft_revision_ownership();

-- 5. TRIGGER CHẶN XÓA CỨNG CONTENT ITEM ĐANG CÓ BẢN XUẤT BẢN
CREATE OR REPLACE FUNCTION public.prevent_delete_published_item()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF OLD.published_revision_id IS NOT NULL THEN
        RAISE EXCEPTION 'Không thể xóa mục nội dung đang có bản xuất bản trực tiếp. Vui lòng gỡ xuất bản (Unpublish) hoặc chuyển sang lưu trữ (Archive).';
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_delete_published_item ON public.content_items;
CREATE TRIGGER trg_prevent_delete_published_item
BEFORE DELETE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.prevent_delete_published_item();

-- 6. BẢNG APPROVAL EVENTS
CREATE TABLE IF NOT EXISTS public.approval_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID NOT NULL REFERENCES public.content_revisions(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    action VARCHAR(30) NOT NULL CHECK (action IN ('submit', 'request_changes', 'reject', 'approve', 'publish', 'unpublish')),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approval_events_revision ON public.approval_events(revision_id);
