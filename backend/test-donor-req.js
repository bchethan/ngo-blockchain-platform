const http = require('http');

const data = JSON.stringify({
  name: "Test Donor XYZ",
  email: "test@donor.xyz"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/donor/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseBody = '';
  res.on('data', d => responseBody += d);
  res.on('end', () => console.log('Response:', res.statusCode, responseBody));
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
