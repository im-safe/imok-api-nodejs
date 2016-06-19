/**
 * Created by saleh on 6/12/16.
 */

var UsersCtrl = require('./Controllers/Users');
var authorize = require('./Middlewares/Jwt');

module.exports = function(app) {
    var apiRoutePrefix = '/api/';

    // Auth
    app.post(apiRoutePrefix + 'auth/register', UsersCtrl.register);
    app.post(apiRoutePrefix + 'auth/access-token', UsersCtrl.confirm);
};