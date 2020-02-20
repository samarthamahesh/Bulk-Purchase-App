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
    },
    rating_sum: {
        type: Number,
        required: false,
        default: 0
    },
    total_ratings: {
        type: Number,
        required: false,
        default: 0
    },
    reviews: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('user', User);