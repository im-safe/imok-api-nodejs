/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Admin Schema
var Admin = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    password: { type: String }
});


module.exports = {
    schema: Admin,
    model: mongoose.model('Admin', Admin)
};