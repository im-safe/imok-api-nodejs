/**
 * Created by saleh on 6/16/16.
 */
var User = require('../Models/User').model;
var Q = require('q');

/**
 * Check user if exists
 *
 * @param country_code
 * @param phone_number
 * @returns Promise
 */
function checkExists(country_code, phone_number)
{
    var deferred = Q.defer();

    User.find({
        country_code: country_code,
        phone_number: phone_number
    }, function(err, data){
        if(err){
            deferred.reject(err);
        }
        if(data){
            deferred.resolve(true);
        }else{
            deferred.resolve(false);
        }
    });

    return deferred.promise;
}

/**
 * Create new user
 *
 * @param userData
 * @param callback
 */
function createUser(userData, callback)
{
    var user = new User(userData);

    user.save(function(err, user){
        if(err){
            callback(true, err);
        }

        var result = {
            id : user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            country_code: user.country_code,
            phone_number: user.phone_number,
            friends: user.friends,
            last_location: user.last_location,
            device: user.device
        };

        callback(false, result);
    });
}

module.exports = {
    checkExists: checkExists,
    createUser: createUser
};