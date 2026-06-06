const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseBody)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseBody
          });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const payload = {
    patientId: 'cmpjhclzw000epouo453x695j',
    doctorId: 'cmpqsffs4000330uo4k72ejqp',
    date: '2026-06-07',
    time: '09:00',
    type: 'online',
    complaint: 'Testing conflict booking prevention'
  };

  try {
    const res = await post('http://localhost:3000/api/appointments', payload);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);
  } catch (error) {
    console.error('Request error:', error);
  }
}

run();
