/**
 * Created by saleh on 6/12/16.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var jsonResponse = require('./Middlewares/JsonResponse');

// Load environment variables from .env file
dotenv.load();

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
app.use(jsonResponse.express);
app.use(function(req, res, next){
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type, Authorization'
    );
    next();
});
app.use(session({
    secret: '#@$%^&*uhgfd32456uyjk',
    resave: false,
    saveUninitialized: true
}));

// Custom express validator
app.use(expressValidator({
    customValidators: {
        isObjectId: function(value) {
            return mongoose.Types.ObjectId.isValid(value);
        },
        isValidCoordinate: function(value){
            return /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/.test(value);
        }
    }
}));

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

// Routes
require('./routes')(app);

module.exports = app;