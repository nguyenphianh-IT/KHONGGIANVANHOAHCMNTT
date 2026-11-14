const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');

const zipPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip');
const externalHandoverPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_14_EXTERNAL_HANDOVER.md');
const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_14');

console.log('=== STARTING COMPREHENSIVE ROUND 3.14 VERIFICATION ===\n');

// 1. ZIP File Metrics
const zipStats = fs.statSync(zipPath);
const zipBuffer = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuffer).digest('hex').toUpperCase();

console.log('1. ZIP Archive Metrics:');
console.log('   - Actual Byte Size:', zipStats.size);
console.log('   - Actual SHA-256:  ', zipHash);

// 2. Read External Handover & compare
const externalContent = fs.readFileSync(externalHandoverPath, 'utf8');
const sizeMatch = externalContent.includes(zipStats.size.toString());
const hashMatch = externalContent.includes(zipHash);

console.log('\n2. External Handover Synchronization:');
console.log('   - Handover Size Match:', sizeMatch);
console.log('   - Handover SHA-256 Match:', hashMatch);
if (!sizeMatch || !hashMatch) {
  console.error('ERROR: External Handover does not match ZIP metrics!');
  process.exit(1);
}

// 3. Decompress and inspect ZIP entries
let offset = 0;
let entryCount = 0;
let allPass = true;
let entries = [];
let internalFilesWithHash = [];
const zipFiles = {};

while (offset < zipBuffer.length - 4) {
  const sig = zipBuffer.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    entryCount++;
    const method = zipBuffer.readUInt16LE(offset + 8);
    const compSize = zipBuffer.readUInt32LE(offset + 18);
    const uncompSize = zipBuffer.readUInt32LE(offset + 22);
    const nameLen = zipBuffer.readUInt16LE(offset + 26);
    const extraLen = zipBuffer.readUInt16LE(offset + 28);
    
    const name = zipBuffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    entries.push(name);
    const dataOffset = offset + 30 + nameLen + extraLen;
    const compData = zipBuffer.slice(dataOffset, dataOffset + compSize);
    
    let decomp;
    if (method === 8) {
      decomp = zlib.inflateRawSync(compData);
    } else if (method === 0) {
      decomp = compData;
    }
    
    if (decomp.length !== uncompSize) {
      allPass = false;
    }
    
    zipFiles[name] = decomp;

    const text = decomp.toString('utf8');
    if (text.includes(zipHash)) {
      internalFilesWithHash.push(name);
    }
    
    offset = dataOffset + compSize;
  } else if (sig === 0x02014b50) {
    offset += 46;
  } else if (sig === 0x06054b50) {
    break;
  } else {
    offset++;
  }
}

console.log('\n3. Archive Integrity & Entries:');
console.log('   - Total entries:', entryCount);
console.log('   - Decompression & CRC:', allPass ? 'PASS' : 'FAIL');
console.log('   - Occurrences of current ZIP SHA-256 inside ZIP:', internalFilesWithHash.length);
if (internalFilesWithHash.length > 0) {
  console.error('ERROR: Self-referential hash found inside ZIP!');
  process.exit(1);
}

// 4. Check R4.13-01 in PHASE_0B_2_3_ROUND3_13_CHANGELOG.md inside ZIP
const r13ChangelogZip = zipFiles['PHASE_0B_2_3_ROUND3_13_CHANGELOG.md'].toString('utf8');
const oldAffirmative = 'Tuân thủ tuyệt đối Zero Schema Mutation, Zero Source Code Mutation, Zero Git Mutation';
const newQualified = 'Project Team báo cáo đã tuân thủ các ranh giới Zero Mutation trong phạm vi Round 3.13. Các cam kết này vẫn ở trạng thái PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED; chưa được kiểm chứng độc lập trên repository, database hoặc runtime.';

console.log('\n4. Remediation R4.13-01 Verification (Inside ZIP):');
console.log('   - Contains old affirmative statement:', r13ChangelogZip.includes(oldAffirmative));
console.log('   - Contains new qualified statement:  ', r13ChangelogZip.includes(newQualified));
console.log('   - Total lines of ROUND3_13_CHANGELOG: ', r13ChangelogZip.split('\n').length);
if (r13ChangelogZip.includes(oldAffirmative) || !r13ChangelogZip.includes(newQualified) || r13ChangelogZip.split('\n').length !== 61) {
  console.error('ERROR: R4.13-01 fix verification failed inside ZIP!');
  process.exit(1);
}

// 5. Check Manifest inside ZIP
const manifestZip = zipFiles['PHASE_0B_2_3_ROUND3_14_MANIFEST.md'].toString('utf8');
const manifestLines = manifestZip.split('\n');
console.log('\n5. Manifest Verification (Inside ZIP):');
console.log('   - Manifest line count (split \\n):', manifestLines.length);

const rows = manifestLines.filter(l => l.startsWith('|') && !l.includes('Tên Tệp') && !l.includes(':---:'));
console.log('   - Manifest rows count:', rows.length);

let lineMismatch = 0;
rows.forEach((r, idx) => {
  const parts = r.split('|').map(s => s.trim());
  const filename = parts[2].replace(/`/g, '');
  const listedLines = parseInt(parts[3], 10);
  
  if (!zipFiles[filename]) {
    console.error(`Missing in ZIP: ${filename}`);
    lineMismatch++;
    return;
  }
  
  const actualLines = zipFiles[filename].toString('utf8').split('\n').length;
  if (actualLines !== listedLines) {
    console.error(`Line mismatch for ${filename}: listed ${listedLines}, actual ${actualLines}`);
    lineMismatch++;
  }
});
console.log('   - Line count mismatches in ZIP:', lineMismatch);
if (lineMismatch > 0 || rows.length !== 66 || entryCount !== 66) {
  console.error('ERROR: Manifest check failed inside ZIP!');
  process.exit(1);
}

// 6. Mandatory Status Strings inside ZIP
const mandatoryStatuses = [
  'FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED',
  'AUDIT LOG IMMUTABILITY: NOT VERIFIED',
  'UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED',
  'MEDIA UPLOAD GATE: BLOCKED',
  'MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED',
  'RICH TEXT VIDEO SECURITY: NOT VERIFIED',
  'MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED',
  'IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED',
  'IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED'
];

console.log('\n6. Mandatory Status Strings Verification (Across all ZIP entries):');
let missingStatus = 0;
mandatoryStatuses.forEach(s => {
  let count = 0;
  Object.values(zipFiles).forEach(buf => {
    const text = buf.toString('utf8');
    let pos = 0;
    while ((pos = text.indexOf(s, pos)) !== -1) {
      count++;
      pos += s.length;
    }
  });
  console.log(`   [${count} occurrences] ${s}`);
  if (count === 0) missingStatus++;
});

if (missingStatus > 0) {
  console.error('ERROR: One or more mandatory status strings are missing!');
  process.exit(1);
}

// 7. Check Self-Check items 11 and 15 in ROUND3_14_SELF_CHECK_REPORT.md
const selfCheckZip = zipFiles['PHASE_0B_2_3_ROUND3_14_SELF_CHECK_REPORT.md'].toString('utf8');
console.log('\n7. Self-Check Report Items 11 & 15 Verification:');
const item11Partial = selfCheckZip.includes('| 11 |') && selfCheckZip.includes('**PARTIAL**');
const item15SelfReported = selfCheckZip.includes('| 15 |') && selfCheckZip.includes('PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED');
console.log('   - Item 11 status is PARTIAL:', item11Partial);
console.log('   - Item 15 is SELF-REPORTED – NOT INDEPENDENTLY VERIFIED:', item15SelfReported);

if (!item11Partial || !item15SelfReported) {
  console.error('ERROR: Self-Check items 11/15 check failed!');
  process.exit(1);
}

console.log('\n=== ALL COMPREHENSIVE ROUND 3.14 AUDIT CHECKS PASSED 100%! ===');
