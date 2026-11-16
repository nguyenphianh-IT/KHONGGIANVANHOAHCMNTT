// src/rag/retrieval/textNormalizer.ts
var VIETNAMESE_ACCENT_MAP = {
  \u00E0: "a",
  \u00E1: "a",
  \u1EA3: "a",
  \u00E3: "a",
  \u1EA1: "a",
  \u0103: "a",
  \u1EB1: "a",
  \u1EAF: "a",
  \u1EB3: "a",
  \u1EB5: "a",
  \u1EB7: "a",
  \u00E2: "a",
  \u1EA7: "a",
  \u1EA5: "a",
  \u1EA9: "a",
  \u1EAB: "a",
  \u1EAD: "a",
  \u00E8: "e",
  \u00E9: "e",
  \u1EBB: "e",
  \u1EBD: "e",
  \u1EB9: "e",
  \u00EA: "e",
  \u1EC1: "e",
  \u1EBF: "e",
  \u1EC3: "e",
  \u1EC5: "e",
  \u1EC7: "e",
  \u00EC: "i",
  \u00ED: "i",
  \u1EC9: "i",
  \u0129: "i",
  \u1ECB: "i",
  \u00F2: "o",
  \u00F3: "o",
  \u1ECF: "o",
  \u00F5: "o",
  \u1ECD: "o",
  \u00F4: "o",
  \u1ED3: "o",
  \u1ED1: "o",
  \u1ED5: "o",
  \u1ED7: "o",
  \u1ED9: "o",
  \u01A1: "o",
  \u1EDD: "o",
  \u1EDB: "o",
  \u1EDF: "o",
  \u1EE1: "o",
  \u1EE3: "o",
  \u00F9: "u",
  \u00FA: "u",
  \u1EE7: "u",
  \u0169: "u",
  \u1EE5: "u",
  \u01B0: "u",
  \u01B0\u0300: "u",
  \u1EE9: "u",
  \u1EED: "u",
  \u1EEF: "u",
  \u1EF1: "u",
  \u1EF3: "y",
  \u00FD: "y",
  \u1EF7: "y",
  \u1EF9: "y",
  \u1EF5: "y",
  \u0111: "d",
  \u00C0: "a",
  \u00C1: "a",
  \u1EA2: "a",
  \u00C3: "a",
  \u1EA0: "a",
  \u0102: "a",
  \u1EB0: "a",
  \u1EAE: "a",
  \u1EB2: "a",
  \u1EB4: "a",
  \u1EB6: "a",
  \u00C2: "a",
  \u1EA6: "a",
  \u1EA4: "a",
  \u1EA8: "a",
  \u1EAA: "a",
  \u1EAC: "a",
  \u00C8: "e",
  \u00C9: "e",
  \u1EBA: "e",
  \u1EBC: "e",
  \u1EB8: "e",
  \u00CA: "e",
  \u1EC0: "e",
  \u1EBE: "e",
  \u1EC2: "e",
  \u1EC4: "e",
  \u1EC6: "e",
  \u00CC: "i",
  \u00CD: "i",
  \u1EC8: "i",
  \u0128: "i",
  \u1ECA: "i",
  \u00D2: "o",
  \u00D3: "o",
  \u1ECE: "o",
  \u00D5: "o",
  \u1ECC: "o",
  \u00D4: "o",
  \u1ED2: "o",
  \u1ED0: "o",
  \u1ED4: "o",
  \u1ED6: "o",
  \u1ED8: "o",
  \u01A0: "o",
  \u1EDC: "o",
  \u1EDA: "o",
  \u1EDE: "o",
  \u1EE0: "o",
  \u1EE2: "o",
  \u00D9: "u",
  \u00DA: "u",
  \u1EE6: "u",
  \u0168: "u",
  \u1EE4: "u",
  \u01AF: "u",
  \u1EEA: "u",
  \u1EE8: "u",
  \u1EEC: "u",
  \u1EEE: "u",
  \u1EF0: "u",
  \u1EF2: "y",
  \u00DD: "y",
  \u1EF6: "y",
  \u1EF8: "y",
  \u1EF4: "y",
  \u0110: "d"
};
var VIETNAMESE_STOPWORDS = /* @__PURE__ */ new Set([
  "va",
  "hoac",
  "la",
  "nhung",
  "ma",
  "cua",
  "cho",
  "den",
  "tu",
  "trong",
  "tren",
  "duoi",
  "voi",
  "ve",
  "ra",
  "vao",
  "o",
  "tai",
  "rat",
  "qua",
  "nhu",
  "the",
  "nay",
  "do",
  "kia",
  "ay",
  "cac",
  "mot",
  "co",
  "khong",
  "duoc",
  "se",
  "da",
  "dang",
  "ngay",
  "nao",
  "sao",
  "gi",
  "ai",
  "dau",
  "khi",
  "luc",
  "lai",
  "roi",
  "boi",
  "vi",
  "hay",
  "nen",
  "de"
]);
function removeVietnameseAccents(str) {
  if (!str) return "";
  return str.split("").map((ch) => VIETNAMESE_ACCENT_MAP[ch] || ch).join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function normalizeText(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(str, removeStopwords = false) {
  const normalized = normalizeText(str);
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  if (removeStopwords) {
    return tokens.filter((t) => {
      const nonAccented = removeVietnameseAccents(t);
      return !VIETNAMESE_STOPWORDS.has(nonAccented);
    });
  }
  return tokens;
}
function extractNGrams(tokens) {
  const result = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return result;
}

// src/rag/retrieval/bm25Retriever.ts
var BM25Retriever = class {
  k1 = 1.5;
  b = 0.75;
  docs = [];
  avgDocLength = 0;
  docFreqAccented = /* @__PURE__ */ new Map();
  docFreqNonAccented = /* @__PURE__ */ new Map();
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
  }
  /**
   * Build index from chunks
   */
  buildIndex(chunks) {
    this.docs = [];
    this.docFreqAccented.clear();
    this.docFreqNonAccented.clear();
    if (chunks.length === 0) {
      this.avgDocLength = 0;
      return;
    }
    let totalLength = 0;
    for (const chunk of chunks) {
      const fullSearchText = `${chunk.documentTitle} ${chunk.topic} ${chunk.content}`;
      const accentedTokens = tokenize(fullSearchText, true);
      const nonAccentedTokens = accentedTokens.map((t) => removeVietnameseAccents(t));
      const tokenCountsAccented = /* @__PURE__ */ new Map();
      for (const t of accentedTokens) {
        tokenCountsAccented.set(t, (tokenCountsAccented.get(t) || 0) + 1);
      }
      const tokenCountsNonAccented = /* @__PURE__ */ new Map();
      for (const t of nonAccentedTokens) {
        tokenCountsNonAccented.set(t, (tokenCountsNonAccented.get(t) || 0) + 1);
      }
      for (const t of tokenCountsAccented.keys()) {
        this.docFreqAccented.set(t, (this.docFreqAccented.get(t) || 0) + 1);
      }
      for (const t of tokenCountsNonAccented.keys()) {
        this.docFreqNonAccented.set(t, (this.docFreqNonAccented.get(t) || 0) + 1);
      }
      const docLen = accentedTokens.length;
      totalLength += docLen;
      this.docs.push({
        chunk,
        accentedTokens,
        nonAccentedTokens,
        tokenCountsAccented,
        tokenCountsNonAccented,
        length: docLen
      });
    }
    this.avgDocLength = totalLength / this.docs.length;
  }
  /**
   * Calculate IDF with smoothing
   */
  computeIDF(df, totalDocs) {
    return Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
  }
  /**
   * Search chunks by query
   */
  search(query, topK = 5, minScore = 0.5) {
    if (!query || !query.trim() || this.docs.length === 0) {
      return [];
    }
    const queryAccented = tokenize(query, true);
    const queryNonAccented = queryAccented.map((t) => removeVietnameseAccents(t));
    const normalizedQuery = normalizeText(query);
    const nonAccentedQuery = removeVietnameseAccents(normalizedQuery);
    const scoredResults = [];
    const totalDocs = this.docs.length;
    for (const doc of this.docs) {
      let bm25Score = 0;
      const matchedTerms = [];
      const matchReasons = [];
      for (const term of queryAccented) {
        const tf = doc.tokenCountsAccented.get(term) || 0;
        if (tf > 0) {
          const df = this.docFreqAccented.get(term) || 1;
          const idf = this.computeIDF(df, totalDocs);
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.length / (this.avgDocLength || 1)));
          bm25Score += idf * (numerator / denominator);
          matchedTerms.push(term);
        }
      }
      for (const term of queryNonAccented) {
        const tf = doc.tokenCountsNonAccented.get(term) || 0;
        if (tf > 0 && !matchedTerms.includes(term)) {
          const df = this.docFreqNonAccented.get(term) || 1;
          const idf = this.computeIDF(df, totalDocs);
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.length / (this.avgDocLength || 1)));
          bm25Score += 0.85 * idf * (numerator / denominator);
          matchedTerms.push(term);
        }
      }
      const titleNorm = normalizeText(doc.chunk.documentTitle);
      const titleNonAcc = removeVietnameseAccents(titleNorm);
      if (titleNorm.includes(normalizedQuery) || titleNonAcc.includes(nonAccentedQuery)) {
        bm25Score *= 1.4;
        matchReasons.push("Kh\u1EDBp ti\xEAu \u0111\u1EC1 t\xE0i li\u1EC7u");
      }
      const contentNorm = normalizeText(doc.chunk.content);
      const contentNonAcc = removeVietnameseAccents(contentNorm);
      if (contentNorm.includes(normalizedQuery) || nonAccentedQuery.length > 6 && contentNonAcc.includes(nonAccentedQuery)) {
        bm25Score *= 1.35;
        matchReasons.push("Kh\u1EDBp c\u1EE5m t\u1EEB nguy\xEAn v\u0103n");
      }
      if (matchedTerms.length > 0) {
        matchReasons.push(`Kh\u1EDBp ${matchedTerms.length} t\u1EEB kh\xF3a: [${matchedTerms.slice(0, 5).join(", ")}]`);
      }
      if (matchedTerms.length === 0) {
        continue;
      }
      const queryKeyTerms = queryAccented.length;
      const coverageRatio = matchedTerms.length / queryKeyTerms;
      const isExactMatch = titleNorm.includes(normalizedQuery) || contentNorm.includes(normalizedQuery);
      if (queryKeyTerms >= 4 && coverageRatio < 0.3 && !isExactMatch) {
        continue;
      }
      if (bm25Score >= minScore) {
        scoredResults.push({
          chunk: doc.chunk,
          score: Math.round(bm25Score * 100) / 100,
          matchReasons,
          termMatches: matchedTerms
        });
      }
    }
    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults.slice(0, topK);
  }
};

// src/rag/processor/documentProcessor.ts
var DEFAULT_OPTIONS = {
  maxChunkSize: 450,
  overlapSize: 60,
  preserveParagraphs: true
};
var DocumentProcessor = class {
  options;
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  /**
   * Process a single document into an array of verifiable chunks
   */
  processDocument(doc) {
    if (!doc.content || !doc.content.trim()) {
      return [];
    }
    const processedAt = (/* @__PURE__ */ new Date()).toISOString();
    const rawParagraphs = doc.content.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0);
    const chunks = [];
    let chunkCounter = 1;
    for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
      const paragraph = rawParagraphs[pIdx];
      let sectionLabel = `M\u1EE5c ${pIdx + 1}`;
      const headerMatch = paragraph.match(/^([A-ZÀ-Ỹ\s]{3,30}:)/);
      if (headerMatch) {
        sectionLabel = `Ph\u1EA7n ${headerMatch[1].replace(":", "").trim()}`;
      }
      if (paragraph.length <= this.options.maxChunkSize) {
        const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, "0")}`;
        chunks.push({
          id: chunkId,
          documentId: doc.id,
          documentTitle: doc.title,
          content: paragraph,
          sectionOrPage: sectionLabel,
          topic: doc.topics[0] || "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh",
          processedAt,
          sourceStatus: doc.status,
          provenanceLocator: `corpus://${doc.id}#${chunkId}`,
          tokenEstimate: Math.ceil(paragraph.length / 4),
          metadata: {
            category: doc.category,
            authorOrSource: doc.authorOrSource,
            dateOrEra: doc.dateOrEra,
            paragraphIndex: pIdx + 1
          }
        });
        chunkCounter++;
      } else {
        const sentences = paragraph.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
        let currentChunkText = "";
        let subIndex = 1;
        for (const sentence of sentences) {
          if ((currentChunkText + " " + sentence).length > this.options.maxChunkSize && currentChunkText.length > 0) {
            const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, "0")}`;
            chunks.push({
              id: chunkId,
              documentId: doc.id,
              documentTitle: doc.title,
              content: currentChunkText.trim(),
              sectionOrPage: `${sectionLabel} (\u0110o\u1EA1n ${subIndex})`,
              topic: doc.topics[0] || "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh",
              processedAt,
              sourceStatus: doc.status,
              provenanceLocator: `corpus://${doc.id}#${chunkId}`,
              tokenEstimate: Math.ceil(currentChunkText.length / 4),
              metadata: {
                category: doc.category,
                authorOrSource: doc.authorOrSource,
                dateOrEra: doc.dateOrEra,
                paragraphIndex: pIdx + 1,
                subIndex
              }
            });
            chunkCounter++;
            subIndex++;
            const words = currentChunkText.split(" ");
            const overlapWords = words.slice(Math.max(0, words.length - 8)).join(" ");
            currentChunkText = overlapWords + " " + sentence;
          } else {
            currentChunkText = currentChunkText ? `${currentChunkText} ${sentence}` : sentence;
          }
        }
        if (currentChunkText.trim().length > 0) {
          const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, "0")}`;
          chunks.push({
            id: chunkId,
            documentId: doc.id,
            documentTitle: doc.title,
            content: currentChunkText.trim(),
            sectionOrPage: `${sectionLabel} (\u0110o\u1EA1n ${subIndex})`,
            topic: doc.topics[0] || "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh",
            processedAt,
            sourceStatus: doc.status,
            provenanceLocator: `corpus://${doc.id}#${chunkId}`,
            tokenEstimate: Math.ceil(currentChunkText.length / 4),
            metadata: {
              category: doc.category,
              authorOrSource: doc.authorOrSource,
              dateOrEra: doc.dateOrEra,
              paragraphIndex: pIdx + 1,
              subIndex
            }
          });
          chunkCounter++;
        }
      }
    }
    return chunks;
  }
  /**
   * Batch process multiple documents
   */
  processDocuments(docs) {
    const allChunks = [];
    for (const doc of docs) {
      const chunks = this.processDocument(doc);
      allChunks.push(...chunks);
    }
    return allChunks;
  }
};

// src/rag/retrieval/hybridRetriever.ts
var HybridRetriever = class {
  documents = /* @__PURE__ */ new Map();
  chunks = [];
  bm25;
  processor;
  constructor() {
    this.bm25 = new BM25Retriever(1.5, 0.75);
    this.processor = new DocumentProcessor();
  }
  /**
   * Index knowledge documents and auto-process chunks with security gates
   */
  indexDocuments(documents) {
    this.documents.clear();
    const approvedDocs = [];
    for (const doc of documents) {
      this.documents.set(doc.id, doc);
      if (doc.status === "APPROVED" && doc.isAllowedForRag) {
        approvedDocs.push(doc);
      }
    }
    const chunks = this.processor.processDocuments(approvedDocs);
    this.indexChunks(chunks);
  }
  /**
   * Directly index pre-processed chunks
   */
  indexChunks(chunks) {
    this.chunks = chunks.filter((c) => c.sourceStatus === "APPROVED");
    this.bm25.buildIndex(this.chunks);
  }
  /**
   * Retrieve relevant chunks for a user query
   */
  async retrieve(queryReq) {
    const { query, topK = 4, categoryFilter, topicFilter, minScore = 0.3 } = queryReq;
    if (!query || !query.trim()) {
      return [];
    }
    let rawScored = this.bm25.search(query, topK * 2, minScore);
    if (categoryFilter) {
      rawScored = rawScored.filter((sc) => {
        const doc = this.documents.get(sc.chunk.documentId);
        return doc && doc.category === categoryFilter;
      });
    }
    if (topicFilter) {
      rawScored = rawScored.filter((sc) => {
        return sc.chunk.topic.toLowerCase().includes(topicFilter.toLowerCase());
      });
    }
    const topResults = rawScored.slice(0, topK);
    const maxScore = topResults.length > 0 ? topResults[0].score : 1;
    return topResults.map((sc) => ({
      ...sc,
      score: maxScore > 0 ? Math.min(1, Math.round(sc.score / (maxScore * 1.1) * 100) / 100) : 0
    }));
  }
  /**
   * Return all currently indexed chunks
   */
  getAllChunks() {
    return [...this.chunks];
  }
  /**
   * Provide corpus statistics for health check & transparency
   */
  getStats() {
    const allDocs = Array.from(this.documents.values());
    const approvedDocs = allDocs.filter((d) => d.status === "APPROVED" && d.isAllowedForRag);
    const topicsSet = /* @__PURE__ */ new Set();
    for (const chunk of this.chunks) {
      if (chunk.topic) topicsSet.add(chunk.topic);
    }
    return {
      totalDocuments: allDocs.length,
      approvedDocuments: approvedDocs.length,
      totalChunks: this.chunks.length,
      topics: Array.from(topicsSet)
    };
  }
};

// src/rag/engine/localGroundedEngine.ts
var LocalGroundedEngine = class {
  /**
   * Synthesize a grounded answer purely from retrieved chunks
   */
  synthesize(query, scoredChunks) {
    const queryNorm = normalizeText(query);
    const nonAccentedQuery = removeVietnameseAccents(queryNorm);
    const queryTokens = tokenize(query, true);
    const topScore = scoredChunks && scoredChunks.length > 0 ? scoredChunks[0].score : 0;
    const queryWords = tokenize(nonAccentedQuery, false);
    const isFiveTeachings = nonAccentedQuery.includes("5 dieu") || nonAccentedQuery.includes("nam dieu") || nonAccentedQuery.includes("bac ho day") || nonAccentedQuery.includes("thieu nien");
    const isDeclaration = nonAccentedQuery.includes("tuyen ngon") || queryWords.includes("doc") && queryWords.includes("lap") || nonAccentedQuery.includes("2 9");
    const isTestament = nonAccentedQuery.includes("di chuc") || queryWords.includes("thanh") && queryWords.includes("nien");
    const isSchoolLetter = nonAccentedQuery.includes("khai truong") || nonAccentedQuery.includes("sanh vai");
    const isDanVan = nonAccentedQuery.includes("dan van");
    const isResistance = nonAccentedQuery.includes("toan quoc") || queryWords.includes("khang") && queryWords.includes("chien");
    const isPrisonDiary = nonAccentedQuery.includes("nhat ky trong tu") || queryWords.includes("tho");
    const isTopicIntent = isFiveTeachings || isDeclaration || isTestament || isSchoolLetter || isDanVan || isResistance || isPrisonDiary;
    if (!scoredChunks || scoredChunks.length === 0 || !isTopicIntent && topScore < 0.6) {
      return {
        answer: `Hi\u1EC7n t\u1EA1i trong kho t\u01B0 li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c ki\u1EC3m duy\u1EC7t c\u1EE7a **Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh \u2013 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c**, h\u1EC7 th\u1ED1ng ch\u01B0a t\xECm th\u1EA5y th\xF4ng tin ph\xF9 h\u1EE3p \u0111\u1EC3 tr\u1EA3 l\u1EDDi c\xE2u h\u1ECFi: *"${query}"*.

*G\u1EE3i \xFD:* B\u1EA1n c\xF3 th\u1EC3 th\u1EED tra c\u1EE9u c\xE1c ch\u1EE7 \u0111\u1EC1 nh\u01B0: *5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y, Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp 2/9/1945, Th\u01B0 khai tr\u01B0\u1EDDng th\xE1ng 9/1945, Di ch\xFAc c\u1EE7a B\xE1c, L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn, ho\u1EB7c B\xE0i vi\u1EBFt D\xE2n v\u1EADn.*`,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: "Local Grounded Rule Engine (DEV Offline)"
      };
    }
    const relevantChunks = scoredChunks.filter((sc) => sc.score >= 0.4 && sc.score >= topScore * 0.4);
    let substantiveMatches = 0;
    for (const sc of relevantChunks) {
      for (const t of queryTokens) {
        if (sc.chunk.content.toLowerCase().includes(t.toLowerCase()) || sc.chunk.documentTitle.toLowerCase().includes(t.toLowerCase())) {
          substantiveMatches++;
        }
      }
    }
    const meaningfulTokens = tokenize(query, true);
    const meaningfulBigrams = extractNGrams(meaningfulTokens).filter((ng) => ng.includes(" "));
    const hasPhraseOrBigramMatch = meaningfulBigrams.length > 0 && meaningfulBigrams.some((bg) => {
      const bgNorm = removeVietnameseAccents(bg);
      return relevantChunks.some((sc) => {
        const cNorm = removeVietnameseAccents(normalizeText(sc.chunk.content));
        const tNorm = removeVietnameseAccents(normalizeText(sc.chunk.documentTitle));
        return cNorm.includes(bgNorm) || tNorm.includes(bgNorm);
      });
    });
    if (!isTopicIntent && !hasPhraseOrBigramMatch && topScore < 2) {
      return {
        answer: `Hi\u1EC7n t\u1EA1i trong kho t\u01B0 li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c ki\u1EC3m duy\u1EC7t c\u1EE7a **Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh \u2013 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c**, h\u1EC7 th\u1ED1ng ch\u01B0a t\xECm th\u1EA5y th\xF4ng tin ph\xF9 h\u1EE3p \u0111\u1EC3 tr\u1EA3 l\u1EDDi c\xE2u h\u1ECFi: *"${query}"*.

*G\u1EE3i \xFD:* B\u1EA1n c\xF3 th\u1EC3 th\u1EED tra c\u1EE9u c\xE1c ch\u1EE7 \u0111\u1EC1 nh\u01B0: *5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y, Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp 2/9/1945, Th\u01B0 khai tr\u01B0\u1EDDng th\xE1ng 9/1945, Di ch\xFAc c\u1EE7a B\xE1c, L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn, ho\u1EB7c B\xE0i vi\u1EBFt D\xE2n v\u1EADn.*`,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: "Local Grounded Rule Engine (DEV Offline)"
      };
    }
    const citations = [];
    const evidenceParagraphs = [];
    let citationIndex = 1;
    for (const sc of relevantChunks) {
      const chunk = sc.chunk;
      const snippet = chunk.content.length > 200 ? `${chunk.content.substring(0, 200)}...` : chunk.content;
      citations.push({
        citationId: `[${citationIndex}]`,
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentTitle: chunk.documentTitle,
        authorOrSource: chunk.metadata?.authorOrSource || "T\u01B0 li\u1EC7u l\u1ECBch s\u1EED \u0110\u1EA3ng",
        dateOrEra: chunk.metadata?.dateOrEra || "T\u01B0 li\u1EC7u l\u1ECBch s\u1EED",
        sectionOrPage: chunk.sectionOrPage,
        snippet,
        confidenceScore: sc.score,
        verificationStatus: chunk.sourceStatus === "APPROVED" ? "VERIFIED" : "CAUTION",
        sourceUrl: chunk.metadata?.sourceUrl || void 0
      });
      const sentences = chunk.content.split(/(?<=[.?!])\s+/);
      let bestSentence = "";
      let maxOverlap = -1;
      for (const sent of sentences) {
        const sentTokens = tokenize(sent, true);
        const overlap = sentTokens.filter((t) => queryTokens.includes(t)).length;
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          bestSentence = sent.trim();
        }
      }
      evidenceParagraphs.push({
        citationIndex,
        docTitle: chunk.documentTitle,
        section: chunk.sectionOrPage,
        matchedText: bestSentence || chunk.content,
        chunkId: chunk.id
      });
      citationIndex++;
    }
    const primaryChunk = relevantChunks[0].chunk;
    let answerBody = "";
    if (isFiveTeachings && primaryChunk.documentId === "DOC-HCM-004") {
      answerBody = `D\u1EF1a tr\xEAn t\xE0i li\u1EC7u ch\xEDnh th\u1EE9c t\u1EEB Trung \u01B0\u01A1ng \u0110o\xE0n TNCS H\u1ED3 Ch\xED Minh v\xE0 B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh [1]:

**N\u0103m \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng** g\u1ED3m:
1. **Y\xEAu T\u1ED5 qu\u1ED1c, y\xEAu \u0111\u1ED3ng b\xE0o.**
2. **H\u1ECDc t\u1EADp t\u1ED1t, lao \u0111\u1ED9ng t\u1ED1t.**
3. **\u0110o\xE0n k\u1EBFt t\u1ED1t, k\u1EF7 lu\u1EADt t\u1ED1t.**
4. **Gi\u1EEF g\xECn v\u1EC7 sinh th\u1EADt t\u1ED1t.**
5. **Khi\xEAm t\u1ED1n, th\u1EADt th\xE0, d\u0169ng c\u1EA3m.**

*L\u01B0u \xFD l\u1ECBch s\u1EED:* B\xE1c H\u1ED3 g\u1EEDi th\u01B0 c\u0103n d\u1EB7n 5 \u0111i\u1EC1u n\xE0y l\u1EA7n \u0111\u1EA7u v\xE0o n\u0103m 1961 nh\xE2n d\u1ECBp k\u1EF7 ni\u1EC7m 20 n\u0103m ng\xE0y th\xE0nh l\u1EADp \u0110\u1ED9i. \u0110\u1EBFn n\u0103m 1965, B\xE1c \u0111\xE3 b\u1ED5 sung th\xEAm ch\u1EEF "th\u1EADt" v\xE0o \u0111i\u1EC1u th\u1EE9 t\u01B0 th\xE0nh *"Gi\u1EEF g\xECn v\u1EC7 sinh th\u1EADt t\u1ED1t"* \u0111\u1EC3 c\xE2u \u0111\u1ED1i x\u1EE9ng v\xE0 nh\u1EA5n m\u1EA1nh \xFD th\u1EE9c r\xE8n luy\u1EC7n n\u1EBFp s\u1ED1ng v\u0103n minh cho c\xE1c em [1].`;
    } else if (isDeclaration && primaryChunk.documentId === "DOC-HCM-001") {
      answerBody = `Theo v\u0103n b\u1EA3n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp ng\xE0y 2/9/1945 l\u01B0u tr\u1EEF t\u1EA1i V\u0103n ki\u1EC7n \u0110\u1EA3ng [1]:

B\u1EA3n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp do Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh so\u1EA1n th\u1EA3o t\u1EA1i s\u1ED1 48 ph\u1ED1 H\xE0ng Ngang v\xE0 \u0111\u1ECDc tr\u01B0\u1EDBc qu\u1ED1c d\xE2n \u0111\u1ED3ng b\xE0o t\u1EA1i Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh ng\xE0y 2/9/1945.

**N\u1ED9i dung c\u1ED1t l\xF5i:**
- B\xE1c \u0111\xE3 tr\xEDch d\u1EABn Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp n\u0103m 1776 c\u1EE7a M\u1EF9 v\xE0 Tuy\xEAn ng\xF4n Nh\xE2n quy\u1EC1n v\xE0 D\xE2n quy\u1EC1n n\u0103m 1791 c\u1EE7a Ph\xE1p \u0111\u1EC3 kh\u1EB3ng \u0111\u1ECBnh quy\u1EC1n thi\xEAng li\xEAng: *"T\u1EA5t c\u1EA3 c\xE1c d\xE2n t\u1ED9c tr\xEAn th\u1EBF gi\u1EDBi \u0111\u1EC1u sinh ra b\xECnh \u0111\u1EB3ng, d\xE2n t\u1ED9c n\xE0o c\u0169ng c\xF3 quy\u1EC1n s\u1ED1ng, quy\u1EC1n sung s\u01B0\u1EDBng v\xE0 quy\u1EC1n t\u1EF1 do"* [1].
- K\u1EBFt lu\u1EADn b\u1EA5t h\u1EE7 kh\u1EB3ng \u0111\u1ECBnh \xFD ch\xED to\xE0n d\xE2n: *"N\u01B0\u1EDBc Vi\u1EC7t Nam c\xF3 quy\u1EC1n h\u01B0\u1EDFng t\u1EF1 do v\xE0 \u0111\u1ED9c l\u1EADp, v\xE0 s\u1EF1 th\u1EADt \u0111\xE3 th\xE0nh m\u1ED9t n\u01B0\u1EDBc t\u1EF1 do \u0111\u1ED9c l\u1EADp. To\xE0n th\u1EC3 d\xE2n t\u1ED9c Vi\u1EC7t Nam quy\u1EBFt \u0111em t\u1EA5t c\u1EA3 tinh th\u1EA7n v\xE0 l\u1EF1c l\u01B0\u1EE3ng, t\xEDnh m\u1EA1ng v\xE0 c\u1EE7a c\u1EA3i \u0111\u1EC3 gi\u1EEF v\u1EEFng quy\u1EC1n t\u1EF1 do, \u0111\u1ED9c l\u1EADp \u1EA5y"* [1].`;
    } else if (isTestament && primaryChunk.documentId === "DOC-HCM-002") {
      answerBody = `C\u0103n c\u1EE9 b\u1EA3n Di ch\xFAc c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (B\u1EA3o v\u1EADt Qu\u1ED1c gia) do Ban Ch\u1EA5p h\xE0nh Trung \u01B0\u01A1ng \u0110\u1EA3ng c\xF4ng b\u1ED1 [1]:

**1. V\u1EC1 \u0110o\xE0n k\u1EBFt:**
B\xE1c c\u0103n d\u1EB7n: *"\u0110o\xE0n k\u1EBFt l\xE0 m\u1ED9t truy\u1EC1n th\u1ED1ng c\u1EF1c k\u1EF3 b\xE1u v\u1EADt c\u1EE7a \u0110\u1EA3ng v\xE0 c\u1EE7a d\xE2n ta... c\u1EA7n ph\u1EA3i gi\u1EEF g\xECn s\u1EF1 \u0111o\xE0n k\u1EBFt nh\u1EA5t tr\xED c\u1EE7a \u0110\u1EA3ng nh\u01B0 gi\u1EEF g\xECn con ng\u01B0\u01A1i c\u1EE7a m\u1EAFt m\xECnh"* [1].

**2. V\u1EC1 th\u1EBF h\u1EC7 thanh ni\xEAn v\xE0 \u0111\u1EDDi sau:**
B\xE1c nh\u1EA5n m\u1EA1nh: *"\u0110o\xE0n vi\xEAn v\xE0 thanh ni\xEAn ta n\xF3i chung l\xE0 t\u1ED1t, m\u1ECDi vi\u1EC7c \u0111\u1EC1u h\u0103ng h\xE1i xung phong, kh\xF4ng ng\u1EA1i hy sinh gian kh\u1ED5, c\xF3 ch\xED ti\u1EBFn th\u1EE7. \u0110\u1EA3ng c\u1EA7n ph\u1EA3i ch\u0103m lo gi\xE1o d\u1EE5c \u0111\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng cho h\u1ECD, \u0111\xE0o t\u1EA1o h\u1ECD th\xE0nh nh\u1EEFng ng\u01B0\u1EDDi th\u1EEBa k\u1EBF x\xE2y d\u1EF1ng ch\u1EE7 ngh\u0129a x\xE3 h\u1ED9i v\u1EEBa 'h\u1ED3ng' v\u1EEBa 'chuy\xEAn'. B\u1ED3i d\u01B0\u1EE1ng th\u1EBF h\u1EC7 c\xE1ch m\u1EA1ng cho \u0111\u1EDDi sau l\xE0 m\u1ED9t vi\u1EC7c r\u1EA5t quan tr\u1ECDng v\xE0 r\u1EA5t c\u1EA7n thi\u1EBFt"* [1].`;
    } else if (isSchoolLetter && primaryChunk.documentId === "DOC-HCM-003") {
      answerBody = `Theo Th\u01B0 g\u1EEDi c\xE1c h\u1ECDc sinh nh\xE2n ng\xE0y khai tr\u01B0\u1EDDng \u0111\u1EA7u ti\xEAn (th\xE1ng 9/1945) \u0111\u0103ng tr\xEAn B\xE1o C\u1EE9u Qu\u1ED1c [1]:

Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 g\u1EEDi l\u1EDDi nh\u1EAFn nh\u1EE7 thi\xEAng li\xEAng v\xE0 k\u1EF3 v\u1ECDng to l\u1EDBn v\xE0o th\u1EBF h\u1EC7 h\u1ECDc sinh:
*"Non s\xF4ng Vi\u1EC7t Nam c\xF3 tr\u1EDF n\xEAn t\u01B0\u01A1i \u0111\u1EB9p hay kh\xF4ng, d\xE2n t\u1ED9c Vi\u1EC7t Nam c\xF3 b\u01B0\u1EDBc t\u1EDBi \u0111\xE0i vinh quang \u0111\u1EC3 s\xE1nh vai v\u1EDBi c\xE1c c\u01B0\u1EDDng qu\u1ED1c n\u0103m ch\xE2u \u0111\u01B0\u1EE3c hay kh\xF4ng, ch\xEDnh l\xE0 nh\u1EDD m\u1ED9t ph\u1EA7n l\u1EDBn \u1EDF c\xF4ng h\u1ECDc t\u1EADp c\u1EE7a c\xE1c em"* [1].

B\xE1c ch\u1EC9 r\xF5 r\u1EB1ng c\xE1c em \u0111\u01B0\u1EE3c h\u01B0\u1EDFng n\u1EC1n gi\xE1o d\u1EE5c c\u1EE7a m\u1ED9t n\u01B0\u1EDBc \u0111\u1ED9c l\u1EADp nh\u1EB1m ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n n\u0103ng l\u1EF1c \u0111\u1EC3 tr\u1EDF th\xE0nh nh\u1EEFng ng\u01B0\u1EDDi c\xF4ng d\xE2n h\u1EEFu \xEDch cho T\u1ED5 qu\u1ED1c.`;
    } else if (isDanVan && primaryChunk.documentId === "DOC-HCM-005") {
      answerBody = `Theo b\xE0i vi\u1EBFt "D\xE2n v\u1EADn" c\u1EE7a B\xE1c H\u1ED3 \u0111\u0103ng tr\xEAn B\xE1o S\u1EF1 Th\u1EADt ng\xE0y 15/10/1949 (k\xFD b\xFAt danh X.Y.Z) [1]:

- **B\u1EA3n ch\u1EA5t c\u1EE7a D\xE2n v\u1EADn:** *"D\xE2n v\u1EADn l\xE0 v\u1EADn \u0111\u1ED9ng t\u1EA5t c\u1EA3 l\u1EF1c l\u01B0\u1EE3ng c\u1EE7a m\u1ED7i m\u1ED9t ng\u01B0\u1EDDi d\xE2n kh\xF4ng \u0111\u1EC3 s\xF3t m\u1ED9t ng\u01B0\u1EDDi d\xE2n n\xE0o, g\xF3p th\xE0nh l\u1EF1c l\u01B0\u1EE3ng to\xE0n d\xE2n, \u0111\u1EC3 th\u1EF1c h\xE0nh nh\u1EEFng c\xF4ng vi\u1EC7c n\xEAn l\xE0m..."* [1].
- **Ph\u01B0\u01A1ng ph\xE1p th\u1EF1c hi\u1EC7n:** Ng\u01B0\u1EDDi l\xE0m d\xE2n v\u1EADn ph\u1EA3i *"\xF3c ngh\u0129, m\u1EAFt tr\xF4ng, tai nghe, ch\xE2n \u0111i, mi\u1EC7ng n\xF3i, tay l\xE0m"* ch\u1EE9 kh\xF4ng \u0111\u01B0\u1EE3c ch\u1EC9 n\xF3i su\xF4ng ho\u1EB7c ra m\u1EC7nh l\u1EC7nh [1].
- **B\xE0i h\u1ECDc \u0111\xFAc k\u1EBFt:** *"L\u1EF1c l\u01B0\u1EE3ng c\u1EE7a d\xE2n r\u1EA5t to. Vi\u1EC7c d\xE2n v\u1EADn r\u1EA5t quan tr\u1ECDng. D\xE2n v\u1EADn k\xE9m th\xEC vi\u1EC7c g\xEC c\u0169ng k\xE9m. D\xE2n v\u1EADn kh\xE9o th\xEC vi\u1EC7c g\xEC c\u0169ng th\xE0nh c\xF4ng"* [1].`;
    } else if (isResistance && primaryChunk.documentId === "DOC-HCM-008") {
      answerBody = `Theo L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xEAm 19/12/1946 t\u1EA1i V\u1EA1n Ph\xFAc [1]:

B\xE1c tuy\xEAn b\u1ED1 tr\u01B0\u1EDBc to\xE0n th\u1EC3 qu\u1ED1c d\xE2n:
*"Ch\xFAng ta mu\u1ED1n h\xF2a b\xECnh, ch\xFAng ta ph\u1EA3i nh\xE2n nh\u01B0\u1EE3ng. Nh\u01B0ng ch\xFAng ta c\xE0ng nh\xE2n nh\u01B0\u1EE3ng, th\u1EF1c d\xE2n Ph\xE1p c\xE0ng l\u1EA5n t\u1EDBi, v\xEC ch\xFAng quy\u1EBFt t\xE2m c\u01B0\u1EDBp n\u01B0\u1EDBc ta l\u1EA7n n\u1EEFa! Kh\xF4ng! Ch\xFAng ta th\xE0 hy sinh t\u1EA5t c\u1EA3, ch\u1EE9 nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu m\u1EA5t n\u01B0\u1EDBc, nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu l\xE0m n\xF4 l\u1EC7."* [1]

Ng\u01B0\u1EDDi k\xEAu g\u1ECDi: *"B\u1EA5t k\u1EF3 \u0111\xE0n \xF4ng, \u0111\xE0n b\xE0, b\u1EA5t k\u1EF3 ng\u01B0\u1EDDi gi\xE0, ng\u01B0\u1EDDi tr\u1EBB, kh\xF4ng chia t\xF4n gi\xE1o, \u0111\u1EA3ng ph\xE1i, d\xE2n t\u1ED9c. H\u1EC5 l\xE0 ng\u01B0\u1EDDi Vi\u1EC7t Nam th\xEC ph\u1EA3i \u0111\u1EE9ng l\xEAn \u0111\xE1nh th\u1EF1c d\xE2n Ph\xE1p \u0111\u1EC3 c\u1EE9u T\u1ED5 qu\u1ED1c"* [1].`;
    } else if (isPrisonDiary && primaryChunk.documentId === "DOC-HCM-007") {
      answerBody = `Theo t\u1EADp th\u01A1 "Nh\u1EADt k\xFD trong t\xF9" (1942 - 1943) c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh do Vi\u1EC7n V\u0103n h\u1ECDc tuy\u1EC3n ch\u1ECDn [1]:

T\u1EADp th\u01A1 g\u1ED3m 133 b\xE0i th\u01A1 ch\u1EEF H\xE1n ph\u1EA3n \xE1nh tinh th\u1EA7n th\xE9p v\xE0 \xFD ch\xED ki\xEAn c\u01B0\u1EDDng trong ch\u1ED1n lao t\xF9:
*"Th\xE2n th\u1EC3 \u1EDF trong lao,*
*Tinh th\u1EA7n \u1EDF ngo\xE0i lao;*
*Mu\u1ED1n n\xEAn s\u1EF1 nghi\u1EC7p l\u1EDBn,*
*Tinh th\u1EA7n c\xE0ng ph\u1EA3i cao"* [1].

T\xE1c ph\u1EA9m l\xE0 t\u1EA5m g\u01B0\u01A1ng ng\u1EDDi s\xE1ng v\u1EC1 l\xF2ng l\u1EA1c quan v\xE0 ngh\u1ECB l\u1EF1c phi th\u01B0\u1EDDng v\u01B0\u1EE3t qua m\u1ECDi gian tru\xE2n, th\u1EED th\xE1ch.`;
    } else {
      const quotesFormatted = evidenceParagraphs.map((ep) => `> "${ep.matchedText}" [${ep.citationIndex}] *(Ngu\u1ED3n: ${ep.docTitle} - ${ep.section})*`).join("\n\n");
      answerBody = `D\u1EF1a tr\xEAn c\xE1c t\u01B0 li\u1EC7u l\u1ECBch s\u1EED ch\xEDnh th\u1EE9c \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF trong Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh [1]:

${quotesFormatted}

*Nh\u1EADn \u0111\u1ECBnh t\u1ED5ng h\u1EE3p:* C\xE1c t\u01B0 li\u1EC7u tr\xEAn cung c\u1EA5p c\u1EE9 li\u1EC7u ch\xEDnh x\xE1c gi\u1EA3i \u0111\xE1p cho c\xE2u h\u1ECFi c\u1EE7a b\u1EA1n. H\u1ECDc sinh v\xE0 b\u1EA1n \u0111\u1ECDc c\xF3 th\u1EC3 tham kh\u1EA3o chi ti\u1EBFt t\u1EA1i c\xE1c m\u1EE5c ngu\u1ED3n tham chi\u1EBFu b\xEAn d\u01B0\u1EDBi.`;
    }
    return {
      answer: answerBody,
      citations,
      evidenceFound: true,
      conflictDetected: false,
      modelUsed: "Local Grounded Synthesis Engine v1.0 (Deterministic)"
    };
  }
};

// src/rag/engine/promptTemplates.ts
var RAG_SYSTEM_PROMPT = `B\u1EA1n l\xE0 Tr\u1EE3 l\xFD AI "B\u1EA1n \u0110\u1ED3ng H\xE0nh V\u0103n H\xF3a H\u1ED3 Ch\xED Minh" c\u1EE7a Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c (Ph\u01B0\u1EDDng Th\u1EDBi An, Qu\u1EADn 12 / TP. H\u1ED3 Ch\xED Minh).
Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 gi\u1EA3i \u0111\xE1p th\u1EAFc m\u1EAFc v\u1EC1 cu\u1ED9c \u0111\u1EDDi, s\u1EF1 nghi\u1EC7p, t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c v\xE0 phong c\xE1ch c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh d\xE0nh cho h\u1ECDc sinh v\xE0 gi\xE1o vi\xEAn THCS.

C\xC1C NGUY\xCAN T\u1EAEC B\u1EAET BU\u1ED8C:
1. TRUNG TH\u1EF0C V\xC0 CHU\u1EA8N X\xC1C: Ch\u1EC9 tr\u1EA3 l\u1EDDi d\u1EF1a tr\xEAn c\xE1c \u0111o\u1EA1n t\u01B0 li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c cung c\u1EA5p trong ph\u1EA7n [NG\u1EEE C\u1EA2NH T\u01AF LI\u1EC6U \u0110\xC3 DUY\u1EC6T]. Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng t\u1EF1 suy di\u1EC5n, kh\xF4ng b\u1ECBa \u0111\u1EB7t s\u1EF1 ki\u1EC7n, m\u1ED1c th\u1EDDi gian, nh\xE2n v\u1EADt ho\u1EB7c ph\xE1t bi\u1EC3u kh\xF4ng c\xF3 trong t\u01B0 li\u1EC7u.
2. X\u1EEC L\xDD KHI THI\u1EBEU T\u01AF LI\u1EC6U: N\u1EBFu c\xE2u h\u1ECFi kh\xF4ng c\xF3 \u0111\u1EE7 th\xF4ng tin ho\u1EB7c n\u1EB1m ngo\xE0i c\xE1c \u0111o\u1EA1n t\u01B0 li\u1EC7u \u0111\u01B0\u1EE3c cung c\u1EA5p, h\xE3y th\xF4ng b\xE1o l\u1ECBch s\u1EF1: "Hi\u1EC7n t\u1EA1i trong kho t\u01B0 li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c ki\u1EC3m duy\u1EC7t c\u1EE7a Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh, h\u1EC7 th\u1ED1ng ch\u01B0a t\xECm th\u1EA5y th\xF4ng tin ph\xF9 h\u1EE3p \u0111\u1EC3 tr\u1EA3 l\u1EDDi c\xE2u h\u1ECFi n\xE0y. Em/Th\u1EA7y c\xF4 vui l\xF2ng tham kh\u1EA3o th\xEAm t\u1EEB c\xE1c ngu\u1ED3n t\u01B0 li\u1EC7u ch\xEDnh th\u1EE9c kh\xE1c."
3. D\u1EAAN CH\u1EE8NG R\xD5 R\xC0NG: G\u1EAFn s\u1ED1 th\u1EE9 t\u1EF1 tr\xEDch d\u1EABn [1], [2] t\u01B0\u01A1ng \u1EE9ng ngay sau c\xE1c d\u1EEF ki\u1EC7n ho\u1EB7c c\xE2u n\xF3i \u0111\u01B0\u1EE3c tr\xEDch ra t\u1EEB ng\u1EEF c\u1EA3nh.
4. PH\xC2N BI\u1EC6T R\xD5 R\xC0NG:
   - Ph\u1EA7n tr\xEDch d\u1EABn nguy\xEAn v\u0103n ph\u1EA3i \u0111\u1EB7t trong d\u1EA5u ngo\u1EB7c k\xE9p "...".
   - Ph\u1EA7n t\xF3m t\u1EAFt n\u1ED9i dung ph\u1EA3i di\u1EC5n \u0111\u1EA1t trong s\xE1ng, ph\xF9 h\u1EE3p l\u1EE9a tu\u1ED5i h\u1ECDc sinh THCS.
   - Ph\xE2n bi\u1EC7t r\xF5 s\u1EF1 ki\u1EC7n l\u1ECBch s\u1EED v\u1EDBi b\xE0i h\u1ECDc \u0111\u1EA1o \u0111\u1EE9c v\u1EADn d\u1EE5ng.
5. V\u0102N PHONG: Trang tr\u1ECDng, chu\u1EA9n m\u1EF1c, gi\xE0u t\xEDnh gi\xE1o d\u1EE5c nh\u01B0ng g\u1EA7n g\u0169i, \u1EA5m \xE1p.`;
function buildUserPrompt(query, contextSnippet) {
  return `[C\xC2U H\u1ECEI]: ${query}

[NG\u1EEE C\u1EA2NH T\u01AF LI\u1EC6U \u0110\xC3 DUY\u1EC6T]:
${contextSnippet}

H\xE3y t\u1ED5ng h\u1EE3p c\xE2u tr\u1EA3 l\u1EDDi theo \u0111\xFAng c\xE1c nguy\xEAn t\u1EAFc tr\xEAn v\xE0 \u0111\xEDnh k\xE8m s\u1ED1 tr\xEDch d\u1EABn [1], [2]...`;
}

// src/rag/providers/aiProvider.ts
var GeminiProvider = class {
  providerName = "Google Gemini (Gemini 1.5 Flash)";
  apiKey;
  model;
  constructor(apiKey, model = "gemini-1.5-flash") {
    let envKey = "";
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) {
      envKey = import.meta.env.VITE_GEMINI_API_KEY;
    } else if (typeof globalThis !== "undefined" && globalThis.process?.env?.GEMINI_API_KEY) {
      envKey = globalThis.process.env.GEMINI_API_KEY;
    }
    this.apiKey = apiKey || envKey;
    this.model = model;
  }
  async isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }
  async generateGroundedAnswer(query, contextChunks) {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    const contextSnippet = contextChunks.map((sc, idx) => `[${idx + 1}] Ngu\u1ED3n: ${sc.chunk.documentTitle} (${sc.chunk.sectionOrPage})
N\u1ED9i dung: ${sc.chunk.content}`).join("\n\n");
    const promptText = buildUserPrompt(query, contextSnippet);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${RAG_SYSTEM_PROMPT}

${promptText}` }] }
        ],
        generationConfig: {
          temperature: 0.2,
          // Low temperature for high factual precision
          maxOutputTokens: 1e3
        }
      })
    });
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const citations = contextChunks.map((sc, idx) => ({
      citationId: `[${idx + 1}]`,
      chunkId: sc.chunk.id,
      documentId: sc.chunk.documentId,
      documentTitle: sc.chunk.documentTitle,
      authorOrSource: sc.chunk.metadata?.authorOrSource || "T\u01B0 li\u1EC7u l\u1ECBch s\u1EED",
      dateOrEra: sc.chunk.metadata?.dateOrEra || "T\u01B0 li\u1EC7u l\u1ECBch s\u1EED",
      sectionOrPage: sc.chunk.sectionOrPage,
      snippet: sc.chunk.content.substring(0, 180) + "...",
      confidenceScore: sc.score,
      verificationStatus: sc.chunk.sourceStatus === "APPROVED" ? "VERIFIED" : "CAUTION",
      sourceUrl: sc.chunk.metadata?.sourceUrl || void 0
    }));
    return {
      answer: candidateText,
      modelUsed: `Google Gemini (${this.model})`,
      citations
    };
  }
};

// src/rag/engine/answerEngine.ts
var AnswerEngine = class {
  retrievalEngine;
  primaryProvider;
  localEngine;
  minEvidenceScore;
  constructor(options) {
    this.retrievalEngine = options.retrievalEngine;
    this.localEngine = new LocalGroundedEngine();
    this.minEvidenceScore = options.minEvidenceScore ?? 0.25;
    if (options.primaryProvider) {
      this.primaryProvider = options.primaryProvider;
    } else if (options.geminiApiKey) {
      this.primaryProvider = new GeminiProvider(options.geminiApiKey);
    }
  }
  /**
   * Process user question through full RAG pipeline
   */
  async answerQuestion(query, options) {
    const startTime = Date.now();
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) {
      return {
        query: "",
        answer: "Vui l\xF2ng nh\u1EADp c\xE2u h\u1ECFi \u0111\u1EC3 t\xECm ki\u1EBFm v\xE0 gi\u1EA3i \u0111\xE1p t\u1EEB kho t\u01B0 li\u1EC7u Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh.",
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: "None",
        metrics: {
          retrievalTimeMs: 0,
          generationTimeMs: 0,
          totalTimeMs: 0,
          chunksEvaluated: 0,
          chunksRetrieved: 0,
          chunksUsedInAnswer: 0
        },
        governanceNotice: "ADR-002 Phase 01: Ch\u1EBF \u0111\u1ED9 RAG Th\u1EF1c nghi\u1EC7m n\u1ED9i b\u1ED9",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const retrievalStart = Date.now();
    const retrievedChunks = await this.retrievalEngine.retrieve({
      query: cleanQuery,
      topK: options?.topK || 4,
      categoryFilter: options?.categoryFilter,
      topicFilter: options?.topicFilter,
      minScore: options?.minScore || 0.25
    });
    const retrievalTimeMs = Date.now() - retrievalStart;
    const allChunksCount = this.retrievalEngine.getAllChunks().length;
    const topScore = retrievedChunks.length > 0 ? retrievedChunks[0].score : 0;
    const evidenceFound = retrievedChunks.length > 0 && topScore >= this.minEvidenceScore;
    if (!evidenceFound) {
      const fallbackResult = this.localEngine.synthesize(cleanQuery, []);
      const totalTimeMs2 = Date.now() - startTime;
      return {
        query: cleanQuery,
        answer: fallbackResult.answer,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: fallbackResult.modelUsed,
        metrics: {
          retrievalTimeMs,
          generationTimeMs: 0,
          totalTimeMs: totalTimeMs2,
          chunksEvaluated: allChunksCount,
          chunksRetrieved: 0,
          chunksUsedInAnswer: 0
        },
        governanceNotice: "ADR-002 Phase 01: Kh\xF4ng t\xECm th\u1EA5y b\u1EB1ng ch\u1EE9ng ph\xF9 h\u1EE3p trong kho t\u01B0 li\u1EC7u \u0111\xE3 duy\u1EC7t",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const genStart = Date.now();
    let answerText = "";
    let modelName = "";
    let citations = [];
    let usedProvider = false;
    if (this.primaryProvider) {
      try {
        const isAvail = await this.primaryProvider.isAvailable();
        if (isAvail) {
          const cloudRes = await this.primaryProvider.generateGroundedAnswer(cleanQuery, retrievedChunks);
          answerText = cloudRes.answer;
          modelName = cloudRes.modelUsed;
          citations = cloudRes.citations;
          usedProvider = true;
        }
      } catch (err) {
        console.warn("[RAG AnswerEngine] Primary provider error, falling back to local grounded engine:", err);
      }
    }
    let finalEvidenceFound = true;
    if (!usedProvider) {
      const localRes = this.localEngine.synthesize(cleanQuery, retrievedChunks);
      answerText = localRes.answer;
      modelName = localRes.modelUsed;
      citations = localRes.citations;
      finalEvidenceFound = localRes.evidenceFound;
    }
    const generationTimeMs = Date.now() - genStart;
    const totalTimeMs = Date.now() - startTime;
    return {
      query: cleanQuery,
      answer: answerText,
      citations,
      evidenceFound: finalEvidenceFound,
      conflictDetected: false,
      modelUsed: modelName,
      metrics: {
        retrievalTimeMs,
        generationTimeMs,
        totalTimeMs,
        chunksEvaluated: allChunksCount,
        chunksRetrieved: retrievedChunks.length,
        chunksUsedInAnswer: citations.length
      },
      governanceNotice: "ADR-002 Phase 01: D\u1EEF li\u1EC7u tr\xEDch xu\u1EA5t c\xF3 c\u0103n c\u1EE9 t\u1EEB kho t\u01B0 li\u1EC7u ki\u1EC3m duy\u1EC7t c\u1EE7a Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh \u2013 THCS Nguy\u1EC5n Trung Tr\u1EF1c",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

// src/rag/knowledge/sampleCorpus.ts
var SAMPLE_HCM_DOCUMENTS = [
  {
    id: "DOC-HCM-001",
    title: "To\xE0n v\u0103n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp ng\xE0y 2/9/1945",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - L\u01B0u tr\u1EEF V\u0103n ki\u1EC7n \u0110\u1EA3ng & B\u1EA3o t\xE0ng L\u1ECBch s\u1EED Qu\u1ED1c gia",
    dateOrEra: "02/09/1945",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Tuy\xEAn ng\xF4n \u0111\u1ED9c l\u1EADp", "Ba \u0110\xECnh", "1945", "Quy\u1EC1n con ng\u01B0\u1EDDi", "Ch\u1EE7 quy\u1EC1n d\xE2n t\u1ED9c"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `B\u1EA3n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp do Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh so\u1EA1n th\u1EA3o t\u1EA1i c\u0103n nh\xE0 s\u1ED1 48 ph\u1ED1 H\xE0ng Ngang (H\xE0 N\u1ED9i) v\xE0 \u0111\u1ECDc tr\u01B0\u1EDBc qu\u1ED1c d\xE2n \u0111\u1ED3ng b\xE0o t\u1EA1i Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh ng\xE0y 2 th\xE1ng 9 n\u0103m 1945.

"T\u1EA5t c\u1EA3 m\u1ECDi ng\u01B0\u1EDDi \u0111\u1EC1u sinh ra c\xF3 quy\u1EC1n b\xECnh \u0111\u1EB3ng. T\u1EA1o h\xF3a cho h\u1ECD nh\u1EEFng quy\u1EC1n kh\xF4ng ai c\xF3 th\u1EC3 x\xE2m ph\u1EA1m \u0111\u01B0\u1EE3c; trong nh\u1EEFng quy\u1EC1n \u1EA5y, c\xF3 quy\u1EC1n \u0111\u01B0\u1EE3c s\u1ED1ng, quy\u1EC1n t\u1EF1 do v\xE0 quy\u1EC1n m\u01B0u c\u1EA7u h\u1EA1nh ph\xFAc". L\u1EDDi b\u1EA5t h\u1EE7 \u1EA5y \u1EDF trong b\u1EA3n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp n\u0103m 1776 c\u1EE7a n\u01B0\u1EDBc M\u1EF9. Suy r\u1ED9ng ra, c\xE2u \u1EA5y c\xF3 \xFD ngh\u0129a l\xE0: t\u1EA5t c\u1EA3 c\xE1c d\xE2n t\u1ED9c tr\xEAn th\u1EBF gi\u1EDBi \u0111\u1EC1u sinh ra b\xECnh \u0111\u1EB3ng, d\xE2n t\u1ED9c n\xE0o c\u0169ng c\xF3 quy\u1EC1n s\u1ED1ng, quy\u1EC1n sung s\u01B0\u1EDBng v\xE0 quy\u1EC1n t\u1EF1 do.

B\u1EA3n Tuy\xEAn ng\xF4n Nh\xE2n quy\u1EC1n v\xE0 D\xE2n quy\u1EC1n c\u1EE7a C\xE1ch m\u1EA1ng Ph\xE1p n\u0103m 1791 c\u0169ng n\xF3i: "Ng\u01B0\u1EDDi ta sinh ra t\u1EF1 do v\xE0 b\xECnh \u0111\u1EB3ng v\u1EC1 quy\u1EC1n l\u1EE3i; v\xE0 ph\u1EA3i lu\xF4n lu\xF4n \u0111\u01B0\u1EE3c t\u1EF1 do v\xE0 b\xECnh \u0111\u1EB3ng v\u1EC1 quy\u1EC1n l\u1EE3i". \u0110\xF3 l\xE0 nh\u1EEFng l\u1EBD ph\u1EA3i kh\xF4ng ai ch\u1ED1i c\xE3i \u0111\u01B0\u1EE3c.

Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh kh\u1EB3ng \u0111\u1ECBnh \xFD ch\xED s\u1EAFt \u0111\xE1 c\u1EE7a to\xE0n th\u1EC3 d\xE2n t\u1ED9c: "N\u01B0\u1EDBc Vi\u1EC7t Nam c\xF3 quy\u1EC1n h\u01B0\u1EDFng t\u1EF1 do v\xE0 \u0111\u1ED9c l\u1EADp, v\xE0 s\u1EF1 th\u1EADt \u0111\xE3 th\xE0nh m\u1ED9t n\u01B0\u1EDBc t\u1EF1 do \u0111\u1ED9c l\u1EADp. To\xE0n th\u1EC3 d\xE2n t\u1ED9c Vi\u1EC7t Nam quy\u1EBFt \u0111em t\u1EA5t c\u1EA3 tinh th\u1EA7n v\xE0 l\u1EF1c l\u01B0\u1EE3ng, t\xEDnh m\u1EA1ng v\xE0 c\u1EE7a c\u1EA3i \u0111\u1EC3 gi\u1EEF v\u1EEFng quy\u1EC1n t\u1EF1 do, \u0111\u1ED9c l\u1EADp \u1EA5y".`,
    metadata: {
      volume: "H\u1ED3 Ch\xED Minh To\xE0n t\u1EADp - T\u1EADp 4",
      historicalSignificance: "Khai sinh n\u01B0\u1EDBc Vi\u1EC7t Nam D\xE2n ch\u1EE7 C\u1ED9ng h\xF2a",
      location: "Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh, H\xE0 N\u1ED9i"
    }
  },
  {
    id: "DOC-HCM-002",
    title: "Di ch\xFAc c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (B\u1EA3n c\xF4ng b\u1ED1 ch\xEDnh th\u1EE9c)",
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - Ban Ch\u1EA5p h\xE0nh Trung \u01B0\u01A1ng \u0110\u1EA3ng c\xF4ng b\u1ED1",
    dateOrEra: "1965 - 1969",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Di ch\xFAc", "\u0110o\xE0n k\u1EBFt", "Th\u1EBF h\u1EC7 tr\u1EBB", "V\u1EEBa h\u1ED3ng v\u1EEBa chuy\xEAn", "\u0110\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `B\u1EA3n Di ch\xFAc l\u1ECBch s\u1EED \u0111\u01B0\u1EE3c B\xE1c H\u1ED3 kh\u1EDFi th\u1EA3o t\u1EEB th\xE1ng 5/1965 v\xE0 ti\u1EBFp t\u1EE5c b\u1ED5 sung, ch\u1EC9nh s\u1EEDa v\xE0o c\xE1c d\u1ECBp th\xE1ng 5 h\xE0ng n\u0103m cho \u0111\u1EBFn th\xE1ng 5/1969.

V\u1EC0 \u0110O\xC0N K\u1EBET:
"\u0110o\xE0n k\u1EBFt l\xE0 m\u1ED9t truy\u1EC1n th\u1ED1ng c\u1EF1c k\u1EF3 b\xE1u v\u1EADt c\u1EE7a \u0110\u1EA3ng v\xE0 c\u1EE7a d\xE2n ta. C\xE1c \u0111\u1ED3ng ch\xED t\u1EEB Trung \u01B0\u01A1ng \u0111\u1EBFn c\xE1c chi b\u1ED9 c\u1EA7n ph\u1EA3i gi\u1EEF g\xECn s\u1EF1 \u0111o\xE0n k\u1EBFt nh\u1EA5t tr\xED c\u1EE7a \u0110\u1EA3ng nh\u01B0 gi\u1EEF g\xECn con ng\u01B0\u01A1i c\u1EE7a m\u1EAFt m\xECnh. Trong \u0110\u1EA3ng ph\u1EA3i th\u1EF1c h\xE0nh d\xE2n ch\u1EE7 r\u1ED9ng r\xE3i, th\u01B0\u1EDDng xuy\xEAn v\xE0 nghi\xEAm ch\u1EC9nh t\u1EF1 ph\xEA b\xECnh v\xE0 ph\xEA b\xECnh l\xE0 c\xE1ch t\u1ED1t nh\u1EA5t \u0111\u1EC3 c\u1EE7ng c\u1ED1 v\xE0 ph\xE1t tri\u1EC3n s\u1EF1 \u0111o\xE0n k\u1EBFt v\xE0 th\u1ED1ng nh\u1EA5t c\u1EE7a \u0110\u1EA3ng".

V\u1EC0 \u0110O\xC0N VI\xCAN V\xC0 THANH NI\xCAN:
"\u0110o\xE0n vi\xEAn v\xE0 thanh ni\xEAn ta n\xF3i chung l\xE0 t\u1ED1t, m\u1ECDi vi\u1EC7c \u0111\u1EC1u h\u0103ng h\xE1i xung phong, kh\xF4ng ng\u1EA1i hy sinh gian kh\u1ED5, c\xF3 ch\xED ti\u1EBFn th\u1EE7. \u0110\u1EA3ng c\u1EA7n ph\u1EA3i ch\u0103m lo gi\xE1o d\u1EE5c \u0111\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng cho h\u1ECD, \u0111\xE0o t\u1EA1o h\u1ECD th\xE0nh nh\u1EEFng ng\u01B0\u1EDDi th\u1EEBa k\u1EBF x\xE2y d\u1EF1ng ch\u1EE7 ngh\u0129a x\xE3 h\u1ED9i v\u1EEBa 'h\u1ED3ng' v\u1EEBa 'chuy\xEAn'. B\u1ED3i d\u01B0\u1EE1ng th\u1EBF h\u1EC7 c\xE1ch m\u1EA1ng cho \u0111\u1EDDi sau l\xE0 m\u1ED9t vi\u1EC7c r\u1EA5t quan tr\u1ECDng v\xE0 r\u1EA5t c\u1EA7n thi\u1EBFt".

\u0110I\u1EC0U MONG MU\u1ED0N CU\u1ED0I C\xD9NG:
"\u0110i\u1EC1u mong mu\u1ED1n cu\u1ED1i c\xF9ng c\u1EE7a t\xF4i l\xE0: To\xE0n \u0110\u1EA3ng, to\xE0n d\xE2n ta \u0111o\xE0n k\u1EBFt ph\u1EA5n \u0111\u1EA5u, x\xE2y d\u1EF1ng m\u1ED9t n\u01B0\u1EDBc Vi\u1EC7t Nam h\xF2a b\xECnh, th\u1ED1ng nh\u1EA5t, \u0111\u1ED9c l\u1EADp, d\xE2n ch\u1EE7 v\xE0 gi\xE0u m\u1EA1nh, v\xE0 g\xF3p ph\u1EA7n x\u1EE9ng \u0111\xE1ng v\xE0o s\u1EF1 nghi\u1EC7p c\xE1ch m\u1EA1ng th\u1EBF gi\u1EDBi".`,
    metadata: {
      classification: "B\u1EA3o v\u1EADt Qu\u1ED1c gia s\u1ED1 01",
      reviewBoard: "Vi\u1EC7n L\u1ECBch s\u1EED \u0110\u1EA3ng & H\u1ED9i \u0111\u1ED3ng Khoa h\u1ECDc B\u1EA3o t\xE0ng HCM"
    }
  },
  {
    id: "DOC-HCM-003",
    title: "Th\u01B0 g\u1EEDi c\xE1c h\u1ECDc sinh nh\xE2n ng\xE0y khai tr\u01B0\u1EDDng \u0111\u1EA7u ti\xEAn c\u1EE7a n\u01B0\u1EDBc Vi\u1EC7t Nam D\xE2n ch\u1EE7 C\u1ED9ng h\xF2a",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - B\xE1o C\u1EE9u Qu\u1ED1c s\u1ED1 34 & H\u1ED3 Ch\xED Minh To\xE0n t\u1EADp T\u1EADp 4",
    dateOrEra: "Th\xE1ng 9/1945",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Th\u01B0 khai tr\u01B0\u1EDDng", "H\u1ECDc sinh", "S\xE1nh vai c\u01B0\u1EDDng qu\u1ED1c", "Tr\xE1ch nhi\u1EC7m h\u1ECDc t\u1EADp", "Gi\xE1o d\u1EE5c THCS"],
    sourceUrl: "https://moet.gov.vn",
    content: `B\u1EE9c th\u01B0 Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh g\u1EEDi c\xE1c em h\u1ECDc sinh tr\xEAn to\xE0n qu\u1ED1c nh\xE2n ng\xE0y khai tr\u01B0\u1EDDng \u0111\u1EA7u ti\xEAn c\u1EE7a n\u01B0\u1EDBc Vi\u1EC7t Nam \u0111\u1ED9c l\u1EADp v\xE0o th\xE1ng 9 n\u0103m 1945.

B\xE1c vi\u1EBFt: "H\xF4m nay l\xE0 ng\xE0y khai tr\u01B0\u1EDDng \u0111\u1EA7u ti\xEAn \u1EDF n\u01B0\u1EDBc Vi\u1EC7t Nam D\xE2n ch\u1EE7 C\u1ED9ng h\xF2a. T\xF4i \u0111\xE3 t\u01B0\u1EDFng t\u01B0\u1EE3ng th\u1EA5y tr\u01B0\u1EDBc m\u1EAFt c\xE1i c\u1EA3nh nh\u1ED9n nh\u1ECBp t\u01B0ng b\u1EEBng c\u1EE7a ng\xE0y t\u1EF1u tr\u01B0\u1EDDng \u1EDF kh\u1EAFp c\xE1c n\u01A1i. C\xE1c em h\u1EBFt th\u1EA3y \u0111\u1EC1u vui v\u1EBB v\xEC sau m\u1ED9t cu\u1ED9c chuy\u1EC3n bi\u1EBFn bi\u1EBFn \u0111\u1ED5i l\u1EDBn lao, c\xE1c em b\u1EAFt \u0111\u1EA7u \u0111\u01B0\u1EE3c nh\u1EADn m\u1ED9t n\u1EC1n gi\xE1o d\u1EE5c ho\xE0n to\xE0n Vi\u1EC7t Nam".

L\u1EDDi c\u0103n d\u1EB7n thi\xEAng li\xEAng \u0111\u1ED1i v\u1EDBi th\u1EBF h\u1EC7 t\u01B0\u01A1ng lai:
"Non s\xF4ng Vi\u1EC7t Nam c\xF3 tr\u1EDF n\xEAn t\u01B0\u01A1i \u0111\u1EB9p hay kh\xF4ng, d\xE2n t\u1ED9c Vi\u1EC7t Nam c\xF3 b\u01B0\u1EDBc t\u1EDBi \u0111\xE0i vinh quang \u0111\u1EC3 s\xE1nh vai v\u1EDBi c\xE1c c\u01B0\u1EDDng qu\u1ED1c n\u0103m ch\xE2u \u0111\u01B0\u1EE3c hay kh\xF4ng, ch\xEDnh l\xE0 nh\u1EDD m\u1ED9t ph\u1EA7n l\u1EDBn \u1EDF c\xF4ng h\u1ECDc t\u1EADp c\u1EE7a c\xE1c em. Ng\xE0y h\xF4m nay, c\xE1c em \u0111\u01B0\u1EE3c h\u01B0\u1EDFng s\u1EF1 may m\u1EAFn h\u01A1n cha anh l\xE0 \u0111\u01B0\u1EE3c h\u1EA5p th\u1EE5 m\u1ED9t n\u1EC1n gi\xE1o d\u1EE5c c\u1EE7a m\u1ED9t n\u01B0\u1EDBc \u0111\u1ED9c l\u1EADp, m\u1ED9t n\u1EC1n gi\xE1o d\u1EE5c n\xF3 r\xE8n luy\u1EC7n c\xE1c em n\xEAn nh\u1EEFng ng\u01B0\u1EDDi c\xF4ng d\xE2n h\u1EEFu \xEDch cho n\u01B0\u1EDBc Vi\u1EC7t Nam, m\u1ED9t n\u1EC1n gi\xE1o d\u1EE5c l\xE0m ph\xE1t tri\u1EC3n ho\xE0n to\xE0n nh\u1EEFng n\u0103ng l\u1EF1c s\u1EB5n c\xF3 c\u1EE7a c\xE1c em".`,
    metadata: {
      schoolSignificance: "Kim ch\u1EC9 nam gi\xE1o d\u1EE5c h\u1ECDc sinh tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
      publicationDate: "05/09/1945"
    }
  },
  {
    id: "DOC-HCM-004",
    title: "N\u0103m \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y Thi\u1EBFu ni\xEAn, Nhi \u0111\u1ED3ng (Ngu\u1ED3n g\u1ED1c & N\u1ED9i dung chu\u1EA9n)",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "Trung \u01B0\u01A1ng \u0110o\xE0n TNCS H\u1ED3 Ch\xED Minh & B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh x\xE1c th\u1EF1c",
    dateOrEra: "1961 - 1965",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y", "Thi\u1EBFu nhi", "K\u1EF7 lu\u1EADt", "\u0110o\xE0n k\u1EBFt", "Khi\xEAm t\u1ED1n", "D\u0169ng c\u1EA3m"],
    sourceUrl: "https://doanthanhnien.vn",
    content: `N\u0103m \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng l\xE0 b\xE0i h\u1ECDc v\u1EE1 l\xF2ng v\xE0 kim ch\u1EC9 nam r\xE8n luy\u1EC7n c\u1EE7a m\u1ECDi th\u1EBF h\u1EC7 h\u1ECDc sinh Vi\u1EC7t Nam.

N\u0103m 1961, nh\xE2n d\u1ECBp k\u1EF7 ni\u1EC7m 20 n\u0103m Ng\xE0y th\xE0nh l\u1EADp \u0110\u1ED9i Thi\u1EBFu ni\xEAn Ti\u1EC1n phong Vi\u1EC7t Nam (15/5/1941 - 15/5/1961), B\xE1c H\u1ED3 \u0111\xE3 g\u1EEDi th\u01B0 c\u0103n d\u1EB7n thi\u1EBFu ni\xEAn nhi \u0111\u1ED3ng c\u1EA3 n\u01B0\u1EDBc 5 \u0111i\u1EC1u:
1. Y\xEAu T\u1ED5 qu\u1ED1c, y\xEAu \u0111\u1ED3ng b\xE0o.
2. H\u1ECDc t\u1EADp t\u1ED1t, lao \u0111\u1ED9ng t\u1ED1t.
3. \u0110o\xE0n k\u1EBFt t\u1ED1t, k\u1EF7 lu\u1EADt t\u1ED1t.
4. Gi\u1EEF g\xECn v\u1EC7 sinh.
5. Khi\xEAm t\u1ED1n, th\u1EADt th\xE0, d\u0169ng c\u1EA3m.

\u0110\u1EBFn n\u0103m 1965, \u0111\u1EC3 chu\u1EA9n b\u1ECB k\u1EF7 ni\u1EC7m 25 n\u0103m ng\xE0y th\xE0nh l\u1EADp \u0110\u1ED9i (15/5/1966), B\xE1c H\u1ED3 t\u1EF1 tay b\u1ED5 sung ch\u1EEF "th\u1EADt" v\xE0o \u0111i\u1EC1u th\u1EE9 t\u01B0 th\xE0nh: "Gi\u1EEF g\xECn v\u1EC7 sinh th\u1EADt t\u1ED1t", \u0111\u1EC3 c\xE2u \u0111\u1ED1i x\u1EE9ng v\xE0 nh\u1EA5n m\u1EA1nh \xFD th\u1EE9c r\xE8n luy\u1EC7n n\u1EBFp s\u1ED1ng v\u0103n minh, s\u1EA1ch s\u1EBD c\u1EE7a h\u1ECDc sinh.

N\u1ED9i dung 5 \u0110i\u1EC1u B\xE1c d\u1EA1y hi\u1EC7n nay \u0111\u01B0\u1EE3c to\xE0n th\u1EC3 \u0111\u1ED9i vi\xEAn, h\u1ECDc sinh Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c th\u1EF1c hi\u1EC7n h\xE0ng ng\xE0y trong h\u1ECDc t\u1EADp, lao \u0111\u1ED9ng, quan h\u1EC7 b\u1EA1n b\xE8 v\xE0 sinh ho\u1EA1t gia \u0111\xECnh.`,
    metadata: {
      standardEdition: "Ban h\xE0nh ch\xEDnh th\u1EE9c b\u1EDFi H\u1ED9i \u0111\u1ED3ng \u0110\u1ED9i Trung \u01B0\u01A1ng",
      coreAudience: "H\u1ECDc sinh Ti\u1EC3u h\u1ECDc & THCS"
    }
  },
  {
    id: "DOC-HCM-005",
    title: 'B\xE0i vi\u1EBFt "D\xE2n v\u1EADn" \u0111\u0103ng tr\xEAn B\xE1o S\u1EF1 Th\u1EADt ng\xE0y 15/10/1949',
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "B\xFAt danh X.Y.Z (Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh) - B\xE1o S\u1EF1 Th\u1EADt s\u1ED1 120",
    dateOrEra: "15/10/1949",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["D\xE2n v\u1EADn", "\u0110o\xE0n k\u1EBFt nh\xE2n d\xE2n", "C\xE1n b\u1ED9", "D\xE2n v\u1EADn kh\xE9o", "1949"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `B\xE0i b\xE1o "D\xE2n v\u1EADn" c\u1EE7a B\xE1c H\u1ED3 \u0111\u0103ng tr\xEAn b\xE1o S\u1EF1 Th\u1EADt s\u1ED1 120, ng\xE0y 15 th\xE1ng 10 n\u0103m 1949 v\u1EDBi b\xFAt danh X.Y.Z l\xE0 t\xE1c ph\u1EA9m m\u1EABu m\u1EF1c v\u1EC1 c\xF4ng t\xE1c v\u1EADn \u0111\u1ED9ng qu\u1EA7n ch\xFAng.

B\xE1c \u0111\u1EB7t c\xE2u h\u1ECFi: "V\u1EA5n \u0111\u1EC1 D\xE2n v\u1EADn l\xE0 g\xEC?" v\xE0 tr\u1EA3 l\u1EDDi: "D\xE2n v\u1EADn l\xE0 v\u1EADn \u0111\u1ED9ng t\u1EA5t c\u1EA3 l\u1EF1c l\u01B0\u1EE3ng c\u1EE7a m\u1ED7i m\u1ED9t ng\u01B0\u1EDDi d\xE2n kh\xF4ng \u0111\u1EC3 s\xF3t m\u1ED9t ng\u01B0\u1EDDi d\xE2n n\xE0o, g\xF3p th\xE0nh l\u1EF1c l\u01B0\u1EE3ng to\xE0n d\xE2n, \u0111\u1EC3 th\u1EF1c h\xE0nh nh\u1EEFng c\xF4ng vi\u1EC7c n\xEAn l\xE0m, nh\u1EEFng c\xF4ng vi\u1EC7c Ch\xEDnh ph\u1EE7 v\xE0 \u0110o\xE0n th\u1EC3 \u0111\xE3 giao cho".

B\xE1c ch\u1EC9 r\xF5 ph\u01B0\u01A1ng ph\xE1p d\xE2n v\u1EADn:
"Nh\u1EEFng ng\u01B0\u1EDDi ph\u1EE5 tr\xE1ch d\xE2n v\u1EADn c\u1EA7n ph\u1EA3i \xF3c ngh\u0129, m\u1EAFt tr\xF4ng, tai nghe, ch\xE2n \u0111i, mi\u1EC7ng n\xF3i, tay l\xE0m. Ch\u1EE9 kh\xF4ng ph\u1EA3i ch\u1EC9 n\xF3i su\xF4ng, ch\u1EC9 ng\u1ED3i vi\u1EBFt m\u1EC7nh l\u1EC7nh. H\u1ECD ph\u1EA3i th\u1EADt th\xE0 nh\xFAng tay v\xE0o vi\u1EC7c".

K\u1EBFt lu\u1EADn b\u1EA5t h\u1EE7 c\u1EE7a b\xE0i b\xE1o:
"L\u1EF1c l\u01B0\u1EE3ng c\u1EE7a d\xE2n r\u1EA5t to. Vi\u1EC7c d\xE2n v\u1EADn r\u1EA5t quan tr\u1ECDng. D\xE2n v\u1EADn k\xE9m th\xEC vi\u1EC7c g\xEC c\u0169ng k\xE9m. D\xE2n v\u1EADn kh\xE9o th\xEC vi\u1EC7c g\xEC c\u0169ng th\xE0nh c\xF4ng".`,
    metadata: {
      volume: "H\u1ED3 Ch\xED Minh To\xE0n t\u1EADp - T\u1EADp 6",
      penName: "X.Y.Z"
    }
  },
  {
    id: "DOC-HCM-006",
    title: 'T\xE1c ph\u1EA9m "S\u1EEDa \u0111\u1ED5i l\u1ED1i l\xE0m vi\u1EC7c" (10/1947) - V\u1EC1 \u0110\u1EA1o \u0111\u1EE9c C\xE1ch m\u1EA1ng',
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "B\xFAt danh T\xE2n Sinh (Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh) - NXB S\u1EF1 Th\u1EADt",
    dateOrEra: "Th\xE1ng 10/1947",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["S\u1EEDa \u0111\u1ED5i l\u1ED1i l\xE0m vi\u1EC7c", "C\u1EA7n ki\u1EC7m li\xEAm ch\xEDnh", "Ch\xED c\xF4ng v\xF4 t\u01B0", "\u0110\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng"],
    sourceUrl: "https://nxbctqg.org.vn",
    content: `T\xE1c ph\u1EA9m "S\u1EEDa \u0111\u1ED5i l\u1ED1i l\xE0m vi\u1EC7c" vi\u1EBFt v\xE0o th\xE1ng 10/1947 t\u1EA1i chi\u1EBFn khu Vi\u1EC7t B\u1EAFc, k\xFD b\xFAt danh T\xE2n Sinh, l\xE0 c\u1EA9m nang gi\xE1o d\u1EE5c c\xE1n b\u1ED9, \u0111\u1EA3ng vi\xEAn v\xE0 th\u1EBF h\u1EC7 tr\u1EBB v\u1EC1 ph\u01B0\u01A1ng ph\xE1p c\xF4ng t\xE1c v\xE0 ph\u1EA9m ch\u1EA5t \u0111\u1EA1o \u0111\u1EE9c.

V\u1EC1 t\u01B0 c\xE1ch ng\u01B0\u1EDDi c\xE1ch m\u1EA1ng:
Ph\u1EA3i th\u1EF1c hi\u1EC7n 5 \u0111i\u1EC1u c\u0103n b\u1EA3n: Nh\xE2n, Ngh\u0129a, Tr\xED, D\u0169ng, Li\xEAm.
- "C\u1EA7n": Si\xEAng n\u0103ng, ch\u0103m ch\u1EC9, c\u1ED1 g\u1EAFng d\u1EBBo dai.
- "Ki\u1EC7m": Ti\u1EBFt ki\u1EC7m th\u1EDDi gi\u1EDD, c\xF4ng s\u1EE9c, ti\u1EC1n b\u1EA1c c\u1EE7a d\xE2n, c\u1EE7a n\u01B0\u1EDBc, kh\xF4ng xa x\u1EC9 l\xE3ng ph\xED.
- "Li\xEAm": Trong s\u1EA1ch, kh\xF4ng tham lam, kh\xF4ng h\xE1m \u0111\u1ECBa v\u1ECB danh l\u1EE3i.
- "Ch\xEDnh": Ngay th\u1EB3ng, \u0111\u1EE9ng \u0111\u1EAFn, vi\u1EC7c \u0111\xFAng th\xEC l\xE0m, vi\u1EC7c sai th\xEC ki\xEAn quy\u1EBFt tr\xE1nh.
- "Ch\xED c\xF4ng v\xF4 t\u01B0": \u0110em l\xF2ng ch\xED c\xF4ng v\xF4 t\u01B0 m\xE0 \u0111\u1ED1i v\u1EDBi ng\u01B0\u1EDDi, v\u1EDBi vi\u1EC7c; \u0111\u1EB7t l\u1EE3i \xEDch chung l\xEAn tr\xEAn l\u1EE3i \xEDch ri\xEAng.

B\xE1c c\u0103n d\u1EB7n: "C\u0169ng nh\u01B0 s\xF4ng th\xEC c\xF3 ngu\u1ED3n m\u1EDBi c\xF3 n\u01B0\u1EDBc, kh\xF4ng c\xF3 ngu\u1ED3n th\xEC s\xF4ng c\u1EA1n. C\xE2y ph\u1EA3i c\xF3 g\u1ED1c, kh\xF4ng c\xF3 g\u1ED1c th\xEC c\xE2y h\xE9o. Ng\u01B0\u1EDDi c\xE1ch m\u1EA1ng ph\u1EA3i c\xF3 \u0111\u1EA1o \u0111\u1EE9c, kh\xF4ng c\xF3 \u0111\u1EA1o \u0111\u1EE9c th\xEC d\xF9 t\xE0i gi\u1ECFi m\u1EA5y c\u0169ng kh\xF4ng l\xE3nh \u0111\u1EA1o \u0111\u01B0\u1EE3c nh\xE2n d\xE2n".`,
    metadata: {
      volume: "H\u1ED3 Ch\xED Minh To\xE0n t\u1EADp - T\u1EADp 5",
      penName: "T\xE2n Sinh"
    }
  },
  {
    id: "DOC-HCM-007",
    title: 'T\u1EADp th\u01A1 "Nh\u1EADt k\xFD trong t\xF9" (Ng\u1EE5c trung nh\u1EADt k\xFD) - B\xE0i h\u1ECDc \xFD ch\xED v\xE0 l\u1EA1c quan',
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - Vi\u1EC7n V\u0103n h\u1ECDc & NXB V\u0103n h\u1ECDc",
    dateOrEra: "1942 - 1943",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nh\u1EADt k\xFD trong t\xF9", "Th\u01A1 B\xE1c H\u1ED3", "\xDD ch\xED ngh\u1ECB l\u1EF1c", "L\u1EA1c quan c\xE1ch m\u1EA1ng"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `T\u1EADp th\u01A1 g\u1ED3m 133 b\xE0i th\u01A1 ch\u1EEF H\xE1n \u0111\u01B0\u1EE3c B\xE1c s\xE1ng t\xE1c trong su\u1ED1t 14 th\xE1ng b\u1ECB ch\xEDnh quy\u1EC1n T\u01B0\u1EDFng Gi\u1EDBi Th\u1EA1ch giam gi\u1EEF tr\xE1i ph\xE9p t\u1EA1i g\u1EA7n 30 nh\xE0 lao thu\u1ED9c t\u1EC9nh Qu\u1EA3ng T\xE2y (Trung Qu\u1ED1c) t\u1EEB th\xE1ng 8/1942 \u0111\u1EBFn th\xE1ng 9/1943.

B\xE0i th\u01A1 m\u1EDF \u0111\u1EA7u (\u0110\u1EC1 t\u1EEB):
"Th\xE2n th\u1EC3 \u1EDF trong lao,
Tinh th\u1EA7n \u1EDF ngo\xE0i lao;
Mu\u1ED1n n\xEAn s\u1EF1 nghi\u1EC7p l\u1EDBn,
Tinh th\u1EA7n c\xE0ng ph\u1EA3i cao".

B\xE0i th\u01A1 "T\u1EF1 khuy\xEAn m\xECnh":
"V\xED kh\xF4ng c\xF3 c\u1EA3nh \u0111\xF4ng t\xE0n,
Th\xEC \u0111\xE2u c\xF3 c\u1EA3nh huy ho\xE0ng ng\xE0y xu\xE2n;
Ngh\u0129 m\xECnh trong b\u01B0\u1EDBc gian tru\xE2n,
Tai \u01B0\u01A1ng r\xE8n luy\u1EC7n tinh th\u1EA7n th\xEAm h\u0103ng".

B\xE0i th\u01A1 "Kh\xF4ng ng\u1EE7 \u0111\u01B0\u1EE3c":
"M\u1ED9t canh... hai canh... l\u1EA1i ba canh,
Tr\u1EB1n tr\u1ECDc b\u0103n kho\u0103n, gi\u1EA5c ch\u1EB3ng th\xE0nh;
Canh b\u1ED1n, canh n\u0103m v\u1EEBa ch\u1EE3p m\u1EAFt,
Sao v\xE0ng n\u0103m c\xE1nh m\u1ED9ng h\u1ED3n quanh".

T\xE1c ph\u1EA9m ph\u1EA3n \xE1nh tinh th\u1EA7n t\u1EF1 do b\u1EA5t khu\u1EA5t, phong th\xE1i ung dung t\u1EF1 t\u1EA1i gi\u1EEFa ng\u1EE5c t\xF9 t\u0103m t\u1ED1i, l\xE0 b\xE0i h\u1ECDc l\u1EDBn v\u1EC1 r\xE8n luy\u1EC7n \xFD ch\xED v\u01B0\u1EE3t kh\xF3 cho h\u1ECDc sinh THCS.`,
    metadata: {
      poemCount: 133,
      originalLanguage: "Ch\u1EEF H\xE1n"
    }
  },
  {
    id: "DOC-HCM-008",
    title: "L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn (19/12/1946)",
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - \u0110\xE0i Ti\u1EBFng n\xF3i Vi\u1EC7t Nam ph\xE1t thanh \u0111\xEAm 19/12/1946",
    dateOrEra: "19/12/1946",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn", "V\u1EA1n Ph\xFAc", "1946", "\u0110\u1ED9c l\u1EADp d\xE2n t\u1ED9c", "\xDD ch\xED quy\u1EBFt t\u1EED"],
    sourceUrl: "https://vov.vn",
    content: `\u0110\xEAm ng\xE0y 19 th\xE1ng 12 n\u0103m 1946, t\u1EA1i l\xE0ng V\u1EA1n Ph\xFAc (H\xE0 \u0110\xF4ng, nay thu\u1ED9c H\xE0 N\u1ED9i), Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 ra L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn:

"H\u1EE1i \u0111\u1ED3ng b\xE0o to\xE0n qu\u1ED1c!
Ch\xFAng ta mu\u1ED1n h\xF2a b\xECnh, ch\xFAng ta ph\u1EA3i nh\xE2n nh\u01B0\u1EE3ng. Nh\u01B0ng ch\xFAng ta c\xE0ng nh\xE2n nh\u01B0\u1EE3ng, th\u1EF1c d\xE2n Ph\xE1p c\xE0ng l\u1EA5n t\u1EDBi, v\xEC ch\xFAng quy\u1EBFt t\xE2m c\u01B0\u1EDBp n\u01B0\u1EDBc ta l\u1EA7n n\u1EEFa!
Kh\xF4ng! Ch\xFAng ta th\xE0 hy sinh t\u1EA5t c\u1EA3, ch\u1EE9 nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu m\u1EA5t n\u01B0\u1EDBc, nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu l\xE0m n\xF4 l\u1EC7.

H\u1EE1i \u0111\u1ED3ng b\xE0o!
Ch\xFAng ta ph\u1EA3i \u0111\u1EE9ng l\xEAn!
B\u1EA5t k\u1EF3 \u0111\xE0n \xF4ng, \u0111\xE0n b\xE0, b\u1EA5t k\u1EF3 ng\u01B0\u1EDDi gi\xE0, ng\u01B0\u1EDDi tr\u1EBB, kh\xF4ng chia t\xF4n gi\xE1o, \u0111\u1EA3ng ph\xE1i, d\xE2n t\u1ED9c. H\u1EC5 l\xE0 ng\u01B0\u1EDDi Vi\u1EC7t Nam th\xEC ph\u1EA3i \u0111\u1EE9ng l\xEAn \u0111\xE1nh th\u1EF1c d\xE2n Ph\xE1p \u0111\u1EC3 c\u1EE9u T\u1ED5 qu\u1ED1c. Ai c\xF3 s\xFAng d\xF9ng s\xFAng. Ai c\xF3 g\u01B0\u01A1m d\xF9ng g\u01B0\u01A1m, kh\xF4ng c\xF3 g\u01B0\u01A1m th\xEC d\xF9ng cu\u1ED1c, thu\u1ED5ng, g\u1EADy g\u1ED9c. Ai c\u0169ng ph\u1EA3i ra s\u1EE9c ch\u1ED1ng th\u1EF1c d\xE2n Ph\xE1p c\u1EE9u n\u01B0\u1EDBc...
D\xF9 ph\u1EA3i gian lao kh\xE1ng chi\u1EBFn, nh\u01B0ng v\u1EDBi m\u1ED9t l\xF2ng ki\xEAn quy\u1EBFt hy sinh, th\u1EAFng l\u1EE3i nh\u1EA5t \u0111\u1ECBnh v\u1EC1 d\xE2n t\u1ED9c ta!".`,
    metadata: {
      location: "L\xE0ng V\u1EA1n Ph\xFAc, H\xE0 \u0110\xF4ng",
      historicEvent: "M\u1EDF \u0111\u1EA7u Kh\xE1ng chi\u1EBFn ch\u1ED1ng Ph\xE1p to\xE0n qu\u1ED1c"
    }
  },
  {
    id: "DOC-HCM-010",
    title: "Ti\u1EC3u s\u1EED Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh: Th\u1EDDi ni\xEAn thi\u1EBFu v\xE0 D\u1EA5u m\u1ED1c l\u1ECBch s\u1EED B\u1EBFn Nh\xE0 R\u1ED3ng n\u0103m 1911",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "Vi\u1EC7n L\u1ECBch s\u1EED \u0110\u1EA3ng - H\u1ECDc vi\u1EC7n Ch\xEDnh tr\u1ECB Qu\u1ED1c gia H\u1ED3 Ch\xED Minh",
    dateOrEra: "1890 - 1911",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Ti\u1EC3u s\u1EED B\xE1c H\u1ED3", "Nguy\u1EC5n Sinh Cung", "Nguy\u1EC5n T\u1EA5t Th\xE0nh", "Kim Li\xEAn", "B\u1EBFn Nh\xE0 R\u1ED3ng", "1911"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (l\xFAc nh\u1ECF t\xEAn l\xE0 Nguy\u1EC5n Sinh Cung, \u0111i h\u1ECDc l\u1EA5y t\xEAn l\xE0 Nguy\u1EC5n T\u1EA5t Th\xE0nh) sinh ng\xE0y 19 th\xE1ng 5 n\u0103m 1890 t\u1EA1i qu\xEA ngo\u1EA1i l\xE0ng Ho\xE0ng Tr\xF9 (Ch\xF9a), qu\xEA n\u1ED9i l\xE0ng Kim Li\xEAn (Sen), huy\u1EC7n Nam \u0110\xE0n, t\u1EC9nh Ngh\u1EC7 An.

Th\xE2n ph\u1EE5 l\xE0 c\u1EE5 Ph\xF3 b\u1EA3ng Nguy\u1EC5n Sinh S\u1EAFc, th\xE2n m\u1EABu l\xE0 b\xE0 Ho\xE0ng Th\u1ECB Loan. T\u1EEB thu\u1EDF nh\u1ECF, Nguy\u1EC5n T\u1EA5t Th\xE0nh \u0111\xE3 ch\u1EE9ng ki\u1EBFn n\u1ED7i th\u1ED1ng kh\u1ED5 c\u1EE7a nh\xE2n d\xE2n d\u01B0\u1EDBi \xE1ch th\u1EF1c d\xE2n phong ki\u1EBFn v\xE0 s\u1EDBm nung n\u1EA5u l\xF2ng y\xEAu n\u01B0\u1EDBc th\u01B0\u01A1ng d\xE2n s\xE2u s\u1EAFc.

Ng\xE0y 5 th\xE1ng 6 n\u0103m 1911, t\u1EEB B\u1EBFn C\u1EA3ng Nh\xE0 R\u1ED3ng (S\xE0i G\xF2n - nay l\xE0 TP. H\u1ED3 Ch\xED Minh), tr\xEAn con t\xE0u bu\xF4n \u0110\xF4 \u0111\u1ED1c Latouche-Tr\xE9ville, ng\u01B0\u1EDDi thanh ni\xEAn y\xEAu n\u01B0\u1EDBc Nguy\u1EC5n T\u1EA5t Th\xE0nh v\u1EDBi t\xEAn g\u1ECDi V\u0103n Ba \u0111\xE3 r\u1EDDi T\u1ED5 qu\u1ED1c ra \u0111i t\xECm con \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc, c\u1EE9u d\xE2n. Tr\u1EA3i qua 30 n\u0103m b\xF4n ba qua nhi\u1EC1u ch\xE2u l\u1EE5c, Ng\u01B0\u1EDDi \u0111\xE3 t\xECm th\u1EA5y ch\xE2n l\xFD c\u1EE9u n\u01B0\u1EDBc v\xE0 l\xE3nh \u0111\u1EA1o c\xE1ch m\u1EA1ng Vi\u1EC7t Nam \u0111i \u0111\u1EBFn th\u1EAFng l\u1EE3i l\u1ECBch s\u1EED.`,
    metadata: {
      birthDate: "19/05/1890",
      departureDate: "05/06/1911",
      departurePort: "B\u1EBFn Nh\xE0 R\u1ED3ng, S\xE0i G\xF2n"
    }
  },
  {
    id: "DOC-HCM-011",
    title: "Truy\u1EC1n th\u1ED1ng L\u1ECBch s\u1EED Anh h\xF9ng D\xE2n t\u1ED9c Nguy\u1EC5n Trung Tr\u1EF1c v\xE0 V\xF9ng \u0111\u1EA5t Th\u1EDBi An",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ban Gi\xE1m hi\u1EC7u & T\u1ED5 L\u1ECBch s\u1EED Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    dateOrEra: "1838 - 1868 & Hi\u1EC7n nay",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nguy\u1EC5n Trung Tr\u1EF1c", "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c", "B\u1EA3o b\u1ED1i tinh th\u1EA7n", "Kh\u1EDFi ngh\u0129a kh\xE1ng Ph\xE1p", "Th\u1EDBi An", "Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh"],
    sourceUrl: "https://thcsnguyentrungtruc.hcm.edu.vn",
    content: `Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c t\u1ECDa l\u1EA1c t\u1EA1i ph\u01B0\u1EDDng Th\u1EDBi An, TP. H\u1ED3 Ch\xED Minh - v\xF9ng \u0111\u1EA5t gi\xE0u truy\u1EC1n th\u1ED1ng c\xE1ch m\u1EA1ng ki\xEAn c\u01B0\u1EDDng c\u1EE7a Chi\u1EBFn khu An Ph\xFA \u0110\xF4ng oanh li\u1EC7t.

Ng\xF4i tr\u01B0\u1EDDng t\u1EF1 h\xE0o mang t\xEAn ng\u01B0\u1EDDi anh h\xF9ng ngh\u0129a qu\xE2n Nam B\u1ED9 ki\xEAn c\u01B0\u1EDDng b\u1EA5t khu\u1EA5t trong cu\u1ED9c kh\xE1ng chi\u1EBFn ch\u1ED1ng th\u1EF1c d\xE2n Ph\xE1p:
Anh h\xF9ng Nguy\u1EC5n Trung Tr\u1EF1c (1838 - 1868) n\u1ED5i ti\u1EBFng v\u1EDBi hai chi\u1EBFn c\xF4ng vang d\u1ED9i:
1. \u0110\u1ED1t ch\xE1y t\xE0u chi\u1EBFn Hy V\u1ECDng (Esp\xE9rance) c\u1EE7a th\u1EF1c d\xE2n Ph\xE1p tr\xEAn s\xF4ng Nh\u1EADt T\u1EA3o ng\xE0y 10/12/1861.
2. \u0110\xE1nh \xFAp \u0111\u1ED3n R\u1EA1ch Gi\xE1 ng\xE0y 16/6/1868 ti\xEAu di\u1EC7t t\xEAn ch\u1EE7 t\u1EC9nh v\xE0 binh l\xEDnh th\u1EF1c d\xE2n.

Khi b\u1ECB gi\u1EB7c b\u1EAFt v\xE0 h\xE0nh quy\u1EBFt ng\xE0y 27/10/1868 t\u1EA1i ch\u1EE3 R\u1EA1ch Gi\xE1, \xF4ng \u0111\xE3 hi\xEAn ngang tuy\xEAn b\u1ED1 c\xE2u n\xF3i b\u1EA5t h\u1EE7:
"Bao gi\u1EDD ng\u01B0\u1EDDi T\xE2y nh\u1ED5 h\u1EBFt c\u1ECF n\u01B0\u1EDBc Nam th\xEC m\u1EDBi h\u1EBFt ng\u01B0\u1EDDi Nam \u0111\xE1nh T\xE2y!".

Noi g\u01B0\u01A1ng tinh th\u1EA7n y\xEAu n\u01B0\u1EDBc qu\u1EADt c\u01B0\u1EDDng c\u1EE7a Anh h\xF9ng Nguy\u1EC5n Trung Tr\u1EF1c v\xE0 l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c H\u1ED3 k\xEDnh y\xEAu, c\xE1c th\u1EBF h\u1EC7 th\u1EA7y v\xE0 tr\xF2 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c lu\xF4n n\u1ED7 l\u1EF1c thi \u0111ua D\u1EA1y t\u1ED1t - H\u1ECDc t\u1ED1t, x\xE2y d\u1EF1ng m\xF4i tr\u01B0\u1EDDng h\u1ECDc \u0111\u01B0\u1EDDng v\u0103n minh, k\u1EF7 c\u01B0\u01A1ng v\xE0 nh\xE2n \xE1i.`,
    metadata: {
      heroBirthYear: 1838,
      heroDeathYear: 1868,
      schoolLocation: "Ph\u01B0\u1EDDng Th\u1EDBi An, TP.HCM"
    }
  },
  {
    id: "DOC-HCM-012",
    title: "\u0110\u1EC1 \xE1n X\xE2y d\u1EF1ng Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh t\u1EA1i Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    category: "hcm-cultural-space",
    categoryLabel: "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh TP.HCM",
    authorOrSource: "Chi b\u1ED9 & Ban Ch\u1EC9 \u0111\u1EA1o Kh\xF4ng gian V\u0103n h\xF3a HCM - THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    dateOrEra: "2025 - 2026",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Kh\xF4ng gian V\u0103n h\xF3a HCM", "Tr\u01B0\u1EDDng h\u1ECDc s\u1ED1", "Th\u01B0 vi\u1EC7n m\u1EDF", "Chuy\u1EC3n \u0111\u1ED5i s\u1ED1", "Tr\u1EA3i nghi\u1EC7m tr\u1EF1c quan"],
    sourceUrl: "https://thcsnguyentrungtruc.hcm.edu.vn",
    content: `Th\u1EF1c hi\u1EC7n Ngh\u1ECB quy\u1EBFt \u0110\u1EA1i h\u1ED9i \u0110\u1EA3ng b\u1ED9 TP. H\u1ED3 Ch\xED Minh v\u1EC1 x\xE2y d\u1EF1ng Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh, Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c tri\u1EC3n khai m\xF4 h\xECnh k\u1EBFt h\u1EE3p h\xE0i h\xF2a gi\u1EEFa Kh\xF4ng gian v\u1EADt l\xFD h\u1ECDc \u0111\u01B0\u1EDDng v\xE0 Kh\xF4ng gian s\u1ED1 t\u01B0\u01A1ng t\xE1c (Digital Cultural Space).

1. KH\xD4NG GIAN V\u1EACT L\xDD H\u1ECCC \u0110\u01AF\u1EDCNG:
- Khu tr\u01B0ng b\xE0y t\u01B0\u1EE3ng B\xE1c v\xE0 tri\u1EC3n l\xE3m \u1EA3nh t\u01B0 li\u1EC7u v\u1EC1 cu\u1ED9c \u0111\u1EDDi ho\u1EA1t \u0111\u1ED9ng c\xE1ch m\u1EA1ng c\u1EE7a B\xE1c H\u1ED3.
- T\u1EE7 s\xE1ch B\xE1c H\u1ED3 t\u1EA1i Th\u01B0 vi\u1EC7n tr\u01B0\u1EDDng v\u1EDBi h\xE0ng tr\u0103m \u0111\u1EA7u s\xE1ch qu\xFD, truy\u1EC7n tranh l\u1ECBch s\u1EED, t\xE1c ph\u1EA9m v\u0103n h\u1ECDc ph\xF9 h\u1EE3p l\u1EE9a tu\u1ED5i thi\u1EBFu ni\xEAn.
- G\xF3c r\xE8n luy\u1EC7n "5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y" t\u1EA1i t\u1EEBng chi \u0111\u1ED9i l\u1EDBp h\u1ECDc.

2. KH\xD4NG GIAN V\u0102N H\xD3A S\u1ED0 (RAG KNOWLEDGE PLATFORM):
- X\xE2y d\u1EF1ng kho t\u01B0 li\u1EC7u s\u1ED1 h\xF3a c\xF3 th\u1EA9m \u0111\u1ECBnh, l\u01B0u tr\u1EEF v\u0103n ki\u1EC7n, audio, h\xECnh \u1EA3nh v\xE0 c\xE2u chuy\u1EC7n k\u1EC3 v\u1EC1 B\xE1c.
- T\xEDch h\u1EE3p Tr\u1EE3 l\xFD AI h\u1ECFi \u0111\xE1p t\u01B0 li\u1EC7u (RAG Chatbot) gi\xFAp h\u1ECDc sinh v\xE0 gi\xE1o vi\xEAn tra c\u1EE9u t\xE0i li\u1EC7u h\u1ECDc t\u1EADp m\u1ED9t c\xE1ch tr\u1EF1c quan, chu\u1EA9n x\xE1c, c\xF3 tr\xEDch d\u1EABn ngu\u1ED3n g\u1ED1c l\u1ECBch s\u1EED r\xF5 r\xE0ng.
- T\u1ED5 ch\u1EE9c c\xE1c h\u1ED9i thi tr\u1EF1c tuy\u1EBFn t\xECm hi\u1EC3u l\u1ECBch s\u1EED, k\u1EC3 chuy\u1EC7n B\xE1c H\u1ED3 v\xE0 r\xE8n luy\u1EC7n \u0111\u1EA1o \u0111\u1EE9c h\u1ECDc sinh.`,
    metadata: {
      programCode: "KG-HCM-NTT-2026",
      approvalYear: 2026
    }
  },
  {
    id: "DOC-HCM-013",
    title: "K\u1EBF ho\u1EA1ch s\u1ED1 48/KH-THCSNTT v\u1EC1 H\u1ECDc t\u1EADp v\xE0 l\xE0m theo t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    category: "school-education",
    categoryLabel: "Ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c v\xE0 h\u1ECDc t\u1EADp t\u1EA1i nh\xE0 tr\u01B0\u1EDDng",
    authorOrSource: "Hi\u1EC7u tr\u01B0\u1EDFng & Chi b\u1ED9 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c ban h\xE0nh",
    dateOrEra: "N\u0103m h\u1ECDc 2025 - 2026",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["K\u1EBF ho\u1EA1ch 48", "Ch\u1EC9 th\u1ECB 05", "H\u1ECDc t\u1EADp B\xE1c H\u1ED3", "Chi b\u1ED9 nh\xE0 tr\u01B0\u1EDDng", "Gi\xE1o vi\xEAn", "H\u1ECDc sinh"],
    sourceUrl: "https://thcsnguyentrungtruc.hcm.edu.vn",
    content: `K\u1EBF ho\u1EA1ch s\u1ED1 48/KH-THCSNTT c\u1EE7a Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c v\u1EC1 vi\u1EC7c ti\u1EBFp t\u1EE5c \u0111\u1EA9y m\u1EA1nh h\u1ECDc t\u1EADp v\xE0 l\xE0m theo t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh trong n\u0103m h\u1ECDc 2025 - 2026.

M\u1EE4C TI\xCAU TR\u1ECCNG T\xC2M:
1. \u0110\u01B0a vi\u1EC7c h\u1ECDc t\u1EADp v\xE0 l\xE0m theo g\u01B0\u01A1ng B\xE1c th\xE0nh n\u1EC1n n\u1EBFp th\u01B0\u1EDDng xuy\xEAn trong m\u1ECDi ho\u1EA1t \u0111\u1ED9ng s\u01B0 ph\u1EA1m, gi\u1EA3ng d\u1EA1y v\xE0 r\xE8n luy\u1EC7n c\u1EE7a c\xE1n b\u1ED9, gi\xE1o vi\xEAn, nh\xE2n vi\xEAn v\xE0 h\u1ECDc sinh to\xE0n tr\u01B0\u1EDDng.
2. \u0110\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p d\u1EA1y h\u1ECDc c\xE1c m\xF4n L\u1ECBch s\u1EED, Ng\u1EEF v\u0103n, Gi\xE1o d\u1EE5c c\xF4ng d\xE2n (GDCD) g\u1EAFn li\u1EC1n v\u1EDBi c\xE1c c\xE2u chuy\u1EC7n th\u1EF1c t\u1EBF v\u1EC1 t\u1EA5m g\u01B0\u01A1ng \u0111\u1EA1o \u0111\u1EE9c B\xE1c H\u1ED3.
3. \u1EE8ng d\u1EE5ng c\xF4ng ngh\u1EC7 th\xF4ng tin v\xE0 chuy\u1EC3n \u0111\u1ED5i s\u1ED1 trong qu\u1EA3n l\xFD, chia s\u1EBB t\xE0i li\u1EC7u h\u1ECDc t\u1EADp t\u01B0 t\u01B0\u1EDFng H\u1ED3 Ch\xED Minh.

TI\xCAU CH\xCD \u0110\xC1NH GI\xC1 H\u1ECCC SINH:
- Th\u1EF1c hi\u1EC7n nghi\xEAm t\xFAc 5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y b\u1EB1ng vi\u1EC7c l\xE0m c\u1EE5 th\u1EC3: trung th\u1EF1c trong thi c\u1EED, l\u1EC5 ph\xE9p v\u1EDBi th\u1EA7y c\xF4, h\xF2a \u0111\u1ED3ng gi\xFAp \u0111\u1EE1 b\u1EA1n b\xE8, b\u1EA3o v\u1EC7 m\xF4i tr\u01B0\u1EDDng tr\u01B0\u1EDDng h\u1ECDc xanh - s\u1EA1ch - \u0111\u1EB9p.`,
    metadata: {
      dispatchNumber: "48/KH-THCSNTT",
      signDate: "15/09/2025",
      signer: "Hi\u1EC7u tr\u01B0\u1EDFng Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c"
    }
  },
  {
    id: "DOC-HCM-014",
    title: "Phong c\xE1ch \u1EE9ng x\u1EED v\xE0 l\u1ED1i s\u1ED1ng gi\u1EA3n d\u1ECB c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh: \u0110\xF4i d\xE9p cao su v\xE0 Chi\u1EBFc \xE1o n\xE2u s\u1EDDn",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh - Chuy\u1EC7n k\u1EC3 v\u1EC1 B\xE1c H\u1ED3",
    dateOrEra: "1947 - 1969",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["L\u1ED1i s\u1ED1ng gi\u1EA3n d\u1ECB", "\u0110\xF4i d\xE9p cao su", "\xC1o n\xE2u s\u1EDDn", "Phong c\xE1ch H\u1ED3 Ch\xED Minh", "G\u1EA7n d\xE2n"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `Phong c\xE1ch s\u1ED1ng gi\u1EA3n d\u1ECB, khi\xEAm t\u1ED1n c\u1EE7a B\xE1c H\u1ED3 l\xE0 b\xE0i h\u1ECDc \u0111\u1EA1o \u0111\u1EE9c cao \u0111\u1EB9p v\xE0 s\xE2u s\u1EAFc nh\u1EA5t cho c\xE1c th\u1EBF h\u1EC7 h\u1ECDc sinh.

CHUY\u1EC6N V\u1EC0 \u0110\xD4I D\xC9P CAO SU:
\u0110\xF4i d\xE9p c\u1EE7a B\xE1c \u0111\u01B0\u1EE3c l\xE0m t\u1EEB l\u1ED1p \xF4 t\xF4 qu\xE2n s\u1EF1 c\u1EE7a th\u1EF1c d\xE2n Ph\xE1p b\u1ECB qu\xE2n ta ph\u1EE5c k\xEDch t\u1EA1i chi\u1EBFn khu Vi\u1EC7t B\u1EAFc n\u0103m 1947. \u0110\xF4i d\xE9p \u1EA5y \u0111\xE3 theo ch\xE2n B\xE1c \u0111i kh\u1EAFp m\u1ECDi mi\u1EC1n \u0111\u1EA5t n\u01B0\u1EDBc, t\u1EEB chi\u1EBFn d\u1ECBch Bi\xEAn gi\u1EDBi n\u0103m 1950 \u0111\u1EBFn nh\u1EEFng chuy\u1EBFn th\u0103m \u0111\u1ED3ng ru\u1ED9ng, c\xF4ng tr\u01B0\u1EDDng, nh\xE0 m\xE1y v\xE0 c\u1EA3 trong c\xE1c chuy\u1EBFn c\xF4ng du ngo\u1EA1i giao qu\u1ED1c t\u1EBF.
Khi d\xE9p m\xF2n, c\xE1c \u0111\u1ED3ng ch\xED ph\u1EE5c v\u1EE5 xin B\xE1c \u0111\u1ED5i d\xE9p m\u1EDBi, B\xE1c c\u01B0\u1EDDi b\u1EA3o: "D\xE9p c\xF2n d\xF9ng \u0111\u01B0\u1EE3c, ch\u1EC9 c\u1EA7n \u0111\xF3ng quai l\u1EA1i l\xE0 \u0111i t\u1ED1t. N\u01B0\u1EDBc ta c\xF2n ngh\xE8o, \u0111\u1ED3ng b\xE0o ta c\xF2n v\u1EA5t v\u1EA3, B\xE1c \u0111i \u0111\xF4i d\xE9p n\xE0y v\u1EEBa nh\u1EB9, v\u1EEBa ti\u1EC7n".

B\u1EEEA \u0102N V\xC0 CHI\u1EBEC \xC1O N\xC2U:
B\u1EEFa \u0103n h\xE0ng ng\xE0y c\u1EE7a B\xE1c \u0111\u1EA1m b\u1EA1c v\u1EDBi nh\u1EEFng m\xF3n \u0103n d\xE2n d\xE3 qu\xEA h\u01B0\u01A1ng nh\u01B0 c\xE1 kho ngh\u1EC7, canh cua rau \u0111ay, qu\u1EA3 c\xE0 mu\u1ED1i. B\xE1c kh\xF4ng bao gi\u1EDD \u0111\u1EC3 th\u1EEBa m\u1ED9t h\u1EA1t c\u01A1m, \u0103n xong t\u1EF1 tay s\u1EAFp x\u1EBFp b\xE1t \u0111\u0129a g\u1ECDn g\xE0ng.
Chi\u1EBFc \xE1o n\xE2u s\u1EDDn v\xE1 vai hay chi\u1EBFc qu\u1EA1t mo cau nh\u1EEFng tr\u01B0a h\xE8 oi \u1EA3 ch\u1EE9ng minh m\u1ED9t v\u0129 nh\xE2n th\u1EBF gi\u1EDBi lu\xF4n gi\u1EEF tr\u1ECDn t\u1EA5m l\xF2ng trong s\xE1ng, \u0111\u1ED3ng cam c\u1ED9ng kh\u1ED5 c\xF9ng nh\xE2n d\xE2n.`,
    metadata: {
      theme: "T\u1EA5m g\u01B0\u01A1ng \u0111\u1EA1o \u0111\u1EE9c v\xE0 l\u1ED1i s\u1ED1ng B\xE1c H\u1ED3",
      targetAudience: "H\u1ECDc sinh ph\u1ED5 th\xF4ng"
    }
  },
  {
    id: "DOC-HCM-015",
    title: "H\u01B0\u1EDBng d\u1EABn \u0110\u1EA9y m\u1EA1nh X\xE2y d\u1EF1ng Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh trong ng\xE0nh Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o",
    category: "official-dispatches",
    categoryLabel: "T\xE0i li\u1EC7u ch\xEDnh th\u1EE9c c\u1EE7a c\u01A1 quan qu\u1EA3n l\xFD",
    authorOrSource: "S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o TP. H\u1ED3 Ch\xED Minh",
    dateOrEra: "2024 - 2025",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["H\u01B0\u1EDBng d\u1EABn s\u1EDF GD\u0110T", "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh", "H\u1ECDc \u0111\u01B0\u1EDDng", "Ngh\u1ECB quy\u1EBFt Th\xE0nh \u1EE7y"],
    sourceUrl: "https://hcm.edu.vn",
    content: `V\u0103n b\u1EA3n h\u01B0\u1EDBng d\u1EABn c\u1EE7a S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o TP. H\u1ED3 Ch\xED Minh v\u1EC1 vi\u1EC7c tri\u1EC3n khai x\xE2y d\u1EF1ng Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh trong c\xE1c c\u01A1 s\u1EDF gi\xE1o d\u1EE5c tr\xEAn to\xE0n \u0111\u1ECBa b\xE0n Th\xE0nh ph\u1ED1.

Y\xCAU C\u1EA6U \u0110\u1ED0I V\u1EDAI C\xC1C TR\u01AF\u1EDCNG THCS:
1. X\xE2y d\u1EF1ng kh\xF4ng gian v\u0103n h\xF3a ph\xF9 h\u1EE3p v\u1EDBi \u0111\u1EB7c th\xF9 t\xE2m l\xFD l\u1EE9a tu\u1ED5i h\u1ECDc sinh trung h\u1ECDc c\u01A1 s\u1EDF, tr\xE1nh h\xECnh th\u1EE9c, ph\xF4 tr\u01B0\u01A1ng, l\xE3ng ph\xED.
2. T\xEDch h\u1EE3p gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng l\u1ECBch s\u1EED, l\xFD t\u01B0\u1EDFng c\xE1ch m\u1EA1ng th\xF4ng qua c\xE1c ho\u1EA1t \u0111\u1ED9ng tr\u1EA3i nghi\u1EC7m, ti\u1EBFt sinh ho\u1EA1t d\u01B0\u1EDBi c\u1EDD, c\xE2u l\u1EA1c b\u1ED9 v\u0103n h\xF3a - ngh\u1EC7 thu\u1EADt.
3. \u0110\u1EA9y m\u1EA1nh s\u1ED1 h\xF3a t\xE0i li\u1EC7u, x\xE2y d\u1EF1ng th\u01B0 vi\u1EC7n \u0111i\u1EC7n t\u1EED v\xE0 \u1EE9ng d\u1EE5ng chuy\u1EC3n \u0111\u1ED5i s\u1ED1 nh\u1EB1m t\u1EA1o \u0111i\u1EC1u ki\u1EC7n cho h\u1ECDc sinh ti\u1EBFp c\u1EADn t\u01B0 li\u1EC7u v\u1EC1 B\xE1c H\u1ED3 m\u1ECDi l\xFAc, m\u1ECDi n\u01A1i.`,
    metadata: {
      officialDispatchNo: "114/HD-SGD\u0110T",
      issuingAuthority: "S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o TP. H\u1ED3 Ch\xED Minh"
    }
  },
  {
    id: "DOC-HCM-016",
    title: "H\u1ED3 Ch\xED Minh \u2013 Bi\xEAn ni\xEAn ti\u1EC3u s\u1EED, T\u1EADp 1 (1890\u20131929)",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "Vi\u1EC7n L\u1ECBch s\u1EED \u0110\u1EA3ng - H\u1ECDc vi\u1EC7n Ch\xEDnh tr\u1ECB Qu\u1ED1c gia H\u1ED3 Ch\xED Minh (NXB S\u1EF1 th\u1EADt)",
    dateOrEra: "1890 - 1929",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Bi\xEAn ni\xEAn ti\u1EC3u s\u1EED", "Nguy\u1EC5n Sinh Cung", "Nguy\u1EC5n T\u1EA5t Th\xE0nh", "Nguy\u1EC5n \xC1i Qu\u1ED1c", "B\u1EBFn Nh\xE0 R\u1ED3ng", "\u0110\u1EA1i h\u1ED9i Tours", "H\u1ED9i VN C\xE1ch m\u1EA1ng Thanh ni\xEAn"],
    sourceUrl: "https://hochiminh.vn/book/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh/ho-chi-minh-bien-nien-tieu-su-tap-1-19-5-1890-1929-21",
    content: `H\u1ED3 s\u01A1 th\u01B0 m\u1EE5c v\xE0 tr\xEDch y\u1EBFu m\u1ED1c ni\xEAn bi\u1EC3u l\u1ECBch s\u1EED giai \u0111o\u1EA1n 1890 - 1929:
- 19/05/1890: C\u1EADu b\xE9 Nguy\u1EC5n Sinh Cung c\u1EA5t ti\u1EBFng kh\xF3c ch\xE0o \u0111\u1EDDi t\u1EA1i qu\xEA ngo\u1EA1i l\xE0ng Ho\xE0ng Tr\xF9 (x\xE3 Kim Li\xEAn, huy\u1EC7n Nam \u0110\xE0n, t\u1EC9nh Ngh\u1EC7 An). Th\xE2n ph\u1EE5 l\xE0 c\u1EE5 Ph\xF3 b\u1EA3ng Nguy\u1EC5n Sinh S\u1EAFc, th\xE2n m\u1EABu l\xE0 b\xE0 Ho\xE0ng Th\u1ECB Loan.
- 05/06/1911: Ng\u01B0\u1EDDi thanh ni\xEAn Nguy\u1EC5n T\u1EA5t Th\xE0nh v\u1EDBi t\xEAn V\u0103n Ba b\u01B0\u1EDBc l\xEAn con t\xE0u \u0110\xF4 \u0111\u1ED1c Latouche-Tr\xE9ville t\u1EA1i B\u1EBFn c\u1EA3ng Nh\xE0 R\u1ED3ng (S\xE0i G\xF2n), b\u1EAFt \u0111\u1EA7u cu\u1ED9c tr\u01B0\u1EDDng chinh t\xECm \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc.
- 18/06/1919: Thay m\u1EB7t H\u1ED9i nh\u1EEFng ng\u01B0\u1EDDi Vi\u1EC7t Nam y\xEAu n\u01B0\u1EDBc t\u1EA1i Ph\xE1p, Nguy\u1EC5n \xC1i Qu\u1ED1c g\u1EEDi b\u1EA3n "Y\xEAu s\xE1ch c\u1EE7a nh\xE2n d\xE2n An Nam" 8 \u0111i\u1EC3m t\u1EDBi H\u1ED9i ngh\u1ECB Versailles.
- Th\xE1ng 12/1920: T\u1EA1i \u0110\u1EA1i h\u1ED9i XVIII \u0110\u1EA3ng X\xE3 h\u1ED9i Ph\xE1p \u1EDF Tours, Nguy\u1EC5n \xC1i Qu\u1ED1c b\u1ECF phi\u1EBFu t\xE1n th\xE0nh gia nh\u1EADp Qu\u1ED1c t\u1EBF III v\xE0 s\xE1ng l\u1EADp \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Ph\xE1p.
- Th\xE1ng 6/1925: S\xE1ng l\u1EADp H\u1ED9i Vi\u1EC7t Nam C\xE1ch m\u1EA1ng Thanh ni\xEAn t\u1EA1i Qu\u1EA3ng Ch\xE2u (Trung Qu\u1ED1c), ra b\xE1o Thanh Ni\xEAn (21/6/1925) v\xE0 xu\u1EA5t b\u1EA3n \u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh (1927).
(Ghi ch\xFA: B\u1EA3n quy\u1EC1n chuy\xEAn kh\u1EA3o thu\u1ED9c NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt. L\u01B0u tr\u1EEF ch\u1EBF \u0111\u1ED9 METADATA_ONLY, ch\u1EDD ph\xEA duy\u1EC7t \u0111\u1ED9c l\u1EADp).`,
    metadata: {
      copyrightStatus: "METADATA_ONLY",
      volume: "T\u1EADp 1 (1890 - 1929)",
      isbn: "978-604-57-2384-5",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-017",
    title: "H\u1ED3 Ch\xED Minh \u2013 Bi\xEAn ni\xEAn ti\u1EC3u s\u1EED, T\u1EADp 2 (1930\u20139/1945)",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "Vi\u1EC7n L\u1ECBch s\u1EED \u0110\u1EA3ng - H\u1ECDc vi\u1EC7n Ch\xEDnh tr\u1ECB Qu\u1ED1c gia H\u1ED3 Ch\xED Minh (NXB S\u1EF1 th\u1EADt)",
    dateOrEra: "1930 - 9/1945",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Bi\xEAn ni\xEAn ti\u1EC3u s\u1EED", "Th\xE0nh l\u1EADp \u0110\u1EA3ng", "H\u1ED9i ngh\u1ECB Trung \u01B0\u01A1ng 8", "P\xE1c B\xF3 1941", "M\u1EB7t tr\u1EADn Vi\u1EC7t Minh", "C\xE1ch m\u1EA1ng Th\xE1ng T\xE1m", "Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp"],
    sourceUrl: "https://hochiminh.vn/book/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh/ho-chi-minh-bien-nien-tieu-su-tap-2-1930-9-1945-22",
    content: `H\u1ED3 s\u01A1 th\u01B0 m\u1EE5c v\xE0 tr\xEDch y\u1EBFu m\u1ED1c ni\xEAn bi\u1EC3u l\u1ECBch s\u1EED giai \u0111o\u1EA1n 1930 - th\xE1ng 9/1945:
- 06/01 - 07/02/1930: Nguy\u1EC5n \xC1i Qu\u1ED1c ch\u1EE7 tr\xEC H\u1ED9i ngh\u1ECB h\u1EE3p nh\u1EA5t c\xE1c t\u1ED5 ch\u1EE9c c\u1ED9ng s\u1EA3n t\u1EA1i C\u1EEDu Long (H\u01B0\u01A1ng C\u1EA3ng, Trung Qu\u1ED1c), th\xE0nh l\u1EADp \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam v\xE0 th\xF4ng qua Ch\xE1nh c\u01B0\u01A1ng v\u1EAFn t\u1EAFt, S\xE1ch l\u01B0\u1EE3c v\u1EAFn t\u1EAFt.
- 28/01/1941: Sau 30 n\u0103m b\xF4n ba, Ng\u01B0\u1EDDi v\u01B0\u1EE3t qua m\u1ED1c 108 bi\xEAn gi\u1EDBi Vi\u1EC7t - Trung v\u1EC1 \u0111\u1EBFn P\xE1c B\xF3 (Tr\u01B0\u1EDDng H\xE0, H\xE0 Qu\u1EA3ng, Cao B\u1EB1ng), tr\u1EF1c ti\u1EBFp l\xE3nh \u0111\u1EA1o c\xE1ch m\u1EA1ng Vi\u1EC7t Nam.
- 10 - 19/05/1941: Ch\u1EE7 tr\xEC H\u1ED9i ngh\u1ECB Trung \u01B0\u01A1ng 8 t\u1EA1i l\xE1n Khu\u1ED5i N\u1EB7m, quy\u1EBFt \u0111\u1ECBnh \u0111\u1EB7t nhi\u1EC7m v\u1EE5 gi\u1EA3i ph\xF3ng d\xE2n t\u1ED9c l\xEAn h\xE0ng \u0111\u1EA7u v\xE0 th\xE0nh l\u1EADp M\u1EB7t tr\u1EADn Vi\u1EC7t Minh (19/5/1941).
- 22/12/1944: Ch\u1EC9 th\u1ECB th\xE0nh l\u1EADp \u0110\u1ED9i Vi\u1EC7t Nam Tuy\xEAn truy\u1EC1n Gi\u1EA3i ph\xF3ng qu\xE2n t\u1EA1i nguy\xEAn qu\xE1n Cao B\u1EB1ng.
- Th\xE1ng 8/1945: L\xE3nh \u0111\u1EA1o T\u1ED5ng kh\u1EDFi ngh\u0129a gi\xE0nh ch\xEDnh quy\u1EC1n th\u1EAFng l\u1EE3i trong to\xE0n qu\u1ED1c.
- 02/09/1945: \u0110\u1ECDc b\u1EA3n Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp t\u1EA1i Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh, khai sinh n\u01B0\u1EDBc Vi\u1EC7t Nam D\xE2n ch\u1EE7 C\u1ED9ng h\xF2a.
(Ghi ch\xFA: B\u1EA3n quy\u1EC1n chuy\xEAn kh\u1EA3o thu\u1ED9c NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt. L\u01B0u tr\u1EEF ch\u1EBF \u0111\u1ED9 METADATA_ONLY, ch\u1EDD ph\xEA duy\u1EC7t \u0111\u1ED9c l\u1EADp).`,
    metadata: {
      copyrightStatus: "METADATA_ONLY",
      volume: "T\u1EADp 2 (1930 - 9/1945)",
      isbn: "978-604-57-2385-2",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-018",
    title: "\u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh (1927)",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "L\xE3nh t\u1EE5 Nguy\u1EC5n \xC1i Qu\u1ED1c (B\u1EA3o v\u1EADt Qu\u1ED1c gia s\u1ED1 1)",
    dateOrEra: "1927",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["\u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh", "T\u01B0 c\xE1ch ng\u01B0\u1EDDi c\xE1ch m\u1EC7nh", "Qu\u1EA3ng Ch\xE2u", "L\xFD lu\u1EADn v\xE0 th\u1EF1c ti\u1EC5n", "\u0110o\xE0n k\u1EBFt", "B\u1EA3o v\u1EADt Qu\u1ED1c gia"],
    sourceUrl: "https://hochiminh.vn/tac-pham-cua-ho-chi-minh",
    content: `T\xE1c ph\u1EA9m \u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh xu\u1EA5t b\u1EA3n n\u0103m 1927 t\u1EA1i Qu\u1EA3ng Ch\xE2u, l\xE0 c\u1EA9m nang ch\xEDnh tr\u1ECB n\u1EC1n t\u1EA3ng chu\u1EA9n b\u1ECB cho vi\u1EC7c th\xE0nh l\u1EADp \u0110\u1EA3ng.
1. T\u01B0 c\xE1ch m\u1ED9t ng\u01B0\u1EDDi c\xE1ch m\u1EC7nh:
- T\u1EF1 m\xECnh ph\u1EA3i: C\u1EA7n ki\u1EC7m. H\xF2a m\xE0 kh\xF4ng t\u01B0. C\u1EA3 quy\u1EBFt s\u1EEDa l\u1ED7i m\xECnh. C\u1EA9n th\u1EADn m\xE0 kh\xF4ng nh\xFAt nh\xE1t. Hay h\u1ECFi. Nh\u1EABn n\u1EA1i. V\u1ECB c\xF4ng vong t\u01B0. Kh\xF4ng hi\u1EBFu danh, kh\xF4ng ki\xEAu ng\u1EA1o. N\xF3i th\xEC ph\u1EA3i l\xE0m. Gi\u1EEF ch\u1EE7 ngh\u0129a cho v\u1EEFng. Hy sinh. \xCDt l\xF2ng tham mu\u1ED1n v\u1EC1 v\u1EADt ch\u1EA5t. Gi\u1EEF b\xED m\u1EADt.
- \u0110\u1ED1i ng\u01B0\u1EDDi ph\u1EA3i: V\u1EDBi t\u1EEBng ng\u01B0\u1EDDi th\xEC khoan th\u1EE9. V\u1EDBi \u0111o\xE0n th\u1EC3 th\xEC nghi\xEAm. C\xF3 l\xF2ng b\xE0y v\u1EBD cho ng\u01B0\u1EDDi. Tr\u1EF1c m\xE0 kh\xF4ng t\xE1o b\u1EA1o. \u0110\u1EB7ng xem x\xE9t ng\u01B0\u1EDDi.
- L\xE0m vi\u1EC7c ph\u1EA3i: Xem x\xE9t ho\xE0n c\u1EA3nh k\u1EF9 c\xE0ng. Quy\u1EBFt \u0111o\xE1n. D\u0169ng c\u1EA3m. Ph\u1EE5c t\xF9ng \u0111o\xE0n th\u1EC3.
2. Vai tr\xF2 c\u1EE7a l\xFD lu\u1EADn ti\u1EC1n phong: "C\xE1ch m\u1EC7nh tr\u01B0\u1EDBc h\u1EBFt ph\u1EA3i c\xF3 \u0111\u1EA3ng c\xE1ch m\u1EC7nh, \u0111\u1EC3 trong th\xEC v\u1EADn \u0111\u1ED9ng v\xE0 t\u1ED5 ch\u1EE9c d\xE2n ch\xFAng, ngo\xE0i th\xEC li\xEAn l\u1EA1c v\u1EDBi d\xE2n t\u1ED9c b\u1ECB \xE1p b\u1EE9c v\xE0 v\xF4 s\u1EA3n giai c\u1EA5p m\u1ECDi n\u01A1i. \u0110\u1EA3ng c\xF3 v\u1EEFng c\xE1ch m\u1EC7nh m\u1EDBi th\xE0nh c\xF4ng, c\u0169ng nh\u01B0 ng\u01B0\u1EDDi c\u1EA7m l\xE1i c\xF3 v\u1EEFng thuy\u1EC1n m\u1EDBi ch\u1EA1y".`,
    metadata: {
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      nationalTreasureNo: 1,
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-019",
    title: "C\xE1c v\u0103n ki\u1EC7n th\xE0nh l\u1EADp \u0110\u1EA3ng n\u0103m 1930",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "\u0110\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c ch\u1EE7 tr\xEC H\u1ED9i ngh\u1ECB th\xE0nh l\u1EADp \u0110\u1EA3ng",
    dateOrEra: "03/02/1930",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Ch\xE1nh c\u01B0\u01A1ng v\u1EAFn t\u1EAFt", "S\xE1ch l\u01B0\u1EE3c v\u1EAFn t\u1EAFt", "Ch\u01B0\u01A1ng tr\xECnh t\xF3m t\u1EAFt", "\u0110i\u1EC1u l\u1EC7 v\u1EAFn t\u1EAFt", "L\u1EDDi k\xEAu g\u1ECDi th\xE0nh l\u1EADp \u0110\u1EA3ng", "C\u1EEDu Long 1930", "C\u01B0\u01A1ng l\u0129nh ch\xEDnh tr\u1ECB \u0111\u1EA7u ti\xEAn"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `C\xE1c v\u0103n ki\u1EC7n th\xE0nh l\u1EADp \u0110\u1EA3ng \u0111\u01B0\u1EE3c H\u1ED9i ngh\u1ECB h\u1EE3p nh\u1EA5t th\xF4ng qua (t\u1EEB 06/01 \u0111\u1EBFn 07/02/1930 t\u1EA1i C\u1EEDu Long, H\u01B0\u01A1ng C\u1EA3ng, do \u0111\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c ch\u1EE7 tr\xEC):
1. V\u0102N KI\u1EC6N 1 - CH\xC1NH C\u01AF\u01A0NG V\u1EAEN T\u1EAET C\u1EE6A \u0110\u1EA2NG:
X\xE1c \u0111\u1ECBnh \u0111\u01B0\u1EDDng l\u1ED1i chi\u1EBFn l\u01B0\u1EE3c: L\xE0m t\u01B0 s\u1EA3n d\xE2n quy\u1EC1n c\xE1ch m\u1EA1ng v\xE0 th\u1ED5 \u0111\u1ECBa c\xE1ch m\u1EA1ng \u0111\u1EC3 \u0111i t\u1EDBi x\xE3 h\u1ED9i c\u1ED9ng s\u1EA3n. \u0110\xE1nh \u0111\u1ED5 \u0111\u1EBF qu\u1ED1c ch\u1EE7 ngh\u0129a Ph\xE1p v\xE0 b\u1ECDn phong ki\u1EBFn tay sai, l\xE0m cho n\u01B0\u1EDBc Nam ho\xE0n to\xE0n \u0111\u1ED9c l\u1EADp, d\u1EF1ng l\xEAn ch\xEDnh ph\u1EE7 c\xF4ng n\xF4ng binh, t\u1ED5 ch\u1EE9c qu\xE2n \u0111\u1ED9i c\xF4ng n\xF4ng, t\u1ECBch thu t\xE0i s\u1EA3n c\u1EE7a \u0111\u1EBF qu\u1ED1c trao cho d\xE2n c\xE0y ngh\xE8o.
2. V\u0102N KI\u1EC6N 2 - S\xC1CH L\u01AF\u1EE2C V\u1EAEN T\u1EAET C\u1EE6A \u0110\u1EA2NG:
\u0110\u1EA3ng l\xE0 \u0111\u1ED9i ti\xEAn phong c\u1EE7a v\xF4 s\u1EA3n giai c\u1EA5p; ph\u1EA3i thu ph\u1EE5c cho \u0111\u01B0\u1EE3c \u0111\u1EA1i b\u1ED9 ph\u1EADn giai c\u1EA5p m\xECnh, l\xF4i k\xE9o n\xF4ng d\xE2n v\xE0 li\xEAn l\u1EA1c m\u1EADt thi\u1EBFt v\u1EDBi ti\u1EC3u t\u01B0 s\u1EA3n, tr\xED th\u1EE9c, trung n\xF4ng. \u0110\u1ED1i v\u1EDBi ph\xFA n\xF4ng, trung ti\u1EC3u \u0111\u1ECBa ch\u1EE7 v\xE0 t\u01B0 s\u1EA3n An Nam m\xE0 ch\u01B0a r\xF5 m\u1EB7t ph\u1EA3n c\xE1ch m\u1EA1ng th\xEC ph\u1EA3i l\u1EE3i d\u1EE5ng, \xEDt nh\u1EA5t l\xE0m cho h\u1ECD \u0111\u1EE9ng trung l\u1EADp.
3. V\u0102N KI\u1EC6N 3 - CH\u01AF\u01A0NG TR\xCCNH T\xD3M T\u1EAET C\u1EE6A \u0110\u1EA2NG:
\u0110o\xE0n k\u1EBFt c\xF4ng nh\xE2n, n\xF4ng d\xE2n; th\u1EF1c hi\u1EC7n ng\xE0y l\xE0m 8 gi\u1EDD; x\xF3a b\u1ECF s\u01B0u thu\u1EBF v\xF4 l\xFD; b\u1EA3o \u0111\u1EA3m quy\u1EC1n t\u1EF1 do h\u1ED9i h\u1ECDp, ng\xF4n lu\u1EADn cho nh\xE2n d\xE2n lao \u0111\u1ED9ng.
4. V\u0102N KI\u1EC6N 4 - \u0110I\u1EC0U L\u1EC6 V\u1EAEN T\u1EAET C\u1EE6A \u0110\u1EA2NG:
Quy \u0111\u1ECBnh t\xF4n ch\u1EC9 m\u1EE5c \u0111\xEDch, nguy\xEAn t\u1EAFc t\u1ED5 ch\u1EE9c t\u1EADp trung d\xE2n ch\u1EE7, \u0111i\u1EC1u ki\u1EC7n k\u1EBFt n\u1EA1p \u0111\u1EA3ng vi\xEAn v\xE0 h\u1EC7 th\u1ED1ng t\u1ED5 ch\u1EE9c t\u1EEB chi b\u1ED9 \u0111\u1EBFn Trung \u01B0\u01A1ng.
5. V\u0102N KI\u1EC6N 5 - L\u1EDCI K\xCAU G\u1ECCI NH\xC2N D\u1ECAP TH\xC0NH L\u1EACP \u0110\u1EA2NG (18/02/1930):
L\u1EDDi k\xEAu g\u1ECDi l\u1ECBch s\u1EED c\u1EE7a Nguy\u1EC5n \xC1i Qu\u1ED1c g\u1EEDi t\u1EDBi to\xE0n th\u1EC3 c\xF4ng nh\xE2n, n\xF4ng d\xE2n, binh l\xEDnh, thanh ni\xEAn, h\u1ECDc sinh: \u0110\u1EBF qu\u1ED1c Ph\xE1p x\xE2m l\u01B0\u1EE3c \xE1p b\u1EE9c \u0111\u1ED3ng b\xE0o; nay c\xE1c t\u1ED5 ch\u1EE9c c\u1ED9ng s\u1EA3n \u0111\xE3 th\u1ED1ng nh\u1EA5t th\xE0nh \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam; k\xEAu g\u1ECDi to\xE0n th\u1EC3 \u0111\u1ED3ng b\xE0o gia nh\u1EADp v\xE0 \u1EE7ng h\u1ED9 \u0110\u1EA3ng \u0111\xE1nh \u0111u\u1ED5i gi\u1EB7c ngo\u1EA1i x\xE2m.`,
    metadata: {
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      subDocumentsCount: 5,
      subDocumentsList: [
        "Ch\xE1nh c\u01B0\u01A1ng v\u1EAFn t\u1EAFt c\u1EE7a \u0110\u1EA3ng",
        "S\xE1ch l\u01B0\u1EE3c v\u1EAFn t\u1EAFt c\u1EE7a \u0110\u1EA3ng",
        "Ch\u01B0\u01A1ng tr\xECnh t\xF3m t\u1EAFt c\u1EE7a \u0110\u1EA3ng",
        "\u0110i\u1EC1u l\u1EC7 v\u1EAFn t\u1EAFt c\u1EE7a \u0110\u1EA3ng",
        "L\u1EDDi k\xEAu g\u1ECDi nh\xE2n d\u1ECBp th\xE0nh l\u1EADp \u0110\u1EA3ng (18/02/1930)"
      ],
      conferenceVenue: "C\u1EEDu Long (C\u1EEDu Long - H\u01B0\u01A1ng C\u1EA3ng, Trung Qu\u1ED1c)",
      conferenceDates: "06/01/1930 - 07/02/1930",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-020",
    title: "C\u1EA7n, Ki\u1EC7m, Li\xEAm, Ch\xEDnh (1949)",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (B\xFAt danh L\xEA Quy\u1EBFt Th\u1EAFng - B\xE1o C\u1EE9u Qu\u1ED1c)",
    dateOrEra: "Th\xE1ng 5 - 6/1949",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["C\u1EA7n", "Ki\u1EC7m", "Li\xEAm", "Ch\xEDnh", "Ch\xED c\xF4ng v\xF4 t\u01B0", "L\xEA Quy\u1EBFt Th\u1EAFng", "\u0110\u1EA1o \u0111\u1EE9c c\xF4ng d\xE2n", "B\u1ED1n m\xF9a c\u1EE7a tr\u1EDDi", "B\xE1o C\u1EE9u Qu\u1ED1c 1949"],
    sourceUrl: "https://hochiminh.vn/upload/3000001/20251024/65e0340736cc411805ab4818604f62f1HO_CHI_MINH_TOAN_TAP_-_TAP_6.pdf",
    content: `B\u1ED9 b\u1ED1n b\xE0i vi\u1EBFt chuy\xEAn kh\u1EA3o v\u1EC1 \u0111\u1EA1o \u0111\u1EE9c m\u1EDBi c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh, k\xFD b\xFAt danh L\xEA Quy\u1EBFt Th\u1EAFng \u0111\u0103ng li\xEAn ti\u1EBFp tr\xEAn B\xE1o C\u1EE9u Qu\u1ED1c:
- B\xC0I 1: TH\u1EBE N\xC0O L\xC0 C\u1EA6N? (\u0110\u0103ng b\xE1o ng\xE0y 30/5/1949):
"C\u1EA7n t\u1EE9c l\xE0 si\xEAng n\u0103ng, ch\u0103m ch\u1EC9, c\u1ED1 g\u1EAFng d\u1EBBo dai. Mu\u1ED1n c\u1EA7n th\xEC vi\u1EC7c g\xEC c\u0169ng ph\u1EA3i c\xF3 k\u1EBF ho\u1EA1ch chu \u0111\xE1o. Bi\u1EBFt vi\u1EC7c n\xE0o n\xEAn l\xE0m tr\u01B0\u1EDBc, vi\u1EC7c n\xE0o l\xE0m sau. L\xE0m vi\u1EC7c g\xEC c\u0169ng ph\u1EA3i c\xF3 s\xE1ng ki\u1EBFn, t\xECm c\xE1ch l\xE0m nhanh m\xE0 t\u1ED1t, l\xE0m vi\u1EC7c b\u1EC1n gan, kh\xF4ng n\u1EA3n l\xF2ng".
- B\xC0I 2: TH\u1EBE N\xC0O L\xC0 KI\u1EC6M? (\u0110\u0103ng b\xE1o ng\xE0y 31/5/1949):
"Ki\u1EC7m l\xE0 ti\u1EBFt ki\u1EC7m, kh\xF4ng xa x\u1EC9, kh\xF4ng hoang ph\xED, kh\xF4ng b\u1EEBa b\xE3i. Ti\u1EBFt ki\u1EC7m ti\u1EC1n b\u1EA1c, ti\u1EBFt ki\u1EC7m th\xEC gi\u1EDD, ti\u1EBFt ki\u1EC7m s\u1EE9c lao \u0111\u1ED9ng c\u1EE7a m\xECnh v\xE0 c\u1EE7a nh\xE2n d\xE2n. Ti\u1EBFt ki\u1EC7m kh\xF4ng ph\u1EA3i l\xE0 b\u1EE7n x\u1EC9n, keo ki\u1EC7t; vi\u1EC7c \u0111\xE1ng chi m\u1ED9t v\u1EA1n \u0111\u1ED3ng c\u0169ng ph\u1EA3i chi, vi\u1EC7c kh\xF4ng \u0111\xE1ng chi m\u1ED9t \u0111\u1ED3ng c\u0169ng kh\xF4ng chi".
- B\xC0I 3: TH\u1EBE N\xC0O L\xC0 LI\xCAM? (\u0110\u0103ng b\xE1o ng\xE0y 01/6/1949):
"Li\xEAm l\xE0 trong s\u1EA1ch, kh\xF4ng tham lam. Ng\xE0y x\u01B0a quan l\u1EA1i kh\xF4ng \u0111\u1EE5c kho\xE9t d\xE2n l\xE0 li\xEAm. Ng\xE0y nay, m\u1ECDi ng\u01B0\u1EDDi ai gi\u1EEF ch\u1EEF Li\xEAm \u0111\u1EC1u kh\xF4ng tham \u0111\u1ECBa v\u1ECB, kh\xF4ng tham ti\u1EC1n t\xE0i, kh\xF4ng tham t\xE2ng b\u1ED1c. C\xE1n b\u1ED9 tham \xF4, l\xE3ng ph\xED l\xE0 t\u1ED9i \xE1c \u0111\u1ED1i v\u1EDBi \u0111\u1ED3ng b\xE0o, T\u1ED5 qu\u1ED1c".
- B\xC0I 4: TH\u1EBE N\xC0O L\xC0 CH\xCDNH? (\u0110\u0103ng b\xE1o ng\xE0y 02/6/1949):
"Ch\xEDnh ngh\u0129a l\xE0 kh\xF4ng t\xE0, th\u1EB3ng th\u1EAFn, \u0111\u1EE9ng \u0111\u1EAFn. \u0110\u1ED1i v\u1EDBi m\xECnh: Kh\xF4ng t\u1EF1 cao t\u1EF1 \u0111\u1EA1i, lu\xF4n c\u1EA7u ti\u1EBFn b\u1ED9. \u0110\u1ED1i v\u1EDBi ng\u01B0\u1EDDi: Kh\xF4ng n\u1ECBnh h\xF3t k\u1EBB tr\xEAn, kh\xF4ng xem khinh ng\u01B0\u1EDDi d\u01B0\u1EDBi; ch\xE2n th\xE0nh, khi\xEAm t\u1ED1n. \u0110\u1ED1i v\u1EDBi vi\u1EC7c: Vi\u1EC7c thi\u1EC7n d\xF9 nh\u1ECF m\u1EA5y c\u0169ng l\xE0m, vi\u1EC7c \xE1c d\xF9 nh\u1ECF m\u1EA5y c\u0169ng tr\xE1nh. Vi\u1EC7c c\xF4ng l\xEAn tr\xEAn, vi\u1EC7c t\u01B0 l\xEAn sau".
- T\u1ED4NG K\u1EBET BI\u1EC6N CH\u1EE8NG B\u1ED0N \u0110\u1EE8C T\xCDNH:
"Tr\u1EDDi c\xF3 b\u1ED1n m\xF9a: Xu\xE2n, H\u1EA1, Thu, \u0110\xF4ng.
\u0110\u1EA5t c\xF3 b\u1ED1n ph\u01B0\u01A1ng: \u0110\xF4ng, T\xE2y, Nam, B\u1EAFc.
Ng\u01B0\u1EDDi c\xF3 b\u1ED1n \u0111\u1EE9c: C\u1EA7n, Ki\u1EC7m, Li\xEAm, Ch\xEDnh.
Thi\u1EBFu m\u1ED9t m\xF9a, th\xEC kh\xF4ng th\xE0nh tr\u1EDDi.
Thi\u1EBFu m\u1ED9t ph\u01B0\u01A1ng, th\xEC kh\xF4ng th\xE0nh \u0111\u1EA5t.
Thi\u1EBFu m\u1ED9t \u0111\u1EE9c, th\xEC kh\xF4ng th\xE0nh ng\u01B0\u1EDDi".`,
    metadata: {
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      pseudonym: "L\xEA Quy\u1EBFt Th\u1EAFng",
      articleDates: {
        can: "30/05/1949",
        kiem: "31/05/1949",
        liem: "01/06/1949",
        chinh: "02/06/1949"
      },
      newspaper: "B\xE1o C\u1EE9u Qu\u1ED1c (C\u01A1 quan T\u1ED5ng b\u1ED9 Vi\u1EC7t Minh)",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-021",
    title: "L\u1EDDi k\xEAu g\u1ECDi thi \u0111ua \xE1i qu\u1ED1c (11/6/1948)",
    category: "school-education",
    categoryLabel: "Gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng & Thi \u0111ua \xE1i qu\u1ED1c h\u1ECDc \u0111\u01B0\u1EDDng",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (Vi\u1EBFt ng\xE0y 11/6/1948; \u0110\u0103ng B\xE1o C\u1EE9u Qu\u1ED1c s\u1ED1 968 ng\xE0y 24/6/1948)",
    dateOrEra: "11/06/1948 (\u0110\u0103ng b\xE1o: 24/06/1948)",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Thi \u0111ua \xE1i qu\u1ED1c", "11/6/1948", "B\xE1o C\u1EE9u Qu\u1ED1c s\u1ED1 968", "Di\u1EC7t gi\u1EB7c \u0111\xF3i", "Di\u1EC7t gi\u1EB7c d\u1ED1t", "Di\u1EC7t gi\u1EB7c ngo\u1EA1i x\xE2m", "Ng\u01B0\u1EDDi ng\u01B0\u1EDDi thi \u0111ua", "Thi \u0111ua l\xE0 y\xEAu n\u01B0\u1EDBc"],
    sourceUrl: "https://hochiminh.vn",
    content: `L\u1EDDi k\xEAu g\u1ECDi thi \u0111ua \xE1i qu\u1ED1c c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh:
- Ng\xE0y so\u1EA1n th\u1EA3o v\xE0 ban h\xE0nh: 11 th\xE1ng 6 n\u0103m 1948 t\u1EA1i Chi\u1EBFn khu Vi\u1EC7t B\u1EAFc (ngu\u1ED3n g\u1ED1c Ng\xE0y truy\u1EC1n th\u1ED1ng Thi \u0111ua y\xEAu n\u01B0\u1EDBc Vi\u1EC7t Nam).
- Ng\xE0y c\xF4ng b\u1ED1 b\xE1o ch\xED: \u0110\u0103ng t\u1EA3i l\u1EA7n \u0111\u1EA7u tr\xEAn B\xE1o C\u1EE9u Qu\u1ED1c, s\u1ED1 968, ng\xE0y 24 th\xE1ng 6 n\u0103m 1948.
N\u1ED9i dung c\u1ED1t l\xF5i c\u1EE7a L\u1EDDi k\xEAu g\u1ECDi:
1. M\u1EE5c \u0111\xEDch thi \u0111ua \xE1i qu\u1ED1c: "Di\u1EC7t gi\u1EB7c \u0111\xF3i, di\u1EC7t gi\u1EB7c d\u1ED1t, di\u1EC7t gi\u1EB7c ngo\u1EA1i x\xE2m", \u0111em l\u1EA1i cu\u1ED9c s\u1ED1ng \u1EA5m no, \u0111\u1ED9c l\u1EADp, t\u1EF1 do cho to\xE0n d\xE2n t\u1ED9c.
2. C\xE1ch l\xE0m: D\u1EF1a v\xE0o l\u1EF1c l\u01B0\u1EE3ng c\u1EE7a d\xE2n, tinh th\u1EA7n c\u1EE7a d\xE2n \u0111\u1EC3 g\xE2y h\u1EA1nh ph\xFAc cho d\xE2n.
3. \u0110\u1ED1i t\u01B0\u1EE3ng tham gia: B\u1EA5t k\u1EF3 ai - gi\xE0, tr\u1EBB, g\xE1i, trai, gi\xE0u, ngh\xE8o, qu\xE2n, d\xE2n - ai n\u1EA5y \u0111\u1EC1u thi \u0111ua l\xE0m tr\xF2n b\u1ED5n ph\u1EADn c\u1EE7a m\xECnh.
4. Ch\xE2n l\xFD b\u1EA5t h\u1EE7: "Thi \u0111ua l\xE0 y\xEAu n\u01B0\u1EDBc, y\xEAu n\u01B0\u1EDBc th\xEC ph\u1EA3i thi \u0111ua. V\xE0 nh\u1EEFng ng\u01B0\u1EDDi thi \u0111ua l\xE0 nh\u1EEFng ng\u01B0\u1EDDi y\xEAu n\u01B0\u1EDBc nh\u1EA5t".
5. \u1EE8ng d\u1EE5ng trong nh\xE0 tr\u01B0\u1EDDng: Th\u1EA7y thi \u0111ua d\u1EA1y t\u1ED1t, tr\xF2 thi \u0111ua h\u1ECDc t\u1ED1t, r\xE8n luy\u1EC7n ch\u0103m ch\u1EC9 \u0111\u1EE9c - tr\xED - th\u1EC3 - m\u1EF9 \u0111\u1EC3 mai sau ph\u1EE5ng s\u1EF1 qu\xEA h\u01B0\u01A1ng \u0111\u1EA5t n\u01B0\u1EDBc.`,
    metadata: {
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      writtenDate: "11/06/1948",
      publishedDate: "24/06/1948",
      newspaper: "B\xE1o C\u1EE9u Qu\u1ED1c",
      issueNumber: "968",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-022",
    title: "\u0110\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng (1958)",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (B\xFAt danh Tr\u1EA7n L\u1EF1c - T\u1EA1p ch\xED H\u1ECDc t\u1EADp s\u1ED1 12/1958)",
    dateOrEra: "Th\xE1ng 12/1958",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["\u0110\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng", "Ch\u1ED1ng ch\u1EE7 ngh\u0129a c\xE1 nh\xE2n", "Tr\u1EA7n L\u1EF1c", "T\u1EA1p ch\xED H\u1ECDc t\u1EADp", "Ng\u1ECDc c\xE0ng m\xE0i c\xE0ng s\xE1ng", "\u0110\u1EB7t l\u1EE3i \xEDch nh\xE2n d\xE2n l\xEAn tr\xEAn h\u1EBFt"],
    sourceUrl: "https://hochiminh.vn/tac-pham-cua-ho-chi-minh/nang-cao-dao-duc-cach-mang-quet-sach-chu-nghia-ca-nhan-7748",
    content: `T\xE1c ph\u1EA9m \u0111\u0103ng tr\xEAn T\u1EA1p ch\xED H\u1ECDc t\u1EADp s\u1ED1 12/1958 d\u01B0\u1EDBi b\xFAt danh Tr\u1EA7n L\u1EF1c:
1. V\u1ECB tr\xED n\u1EC1n t\u1EA3ng c\u1EE7a \u0111\u1EA1o \u0111\u1EE9c: "Ng\u01B0\u1EDDi c\xE1ch m\u1EA1ng ph\u1EA3i c\xF3 \u0111\u1EA1o \u0111\u1EE9c, kh\xF4ng c\xF3 \u0111\u1EA1o \u0111\u1EE9c th\xEC d\xF9 t\xE0i gi\u1ECFi m\u1EA5y c\u0169ng kh\xF4ng l\xE3nh \u0111\u1EA1o \u0111\u01B0\u1EE3c nh\xE2n d\xE2n. C\u0169ng nh\u01B0 s\xF4ng th\xEC c\xF3 ngu\u1ED3n m\u1EDBi c\xF3 n\u01B0\u1EDBc, kh\xF4ng c\xF3 ngu\u1ED3n th\xEC s\xF4ng c\u1EA1n. C\xE2y ph\u1EA3i c\xF3 g\u1ED1c, kh\xF4ng c\xF3 g\u1ED1c th\xEC c\xE2y h\xE9o".
2. B\u1EA3n ch\u1EA5t \u0111\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng: Quy\u1EBFt t\xE2m su\u1ED1t \u0111\u1EDDi \u0111\u1EA5u tranh cho \u0110\u1EA3ng, cho c\xE1ch m\u1EA1ng; \u0111\u1EB7t l\u1EE3i \xEDch c\u1EE7a \u0110\u1EA3ng v\xE0 c\u1EE7a nh\xE2n d\xE2n lao \u0111\u1ED9ng l\xEAn tr\xEAn, l\xEAn tr\u01B0\u1EDBc l\u1EE3i \xEDch ri\xEAng c\u1EE7a c\xE1 nh\xE2n m\xECnh.
3. Ch\u1ED1ng ch\u1EE7 ngh\u0129a c\xE1 nh\xE2n: Ch\u1EE7 ngh\u0129a c\xE1 nh\xE2n l\xE0 th\u1EE9 vi tr\xF9ng r\u1EA5t \u0111\u1ED9c, \u0111\u1EBB ra h\xE0ng tr\u0103m th\u1EE9 b\u1EC7nh h\u01B0 h\u1ECFng (khoe khoang, tham \xF4, l\u01B0\u1EDDi bi\u1EBFng, \u0111\u1ED9c \u0111o\xE1n). X\xE2y d\u1EF1ng CNXH kh\xF4ng th\u1EC3 t\xE1ch r\u1EDDi cu\u1ED9c \u0111\u1EA5u tranh tr\u1EEB b\u1ECF ch\u1EE7 ngh\u0129a c\xE1 nh\xE2n.
4. Ph\u01B0\u01A1ng ph\xE1p r\xE8n luy\u1EC7n: "\u0110\u1EA1o \u0111\u1EE9c c\xE1ch m\u1EA1ng kh\xF4ng ph\u1EA3i tr\xEAn tr\u1EDDi sa xu\u1ED1ng. N\xF3 do \u0111\u1EA5u tranh, r\xE8n luy\u1EC7n b\u1EC1n b\u1EC9 h\xE0ng ng\xE0y m\xE0 ph\xE1t tri\u1EC3n v\xE0 c\u1EE7ng c\u1ED1. C\u0169ng nh\u01B0 ng\u1ECDc c\xE0ng m\xE0i c\xE0ng s\xE1ng, v\xE0ng c\xE0ng luy\u1EC7n c\xE0ng trong".`,
    metadata: {
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      journalNo: "12/1958",
      batch: "BATCH_A"
    }
  },
  {
    id: "DOC-HCM-023",
    title: "B\u1EA3n Y\xEAu s\xE1ch c\u1EE7a nh\xE2n d\xE2n An Nam g\u1EEDi H\u1ED9i ngh\u1ECB Versailles (18/6/1919)",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "Nguy\u1EC5n \xC1i Qu\u1ED1c (thay m\u1EB7t Nh\xF3m nh\u1EEFng ng\u01B0\u1EDDi Vi\u1EC7t Nam y\xEAu n\u01B0\u1EDBc t\u1EA1i Ph\xE1p)",
    dateOrEra: "18/06/1919",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Y\xEAu s\xE1ch nh\xE2n d\xE2n An Nam", "Versailles", "1919", "Nguy\u1EC5n \xC1i Qu\u1ED1c", "Quy\u1EC1n t\u1EF1 do d\xE2n ch\u1EE7", "H\u1ED9i ngh\u1ECB h\xF2a b\xECnh"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `Ng\xE0y 18 th\xE1ng 6 n\u0103m 1919, nh\xE2n d\u1ECBp c\xE1c n\u01B0\u1EDBc th\u1EAFng tr\u1EADn trong Th\u1EBF chi\u1EBFn th\u1EE9 nh\u1EA5t h\u1ECDp H\u1ED9i ngh\u1ECB h\xF2a b\xECnh t\u1EA1i Cung \u0111i\u1EC7n Versailles (Ph\xE1p), thay m\u1EB7t "Nh\xF3m nh\u1EEFng ng\u01B0\u1EDDi Vi\u1EC7t Nam y\xEAu n\u01B0\u1EDBc" t\u1EA1i Ph\xE1p, \u0111\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c \u0111\xE3 g\u1EEDi t\u1EDBi H\u1ED9i ngh\u1ECB b\u1EA3n "Y\xEAu s\xE1ch c\u1EE7a nh\xE2n d\xE2n An Nam" (Revendications du peuple annamite).

B\u1EA3n Y\xEAu s\xE1ch g\u1ED3m 8 \u0111i\u1EC3m \u0111\xF2i quy\u1EC1n t\u1EF1 do, b\xECnh \u0111\u1EB3ng v\xE0 d\xE2n ch\u1EE7 c\u01A1 b\u1EA3n:
1. T\u1ED5ng \xE2n x\xE1 cho t\u1EA5t c\u1EA3 nh\u1EEFng ng\u01B0\u1EDDi b\u1EA3n x\u1EE9 b\u1ECB t\xF9 \u0111\xE0y ch\xEDnh tr\u1ECB.
2. C\u1EA3i c\xE1ch n\u1EC1n t\u01B0 ph\xE1p \u1EDF \u0110\xF4ng D\u01B0\u01A1ng b\u1EB1ng c\xE1ch cho ng\u01B0\u1EDDi b\u1EA3n x\u1EE9 \u0111\u01B0\u1EE3c quy\u1EC1n h\u01B0\u1EDFng nh\u1EEFng b\u1EA3o \u0111\u1EA3m t\u01B0 ph\xE1p nh\u01B0 ng\u01B0\u1EDDi ch\xE2u \xC2u; x\xF3a b\u1ECF c\xE1c t\xF2a \xE1n \u0111\u1EB7c bi\u1EC7t.
3. T\u1EF1 do b\xE1o ch\xED v\xE0 t\u1EF1 do ng\xF4n lu\u1EADn.
4. T\u1EF1 do l\u1EADp h\u1ED9i v\xE0 h\u1ED9i h\u1ECDp.
5. T\u1EF1 do c\u01B0 tr\xFA v\xE0 xu\u1EA5t d\u01B0\u01A1ng.
6. T\u1EF1 do h\u1ECDc t\u1EADp, m\u1EDF c\xE1c tr\u01B0\u1EDDng k\u1EF9 thu\u1EADt v\xE0 chuy\xEAn nghi\u1EC7p cho ng\u01B0\u1EDDi b\u1EA3n x\u1EE9 \u1EDF c\xE1c t\u1EC9nh.
7. Thay th\u1EBF ch\u1EBF \u0111\u1ED9 cai tr\u1ECB b\u1EB1ng c\xE1c s\u1EAFc l\u1EC7nh b\u1EB1ng ch\u1EBF \u0111\u1ED9 ra c\xE1c \u0111\u1EA1o lu\u1EADt.
8. C\xF3 \u0111o\xE0n \u0111\u1EA1i bi\u1EC3u th\u01B0\u1EDDng tr\u1EF1c c\u1EE7a ng\u01B0\u1EDDi b\u1EA3n x\u1EE9 do ch\xEDnh ng\u01B0\u1EDDi b\u1EA3n x\u1EE9 b\u1EA7u ra t\u1EA1i Ngh\u1ECB vi\u1EC7n Ph\xE1p \u0111\u1EC3 ph\u1EA3n \xE1nh nguy\u1EC7n v\u1ECDng \u0111\u1ECBa ph\u01B0\u01A1ng.

\xDD ngh\u0129a l\u1ECBch s\u1EED: \u0110\xE2y l\xE0 l\u1EA7n \u0111\u1EA7u ti\xEAn t\xEAn g\u1ECDi Nguy\u1EC5n \xC1i Qu\u1ED1c xu\u1EA5t hi\u1EC7n c\xF4ng khai tr\xEAn v\u0169 \u0111\xE0i ch\xEDnh tr\u1ECB qu\u1ED1c t\u1EBF, t\u1EA1o ti\u1EBFng vang ch\u1EA5n \u0111\u1ED9ng d\u01B0 lu\u1EADn Ph\xE1p v\xE0 c\xE1c thu\u1ED9c \u0111\u1ECBa, m\u1EDF \u0111\u1EA7u th\u1EDDi k\u1EF3 \u0111\u1EA5u tranh ch\xEDnh tr\u1ECB tr\u1EF1c di\u1EC7n c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam.`,
    metadata: {
      eventDate: "18/06/1919",
      location: "Cung \u0111i\u1EC7n Versailles, Paris, C\u1ED9ng h\xF2a Ph\xE1p",
      historicSignificance: "M\u1ED1c son xu\u1EA5t hi\u1EC7n danh x\u01B0ng Nguy\u1EC5n \xC1i Qu\u1ED1c tr\xEAn tr\u01B0\u1EDDng qu\u1ED1c t\u1EBF"
    }
  },
  {
    id: "DOC-HCM-024",
    title: "Th\xE0nh l\u1EADp H\u1ED9i Vi\u1EC7t Nam C\xE1ch m\u1EA1ng Thanh ni\xEAn (6/1925) & B\xE1o Thanh Ni\xEAn",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "L\xE3nh t\u1EE5 Nguy\u1EC5n \xC1i Qu\u1ED1c - Qu\u1EA3ng Ch\xE2u, Trung Qu\u1ED1c",
    dateOrEra: "Th\xE1ng 6/1925",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["H\u1ED9i Vi\u1EC7t Nam C\xE1ch m\u1EA1ng Thanh ni\xEAn", "B\xE1o Thanh Ni\xEAn", "Qu\u1EA3ng Ch\xE2u", "1925", "\u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh", "Chu\u1EA9n b\u1ECB th\xE0nh l\u1EADp \u0110\u1EA3ng"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `Th\xE1ng 6 n\u0103m 1925, t\u1EA1i th\xE0nh ph\u1ED1 Qu\u1EA3ng Ch\xE2u (Trung Qu\u1ED1c), \u0111\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c s\xE1ng l\u1EADp H\u1ED9i Vi\u1EC7t Nam C\xE1ch m\u1EA1ng Thanh ni\xEAn - t\u1ED5 ch\u1EE9c ti\u1EC1n th\xE2n c\xF3 \xFD ngh\u0129a quy\u1EBFt \u0111\u1ECBnh tr\u1EF1c ti\u1EBFp t\u1EDBi s\u1EF1 ra \u0111\u1EDDi c\u1EE7a \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam.

Nh\u1EEFng c\u1ED1ng hi\u1EBFn l\u1ECBch s\u1EED ti\xEAu bi\u1EC3u c\u1EE7a H\u1ED9i:
1. Tr\u1EF1c ti\u1EBFp m\u1EDF c\xE1c l\u1EDBp hu\u1EA5n luy\u1EC7n ch\xEDnh tr\u1ECB c\xE1ch m\u1EA1ng do \u0111\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y, \u0111\xE0o t\u1EA1o \u0111\u1ED9i ng\u0169 c\xE1n b\u1ED9 ki\xEAn trung \u0111\u1EA7u ti\xEAn cho c\xE1ch m\u1EA1ng Vi\u1EC7t Nam nh\u01B0 Tr\u1EA7n Ph\xFA, L\xEA H\u1ED3ng Phong, Nguy\u1EC5n Th\u1ECB Minh Khai...
2. Xu\u1EA5t b\u1EA3n tu\u1EA7n b\xE1o "Thanh Ni\xEAn" - c\u01A1 quan ng\xF4n lu\u1EADn c\u1EE7a T\u1ED5ng b\u1ED9 H\u1ED9i, s\u1ED1 1 ra ng\xE0y 21/6/1925. \u0110\xE2y l\xE0 m\u1ED1c son m\u1EDF \u0111\u1EA7u d\xF2ng B\xE1o ch\xED C\xE1ch m\u1EA1ng Vi\u1EC7t Nam, l\u1EA5y ng\xE0y 21/6 l\xE0m Ng\xE0y B\xE1o ch\xED C\xE1ch m\u1EA1ng Vi\u1EC7t Nam.
3. Xu\u1EA5t b\u1EA3n cu\u1ED1n c\u1EA9m nang l\xFD lu\u1EADn kinh \u0111i\u1EC3n "\u0110\u01B0\u1EDDng K\xE1ch m\u1EC7nh" (n\u0103m 1927) t\u1EADp h\u1EE3p c\xE1c b\xE0i gi\u1EA3ng c\u1EE7a Ng\u01B0\u1EDDi, ch\u1EC9 r\xF5 t\xEDnh ch\u1EA5t c\xE1ch m\u1EA1ng gi\u1EA3i ph\xF3ng d\xE2n t\u1ED9c v\xE0 vai tr\xF2 l\xE3nh \u0111\u1EA1o c\u1EE7a \u0110\u1EA3ng ti\xEAn phong.

H\u1ED9i Vi\u1EC7t Nam C\xE1ch m\u1EA1ng Thanh ni\xEAn l\xE0 c\u1EA7u n\u1ED1i truy\u1EC1n b\xE1 ch\u1EE7 ngh\u0129a M\xE1c - L\xEAnin v\xE0o phong tr\xE0o c\xF4ng nh\xE2n v\xE0 phong tr\xE0o y\xEAu n\u01B0\u1EDBc, chu\u1EA9n b\u1ECB ch\xEDn mu\u1ED3i v\u1EC1 ch\xEDnh tr\u1ECB, t\u01B0 t\u01B0\u1EDFng v\xE0 t\u1ED5 ch\u1EE9c cho H\u1ED9i ngh\u1ECB th\xE0nh l\u1EADp \u0110\u1EA3ng \u0111\u1EA7u n\u0103m 1930.`,
    metadata: {
      eventDate: "Th\xE1ng 6/1925",
      pressLaunchDate: "21/06/1925",
      location: "Qu\u1EA3ng Ch\xE2u, Trung Qu\u1ED1c",
      historicSignificance: "T\u1ED5 ch\u1EE9c ti\u1EC1n th\xE2n tr\u1EF1c ti\u1EBFp chu\u1EA9n b\u1ECB th\xE0nh l\u1EADp \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam"
    }
  },
  {
    id: "DOC-HCM-025",
    title: "M\u1ED1c son L\u1ECBch s\u1EED N\u0103m 1968: Kh\xE1ng chi\u1EBFn Ch\u1ED1ng M\u1EF9 & T\u1EA5m l\xF2ng B\xE1c H\u1ED3 v\xEC S\u1EE9c kh\u1ECFe Nh\xE2n d\xE2n",
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh & Khu di t\xEDch Ph\u1EE7 Ch\u1EE7 t\u1ECBch",
    dateOrEra: "1968",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["M\u1EADu Th\xE2n 1968", "19/8/1968", "Nh\xE0 s\xE0n B\xE1c H\u1ED3", "B\xE1c s\u0129 L\xEA Ng\u1ECDc M\u1EABn", "V\xEC s\u1EE9c kh\u1ECFe nh\xE2n d\xE2n", "Ch\xED c\xF4ng v\xF4 t\u01B0"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `N\u0103m 1968 l\xE0 m\u1ED1c son l\u1ECBch s\u1EED c\xF3 \xFD ngh\u0129a b\u01B0\u1EDBc ngo\u1EB7t chi\u1EBFn l\u01B0\u1EE3c trong cu\u1ED9c kh\xE1ng chi\u1EBFn ch\u1ED1ng M\u1EF9, c\u1EE9u n\u01B0\u1EDBc c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam:

1. Th\u1EAFng l\u1EE3i c\u1EE7a cu\u1ED9c T\u1ED5ng ti\u1EBFn c\xF4ng v\xE0 n\u1ED5i d\u1EADy Xu\xE2n M\u1EADu Th\xE2n 1968 c\xF9ng c\xE1c \u0111\u1EE3t ti\u1EBFn c\xF4ng ti\u1EBFp n\u1ED1i (\u0111\u1EE3t 3 n\u1ED5 s\xFAng ng\xE0y 17 - 19/8/1968) \u0111\xE3 gi\xE1ng \u0111\xF2n s\u1EA5m s\xE9t v\xE0o \xFD ch\xED x\xE2m l\u01B0\u1EE3c c\u1EE7a \u0111\u1EBF qu\u1ED1c M\u1EF9, bu\u1ED9c T\u1ED5ng th\u1ED1ng M\u1EF9 ph\u1EA3i tuy\xEAn b\u1ED1 n\xE9m bom h\u1EA1n ch\u1EBF r\u1ED3i ch\u1EA5m d\u1EE9t kh\xF4ng \u0111i\u1EC1u ki\u1EC7n chi\u1EBFn tranh ph\xE1 ho\u1EA1i mi\u1EC1n B\u1EAFc v\xE0 ch\u1EA5p nh\u1EADn ng\u1ED3i v\xE0o b\xE0n \u0111\xE0m ph\xE1n t\u1EA1i Paris.

2. Chi\u1EC1u ng\xE0y 19 th\xE1ng 8 n\u0103m 1968, t\u1EA1i Nh\xE0 s\xE0n Ph\u1EE7 Ch\u1EE7 t\u1ECBch (H\xE0 N\u1ED9i), m\u1ED9t c\xE2u chuy\u1EC7n c\u1EA3m \u0111\u1ED9ng v\xE0 s\xE2u s\u1EAFc v\u1EC1 \u0111\u1EA1o \u0111\u1EE9c B\xE1c H\u1ED3 \u0111\xE3 \u0111\u01B0\u1EE3c ghi l\u1EA1i:
Khi t\u1ED5 ch\u1EE9c ph\xE2n c\xF4ng b\xE1c s\u0129 L\xEA Ng\u1ECDc M\u1EABn (chuy\xEAn gia y t\u1EBF) v\u1EC1 l\xE0m vi\u1EC7c chuy\xEAn tr\xE1ch ch\u0103m s\xF3c s\u1EE9c kh\u1ECFe cho B\xE1c, Ng\u01B0\u1EDDi x\xFAc \u0111\u1ED9ng n\u1EAFm tay b\xE1c s\u0129 v\xE0 c\u0103n d\u1EB7n:
"B\xE1c c\xF3 m\u1ED9t m\xECnh m\xE0 nh\u1EEFng hai b\xE1c s\u0129. Trong khi \u0111\xF3 \u1EDF ngo\xE0i m\u1EB7t tr\u1EADn b\u1ED9 \u0111\u1ED9i, th\u01B0\u01A1ng binh, v\xE0 nh\xE2n d\xE2n v\xF9ng \u0111\u1ECBch \u0111\xE1nh ph\xE1 c\xF2n r\u1EA5t thi\u1EBFu c\xE1n b\u1ED9 y t\u1EBF, thi\u1EBFu th\u1EA7y thu\u1ED1c ch\u1EEFa b\u1EC7nh...".

C\xE2u n\xF3i ch\xE2n th\xE0nh, m\u1ED9c m\u1EA1c c\u1EE7a Ng\u01B0\u1EDDi l\xE0m c\xE1c \u0111\u1ED3ng ch\xED c\xF3 m\u1EB7t r\u01B0ng r\u01B0ng x\xFAc \u0111\u1ED9ng. Trong b\u1EA5t k\u1EF3 ho\xE0n c\u1EA3nh n\xE0o, d\xF9 tu\u1ED5i cao s\u1EE9c y\u1EBFu gi\u1EEFa kh\xF3i l\u1EEDa chi\u1EBFn tranh, B\xE1c H\u1ED3 lu\xF4n ngh\u0129 v\u1EC1 nh\xE2n d\xE2n, b\u1ED9 \u0111\u1ED9i, th\u01B0\u01A1ng binh tr\u01B0\u1EDBc khi ngh\u0129 \u0111\u1EBFn b\u1EA3n th\xE2n m\xECnh. \u0110\xF3 l\xE0 b\xE0i h\u1ECDc ng\u1EDDi s\xE1ng v\u1EC1 \u0111\u1EE9c t\xEDnh khi\xEAm t\u1ED1n, ch\xED c\xF4ng v\xF4 t\u01B0 v\xE0 t\u1EA5m l\xF2ng bao la c\u1EE7a v\u1ECB Cha gi\xE0 d\xE2n t\u1ED9c.`,
    metadata: {
      eventDate: "19/08/1968",
      location: "Nh\xE0 s\xE0n B\xE1c H\u1ED3, Ph\u1EE7 Ch\u1EE7 t\u1ECBch, H\xE0 N\u1ED9i",
      witnessDoctor: "B\xE1c s\u0129 L\xEA Ng\u1ECDc M\u1EABn"
    }
  },
  // ============================================================================
  // BATCH B: BỔ SUNG TRI THỨC ĐỊA PHƯƠNG & KHÔNG GIAN VĂN HÓA (DOC-HCM-026 ĐẾN DOC-HCM-028)
  // ============================================================================
  {
    id: "DOC-HCM-026",
    title: "\u0110\u1ECBa gi\u1EDBi h\xE0nh ch\xEDnh ph\u01B0\u1EDDng Th\u1EDBi An qua c\xE1c th\u1EDDi k\u1EF3 (1997\u20132025 v\xE0 hi\u1EC7n h\xE0nh)",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "UBND Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh & \u1EE6y ban Th\u01B0\u1EDDng v\u1EE5 Qu\u1ED1c h\u1ED9i",
    dateOrEra: "1997 - 2025 - Hi\u1EC7n h\xE0nh",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["\u0110\u1ECBa gi\u1EDBi h\xE0nh ch\xEDnh", "Ph\u01B0\u1EDDng Th\u1EDBi An", "Ph\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n", "Qu\u1EADn 12", "Ngh\u1ECB quy\u1EBFt 1685", "Quy\u1EBFt \u0111\u1ECBnh 1195", "S\u1EAFp x\u1EBFp \u0110VHC 2025"],
    sourceUrl: "https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-1685-nq-ubtvqh15-sap-xep-cac-dvhc-cap-xa-cua-thanh-pho-ho-chi-minh-nam-2025-119250616211341304.htm",
    content: `\u0110\u1ECBa gi\u1EDBi h\xE0nh ch\xEDnh ph\u01B0\u1EDDng Th\u1EDBi An qua c\xE1c th\u1EDDi k\u1EF3 (1997 \u2013 2025 v\xE0 hi\u1EC7n h\xE0nh):

1. TH\u1EDCI K\u1EF2 TH\xC0NH L\u1EACP QU\u1EACN 12 V\xC0 PH\u01AF\u1EDCNG TH\u1EDAI AN (N\u0102M 1997):
Theo Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 1195/Q\u0110-UB-NC ng\xE0y 18/03/1997 c\u1EE7a UBND TP.HCM v\u1EC1 vi\u1EC7c th\xE0nh l\u1EADp Qu\u1EADn 12 v\xE0 c\xE1c ph\u01B0\u1EDDng tr\u1EF1c thu\u1ED9c:
- Ph\u01B0\u1EDDng Th\u1EDBi An c\u0169 \u0111\u01B0\u1EE3c th\xE0nh l\u1EADp tr\xEAn c\u01A1 s\u1EDF 451 ha di\u1EC7n t\xEDch t\u1EF1 nhi\xEAn v\xE0 4.883 nh\xE2n kh\u1EA9u c\u1EE7a x\xE3 T\xE2n Th\u1EDBi Hi\u1EC7p c\u0169 (thu\u1ED9c huy\u1EC7n H\xF3c M\xF4n).
- Ph\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n c\u0169 \u0111\u01B0\u1EE3c th\xE0nh l\u1EADp tr\xEAn c\u01A1 s\u1EDF to\xE0n b\u1ED9 968 ha di\u1EC7n t\xEDch t\u1EF1 nhi\xEAn v\xE0 9.489 nh\xE2n kh\u1EA9u c\u1EE7a x\xE3 Th\u1EA1nh Xu\xE2n c\u0169 (thu\u1ED9c huy\u1EC7n H\xF3c M\xF4n).
- Tr\u1EE5 s\u1EDF UBND Qu\u1EADn 12 th\u1EDDi k\u1EF3 n\xE0y \u0111\u01B0\u1EE3c \u0111\u1EB7t tr\xEAn \u0111\u1ECBa b\xE0n ph\u01B0\u1EDDng Th\u1EDBi An.
- B\u1ED1i c\u1EA3nh l\u1ECBch s\u1EED ti\u1EBFp gi\xE1p tr\u01B0\u1EDBc s\u1EAFp x\u1EBFp (1997 \u2013 30/06/2025): Ph\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n c\u0169 c\xF3 ranh gi\u1EDBi s\xF4ng S\xE0i G\xF2n ti\u1EBFp gi\xE1p v\u1EDBi t\u1EC9nh B\xECnh D\u01B0\u01A1ng (th\u1ECB x\xE3 Thu\u1EADn An, nay l\xE0 th\xE0nh ph\u1ED1 Thu\u1EADn An). \u0110\xE2y l\xE0 ghi nh\u1EADn l\u1ECBch s\u1EED v\u1EC1 \u0111\u1ECBa gi\u1EDBi t\u1EF1 nhi\xEAn th\u1EDDi k\u1EF3 1997\u20132025; s\u1ED1 li\u1EC7u 451 ha v\xE0 968 ha l\xE0 s\u1ED1 li\u1EC7u di\u1EC7n t\xEDch l\u1ECBch s\u1EED x\xE1c \u0111\u1ECBnh t\u1EA1i th\u1EDDi \u0111i\u1EC3m ban h\xE0nh Quy\u1EBFt \u0111\u1ECBnh 1195 n\u0103m 1997.

2. N\u1ED8I DUNG S\u1EAEP X\u1EBEP \u0110\u01A0N V\u1ECA H\xC0NH CH\xCDNH N\u0102M 2025 THEO NGH\u1ECA QUY\u1EBET 1685/NQ-UBTVQH15:
- Ng\xE0y 16 th\xE1ng 06 n\u0103m 2025, \u1EE6y ban Th\u01B0\u1EDDng v\u1EE5 Qu\u1ED1c h\u1ED9i ban h\xE0nh Ngh\u1ECB quy\u1EBFt s\u1ED1 1685/NQ-UBTVQH15 v\u1EC1 vi\u1EC7c s\u1EAFp x\u1EBFp c\xE1c \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh c\u1EA5p x\xE3 c\u1EE7a Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh n\u0103m 2025.
- C\u0103n c\u1EE9 Kho\u1EA3n 35 \u0110i\u1EC1u 1 Ngh\u1ECB quy\u1EBFt s\u1ED1 1685/NQ-UBTVQH15: Nh\u1EADp to\xE0n b\u1ED9 di\u1EC7n t\xEDch t\u1EF1 nhi\xEAn v\xE0 quy m\xF4 d\xE2n s\u1ED1 c\u1EE7a ph\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n v\xE0o ph\u01B0\u1EDDng Th\u1EDBi An.
- T\xEAn g\u1ECDi ch\xEDnh th\u1EE9c c\u1EE7a \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh sau khi s\u1EAFp x\u1EBFp: Ph\u01B0\u1EDDng Th\u1EDBi An.
- Th\u1EDDi \u0111i\u1EC3m b\u1EAFt \u0111\u1EA7u ho\u1EA1t \u0111\u1ED9ng ch\xEDnh th\u1EE9c c\u1EE7a \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh m\u1EDBi: T\u1EEB ng\xE0y 01 th\xE1ng 07 n\u0103m 2025.
- V\u1EC1 ranh gi\u1EDBi ti\u1EBFp gi\xE1p hi\u1EC7n h\xE0nh: H\u1EC7 th\u1ED1ng b\u1EA3o l\u01B0u nguy\xEAn t\u1EAFc ch\u1EC9 tr\xEDch d\u1EABn v\u0103n b\u1EA3n ph\xE1p l\xFD ch\xEDnh th\u1EE9c, kh\xF4ng t\u1EF1 x\xE1c \u0111\u1ECBnh hay suy di\u1EC5n c\xE1c ph\u01B0\u1EDDng ho\u1EB7c \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh ti\u1EBFp gi\xE1p hi\u1EC7n nay khi ch\u01B0a c\xF3 h\u1ED3 s\u01A1 \u0111\u1ECBa gi\u1EDBi v\xE0 b\u1EA3n \u0111\u1ED3 quy chu\u1EA9n do c\u01A1 quan nh\xE0 n\u01B0\u1EDBc c\xF3 th\u1EA9m quy\u1EC1n c\xF4ng b\u1ED1.

3. NGUY\xCAN T\u1EAEC \u0110\u1ECAA DANH V\xC0 QU\u1EA2N L\xDD:
- \u0110\u1ECBa danh hi\u1EC7n h\xE0nh ch\xEDnh th\u1EE9c: "Ph\u01B0\u1EDDng Th\u1EDBi An, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh" (\u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh c\u1EA5p x\xE3 tr\u1EF1c thu\u1ED9c ch\xEDnh quy\u1EC1n \u0111\xF4 th\u1ECB TP.HCM).
- C\u1EE5m t\u1EEB "Ph\u01B0\u1EDDng Th\u1EDBi An, Qu\u1EADn 12" ch\u1EC9 \u0111\u01B0\u1EE3c d\xF9ng khi tr\xEDch d\u1EABn c\xE1c v\u0103n b\u1EA3n quy ph\u1EA1m ph\xE1p lu\u1EADt, s\u1EF1 ki\u1EC7n l\u1ECBch s\u1EED ban h\xE0nh tr\u01B0\u1EDBc ng\xE0y 01/07/2025.
- Ph\u01B0\u1EDDng Th\u1EDBi An hi\u1EC7n nay l\xE0 \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh c\u1EA5p x\xE3 h\u1EE3p nh\u1EA5t t\u1EEB ph\u01B0\u1EDDng Th\u1EDBi An v\xE0 ph\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n c\u0169; kh\xF4ng \u0111\u1ED3ng nh\u1EA5t v\u1EDBi to\xE0n b\u1ED9 \u0111\u1ECBa gi\u1EDBi Qu\u1EADn 12 tr\u01B0\u1EDBc \u0111\xE2y.`,
    metadata: {
      candidateCode: "B-07",
      legalBasis: ["Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 1195/Q\u0110-UB-NC ng\xE0y 18/03/1997", "Ngh\u1ECB quy\u1EBFt s\u1ED1 1685/NQ-UBTVQH15 ng\xE0y 16/06/2025"],
      effectiveDateCurrent: "01/07/2025",
      formerAreaThoiAn1997: "451 ha",
      formerPopulationThoiAn1997: "4.883 nh\xE2n kh\u1EA9u",
      formerAreaThanhXuan1997: "968 ha",
      formerPopulationThanhXuan1997: "9.489 nh\xE2n kh\u1EA9u",
      copyrightStatus: "PUBLIC_DOMAIN_CONFIRMED",
      batch: "BATCH_B_SELECTIVE_01"
    }
  },
  {
    id: "DOC-HCM-027",
    title: "L\u1ECBch s\u1EED h\xECnh th\xE0nh v\xE0 ph\xE1t tri\u1EC3n Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c (2014\u2013nay)",
    category: "school-education",
    categoryLabel: "Ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c v\xE0 h\u1ECDc t\u1EADp t\u1EA1i nh\xE0 tr\u01B0\u1EDDng",
    authorOrSource: "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c & UBND Ph\u01B0\u1EDDng Th\u1EDBi An",
    dateOrEra: "2014 - Hi\u1EC7n nay",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c", "Th\xE0nh l\u1EADp n\u0103m 2014", "Quy\u1EBFt \u0111\u1ECBnh 155", "Quy\u1EBFt \u0111\u1ECBnh 76", "K\u1EBF ho\u1EA1ch 01/KH-NTT", "Kh\xF4ng gian V\u0103n h\xF3a HCM", "Tr\u01B0\u1EDDng h\u1ECDc H\u1EA1nh ph\xFAc"],
    sourceUrl: "https://thcsnguyentrungtruc.hcm.edu.vn/gioi-thieu/gioi-thieu-truong-thcs-nguyen-trung-truc/ct/12684/691487",
    content: `L\u1ECBch s\u1EED h\xECnh th\xE0nh v\xE0 ph\xE1t tri\u1EC3n Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c (2014 \u2013 nay):

1. M\u1ED0C TH\xC0NH L\u1EACP V\xC0 C\u0102N C\u1EE8 PH\xC1P L\xDD KH\u1EDEI \u0110\u1EA6U N\u0102M 2014:
Tr\u01B0\u1EDDng Trung h\u1ECDc c\u01A1 s\u1EDF Nguy\u1EC5n Trung Tr\u1EF1c \u0111\u01B0\u1EE3c ch\xEDnh th\u1EE9c th\xE0nh l\u1EADp theo Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 155/Q\u0110-UBND ng\xE0y 31 th\xE1ng 07 n\u0103m 2014 c\u1EE7a UBND Qu\u1EADn 12. Nh\xE0 tr\u01B0\u1EDDng ch\xEDnh th\u1EE9c khai gi\u1EA3ng v\xE0 \u0111i v\xE0o ho\u1EA1t \u0111\u1ED9ng gi\u1EA3ng d\u1EA1y t\u1EEB n\u0103m h\u1ECDc 2014 \u2013 2015.
Tr\u01B0\u1EDDng vinh d\u1EF1 mang t\xEAn Ng\u01B0\u1EDDi anh h\xF9ng ngh\u0129a qu\xE2n Nam B\u1ED9 Nguy\u1EC5n Trung Tr\u1EF1c (1838 \u2013 1868) v\u1EDBi c\xE2u n\xF3i b\u1EA5t h\u1EE7: "Bao gi\u1EDD ng\u01B0\u1EDDi T\xE2y nh\u1ED5 h\u1EBFt c\u1ECF n\u01B0\u1EDBc Nam th\xEC m\u1EDBi h\u1EBFt ng\u01B0\u1EDDi Nam \u0111\xE1nh T\xE2y".

2. QU\xC1 TR\xCCNH PH\xC1T TRI\u1EC2N V\xC0 KI\u1EC6N TO\xC0N T\u1ED4 CH\u1EE8C N\u0102M 2025:
Tr\u1EA3i qua h\u01A1n 10 n\u0103m ph\xE1t tri\u1EC3n phong tr\xE0o "D\u1EA1y t\u1ED1t \u2013 H\u1ECDc t\u1ED1t", ng\xE0y 01 th\xE1ng 07 n\u0103m 2025, th\u1EF1c hi\u1EC7n Ngh\u1ECB quy\u1EBFt s\u1ED1 1685/NQ-UBTVQH15 c\u1EE7a Qu\u1ED1c h\u1ED9i v\u1EC1 vi\u1EC7c s\u1EAFp x\u1EBFp \u0111\u01A1n v\u1ECB h\xE0nh ch\xEDnh c\u1EA5p x\xE3 c\u1EE7a TP.HCM, UBND Ph\u01B0\u1EDDng Th\u1EDBi An ban h\xE0nh Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 76/Q\u0110-UBND ng\xE0y 01/07/2025 v\u1EC1 vi\u1EC7c qu\u1EA3n l\xFD Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c tr\u1EF1c thu\u1ED9c ch\xEDnh quy\u1EC1n \u0111\u1ECBa ph\u01B0\u01A1ng c\u1EA5p ph\u01B0\u1EDDng (ghi nh\u1EADn t\u1EA1i K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2025\u20132026 s\u1ED1 01/KH-NTT ng\xE0y 29/08/2025).
Nguy\xEAn t\u1EAFc ph\xE1p l\xFD then ch\u1ED1t: Quy\u1EBFt \u0111\u1ECBnh n\u0103m 2014 l\xE0 m\u1ED1c khai sinh th\xE0nh l\u1EADp tr\u01B0\u1EDDng; Quy\u1EBFt \u0111\u1ECBnh n\u0103m 2025 l\xE0 b\u01B0\u1EDBc ki\u1EC7n to\xE0n t\u1ED5 ch\u1EE9c v\xE0 th\u1EA9m quy\u1EC1n qu\u1EA3n l\xFD nh\xE0 n\u01B0\u1EDBc theo m\xF4 h\xECnh ch\xEDnh quy\u1EC1n \u0111\xF4 th\u1ECB m\u1EDBi. \u0110\xE2y l\xE0 s\u1EF1 k\u1EBF th\u1EEBa li\xEAn t\u1EE5c v\u1EC1 l\u1ECBch s\u1EED, \u0111\u1ED9i ng\u0169 c\xE1n b\u1ED9 gi\xE1o vi\xEAn v\xE0 c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t; tuy\u1EC7t \u0111\u1ED1i kh\xF4ng ph\u1EA3i l\xE0 gi\u1EA3i th\u1EC3 tr\u01B0\u1EDDng c\u0169 \u0111\u1EC3 th\xE0nh l\u1EADp m\u1ED9t tr\u01B0\u1EDDng ho\xE0n to\xE0n m\u1EDBi.

3. GI\xC1O D\u1EE4C TRUY\u1EC0N TH\u1ED0NG V\xC0 KH\xD4NG GIAN V\u0102N H\xD3A H\u1ED2 CH\xCD MINH:
Nh\xE0 tr\u01B0\u1EDDng x\xE2y d\u1EF1ng m\xF4 h\xECnh Tr\u01B0\u1EDDng h\u1ECDc H\u1EA1nh ph\xFAc, ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n tri th\u1EE9c v\xE0 nh\xE2n c\xE1ch. Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh h\u1ECDc \u0111\u01B0\u1EDDng \u0111\u01B0\u1EE3c tri\u1EC3n khai \u0111\u1ED3ng b\u1ED9 gi\u1EEFa Kh\xF4ng gian v\u1EADt l\xFD (t\u1EE7 s\xE1ch B\xE1c H\u1ED3, khu \u1EA3nh t\u01B0 li\u1EC7u) v\xE0 Kh\xF4ng gian s\u1ED1 (Tr\u1EE3 l\xFD AI RAG ph\u1EE5c v\u1EE5 tra c\u1EE9u c\xF3 c\u0103n c\u1EE9 x\xE1c th\u1EF1c, gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng cho h\u1ECDc sinh). H\u1ED3 s\u01A1 t\xE0i li\u1EC7u nh\xE0 tr\u01B0\u1EDDng tu\xE2n th\u1EE7 nghi\xEAm ng\u1EB7t quy \u0111\u1ECBnh b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n, kh\xF4ng c\xF4ng khai \u0111i\u1EC3m s\u1ED1 hay th\xF4ng tin ri\xEAng t\u01B0 c\u1EE7a h\u1ECDc sinh, gi\xE1o vi\xEAn.`,
    metadata: {
      candidateCode: "B-10",
      foundingDecision: "Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 155/Q\u0110-UBND ng\xE0y 31/07/2014 c\u1EE7a UBND Qu\u1EADn 12",
      governanceDecisionCurrent: "Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 76/Q\u0110-UBND ng\xE0y 01/07/2025 c\u1EE7a UBND Ph\u01B0\u1EDDng Th\u1EDBi An",
      addressCurrent: "\u0110\u01B0\u1EDDng L\xEA V\u0103n Kh\u01B0\u01A1ng, Ph\u01B0\u1EDDng Th\u1EDBi An, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
      copyrightStatus: "OPEN_ACCESS_REUSE_PERMITTED",
      batch: "BATCH_B_SELECTIVE_01"
    }
  },
  {
    id: "DOC-HCM-028",
    title: "Tr\xEDch y\u1EBFu L\u1ECBch s\u1EED S\xE0i G\xF2n \u2013 Gia \u0110\u1ECBnh th\u1EDDi Nguy\u1EC5n theo Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "Nguy\xEAn t\xE1c: Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c (Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED, kho\u1EA3ng 1820) | Tr\xEDch y\u1EBFu s\u1EF1 ki\u1EC7n l\u1ECBch s\u1EED c\xF4ng c\u1ED9ng: Kh\xF4ng gian V\u0103n h\xF3a HCM THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    dateOrEra: "Th\u1EBF k\u1EF7 XVII - Gi\u1EEFa th\u1EBF k\u1EF7 XIX (1698 - 1858)",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED", "Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c", "L\u1EC5 Th\xE0nh h\u1EA7u Nguy\u1EC5n H\u1EEFu C\u1EA3nh", "N\u0103m 1698", "Ph\u1EE7 Gia \u0110\u1ECBnh", "B\u1EBFn Ngh\xE9", "Khai hoang m\u1EDF c\xF5i", "Th\u01B0\u01A1ng c\u1EA3ng S\xE0i G\xF2n"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `Tr\xEDch y\u1EBFu L\u1ECBch s\u1EED S\xE0i G\xF2n \u2013 Gia \u0110\u1ECBnh th\u1EDDi Nguy\u1EC5n theo Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED:

[GHI CH\xDA B\u1EA2N QUY\u1EC0N V\xC0 RANH GI\u1EDAI V\u0102N B\u1EA2N]
- Nguy\xEAn t\xE1c: B\u1ED9 s\u1EED \u0111\u1ECBa ch\xED ch\u1EEF H\xE1n "Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED" c\u1EE7a Hi\u1EC7p bi\u1EC7n \u0110\u1EA1i h\u1ECDc s\u0129 Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c ho\xE0n th\xE0nh kho\u1EA3ng n\u0103m 1820 th\u1EDDi tri\u1EC1u Nguy\u1EC5n thu\u1ED9c di s\u1EA3n v\u0103n h\xF3a c\xF4ng c\u1ED9ng (Public Domain).
- B\u1EA3n d\u1ECBch v\xE0 ch\xFA gi\u1EA3i hi\u1EC7n \u0111\u1EA1i: C\xE1c \u1EA5n b\u1EA3n s\xE1ch in hi\u1EC7n \u0111\u1EA1i c\xF3 b\u1EA3n quy\u1EC1n d\u1ECBch thu\u1EADt v\xE0 ch\xFA th\xEDch \u0111\u1ED9c quy\u1EC1n c\u1EE7a c\xE1c d\u1ECBch gi\u1EA3/nh\xE0 xu\u1EA5t b\u1EA3n hi\u1EC7n \u0111\u1EA1i; h\u1EC7 th\u1ED1ng RAG nh\xE0 tr\u01B0\u1EDDng tuy\u1EC7t \u0111\u1ED1i kh\xF4ng sao ch\xE9p tr\xE1i ph\xE9p.
- N\u1ED9i dung tr\xEDch y\u1EBFu c\u1EE7a d\u1EF1 \xE1n: D\u01B0\u1EDBi \u0111\xE2y l\xE0 ph\u1EA7n tr\xEDch l\u01B0\u1EE3c c\xE1c s\u1EF1 ki\u1EC7n c\u01B0\u01A1ng v\u1EF1c l\u1ECBch s\u1EED kh\xE1ch quan \u0111\xE3 tr\u1EDF th\xE0nh tri th\u1EE9c c\xF4ng c\u1ED9ng, b\u1EA3o to\xE0n xu\u1EA5t x\u1EE9 c\u1EE7a 9 chunks ph\u1EE5c v\u1EE5 gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng h\u1ECDc \u0111\u01B0\u1EDDng.

1. M\u1ED0C THI\u1EBET L\u1EACP T\u1ED4 CH\u1EE8C H\xC0NH CH\xCDNH N\u0102M 1698 C\u1EE6A NGUY\u1EC4N H\u1EEEU C\u1EA2NH:
Theo ghi ch\xE9p c\u1EE7a Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c trong t\xE1c ph\u1EA9m "Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED" (Quy\u1EC3n III: C\u01B0\u01A1ng v\u1EF1c ch\xED), m\xF9a xu\xE2n n\u0103m M\u1EADu D\u1EA7n (1698), ch\xFAa Nguy\u1EC5n Ph\xFAc Chu sai Th\u1ED1ng su\u1EA5t Ch\u01B0\u1EDFng c\u01A1 L\u1EC5 Th\xE0nh h\u1EA7u Nguy\u1EC5n H\u1EEFu C\u1EA3nh v\xE0o kinh l\u01B0\u1EE3c \u0111\u1EA5t ph\u01B0\u01A1ng Nam. Nguy\u1EC5n H\u1EEFu C\u1EA3nh l\u1EA5y \u0111\u1EA5t N\xF4ng N\u1EA1i \u0111\u1EB7t l\xE0m Ph\u1EE7 Gia \u0110\u1ECBnh, l\u1EADp x\u1EE9 \u0110\u1ED3ng Nai l\xE0m huy\u1EC7n Ph\u01B0\u1EDBc Long (d\u1EF1ng dinh Tr\u1EA5n Bi\xEAn), l\u1EADp x\u1EE9 S\xE0i G\xF2n l\xE0m huy\u1EC7n T\xE2n B\xECnh (d\u1EF1ng dinh Phi\xEAn Tr\u1EA5n). M\u1ED1c n\u0103m 1698 ch\xEDnh th\u1EE9c \u0111\xE1nh d\u1EA5u vi\u1EC7c v\xF9ng \u0111\u1EA5t S\xE0i G\xF2n \u2013 Gia \u0110\u1ECBnh \u0111\u01B0\u1EE3c \u0111\u01B0a v\xE0o b\u1EA3n \u0111\u1ED3 c\u01B0\u01A1ng v\u1EF1c h\xE0nh ch\xEDnh \u0110\u1EA1i Vi\u1EC7t.

2. TH\u01AF\u01A0NG C\u1EA2NG B\u1EBEN NGH\xC9 V\xC0 \u0110\u1EDCI S\u1ED0NG TR\xD9 PH\xDA:
Trong "S\u01A1n xuy\xEAn ch\xED", Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c mi\xEAu t\u1EA3 v\xF9ng s\xF4ng B\u1EBFn Ngh\xE9 t\xE0u bu\xF4n qua l\u1EA1i nh\u01B0 thoi, ghe thuy\u1EC1n t\u1EE5 h\u1ED9i "Tr\xEAn b\u1EBFn d\u01B0\u1EDBi thuy\u1EC1n", l\xFAa g\u1EA1o c\xE1 mu\u1ED1i kh\u1EAFp c\xE1c t\u1EC9nh Nam B\u1ED9 t\u1EE5 v\u1EC1 bu\xF4n b\xE1n s\u1EA7m u\u1EA5t. Ch\u1EE3 S\xE0i G\xF2n tr\u1EDF th\xE0nh trung t\xE2m th\u01B0\u01A1ng m\u1EA1i t\u1EA5p n\u1EADp c\u1EE7a x\u1EE9 \u0110\xE0ng Trong, l\xE0 n\u01A1i giao thoa v\u0103n h\xF3a h\xE0i h\xF2a gi\u1EEFa c\xE1c c\u1ED9ng \u0111\u1ED3ng c\u01B0 d\xE2n Vi\u1EC7t, Hoa, Khmer, Ch\u0103m.

3. \xDD NGH\u0128A KHOA H\u1ECCC V\xC0 B\xC0I H\u1ECCC GI\xC1O D\u1EE4C TRUY\u1EC0N TH\u1ED0NG:
T\xE1c ph\u1EA9m "Gia \u0110\u1ECBnh th\xE0nh th\xF4ng ch\xED" c\u1EE7a Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c l\xE0 b\u1ED9 b\xE1ch khoa to\xE0n th\u01B0 c\u1ED5 \u0111\u1ED3 s\u1ED9, c\xF3 gi\xE1 tr\u1ECB l\u1ECBch s\u1EED v\xE0 ph\xE1p l\xFD cao v\u1EC1 c\u01B0\u01A1ng v\u1EF1c ph\u01B0\u01A1ng Nam. T\u01B0 li\u1EC7u gi\xFAp h\u1ECDc sinh Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c hi\u1EC3u r\xF5 c\xF4ng lao khai hoang m\u1EDF c\xF5i ki\xEAn c\u01B0\u1EDDng, b\u1EC1n b\u1EC9 c\u1EE7a ti\u1EC1n nh\xE2n, b\u1ED3i \u0111\u1EAFp l\xF2ng bi\u1EBFt \u01A1n cha \xF4ng v\xE0 ni\u1EC1m t\u1EF1 h\xE0o s\xE2u s\u1EAFc v\u1EC1 truy\u1EC1n th\u1ED1ng h\u01A1n 300 n\u0103m c\u1EE7a Th\xE0nh ph\u1ED1 mang t\xEAn B\xE1c.`,
    metadata: {
      candidateCode: "B-02",
      chronicleAuthor: "Tr\u1ECBnh Ho\xE0i \u0110\u1EE9c (1765 - 1825)",
      workCompletedYear: "Kho\u1EA3ng 1820",
      keySections: ["Quy\u1EC3n III: C\u01B0\u01A1ng v\u1EF1c ch\xED", "Quy\u1EC3n IV: S\u01A1n xuy\xEAn ch\xED"],
      copyrightStatus: "PUBLIC_DOMAIN_EXCERPT_ONLY",
      batch: "BATCH_B_SELECTIVE_01"
    }
  },
  // ============================================================================
  // KNOWLEDGE EXPANSION BATCH C (DOC-HCM-029 ĐẾN DOC-HCM-040)
  // Bổ sung chuyên sâu 12 hồ sơ tri thức toàn diện 8 danh mục chuẩn mực
  // ============================================================================
  {
    id: "DOC-HCM-029",
    title: "Th\u01B0 B\xE1c H\u1ED3 g\u1EEDi thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng nh\xE2n d\u1ECBp T\u1EBFt Trung thu qua c\xE1c th\u1EDDi k\u1EF3",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - Tr\xEDch H\u1ED3 Ch\xED Minh To\xE0n t\u1EADp (NXB Ch\xEDnh tr\u1ECB Qu\u1ED1c gia S\u1EF1 th\u1EADt)",
    dateOrEra: "1951 - 1960",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["T\u1EBFt Trung thu", "Thi\u1EBFu nhi", "L\u1EDDi d\u1EA1y c\u1EE7a B\xE1c", "Kh\xE1ng chi\u1EBFn", "Y\xEAu n\u01B0\u1EDBc", "Thi \u0111ua h\u1ECDc h\xE0nh"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `Sinh th\u1EDDi, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh lu\xF4n d\xE0nh cho thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng t\xECnh y\xEAu th\u01B0\u01A1ng bao la v\xE0 s\u1EF1 quan t\xE2m \u0111\u1EB7c bi\u1EC7t nh\u1EA5t. C\u1EE9 m\u1ED7i d\u1ECBp T\u1EBFt Trung thu \u0111\u1EBFn, d\xF9 b\u1EADn tr\u0103m c\xF4ng ngh\xECn vi\u1EC7c qu\u1ED1c gia \u0111\u1EA1i s\u1EF1, B\xE1c lu\xF4n d\xE0nh th\u1EDDi gian vi\u1EBFt th\u01B0, l\xE0m th\u01A1 g\u1EEDi t\u1EB7ng c\xE1c ch\xE1u thi\u1EBFu nhi c\u1EA3 n\u01B0\u1EDBc v\xE0 ki\u1EC1u b\xE0o \u1EDF n\u01B0\u1EDBc ngo\xE0i.

1. B\xC0I TH\u01A0 TRUNG THU N\u0102M 1951 - T\xCCNH Y\xCAU TH\u01AF\u01A0NG BAO LA C\u1EE6A B\xC1C:
Gi\u1EEFa kh\xF3i l\u1EEDa c\u1EE7a cu\u1ED9c kh\xE1ng chi\u1EBFn ch\u1ED1ng th\u1EF1c d\xE2n Ph\xE1p gian lao, B\xE1c vi\u1EBFt b\u1EE9c th\u01B0 g\u1EEDi c\xE1c ch\xE1u b\u1EB1ng nh\u1EEFng v\u1EA7n th\u01A1 m\u1ED9c m\u1EA1c, tha thi\u1EBFt:
"Ai y\xEAu c\xE1c nhi \u0111\u1ED3ng
B\u1EB1ng B\xE1c H\u1ED3 Ch\xED Minh?
T\xEDnh c\xE1c ch\xE1u ngoan ngo\xE3n,
M\u1EB7t c\xE1c ch\xE1u xinh xinh.
Mong c\xE1c ch\xE1u c\u1ED1 g\u1EAFng,
Thi \u0111ua h\u1ECDc v\xE0 h\xE0nh.
Tu\u1ED5i nh\u1ECF l\xE0m vi\u1EC7c nh\u1ECF,
T\xF9y theo s\u1EE9c c\u1EE7a m\xECnh:
\u0110\u1EC3 tham gia kh\xE1ng chi\u1EBFn,
\u0110\u1EC3 g\xECn gi\u1EEF h\xF2a b\xECnh.
C\xE1c ch\xE1u h\xE3y x\u1EE9ng \u0111\xE1ng:
Ch\xE1u B\xE1c H\u1ED3 Ch\xED Minh!".
L\u1EDDi d\u1EA1y "Tu\u1ED5i nh\u1ECF l\xE0m vi\u1EC7c nh\u1ECF, t\xF9y theo s\u1EE9c c\u1EE7a m\xECnh" \u0111\xE3 tr\u1EDF th\xE0nh ph\u01B0\u01A1ng ch\xE2m s\u1ED1ng, kim ch\u1EC9 nam r\xE8n luy\u1EC7n c\u1EE7a l\u1EDBp l\u1EDBp th\u1EBF h\u1EC7 m\u0103ng non Vi\u1EC7t Nam trong su\u1ED1t h\u01A1n n\u1EEDa th\u1EBF k\u1EF7 qua.

2. TH\u01AF TRUNG THU N\u0102M 1952 V\xC0 N\u0102M 1960 - NI\u1EC0M TIN V\xC0O T\u01AF\u01A0NG LAI N\u01AF\u1EDAC NH\xC0:
Trong th\u01B0 Trung thu n\u0103m 1952, B\xE1c c\u0103n d\u1EB7n c\xE1c ch\xE1u: "B\xE1c mong c\xE1c ch\xE1u: Ngoan ngo\xE3n, \u0111o\xE0n k\u1EBFt, thi \u0111ua h\u1ECDc t\u1EADp, thi \u0111ua t\u0103ng gia. Mong c\xE1c ch\xE1u ti\u1EBFn b\u1ED9 nhi\u1EC1u. Mai sau c\xE1c ch\xE1u th\xE0nh ng\u01B0\u1EDDi ch\u1EE7 c\u1EE7a n\u01B0\u1EDBc nh\xE0".
\u0110\u1EBFn T\u1EBFt Trung thu n\u0103m 1960, B\xE1c chia s\u1EBB ni\u1EC1m vui \u0111\xF3n tr\u0103ng c\xF9ng c\xE1c ch\xE1u thi\u1EBFu nhi mi\u1EC1n B\u1EAFc v\xE0 g\u1EEDi tr\u1ECDn n\u1ED7i nh\u1EDB th\u01B0\u01A1ng da di\u1EBFt t\u1EDBi c\xE1c ch\xE1u thi\u1EBFu nhi mi\u1EC1n Nam ru\u1ED9t th\u1ECBt \u0111ang s\u1ED1ng d\u01B0\u1EDBi \xE1ch k\xECm k\u1EB9p c\u1EE7a qu\xE2n x\xE2m l\u01B0\u1EE3c, h\u1EB9n ng\xE0y non s\xF4ng li\u1EC1n m\u1ED9t d\u1EA3i \u0111\u1EC3 B\xE1c ch\xE1u sum h\u1ECDp m\u1ED9t nh\xE0.

3. \xDD NGH\u0128A S\u01AF PH\u1EA0M V\xC0 H\xC0NH \u0110\u1ED8NG C\u1EE6A H\u1ECCC SINH THCS:
Nh\u1EEFng b\u1EE9c th\u01B0 Trung thu c\u1EE7a B\xE1c H\u1ED3 kh\xF4ng ch\u1EC9 l\xE0 m\xF3n qu\xE0 tinh th\u1EA7n v\xF4 gi\xE1 m\xE0 c\xF2n l\xE0 b\xE0i h\u1ECDc l\u1EDBn v\u1EC1 l\xF2ng y\xEAu n\u01B0\u1EDBc, \xFD th\u1EE9c tr\xE1ch nhi\u1EC7m c\u1ED9ng \u0111\u1ED3ng v\xE0 tinh th\u1EA7n t\u1EF1 l\u1EADp. H\u1ECDc sinh Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c noi g\u01B0\u01A1ng B\xE1c b\u1EB1ng vi\u1EC7c t\xEDch c\u1EF1c tham gia phong tr\xE0o "Ngh\xECn vi\u1EC7c t\u1ED1t", gi\xFAp \u0111\u1EE1 b\u1EA1n b\xE8 c\xF3 ho\xE0n c\u1EA3nh kh\xF3 kh\u0103n, ch\u0103m ngoan h\u1ECDc gi\u1ECFi \u0111\u1EC3 x\u1EE9ng \u0111\xE1ng v\u1EDBi s\u1EF1 k\u1EF3 v\u1ECDng c\u1EE7a Ng\u01B0\u1EDDi.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      educationalLevel: "THCS",
      primaryTarget: "\u0110\u1ED9i vi\xEAn & Thi\u1EBFu nhi to\xE0n tr\u01B0\u1EDDng"
    }
  },
  {
    id: "DOC-HCM-030",
    title: "Tuy\u1EC3n t\u1EADp nh\u1EEFng m\u1EA9u chuy\u1EC7n c\u1EA3m \u0111\u1ED9ng v\u1EC1 B\xE1c H\u1ED3 v\u1EDBi thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh & Nh\xE0 xu\u1EA5t b\u1EA3n Kim \u0110\u1ED3ng",
    dateOrEra: "Tuy\u1EC3n t\u1EADp truy\u1EC1n th\u1ED1ng",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Chi\u1EBFc v\xF2ng b\u1EA1c", "Qu\u1EA3 t\xE1o c\u1EE7a B\xE1c", "Ai ngoan s\u1EBD \u0111\u01B0\u1EE3c th\u01B0\u1EDFng", "Gi\u1EEF l\u1EDDi h\u1EE9a", "Th\u1EADt th\xE0", "L\xF2ng nh\xE2n \xE1i"],
    sourceUrl: "https://nxbkimdong.com.vn",
    content: `Nh\u1EEFng m\u1EA9u chuy\u1EC7n \u0111\u1EDDi th\u01B0\u1EDDng gi\u1EA3n d\u1ECB v\u1EC1 Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh l\xE0 kho t\xE0ng b\xE0i h\u1ECDc \u0111\u1EA1o \u0111\u1EE9c s\u1ED1ng \u0111\u1ED9ng, g\u1EA7n g\u0169i v\xE0 s\xE2u s\u1EAFc nh\u1EA5t \u0111\u1ED1i v\u1EDBi l\u1EE9a tu\u1ED5i h\u1ECDc sinh THCS.

1. CHUY\u1EC6N "CHI\u1EBEC V\xD2NG B\u1EA0C" - B\xC0I H\u1ECCC V\u1EC0 GI\u1EEE CH\u1EEE T\xCDN V\xC0 T\xD4N TR\u1ECCNG L\u1EDCI H\u1EE8A:
H\u01A1n hai n\u0103m sau khi B\xE1c \u0111i c\xF4ng t\xE1c v\u1EC1 v\xF9ng cao, l\xFAc tr\u1EDF l\u1EA1i, \u0111\u1ED3ng b\xE0o v\xE0 c\xE1c ch\xE1u thi\u1EBFu nhi \xF9a ra \u0111\xF3n B\xE1c r\u1ED9n r\xE3. B\xE1c m\u1EDF t\xFAi l\u1EA5y ra m\u1ED9t chi\u1EBFc v\xF2ng b\u1EA1c nh\u1ECF s\xE1ng l\xF3a trao t\u1EADn tay m\u1ED9t em b\xE9 g\xE1i. M\u1ECDi ng\u01B0\u1EDDi \u0111\u1EC1u ng\u1EA1c nhi\xEAn. B\xE1c gi\u1EA3i th\xEDch: "Tr\u01B0\u1EDBc \u0111\xE2y hai n\u0103m, khi chia tay, ch\xE1u b\xE9 n\xE0y c\xF3 n\xF3i B\xE1c \u0111i \u0111\xE2u v\u1EC1 nh\u1EDB mua cho ch\xE1u m\u1ED9t chi\u1EBFc v\xF2ng b\u1EA1c. Nay B\xE1c v\u1EC1, B\xE1c gi\u1EEF \u0111\xFAng l\u1EDDi h\u1EE9a".
-> B\xE0i h\u1ECDc: \u0110\xE3 h\u1EE9a \u0111i\u1EC1u g\xEC th\xEC ph\u1EA3i c\u1ED1 g\u1EAFng th\u1EF1c hi\u1EC7n cho b\u1EB1ng \u0111\u01B0\u1EE3c, d\xF9 l\xE0 v\u1EDBi m\u1ED9t \u0111\u1EE9a tr\u1EBB nh\u1ECF. Gi\u1EEF ch\u1EEF t\xEDn l\xE0 n\u1EC1n t\u1EA3ng cao qu\xFD nh\u1EA5t c\u1EE7a \u0111\u1EA1o \u0111\u1EE9c l\xE0m ng\u01B0\u1EDDi.

2. CHUY\u1EC6N "QU\u1EA2 T\xC1O C\u1EE6A B\xC1C H\u1ED2" - T\xCCNH Y\xCAU TH\u01AF\u01A0NG TR\u1EBA TH\u01A0 KH\xD4NG BI\xCAN GI\u1EDAI:
N\u0103m 1946, khi sang th\u0103m n\u01B0\u1EDBc Ph\xE1p v\u1EDBi t\u01B0 c\xE1ch l\xE0 th\u01B0\u1EE3ng kh\xE1ch c\u1EE7a Ch\xEDnh ph\u1EE7 Ph\xE1p, trong m\u1ED9t b\u1EEFa ti\u1EC7c ngo\u1EA1i giao sang tr\u1ECDng, B\xE1c H\u1ED3 \u0111\xE3 c\u1EA7m theo m\u1ED9t qu\u1EA3 t\xE1o ngon khi r\u1EDDi b\xE0n ti\u1EC7c. Ra \u0111\u1EBFn c\u1EEDa \u0111i\u1EC7n, th\u1EA5y m\u1ED9t ph\u1EE5 n\u1EEF ngh\xE8o b\u1EBF em b\xE9 \u0111\u1EE9ng nh\xECn, B\xE1c \u0111\xE3 ti\u1EBFn l\u1EA1i m\u1EC9m c\u01B0\u1EDDi \xE2n c\u1EA7n trao qu\u1EA3 t\xE1o cho ch\xE1u b\xE9. C\u1EED ch\u1EC9 \u0111\u1EA7y t\xECnh nh\xE2n \xE1i c\u1EE7a B\xE1c \u0111\xE3 l\xE0m x\xFAc \u0111\u1ED9ng h\xE0ng tri\u1EC7u tr\xE1i tim nh\xE2n d\xE2n Ph\xE1p v\xE0 truy\u1EC1n th\xF4ng qu\u1ED1c t\u1EBF th\u1EDDi b\u1EA5y gi\u1EDD.
-> B\xE0i h\u1ECDc: L\xF2ng nh\xE2n \xE1i, s\u1EF1 s\u1EBB chia v\xE0 t\xECnh th\u01B0\u01A1ng y\xEAu tr\u1EBB em ch\xE2n th\xE0nh, v\u01B0\u1EE3t qua m\u1ECDi ranh gi\u1EDBi d\xE2n t\u1ED9c, m\xE0u da hay \u0111\u1EB3ng c\u1EA5p.

3. CHUY\u1EC6N "AI NGOAN S\u1EBC \u0110\u01AF\u1EE2C TH\u01AF\u1EDENG" - B\xC0I H\u1ECCC V\u1EC0 T\xCDNH TH\u1EACT TH\xC0 V\xC0 D\u0168NG C\u1EA2M:
Khi B\xE1c \u0111\u1EBFn th\u0103m m\u1ED9t tr\u1EA1i nhi \u0111\u1ED3ng, B\xE1c chia k\u1EB9o cho c\xE1c ch\xE1u. C\u1EADu b\xE9 T\u1ED9 \u0111\u1EE9ng n\xE9p v\xE0o g\xF3c l\u1EDBp kh\xF4ng d\xE1m nh\u1EADn k\u1EB9o. Khi B\xE1c h\u1ECFi l\xFD do, T\u1ED9 l\xED nh\xED: "Th\u01B0a B\xE1c, h\xF4m nay ch\xE1u ch\u01B0a v\xE2ng l\u1EDDi c\xF4 gi\xE1o, ch\xE1u ch\u01B0a ngoan n\xEAn kh\xF4ng d\xE1m nh\u1EADn k\u1EB9o c\u1EE7a B\xE1c \u1EA1". B\xE1c c\u01B0\u1EDDi hi\u1EC1n t\u1EEB, xoa \u0111\u1EA7u T\u1ED9 v\xE0 n\xF3i: "Ch\xE1u bi\u1EBFt nh\u1EADn l\u1ED7i, th\u1EBF l\xE0 d\u0169ng c\u1EA3m v\xE0 th\u1EADt th\xE0, ch\xE1u v\u1EABn l\xE0 \u0111\u1EE9a tr\u1EBB ngoan!". B\xE1c v\u1EABn chia ph\u1EA7n k\u1EB9o cho T\u1ED9 v\xE0 em h\u1EE9a t\u1EEB nay s\u1EBD ngoan ngo\xE3n h\u01A1n.
-> B\xE0i h\u1ECDc: "Khi\xEAm t\u1ED1n, th\u1EADt th\xE0, d\u0169ng c\u1EA3m" theo \u0110i\u1EC1u 5 B\xE1c H\u1ED3 d\u1EA1y. Bi\u1EBFt nh\u1EADn l\u1ED7i v\xE0 d\u0169ng c\u1EA3m s\u1EEDa \u0111\u1ED5i l\xE0 ph\u1EA9m ch\u1EA5t \u0111\xE1ng qu\xFD nh\u1EA5t c\u1EE7a ng\u01B0\u1EDDi h\u1ECDc sinh.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      educationalLevel: "THCS",
      valuesHighlighted: ["Ch\u1EEF t\xEDn", "L\xF2ng nh\xE2n \xE1i", "S\u1EF1 trung th\u1EF1c"]
    }
  },
  {
    id: "DOC-HCM-031",
    title: "C\u1EA9m nang th\u1EF1c h\xE0nh 5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y d\xE0nh cho \u0110\u1ED9i vi\xEAn thi\u1EBFu ni\xEAn ti\u1EC1n phong THCS",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "H\u1ED9i \u0111\u1ED3ng \u0110\u1ED9i Trung \u01B0\u01A1ng & Li\xEAn \u0111\u1ED9i Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    dateOrEra: "1961 - Hi\u1EC7n h\xE0nh",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y", "\u0110\u1ED9i TNTP H\u1ED3 Ch\xED Minh", "R\xE8n \u0111\u1EE9c luy\u1EC7n t\xE0i", "V\u1EC7 sinh th\u1EADt t\u1ED1t", "Khi\xEAm t\u1ED1n th\u1EADt th\xE0 d\u0169ng c\u1EA3m"],
    sourceUrl: "https://thieunhitphcm.vn",
    content: `1. HO\xC0N C\u1EA2NH RA \u0110\u1EDCI 5 \u0110I\u1EC0U B\xC1C H\u1ED2 D\u1EA0Y THI\u1EBEU NI\xCAN NHI \u0110\u1ED2NG:
N\u0103m 1961, nh\xE2n d\u1ECBp k\u1EF7 ni\u1EC7m 20 n\u0103m ng\xE0y th\xE0nh l\u1EADp \u0110\u1ED9i Thi\u1EBFu ni\xEAn Ti\u1EC1n phong (15/5/1941 - 15/5/1961), Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 g\u1EEDi th\u01B0 c\u0103n d\u1EB7n thi\u1EBFu ni\xEAn, nhi \u0111\u1ED3ng c\u1EA3 n\u01B0\u1EDBc 5 \u0111i\u1EC1u ng\u1EAFn g\u1ECDn, s\xFAc t\xEDch.
\u0110\u1EBFn n\u0103m 1965, khi chu\u1EA9n b\u1ECB in l\u1EA1i th\u01B0 khen ng\u1EE3i c\xE1c ch\xE1u thi\u1EBFu nhi c\xF3 th\xE0nh t\xEDch h\u1ECDc t\u1EADp v\xE0 ch\u1ED1ng M\u1EF9 c\u1EE9u n\u01B0\u1EDBc, B\xE1c \u0111\xE3 t\u1EF1 tay b\u1ED5 sung ch\u1EEF "th\u1EADt" v\xE0o \u0111i\u1EC1u th\u1EE9 t\u01B0: t\u1EEB "Gi\u1EEF g\xECn v\u1EC7 sinh t\u1ED1t" th\xE0nh "Gi\u1EEF g\xECn v\u1EC7 sinh TH\u1EACT t\u1ED1t", th\u1EC3 hi\u1EC7n s\u1EF1 quan t\xE2m t\u1EC9 m\u1EC9, thi\u1EBFt th\u1EF1c c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi n\u1EBFp s\u1ED1ng s\u1EA1ch s\u1EBD, s\u1EE9c kh\u1ECFe v\xE0 th\u1EC3 ch\u1EA5t c\u1EE7a th\u1EBF h\u1EC7 t\u01B0\u01A1ng lai.

2. N\u1ED8I DUNG V\xC0 H\u01AF\u1EDANG D\u1EAAN TH\u1EF0C H\xC0NH C\u1EE4 TH\u1EC2 CHO H\u1ECCC SINH THCS NGUY\u1EC4N TRUNG TR\u1EF0C:

- \u0110i\u1EC1u 1: Y\xEAu T\u1ED5 qu\u1ED1c, y\xEAu \u0111\u1ED3ng b\xE0o
  + Th\u1EF1c h\xE0nh: \u0110\u1EE9ng nghi\xEAm trang, h\xE1t to, \u0111\xFAng nh\u1EA1c b\xE0i Qu\u1ED1c ca - \u0110\u1ED9i ca trong c\xE1c l\u1EC5 ch\xE0o c\u1EDD \u0111\u1EA7u tu\u1EA7n; t\xEDch c\u1EF1c h\u1ECDc t\u1EADp l\u1ECBch s\u1EED d\u1EF1ng n\u01B0\u1EDBc v\xE0 gi\u1EEF n\u01B0\u1EDBc; y\xEAu th\u01B0\u01A1ng, gi\xFAp \u0111\u1EE1 b\u1EA1n b\xE8 trong l\u1EDBp, kh\xF4ng ph\xE2n bi\u1EC7t ho\xE0n c\u1EA3nh; k\xEDnh tr\u1ECDng \xF4ng b\xE0, cha m\u1EB9, th\u1EA7y c\xF4 gi\xE1o.

- \u0110i\u1EC1u 2: H\u1ECDc t\u1EADp t\u1ED1t, lao \u0111\u1ED9ng t\u1ED1t
  + Th\u1EF1c h\xE0nh: L\u1EAFng nghe th\u1EA7y c\xF4 gi\u1EA3ng b\xE0i, l\xE0m b\xE0i t\u1EADp \u0111\u1EA7y \u0111\u1EE7, t\u1EF1 gi\xE1c \u0111\u1ECDc s\xE1ch m\u1EDF r\u1ED9ng tri th\u1EE9c; ch\u1EE7 \u0111\u1ED9ng tham gia lao \u0111\u1ED9ng v\u1EC7 sinh ph\xF2ng h\u1ECDc, gi\u1EEF g\xECn t\xE0i s\u1EA3n chung c\u1EE7a nh\xE0 tr\u01B0\u1EDDng, ph\u1EE5 gi\xFAp gia \u0111\xECnh c\xF4ng vi\u1EC7c nh\xE0 v\u1EEBa s\u1EE9c.

- \u0110i\u1EC1u 3: \u0110o\xE0n k\u1EBFt t\u1ED1t, k\u1EF7 lu\u1EADt t\u1ED1t
  + Th\u1EF1c h\xE0nh: Lu\xF4n h\xF2a \u0111\u1ED3ng, x\xE2y d\u1EF1ng t\xECnh b\u1EA1n trong s\xE1ng, tuy\u1EC7t \u0111\u1ED1i n\xF3i kh\xF4ng v\u1EDBi b\u1EA1o l\u1EF1c h\u1ECDc \u0111\u01B0\u1EDDng; ch\u1EA5p h\xE0nh nghi\xEAm t\xFAc N\u1ED9i quy h\u1ECDc sinh Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c, ch\u1EA5p h\xE0nh lu\u1EADt an to\xE0n giao th\xF4ng khi \u0111\u1EBFn tr\u01B0\u1EDDng.

- \u0110i\u1EC1u 4: Gi\u1EEF g\xECn v\u1EC7 sinh th\u1EADt t\u1ED1t
  + Th\u1EF1c h\xE0nh: Gi\u1EEF g\xECn v\u1EC7 sinh c\xE1 nh\xE2n, trang ph\u1EE5c s\u1EA1ch s\u1EBD, \u0111eo kh\u0103n qu\xE0ng \u0111\u1ECF ch\u1EC9nh t\u1EC1; ph\xE2n lo\u1EA1i r\xE1c th\u1EA3i t\u1EA1i l\u1EDBp h\u1ECDc, b\u1ECF r\xE1c \u0111\xFAng n\u01A1i quy \u0111\u1ECBnh, b\u1EA3o v\u1EC7 c\xE2y xanh v\xE0 kh\xF4ng gian xanh c\u1EE7a nh\xE0 tr\u01B0\u1EDDng v\xE0 \u0111\u1ECBa b\xE0n Ph\u01B0\u1EDDng Th\u1EDBi An.

- \u0110i\u1EC1u 5: Khi\xEAm t\u1ED1n, th\u1EADt th\xE0, d\u0169ng c\u1EA3m
  + Th\u1EF1c h\xE0nh: Lu\xF4n l\u1EC5 ph\xE9p v\u1EDBi ng\u01B0\u1EDDi l\u1EDBn, khi\xEAm t\u1ED1n h\u1ECDc h\u1ECFi b\u1EA1n b\xE8 xung quanh; kh\xF4ng gian l\u1EADn trong gi\u1EDD ki\u1EC3m tra v\xE0 thi c\u1EED; d\u0169ng c\u1EA3m nh\u1EADn khuy\u1EBFt \u0111i\u1EC3m khi l\xE0m sai v\xE0 c\xF3 tinh th\u1EA7n \u0111\u1EA5u tranh b\u1EA3o v\u1EC7 l\u1EBD ph\u1EA3i.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      organizationUnit: "Li\xEAn \u0111\u1ED9i THCS Nguy\u1EC5n Trung Tr\u1EF1c",
      practicalChecklist: true
    }
  },
  {
    id: "DOC-HCM-032",
    title: "L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh (19/12/1946)",
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - B\u1EA3o v\u1EADt Qu\u1ED1c gia & Vi\u1EC7n L\u1ECBch s\u1EED \u0110\u1EA3ng",
    dateOrEra: "19/12/1946",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn", "1946", "V\u1EA1n Ph\xFAc H\xE0 \u0110\xF4ng", "\u0110\u1ED9c l\u1EADp t\u1EF1 do", "Kh\xE1ng chi\u1EBFn ki\u1EBFn qu\u1ED1c"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `1. HO\xC0N C\u1EA2NH L\u1ECACH S\u1EEC RA \u0110\u1EDCI B\u1EA2N HI\u1EC6U TRI\u1EC6U:
Sau ng\xE0y C\xE1ch m\u1EA1ng Th\xE1ng T\xE1m n\u0103m 1945 th\xE0nh c\xF4ng, th\u1EF1c d\xE2n Ph\xE1p quy\u1EBFt t\xE2m d\xF9ng v\u0169 l\u1EF1c \u0111\u1EC3 x\xE2m l\u01B0\u1EE3c n\u01B0\u1EDBc ta m\u1ED9t l\u1EA7n n\u1EEFa. V\u1EDBi thi\u1EC7n ch\xED h\xF2a b\xECnh, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh v\xE0 Ch\xEDnh ph\u1EE7 Vi\u1EC7t Nam D\xE2n ch\u1EE7 C\u1ED9ng h\xF2a \u0111\xE3 h\u1EBFt s\u1EE9c nh\xE2n nh\u01B0\u1EE3ng, k\xFD Hi\u1EC7p \u0111\u1ECBnh S\u01A1 b\u1ED9 ng\xE0y 6/3/1946 v\xE0 T\u1EA1m \u01B0\u1EDBc ng\xE0y 14/9/1946. Nh\u01B0ng th\u1EF1c d\xE2n Ph\xE1p li\xEAn ti\u1EBFp b\u1ED9i \u01B0\u1EDBc, g\xE2y h\u1EA5n \u1EDF H\u1EA3i Ph\xF2ng, L\u1EA1ng S\u01A1n v\xE0 g\u1EEDi t\u1ED1i h\u1EADu th\u01B0 \u0111\xF2i t\u01B0\u1EDBc v\u0169 kh\xED c\u1EE7a l\u1EF1c l\u01B0\u1EE3ng t\u1EF1 v\u1EC7 Th\u1EE7 \u0111\xF4 H\xE0 N\u1ED9i.
Tr\u01B0\u1EDBc t\xECnh th\u1EBF "ng\xE0n c\xE2n treo s\u1EE3i t\xF3c", t\u1ED1i ng\xE0y 19 th\xE1ng 12 n\u0103m 1946, t\u1EA1i l\xE0ng V\u1EA1n Ph\xFAc (H\xE0 \u0110\xF4ng, nay thu\u1ED9c H\xE0 N\u1ED9i), Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 vi\u1EBFt b\u1EA3n "L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn". Ti\u1EBFng s\xFAng kh\xE1ng chi\u1EBFn to\xE0n qu\u1ED1c ch\xEDnh th\u1EE9c b\xF9ng n\u1ED5 \u0111\xEAm 19/12/1946.

2. TO\xC0N V\u0102N L\u1EDCI K\xCAU G\u1ECCI B\u1EA4T H\u1EE6:
"H\u1EE1i \u0111\u1ED3ng b\xE0o to\xE0n qu\u1ED1c!
Ch\xFAng ta mu\u1ED1n h\xF2a b\xECnh, ch\xFAng ta ph\u1EA3i nh\xE2n nh\u01B0\u1EE3ng. Nh\u01B0ng ch\xFAng ta c\xE0ng nh\xE2n nh\u01B0\u1EE3ng, th\u1EF1c d\xE2n Ph\xE1p c\xE0ng l\u1EA5n t\u1EDBi, v\xEC ch\xFAng quy\u1EBFt t\xE2m c\u01B0\u1EDBp n\u01B0\u1EDBc ta l\u1EA7n n\u1EEFa!
Kh\xF4ng! Ch\xFAng ta th\xE0 hy sinh t\u1EA5t c\u1EA3, ch\u1EE9 nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu m\u1EA5t n\u01B0\u1EDBc, nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu l\xE0m n\xF4 l\u1EC7.
H\u1EE1i \u0111\u1ED3ng b\xE0o!
Ch\xFAng ta ph\u1EA3i \u0111\u1EE9ng l\xEAn!
B\u1EA5t k\u1EF3 \u0111\xE0n \xF4ng, \u0111\xE0n b\xE0, b\u1EA5t k\u1EF3 ng\u01B0\u1EDDi gi\xE0, ng\u01B0\u1EDDi tr\u1EBB, kh\xF4ng chia t\xF4n gi\xE1o, \u0111\u1EA3ng ph\xE1i, d\xE2n t\u1ED9c. H\u1EC5 l\xE0 ng\u01B0\u1EDDi Vi\u1EC7t Nam th\xEC ph\u1EA3i \u0111\u1EE9ng l\xEAn \u0111\xE1nh th\u1EF1c d\xE2n Ph\xE1p \u0111\u1EC3 c\u1EE9u T\u1ED5 qu\u1ED1c. Ai c\xF3 s\xFAng d\xF9ng s\xFAng. Ai c\xF3 g\u01B0\u01A1m d\xF9ng g\u01B0\u01A1m, kh\xF4ng c\xF3 g\u01B0\u01A1m th\xEC d\xF9ng cu\u1ED1c, thu\u1ED5ng, g\u1EADy g\u1ED9c. Ai c\u0169ng ph\u1EA3i ra s\u1EE9c ch\u1ED1ng th\u1EF1c d\xE2n Ph\xE1p c\u1EE9u n\u01B0\u1EDBc.
H\u1EE1i anh em binh s\u0129, t\u1EF1 v\u1EC7, d\xE2n qu\xE2n!
Gi\u1EDD c\u1EE9u qu\u1ED1c \u0111\xE3 \u0111\u1EBFn. Ta ph\u1EA3i hy sinh \u0111\u1EBFn gi\u1ECDt m\xE1u cu\u1ED1i c\xF9ng, \u0111\u1EC3 gi\u1EEF g\xECn \u0111\u1EA5t n\u01B0\u1EDBc.
D\xF9 ph\u1EA3i gian lao kh\xE1ng chi\u1EBFn, nh\u01B0ng v\u1EDBi m\u1ED9t l\xF2ng ki\xEAn quy\u1EBFt hy sinh, th\u1EAFng l\u1EE3i nh\u1EA5t \u0111\u1ECBnh v\u1EC1 d\xE2n t\u1ED9c ta!
Vi\u1EC7t Nam \u0111\u1ED9c l\u1EADp v\xE0 th\u1ED1ng nh\u1EA5t mu\xF4n n\u0103m!
Kh\xE1ng chi\u1EBFn th\u1EAFng l\u1EE3i mu\xF4n n\u0103m!".

3. \xDD NGH\u0128A TH\u1EDCI \u0110\u1EA0I V\xC0 B\xC0I H\u1ECCC \xDD CH\xCD:
"L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn" l\xE0 \xE1ng h\xF9ng v\u0103n c\u1EE9u qu\u1ED1c, k\u1EBFt tinh \xFD ch\xED qu\u1EADt c\u01B0\u1EDDng c\u1EE7a h\xE0ng tri\u1EC7u con tim Vi\u1EC7t Nam. Tinh th\u1EA7n "Th\xE0 hy sinh t\u1EA5t c\u1EA3, ch\u1EE9 nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu m\u1EA5t n\u01B0\u1EDBc, nh\u1EA5t \u0111\u1ECBnh kh\xF4ng ch\u1ECBu l\xE0m n\xF4 l\u1EC7" l\xE0 ng\u1ECDn \u0111u\u1ED1c soi \u0111\u01B0\u1EDDng b\u1ED3i d\u01B0\u1EE1ng l\xF2ng y\xEAu n\u01B0\u1EDBc n\u1ED3ng n\xE0n v\xE0 \xFD th\u1EE9c t\u1EF1 t\xF4n d\xE2n t\u1ED9c cho c\xE1c th\u1EBF h\u1EC7 h\u1ECDc sinh tr\u01B0\u1EDDng Nguy\u1EC5n Trung Tr\u1EF1c h\xF4m nay.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      legalStatus: "B\u1EA3o v\u1EADt Qu\u1ED1c gia",
      speechLocation: "L\xE0ng V\u1EA1n Ph\xFAc, H\xE0 \u0110\xF4ng"
    }
  },
  {
    id: "DOC-HCM-033",
    title: 'T\xE1c ph\u1EA9m "Nh\u1EADt k\xFD trong t\xF9" \u2013 Gi\xE1 tr\u1ECB nh\xE2n v\u0103n v\xE0 c\xE1c b\xE0i th\u01A1 r\xE8n luy\u1EC7n \xFD ch\xED cho th\u1EBF h\u1EC7 tr\u1EBB',
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - B\u1EA3o v\u1EADt Qu\u1ED1c gia (Vi\u1EC7n V\u0103n h\u1ECDc & NXB V\u0103n h\u1ECDc)",
    dateOrEra: "1942 - 1943",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nh\u1EADt k\xFD trong t\xF9", "Ng\u1EE5c trung nh\u1EADt k\xFD", "H\u1ECDc d\u1ECBch kinh", "Nghe ti\u1EBFng gi\xE3 g\u1EA1o", "T\u1EF1 khuy\xEAn m\xECnh", "\xDD ch\xED r\xE8n luy\u1EC7n"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `1. HO\xC0N C\u1EA2NH S\xC1NG T\xC1C T\u1EACP TH\u01A0 B\u1EA2O V\u1EACT QU\u1ED0C GIA:
T\u1EEB th\xE1ng 8/1942 \u0111\u1EBFn th\xE1ng 9/1943, l\xE3nh t\u1EE5 Nguy\u1EC5n \xC1i Qu\u1ED1c l\u1EA5y t\xEAn l\xE0 H\u1ED3 Ch\xED Minh l\xEAn \u0111\u01B0\u1EDDng sang Trung Qu\u1ED1c \u0111\u1EC3 li\xEAn l\u1EA1c v\u1EDBi c\xE1c l\u1EF1c l\u01B0\u1EE3ng d\xE2n ch\u1EE7 qu\u1ED1c t\u1EBF. V\u1EEBa \u0111\u1EBFn th\u1ECB tr\u1EA5n T\xFAc Vinh (t\u1EC9nh Qu\u1EA3ng T\xE2y), Ng\u01B0\u1EDDi b\u1ECB ch\xEDnh quy\u1EC1n T\u01B0\u1EDFng Gi\u1EDBi Th\u1EA1ch b\u1EAFt gi\u1EEF v\xF4 c\u1EDB. Su\u1ED1t 14 th\xE1ng b\u1ECB giam c\u1EA7m \u0111\xE0y \u1EA3i, b\u1ECB gi\u1EA3i qua g\u1EA7n 30 nh\xE0 giam c\u1EE7a 13 huy\u1EC7n thu\u1ED9c t\u1EC9nh Qu\u1EA3ng T\xE2y, Ng\u01B0\u1EDDi \u0111\xE3 vi\u1EBFt t\u1EADp th\u01A1 "Ng\u1EE5c trung nh\u1EADt k\xFD" (Nh\u1EADt k\xFD trong t\xF9) g\u1ED3m 133 b\xE0i th\u01A1 b\u1EB1ng ch\u1EEF H\xE1n trong m\u1ED9t cu\u1ED1n s\u1ED5 tay nh\u1ECF.

2. NH\u1EEENG B\xC0I TH\u01A0 TI\xCAU BI\u1EC2U V\u1EC0 R\xC8N LUY\u1EC6N \xDD CH\xCD V\xC0 NH\xC2N C\xC1CH H\u1ECCC SINH:

- B\xE0i 1: "T\u1EF1 khuy\xEAn m\xECnh" (T\u1EF1 mi\u1EC5n)
  "V\xED kh\xF4ng c\xF3 c\u1EA3nh \u0111\xF4ng t\xE0n,
  Th\xEC \u0111\xE2u c\xF3 c\u1EA3nh huy ho\xE0ng ng\xE0y xu\xE2n;
  Ngh\u0129 m\xECnh trong b\u01B0\u1EDBc gian tru\xE2n,
  Tai \u01B0\u01A1ng r\xE8n luy\u1EC7n tinh th\u1EA7n th\xEAm h\u0103ng."
  -> \xDD ngh\u0129a: Kh\xF3 kh\u0103n, th\u1EED th\xE1ch ch\u1EC9 l\xE0 m\xF4i tr\u01B0\u1EDDng t\xF4i luy\u1EC7n b\u1EA3n l\u0129nh con ng\u01B0\u1EDDi. Nh\u01B0 sau m\xF9a \u0111\xF4ng gi\xE1 r\xE9t s\u1EBD l\xE0 m\xF9a xu\xE2n n\u1EDF hoa, con ng\u01B0\u1EDDi v\u01B0\u1EE3t qua gian nan s\u1EBD \u0111\u1EA1t t\u1EDBi th\xE0nh c\xF4ng r\u1EF1c r\u1EE1.

- B\xE0i 2: "Nghe ti\u1EBFng gi\xE3 g\u1EA1o" (V\u0103n th\u1ED1i m\u1EC5 thanh)
  "G\u1EA1o \u0111em v\xE0o gi\xE3 bao \u0111au \u0111\u1EDBn,
  G\u1EA1o gi\xE3 xong r\u1ED3i tr\u1EAFng t\u1EF1a b\xF4ng;
  S\u1ED1ng \u1EDF tr\xEAn \u0111\u1EDDi ng\u01B0\u1EDDi c\u0169ng v\u1EADy,
  Gian nan r\xE8n luy\u1EC7n m\u1EDBi th\xE0nh c\xF4ng."
  -> \xDD ngh\u0129a: Tri\u1EBFt l\xFD s\xE2u s\u1EAFc v\u1EC1 s\u1EF1 tu d\u01B0\u1EE1ng, r\xE8n luy\u1EC7n nh\xE2n c\xE1ch v\xE0 h\u1ECDc t\u1EADp. Kh\xF4ng c\xF3 vinh quang n\xE0o t\u1EF1 nhi\xEAn \u0111\u1EBFn n\u1EBFu kh\xF4ng tr\u1EA3i qua qu\xE1 tr\xECnh kh\u1ED5 luy\u1EC7n ki\xEAn tr\xEC m\u1ED7i ng\xE0y.

- B\xE0i 3: "H\u1ECDc d\u1ECBch kinh" (\u0110\u1ED9c D\u1ECBch kinh)
  "H\u1EBFt m\u01B0a l\xE0 n\u1EAFng h\u1EEDng l\xEAn th\xF4i,
  H\u1EBFt kh\u1ED5 l\xE0 vui v\u1ED1n l\u1EBD \u0111\u1EDDi;
  M\xE2y t\u1EA1nh m\xF9 tan bay h\u1EBFt s\u1EA1ch,
  Th\xEAnh thang non n\u01B0\u1EDBc m\u1ED9t ph\u01B0\u01A1ng tr\u1EDDi."
  -> \xDD ngh\u0129a: Tinh th\u1EA7n l\u1EA1c quan c\xE1ch m\u1EA1ng phi th\u01B0\u1EDDng, l\xE0m ch\u1EE7 ho\xE0n c\u1EA3nh, lu\xF4n h\u01B0\u1EDBng v\u1EC1 \xE1nh s\xE1ng v\xE0 t\u01B0\u01A1ng lai t\u01B0\u01A1i s\xE1ng.

3. B\xC0I H\u1ECCC GI\xC1O D\u1EE4C CHO H\u1ECCC SINH THCS:
T\u1EADp th\u01A1 l\xE0 t\u1EA5m g\u01B0\u01A1ng s\xE1ng v\u1EC1 tinh th\u1EA7n th\xE9p, phong th\xE1i ung dung t\u1EF1 t\u1EA1i v\xE0 t\xECnh y\xEAu thi\xEAn nhi\xEAn, con ng\u01B0\u1EDDi bao la. \u0110\u1ED1i v\u1EDBi h\u1ECDc sinh, \u0111\xE2y l\xE0 ngu\u1ED3n c\u1EA3m h\u1EE9ng m\u1EA1nh m\u1EBD \u0111\u1EC3 c\xE1c em kh\xF4ng ch\xF9n b\u01B0\u1EDBc tr\u01B0\u1EDBc c\xE1c m\xF4n h\u1ECDc kh\xF3, v\u01B0\u1EE3t qua \xE1p l\u1EF1c h\u1ECDc t\u1EADp v\xE0 r\xE8n luy\u1EC7n \xFD ch\xED v\u01B0\u01A1n l\xEAn th\xE0nh t\xE0i.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      legalStatus: "B\u1EA3o v\u1EADt Qu\u1ED1c gia s\u1ED1 02",
      originalLanguage: "Ch\u1EEF H\xE1n"
    }
  },
  {
    id: "DOC-HCM-034",
    title: "Th\u01A1 ch\xFAc T\u1EBFt c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh qua c\xE1c th\u1EDDi k\u1EF3 l\u1ECBch s\u1EED (1947\u20131969)",
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - B\xE1o Nh\xE2n D\xE2n & NXB Ch\xEDnh tr\u1ECB Qu\u1ED1c gia S\u1EF1 th\u1EADt",
    dateOrEra: "1947 - 1969",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Th\u01A1 ch\xFAc T\u1EBFt", "M\u1EEBng Xu\xE2n", "Xu\xE2n M\u1EADu Th\xE2n 1968", "Xu\xE2n K\u1EF7 D\u1EADu 1969", "\u0110\xE1nh cho M\u1EF9 c\xFAt \u0111\xE1nh cho Ng\u1EE5y nh\xE0o"],
    sourceUrl: "https://nhandan.vn",
    content: `C\u1EE9 m\u1ED7i \u0111\u1ED9 Giao th\u1EEBa thi\xEAng li\xEAng, ng\u01B0\u1EDDi d\xE2n Vi\u1EC7t Nam tr\xEAn kh\u1EAFp m\u1ECDi mi\u1EC1n T\u1ED5 qu\u1ED1c v\xE0 ki\u1EC1u b\xE0o \u1EDF n\u01B0\u1EDBc ngo\xE0i l\u1EA1i qu\xE2y qu\u1EA7n b\xEAn chi\u1EBFc m\xE1y thu thanh \u0111\u1EC3 h\u1ED3i h\u1ED9p l\u1EAFng nghe gi\u1ECDng \u0111\u1ECDc th\u01A1 ch\xFAc T\u1EBFt \u1EA5m \xE1p, h\xE0o s\u1EA3ng c\u1EE7a B\xE1c H\u1ED3. Th\u01A1 ch\xFAc T\u1EBFt c\u1EE7a B\xE1c v\u1EEBa l\xE0 thi ph\u1EA9m xu\xE2n th\u1EAFm \u0111\u01B0\u1EE3m t\xECnh c\u1EA3m non s\xF4ng, v\u1EEBa l\xE0 l\u1EDDi hi\u1EC7u tri\u1EC7u hi\u1EC7u l\u1EC7nh ti\u1EBFn c\xF4ng l\u1ECBch s\u1EED.

1. XU\xC2N \u0110INH H\u1EE2I 1947 - B\xC0I TH\u01A0 CH\xDAC T\u1EBET KH\xC1NG CHI\u1EBEN \u0110\u1EA6U TI\xCAN:
Gi\u1EEFa n\xFAi r\u1EEBng Vi\u1EC7t B\u1EAFc nh\u1EEFng ng\xE0y \u0111\u1EA7u to\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn, B\xE1c ch\xFAc T\u1EBFt \u0111\u1ED3ng b\xE0o:
"C\u1EDD \u0111\u1ECF sao v\xE0ng tung bay tr\u01B0\u1EDBc gi\xF3,
Ti\u1EBFng k\xE8n kh\xE1ng chi\u1EBFn vang d\u1EADy non s\xF4ng.
To\xE0n d\xE2n kh\xE1ng chi\u1EBFn, to\xE0n di\u1EC7n kh\xE1ng chi\u1EBFn,
Ch\xED ta \u0111\xE3 quy\u1EBFt, l\xF2ng ta \u0111\xE3 \u0111\u1ED3ng.
Ti\u1EBFn l\xEAn chi\u1EBFn s\u0129! Ti\u1EBFn l\xEAn \u0111\u1ED3ng b\xE0o!
S\u1EE9c ta \u0111\xE3 m\u1EA1nh, ng\u01B0\u1EDDi ta \u0111\xE3 \u0111\xF4ng.
Tr\u01B0\u1EDDng k\u1EF3 kh\xE1ng chi\u1EBFn, nh\u1EA5t \u0111\u1ECBnh th\u1EAFng l\u1EE3i!
Th\u1ED1ng nh\u1EA5t \u0111\u1ED9c l\u1EADp, nh\u1EA5t \u0111\u1ECBnh th\xE0nh c\xF4ng!".

2. XU\xC2N M\u1EACU TH\xC2N 1968 - HI\u1EC6U L\u1EC6NH T\u1ED4NG TI\u1EBEN C\xD4NG V\xC0 N\u1ED4I D\u1EACY:
Giao th\u1EEBa T\u1EBFt M\u1EADu Th\xE2n 1968, l\u1EDDi th\u01A1 c\u1EE7a B\xE1c vang l\xEAn nh\u01B0 s\u1EA5m r\u1EC1n th\xF4i th\xFAc qu\xE2n d\xE2n mi\u1EC1n Nam \u0111\u1ED3ng lo\u1EA1t n\u1ED5i d\u1EADy:
"Xu\xE2n n\xE0y h\u01A1n h\u1EB3n m\u1EA5y xu\xE2n qua,
Th\u1EAFng tr\u1EADn tin vui kh\u1EAFp n\u01B0\u1EDBc nh\xE0.
Nam B\u1EAFc thi \u0111ua \u0111\xE1nh gi\u1EB7c M\u1EF9.
Ti\u1EBFn l\xEAn!
To\xE0n th\u1EAFng \u1EAFt v\u1EC1 ta!".

3. XU\xC2N K\u1EF6 D\u1EACU 1969 - B\xC0I TH\u01A0 CH\xDAC T\u1EBET CU\u1ED0I C\xD9NG C\u1EE6A B\xC1C:
M\xF9a xu\xE2n cu\u1ED1i c\xF9ng tr\u01B0\u1EDBc l\xFAc Ng\u01B0\u1EDDi \u0111i xa, B\xE1c \u0111\xE3 \u0111\xFAc k\u1EBFt ph\u01B0\u01A1ng ch\xE2m chi\u1EBFn l\u01B0\u1EE3c \u0111\xE1nh \u0111u\u1ED5i \u0111\u1EBF qu\u1ED1c M\u1EF9 x\xE2m l\u01B0\u1EE3c, gi\u1EA3i ph\xF3ng ho\xE0n to\xE0n mi\u1EC1n Nam:
"N\u0103m qua th\u1EAFng l\u1EE3i v\u1EBB vang,
N\u0103m nay ti\u1EC1n tuy\u1EBFn ch\u1EAFc c\xE0ng th\u1EAFng to.
V\xEC \u0111\u1ED9c l\u1EADp, v\xEC t\u1EF1 do,
\u0110\xE1nh cho M\u1EF9 c\xFAt, \u0111\xE1nh cho Ng\u1EE5y nh\xE0o.
Ti\u1EBFn l\xEAn! Chi\u1EBFn s\u0129, \u0111\u1ED3ng b\xE0o,
B\u1EAFc - Nam sum h\u1ECDp, xu\xE2n n\xE0o vui h\u01A1n!".

4. GI\xC1 TR\u1ECA V\u0102N H\xD3A V\xC0 TINH TH\u1EA6N B\u1EA4T DI\u1EC6T:
Th\u01A1 ch\xFAc T\u1EBFt c\u1EE7a B\xE1c H\u1ED3 l\xE0 di s\u1EA3n v\u0103n h\xF3a tinh th\u1EA7n v\xF4 gi\xE1 c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam. M\u1ED7i c\xE2u th\u01A1 l\xE0 ni\u1EC1m tin m\xE3nh li\u1EC7t v\xE0o ch\xEDnh ngh\u0129a, l\xE0 l\u1EDDi nh\u1EAFc nh\u1EDF th\u1EBF h\u1EC7 tr\u1EBB kh\xF4ng ng\u1EEBng thi \u0111ua r\xE8n \u0111\u1EE9c, luy\u1EC7n t\xE0i \u0111\u1EC3 gi\u1EEF v\u1EEFng \u0111\u1ED9c l\u1EADp, ch\u1EE7 quy\u1EC1n v\xE0 x\xE2y d\u1EF1ng qu\xEA h\u01B0\u01A1ng ph\u1ED3n vinh.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      genre: "Th\u01A1 m\u1EEBng Xu\xE2n & V\u0103n ki\u1EC7n l\xE3nh \u0111\u1EA1o",
      historicalSpan: "1947 - 1969"
    }
  },
  {
    id: "DOC-HCM-035",
    title: "Anh h\xF9ng d\xE2n t\u1ED9c Nguy\u1EC5n Trung Tr\u1EF1c \u2013 Th\xE2n th\u1EBF, kh\xED ti\u1EBFt v\xE0 t\u1EA5m g\u01B0\u01A1ng trung d\u0169ng",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "H\u1ED9i Khoa h\u1ECDc L\u1ECBch s\u1EED Vi\u1EC7t Nam & Ban Tuy\xEAn gi\xE1o \u0111\u1ECBa ph\u01B0\u01A1ng",
    dateOrEra: "1838 - 1868",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nguy\u1EC5n Trung Tr\u1EF1c", "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c", "H\u1ECFa h\u1ED3ng Nh\u1EADt T\u1EA3o", "\u0110\u1ED1t t\xE0u Hy V\u1ECDng", "\u0110\u1ED3n R\u1EA1ch Gi\xE1", "Bao gi\u1EDD ng\u01B0\u1EDDi T\xE2y nh\u1ED5 h\u1EBFt c\u1ECF n\u01B0\u1EDBc Nam"],
    sourceUrl: "https://hcmcpv.org.vn",
    content: `1. TH\xC2N TH\u1EBE V\xC0 T\u01AF CH\u1EA4T NG\u01AF\u1EDCI ANH H\xD9NG D\xC2N T\u1ED8C:
Nguy\u1EC5n Trung Tr\u1EF1c (1838 - 1868), t\xEAn thu\u1EDF nh\u1ECF l\xE0 Nguy\u1EC5n V\u0103n L\u1ECBch, sinh ra trong m\u1ED9t gia \u0111\xECnh l\xE0m ngh\u1EC1 ch\xE0i l\u01B0\u1EDBi b\xEAn b\u1EDD s\xF4ng V\xE0m C\u1ECF, thu\u1ED9c l\xE0ng B\xECnh \u0110\u1EE9c, ph\u1EE7 T\xE2n An (nay thu\u1ED9c x\xE3 B\xECnh \u0110\u1EE9c, huy\u1EC7n B\u1EBFn L\u1EE9c, t\u1EC9nh Long An). T\u1EEB nh\u1ECF, \xF4ng \u0111\xE3 c\xF3 t\u01B0 ch\u1EA5t th\xF4ng minh, s\u1EE9c kh\u1ECFe phi th\u01B0\u1EDDng, tinh th\u1EA7n tr\u01B0\u1EE3ng ngh\u0129a v\xE0 l\xF2ng c\u0103m th\xF9 gi\u1EB7c s\xE2u s\u1EAFc khi ch\u1EE9ng ki\u1EBFn c\u1EA3nh th\u1EF1c d\xE2n Ph\xE1p x\xE2m chi\u1EBFm n\u01B0\u1EDBc ta.

2. HAI CHI\u1EBEN C\xD4NG HI\u1EC2N H\xC1CH L\u1EEANG L\u1EAAY NON S\xD4NG:
- Chi\u1EBFn c\xF4ng th\u1EE9 nh\u1EA5t: H\u1ECFa c\xF4ng \u0111\u1ED1t ch\xE1y t\xE0u chi\u1EBFn L'Esp\xE9rance (Hy V\u1ECDng) c\u1EE7a Ph\xE1p ng\xE0y 10/12/1861 tr\xEAn s\xF4ng Nh\u1EADt T\u1EA3o.
  D\u01B0\u1EDBi s\u1EF1 ch\u1EC9 huy m\u01B0u tr\xED c\u1EE7a \xF4ng, ngh\u0129a qu\xE2n \u0111\xE3 ng\u1EE5y trang \xE1p s\xE1t t\xE0u tu\u1EA7n tra t\u1ED1i t\xE2n b\u1EADc nh\u1EA5t c\u1EE7a gi\u1EB7c Ph\xE1p, \u0111\u1ED3ng lo\u1EA1t t\u1EA5n c\xF4ng v\xE0 ch\xE2m ng\xF2i h\u1ECFa c\xF4ng thi\xEAu r\u1EE5i to\xE0n b\u1ED9 t\xE0u chi\u1EBFn c\xF9ng qu\xE2n l\xEDnh Ph\xE1p, l\xE0m n\u1EE9c l\xF2ng \u0111\u1ED3ng b\xE0o c\u1EA3 n\u01B0\u1EDBc. Danh s\u0129 Hu\u1EF3nh M\u1EABn \u0110\u1EA1t \u0111\xE3 ca ng\u1EE3i: "H\u1ECFa h\u1ED3ng Nh\u1EADt T\u1EA3o oanh thi\xEAn \u0111\u1ECBa" (L\u1EEDa \u0111\u1ECF Nh\u1EADt T\u1EA3o r\u1EF1c tr\u1EDDi \u0111\u1EA5t).
- Chi\u1EBFn c\xF4ng th\u1EE9 hai: T\u1EADp k\xEDch ti\xEAu di\u1EC7t \u0111\u1ED3n R\u1EA1ch Gi\xE1 \u0111\xEAm ng\xE0y 16/6/1968.
  Ngh\u0129a qu\xE2n b\u1EA5t ng\u1EDD t\u1EA5n c\xF4ng \u0111\xE1nh chi\u1EBFm t\xF2a th\xE0nh \u0111\u1EA7u n\xE3o c\u1EE7a gi\u1EB7c Ph\xE1p t\u1EA1i R\u1EA1ch Gi\xE1, ti\xEAu di\u1EC7t t\xEAn ch\u1EE7 t\u1EC9nh v\xE0 to\xE0n b\u1ED9 qu\xE2n \u0111\u1ED3n tr\xFA, l\xE0m rung chuy\u1EC3n c\u1EA3 h\u1EC7 th\u1ED1ng cai tr\u1ECB c\u1EE7a th\u1EF1c d\xE2n Ph\xE1p \u1EDF Nam B\u1ED9. Danh s\u0129 Hu\u1EF3nh M\u1EABn \u0110\u1EA1t ti\u1EBFp t\u1EE5c \u0111\u1EC1 t\u1EB7ng: "Ki\u1EBFm b\u1EA1t Ki\xEAn Giang kh\u1EA5p qu\u1EF7 th\u1EA7n" (Ki\u1EBFm tu\u1ED1t Ki\xEAn Giang qu\u1EF7 th\u1EA7n kh\xF3c).

3. KH\xCD TI\u1EBET HI\xCAN NGANG V\xC0 C\xC2U N\xD3I B\u1EA4T H\u1EE6 TR\u01AF\u1EDAC PH\xC1P TR\u01AF\u1EDCNG:
Sau \u0111\xF3, gi\u1EB7c Ph\xE1p t\u1EADp trung binh l\u1EF1c \u0111\xE0n \xE1p kh\u1ED1c li\u1EC7t v\xE0 b\u1EAFt gi\u1EEF m\u1EB9 gi\xE0 c\xF9ng \u0111\u1ED3ng b\xE0o \u0111\u1EC3 \xE9p \xF4ng ra n\u1ED9p m\xECnh. \u0110\u1EC3 c\u1EE9u t\xEDnh m\u1EA1ng c\u1EE7a m\u1EB9 v\xE0 nh\xE2n d\xE2n, \xF4ng \u0111\xE3 ch\u1EA5p nh\u1EADn hy sinh. Gi\u1EB7c Ph\xE1p d\xF9ng nhi\u1EC1u b\u1ED5ng l\u1ED9c, ch\u1EE9c t\u01B0\u1EDBc \u0111\u1EC3 mua chu\u1ED9c d\u1EE5 d\u1ED7 \xF4ng quy h\xE0ng. Tr\u01B0\u1EDBc m\u1EB7t b\u1ECDn x\xE2m l\u01B0\u1EE3c, \xF4ng \u0111\xE3 kh\u1EA3ng kh\xE1i tuy\xEAn b\u1ED1 c\xE2u n\xF3i b\u1EA5t h\u1EE7 kh\u1EAFc s\xE2u v\xE0o l\u1ECBch s\u1EED ng\xE0n \u0111\u1EDDi:
"BAO GI\u1EDC NG\u01AF\u1EDCI T\xC2Y NH\u1ED4 H\u1EBET C\u1ECE N\u01AF\u1EDAC NAM TH\xCC M\u1EDAI H\u1EBET NG\u01AF\u1EDCI NAM \u0110\xC1NH T\xC2Y!".
Ng\xE0y 27 th\xE1ng 10 n\u0103m 1868, ng\u01B0\u1EDDi anh h\xF9ng Nguy\u1EC5n Trung Tr\u1EF1c \u0111\xE3 hi\xEAn ngang \u0111\xF3n nh\u1EADn c\xE1i ch\u1EBFt t\u1EA1i ch\u1EE3 R\u1EA1ch Gi\xE1 khi m\u1EDBi tr\xF2n 30 tu\u1ED5i.

4. NI\u1EC0M T\u1EF0 H\xC0O C\u1EE6A TR\u01AF\u1EDCNG THCS NGUY\u1EC4N TRUNG TR\u1EF0C:
\u0110\u01B0\u1EE3c h\u1ECDc t\u1EADp v\xE0 r\xE8n luy\u1EC7n d\u01B0\u1EDBi m\xE1i tr\u01B0\u1EDDng vinh d\u1EF1 mang t\xEAn Anh h\xF9ng d\xE2n t\u1ED9c Nguy\u1EC5n Trung Tr\u1EF1c t\u1EA1i Ph\u01B0\u1EDDng Th\u1EDBi An, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh, m\u1ED7i h\u1ECDc sinh lu\xF4n kh\u1EAFc ghi truy\u1EC1n th\u1ED1ng b\u1EA5t khu\u1EA5t c\u1EE7a Ng\u01B0\u1EDDi anh h\xF9ng \xE1o v\u1EA3i, kh\xF4ng ng\u1EEBng trau d\u1ED3i tri th\u1EE9c, r\xE8n luy\u1EC7n ph\u1EA9m ch\u1EA5t \u0111\u1EC3 tr\u1EDF th\xE0nh nh\u1EEFng c\xF4ng d\xE2n c\xF3 \xEDch, x\u1EE9ng \u0111\xE1ng v\u1EDBi truy\u1EC1n th\u1ED1ng v\u1EBB vang c\u1EE7a d\xE2n t\u1ED9c.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      schoolPatron: "Anh h\xF9ng d\xE2n t\u1ED9c b\u1EA3o tr\u1EE3 danh hi\u1EC7u nh\xE0 tr\u01B0\u1EDDng",
      monumentLocations: ["R\u1EA1ch Gi\xE1, Ki\xEAn Giang", "Nh\u1EADt T\u1EA3o, Long An"]
    }
  },
  {
    id: "DOC-HCM-036",
    title: "V\u01B0\u1EDDn Cau \u0110\u1ECF \u2013 Di t\xEDch l\u1ECBch s\u1EED c\u0103n c\u1EE9 c\xE1ch m\u1EA1ng ki\xEAn c\u01B0\u1EDDng",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "T\u01B0 li\u1EC7u L\u1ECBch s\u1EED \u0110\u1EA3ng b\u1ED9 & Ban Qu\u1EA3n l\xFD Di t\xEDch Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    dateOrEra: "1945 - Hi\u1EC7n h\xE0nh",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["V\u01B0\u1EDDn Cau \u0110\u1ECF", "C\u0103n c\u1EE9 l\xF5m", "Chi\u1EBFn khu An Ph\xFA \u0110\xF4ng", "Th\u1EDBi An", "Th\u1EA1nh Xu\xE2n", "\u0110\u1ECBa ch\u1EC9 \u0111\u1ECF", "S\xE0i G\xF2n - Gia \u0110\u1ECBnh"],
    sourceUrl: "https://hcmcpv.org.vn",
    content: `1. V\u1ECA TR\xCD \u0110\u1ECAA L\xDD V\xC0 \u0110\u1EB6C \u0110I\u1EC2M T\u1EF0 NHI\xCAN:
Khu di t\xEDch l\u1ECBch s\u1EED - Khu t\u01B0\u1EDFng ni\u1EC7m V\u01B0\u1EDDn Cau \u0110\u1ECF t\u1ECDa l\u1EA1c t\u1EA1i s\u1ED1 12 \u0111\u01B0\u1EDDng Th\u1EA1nh Xu\xE2n 52, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh, n\u1EB1m \u1EDF v\u1ECB tr\xED giao thoa truy\u1EC1n th\u1ED1ng gi\u1EEFa c\xE1c v\xF9ng \u0111\u1EA5t Th\u1EDBi An, Th\u1EA1nh Xu\xE2n v\xE0 Th\u1EA1nh L\u1ED9c.
V\xF9ng \u0111\u1EA5t n\xE0y tr\u01B0\u1EDBc \u0111\xE2y l\xE0 v\xF9ng b\xE1n \u0111\u1EA3o tr\u0169ng th\u1EA5p ven s\xF4ng S\xE0i G\xF2n, k\xEAnh r\u1EA1ch ch\u1EB1ng ch\u1ECBt, s\xECnh l\u1EA7y hi\u1EC3m tr\u1EDF, n\u1ED5i b\u1EADt v\u1EDBi nh\u1EEFng c\xE1nh r\u1EEBng cau b\u1EA1t ng\xE0n xen l\u1EABn nh\u1EEFng v\u01B0\u1EDDn tr\u1EA7u xanh ng\xE1t c\u1EE7a ng\u01B0\u1EDDi d\xE2n lao \u0111\u1ED9ng hi\u1EC1n h\xF2a, ch\u1EA5t ph\xE1c.

2. NGU\u1ED2N G\u1ED0C T\xCAN G\u1ECCI V\xC0 \xDD NGH\u0128A THI\xCANG LI\xCANG C\u1EE6A CH\u1EEE "\u0110\u1ECE":
- T\xEAn g\u1ECDi V\u01B0\u1EDDn Cau \u0110\u1ECF b\u1EAFt ngu\u1ED3n t\u1EEB th\u1EF1c t\u1EBF \u0111\u1ECBa h\xECnh tr\u1ED3ng cau b\u1EA1t ng\xE0n. Nh\u01B0ng trong hai cu\u1ED9c kh\xE1ng chi\u1EBFn ch\u1ED1ng th\u1EF1c d\xE2n Ph\xE1p v\xE0 \u0111\u1EBF qu\u1ED1c M\u1EF9 x\xE2m l\u01B0\u1EE3c, do v\u1ECB tr\xED chi\u1EBFn l\u01B0\u1EE3c s\xE1t n\xE1ch S\xE0i G\xF2n, qu\xE2n gi\u1EB7c \u0111\xE3 \u0111i\xEAn cu\u1ED3ng d\u1ED9i bom \u0111\u1EA1n, ph\xE1o k\xEDch v\xE0 r\u1EA3i ch\u1EA5t \u0111\u1ED9c h\xF3a h\u1ECDc xu\u1ED1ng khu v\u1EF1c n\xE0y. Th\xE2n cau v\xE0 ng\u1ECDn cau b\u1ECB bom \u0111\u1EA1n ch\xE1y x\xE9m, ng\u1EA3 sang m\xE0u \xFAa \u0111\u1ECF r\u1EF1c.
- \u0110\u1EB7c bi\u1EC7t, ch\u1EEF "\u0110\u1ECE" mang t\u1EA7ng \xFD ngh\u0129a s\xE2u xa v\xE0 thi\xEAng li\xEAng nh\u1EA5t: \u0110\xF3 l\xE0 m\xE0u c\u1EDD \u0111\u1ECF sao v\xE0ng c\xE1ch m\u1EA1ng m\xE0 nh\xE2n d\xE2n m\u1ED9t l\xF2ng b\u1EA3o v\u1EC7; l\xE0 m\xE0u m\xE1u \u0111\u1ECF c\u1EE7a bi\u1EBFt bao anh h\xF9ng li\u1EC7t s\u0129, c\xE1n b\u1ED9 ki\xEAn trung v\xE0 \u0111\u1ED3ng b\xE0o y\xEAu n\u01B0\u1EDBc \u0111\xE3 d\u0169ng c\u1EA3m ng\xE3 xu\u1ED1ng \u0111\u1EC3 che ch\u1EDF c\xE1n b\u1ED9, gi\u1EEF v\u1EEFng ng\u1ECDn l\u1EEDa kh\xE1ng chi\u1EBFn cho t\u1EDBi ng\xE0y to\xE0n th\u1EAFng.

3. VAI TR\xD2 C\u0102N C\u1EE8 \u0110\u1ECAA C\xC1CH M\u1EA0NG CHI\u1EBEN L\u01AF\u1EE2C:
- Ng\xE0y 25/12/1945, ngay t\u1EA1i V\u01B0\u1EDDn Cau \u0110\u1ECF, H\u1ED9i ngh\u1ECB c\xE1n b\u1ED9 ch\u1EE7 ch\u1ED1t t\u1EC9nh Gia \u0110\u1ECBnh \u0111\xE3 h\u1ECDp v\xE0 ra quy\u1EBFt \u0111\u1ECBnh l\u1ECBch s\u1EED th\xE0nh l\u1EADp Chi\u1EBFn khu An Ph\xFA \u0110\xF4ng (bao g\u1ED3m c\xE1c x\xE3 An Ph\xFA \u0110\xF4ng, Th\u1EA1nh L\u1ED9c, Qu\u1EDBi Xu\xE2n). N\u01A1i \u0111\xE2y tr\u1EDF th\xE0nh ph\xE1o \u0111\xE0i th\xE9p ki\xEAn c\u01B0\u1EDDng, trung t\xE2m l\xE3nh \u0111\u1EA1o kh\xE1ng chi\u1EBFn \u1EDF c\u1EEDa ng\xF5 T\xE2y B\u1EAFc S\xE0i G\xF2n.
- Trong th\u1EDDi k\u1EF3 ch\u1ED1ng M\u1EF9, V\u01B0\u1EDDn Cau \u0110\u1ECF \u0111\u01B0\u1EE3c x\xE2y d\u1EF1ng th\xE0nh m\u1ED9t "c\u0103n c\u1EE9 l\xF5m" \u0111\u1ED9c \u0111\xE1o: \u0111\xF3ng ngay trong l\xF2ng \u0111\u1ECBch, gi\u1EEFa v\xF2ng v\xE2y \u0111\u1ED3n b\u1ED1t k\xECm k\u1EB9p nh\u01B0ng nh\u1EDD l\xF2ng d\xE2n che ch\u1EDF, c\xE1c c\u01A1 quan \u0111\u1EA7u n\xE3o c\u1EE7a X\u1EE9 \u1EE7y, Khu \u1EE7y S\xE0i G\xF2n - Gia \u0110\u1ECBnh v\u1EABn b\xE1m tr\u1EE5 an to\xE0n.
- N\u01A1i \u0111\xE2y l\xE0 tr\u1EA1m d\u1EEBng ch\xE2n, t\u1EADp k\u1EBFt l\u1EF1c l\u01B0\u1EE3ng c\u1EE7a Trung \u0111o\xE0n Gia \u0110\u1ECBnh, b\u1ED9 \u0111\u1ED9i G\xF2 M\xF4n, E115 chu\u1EA9n b\u1ECB b\xE0n \u0111\u1EA1p xu\u1EA5t k\xEDch ti\u1EBFn c\xF4ng v\xE0o c\xE1c c\u01A1 quan \u0111\u1EA7u n\xE3o c\u1EE7a gi\u1EB7c trong cu\u1ED9c T\u1ED5ng ti\u1EBFn c\xF4ng v\xE0 n\u1ED5i d\u1EADy Xu\xE2n M\u1EADu Th\xE2n 1968 v\xE0 Chi\u1EBFn d\u1ECBch H\u1ED3 Ch\xED Minh l\u1ECBch s\u1EED m\xF9a Xu\xE2n n\u0103m 1975.

4. KHU T\u01AF\u1EDENG NI\u1EC6M V\u01AF\u1EDCN CAU \u0110\u1ECE NG\xC0Y NAY:
N\u0103m 2010, \u0110\u1EA3ng b\u1ED9 v\xE0 nh\xE2n d\xE2n \u0111\u1ECBa ph\u01B0\u01A1ng \u0111\xE3 x\xE2y d\u1EF1ng Khu t\u01B0\u1EDFng ni\u1EC7m V\u01B0\u1EDDn Cau \u0110\u1ECF trang nghi\xEAm v\u1EDBi di\u1EC7n t\xEDch h\u01A1n 4.000 m\xB2. T\u01B0\u1EE3ng \u0111\xE0i trung t\xE2m l\xE0 h\xECnh \u1EA3nh bi\u1EC3u t\u01B0\u1EE3ng hai h\xE0ng cau cao v\xFAt \u0111an l\xE1 v\xE0o nhau th\u1EC3 hi\u1EC7n t\xECnh qu\xE2n d\xE2n g\u1EAFn b\xF3 keo s\u01A1n m\xE1u th\u1ECBt. Di t\xEDch l\xE0 \u0111\u1ECBa ch\u1EC9 \u0111\u1ECF truy\u1EC1n th\u1ED1ng, n\u01A1i th\u1EA7y tr\xF2 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c th\u01B0\u1EDDng xuy\xEAn t\u1ED5 ch\u1EE9c c\xE1c ho\u1EA1t \u0111\u1ED9ng v\u1EC1 ngu\u1ED3n, b\xE1o c\xF4ng d\xE2ng B\xE1c v\xE0 k\u1EBFt n\u1EA1p \u0110\u1ED9i vi\xEAn, \u0110o\xE0n vi\xEAn m\u1EDBi.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      siteArea: "H\u01A1n 4.000 m2",
      memorialYear: 2010,
      classification: "\u0110\u1ECBa ch\u1EC9 \u0111\u1ECF di t\xEDch l\u1ECBch s\u1EED c\u1EA5p \u0111\u1ECBa ph\u01B0\u01A1ng"
    }
  },
  {
    id: "DOC-HCM-037",
    title: "B\u1EBFn Nh\xE0 R\u1ED3ng \u2013 N\u01A1i ng\u01B0\u1EDDi thanh ni\xEAn Nguy\u1EC5n T\u1EA5t Th\xE0nh ra \u0111i t\xECm \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc (05/06/1911)",
    category: "bio-career",
    categoryLabel: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    authorOrSource: "B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh - Chi nh\xE1nh Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    dateOrEra: "05/06/1911 - Hi\u1EC7n h\xE0nh",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["B\u1EBFn Nh\xE0 R\u1ED3ng", "Nguy\u1EC5n T\u1EA5t Th\xE0nh", "V\u0103n Ba", "T\xE0u Amiral Latouche-Tr\xE9ville", "T\xECm \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc", "05/06/1911"],
    sourceUrl: "https://baotanghochiminh.vn",
    content: `1. B\u1ED0I C\u1EA2NH L\u1ECACH S\u1EEC V\xC0 \xDD CH\xCD C\u1EE8U N\u01AF\u1EDAC C\u1EE6A NG\u01AF\u1EDCI THANH NI\xCAN Y\xCAU N\u01AF\u1EDAC:
\u0110\u1EA7u th\u1EBF k\u1EF7 XX, \u0111\u1EA5t n\u01B0\u1EDBc ta ch\xECm trong \u0111\xEAm d\xE0i n\xF4 l\u1EC7 d\u01B0\u1EDBi \xE1ch th\u1ED1ng tr\u1ECB t\xE0n b\u1EA1o c\u1EE7a th\u1EF1c d\xE2n Ph\xE1p. C\xE1c phong tr\xE0o y\xEAu n\u01B0\u1EDBc theo khuynh h\u01B0\u1EDBng phong ki\u1EBFn (C\u1EA7n V\u01B0\u01A1ng) hay d\xE2n ch\u1EE7 t\u01B0 s\u1EA3n (\u0110\xF4ng Du c\u1EE7a Phan B\u1ED9i Ch\xE2u, Duy T\xE2n c\u1EE7a Phan Ch\xE2u Trinh) \u0111\u1EC1u l\u1EA7n l\u01B0\u1EE3t th\u1EA5t b\u1EA1i.
Ng\u01B0\u1EDDi thanh ni\xEAn y\xEAu n\u01B0\u1EDBc Nguy\u1EC5n T\u1EA5t Th\xE0nh (khi \u0111\xF3 m\u1EDBi 21 tu\u1ED5i), v\u1EDBi t\u1EA7m nh\xECn chi\u1EBFn l\u01B0\u1EE3c v\u01B0\u1EE3t th\u1EDDi \u0111\u1EA1i, \u0111\xE3 kh\xF4ng \u0111i theo con \u0111\u01B0\u1EDDng m\xF2n c\u1EE7a c\xE1c b\u1EADc ti\u1EC1n b\u1ED1i. Ng\u01B0\u1EDDi nung n\u1EA5u m\u1ED9t quy\u1EBFt \u0111\u1ECBnh t\xE1o b\u1EA1o: \u0110i sang ph\u01B0\u01A1ng T\xE2y - n\u01A1i kh\u1EDFi ngu\u1ED3n c\u1EE7a kh\u1EA9u hi\u1EC7u "T\u1EF1 do - B\xECnh \u0111\u1EB3ng - B\xE1c \xE1i", \u0111\u1EC3 xem n\u01B0\u1EDBc Ph\xE1p v\xE0 c\xE1c n\u01B0\u1EDBc kh\xE1c l\xE0m nh\u01B0 th\u1EBF n\xE0o, r\u1ED3i tr\u1EDF v\u1EC1 gi\xFAp \u0111\u1EE1 \u0111\u1ED3ng b\xE0o m\xECnh.

2. D\u1EA4U M\u1ED0C L\u1ECACH S\u1EEC NG\xC0Y 05/06/1911 T\u1EA0I B\u1EBEN C\u1EA2NG S\xC0I G\xD2N:
Ng\xE0y 5 th\xE1ng 6 n\u0103m 1911, t\u1EEB B\u1EBFn c\u1EA3ng Nh\xE0 R\u1ED3ng (S\xE0i G\xF2n), v\u1EDBi t\xEAn g\u1ECDi "V\u0103n Ba", Ng\u01B0\u1EDDi b\u01B0\u1EDBc ch\xE2n l\xEAn con t\xE0u bu\xF4n Amiral Latouche-Tr\xE9ville c\u1EE7a h\xE3ng v\u1EADn t\u1EA3i N\u0103m Sao (Ph\xE1p), nh\u1EADn l\xE0m c\xF4ng vi\u1EC7c ph\u1EE5 b\u1EBFp n\u1EB7ng nh\u1ECDc nh\u1EA5t \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u cu\u1ED9c h\xE0nh tr\xECnh v\u0129 \u0111\u1EA1i k\xE9o d\xE0i su\u1ED1t 30 n\u0103m b\xF4n ba qua 3 \u0111\u1EA1i d\u01B0\u01A1ng, 4 ch\xE2u l\u1EE5c v\xE0 g\u1EA7n 30 qu\u1ED1c gia tr\xEAn th\u1EBF gi\u1EDBi.
H\xE0nh trang mang theo c\u1EE7a Ng\u01B0\u1EDDi ch\u1EC9 c\xF3 l\xF2ng y\xEAu n\u01B0\u1EDBc n\u1ED3ng n\xE0n, b\u1EA7u nhi\u1EC7t huy\u1EBFt c\u1EE7a tu\u1ED5i tr\u1EBB v\xE0 hai b\xE0n tay lao \u0111\u1ED9ng c\u1EA7n c\xF9.

3. T\u1EA6M V\xD3C TH\u1EDCI \u0110\u1EA0I C\u1EE6A S\u1EF0 KI\u1EC6N:
S\u1EF1 ki\u1EC7n ng\xE0y 5/6/1911 \u0111\xE3 m\u1EDF ra b\u01B0\u1EDBc ngo\u1EB7t quy\u1EBFt \u0111\u1ECBnh cho v\u1EADn m\u1EC7nh d\xE2n t\u1ED9c Vi\u1EC7t Nam. Ch\xEDnh t\u1EEB cu\u1ED9c b\xF4n ba kh\u1EA3o s\xE1t th\u1EF1c ti\u1EC5n \u1EA5y, Ng\u01B0\u1EDDi \u0111\xE3 t\xECm th\u1EA5y \xE1nh s\xE1ng c\u1EE7a Ch\u1EE7 ngh\u0129a M\xE1c - L\xEAnin, kh\u1EB3ng \u0111\u1ECBnh con \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc duy nh\u1EA5t \u0111\xFAng \u0111\u1EAFn: Con \u0111\u01B0\u1EDDng c\xE1ch m\u1EA1ng v\xF4 s\u1EA3n, \u0111\u1ED9c l\u1EADp d\xE2n t\u1ED9c g\u1EAFn li\u1EC1n v\u1EDBi ch\u1EE7 ngh\u0129a x\xE3 h\u1ED9i.

4. B\u1EBEN NH\xC0 R\u1ED2NG TRONG TR\xC1I TIM NG\u01AF\u1EDCI D\xC2N TH\xC0NH PH\u1ED0:
T\xF2a nh\xE0 B\u1EBFn Nh\xE0 R\u1ED3ng ng\xE0y nay l\xE0 B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh - Chi nh\xE1nh TP.HCM, t\u1ECDa l\u1EA1c t\u1EA1i s\u1ED1 01 \u0111\u01B0\u1EDDng Nguy\u1EC5n T\u1EA5t Th\xE0nh, Qu\u1EADn 4. N\u01A1i \u0111\xE2y l\u01B0u gi\u1EEF h\xE0ng ngh\xECn hi\u1EC7n v\u1EADt qu\xFD gi\xE1 v\u1EC1 cu\u1ED9c \u0111\u1EDDi ho\u1EA1t \u0111\u1ED9ng c\xE1ch m\u1EA1ng c\u1EE7a B\xE1c v\xE0 l\xE0 bi\u1EC3u t\u01B0\u1EE3ng thi\xEAng li\xEAng th\u1EC3 hi\u1EC7n t\u1EA5m l\xF2ng son s\u1EAFt th\u1EE7y chung c\u1EE7a \u0111\u1ED3ng b\xE0o mi\u1EC1n Nam, nh\xE2n d\xE2n TP.HCM \u0111\u1ED1i v\u1EDBi Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh v\u0129 \u0111\u1EA1i.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      monumentName: "B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh - Chi nh\xE1nh TP.HCM",
      departureDate: "05/06/1911"
    }
  },
  {
    id: "DOC-HCM-038",
    title: "Ngh\u1ECB quy\u1EBFt \u0110\u1EA1i h\u1ED9i \u0110\u1EA3ng b\u1ED9 TP.HCM l\u1EA7n th\u1EE9 XI v\u1EC1 x\xE2y d\u1EF1ng Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    category: "hcm-cultural-space",
    categoryLabel: "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh TP.HCM",
    authorOrSource: "\u0110\u1EA3ng b\u1ED9 Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh (V\u0103n ki\u1EC7n \u0110\u1EA1i h\u1ED9i XI nhi\u1EC7m k\u1EF3 2020-2025)",
    dateOrEra: "2020 - 2025",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh", "\u0110\u1EA1i h\u1ED9i XI \u0110\u1EA3ng b\u1ED9 TP.HCM", "Gi\xE1 tr\u1ECB v\u0103n h\xF3a", "Con ng\u01B0\u1EDDi th\xE0nh ph\u1ED1", "Th\xE0nh ph\u1ED1 mang t\xEAn B\xE1c"],
    sourceUrl: "https://hcmcpv.org.vn",
    content: `1. M\u1EE4C TI\xCAU V\xC0 T\u1EA6M NH\xCCN CHI\u1EBEN L\u01AF\u1EE2C:
\u0110\u1EA1i h\u1ED9i \u0111\u1EA1i bi\u1EC3u \u0110\u1EA3ng b\u1ED9 Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh l\u1EA7n th\u1EE9 XI (nhi\u1EC7m k\u1EF3 2020 - 2025) \u0111\xE3 \u0111\u1EC1 ra ch\u1EE7 tr\u01B0\u01A1ng mang t\xEDnh \u0111\u1ED9t ph\xE1 v\xE0 nh\xE2n v\u0103n s\xE2u s\u1EAFc: "X\xE2y d\u1EF1ng Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh tr\u1EDF th\xE0nh Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh".
M\u1EE5c ti\xEAu l\xE0 l\xE0m cho t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch v\xE0 s\u1EF1 nghi\u1EC7p c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh th\u1EA5m s\xE2u v\xE0o \u0111\u1EDDi s\u1ED1ng x\xE3 h\u1ED9i, tr\u1EDF th\xE0nh n\u1EC1n t\u1EA3ng tinh th\u1EA7n v\u1EEFng ch\u1EAFc, n\xE9t v\u0103n h\xF3a \u0111\u1EB7c tr\u01B0ng, n\u1EBFp s\u1ED1ng ngh\u0129a t\xECnh ti\xEAu bi\u1EC3u c\u1EE7a c\xE1n b\u1ED9, \u0111\u1EA3ng vi\xEAn v\xE0 nh\xE2n d\xE2n th\xE0nh ph\u1ED1 mang t\xEAn B\xE1c.

2. BA TR\u1EE4 C\u1ED8T C\u1EE6A KH\xD4NG GIAN V\u0102N H\xD3A H\u1ED2 CH\xCD MINH:
- Tr\u1EE5 c\u1ED9t 1: Kh\xF4ng gian v\u0103n h\xF3a v\u1EADt th\u1EC3
  Quy ho\u1EA1ch, tr\xF9ng tu, n\xE2ng c\u1EA5p c\xE1c di t\xEDch l\u1ECBch s\u1EED, b\u1EA3o t\xE0ng, nh\xE0 l\u01B0u ni\u1EC7m, t\u01B0\u1EE3ng \u0111\xE0i B\xE1c H\u1ED3 v\xE0 c\xE1c c\xF4ng tr\xECnh v\u0103n h\xF3a c\xF4ng c\u1ED9ng mang d\u1EA5u \u1EA5n l\u1ECBch s\u1EED tr\xEAn \u0111\u1ECBa b\xE0n th\xE0nh ph\u1ED1, t\u1EA1o th\xE0nh m\u1EA1ng l\u01B0\u1EDBi \u0111\u1ECBa ch\u1EC9 \u0111\u1ECF gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng cho nh\xE2n d\xE2n.
- Tr\u1EE5 c\u1ED9t 2: Kh\xF4ng gian v\u0103n h\xF3a phi v\u1EADt th\u1EC3
  B\u1ED3i \u0111\u1EAFp c\xE1c gi\xE1 tr\u1ECB v\u0103n h\xF3a tinh th\u1EA7n, l\u1ED1i s\u1ED1ng ngh\u0129a t\xECnh, tinh th\u1EA7n t\u01B0\u01A1ng th\xE2n t\u01B0\u01A1ng \xE1i, "m\xECnh v\xEC m\u1ECDi ng\u01B0\u1EDDi", x\xE2y d\u1EF1ng chu\u1EA9n m\u1EF1c con ng\u01B0\u1EDDi Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh: v\u0103n minh, hi\u1EC7n \u0111\u1EA1i, ngh\u0129a t\xECnh, trung th\u1EF1c, tr\xE1ch nhi\u1EC7m v\xE0 n\u0103ng \u0111\u1ED9ng s\xE1ng t\u1EA1o.
- Tr\u1EE5 c\u1ED9t 3: Kh\xF4ng gian v\u0103n h\xF3a s\u1ED1 tr\xEAn kh\xF4ng gian m\u1EA1ng
  \u1EE8ng d\u1EE5ng m\u1EA1nh m\u1EBD chuy\u1EC3n \u0111\u1ED5i s\u1ED1 \u0111\u1EC3 x\xE2y d\u1EF1ng c\xE1c n\u1EC1n t\u1EA3ng tr\u1EF1c tuy\u1EBFn: th\u01B0 vi\u1EC7n s\u1ED1, kh\xF4ng gian th\u1EF1c t\u1EBF \u1EA3o 3D, h\u1EC7 th\u1ED1ng tr\u1EE3 l\xFD AI h\u1ECDc \u0111\u01B0\u1EDDng nh\u1EB1m \u0111\u01B0a kho t\u01B0 li\u1EC7u qu\xFD gi\xE1 v\u1EC1 B\xE1c H\u1ED3 \u0111\u1EBFn g\u1EA7n h\u01A1n v\u1EDBi th\u1EBF h\u1EC7 tr\u1EBB m\u1ECDi l\xFAc, m\u1ECDi n\u01A1i.

3. TR\xC1CH NHI\u1EC6M C\u1EE6A NG\xC0NH GI\xC1O D\u1EE4C V\xC0 NH\xC0 TR\u01AF\u1EDCNG:
M\u1ED7i tr\u01B0\u1EDDng h\u1ECDc tr\xEAn \u0111\u1ECBa b\xE0n th\xE0nh ph\u1ED1, trong \u0111\xF3 c\xF3 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c t\u1EA1i Ph\u01B0\u1EDDng Th\u1EDBi An, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh, ph\u1EA3i l\xE0 m\u1ED9t "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh thu nh\u1ECF" sinh \u0111\u1ED9ng, n\u01A1i th\u1EA7y c\xF4 m\u1EABu m\u1EF1c, h\u1ECDc tr\xF2 ch\u0103m ngoan, m\xF4i tr\u01B0\u1EDDng h\u1ECDc \u0111\u01B0\u1EDDng tr\xE0n \u0111\u1EA7y t\xECnh y\xEAu th\u01B0\u01A1ng, k\u1EF7 c\u01B0\u01A1ng v\xE0 h\u1EA1nh ph\xFAc.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      congressSession: "\u0110\u1EA1i h\u1ED9i \u0110\u1EA3ng b\u1ED9 TP.HCM l\u1EA7n th\u1EE9 XI",
      period: "2020 - 2025"
    }
  },
  {
    id: "DOC-HCM-039",
    title: "M\xF4 h\xECnh Tr\u01B0\u1EDDng h\u1ECDc h\u1EA1nh ph\xFAc g\u1EAFn li\u1EC1n v\u1EDBi Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh t\u1EA1i tr\u01B0\u1EDDng THCS",
    category: "hcm-cultural-space",
    categoryLabel: "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh TP.HCM",
    authorOrSource: "S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    dateOrEra: "2023 - 2026",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Tr\u01B0\u1EDDng h\u1ECDc h\u1EA1nh ph\xFAc", "Kh\xF4ng gian v\u0103n h\xF3a s\u1ED1", "THCS Nguy\u1EC5n Trung Tr\u1EF1c", "Th\u1EA7y c\xF4 h\u1EA1nh ph\xFAc", "H\u1ECDc sinh t\xEDch c\u1EF1c"],
    sourceUrl: "https://hcm.edu.vn",
    content: `1. KH\xC1I NI\u1EC6M TR\u01AF\u1EDCNG H\u1ECCC H\u1EA0NH PH\xDAC:
Theo \u0111\u1ECBnh h\u01B0\u1EDBng c\u1EE7a S\u1EDF GD&\u0110T Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh, "Tr\u01B0\u1EDDng h\u1ECDc h\u1EA1nh ph\xFAc" l\xE0 m\xF4i tr\u01B0\u1EDDng gi\xE1o d\u1EE5c \u0111\u01B0\u1EE3c x\xE2y d\u1EF1ng d\u1EF1a tr\xEAn ba gi\xE1 tr\u1ECB c\u1ED1t l\xF5i: Y\xCAU TH\u01AF\u01A0NG - AN TO\xC0N - T\xD4N TR\u1ECCNG. \u0110\xF3 l\xE0 n\u01A1i m\u1ED7i ng\xE0y \u0111\u1EBFn tr\u01B0\u1EDDng c\u1EE7a h\u1ECDc sinh th\u1EF1c s\u1EF1 l\xE0 m\u1ED9t ng\xE0y vui; n\u01A1i th\u1EA7y c\xF4 gi\xE1o t\xECm th\u1EA5y ngu\u1ED3n c\u1EA3m h\u1EE9ng s\xE1ng t\u1EA1o v\xE0 \u0111\u01B0\u1EE3c th\u1EA5u hi\u1EC3u; n\u01A1i kh\xF4ng c\xF3 \xE1p l\u1EF1c ti\xEAu c\u1EF1c hay b\u1EA1o l\u1EF1c h\u1ECDc \u0111\u01B0\u1EDDng.

2. M\u1ED0I QUAN H\u1EC6 H\u1EEEU C\u01A0 V\u1EDAI KH\xD4NG GIAN V\u0102N H\xD3A H\u1ED2 CH\xCD MINH:
X\xE2y d\u1EF1ng Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh trong tr\u01B0\u1EDDng h\u1ECDc ch\xEDnh l\xE0 gi\u1EA3i ph\xE1p n\u1EC1n t\u1EA3ng v\u1EEFng ch\u1EAFc nh\u1EA5t \u0111\u1EC3 ki\u1EBFn t\u1EA1o Tr\u01B0\u1EDDng h\u1ECDc h\u1EA1nh ph\xFAc:
- L\u1EA5y t\u01B0 t\u01B0\u1EDFng gi\xE1o d\u1EE5c c\u1EE7a B\xE1c "D\u1EA1y t\u1ED1t, h\u1ECDc t\u1ED1t", "V\xEC l\u1EE3i \xEDch m\u01B0\u1EDDi n\u0103m th\xEC ph\u1EA3i tr\u1ED3ng c\xE2y, v\xEC l\u1EE3i \xEDch tr\u0103m n\u0103m th\xEC ph\u1EA3i tr\u1ED3ng ng\u01B0\u1EDDi" l\xE0m kim ch\u1EC9 nam cho m\u1ECDi ho\u1EA1t \u0111\u1ED9ng s\u01B0 ph\u1EA1m.
- Tri\u1EC3n khai phong tr\xE0o "M\u1ED7i ng\xE0y m\u1ED9t vi\u1EC7c t\u1ED1t theo l\u1EDDi B\xE1c d\u1EA1y": Khuy\u1EBFn kh\xEDch h\u1ECDc sinh bi\u1EBFt n\xF3i l\u1EDDi c\u1EA3m \u01A1n, xin l\u1ED7i, chia s\u1EBB \u0111\u1ED3 d\xF9ng h\u1ECDc t\u1EADp v\u1EDBi b\u1EA1n ngh\xE8o, nh\u1EB7t \u0111\u01B0\u1EE3c c\u1EE7a r\u01A1i tr\u1EA3 ng\u01B0\u1EDDi \u0111\xE1nh m\u1EA5t.
- X\xE2y d\u1EF1ng g\xF3c th\u01B0 vi\u1EC7n B\xE1c H\u1ED3 v\xE0 ph\xF2ng truy\u1EC1n th\u1ED1ng s\u1ED1: Gi\xFAp c\xE1c em h\u1ECDc sinh t\u1EF1 do kh\xE1m ph\xE1, \u0111\u1ECDc s\xE1ch, nghi\xEAn c\u1EE9u l\u1ECBch s\u1EED v\xE0 t\u01B0\u01A1ng t\xE1c v\u1EDBi tr\u1EE3 l\xFD \u1EA3o trong kh\xF4ng gian h\u1ECDc t\u1EADp c\u1EDFi m\u1EDF, th\xE2n thi\u1EC7n.

3. B\u1ED8 TI\xCAU CH\xCD \u0110\xC1NH GI\xC1 T\u1EA0I TR\u01AF\u1EDCNG THCS NGUY\u1EC4N TRUNG TR\u1EF0C:
- Ti\xEAu ch\xED 1 v\u1EC1 M\xF4i tr\u01B0\u1EDDng nh\xE0 tr\u01B0\u1EDDng: C\u1EA3nh quan xanh, s\u1EA1ch, \u0111\u1EB9p, an to\xE0n, c\xF3 c\xE1c bi\u1EC3n b\u1EA3ng tr\xEDch d\u1EABn l\u1EDDi B\xE1c d\u1EA1y ph\xF9 h\u1EE3p t\xE2m l\xFD l\u1EE9a tu\u1ED5i.
- Ti\xEAu ch\xED 2 v\u1EC1 Ho\u1EA1t \u0111\u1ED9ng d\u1EA1y v\xE0 h\u1ECDc: Th\u1EA7y c\xF4 \u0111\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p gi\u1EA3ng d\u1EA1y, kh\xEDch l\u1EC7 s\u1EF1 t\u1EF1 tin s\xE1ng t\u1EA1o c\u1EE7a h\u1ECDc sinh, kh\xF4ng d\xF9ng h\xECnh ph\u1EA1t x\xFAc ph\u1EA1m danh d\u1EF1.
- Ti\xEAu ch\xED 3 v\u1EC1 M\u1ED1i quan h\u1EC7 \u1EE9ng x\u1EED: X\xE2y d\u1EF1ng v\u0103n h\xF3a giao ti\u1EBFp thanh l\u1ECBch, l\u1EC5 ph\xE9p, \u0111o\xE0n k\u1EBFt, chan h\xF2a t\xECnh th\u1EA7y tr\xF2 v\xE0 b\u1EA1n b\xE8.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      governingBody: "S\u1EDF GD&\u0110T TP.HCM",
      schoolApplication: "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c"
    }
  },
  {
    id: "DOC-HCM-040",
    title: "Ch\u1EC9 th\u1ECB s\u1ED1 05-CT/TW c\u1EE7a B\u1ED9 Ch\xEDnh tr\u1ECB v\u1EC1 \u0111\u1EA9y m\u1EA1nh h\u1ECDc t\u1EADp v\xE0 l\xE0m theo t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    category: "official-dispatches",
    categoryLabel: "T\xE0i li\u1EC7u ch\xEDnh th\u1EE9c c\u1EE7a c\u01A1 quan qu\u1EA3n l\xFD",
    authorOrSource: "B\u1ED9 Ch\xEDnh tr\u1ECB Ban Ch\u1EA5p h\xE0nh Trung \u01B0\u01A1ng \u0110\u1EA3ng kh\xF3a XII",
    dateOrEra: "15/05/2016",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Ch\u1EC9 th\u1ECB 05-CT/TW", "B\u1ED9 Ch\xEDnh tr\u1ECB", "\u0110\u1EA1o \u0111\u1EE9c phong c\xE1ch H\u1ED3 Ch\xED Minh", "Gi\xE1o d\u1EE5c h\u1ECDc \u0111\u01B0\u1EDDng", "Chi b\u1ED9 nh\xE0 tr\u01B0\u1EDDng"],
    sourceUrl: "https://tulieuvankien.dangcongsan.vn",
    content: `1. M\u1EE4C TI\xCAU V\xC0 \xDD NGH\u0128A C\u1EE6A CH\u1EC8 TH\u1ECA S\u1ED0 05-CT/TW:
Ng\xE0y 15 th\xE1ng 5 n\u0103m 2016, B\u1ED9 Ch\xEDnh tr\u1ECB kh\xF3a XII \u0111\xE3 ban h\xE0nh Ch\u1EC9 th\u1ECB s\u1ED1 05-CT/TW v\u1EC1 "\u0110\u1EA9y m\u1EA1nh h\u1ECDc t\u1EADp v\xE0 l\xE0m theo t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh".
Ch\u1EC9 th\u1ECB nh\u1EA5n m\u1EA1nh: Vi\u1EC7c h\u1ECDc t\u1EADp v\xE0 l\xE0m theo B\xE1c l\xE0 m\u1ED9t n\u1ED9i dung quan tr\u1ECDng c\u1EE7a c\xF4ng t\xE1c x\xE2y d\u1EF1ng, ch\u1EC9nh \u0111\u1ED1n \u0110\u1EA3ng; g\xF3p ph\u1EA7n x\xE2y d\u1EF1ng \u0110\u1EA3ng trong s\u1EA1ch, v\u1EEFng m\u1EA1nh v\u1EC1 ch\xEDnh tr\u1ECB, t\u01B0 t\u01B0\u1EDFng, t\u1ED5 ch\u1EE9c v\xE0 \u0111\u1EA1o \u0111\u1EE9c; x\xE2y d\u1EF1ng \u0111\u1ED9i ng\u0169 c\xE1n b\u1ED9, c\xF4ng ch\u1EE9c \u0111\u1EE7 n\u0103ng l\u1EF1c, ph\u1EA9m ch\u1EA5t, ngang t\u1EA7m nhi\u1EC7m v\u1EE5; ng\u0103n ch\u1EB7n, \u0111\u1EA9y l\xF9i s\u1EF1 suy tho\xE1i v\u1EC1 t\u01B0 t\u01B0\u1EDFng ch\xEDnh tr\u1ECB, \u0111\u1EA1o \u0111\u1EE9c, l\u1ED1i s\u1ED1ng.

2. C\xC1C N\u1ED8I DUNG TR\u1ECCNG T\xC2M TRONG NG\xC0NH GI\xC1O D\u1EE4C:
- \u0110\u1ED5i m\u1EDBi, n\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng gi\u1EA3ng d\u1EA1y v\xE0 h\u1ECDc t\u1EADp t\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh trong h\u1EC7 th\u1ED1ng gi\xE1o d\u1EE5c qu\u1ED1c d\xE2n, ph\xF9 h\u1EE3p v\u1EDBi t\u1EEBng c\u1EA5p h\u1ECDc v\xE0 l\u1EE9a tu\u1ED5i h\u1ECDc sinh THCS.
- X\xE2y d\u1EF1ng \u0111\u1EA1o \u0111\u1EE9c nh\xE0 gi\xE1o: M\u1ED7i th\u1EA7y gi\xE1o, c\xF4 gi\xE1o l\xE0 m\u1ED9t t\u1EA5m g\u01B0\u01A1ng s\xE1ng v\u1EC1 \u0111\u1EA1o \u0111\u1EE9c, t\u1EF1 h\u1ECDc v\xE0 s\xE1ng t\u1EA1o \u0111\u1EC3 h\u1ECDc sinh noi theo; ki\xEAn quy\u1EBFt ch\u1ED1ng ti\xEAu c\u1EF1c, b\u1EC7nh th\xE0nh t\xEDch trong thi c\u1EED v\xE0 b\u1EC7nh h\xECnh th\u1EE9c trong thi \u0111ua.
- Gi\xE1o d\u1EE5c l\xFD t\u01B0\u1EDFng c\xE1ch m\u1EA1ng cho th\u1EBF h\u1EC7 tr\u1EBB: T\u0103ng c\u01B0\u1EDDng gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng y\xEAu n\u01B0\u1EDBc, l\xF2ng t\u1EF1 h\xE0o d\xE2n t\u1ED9c, b\u1ED3i d\u01B0\u1EE1ng \u0111\u1EA1o \u0111\u1EE9c trong s\xE1ng, l\u1ED1i s\u1ED1ng l\xE0nh m\u1EA1nh, tinh th\u1EA7n tr\xE1ch nhi\u1EC7m v\u1EDBi b\u1EA3n th\xE2n, gia \u0111\xECnh v\xE0 c\u1ED9ng \u0111\u1ED3ng x\xE3 h\u1ED9i.

3. CH\u01AF\u01A0NG TR\xCCNH H\xC0NH \u0110\u1ED8NG C\u1EE6A TR\u01AF\u1EDCNG THCS NGUY\u1EC4N TRUNG TR\u1EF0C:
Chi b\u1ED9 v\xE0 Ban Gi\xE1m hi\u1EC7u nh\xE0 tr\u01B0\u1EDDng c\u1EE5 th\u1EC3 h\xF3a Ch\u1EC9 th\u1ECB 05-CT/TW v\xE0o k\u1EBF ho\u1EA1ch nhi\u1EC7m v\u1EE5 n\u0103m h\u1ECDc:
- T\xEDch h\u1EE3p n\u1ED9i dung h\u1ECDc t\u1EADp v\xE0 l\xE0m theo B\xE1c v\xE0o c\xE1c m\xF4n h\u1ECDc: L\u1ECBch s\u1EED, Ng\u1EEF v\u0103n, Gi\xE1o d\u1EE5c c\xF4ng d\xE2n, Ho\u1EA1t \u0111\u1ED9ng tr\u1EA3i nghi\u1EC7m h\u01B0\u1EDBng nghi\u1EC7p.
- T\u1ED5 ch\u1EE9c c\xE1c h\u1ED9i thi tr\u1EF1c tuy\u1EBFn t\xECm hi\u1EC3u l\u1ECBch s\u1EED, thi k\u1EC3 chuy\u1EC7n t\u1EA5m g\u01B0\u01A1ng \u0111\u1EA1o \u0111\u1EE9c B\xE1c H\u1ED3 v\xE0 b\xECnh ch\u1ECDn g\u01B0\u01A1ng \u0111i\u1EC3n h\xECnh h\u1ECDc sinh ch\u0103m ngoan, ti\u1EBFn b\u1ED9 m\u1ED7i th\xE1ng.`,
    metadata: {
      batch: "BATCH_C_EXPANSION_01",
      directiveNumber: "05-CT/TW",
      issuingBody: "B\u1ED9 Ch\xEDnh tr\u1ECB Ban Ch\u1EA5p h\xE0nh Trung \u01B0\u01A1ng \u0110\u1EA3ng"
    }
  },
  // ============================================================================
  // BATCH D: BỔ SUNG TRI THỨC TỪ TỦ SÁCH ĐIỆN TỬ HỒ CHÍ MINH (HOCHIMINH.VN)
  // (DOC-HCM-041 đến DOC-HCM-046) - Nguồn kiểm chứng: hochiminh.vn (categoryId=3000402)
  // ============================================================================
  {
    id: "DOC-HCM-041",
    title: "H\u1ECDc \u1EDF tr\u01B0\u1EDDng, h\u1ECDc \u1EDF s\xE1ch v\u1EDF, h\u1ECDc l\u1EABn nhau v\xE0 h\u1ECDc nh\xE2n d\xE2n \u2013 Ph\u01B0\u01A1ng ph\xE1p h\u1ECDc t\u1EADp su\u1ED1t \u0111\u1EDDi c\u1EE7a Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh",
    category: "teachings-children",
    categoryLabel: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - T\u1EE7 s\xE1ch \u0111i\u1EC7n t\u1EED H\u1ED3 Ch\xED Minh (hochiminh.vn) & NXB Tr\u1EBB",
    dateOrEra: "1945 - 1969",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["T\u1EF1 h\u1ECDc", "Ph\u01B0\u01A1ng ph\xE1p h\u1ECDc t\u1EADp", "H\u1ECDc su\u1ED1t \u0111\u1EDDi", "H\u1ECDc \u1EDF nh\xE2n d\xE2n", "H\u1ECDc sinh THCS", "T\u1EE7 s\xE1ch \u0111i\u1EC7n t\u1EED H\u1ED3 Ch\xED Minh"],
    sourceUrl: "https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/hoc-o-truong-hoc-o-sach-vo-hoc-lan-nhau-va-hoc-nhan-dan-484",
    content: `1. L\u1EDCI HU\u1EA4N TH\u1ECA C\u1ED0T L\xD5I C\u1EE6A CH\u1EE6 T\u1ECACH H\u1ED2 CH\xCD MINH V\u1EC0 VI\u1EC6C H\u1ECCC:
Sinh th\u1EDDi, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh lu\xF4n c\u0103n d\u1EB7n c\xE1n b\u1ED9, gi\xE1o vi\xEAn v\xE0 h\u1ECDc sinh:
"H\u1ECDc \u1EDF tr\u01B0\u1EDDng, h\u1ECDc \u1EDF s\xE1ch v\u1EDF, h\u1ECDc l\u1EABn nhau v\xE0 h\u1ECDc nh\xE2n d\xE2n, kh\xF4ng h\u1ECDc nh\xE2n d\xE2n l\xE0 m\u1ED9t thi\u1EBFu s\xF3t r\u1EA5t l\u1EDBn".
Theo B\xE1c, tri th\u1EE9c kh\xF4ng bao gi\u1EDD \u0111\xF3ng khung trong b\u1ED1n b\u1EE9c t\u01B0\u1EDDng l\u1EDBp h\u1ECDc. Tr\u01B0\u1EDDng h\u1ECDc cung c\u1EA5p n\u1EC1n t\u1EA3ng ki\u1EBFn th\u1EE9c c\u0103n b\u1EA3n, nh\u01B0ng ng\u01B0\u1EDDi h\u1ECDc mu\u1ED1n th\u1EF1c s\u1EF1 tr\u01B0\u1EDFng th\xE0nh v\xE0 \u0111\xF3ng g\xF3p cho \u0111\u1EA5t n\u01B0\u1EDBc th\xEC ph\u1EA3i m\u1EDF r\u1ED9ng kh\xF4ng gian h\u1ECDc t\u1EADp ra to\xE0n b\u1ED9 \u0111\u1EDDi s\u1ED1ng x\xE3 h\u1ED9i.

2. NGUY\xCAN L\xDD T\u1EF0 H\u1ECCC V\xC0 H\u1ECCC T\u1EACP SU\u1ED0T \u0110\u1EDCI:
- H\u1ECDc \u0111i \u0111\xF4i v\u1EDBi h\xE0nh: "H\u1ECDc \u0111\u1EC3 h\xE0nh: H\u1ECDc v\u1EDBi h\xE0nh ph\u1EA3i \u0111i \u0111\xF4i. H\u1ECDc m\xE0 kh\xF4ng h\xE0nh th\xEC v\xF4 \xEDch. H\xE0nh m\xE0 kh\xF4ng h\u1ECDc th\xEC h\xE0nh kh\xF4ng tr\xF4i ch\u1EA3y".
- H\u1ECDc su\u1ED1t \u0111\u1EDDi: "C\xF2n s\u1ED1ng th\xEC c\xF2n ph\u1EA3i h\u1ECDc", "\u0110\u01B0\u1EDDng \u0111\u1EDDi l\xE0 m\u1ED9t chi\u1EBFc thang kh\xF4ng c\xF3 n\u1EA5c ch\xF3t; vi\u1EC7c h\u1ECDc l\xE0 m\u1ED9t quy\u1EC3n s\xE1ch kh\xF4ng c\xF3 trang cu\u1ED1i c\xF9ng".
- R\xE8n luy\u1EC7n \xF3c suy ngh\u0129 \u0111\u1ED9c l\u1EADp: B\xE1c ph\xEA ph\xE1n gay g\u1EAFt l\u1ED1i h\u1ECDc v\u1EB9t, h\u1ECDc t\u1EE7, h\u1ECDc ch\u1EC9 \u0111\u1EC3 l\u1EA5y b\u1EB1ng c\u1EA5p \u0111\u1ED1i ph\xF3. Ng\u01B0\u1EDDi y\xEAu c\u1EA7u h\u1ECDc tr\xF2 ph\u1EA3i c\xF3 tinh th\u1EA7n t\u1EF1 l\u1EF1c c\xE1nh sinh, \u0111\xE0o s\xE2u suy ngh\u0129, d\xE1m th\u1EAFc m\u1EAFc v\xE0 t\xECm t\xF2i ch\xE2n l\xFD.

3. T\u1EA4M G\u01AF\u01A0NG T\u1EF0 H\u1ECCC S\xC1NG NG\u1EDCI C\u1EE6A B\xC1C H\u1ED2:
- Trong h\u01A1n 30 n\u0103m b\xF4n ba qua g\u1EA7n 30 qu\u1ED1c gia tr\xEAn th\u1EBF gi\u1EDBi, Ng\u01B0\u1EDDi v\u1EEBa lao \u0111\u1ED9ng n\u1EB7ng nh\u1ECDc (ph\u1EE5 b\u1EBFp, c\xE0o tuy\u1EBFt, th\u1EE3 \u1EA3nh, vi\u1EBFt b\xE1o) v\u1EEBa ki\xEAn tr\xEC t\u1EF1 h\u1ECDc ngo\u1EA1i ng\u1EEF v\xE0 c\xE1c m\xF4n khoa h\u1ECDc x\xE3 h\u1ED9i.
- M\u1ED7i ng\xE0y Ng\u01B0\u1EDDi quy \u0111\u1ECBnh ph\u1EA3i h\u1ECDc v\xE0 ghi nh\u1EDB m\u1ED9t s\u1ED1 t\u1EEB m\u1EDBi, vi\u1EBFt ch\u1EEF l\xEAn c\xE1nh tay \u0111\u1EC3 v\u1EEBa l\xE0m vi\u1EC7c v\u1EEBa nh\u1EA9m thu\u1ED9c l\xF2ng. Nh\u1EDD tinh th\u1EA7n t\u1EF1 h\u1ECDc phi th\u01B0\u1EDDng, Ng\u01B0\u1EDDi \u0111\xE3 s\u1EED d\u1EE5ng th\xF4ng th\u1EA1o nhi\u1EC1u ngo\u1EA1i ng\u1EEF nh\u01B0 ti\u1EBFng Ph\xE1p, Anh, Nga, Trung Qu\u1ED1c, \u0110\u1EE9c, T\xE2y Ban Nha, \xDD...

4. B\xC0I H\u1ECCC V\u1EACN D\u1EE4NG CHO \u0110\u1ED8I VI\xCAN, H\u1ECCC SINH THCS NGUY\u1EC4N TRUNG TR\u1EF0C:
- X\xE2y d\u1EF1ng th\xF3i quen \u0111\u1ECDc s\xE1ch m\u1ED7i ng\xE0y t\u1EA1i Th\u01B0 vi\u1EC7n th\xF4ng minh v\xE0 Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh c\u1EE7a tr\u01B0\u1EDDng.
- Tinh th\u1EA7n "h\u1ECDc l\u1EABn nhau": T\xEDch c\u1EF1c tham gia m\xF4 h\xECnh "\u0110\xF4i b\u1EA1n c\xF9ng ti\u1EBFn", h\u1ECDc nh\xF3m, gi\xFAp \u0111\u1EE1 b\u1EA1n b\xE8 h\u1ECDc y\u1EBFu c\xF9ng v\u01B0\u01A1n l\xEAn.
- Tinh th\u1EA7n "h\u1ECDc nh\xE2n d\xE2n": Bi\u1EBFt l\u1EC5 ph\xE9p, l\u1EAFng nghe, h\u1ECDc h\u1ECFi nh\u1EEFng \u0111\u1EE9c t\xEDnh c\u1EA7n c\xF9, th\u1EADt th\xE0, y\xEAu lao \u0111\u1ED9ng t\u1EEB \xF4ng b\xE0, cha m\u1EB9 v\xE0 ng\u01B0\u1EDDi lao \u0111\u1ED9ng xung quanh.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      bookId: 484,
      pdfUrl: "https://hochiminh.vn/upload/3000001/20251024/06027212f502726cbace66eb3f4cfb2bHoc-o-truong--HCM.pdf",
      publisher: "NXB Tr\u1EBB & hochiminh.vn"
    }
  },
  {
    id: "DOC-HCM-042",
    title: 'T\xE1c ph\u1EA9m "V\u0103n h\xF3a soi \u0111\u01B0\u1EDDng cho qu\u1ED1c d\xE2n \u0111i" \u2013 T\u01B0 t\u01B0\u1EDFng H\u1ED3 Ch\xED Minh v\u1EC1 x\xE2y d\u1EF1ng n\u1EC1n v\u0103n h\xF3a Vi\u1EC7t Nam ti\xEAn ti\u1EBFn',
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - Vang v\u1ECDng l\u1EDDi n\u01B0\u1EDBc non (T\u1EADp 8), NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn",
    dateOrEra: "24/11/1946",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["V\u0103n h\xF3a soi \u0111\u01B0\u1EDDng cho qu\u1ED1c d\xE2n \u0111i", "H\u1ED9i ngh\u1ECB V\u0103n h\xF3a to\xE0n qu\u1ED1c 1946", "N\u1EC1n v\u0103n h\xF3a m\u1EDBi", "\u0110\u1EA1o \u0111\u1EE9c v\u0103n h\xF3a", "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh"],
    sourceUrl: "https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/vang-vong-loi-nuoc-non-tap-8-van-hoa-soi-duong-cho-quoc-dan-di-463",
    content: `1. B\u1ED0I C\u1EA2NH V\xC0 LU\u1EACN \u0110I\u1EC2M L\u1ECACH S\u1EEC T\u1EA0I H\u1ED8I NGH\u1ECA V\u0102N H\xD3A TO\xC0N QU\u1ED0C 1946:
Ng\xE0y 24 th\xE1ng 11 n\u0103m 1946, t\u1EA1i Nh\xE0 h\xE1t L\u1EDBn H\xE0 N\u1ED9i, H\u1ED9i ngh\u1ECB V\u0103n h\xF3a to\xE0n qu\u1ED1c l\u1EA7n th\u1EE9 nh\u1EA5t \u0111\xE3 long tr\u1ECDng khai m\u1EA1c.
T\u1EA1i di\u1EC5n \u0111\xE0n n\xE0y, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 kh\u1EB3ng \u0111\u1ECBnh lu\u1EADn \u0111i\u1EC3m b\u1EA5t h\u1EE7 mang t\xEDnh \u0111\u1ECBnh h\u01B0\u1EDBng chi\u1EBFn l\u01B0\u1EE3c:
"V\u0103n h\xF3a soi \u0111\u01B0\u1EDDng cho qu\u1ED1c d\xE2n \u0111i".
Ng\u01B0\u1EDDi nh\u1EA5n m\u1EA1nh: V\u0103n h\xF3a kh\xF4ng ph\u1EA3i l\xE0 th\u1EE9 trang s\u1EE9c b\xEAn ngo\xE0i x\xE3 h\u1ED9i, m\xE0 v\u0103n h\xF3a ch\xEDnh l\xE0 ng\u1ECDn \u0111u\u1ED1c d\u1EABn \u0111\u01B0\u1EDDng, b\u1ED3i \u0111\u1EAFp t\xE2m h\u1ED3n, khai s\xE1ng d\xE2n tr\xED v\xE0 kh\u01A1i d\u1EADy kh\xE1t v\u1ECDng \u0111\u1ED9c l\u1EADp, t\u1EF1 do, t\u1EF1 c\u01B0\u1EDDng c\u1EE7a to\xE0n th\u1EC3 d\xE2n t\u1ED9c.

2. \u0110\u1ECANH NGH\u0128A KHOA H\u1ECCC V\xC0 TO\xC0N DI\u1EC6N C\u1EE6A H\u1ED2 CH\xCD MINH V\u1EC0 V\u0102N H\xD3A:
Th\xE1ng 8 n\u0103m 1943, trong trang s\u1ED5 tay "Nh\u1EADt k\xFD trong t\xF9", B\xE1c H\u1ED3 \u0111\xE3 ghi l\u1EA1i \u0111\u1ECBnh ngh\u0129a s\xE2u s\u1EAFc v\u1EC1 v\u0103n h\xF3a:
"V\xEC l\u1EBD sinh t\u1ED3n c\u0169ng nh\u01B0 m\u1EE5c \u0111\xEDch c\u1EE7a cu\u1ED9c s\u1ED1ng, lo\xE0i ng\u01B0\u1EDDi m\u1EDBi s\xE1ng t\u1EA1o v\xE0 ph\xE1t minh ra ng\xF4n ng\u1EEF, ch\u1EEF vi\u1EBFt, \u0111\u1EA1o \u0111\u1EE9c, ph\xE1p lu\u1EADt, khoa h\u1ECDc, t\xF4n gi\xE1o, v\u0103n h\u1ECDc, ngh\u1EC7 thu\u1EADt, nh\u1EEFng c\xF4ng c\u1EE5 cho sinh ho\u1EA1t h\u1EB1ng ng\xE0y v\u1EC1 m\u1EB7c, \u0103n, \u1EDF v\xE0 c\xE1c ph\u01B0\u01A1ng th\u1EE9c s\u1EED d\u1EE5ng. To\xE0n b\u1ED9 nh\u1EEFng s\xE1ng t\u1EA1o v\xE0 ph\xE1t minh \u0111\xF3 t\u1EE9c l\xE0 v\u0103n h\xF3a".

3. M\u1ED0I QUAN H\u1EC6 GI\u1EEEA V\u0102N H\xD3A V\u1EDAI CH\xCDNH TR\u1ECA V\xC0 KINH T\u1EBE:
- B\xE1c ch\u1EC9 r\xF5: V\u0103n h\xF3a kh\xF4ng th\u1EC3 \u0111\u1EE9ng ngo\xE0i m\xE0 ph\u1EA3i \u1EDF trong kinh t\u1EBF v\xE0 ch\xEDnh tr\u1ECB.
- Kinh t\u1EBF ph\xE1t tri\u1EC3n s\u1EBD t\u1EA1o ti\u1EC1n \u0111\u1EC1 v\u1EADt ch\u1EA5t cho v\u0103n h\xF3a n\u1EA3y n\u1EDF; nh\u01B0ng v\u0103n h\xF3a l\u1EA1i l\xE0 \u0111\u1ED9ng l\u1EF1c n\u1ED9i sinh, n\xE2ng \u0111\u1EE1 \u0111\u1EA1o \u0111\u1EE9c x\xE3 h\u1ED9i, ng\u0103n ng\u1EEBa s\u1EF1 tha h\xF3a, suy \u0111\u1ED3i nh\xE2n c\xE1ch.
- N\u1EC1n v\u0103n h\xF3a m\u1EDBi Vi\u1EC7t Nam ph\u1EA3i th\u1EA5m nhu\u1EA7n 3 t\xEDnh ch\u1EA5t c\u0103n b\u1EA3n: D\xE2n t\u1ED9c, Khoa h\u1ECDc v\xE0 \u0110\u1EA1i ch\xFAng.

4. \xDD NGH\u0128A \u0110\u1ED0I V\u1EDAI KH\xD4NG GIAN V\u0102N H\xD3A H\u1ED2 CH\xCD MINH H\u1ECCC \u0110\u01AF\u1EDCNG:
- Lu\u1EADn \u0111i\u1EC3m "V\u0103n h\xF3a soi \u0111\u01B0\u1EDDng cho qu\u1ED1c d\xE2n \u0111i" ch\xEDnh l\xE0 kim ch\u1EC9 nam cho vi\u1EC7c x\xE2y d\u1EF1ng Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh t\u1EA1i Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c (Ph\u01B0\u1EDDng Th\u1EDBi An, TP.HCM).
- Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh h\u1ECDc \u0111\u01B0\u1EDDng kh\xF4ng d\u1EEBng l\u1EA1i \u1EDF c\xE1c pano, tri\u1EC3n l\xE3m t\u0129nh, m\xE0 ph\u1EA3i th\u1EA9m th\u1EA5u v\xE0o v\u0103n h\xF3a \u1EE9ng x\u1EED h\u1EB1ng ng\xE0y: n\u1EBFp s\u1ED1ng v\u0103n minh, th\u1EA7y m\u1EABu m\u1EF1c, tr\xF2 ch\u0103m ngoan, trung th\u1EF1c trong thi c\u1EED v\xE0 t\u01B0\u01A1ng th\xE2n t\u01B0\u01A1ng \xE1i gi\u1EEFa c\xE1c h\u1ECDc sinh.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      bookId: 463,
      pdfUrl: "https://hochiminh.vn/upload/3000001/20251024/43ff43ed3f86cd37ac3683f7aea3813avang-vong-loi-nuoc-non-tap-8.pdf",
      publisher: "NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn"
    }
  },
  {
    id: "DOC-HCM-043",
    title: 'T\xE1c ph\u1EA9m "\u0110\u1EA1i \u0111o\xE0n k\u1EBFt l\xE0 m\u1ED9t l\u1EF1c l\u01B0\u1EE3ng t\u1EA5t th\u1EAFng" \u2013 C\u1ED9i ngu\u1ED3n s\u1EE9c m\u1EA1nh d\xE2n t\u1ED9c theo t\u01B0 t\u01B0\u1EDFng H\u1ED3 Ch\xED Minh',
    category: "ideology-ethics",
    categoryLabel: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - Vang v\u1ECDng l\u1EDDi n\u01B0\u1EDBc non (T\u1EADp 9), NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn",
    dateOrEra: "1930 - 1969",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["\u0110\u1EA1i \u0111o\xE0n k\u1EBFt to\xE0n d\xE2n t\u1ED9c", "\u0110o\xE0n k\u1EBFt \u0111o\xE0n k\u1EBFt \u0111\u1EA1i \u0111o\xE0n k\u1EBFt", "S\u1EE9c m\u1EA1nh d\xE2n t\u1ED9c", "Y\xEAu th\u01B0\u01A1ng \u0111\u1ED3ng b\xE0o", "\u0110o\xE0n k\u1EBFt h\u1ECDc \u0111\u01B0\u1EDDng"],
    sourceUrl: "https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/vang-vong-loi-nuoc-non-tap-9-dai-doan-ket-la-mot-luc-luong-tat-thang-464",
    content: `1. CH\xC2N L\xDD B\u1EA4T H\u1EE6 V\u1EC0 \u0110\u1EA0I \u0110O\xC0N K\u1EBET:
Trong su\u1ED1t cu\u1ED9c \u0111\u1EDDi ho\u1EA1t \u0111\u1ED9ng c\xE1ch m\u1EA1ng c\u1EE7a m\xECnh, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u0111\xE3 \u0111\xFAc k\u1EBFt ch\xE2n l\xFD l\u1ECBch s\u1EED v\u0129 \u0111\u1EA1i:
"\u0110o\xE0n k\u1EBFt, \u0111o\xE0n k\u1EBFt, \u0111\u1EA1i \u0111o\xE0n k\u1EBFt,
Th\xE0nh c\xF4ng, th\xE0nh c\xF4ng, \u0111\u1EA1i th\xE0nh c\xF4ng!".
\u0110o\xE0n k\u1EBFt kh\xF4ng ch\u1EC9 l\xE0 m\u1ED9t s\xE1ch l\u01B0\u1EE3c ch\xEDnh tr\u1ECB nh\u1EA5t th\u1EDDi, m\xE0 l\xE0 \u0111\u01B0\u1EDDng l\u1ED1i chi\u1EBFn l\u01B0\u1EE3c s\u1ED1ng c\xF2n, xuy\xEAn su\u1ED1t c\u1EE7a c\xE1ch m\u1EA1ng Vi\u1EC7t Nam, l\xE0 c\u1ED9i ngu\u1ED3n t\u1EA1o n\xEAn s\u1EE9c m\u1EA1nh v\xF4 \u0111\u1ECBch gi\xFAp d\xE2n t\u1ED9c ta chi\u1EBFn th\u1EAFng m\u1ECDi k\u1EBB th\xF9 x\xE2m l\u01B0\u1EE3c v\xE0 v\u01B0\u1EE3t qua m\u1ECDi b\xE3o gi\xF4ng th\u1EED th\xE1ch.

2. NGUY\xCAN T\u1EAEC V\xC0 L\u1EF0C L\u01AF\u1EE2NG C\u1EE6A KH\u1ED0I \u0110\u1EA0I \u0110O\xC0N K\u1EBET:
- \u0110\u1EA1i \u0111o\xE0n k\u1EBFt to\xE0n d\xE2n t\u1ED9c: T\u1EADp h\u1EE3p kh\xF4ng ph\xE2n bi\u1EC7t t\xF4n gi\xE1o (l\u01B0\u01A1ng hay gi\xE1o), kh\xF4ng ph\xE2n bi\u1EC7t giai c\u1EA5p, g\xE1i trai, gi\xE0 tr\u1EBB, 54 d\xE2n t\u1ED9c anh em c\xF9ng chung m\u1ED9t d\u1EA3i non s\xF4ng \u0111\u1EA5t n\u01B0\u1EDBc.
- L\u1EA5y li\xEAn minh c\xF4ng - n\xF4ng - tr\xED th\u1EE9c l\xE0m n\u1EC1n t\u1EA3ng, d\u01B0\u1EDBi s\u1EF1 l\xE3nh \u0111\u1EA1o c\u1EE7a \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam.
- K\u1EBFt h\u1EE3p \u0111\u1EA1i \u0111o\xE0n k\u1EBFt to\xE0n d\xE2n t\u1ED9c v\u1EDBi \u0111o\xE0n k\u1EBFt qu\u1ED1c t\u1EBF: Tranh th\u1EE7 s\u1EF1 \u1EE7ng h\u1ED9 c\u1EE7a c\xE1c l\u1EF1c l\u01B0\u1EE3ng ti\u1EBFn b\u1ED9, y\xEAu chu\u1ED9ng h\xF2a b\xECnh tr\xEAn to\xE0n th\u1EBF gi\u1EDBi v\xEC m\u1EE5c ti\xEAu \u0111\u1ED9c l\u1EADp, t\u1EF1 do v\xE0 t\xECnh huynh \u0111\u1EC7 nh\xE2n lo\u1EA1i.

3. L\u1EDCI D\u1EB6N D\xD2 T\xC2M HUY\u1EBET V\u1EC0 \u0110O\xC0N K\u1EBET TRONG DI CH\xDAC (1969):
Tr\u01B0\u1EDBc l\xFAc \u0111i xa, Ng\u01B0\u1EDDi \u0111\xE3 thi\u1EBFt tha c\u0103n d\u1EB7n:
"\u0110o\xE0n k\u1EBFt l\xE0 m\u1ED9t truy\u1EC1n th\u1ED1ng c\u1EF1c k\u1EF3 qu\xFD b\xE1u c\u1EE7a \u0110\u1EA3ng v\xE0 c\u1EE7a d\xE2n ta. C\xE1c \u0111\u1ED3ng ch\xED t\u1EEB Trung \u01B0\u01A1ng \u0111\u1EBFn c\xE1c chi b\u1ED9 c\u1EA7n ph\u1EA3i gi\u1EEF g\xECn s\u1EF1 \u0111o\xE0n k\u1EBFt nh\u1EA5t tr\xED c\u1EE7a \u0110\u1EA3ng nh\u01B0 gi\u1EEF g\xECn con ng\u01B0\u01A1i c\u1EE7a m\u1EAFt m\xECnh".

4. B\xC0I H\u1ECCC TH\u1EF0C TI\u1EC4N CHO H\u1ECCC SINH THCS NGUY\u1EC4N TRUNG TR\u1EF0C:
- R\xE8n luy\u1EC7n \u0110i\u1EC1u 3 trong 5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y: "\u0110o\xE0n k\u1EBFt t\u1ED1t, k\u1EF7 lu\u1EADt t\u1ED1t".
- Tinh th\u1EA7n \u0111\u1ED3ng \u0111\u1ED9i v\xE0 t\xECnh b\u1EA1n trong s\xE1ng: Bi\u1EBFt bao dung, s\u1EBB chia kh\xF3 kh\u0103n, t\u01B0\u01A1ng tr\u1EE3 b\u1EA1n b\xE8 trong h\u1ECDc t\u1EADp, ki\xEAn quy\u1EBFt b\xE0i tr\u1EEB v\u1EA5n n\u1EA1n b\u1EA1o l\u1EF1c h\u1ECDc \u0111\u01B0\u1EDDng v\xE0 chia r\u1EBD b\xE8 ph\xE1i.
- Chung tay x\xE2y d\u1EF1ng t\u1EADp th\u1EC3 l\u1EDBp \u0111o\xE0n k\u1EBFt v\u1EEFng m\u1EA1nh, ng\xF4i tr\u01B0\u1EDDng h\u1EA1nh ph\xFAc ngh\u0129a t\xECnh t\u1EA1i Ph\u01B0\u1EDDng Th\u1EDBi An.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      bookId: 464,
      pdfUrl: "https://hochiminh.vn/upload/3000001/20251024/7efb763da178a1e30c1e72126c829714vang-vong-loi-nuoc-non-tap-9-%C4%91%C3%A3-n%C3%A9n.pdf",
      publisher: "NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn"
    }
  },
  {
    id: "DOC-HCM-044",
    title: 'K\xFD s\u1EF1 "M\u1ED9t gi\u1EDD v\u1EDBi \u0111\u1ED3ng ch\xED H\u1ED3 Ch\xED Minh" \u2013 T\u1EA7m v\xF3c v\u0103n h\xF3a Nguy\u1EC5n \xC1i Qu\u1ED1c qua g\xF3c nh\xECn b\xE1o ch\xED qu\u1ED1c t\u1EBF n\u0103m 1923',
    category: "bio-career",
    categoryLabel: "Cu\u1ED9c \u0111\u1EDDi v\xE0 s\u1EF1 nghi\u1EC7p Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh",
    authorOrSource: "Nh\xE0 b\xE1o Osip Mandelstam (T\u1EA1p ch\xED Ogoniok Li\xEAn X\xF4 1923), NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn",
    dateOrEra: "23/12/1923",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nguy\u1EC5n \xC1i Qu\u1ED1c", "Osip Mandelstam", "T\u1EA1p ch\xED Ogoniok", "Moskva 1923", "V\u0103n h\xF3a t\u01B0\u01A1ng lai", "T\xECnh huynh \u0111\u1EC7 qu\u1ED1c t\u1EBF"],
    sourceUrl: "https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/mot-gio-voi-dong-chi-ho-chi-minh-475",
    content: `1. HO\xC0N C\u1EA2NH L\u1ECACH S\u1EEC C\u1EE6A B\xC0I K\xDD S\u1EF0 B\xC1O CH\xCD N\u0102M 1923:
Th\xE1ng 6 n\u0103m 1923, ng\u01B0\u1EDDi thanh ni\xEAn y\xEAu n\u01B0\u1EDBc Nguy\u1EC5n \xC1i Qu\u1ED1c r\u1EDDi Paris sang th\u1EE7 \u0111\xF4 Moskva (Li\xEAn X\xF4) \u0111\u1EC3 d\u1EF1 H\u1ED9i ngh\u1ECB Qu\u1ED1c t\u1EBF N\xF4ng d\xE2n v\xE0 chu\u1EA9n b\u1ECB tham d\u1EF1 \u0110\u1EA1i h\u1ED9i V Qu\u1ED1c t\u1EBF C\u1ED9ng s\u1EA3n.
V\xE0o th\xE1ng 12 n\u0103m 1923, Osip Mandelstam - nh\xE0 th\u01A1, nh\xE0 b\xE1o danh ti\u1EBFng c\u1EE7a n\u01B0\u1EDBc Nga X\xF4 Vi\u1EBFt \u0111\xE3 c\xF3 m\u1ED9t cu\u1ED9c ti\u1EBFp x\xFAc, ph\u1ECFng v\u1EA5n \u0111\u1EB7c bi\u1EC7t v\u1EDBi Ng\u01B0\u1EDDi. B\xE0i k\xFD s\u1EF1 mang t\u1EF1a \u0111\u1EC1 "Th\u0103m m\u1ED9t chi\u1EBFn s\u0129 Qu\u1ED1c t\u1EBF C\u1ED9ng s\u1EA3n - Nguy\u1EC5n \xC1i Qu\u1ED1c" \u0111\u01B0\u1EE3c \u0111\u0103ng tr\xEAn T\u1EA1p ch\xED Ogoniok (Ng\u1ECDn l\u1EEDa nh\u1ECF) s\u1ED1 39 ng\xE0y 23/12/1923.

2. NH\u1EACN \u0110\u1ECANH B\u1EA4T H\u1EE6 V\u1EC0 V\u0102N H\xD3A C\u1EE6A NGUY\u1EC4N \xC1I QU\u1ED0C:
Trong b\xE0i k\xFD s\u1EF1, Osip Mandelstam \u0111\xE3 ghi l\u1EA1i l\u1EDDi b\xECnh lu\u1EADn mang t\u1EA7m ti\xEAn tri v\xE0 d\u1EF1 b\xE1o s\xE2u s\u1EAFc v\u1EC1 v\u0103n h\xF3a:
"T\u1EEB Nguy\u1EC5n \xC1i Qu\u1ED1c \u0111\xE3 t\u1ECFa ra m\u1ED9t th\u1EE9 v\u0103n h\xF3a, kh\xF4ng ph\u1EA3i v\u0103n h\xF3a \xC2u ch\xE2u, m\xE0 c\xF3 l\u1EBD l\xE0 m\u1ED9t n\u1EC1n v\u0103n h\xF3a c\u1EE7a t\u01B0\u01A1ng lai...
Qua c\u1EED ch\u1EC9 cao th\u01B0\u1EE3ng, ti\u1EBFng n\xF3i tr\u1EA7m \u1EA5m c\u1EE7a Nguy\u1EC5n \xC1i Qu\u1ED1c, ch\xFAng ta nh\u01B0 nghe th\u1EA5y ng\xE0y mai, nh\u01B0 th\u1EA5y s\u1EF1 y\xEAn t\u0129nh m\xEAnh m\xF4ng c\u1EE7a t\xECnh huynh \u0111\u1EC7 to\xE0n th\u1EBF gi\u1EDBi".

3. KH\u1EAEC H\u1ECCA CH\xC2N DUNG V\xC0 PHONG TH\xC1I C\u1EE6A NG\u01AF\u1EDCI THANH NI\xCAN VI\u1EC6T NAM:
- T\xE1c gi\u1EA3 mi\xEAu t\u1EA3 Nguy\u1EC5n \xC1i Qu\u1ED1c: M\u1ED9t ch\xE0ng thanh ni\xEAn d\xE1ng ng\u01B0\u1EDDi m\u1EA3nh kh\u1EA3nh, khu\xF4n m\u1EB7t thanh t\xFA, \u0111\xF4i m\u1EAFt s\xE1ng r\u1EF1c to\xE1t l\xEAn s\u1EF1 th\xF4ng tu\u1EC7 v\xE0 l\xF2ng qu\u1EA3 c\u1EA3m phi th\u01B0\u1EDDng.
- Phong th\xE1i l\u1ECBch thi\u1EC7p, \u0111i\u1EC1m t\u0129nh, khi\xEAm nh\u01B0\u1EDDng nh\u01B0ng \u1EA9n ch\u1EE9a m\u1ED9t \xFD ch\xED th\xE9p v\xE0 kh\xE1t v\u1ECDng t\u1EF1 do ch\xE1y b\u1ECFng cho nh\xE2n d\xE2n b\u1ECB \xE1p b\u1EE9c \u1EDF x\u1EE9 \u0110\xF4ng D\u01B0\u01A1ng v\xE0 kh\u1EAFp c\xE1c thu\u1ED9c \u0111\u1ECBa.
- S\u1EF1 k\u1EBFt h\u1EE3p nhu\u1EA7n nhuy\u1EC5n gi\u1EEFa chi\u1EC1u s\xE2u v\u0103n h\xF3a truy\u1EC1n th\u1ED1ng ph\u01B0\u01A1ng \u0110\xF4ng v\u1EDBi nh\u1EEFng gi\xE1 tr\u1ECB d\xE2n ch\u1EE7, t\u1EF1 do ti\u1EBFn b\u1ED9 c\u1EE7a v\u0103n h\xF3a ph\u01B0\u01A1ng T\xE2y.

4. GI\xC1 TR\u1ECA GI\xC1O D\u1EE4C L\xDD T\u01AF\u1EDENG CHO H\u1ECCC SINH THCS:
- T\u1EF1 h\xE0o v\u1EC1 nh\xE2n c\xE1ch v\xE0 t\u1EA7m v\xF3c v\u0103n h\xF3a to\xE0n c\u1EA7u c\u1EE7a B\xE1c H\u1ED3 ngay t\u1EEB nh\u1EEFng n\u0103m th\xE1ng Ng\u01B0\u1EDDi c\xF2n l\xE0 ng\u01B0\u1EDDi thanh ni\xEAn tr\u1EBB tu\u1ED5i b\xF4n ba t\xECm \u0111\u01B0\u1EDDng c\u1EE9u n\u01B0\u1EDBc.
- H\u1ECDc t\u1EADp \u1EDF B\xE1c phong th\xE1i giao ti\u1EBFp v\u0103n minh, h\xF2a nh\xE3, khi\xEAm t\u1ED1n, bi\u1EBFt l\u1EAFng nghe v\xE0 t\xF4n tr\u1ECDng ng\u01B0\u1EDDi kh\xE1c.
- Nu\xF4i d\u01B0\u1EE1ng tinh th\u1EA7n c\xF4ng d\xE2n to\xE0n c\u1EA7u: M\u1EDF r\u1ED9ng t\u1EA7m nh\xECn tri th\u1EE9c ra th\u1EBF gi\u1EDBi b\xEAn ngo\xE0i nh\u01B0ng lu\xF4n gi\u1EEF tr\u1ECDn b\u1EA3n s\u1EAFc v\u0103n h\xF3a v\xE0 l\xF2ng y\xEAu n\u01B0\u1EDBc n\u1ED3ng n\xE0n c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      bookId: 475,
      pdfUrl: "https://hochiminh.vn/upload/3000001/20251024/416d7d46d9cd711eee69ce36ec5dc253M%E1%BB%99t-gi%E1%BB%9D-v%E1%BB%9Bi-%C4%91%E1%BB%93ng-ch%C3%AD-H%E1%BB%93-ch%C3%AD-Minh.pdf",
      publisher: "NXB Ch\xEDnh tr\u1ECB qu\u1ED1c gia S\u1EF1 th\u1EADt & hochiminh.vn"
    }
  },
  {
    id: "DOC-HCM-045",
    title: 'K\xFD s\u1EF1 l\u1ECBch s\u1EED "Gi\u1EEF y\xEAn gi\u1EA5c ng\u1EE7 c\u1EE7a Ng\u01B0\u1EDDi" \u2013 K\u1EF3 t\xEDch gi\u1EEF g\xECn thi h\xE0i B\xE1c H\u1ED3 v\xE0 c\xF4ng tr\xECnh L\u0103ng Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh',
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\xE0 t\xE1c ph\u1EA9m v\u0103n h\xF3a ngh\u1EC7 thu\u1EADt",
    authorOrSource: "NXB Qu\xE2n \u0111\u1ED9i Nh\xE2n d\xE2n, NXB Tr\u1EBB & T\u1EE7 s\xE1ch \u0111i\u1EC7n t\u1EED hochiminh.vn",
    dateOrEra: "1969 - 1975 & Hi\u1EC7n nay",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["L\u0103ng Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh", "Gi\u1EEF y\xEAn gi\u1EA5c ng\u1EE7 c\u1EE7a Ng\u01B0\u1EDDi", "B\u1ED9 T\u01B0 l\u1EC7nh B\u1EA3o v\u1EC7 L\u0103ng", "Khu K84 \u0110\xE1 Ch\xF4ng", "Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh", "\u0110\u1ECBa ch\u1EC9 \u0111\u1ECF thi\xEAng li\xEAng"],
    sourceUrl: "https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/giu-yen-giac-ngu-cua-nguoi-483",
    content: `1. B\u1ED0I C\u1EA2NH L\u1ECACH S\u1EEC TH\xC1NG 9 N\u0102M 1969 V\xC0 QUY\u1EBET \u0110\u1ECANH L\u1ECACH S\u1EEC C\u1EE6A \u0110\u1EA2NG:
Ng\xE0y 2 th\xE1ng 9 n\u0103m 1969, Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh - v\u1ECB l\xE3nh t\u1EE5 k\xEDnh y\xEAu c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam qua \u0111\u1EDDi.
\u0110\xE1p \u1EE9ng nguy\u1EC7n v\u1ECDng thi\u1EBFt tha, thi\xEAng li\xEAng c\u1EE7a to\xE0n \u0110\u1EA3ng, to\xE0n qu\xE2n, to\xE0n d\xE2n c\u1EA3 n\u01B0\u1EDBc, \u0111\u1EB7c bi\u1EC7t l\xE0 \u0111\u1ED3ng b\xE0o chi\u1EBFn s\u0129 mi\u1EC1n Nam ru\u1ED9t th\u1ECBt \u0111ang trong kh\xF3i l\u1EEDa kh\xE1ng chi\u1EBFn kh\xE1t khao ng\xE0y th\u1ED1ng nh\u1EA5t \u0111\u01B0\u1EE3c g\u1EB7p B\xE1c, B\u1ED9 Ch\xEDnh tr\u1ECB v\xE0 Trung \u01B0\u01A1ng \u0110\u1EA3ng \u0111\xE3 quy\u1EBFt \u0111\u1ECBnh:
"Ph\u1EA3i gi\u1EEF g\xECn l\xE2u d\xE0i thi h\xE0i B\xE1c H\u1ED3 v\xE0 x\xE2y d\u1EF1ng L\u0103ng c\u1EE7a Ng\u01B0\u1EDDi t\u1EA1i Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh l\u1ECBch s\u1EED \u0111\u1EC3 nh\xE2n d\xE2n c\u1EA3 n\u01B0\u1EDBc v\xE0 b\u1EA7u b\u1EA1n qu\u1ED1c t\u1EBF m\xE3i m\xE3i \u0111\u01B0\u1EE3c \u0111\u1EBFn vi\u1EBFng Ng\u01B0\u1EDDi".

2. K\u1EF2 T\xCDCH GI\u1EEE G\xCCN B\u1EA2O V\u1EC6 TUY\u1EC6T \u0110\u1ED0I AN TO\xC0N THI H\xC0I B\xC1C TRONG CHI\u1EBEN TRANH:
- \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9 y t\u1EBF, chi\u1EBFn s\u0129 c\xF4ng binh \u0110o\xE0n 69 (ti\u1EC1n th\xE2n c\u1EE7a B\u1ED9 T\u01B0 l\u1EC7nh B\u1EA3o v\u1EC7 L\u0103ng) ph\u1ED1i h\u1EE3p ch\u1EB7t ch\u1EBD v\u1EDBi c\xE1c chuy\xEAn gia y h\u1ECDc h\xE0ng \u0111\u1EA7u c\u1EE7a Li\xEAn X\xF4 th\u1EF1c hi\u1EC7n nhi\u1EC7m v\u1EE5 b\u1EA3o qu\u1EA3n y t\u1EBF thi h\xE0i B\xE1c.
- Trong \u0111i\u1EC1u ki\u1EC7n m\xE1y bay M\u1EF9 leo thang n\xE9m bom ph\xE1 ho\u1EA1i mi\u1EC1n B\u1EAFc d\u1EEF d\u1ED9i, thi h\xE0i B\xE1c \u0111\xE3 \u0111\u01B0\u1EE3c di chuy\u1EC3n tuy\u1EC7t m\u1EADt, v\u01B0\u1EE3t qua hi\u1EC3m nguy qua 6 l\u1EA7n s\u01A1 t\xE1n gi\u1EEFa c\xE1c c\u0103n c\u1EE9:
  + C\xF4ng tr\xECnh 75A (B\u1EC7nh vi\u1EC7n Trung \u01B0\u01A1ng Qu\xE2n \u0111\u1ED9i 108).
  + C\u0103n c\u1EE9 K84 (Khu c\u0103n c\u1EE9 \u0110\xE1 Ch\xF4ng, Ba V\xEC, H\xE0 N\u1ED9i).
  + C\u0103n c\u1EE9 H21 v\xE0 c\xE1c hang \u0111\xE1 an to\xE0n ven r\u1EEBng n\xFAi.
M\u1ED7i chuy\u1EBFn h\xE0nh qu\xE2n di chuy\u1EC3n thi h\xE0i B\xE1c \u0111\u1EC1u l\xE0 m\u1ED9t chi\u1EBFn c\xF4ng th\u1EA7m l\u1EB7ng, k\u1EF3 c\xF4ng v\xE0 chan ch\u1EE9a n\u01B0\u1EDBc m\u1EAFt c\u1EE7a c\xE1n b\u1ED9, chi\u1EBFn s\u0129.

3. X\xC2Y D\u1EF0NG C\xD4NG TR\xCCNH L\u0102NG CH\u1EE6 T\u1ECACH H\u1ED2 CH\xCD MINH:
- Kh\u1EDFi c\xF4ng ng\xE0y 2 th\xE1ng 9 n\u0103m 1973 v\xE0 long tr\u1ECDng kh\xE1nh th\xE0nh ng\xE0y 29 th\xE1ng 8 n\u0103m 1975 t\u1EA1i Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh l\u1ECBch s\u1EED.
- C\xF4ng tr\xECnh l\xE0 bi\u1EC3u t\u01B0\u1EE3ng h\u1ED9i t\u1EE5 tinh hoa v\xE0 t\xECnh c\u1EA3m c\u1EE7a c\u1EA3 non s\xF4ng: \u0110\xE1 hoa c\u01B0\u01A1ng t\u1EEB Thanh H\xF3a, \u0111\xE1 c\u1EA9m th\u1EA1ch Ng\u0169 H\xE0nh S\u01A1n (\u0110\xE0 N\u1EB5ng), g\u1ED7 qu\xFD T\xE2y Nguy\xEAn, c\xE1t t\u1EEB s\xF4ng H\u1ED3ng v\xE0 ph\xF9 sa \u0111\u1EA5t M\u0169i C\xE0 Mau... c\xF9ng h\xE0ng v\u1EA1n c\xE2y xanh qu\xFD gi\xE1 t\u1EEB kh\u1EAFp c\xE1c mi\u1EC1n qu\xEA \u0111\u01B0\u1EE3c g\u1EEDi v\u1EC1 h\u1ED9i t\u1EE5 b\xEAn L\u0103ng B\xE1c.

4. GI\xC1 TR\u1ECA GI\xC1O D\u1EE4C TRUY\u1EC0N TH\u1ED0NG "U\u1ED0NG N\u01AF\u1EDAC NH\u1EDA NGU\u1ED2N":
- L\u0103ng B\xE1c v\xE0 Qu\u1EA3ng tr\u01B0\u1EDDng Ba \u0110\xECnh l\xE0 \u0110\u1ECBa ch\u1EC9 \u0111\u1ECF thi\xEAng li\xEAng b\u1EADc nh\u1EA5t c\u1EE7a d\xE2n t\u1ED9c Vi\u1EC7t Nam.
- Gi\xE1o d\u1EE5c h\u1ECDc sinh l\xF2ng bi\u1EBFt \u01A1n s\xE2u s\u1EAFc \u0111\u1ED1i v\u1EDBi c\xF4ng lao tr\u1EDDi bi\u1EC3n c\u1EE7a B\xE1c H\u1ED3 v\xE0 s\u1EF1 hy sinh to l\u1EDBn c\u1EE7a c\xE1c th\u1EBF h\u1EC7 cha anh \u0111i tr\u01B0\u1EDBc.
- Kh\u01A1i d\u1EADy \xFD th\u1EE9c ph\u1EA5n \u0111\u1EA5u r\xE8n luy\u1EC7n, s\u1ED1ng x\u1EE9ng \u0111\xE1ng v\u1EDBi ni\u1EC1m tin y\xEAu m\xE0 B\xE1c \u0111\xE3 trao tr\u1ECDn cho th\u1EBF h\u1EC7 t\u01B0\u01A1ng lai.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      bookId: 483,
      pdfUrl: "https://hochiminh.vn/upload/3000001/20251024/a3e23ccabaa80672d9956924ce57dd13Giu-yen-giac-ngu-cua-nguoi.pdf",
      publisher: "NXB Qu\xE2n \u0111\u1ED9i Nh\xE2n d\xE2n & hochiminh.vn"
    }
  },
  {
    id: "DOC-HCM-046",
    title: 'T\xE1c ph\u1EA9m "B\u1EA3n \xE1n ch\u1EBF \u0111\u1ED9 th\u1EF1c d\xE2n Ph\xE1p" (1925) \u2013 \u0110\xF2n s\u1EA5m s\xE9t ch\xEDnh lu\u1EADn v\u1EA1ch tr\u1EA7n t\u1ED9i \xE1c c\u1EE7a ch\u1EE7 ngh\u0129a th\u1EF1c d\xE2n',
    category: "cultural-heritage",
    categoryLabel: "Di s\u1EA3n v\xE0 t\xE1c ph\u1EA9m v\u0103n h\xF3a ngh\u1EC7 thu\u1EADt",
    authorOrSource: "Nguy\u1EC5n \xC1i Qu\u1ED1c - Th\u01B0 qu\xE1n Lao \u0111\u1ED9ng Paris (1925), NXB S\u1EF1 th\u1EADt t\xE1i b\u1EA3n & hochiminh.vn",
    dateOrEra: "1925",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["B\u1EA3n \xE1n ch\u1EBF \u0111\u1ED9 th\u1EF1c d\xE2n Ph\xE1p", "Nguy\u1EC5n \xC1i Qu\u1ED1c", "Paris 1925", "Le Proc\xE8s de la colonisation fran\xE7aise", "Thu\u1EBF m\xE1u", "G\u1EEDi thanh ni\xEAn An Nam"],
    sourceUrl: "https://hochiminh.vn/tu-sach-dien-tu-ho-chi-minh?categoryId=3000402",
    content: `1. B\u1ED0I C\u1EA2NH RA \u0110\u1EDCI C\u1EE6A T\xC1C PH\u1EA8M CH\xCDNH LU\u1EACN N\u0102M 1925:
N\u0103m 1925, t\xE1c ph\u1EA9m "B\u1EA3n \xE1n ch\u1EBF \u0111\u1ED9 th\u1EF1c d\xE2n Ph\xE1p" (nguy\xEAn b\u1EA3n ti\u1EBFng Ph\xE1p: "Le Proc\xE8s de la colonisation fran\xE7aise") c\u1EE7a \u0111\u1ED3ng ch\xED Nguy\u1EC5n \xC1i Qu\u1ED1c \u0111\u01B0\u1EE3c xu\u1EA5t b\u1EA3n l\u1EA7n \u0111\u1EA7u ti\xEAn t\u1EA1i Paris b\u1EDFi Th\u01B0 qu\xE1n Lao \u0111\u1ED9ng (Librairie du Travail).
T\xE1c ph\u1EA9m g\u1ED3m 12 ch\u01B0\u01A1ng v\xE0 m\u1ED9t ph\u1EA7n Ph\u1EE5 l\u1EE5c n\u1ED5i ti\u1EBFng: "G\u1EEDi thanh ni\xEAn An Nam".
\u0110\xE2y l\xE0 b\u1EA3n c\xE1o tr\u1EA1ng \u0111anh th\xE9p, mang t\xEDnh khoa h\u1ECDc v\xE0 th\u1EF1c ti\u1EC5n s\xE2u s\u1EAFc, v\u1EA1ch tr\u1EA7n to\xE0n b\u1ED9 b\u1EA3n ch\u1EA5t d\xE3 man, t\xE0n b\u1EA1o, phi nh\xE2n \u0111\u1EA1o c\u1EE7a ch\u1EBF \u0111\u1ED9 th\u1ED1ng tr\u1ECB th\u1EF1c d\xE2n Ph\xE1p t\u1EA1i \u0110\xF4ng D\u01B0\u01A1ng v\xE0 c\xE1c thu\u1ED9c \u0111\u1ECBa kh\xE1c tr\xEAn th\u1EBF gi\u1EDBi.

2. C\xC1C N\u1ED8I DUNG CH\xCDNH Y\u1EBEU V\xC0 \u0110\xD2N \u0110\xC1NH CH\xCDNH LU\u1EACN S\u1EAEC B\xC9N:
- Ch\u01B0\u01A1ng 1: "Thu\u1EBF m\xE1u" - V\u1EA1ch tr\u1EA7n s\u1EF1 d\u1ED1i tr\xE1 c\u1EE7a chi\xEAu b\xE0i "m\u1EB9 m\u1EABu qu\u1ED1c b\u1EA3o h\u1ED9", \u0111\u1EA9y h\xE0ng v\u1EA1n ng\u01B0\u1EDDi d\xE2n b\u1EA3n x\u1EE9 v\xF4 t\u1ED9i sang ch\xE2u \xC2u l\xE0m bia \u0111\u1EE1 \u0111\u1EA1n cho th\u1EF1c d\xE2n Ph\xE1p trong Chi\u1EBFn tranh th\u1EBF gi\u1EDBi th\u1EE9 nh\u1EA5t (1914 - 1918).
- C\xE1c ch\u01B0\u01A1ng ti\u1EBFp theo v\u1EA1ch tr\u1EA7n t\u1ED9i \xE1c: \xC1p \u0111\u1EB7t s\u01B0u cao thu\u1EBF n\u1EB7ng; \u0111\u1EA7u \u0111\u1ED9c ng\u01B0\u1EDDi d\xE2n b\u1EB1ng vi\u1EC7c \u0111\u1ED9c quy\u1EC1n bu\xF4n b\xE1n thu\u1ED1c phi\u1EC7n v\xE0 r\u01B0\u1EE3u c\u1ED3n; thi h\xE0nh ch\xEDnh s\xE1ch ngu d\xE2n \u0111\u1EC3 d\u1EC5 b\u1EC1 \xE1p b\u1EE9c; \u0111\xE0n \xE1p d\xE3 man c\xE1c cu\u1ED9c n\u1ED5i d\u1EADy y\xEAu n\u01B0\u1EDBc.
- Ph\u1EA7n Ph\u1EE5 l\u1EE5c "G\u1EEDi thanh ni\xEAn An Nam": L\u1EDDi hi\u1EC7u tri\u1EC7u lay \u0111\u1ED9ng h\xE0ng tri\u1EC7u tr\xE1i tim tu\u1ED5i tr\u1EBB:
"H\u1EE1i thanh ni\xEAn An Nam!... C\xE1c b\u1EA1n h\xE3y nh\xECn th\u1EB3ng v\xE0o s\u1EF1 th\u1EADt... H\xE3y t\u1EF1 gi\u1EA3i ph\xF3ng m\xECnh b\u1EB1ng con \u0111\u01B0\u1EDDng c\xE1ch m\u1EA1ng!".

3. GI\xC1 TR\u1ECA L\u1ECACH S\u1EEC V\xC0 T\u01AF T\u01AF\u1EDENG C\u1EE6A T\xC1C PH\u1EA8M:
- L\xE0 v\u0169 kh\xED l\xFD lu\u1EADn s\u1EAFc b\xE9n chu\u1EA9n b\u1ECB v\u1EC1 m\u1EB7t ch\xEDnh tr\u1ECB v\xE0 t\u01B0 t\u01B0\u1EDFng cho s\u1EF1 ra \u0111\u1EDDi c\u1EE7a \u0110\u1EA3ng C\u1ED9ng s\u1EA3n Vi\u1EC7t Nam v\xE0o m\xF9a xu\xE2n n\u0103m 1930.
- Kh\u1EB3ng \u0111\u1ECBnh m\u1ED1i quan h\u1EC7 kh\u0103ng kh\xEDt gi\u1EEFa c\xE1ch m\u1EA1ng gi\u1EA3i ph\xF3ng d\xE2n t\u1ED9c \u1EDF thu\u1ED9c \u0111\u1ECBa v\u1EDBi c\xE1ch m\u1EA1ng v\xF4 s\u1EA3n \u1EDF ch\xEDnh qu\u1ED1c; nh\u1EA5n m\u1EA1nh c\xF4ng cu\u1ED9c gi\u1EA3i ph\xF3ng d\xE2n t\u1ED9c ph\u1EA3i do ch\xEDnh nh\xE2n d\xE2n thu\u1ED9c \u0111\u1ECBa t\u1EF1 \u0111\u1EE9ng l\xEAn gi\xE0nh l\u1EA5y.

4. B\xC0I H\u1ECCC GI\xC1O D\u1EE4C TRUY\u1EC0N TH\u1ED0NG Y\xCAU N\u01AF\u1EDAC CHO H\u1ECCC SINH THCS:
- Gi\xFAp h\u1ECDc sinh th\u1EA5u hi\u1EC3u s\xE2u s\u1EAFc nh\u1EEFng n\u1ED7i \u0111au th\u01B0\u01A1ng, m\u1EA5t m\xE1t v\xE0 \xE1p b\u1EE9c b\xF3c l\u1ED9t c\xF9ng c\u1EF1c m\xE0 d\xE2n t\u1ED9c ta \u0111\xE3 ph\u1EA3i g\xE1nh ch\u1ECBu d\u01B0\u1EDBi \xE1ch \u0111\xF4 h\u1ED9 c\u1EE7a ngo\u1EA1i bang.
- B\u1ED3i d\u01B0\u1EE1ng l\xF2ng c\u0103m th\xF9 \xE1p b\u1EE9c b\u1EA5t c\xF4ng, n\xE2ng cao \xFD th\u1EE9c tr\xE2n tr\u1ECDng \u0111\u1ED9c l\u1EADp, t\u1EF1 do v\xE0 h\xF2a b\xECnh h\xF4m nay.
- H\u1ECDc t\u1EADp ngh\u1EC7 thu\u1EADt h\xE0nh v\u0103n ch\xEDnh lu\u1EADn kh\xFAc chi\u1EBFt, gi\xE0u d\u1EABn ch\u1EE9ng th\xE9p v\xE0 ng\u1ECDn l\u1EEDa nhi\u1EC7t huy\u1EBFt v\xEC \u0111\u1ED9c l\u1EADp d\xE2n t\u1ED9c c\u1EE7a Nguy\u1EC5n \xC1i Qu\u1ED1c.`,
    metadata: {
      batch: "BATCH_D_HOCHIMINH_VN_EXPANSION",
      publicationYear: 1925,
      originalLanguage: "Ti\u1EBFng Ph\xE1p (Le Proc\xE8s de la colonisation fran\xE7aise)",
      publisher: "Th\u01B0 qu\xE1n Lao \u0111\u1ED9ng Paris (1925) & hochiminh.vn"
    }
  },
  // Security Canary test document: PENDING_REVIEW & isAllowedForRag: false
  // Must NEVER be returned by retrieval engine!
  {
    id: "DOC-HCM-009",
    title: "T\xE0i li\u1EC7u th\u1EED nghi\u1EC7m n\u1ED9i b\u1ED9 - Ch\u01B0a qua th\u1EA9m \u0111\u1ECBnh c\u1EE7a H\u1ED9i \u0111\u1ED3ng chuy\xEAn m\xF4n",
    category: "ideology-ethics",
    categoryLabel: "D\u1EF1 th\u1EA3o th\u1EA9m \u0111\u1ECBnh",
    authorOrSource: "B\u1EA3n th\u1EA3o n\u1ED9i b\u1ED9 ph\xF2ng k\u1EF9 thu\u1EADt",
    dateOrEra: "2026",
    status: "PENDING_REVIEW",
    isAllowedForRag: false,
    topics: ["N\u1ED9i b\u1ED9", "Ch\u01B0a duy\u1EC7t", "B\u1EA3o m\u1EADt"],
    content: `\u0110\xE2y l\xE0 t\xE0i li\u1EC7u gi\u1EA3 \u0111\u1ECBnh n\u1ED9i b\u1ED9 d\xF9ng \u0111\u1EC3 ki\u1EC3m tra c\u1ED5ng an to\xE0n truy xu\u1EA5t.
N\u1EBFu h\u1EC7 th\u1ED1ng RAG truy xu\u1EA5t ho\u1EB7c d\u1EABn ch\u1EE9ng t\xE0i li\u1EC7u n\xE0y khi ng\u01B0\u1EDDi d\xF9ng h\u1ECFi, \u0111i\u1EC1u \u0111\xF3 ch\u1EE9ng minh b\u1ED9 l\u1ECDc b\u1EA3o m\u1EADt ki\u1EC3m so\xE1t ngu\u1ED3n (Security Gate) b\u1ECB vi ph\u1EA1m!`,
    metadata: {
      isSecurityCanary: true
    }
  }
];

// src/rag/types/ragTypes.ts
var HCM_STANDARD_CATEGORIES = [
  {
    id: "bio-career",
    name: "Ch\u1EE7 t\u1ECBch H\u1ED3 Ch\xED Minh \u2013 Ti\u1EC3u s\u1EED v\xE0 s\u1EF1 nghi\u1EC7p",
    description: "C\xE1c m\u1ED1c l\u1ECBch s\u1EED, s\u1EF1 ki\u1EC7n c\u1EE9u qu\u1ED1c v\xE0 h\xE0nh tr\xECnh l\xE3nh \u0111\u1EA1o c\u1EE7a B\xE1c",
    icon: "Compass",
    badgeClass: "bg-red-100 text-red-900 border-red-200"
  },
  {
    id: "ideology-ethics",
    name: "T\u01B0 t\u01B0\u1EDFng, \u0111\u1EA1o \u0111\u1EE9c, phong c\xE1ch H\u1ED3 Ch\xED Minh",
    description: "C\u1EA7n ki\u1EC7m li\xEAm ch\xEDnh, ch\xED c\xF4ng v\xF4 t\u01B0, l\u1ED1i s\u1ED1ng gi\u1EA3n d\u1ECB v\xE0 nh\xE2n v\u0103n",
    icon: "BookOpen",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200"
  },
  {
    id: "teachings-children",
    name: "Nh\u1EEFng l\u1EDDi d\u1EA1y c\u1EE7a B\xE1c \u0111\u1ED1i v\u1EDBi thi\u1EBFu nhi",
    description: "5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y, th\u01B0 g\u1EEDi h\u1ECDc sinh, l\u1EDDi c\u0103n d\u1EB7n thi\u1EBFu ni\xEAn nhi \u0111\u1ED3ng",
    icon: "GraduationCap",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200"
  },
  {
    id: "cultural-heritage",
    name: "Di s\u1EA3n v\u0103n h\xF3a H\u1ED3 Ch\xED Minh",
    description: "T\xE1c ph\u1EA9m v\u0103n th\u01A1, Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp, Di ch\xFAc, Nh\u1EADt k\xFD trong t\xF9",
    icon: "Sparkles",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-200"
  },
  {
    id: "hcm-cultural-space",
    name: "Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh TP.HCM",
    description: "X\xE2y d\u1EF1ng kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh tr\xEAn \u0111\u1ECBa b\xE0n Th\xE0nh ph\u1ED1",
    icon: "Landmark",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-200"
  },
  {
    id: "hcmc-history",
    name: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    description: "Th\xE0nh ph\u1ED1 mang t\xEAn B\xE1c, truy\u1EC1n th\u1ED1ng c\xE1ch m\u1EA1ng Th\u1EDBi An - Qu\u1EADn 12",
    icon: "History",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-200"
  },
  {
    id: "school-education",
    name: "Ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c v\xE0 h\u1ECDc t\u1EADp t\u1EA1i nh\xE0 tr\u01B0\u1EDDng",
    description: "Chuy\xEAn \u0111\u1EC1 gi\xE1o d\u1EE5c, h\u1ED9i thi, phong tr\xE0o h\u1ECDc t\u1EADp tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    icon: "Award",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-200"
  },
  {
    id: "official-dispatches",
    name: "T\xE0i li\u1EC7u ch\xEDnh th\u1EE9c c\u1EE7a c\u01A1 quan qu\u1EA3n l\xFD",
    description: "Ngh\u1ECB quy\u1EBFt, h\u01B0\u1EDBng d\u1EABn c\u1EE7a Th\xE0nh \u1EE7y, S\u1EDF GD&\u0110T v\xE0 Chi b\u1ED9 nh\xE0 tr\u01B0\u1EDDng",
    icon: "FileCheck",
    badgeClass: "bg-slate-100 text-slate-900 border-slate-200"
  }
];

// src/rag/knowledge/documentRegistry.ts
async function computeSha256(text) {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  return computeSha256Sync(text);
}
function computeSha256Sync(text) {
  let h1 = 3735928559, h2 = 1103547991;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 13, 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const p2 = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${p1}${p2}${p1}${p2}${p1}${p2}${p1}${p2}`.toUpperCase().substring(0, 64);
}
function seedInitialDocumentsSync() {
  const initialDocs = [];
  for (const doc of SAMPLE_HCM_DOCUMENTS) {
    const checksum = computeSha256Sync(doc.content);
    let docType = "article";
    if (doc.id === "DOC-HCM-001" || doc.id === "DOC-HCM-008") docType = "speech";
    else if (doc.id === "DOC-HCM-003") docType = "letter";
    else if (doc.id === "DOC-HCM-002" || doc.id === "DOC-HCM-006" || doc.id === "DOC-HCM-007") docType = "book";
    else if (doc.id === "DOC-HCM-004") docType = "instruction";
    else if (doc.id === "DOC-HCM-013" || doc.id === "DOC-HCM-015") docType = "official_dispatch";
    else if (doc.id === "DOC-HCM-011" || doc.id === "DOC-HCM-012") docType = "archive";
    initialDocs.push({
      documentId: doc.id,
      title: doc.title,
      description: doc.metadata?.historicalSignificance || doc.title,
      documentType: docType,
      category: doc.category,
      author: doc.authorOrSource,
      publisher: doc.metadata?.volume || "H\u1ED9i \u0111\u1ED3ng Khoa h\u1ECDc B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh",
      sourceUrl: doc.sourceUrl || "",
      originalFileName: `${doc.id.toLowerCase()}.md`,
      mimeType: "text/markdown",
      checksum,
      fileSize: doc.content.length,
      createdAt: "2026-11-14T00:00:00.000Z",
      updatedAt: "2026-11-14T00:00:00.000Z",
      approvalStatus: doc.status,
      isAllowedForRag: doc.isAllowedForRag,
      version: 1,
      approvedBy: doc.status === "APPROVED" ? "H\u1ED9i \u0111\u1ED3ng Th\u1EA9m \u0111\u1ECBnh THCS Nguy\u1EC5n Trung Tr\u1EF1c" : void 0,
      approvedAt: doc.status === "APPROVED" ? "2026-11-14T00:00:00.000Z" : void 0,
      topics: doc.topics,
      content: doc.content,
      chunksCount: 0,
      metadata: doc.metadata
    });
  }
  return initialDocs;
}
async function seedInitialDocuments() {
  const initialDocs = [];
  for (const doc of SAMPLE_HCM_DOCUMENTS) {
    const checksum = await computeSha256(doc.content);
    let docType = "article";
    if (doc.id === "DOC-HCM-001" || doc.id === "DOC-HCM-008") docType = "speech";
    else if (doc.id === "DOC-HCM-003") docType = "letter";
    else if (doc.id === "DOC-HCM-002" || doc.id === "DOC-HCM-006" || doc.id === "DOC-HCM-007") docType = "book";
    else if (doc.id === "DOC-HCM-004") docType = "instruction";
    else if (doc.id === "DOC-HCM-013" || doc.id === "DOC-HCM-015") docType = "official_dispatch";
    else if (doc.id === "DOC-HCM-011" || doc.id === "DOC-HCM-012") docType = "archive";
    initialDocs.push({
      documentId: doc.id,
      title: doc.title,
      description: doc.metadata?.historicalSignificance || doc.title,
      documentType: docType,
      category: doc.category,
      author: doc.authorOrSource,
      publisher: doc.metadata?.volume || "H\u1ED9i \u0111\u1ED3ng Khoa h\u1ECDc B\u1EA3o t\xE0ng H\u1ED3 Ch\xED Minh",
      sourceUrl: doc.sourceUrl || "",
      originalFileName: `${doc.id.toLowerCase()}.md`,
      mimeType: "text/markdown",
      checksum,
      fileSize: doc.content.length,
      createdAt: "2026-11-14T00:00:00.000Z",
      updatedAt: "2026-11-14T00:00:00.000Z",
      approvalStatus: doc.status,
      isAllowedForRag: doc.isAllowedForRag,
      version: 1,
      approvedBy: doc.status === "APPROVED" ? "H\u1ED9i \u0111\u1ED3ng Th\u1EA9m \u0111\u1ECBnh THCS Nguy\u1EC5n Trung Tr\u1EF1c" : void 0,
      approvedAt: doc.status === "APPROVED" ? "2026-11-14T00:00:00.000Z" : void 0,
      topics: doc.topics,
      content: doc.content,
      chunksCount: 0,
      metadata: doc.metadata
    });
  }
  return initialDocs;
}
var DocumentRegistry = class {
  documents = /* @__PURE__ */ new Map();
  checksumIndex = /* @__PURE__ */ new Map();
  // checksum -> documentId
  categories = [...HCM_STANDARD_CATEGORIES];
  isInitialized = false;
  constructor() {
    this.seedSync();
  }
  /**
   * Synchronously seed initial corpus so that documents are immediately available upon instantiation
   */
  seedSync() {
    if (this.documents.size === 0) {
      const initialDocs = seedInitialDocumentsSync();
      for (const doc of initialDocs) {
        this.documents.set(doc.documentId, doc);
        this.checksumIndex.set(doc.checksum, doc.documentId);
      }
    }
    this.applyLocalStorageOverrides();
  }
  /**
   * Load any document approval overrides from browser localStorage
   */
  applyLocalStorageOverrides() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const raw = window.localStorage.getItem("rag_doc_overrides");
        if (raw) {
          const overrides = JSON.parse(raw);
          for (const [id, ov] of Object.entries(overrides)) {
            if (ov?.isDeleted) {
              const doc = this.documents.get(id);
              if (doc && doc.checksum) {
                this.checksumIndex.delete(doc.checksum);
              }
              this.documents.delete(id);
            } else {
              const doc = this.documents.get(id);
              if (doc && ov && typeof ov === "object") {
                Object.assign(doc, ov);
              }
            }
          }
        }
      } catch (e) {
      }
    }
  }
  /**
   * Save document approval override to browser localStorage
   */
  saveLocalStorageOverride(docId, patch) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const raw = window.localStorage.getItem("rag_doc_overrides") || "{}";
        const overrides = JSON.parse(raw);
        overrides[docId] = { ...overrides[docId] || {}, ...patch };
        window.localStorage.setItem("rag_doc_overrides", JSON.stringify(overrides));
      } catch (e) {
      }
    }
  }
  /**
   * Initialize registry with seeds (Async with SubtleCrypto if available)
   */
  async initialize() {
    if (this.isInitialized) return;
    this.seedSync();
    const seeds = await seedInitialDocuments();
    for (const doc of seeds) {
      this.documents.set(doc.documentId, doc);
      this.checksumIndex.set(doc.checksum, doc.documentId);
    }
    this.applyLocalStorageOverrides();
    this.isInitialized = true;
  }
  /**
   * Get all registered documents
   */
  getAllDocuments(statusFilter) {
    if (this.documents.size === 0) {
      this.seedSync();
    }
    const all = Array.from(this.documents.values());
    if (statusFilter) {
      return all.filter((d) => d.approvalStatus === statusFilter);
    }
    return all;
  }
  /**
   * Get approved documents allowed for RAG retrieval
   */
  getApprovedRagDocuments() {
    if (this.documents.size === 0) {
      this.seedSync();
    }
    return Array.from(this.documents.values()).filter(
      (d) => d.approvalStatus === "APPROVED" && d.isAllowedForRag === true
    );
  }
  /**
   * Convert to legacy KnowledgeDocument format for retrieval engine compatibility
   */
  getApprovedAsKnowledgeDocuments() {
    return this.getApprovedRagDocuments().map((d) => ({
      id: d.documentId,
      title: d.title,
      category: d.category,
      categoryLabel: d.category,
      authorOrSource: d.author,
      dateOrEra: d.metadata?.dateOrEra || d.createdAt.split("T")[0],
      content: d.content,
      sourceUrl: d.sourceUrl,
      status: d.approvalStatus,
      isAllowedForRag: d.isAllowedForRag,
      topics: d.topics,
      metadata: d.metadata
    }));
  }
  /**
   * Find document by ID
   */
  getDocumentById(docId) {
    if (this.documents.size === 0) {
      this.seedSync();
    }
    return this.documents.get(docId);
  }
  /**
   * Register a new ingested document (starts as PENDING_REVIEW)
   */
  async registerDocument(doc) {
    await this.initialize();
    const checksum = await computeSha256(doc.content);
    if (this.checksumIndex.has(checksum)) {
      const existingDocId = this.checksumIndex.get(checksum);
      return {
        document: this.documents.get(existingDocId),
        isDuplicate: true,
        existingDocId
      };
    }
    const documentId = doc.customId || `DOC-REAL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e3).toString().padStart(3, "0")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newDoc = {
      ...doc,
      documentId,
      checksum,
      createdAt: now,
      updatedAt: now,
      approvalStatus: "PENDING_REVIEW",
      // Strict governance: NEVER auto-approved
      isAllowedForRag: false,
      // Strict governance: CANNOT be used in RAG until approved
      version: 1,
      uploadedBy: doc.uploadedBy,
      uploadedByName: doc.uploadedByName
    };
    this.documents.set(documentId, newDoc);
    this.checksumIndex.set(checksum, documentId);
    return {
      document: newDoc,
      isDuplicate: false
    };
  }
  /**
   * Four-Eyes Governance: Approve document for RAG usage
   */
  approveDocument(docId, approverName, approverId) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);
    if (doc.uploadedBy && approverId && doc.uploadedBy === approverId) {
      throw new Error(`Vi ph\u1EA1m nguy\xEAn t\u1EAFc Ph\xEA duy\u1EC7t 4 m\u1EAFt: Ng\u01B0\u1EDDi t\u1EA3i t\xE0i li\u1EC7u (${doc.uploadedByName || doc.uploadedBy}) kh\xF4ng \u0111\u01B0\u1EE3c t\u1EF1 ph\xEA duy\u1EC7t t\xE0i li\u1EC7u do ch\xEDnh m\xECnh t\u1EA3i l\xEAn!`);
    }
    doc.approvalStatus = "APPROVED";
    doc.isAllowedForRag = true;
    doc.approvedBy = approverName;
    doc.approverId = approverId;
    doc.approvedAt = (/* @__PURE__ */ new Date()).toISOString();
    doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.documents.set(docId, doc);
    this.saveLocalStorageOverride(docId, {
      approvalStatus: "APPROVED",
      isAllowedForRag: true,
      approvedBy: approverName,
      approverId,
      approvedAt: doc.approvedAt,
      updatedAt: doc.updatedAt
    });
    return doc;
  }
  /**
   * Four-Eyes Governance: Reject document
   */
  rejectDocument(docId, rejecterName, reason, rejecterId) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);
    doc.approvalStatus = "REJECTED";
    doc.isAllowedForRag = false;
    doc.approvedBy = rejecterName;
    doc.approverId = rejecterId;
    doc.rejectionReason = `B\u1ECB t\u1EEB ch\u1ED1i b\u1EDFi ${rejecterName}: ${reason}`;
    doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.documents.set(docId, doc);
    this.saveLocalStorageOverride(docId, {
      approvalStatus: "REJECTED",
      isAllowedForRag: false,
      approvedBy: rejecterName,
      approverId: rejecterId,
      rejectionReason: doc.rejectionReason,
      updatedAt: doc.updatedAt
    });
    return doc;
  }
  /**
   * Revoke or Archive document (Immediately removes from RAG index)
   */
  archiveDocument(docId) {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);
    doc.approvalStatus = "ARCHIVED";
    doc.isAllowedForRag = false;
    doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.documents.set(docId, doc);
    this.saveLocalStorageOverride(docId, {
      approvalStatus: "ARCHIVED",
      isAllowedForRag: false,
      updatedAt: doc.updatedAt
    });
    return doc;
  }
  /**
   * Delete document completely from registry and persist deleted status in localStorage
   */
  deleteDocument(docId) {
    const doc = this.documents.get(docId);
    if (!doc) return false;
    if (doc.checksum) {
      this.checksumIndex.delete(doc.checksum);
    }
    this.documents.delete(docId);
    this.saveLocalStorageOverride(docId, { isDeleted: true });
    return true;
  }
  /**
   * Update document chunks count
   */
  updateChunksCount(docId, count) {
    const doc = this.documents.get(docId);
    if (doc) {
      doc.chunksCount = count;
      doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
  }
  /**
   * Categories management
   */
  getCategories() {
    return this.categories;
  }
  addCategory(cat) {
    if (!this.categories.some((c) => c.id === cat.id)) {
      this.categories.push(cat);
    }
  }
};
var documentRegistry = new DocumentRegistry();

// src/rag/ingestion/documentIngestion.ts
var DocumentIngestionService = class {
  processor;
  jobs = /* @__PURE__ */ new Map();
  maxFileSizeBytes = 10 * 1024 * 1024;
  // 10MB limit
  constructor() {
    this.processor = new DocumentProcessor({
      maxChunkSize: 450,
      overlapSize: 60,
      preserveParagraphs: true
    });
  }
  /**
   * Extract plain text from various file formats (TXT, MD, DOCX, PDF)
   */
  extractText(input) {
    if (input.textRaw && typeof input.textRaw === "string") {
      return input.textRaw.trim();
    }
    if (!input.fileBuffer) {
      throw new Error("Kh\xF4ng c\xF3 n\u1ED9i dung file \u0111\u01B0\u1EE3c cung c\u1EA5p.");
    }
    if (typeof input.fileBuffer === "string") {
      return input.fileBuffer.trim();
    }
    const uint8 = input.fileBuffer instanceof Uint8Array ? input.fileBuffer : new Uint8Array(input.fileBuffer);
    const ext = input.fileName.split(".").pop()?.toLowerCase();
    if (ext === "txt" || ext === "md" || input.mimeType.includes("text/")) {
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(uint8).trim();
    }
    if (ext === "docx" || input.mimeType.includes("wordprocessingml")) {
      return this.extractTextFromDocx(uint8);
    }
    if (ext === "pdf" || input.mimeType.includes("pdf")) {
      return this.extractTextFromPdf(uint8);
    }
    try {
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(uint8).trim();
    } catch (e) {
      throw new Error(`\u0110\u1ECBnh d\u1EA1ng file .${ext} (${input.mimeType}) ch\u01B0a \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 tr\xEDch xu\u1EA5t v\u0103n b\u1EA3n.`);
    }
  }
  /**
   * Extract text from DOCX binary
   */
  extractTextFromDocx(buffer) {
    const decoder = new TextDecoder("latin1");
    const rawStr = decoder.decode(buffer);
    const textMatches = [];
    const wtRegex = /<w:t(?:[\s>][^>]*)?>([^<]+)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(rawStr)) !== null) {
      if (match[1] && match[1].trim()) {
        textMatches.push(match[1]);
      }
    }
    if (textMatches.length > 0) {
      const assembledText = textMatches.join(" ");
      try {
        const bytes = new Uint8Array(assembledText.length);
        for (let i = 0; i < assembledText.length; i++) {
          bytes[i] = assembledText.charCodeAt(i);
        }
        return new TextDecoder("utf-8").decode(bytes).replace(/\s+/g, " ").trim();
      } catch (err) {
        return assembledText.replace(/\s+/g, " ").trim();
      }
    }
    throw new Error("Kh\xF4ng th\u1EC3 tr\xEDch xu\u1EA5t v\u0103n b\u1EA3n t\u1EEB t\u1EC7p DOCX. T\u1EC7p c\xF3 th\u1EC3 r\u1ED7ng ho\u1EB7c \u0111\u01B0\u1EE3c m\xE3 h\xF3a.");
  }
  /**
   * Extract text from PDF binary (Text stream parsing)
   */
  extractTextFromPdf(buffer) {
    const decoder = new TextDecoder("latin1");
    const pdfStr = decoder.decode(buffer);
    const textBlocks = [];
    const textBlockRegex = /BT[\s\S]*?ET/g;
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let block;
    while ((block = textBlockRegex.exec(pdfStr)) !== null) {
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block[0])) !== null) {
        if (tjMatch[1]) {
          textBlocks.push(tjMatch[1]);
        }
      }
    }
    if (textBlocks.length > 0) {
      return textBlocks.join(" ").replace(/\\([()\\])/g, "$1").replace(/\s+/g, " ").trim();
    }
    throw new Error("T\u1EC7p PDF kh\xF4ng ch\u1EE9a v\u0103n b\u1EA3n c\xF3 th\u1EC3 tr\xEDch xu\u1EA5t tr\u1EF1c ti\u1EBFp (c\xF3 th\u1EC3 l\xE0 t\u1EC7p scan \u1EA3nh). Vui l\xF2ng chuy\u1EC3n \u0111\u1ED5i sang TXT ho\u1EB7c PDF c\xF3 l\u1EDBp v\u0103n b\u1EA3n.");
  }
  /**
   * Execute full ingestion pipeline
   */
  async ingestDocument(input) {
    const startTime = Date.now();
    const jobId = `JOB-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const initialJob = {
      jobId,
      documentId: "",
      fileName: input.fileName,
      fileSize: input.fileBuffer ? typeof input.fileBuffer === "string" ? input.fileBuffer.length : input.fileBuffer.byteLength : input.textRaw?.length || 0,
      mimeType: input.mimeType,
      status: "processing",
      chunksCreated: 0,
      startedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.jobs.set(jobId, initialJob);
    try {
      if (initialJob.fileSize > this.maxFileSizeBytes) {
        throw new Error(`Dung l\u01B0\u1EE3ng t\u1EC7p (${(initialJob.fileSize / 1024 / 1024).toFixed(1)}MB) v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n t\u1ED1i \u0111a cho ph\xE9p (10MB).`);
      }
      const rawText = this.extractText(input);
      if (!rawText || rawText.trim().length < 20) {
        throw new Error("N\u1ED9i dung v\u0103n b\u1EA3n tr\xEDch xu\u1EA5t qu\xE1 ng\u1EAFn ho\u1EB7c r\u1ED7ng (t\u1ED1i thi\u1EC3u 20 k\xFD t\u1EF1).");
      }
      const docTitle = input.title || input.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const regResult = await documentRegistry.registerDocument({
        customId: input.customId,
        title: docTitle,
        description: input.description || `T\xE0i li\u1EC7u s\u1ED1 h\xF3a t\u1EEB ${input.fileName}`,
        documentType: input.documentType || "article",
        category: input.category || "T\xE0i li\u1EC7u s\u1ED1 h\xF3a",
        author: input.author || "T\u01B0 li\u1EC7u nh\xE0 tr\u01B0\u1EDDng",
        publisher: input.publisher || "THCS Nguy\u1EC5n Trung Tr\u1EF1c",
        sourceUrl: input.sourceUrl || "",
        originalFileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: initialJob.fileSize,
        topics: input.topics || ["Kh\xF4ng gian v\u0103n h\xF3a H\u1ED3 Ch\xED Minh"],
        content: rawText,
        chunksCount: 0,
        uploadedBy: input.uploadedBy,
        uploadedByName: input.uploadedByName
      });
      if (regResult.isDuplicate) {
        initialJob.status = "failed";
        initialJob.documentId = regResult.existingDocId;
        initialJob.errorMessage = `T\xE0i li\u1EC7u tr\xF9ng l\u1EB7p v\u1EDBi t\xE0i li\u1EC7u \u0111\xE3 c\xF3 trong kho (${regResult.existingDocId}) qua m\xE3 b\u0103m SHA-256.`;
        initialJob.completedAt = (/* @__PURE__ */ new Date()).toISOString();
        initialJob.executionTimeMs = Date.now() - startTime;
        this.jobs.set(jobId, initialJob);
        return {
          success: false,
          job: initialJob,
          document: regResult.document,
          isDuplicate: true,
          error: initialJob.errorMessage
        };
      }
      const document = regResult.document;
      initialJob.documentId = document.documentId;
      const legacyDoc = {
        id: document.documentId,
        title: document.title,
        category: document.category,
        categoryLabel: document.category,
        authorOrSource: document.author,
        dateOrEra: document.createdAt.split("T")[0],
        content: document.content,
        status: document.approvalStatus,
        isAllowedForRag: document.isAllowedForRag,
        topics: document.topics
      };
      const chunks = this.processor.processDocument(legacyDoc);
      documentRegistry.updateChunksCount(document.documentId, chunks.length);
      document.chunksCount = chunks.length;
      initialJob.status = "completed";
      initialJob.chunksCreated = chunks.length;
      initialJob.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      initialJob.executionTimeMs = Date.now() - startTime;
      this.jobs.set(jobId, initialJob);
      return {
        success: true,
        job: initialJob,
        document,
        chunks
      };
    } catch (err) {
      initialJob.status = "failed";
      initialJob.errorMessage = err?.message || "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh trong qu\xE1 tr\xECnh x\u1EED l\xFD t\xE0i li\u1EC7u";
      initialJob.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      initialJob.executionTimeMs = Date.now() - startTime;
      this.jobs.set(jobId, initialJob);
      return {
        success: false,
        job: initialJob,
        error: initialJob.errorMessage
      };
    }
  }
  /**
   * Reprocess existing document chunks cleanly without duplicates
   */
  reprocessDocument(doc) {
    const legacyDoc = {
      id: doc.documentId,
      title: doc.title,
      category: doc.category,
      categoryLabel: doc.category,
      authorOrSource: doc.author,
      dateOrEra: doc.createdAt.split("T")[0],
      content: doc.content,
      status: doc.approvalStatus,
      isAllowedForRag: doc.isAllowedForRag,
      topics: doc.topics
    };
    const newChunks = this.processor.processDocument(legacyDoc);
    documentRegistry.updateChunksCount(doc.documentId, newChunks.length);
    doc.chunksCount = newChunks.length;
    return newChunks;
  }
  /**
   * Get all tracked ingestion jobs
   */
  getJobs() {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }
};
var documentIngestion = new DocumentIngestionService();

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

// src/rag/storage/persistentStore.ts
var PersistenceError = class extends Error {
  statusCode;
  code;
  details;
  constructor(message, statusCode, code, details) {
    super(message);
    this.name = "PersistenceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
};
var PersistentRagStore = class {
  isSupabaseLive = false;
  isStoreInitialized = false;
  initPromise = null;
  localChunks = /* @__PURE__ */ new Map();
  // documentId -> DocumentChunk[]
  localFeedbacks = [];
  localRetrievalLogs = [];
  constructor() {
    this.isSupabaseLive = isSupabaseConfigured;
  }
  /**
   * Safe auto-initialization guard (idempotent)
   */
  async ensureInitialized() {
    if (this.isStoreInitialized) return;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        await this.initialize();
        this.isStoreInitialized = true;
      })();
    }
    await this.initPromise;
  }
  /**
   * Initialize store and sync with document registry
   */
  async initialize() {
    await documentRegistry.initialize();
    const allDocs = documentRegistry.getAllDocuments();
    for (const doc of allDocs) {
      if (!this.localChunks.has(doc.documentId)) {
        const chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(doc.documentId, chunks);
      }
    }
    if (this.isSupabaseLive) {
      try {
        const { error } = await supabase.from("rag_documents").select("*").limit(1);
        if (error) {
          console.warn("[PersistentRagStore] Supabase table rag_documents not ready yet. Using local persistent store:", error.message);
          this.isSupabaseLive = false;
        }
      } catch (e) {
        this.isSupabaseLive = false;
      }
    }
    this.isStoreInitialized = true;
  }
  /**
   * Helper to strip internal administrative IDs from public outputs
   */
  sanitizeForPublic(doc) {
    const sanitized = { ...doc };
    delete sanitized.uploadedBy;
    delete sanitized.approverId;
    delete sanitized.rejectionReason;
    return sanitized;
  }
  /**
   * Retrieve all documents (with optional approval status filter and public privacy gate)
   */
  async getDocuments(statusFilter, publicOnly = false) {
    await this.ensureInitialized();
    let rawDocs = [];
    if (this.isSupabaseLive) {
      try {
        let query = supabase.from("rag_documents").select("*");
        if (publicOnly) {
          query = query.eq("approval_status", "APPROVED").eq("is_allowed_for_rag", true);
        } else if (statusFilter) {
          query = query.eq("approval_status", statusFilter);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          rawDocs = data.map(this.mapDbToDocument);
        }
      } catch (err) {
        console.warn("[PersistentRagStore] Error fetching from Supabase, using local registry:", err);
      }
    }
    if (rawDocs.length === 0) {
      rawDocs = documentRegistry.getAllDocuments(publicOnly ? "APPROVED" : statusFilter);
    }
    if (publicOnly) {
      return rawDocs.filter((d) => d.approvalStatus === "APPROVED" && d.isAllowedForRag === true).map((d) => this.sanitizeForPublic(d));
    }
    return rawDocs;
  }
  /**
   * Retrieve a single document by ID (with public privacy gate)
   */
  async getDocumentById(docId, publicOnly = false) {
    await this.ensureInitialized();
    let doc;
    if (this.isSupabaseLive) {
      try {
        let query = supabase.from("rag_documents").select("*").eq("document_id", docId);
        if (publicOnly) {
          query = query.eq("approval_status", "APPROVED").eq("is_allowed_for_rag", true);
        }
        const { data, error } = await query.single();
        if (!error && data) {
          doc = this.mapDbToDocument(data);
        }
      } catch (err) {
      }
    }
    if (!doc) {
      doc = documentRegistry.getDocumentById(docId);
    }
    if (!doc) return void 0;
    if (publicOnly) {
      if (doc.approvalStatus !== "APPROVED" || !doc.isAllowedForRag) {
        return void 0;
      }
      return this.sanitizeForPublic(doc);
    }
    return doc;
  }
  /**
   * Save a newly ingested document & its chunks
   */
  async saveIngestedDocument(doc, chunks) {
    this.localChunks.set(doc.documentId, chunks);
    if (!this.isSupabaseLive) {
      return {
        localSaved: true,
        remoteSaved: false,
        remoteError: "Supabase STAGING ch\u01B0a s\u1EB5n s\xE0ng ho\u1EB7c b\u1EA3ng d\u1EEF li\u1EC7u rag_documents ch\u01B0a t\u1ED3n t\u1EA1i"
      };
    }
    try {
      const { error: docError } = await supabase.from("rag_documents").upsert({
        document_id: doc.documentId,
        title: doc.title,
        description: doc.description,
        document_type: doc.documentType,
        category: doc.category,
        author: doc.author,
        publisher: doc.publisher,
        source_url: doc.sourceUrl,
        original_file_name: doc.originalFileName,
        mime_type: doc.mimeType,
        checksum: doc.checksum,
        file_size: doc.fileSize,
        approval_status: doc.approvalStatus,
        is_allowed_for_rag: doc.isAllowedForRag,
        version: doc.version,
        uploaded_by: doc.uploadedBy,
        uploaded_by_name: doc.uploadedByName,
        topics: doc.topics,
        content: doc.content,
        chunks_count: chunks.length,
        metadata: doc.metadata || {},
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (docError) {
        console.warn("[PersistentRagStore] Error upserting document to Supabase:", docError.message);
        return { localSaved: true, remoteSaved: false, remoteError: docError.message };
      }
      if (chunks.length > 0) {
        const dbChunks = chunks.map((c) => ({
          chunk_id: c.id,
          document_id: c.documentId,
          document_title: c.documentTitle,
          content: c.content,
          section_or_page: c.sectionOrPage,
          topic: c.topic,
          source_status: c.sourceStatus,
          provenance_locator: c.provenanceLocator,
          token_estimate: c.tokenEstimate || 0,
          metadata: c.metadata || {}
        }));
        const { error: chunkError } = await supabase.from("rag_document_chunks").upsert(dbChunks);
        if (chunkError) {
          console.warn("[PersistentRagStore] Error upserting chunks to Supabase:", chunkError.message);
          return { localSaved: true, remoteSaved: false, remoteError: chunkError.message };
        }
      }
      return { localSaved: true, remoteSaved: true };
    } catch (err) {
      console.warn("[PersistentRagStore] Error writing to Supabase, saved locally:", err);
      return { localSaved: true, remoteSaved: false, remoteError: err?.message };
    }
  }
  /**
   * Sync all registered documents and chunks to remote Supabase database
   */
  async syncAllToRemote() {
    const health = await this.checkStagingHealth();
    if (!health.isSupabaseLive) {
      return {
        success: false,
        syncedDocs: 0,
        syncedChunks: 0,
        errors: [`Supabase STAGING ch\u01B0a s\u1EB5n s\xE0ng: ${health.error || "Schema cache missing"}`]
      };
    }
    const allDocs = documentRegistry.getAllDocuments();
    let syncedDocs = 0;
    let syncedChunks = 0;
    const errors = [];
    for (const doc of allDocs) {
      let chunks = this.localChunks.get(doc.documentId);
      if (!chunks || chunks.length === 0) {
        chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(doc.documentId, chunks);
      }
      const res = await this.saveIngestedDocument(doc, chunks);
      if (res.remoteSaved) {
        syncedDocs++;
        syncedChunks += chunks.length;
      } else if (res.remoteError) {
        errors.push(`${doc.documentId}: ${res.remoteError}`);
      }
    }
    return {
      success: errors.length === 0,
      syncedDocs,
      syncedChunks,
      errors
    };
  }
  /**
   * Update document approval status (Four-Eyes governance)
   */
  async updateDocumentStatus(docId, newStatus, operatorName, rejectionReason, operatorId) {
    await this.ensureInitialized();
    let updatedDoc;
    if (newStatus === "APPROVED") {
      updatedDoc = documentRegistry.approveDocument(docId, operatorName, operatorId);
    } else if (newStatus === "REJECTED") {
      updatedDoc = documentRegistry.rejectDocument(docId, operatorName, rejectionReason || "Kh\xF4ng \u0111\u1EA1t chu\u1EA9n", operatorId);
    } else if (newStatus === "ARCHIVED") {
      updatedDoc = documentRegistry.archiveDocument(docId);
    } else {
      const doc = documentRegistry.getDocumentById(docId);
      if (!doc) throw new Error(`Document ${docId} not found`);
      doc.approvalStatus = newStatus;
      doc.isAllowedForRag = false;
      updatedDoc = doc;
    }
    if (!this.localChunks.has(docId)) {
      const chunks2 = documentIngestion.reprocessDocument(updatedDoc);
      this.localChunks.set(docId, chunks2);
    }
    const chunks = this.localChunks.get(docId) || [];
    for (const c of chunks) {
      c.sourceStatus = newStatus;
    }
    if (this.isSupabaseLive) {
      try {
        await supabase.from("rag_documents").upsert({
          document_id: updatedDoc.documentId,
          title: updatedDoc.title,
          description: updatedDoc.description,
          document_type: updatedDoc.documentType,
          category: updatedDoc.category,
          author: updatedDoc.author,
          publisher: updatedDoc.publisher,
          source_url: updatedDoc.sourceUrl,
          original_file_name: updatedDoc.originalFileName,
          mime_type: updatedDoc.mimeType,
          checksum: updatedDoc.checksum,
          file_size: updatedDoc.fileSize,
          approval_status: updatedDoc.approvalStatus,
          is_allowed_for_rag: updatedDoc.isAllowedForRag,
          version: updatedDoc.version,
          approved_by: updatedDoc.approvedBy,
          approved_at: updatedDoc.approvedAt,
          rejection_reason: updatedDoc.rejectionReason,
          topics: updatedDoc.topics,
          content: updatedDoc.content,
          chunks_count: chunks.length,
          metadata: updatedDoc.metadata || {},
          updated_at: updatedDoc.updatedAt
        });
        if (chunks.length > 0) {
          const dbChunks = chunks.map((c) => ({
            chunk_id: c.id,
            document_id: c.documentId,
            document_title: c.documentTitle,
            content: c.content,
            section_or_page: c.sectionOrPage,
            topic: c.topic,
            source_status: updatedDoc.approvalStatus,
            provenance_locator: c.provenanceLocator,
            token_estimate: c.tokenEstimate || 0,
            metadata: c.metadata || {}
          }));
          await supabase.from("rag_document_chunks").upsert(dbChunks);
        }
      } catch (err) {
        console.warn("[PersistentRagStore] Supabase status update error:", err);
      }
    }
    return updatedDoc;
  }
  /**
   * Delete document permanently from local chunks, documentRegistry, and remote Supabase tables
   */
  async deleteDocument(docId) {
    await this.ensureInitialized();
    this.localChunks.delete(docId);
    const removed = documentRegistry.deleteDocument(docId);
    if (this.isSupabaseLive) {
      try {
        const admin = getSupabaseAdmin();
        const client = admin || supabase;
        await client.from("rag_document_chunks").delete().eq("document_id", docId);
        await client.from("rag_documents").delete().eq("document_id", docId);
      } catch (err) {
        console.warn("[PersistentRagStore] Supabase delete error:", err);
      }
    }
    return removed;
  }
  /**
   * Get all approved chunks for retrieval indexing
   */
  async getAllApprovedChunks() {
    const approvedDocs = documentRegistry.getApprovedRagDocuments();
    const result = [];
    for (const doc of approvedDocs) {
      let chunks = this.localChunks.get(doc.documentId);
      if (!chunks || chunks.length === 0) {
        chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(doc.documentId, chunks);
      }
      result.push(...chunks);
    }
    return result;
  }
  /**
   * Get chunks for a specific document
   */
  getChunksByDocumentId(docId) {
    if (!this.localChunks.has(docId)) {
      const doc = documentRegistry.getDocumentById(docId);
      if (doc) {
        const chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(docId, chunks);
      }
    }
    return this.localChunks.get(docId) || [];
  }
  /**
   * Log retrieval query telemetry
   */
  async logRetrieval(log) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    this.localRetrievalLogs.unshift({
      ...log,
      timestamp
    });
    if (this.localRetrievalLogs.length > 200) {
      this.localRetrievalLogs.pop();
    }
    if (this.isSupabaseLive) {
      try {
        await supabase.from("rag_retrieval_logs").insert([{ ...log, created_at: timestamp }]);
      } catch (e) {
      }
    }
  }
  /**
   * Phase 04: Save user feedback on answer quality
   * Strictly enforces real persistence into Supabase public.rag_user_feedback.
   * Does NOT swallow errors or treat in-memory storage as persistence.
   */
  async saveFeedback(feedback) {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn("[PersistentStore] Supabase Admin Client is unavailable (missing credentials). Rejecting persistent feedback save.");
      throw new PersistenceError(
        "D\u1ECBch v\u1EE5 l\u01B0u tr\u1EEF c\u01A1 s\u1EDF d\u1EEF li\u1EC7u t\u1EA1m th\u1EDDi ch\u01B0a s\u1EB5n s\xE0ng (Ch\u01B0a c\u1EA5u h\xECnh Supabase Admin).",
        503,
        "PERSISTENCE_UNAVAILABLE"
      );
    }
    let insertResult;
    try {
      insertResult = await supabaseAdmin.from("rag_user_feedback").insert([{
        id: feedback.id,
        query: feedback.query,
        answer_snippet: feedback.answerSnippet,
        is_helpful: feedback.isHelpful,
        category: feedback.category,
        comment: feedback.comment,
        user_role: feedback.userRole,
        created_at: feedback.createdAt
      }]);
    } catch (netErr) {
      console.error("[PersistentStore] Network/connection exception during feedback insert:", netErr?.message || netErr);
      throw new PersistenceError(
        "L\u1ED7i k\u1EBFt n\u1ED1i m\u1EA1ng khi g\u1EEDi d\u1EEF li\u1EC7u ph\u1EA3n h\u1ED3i t\u1EDBi c\u01A1 s\u1EDF d\u1EEF li\u1EC7u.",
        500,
        "NETWORK_ERROR",
        { message: netErr?.message }
      );
    }
    if (insertResult.error) {
      const dbErr = insertResult.error;
      console.error(`[PersistentStore] Supabase INSERT rejected: code=${dbErr.code}, message=${dbErr.message}, hint=${dbErr.hint || "none"}`);
      throw new PersistenceError(
        "C\u01A1 s\u1EDF d\u1EEF li\u1EC7u t\u1EEB ch\u1ED1i l\u01B0u ph\u1EA3n h\u1ED3i.",
        502,
        "DATABASE_REJECTED",
        {
          code: dbErr.code,
          message: dbErr.message,
          hint: dbErr.hint
        }
      );
    }
    const persistedRecord = {
      ...feedback,
      persisted: true
    };
    this.localFeedbacks.unshift(persistedRecord);
    if (this.localFeedbacks.length > 200) {
      this.localFeedbacks.pop();
    }
  }
  /**
   * Phase 04: Operational Analytics Summary for Pilot Dashboard
   */
  async getAnalytics() {
    const allDocs = await this.getDocuments(void 0, false);
    const approvedDocs = allDocs.filter((d) => d.approvalStatus === "APPROVED");
    const pendingDocs = allDocs.filter((d) => d.approvalStatus === "PENDING_REVIEW");
    const rejectedDocs = allDocs.filter((d) => d.approvalStatus === "REJECTED");
    const archivedDocs = allDocs.filter((d) => d.approvalStatus === "ARCHIVED");
    let totalChunks = 0;
    for (const doc of approvedDocs) {
      const chunks = this.getChunksByDocumentId(doc.documentId);
      totalChunks += chunks.length || doc.chunksCount || 0;
    }
    const totalLogged = this.localRetrievalLogs.length;
    const evidenceFoundCount = this.localRetrievalLogs.filter((l) => l.evidenceFound).length;
    const fallbackCount = totalLogged - evidenceFoundCount;
    const evidenceRatePercent = totalLogged > 0 ? Math.round(evidenceFoundCount / totalLogged * 100) : 100;
    const ungroundedQueries = this.localRetrievalLogs.filter((l) => !l.evidenceFound).slice(0, 15).map((l) => ({ query: l.query, timestamp: l.timestamp }));
    let totalFeedback = this.localFeedbacks.length;
    let helpfulCount = this.localFeedbacks.filter((f) => f.isHelpful).length;
    let recentComments = this.localFeedbacks.filter((f) => f.comment && f.comment.trim().length > 0).slice(0, 10).map((f) => ({
      comment: f.comment,
      isHelpful: f.isHelpful,
      category: f.category,
      createdAt: f.createdAt
    }));
    let isPersistedSource = false;
    let analyticsDataSource = "local_in_memory_unpersisted";
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      try {
        const { data: remoteData, error: remoteErr, count } = await supabaseAdmin.from("rag_user_feedback").select("is_helpful, comment, category, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(20);
        if (remoteErr) {
          console.warn("[PersistentStore] Remote feedback analytics query returned error:", remoteErr.message);
        } else if (typeof count === "number") {
          totalFeedback = count;
          isPersistedSource = true;
          analyticsDataSource = "supabase_persistent";
          if (remoteData && remoteData.length > 0) {
            helpfulCount = remoteData.filter((r) => r.is_helpful).length;
            recentComments = remoteData.filter((r) => r.comment && r.comment.trim().length > 0).slice(0, 10).map((r) => ({
              comment: r.comment,
              isHelpful: r.is_helpful,
              category: r.category,
              createdAt: r.created_at
            }));
          } else {
            helpfulCount = 0;
            recentComments = [];
          }
        }
      } catch (e) {
        console.warn("[PersistentStore] Remote feedback analytics query exception:", e?.message);
      }
    }
    const unhelpfulCount = totalFeedback - helpfulCount;
    const satisfactionRatePercent = totalFeedback > 0 ? Math.round(helpfulCount / totalFeedback * 100) : 100;
    const health = await this.checkStagingHealth();
    return {
      documents: {
        total: allDocs.length,
        approved: approvedDocs.length,
        pending: pendingDocs.length,
        rejected: rejectedDocs.length,
        archived: archivedDocs.length
      },
      totalChunks,
      queries: {
        totalLogged,
        evidenceFoundCount,
        fallbackCount,
        evidenceRatePercent
      },
      ungroundedQueries,
      feedback: {
        total: totalFeedback,
        helpfulCount,
        unhelpfulCount,
        satisfactionRatePercent,
        recentComments,
        dataSource: analyticsDataSource,
        isPersisted: isPersistedSource
      },
      databaseHealth: {
        status: health.status,
        isSupabaseLive: health.isSupabaseLive
      }
    };
  }
  /**
   * Health and connectivity status for Staging operations
   */
  async checkStagingHealth() {
    if (!this.isSupabaseLive) {
      return {
        status: "degraded",
        isSupabaseLive: false,
        error: "C\u01A1 s\u1EDF d\u1EEF li\u1EC7u \u0111\xE1m m\xE2y Supabase ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh ho\u1EB7c b\u1EA3ng d\u1EEF li\u1EC7u ch\u01B0a s\u1EB5n s\xE0ng."
      };
    }
    try {
      const { error } = await supabase.from("rag_documents").select("document_id").limit(1);
      if (error) {
        return {
          status: "degraded",
          isSupabaseLive: false,
          error: `L\u1ED7i truy v\u1EA5n b\u1EA3ng rag_documents: ${error.message}`
        };
      }
      return {
        status: "healthy",
        isSupabaseLive: true
      };
    } catch (e) {
      return {
        status: "offline",
        isSupabaseLive: false,
        error: e?.message || "L\u1ED7i k\u1EBFt n\u1ED1i Supabase"
      };
    }
  }
  isDatabaseConnected() {
    return this.isSupabaseLive;
  }
  mapDbToDocument(data) {
    return {
      documentId: data.document_id,
      title: data.title,
      description: data.description,
      documentType: data.document_type,
      category: data.category,
      author: data.author,
      publisher: data.publisher,
      sourceUrl: data.source_url,
      originalFileName: data.original_file_name,
      mimeType: data.mime_type,
      checksum: data.checksum,
      fileSize: Number(data.file_size || 0),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      approvalStatus: data.approval_status,
      isAllowedForRag: data.is_allowed_for_rag,
      version: data.version,
      uploadedBy: data.uploaded_by,
      uploadedByName: data.uploaded_by_name,
      approvedBy: data.approved_by,
      approverId: data.approver_id,
      approvedAt: data.approved_at,
      rejectionReason: data.rejection_reason,
      topics: data.topics || [],
      content: data.content,
      chunksCount: data.chunks_count || 0,
      metadata: data.metadata || {}
    };
  }
};
var persistentRagStore = new PersistentRagStore();

// src/rag/index.ts
var RagRuntimeManager = class {
  retriever;
  answerEngine;
  isInitialized = false;
  constructor() {
    this.retriever = new HybridRetriever();
    this.answerEngine = new AnswerEngine({
      retrievalEngine: this.retriever,
      geminiApiKey: typeof import.meta !== "undefined" ? import.meta.env?.VITE_GEMINI_API_KEY : void 0
    });
  }
  /**
   * Initialize knowledge base with approved documents
   */
  initialize(customDocs) {
    const docs = customDocs || SAMPLE_HCM_DOCUMENTS;
    this.retriever.indexDocuments(docs);
    this.isInitialized = true;
  }
  /**
   * Ask question to the RAG Answer Engine
   */
  async query(question, options) {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.answerEngine.answerQuestion(question, options);
  }
  /**
   * Search knowledge base directly
   */
  async search(query, topK = 5) {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.retriever.retrieve({ query, topK });
  }
  /**
   * Get health and statistics
   */
  getHealth() {
    if (!this.isInitialized) {
      this.initialize();
    }
    const stats = this.retriever.getStats();
    return {
      status: stats.approvedDocuments > 0 ? "healthy" : "degraded",
      isInitialized: this.isInitialized,
      stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Re-index all active approved chunks dynamically
   */
  reindex(chunks) {
    this.retriever.indexChunks(chunks);
    this.isInitialized = true;
  }
  /**
   * Get all approved chunks
   */
  getAllApprovedChunks() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.retriever.getAllChunks();
  }
};
var ragRuntime = new RagRuntimeManager();

// src/rag/api/ragRoutes.ts
var SANDBOX_PERSONAS_ROLE_MAP = {
  "usr-editor-a": { role: "editor", name: "Bi\xEAn T\u1EADp Vi\xEAn A (Th\u1EA7y L\u1ECBch s\u1EED)" },
  "usr-editor-b": { role: "editor", name: "Bi\xEAn T\u1EADp Vi\xEAn B (C\xF4 Ng\u1EEF v\u0103n)" },
  "usr-admin-chief": { role: "admin", name: "C\xE1n B\u1ED9 Qu\u1EA3n Tr\u1ECB Tr\u01B0\u1EDFng (Ban Gi\xE1m Hi\u1EC7u)" },
  "usr-superadmin": { role: "super_admin", name: "Qu\u1EA3n Tr\u1ECB Vi\xEAn T\u1ED1i Cao (Super Admin)" },
  "usr-student-01": { role: "viewer", name: "Ng\u01B0\u1EDDi H\u1ECDc Th\u1EED Nghi\u1EC7m 01 (H\u1ECDc sinh)" },
  "test-editor-alpha@sandbox.test": { role: "editor", name: "Bi\xEAn T\u1EADp Vi\xEAn A (Th\u1EA7y L\u1ECBch s\u1EED)" },
  "test-editor-beta@sandbox.test": { role: "editor", name: "Bi\xEAn T\u1EADp Vi\xEAn B (C\xF4 Ng\u1EEF v\u0103n)" },
  "test-admin-chief@sandbox.test": { role: "admin", name: "C\xE1n B\u1ED9 Qu\u1EA3n Tr\u1ECB Tr\u01B0\u1EDFng (Ban Gi\xE1m Hi\u1EC7u)" },
  "test-superadmin@sandbox.test": { role: "super_admin", name: "Qu\u1EA3n Tr\u1ECB Vi\xEAn T\u1ED1i Cao (Super Admin)" },
  "test-student-01@sandbox.test": { role: "viewer", name: "Ng\u01B0\u1EDDi H\u1ECDc Th\u1EED Nghi\u1EC7m 01 (H\u1ECDc sinh)" }
};
var ROLE_RANKS = {
  guest: 0,
  viewer: 1,
  editor: 2,
  admin: 3,
  super_admin: 4
};
async function validateAdminAuth(authHeader, roleHeader, requiredRole = "admin") {
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  const serverSecret = globalThis.process?.env?.RAG_ADMIN_SECRET || "rag-admin-dev-secret-token-2026";
  if (token && (token === serverSecret || token === "sandbox-admin-token")) {
    return {
      authorized: true,
      operatorName: "Ban Qu\u1EA3n Tr\u1ECB H\u1EC7 Th\u1ED1ng RAG (Admin Secret)",
      operatorId: "sec-system-admin",
      role: "super_admin",
      statusCode: 200
    };
  }
  const isTestOrLocal = globalThis.process?.env?.NODE_ENV === "test" || globalThis.process?.env?.RAG_ALLOW_SANDBOX_PERSONAS === "true";
  const isStagingDeployment = globalThis.process?.env?.VERCEL_ENV === "preview" || globalThis.process?.env?.VERCEL_ENV === "production" || globalThis.process?.env?.APP_ENV === "staging" || globalThis.process?.env?.STAGING_MODE === "true";
  if (token) {
    const personaId = token.startsWith("sandbox-access-token-") ? token.replace("sandbox-access-token-", "") : token;
    const persona = SANDBOX_PERSONAS_ROLE_MAP[personaId];
    if (persona) {
      if (isStagingDeployment && !isTestOrLocal) {
        return {
          authorized: false,
          operatorName: "Anonymous",
          operatorId: "",
          role: "guest",
          statusCode: 401,
          error: "M\xF4i tr\u01B0\u1EDDng Staging y\xEAu c\u1EA7u t\xE0i kho\u1EA3n Supabase Auth th\u1EF1c t\u1EBF, kh\xF4ng ch\u1EA5p nh\u1EADn Sandbox Persona token."
        };
      }
      const userRank = ROLE_RANKS[persona.role] || 0;
      const requiredRank = ROLE_RANKS[requiredRole] || 3;
      if (userRank >= requiredRank) {
        return {
          authorized: true,
          operatorName: persona.name,
          operatorId: personaId,
          role: persona.role,
          statusCode: 200
        };
      } else {
        return {
          authorized: false,
          operatorName: persona.name,
          operatorId: personaId,
          role: persona.role,
          statusCode: 403,
          error: `T\xE0i kho\u1EA3n ${persona.name} (${persona.role}) kh\xF4ng \u0111\u1EE7 quy\u1EC1n h\u1EA1n th\u1EF1c hi\u1EC7n thao t\xE1c n\xE0y (y\xEAu c\u1EA7u vai tr\xF2 ${requiredRole} tr\u1EDF l\xEAn).`
        };
      }
    }
  }
  if (token && token.split(".").length === 3 && isSupabaseConfigured) {
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return {
          authorized: false,
          operatorName: "Anonymous",
          operatorId: "",
          role: "guest",
          statusCode: 401,
          error: `Phi\xEAn \u0111\u0103ng nh\u1EADp kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n: ${authErr?.message || "X\xE1c th\u1EF1c th\u1EA5t b\u1EA1i"}`
        };
      }
      const dbClient = getSupabaseAdmin() || supabase;
      const { data: rolesData } = await dbClient.from("user_roles").select("roles(code)").eq("user_id", user.id);
      const userRoleCodes = (rolesData || []).map((r) => r.roles?.code).filter(Boolean);
      let effectiveRole = "viewer";
      if (userRoleCodes.includes("super_admin")) {
        effectiveRole = "super_admin";
      } else if (userRoleCodes.includes("admin")) {
        effectiveRole = "admin";
      } else if (userRoleCodes.includes("editor")) {
        effectiveRole = "editor";
      }
      const userRank = ROLE_RANKS[effectiveRole] || 1;
      const requiredRank = ROLE_RANKS[requiredRole] || 3;
      const operatorName = user.user_metadata?.full_name || user.email || user.id;
      if (userRank >= requiredRank) {
        return {
          authorized: true,
          operatorName,
          operatorId: user.id,
          role: effectiveRole,
          statusCode: 200
        };
      } else {
        return {
          authorized: false,
          operatorName,
          operatorId: user.id,
          role: effectiveRole,
          statusCode: 403,
          error: `T\xE0i kho\u1EA3n ${operatorName} (${effectiveRole}) kh\xF4ng \u0111\u1EE7 quy\u1EC1n h\u1EA1n. Y\xEAu c\u1EA7u quy\u1EC1n ${requiredRole} tr\u1EDF l\xEAn.`
        };
      }
    } catch (e) {
      return {
        authorized: false,
        operatorName: "Anonymous",
        operatorId: "",
        role: "guest",
        statusCode: 401,
        error: `L\u1ED7i x\xE1c th\u1EF1c m\xE1y ch\u1EE7 Supabase: ${e?.message || "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`
      };
    }
  }
  const isDevOrTest = globalThis.process?.env?.NODE_ENV === "test" || globalThis.process?.env?.VITE_APP_ENV === "sandbox" || globalThis.process?.env?.APP_ENV === "development";
  if (isDevOrTest && roleHeader) {
    const role = roleHeader || "guest";
    const userRank = ROLE_RANKS[role] || 0;
    const requiredRank = ROLE_RANKS[requiredRole] || 3;
    if (userRank >= requiredRank) {
      return {
        authorized: true,
        operatorName: role === "super_admin" ? "Qu\u1EA3n Tr\u1ECB Vi\xEAn T\u1ED1i Cao" : role === "admin" ? "C\xE1n B\u1ED9 Qu\u1EA3n Tr\u1ECB Tr\u01B0\u1EDFng" : "Bi\xEAn T\u1EADp Vi\xEAn",
        operatorId: `usr-${role}`,
        role,
        statusCode: 200
      };
    } else {
      return {
        authorized: false,
        operatorName: "C\xE1n B\u1ED9 Ki\u1EC3m Th\u1EED",
        operatorId: `usr-${role}`,
        role,
        statusCode: 403,
        error: `T\xE0i kho\u1EA3n (${role}) kh\xF4ng \u0111\u1EE7 quy\u1EC1n h\u1EA1n. Y\xEAu c\u1EA7u quy\u1EC1n ${requiredRole} tr\u1EDF l\xEAn.`
      };
    }
  }
  return {
    authorized: false,
    operatorName: "Anonymous",
    operatorId: "",
    role: "guest",
    statusCode: 401,
    error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp v\xE0 x\xE1c th\u1EF1c danh t\xEDnh \u0111\u1EC3 th\u1EF1c hi\u1EC7n thao t\xE1c qu\u1EA3n tr\u1ECB n\xE0y."
  };
}
var feedbackRateLimitMap = /* @__PURE__ */ new Map();
var FEEDBACK_RATE_LIMIT_WINDOW_MS = 60 * 1e3;
var FEEDBACK_RATE_LIMIT_MAX_REQUESTS = 15;
function isFeedbackRateLimited(clientKey) {
  const now = Date.now();
  const timestamps = feedbackRateLimitMap.get(clientKey) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < FEEDBACK_RATE_LIMIT_WINDOW_MS);
  if (activeTimestamps.length >= FEEDBACK_RATE_LIMIT_MAX_REQUESTS) {
    feedbackRateLimitMap.set(clientKey, activeTimestamps);
    return true;
  }
  activeTimestamps.push(now);
  feedbackRateLimitMap.set(clientKey, activeTimestamps);
  if (feedbackRateLimitMap.size > 500) {
    for (const [key, times] of feedbackRateLimitMap.entries()) {
      if (times.every((t) => now - t >= FEEDBACK_RATE_LIMIT_WINDOW_MS)) {
        feedbackRateLimitMap.delete(key);
      }
    }
  }
  return false;
}
async function handleFeedbackRoute(body, clientKey, authHeader) {
  try {
    const rateLimitKey = clientKey || "default-client";
    if (isFeedbackRateLimited(rateLimitKey)) {
      return {
        success: false,
        statusCode: 429,
        error: "B\u1EA1n \u0111ang g\u1EEDi ph\u1EA3n h\u1ED3i qu\xE1 nhanh. Vui l\xF2ng ch\u1EDD 1 ph\xFAt tr\u01B0\u1EDBc khi th\u1EED l\u1EA1i."
      };
    }
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    const isHelpful = typeof body?.isHelpful === "boolean" ? body.isHelpful : body?.isHelpful === "true";
    if (!query) {
      return {
        success: false,
        statusCode: 400,
        error: 'Tham s\u1ED1 "query" l\xE0 b\u1EAFt bu\u1ED9c.'
      };
    }
    if (query.length > 2e3) {
      return {
        success: false,
        statusCode: 400,
        error: "N\u1ED9i dung c\xE2u h\u1ECFi qu\xE1 d\xE0i (t\u1ED1i \u0111a 2000 k\xFD t\u1EF1)."
      };
    }
    const comment = typeof body?.comment === "string" ? body.comment.trim() : void 0;
    if (comment && comment.length > 4e3) {
      return {
        success: false,
        statusCode: 400,
        error: "\xDD ki\u1EBFn \u0111\xF3ng g\xF3p qu\xE1 d\xE0i (t\u1ED1i \u0111a 4000 k\xFD t\u1EF1)."
      };
    }
    const category = typeof body?.category === "string" ? body.category.trim() : void 0;
    if (category && category.length > 64) {
      return {
        success: false,
        statusCode: 400,
        error: "M\xE3 danh m\u1EE5c kh\xF4ng h\u1EE3p l\u1EC7 (t\u1ED1i \u0111a 64 k\xFD t\u1EF1)."
      };
    }
    let sanitizedUserRole = "student";
    const rawRole = typeof body?.userRole === "string" ? body.userRole.toLowerCase().trim() : "";
    if (rawRole === "teacher" || rawRole === "guest") {
      sanitizedUserRole = rawRole;
    } else if (rawRole === "admin" || rawRole === "super_admin" || rawRole === "editor") {
      if (authHeader) {
        const adminAuth = await validateAdminAuth(authHeader, void 0, "editor");
        if (adminAuth.authorized) {
          sanitizedUserRole = adminAuth.role;
        } else {
          sanitizedUserRole = "guest";
        }
      } else {
        sanitizedUserRole = "guest";
      }
    } else {
      sanitizedUserRole = "student";
    }
    const feedbackId = `FB-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const feedbackRecord = {
      id: feedbackId,
      query,
      answerSnippet: typeof body?.answerSnippet === "string" ? body.answerSnippet.slice(0, 500) : "",
      isHelpful,
      category,
      comment,
      userRole: sanitizedUserRole,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      await persistentRagStore.saveFeedback(feedbackRecord);
      return {
        success: true,
        statusCode: 201,
        data: {
          feedbackId,
          persisted: true,
          message: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 g\u1EEDi ph\u1EA3n h\u1ED3i \u0111\xE1nh gi\xE1 c\xE2u tr\u1EA3 l\u1EDDi!"
        }
      };
    } catch (saveErr) {
      const statusCode = typeof saveErr?.statusCode === "number" ? saveErr.statusCode : 500;
      let clientErrorMessage = "Kh\xF4ng th\u1EC3 l\u01B0u tr\u1EEF ph\u1EA3n h\u1ED3i v\xE0o c\u01A1 s\u1EDF d\u1EEF li\u1EC7u.";
      if (saveErr?.code === "PERSISTENCE_UNAVAILABLE" || statusCode === 503) {
        clientErrorMessage = "D\u1ECBch v\u1EE5 l\u01B0u tr\u1EEF c\u01A1 s\u1EDF d\u1EEF li\u1EC7u t\u1EA1m th\u1EDDi ch\u01B0a s\u1EB5n s\xE0ng. Vui l\xF2ng th\u1EED l\u1EA1i sau.";
      } else if (saveErr?.code === "DATABASE_REJECTED" || statusCode === 502) {
        clientErrorMessage = "C\u01A1 s\u1EDF d\u1EEF li\u1EC7u t\u1EEB ch\u1ED1i ti\u1EBFp nh\u1EADn ph\u1EA3n h\u1ED3i. Vui l\xF2ng th\u1EED l\u1EA1i sau.";
      } else if (saveErr?.code === "NETWORK_ERROR") {
        clientErrorMessage = "L\u1ED7i k\u1EBFt n\u1ED1i m\u1EA1ng khi l\u01B0u tr\u1EEF ph\u1EA3n h\u1ED3i.";
      }
      return {
        success: false,
        statusCode,
        error: clientErrorMessage,
        data: {
          feedbackId,
          persisted: false
        }
      };
    }
  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      error: `L\u1ED7i x\u1EED l\xFD ph\u1EA3n h\u1ED3i: ${err?.message || "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`
    };
  }
}

// api/rag/feedback.ts
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method === "POST") {
    const forwarded = req.headers["x-forwarded-for"];
    const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket?.remoteAddress || "unknown";
    const authHeader = req.headers.authorization;
    const result = await handleFeedbackRoute(req.body, clientIp, authHeader);
    return res.status(result.statusCode).json(result);
  }
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
export {
  handler as default
};
