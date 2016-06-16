/**
 * Created by saleh on 6/16/16.
 */
var Q = require('q');
var User = require('../Models/User').model;

function saveDevice(
    userId,
    deviceId,
    platform_type,
    token
)
{
    var deferred = Q.defer();

    var deviceData = {
        deviceId: deviceId,
        platform_type: platform_type,
        token: token
    };

    User.update({ _id: userId }, { "$set": { device : deviceData } }, function(err){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

module.exports = {
    saveDevice: saveDevice
};