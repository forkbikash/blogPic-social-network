const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const { SENDGRID_API, EMAIL } = require('../config/keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = mongoose.model('User');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}));

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please add all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: 'user already exists with that email' });
            }
            bcrypt.hash(password, 12).then((hashedPassword) => {
                const user = new User({ email, name, password: hashedPassword, pic });
                user.save().then(user => {
                    transporter.sendMail({
                        to: user.email,
                        from: '',//from email id
                        subject: 'signup success',
                        html: "<h1>welcome to blogPic</h1>"
                    });
                    res.json({ message: 'user saved successfully' });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please provide email or password" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: 'user does not exist' });
            }
            bcrypt.compare(password, savedUser.password).then((doMatch) => {
                if (doMatch) {
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                    const { _id, name, email, followers, following, pic } = savedUser;
                    res.json({ token, user: { _id, name, email, followers, following, pic } });
                } else {
                    return res.status(422).json({ error: 'invalid email or password' });
                }
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
});

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    return res.status(422).json({ error: 'user does not exist with that email' });
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000;
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: '',//from email id
                        subject: 'password reset',
                        html: `
                    <p>you requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>`
                    });
                    res.json({ message: 'check your email' });
                })
            }).catch((err) => {
                console.log(err);
            });
    });
});

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    //console.log(sentToken);
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                return res.status(422).json({ error: 'try again session expired' });
            }
            bcrypt.hash(newPassword, 12).then((hashedPassword) => {
                user.password = hashedPassword;
                user.expireToken = undefined;
                user.resetToken = undefined;
                user.save().then(savedUser => {
                    res.json({ message: 'password update success' });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
});

module.exports = router;