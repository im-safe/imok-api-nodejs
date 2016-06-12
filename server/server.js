/**
 * Created by saleh on 6/12/16.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.load();

// Controllers

var app = express();

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', function(){
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running');
    process.exit(1);
});

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

// Production error handler
if(app.get('env') == 'production') {
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.sendStatus(err.stack || 500);
    });
}

app.listen(app.get('port'), function(){
    console.log('Express server listing on port ' + app.get('port'));
});

module.exports = app;