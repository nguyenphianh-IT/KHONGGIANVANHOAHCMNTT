const fs = require('fs');
const path = require('path');

const targetStr = '- **Ranh giới bất biến:** Tuân thủ tuyệt đối Zero Schema Mutation, Zero Source Code Mutation, Zero Git Mutation.';
const replacementStr = '- **Ranh giới bất biến:** Project Team báo cáo đã tuân thủ các ranh giới Zero Mutation trong phạm vi Round 3.13. Các cam kết này vẫn ở trạng thái PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED; chưa được kiểm chứng độc lập trên repository, database hoặc runtime.';

const filesToUpdate = [
  'docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_14/PHASE_0B_2_3_ROUND3_13_CHANGELOG.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_13_CHANGELOG.md'
];

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldLines = content.split('\n').length;
    if (!content.includes(targetStr)) {
      console.error(`Target string not found in ${filePath}`);
      process.exit(1);
    }
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(filePath, content, 'utf8');
    const newLines = content.split('\n').length;
    console.log(`Updated ${filePath}: lines before=${oldLines}, lines after=${newLines}`);
    if (oldLines !== newLines) {
      console.error(`Line count changed in ${filePath}! Expected ${oldLines}, got ${newLines}`);
      process.exit(1);
    }
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
});
console.log('R4.13-01 targeted fix successfully applied!');
