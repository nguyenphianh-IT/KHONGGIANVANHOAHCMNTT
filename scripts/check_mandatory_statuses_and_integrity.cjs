const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_14');
const files = fs.readdirSync(stagingDir);

console.log('Total files:', files.length);

// 1. Duplicate check
const set = new Set();
let duplicates = 0;
files.forEach(f => {
  if (set.has(f.toLowerCase())) duplicates++;
  set.add(f.toLowerCase());
});
console.log('Duplicate filenames:', duplicates);

// 2. Empty file & UTF-8 BOM check
let emptyFiles = 0;
let bomFiles = 0;
files.forEach(f => {
  const buf = fs.readFileSync(path.join(stagingDir, f));
  if (buf.length === 0) emptyFiles++;
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) bomFiles++;
});
console.log('Empty files:', emptyFiles);
console.log('BOM files:', bomFiles);

// 3. Mandatory statuses check
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

const counts = {};
mandatoryStatuses.forEach(s => counts[s] = 0);

files.forEach(f => {
  const content = fs.readFileSync(path.join(stagingDir, f), 'utf8');
  mandatoryStatuses.forEach(s => {
    let pos = 0;
    while ((pos = content.indexOf(s, pos)) !== -1) {
      counts[s]++;
      pos += s.length;
    }
  });
});

console.log('--- 9 Mandatory Control Status counts in staging: ---');
let missing = 0;
mandatoryStatuses.forEach(s => {
  console.log(`[${counts[s]}] ${s}`);
  if (counts[s] === 0) missing++;
});

if (missing > 0 || duplicates > 0 || emptyFiles > 0 || bomFiles > 0) {
  console.error('Integrity checks FAILED!');
  process.exit(1);
} else {
  console.log('All integrity and mandatory status checks PASSED!');
}
