const express = require('express');
const User = require('../models/user');
const auth_middleware = require('../middleware/auth_middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router()

router.post('/register', (req, res) => {
    const { name, email, password, isVendor } = req.body;
    if(!name || !email || !password || isVendor == null) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    User
        .findOne({ email })
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
                    res.json({
                        msg: "User registered successfully",
                        user: {
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                            isVendor: newUser.isVendor
                        }
                    });
                });
            });
        })
        .catch(err => {
            console.log(err)
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    User
        .findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(400).json({ msg: "User not registered" });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) {
                        return res.status(400).json({ msg: "Invalid credetials" });
                    }

                    const payload = {
                        id: user.id,
                        name: user.name
                    };

                    jwt.sign(
                        payload,
                        'thisissecret',
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    );
                });
        })
        .catch(err => {
            console.log(err);
        })
});

router.get('/user', auth_middleware, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;