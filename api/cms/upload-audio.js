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

// api/cms/upload-audio.ts
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
    let targetBucket = "audio";
    const hasAudioBucket = buckets?.some((b) => b.name === "audio");
    if (!hasAudioBucket) {
      const { error: createErr } = await admin.storage.createBucket("audio", {
        public: true,
        fileSizeLimit: 52428800
        // 50MB
      });
      if (createErr) {
        console.warn("[Upload Audio] Kh\xF4ng th\u1EC3 t\u1EA1o bucket audio ri\xEAng bi\u1EC7t, d\xF9ng bucket documents:", createErr.message);
        targetBucket = "documents";
      }
    }
    const rawFileName = req.query?.fileName || req.body?.fileName || `bang-ghi-am-${Date.now()}.mp3`;
    const sanitizedFileName = rawFileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePrefix = Date.now().toString(36);
    const filePath = targetBucket === "audio" ? `recordings/${uniquePrefix}_${sanitizedFileName}` : `audio/${uniquePrefix}_${sanitizedFileName}`;
    const { data: signedData, error: signErr } = await admin.storage.from(targetBucket).createSignedUploadUrl(filePath);
    if (signErr || !signedData?.signedUrl) {
      return res.status(500).json({
        success: false,
        error: `Kh\xF4ng th\u1EC3 t\u1EA1o \u0111\u01B0\u1EDDng d\u1EABn t\u1EA3i \xE2m thanh: ${signErr?.message || "L\u1ED7i Supabase Storage"}`
      });
    }
    const { data: publicData } = admin.storage.from(targetBucket).getPublicUrl(filePath);
    return res.status(200).json({
      success: true,
      bucket: targetBucket,
      filePath,
      signedUploadUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
      fileName: rawFileName
    });
  } catch (err) {
    console.error("[Upload Audio API Exception]", err);
    return res.status(500).json({
      success: false,
      error: `L\u1ED7i m\xE1y ch\u1EE7 l\u01B0u tr\u1EEF \xE2m thanh: ${err.message || String(err)}`
    });
  }
}
export {
  handler as default
};
