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

// src/lib/supabase.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
var getEnv2 = (key) => {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {
  }
  try {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {
  }
  return void 0;
};
var supabaseUrl = getEnv2("VITE_SUPABASE_URL") || getEnv2("SUPABASE_URL");
var supabaseAnonKey = getEnv2("VITE_SUPABASE_ANON_KEY") || getEnv2("SUPABASE_ANON_KEY") || getEnv2("SUPABASE_SERVICE_ROLE_KEY");
var appEnv = getEnv2("VITE_APP_ENV") || getEnv2("VERCEL_ENV") || getEnv2("NODE_ENV") || "development";
var isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== "" && supabaseAnonKey.trim() !== ""
);
if (!isSupabaseConfigured) {
  console.warn(
    "[C\u1EA5u h\xECnh H\u1EC7 th\u1ED1ng] Ch\u01B0a c\u1EA5u h\xECnh VITE_SUPABASE_URL v\xE0 VITE_SUPABASE_ANON_KEY. \u1EE8ng d\u1EE5ng t\u1EF1 \u0111\u1ED9ng k\xEDch ho\u1EA1t ch\u1EBF \u0111\u1ED9 l\u01B0u tr\u1EEF LocalStorage/Offline an to\xE0n."
  );
}
if (appEnv === "sandbox" && supabaseUrl) {
  if (supabaseUrl.includes("prod-live") || supabaseUrl.includes("thcsnguyentrungtruc.edu.vn")) {
    throw new Error(
      "[R\xC0O CH\u1EAEN AN NINH] C\u1EA3nh b\xE1o nh\u1EA7m l\u1EABn m\xF4i tr\u01B0\u1EDDng: \u1EE8ng d\u1EE5ng \u0111ang \u1EDF ch\u1EBF \u0111\u1ED9 Sandbox nh\u01B0ng URL tr\u1ECF t\u1EDBi Live Production!"
    );
  }
}
var validUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder-khonggianvanhoahcm.supabase.co";
var validKey = isSupabaseConfigured ? supabaseAnonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-anon-key";
var supabase = createClient2(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// api/cms/storage-test.ts
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
      error: "SUPABASE_SERVICE_ROLE_KEY not configured on server",
      hasAnonKey: Boolean(supabase)
    });
  }
  try {
    const { data: buckets, error: listErr } = await admin.storage.listBuckets();
    let docBucket = buckets?.find((b) => b.name === "documents");
    let created = false;
    if (!docBucket) {
      const { data: createData, error: createErr } = await admin.storage.createBucket("documents", {
        public: true,
        fileSizeLimit: 52428800
        // 50MB
      });
      if (createErr) {
        console.warn("[CreateBucket Warning]", createErr);
      } else {
        created = true;
      }
    }
    const testPath = `uploads/test-${Date.now()}.pdf`;
    const { data: signedData, error: signErr } = await admin.storage.from("documents").createSignedUploadUrl(testPath);
    const { data: publicUrlData } = admin.storage.from("documents").getPublicUrl(testPath);
    return res.status(200).json({
      success: true,
      hasAdmin: true,
      buckets: buckets?.map((b) => b.name),
      bucketCreated: created,
      testPath,
      signedUploadUrl: signedData?.signedUrl,
      publicUrl: publicUrlData?.publicUrl,
      signErr: signErr?.message
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Exception during storage test"
    });
  }
}
export {
  handler as default
};
