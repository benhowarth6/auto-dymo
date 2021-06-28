function getTickets(){
    var fs = require("fs");

    //Return the entire file as a string
    return(fs.readFileSync("activeTickets.txt", "utf8"));
}

module.exports = getTickets;
