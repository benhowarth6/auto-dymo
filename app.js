const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}))

app.use(express.json());

const getDateTime = require('./lib/util/getDateTime');

//Route any /tickets requests
const ticketRoutes = require('./lib/routes/tickets');
app.use('/tickets', ticketRoutes)

//Route any /print requests
const printRoutes = require('./lib/routes/print');
app.use('/print', printRoutes);


//Any request that makes it here is ~no bueno~
app.use((req, res, next ) => {

  //Log the IP of invalid requests - skimmer catching
  var logIp = req.socket.remoteAddress;
  //If the IP begins with "::ffff:", trim it off
  if(logIp.substr(0, 7) === '::ffff:') logIp = logIp.substr(7);

  //Log the time and IP
  console.log("\n\n" + getDateTime() + " Invalid request from " + logIp + ":");

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

