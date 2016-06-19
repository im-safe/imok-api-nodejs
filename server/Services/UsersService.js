'use strict';

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
        if(data && data.length > 0){
            deferred.resolve(data[0]);
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
 * @return void
 */
function createUser(userData, callback)
{
    var user = new User(userData);

    user.save(function(err){
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

/**
 * Update user info
 *
 * @param userId
 * @param userData
 * @param callback
 */
function updateUser(userId, userData, callback)
{
    User.findByIdAndUpdate(userId, { $set: userData }, { new: true, runValidators: true }, function(err, user){
        if(err) {
            callback(true, 'Error while confirm user, Please contact system administrator');
        }

        if(user){
            var result = {
                id : user._id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                country_code: user.country_code,
                phone_number: user.phone_number,
                friends: user.friends || [],
                last_location: user.last_location || [],
                device: user.device || {}
            };

            callback(false, result);
        } else {
            callback(true, 'nothing update');
        }
    });
}

/**
 * Get user by ID
 *
 * @param userId
 * @param callback
 */
function getUserById(userId, callback)
{
    User.findById(userId, function(err, user){
        if(err) {
            callback(true, err);
        }

        callback(false, user);
    });
}

/**
 * Generate confirmation code
 *
 * @returns {number}
 */
function generateConfirmationCode()
{
    var min = Math.pow(10, 5);
    var max = Math.pow(10, 6) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    checkExists: checkExists,
    createUser: createUser,
    updateUser: updateUser,
    getUserById: getUserById,
    generateConfirmationCode: generateConfirmationCode
};