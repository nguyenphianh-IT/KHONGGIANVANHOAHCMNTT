const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function extractFullDocx(docxPath) {
  const buffer = fs.readFileSync(docxPath);
  let offset = 0;
  while (offset < buffer.length - 4) {
    const sig = buffer.readUInt32LE(offset);
    if (sig === 0x04034b50) {
      const compSize = buffer.readUInt32LE(offset + 18);
      const nameLen = buffer.readUInt16LE(offset + 26);
      const extraLen = buffer.readUInt16LE(offset + 28);
      const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
      const dataOffset = offset + 30 + nameLen + extraLen;
      if (name === 'word/document.xml') {
        const compData = buffer.slice(dataOffset, dataOffset + compSize);
        const decomp = zlib.inflateRawSync(compData).toString('utf8');
        return decomp;
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

// Convert XML to Markdown preserving paragraphs and tables
function xmlToMarkdown(xml) {
  // Replace table rows and cells
  let text = xml;
  
  // Replace paragraphs
  text = text.replace(/<w:p[^>]*>/g, '\n');
  // Clean all tags
  text = text.replace(/<[^>]+>/g, '');
  // Fix multiple newlines
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  return text;
}

const auditXml = extractFullDocx('d:/Web/Không gian văn hoá HCM/docs/phase-0b-2/BAO_CAO_KIEM_TOAN_DOC_LAP_ROUND4_8.docx');
fs.writeFileSync('d:/Web/Không gian văn hoá HCM/scripts/audit_round4_8_raw.txt', xmlToMarkdown(auditXml), 'utf8');

const verdictXml = extractFullDocx('d:/Web/Không gian văn hoá HCM/docs/phase-0b-2/PHAN_QUYET_IMPLEMENTATION_READINESS_ROUND4_8.docx');
fs.writeFileSync('d:/Web/Không gian văn hoá HCM/scripts/verdict_round4_8_raw.txt', xmlToMarkdown(verdictXml), 'utf8');

console.log('Saved raw text files.');
