function removeTicket(ticketNumber, name){
    var fs = require("fs");
    var currentData;
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        currentData = buf.toString();

        console.log(currentData);


        if(!currentData.includes(ticketNumber)) return;
        else{
            var replaceString = ticketNumber + " - " + name;

            currentData = currentData.replace(replaceString, "");

            fs.writeFile("activeTickets.txt", currentData, (err) => {
                if (err) console.log(err);
            })
        }
    });
}

module.exports = removeTicket;