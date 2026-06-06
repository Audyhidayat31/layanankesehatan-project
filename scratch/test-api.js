const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const res = await get('http://localhost:3000/api/appointments/booked?doctorId=cmpqsffs4000330uo4k72ejqp&date=2026-06-07');
    console.log('API Response:', res);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

run();
