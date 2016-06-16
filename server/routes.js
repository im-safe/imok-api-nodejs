/**
 * Created by saleh on 6/12/16.
 */

var UsersCtrl = require('./Controllers/Users');

module.exports = function(app) {

    app.post('/register', UsersCtrl.create);
};