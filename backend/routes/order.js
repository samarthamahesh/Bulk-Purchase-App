const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const productStatus = require('../config/productStatus');
const orderStatus = require('../config/orderStatus');

router.post('/', (req, res) => {
    const newOrder = new Order(req.body);
    newOrder.save()
    .then(result => {
        Product.updateOne(
            {_id: newOrder.product._id},
            {
                $inc: {
                    bundle_quantity: -newOrder.quantity
                }
            }
        )
        .exec(function(err, ret) {
            Product.updateOne(
                {_id: newOrder.product._id, bundle_quantity: 0},
                {
                    $set: {
                        status: productStatus.DISPATCH_READY
                    }
                }
            )
            .exec(function(err, ret) {
                Order.updateMany(
                    {'product._id': newOrder.product._id},
                    {
                        $inc: {
                            'product.bundle_quantity': -newOrder.quantity
                        }
                    }
                )
                .exec(function(err, ret) {
                    Order.updateMany(
                        {'product._id': newOrder.product._id, 'product.bundle_quantity': 0},
                        {
                            $set: {
                                status: orderStatus.PLACED
                            }
                        }
                    )
                    .exec(function(err, ret) {
                        console.log(ret)
                    })
                })
            })
        })
    })
    .then(result => {
        res.json({
            msg: "Order placed successfully",
            order: {
                id: newOrder.id,
                product: newOrder.product,
                customer: newOrder.customer,
                quantity: newOrder.quantity,
                date: newOrder.date,
                status: newOrder.status
            }
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/list', (req, res) => {
    Order
        .find({'customer._id': req.body._id})
        .then(result => {
            res.json({
                orders: result
            });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/checkRating/:pr_id/:cust_id', (req, res) => {
    Order
        .find({'product._id': req.params.pr_id, 'customer._id': req.params.cust_id})
        .then(result => {
            return result[0].vendor_rating
        })
})

router.post('/updateVendorRating', (req, res) => {
    const order_id = req.body.order_id;
    const vendor_id = req.body.vendor_id;
    const rating = req.body.rating;

    Order
        .updateOne({_id: order_id},
            {
                $set: {
                    vendor_rating: true
                }
            }
        )
        .exec(function (err, ret) {
            User
                .updateOne({_id: vendor_id},
                    {
                        $inc: {
                            rating_sum: rating,
                            total_ratings: 1
                        }
                    }
                )
                .exec(function (err, ret) {
                    Product
                        .updateMany({'vendor._id': vendor_id},
                            {
                                $inc: {
                                    'vendor.rating_sum': rating,
                                    'vendor.total_ratings': 1
                                }
                            }
                        )
                        .exec(function(err, ret) {
                            Order
                                .updateMany({'product.vendor._id': vendor_id},
                                    {
                                        $inc: {
                                            'product.vendor.rating_sum': rating,
                                            'product.vendor.total_ratings': 1
                                        }
                                    }
                                )
                                .exec(function(err, ret) {
                                    console.log(ret);
                                })
                        })
                })
        })
})

router.post('/submitreview', (req, res) => {
    console.log(req.body)
    Order.update({_id: req.body.order_id},
            {
                $push: {
                    'product.reviews': req.body.review
                }
            }
        )
        .exec(function (err, ret) {
            Order.find({_id: req.body.order_id})
                .exec(function(err1, ret1) {
                    Product.update({_id: ret1[0].product._id},
                            {
                                $push: {
                                    reviews: req.body.review
                                }
                            }
                        )
                        .exec(function(err, ret) {
                            console.log(ret)
                        })
                })
        })
})

router.post('/edit', (req, res) => {
    const order = req.body.order;
    const diff = req.body.diff;
    console.log(order)

    Order.updateMany({_id: order._id},
            {
                $inc: {
                    quantity: diff,
                }
            }
        )
        .exec(function(err, ret) {
            Order.updateMany({'product._id': order.product._id},
                {
                    $inc: {
                        'product.bundle_quantity': -diff
                    }
                }
            )
            .exec(function (err, ret) {
                Product.updateMany({_id: order.product._id},
                        {
                            $inc: {
                                bundle_quantity: -diff
                            }
                        }
                    )
                    .exec(function (err, ret) {
                        Product.updateMany({_id: order.product._id, bundle_quantity: 0},
                                {
                                    $set: {
                                        status: productStatus.DISPATCH_READY
                                    }
                                }
                            )
                            .exec(function (err, ret) {
                                Order.updateMany({'product._id': order.product._id, 'product.bundle_quantity': 0},
                                    {
                                        $set: {
                                            'product.status': productStatus.DISPATCH_READY,
                                            status: orderStatus.PLACED
                                        }
                                    }
                                )
                                .exec(function (err, ret) {
                                    res.json({
                                        'success': true
                                    })
                                })
                            })
                    })
            })
        })
})

module.exports = router