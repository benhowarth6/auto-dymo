const winston = require('winston');
const constants = require('./constants')
require('winston-papertrail').Papertrail;
module.exports = new winston.transports.Papertrail({
  host: constants.loggerUrl,
  port: constants.loggerPort,
  handleExceptions: true,
  colorize: true
});