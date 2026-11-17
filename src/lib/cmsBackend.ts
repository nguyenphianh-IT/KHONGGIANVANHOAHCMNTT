// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// MODULE: CMS CLOUD DATABASE BACKEND SERVICE (MULTI-DEVICE SYNCHRONIZATION)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { getSupabaseAdmin } from './supabaseBackend';
import type { ArticleData } from './cmsStore';

const SYSTEM_AUTHOR_ID = 'c4821ce7-7c41-45d2-bb9d-ebf7b2228004';
const RESERVED_CONTEST_ID = 'a0000000-0000-0000-0000-000000000001';
const RESERVED_RESOURCES_ID = 'a0000000-0000-0000-0000-000000000002';

/**
 * Deterministically maps arbitrary IDs (like 'art-001', 'art-179488...') to valid RFC 4122 UUIDs.
 */
export function toValidUuid(id: string): string {
  if (!id) return 'f' + '0'.repeat(31);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id.toLowerCase();

  const legacyMap: Record<string, string> = {
    'art-001': 'd0000000-0000-0000-0000-000000000001',
    'art-002': 'c0000000-0000-0000-0000-000000000002',
    'art-003': 'c0000000-0000-0000-0000-000000000003',
    'art-004': 'c0000000-0000-0000-0000-000000000004',
    'art-005': 'c0000000-0000-0000-0000-000000000005',
  };
  if (legacyMap[id]) return legacyMap[id];

  // Deterministic UUID generation from string hash
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < id.length; i++) {
    const ch = id.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const s1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const s2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const s3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const s4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  const full = `${s1}${s2}${s3}${s4}`.substring(0, 32);

  return `${full.substring(0, 8)}-${full.substring(8, 12)}-4000-a000-${full.substring(16, 28)}`;
}

/**
 * Generate URL-friendly slug
 */
export function generateSlug(title: string): string {
  if (!title) return `bai-viet-${Date.now()}`;
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `bai-viet-${Date.now()}`;
}

/**
 * GET ALL CMS Articles from Supabase (Including Drafts, Pending Review, Published, Rejected)
 */
export async function handleGetCmsArticles(): Promise<{
  success: boolean;
  articles?: ArticleData[];
  total?: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình Supabase URL & Anon Key' };
  }

  const db = getSupabaseAdmin() || supabase;

  try {
    // 1. Fetch content_items to check soft-delete status
    const { data: itemsData, error: itemsErr } = await db
      .from('content_items')
      .select('id, slug, is_deleted, published_revision_id, latest_draft_revision_id');

    if (itemsErr) {
      console.warn('[handleGetCmsArticles items error]', itemsErr.message);
    }

    const deletedItemIds = new Set<string>();
    const itemSlugMap = new Map<string, string>();
    if (itemsData) {
      for (const item of itemsData) {
        if (item.is_deleted) deletedItemIds.add(item.id);
        if (item.slug) itemSlugMap.set(item.id, item.slug);
      }
    }

    // 2. Fetch all content_revisions
    const { data: revsData, error: revsErr } = await db
      .from('content_revisions')
      .select('id, item_id, title, summary, data, status, created_at, updated_at, author_id')
      .order('updated_at', { ascending: false });

    if (revsErr) {
      return { success: false, error: `Lỗi truy vấn revisions: ${revsErr.message}` };
    }

    if (!revsData || revsData.length === 0) {
      return { success: true, articles: [], total: 0 };
    }

    // 3. Filter out system containers and deleted items
    const filteredRevs = revsData.filter((r) => {
      if (r.item_id === RESERVED_CONTEST_ID || r.item_id === RESERVED_RESOURCES_ID) return false;
      if (deletedItemIds.has(r.item_id)) return false;
      const title = r.title || '';
      if (title.includes('Hồ Sơ Hội Thi') || title.includes('Kho Tư Liệu Số Hóa')) return false;
      return true;
    });

    // 4. Map to ArticleData, deduping by item_id (latest revision wins)
    const seenItemIds = new Set<string>();
    const mappedArticles: ArticleData[] = [];

    for (const rev of filteredRevs) {
      const itemId = rev.item_id || rev.id;
      if (seenItemIds.has(itemId)) continue;
      seenItemIds.add(itemId);

      const rData = (rev.data || {}) as Record<string, any>;
      const articleId = rData.legacy_id || itemId;
      const slug = rData.slug || itemSlugMap.get(itemId) || generateSlug(rev.title);

      mappedArticles.push({
        id: articleId,
        title: rev.title,
        slug,
        summary: rev.summary || '',
        content: rData.content || '',
        category: rData.category || 'article',
        topic: rData.topic || 'Không gian văn hóa Hồ Chí Minh',
        featured_image: rData.featured_image || '',
        references: rData.references || '',
        audio_url: rData.audio_url || '',
        audio_duration: rData.audio_duration || '',
        status: (rev.status as any) || 'draft',
        author_id: rData.author_id || rev.author_id || '',
        author_name: rData.author_name || 'Ban Biên Tập THCS Nguyễn Trung Trực',
        created_at: rev.created_at || '',
        updated_at: rev.updated_at || rev.created_at || '',
      });
    }

    return {
      success: true,
      articles: mappedArticles,
      total: mappedArticles.length,
    };
  } catch (err: any) {
    console.error('[handleGetCmsArticles Exception]', err);
    return { success: false, error: err?.message || 'Lỗi ngoại lệ khi tải bài viết từ Cloud' };
  }
}

/**
 * SAVE or UPSERT CMS Article to Supabase Database (content_items & content_revisions)
 */
export async function handleSaveCmsArticle(article: ArticleData): Promise<{
  success: boolean;
  article?: ArticleData;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình Supabase URL & Anon Key' };
  }

  if (!article || !article.title) {
    return { success: false, error: 'Tiêu đề bài viết không được để trống' };
  }

  const db = getSupabaseAdmin() || supabase;

  try {
    const rawId = article.id || `art-${Date.now()}`;
    const itemId = toValidUuid(rawId);
    const safeSlug = article.slug || generateSlug(article.title);
    const nowIso = new Date().toISOString();

    // 1. Ensure content_items row exists
    const itemPayload: Record<string, any> = {
      id: itemId,
      content_type: 'post',
      slug: safeSlug,
      created_by: SYSTEM_AUTHOR_ID,
      is_deleted: false,
      updated_at: nowIso,
    };

    const { error: itemErr } = await db
      .from('content_items')
      .upsert(itemPayload, { onConflict: 'id' });

    if (itemErr) {
      // If slug collision on a different item, adjust slug
      if (itemErr.message?.includes('duplicate key') || itemErr.message?.includes('unique constraint') || itemErr.code === '23505') {
        itemPayload.slug = `${safeSlug}-${Math.floor(Math.random() * 1000)}`;
        await db.from('content_items').upsert(itemPayload, { onConflict: 'id' });
      } else {
        console.warn('[handleSaveCmsArticle itemUpsert Warning]', itemErr.message);
      }
    }

    // 2. Check existing revision for this item_id
    const { data: revs } = await db
      .from('content_revisions')
      .select('id, version_number')
      .eq('item_id', itemId)
      .order('version_number', { ascending: false })
      .limit(1);

    const existingRev = revs && revs.length > 0 ? revs[0] : null;
    const revId = existingRev ? existingRev.id : toValidUuid(`rev-${rawId}`);
    const nextVersion = existingRev ? (existingRev.version_number || 1) : 1;

    // 3. Upsert content_revisions
    const revPayload = {
      id: revId,
      item_id: itemId,
      version_number: nextVersion,
      title: article.title,
      summary: article.summary || '',
      status: article.status || 'draft',
      author_id: SYSTEM_AUTHOR_ID,
      data: {
        content: article.content || '',
        category: article.category || 'article',
        topic: article.topic || 'Không gian văn hóa Hồ Chí Minh',
        featured_image: article.featured_image || '',
        references: article.references || '',
        audio_url: article.audio_url || '',
        audio_duration: article.audio_duration || '',
        author_name: article.author_name || 'Ban Biên Tập THCS Nguyễn Trung Trực',
        author_id: article.author_id || '',
        slug: itemPayload.slug,
        legacy_id: rawId,
        tags: [article.category, article.topic || ''].filter(Boolean),
        synced_at: nowIso,
      },
      updated_at: nowIso,
    };

    const { error: revErr } = await db
      .from('content_revisions')
      .upsert(revPayload, { onConflict: 'id' });

    if (revErr) {
      console.warn('[handleSaveCmsArticle revUpsert Error]', revErr.message);
      return { success: false, error: `Lỗi lưu revision bài viết: ${revErr.message}` };
    }

    // 4. Update content_items pointers
    if (article.status === 'published') {
      await db
        .from('content_items')
        .update({ published_revision_id: revId, latest_draft_revision_id: null, updated_at: nowIso })
        .eq('id', itemId);
    } else {
      await db
        .from('content_items')
        .update({ latest_draft_revision_id: revId, updated_at: nowIso })
        .eq('id', itemId);
    }

    const syncedArticle: ArticleData = {
      ...article,
      id: rawId,
      slug: itemPayload.slug,
      updated_at: nowIso,
    };

    return {
      success: true,
      article: syncedArticle,
    };
  } catch (err: any) {
    console.error('[handleSaveCmsArticle Exception]', err);
    return { success: false, error: err?.message || 'Lỗi ngoại lệ khi lưu bài viết lên Cloud' };
  }
}

/**
 * DELETE CMS Article from Supabase Database
 */
export async function handleDeleteCmsArticle(articleId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured) return { success: true };
  if (!articleId) return { success: false, error: 'Thiếu mã bài viết' };

  const db = getSupabaseAdmin() || supabase;
  const itemId = toValidUuid(articleId);

  try {
    // 1. Soft delete content_items
    await db
      .from('content_items')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .or(`id.eq.${itemId},slug.eq.${articleId}`);

    // 2. Set revisions to archived or delete
    await db
      .from('content_revisions')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .or(`id.eq.${itemId},item_id.eq.${itemId}`);

    return { success: true };
  } catch (err: any) {
    console.error('[handleDeleteCmsArticle Exception]', err);
    return { success: false, error: err?.message || 'Lỗi khi xóa bài viết' };
  }
}
