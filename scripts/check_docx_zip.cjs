const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const zipPath = 'd:/Web/Không gian văn hoá HCM/docs/phase-0b-2/ROUND4_8_HAI_BAO_CAO_BAN_DOCX.zip';
const buffer = fs.readFileSync(zipPath);
let offset = 0;
while (offset < buffer.length - 4) {
  const sig = buffer.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    const compSize = buffer.readUInt32LE(offset + 18);
    const uncompSize = buffer.readUInt32LE(offset + 22);
    const nameLen = buffer.readUInt16LE(offset + 26);
    const extraLen = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    console.log('ZIP Entry:', name, 'Uncompressed:', uncompSize);
    offset += 30 + nameLen + extraLen + compSize;
  } else if (sig === 0x02014b50) {
    offset += 46;
  } else if (sig === 0x06054b50) {
    break;
  } else {
    offset++;
  }
}
