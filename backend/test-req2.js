const http = require('http');

http.get('http://localhost:5000/api/admin/ngos', res => {
  let responseBody = '';
  res.on('data', d => responseBody += d);
  res.on('end', () => console.log('NGOs:', responseBody));
});
