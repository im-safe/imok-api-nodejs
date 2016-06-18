/**
 * Modeling response include (express-validator, mongoose)
 * {
 *      result Mixed Types
 *      errors : [
 *          { field: "", msg: "" }
 *      ]
 * }
 *
 * @author Saleh Saeed <saleh.saiid@gmail.com>
 *
 */

'use strict';

var JsonResponse = function(){
    var self = this;
    /*jshint validthis:true */
    self.defaultKey = 'result';


    self.express = function( req, res, next ){
        self.req = req;
        self.res = res;

        // normal response
        res.jsonResponse = self.response;

        // normal error
        res.jsonError = self.error;

        // for mongoose validations error
        res.jsonMongooseError = self.mongooseError;

        // for express-validator middleware
        res.jsonExpressError = self.expressError;

        next();
    };


    self.setHeader = function(){
        self.res.type('json');
    };

    self.response = function(data, status){
        status = status || 200;

        self.setHeader();

        var results = {};
        results.error = false;
        results.errors = null;
        results[self.defaultKey] = data;

        self.res.status(status).json(results);
    };

    function modelError(errorMsg, field){
        var errorModel = {
            message: errorMsg,
            field: null
        };

        if(field !== ''){
            errorModel.field = field;
        }

        return errorModel;
    }

    self.error = function(errorMsg, field, status) {
        if(typeof field === 'number'){
            status = field;
            field = '';
        }

        status = status || 400;

        self.setHeader();

        var results = null;
        var errors = [];
        var error = true;
        errors.push(modelError(errorMsg, field));

        var response = modelCompleteResponse(error, errors, results);

        self.res.status(status).json(response);
    };

    self.mongooseError = function (err, status) {
        status = status || 400;

        self.setHeader();

        var results = null;
        var errors = [];
        var error = true;

        if(err.errors){
            for(var field in err.errors){
                errors.push(modelError(err.errors[field].message, field));
            }
        }

        var response = modelCompleteResponse(error, errors, results);

        self.res.status(status).json(response);
    };

    self.expressError = function (errs, status){
        status = status || 400;

        self.setHeader();

        var results = null;
        var errors = [];
        var error = true;

        if(errs){
            for (var x in errs) {
                errors.push(modelError(errs[x].msg, errs[x].param));
            }
        }

        var response = modelCompleteResponse(error, errors, results);

        self.res.status(status).json(response);
    };

    function modelCompleteResponse(error, errors, results)
    {
        var obj = {};
        obj[self.defaultKey] = results;
        obj.errors = errors;
        obj.error = error;

        return obj;
    }
};

module.exports = new JsonResponse();