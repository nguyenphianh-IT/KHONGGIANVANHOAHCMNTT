const fs = require('fs');
const path = require('path');

const targetStaging = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_13/PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md');
const targetDocs = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const linesBefore = content.split('\n').length;
  
  content = content.replace(
    '| 7 | **Tự đối soát số dòng Manifest (Manifest own line count)** | **PASS** | Tệp Manifest tự kê khai số dòng của chính nó khớp chính xác theo quy chuẩn `split(\'\\n\').length` (151 dòng). | Điểm bất động được giải quyết bằng thuật toán lặp hội tụ; giải thích rõ chênh lệch 1 dòng so với `splitlines()` do newline kết thúc tệp. |',
    '| 7 | **Tự đối soát số dòng Manifest (Manifest own line count)** | **PASS** | Tệp Manifest tự kê khai số dòng của chính nó khớp chính xác theo quy chuẩn `split(\'\\n\').length` (150 dòng; 149 dòng theo `splitlines()`). Giá trị sử dụng trong Self-Check là 150 theo R4.12-01. | Điểm bất động được giải quyết bằng thuật toán lặp hội tụ; giải thích rõ chênh lệch 1 dòng do newline kết thúc tệp. |'
  );
  
  const linesAfter = content.split('\n').length;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}: lines before=${linesBefore}, lines after=${linesAfter}`);
}

fixFile(targetStaging);
fixFile(targetDocs);
