const winston = require('winston');

require('winston-papertrail').Papertrail;
var logger = new winston.transports.Papertrail({
    host: 'logs4.papertrailapp.com', // you get this from papertrail account
    port: 36485, //you get this from papertrail account
    handleExceptions: true
  });

module.exports = logger;