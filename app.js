var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session= require('express-session');
var logger = require('morgan');
var expressValidator =require('express-validator');
var bodyParser=require('body-parser');
var mongo =require('mongodb');
var db=require('mongoose');
var multer=require('multer');
var upload = multer({ dest: './uploads' });

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

app.locals.moment=require('moment');
//setting view engine 
app.set('view engine', 'ejs');
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
//using session
app.use(session({
    secret: 'ichraf',
    resave:true,
    saveUninitialized:true
}));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
