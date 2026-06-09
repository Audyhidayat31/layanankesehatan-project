async function test() {
  const doctorId = 'doc-1';
  console.log('Testing POST...');
  const postRes = await fetch('http://localhost:3000/api/doctor/timeslots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctorId,
      date: '2026-06-09',
      startTime: '08:00',
      endTime: '09:00'
    })
  });
  console.log('POST status:', postRes.status);
  const postJson = await postRes.json();
  console.log('POST body:', postJson);

  console.log('Testing GET...');
  const getRes = await fetch(`http://localhost:3000/api/doctor/timeslots?doctorId=${doctorId}`);
  console.log('GET status:', getRes.status);
  const getJson = await getRes.json();
  console.log('GET body:', getJson);
}

test();
