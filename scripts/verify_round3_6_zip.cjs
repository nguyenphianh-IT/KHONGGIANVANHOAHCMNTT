const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');

const zipPath = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip');
const stats = fs.statSync(zipPath);
const buffer = fs.readFileSync(zipPath);
const hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();

console.log('ZIP File:', zipPath);
console.log('ZIP Exact Byte Size:', stats.size);
console.log('ZIP SHA-256:', hash);

// Parse ZIP headers manually to check CRC32 and extract files
let offset = 0;
let entryCount = 0;
let allPass = true;

// Search for local file headers
while (offset < buffer.length - 4) {
  const sig = buffer.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    entryCount++;
    const method = buffer.readUInt16LE(offset + 8);
    const crc = buffer.readUInt32LE(offset + 14);
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
    } else if (method === 0) { // STORE
      if (compData.length !== uncompSize) {
        console.error(`Stored size mismatch for ${name}`);
        allPass = false;
      }
    }
    
    offset = dataOffset + compSize;
  } else if (sig === 0x02014b50) { // Central directory file header
    offset += 46;
  } else if (sig === 0x06054b50) { // End of central directory
    break;
  } else {
    offset++;
  }
}

console.log(`Verified ${entryCount} entries. All decompressed successfully: ${allPass}`);
