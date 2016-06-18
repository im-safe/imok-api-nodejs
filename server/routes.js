/**
 * Created by saleh on 6/12/16.
 */

var UsersCtrl = require('./Controllers/Users');

module.exports = function(app) {

    // Auth
    app.post('/register', UsersCtrl.register);

    // Users
    app.post('/users/confirm', UsersCtrl.confirm);
};