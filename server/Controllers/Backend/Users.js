'use strict';
var User = require('../../Models/User').model;
var UsersService = require('../../Services/UsersService');

exports.list = function(req, res, next)
{
    var page = req.query.page;

    UsersService.getList({ page: page }, function(error, users){
        if(error){
            return res.jsonError(users);
        }

        return res.jsonResponse(users);
    });
};