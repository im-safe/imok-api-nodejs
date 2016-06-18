/**
 * Created by saleh on 6/16/16.
 */
var User = require('../Models/User').model;
var Q = require('q');

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

module.exports = {
    checkExists: checkExists
};