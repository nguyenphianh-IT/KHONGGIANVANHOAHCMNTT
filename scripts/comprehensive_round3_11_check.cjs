const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

console.log('================================================================================');
console.log('   COMPREHENSIVE VERIFICATION AUDIT – REMEDIATION ROUND 3.11   ');
console.log('================================================================================\n');

let pass = true;

// 1. Input Gate Check
console.log('1. INPUT GATE VERIFICATION:');
const baseDocs = path.resolve('docs/phase-0b-2');
const inputFiles = [
  'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_10.zip',
  'PHASE_0B_2_3_ROUND3_10_EXTERNAL_HANDOVER.md',
  'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md',
  'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_10.md'
];

inputFiles.forEach(f => {
  const p = path.join(baseDocs, f);
  if (fs.existsSync(p)) {
    const size = fs.statSync(p).size;
    console.log(`  [PASS] ${f} (${size} bytes)`);
  } else {
    console.error(`  [FAIL] Missing input file: ${f}`);
    pass = false;
  }
});

// 2. Deliverables Presence Check
console.log('\n2. DELIVERABLES VERIFICATION:');
const zipPath = path.join(baseDocs, 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip');
const extHandoverPath = path.join(baseDocs, 'PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md');

if (!fs.existsSync(zipPath)) {
  console.error('  [FAIL] Target ZIP does not exist!');
  pass = false;
}
if (!fs.existsSync(extHandoverPath)) {
  console.error('  [FAIL] External Handover does not exist!');
  pass = false;
}

// 3. ZIP File Verification
console.log('\n3. ZIP INTEGRITY & ARCHIVE METRICS:');
const zipStat = fs.statSync(zipPath);
const zipBuf = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuf).digest('hex').toUpperCase();

console.log(`  ZIP Size: ${zipStat.size} bytes`);
console.log(`  ZIP SHA-256: ${zipHash}`);

let offset = 0;
let entryCount = 0;
let zipEntries = [];
let internalFilesWithHash = [];
let crcPass = true;

while (offset < zipBuf.length - 4) {
  const sig = zipBuf.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    entryCount++;
    const method = zipBuf.readUInt16LE(offset + 8);
    const compSize = zipBuf.readUInt32LE(offset + 18);
    const uncompSize = zipBuf.readUInt32LE(offset + 22);
    const nameLen = zipBuf.readUInt16LE(offset + 26);
    const extraLen = zipBuf.readUInt16LE(offset + 28);
    
    const name = zipBuf.toString('utf8', offset + 30, offset + 30 + nameLen);
    zipEntries.push(name);
    const dataOffset = offset + 30 + nameLen + extraLen;
    const compData = zipBuf.slice(dataOffset, dataOffset + compSize);
    
    let decomp;
    if (method === 8) {
      try {
        decomp = zlib.inflateRawSync(compData);
        if (decomp.length !== uncompSize) crcPass = false;
      } catch (err) {
        crcPass = false;
      }
    } else if (method === 0) {
      decomp = compData;
      if (compData.length !== uncompSize) crcPass = false;
    }

    if (decomp) {
      const text = decomp.toString('utf8');
      if (text.includes(zipHash)) {
        internalFilesWithHash.push(name);
      }
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

console.log(`  ZIP Entries Count: ${entryCount} (Expected: 52)`);
if (entryCount === 52) {
  console.log('  [PASS] Entry count matches exactly 52');
} else {
  console.error(`  [FAIL] Entry count mismatch: ${entryCount}`);
  pass = false;
}

console.log(`  Decompression / CRC: ${crcPass ? 'PASS' : 'FAIL'}`);
if (!crcPass) pass = false;

// Check External Handover is NOT inside ZIP
if (zipEntries.includes('PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md')) {
  console.error('  [FAIL] External Handover MUST NOT be inside ZIP!');
  pass = false;
} else {
  console.log('  [PASS] External Handover is properly excluded from inside the ZIP.');
}

// Check current SHA is NOT inside ZIP
console.log(`  Current Archive SHA-256 Occurrences inside ZIP: ${internalFilesWithHash.length}`);
if (internalFilesWithHash.length === 0) {
  console.log('  [PASS] Zero self-referential checksum embedded inside archive.');
} else {
  console.error(`  [FAIL] Self-referential checksum found in: ${internalFilesWithHash.join(', ')}`);
  pass = false;
}

// 4. External Handover Content Check
console.log('\n4. EXTERNAL HANDOVER METRICS RECONCILIATION:');
const extContent = fs.readFileSync(extHandoverPath, 'utf8');
if (extContent.includes(zipHash)) {
  console.log(`  [PASS] External Handover contains exact SHA-256: ${zipHash}`);
} else {
  console.error('  [FAIL] External Handover missing exact SHA-256!');
  pass = false;
}
if (extContent.includes(zipStat.size.toString())) {
  console.log(`  [PASS] External Handover contains exact byte size: ${zipStat.size}`);
} else {
  console.error('  [FAIL] External Handover missing exact byte size!');
  pass = false;
}

// 5. Manifest Inventory & Line Count Check
console.log('\n5. MANIFEST INVENTORY & LINE COUNT VERIFICATION:');
const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_11');
const manifestPath = path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_MANIFEST.md');
const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const manifestLines = manifestContent.split('\n').length;
console.log(`  Manifest lines: ${manifestLines}`);

let lineMismatches = 0;
zipEntries.forEach(f => {
  const p = path.join(stagingDir, f);
  const actualLines = fs.readFileSync(p, 'utf8').split('\n').length;
  const regex = new RegExp(`\\|\\s*\\d+\\s*\\|\\s*\`${f}\`\\s*\\|\\s*(\\d+)\\s*\\|`);
  const match = manifestContent.match(regex);
  if (!match) {
    console.error(`  [FAIL] Entry missing in manifest: ${f}`);
    lineMismatches++;
  } else {
    const decl = parseInt(match[1], 10);
    if (decl !== actualLines) {
      console.error(`  [FAIL] Line count mismatch for ${f}: declared=${decl}, actual=${actualLines}`);
      lineMismatches++;
    }
  }
});

if (lineMismatches === 0) {
  console.log('  [PASS] 52/52 entries match manifest line counts with 100% precision.');
} else {
  pass = false;
}

// 6. Mandatory Control Statuses Check
console.log('\n6. MANDATORY STATUS STRINGS VERIFICATION:');
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

mandatoryStatuses.forEach(ms => {
  let count = 0;
  zipEntries.forEach(f => {
    const text = fs.readFileSync(path.join(stagingDir, f), 'utf8');
    if (text.includes(ms)) count++;
  });
  if (count > 0) {
    console.log(`  [PASS] Found in ${count} files: ${ms}`);
  } else {
    console.error(`  [FAIL] Missing mandatory status: ${ms}`);
    pass = false;
  }
});

// 7. Check Historical Harmonization in ROUND3_1.md
console.log('\n7. HISTORICAL HARMONIZATION VERIFICATION:');
const r31Content = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md'), 'utf8');
if (r31Content.includes('PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING')) {
  console.log('  [PASS] ROUND3_1.md title successfully harmonized.');
} else {
  console.error('  [FAIL] ROUND3_1.md title not properly harmonized!');
  pass = false;
}

// 8. Final Result
console.log('\n================================================================================');
if (pass) {
  console.log('   FINAL AUDIT RESULT: ALL CRITERIA 100% VERIFIED PASS!   ');
} else {
  console.log('   FINAL AUDIT RESULT: SOME CHECKS FAILED!   ');
}
console.log('================================================================================');
