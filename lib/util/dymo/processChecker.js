const logger = require('../other/logger');
const exec = require('child_process').exec;

module.exports = function processChecker(query){
    let platform = process.platform;
    let cmd = '';
    switch(platform){
        case 'win32': cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    try{
        exec(cmd, (err, stdout, stderr) => {
            return (stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
    }
    catch(err){
        logger.log('error', "Error in checkings status of DYMO service: " + err);
        return false;
    }
    
}