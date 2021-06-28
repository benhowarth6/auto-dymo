function getTickets(){
    var fs = require("fs");
    return(fs.readFileSync("activeTickets.txt", "utf8"));
}

module.exports = getTickets;