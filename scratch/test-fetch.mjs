async function test() {
  const res = await fetch('http://localhost:3000/api/doctors')
  const json = await res.json()
  const doctor = json.doctors[0]
  console.log('Doctor ID:', doctor.id)
  console.log('isOnlineEnabled:', doctor.isOnlineEnabled)
  
  const patchRes = await fetch('http://localhost:3000/api/doctor-profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorId: doctor.id, isOnlineEnabled: false })
  })
  console.log('PATCH response status:', patchRes.status)
  const patchJson = await patchRes.json()
  console.log('PATCH response:', patchJson)
}
test()
