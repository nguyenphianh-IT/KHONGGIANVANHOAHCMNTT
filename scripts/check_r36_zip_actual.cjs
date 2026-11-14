const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const file = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip');
if (fs.existsSync(file)) {
  const buf = fs.readFileSync(file);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  console.log('R3.6 zip size:', buf.length, 'bytes');
  console.log('R3.6 zip sha256:', hash);
} else {
  console.log('R3.6 zip does not exist');
}
