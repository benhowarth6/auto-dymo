const doesDbExist = require("./doesDbExist");

function addTicket(ticketNumber, name){
    var fs = require("fs");
    
    //Store what the file currently is
    var currentData;

    //Read the file
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        
        if(err) console.log("\n\n" + getDateTime() + " Error in reading data from DB: " + err2);

        //Store
        currentData = buf.toString();

        //If the ticket is already in the file, ignore
        if(currentData.includes(ticketNumber)) return;
        else{
            //Formatting
            var data = ticketNumber + " - " + name + "\n";
            
            //Write out - appending
            fs.appendFile("activeTickets.txt", data, (err2) => {
                //Log any errors
                if (err2) console.log("\n\n" + getDateTime() + " Error in adding ticket to DB: " + err2);
            })
        }
    });
}

module.exports = addTicket;
