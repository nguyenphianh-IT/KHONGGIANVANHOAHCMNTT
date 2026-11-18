// src/lib/supabaseBackend.ts
import { createClient } from "@supabase/supabase-js";
var getEnv = (key) => {
  try {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {
  }
  return void 0;
};
var _supabaseAdmin = null;
var getSupabaseAdmin = () => {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = getEnv("SUPABASE_URL") || getEnv("VITE_SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SUPABASE_SERVICE_KEY");
  if (!url || !serviceKey || serviceKey.trim() === "") {
    return null;
  }
  _supabaseAdmin = createClient(url, serviceKey.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  return _supabaseAdmin;
};

// api/cms/upload-pdf.ts
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return res.status(500).json({
      success: false,
      error: "Ch\u01B0a c\u1EA5u h\xECnh SUPABASE_SERVICE_ROLE_KEY tr\xEAn m\xE1y ch\u1EE7"
    });
  }
  try {
    const { data: buckets } = await admin.storage.listBuckets();
    const docBucket = buckets?.find((b) => b.name === "documents");
    if (!docBucket) {
      await admin.storage.createBucket("documents", {
        public: true,
        fileSizeLimit: 52428800
        // 50MB
      });
    }
    const rawFileName = req.query?.fileName || req.body?.fileName || `tai-lieu-${Date.now()}.pdf`;
    const sanitizedFileName = rawFileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const isImage = Boolean(
      sanitizedFileName.match(/\.(jpg|jpeg|png|webp|gif)$/i) || req.query?.type === "image" || req.body?.type === "image"
    );
    const isAudio = !isImage && Boolean(
      sanitizedFileName.match(/\.(mp3|wav|m4a|ogg|aac)$/i) || req.query?.type === "audio" || req.body?.type === "audio"
    );
    const uniquePrefix = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const filePath = isImage ? `images/${uniquePrefix}_${sanitizedFileName}` : isAudio ? `audio/${uniquePrefix}_${sanitizedFileName}` : `uploads/${uniquePrefix}_${sanitizedFileName}`;
    const { data: signedData, error: signErr } = await admin.storage.from("documents").createSignedUploadUrl(filePath);
    if (signErr || !signedData?.signedUrl) {
      return res.status(500).json({
        success: false,
        error: `Kh\xF4ng th\u1EC3 t\u1EA1o \u0111\u01B0\u1EDDng d\u1EABn t\u1EA3i t\u1EC7p: ${signErr?.message || "L\u1ED7i Supabase Storage"}`
      });
    }
    const { data: publicData } = admin.storage.from("documents").getPublicUrl(filePath);
    return res.status(200).json({
      success: true,
      filePath,
      signedUploadUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
      fileName: rawFileName,
      isAudio,
      isImage
    });
  } catch (err) {
    console.error("[Upload API Exception]", err);
    return res.status(500).json({
      success: false,
      error: `L\u1ED7i m\xE1y ch\u1EE7 l\u01B0u tr\u1EEF: ${err.message || String(err)}`
    });
  }
}
export {
  handler as default
};
