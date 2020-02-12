const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    isVendor: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('user', User);