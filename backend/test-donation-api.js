const http = require('http');

http.get('http://localhost:5000/api/donations/ngo/5f8d04f29a008b2d1891bca4', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
}).on('error', err => console.error('Error:', err.message));
