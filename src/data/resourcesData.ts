import { ResourceItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const MOCK_EXCLUDED_RESOURCE_IDS = new Set([
  'res-1',
  'res-2',
  'res-3',
  'res-4',
  'res-5',
  'res-6',
  'res-7',
  'res-8',
  'audio-1',
  'audio-2',
  'audio-3',
  'audio-4'
]);

export const resourcesData: ResourceItem[] = [];

// ------------------------------------------------------------------------------
// ĐỒNG BỘ KHO TƯ LIỆU SỐ HÓA TỪ SUPABASE CLOUD
// ------------------------------------------------------------------------------
export async function fetchResourcesFromSupabase(): Promise<ResourceItem[]> {
  try {
    if (!isSupabaseConfigured) return resourcesData;

    const { data } = await supabase
      .from('content_revisions')
      .select('id, title, data')
      .eq('item_id', 'a0000000-0000-0000-0000-000000000002')
      .eq('status', 'published')
      .maybeSingle();

    if (data?.data && Array.isArray((data.data as any).resources)) {
      const items = (data.data as any).resources as ResourceItem[];
      // Loại bỏ hoàn toàn các bài ghi âm mock và bài viết/sách mock sinh ra trong lúc làm giao diện
      return items.filter(
        (r) =>
          !r.id.startsWith('audio-') &&
          r.category !== 'audio' &&
          !MOCK_EXCLUDED_RESOURCE_IDS.has(r.id)
      );
    }
  } catch (err) {
    console.warn('[Supabase resources fetch warning]', err);
  }
  return resourcesData;
}
