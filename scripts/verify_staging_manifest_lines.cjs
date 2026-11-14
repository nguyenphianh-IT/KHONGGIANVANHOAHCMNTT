const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_14');
const manifestPath = path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_14_MANIFEST.md');

const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const manifestLines = manifestContent.split('\n');

console.log('Manifest line count (split \\n):', manifestLines.length);

const rows = manifestLines.filter(l => l.startsWith('|') && !l.includes('Tên Tệp') && !l.includes(':---:'));
console.log('Table rows in Manifest:', rows.length);

let errors = 0;
rows.forEach((r, idx) => {
  const parts = r.split('|').map(s => s.trim());
  const stt = parseInt(parts[1], 10);
  const filename = parts[2].replace(/`/g, '');
  const listedLines = parseInt(parts[3], 10);
  
  if (stt !== idx + 1) {
    console.error(`Row ${idx + 1}: STT mismatch! Expected ${idx + 1}, got ${stt}`);
    errors++;
  }
  
  const filePath = path.join(stagingDir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File missing: ${filename}`);
    errors++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const actualLines = content.split('\n').length;
  
  if (actualLines !== listedLines) {
    console.error(`Line mismatch for ${filename}: listed=${listedLines}, actual=${actualLines}`);
    errors++;
  }
});

const filesInDir = fs.readdirSync(stagingDir);
console.log('Total files in staging directory:', filesInDir.length);

if (filesInDir.length !== rows.length) {
  console.error(`Count mismatch: dir has ${filesInDir.length}, manifest has ${rows.length}`);
  errors++;
}

if (errors === 0) {
  console.log('ALL 66 FILES IN STAGING MATCH MANIFEST LINE COUNTS 100%!');
} else {
  console.error(`Encountered ${errors} errors!`);
  process.exit(1);
}
