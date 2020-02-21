const express = require('express');
const router = express.Router();

const auth_middleware = require('../middleware/auth_middleware')
const Product = require('../models/product');
const Order = require('../models/order');
const productStatus = require('../config/productStatus');
const orderStatus = require('../config/orderStatus');

router.post('/add', (req, res) => {
    const { product_name, bundle_price, bundle_quantity, vendor } = req.body;

    if(!product_name || !bundle_price || !bundle_quantity || !vendor) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newProduct = new Product({
        product_name,
        bundle_price,
        bundle_quantity,
        vendor
    });

    newProduct
        .save()
        .then(() => {
            res.json({
                msg: "Product added successfully",
                product: {
                    id: newProduct._id,
                    product_name: newProduct.product_name,
                    bundle_price: newProduct.bundle_price,
                    bundle_quantity: newProduct.bundle_quantity,
                    vendor: newProduct.vendor,
                    status: newProduct.status
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
    ;
});

router.post('/dispatch', (req, res) => {
    var product = req.body.product;
    var status = req.body.status;

    Product
        .updateOne(
            {_id: product._id},
            {   
                $set : {
                    status: status
                }
            }
        )
        .exec(
            function updateOrder(err, result1) {
                Product.find({_id: product._id})
                    .exec(function(err, pr) {
                        if(pr[0].status == productStatus.DISPATCH_READY) {
                            Order.updateMany(
                                {'product._id': String(pr[0]._id)},
                                {
                                    $set: {
                                        status: orderStatus.PLACED,
                                        'product.status': status
                                    }
                                }
                            ).exec(function(err, ret) {
                                console.log(ret)
                            })
                        } else if(pr[0].status == productStatus.DISPATCHED) {
                            Order.updateMany(
                                {'product._id': String(pr[0]._id)},
                                {
                                    $set: {
                                        status: orderStatus.DISPATCHED,
                                        'product.status': status
                                    }
                                }
                            ).exec(function(err, ret) {
                                console.log(ret)
                            })
                        } else if(pr[0].status == productStatus.DELETED) {
                            Order.updateMany(
                                {'product._id': String(pr[0]._id)},
                                {
                                    $set: {
                                        status: orderStatus.CANCELLED,
                                        'product.status': status
                                    }
                                }
                            ).exec(function(err, ret) {
                                console.log(ret)
                            })
                        }
                    })
            }
        )
})

router.get('/search/:field/:search_string/:productStatus', (req, res) => {
    var query = {}
    query[req.params.field] = req.params.search_string;
    query['status'] = req.params.productStatus;

    Product
        .find(query)
        .then(result => {
            res.json({
                product_status: req.params.productStatus,
                search_products: result,
            });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/unordered', (req, res) => {
    var product_name = req.body.product_name;
    var user = req.body.user;

    Order.find({customer: user})
        .select('product._id')
        .exec(function (err, pr) {
            var arr = []
            for(var i=0;i<pr.length;i++) {
                arr.push(pr[i].product._id);
            }
            Product.find({
                product_name: product_name,
                _id : {
                    $nin: arr
                },
                bundle_quantity: {
                    $gt: 0
                },
                status: productStatus.WAITING
            })
            .then(result => {
                res.json({
                    search_products: result
                })
            })
        })
})

router.post('/edit', (req, res) => {
    var diff = 0;
    Order.update(
        {_id: req.body.order_id},
        {
            $inc: {
                quantity: req.body.diff,
                'product.bundle_quantity': -req.body.diff
            }
        }
    )
    .exec(function (err, ret) {
        Order.find(
            {_id: req.body.order_id}
        )
        .exec(function(err, ret) {
            Product.update(
                {_id: ret[0].product._id},
                {
                    $inc: {
                        bundle_quantity: -req.body.diff
                    }
                }
            )
        })
    })
})

router.get('/reviews/:id', (req, res) => {
    const id = req.params.id;
    Product.find({_id: id})
        .select('reviews')
        .then(result => {
            res.json({
                reviews: result[0].reviews
            })
        })
})

router.get('/vendorReviews/:id', (req, res) => {
    const vendor_id = req.params.id;
    Product.find({'vendor._id': vendor_id}, 'product_name reviews rating_sum total_ratings')
        .then(result => {
            res.json({
                reviews: result
            })
        })
})

module.exports = router