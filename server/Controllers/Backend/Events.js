'use strict';

var Event = require('../../Models/Event').model;
var EventsService = require('../../Services/EventsService');

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

exports.list = function(req, res, next)
{
    var page = req.query.page;

    EventsService.getList({ page: page }, function(error, events){
        if(error){
            return res.jsonError(events);
        }

        return res.jsonResponse(events);
    });
};

exports.info = function(req, res, next)
{
    EventsService.getEventById(req.params['id'], function(error, event){
        if(error){
            return res.jsonError(event, 404);
        }

        return res.jsonResponse(event);
    });
};