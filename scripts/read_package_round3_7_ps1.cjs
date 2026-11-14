const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'scripts', 'package_round3_7.ps1');
if (fs.existsSync(file)) {
  console.log(fs.readFileSync(file, 'utf8'));
} else {
  console.log('package_round3_7.ps1 not found');
}
