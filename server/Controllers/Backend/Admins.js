'use strict';
var Admin = require('../../Models/Admin').model;
var AdminsService = require('../../Services/AdminsService');

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