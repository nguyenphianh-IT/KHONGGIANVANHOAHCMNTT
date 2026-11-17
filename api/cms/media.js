// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var getEnv = (key) => {
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
var supabaseUrl = getEnv("VITE_SUPABASE_URL") || getEnv("SUPABASE_URL");
var supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY") || getEnv("SUPABASE_SERVICE_ROLE_KEY");
var appEnv = getEnv("VITE_APP_ENV") || getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || "development";
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
var supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// src/lib/supabaseBackend.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
var getEnv2 = (key) => {
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
  const url = getEnv2("SUPABASE_URL") || getEnv2("VITE_SUPABASE_URL");
  const serviceKey = getEnv2("SUPABASE_SERVICE_ROLE_KEY") || getEnv2("SUPABASE_SERVICE_KEY");
  if (!url || !serviceKey || serviceKey.trim() === "") {
    return null;
  }
  _supabaseAdmin = createClient2(url, serviceKey.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  return _supabaseAdmin;
};

// src/lib/cmsBackend.ts
var SYSTEM_AUTHOR_ID = "c4821ce7-7c41-45d2-bb9d-ebf7b2228004";
var RESERVED_MEDIA_LIBRARY_ID = "a0000000-0000-0000-0000-000000000003";
function toValidUuid(id) {
  if (!id) return "f" + "0".repeat(31);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id.toLowerCase();
  const legacyMap = {
    "art-001": "d0000000-0000-0000-0000-000000000001",
    "art-002": "c0000000-0000-0000-0000-000000000002",
    "art-003": "c0000000-0000-0000-0000-000000000003",
    "art-004": "c0000000-0000-0000-0000-000000000004",
    "art-005": "c0000000-0000-0000-0000-000000000005"
  };
  if (legacyMap[id]) return legacyMap[id];
  let h1 = 3735928559, h2 = 1103547991;
  for (let i = 0; i < id.length; i++) {
    const ch = id.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const s1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const s2 = (h2 >>> 0).toString(16).padStart(8, "0");
  const s3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
  const s4 = (h1 + h2 >>> 0).toString(16).padStart(8, "0");
  const full = `${s1}${s2}${s3}${s4}`.substring(0, 32);
  return `${full.substring(0, 8)}-${full.substring(8, 12)}-4000-a000-${full.substring(16, 28)}`;
}
async function handleGetCmsMedia(mediaId) {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase URL & Anon Key" };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: revs } = await db.from("content_revisions").select("data").eq("item_id", RESERVED_MEDIA_LIBRARY_ID).order("version_number", { ascending: false }).limit(1);
    let libraryAssets = [];
    if (revs && revs.length > 0 && revs[0].data && Array.isArray(revs[0].data.assets)) {
      libraryAssets = revs[0].data.assets;
    }
    if (mediaId) {
      const foundInLib = libraryAssets.find((a) => a.id === mediaId || a.name === mediaId);
      if (foundInLib) {
        return { success: true, asset: foundInLib };
      }
      const { data: articleRevs2 } = await db.from("content_revisions").select("data").order("updated_at", { ascending: false });
      if (articleRevs2) {
        for (const rev of articleRevs2) {
          if (rev.data && Array.isArray(rev.data.media_assets)) {
            const foundInArt = rev.data.media_assets.find(
              (a) => a.id === mediaId || a.name === mediaId
            );
            if (foundInArt) {
              return { success: true, asset: foundInArt };
            }
          }
        }
      }
      return { success: false, error: "Kh\xF4ng t\xECm th\u1EA5y t\u01B0 li\u1EC7u media" };
    }
    const { data: articleRevs } = await db.from("content_revisions").select("data").order("updated_at", { ascending: false });
    const assetMap = /* @__PURE__ */ new Map();
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
  } catch (err) {
    console.error("[handleGetCmsMedia Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i truy v\u1EA5n media t\u1EEB Cloud" };
  }
}
async function handleSaveCmsMedia(newAssets) {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase URL & Anon Key" };
  }
  const toAdd = Array.isArray(newAssets) ? newAssets : [newAssets];
  if (toAdd.length === 0) return { success: true, count: 0 };
  const db = getSupabaseAdmin() || supabase;
  try {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const { error: itemErr } = await db.from("content_items").upsert(
      {
        id: RESERVED_MEDIA_LIBRARY_ID,
        content_type: "media_library",
        slug: "kho-media-tu-lieu-so-hoa",
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: false,
        updated_at: nowIso
      },
      { onConflict: "id" }
    );
    if (itemErr) {
      console.warn("[handleSaveCmsMedia itemUpsert error]", itemErr.message);
    }
    const { data: revs } = await db.from("content_revisions").select("id, version_number, data").eq("item_id", RESERVED_MEDIA_LIBRARY_ID).order("version_number", { ascending: false }).limit(1);
    const existingRev = revs && revs.length > 0 ? revs[0] : null;
    let existingAssets = [];
    if (existingRev && existingRev.data && Array.isArray(existingRev.data.assets)) {
      existingAssets = existingRev.data.assets;
    }
    const assetMap = /* @__PURE__ */ new Map();
    for (const a of existingAssets) {
      if (a && a.id) assetMap.set(a.id, a);
    }
    for (const a of toAdd) {
      if (a && a.id) assetMap.set(a.id, a);
    }
    const mergedAssets = Array.from(assetMap.values());
    const revId = existingRev ? existingRev.id : toValidUuid("rev-media-library");
    const versionNumber = (existingRev?.version_number || 0) + 1;
    const { error: revErr } = await db.from("content_revisions").upsert(
      {
        id: revId,
        item_id: RESERVED_MEDIA_LIBRARY_ID,
        version_number: versionNumber,
        title: "Kho Media T\u01B0 Li\u1EC7u S\u1ED1 H\xF3a",
        summary: `Kho l\u01B0u tr\u1EEF ${mergedAssets.length} t\u01B0 li\u1EC7u h\xECnh \u1EA3nh v\xE0 \u0111a ph\u01B0\u01A1ng ti\u1EC7n \u0111\u1ED3ng b\u1ED9`,
        status: "published",
        author_id: SYSTEM_AUTHOR_ID,
        data: {
          assets: mergedAssets,
          synced_at: nowIso
        },
        updated_at: nowIso
      },
      { onConflict: "id" }
    );
    if (revErr) {
      return { success: false, error: revErr.message };
    }
    await db.from("content_items").update({
      published_revision_id: revId,
      updated_at: nowIso
    }).eq("id", RESERVED_MEDIA_LIBRARY_ID);
    return { success: true, count: mergedAssets.length };
  } catch (err) {
    console.error("[handleSaveCmsMedia Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i l\u01B0u tr\u1EEF media l\xEAn Cloud" };
  }
}
async function handleDeleteCmsMedia(id) {
  if (!isSupabaseConfigured) return { success: true };
  if (!id) return { success: false, error: "Thi\u1EBFu m\xE3 media" };
  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: revs } = await db.from("content_revisions").select("id, version_number, data").eq("item_id", RESERVED_MEDIA_LIBRARY_ID).order("version_number", { ascending: false }).limit(1);
    if (!revs || revs.length === 0 || !revs[0].data || !Array.isArray(revs[0].data.assets)) {
      return { success: true };
    }
    const existingAssets = revs[0].data.assets;
    const filteredAssets = existingAssets.filter((a) => a.id !== id && a.name !== id);
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    await db.from("content_revisions").update({
      data: {
        assets: filteredAssets,
        synced_at: nowIso
      },
      updated_at: nowIso
    }).eq("id", revs[0].id);
    return { success: true };
  } catch (err) {
    console.error("[handleDeleteCmsMedia Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i khi x\xF3a media" };
  }
}

// api/cms/media.ts
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  try {
    if (req.method === "GET") {
      const id = req.query.id;
      const result = await handleGetCmsMedia(id);
      return res.status(result.success ? 200 : 404).json(result);
    }
    if (req.method === "POST") {
      const body = req.body || {};
      const asset = body.asset || body.assets;
      if (!asset) {
        return res.status(400).json({ success: false, error: "Thi\u1EBFu d\u1EEF li\u1EC7u asset" });
      }
      const result = await handleSaveCmsMedia(asset);
      return res.status(result.success ? 200 : 500).json(result);
    }
    if (req.method === "DELETE") {
      const id = req.query.id || req.body && req.body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: "Thi\u1EBFu m\xE3 media" });
      }
      const result = await handleDeleteCmsMedia(id);
      return res.status(result.success ? 200 : 500).json(result);
    }
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || "Internal Server Error" });
  }
}
export {
  handler as default
};
