const http = require('http');
const app = require('./app');
const getDateTime = require('./lib/util/getDateTime');
var constants = require('./lib/constants')

//Can overrwite port with an ENV var, otherwise will use 3000
const port = process.env.PORT || 3000;

//Create a server using app.js
const server = http.createServer(app);

//Listen on port (3000)

if(!constants.testing) console.log("\n\n" + getDateTime() + " Server started and listening on port " + port + ":");
else{
    const style = 'font-weight: bold'
    console.log("%c\n\n" + getDateTime() + " Server started in testing mode and listening on port " + port + ":", style);
}
server.listen(port);