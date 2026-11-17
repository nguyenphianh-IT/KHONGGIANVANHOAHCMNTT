import fs from 'fs';
import path from 'path';

function buildPdf(pages) {
  let output = '%PDF-1.4\n';
  let offsets = [];

  function recordObject(str) {
    offsets.push(Buffer.byteLength(output, 'utf8'));
    output += str + '\n';
  }

  // 1. Catalog
  recordObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // 2. Pages container (sẽ fill kids sau)
  const totalPages = pages.length;
  // Pages ids: 3 to (3 + totalPages - 1)
  const pageIds = [];
  for (let i = 0; i < totalPages; i++) {
    pageIds.push(3 + i);
  }
  const kidsStr = pageIds.map(id => `${id} 0 R`).join(' ');
  recordObject(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${totalPages} >>\nendobj`);

  // Font object IDs
  const boldFontId = 3 + totalPages;
  const regularFontId = 3 + totalPages + 1;
  // Content streams: (3 + totalPages + 2) to (3 + totalPages + 1 + totalPages)
  const streamStartId = regularFontId + 1;

  // 3. Page objects
  for (let i = 0; i < totalPages; i++) {
    const pageId = 3 + i;
    const streamId = streamStartId + i;
    recordObject(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${streamId} 0 R /Resources << /Font << /F1 ${boldFontId} 0 R /F2 ${regularFontId} 0 R >> >> >>\nendobj`);
  }

  // 4. Fonts
  recordObject(`${boldFontId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`);
  recordObject(`${regularFontId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  // 5. Streams
  for (let i = 0; i < totalPages; i++) {
    const streamId = streamStartId + i;
    const page = pages[i];
    
    // Draw background rect & border for book look
    let streamBody = 'q\n';
    if (i === 0) {
      // Cover page: Deep red background
      streamBody += '0.55 0.08 0.12 rg\n0 0 595 842 re\nf\n';
      // Gold frame
      streamBody += '0.85 0.70 0.25 RG\n3 w\n30 30 535 782 re\nS\n';
      streamBody += '1 1 1 rg\n';
      streamBody += 'BT\n/F1 14 Tf\n1 1 1 rg\n50 760 Td\n(TRUONG THCS NGUYEN TRUNG TRUC - PHOI THOI AN) Tj\nET\n';
      streamBody += 'BT\n/F1 22 Tf\n0.95 0.85 0.35 rg\n50 680 Td\n(' + page.title.replace(/[()]/g, '') + ') Tj\nET\n';
      streamBody += 'BT\n/F2 14 Tf\n1 1 1 rg\n50 640 Td\n(' + page.subtitle.replace(/[()]/g, '') + ') Tj\nET\n';
      streamBody += 'BT\n/F2 11 Tf\n0.9 0.9 0.9 rg\n50 480 Td\n(AN PHAM SO HOA TU LIEU LICH SU - KHONG GIAN VAN HOA HO CHI MINH) Tj\nET\n';
      streamBody += 'BT\n/F1 12 Tf\n0.95 0.85 0.35 rg\n50 100 Td\n(NHA XUAT BAN CHINH TRI QUOC GIA SU THAT) Tj\nET\n';
    } else {
      // Inside page: Ivory / cream background
      streamBody += '0.98 0.97 0.94 rg\n0 0 595 842 re\nf\n';
      // Border rule
      streamBody += '0.85 0.82 0.75 RG\n1 w\n40 40 515 762 re\nS\n';
      // Header
      streamBody += 'BT\n/F1 10 Tf\n0.55 0.08 0.12 rg\n50 775 Td\n(KHONG GIAN VAN HOA HO CHI MINH - THCS NGUYEN TRUNG TRUC) Tj\nET\n';
      streamBody += 'BT\n/F1 16 Tf\n0.15 0.15 0.15 rg\n50 720 Td\n(' + page.title.replace(/[()]/g, '') + ') Tj\nET\n';
      
      let y = 670;
      for (const line of page.lines) {
        streamBody += `BT\n/F2 11 Tf\n0.2 0.2 0.2 rg\n50 ${y} Td\n(${line.replace(/[()]/g, '')}) Tj\nET\n`;
        y -= 24;
      }
      
      // Page number
      streamBody += `BT\n/F1 10 Tf\n0.4 0.4 0.4 rg\n280 60 Td\n(- Trang ${i + 1} -) Tj\nET\n`;
    }
    streamBody += 'Q\n';

    const byteLen = Buffer.byteLength(streamBody, 'utf8');
    recordObject(`${streamId} 0 obj\n<< /Length ${byteLen} >>\nstream\n${streamBody}\nendstream\nendobj`);
  }

  // 6. Xref & Trailer
  const xrefOffset = Buffer.byteLength(output, 'utf8');
  const totalObjects = offsets.length + 1; // including 0
  output += `xref\n0 ${totalObjects}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    output += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return output;
}

const samplePages = [
  {
    title: 'DI CHUC CHU TICH HO CHI MINH',
    subtitle: 'Ban cong bo chinh thuc - Bao vat quoc gia Viet Nam',
    lines: []
  },
  {
    title: 'HOAN CANH RA DOI VA Y NGHIA LICH SU',
    subtitle: '',
    lines: [
      'Chu tich Ho Chi Minh bat dau viet Di chuc vao dip sinh nhat lan thu 75 cua Nguoi',
      'thang 5 nam 1965, va tiep tuc sua chua, bo sung vao dip thang 5 cac nam tiep theo cho den nam 1969.',
      'Di chuc la mot van kien lich su vo gia, ket tinh tu tuong, dao duc, phong cach',
      'va tam nguyen cao ca cua Nguoi doi voi toan Dang, toan dan va the he tre Viet Nam.',
      'Tai Truong THCS Nguyen Trung Truc, Di chuc la kim chi nam trong cong tac giao duc dao duc,',
      'boi duong ly tuong cach mang cho hoc sinh theo tam guong Bac Ho vi dai.'
    ]
  },
  {
    title: 'TRUOC HET NOI VE DANG VA DOAN KET THONG NHAT',
    subtitle: '',
    lines: [
      'Nho doan ket chat che, mot long mot da phuc vu giai cap, phuc vu nhan dan,',
      'phuc vu To quoc, cho nen tu ngay thanh lap den nay, Dang ta da doan ket, lanh dao',
      'toan dan ta hang hai dau tranh tien tu thang loi nay den thang loi khac.',
      'Doan ket la mot truyen thong cuc ky quy bau cua Dang va cua dan ta.',
      'Cac dong chi tu Trung uong den cac chi bo can phai giu gin su doan ket nhat tri cua Dang',
      'nhu giu gin con nguoi cua mat minh.'
    ]
  },
  {
    title: 'BOI DUONG THE HE CACH MANG CHO DOI SAU',
    subtitle: '',
    lines: [
      'Doan vien va thanh nien ta noi chung la tot, moi viec deu hang hai xung phong,',
      'khong ngai kho khan, gian kho, co chi tien thu.',
      'Dang can phai cham lo giao duc dao duc cach mang cho ho,',
      'dao tao ho thanh nhung nguoi thua ke xay dung chu nghia xa hoi vua hong vua chuyen.',
      'Boi duong the he cach mang cho doi sau la mot viec rat quan trong va rat can thiet.',
      'Day chinh la su menh thieng lieng cua thay va tro Truong THCS Nguyen Trung Truc.'
    ]
  },
  {
    title: 'XAY DUNG LAI DAT NUOC SAU CHIEN TRANH',
    subtitle: '',
    lines: [
      'Chien tranh co the keo dai. Dong bao ta co the phai hy sinh nhieu cua, nhieu nguoi.',
      'Du sao, chung ta phai quyet tam danh giac My den thang loi hoan toan.',
      'Con non, con nuoc, con nguoi, Thang giac My, ta se xay dung hon muoi ngay nay!',
      'Ke hoach xay dung lai dat nuoc phai het suc chu dao, cham lo cho nhan dan lao dong,',
      'chu y den gia dinh thuong binh, liet si va the he tuong lai cua non song.'
    ]
  },
  {
    title: 'DIEU MONG MUON CUOI CUNG CUA BAC',
    subtitle: '',
    lines: [
      'Dieu mong muon cuoi cung cua toi la: Toan Dang, toan dan ta doan ket phan dau,',
      'xay dung mot nuoc Viet Nam hoa binh, thong nhat, doc lap, dan chu va giau manh,',
      'va gop phan xung dang vao su nghiep cach mang the gioi.',
      'Hoc sinh va Can bo giao vien THCS Nguyen Trung Truc nguyen suot doi hoc tap,',
      'lam theo loi Bac, ren luyen tai duc de xung dang la con chau Bac Ho!'
    ]
  }
];

const pdfData = buildPdf(samplePages);
const targetDir = path.resolve('public/documents');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
const targetFile = path.join(targetDir, 'di-chuc-chu-tich-ho-chi-minh.pdf');
fs.writeFileSync(targetFile, pdfData, 'binary');
console.log(`Successfully created sample PDF: ${targetFile} (${fs.statSync(targetFile).size} bytes)`);
