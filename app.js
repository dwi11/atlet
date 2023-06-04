var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require("express-flash");
var session = require("express-session");
var connection = require('./config/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var atletRouter = require('./routes/atlet');
var pelatihRouter = require('./routes/pelatih');
var caborRouter = require('./routes/cabor');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "rahasia",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 60000,
    },
  })
)
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/atlet', atletRouter);
app.use('/pelatih', pelatihRouter);
app.use('/cabor', caborRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
