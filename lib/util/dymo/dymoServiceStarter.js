var exec = require('child_process').execFile;
const constants = require('../other/constants');

module.exports = function(){
    return(exec(constants.dymoServicePath + "DYMO.DLS.Printing.Host.exe", function(err) {  
        if(err) return err;
    }));
 }