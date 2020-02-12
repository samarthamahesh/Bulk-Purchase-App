const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/user');

router.post('/', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(400).json({ msg: "User not registered" });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) {
                        return res.status(400).json({ msg: "Invalid credetials" });
                    }

                    res.json({
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                });
        });
});

module.exports = router;