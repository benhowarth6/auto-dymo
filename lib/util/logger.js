const winston = require('winston');
var constants = require('../constants')
require('winston-papertrail').Papertrail;
var logger = new winston.transports.Papertrail({
    host: constants.loggerUrl,
    port: constants.loggerPort,
    handleExceptions: true,
    colorize: true
  });

module.exports = logger;