/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Friend = require('./Friend').schema;
var Device = require('./Device').schema;
var Notification = require('./Notification').schema;

// User Schema
var User = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    country_code: { type: String, required: true, index: true },
    phone_number: { type: String, required: true, index: true },
    last_location: {
        type: [Number], index: '2d'
    },
    friends: { type: [Friend] },
    device: { type: Device },
    notification: { type: Notification },
    is_active: { type: Boolean },
    confirm_code: { type: String, default: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000 },
    is_confirmed: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now }
});

User.methods.toJson = function(){
    return {
        id : this._id,
        first_name: this.first_name || '',
        last_name: this.last_name || '',
        country_code: this.country_code,
        phone_number: this.phone_number,
        friends: this.friends || [],
        last_location: this.last_location || [],
        device: this.device || {}
    };
};


module.exports = {
    schema: User,
    model: mongoose.model('User', User)
};