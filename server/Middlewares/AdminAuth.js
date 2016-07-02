'use strict';
var bcrypt = require('bcrypt');


function authorize(req, res, next)
{
    if(req.session.admin){
        next();
    }else{
        return res.jsonError('Unauthorized', 401);
    }
}

module.exports = authorize;