var mongoose = require('mongoose');

exports.list = function(req, res, next)
{
    mongoose.connection.db.collection('countries', function(err, collection){
        collection.find({}).toArray(function(err, data){
            if(err){
                return res.jsonError('Error while getting countries');
            }

            res.jsonResponse(data);
        });
    });
};