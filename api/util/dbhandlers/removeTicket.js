function removeTicket(ticketNumber, name, isLast){
    var fs = require("fs");
    
    //Whole list of active tickets
    var currentData;

    //Read the file
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        
        //Store data
        currentData = buf.toString();

        //If the ticket is not in the file, return
        if(!currentData.includes(ticketNumber)) return;
        else{
            //If the ticket is the last one, there will not be a newline char
            if(isLast){
                var replaceString = ticketNumber + " - " + name;
            }
            //Otherwise, there will be one that will need to be removed
            else{
                var replaceString = ticketNumber + " - " + name + '\n';
            }
            
            //Remove the string from the file
            currentData = currentData.replace(replaceString, "");

            //Writeout, overwrite file
            fs.writeFile("activeTickets.txt", currentData, (err) => {
                if (err) console.log(err);
            })
        }
    });
}

module.exports = removeTicket;
