const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.resolve('docs/phase-0b-3/phase-0b-3-1');
const zipPath = path.join(targetDir, 'PHASE_0B_3_1_DELIVERABLES_ROUND3_22.zip');
const extractDir = path.resolve('scratch/audit_r422_extract');

console.log('=== STARTING INDEPENDENT AUDIT ROUND 4.22 ===\n');

// 1. Measure ZIP
if (!fs.existsSync(zipPath)) {
  console.error('FATAL: ZIP package not found at: ' + zipPath);
  process.exit(1);
}

const zipBuf = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuf).digest('hex').toUpperCase();
const zipSize = zipBuf.length;

console.log(`[ZIP AUDIT] Path: ${zipPath}`);
console.log(`[ZIP AUDIT] Size: ${zipSize} bytes`);
console.log(`[ZIP AUDIT] SHA-256: ${zipHash}`);

// 2. Unpack ZIP
if (fs.existsSync(extractDir)) {
  fs.rmSync(extractDir, { recursive: true, force: true });
}
fs.mkdirSync(extractDir, { recursive: true });

const psExtract = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`;
execSync(psExtract, { stdio: 'inherit' });
console.log(`[ZIP AUDIT] Successfully extracted to: ${extractDir}`);

// 3. Inspect Entries
const entries = fs.readdirSync(extractDir);
console.log(`[ZIP AUDIT] Total extracted files: ${entries.length}`);
entries.forEach(e => console.log('  - ' + e));

const expectedFiles = [
  'PHASE_0B_3_1_PILOT_SCOPE.md',
  'PHASE_0B_3_1_RACI_MATRIX.md',
  'PHASE_0B_3_1_PILOT_RISK_REGISTER.md',
  'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md',
  'PHASE_0B_3_1_PILOT_GOVERNANCE.md',
  'PHASE_0B_3_1_ROUND3_22_CHANGELOG.md',
  'PHASE_0B_3_1_ROUND3_22_SELF_CHECK_REPORT.md',
  'PHASE_0B_3_1_ROUND3_22_CHECKSUM_MANIFEST.md'
];

let entryMismatch = false;
expectedFiles.forEach(f => {
  if (!entries.includes(f)) {
    console.error(`[ZIP AUDIT FAIL] Missing expected file in ZIP: ${f}`);
    entryMismatch = true;
  }
});

if (entries.length !== expectedFiles.length) {
  console.error(`[ZIP AUDIT FAIL] Count mismatch: expected ${expectedFiles.length}, got ${entries.length}`);
  entryMismatch = true;
}

if (!entryMismatch) {
  console.log('[ZIP AUDIT PASS] All 8 expected files are present, no extra files.');
}

// 4. Measure each file directly from extracted ZIP
console.log('\n--- MEASURING EXTRACTED FILES DIRECTLY ---');
const auditMetrics = {};
entries.forEach(f => {
  const p = path.join(extractDir, f);
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  const text = buf.toString('utf8');
  const linesN = text.split('\n').length;
  const linesRN = text.split(/\r?\n/).filter((_, i, arr) => i < arr.length - 1 || _ !== '').length;
  const hasBOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
  
  auditMetrics[f] = {
    size: buf.length,
    hash,
    linesN,
    linesRN,
    hasBOM,
    isEmpty: buf.length === 0,
    selfHash: text.includes(hash)
  };

  console.log(`${f}:`);
  console.log(`  Size: ${buf.length} bytes`);
  console.log(`  SHA-256: ${hash}`);
  console.log(`  Lines (\\n): ${linesN}`);
  console.log(`  Lines (splitlines): ${linesRN}`);
  console.log(`  BOM: ${hasBOM ? 'YES (FAIL)' : 'NO (PASS)'}`);
  console.log(`  Self-referential: ${text.includes(hash) ? 'YES (FAIL)' : 'NO (PASS)'}`);
});

// 5. Compare with Manifest inside the ZIP
console.log('\n--- COMPARING WITH MANIFEST IN ZIP ---');
const manifestText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_ROUND3_22_CHECKSUM_MANIFEST.md'), 'utf8');

expectedFiles.slice(0, 7).forEach(f => {
  const m = auditMetrics[f];
  const sizeMatch = manifestText.includes(`**${m.size}**`);
  const hashMatch = manifestText.includes(`\`${m.hash}\``);
  const linesMatch = manifestText.includes(`| ${m.linesN} |`);
  console.log(`File: ${f} -> Size Match: ${sizeMatch}, Hash Match: ${hashMatch}, Lines Match: ${linesMatch}`);
});

// 6. Test IR-0B3.1-01 (Entry Criteria)
console.log('\n--- AUDITING IR-0B3.1-01 ---');
const critText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md'), 'utf8');
const critLines = critText.split('\n');

// Parse Table 2 rows
const critRows = critLines.filter(l => l.trim().startsWith('| **CRIT-'));
console.log(`Found ${critRows.length} criteria rows in Table 2:`);
const groupCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
const statusCounts = { PASS: 0, FAIL: 0, 'NOT VERIFIED': 0, BLOCKED: 0 };
const blockedCodes = [];

critRows.forEach(r => {
  const parts = r.split('|').map(s => s.trim()).filter(s => s !== '');
  const code = parts[0].replace(/\*\*/g, '');
  const grp = code.charAt(5); // CRIT-A01 -> A
  groupCounts[grp] = (groupCounts[grp] || 0) + 1;
  const statusRaw = parts[3].replace(/\*\*/g, '');
  if (statusRaw.includes('BLOCKED')) {
    statusCounts.BLOCKED++;
    blockedCodes.push(code);
  } else if (statusRaw.includes('NOT VERIFIED')) {
    statusCounts['NOT VERIFIED']++;
  } else if (statusRaw.includes('PASS')) {
    statusCounts.PASS++;
  } else if (statusRaw.includes('FAIL')) {
    statusCounts.FAIL++;
  }
  console.log(`  ${code} (Group ${grp}): ${statusRaw}`);
});

console.log('Group counts parsed:', groupCounts);
console.log('Status counts parsed:', statusCounts);
console.log('Blocked codes parsed:', blockedCodes);

// 7. Test IR-0B3.1-02 (Risk Register Non-Execution Boundary)
console.log('\n--- AUDITING IR-0B3.1-02 ---');
const riskText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_PILOT_RISK_REGISTER.md'), 'utf8');
console.log('Section 1.1 Non-Execution Boundary present:', riskText.includes('Tuyên Bố Ranh Giới Bất Biến Về Đề Xuất Giảm Thiểu Rủi Ro (Non-Execution Boundary Statement)'));
console.log('RSK-02 marked as future proposal:', riskText.includes('RSK-02') && riskText.includes('[ĐỀ XUẤT TƯƠNG LAI – CHƯA PHÊ DUYỆT TRIỂN KHAI]:'));
console.log('RSK-07 marked as future proposal:', riskText.includes('RSK-07') && riskText.includes('[ĐỀ XUẤT TƯƠNG LAI – CHƯA PHÊ DUYỆT TRIỂN KHAI]:'));
console.log('RSK-08 marked as future proposal:', riskText.includes('RSK-08') && riskText.includes('[ĐỀ XUẤT TƯƠNG LAI – CHƯA PHÊ DUYỆT TRIỂN KHAI]:'));
console.log('Prohibits schema/db mutation in Round 3.22:', riskText.includes('Tuyệt đối không thay đổi Schema/DB/RLS trong Round 3.22'));

// 8. Test IR-0B3.1-03 (Separate G0, G0A, G1)
console.log('\n--- AUDITING IR-0B3.1-03 ---');
const scopeText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_PILOT_SCOPE.md'), 'utf8');
console.log('Contains merged (GATE G0/G0A):', scopeText.includes('(GATE G0/G0A)'));
console.log('Contains Section A.5 on Gate separation:', scopeText.includes('Phân Định Rạch Ròi Giữa Các Cổng Quản Trị (G0, G0A và G1)'));
console.log('Explicitly defines G0 as PO approval for planning:', scopeText.includes('Gate G0 – Project Owner Approval'));
console.log('Explicitly defines G0A as IR independent review:', scopeText.includes('Gate G0A – Independent Review'));
console.log('Explicitly defines G1 as Staging approval:', scopeText.includes('Gate G1 – Controlled Pilot Environment Approval'));

// 9. Test IR-0B3.1-04 (Emergency Stop Authority)
console.log('\n--- AUDITING IR-0B3.1-04 ---');
const govText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_PILOT_GOVERNANCE.md'), 'utf8');
console.log('Section 8.2 defines 3 tiers of authority:', govText.includes('Phân Định Rạch Ròi Ba Tầng Thẩm Quyền Trong Emergency Stop'));
console.log('Section 8.3 defines non-execution limitation:', govText.includes('Giới Hạn Thẩm Quyền Bắt Buộc (Non-Execution Limitation)'));
console.log('Section 8.4 defines 5 simultaneous standards:', govText.includes('Năm Tiêu Chuẩn Bắt Buộc Đồng Thời Đối Với Thao Tác Kỹ Thuật'));
console.log('Section 8.5 prohibits bypassing change management:', govText.includes('Không có ngoại lệ đối với Change Management'));

// 10. Check RACI row 11
const raciText = fs.readFileSync(path.join(extractDir, 'PHASE_0B_3_1_RACI_MATRIX.md'), 'utf8');
const raciRow11 = raciText.split('\n').find(l => l.includes('| 11 |'));
console.log('RACI Row 11:', raciRow11);

// 11. Mandatory statuses check
console.log('\n--- AUDITING 9 MANDATORY STATUS STRINGS ---');
const mandatoryStrings = [
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

mandatoryStrings.forEach((s, idx) => {
  const inScope = scopeText.includes(s);
  const inGov = govText.includes(s);
  console.log(`  [${idx + 1}] ${s} -> In Scope: ${inScope}, In Gov: ${inGov}`);
});

// 12. Save audit results to json
const auditSummary = {
  zip: { path: zipPath, size: zipSize, hash: zipHash, entriesCount: entries.length },
  files: auditMetrics,
  criteriaAnalysis: { groupCounts, statusCounts, blockedCodes },
  timestamp: new Date().toISOString()
};

fs.writeFileSync(path.resolve('scratch/audit_round4_22_summary.json'), JSON.stringify(auditSummary, null, 2), 'utf8');
console.log('\nSaved audit summary to scratch/audit_round4_22_summary.json');
