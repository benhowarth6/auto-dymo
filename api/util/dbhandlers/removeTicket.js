const doesDbExist = require("./doesDbExist");

function removeTicket(ticketNumber, name, isLast){
    var fs = require("fs");
    
    //Whole list of active tickets
    var currentData;

    //Read the file
    doesDbExist();
    fs.readFile("activeTickets.txt", "utf-8", (err, buf) => {
        
        if(err) console.log("\n\n" + getDateTime() + " Error in reading data from DB: " + err2);

        //Store data
        currentData = buf.toString();

        //If the ticket is not in the file, return
        if(!currentData.includes(ticketNumber)) return;
        else{
            //Two field init
            var replaceString;
            //If the ticket is the last one, there will not be a newline char
            if(isLast){
                replaceString = ticketNumber + " - " + name;
            }
            //Otherwise, there will be one that will need to be removed
            else{
                replaceString = ticketNumber + " - " + name + '\n';
            }
            
            //Remove the string from the file
            currentData = currentData.replace(replaceString, "");

            //Writeout, overwrite file
            fs.writeFile("activeTickets.txt", currentData, (err2) => {
                if (err2) console.log("\n\n" + getDateTime() + " Error in removing ticket from DB: " + err2);
            })
        }
    });
}

module.exports = removeTicket;
