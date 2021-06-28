function removeTicket(ticketNumber, name, isLast){
    var fs = require("fs");
    var currentData;
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        currentData = buf.toString();

        if(!currentData.includes(ticketNumber)) return;
        else{
            if(isLast){
                var replaceString = ticketNumber + " - " + name;
            }
            else{
                var replaceString = ticketNumber + " - " + name + '\n';
            }
            

            currentData = currentData.replace(replaceString, "");

            fs.writeFile("activeTickets.txt", currentData, (err) => {
                if (err) console.log(err);
            })
        }
    });
}

module.exports = removeTicket;