// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// MODULE: ARTICLE VIEWS TRACKING & ANTI-FRAUD STORAGE SERVICE
// MỤC TIÊU:
//   1. Đo lường chính xác số lượt đọc thực tế của học sinh & bạn đọc.
//   2. Chống view ảo triệt để: Kiểm soát dwell-time (thời gian đọc tối thiểu),
//      khử trùng lặp phiên (session deduplication) và khoảng thời gian giãn cách (cooldown).
//   3. Lưu trữ bền vững (Local Persistence) kết hợp đồng bộ Supabase Cloud.
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';

export const STORAGE_KEY_VIEWS = 'hcm_article_views_v1';
export const SESSION_KEY_VIEWED = 'hcm_session_viewed_articles';
export const STORAGE_KEY_LAST_VIEW_TS = 'hcm_article_last_view_ts';
export const EVENT_VIEWS_CHANGED = 'hcm_article_views_changed';

/**
 * QUY TẮC BẢO VỆ CHỐNG VIEW ẢO:
 * 1. Dwell-time tối thiểu: Người đọc phải ở lại bài viết ít nhất 3 giây.
 * 2. Khử trùng lặp theo phiên (Session Deduplication): Mỗi phiên làm việc của trình duyệt
 *    chỉ tính tối đa 1 lượt đọc cho 1 bài viết.
 * 3. Khoảng cách thời gian (Cooldown): 30 phút giữa các lần tính lượt đọc tiếp theo trên cùng thiết bị.
 */
export const VIEW_COOLDOWN_MS = 30 * 60 * 1000; // 30 phút
export const MIN_ENGAGEMENT_DWELL_MS = 3000;    // 3 giây

export interface ArticleViewRecord {
  articleId: string;
  count: number;
}

export interface ViewValidationResult {
  allowed: boolean;
  reason?: 'already_viewed_in_session' | 'cooldown_active' | 'invalid_id';
}

/**
 * Lấy toàn bộ số lượt đọc thực tế từ bộ nhớ LocalStorage
 */
export function getAllViewCounts(): Record<string, number> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIEWS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (err) {
    console.warn('[ViewsStore] Lỗi đọc bộ nhớ lượt xem:', err);
    return {};
  }
}

/**
 * Lấy số lượt đọc thực tế của một bài viết cụ thể
 */
export function getViewCount(articleId: string): number {
  if (!articleId || typeof articleId !== 'string') return 0;
  const allCounts = getAllViewCounts();
  return typeof allCounts[articleId] === 'number' ? allCounts[articleId] : 0;
}

/**
 * Lấy danh sách các bài viết đã được đọc trong phiên trình duyệt hiện tại
 */
function getSessionViewedArticles(): Set<string> {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return new Set<string>();
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_VIEWED);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set<string>(parsed);
    }
  } catch {}
  return new Set<string>();
}

/**
 * Lấy mốc thời gian xem gần nhất của các bài viết
 */
function getLastViewTimestamps(): Record<string, number> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_VIEW_TS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch {}
  return {};
}

/**
 * Kiểm tra xem bài viết có đủ điều kiện ghi nhận lượt đọc mới hay không (Chống spam / view ảo)
 */
export function canRecordView(articleId: string): ViewValidationResult {
  const cleanId = (articleId || '').trim();
  if (!cleanId) {
    return { allowed: false, reason: 'invalid_id' };
  }

  // 1. Kiểm tra khử trùng lặp theo phiên hiện tại
  const sessionViewed = getSessionViewedArticles();
  if (sessionViewed.has(cleanId)) {
    return { allowed: false, reason: 'already_viewed_in_session' };
  }

  // 2. Kiểm tra khoảng cách Cooldown (30 phút chống F5 liên tục)
  const timestamps = getLastViewTimestamps();
  const lastTs = timestamps[cleanId];
  if (typeof lastTs === 'number' && Date.now() - lastTs < VIEW_COOLDOWN_MS) {
    return { allowed: false, reason: 'cooldown_active' };
  }

  return { allowed: true };
}

/**
 * Ghi nhận lượt đọc thực tế cho bài viết (Chỉ thực hiện khi đáp ứng đủ tiêu chuẩn chống view ảo)
 */
export async function recordArticleView(
  articleId: string
): Promise<{ success: boolean; newCount: number; reason?: string }> {
  const cleanId = (articleId || '').trim();
  if (!cleanId) {
    return { success: false, newCount: 0, reason: 'invalid_id' };
  }

  // Kiểm soát tính hợp lệ của lượt đọc
  const check = canRecordView(cleanId);
  const currentCount = getViewCount(cleanId);

  if (!check.allowed) {
    return { success: false, newCount: currentCount, reason: check.reason };
  }

  // 1. Cập nhật lượt đọc cục bộ (Local Atomic Increment)
  const allCounts = getAllViewCounts();
  const newCount = (allCounts[cleanId] || 0) + 1;
  allCounts[cleanId] = newCount;

  try {
    localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(allCounts));

    // Đánh dấu đã đọc trong phiên này
    const sessionViewed = getSessionViewedArticles();
    sessionViewed.add(cleanId);
    sessionStorage.setItem(SESSION_KEY_VIEWED, JSON.stringify(Array.from(sessionViewed)));

    // Cập nhật timestamp cooldown
    const timestamps = getLastViewTimestamps();
    timestamps[cleanId] = Date.now();
    localStorage.setItem(STORAGE_KEY_LAST_VIEW_TS, JSON.stringify(timestamps));

    // Phát sự kiện cập nhật giao diện thời gian thực trên toàn trang
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_VIEWS_CHANGED, {
          detail: { articleId: cleanId, count: newCount },
        })
      );
    }
  } catch (err) {
    console.warn('[ViewsStore] Lỗi lưu trữ lượt đọc LocalStorage:', err);
  }

  // 2. Đồng bộ điện toán đám mây Supabase Cloud (nếu được cấu hình)
  if (isSupabaseConfigured) {
    try {
      const { data: cloudCount, error } = await supabase.rpc('increment_article_view', {
        p_article_id: cleanId,
      });

      if (!error && typeof cloudCount === 'number') {
        if (cloudCount > newCount) {
          allCounts[cleanId] = cloudCount;
          localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(allCounts));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent(EVENT_VIEWS_CHANGED, {
                detail: { articleId: cleanId, count: cloudCount },
              })
            );
          }
          return { success: true, newCount: cloudCount };
        }
      }
    } catch (cloudErr) {
      // Supabase offline hoặc chưa chạy migration 017: Vẫn hoạt động trơn tru với LocalStorage
      console.warn('[ViewsStore Cloud Sync Notice]', cloudErr);
    }
  }

  return { success: true, newCount };
}

/**
 * Tải và hợp nhất số lượt đọc từ Supabase Cloud vào LocalStorage
 */
export async function fetchCloudViewCounts(): Promise<Record<string, number>> {
  const localCounts = getAllViewCounts();
  if (!isSupabaseConfigured) {
    return localCounts;
  }

  try {
    const { data, error } = await supabase
      .from('article_views')
      .select('article_id, view_count');

    if (error) {
      return localCounts;
    }

    if (Array.isArray(data) && data.length > 0) {
      const merged: Record<string, number> = { ...localCounts };
      data.forEach((row: { article_id: string; view_count: number }) => {
        if (row && row.article_id) {
          const cloudVal = typeof row.view_count === 'number' ? row.view_count : 0;
          const localVal = merged[row.article_id] || 0;
          merged[row.article_id] = Math.max(localVal, cloudVal);
        }
      });

      localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(merged));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_VIEWS_CHANGED, { detail: merged }));
      }
      return merged;
    }
  } catch (err) {
    console.warn('[ViewsStore] Không thể tải lượt đọc từ Supabase:', err);
  }

  return localCounts;
}

/**
 * Hiệu chỉnh hoặc đặt lại lượt đọc cho bài viết (Chỉ dành cho Cán bộ Quản trị)
 */
export async function resetArticleViewCount(
  articleId: string,
  targetCount: number = 0
): Promise<void> {
  const cleanId = (articleId || '').trim();
  if (!cleanId) return;

  const validTarget = Math.max(0, Math.floor(targetCount));
  const allCounts = getAllViewCounts();
  allCounts[cleanId] = validTarget;

  try {
    localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(allCounts));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_VIEWS_CHANGED, {
          detail: { articleId: cleanId, count: validTarget },
        })
      );
    }
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase.rpc('reset_article_view', {
        p_article_id: cleanId,
        p_target_count: validTarget,
      });
    } catch {}
  }
}
