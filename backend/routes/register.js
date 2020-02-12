const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/user');

router.post('/', (req, res) => {
    const { name, email, password, isVendor } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    User.findOne({ email })
        .then(user => {
            if(user) {
                return res.status(400).json({ msg: "User already registered"});
            }

            const newUser = new User({
                name,
                email,
                password,
                isVendor
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) {
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save();
                });
            });
        });
});

module.exports = router;