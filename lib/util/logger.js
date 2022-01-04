const winston = require('winston');
var constants = require('../constants')
const trail = require('winston-papertrail').Papertrail;
var logger = new winston.transports.Papertrail({
    host: constants.loggerUrl,
    port: constants.loggerPort,
    handleExceptions: true
  });

module.exports = logger;