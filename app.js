const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}))

app.use(express.json());

const ticketRoutes = require('./api/routes/tickets');
const getDateTime = require('./api/util/getDateTime');
app.use('/tickets', ticketRoutes)

app.use((req, res, next ) => {

  var datetime = new Date();
  console.log("\n\n" + getDateTime() + " Invalid request:");

  const error = new Error('Invalid request.');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;

