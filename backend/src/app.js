const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const mongoose = require("mongoose");
const session = require('express-session');

const passport = require('passport');
const cors = require("cors");
const httpStatus = require("http-status");
const { localLoginStrategy, localRegisterStrategy } = require('./config/passport');
const morgan = require('./config/morgan');
const config = require("./config/config");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const MongoStore = require('connect-mongo');

const app = express();


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
app.use(
  session({
    name: 'idq-1',
    secret: 'cats',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 250000000, httpOnly: false, secure: false },
    store : new  MongoStore({ mongoUrl: config.mongoose.url, collection: 'sessions' })
  })
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use('local.login', localLoginStrategy);
passport.use('local.register', localRegisterStrategy);

// v1 api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
