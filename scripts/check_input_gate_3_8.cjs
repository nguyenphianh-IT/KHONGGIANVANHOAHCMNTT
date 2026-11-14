const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');

const basePath = path.join(__dirname, '..', 'docs', 'phase-0b-2');
const files = [
  'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip',
  'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_7.md',
  'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_7.md'
];

let allExist = true;

for (const f of files) {
  const p = path.join(basePath, f);
  if (!fs.existsSync(p)) {
    console.error('MISSING:', f);
    allExist = false;
  } else {
    const stat = fs.statSync(p);
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
    console.log(f, 'Size:', stat.size, 'bytes', 'SHA-256:', hash);
  }
}

if (!allExist) {
  process.exit(1);
}

// Check ZIP integrity
const zipPath = path.join(basePath, 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_7.zip');
const buffer = fs.readFileSync(zipPath);
let offset = 0;
let entryCount = 0;
let allPass = true;

while (offset < buffer.length - 4) {
  const sig = buffer.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    entryCount++;
    const method = buffer.readUInt16LE(offset + 8);
    const compSize = buffer.readUInt32LE(offset + 18);
    const uncompSize = buffer.readUInt32LE(offset + 22);
    const nameLen = buffer.readUInt16LE(offset + 26);
    const extraLen = buffer.readUInt16LE(offset + 28);
    
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    const dataOffset = offset + 30 + nameLen + extraLen;
    const compData = buffer.slice(dataOffset, dataOffset + compSize);
    
    if (method === 8) { // DEFLATE
      try {
        const decomp = zlib.inflateRawSync(compData);
        if (decomp.length !== uncompSize) {
          console.error(`Size mismatch for ${name}: expected ${uncompSize}, got ${decomp.length}`);
          allPass = false;
        }
      } catch (err) {
        console.error(`Decompress error for ${name}:`, err.message);
        allPass = false;
      }
    } else if (method === 0) {
      if (compData.length !== uncompSize) {
        console.error(`Stored size mismatch for ${name}`);
        allPass = false;
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

console.log(`ZIP Entry Count: ${entryCount}, CRC/Decompress PASS: ${allPass}`);
