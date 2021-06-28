function getTickets(){
    var fs = require("fs");

    fs.readFile("activeTickets.txt", function(err, buf) {
        console.log(buf.toString());
    });
}

module.exports = getTickets;