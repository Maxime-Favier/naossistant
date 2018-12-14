var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/patientlist');
var medRouter = require('./routes/medecinlist');
var rdvRouter = require("./routes/rdvlist");
var apiPatient = require('./routes/api/patients');
var apiMedecins = require('./routes/api/medecin');
var apirdv = require("./routes/api/rdv");

var app = express();

//body parser
// parse various different custom JSON types as JSON
app.use(bodyParser.json({type: 'application/*+json'}));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({type: 'application/vnd.custom-type'}));
// parse an HTML body into a string
app.use(bodyParser.text({type: 'text/html'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/patient', usersRouter);
app.use('/medecin', medRouter);
app.use('/rdv', rdvRouter);
app.use('/api/patient', apiPatient);
app.use('/api/medecin', apiMedecins);
app.use('/api/rdv', apirdv);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
