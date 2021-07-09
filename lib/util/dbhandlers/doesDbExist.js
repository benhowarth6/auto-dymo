const fs = require('fs')
const getDateTime = require('../getDateTime')

function doesDbExist(){
    if(!fs.existsSync('./ActiveTickets.txt')){
        fs.appendFile('./ActiveTickets.txt', '', function (err) {
            if (err) console.log("\n\n" + getDateTime() + " Error in DB creation: " + err)
        })
        while(!fs.existsSync('./ActiveTickets.txt')){
            //Do nothing, wait for file creation - somehow the program was getting out of this function before file creation
        }
    }
}

module.exports = doesDbExist;