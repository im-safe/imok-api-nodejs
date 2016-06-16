/**
 * Created by saleh on 6/12/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Friend Schema
var Friend = new Schema({
    user_id: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now }
});

module.exports  = {
    schema: Friend,
    model: mongoose.model('Friend', Friend)
};