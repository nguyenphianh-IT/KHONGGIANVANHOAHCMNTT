import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Di chúc của Chủ tịch Hồ Chí Minh công bố năm 1969</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Times New Roman', Times, 'Liberation Serif', serif;
    background-color: #ffffff;
    color: #111827;
  }
  .page {
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    page-break-inside: avoid;
    position: relative;
    padding: 30mm 28mm 25mm 28mm;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .page:last-child {
    page-break-after: auto;
  }
  
  /* Trang 1: Bìa & Khái quát xuất xứ */
  .cover-header-title {
    text-align: center;
    color: #1e3a8a;
    font-size: 26pt;
    font-weight: bold;
    line-height: 1.35;
    margin-top: 15mm;
    margin-bottom: 5mm;
  }
  .cover-url {
    text-align: center;
    color: #2563eb;
    font-size: 9pt;
    font-family: Arial, sans-serif;
    margin-bottom: 25mm;
    word-break: break-all;
  }
  .cover-lead-text {
    text-align: justify;
    font-size: 13.5pt;
    line-height: 1.8;
    margin-bottom: 18mm;
    text-indent: 10mm;
    color: #1f2937;
  }
  .cover-main-title {
    text-align: center;
    font-size: 17pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3mm;
    color: #111827;
  }
  .cover-sub-date {
    text-align: center;
    font-size: 13pt;
    font-style: italic;
    margin-bottom: 14mm;
    color: #374151;
  }
  .cover-country-header {
    text-align: center;
    margin-bottom: 18mm;
  }
  .cover-country-title {
    font-size: 14pt;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .cover-country-motto {
    font-size: 13pt;
    font-weight: bold;
    margin-top: 1.5mm;
  }
  .cover-opening-quote {
    text-align: justify;
    font-size: 13.5pt;
    line-height: 1.8;
    text-indent: 10mm;
    font-style: normal;
  }

  /* Header văn bản trên các trang 2-6 */
  .page-header-block {
    text-align: center;
    margin-bottom: 8mm;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4mm;
  }
  .page-header-org {
    font-size: 10pt;
    text-transform: uppercase;
    color: #4b5563;
    letter-spacing: 0.5px;
    margin-bottom: 1.5mm;
  }
  .page-header-date {
    font-size: 11pt;
    font-style: italic;
    color: #374151;
  }
  .page-title {
    text-align: center;
    font-size: 17pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 4mm;
    margin-bottom: 6mm;
    color: #111827;
  }
  .section-title {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 6mm;
    margin-bottom: 3.5mm;
    color: #111827;
  }
  p {
    font-size: 13pt;
    line-height: 1.75;
    text-align: justify;
    text-indent: 10mm;
    margin-top: 0;
    margin-bottom: 3.5mm;
    color: #1f2937;
  }
  .poem-box {
    margin: 4mm auto;
    text-align: center;
    font-style: italic;
    font-weight: bold;
    font-size: 13.5pt;
    line-height: 1.8;
    color: #1e3a8a;
  }
  .signature-block {
    margin-top: 8mm;
    text-align: right;
    padding-right: 15mm;
  }
  .signature-date {
    font-size: 12.5pt;
    font-style: italic;
    margin-bottom: 3mm;
  }
  .signature-name {
    font-size: 15pt;
    font-weight: bold;
    letter-spacing: 1.5px;
  }

  /* Số trang ở đáy */
  .page-footer {
    text-align: center;
    font-size: 11pt;
    color: #4b5563;
    padding-top: 4mm;
    border-top: 1px solid #f3f4f6;
  }
</style>
</head>
<body>

  <!-- TRANG 1: BÌA & XUẤT XỨ BẢN CÔNG BỐ NĂM 1969 -->
  <div class="page">
    <div>
      <div class="cover-header-title">
        Toàn văn Di chúc<br>
        của Chủ tịch Hồ Chí Minh<br>
        công bố năm 1969
      </div>
      <div class="cover-url">
        http://www.bqllang.gov.vn/chu-tich-ho-chi-minh/tac-pham/1588-toan-van-di-chuc-c-a-ch-t-ch-h-ch-minh-cong-b-nam-1969.html
      </div>

      <div class="cover-lead-text">
        Trong Lễ tang của Chủ tịch Hồ Chí Minh, Đồng chí Lê Duẩn – Bí thư Thứ nhất Ban Chấp hành Trung ương Đảng Lao động Việt Nam đọc lời điếu và công bố Di chúc của Người.
      </div>

      <div class="cover-main-title">
        DI CHÚC CỦA CHỦ TỊCH HỒ CHÍ MINH
      </div>
      <div class="cover-sub-date">
        (công bố năm 1969)
      </div>

      <div class="cover-country-header">
        <div class="cover-country-title">VIỆT NAM DÂN CHỦ CỘNG HOÀ</div>
        <div class="cover-country-motto">Độc lập - Tự do - Hạnh phúc</div>
      </div>

      <div class="cover-opening-quote">
        Cuộc chống Mỹ, cứu nước của nhân dân ta dù phải kinh qua gian khổ, hy sinh nhiều hơn nữa, song nhất định thắng lợi hoàn toàn.
      </div>
    </div>
    <div class="page-footer">1</div>
  </div>

  <!-- TRANG 2: LỜI MỞ ĐẦU NĂM 1969 -->
  <div class="page">
    <div>
      <div class="page-header-block">
        <div class="page-header-org">VIỆT NAM DÂN CHỦ CỘNG HOÀ &bull; ĐỘC LẬP - TỰ DO - HẠNH PHÚC</div>
        <div class="page-header-date">Hà Nội, ngày 10 tháng 5 năm 1969</div>
      </div>

      <div class="page-title">DI CHÚC</div>

      <p>
        Năm nay, tôi vừa 79 tuổi, đã là lớp người "xưa nay hiếm" nhưng tinh thần, đầu óc vẫn rất minh mẫn, tuy sức khoẻ có kém so với vài năm trước đây. Khi người ta đã ngoại 70 xuân, thì tuổi tác càng cao, sức khoẻ càng thấp. Điều đó cũng bình thường.
      </p>
      <p>
        Nhưng ai đoán biết tôi còn phục vụ cách mạng, phục vụ Tổ quốc, phục vụ nhân dân được bao lâu nữa?
      </p>
      <p>
        Vì vậy, tôi để lại mấy lời này, chỉ nói tóm tắt vài việc thôi, phòng khi tôi sẽ đi gặp cụ Các Mác, cụ Lênin và các vị cách mạng đàn anh khác, thì đồng bào cả nước, đồng chí trong Đảng và bầu bạn khắp nơi đều khỏi cảm thấy đột ngột.
      </p>
      <p>
        Tôi có ý định đến ngày đó, tôi sẽ đi khắp hai miền Nam Bắc, để chúc mừng đồng bào, cán bộ và chiến sĩ anh hùng; thăm hỏi các cụ phụ lão, các cháu thanh niên và nhi đồng yêu quý của chúng ta.
      </p>
      <p>
        Kế theo đó, tôi sẽ thay mặt nhân dân ta đi thăm và cảm ơn các nước anh em trong phe xã hội chủ nghĩa, và các nước bầu bạn khắp năm châu đã tận tình ủng hộ và giúp đỡ cuộc chống Mỹ, cứu nước của nhân dân ta.
      </p>
    </div>
    <div class="page-footer">2</div>
  </div>

  <!-- TRANG 3: TRƯỚC HẾT NÓI VỀ ĐẢNG -->
  <div class="page">
    <div>
      <div class="page-header-block">
        <div class="page-header-org">KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH &bull; TRƯỜNG THCS NGUYỄN TRUNG TRỰC</div>
      </div>

      <div class="section-title">TRƯỚC HẾT NÓI VỀ ĐẢNG</div>

      <p>
        Nhờ đoàn kết chặt chẽ, một lòng một dạ phục vụ giai cấp, phục vụ nhân dân, phục vụ Tổ quốc, cho nên từ ngày thành lập đến nay, Đảng ta đã đoàn kết, lãnh đạo toàn dân ta hăng hái đấu tranh tiến từ thắng lợi này đến thắng lợi khác.
      </p>
      <p>
        <strong>Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta.</strong> Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình.
      </p>
      <p>
        Trong Đảng thực hành dân chủ rộng rãi, thường xuyên và nghiêm chỉnh tự phê bình và phê bình là cách tốt nhất để củng cố và phát triển sự đoàn kết và thống nhất của Đảng. Phải có tình đồng chí thương yêu lẫn nhau.
      </p>
      <p>
        Đảng ta là một Đảng cầm quyền. Mỗi đảng viên và cán bộ phải thật sự thấm nhuần đạo đức cách mạng, thật sự cần kiệm liêm chính, chí công vô tư. Phải giữ gìn Đảng ta thật trong sạch, phải xứng đáng là người lãnh đạo, là người đầy tớ thật trung thành của nhân dân.
      </p>
    </div>
    <div class="page-footer">3</div>
  </div>

  <!-- TRANG 4: BỒI DƯỠNG THẾ HỆ TRẺ & CHĂM LO NHÂN DÂN -->
  <div class="page">
    <div>
      <div class="page-header-block">
        <div class="page-header-org">KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH &bull; TRƯỜNG THCS NGUYỄN TRUNG TRỰC</div>
      </div>

      <div class="section-title">VỀ ĐOÀN VIÊN VÀ THANH NIÊN</div>
      <p>
        Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái xung phong, không ngại khó khăn, có chí tiến thủ. Đảng cần phải chăm lo giáo dục đạo đức cách mạng cho họ, đào tạo họ thành những người thừa kế xây dựng chủ nghĩa xã hội vừa "hồng" vừa "chuyên".
      </p>
      <p>
        <strong>Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết.</strong>
      </p>

      <div class="section-title" style="margin-top: 8mm;">VỀ NHÂN DÂN LAO ĐỘNG</div>
      <p>
        Nhân dân lao động ta ở miền xuôi cũng như ở miền núi, đã bao đời chịu đựng gian khổ, bị chế độ phong kiến và thực dân áp bức bóc lột, lại kinh qua nhiều năm chiến tranh. Tuy vậy, nhân dân ta rất anh hùng, dũng cảm, hăng hái, cần cù. Từ ngày có Đảng, nhân dân ta luôn luôn đi theo Đảng, rất trung thành với Đảng.
      </p>
      <p>
        Đảng cần phải có kế hoạch thật tốt để phát triển kinh tế và văn hóa, nhằm không ngừng nâng cao đời sống của nhân dân.
      </p>
    </div>
    <div class="page-footer">4</div>
  </div>

  <!-- TRANG 5: KHÁNG CHIẾN CHỐNG MỸ & PHONG TRÀO QUỐC TẾ -->
  <div class="page">
    <div>
      <div class="page-header-block">
        <div class="page-header-org">KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH &bull; TRƯỜNG THCS NGUYỄN TRUNG TRỰC</div>
      </div>

      <div class="section-title">VỀ CUỘC KHÁNG CHIẾN CHỐNG MỸ, CỨU NƯỚC</div>
      <p>
        Cuộc kháng chiến chống Mỹ, cứu nước có thể còn kéo dài. Đồng bào ta có thể phải hy sinh nhiều của, nhiều người. Dù sao, chúng ta phải quyết tâm đánh giặc Mỹ đến thắng lợi hoàn toàn.
      </p>

      <div class="poem-box">
        "Còn non, còn nước, còn người,<br>
        Thắng giặc Mỹ, ta sẽ xây dựng hơn mười ngày nay!"
      </div>

      <p>
        Dù khó khăn gian khổ đến mấy, nhân dân ta nhất định sẽ hoàn toàn thắng lợi. Đế quốc Mỹ nhất định phải cút khỏi nước ta. Tổ quốc ta nhất định sẽ thống nhất. Đồng bào Nam Bắc nhất định sẽ sum họp một nhà.
      </p>

      <div class="section-title" style="margin-top: 8mm;">VỀ PHONG TRÀO CỘNG SẢN THẾ GIỚI</div>
      <p>
        Là một người suốt đời phục vụ cách mạng, tôi càng tự hào với sự lớn mạnh của phong trào cộng sản và công nhân quốc tế bao nhiêu, thì tôi càng đau lòng bấy nhiêu vì sự bất hoà hiện nay giữa các đảng anh em!
      </p>
      <p>
        Tôi mong rằng Đảng ta sẽ ra sức hoạt động, góp phần đắc lực vào việc khôi phục lại khối đoàn kết giữa các đảng anh em trên nền tảng chủ nghĩa Mác - Lênin và chủ nghĩa quốc tế vô sản, có lý, có tình.
      </p>
    </div>
    <div class="page-footer">5</div>
  </div>

  <!-- TRANG 6: VIỆC RIÊNG VÀ ĐIỀU MONG MUỐN CUỐI CÙNG -->
  <div class="page">
    <div>
      <div class="page-header-block">
        <div class="page-header-org">KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH &bull; TRƯỜNG THCS NGUYỄN TRUNG TRỰC</div>
      </div>

      <div class="section-title">VỀ VIỆC RIÊNG</div>
      <p>
        Suốt đời tôi hết lòng hết sức phục vụ Tổ quốc, phục vụ cách mạng, phục vụ nhân dân. Nay dù phải từ biệt thế giới này, tôi không có điều gì phải hối hận, chỉ tiếc là tiếc rằng không được phục vụ lâu hơn nữa, nhiều hơn nữa.
      </p>
      <p>
        Sau khi tôi đã qua đời, chớ nên tổ chức điếu phúng linh đình, để khỏi lãng phí thì giờ và tiền bạc của nhân dân.
      </p>

      <div class="section-title" style="margin-top: 6mm;">ĐIỀU MONG MUỐN CUỐI CÙNG</div>
      <p>
        Cuối cùng, tôi để lại muôn vàn tình thân yêu cho toàn dân, toàn Đảng, cho toàn thể bộ đội, cho các cháu thanh niên và nhi đồng. Tôi cũng gửi lời chào thân ái đến các đồng chí, các bầu bạn, và các cháu thanh niên, nhi đồng quốc tế.
      </p>
      <p>
        <strong>Điều mong muốn cuối cùng của tôi là:</strong> Toàn Đảng, toàn dân ta đoàn kết phấn đấu, xây dựng một nước Việt Nam hoà bình, thống nhất, độc lập, dân chủ và giàu mạnh, và góp phần xứng đáng vào sự nghiệp cách mạng thế giới.
      </p>

      <div class="signature-block">
        <div class="signature-date">Hà Nội, ngày 10 tháng 5 năm 1969</div>
        <div class="signature-name">HỒ CHÍ MINH</div>
      </div>
    </div>
    <div class="page-footer">6</div>
  </div>

</body>
</html>
`;

const htmlPath = path.resolve('scripts/authentic_di_chuc.html');
const pdfPath = path.resolve('public/documents/di-chuc-chu-tich-ho-chi-minh.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Wrote HTML to:', htmlPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Running:', cmd);
execSync(cmd);

const stats = fs.statSync(pdfPath);
console.log('Generated authentic PDF successfully! File size:', stats.size, 'bytes');
