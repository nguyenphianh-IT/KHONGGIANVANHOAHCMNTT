const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const zipPath = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_9.zip');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_10');

if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

const buffer = fs.readFileSync(zipPath);
let offset = 0;
let count = 0;

while (offset < buffer.length - 4) {
  const sig = buffer.readUInt32LE(offset);
  if (sig === 0x04034b50) {
    count++;
    const method = buffer.readUInt16LE(offset + 8);
    const compSize = buffer.readUInt32LE(offset + 18);
    const uncompSize = buffer.readUInt32LE(offset + 22);
    const nameLen = buffer.readUInt16LE(offset + 26);
    const extraLen = buffer.readUInt16LE(offset + 28);
    
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    const dataOffset = offset + 30 + nameLen + extraLen;
    const compData = buffer.slice(dataOffset, dataOffset + compSize);
    
    let fileBuf;
    if (method === 8) {
      fileBuf = zlib.inflateRawSync(compData);
    } else if (method === 0) {
      fileBuf = compData;
    }
    
    fs.writeFileSync(path.join(stagingDir, name), fileBuf);
    offset = dataOffset + compSize;
  } else if (sig === 0x02014b50) {
    offset += 46;
  } else if (sig === 0x06054b50) {
    break;
  } else {
    offset++;
  }
}

console.log(`Extracted ${count} files into ${stagingDir}`);
