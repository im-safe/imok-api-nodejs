'use strict';

var Event = require('../../Models/Event').model;
var EventsService = require('../../Services/EventsService');
var UsersService = require('../../Services/UsersService');
var _ = require('lodash');

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
        location: [ req.body.longitude, req.body.latitude ],
        is_published: false,
        is_active: true
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

exports.update = function(req, res, next)
{
    req.checkBody({
        longitude: { optional: true, isValidCoordinate: true },
        latitude: { optional: true, isValidCoordinate: true },
        is_active: { optional: true, isBoolean: true },
        is_published: { optional: true, isBoolean: true },
        description: { optional: true, notEmpty: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    EventsService.getEventById(req.params['id'], function(error, event){
        if(error){
            return res.jsonError(event);
        }

        // Prevent update event if already published
        if(event.is_published == true){
            return res.jsonError('Can not edit published event');
        }

        var eventData = {};

        if(req.body.longitude && req.body.latitude){
            eventData.location = [req.body.longitude, req.body.latitude];
        }

        if(req.body.is_active) {
            eventData.is_active = req.body.is_active;
        }

        if(req.body.description) {
            eventData.description = req.body.description;
        }

        if(!_.isEmpty(eventData)){
            EventsService.updateEvent(req.params['id'], eventData, function(error, event){
                if(error){
                    return res.jsonError(event);
                }

                return res.jsonResponse(event);
            });
        }else{
            return res.jsonResponse('Nothing to update');
        }
    });
};

exports.publishEvent = function(req, res, next){
    EventsService.getEventById(req.params['id'], function(error, event){
        if(error){
            return res.jsonError(event);
        }

        if(event.is_published){
            return res.jsonError('Event is already published');
        }

        var eventData = {};
        eventData.is_published = req.body.is_published;
        eventData.publish_date = Date.now();

        var criteria = {
            all: true,
            last_location: {
                '$near': [event.location[0], event.location[0]],
                '$maxDistance': 100
            }
        };

        UsersService.getList(criteria, function(error, users){
            if(error){
                return res.jsonError(users);
            }

            _.forEach(users, function(user){
                user.notification = {
                    eventId: req.params['id']
                };

                user.save();
            });
        });

        EventsService.updateEvent(req.params['id'], eventData, function(error, event){
            if(error){
                return res.jsonError(event);
            }
        });

        return res.jsonResponse('success');
    });
};