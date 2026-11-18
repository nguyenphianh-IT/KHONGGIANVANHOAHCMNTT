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
var RESERVED_CONTEST_ID = "a0000000-0000-0000-0000-000000000001";
var RESERVED_RESOURCES_ID = "a0000000-0000-0000-0000-000000000002";
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
function generateSlug(title) {
  if (!title) return `bai-viet-${Date.now()}`;
  return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `bai-viet-${Date.now()}`;
}
async function handleGetCmsArticles() {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase URL & Anon Key" };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    const { data: itemsData, error: itemsErr } = await db.from("content_items").select("id, slug, is_deleted, published_revision_id, latest_draft_revision_id");
    if (itemsErr) {
      console.warn("[handleGetCmsArticles items error]", itemsErr.message);
    }
    const deletedItemIds = /* @__PURE__ */ new Set();
    const itemSlugMap = /* @__PURE__ */ new Map();
    if (itemsData) {
      for (const item of itemsData) {
        if (item.is_deleted) deletedItemIds.add(item.id);
        if (item.slug) itemSlugMap.set(item.id, item.slug);
      }
    }
    const { data: revsData, error: revsErr } = await db.from("content_revisions").select("id, item_id, title, summary, data, status, created_at, updated_at, author_id").order("updated_at", { ascending: false });
    if (revsErr) {
      return { success: false, error: `L\u1ED7i truy v\u1EA5n revisions: ${revsErr.message}` };
    }
    if (!revsData || revsData.length === 0) {
      return { success: true, articles: [], total: 0 };
    }
    const EXACT_DELETED_TEST_IDS = /* @__PURE__ */ new Set([
      "art-1794931991567",
      "art-1794934461061",
      "art-1794909786816",
      toValidUuid("art-1794931991567"),
      toValidUuid("art-1794934461061"),
      toValidUuid("art-1794909786816"),
      "6be75125-52eb-4678-b0ee-c94de607b24e",
      "d0000000-0000-0000-0000-000000000004",
      "d0000000-0000-0000-0000-000000000003"
    ]);
    const filteredRevs = revsData.filter((r) => {
      if (r.item_id === RESERVED_CONTEST_ID || r.item_id === RESERVED_RESOURCES_ID || r.item_id === RESERVED_MEDIA_LIBRARY_ID || r.item_id === RESERVED_DEPARTMENTS_ID) return false;
      if (deletedItemIds.has(r.item_id) || deletedItemIds.has(r.id)) return false;
      if (r.status === "archived") return false;
      const title = (r.title || "").trim();
      if (title.includes("H\u1ED3 S\u01A1 H\u1ED9i Thi") || title.includes("Kho T\u01B0 Li\u1EC7u S\u1ED1 H\xF3a") || title.includes("Kho Media") || title.includes("Danh M\u1EE5c T\u1ED5 Chuy\xEAn M\xF4n")) return false;
      if (title === "Test" || title === "B\u1EA3n th\u1EA3o nghi\xEAn c\u1EE9u Di ch\xFAc B\xE1c H\u1ED3" || title === "L\u1EDDi k\xEAu g\u1ECDi to\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn n\u0103m 1946" && r.status === "rejected") {
        return false;
      }
      if (r.data && r.data.slug === "test") {
        return false;
      }
      const rId = r.id || "";
      const rItem = r.item_id || "";
      const rLegacy = r.data && r.data.legacy_id || "";
      if (EXACT_DELETED_TEST_IDS.has(rId) || EXACT_DELETED_TEST_IDS.has(rItem) || EXACT_DELETED_TEST_IDS.has(rLegacy)) {
        return false;
      }
      return true;
    });
    const seenItemIds = /* @__PURE__ */ new Set();
    const mappedArticles = [];
    for (const rev of filteredRevs) {
      const itemId = rev.item_id || rev.id;
      if (seenItemIds.has(itemId)) continue;
      seenItemIds.add(itemId);
      const rData = rev.data || {};
      const articleId = rData.legacy_id && rData.legacy_id.startsWith("art-") ? rData.legacy_id : itemId;
      const slug = rData.slug || itemSlugMap.get(itemId) || generateSlug(rev.title);
      mappedArticles.push({
        id: articleId,
        title: rev.title,
        slug,
        summary: rev.summary || "",
        content: rData.content || "",
        category: rData.category || "article",
        topic: rData.topic || "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
        featured_image: rData.featured_image || "",
        media_assets: Array.isArray(rData.media_assets) ? rData.media_assets : [],
        references: rData.references || "",
        audio_url: rData.audio_url || "",
        audio_duration: rData.audio_duration || "",
        quote_id: rData.quote_id,
        custom_quote: rData.custom_quote || "",
        pdf_attachment: rData.pdf_attachment || void 0,
        status: rev.status || "draft",
        author_id: rData.author_id || rev.author_id || "",
        author_name: rData.author_name || "Ban Bi\xEAn T\u1EADp THCS Nguy\u1EC5n Trung Tr\u1EF1c",
        created_at: rev.created_at || "",
        updated_at: rev.updated_at || rev.created_at || ""
      });
    }
    return {
      success: true,
      articles: mappedArticles,
      total: mappedArticles.length
    };
  } catch (err) {
    console.error("[handleGetCmsArticles Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i ngo\u1EA1i l\u1EC7 khi t\u1EA3i b\xE0i vi\u1EBFt t\u1EEB Cloud" };
  }
}
async function handleSaveCmsArticle(article) {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Ch\u01B0a c\u1EA5u h\xECnh Supabase URL & Anon Key" };
  }
  if (!article || !article.title) {
    return { success: false, error: "Ti\xEAu \u0111\u1EC1 b\xE0i vi\u1EBFt kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng" };
  }
  const db = getSupabaseAdmin() || supabase;
  try {
    const rawId = article.id || `art-${Date.now()}`;
    let itemId = toValidUuid(rawId);
    const trimmedSlug = (article.slug || "").trim();
    const safeSlug = trimmedSlug.length > 2 ? trimmedSlug : generateSlug(article.title);
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    if (!article.id && safeSlug.length > 2) {
      const { data: itemBySlug } = await db.from("content_items").select("id, is_deleted").eq("slug", safeSlug).eq("is_deleted", false).limit(1);
      if (itemBySlug && itemBySlug.length > 0 && itemBySlug[0].id) {
        itemId = itemBySlug[0].id;
      }
    }
    const itemPayload = {
      id: itemId,
      content_type: "post",
      slug: safeSlug,
      created_by: SYSTEM_AUTHOR_ID,
      is_deleted: false,
      updated_at: nowIso
    };
    const { error: itemErr } = await db.from("content_items").upsert(itemPayload, { onConflict: "id" });
    if (itemErr) {
      if (itemErr.message?.includes("duplicate key") || itemErr.message?.includes("unique constraint") || itemErr.code === "23505") {
        itemPayload.slug = `${safeSlug}-${Math.floor(Math.random() * 1e3)}`;
        await db.from("content_items").upsert(itemPayload, { onConflict: "id" });
      } else {
        console.warn("[handleSaveCmsArticle itemUpsert Warning]", itemErr.message);
      }
    }
    const { data: revs } = await db.from("content_revisions").select("id, version_number, title, summary, status, data").eq("item_id", itemId).order("version_number", { ascending: false }).limit(1);
    const existingRev = revs && revs.length > 0 ? revs[0] : null;
    const existingData = existingRev?.data || {};
    const revId = existingRev ? existingRev.id : toValidUuid(`rev-${rawId}`);
    const nextVersion = existingRev ? existingRev.version_number || 1 : 1;
    const safeContent = article.content !== void 0 && article.content !== "" ? article.content : existingData.content || "";
    const safeSummary = article.summary !== void 0 && article.summary !== "" ? article.summary : existingRev?.summary || "";
    const safeFeaturedImage = article.featured_image !== void 0 && article.featured_image !== "" ? article.featured_image : existingData.featured_image || "";
    const safeMediaAssets = Array.isArray(article.media_assets) && article.media_assets.length > 0 ? article.media_assets : Array.isArray(existingData.media_assets) ? existingData.media_assets : [];
    const revPayload = {
      id: revId,
      item_id: itemId,
      version_number: nextVersion,
      title: article.title || existingRev?.title || "B\xE0i vi\u1EBFt",
      summary: safeSummary,
      status: article.status || existingRev?.status || "draft",
      author_id: SYSTEM_AUTHOR_ID,
      data: {
        summary: safeSummary,
        content: safeContent,
        category: article.category || existingData.category || "article",
        topic: article.topic || existingData.topic || "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
        featured_image: safeFeaturedImage,
        media_assets: safeMediaAssets,
        references: article.references || existingData.references || "",
        audio_url: article.audio_url || existingData.audio_url || "",
        audio_duration: article.audio_duration || existingData.audio_duration || "",
        quote_id: article.quote_id !== void 0 ? article.quote_id : existingData.quote_id,
        custom_quote: article.custom_quote !== void 0 ? article.custom_quote : existingData.custom_quote || "",
        pdf_attachment: article.pdf_attachment !== void 0 ? article.pdf_attachment : existingData.pdf_attachment || void 0,
        author_name: article.author_name || existingData.author_name || "Ban Bi\xEAn T\u1EADp THCS Nguy\u1EC5n Trung Tr\u1EF1c",
        author_id: article.author_id || existingData.author_id || "",
        slug: itemPayload.slug,
        legacy_id: rawId,
        tags: [article.category || existingData.category, article.topic || existingData.topic || ""].filter(Boolean),
        synced_at: nowIso
      },
      updated_at: nowIso
    };
    if (article.status === "published") {
      revPayload.reviewed_at = nowIso;
      revPayload.reviewed_by = SYSTEM_AUTHOR_ID;
    } else if (article.status === "pending") {
      revPayload.submitted_at = nowIso;
    }
    const { error: revErr } = await db.from("content_revisions").upsert(revPayload, { onConflict: "id" });
    if (revErr) {
      console.warn("[handleSaveCmsArticle revUpsert Error]", revErr.message);
      return { success: false, error: `L\u1ED7i l\u01B0u revision b\xE0i vi\u1EBFt: ${revErr.message}` };
    }
    if (article.status === "published") {
      await db.from("content_items").update({ published_revision_id: revId, latest_draft_revision_id: null, updated_at: nowIso }).eq("id", itemId);
    } else {
      await db.from("content_items").update({ latest_draft_revision_id: revId, updated_at: nowIso }).eq("id", itemId);
    }
    const syncedArticle = {
      ...article,
      id: rawId,
      slug: itemPayload.slug,
      updated_at: nowIso
    };
    return {
      success: true,
      article: syncedArticle
    };
  } catch (err) {
    console.error("[handleSaveCmsArticle Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i ngo\u1EA1i l\u1EC7 khi l\u01B0u b\xE0i vi\u1EBFt l\xEAn Cloud" };
  }
}
async function handleDeleteCmsArticle(articleId) {
  if (!isSupabaseConfigured) return { success: true };
  if (!articleId) return { success: false, error: "Thi\u1EBFu m\xE3 b\xE0i vi\u1EBFt" };
  const db = getSupabaseAdmin() || supabase;
  const itemId = toValidUuid(articleId);
  try {
    await db.from("content_items").update({ is_deleted: true }).or(`id.eq.${itemId},slug.eq.${articleId}`);
    await db.from("content_items").upsert({
      id: itemId,
      content_type: "post",
      created_by: SYSTEM_AUTHOR_ID,
      is_deleted: true,
      slug: `deleted-${articleId.slice(0, 20)}-${Date.now().toString(36)}`
    }, { onConflict: "id" });
    await db.from("content_revisions").update({ status: "archived", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).or(`id.eq.${itemId},item_id.eq.${itemId}`);
    if (articleId.startsWith("art-")) {
      await db.from("content_revisions").update({ status: "archived", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).contains("data", { legacy_id: articleId });
    }
    return { success: true };
  } catch (err) {
    console.error("[handleDeleteCmsArticle Exception]", err);
    return { success: false, error: err?.message || "L\u1ED7i khi x\xF3a b\xE0i vi\u1EBFt" };
  }
}

// api/cms/articles.ts
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  try {
    if (req.method === "GET") {
      const result = await handleGetCmsArticles();
      return res.status(result.success ? 200 : 500).json(result);
    }
    if (req.method === "POST") {
      const articlePayload = req.body?.article || req.body;
      const result = await handleSaveCmsArticle(articlePayload);
      return res.status(result.success ? 200 : 400).json(result);
    }
    if (req.method === "DELETE") {
      const id = req.query?.id || req.body?.id;
      const result = await handleDeleteCmsArticle(id);
      return res.status(result.success ? 200 : 400).json(result);
    }
    return res.status(405).json({ success: false, error: "Ph\u01B0\u01A1ng th\u1EE9c kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 (Method Not Allowed)" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || "L\u1ED7i x\u1EED l\xFD m\xE1y ch\u1EE7" });
  }
}
export {
  handler as default
};
