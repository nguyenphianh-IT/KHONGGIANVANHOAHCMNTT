const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const zipPath = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip');
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
    const dataOffset = offset + 30 + nameLen + extraLen;
    if (name.includes('HANDOVER')) {
      const compData = buffer.slice(dataOffset, dataOffset + compSize);
      const text = zlib.inflateRawSync(compData).toString('utf8');
      console.log('--- FOUND IN R3.6 ZIP:', name);
      const lines = text.split('\n');
      const s9 = lines.findIndex(l => l.includes('9.'));
      console.log(lines.slice(s9, s9 + 10).join('\n'));
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
