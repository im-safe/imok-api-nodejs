'use strict';

var Event = require('../../Models/Event').model;

exports.create = function(req, res, next) {
    req.checkBody({
        description: { notEmpty: true },
        longitude: { notEmpty: true, isValidCoordinate: true},
        latitude: { notEmpty: true, isValidCoordinate: true}
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    var eventData = {
        description: req.body.description,
        location: [ req.body.longitude, req.body.latitude ]
    };

    var event = new Event(eventData);

    event.save(function(err){
        if(err){
            return res.mongooseError(err);
        }

        return res.jsonResponse(event);
    });
};