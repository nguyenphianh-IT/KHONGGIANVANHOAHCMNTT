const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'scripts', 'verify_round3_7_zip.cjs');
if (fs.existsSync(file)) {
  console.log(fs.readFileSync(file, 'utf8'));
} else {
  console.log('verify_round3_7_zip.cjs not found');
}
