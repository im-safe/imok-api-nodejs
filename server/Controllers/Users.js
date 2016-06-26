/**
 * Created by saleh on 6/26/16.
 */

'use strict';

var EventsService = require('../Services/EventsService');

exports.alarmResponse = function (req, res, next){
    req.checkBody({
        eventId: { isMongoId: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    EventsService.getEventById(req.body.eventId, function(error, event){
        if(error){
            return res.jsonError(event);
        }

        if(!event.is_published) {
            return res.jsonError('Not published event');
        }

        if(!event.is_active) {
            return res.jsonError('Not active event');
        }
    });
};

