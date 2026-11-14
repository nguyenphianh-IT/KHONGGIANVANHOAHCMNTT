const fs = require('fs');
const path = require('path');

const userUploadDir = 'C:/Users/NPA/.gemini/antigravity/brain/4110eb2e-e5b9-4e7c-bf2e-cc3501d75a0a/.user_uploaded';
if (fs.existsSync(userUploadDir)) {
  const files = fs.readdirSync(userUploadDir);
  console.log('Files in .user_uploaded:');
  files.forEach(f => {
    const full = path.join(userUploadDir, f);
    const stat = fs.statSync(full);
    console.log(`- ${f} (${stat.size} bytes)`);
  });
} else {
  console.log('.user_uploaded does not exist');
}
