import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  try {
    if (typeof (import.meta as any) !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY');
const appEnv = getEnv('VITE_APP_ENV') || getEnv('VERCEL_ENV') || getEnv('NODE_ENV') || 'development';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Cấu hình Hệ thống] Chưa cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY. Ứng dụng tự động kích hoạt chế độ lưu trữ LocalStorage/Offline an toàn.'
  );
}

// Rào chắn bảo vệ môi trường Sandbox (Tuân thủ FIX-SBOX-11 & FIX-SBOX-17)
if (appEnv === 'sandbox' && supabaseUrl) {
  if (supabaseUrl.includes('prod-live') || supabaseUrl.includes('thcsnguyentrungtruc.edu.vn')) {
    throw new Error(
      '[RÀO CHẮN AN NINH] Cảnh báo nhầm lẫn môi trường: Ứng dụng đang ở chế độ Sandbox nhưng URL trỏ tới Live Production!'
    );
  }
}

// URL và Key dự phòng hợp lệ cú pháp để tránh lỗi "supabaseUrl is required" làm sập ứng dụng (Trắng trang)
const validUrl = isSupabaseConfigured ? supabaseUrl! : 'https://placeholder-khonggianvanhoahcm.supabase.co';
const validKey = isSupabaseConfigured ? supabaseAnonKey! : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-anon-key';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
