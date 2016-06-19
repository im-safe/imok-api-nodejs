/**
 * Created by saleh on 6/12/16.
 */

var UsersCtrl = require('./Controllers/Users');
var authorize = require('./Middlewares/Jwt');

module.exports = function(app) {

    // Auth
    app.post('/api/auth/register', UsersCtrl.register);
    app.post('/api/auth/access-token', UsersCtrl.confirm);
};