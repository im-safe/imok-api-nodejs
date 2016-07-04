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

    res.setHeader(
        'Access-Control-Allow-Origin',
        'http://imok-ui.dev'
    );

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    next();
});
//app.set('trust proxy', 1);
app.use(session({
    secret: '#@$%^&*uhgfd32456uyjk',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 * 24 * 2 }
}));

// Custom express validator
app.use(expressValidator({
    customValidators: {
        isObjectId: function(value) {
            return mongoose.Types.ObjectId.isValid(value);
        },
        isValidCoordinate: function(value){
            return /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,50}$/.test(value);
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