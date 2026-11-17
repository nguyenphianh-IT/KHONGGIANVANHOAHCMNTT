import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('scripts/authentic_nhat_ky_trong_tu.html');
const pdfTarget1 = path.resolve('public/documents/nhat-ky-trong-tu-chu-tich-ho-chi-minh.pdf');
const pdfTarget2 = path.resolve('public/documents/Nhat Ky Trong Tu.pdf');

console.log('Generating authentic PDF for "Nhật ký trong tù"...');

const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfTarget1}" "${htmlPath}"`;
execSync(cmd);

if (fs.existsSync(pdfTarget1)) {
  const stat = fs.statSync(pdfTarget1);
  console.log('Generated successfully target 1:', pdfTarget1, 'Size:', stat.size, 'bytes');
  fs.copyFileSync(pdfTarget1, pdfTarget2);
  console.log('Copied to target 2:', pdfTarget2);
} else {
  console.error('Failed to generate PDF!');
}
