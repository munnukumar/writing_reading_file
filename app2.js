const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    // Read contents of message.txt and display above the form
    fs.readFile('message.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body>');
        // Display existing messages
        if (data) {
            res.write(data);
        } 
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
        res.write('</body></html>');
        return res.end();
      }
    });
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
              });
    });
  }
});

//connecting to server
server.listen(PORT, () =>{
    console.log(`server is listing on port: ${PORT}`)
});
