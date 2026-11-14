const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');

const zipPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip');
const stats = fs.statSync(zipPath);
const buffer = fs.readFileSync(zipPath);
const hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();

console.log('ZIP Exact Byte Size:', stats.size);
console.log('ZIP SHA-256:', hash);

let offset = 0;
let entryCount = 0;
let allPass = true;
let entries = [];
let internalFilesWithHash = [];

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
    entries.push(name);
    const dataOffset = offset + 30 + nameLen + extraLen;
    const compData = buffer.slice(dataOffset, dataOffset + compSize);
    
    let decomp;
    if (method === 8) {
      try {
        decomp = zlib.inflateRawSync(compData);
        if (decomp.length !== uncompSize) {
          console.error(`Size mismatch for ${name}`);
          allPass = false;
        }
      } catch (err) {
        console.error(`Decompress error for ${name}:`, err.message);
        allPass = false;
      }
    } else if (method === 0) {
      decomp = compData;
      if (compData.length !== uncompSize) {
        console.error(`Stored size mismatch for ${name}`);
        allPass = false;
      }
    }

    if (decomp) {
      const text = decomp.toString('utf8');
      if (text.includes(hash)) {
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

console.log(`Verified ${entryCount} entries. All decompressed successfully: ${allPass}`);
console.log(`Occurrences of current ZIP SHA-256 inside ZIP entries: ${internalFilesWithHash.length}`);
if (internalFilesWithHash.length > 0) {
  console.error(`ERROR: Current archive SHA-256 found inside: ${internalFilesWithHash.join(', ')}`);
  process.exit(1);
} else {
  console.log(`PASS: Zero self-referential checksum embedded in archive!`);
}
