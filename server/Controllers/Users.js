'use strict';

var User = require('../Models/User').model;
var UsersService = require('../Services/UsersService');
var jwt = require('../Middlewares/Jwt');

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
        return res.jsonExpressError(errors);
    }

    UsersService.getUserById(req.body.userId, function(error, result){
        if(error) {
            return res.jsonMongooseError(result);
        }

        if(result.is_confirmed){
            return res.jsonResponse('User already confirmed');
        }

        if(result.confirm_code == req.body.confirm_code) {
            UsersService.updateUser(req.body.userId, {is_confirmed: true}, function(error, result){
                if(error) {
                    return res.jsonMongooseError(result);
                }

                var access_token = jwt.generateToken(req.body.userId);

                return res.jsonResponse(access_token);
            });
        }else{
            return res.jsonError('not valid code', 200);
        }
    });
};