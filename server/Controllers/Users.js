/**
 * Created by saleh on 6/12/16.
 */
var User = require('../Models/User').model;

exports.register = function(req, res) {
    // Validate Data
    req.checkBody({
        country_code: { notEmpty: true },
        phone_number: { notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        res.status(400).json({
            error: true,
            results: null,
            errors: errors
        });

        return null;
    }

    var userData = {
        country_code: req.body.country_code,
        phone_number: req.body.phone_number,
        is_active: true
    };

    var user = new User(userData);

    user.save(function(err, user){
        if(err){
            return res.status(400).json({
                error: true,
                results: null,
                errors: err
            });
        }

        var result = {
            id : user._id,
            friends: user.friends,
            last_location: user.last_location,
            country_code: user.country_code,
            phone_number: user.phone_number,
            device: user.device,
            friends: user.friends
        };

        return res.json({
            error: false,
            results: result,
            errors: []
        });
    });
};