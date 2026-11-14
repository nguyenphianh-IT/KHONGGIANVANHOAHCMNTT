/**
 * Vietnamese Text Normalization & Tokenization Utility
 * Supports accented and non-accented search, term normalization, and n-grams.
 */

// Vietnamese diacritic mapping table
const VIETNAMESE_ACCENT_MAP: Record<string, string> = {
  à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
  ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
  â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
  è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
  ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
  ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
  ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
  ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
  ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
  ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
  ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
  ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
  đ: 'd',
  À: 'a', Á: 'a', Ả: 'a', Ã: 'a', Ạ: 'a',
  Ă: 'a', Ằ: 'a', Ắ: 'a', Ẳ: 'a', Ẵ: 'a', Ặ: 'a',
  Â: 'a', Ầ: 'a', Ấ: 'a', Ẩ: 'a', Ẫ: 'a', Ậ: 'a',
  È: 'e', É: 'e', Ẻ: 'e', Ẽ: 'e', Ẹ: 'e',
  Ê: 'e', Ề: 'e', Ế: 'e', Ể: 'e', Ễ: 'e', Ệ: 'e',
  Ì: 'i', Í: 'i', Ỉ: 'i', Ĩ: 'i', Ị: 'i',
  Ò: 'o', Ó: 'o', Ỏ: 'o', Õ: 'o', Ọ: 'o',
  Ô: 'o', Ồ: 'o', Ố: 'o', Ổ: 'o', Ỗ: 'o', Ộ: 'o',
  Ơ: 'o',Ờ: 'o', Ớ: 'o', Ở: 'o', Ỡ: 'o', Ợ: 'o',
  Ù: 'u', Ú: 'u', Ủ: 'u', Ũ: 'u', Ụ: 'u',
  Ư: 'u', Ừ: 'u', Ứ: 'u', Ử: 'u', Ữ: 'u', Ự: 'u',
  Ỳ: 'y', Ý: 'y', Ỷ: 'y', Ỹ: 'y', Ỵ: 'y',
  Đ: 'd',
};

// Common Vietnamese stopwords for light filtering (keeping semantic verbs and nouns)
const VIETNAMESE_STOPWORDS = new Set([
  'va', 'hoac', 'la', 'nhung', 'ma', 'cua', 'cho', 'den', 'tu', 'trong',
  'tren', 'duoi', 'voi', 've', 'ra', 'vao', 'o', 'tai', 'rat', 'qua',
  'nhu', 'the', 'nay', 'do', 'kia', 'ay', 'cac', 'mot', 'co', 'khong',
  'duoc', 'se', 'da', 'dang', 'ngay', 'nao', 'sao', 'gi', 'ai', 'dau',
  'khi', 'luc', 'lai', 'roi', 'boi', 'vi', 'hay', 'nen', 'de'
]);

/**
 * Remove Vietnamese accents while preserving ASCII characters
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .split('')
    .map(ch => VIETNAMESE_ACCENT_MAP[ch] || ch)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Clean and normalize text: lowercase, trim multiple spaces, keep letters, numbers and hyphens
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize string into meaningful word tokens
 */
export function tokenize(str: string, removeStopwords = false): string[] {
  const normalized = normalizeText(str);
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(t => t.length > 0);

  if (removeStopwords) {
    return tokens.filter(t => {
      const nonAccented = removeVietnameseAccents(t);
      return !VIETNAMESE_STOPWORDS.has(nonAccented);
    });
  }

  return tokens;
}

/**
 * Extract unigrams and bigrams for phrase matching
 */
export function extractNGrams(tokens: string[]): string[] {
  const result: string[] = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return result;
}

/**
 * Calculate simple string overlap / containment score
 */
export function containsPhrase(haystack: string, needle: string): boolean {
  const normHaystack = removeVietnameseAccents(normalizeText(haystack));
  const normNeedle = removeVietnameseAccents(normalizeText(needle));
  return normHaystack.includes(normNeedle);
}
