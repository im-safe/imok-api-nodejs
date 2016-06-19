'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventLog = require('./EventLog').schema;

var Event = new Schema({
    description: { type: String },
    is_published: { type: Boolean },
    publish_date: { type: Date },
    is_active: { type: Boolean, default: true },
    location: {
        type: [Number], index: Schema.indexTypes['2d']
    },
    log: { type: [EventLog] },
    source: { type: String, default: 'sys' },
    created_date: { type: Date, default: Date.now }
});

module.exports = {
    schema: Event,
    model: mongoose.model('Event', Event)
};