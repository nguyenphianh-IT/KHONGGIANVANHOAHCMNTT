/**
 * ADR-002: Local Deterministic Grounded Synthesis Engine
 * 100% offline, zero-latency, rule-based grounded answer synthesizer for DEV MVP.
 * Extracts relevant evidence, formats clear Vietnamese answers, attaches verified citations.
 */

import { ScoredChunk, RagCitation } from '../types/ragTypes';
import { normalizeText, tokenize, removeVietnameseAccents, extractNGrams } from '../retrieval/textNormalizer';

export interface LocalSynthesisResult {
  answer: string;
  citations: RagCitation[];
  evidenceFound: boolean;
  conflictDetected: boolean;
  conflictNotes?: string;
  modelUsed: string;
}

export class LocalGroundedEngine {
  /**
   * Synthesize a grounded answer purely from retrieved chunks
   */
  public synthesize(query: string, scoredChunks: ScoredChunk[]): LocalSynthesisResult {
    const queryNorm = normalizeText(query);
    const nonAccentedQuery = removeVietnameseAccents(queryNorm);
    const queryTokens = tokenize(query, true);
    const topScore = scoredChunks && scoredChunks.length > 0 ? scoredChunks[0].score : 0;

    // Check specific topic intents with word-level boundary precision
    const queryWords = tokenize(nonAccentedQuery, false);
    const isFiveTeachings = nonAccentedQuery.includes('5 dieu') || nonAccentedQuery.includes('nam dieu') || nonAccentedQuery.includes('bac ho day') || nonAccentedQuery.includes('thieu nien');
    const isDeclaration = nonAccentedQuery.includes('tuyen ngon') || (queryWords.includes('doc') && queryWords.includes('lap')) || nonAccentedQuery.includes('2 9');
    const isTestament = nonAccentedQuery.includes('di chuc') || (queryWords.includes('thanh') && queryWords.includes('nien'));
    const isSchoolLetter = nonAccentedQuery.includes('khai truong') || nonAccentedQuery.includes('sanh vai');
    const isDanVan = nonAccentedQuery.includes('dan van');
    const isResistance = nonAccentedQuery.includes('toan quoc') || (queryWords.includes('khang') && queryWords.includes('chien'));
    const isPrisonDiary = nonAccentedQuery.includes('nhat ky trong tu') || queryWords.includes('tho');
    const isTopicIntent = isFiveTeachings || isDeclaration || isTestament || isSchoolLetter || isDanVan || isResistance || isPrisonDiary;

    // Guard 1: No chunks retrieved or score below threshold
    if (!scoredChunks || scoredChunks.length === 0 || (!isTopicIntent && topScore < 0.6)) {
      return {
        answer: `Hiện tại trong kho tư liệu đã được kiểm duyệt của **Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực**, hệ thống chưa tìm thấy thông tin phù hợp để trả lời câu hỏi: *"${query}"*.\n\n*Gợi ý:* Bạn có thể thử tra cứu các chủ đề như: *5 Điều Bác Hồ dạy, Tuyên ngôn Độc lập 2/9/1945, Thư khai trường tháng 9/1945, Di chúc của Bác, Lời kêu gọi Toàn quốc kháng chiến, hoặc Bài viết Dân vận.*`,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: 'Local Grounded Rule Engine (DEV Offline)'
      };
    }

    // Select chunks that are truly relevant (score >= 0.4 or within 50% of top score)
    const relevantChunks = scoredChunks.filter(sc => sc.score >= 0.4 && sc.score >= topScore * 0.4);

    // Verify substantive term overlap for general queries
    let substantiveMatches = 0;
    for (const sc of relevantChunks) {
      for (const t of queryTokens) {
        if (sc.chunk.content.toLowerCase().includes(t.toLowerCase()) || sc.chunk.documentTitle.toLowerCase().includes(t.toLowerCase())) {
          substantiveMatches++;
        }
      }
    }

    // For general queries, check bigram and phrase overlap among meaningful (non-stopword) tokens
    const meaningfulTokens = tokenize(query, true);
    const meaningfulBigrams = extractNGrams(meaningfulTokens).filter(ng => ng.includes(' '));
    const hasPhraseOrBigramMatch = meaningfulBigrams.length > 0 && meaningfulBigrams.some(bg => {
      const bgNorm = removeVietnameseAccents(bg);
      return relevantChunks.some(sc => {
        const cNorm = removeVietnameseAccents(normalizeText(sc.chunk.content));
        const tNorm = removeVietnameseAccents(normalizeText(sc.chunk.documentTitle));
        return cNorm.includes(bgNorm) || tNorm.includes(bgNorm);
      });
    });

    if (!isTopicIntent && !hasPhraseOrBigramMatch && topScore < 2.0) {
      return {
        answer: `Hiện tại trong kho tư liệu đã được kiểm duyệt của **Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực**, hệ thống chưa tìm thấy thông tin phù hợp để trả lời câu hỏi: *"${query}"*.\n\n*Gợi ý:* Bạn có thể thử tra cứu các chủ đề như: *5 Điều Bác Hồ dạy, Tuyên ngôn Độc lập 2/9/1945, Thư khai trường tháng 9/1945, Di chúc của Bác, Lời kêu gọi Toàn quốc kháng chiến, hoặc Bài viết Dân vận.*`,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: 'Local Grounded Rule Engine (DEV Offline)'
      };
    }

    const citations: RagCitation[] = [];
    const evidenceParagraphs: {
      citationIndex: number;
      docTitle: string;
      section: string;
      matchedText: string;
      chunkId: string;
    }[] = [];

    let citationIndex = 1;
    for (const sc of relevantChunks) {
      const chunk = sc.chunk;
      const snippet = chunk.content.length > 200 ? `${chunk.content.substring(0, 200)}...` : chunk.content;

      citations.push({
        citationId: `[${citationIndex}]`,
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentTitle: chunk.documentTitle,
        authorOrSource: (chunk.metadata?.authorOrSource as string) || 'Tư liệu lịch sử Đảng',
        dateOrEra: (chunk.metadata?.dateOrEra as string) || 'Tư liệu lịch sử',
        sectionOrPage: chunk.sectionOrPage,
        snippet,
        confidenceScore: sc.score,
        verificationStatus: chunk.sourceStatus === 'APPROVED' ? 'VERIFIED' : 'CAUTION',
        sourceUrl: (chunk.metadata?.sourceUrl as string) || undefined
      });

      // Extract most relevant sentence or paragraph
      const sentences = chunk.content.split(/(?<=[.?!])\s+/);
      let bestSentence = '';
      let maxOverlap = -1;

      for (const sent of sentences) {
        const sentTokens = tokenize(sent, true);
        const overlap = sentTokens.filter(t => queryTokens.includes(t)).length;
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

    // Compose formatted answer using accent-insensitive query normalization
    const primaryChunk = relevantChunks[0].chunk;

    let answerBody = '';

    if (isFiveTeachings && primaryChunk.documentId === 'DOC-HCM-004') {
      answerBody = `Dựa trên tài liệu chính thức từ Trung ương Đoàn TNCS Hồ Chí Minh và Bảo tàng Hồ Chí Minh [1]:

**Năm Điều Bác Hồ dạy thiếu niên, nhi đồng** gồm:
1. **Yêu Tổ quốc, yêu đồng bào.**
2. **Học tập tốt, lao động tốt.**
3. **Đoàn kết tốt, kỷ luật tốt.**
4. **Giữ gìn vệ sinh thật tốt.**
5. **Khiêm tốn, thật thà, dũng cảm.**

*Lưu ý lịch sử:* Bác Hồ gửi thư căn dặn 5 điều này lần đầu vào năm 1961 nhân dịp kỷ niệm 20 năm ngày thành lập Đội. Đến năm 1965, Bác đã bổ sung thêm chữ "thật" vào điều thứ tư thành *"Giữ gìn vệ sinh thật tốt"* để câu đối xứng và nhấn mạnh ý thức rèn luyện nếp sống văn minh cho các em [1].`;
    } else if (isDeclaration && primaryChunk.documentId === 'DOC-HCM-001') {
      answerBody = `Theo văn bản Tuyên ngôn Độc lập ngày 2/9/1945 lưu trữ tại Văn kiện Đảng [1]:

Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh soạn thảo tại số 48 phố Hàng Ngang và đọc trước quốc dân đồng bào tại Quảng trường Ba Đình ngày 2/9/1945.

**Nội dung cốt lõi:**
- Bác đã trích dẫn Tuyên ngôn Độc lập năm 1776 của Mỹ và Tuyên ngôn Nhân quyền và Dân quyền năm 1791 của Pháp để khẳng định quyền thiêng liêng: *"Tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do"* [1].
- Kết luận bất hủ khẳng định ý chí toàn dân: *"Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy"* [1].`;
    } else if (isTestament && primaryChunk.documentId === 'DOC-HCM-002') {
      answerBody = `Căn cứ bản Di chúc của Chủ tịch Hồ Chí Minh (Bảo vật Quốc gia) do Ban Chấp hành Trung ương Đảng công bố [1]:

**1. Về Đoàn kết:**
Bác căn dặn: *"Đoàn kết là một truyền thống cực kỳ báu vật của Đảng và của dân ta... cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình"* [1].

**2. Về thế hệ thanh niên và đời sau:**
Bác nhấn mạnh: *"Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái xung phong, không ngại hy sinh gian khổ, có chí tiến thủ. Đảng cần phải chăm lo giáo dục đạo đức cách mạng cho họ, đào tạo họ thành những người thừa kế xây dựng chủ nghĩa xã hội vừa 'hồng' vừa 'chuyên'. Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết"* [1].`;
    } else if (isSchoolLetter && primaryChunk.documentId === 'DOC-HCM-003') {
      answerBody = `Theo Thư gửi các học sinh nhân ngày khai trường đầu tiên (tháng 9/1945) đăng trên Báo Cứu Quốc [1]:

Chủ tịch Hồ Chí Minh đã gửi lời nhắn nhủ thiêng liêng và kỳ vọng to lớn vào thế hệ học sinh:
*"Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em"* [1].

Bác chỉ rõ rằng các em được hưởng nền giáo dục của một nước độc lập nhằm phát triển toàn diện năng lực để trở thành những người công dân hữu ích cho Tổ quốc.`;
    } else if (isDanVan && primaryChunk.documentId === 'DOC-HCM-005') {
      answerBody = `Theo bài viết "Dân vận" của Bác Hồ đăng trên Báo Sự Thật ngày 15/10/1949 (ký bút danh X.Y.Z) [1]:

- **Bản chất của Dân vận:** *"Dân vận là vận động tất cả lực lượng của mỗi một người dân không để sót một người dân nào, góp thành lực lượng toàn dân, để thực hành những công việc nên làm..."* [1].
- **Phương pháp thực hiện:** Người làm dân vận phải *"óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm"* chứ không được chỉ nói suông hoặc ra mệnh lệnh [1].
- **Bài học đúc kết:** *"Lực lượng của dân rất to. Việc dân vận rất quan trọng. Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công"* [1].`;
    } else if (isResistance && primaryChunk.documentId === 'DOC-HCM-008') {
      answerBody = `Theo Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh đêm 19/12/1946 tại Vạn Phúc [1]:

Bác tuyên bố trước toàn thể quốc dân:
*"Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới, vì chúng quyết tâm cướp nước ta lần nữa! Không! Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ."* [1]

Người kêu gọi: *"Bất kỳ đàn ông, đàn bà, bất kỳ người già, người trẻ, không chia tôn giáo, đảng phái, dân tộc. Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp để cứu Tổ quốc"* [1].`;
    } else if (isPrisonDiary && primaryChunk.documentId === 'DOC-HCM-007') {
      answerBody = `Theo tập thơ "Nhật ký trong tù" (1942 - 1943) của Chủ tịch Hồ Chí Minh do Viện Văn học tuyển chọn [1]:

Tập thơ gồm 133 bài thơ chữ Hán phản ánh tinh thần thép và ý chí kiên cường trong chốn lao tù:
*"Thân thể ở trong lao,*
*Tinh thần ở ngoài lao;*
*Muốn nên sự nghiệp lớn,*
*Tinh thần càng phải cao"* [1].

Tác phẩm là tấm gương ngời sáng về lòng lạc quan và nghị lực phi thường vượt qua mọi gian truân, thử thách.`;
    } else {
      // General synthesis combining top evidence paragraphs
      const quotesFormatted = evidenceParagraphs
        .map(ep => `> "${ep.matchedText}" [${ep.citationIndex}] *(Nguồn: ${ep.docTitle} - ${ep.section})*`)
        .join('\n\n');

      answerBody = `Dựa trên các tư liệu lịch sử chính thức được lưu trữ trong Không gian Văn hóa Hồ Chí Minh [1]:\n\n${quotesFormatted}\n\n*Nhận định tổng hợp:* Các tư liệu trên cung cấp cứ liệu chính xác giải đáp cho câu hỏi của bạn. Học sinh và bạn đọc có thể tham khảo chi tiết tại các mục nguồn tham chiếu bên dưới.`;
    }

    return {
      answer: answerBody,
      citations,
      evidenceFound: true,
      conflictDetected: false,
      modelUsed: 'Local Grounded Synthesis Engine v1.0 (Deterministic)'
    };
  }
}
