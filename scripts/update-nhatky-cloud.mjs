import https from 'https';
import fs from 'fs';

const stat = fs.statSync('public/documents/nhat-ky-trong-tu-chu-tich-ho-chi-minh.pdf');

const payload = JSON.stringify({
  article: {
    id: 'art-1794928985430',
    title: 'Tác phẩm: Nhật ký trong tù',
    slug: 'tac-pham-nhat-ky-trong-tu',
    summary: "'Nhật ký trong tù' gồm 133 bài thơ viết bằng chữ Hán, theo thể tứ tuyệt (4 câu) được Chủ tịch Hồ Chí Minh sáng tác.",
    content: "Tập thơ \"Nhật ký trong tù\" (Ngục trung nhật ký) gồm 133 bài thơ chữ Hán được Bác sáng tác trong thời gian bị chính quyền Tưởng Giới Thạch bắt giam vô cớ tại Quảng Tây (Trung Quốc) từ năm 1942 đến 1943. Tác phẩm là bức chân dung tự họa tinh thần của một bậc đại trí, đại nhân, đại dũng, là di sản văn hóa và bảo vật quốc gia thiêng liêng.",
    category: 'book',
    topic: 'Di sản Tư tưởng & Tác phẩm',
    status: 'pending',
    author_name: 'Nguyễn Phi Anh',
    author_id: 'usr-author-editor',
    quote_id: 1,
    pdf_attachment: {
      url: '/documents/nhat-ky-trong-tu-chu-tich-ho-chi-minh.pdf',
      fileName: 'Nhat Ky Trong Tu.pdf',
      fileSize: stat.size,
      totalPages: 6,
      allowDownload: true,
      readingMode: 'flipbook',
      uploadedAt: new Date().toISOString()
    },
    updated_at: new Date().toISOString()
  }
});

const req = https.request('https://khonggianvanhoahcmntt.vercel.app/api/cms/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const json = JSON.parse(data);
    console.log('Success:', json.success);
    console.log('Article ID:', json.article?.id);
    console.log('Status:', json.article?.status);
    console.log('PDF Attachment in Cloud:', json.article?.pdf_attachment);
  });
});

req.on('error', console.error);
req.write(payload);
req.end();
