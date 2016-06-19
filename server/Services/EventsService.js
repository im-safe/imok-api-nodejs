'use strict';

var Event = require('../Models/Event').model;

/**
 * Get list of events
 *
 * @param criteria
 * @param callback
 */
function getList(criteria, callback)
{
    var per_page = 20;
    var offset = 0;
    var page = 1;

    if(criteria.page && criteria.page > 0)
    {
        page = parseInt(criteria.page);
        delete criteria.page;
    }

    offset = (page - 1) * per_page;

    // TODO Check limit
    Event.find(criteria, {}, { skip: offset, limit: per_page },function(err, events){
        if(err){
            return callback(true, 'Error while getting list of events');
        }

        return callback(false, events);
    });
}


/**
 * Get event by ID
 *
 * @param eventId
 * @param callback
 */
function getEventById(eventId, callback)
{
    Event.findById(eventId, function(err, event){
        if(err){ return callback(true, 'Error while getting event info'); }

        if(!event) { return callback(true, 'Event not found'); }

        return callback(false, event);
    });
}

module.exports = {
    getList: getList,
    getEventById: getEventById
};