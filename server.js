const http = require('http');
const app = require('./app');

//Can overrwite port with an ENV var, otherwise will use 3000
const port = process.env.PORT || 3000;

//Create a server using app.js
const server = http.createServer(app);

//Listen on port (3000)
server.listen(port);
