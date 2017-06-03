var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var db = require('./app/db');
var Utility = require('./services/Utility');
global.Utility = Utility;
global.db = db;
var moment = require('moment-timezone');
global.moment = moment;

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var main_page = require('./routes/main_page');
var form_contact = require('./routes/form_contact');
var scheduling = require('./routes/scheduling');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb://localhost:27017/Test_shztch', function (err, db) {
    if (err) throw err
    //console.log(db)
})

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/main_page', main_page);
app.use('/signup', signup);
app.use('/form_contact', form_contact);
app.use('/scheduling', scheduling);

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

var cron = require('node-cron');
 
var task = cron.schedule('* * * * *', function() {
    console.log('will execute every minute until stopped');
    db.getConnection(function (db) {
        console.log("connected db queue database : ")

        var timestamp = new Date().getTime();

        console.log(timestamp)

        db.collection('queue', function(err, collection) {
            console.log("1111111111111111")
            collection.find({'ts': {'$gte' : timestamp}}).toArray(function(err, resulte) {
                console.log("22222222222222222")

                resulte.forEach(function (resulte,iop){
                    console.log(resulte)
                    console.log("iop ::: "+iop)
                    var templateid = resulte.templateid;
                    var list_id = parseInt(resulte.list_id);
                    console.log(list_id)
                    if(templateid && list_id) {
                        console.log("qwertyuiop")
                        Utility.sendBroadcastMessege(templateid, list_id);
                    }

                    var rec_id = resulte._id;
                    var scheduling_type = resulte.scheduling_type;
                    var interval = resulte.interval;
                    var scheduling_slot_time = resulte.scheduling_slot_time;
                    var ts = resulte.ts;

                    if(parseInt(resulte.scheduling_type) == 1) {
                        console.log("333333333333333333333")
                        Utility.requeueData(scheduling_type, interval, scheduling_slot_time, ts, templateid, list_id, function (res_data) {
                            console.log("inserted as requeue successfully...")
                            console.log(res_data)
                        });
                    }

                    collection.remove({_id: rec_id}, function (err) {
                        if(err) {
                            console.log("record not deleted from queue ::: "+rec_id);
                        }
                        else {
                            console.log("record deleted from queue ::: "+rec_id);
                        }
                    });
                });
            });
        });
    });
});

module.exports = app;
