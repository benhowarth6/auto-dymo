function addTicket(ticketNumber, name){
    var fs = require("fs");
    var currentData;
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        currentData = buf.toString();

        console.log(currentData);

        if(currentData.includes(ticketNumber)) return;
        else{
            var data = ticketNumber + " - " + name + "\n";
            fs.appendFile("activeTickets.txt", data, (err) => {
                if (err) console.log(err);
            })
        }
    });
}

module.exports = addTicket;