/**
 * Created by saleh on 6/12/16.
 */

var AuthCtrl = require('./Controllers/Auth');
var UsersCtrl = require('./Controllers/Backend/Users');
var EventsCtrl = require('./Controllers/Backend/Events');
var authorize = require('./Middlewares/Jwt');

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
    app.get(apiRoutePrefix + 'users', UsersCtrl.list);

    // Events
    app.get(apiRoutePrefix + 'events', EventsCtrl.list);
    app.get(apiRoutePrefix + 'events/:id', EventsCtrl.info);
    app.put(apiRoutePrefix + 'events/:id', EventsCtrl.update);
    app.post(apiRoutePrefix + 'events', EventsCtrl.create);


    /**
     * Frontend API
     */

    // Auth
    app.post(apiRoutePrefix + 'auth/register', AuthCtrl.register);
    app.post(apiRoutePrefix + 'auth/access-token', AuthCtrl.confirm);
};