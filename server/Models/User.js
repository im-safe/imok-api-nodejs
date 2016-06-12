/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Friend = require('./Friend');

// User Schema
var User = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    country_code: { type: String },
    phone_number: { type: String },
    last_location: {
        type: [Number], index: Schema.indexTypes['2d']
    },
    friends: { type: [Friend] },
    devices: {
        deviceId: { type: String, required: true },
        platform_type: { type: String, required: true },
        token: { type: String, required: true },
        created_date: { type: Date, default: Date.now }
    },
    is_active: { type: Boolean },
    confirm_code: { type: String },
    is_confirmed: { type: Boolean },
    created_date: { type: Date, default: Date.now }
});


mongoose.model('User', User);