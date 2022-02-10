var exec = require('child_process').execFile;
const constants = require('../constants');
const logger = require('./logger');

module.exports = function(){
    exec(constants.dymoServicePath + "DYMO.DLS.Printing.Host.exe", function(err, data) {  
        if(err) logger.log('error', err);     
    });
 }