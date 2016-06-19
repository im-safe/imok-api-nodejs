'use strict';
var njwt = require('njwt');
var fs = require('fs');

/**
 * Check access token if valid
 *
 * @param req
 * @param res
 * @param next
 */
function authorize(req, res, next)
{
    generateToken('324567');
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

/**
 * Generate new access token
 *
 * @param userId
 * @returns {{access_token: *, token_type: string, expires_in: number}}
 */
function generateToken(userId)
{
    var claims = {
        iss: "http://imok.com/",  // Issuer
        sub: userId,    // User ID
        scope: "api"
    };

    var expiration_date = new Date('2030-01-01');

    var jwt = njwt.create(claims, readSecreteKeyFile(), 'HS256');
    jwt.setExpiration(expiration_date);

    return {
        access_token: jwt.compact(),
        token_type: 'Bearer',
        expires_in: expiration_date.getTime() - Date.now()
    };
}

/**
 * Read secret key file
 * @returns {*}
 */
function readSecreteKeyFile()
{
        return fs.readFileSync(process.cwd() + '/server/Keys/imok.pem');
}

module.exports = {
    authorize: authorize,
    generateToken: generateToken
};