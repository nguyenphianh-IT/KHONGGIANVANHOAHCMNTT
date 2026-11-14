const fs = require('fs');
const readline = require('readline');
const path = 'C:/Users/NPA/.gemini/antigravity/brain/4110eb2e-e5b9-4e7c-bf2e-cc3501d75a0a/.system_generated/logs/transcript_full.jsonl';
const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let r37Prompt = '';
rl.on('line', (line) => {
  const data = JSON.parse(line);
  if (data.type === 'USER_INPUT' && data.content.includes('ROUND 3.7')) {
    r37Prompt = data.content;
  }
});
rl.on('close', () => {
  const idx = r37Prompt.indexOf('DELIVERABLE');
  if (idx !== -1) {
    console.log(r37Prompt.substring(idx, idx + 1000));
  } else {
    console.log(r37Prompt.substring(r37Prompt.length - 2000));
  }
});
