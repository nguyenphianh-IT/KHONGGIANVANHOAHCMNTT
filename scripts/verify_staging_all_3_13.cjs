const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_13');
const manifestPath = path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_13_MANIFEST.md');

console.log('=== VERIFYING STAGING ROUND 3.13 ===');
const files = fs.readdirSync(stagingDir).filter(f => f.endsWith('.md')).sort();
console.log(`Found ${files.length} markdown files in staging.`);

// Check 61 files
if (files.length !== 61) {
  console.error(`ERROR: Expected 61 files, got ${files.length}`);
  process.exit(1);
}

// Check non-empty and UTF-8
let emptyCount = 0;
files.forEach(f => {
  const p = path.join(stagingDir, f);
  const buf = fs.readFileSync(p);
  if (buf.length === 0) emptyCount++;
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    console.log(`Warning: UTF-8 BOM found in ${f}`);
  }
});
console.log(`Empty files: ${emptyCount}`);

// Check Manifest table lines vs actual lines
const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const manifestLines = manifestContent.split('\n').length;
console.log(`Manifest itself has ${manifestLines} lines by split('\\n').length`);

let mismatchCount = 0;
files.forEach((f, idx) => {
  const actualLines = fs.readFileSync(path.join(stagingDir, f), 'utf8').split('\n').length;
  // find line in manifest
  const regex = new RegExp(`\\|\\s*\\d+\\s*\\|\\s*\`${f}\`\\s*\\|\\s*(\\d+)\\s*\\|`);
  const match = manifestContent.match(regex);
  if (!match) {
    console.error(`ERROR: File ${f} not found in manifest table!`);
    mismatchCount++;
  } else {
    const declaredLines = parseInt(match[1], 10);
    if (declaredLines !== actualLines) {
      console.error(`MISMATCH: ${f} declared=${declaredLines}, actual=${actualLines}`);
      mismatchCount++;
    }
  }
});

if (mismatchCount === 0) {
  console.log(`ALL 61 FILES MATCH MANIFEST LINE COUNTS EXACTLY 100%!`);
} else {
  console.error(`Found ${mismatchCount} line count mismatches!`);
}

// Check 9 mandatory status strings
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

console.log('\nChecking 9 Mandatory Control Statuses:');
mandatoryStatuses.forEach(ms => {
  let count = 0;
  files.forEach(f => {
    const c = fs.readFileSync(path.join(stagingDir, f), 'utf8');
    if (c.includes(ms)) count++;
  });
  console.log(`[STATUS FOUND IN ${count} FILES] ${ms}`);
});
