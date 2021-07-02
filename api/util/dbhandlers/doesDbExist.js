const fs = require('fs')
const getDateTime = require('../getDateTime')

function doesDbExist(){
    if(!fs.existsSync('./ActiveTickets.txt')){
        fs.appendFile('./ActiveTickets.txt', '', function (err) {
            if (err) console.log("\n\n" + getDateTime() + " Error in DB creation: " + err)
        })
    }
}

module.exports = doesDbExist;