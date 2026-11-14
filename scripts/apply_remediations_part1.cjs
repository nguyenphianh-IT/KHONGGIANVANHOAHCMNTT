const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

function updateFile(fileName, replacements) {
  const filePath = path.join(stagingDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      count++;
    } else {
      console.warn(`[WARN] Target not found in ${fileName}: "${target.substring(0, 40)}..."`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${fileName}: ${count} replacements applied.`);
}

// 1. PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md
updateFile('PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md', [
  [
    'Nhằm giải quyết dứt điểm phát hiện kiểm toán R4.1-04 về ranh giới cách ly kiểm dịch (Quarantine Boundary) và phân phối công khai (Public Delivery), tài liệu thiết lập quy chuẩn kiến trúc topology lưu trữ và ranh giới tin cậy (Trust Boundary) như sau:',
    'Nhằm cập nhật đặc tả thiết kế theo phát hiện kiểm toán R4.1-04 về ranh giới cách ly kiểm dịch (Quarantine Boundary) và phân phối công khai (Public Delivery), tài liệu thiết lập quy chuẩn kiến trúc topology lưu trữ và ranh giới tin cậy (Trust Boundary) như sau:'
  ]
]);

// 2. PHASE_0B_2_3_ROUND3_7_HANDOVER.md
updateFile('PHASE_0B_2_3_ROUND3_7_HANDOVER.md', [
  [
    '### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (ARCHIVE SEALING METRICS - R4.6-01 RECONCILED)\n- **Tên gói lưu trữ bàn giao:** `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip`\n- **Kích thước byte chính xác:** **180,683 bytes**\n- **Mã băm SHA-256 chính xác:** `76387DC5119FF5C1F032822B7509A4D1A0D66DF2F406086E2FB7AE0257B43939`\n- **Số lượng tệp lưu trữ (Entry count):** **39 entries** (100% định dạng Markdown .md)\n- **Kết quả kiểm tra toàn vẹn bit (CRC result):** **PASS** (Không phát hiện entry lỗi, 100% tệp giải nén thành công)',
    '### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (ARCHIVE SEALING METRICS – ROUND 4.7 INDEPENDENT AUDIT VERIFIED)\n- **Tên gói lưu trữ bàn giao:** `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip`\n- **Kích thước byte chính xác:** **178,643 bytes** (Independent Audit Round 4.7 verified)\n- **Mã băm SHA-256 chính xác:** `081BAD05D45BFF5920D9C136CAD9E7797F3D0470817D8687142B92225AAD2A9A` (Independent Audit Round 4.7 verified)\n- **Số lượng tệp lưu trữ (Entry count):** **39 entries** (100% định dạng Markdown .md)\n- **Kết quả kiểm tra toàn vẹn bit (CRC result):** **PASS** (testzip không phát hiện lỗi, 100% tệp giải nén thành công)'
  ],
  [
    '4. `PHASE_0B_2_3_ROUND3_7_HANDOVER.md` (Biên bản bàn giao tự cấp số liệu độc lập Round 3.7).',
    '4. `PHASE_0B_2_3_ROUND3_7_HANDOVER.md` (Biên bản bàn giao Round 3.7; thông số archive đối chiếu theo Independent Audit Round 4.7).'
  ],
  [
    '- Biên bản bàn giao `ROUND3_7_HANDOVER.md` tự cấp trực tiếp giá trị kích thước byte và mã băm SHA-256 của gói lưu trữ `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip`.',
    '- Thông số kích thước byte và mã băm SHA-256 của gói lưu trữ `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip` được ghi nhận theo kết quả xác minh thực tế của Independent Audit Round 4.7.'
  ],
  [
    '*(Hồ sơ tài liệu Markdown đã khắc phục toàn diện 5 phát hiện R4.6-01 đến R4.6-05, tự cấp trực tiếp số liệu bàn giao, phân định rạch ròi 2 chiều Quality Gate, gắn nhãn proposed cho Bước 6 ma trận workflow, chuẩn hóa thuật ngữ tính độc lập và sẵn sàng cho kiểm toán độc lập Round 4.7).*',
    '*(Hồ sơ tài liệu Markdown đã được Project Team cập nhật theo 5 phát hiện R4.6-01 đến R4.6-05, thông số archive được đối chiếu theo kết quả Independent Audit Round 4.7, phân định 2 chiều Quality Gate, gắn nhãn proposed cho Bước 6 ma trận workflow, chuẩn hóa thuật ngữ và sẵn sàng bàn giao).*'
  ]
]);

// 3. PHASE_0B_2_3_ROUND3_7_REMEDIATION_REPORT.md
updateFile('PHASE_0B_2_3_ROUND3_7_REMEDIATION_REPORT.md', [
  [
    'Thực hiện giải quyết dứt điểm các phát hiện kiểm toán Round 4.6 ở cấp độ tài liệu Markdown (**Documentation-Only**):',
    'Thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.6 ở cấp độ tài liệu Markdown (**Documentation-Only**):'
  ],
  [
    '1. **Khắc phục triệt để tính tự cấp của Biên bản bàn giao (R4.6-01):** Ghi nhận trực tiếp giá trị kích thước byte chính xác và chuỗi SHA-256 vào tài liệu bàn giao mà không dùng câu mô tả phương pháp.',
    '1. **Cập nhật thông số gói bàn giao (R4.6-01):** Ghi nhận trực tiếp giá trị kích thước byte chính xác và chuỗi SHA-256 vào tài liệu bàn giao mà không dùng câu mô tả phương pháp (được đối chiếu theo kết quả Independent Audit Round 4.7).'
  ],
  [
    'nhất quán tuyệt đối;',
    'nhất quán;'
  ],
  [
    '*(Hồ sơ tài liệu Markdown đã khắc phục trọn vẹn 5 phát hiện R4.6-01 đến R4.6-05, tự cấp độc lập số liệu bàn giao, chuẩn hóa lập luận QG-10, gắn nhãn proposed trực tiếp tại Bước 6 của ma trận workflow, chuẩn hóa thuật ngữ tính độc lập và sẵn sàng chuyển giao thẩm tra độc lập Round 4.7).*',
    '*(Hồ sơ tài liệu Markdown đã được Project Team cập nhật theo 5 phát hiện R4.6-01 đến R4.6-05, thông số archive được đối chiếu theo kết quả Independent Audit Round 4.7, phân định 2 chiều Quality Gate, gắn nhãn proposed trực tiếp tại Bước 6 của ma trận workflow, chuẩn hóa thuật ngữ và chờ thẩm tra độc lập).*'
  ],
  [
    '## 6. PHÁN QUYẾT HIỆU CHỈNH TÀI LIỆU VÒNG 3.7\n\n- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  \n  **`DOCUMENTATION REMEDIATION ACCEPTED`**',
    '## 6. PHÁN QUYẾT HIỆU CHỈNH TÀI LIỆU VÒNG 3.7 (PROJECT TEAM SELF-ASSESSMENT)\n\n- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  \n  **`DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT`**'
  ]
]);

// 4. PHASE_0B_2_3_ROUND3_7_CHANGELOG.md
updateFile('PHASE_0B_2_3_ROUND3_7_CHANGELOG.md', [
  [
    'Hiệu chỉnh Vòng 3.7 tập trung giải quyết toàn diện 5 phát hiện (R4.6-01 đến R4.6-05) từ Báo cáo kiểm toán độc lập Round 4.6:',
    'Hiệu chỉnh Vòng 3.7 tập trung cập nhật tài liệu theo 5 phát hiện (R4.6-01 đến R4.6-05) từ Báo cáo kiểm toán độc lập Round 4.6:'
  ],
  [
    '2. Thiết lập `ROUND3_7_HANDOVER.md` tự cấp trực tiếp giá trị kích thước byte và SHA-256 của gói ZIP Round 3.7 sau khi đóng gói.',
    '2. Thiết lập `ROUND3_7_HANDOVER.md` ghi nhận giá trị kích thước byte và SHA-256 của gói ZIP Round 3.7 đối chiếu theo kết quả xác minh của Independent Audit Round 4.7.'
  ],
  [
    '- **Kết quả hiệu chỉnh tài liệu:** `DOCUMENTATION REMEDIATION ACCEPTED` (ở cấp độ hồ sơ tài liệu do Project Team tự rà soát và hoàn thiện, sẵn sàng chuyển sang kiểm toán độc lập Round 4.7).',
    '- **Kết quả hiệu chỉnh tài liệu:** `DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT` (ở cấp độ hồ sơ tài liệu do Project Team tự rà soát và hoàn thiện, sẵn sàng chuyển sang kiểm toán độc lập Round 4.7).'
  ]
]);

// 5. PHASE_0B_2_3_ROUND3_7_FILE_MANIFEST.md
updateFile('PHASE_0B_2_3_ROUND3_7_FILE_MANIFEST.md', [
  [
    'giải quyết dứt điểm 5 phát hiện R4.6-01 đến R4.6-05.',
    'cập nhật tài liệu theo 5 phát hiện R4.6-01 đến R4.6-05.'
  ],
  [
    '| 36 | `PHASE_0B_2_3_ROUND3_7_HANDOVER.md` | 146 | New Deliverable R3.7 | **Tài liệu mới Vòng 3.7:** Biên bản bàn giao tự cấp số liệu độc lập Round 3.7 |',
    '| 36 | `PHASE_0B_2_3_ROUND3_7_HANDOVER.md` | 146 | New Deliverable R3.7 | **Tài liệu mới Vòng 3.7:** Biên bản bàn giao Round 3.7 (số liệu archive đối chiếu theo Independent Audit Round 4.7) |'
  ]
]);

// 6. PHASE_0B_2_3_ROUND3_6_HANDOVER.md, REPAIR_REPORT, FILE_MANIFEST
updateFile('PHASE_0B_2_3_ROUND3_6_HANDOVER.md', [
  [
    '4. `PHASE_0B_2_3_ROUND3_6_HANDOVER.md` (Biên bản bàn giao tự cấp số liệu độc lập Round 3.6).',
    '4. `PHASE_0B_2_3_ROUND3_6_HANDOVER.md` (Biên bản bàn giao Round 3.6; thông số archive do Project Team tự tính).'
  ],
  [
    '- Biên bản bàn giao `ROUND3_6_HANDOVER.md` tự cấp trực tiếp giá trị kích thước byte và mã băm SHA-256 của gói lưu trữ `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip`.',
    '- Biên bản bàn giao `ROUND3_6_HANDOVER.md` ghi nhận trực tiếp giá trị kích thước byte và mã băm SHA-256 của gói lưu trữ `PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip` do Project Team tự tính.'
  ],
  [
    'tự cấp số liệu độc lập',
    'ghi nhận thông số archive'
  ]
]);

updateFile('PHASE_0B_2_3_ROUND3_6_REMEDIATION_REPORT.md', [
  [
    'Thực hiện giải quyết dứt điểm các phát hiện kiểm toán Round 4.5',
    'Thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.5'
  ],
  [
    'tự cấp số liệu độc lập',
    'ghi nhận thông số archive'
  ]
]);

updateFile('PHASE_0B_2_3_ROUND3_6_FILE_MANIFEST.md', [
  [
    'giải quyết dứt điểm 6 phát hiện',
    'cập nhật tài liệu theo 6 phát hiện'
  ],
  [
    'tự cấp số liệu độc lập',
    'ghi nhận thông số archive'
  ]
]);

updateFile('PHASE_0B_2_3_ROUND3_6_CHANGELOG.md', [
  [
    'Tự cấp số liệu bàn giao độc lập (Self-Contained Handover): Ghi nhận trực tiếp kích thước byte chính xác và mã băm SHA-256 vào tài liệu bàn giao `PHASE_0B_2_3_ROUND3_6_HANDOVER.md` mà không dùng số liệu ước lượng hay dẫn chiếu ngoại vi.',
    'Ghi nhận trực tiếp thông số archive bàn giao (Self-Contained Handover): Ghi nhận trực tiếp kích thước byte chính xác và mã băm SHA-256 vào tài liệu bàn giao `PHASE_0B_2_3_ROUND3_6_HANDOVER.md` mà không dùng số liệu ước lượng hay dẫn chiếu ngoại vi.'
  ],
  [
    'không tự cấp số liệu chính xác độc lập.',
    'chưa ghi nhận số liệu chính xác trực tiếp trong biên bản bàn giao.'
  ]
]);
