/**
 * Created by saleh on 6/15/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Device = new Schema({
    deviceId: { type: String, required: true },
    platform_type: { type: String, required: true },
    token: { type: String, required: true },
    created_date: { type: Date, default: Date.now }
});

module.exports = Device;