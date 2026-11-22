// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// MODULE: CMS CLOUD DATABASE BACKEND SERVICE (MULTI-DEVICE SYNCHRONIZATION)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { getSupabaseAdmin } from './supabaseBackend';
import type { ArticleData, MediaAsset } from './cmsStore';

const SYSTEM_AUTHOR_ID = 'c4821ce7-7c41-45d2-bb9d-ebf7b2228004';
const RESERVED_CONTEST_ID = 'a0000000-0000-0000-0000-000000000001';
const RESERVED_RESOURCES_ID = 'a0000000-0000-0000-0000-000000000002';
export const RESERVED_MEDIA_LIBRARY_ID = 'a0000000-0000-0000-0000-000000000003';
export const RESERVED_DEPARTMENTS_ID = 'a0000000-0000-0000-0000-000000000004';

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

    // 3. Filter out system containers, archived, deleted items and exact old test artifacts
    const EXACT_DELETED_TEST_IDS = new Set([
      'art-1794931991567',
      'art-1794934461061',
      'art-1794909786816',
      toValidUuid('art-1794931991567'),
      toValidUuid('art-1794934461061'),
      toValidUuid('art-1794909786816'),
      '6be75125-52eb-4678-b0ee-c94de607b24e',
      'd0000000-0000-0000-0000-000000000004',
      'd0000000-0000-0000-0000-000000000003',
    ]);

    const filteredRevs = revsData.filter((r) => {
      if (
        r.item_id === RESERVED_CONTEST_ID ||
        r.item_id === RESERVED_RESOURCES_ID ||
        r.item_id === RESERVED_MEDIA_LIBRARY_ID ||
        r.item_id === RESERVED_DEPARTMENTS_ID
      ) return false;
      if (deletedItemIds.has(r.item_id) || deletedItemIds.has(r.id)) return false;
      if (r.status === 'archived') return false;
      const title = (r.title || '').trim();
      if (
        title.includes('Hồ Sơ Hội Thi') ||
        title.includes('Kho Tư Liệu Số Hóa') ||
        title.includes('Kho Media') ||
        title.includes('Danh Mục Tổ Chuyên Môn')
      ) return false;
      // Loại bỏ chính xác các bản nháp / bài viết tự sinh cũ trong quá trình thử nghiệm
      if (title === 'Test' || title === 'Bản thảo nghiên cứu Di chúc Bác Hồ' || (title === 'Lời kêu gọi toàn quốc kháng chiến năm 1946' && r.status === 'rejected')) {
        return false;
      }
      if (r.data && r.data.slug === 'test') {
        return false;
      }
      const rId = r.id || '';
      const rItem = r.item_id || '';
      const rLegacy = (r.data && r.data.legacy_id) || '';
      if (EXACT_DELETED_TEST_IDS.has(rId) || EXACT_DELETED_TEST_IDS.has(rItem) || EXACT_DELETED_TEST_IDS.has(rLegacy)) {
        return false;
      }
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
      // Đảm bảo articleId là duy nhất cho mỗi bài viết: ưu tiên itemId trừ khi legacy_id bắt đầu bằng 'art-'
      const articleId = (rData.legacy_id && rData.legacy_id.startsWith('art-')) ? rData.legacy_id : itemId;
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
        media_assets: Array.isArray(rData.media_assets) ? rData.media_assets : [],
        references: rData.references || '',
        audio_url: rData.audio_url || '',
        audio_duration: rData.audio_duration || '',
        quote_id: rData.quote_id,
        custom_quote: rData.custom_quote || '',
        pdf_attachment: rData.pdf_attachment || undefined,
        status: (rev.status as any) || 'draft',
        author_id: rData.author_id || rev.author_id || '',
        author_name: rData.author_name || 'Ban Biên Tập THCS Nguyễn Trung Trực',
        created_at: rev.created_at || '',
        updated_at: rev.updated_at || rev.created_at || '',
        is_featured_hero: !!rData.is_featured_hero,
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
    let itemId = toValidUuid(rawId);
    const trimmedSlug = (article.slug || '').trim();
    const safeSlug = (trimmedSlug.length > 2 ? trimmedSlug : generateSlug(article.title)).slice(0, 200);
    const safeTitle = (article.title || 'Bài viết').trim().slice(0, 255);
    const nowIso = new Date().toISOString();

    // Chỉ tra cứu theo slug nếu bài viết KHÔNG có id (tránh trường hợp slug ngắn/trùng ghi đè bài khác)
    if (!article.id && safeSlug.length > 2) {
      const { data: itemBySlug } = await db
        .from('content_items')
        .select('id, is_deleted')
        .eq('slug', safeSlug)
        .eq('is_deleted', false)
        .limit(1);
      if (itemBySlug && itemBySlug.length > 0 && itemBySlug[0].id) {
        itemId = itemBySlug[0].id;
      }
    }

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
        const suffix = `${Date.now().toString(36).slice(-4)}${Math.floor(Math.random() * 100)}`;
        itemPayload.slug = `${safeSlug.slice(0, 185)}-${suffix}`;
        await db.from('content_items').upsert(itemPayload, { onConflict: 'id' });
      } else {
        console.warn('[handleSaveCmsArticle itemUpsert Warning]', itemErr.message);
      }
    }

    // 2. Check existing revision for this item_id
    const { data: revs } = await db
      .from('content_revisions')
      .select('id, version_number, title, summary, status, data')
      .eq('item_id', itemId)
      .order('version_number', { ascending: false })
      .limit(1);

    const existingRev = revs && revs.length > 0 ? revs[0] : null;
    const existingData = (existingRev?.data || {}) as Record<string, any>;
    const revId = existingRev ? existingRev.id : toValidUuid(`rev-${rawId}`);
    const nextVersion = existingRev ? (existingRev.version_number || 1) : 1;

    // Bảo toàn dữ liệu đã có nếu payload chỉ cập nhật trạng thái duyệt
    const safeContent = article.content !== undefined && article.content !== ''
      ? article.content
      : (existingData.content || '');
    const safeSummary = article.summary !== undefined && article.summary !== ''
      ? article.summary
      : (existingRev?.summary || '');
    const safeFeaturedImage = article.featured_image !== undefined && article.featured_image !== ''
      ? article.featured_image
      : (existingData.featured_image || '');
    const safeMediaAssets = Array.isArray(article.media_assets) && article.media_assets.length > 0
      ? article.media_assets
      : (Array.isArray(existingData.media_assets) ? existingData.media_assets : []);

    // 3. Upsert content_revisions
    const revPayload: Record<string, any> = {
      id: revId,
      item_id: itemId,
      version_number: nextVersion,
      title: safeTitle || existingRev?.title || 'Bài viết',
      summary: safeSummary,
      status: article.status || existingRev?.status || 'draft',
      author_id: SYSTEM_AUTHOR_ID,
      data: {
        summary: safeSummary,
        content: safeContent,
        category: article.category || existingData.category || 'article',
        topic: article.topic || existingData.topic || 'Không gian văn hóa Hồ Chí Minh',
        featured_image: safeFeaturedImage,
        media_assets: safeMediaAssets,
        references: article.references || existingData.references || '',
        audio_url: article.audio_url || existingData.audio_url || '',
        audio_duration: article.audio_duration || existingData.audio_duration || '',
        quote_id: article.quote_id !== undefined ? article.quote_id : existingData.quote_id,
        custom_quote: article.custom_quote !== undefined ? article.custom_quote : (existingData.custom_quote || ''),
        pdf_attachment: article.pdf_attachment !== undefined ? article.pdf_attachment : (existingData.pdf_attachment || undefined),
        author_name: article.author_name || existingData.author_name || 'Ban Biên Tập THCS Nguyễn Trung Trực',
        author_id: article.author_id || existingData.author_id || '',
        slug: itemPayload.slug,
        legacy_id: rawId,
        tags: [article.category || existingData.category, article.topic || existingData.topic || ''].filter(Boolean),
        is_featured_hero: article.is_featured_hero !== undefined ? !!article.is_featured_hero : (existingData.is_featured_hero || false),
        synced_at: nowIso,
      },
      updated_at: nowIso,
    };

    if (article.status === 'published') {
      revPayload.reviewed_at = nowIso;
      revPayload.reviewed_by = SYSTEM_AUTHOR_ID;
    } else if (article.status === 'pending') {
      revPayload.submitted_at = nowIso;
    }

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
    // 1. Soft delete content_items (đảm bảo tồn tại bản ghi is_deleted = true)
    await db
      .from('content_items')
      .update({ is_deleted: true })
      .or(`id.eq.${itemId},slug.eq.${articleId}`);

    await db
      .from('content_items')
      .upsert({
        id: itemId,
        content_type: 'post',
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: true,
        slug: `deleted-${articleId.slice(0, 20)}-${Date.now().toString(36)}`
      }, { onConflict: 'id' });

    // 2. Set revisions to archived or delete
    await db
      .from('content_revisions')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .or(`id.eq.${itemId},item_id.eq.${itemId}`);

    if (articleId.startsWith('art-')) {
      await db
        .from('content_revisions')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .contains('data', { legacy_id: articleId });
    }

    return { success: true };
  } catch (err: any) {
    console.error('[handleDeleteCmsArticle Exception]', err);
    return { success: false, error: err?.message || 'Lỗi khi xóa bài viết' };
  }
}

/**
 * GET Media Assets from Supabase Cloud Media Library & Article Revisions
 */
export async function handleGetCmsMedia(mediaId?: string): Promise<{
  success: boolean;
  assets?: MediaAsset[];
  asset?: MediaAsset;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình Supabase URL & Anon Key' };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    // 1. Fetch from RESERVED_MEDIA_LIBRARY_ID
    const { data: revs } = await db
      .from('content_revisions')
      .select('data')
      .eq('item_id', RESERVED_MEDIA_LIBRARY_ID)
      .order('version_number', { ascending: false })
      .limit(1);

    let libraryAssets: MediaAsset[] = [];
    if (revs && revs.length > 0 && revs[0].data && Array.isArray(revs[0].data.assets)) {
      libraryAssets = revs[0].data.assets;
    }

    // Nếu tìm kiếm 1 media cụ thể
    if (mediaId) {
      const foundInLib = libraryAssets.find((a) => a.id === mediaId || a.name === mediaId);
      if (foundInLib) {
        return { success: true, asset: foundInLib };
      }

      // Quét thêm trong các revisions bài viết để không bao giờ bị lỡ
      const { data: articleRevs } = await db
        .from('content_revisions')
        .select('data')
        .order('updated_at', { ascending: false });

      if (articleRevs) {
        for (const rev of articleRevs) {
          if (rev.data && Array.isArray(rev.data.media_assets)) {
            const foundInArt = rev.data.media_assets.find(
              (a: MediaAsset) => a.id === mediaId || a.name === mediaId
            );
            if (foundInArt) {
              return { success: true, asset: foundInArt };
            }
          }
        }
      }
      return { success: false, error: 'Không tìm thấy tư liệu media' };
    }

    // Nạp toàn bộ kho media: gộp giữa thư viện trung tâm và mọi bài viết
    const { data: articleRevs } = await db
      .from('content_revisions')
      .select('data')
      .order('updated_at', { ascending: false });

    const assetMap = new Map<string, MediaAsset>();
    for (const a of libraryAssets) {
      if (a && a.id) assetMap.set(a.id, a);
    }
    if (articleRevs) {
      for (const rev of articleRevs) {
        if (rev.data && Array.isArray(rev.data.media_assets)) {
          for (const a of rev.data.media_assets) {
            if (a && a.id && !assetMap.has(a.id)) {
              assetMap.set(a.id, a);
            }
          }
        }
      }
    }

    return { success: true, assets: Array.from(assetMap.values()) };
  } catch (err: any) {
    console.error('[handleGetCmsMedia Exception]', err);
    return { success: false, error: err?.message || 'Lỗi truy vấn media từ Cloud' };
  }
}

/**
 * SAVE or UPSERT Media Asset(s) to Supabase Cloud Media Library
 */
export async function handleSaveCmsMedia(newAssets: MediaAsset | MediaAsset[]): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình Supabase URL & Anon Key' };
  }
  const toAdd = Array.isArray(newAssets) ? newAssets : [newAssets];
  if (toAdd.length === 0) return { success: true, count: 0 };

  const db = getSupabaseAdmin() || supabase;
  try {
    const nowIso = new Date().toISOString();

    // 1. Ensure content_items row exists
    const { data: existingItem } = await db
      .from('content_items')
      .select('id, slug')
      .eq('id', RESERVED_MEDIA_LIBRARY_ID)
      .maybeSingle();

    if (!existingItem) {
      const { data: slugItem } = await db
        .from('content_items')
        .select('id')
        .eq('slug', 'kho-media-tu-lieu-so-hoa')
        .maybeSingle();

      const mediaSlug = slugItem ? `kho-media-so-hoa-${Date.now()}` : 'kho-media-tu-lieu-so-hoa';

      const { error: itemErr } = await db.from('content_items').insert({
        id: RESERVED_MEDIA_LIBRARY_ID,
        content_type: 'post',
        slug: mediaSlug,
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: false,
        updated_at: nowIso,
      });

      if (itemErr) {
        return {
          success: false,
          error: `Lỗi tạo content_items media: ${itemErr.message} (Code: ${itemErr.code})`,
        };
      }
    }

    // 2. Fetch existing assets
    const { data: revs } = await db
      .from('content_revisions')
      .select('id, version_number, data')
      .eq('item_id', RESERVED_MEDIA_LIBRARY_ID)
      .order('version_number', { ascending: false })
      .limit(1);

    const existingRev = revs && revs.length > 0 ? revs[0] : null;
    let existingAssets: MediaAsset[] = [];
    if (existingRev && existingRev.data && Array.isArray(existingRev.data.assets)) {
      existingAssets = existingRev.data.assets;
    }

    const assetMap = new Map<string, MediaAsset>();
    for (const a of existingAssets) {
      if (a && a.id) assetMap.set(a.id, a);
    }
    for (const a of toAdd) {
      if (a && a.id) assetMap.set(a.id, a);
    }

    const mergedAssets = Array.from(assetMap.values());
    const revId = existingRev ? existingRev.id : toValidUuid('rev-media-library');
    const versionNumber = (existingRev?.version_number || 0) + 1;

    // 3. Upsert revision
    const { error: revErr } = await db.from('content_revisions').upsert(
      {
        id: revId,
        item_id: RESERVED_MEDIA_LIBRARY_ID,
        version_number: versionNumber,
        title: 'Kho Media Tư Liệu Số Hóa',
        summary: `Kho lưu trữ ${mergedAssets.length} tư liệu hình ảnh và đa phương tiện đồng bộ`,
        status: 'published',
        author_id: SYSTEM_AUTHOR_ID,
        data: {
          assets: mergedAssets,
          synced_at: nowIso,
        },
        updated_at: nowIso,
      },
      { onConflict: 'id' }
    );

    if (revErr) {
      return { success: false, error: revErr.message };
    }

    // 4. Update pointer in content_items
    await db
      .from('content_items')
      .update({
        published_revision_id: revId,
        updated_at: nowIso,
      })
      .eq('id', RESERVED_MEDIA_LIBRARY_ID);

    return { success: true, count: mergedAssets.length };
  } catch (err: any) {
    console.error('[handleSaveCmsMedia Exception]', err);
    return { success: false, error: err?.message || 'Lỗi lưu trữ media lên Cloud' };
  }
}

/**
 * DELETE Media Asset from Supabase Cloud Media Library
 */
export async function handleDeleteCmsMedia(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured) return { success: true };
  if (!id) return { success: false, error: 'Thiếu mã media' };

  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: revs } = await db
      .from('content_revisions')
      .select('id, version_number, data')
      .eq('item_id', RESERVED_MEDIA_LIBRARY_ID)
      .order('version_number', { ascending: false })
      .limit(1);

    if (!revs || revs.length === 0 || !revs[0].data || !Array.isArray(revs[0].data.assets)) {
      return { success: true };
    }

    const existingAssets: MediaAsset[] = revs[0].data.assets;
    const filteredAssets = existingAssets.filter((a) => a.id !== id && a.name !== id);
    const nowIso = new Date().toISOString();

    await db
      .from('content_revisions')
      .update({
        data: {
          assets: filteredAssets,
          synced_at: nowIso,
        },
        updated_at: nowIso,
      })
      .eq('id', revs[0].id);

    return { success: true };
  } catch (err: any) {
    console.error('[handleDeleteCmsMedia Exception]', err);
    return { success: false, error: err?.message || 'Lỗi khi xóa media' };
  }
}

// ==============================================================================
// QUẢN LÝ DANH MỤC TỔ CHUYÊN MÔN & CHỈNH SỬA TÀI KHOẢN GIÁO VIÊN (ADMIN ONLY)
// ==============================================================================
export interface DepartmentItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  head_name?: string;
  created_at?: string;
}

export const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept-bgh', name: 'Ban Giám Hiệu', code: 'BGH', description: 'Ban Giám Hiệu nhà trường & Hội đồng kiểm duyệt 4 mắt' },
  { id: 'dept-lsdl', name: 'Tổ Lịch sử - Địa lý', code: 'LSDL', description: 'Tổ chuyên môn Lịch sử, Địa lý & Tư liệu truyền thống' },
  { id: 'dept-nvgdcd', name: 'Tổ Ngữ văn - GDCD', code: 'NVGDCD', description: 'Tổ chuyên môn Ngữ văn, Giáo dục công dân & Đạo đức Hồ Chí Minh' },
  { id: 'dept-toantin', name: 'Tổ Toán - Tin học', code: 'TOANTIN', description: 'Tổ chuyên môn Toán, Tin học & Chuyển đổi số học đường' },
  { id: 'dept-khtn', name: 'Tổ Khoa học tự nhiên', code: 'KHTN', description: 'Tổ chuyên môn Khoa học tự nhiên (Lý - Hóa - Sinh)' },
  { id: 'dept-ngoaingu', name: 'Tổ Ngoại ngữ', code: 'NN', description: 'Tổ chuyên môn Tiếng Anh & Hội nhập quốc tế' },
  { id: 'dept-doandoi', name: 'Đoàn - Đội - Hoạt động trải nghiệm', code: 'DOANDOI', description: 'Chi đoàn, Liên đội TNTP Hồ Chí Minh & Phong trào học sinh' },
  { id: 'dept-vanphong', name: 'Tổ Văn phòng', code: 'VP', description: 'Hành chính, Thư viện, Thiết bị & Truyền thông nhà trường' },
];

/**
 * Xác thực quyền Admin / Ban Giám Hiệu từ Supabase Access Token (JWT)
 */
export async function verifyAdminFromAuthHeader(authHeader?: string): Promise<{
  authorized: boolean;
  userId?: string;
  email?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { authorized: false, error: 'Chưa cấu hình Supabase trên máy chủ.' };
  }
  const db = getSupabaseAdmin();
  if (!db) {
    return { authorized: false, error: 'Máy chủ chưa cấu hình SUPABASE_SERVICE_ROLE_KEY.' };
  }
  const token = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return { authorized: false, error: 'Thiếu mã phiên đăng nhập (Authorization Bearer Token).' };
  }

  try {
    const { data: userData, error: userErr } = await db.auth.getUser(token);
    if (userErr || !userData?.user) {
      return { authorized: false, error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' };
    }

    const userId = userData.user.id;
    const { data: roleRows, error: roleErr } = await db
      .from('user_roles')
      .select('roles(code)')
      .eq('user_id', userId);

    if (roleErr) {
      return { authorized: false, error: `Không thể kiểm tra quyền quản trị: ${roleErr.message}` };
    }

    const isAdminUser = (roleRows || []).some((r: any) => {
      const code = r?.roles?.code;
      return code === 'admin' || code === 'super_admin';
    });

    if (!isAdminUser) {
      return { authorized: false, error: 'Chỉ Quản trị viên (Admin / Ban Giám Hiệu) mới có quyền thực hiện thao tác này.' };
    }

    return { authorized: true, userId, email: userData.user.email || '' };
  } catch (err: any) {
    return { authorized: false, error: err?.message || 'Lỗi xác thực quyền Admin.' };
  }
}

/**
 * GET Danh mục Tổ chuyên môn từ Supabase Cloud
 */
export async function handleGetDepartments(): Promise<{
  success: boolean;
  departments?: DepartmentItem[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: rev } = await db
      .from('content_revisions')
      .select('data')
      .eq('item_id', RESERVED_DEPARTMENTS_ID)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rev?.data && Array.isArray((rev.data as any).departments) && (rev.data as any).departments.length > 0) {
      return { success: true, departments: (rev.data as any).departments as DepartmentItem[] };
    }
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  } catch (err: any) {
    console.error('[handleGetDepartments Exception]', err);
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  }
}

/**
 * SAVE Danh mục Tổ chuyên môn lên Supabase Cloud (đồng bộ tự động tên tổ cho giáo viên nếu đổi tên)
 */
export async function handleSaveDepartments(
  departments: DepartmentItem[],
  renameFrom?: string,
  renameTo?: string
): Promise<{
  success: boolean;
  departments?: DepartmentItem[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình Supabase' };
  }
  if (!Array.isArray(departments)) {
    return { success: false, error: 'Danh sách tổ chuyên môn không hợp lệ' };
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: 'Máy chủ thiếu khóa quản trị SUPABASE_SERVICE_ROLE_KEY' };
  }

  try {
    const nowIso = new Date().toISOString();
    const cleanedDepartments: DepartmentItem[] = departments
      .filter((d) => d && typeof d.name === 'string' && d.name.trim().length > 0)
      .map((d) => ({
        id: d.id || `dept-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: d.name.trim(),
        code: (d.code || '').trim().toUpperCase(),
        description: (d.description || '').trim(),
        head_name: (d.head_name || '').trim(),
        created_at: d.created_at || nowIso,
      }));

    // 1. Đảm bảo container content_items tồn tại
    await db.from('content_items').upsert(
      {
        id: RESERVED_DEPARTMENTS_ID,
        content_type: 'post',
        slug: 'cms-departments-catalog',
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: false,
        updated_at: nowIso,
      },
      { onConflict: 'id' }
    );

    // 2. Lấy revision hiện có nếu có
    const { data: existingRev } = await db
      .from('content_revisions')
      .select('id, version_number')
      .eq('item_id', RESERVED_DEPARTMENTS_ID)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const revId = existingRev?.id || toValidUuid(`rev-departments-${RESERVED_DEPARTMENTS_ID}`);
    const versionNumber = existingRev?.version_number || 1;

    const { error: revErr } = await db.from('content_revisions').upsert(
      {
        id: revId,
        item_id: RESERVED_DEPARTMENTS_ID,
        version_number: versionNumber,
        title: 'Danh Mục Tổ Chuyên Môn',
        summary: 'Danh mục tổ chuyên môn và phòng ban do Ban Giám Hiệu / Admin khai báo.',
        status: 'published',
        author_id: SYSTEM_AUTHOR_ID,
        data: {
          departments: cleanedDepartments,
          updated_at: nowIso,
        },
        updated_at: nowIso,
      },
      { onConflict: 'id' }
    );

    if (revErr) {
      return { success: false, error: revErr.message };
    }

    await db
      .from('content_items')
      .update({ published_revision_id: revId, updated_at: nowIso })
      .eq('id', RESERVED_DEPARTMENTS_ID);

    // 3. Nếu Admin đổi tên một tổ chuyên môn, tự động cập nhật đồng bộ trường department cho tất cả giáo viên thuộc tổ đó
    if (renameFrom && renameTo && renameFrom.trim() !== renameTo.trim()) {
      await db
        .from('profiles')
        .update({ department: renameTo.trim(), updated_at: nowIso })
        .eq('department', renameFrom.trim());
    }

    return { success: true, departments: cleanedDepartments };
  } catch (err: any) {
    console.error('[handleSaveDepartments Exception]', err);
    return { success: false, error: err?.message || 'Lỗi khi lưu danh mục tổ chuyên môn' };
  }
}

/**
 * ADMIN: Lấy danh sách đầy đủ toàn bộ tài khoản GV & Cán bộ (auth.users + profiles + user_roles)
 */
export async function handleAdminListStaff(): Promise<{
  success: boolean;
  staff?: Array<{
    id: string;
    email: string;
    full_name: string;
    department: string;
    role: 'admin' | 'editor' | 'viewer';
    role_name: string;
    status: 'active' | 'suspended' | 'inactive';
    created_at?: string;
  }>;
  error?: string;
}> {
  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: 'Máy chủ thiếu khóa quản trị SUPABASE_SERVICE_ROLE_KEY' };
  }

  try {
    const [{ data: profilesData, error: profErr }, { data: rolesData }, { data: authUsersData }] = await Promise.all([
      db
        .from('profiles')
        .select('id, full_name, department, status, email, created_at')
        .order('created_at', { ascending: false }),
      db.from('user_roles').select('user_id, roles(code, name)'),
      db.auth.admin.listUsers({ perPage: 500 }),
    ]);

    if (profErr) {
      return { success: false, error: profErr.message };
    }

    const authEmailMap = new Map<string, string>();
    for (const u of authUsersData?.users || []) {
      if (u.id && u.email) authEmailMap.set(u.id, u.email);
    }

    const roleMap = new Map<string, { code: string; name: string }>();
    for (const r of (rolesData || []) as any[]) {
      if (r?.user_id && r?.roles?.code) {
        const existing = roleMap.get(r.user_id);
        // Ưu tiên quyền cao nhất (super_admin/admin > editor > viewer)
        if (!existing || r.roles.code === 'super_admin' || r.roles.code === 'admin') {
          roleMap.set(r.user_id, { code: r.roles.code, name: r.roles.name });
        }
      }
    }

    const staff = (profilesData || [])
      .filter((p: any) => p.status !== 'inactive')
      .map((p: any) => {
        const rInfo = roleMap.get(p.id) || { code: 'editor', name: 'Biên tập viên nội dung' };
        const normRole: 'admin' | 'editor' | 'viewer' =
          rInfo.code === 'admin' || rInfo.code === 'super_admin'
            ? 'admin'
            : rInfo.code === 'viewer'
            ? 'viewer'
            : 'editor';
        return {
          id: p.id,
          email: authEmailMap.get(p.id) || p.email || `${String(p.id).slice(0, 8)}@thcsnguyentrungtruc.edu.vn`,
          full_name: p.full_name || 'Cán bộ trường',
          department: p.department || 'Trường THCS Nguyễn Trung Trực',
          role: normRole,
          role_name:
            normRole === 'admin'
              ? 'Quản trị viên (Admin)'
              : normRole === 'viewer'
              ? 'Cố vấn / Xem tư liệu'
              : 'Biên tập viên nội dung',
          status: (p.status as 'active' | 'suspended' | 'inactive') || 'active',
          created_at: p.created_at,
        };
      });

    return { success: true, staff };
  } catch (err: any) {
    console.error('[handleAdminListStaff Exception]', err);
    return { success: false, error: err?.message || 'Lỗi tải danh sách tài khoản cán bộ' };
  }
}

/**
 * ADMIN: Chỉnh sửa đầy đủ thông tin tài khoản GV / Cán bộ (Họ tên, Email, Tổ chuyên môn, Vai trò, Trạng thái, Mật khẩu mới tùy chọn)
 */
export async function handleAdminUpdateStaff(
  payload: {
    id: string;
    full_name: string;
    email?: string;
    department: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'suspended' | 'inactive';
    new_password?: string;
  },
  adminUserId: string
): Promise<{
  success: boolean;
  staff?: {
    id: string;
    email: string;
    full_name: string;
    department: string;
    role: 'admin' | 'editor' | 'viewer';
    role_name: string;
    status: 'active' | 'suspended' | 'inactive';
  };
  error?: string;
}> {
  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: 'Máy chủ thiếu khóa quản trị SUPABASE_SERVICE_ROLE_KEY' };
  }

  const { id, full_name, email, department, role, status, new_password } = payload || ({} as any);
  if (!id || !full_name?.trim()) {
    return { success: false, error: 'Thiếu mã tài khoản hoặc họ và tên giáo viên.' };
  }

  const cleanName = full_name.trim();
  const cleanDept = (department || 'Trường THCS Nguyễn Trung Trực').trim();
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const cleanStatus: 'active' | 'suspended' | 'inactive' =
    status === 'suspended' || status === 'inactive' ? status : 'active';
  const cleanRole: 'admin' | 'editor' | 'viewer' =
    role === 'admin' || role === 'viewer' ? role : 'editor';

  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Địa chỉ email không hợp lệ.' };
  }

  if (new_password && new_password.length < 8) {
    return { success: false, error: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' };
  }

  // Bảo vệ: Không cho phép Admin tự đình chỉ hoặc tự hạ quyền tài khoản của chính mình
  if (id === adminUserId) {
    if (cleanStatus !== 'active') {
      return { success: false, error: 'Không thể tự tạm khóa tài khoản quản trị đang đăng nhập.' };
    }
    if (cleanRole !== 'admin') {
      return { success: false, error: 'Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập.' };
    }
  }

  try {
    const nowIso = new Date().toISOString();

    // 1. Cập nhật Supabase Auth (email, mật khẩu nếu nhập, trạng thái khóa/mở khóa, metadata)
    const authUpdates: Record<string, any> = {
      user_metadata: {
        full_name: cleanName,
        department: cleanDept,
      },
      ban_duration: cleanStatus === 'active' ? 'none' : '876000h',
    };
    if (cleanEmail) {
      authUpdates.email = cleanEmail;
      authUpdates.email_confirm = true;
    }
    if (new_password && new_password.length >= 8) {
      authUpdates.password = new_password;
    }

    const { data: updatedAuthUser, error: authErr } = await db.auth.admin.updateUserById(id, authUpdates);
    if (authErr) {
      console.warn('[handleAdminUpdateStaff auth.admin.updateUserById warning]', authErr.message);
      // Nếu lỗi trùng email trên auth.users, báo lỗi rõ ràng cho Admin
      if (
        authErr.message?.toLowerCase().includes('already') ||
        authErr.message?.toLowerCase().includes('duplicate') ||
        authErr.message?.toLowerCase().includes('exists')
      ) {
        return { success: false, error: `Email "${cleanEmail}" đã được sử dụng bởi tài khoản khác.` };
      }
      // Nếu user là tài khoản giả lập/không có trong auth.users, tiếp tục cập nhật profiles
      if (!authErr.message?.toLowerCase().includes('not found')) {
        return { success: false, error: `Lỗi cập nhật xác thực tài khoản: ${authErr.message}` };
      }
    }

    // 2. Cập nhật bảng profiles (với service_role key nên không bao giờ bị chặn bởi RLS)
    const profilePatch: Record<string, any> = {
      full_name: cleanName,
      department: cleanDept,
      status: cleanStatus,
      updated_at: nowIso,
    };
    if (cleanEmail) {
      profilePatch.email = cleanEmail;
    }

    const { error: profErr } = await db
      .from('profiles')
      .update(profilePatch)
      .eq('id', id);

    if (profErr) {
      return { success: false, error: `Lỗi cập nhật hồ sơ profiles: ${profErr.message}` };
    }

    // 3. Cập nhật vai trò RBAC trong bảng user_roles
    const { data: roleRow, error: roleLookupErr } = await db
      .from('roles')
      .select('id, code, name')
      .eq('code', cleanRole)
      .maybeSingle();

    if (!roleLookupErr && roleRow?.id) {
      await db.from('user_roles').delete().eq('user_id', id);
      const { error: insertRoleErr } = await db.from('user_roles').insert({
        user_id: id,
        role_id: roleRow.id,
        assigned_by: adminUserId,
      });
      if (insertRoleErr) {
        return { success: false, error: `Lỗi cập nhật vai trò phân quyền: ${insertRoleErr.message}` };
      }
    }

    const roleLabels: Record<string, string> = {
      admin: 'Quản trị viên (Admin)',
      editor: 'Biên tập viên nội dung',
      viewer: 'Cố vấn / Xem tư liệu',
    };

    return {
      success: true,
      staff: {
        id,
        email: updatedAuthUser?.user?.email || cleanEmail || '',
        full_name: cleanName,
        department: cleanDept,
        role: cleanRole,
        role_name: roleLabels[cleanRole],
        status: cleanStatus,
      },
    };
  } catch (err: any) {
    console.error('[handleAdminUpdateStaff Exception]', err);
    return { success: false, error: err?.message || 'Lỗi hệ thống khi cập nhật tài khoản giáo viên.' };
  }
}
