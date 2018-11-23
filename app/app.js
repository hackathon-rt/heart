const http = require('http');

const hostname = '127.0.0.1'; // listen on all ports
const port = 8881;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port, hostname, () => {
  console.log('Server running at http://${hostname}:${port}/');
});

