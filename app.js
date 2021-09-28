const checkAuth = require('./lib/util/checkAuth');
const express = require('express');
const app = express();

const logger = require('./lib/util/logger')
const expressWinston=require('express-winston'); // it will help in using logger as middleware

app.use(express.urlencoded({extended: false}))
app.use(express.json());

const getDateTime = require('./lib/util/getDateTime');

//Route any /print requests
const printRoutes = require('./lib/routes/print');
app.use('/print', printRoutes);

const returnCode = require('./lib/util/returnCode');

//Scraper deterrent
app.use('/favicon.ico', (req, res, next) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress;
  //If the IP begins with "::ffff:", trim it off
  if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7);
  
  logger.log('info', "\n" + getDateTime() + " Scraper: " + logIp);
  returnCode(404, res, req.body, "File does not exist. Stop scraping.")
})

app.use('/', (req, res, next) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress;
  //If the IP begins with "::ffff:", trim it off
  if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7);

  if(checkAuth(res, req, "")){
    returnCode(400, res, req.body, console)
  }

  logger.log('info', "\n" + getDateTime() + " Scraper: " + logIp);
  returnCode(404, res, req.body, "Site does not exist. Stop scraping.")
})

//Any request that makes it here is ~no bueno~
app.use((req, res, next ) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress;
  //If the IP begins with "::ffff:", trim it off
  if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7);

  //Log the time and IP
  logger.log('info', "\n\n" + getDateTime() + " Invalid request from " + logIp + ":");

  const error = new Error('Invalid request.');
  error.status = 404;
  next(error);
})

//If you get a 500 back, something is wrong with the code itself.
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;