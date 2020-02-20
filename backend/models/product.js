const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productStatus = require('../config/productStatus');

var Product = new Schema({
    product_name: {
        type: String,
        required: true
    },
    bundle_price: {
        type: Number,
        required: true
    },
    bundle_quantity: {
        type: Number,
        required: true
    },
    vendor: {
        type: Object,
        required: true
    },
    status: {
        type: Number,
        default: productStatus.WAITING
    },
    rating_sum: {
        type: Number,
        required: false
    },
    total_ratings: {
        type: Number,
        required: false
    },
    reviews: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model('product', Product);