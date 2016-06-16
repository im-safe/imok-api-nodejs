/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Friend = require('./Friend');
var Device = require('./Device');

// User Schema
var User = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    country_code: { type: String, required: true },
    phone_number: { type: String, required: true },
    last_location: {
        type: [Number], index: Schema.indexTypes['2d']
    },
    friends: { type: [Friend] },
    devices: { type: Device },
    is_active: { type: Boolean },
    confirm_code: { type: String },
    is_confirmed: { type: Boolean },
    created_date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', User);