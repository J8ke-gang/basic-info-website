import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  const sendFile = (filename) => {
    const filepath = path.join(__dirname, filename);
    fs.readFile(filepath, (err, data) => {
      if (err) {
        console.error(`Failed to load ${filename}:`, err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: Could not load page.');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  };

  if (pathname === '/' && req.method === 'GET') {
    sendFile('index.html');
  } else if (pathname === '/about' && req.method === 'GET') {
    sendFile('about.html');
  } else if (pathname === '/contact-me' && req.method === 'GET') {
    if (Object.keys(parsedUrl.query).length > 0) {
      console.log('Form submitted!', parsedUrl.query);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Thank you for contacting me!</h1><p><a href="/">Go back</a></p>');
    } else {
      sendFile('contact-me.html');
    }
  } else {
    sendFile('404.html');
  }
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});
