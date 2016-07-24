/**
 * Created by saleh on 6/26/16.
 */

'use strict';

var EventsService = require('../Services/EventsService');
var EventLog = require('../Models/EventLog').model;
var Friend = require('../Models/Friend').model;
var UsersService = require('../Services/UsersService');
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var mongoose = require('mongoose');
var _ = require('lodash');

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

        var eventLog = new EventLog();
        eventLog.user_id = req.token.sub;
        eventLog.log_type = 'safe';

        event.log.push(eventLog);

        event.save(function(error){
            if(error){
                return res.jsonError('Error while response alarm');
            }

            return res.jsonResponse('success');
        });
    });
};

exports.updateContactList = function(req, res, next){
    console.log(req.body.contacts);
    req.checkBody({
        contacts: { isJSON: true }
    });

    var errors = req.validationErrors();

    if(errors){
        return res.jsonExpressError(errors);
    }

    var user_id = req.token.sub;

    UsersService.getUserById(user_id, function(error, user){
        if(error){ return res.jsonError('Error while update contacts'); }
        mongoose.connection.db.collection('countries', function(err, collection){
            collection.find({callingCode: user.country_code}).toArray(function(err, data){
                if(err){ return res.jsonError('Error while update contacts'); }
                if(!data){ return res.jsonError('Error while update contacts'); }

                var countryISO2 = data[0].cca2;
                var countryCode = null;
                var phone = null;
                var contacts = JSON.parse(req.body.contacts);
                _.forEach(contacts.numbers, function(item){
                    try{
                        var phoneNumber = phoneUtil.parse(''+item, countryISO2);
                        countryCode = phoneNumber.getCountryCode();
                        phone = phoneNumber.getNationalNumber();

                        UsersService.checkExists(countryCode, phone).then(function(result){
                            if(result !== false){
                                if(_.findIndex(user.friends, {user_id: result._id}) == -1){
                                    var friend = new Friend;
                                     friend.user_id = result._id;
                                     user.friends.push(friend);

                                     user.save();
                                }
                            }
                        });
                    }catch (err){
                        console.error(err.message);
                    }
                });

                return res.jsonResponse('success');
            });
        });
    });
};