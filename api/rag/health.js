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
  "nhung",
  "cac",
  "mot",
  "nhung"
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
    if (!scoredChunks || scoredChunks.length === 0 || scoredChunks[0].score < 0.3) {
      return {
        answer: `Hi\u1EC7n t\u1EA1i trong kho t\u01B0 li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c ki\u1EC3m duy\u1EC7t c\u1EE7a **Kh\xF4ng gian V\u0103n h\xF3a H\u1ED3 Ch\xED Minh \u2013 Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c**, h\u1EC7 th\u1ED1ng ch\u01B0a t\xECm th\u1EA5y th\xF4ng tin ph\xF9 h\u1EE3p \u0111\u1EC3 tr\u1EA3 l\u1EDDi c\xE2u h\u1ECFi: *"${query}"*.

*G\u1EE3i \xFD:* B\u1EA1n c\xF3 th\u1EC3 th\u1EED tra c\u1EE9u c\xE1c ch\u1EE7 \u0111\u1EC1 nh\u01B0: *5 \u0110i\u1EC1u B\xE1c H\u1ED3 d\u1EA1y, Tuy\xEAn ng\xF4n \u0110\u1ED9c l\u1EADp 2/9/1945, Th\u01B0 khai tr\u01B0\u1EDDng th\xE1ng 9/1945, Di ch\xFAc c\u1EE7a B\xE1c, L\u1EDDi k\xEAu g\u1ECDi To\xE0n qu\u1ED1c kh\xE1ng chi\u1EBFn, ho\u1EB7c B\xE0i vi\u1EBFt D\xE2n v\u1EADn.*`,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: "Local Grounded Rule Engine (DEV Offline)"
      };
    }
    const topScore = scoredChunks[0].score;
    const relevantChunks = scoredChunks.filter((sc) => sc.score >= 0.3 && sc.score >= topScore * 0.4);
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
    const isFiveTeachings = nonAccentedQuery.includes("5 dieu") || nonAccentedQuery.includes("nam dieu") || nonAccentedQuery.includes("bac ho day") || nonAccentedQuery.includes("thieu nien");
    const isDeclaration = nonAccentedQuery.includes("tuyen ngon") || nonAccentedQuery.includes("doc lap") || nonAccentedQuery.includes("2 9");
    const isTestament = nonAccentedQuery.includes("di chuc") || nonAccentedQuery.includes("doan ket") || nonAccentedQuery.includes("thanh nien");
    const isSchoolLetter = nonAccentedQuery.includes("khai truong") || nonAccentedQuery.includes("hoc sinh") || nonAccentedQuery.includes("sanh vai");
    const isDanVan = nonAccentedQuery.includes("dan van") || nonAccentedQuery.includes("luc luong");
    const isResistance = nonAccentedQuery.includes("toan quoc") || nonAccentedQuery.includes("khang chien") || nonAccentedQuery.includes("1946");
    const isPrisonDiary = nonAccentedQuery.includes("nhat ky trong tu") || nonAccentedQuery.includes("tho");
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
    if (!usedProvider) {
      const localRes = this.localEngine.synthesize(cleanQuery, retrievedChunks);
      answerText = localRes.answer;
      modelName = localRes.modelUsed;
      citations = localRes.citations;
    }
    const generationTimeMs = Date.now() - genStart;
    const totalTimeMs = Date.now() - startTime;
    return {
      query: cleanQuery,
      answer: answerText,
      citations,
      evidenceFound: true,
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
    title: "Truy\u1EC1n th\u1ED1ng L\u1ECBch s\u1EED Anh h\xF9ng D\xE2n t\u1ED9c Nguy\u1EC5n Trung Tr\u1EF1c v\xE0 V\xF9ng \u0111\u1EA5t Th\u1EDBi An - Qu\u1EADn 12",
    category: "hcmc-history",
    categoryLabel: "L\u1ECBch s\u1EED Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh",
    authorOrSource: "Ban Gi\xE1m hi\u1EC7u & T\u1ED5 L\u1ECBch s\u1EED Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c",
    dateOrEra: "1838 - 1868 & Hi\u1EC7n nay",
    status: "APPROVED",
    isAllowedForRag: true,
    topics: ["Nguy\u1EC5n Trung Tr\u1EF1c", "Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c", "B\u1EA3o b\u1ED1i tinh th\u1EA7n", "Kh\u1EDFi ngh\u0129a kh\xE1ng Ph\xE1p", "Th\u1EDBi An", "Qu\u1EADn 12"],
    sourceUrl: "https://thcsnguyentrungtruc.hcm.edu.vn",
    content: `Tr\u01B0\u1EDDng THCS Nguy\u1EC5n Trung Tr\u1EF1c t\u1ECDa l\u1EA1c t\u1EA1i ph\u01B0\u1EDDng Th\u1EDBi An, Qu\u1EADn 12, TP. H\u1ED3 Ch\xED Minh - v\xF9ng \u0111\u1EA5t gi\xE0u truy\u1EC1n th\u1ED1ng c\xE1ch m\u1EA1ng Chi\u1EBFn khu An Ph\xFA \u0110\xF4ng oanh li\u1EC7t.

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
      schoolLocation: "Ph\u01B0\u1EDDng Th\u1EDBi An, Qu\u1EADn 12, TP.HCM"
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
  /**
   * Initialize registry with seeds
   */
  async initialize() {
    if (this.isInitialized) return;
    const seeds = await seedInitialDocuments();
    for (const doc of seeds) {
      this.documents.set(doc.documentId, doc);
      this.checksumIndex.set(doc.checksum, doc.documentId);
    }
    this.isInitialized = true;
  }
  /**
   * Get all registered documents
   */
  getAllDocuments(statusFilter) {
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
    return doc;
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

// src/rag/storage/persistentStore.ts
var PersistentRagStore = class {
  isSupabaseLive = false;
  localChunks = /* @__PURE__ */ new Map();
  // documentId -> DocumentChunk[]
  localFeedbacks = [];
  localRetrievalLogs = [];
  constructor() {
    this.isSupabaseLive = isSupabaseConfigured;
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
    if (this.isSupabaseLive) {
      try {
        await supabase.from("rag_documents").upsert({
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
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
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
          await supabase.from("rag_document_chunks").upsert(dbChunks);
        }
      } catch (err) {
        console.warn("[PersistentRagStore] Error writing to Supabase, saved locally:", err);
      }
    }
  }
  /**
   * Update document approval status (Four-Eyes governance)
   */
  async updateDocumentStatus(docId, newStatus, operatorName, rejectionReason, operatorId) {
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
    const chunks = this.localChunks.get(docId) || [];
    for (const c of chunks) {
      c.sourceStatus = newStatus;
    }
    if (this.isSupabaseLive) {
      try {
        await supabase.from("rag_documents").update({
          approval_status: updatedDoc.approvalStatus,
          is_allowed_for_rag: updatedDoc.isAllowedForRag,
          approved_by: updatedDoc.approvedBy,
          approved_at: updatedDoc.approvedAt,
          rejection_reason: updatedDoc.rejectionReason,
          updated_at: updatedDoc.updatedAt
        }).eq("document_id", docId);
        await supabase.from("rag_document_chunks").update({
          source_status: updatedDoc.approvalStatus
        }).eq("document_id", docId);
      } catch (err) {
        console.warn("[PersistentRagStore] Supabase status update error:", err);
      }
    }
    return updatedDoc;
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
   */
  async saveFeedback(feedback) {
    this.localFeedbacks.unshift(feedback);
    if (this.localFeedbacks.length > 200) {
      this.localFeedbacks.pop();
    }
    if (this.isSupabaseLive) {
      try {
        await supabase.from("rag_user_feedback").insert([{
          id: feedback.id,
          query: feedback.query,
          answer_snippet: feedback.answerSnippet,
          is_helpful: feedback.isHelpful,
          category: feedback.category,
          comment: feedback.comment,
          user_role: feedback.userRole,
          created_at: feedback.createdAt
        }]);
      } catch (e) {
      }
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
    const totalFeedback = this.localFeedbacks.length;
    const helpfulCount = this.localFeedbacks.filter((f) => f.isHelpful).length;
    const unhelpfulCount = totalFeedback - helpfulCount;
    const satisfactionRatePercent = totalFeedback > 0 ? Math.round(helpfulCount / totalFeedback * 100) : 100;
    const recentComments = this.localFeedbacks.filter((f) => f.comment && f.comment.trim().length > 0).slice(0, 10).map((f) => ({
      comment: f.comment,
      isHelpful: f.isHelpful,
      category: f.category,
      createdAt: f.createdAt
    }));
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
        recentComments
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
async function handleHealthRoute() {
  try {
    const health = ragRuntime.getHealth();
    const dbHealth = await persistentRagStore.checkStagingHealth();
    return {
      success: true,
      statusCode: 200,
      data: {
        ...health,
        backendType: "Deployable RAG Service (Phase 03 - Staging)",
        environment: globalThis.process?.env?.VERCEL_ENV || globalThis.process?.env?.APP_ENV || "staging",
        activeRegistryDocs: documentRegistry.getAllDocuments().length,
        approvedDocs: documentRegistry.getApprovedRagDocuments().length,
        database: dbHealth
      }
    };
  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      error: `L\u1ED7i ki\u1EC3m tra s\u1EE9c kh\u1ECFe h\u1EC7 th\u1ED1ng: ${err?.message || "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`
    };
  }
}

// api/rag/health.ts
async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
    return res.status(204).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  const result = await handleHealthRoute();
  return res.status(result.statusCode).json(result);
}
export {
  handler as default
};
