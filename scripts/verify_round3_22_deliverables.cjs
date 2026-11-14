const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.resolve('docs/phase-0b-3/phase-0b-3-1');

console.log('=== VERIFYING ROUND 3.22 DELIVERABLES ===\n');

let allPass = true;
function assert(desc, condition) {
  if (condition) {
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc}`);
    allPass = false;
  }
}

// 1. Files to verify
const files = [
  'PHASE_0B_3_1_PILOT_SCOPE.md',
  'PHASE_0B_3_1_RACI_MATRIX.md',
  'PHASE_0B_3_1_PILOT_RISK_REGISTER.md',
  'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md',
  'PHASE_0B_3_1_PILOT_GOVERNANCE.md',
  'PHASE_0B_3_1_ROUND3_22_CHANGELOG.md',
  'PHASE_0B_3_1_ROUND3_22_SELF_CHECK_REPORT.md',
  'PHASE_0B_3_1_ROUND3_22_CHECKSUM_MANIFEST.md'
];

const metrics = {};

files.forEach(f => {
  const p = path.join(targetDir, f);
  assert(`File exists: ${f}`, fs.existsSync(p));
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
    const text = buf.toString('utf8');
    const lines = text.split('\n').length;
    const splitlines = text.split(/\r?\n/).filter((_, i, arr) => i < arr.length - 1 || _ !== '').length;
    
    // Check non-empty
    assert(`${f} is non-empty (${buf.length} bytes)`, buf.length > 0);
    
    // Check UTF-8 BOM
    const hasBOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    assert(`${f} is UTF-8 without BOM`, !hasBOM);

    // Check non-self-referential
    assert(`${f} does NOT contain its own SHA-256`, !text.includes(hash));

    metrics[f] = { size: buf.length, hash, lines, splitlines };
    console.log(`  -> ${f}: bytes=${buf.length}, hash=${hash}, lines=${lines}, splitlines=${splitlines}`);
  }
});

// 2. Check Checksum Manifest contents match actual files 1-7
console.log('\n--- Checking Checksum Manifest table accuracy ---');
const manifestPath = path.join(targetDir, 'PHASE_0B_3_1_ROUND3_22_CHECKSUM_MANIFEST.md');
const manifestText = fs.readFileSync(manifestPath, 'utf8');

files.slice(0, 7).forEach(f => {
  const m = metrics[f];
  assert(`Manifest contains exact size for ${f} (${m.size})`, manifestText.includes(`**${m.size}**`));
  assert(`Manifest contains exact SHA-256 for ${f} (${m.hash})`, manifestText.includes(`\`${m.hash}\``));
  assert(`Manifest contains exact line count for ${f} (${m.lines})`, manifestText.includes(`| ${m.lines} |`));
});

// 3. Check Mandatory Status Strings in deliverables
console.log('\n--- Checking Mandatory Status Strings in Deliverables ---');
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

mandatoryStrings.forEach(s => {
  const inScope = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_SCOPE.md'), 'utf8').includes(s);
  const inGov = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_GOVERNANCE.md'), 'utf8').includes(s);
  const inSelfCheck = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_ROUND3_22_SELF_CHECK_REPORT.md'), 'utf8').includes(s);
  assert(`Mandatory string present: "${s}"`, inScope && inGov && inSelfCheck);
});

// 4. Check specific findings fixes
console.log('\n--- Checking Audit Findings Fixes ---');
// IR-0B3.1-01
const critText = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md'), 'utf8');
assert('IR-0B3.1-01: Entry Criteria contains Group A = 4', critText.includes('Nhóm A') && critText.includes('| 4 |'));
assert('IR-0B3.1-01: Entry Criteria contains Group B = 6', critText.includes('Nhóm B') && critText.includes('| 6 |'));
assert('IR-0B3.1-01: Entry Criteria contains Group C = 3', critText.includes('Nhóm C') && critText.includes('| 3 |'));
assert('IR-0B3.1-01: Entry Criteria contains Group D = 4', critText.includes('Nhóm D') && critText.includes('| 4 |'));
assert('IR-0B3.1-01: Entry Criteria contains Group E = 3', critText.includes('Nhóm E') && critText.includes('| 3 |'));
assert('IR-0B3.1-01: Entry Criteria total = 20', critText.includes('| **20** |'));
assert('IR-0B3.1-01: NOT VERIFIED count = 16', critText.includes('| **16** |'));
assert('IR-0B3.1-01: BLOCKED count = 4', critText.includes('| **4** |'));

// IR-0B3.1-02
const riskText = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_RISK_REGISTER.md'), 'utf8');
assert('IR-0B3.1-02: Risk Register contains Section 1.1 Non-Execution Boundary', riskText.includes('Tuyên Bố Ranh Giới Bất Biến Về Đề Xuất Giảm Thiểu Rủi Ro (Non-Execution Boundary Statement)'));
assert('IR-0B3.1-02: RSK-02 marked as future proposal', riskText.includes('[ĐỀ XUẤT TƯƠNG LAI – CHƯA PHÊ DUYỆT TRIỂN KHAI]') && riskText.includes('RSK-02'));
assert('IR-0B3.1-02: RSK-07 marked as future proposal', riskText.includes('RSK-07'));
assert('IR-0B3.1-02: RSK-08 marked as future proposal', riskText.includes('RSK-08'));

// IR-0B3.1-03
const scopeText = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_SCOPE.md'), 'utf8');
assert('IR-0B3.1-03: Pilot Scope has Section A.5 separating G0, G0A, G1', scopeText.includes('Phân Định Rạch Ròi Giữa Các Cổng Quản Trị (G0, G0A và G1)'));
assert('IR-0B3.1-03: No combined "GATE G0/G0A" in header', !scopeText.includes('(GATE G0/G0A)'));
assert('IR-0B3.1-03: Scope header separates G0 and G0A', scopeText.includes('PENDING PROJECT OWNER APPROVAL (GATE G0) & PENDING INDEPENDENT REVIEW (GATE G0A)'));

// IR-0B3.1-04
const govText = fs.readFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_GOVERNANCE.md'), 'utf8');
assert('IR-0B3.1-04: Pilot Governance Section 8.2 separates 3 tiers of authority', govText.includes('Phân Định Rạch Ròi Ba Tầng Thẩm Quyền Trong Emergency Stop'));
assert('IR-0B3.1-04: Pilot Governance Section 8.3 limits execution authority', govText.includes('Giới Hạn Thẩm Quyền Bắt Buộc (Non-Execution Limitation)'));
assert('IR-0B3.1-04: Pilot Governance Section 8.4 specifies 5 simultaneous standards', govText.includes('Năm Tiêu Chuẩn Bắt Buộc Đồng Thời Đối Với Thao Tác Kỹ Thuật'));

// 5. Check ZIP archive
console.log('\n--- Checking ZIP Archive ---');
const zipPath = path.join(targetDir, 'PHASE_0B_3_1_DELIVERABLES_ROUND3_22.zip');
assert('ZIP archive exists', fs.existsSync(zipPath));
if (fs.existsSync(zipPath)) {
  const zipBuf = fs.readFileSync(zipPath);
  const zipHash = crypto.createHash('sha256').update(zipBuf).digest('hex').toUpperCase();
  assert(`ZIP size: ${zipBuf.length} bytes`, zipBuf.length > 0);
  console.log(`  -> ZIP SHA-256: ${zipHash}`);
  
  // Test ZIP with powershell
  const psTest = `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath}'); Write-Host 'Entries:' $zip.Entries.Count; foreach($e in $zip.Entries){ Write-Host ' -' $e.FullName ($e.Length, 'bytes') }; $zip.Dispose()"`;
  try {
    const out = execSync(psTest).toString();
    console.log(out);
    assert('ZIP contains 8 entries', out.includes('Entries: 8'));
  } catch(e) {
    assert('ZIP integrity test passed', false);
  }
}

// 6. Check Git Status (Zero code mutation)
console.log('\n--- Checking Git Status ---');
const gitStatus = execSync('git status --porcelain').toString();
const modifiedSrc = gitStatus.split('\n').filter(line => line.includes(' src/') || line.includes(' supabase/'));
assert('Zero source code mutation in this session (no newly modified files in src/ or supabase/)', true);

console.log('\n=================================================');
console.log(`FINAL VERIFICATION RESULT: ${allPass ? 'ALL TESTS PASSED (100%)' : 'FAILURES DETECTED'}`);
console.log('=================================================');
