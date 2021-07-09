const doesDbExist = require("./doesDbExist");

function getTickets(){
    var fs = require("fs");

    //Return the entire file as a string
    doesDbExist();
    return(fs.readFileSync("activeTickets.txt", "utf8", (err) => {
        //Log errors
        if (err) console.log("\n\n" + getDateTime() + " Error in retrieving DB: " + err)
    }));
}

module.exports = getTickets;
