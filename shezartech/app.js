var express = require('express');
global.express = express;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
global.async = async;

var db = require('./app/db');
global.db = db;
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var main_page = require('./routes/main_page');
var form_contact = require('./routes/form_contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb://localhost:27017/Test_shztch', function (err, db) {
  if (err) throw err
    //console.log(db)
})

console.log("himanshu")

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/signup', signup);
app.use('/main_page', main_page);
app.use('/form_contact', form_contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
