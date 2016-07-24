/**
 * Created by saleh on 6/12/16.
 */

var AuthCtrl = require('./Controllers/Auth');
var UsersCtrl = require('./Controllers/Backend/Users');
var EventsCtrl = require('./Controllers/Backend/Events');
var AdminsCtrl = require('./Controllers/Backend/Admins');
var CountriesCtrl = require('./Controllers/Backend/Countries');

var FrontUserCtrl = require('./Controllers/Users');
var Jwt = require('./Middlewares/Jwt');
var AdminAuth = require('./Middlewares/AdminAuth');

function objectId()
{
    return '[0-9a-fA-F]{24}';
}

module.exports = function(app) {
    var apiRoutePrefix = '/api/';

    // Check ID parameter before enter process
    app.param('id', function(req, res, next, id){
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.jsonError('Invalid ID');
        }

        return next();
    });

    /**
     * Backend API
     */

    // Users
    app.get(apiRoutePrefix + 'users', AdminAuth, UsersCtrl.list);

    // Events
    app.get(apiRoutePrefix + 'events', AdminAuth, EventsCtrl.list);
    app.get(apiRoutePrefix + 'events/:id', AdminAuth, EventsCtrl.info);
    app.put(apiRoutePrefix + 'events/:id', AdminAuth, EventsCtrl.update);
    app.post(apiRoutePrefix + 'events/:id/publish', AdminAuth, EventsCtrl.publishEvent);
    app.post(apiRoutePrefix + 'events', AdminAuth, EventsCtrl.create);

    // Admins
    app.post(apiRoutePrefix + 'admins/auth', AdminsCtrl.login);
    app.get(apiRoutePrefix + 'admins/check-login', AdminsCtrl.checkLogin);
    app.post(apiRoutePrefix + 'admins/logout', AdminsCtrl.logout);
    app.get(apiRoutePrefix + 'admins', AdminAuth, AdminsCtrl.list);
    app.get(apiRoutePrefix + 'admins/:id', AdminAuth, AdminsCtrl.info);
    app.put(apiRoutePrefix + 'admins/:id', AdminAuth, AdminsCtrl.update);
    app.post(apiRoutePrefix + 'admins', AdminAuth, AdminsCtrl.create);

    // Countries
    app.get(apiRoutePrefix + 'countries', CountriesCtrl.list);


    /**
     * Frontend API
     */

    // Auth
    app.post(apiRoutePrefix + 'auth/register', AuthCtrl.register);
    app.post(apiRoutePrefix + 'auth/access-token', AuthCtrl.confirm);

    // Events response
    app.post(apiRoutePrefix + 'alarm-response', Jwt.authorize, FrontUserCtrl.alarmResponse);

    //Update contact's list
    app.post(apiRoutePrefix + 'contacts', Jwt.authorize, FrontUserCtrl.updateContactList);
};