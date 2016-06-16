/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shortid = require('shortid');

var Friend = require('./Friend').schema;
var Device = require('./Device').schema;

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
    device: { type: Device },
    is_active: { type: Boolean },
    confirm_code: { type: String, default: shortid.generate },
    is_confirmed: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now }
});


module.exports = {
    schema: User,
    model: mongoose.model('User', User)
};