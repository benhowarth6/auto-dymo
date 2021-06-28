function addTicket(ticketNumber, name){
    var fs = require("fs");
    
    //Store what the file currently is
    var currentData;

    //Read the file
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        
        //Store
        currentData = buf.toString();

        //If the ticket is already in the file, ignore
        if(currentData.includes(ticketNumber)) return;
        else{
            //Formatting
            var data = ticketNumber + " - " + name + "\n";
            
            //Write out - appending
            fs.appendFile("activeTickets.txt", data, (err) => {
                //Log any errors
                if (err) console.log(err);
            })
        }
    });
}

module.exports = addTicket;
