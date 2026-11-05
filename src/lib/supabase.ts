import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appEnv = import.meta.env.VITE_APP_ENV || 'development';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Cảnh báo Cấu hình] Thiếu biến môi trường VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong tệp .env.local'
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

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
