/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    country_code: { type: String },
    phone_number: { type: String },
    last_location: {
        type: [Number], index: '2d'
    },
    friends: { type: String },
    devices: { type: String },
    is_active: { type: Boolean },
    confirm_code: { type: String },
    is_confirmed: { type: Boolean },
    created_date: { type: Date, default: Date.now }
});


mongoose.model('User', User);