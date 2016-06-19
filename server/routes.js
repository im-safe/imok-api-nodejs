/**
 * Created by saleh on 6/12/16.
 */

var AuthCtrl = require('./Controllers/Auth');
var UsersCtrl = require('./Controllers/Backend/Users');
var EventsCtrl = require('./Controllers/Backend/Events');
var authorize = require('./Middlewares/Jwt');

module.exports = function(app) {
    var apiRoutePrefix = '/api/';

    /**
     * Backend API
     */
    app.get(apiRoutePrefix + 'users', UsersCtrl.list);

    app.post(apiRoutePrefix + 'events', EventsCtrl.create);


    /**
     * Frontend API
     */
    app.post(apiRoutePrefix + 'auth/register', AuthCtrl.register);
    app.post(apiRoutePrefix + 'auth/access-token', AuthCtrl.confirm);
};