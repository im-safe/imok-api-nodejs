var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Notification Schema
var Notification = new Schema({
    eventId: { type: Schema.Types.ObjectId },
    created_date: { type: Date, default: Date.now }
});


module.exports = {
    schema: Notification,
    model: mongoose.model('Notification', Notification)
};