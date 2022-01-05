const returnCode = require('../util/returnCode');

function check(res, ticketInfo, ticketNum, lengths, startChars){

    var validPrefix = false;
    var prefixIndex = 0;
    var finIndex = 0;

    startChars.forEach( element =>{
        if(ticketNum.startsWith(element)){
            validPrefix = true;
            finIndex = prefixIndex;
        } 
        prefixIndex++;
    });

    //Prefix must be valid
    if(!validPrefix) returnCode(400, res, ticketInfo, 'Invalid ticket prefix. Ticket number must start with one of the following: [' + startChars + ']');
    //Ticket must be the correct length
    else if (ticketNum.length !== lengths[finIndex]) returnCode(400, res, ticketInfo, 'Invalid ticket length (' + ticketNum.length + ') for prefix ' + startChars[finIndex] + '. Ticket must be ' + lengths[finIndex] + ' characters long.');
    //All data following prefix must be numeric
    else if(ticketNum.substr(startChars[finIndex].length).match(/[^0-9]/)) returnCode(400, res, ticketInfo, 'Invalid ticket number (' + ticketNum.substring(startChars[finIndex].length) + '). Ticket number must be numeric.');
    //All tests passed
    else return true;

    //Catches all errors that already threw returnCodes
    return false;
}

module.exports = check;