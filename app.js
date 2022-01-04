const checkAuth = require('./lib/util/checkAuth');
const express = require('express');
const app = express();

const logger = require('./lib/util/logger');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const getDateTime = require('./lib/util/getDateTime');

//Route any /print requests
const printRoutes = require('./lib/routes/print');
app.use('/print', printRoutes);

const returnCode = require('./lib/util/returnCode');

//Scraper deterrent
app.use('/favicon.ico', (req, res, next) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress.replace("::ffff",'');
  
  logger.log('info', "\n" + getDateTime() + " Scraper: " + logIp);
  returnCode(404, res, req.body, ":(")
})

app.use('/', (req, res, next) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress.replace("::ffff",'');

  if(checkAuth(res, req, "")){
    returnCode(400, res, req.body, console)
  }

  logger.log('info', "\n" + getDateTime() + " Scraper: " + logIp);
  returnCode(404, res, req.body, ":(")
})

//Any request that makes it here is ~no bueno~
app.use((req, res, next ) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress.replace("::ffff",'');

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