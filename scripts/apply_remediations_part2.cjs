const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

function updateFile(fileName, replacements) {
  const filePath = path.join(stagingDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      console.log(`Updated ${fileName} with "${target.substring(0, 30)}..."`);
    } else {
      console.warn(`[WARN] Target not found in ${fileName}: "${target}"`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

updateFile('PHASE_0B_2_3_ROUND3_6_CHANGELOG.md', [
  [
    'sự chính xác của số liệu thống kê và tự cấp số liệu bàn giao, sẵn sàng chuyển giao thẩm tra độc lập.',
    'sự chính xác của số liệu thống kê và ghi nhận thông số archive bàn giao, sẵn sàng chuyển giao thẩm tra độc lập.'
  ]
]);

updateFile('PHASE_0B_2_3_ROUND3_5_REMEDIATION_REPORT.md', [
  [
    'Thực hiện giải quyết dứt điểm các phát hiện kiểm toán Round 4.4',
    'Thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.4'
  ]
]);

updateFile('PHASE_0B_2_3_DOCUMENTATION_DELTA_CHANGELOG_ROUND3_3.md', [
  [
    'Khắc phục triệt để lỗi cấu trúc Markdown',
    'Khắc phục lỗi cấu trúc Markdown'
  ],
  [
    'giải quyết dứt điểm các lỗi kỹ thuật',
    'cập nhật tài liệu theo các lỗi kỹ thuật'
  ]
]);
