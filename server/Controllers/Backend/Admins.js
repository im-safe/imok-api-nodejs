'use strict';
var Admin = require('../../Models/Admin').model;
var AdminsService = require('../../Services/AdminsService');
var bcrypt = require('bcrypt');

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

exports.create = function(req, res, next)
{
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
        password: req.body.password
    };

    AdminsService.getAdminByEmail(adminData.email, function(error, admin){
        if(error){
            return res.jsonError('Can\'t create new admin');
        }

        if(admin){
            return res.jsonError('Email address is already exists.');
        }else{
            AdminsService.createAdmin(adminData, function(error, admin){
                if(error){
                    return res.jsonError('Can\'t create new admin');
                }

                return res.jsonResponse(admin);
            });
        }
    });
};

exports.login = function(req, res, next)
{
    if(req.session.admin)
    {
        return res.jsonError('Admin already logged in');
    }

    req.checkBody({
        email: { notEmpty: true },
        password: { notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    AdminsService.getAdminByEmail(req.body.email, function(error, admin){
        if(error){
            return res.jsonError('Error while login');
        }

        if(!admin){
            console.info('Admin not exists');
            return res.jsonError('Email or Password not correct');
        }

        if(bcrypt.compareSync(req.body.password, admin.password)){
            req.session.admin = admin;

            return res.jsonResponse({ adminId: admin._id });
        } else {
            console.info('password not correct');
            return res.jsonError('Email or Password not correct');
        }
    });
};

exports.checkLogin = function(req, res, next)
{
    if(req.session.admin){
        return res.jsonResponse(req.session.admin._id);
    }else{
        return res.jsonError('Unauthorized', 401);
    }
};

exports.logout = function(req, res, next)
{
    delete req.session.admin;

    return res.jsonResponse('success');
};