const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/NPA/.gemini/antigravity/brain/4110eb2e-e5b9-4e7c-bf2e-cc3501d75a0a';
function search(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        search(full);
      } else {
        if (f.toLowerCase().includes('4_8') || f.toLowerCase().includes('round4_8')) {
          console.log('Found:', full);
        }
      }
    }
  } catch(e) {}
}

search(brainDir);
search('d:/Web/Không gian văn hoá HCM');
console.log('Search finished.');
