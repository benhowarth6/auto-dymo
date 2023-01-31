const express = require('express');
const app = express();
const printRoutes = require('./lib/routes/print');
const returnCode = require('./lib/util/http/returnCode');
const logger = require('./lib/util/other/logger');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

//Route any /print requests
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/print', printRoutes);

//Log the IP of invalid requests - skimmer catching
app.use('/favicon.ico', (req, res) => {
  logger.log('info', "\nScraper: " + req.socket.remoteAddress.replace("::ffff",''));
  returnCode(204, res, req.body, '');
})

//Log the IP of invalid requests - skimmer catching
app.use('/', (req, res) => {
  logger.log('info', "\nScraper: " + req.socket.remoteAddress.replace("::ffff",''));
  returnCode(204, res, req.body, '');
})

//Any request that makes it here is ~no bueno~
app.use((req, res, next ) => {
  //Log the time and IP
  logger.log('info', "\n\nInvalid request from " + req.socket.remoteAddress.replace("::ffff",'') + ":");

  const error = new Error(':(');
  error.status = 404;
  next(error);
})

//If you get a 500 back, something is wrong with the code itself.
app.use((error, res) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;