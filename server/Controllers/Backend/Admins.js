'use strict';
var Admin = require('../../Models/Admin').model;
var AdminsService = require('../../Services/AdminsService');
var passwordHash = require('password-hash');

exports.list = function(req, res, next)
{
    var page = req.query.page;

    AdminsService.getList({ page: page }, function(error, admins){
        if(error){
            return res.jsonError(admins);
        }

        return res.jsonResponse(admins);
    });
};

exports.create = function(req, res, next) {
    req.checkBody({
        first_name: { optional: true },
        last_name: { optional: true },
        email: { notEmpty: true },
        password: { notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    var adminData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password)
    };

    AdminsService.createAdmin(adminData, function(error, admin){
        if(error){
            return res.jsonError('Can\'t create new admin');
        }

        return res.jsonResponse(admin);
    });
};