const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function extractDocxText(docxPath) {
  const buffer = fs.readFileSync(docxPath);
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
      if (name === 'word/document.xml') {
        const compData = buffer.slice(dataOffset, dataOffset + compSize);
        const decomp = zlib.inflateRawSync(compData).toString('utf8');
        // Simple XML tag stripper
        const text = decomp.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
        return text;
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
  return null;
}

const auditText = extractDocxText('d:/Web/Không gian văn hoá HCM/docs/phase-0b-2/BAO_CAO_KIEM_TOAN_DOC_LAP_ROUND4_8.docx');
console.log('=== BAO_CAO_KIEM_TOAN_DOC_LAP_ROUND4_8.docx ===');
console.log(auditText.substring(0, 1500));
console.log('...\nLength:', auditText.length);

const verdictText = extractDocxText('d:/Web/Không gian văn hoá HCM/docs/phase-0b-2/PHAN_QUYET_IMPLEMENTATION_READINESS_ROUND4_8.docx');
console.log('=== PHAN_QUYET_IMPLEMENTATION_READINESS_ROUND4_8.docx ===');
console.log(verdictText.substring(0, 1500));
console.log('...\nLength:', verdictText.length);
