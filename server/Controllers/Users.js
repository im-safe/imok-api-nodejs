'use strict';

var User = require('../Models/User').model;
var UsersService = require('../Services/UsersService');

exports.register = function(req, res) {
    // Validate Data
    req.checkBody({
        country_code: { notEmpty: true },
        phone_number: { notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    // Check user if exists by country_code and phone_number
    var promise = UsersService.checkExists(req.body.country_code, req.body.phone_number);

    promise
        .then(function(exists){
            if(exists !== false){ // Login
                if(!exists.is_active) {
                    return res.jsonError('User Not Activated, Please contact system administrator');
                }

                var data = {
                    confirm_code: UsersService.generateConfirmationCode(),
                    is_confirmed: false
                };

                UsersService.updateUser(exists._id, data, function(error, result){
                    if(error){
                        return res.jsonMongooseError(result);
                    }

                    // TODO Send confirmation code via SMS
                    return res.jsonResponse();
                });
            }else{ // New user

                var userData = {
                    country_code: req.body.country_code,
                    phone_number: req.body.phone_number,
                    is_active: true
                };

                UsersService.createUser(userData, function(error, result){
                    if(error){
                        return res.jsonMongooseError(result);
                    }

                    // TODO Send confirmation code via SMS
                    return res.jsonResponse(result);
                });
            }
        })
        .fail(function(err){
            return res.jsonExpressError(err);
        });
};

exports.confirm = function(req, res, next){
    req.checkBody({
        userId: { notEmpty: true },
        confirm_code: { notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        res.status(400).json({
            error: true,
            results: null,
            errors: errors
        });

        return null;
    }

    User.findById(req.body.userId, function(err, user){
        if(err){
            return res.status(400).json({
                error: true,
                results: null,
                errors: err
            });
        }

        if(user.is_confirmed) {
            return res.json({
                error: false,
                results: {
                    status: 'already confirmed'
                },
                errors: []
            });
        }

        if(user.confirm_code == req.body.confirm_code) {
            user.is_confirmed = true;
            user.save(function(){
                return res.json({
                    error: false,
                    results: {
                        status: 'confirmed'
                    },
                    errors: []
                });
            });
        }else{
            return res.status(400).json({
                error: true,
                results: {},
                errors: [
                    { msg: 'Not Confirmed' }
                ]
            });
        }
    });
};