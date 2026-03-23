const http = require('http');

const data = JSON.stringify({
  walletAddress: "0x1234TestWallet1",
  name: "Test NGO 1",
  registrationId: "REG-12341",
  description: "Test Description",
  email: "test@ngo.org",
  phone: "1234567890",
  website: "http://testngo.org",
  ipfsDocHash: "QmHash123",
  isVerified: true
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ngo/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let responseBody = '';

  res.on('data', d => {
    responseBody += d;
  });

  res.on('end', () => {
    console.log('Response body:', responseBody);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
