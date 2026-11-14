const fs = require('fs');

async function testEndpoint() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const tokenMatch = envContent.match(/VERCEL_OIDC_TOKEN="?([^"\r\n]+)"?/);
  const token = tokenMatch ? tokenMatch[1] : '';

  const url = 'https://khonggianvanhoahcmntt-git-staging-nguyenphianh-1238s-projects.vercel.app/api/rag/health';
  console.log('Testing Staging URL:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'x-vercel-protection-bypass': token,
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('HTTP Status:', res.status, res.statusText);
    const contentType = res.headers.get('content-type');
    console.log('Content-Type:', contentType);

    const text = await res.text();
    console.log('Response body:', text.slice(0, 400));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testEndpoint();
