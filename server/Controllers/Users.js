/**
 * Created by saleh on 6/12/16.
 */
var User = require('../Models/User');

exports.create = function(req, res) {
    // Validate Data
    req.checkBody({
        country_code: { notEmpty: true},
        phone_number: { notEmpty: true}
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
        phone_number: req.body.phone_number
    };

    var user = new User(userData);

    user.save(function(err){
        if(err){
            return res.status(400).json({
                error: true,
                results: null,
                errors: err
            });
        }

        return res.json({
            error: false,
            results: user,
            errors: []
        });
    });
};