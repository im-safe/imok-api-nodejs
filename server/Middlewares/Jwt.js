'use strict';
var njwt = require('njwt');
var fs = require('fs');

function authorize(req, res, next)
{
    var token;
    var header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        var bearer = header.split(" ");
        token = bearer[1];
        req.token = token;

        try{
            var verifiedToken = njwt.verify(token, readSecreteKeyFile(), 'HS256');

            // Set token in request
            req.token = verifiedToken.body;

            next();
        }catch(e){
            res.jsonError('Not Authorized', 400);
        }
    }else{
        res.jsonError('Not Authorized', 400);
    }
}

function readSecreteKeyFile()
{
        return fs.readFileSync(process.cwd() + '/server/Keys/imok.pem');
}

module.exports = authorize;