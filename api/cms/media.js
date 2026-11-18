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
var RESERVED_DEPARTMENTS_ID = "a0000000-0000-0000-0000-000000000004";
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
    const { data: existingItem } = await db.from("content_items").select("id, slug").eq("id", RESERVED_MEDIA_LIBRARY_ID).maybeSingle();
    if (!existingItem) {
      const { data: slugItem } = await db.from("content_items").select("id").eq("slug", "kho-media-tu-lieu-so-hoa").maybeSingle();
      const mediaSlug = slugItem ? `kho-media-so-hoa-${Date.now()}` : "kho-media-tu-lieu-so-hoa";
      const { error: itemErr } = await db.from("content_items").insert({
        id: RESERVED_MEDIA_LIBRARY_ID,
        content_type: "post",
        slug: mediaSlug,
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: false,
        updated_at: nowIso
      });
      if (itemErr) {
        return {
          success: false,
          error: `L\u1ED7i t\u1EA1o content_items media: ${itemErr.message} (Code: ${itemErr.code})`
        };
      }
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
var DEFAULT_DEPARTMENTS = [
  { id: "dept-bgh", name: "Ban Gi\xE1m Hi\u1EC7u", code: "BGH", description: "Ban Gi\xE1m Hi\u1EC7u nh\xE0 tr\u01B0\u1EDDng & H\u1ED9i \u0111\u1ED3ng ki\u1EC3m duy\u1EC7t 4 m\u1EAFt" },
  { id: "dept-lsdl", name: "T\u1ED5 L\u1ECBch s\u1EED - \u0110\u1ECBa l\xFD", code: "LSDL", description: "T\u1ED5 chuy\xEAn m\xF4n L\u1ECBch s\u1EED, \u0110\u1ECBa l\xFD & T\u01B0 li\u1EC7u truy\u1EC1n th\u1ED1ng" },
  { id: "dept-nvgdcd", name: "T\u1ED5 Ng\u1EEF v\u0103n - GDCD", code: "NVGDCD", description: "T\u1ED5 chuy\xEAn m\xF4n Ng\u1EEF v\u0103n, Gi\xE1o d\u1EE5c c\xF4ng d\xE2n & \u0110\u1EA1o \u0111\u1EE9c H\u1ED3 Ch\xED Minh" },
  { id: "dept-toantin", name: "T\u1ED5 To\xE1n - Tin h\u1ECDc", code: "TOANTIN", description: "T\u1ED5 chuy\xEAn m\xF4n To\xE1n, Tin h\u1ECDc & Chuy\u1EC3n \u0111\u1ED5i s\u1ED1 h\u1ECDc \u0111\u01B0\u1EDDng" },
  { id: "dept-khtn", name: "T\u1ED5 Khoa h\u1ECDc t\u1EF1 nhi\xEAn", code: "KHTN", description: "T\u1ED5 chuy\xEAn m\xF4n Khoa h\u1ECDc t\u1EF1 nhi\xEAn (L\xFD - H\xF3a - Sinh)" },
  { id: "dept-ngoaingu", name: "T\u1ED5 Ngo\u1EA1i ng\u1EEF", code: "NN", description: "T\u1ED5 chuy\xEAn m\xF4n Ti\u1EBFng Anh & H\u1ED9i nh\u1EADp qu\u1ED1c t\u1EBF" },
  { id: "dept-doandoi", name: "\u0110o\xE0n - \u0110\u1ED9i - Ho\u1EA1t \u0111\u1ED9ng tr\u1EA3i nghi\u1EC7m", code: "DOANDOI", description: "Chi \u0111o\xE0n, Li\xEAn \u0111\u1ED9i TNTP H\u1ED3 Ch\xED Minh & Phong tr\xE0o h\u1ECDc sinh" },
  { id: "dept-vanphong", name: "T\u1ED5 V\u0103n ph\xF2ng", code: "VP", description: "H\xE0nh ch\xEDnh, Th\u01B0 vi\u1EC7n, Thi\u1EBFt b\u1ECB & Truy\u1EC1n th\xF4ng nh\xE0 tr\u01B0\u1EDDng" }
];
async function verifyAdminFromAuthHeader(authHeader) {
  if (!isSupabaseConfigured) {
    return { authorized: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase tr\xEAn m\xE1y ch\u1EE7." };
  }
  const db = getSupabaseAdmin();
  if (!db) {
    return { authorized: false, error: "M\xE1y ch\u1EE7 ch\u01B0a c\u1EA5u h\xECnh SUPABASE_SERVICE_ROLE_KEY." };
  }
  const token = (authHeader || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return { authorized: false, error: "Thi\u1EBFu m\xE3 phi\xEAn \u0111\u0103ng nh\u1EADp (Authorization Bearer Token)." };
  }
  try {
    const { data: userData, error: userErr } = await db.auth.getUser(token);
    if (userErr || !userData?.user) {
      return { authorized: false, error: "Phi\xEAn \u0111\u0103ng nh\u1EADp kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng \u0111\u0103ng nh\u1EADp l\u1EA1i." };
    }
    const userId = userData.user.id;
    const { data: roleRows, error: roleErr } = await db.from("user_roles").select("roles(code)").eq("user_id", userId);
    if (roleErr) {
      return { authorized: false, error: `Kh\xF4ng th\u1EC3 ki\u1EC3m tra quy\u1EC1n qu\u1EA3n tr\u1ECB: ${roleErr.message}` };
    }
    const isAdminUser = (roleRows || []).some((r) => {
      const code = r?.roles?.code;
      return code === "admin" || code === "super_admin";
    });
    if (!isAdminUser) {
      return { authorized: false, error: "Ch\u1EC9 Qu\u1EA3n tr\u1ECB vi\xEAn (Admin / Ban Gi\xE1m Hi\u1EC7u) m\u1EDBi c\xF3 quy\u1EC1n th\u1EF1c hi\u1EC7n thao t\xE1c n\xE0y." };
    }
    return { authorized: true, userId, email: userData.user.email || "" };
  } catch (err) {
    return { authorized: false, error: err?.message || "L\u1ED7i x\xE1c th\u1EF1c quy\u1EC1n Admin." };
  }
}
async function handleGetDepartments() {
  if (!isSupabaseConfigured) {
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: rev } = await db.from("content_revisions").select("data").eq("item_id", RESERVED_DEPARTMENTS_ID).order("version_number", { ascending: false }).limit(1).maybeSingle();
    if (rev?.data && Array.isArray(rev.data.departments) && rev.data.departments.length > 0) {
      return { success: true, departments: rev.data.departments };
    }
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  } catch (err) {
    console.error("[handleGetDepartments Exception]", err);
    return { success: true, departments: DEFAULT_DEPARTMENTS };
  }
}
async function handleSaveDepartments(departments, renameFrom, renameTo) {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase" };
  }
  if (!Array.isArray(departments)) {
    return { success: false, error: "Danh s\xE1ch t\u1ED5 chuy\xEAn m\xF4n kh\xF4ng h\u1EE3p l\u1EC7" };
  }
  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: "M\xE1y ch\u1EE7 thi\u1EBFu kh\xF3a qu\u1EA3n tr\u1ECB SUPABASE_SERVICE_ROLE_KEY" };
  }
  try {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const cleanedDepartments = departments.filter((d) => d && typeof d.name === "string" && d.name.trim().length > 0).map((d) => ({
      id: d.id || `dept-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: d.name.trim(),
      code: (d.code || "").trim().toUpperCase(),
      description: (d.description || "").trim(),
      head_name: (d.head_name || "").trim(),
      created_at: d.created_at || nowIso
    }));
    await db.from("content_items").upsert(
      {
        id: RESERVED_DEPARTMENTS_ID,
        content_type: "post",
        slug: "cms-departments-catalog",
        created_by: SYSTEM_AUTHOR_ID,
        is_deleted: false,
        updated_at: nowIso
      },
      { onConflict: "id" }
    );
    const { data: existingRev } = await db.from("content_revisions").select("id, version_number").eq("item_id", RESERVED_DEPARTMENTS_ID).order("version_number", { ascending: false }).limit(1).maybeSingle();
    const revId = existingRev?.id || toValidUuid(`rev-departments-${RESERVED_DEPARTMENTS_ID}`);
    const versionNumber = existingRev?.version_number || 1;
    const { error: revErr } = await db.from("content_revisions").upsert(
      {
        id: revId,
        item_id: RESERVED_DEPARTMENTS_ID,
        version_number: versionNumber,
        title: "Danh M\u1EE5c T\u1ED5 Chuy\xEAn M\xF4n",
        summary: "Danh m\u1EE5c t\u1ED5 chuy\xEAn m\xF4n v\xE0 ph\xF2ng ban do Ban Gi\xE1m Hi\u1EC7u / Admin khai b\xE1o.",
        status: "published",
        author_id: SYSTEM_AUTHOR_ID,
        data: {
          departments: cleanedDepartments,
          updated_at: nowIso
        },
        updated_at: nowIso
      },
      { onConflict: "id" }
    );
    if (revErr) {
      return { success: false, error: revErr.message };
    }
    await db.from("content_items").update({ published_revision_id: revId, updated_at: nowIso }).eq("id", RESERVED_DEPARTMENTS_ID);
    if (renameFrom && renameTo && renameFrom.trim() !== renameTo.trim()) {
      await db.from("profiles").update({ department: renameTo.trim(), updated_at: nowIso }).eq("department", renameFrom.trim());
    }
    return { success: true, departments: cleanedDepartments };
  } catch (err) {
    console.error("[handleSaveDepartments Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i khi l\u01B0u danh m\u1EE5c t\u1ED5 chuy\xEAn m\xF4n" };
  }
}
async function handleAdminListStaff() {
  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: "M\xE1y ch\u1EE7 thi\u1EBFu kh\xF3a qu\u1EA3n tr\u1ECB SUPABASE_SERVICE_ROLE_KEY" };
  }
  try {
    const [{ data: profilesData, error: profErr }, { data: rolesData }, { data: authUsersData }] = await Promise.all([
      db.from("profiles").select("id, full_name, department, status, email, created_at").order("created_at", { ascending: false }),
      db.from("user_roles").select("user_id, roles(code, name)"),
      db.auth.admin.listUsers({ perPage: 500 })
    ]);
    if (profErr) {
      return { success: false, error: profErr.message };
    }
    const authEmailMap = /* @__PURE__ */ new Map();
    for (const u of authUsersData?.users || []) {
      if (u.id && u.email) authEmailMap.set(u.id, u.email);
    }
    const roleMap = /* @__PURE__ */ new Map();
    for (const r of rolesData || []) {
      if (r?.user_id && r?.roles?.code) {
        const existing = roleMap.get(r.user_id);
        if (!existing || r.roles.code === "super_admin" || r.roles.code === "admin") {
          roleMap.set(r.user_id, { code: r.roles.code, name: r.roles.name });
        }
      }
    }
    const staff = (profilesData || []).filter((p) => p.status !== "inactive").map((p) => {
      const rInfo = roleMap.get(p.id) || { code: "editor", name: "Bi\xEAn t\u1EADp vi\xEAn n\u1ED9i dung" };
      const normRole = rInfo.code === "admin" || rInfo.code === "super_admin" ? "admin" : rInfo.code === "viewer" ? "viewer" : "editor";
      return {
        id: p.id,
        email: authEmailMap.get(p.id) || p.email || `${String(p.id).slice(0, 8)}@thcsnguyentrungtruc.edu.vn`,
        full_name: p.full_name || "C\xE1n b\u1ED9 tr\u01B0\u1EDDng",
        department: p.department || "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
        role: normRole,
        role_name: normRole === "admin" ? "Qu\u1EA3n tr\u1ECB vi\xEAn (Admin)" : normRole === "viewer" ? "C\u1ED1 v\u1EA5n / Xem t\u01B0 li\u1EC7u" : "Bi\xEAn t\u1EADp vi\xEAn n\u1ED9i dung",
        status: p.status || "active",
        created_at: p.created_at
      };
    });
    return { success: true, staff };
  } catch (err) {
    console.error("[handleAdminListStaff Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i t\u1EA3i danh s\xE1ch t\xE0i kho\u1EA3n c\xE1n b\u1ED9" };
  }
}
async function handleAdminUpdateStaff(payload, adminUserId) {
  const db = getSupabaseAdmin();
  if (!db) {
    return { success: false, error: "M\xE1y ch\u1EE7 thi\u1EBFu kh\xF3a qu\u1EA3n tr\u1ECB SUPABASE_SERVICE_ROLE_KEY" };
  }
  const { id, full_name, email, department, role, status, new_password } = payload || {};
  if (!id || !full_name?.trim()) {
    return { success: false, error: "Thi\u1EBFu m\xE3 t\xE0i kho\u1EA3n ho\u1EB7c h\u1ECD v\xE0 t\xEAn gi\xE1o vi\xEAn." };
  }
  const cleanName = full_name.trim();
  const cleanDept = (department || "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c").trim();
  const cleanEmail = email ? email.trim().toLowerCase() : void 0;
  const cleanStatus = status === "suspended" || status === "inactive" ? status : "active";
  const cleanRole = role === "admin" || role === "viewer" ? role : "editor";
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: "\u0110\u1ECBa ch\u1EC9 email kh\xF4ng h\u1EE3p l\u1EC7." };
  }
  if (new_password && new_password.length < 8) {
    return { success: false, error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 t\u1ED1i thi\u1EC3u 8 k\xFD t\u1EF1." };
  }
  if (id === adminUserId) {
    if (cleanStatus !== "active") {
      return { success: false, error: "Kh\xF4ng th\u1EC3 t\u1EF1 t\u1EA1m kh\xF3a t\xE0i kho\u1EA3n qu\u1EA3n tr\u1ECB \u0111ang \u0111\u0103ng nh\u1EADp." };
    }
    if (cleanRole !== "admin") {
      return { success: false, error: "Kh\xF4ng th\u1EC3 t\u1EF1 h\u1EA1 quy\u1EC1n qu\u1EA3n tr\u1ECB c\u1EE7a ch\xEDnh t\xE0i kho\u1EA3n \u0111ang \u0111\u0103ng nh\u1EADp." };
    }
  }
  try {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const authUpdates = {
      user_metadata: {
        full_name: cleanName,
        department: cleanDept
      },
      ban_duration: cleanStatus === "active" ? "none" : "876000h"
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
      console.warn("[handleAdminUpdateStaff auth.admin.updateUserById warning]", authErr.message);
      if (authErr.message?.toLowerCase().includes("already") || authErr.message?.toLowerCase().includes("duplicate") || authErr.message?.toLowerCase().includes("exists")) {
        return { success: false, error: `Email "${cleanEmail}" \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng b\u1EDFi t\xE0i kho\u1EA3n kh\xE1c.` };
      }
      if (!authErr.message?.toLowerCase().includes("not found")) {
        return { success: false, error: `L\u1ED7i c\u1EADp nh\u1EADt x\xE1c th\u1EF1c t\xE0i kho\u1EA3n: ${authErr.message}` };
      }
    }
    const profilePatch = {
      full_name: cleanName,
      department: cleanDept,
      status: cleanStatus,
      updated_at: nowIso
    };
    if (cleanEmail) {
      profilePatch.email = cleanEmail;
    }
    const { error: profErr } = await db.from("profiles").update(profilePatch).eq("id", id);
    if (profErr) {
      return { success: false, error: `L\u1ED7i c\u1EADp nh\u1EADt h\u1ED3 s\u01A1 profiles: ${profErr.message}` };
    }
    const { data: roleRow, error: roleLookupErr } = await db.from("roles").select("id, code, name").eq("code", cleanRole).maybeSingle();
    if (!roleLookupErr && roleRow?.id) {
      await db.from("user_roles").delete().eq("user_id", id);
      const { error: insertRoleErr } = await db.from("user_roles").insert({
        user_id: id,
        role_id: roleRow.id,
        assigned_by: adminUserId
      });
      if (insertRoleErr) {
        return { success: false, error: `L\u1ED7i c\u1EADp nh\u1EADt vai tr\xF2 ph\xE2n quy\u1EC1n: ${insertRoleErr.message}` };
      }
    }
    const roleLabels = {
      admin: "Qu\u1EA3n tr\u1ECB vi\xEAn (Admin)",
      editor: "Bi\xEAn t\u1EADp vi\xEAn n\u1ED9i dung",
      viewer: "C\u1ED1 v\u1EA5n / Xem t\u01B0 li\u1EC7u"
    };
    return {
      success: true,
      staff: {
        id,
        email: updatedAuthUser?.user?.email || cleanEmail || "",
        full_name: cleanName,
        department: cleanDept,
        role: cleanRole,
        role_name: roleLabels[cleanRole],
        status: cleanStatus
      }
    };
  } catch (err) {
    console.error("[handleAdminUpdateStaff Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i h\u1EC7 th\u1ED1ng khi c\u1EADp nh\u1EADt t\xE0i kho\u1EA3n gi\xE1o vi\xEAn." };
  }
}

// api/cms/media.ts
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  try {
    const resource = req.query.resource || "";
    if (resource === "departments") {
      if (req.method === "GET") {
        const result = await handleGetDepartments();
        return res.status(result.success ? 200 : 500).json(result);
      }
      if (req.method === "POST" || req.method === "PUT") {
        const authCheck = await verifyAdminFromAuthHeader(req.headers.authorization);
        if (!authCheck.authorized) {
          return res.status(403).json({ success: false, error: authCheck.error });
        }
        const body = req.body || {};
        const result = await handleSaveDepartments(
          body.departments,
          body.renameFrom,
          body.renameTo
        );
        return res.status(result.success ? 200 : 400).json(result);
      }
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
    if (resource === "staff") {
      const authCheck = await verifyAdminFromAuthHeader(req.headers.authorization);
      if (!authCheck.authorized || !authCheck.userId) {
        return res.status(403).json({ success: false, error: authCheck.error });
      }
      if (req.method === "GET") {
        const result = await handleAdminListStaff();
        return res.status(result.success ? 200 : 500).json(result);
      }
      if (req.method === "PUT" || req.method === "POST") {
        const body = req.body || {};
        const payload = body.staff || body;
        const result = await handleAdminUpdateStaff(payload, authCheck.userId);
        return res.status(result.success ? 200 : 400).json(result);
      }
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
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
