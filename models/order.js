const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderStatus = require('../config/orderStatus');

var Order = new Schema({
    product: {
        type: Object,
        required: true
    },
    customer: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: orderStatus.WAITING
    },
    vendor_rating: {
        type: Boolean,
        default: false
    },
    product_rating: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('order', Order);