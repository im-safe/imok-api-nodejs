'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventLog = new Schema({
    user_id: { type: Schema.Types.ObjectId, index: true},
    log_type: { type: String, index: true },
    created_date: { type: Date, default: Date.now }
});

module.exports = {
    schema: EventLog,
    model: mongoose.model('EventLog', EventLog)
};