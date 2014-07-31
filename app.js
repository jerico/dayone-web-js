var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var nedb = require('nedb');
var plist = require('plist-parser');
var fs = require('fs');
var stylus = require('stylus');
var nib = require('nib');

//var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// database setup
//var db = new nedb({ filename: './nedb', autoload: true });
var db = new nedb();

// get all files
var dayoneDir = './Journal.dayone/entries/';
var dayoneFiles = fs.readdirSync(dayoneDir);

dayoneFiles.forEach(function(el, idx, array) {
  fs.readFile(dayoneDir + el, { encoding: 'utf8' }, function(err, entry) {
    processFile(err, entry);
  }); 
  var processFile = function(err, entry) {
    var toJson = new plist.PlistParser(entry);
    db.find({ UUID: toJson.parse().UUID }, function(err, docs) {
      if (docs == []) { 
        console.log( "Record already exist" ); 
      }
      else { 
        db.insert(toJson.parse(), function(err, docs) {
          console.log( "Added record " + docs.UUID ); 
        });
      }
    });
  };

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(stylus.middleware({
  src: __dirname + '/public/css/',
  force: true,
  compile: function(str, path) {
    return stylus(str).set('filename', path).use(nib());
  } 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  db.find({}).sort({ "Creation Date": -1 }).exec(function (err, docs) {
    res.render('index', { entries: docs });
  });
});

app.get('/view/:uuid', function(req, res) {
  db.findOne({ UUID: req.params.uuid }, function(err, docs) {
    res.render('view', { entry: docs });
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
