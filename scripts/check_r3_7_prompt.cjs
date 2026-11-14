const fs = require('fs');
const readline = require('readline');
const path = 'C:/Users/NPA/.gemini/antigravity/brain/4110eb2e-e5b9-4e7c-bf2e-cc3501d75a0a/.system_generated/logs/transcript_full.jsonl';
const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let prompts = [];
rl.on('line', (line) => {
  const data = JSON.parse(line);
  if (data.type === 'USER_INPUT') {
    if (data.content.includes('ROUND 3.7')) {
      prompts.push(data.content);
    }
  }
});
rl.on('close', () => {
  prompts.forEach((p, i) => console.log('PROMPT ' + i + ':\n' + p.substring(0, 500) + '\n...\n'));
});
